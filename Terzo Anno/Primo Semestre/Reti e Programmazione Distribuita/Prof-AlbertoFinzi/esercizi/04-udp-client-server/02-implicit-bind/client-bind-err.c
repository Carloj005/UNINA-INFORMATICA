#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define PORT 8080

int main(void) {
    int sockfd;
    const char *hello = "Hello from client";
    struct sockaddr_in servaddr, cliaddr;
    socklen_t len;

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
    inet_pton(AF_INET, "127.0.0.1", &servaddr.sin_addr);

    // Send message: the OS implicitly binds this socket to a local port
    if (sendto(sockfd, hello, strlen(hello), 0,
               (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {
        perror("sendto");
        close(sockfd);
        exit(EXIT_FAILURE);
    }
    printf("Message sent.\n");

    // Show the port automatically assigned to the socket
    len = sizeof(cliaddr);
    if (getsockname(sockfd, (struct sockaddr *)&cliaddr, &len) < 0) {
        perror("getsockname");
        close(sockfd);
        exit(EXIT_FAILURE);
    }
    printf("Assigned port: %u\n", (unsigned)ntohs(cliaddr.sin_port));

    // WRONG: attempt to bind a socket that is already bound
    memset(&cliaddr, 0, sizeof(cliaddr));
    cliaddr.sin_family = AF_INET;
    cliaddr.sin_port = htons(50000);
    cliaddr.sin_addr.s_addr = htonl(INADDR_ANY);

    fflush(stdout);
    if (bind(sockfd, (struct sockaddr *)&cliaddr, sizeof(cliaddr)) < 0) {
        perror("bind"); // Expected on Linux: Invalid argument
    }

    close(sockfd);
    return 0;
}
