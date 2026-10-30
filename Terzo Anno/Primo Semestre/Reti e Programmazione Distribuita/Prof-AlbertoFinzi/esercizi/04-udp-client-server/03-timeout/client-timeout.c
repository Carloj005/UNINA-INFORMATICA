#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <errno.h>
#include <sys/time.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define PORT 8080
#define BUFFER_SIZE 1024

int main(void) {
    int sockfd;
    char buffer[BUFFER_SIZE];
    const char *message = "Hello from client";
    struct sockaddr_in servaddr;
    struct timeval timeout;
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
    inet_pton(AF_INET, "127.0.0.1", &servaddr.sin_addr);

    // Maximum time to wait for a reply: 5 seconds
    timeout.tv_sec = 5;
    timeout.tv_usec = 0;
    if (setsockopt(sockfd, SOL_SOCKET, SO_RCVTIMEO,
                   &timeout, sizeof(timeout)) < 0) {
        perror("setsockopt");
        close(sockfd);
        return EXIT_FAILURE;
    }

    // Send a datagram
    if (sendto(sockfd, message, strlen(message), 0,
               (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {
        perror("sendto");
        close(sockfd);
        return EXIT_FAILURE;
    }
    printf("Message sent. Waiting for reply...\n");
    fflush(stdout);

    // Receive a reply, or stop waiting after 5 seconds
    n = recvfrom(sockfd, buffer, BUFFER_SIZE - 1, 0, NULL, NULL);
    if (n < 0) {
        if (errno == EAGAIN || errno == EWOULDBLOCK)
            printf("Timeout! No reply received.\n");
        else
            perror("recvfrom");
    } else {
        buffer[n] = '\0';
        printf("Received: %s\n", buffer);
    }

    close(sockfd);
    return EXIT_SUCCESS;
}
