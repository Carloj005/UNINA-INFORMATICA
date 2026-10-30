#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <unistd.h>
#include <signal.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define PORT 5201

static int s = -1;

void handler(int sig) {
    (void)sig;
    if (s >= 0)
        shutdown(s, SHUT_RDWR);
}

int main(void) {
    signal(SIGINT, handler);

    s = socket(AF_INET, SOCK_STREAM, 0);
    if (s < 0) {
        perror("socket");
        exit(EXIT_FAILURE);
    }

    int opt = 1;
    if (setsockopt(s, SOL_SOCKET, SO_REUSEADDR,
                   &opt, sizeof(opt)) < 0) {
        perror("setsockopt");
        close(s);
        exit(EXIT_FAILURE);
    }

    struct sockaddr_in addr = {0};
    addr.sin_family = AF_INET;
    addr.sin_port = htons(PORT);
    addr.sin_addr.s_addr = htonl(INADDR_ANY);

    if (bind(s, (struct sockaddr *)&addr, sizeof(addr)) < 0) {
        perror("bind");
        close(s);
        exit(EXIT_FAILURE);
    }
    if (listen(s, 1) < 0) {
        perror("listen");
        close(s);
        exit(EXIT_FAILURE);
    }

    printf("[server] Listening on port %d (Ctrl+C to exit)\n", PORT);

    while (1) {
        int c = accept(s, NULL, NULL);
        if (c < 0)
            break;

        uint32_t net_x;
        ssize_t r = recv(c, &net_x, sizeof(net_x), 0);
        if (r == (ssize_t)sizeof(net_x)) {
            uint32_t x = ntohl(net_x);
            uint32_t next = x + 1;
            uint32_t net_next = htonl(next);
            printf("[server] Received: %u\n", x);
            if (send(c, &net_next, sizeof(net_next), 0) < 0)
                perror("send");
        } else if (r < 0) {
            perror("recv");
        }

        close(c);
    }

    close(s);
    return 0;
}
