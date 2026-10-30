#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define PORT 5000
#define BUFFER_SIZE 256

int main(void) {
    int sockfd;
    char buffer[BUFFER_SIZE];
    const char *hello = "hello\n";
    struct sockaddr_in servaddr;
    ssize_t n;

    sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (sockfd < 0) {
        perror("socket");
        exit(EXIT_FAILURE);
    }

    memset(&servaddr, 0, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_port = htons(PORT);
    inet_pton(AF_INET, "127.0.0.1", &servaddr.sin_addr);

    if (connect(sockfd, (struct sockaddr *)&servaddr,
                sizeof(servaddr)) < 0) {
        perror("connect");
        close(sockfd);
        exit(EXIT_FAILURE);
    }
    printf("Connected to server.\n");

    if (write(sockfd, hello, strlen(hello)) < 0) {
        perror("write");
        close(sockfd);
        exit(EXIT_FAILURE);
    }

    n = read(sockfd, buffer, BUFFER_SIZE - 1);
    if (n > 0) {
        buffer[n] = '\0';
        printf("Received: %s", buffer);
    } else if (n < 0) {
        perror("read");
    }

    close(sockfd);
    return 0;
}
