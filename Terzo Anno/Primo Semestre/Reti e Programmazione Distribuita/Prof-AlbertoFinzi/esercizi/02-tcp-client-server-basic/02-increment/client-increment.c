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

    unsigned int x;
    printf("Enter a number: ");
    fflush(stdout);
    if (scanf("%u", &x) != 1) {
        printf("Invalid input.\n");
        close(s);
        return 1;
    }

    uint32_t net_x = htonl((uint32_t)x);
    if (send(s, &net_x, sizeof(net_x), 0) < 0) {
        perror("send");
        close(s);
        return 1;
    }

    uint32_t net_res;
    ssize_t r = recv(s, &net_res, sizeof(net_res), 0);
    if (r == (ssize_t)sizeof(net_res)) {
        uint32_t res = ntohl(net_res);
        printf("Server response: %u\n", res);
    } else if (r < 0) {
        perror("recv");
    } else {
        printf("Incomplete response.\n");
    }

    close(s);
    return 0;
}
