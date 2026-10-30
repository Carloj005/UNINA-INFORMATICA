#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define SERVER_IP "127.0.0.1"
#define PORT 8080
#define BUFFER_SIZE 1024

int main(int argc, char *argv[]) {
    int sockfd;
    char input[512], message[BUFFER_SIZE], buffer[BUFFER_SIZE];
    const char *name;
    struct sockaddr_in servaddr;
    ssize_t n;

    if (argc != 2) {
        fprintf(stderr, "Usage: %s <client-name>\n", argv[0]);
        return 1;
    }
    name = argv[1];

    // Create UDP socket (no explicit bind)
    sockfd = socket(AF_INET, SOCK_DGRAM, 0);
    if (sockfd < 0) {
        perror("socket");
        return 1;
    }

    // Configure server address
    memset(&servaddr, 0, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_port = htons(PORT);
    inet_pton(AF_INET, SERVER_IP, &servaddr.sin_addr);

    printf("Client %s started. Type 'exit' to quit.\n", name);

    while (1) {
        printf("%s> ", name);
        fflush(stdout);

        if (fgets(input, sizeof(input), stdin) == NULL)
            break;
        input[strcspn(input, "\n")] = '\0';

        // Include the declared identity in every UDP datagram
        snprintf(message, sizeof(message), "%s: %s", name, input);

        if (sendto(sockfd, message, strlen(message), 0,
                   (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0) {
            perror("sendto");
            break;
        }

        // Wait for the echo on this client's own UDP socket
        n = recvfrom(sockfd, buffer, sizeof(buffer) - 1, 0, NULL, NULL);
        if (n < 0) {
            perror("recvfrom");
            break;
        }

        buffer[n] = '\0';
        printf("Echo received: %s\n", buffer);

        if (strcmp(input, "exit") == 0)
            break;
    }

    close(sockfd);
    return 0;
}
