#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define PORT 8080
#define BUFFER_SIZE 1024
#define DELAY 7   // Try 3 and 7 seconds (client timeout: 5 seconds)

int main(void) {
    int sockfd;
    char buffer[BUFFER_SIZE];
    struct sockaddr_in servaddr, cliaddr;
    socklen_t len;
    ssize_t n;

    // Create UDP socket
    sockfd = socket(AF_INET, SOCK_DGRAM, 0);
    if (sockfd < 0) {
        perror("socket");
        return EXIT_FAILURE;
    }

    // Configure server address
    memset(&servaddr, 0, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_port = htons(PORT);
    servaddr.sin_addr.s_addr = htonl(INADDR_ANY);

    // Bind socket
    if (bind(sockfd, (struct sockaddr *)&servaddr,
             sizeof(servaddr)) < 0) {
        perror("bind");
        close(sockfd);
        return EXIT_FAILURE;
    }

    printf("Server waiting for a datagram...\n");
    fflush(stdout);

    // Receive message
    len = sizeof(cliaddr);
    n = recvfrom(sockfd, buffer, BUFFER_SIZE - 1, 0,
                 (struct sockaddr *)&cliaddr, &len);
    if (n < 0) {
        perror("recvfrom");
        close(sockfd);
        return EXIT_FAILURE;
    }

    buffer[n] = '\0';
    printf("Received: %s\n", buffer);
    printf("Waiting %d seconds before replying...\n", DELAY);
    fflush(stdout);
    sleep(DELAY);

    // Echo the message to the original sender
    if (sendto(sockfd, buffer, (size_t)n, 0,
               (struct sockaddr *)&cliaddr, len) < 0) {
        perror("sendto");
        close(sockfd);
        return EXIT_FAILURE;
    }

    printf("Reply sent.\n");
    close(sockfd);
    return EXIT_SUCCESS;
}
