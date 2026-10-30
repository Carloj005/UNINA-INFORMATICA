#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define PORT 8080
#define BUFFER_SIZE 1024

int main(void) {
    int sockfd;
    char buffer[BUFFER_SIZE];
    struct sockaddr_in servaddr, cliaddr;
    socklen_t len;
    ssize_t n;

    sockfd = socket(AF_INET, SOCK_DGRAM, 0);
    if (sockfd < 0) {
        perror("socket");
        return EXIT_FAILURE;
    }

    memset(&servaddr, 0, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_port = htons(PORT);
    servaddr.sin_addr.s_addr = htonl(INADDR_ANY);

    if (bind(sockfd, (struct sockaddr *)&servaddr,
             sizeof(servaddr)) < 0) {
        perror("bind");
        close(sockfd);
        return EXIT_FAILURE;
    }

    printf("UDP server waiting for keyboard messages...\n");
    fflush(stdout);

    while (1) {
        len = sizeof(cliaddr);
        n = recvfrom(sockfd, buffer, BUFFER_SIZE - 1, 0,
                     (struct sockaddr *)&cliaddr, &len);
        if (n < 0) {
            perror("recvfrom");
            break;
        }

        buffer[n] = '\0';
        printf("Client: %s\n", buffer);
        fflush(stdout);

        if (strcmp(buffer, "exit") == 0)
            break;
    }

    close(sockfd);
    return EXIT_SUCCESS;
}
