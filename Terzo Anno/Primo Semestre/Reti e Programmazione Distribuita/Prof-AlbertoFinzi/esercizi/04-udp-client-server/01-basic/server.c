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
    const char *hello = "Hello from server";
    struct sockaddr_in servaddr, cliaddr;
    socklen_t len;
    ssize_t n;

    // Create UDP socket
    sockfd = socket(AF_INET, SOCK_DGRAM, 0);
    if (sockfd < 0) {
        perror("socket");
        exit(EXIT_FAILURE);
    }

    // Configure server address
    memset(&servaddr, 0, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_port = htons(PORT);
    servaddr.sin_addr.s_addr = htonl(INADDR_ANY);

    // Bind socket to port 8080
    if (bind(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {
        perror("bind");
        close(sockfd);
        exit(EXIT_FAILURE);
    }

    printf("UDP server waiting for messages...\n");

    // Receive a datagram and learn the client's address
    len = sizeof(cliaddr);
    n = recvfrom(sockfd, buffer, BUFFER_SIZE - 1, 0,
                 (struct sockaddr *)&cliaddr, &len);
    if (n < 0) {
        perror("recvfrom");
        close(sockfd);
        exit(EXIT_FAILURE);
    }

    buffer[n] = '\0';
    printf("Received: %s\n", buffer);

    // Send a reply to the client
    if (sendto(sockfd, hello, strlen(hello), 0,
               (struct sockaddr *)&cliaddr, len) < 0) {
        perror("sendto");
        close(sockfd);
        exit(EXIT_FAILURE);
    }
    printf("Reply sent.\n");

    close(sockfd);
    return 0;
}
