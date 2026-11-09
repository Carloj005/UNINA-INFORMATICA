#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <sys/time.h>

#define PORT 5002

int main(int argc, char **argv) {
    if (argc != 2) {
        fprintf(stderr, "Uso: %s numero (0..1000)\n", argv[0]);
        return 1;
    }
    char *end;
    unsigned long number = strtoul(argv[1], &end, 10);
    if (*argv[1] == '\0' || *end != '\0' || number > 1000) {
        fprintf(stderr, "Numero non valido (0..1000)\n");
        return 1;
    }

    int fd = socket(AF_INET, SOCK_DGRAM, 0);
    if (fd < 0) { perror("socket"); return 1; }

    struct timeval tv = {3, 0};
    setsockopt(fd, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof(tv));

    struct sockaddr_in server = {0};
    server.sin_family = AF_INET;
    server.sin_port = htons(PORT);
    if (inet_pton(AF_INET, "127.0.0.1", &server.sin_addr) != 1) {
        fprintf(stderr, "Indirizzo non valido\n"); close(fd); return 1;
    }

    uint32_t request = htonl((uint32_t)number);
    ssize_t n = sendto(fd, &request, sizeof(request), 0,
                       (struct sockaddr *)&server, sizeof(server));
    if (n != (ssize_t)sizeof(request)) {
        perror("sendto"); close(fd); return 1;
    }

    uint32_t reply;
    n = recvfrom(fd, &reply, sizeof(reply), 0, NULL, NULL);
    if (n != (ssize_t)sizeof(reply)) {
        if (n < 0) perror("recvfrom");
        else fprintf(stderr, "Risposta non valida\n");
        close(fd); return 1;
    }
    printf("Risultato: %u\n", ntohl(reply));
    close(fd);
    return 0;
}
