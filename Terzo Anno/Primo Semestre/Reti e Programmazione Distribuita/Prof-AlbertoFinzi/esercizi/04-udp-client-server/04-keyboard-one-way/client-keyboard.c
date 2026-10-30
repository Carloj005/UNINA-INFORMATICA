#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define SERVER_IP "127.0.0.1"
#define PORT 8080
#define BUFFER_SIZE 1024

int main(void) {
    int sockfd;
    char buffer[BUFFER_SIZE];
    struct sockaddr_in servaddr;

    sockfd = socket(AF_INET, SOCK_DGRAM, 0);
    if (sockfd < 0) {
        perror("socket");
        return EXIT_FAILURE;
    }

    memset(&servaddr, 0, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_port = htons(PORT);
    inet_pton(AF_INET, SERVER_IP, &servaddr.sin_addr);

    while (1) {
        printf("Enter message: ");
        fflush(stdout);  // Display the prompt before reading input

        if (fgets(buffer, sizeof(buffer), stdin) == NULL)
            break;
        buffer[strcspn(buffer, "\n")] = '\0';  // Remove trailing newline

        if (sendto(sockfd, buffer, strlen(buffer), 0,
                   (struct sockaddr *)&servaddr,
                   sizeof(servaddr)) < 0) {
            perror("sendto");
            break;
        }

        if (strcmp(buffer, "exit") == 0)
            break;
    }

    close(sockfd);
    return EXIT_SUCCESS;
}
