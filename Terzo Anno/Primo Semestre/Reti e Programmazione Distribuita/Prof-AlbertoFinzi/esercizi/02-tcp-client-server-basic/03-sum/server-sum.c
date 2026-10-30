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

    printf("[server] Listening on port %d\n", PORT);

    while (1) {
        int c = accept(s, NULL, NULL);
        if (c < 0)
            break;
        printf("[server] Client connected.\n");

        while (1) {
            uint32_t net_nums[2];
            ssize_t r = recv(c, net_nums, sizeof(net_nums), 0);
            if (r != (ssize_t)sizeof(net_nums))
                break;

            uint32_t x = ntohl(net_nums[0]);
            uint32_t y = ntohl(net_nums[1]);
            uint32_t sum = x + y;
            printf("[server] %u + %u = %u\n", x, y, sum);

            uint32_t net_sum = htonl(sum);
            if (send(c, &net_sum, sizeof(net_sum), 0) < 0) {
                perror("send");
                break;
            }
        }

        close(c);
        printf("[server] Client disconnected.\n");
    }

    close(s);
    return 0;
}
