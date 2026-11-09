#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#define PORT 5201

int main(int argc, char **argv) {
    if (argc < 2 || argc > 3) {
        fprintf(stderr, "Uso: %s carattere [ritardo_secondi]\n", argv[0]);
        return 1;
    }
    unsigned int delay = argc == 3 ? (unsigned int)atoi(argv[2]) : 0;

    int fd = socket(AF_INET, SOCK_STREAM, 0);
    if (fd < 0) { perror("socket"); return 1; }

    struct sockaddr_in addr = {0};
    addr.sin_family = AF_INET;
    addr.sin_port = htons(PORT);
    if (inet_pton(AF_INET, "127.0.0.1", &addr.sin_addr) != 1) {
        fprintf(stderr, "Indirizzo non valido\n"); close(fd); return 1;
    }
    if (connect(fd, (struct sockaddr *)&addr, sizeof(addr)) < 0) {
        perror("connect"); close(fd); return 1;
    }

    if (delay) sleep(delay);
    if (send(fd, argv[1], 1, 0) != 1) {
        perror("send"); close(fd); return 1;
    }

    char answer;
    ssize_t n = recv(fd, &answer, 1, 0);
    if (n == 1) printf("Risposta: %c\n", answer);
    else if (n == 0) fprintf(stderr, "Connessione chiusa senza risposta\n");
    else perror("recv");

    close(fd);
    return n == 1 ? 0 : 1;
}
