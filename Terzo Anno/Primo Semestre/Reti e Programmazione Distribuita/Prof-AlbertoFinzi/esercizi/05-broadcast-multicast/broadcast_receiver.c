/*
 * UDP IPv4 broadcast receiver.
 * Usage: ./broadcast_receiver [port]
 */

#include <arpa/inet.h>
#include <errno.h>
#include <netinet/in.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/socket.h>
#include <unistd.h>

#define DEFAULT_PORT 5001
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
    if (argc > 2) {
        fprintf(stderr, "Usage: %s [port]\n", argv[0]);
        return EXIT_FAILURE;
    }

    int port = (argc == 2) ? parse_port(argv[1]) : DEFAULT_PORT;
    if (port < 0) {
        fprintf(stderr, "Invalid port (must be 1..65535).\n");
        return EXIT_FAILURE;
    }

    int sock = socket(AF_INET, SOCK_DGRAM, 0);
    if (sock < 0) {
        perror("socket");
        return EXIT_FAILURE;
    }

    int enabled = 1;
    if (setsockopt(sock, SOL_SOCKET, SO_REUSEADDR,
                   &enabled, sizeof(enabled)) < 0) {
        perror("setsockopt(SO_REUSEADDR)");
        close(sock);
        return EXIT_FAILURE;
    }

    struct sockaddr_in local = {0};
    local.sin_family = AF_INET;
    local.sin_port = htons((unsigned short)port);
    local.sin_addr.s_addr = htonl(INADDR_ANY);  // 0.0.0.0:PORT
    if (bind(sock, (struct sockaddr *)&local, sizeof(local)) < 0) {
        perror("bind");
        close(sock);
        return EXIT_FAILURE;
    }

    printf("Listening for UDP broadcast on 0.0.0.0:%d (Ctrl+C to stop)\n", port);
    fflush(stdout);

    for (;;) {
        char buffer[BUFFER_SIZE];
        struct sockaddr_in source = {0};
        socklen_t source_len = sizeof(source);
        ssize_t n = recvfrom(sock, buffer, sizeof(buffer) - 1, 0,
                             (struct sockaddr *)&source, &source_len);
        if (n < 0) {
            if (errno == EINTR) continue;
            perror("recvfrom");
            close(sock);
            return EXIT_FAILURE;
        }
        buffer[n] = '\0';  // Treat example datagrams as text.

        char source_ip[INET_ADDRSTRLEN];
        if (inet_ntop(AF_INET, &source.sin_addr,
                      source_ip, sizeof(source_ip)) == NULL) {
            perror("inet_ntop");
            close(sock);
            return EXIT_FAILURE;
        }
        printf("[%s:%u] %s\n", source_ip, (unsigned)ntohs(source.sin_port), buffer);
        fflush(stdout);
    }
}
