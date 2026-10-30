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
    char client_ip[INET_ADDRSTRLEN];
    struct sockaddr_in servaddr, cliaddr;
    socklen_t len;
    ssize_t n;

    // Create UDP socket
    sockfd = socket(AF_INET, SOCK_DGRAM, 0);
    if (sockfd < 0) {
        perror("socket");
        return 1;
    }

    // Configure server address
    memset(&servaddr, 0, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_port = htons(PORT);
    servaddr.sin_addr.s_addr = htonl(INADDR_ANY);

    // Bind to a known UDP port
    if (bind(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {
        perror("bind");
        close(sockfd);
        return 1;
    }

    printf("UDP Echo Server listening on port %d...\n", PORT);

    while (1) {
        len = sizeof(cliaddr);

        // Receive a datagram and get its sender's address
        n = recvfrom(sockfd, buffer, BUFFER_SIZE - 1, 0,
                     (struct sockaddr *)&cliaddr, &len);
        if (n < 0) {
            perror("recvfrom");
            continue;
        }

        buffer[n] = '\0';
        inet_ntop(AF_INET, &cliaddr.sin_addr, client_ip, sizeof(client_ip));
        printf("From %s:%u -> %s\n", client_ip,
               (unsigned)ntohs(cliaddr.sin_port), buffer);
        fflush(stdout);

        // Echo the datagram to the SAME sender
        if (sendto(sockfd, buffer, (size_t)n, 0,
                   (struct sockaddr *)&cliaddr, len) < 0) {
            perror("sendto");
        }
    }

    close(sockfd);
    return 0;
}
