#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <unistd.h>
#include <errno.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define PORT 5201

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
    int s = socket(AF_INET, SOCK_STREAM, 0);
    if (s < 0) {
        perror("socket");
        exit(EXIT_FAILURE);
    }

    struct sockaddr_in srv = {0};
    srv.sin_family = AF_INET;
    srv.sin_port = htons(PORT);
    inet_pton(AF_INET, "127.0.0.1", &srv.sin_addr);

    if (connect(s, (struct sockaddr *)&srv, sizeof(srv)) < 0) {
        perror("connect");
        close(s);
        exit(EXIT_FAILURE);
    }
    printf("Connected to server.\n");

    while (1) {
        unsigned int x, y;
        printf("Enter two numbers (Ctrl+D to exit): ");
        fflush(stdout);
        if (scanf("%u %u", &x, &y) != 2)
            break;

        uint32_t net_nums[2];
        net_nums[0] = htonl((uint32_t)x);
        net_nums[1] = htonl((uint32_t)y);

        ssize_t w = send_all(s, net_nums, sizeof(net_nums));
        if (w != (ssize_t)sizeof(net_nums)) {
            if (w < 0)
                perror("send_all");
            else
                printf("Incomplete send.\n");
            break;
        }

        uint32_t net_sum;
        ssize_t r = recv_all(s, &net_sum, sizeof(net_sum));
        if (r == (ssize_t)sizeof(net_sum)) {
            printf("Server response: %u\n", ntohl(net_sum));
        } else {
            if (r < 0)
                perror("recv_all");
            else
                printf("Connection closed or incomplete reply.\n");
            break;
        }
    }

    close(s);
    return 0;
}
