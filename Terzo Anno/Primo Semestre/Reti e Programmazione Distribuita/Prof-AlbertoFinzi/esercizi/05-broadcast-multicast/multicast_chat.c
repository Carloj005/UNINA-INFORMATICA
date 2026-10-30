/*
 * UDP IPv4 multicast group chat with select().
 * Usage: ./multicast_chat [multicast-group] [port]
 * Type /quit to exit. Run multiple copies in different terminals.
 */

#ifndef _DEFAULT_SOURCE
#define _DEFAULT_SOURCE  // Expose struct ip_mreq on glibc-based systems.
#endif

#include <arpa/inet.h>
#include <errno.h>
#include <netinet/in.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/select.h>
#include <sys/socket.h>
#include <unistd.h>

#define DEFAULT_GROUP "239.255.0.1"
#define DEFAULT_PORT 5000
#define BUFFER_SIZE 1024

static int parse_port(const char *text) {
    char *end;
    long value;

    errno = 0;
    value = strtol(text, &end, 10);
    if (errno != 0 || *text == '\0' || *end != '\0' || value < 1 || value > 65535) {
        return -1;
    }
    return (int)value;
}

int main(int argc, char *argv[]) {
    if (argc > 3) {
        fprintf(stderr, "Usage: %s [multicast-group] [port]\n", argv[0]);
        return EXIT_FAILURE;
    }

    const char *group = (argc >= 2) ? argv[1] : DEFAULT_GROUP;
    int port = (argc == 3) ? parse_port(argv[2]) : DEFAULT_PORT;
    if (port < 0) {
        fprintf(stderr, "Invalid port (must be 1..65535).\n");
        return EXIT_FAILURE;
    }

    struct ip_mreq membership = {0};
    if (inet_pton(AF_INET, group, &membership.imr_multiaddr) != 1 ||
        !IN_MULTICAST(ntohl(membership.imr_multiaddr.s_addr))) {
        fprintf(stderr, "Invalid IPv4 multicast group address: %s\n", group);
        return EXIT_FAILURE;
    }
    membership.imr_interface.s_addr = htonl(INADDR_ANY);  // OS chooses local interface.

    int sock = socket(AF_INET, SOCK_DGRAM, 0);
    if (sock < 0) {
        perror("socket");
        return EXIT_FAILURE;
    }

    // Allow multiple multicast chat instances to bind the same UDP port.
    int enabled = 1;
    if (setsockopt(sock, SOL_SOCKET, SO_REUSEADDR,
                   &enabled, sizeof(enabled)) < 0) {
        perror("setsockopt(SO_REUSEADDR)");
        close(sock);
        return EXIT_FAILURE;
    }
#ifdef SO_REUSEPORT
    // Useful for running several copies on the same machine (e.g., macOS).
    if (setsockopt(sock, SOL_SOCKET, SO_REUSEPORT,
                   &enabled, sizeof(enabled)) < 0) {
        perror("setsockopt(SO_REUSEPORT)");
        close(sock);
        return EXIT_FAILURE;
    }
#endif

    struct sockaddr_in local = {0};
    local.sin_family = AF_INET;
    local.sin_port = htons((unsigned short)port);
    local.sin_addr.s_addr = htonl(INADDR_ANY);  // Bind to 0.0.0.0:PORT.
    if (bind(sock, (struct sockaddr *)&local, sizeof(local)) < 0) {
        perror("bind");
        close(sock);
        return EXIT_FAILURE;
    }

    // Request IPv4 multicast group membership (a network-layer socket option).
    if (setsockopt(sock, IPPROTO_IP, IP_ADD_MEMBERSHIP,
                   &membership, sizeof(membership)) < 0) {
        perror("setsockopt(IP_ADD_MEMBERSHIP)");
        close(sock);
        return EXIT_FAILURE;
    }

    unsigned char ttl = 1;  // Keep outgoing multicast traffic on the local subnet.
    if (setsockopt(sock, IPPROTO_IP, IP_MULTICAST_TTL,
                   &ttl, sizeof(ttl)) < 0) {
        perror("setsockopt(IP_MULTICAST_TTL)");
        close(sock);
        return EXIT_FAILURE;
    }

    unsigned char loop = 1;  // Allow local receivers to see our own datagrams.
    if (setsockopt(sock, IPPROTO_IP, IP_MULTICAST_LOOP,
                   &loop, sizeof(loop)) < 0) {
        perror("setsockopt(IP_MULTICAST_LOOP)");
        close(sock);
        return EXIT_FAILURE;
    }

    struct sockaddr_in destination = {0};
    destination.sin_family = AF_INET;
    destination.sin_port = htons((unsigned short)port);
    destination.sin_addr = membership.imr_multiaddr;

    printf("Multicast chat: %s:%d\n", group, port);
    printf("Type a message and press Enter (/quit to exit).\n");
    fflush(stdout);

    int exit_code = EXIT_SUCCESS;
    for (;;) {
        // select() modifies rfds, so rebuild the set on each iteration.
        fd_set rfds;
        FD_ZERO(&rfds);
        FD_SET(STDIN_FILENO, &rfds);  // User typed something.
        FD_SET(sock, &rfds);          // A UDP datagram arrived.
        int nfds = (sock > STDIN_FILENO ? sock : STDIN_FILENO) + 1;

        int ready = select(nfds, &rfds, NULL, NULL, NULL);
        if (ready < 0) {
            if (errno == EINTR) continue;
            perror("select");
            exit_code = EXIT_FAILURE;
            break;
        }

        if (FD_ISSET(STDIN_FILENO, &rfds)) {
            char buffer[BUFFER_SIZE];
            if (fgets(buffer, sizeof(buffer), stdin) == NULL) {
                // End-of-file (Ctrl+D on Linux/macOS): exit the chat.
                break;
            }
            size_t len = strlen(buffer);
            if (len > 0 && buffer[len - 1] == '\n') {
                buffer[--len] = '\0';
            }
            if (strcmp(buffer, "/quit") == 0) break;
            if (len > 0) {
                if (sendto(sock, buffer, len, 0,
                           (struct sockaddr *)&destination,
                           sizeof(destination)) < 0) {
                    perror("sendto");
                    exit_code = EXIT_FAILURE;
                    break;
                }
            }
        }

        if (FD_ISSET(sock, &rfds)) {
            char buffer[BUFFER_SIZE];
            struct sockaddr_in source = {0};
            socklen_t source_len = sizeof(source);
            ssize_t n = recvfrom(sock, buffer, sizeof(buffer) - 1, 0,
                                 (struct sockaddr *)&source, &source_len);
            if (n < 0) {
                if (errno == EINTR) continue;
                perror("recvfrom");
                exit_code = EXIT_FAILURE;
                break;
            }
            buffer[n] = '\0';

            char source_ip[INET_ADDRSTRLEN];
            if (inet_ntop(AF_INET, &source.sin_addr,
                          source_ip, sizeof(source_ip)) == NULL) {
                perror("inet_ntop");
                exit_code = EXIT_FAILURE;
                break;
            }
            // The source address is the SENDER's IP, not the group IP.
            printf("[%s:%u] %s\n", source_ip,
                   (unsigned)ntohs(source.sin_port), buffer);
            fflush(stdout);
        }
    }

    // Closing the socket also releases its multicast memberships.
    close(sock);
    return exit_code;
}
