#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define PORT 5201

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
        if (send(s, net_nums, sizeof(net_nums), 0) < 0) {
            perror("send");
            break;
        }

        uint32_t net_sum;
        ssize_t r = recv(s, &net_sum, sizeof(net_sum), 0);
        if (r == (ssize_t)sizeof(net_sum)) {
            printf("Server response: %u\n", ntohl(net_sum));
        } else {
            if (r < 0)
                perror("recv");
            else
                printf("Incomplete response.\n");
            break;
        }
    }

    close(s);
    return 0;
}
