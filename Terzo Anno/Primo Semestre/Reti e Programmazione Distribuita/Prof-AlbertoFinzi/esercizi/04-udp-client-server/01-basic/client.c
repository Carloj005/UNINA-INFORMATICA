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
    const char *hello = "Hello from client";
    struct sockaddr_in servaddr;
    ssize_t n;

    // Create UDP socket
    sockfd = socket(AF_INET, SOCK_DGRAM, 0);
    if (sockfd < 0) {
        perror("socket");
        exit(EXIT_FAILURE);
    }

    // Configure the destination server (same machine)
    memset(&servaddr, 0, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_port = htons(PORT);
    if (inet_pton(AF_INET, "127.0.0.1", &servaddr.sin_addr) != 1) {
        fprintf(stderr, "Invalid server IP address\n");
        close(sockfd);
        exit(EXIT_FAILURE);
    }

    // Send a datagram
    if (sendto(sockfd, hello, strlen(hello), 0,
               (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {
        perror("sendto");
        close(sockfd);
        exit(EXIT_FAILURE);
    }
    printf("Message sent.\n");

    // Receive the reply
    n = recvfrom(sockfd, buffer, BUFFER_SIZE - 1, 0, NULL, NULL);
    if (n < 0) {
        perror("recvfrom");
        close(sockfd);
        exit(EXIT_FAILURE);
    }

    buffer[n] = '\0';
    printf("Received: %s\n", buffer);

    close(sockfd);
    return 0;
}
