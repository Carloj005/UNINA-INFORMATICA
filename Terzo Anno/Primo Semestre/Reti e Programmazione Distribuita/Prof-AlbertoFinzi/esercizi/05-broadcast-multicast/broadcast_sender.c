/*
 * UDP IPv4 broadcast sender.
 * Usage: ./broadcast_sender "message" [broadcast-address] [port]
 */

#include <arpa/inet.h>
#include <errno.h>
#include <netinet/in.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <unistd.h>

#define DEFAULT_BROADCAST "255.255.255.255"
#define DEFAULT_PORT 5001

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
    if (argc < 2 || argc > 4) {
        fprintf(stderr, "Usage: %s \"message\" [broadcast-address] [port]\n", argv[0]);
        return EXIT_FAILURE;
    }

    const char *message = argv[1];
    const char *address = (argc >= 3) ? argv[2] : DEFAULT_BROADCAST;
    int port = (argc == 4) ? parse_port(argv[3]) : DEFAULT_PORT;
    if (port < 0) {
        fprintf(stderr, "Invalid port (must be 1..65535).\n");
        return EXIT_FAILURE;
    }

    int sock = socket(AF_INET, SOCK_DGRAM, 0);  // IPv4 UDP socket
    if (sock < 0) {
        perror("socket");
        return EXIT_FAILURE;
    }

    // Allow sending to an IPv4 broadcast address.
    int enabled = 1;
    if (setsockopt(sock, SOL_SOCKET, SO_BROADCAST,
                   &enabled, sizeof(enabled)) < 0) {
        perror("setsockopt(SO_BROADCAST)");
        close(sock);
        return EXIT_FAILURE;
    }

    struct sockaddr_in destination = {0};
    destination.sin_family = AF_INET;
    destination.sin_port = htons((unsigned short)port);
    if (inet_pton(AF_INET, address, &destination.sin_addr) != 1) {
        fprintf(stderr, "Invalid IPv4 broadcast address: %s\n", address);
        close(sock);
        return EXIT_FAILURE;
    }

    // Send one UDP datagram (no connection or individual receiver addresses).
    ssize_t sent = sendto(sock, message, strlen(message), 0,
                          (struct sockaddr *)&destination, sizeof(destination));
    if (sent < 0) {
        perror("sendto");
        close(sock);
        return EXIT_FAILURE;
    }

    printf("Sent %zd bytes to %s:%d (broadcast)\n", sent, address, port);
    close(sock);
    return EXIT_SUCCESS;
}
