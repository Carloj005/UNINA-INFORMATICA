#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <unistd.h>
#include <errno.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <signal.h>

#define PORT 5201

static int s = -1;

void handler(int sig) {
    (void)sig;
    if (s >= 0)
        shutdown(s, SHUT_RDWR);
}

// Receive exactly n bytes unless EOF or error
ssize_t recv_all(int fd, void *buf, size_t n) {
    size_t received = 0;
    char *p = buf;
    while (received < n) {
        ssize_t r = recv(fd, p + received, n - received, 0);
        if (r < 0) {
            if (errno == EINTR)
                continue;
            return -1;
        }
        if (r == 0)
            return (ssize_t)received;
        received += (size_t)r;
    }
    return (ssize_t)received;
}

// Send exactly n bytes unless error
ssize_t send_all(int fd, const void *buf, size_t n) {
    size_t sent = 0;
    const char *p = buf;
    while (sent < n) {
        ssize_t w = send(fd, p + sent, n - sent, 0);
        if (w < 0) {
            if (errno == EINTR)
                continue;
            return -1;
        }
        if (w == 0)
            return (ssize_t)sent;
        sent += (size_t)w;
    }
    return (ssize_t)sent;
}

int main(void) {
    signal(SIGINT, handler);
    signal(SIGPIPE, SIG_IGN);

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
            ssize_t r = recv_all(c, net_nums, sizeof(net_nums));
            if (r == 0)
                break;
            if (r < 0) {
                perror("recv_all");
                break;
            }
            if ((size_t)r != sizeof(net_nums)) {
                printf("[server] Incomplete message.\n");
                break;
            }

            uint32_t x = ntohl(net_nums[0]);
            uint32_t y = ntohl(net_nums[1]);
            uint32_t sum = x + y;
            printf("[server] %u + %u = %u\n", x, y, sum);

            uint32_t net_sum = htonl(sum);
            ssize_t w = send_all(c, &net_sum, sizeof(net_sum));
            if (w != (ssize_t)sizeof(net_sum)) {
                if (w < 0)
                    perror("send_all");
                else
                    printf("[server] Incomplete send.\n");
                break;
            }
        }

        close(c);
        printf("[server] Client disconnected.\n");
    }

    close(s);
    return 0;
}
