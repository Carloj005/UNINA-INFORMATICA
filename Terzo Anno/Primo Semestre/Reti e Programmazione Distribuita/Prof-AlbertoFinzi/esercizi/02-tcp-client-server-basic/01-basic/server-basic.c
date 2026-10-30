#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define PORT 5000
#define BUFFER_SIZE 256

int main(void) {
    int listenfd, connfd;
    char buffer[BUFFER_SIZE];
    const char *reply = "Hello from server\n";
    struct sockaddr_in servaddr;
    ssize_t n;

    // Create TCP socket
    listenfd = socket(AF_INET, SOCK_STREAM, 0);
    if (listenfd < 0) {
        perror("socket");
        exit(EXIT_FAILURE);
    }

    int opt = 1;
    if (setsockopt(listenfd, SOL_SOCKET, SO_REUSEADDR,
                   &opt, sizeof(opt)) < 0) {
        perror("setsockopt");
        close(listenfd);
        exit(EXIT_FAILURE);
    }

    // Configure server address
    memset(&servaddr, 0, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_port = htons(PORT);
    servaddr.sin_addr.s_addr = htonl(INADDR_ANY);

    // Bind and listen
    if (bind(listenfd, (struct sockaddr *)&servaddr,
             sizeof(servaddr)) < 0) {
        perror("bind");
        close(listenfd);
        exit(EXIT_FAILURE);
    }
    if (listen(listenfd, 5) < 0) {
        perror("listen");
        close(listenfd);
        exit(EXIT_FAILURE);
    }

    printf("TCP server waiting for connection...\n");

    connfd = accept(listenfd, NULL, NULL);
    if (connfd < 0) {
        perror("accept");
        close(listenfd);
        exit(EXIT_FAILURE);
    }
    printf("Client connected.\n");

    // Read a message and send a reply
    n = read(connfd, buffer, BUFFER_SIZE - 1);
    if (n > 0) {
        buffer[n] = '\0';
        printf("Received: %s", buffer);
        if (write(connfd, reply, strlen(reply)) < 0)
            perror("write");
    } else if (n < 0) {
        perror("read");
    }

    close(connfd);
    close(listenfd);
    return 0;
}
