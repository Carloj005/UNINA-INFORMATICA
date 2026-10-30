#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <unistd.h>
#include <errno.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <signal.h>

#define PORT 5202

// Receive exactly n bytes unless EOF or error
ssize_t recv_all(int fd, void *buf, size_t n) {
    size_t received = 0;
    char *p = buf;
    while (received < n) {
        ssize_t r = recv(fd, p + received, n - received, 0);
        if (r < 0) {
            if (errno == EINTR)
                continue;
            return -1;
        }
        if (r == 0)
            return (ssize_t)received;
        received += (size_t)r;
    }
    return (ssize_t)received;
}

// Send exactly n bytes unless error
ssize_t send_all(int fd, const void *buf, size_t n) {
    size_t sent = 0;
    const char *p = buf;
    while (sent < n) {
        ssize_t w = send(fd, p + sent, n - sent, 0);
        if (w < 0) {
            if (errno == EINTR)
                continue;
            return -1;
        }
        if (w == 0)
            return (ssize_t)sent;
        sent += (size_t)w;
    }
    return (ssize_t)sent;
}

// Each child handles a single client connection
void handle_client(int c) {
    printf("[child %ld] Client connected.\n", (long)getpid());

    while (1) {
        uint32_t net_nums[2];
        ssize_t r = recv_all(c, net_nums, sizeof(net_nums));
        if (r == 0)
            break;
        if (r < 0) {
            perror("recv_all");
            break;
        }
        if ((size_t)r != sizeof(net_nums))
            break;

        uint32_t x = ntohl(net_nums[0]);
        uint32_t y = ntohl(net_nums[1]);
        uint32_t sum = x + y;
        printf("[child %ld] %u + %u = %u\n", (long)getpid(), x, y, sum);

        uint32_t net_sum = htonl(sum);
        ssize_t w = send_all(c, &net_sum, sizeof(net_sum));
        if (w != (ssize_t)sizeof(net_sum))
            break;
    }

    printf("[child %ld] Client disconnected.\n", (long)getpid());
}

int main(void) {
    int listenfd, connfd;
    struct sockaddr_in addr = {0};

    setvbuf(stdout, NULL, _IONBF, 0);
    signal(SIGCHLD, SIG_IGN); // Reap child processes on Linux
    signal(SIGPIPE, SIG_IGN); // Do not terminate on broken pipe

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

    addr.sin_family = AF_INET;
    addr.sin_port = htons(PORT);
    addr.sin_addr.s_addr = htonl(INADDR_ANY);

    if (bind(listenfd, (struct sockaddr *)&addr,
             sizeof(addr)) < 0) {
        perror("bind");
        close(listenfd);
        exit(EXIT_FAILURE);
    }
    if (listen(listenfd, 8) < 0) {
        perror("listen");
        close(listenfd);
        exit(EXIT_FAILURE);
    }

    printf("[server] Listening on port %d\n", PORT);

    while (1) {
        connfd = accept(listenfd, NULL, NULL);
        if (connfd < 0) {
            if (errno == EINTR)
                continue;
            perror("accept");
            break;
        }

        pid_t pid = fork();
        if (pid < 0) {
            perror("fork");
            close(connfd);
            continue;
        }
        if (pid == 0) {
            // Child process: keep connected socket only
            close(listenfd);
            handle_client(connfd);
            close(connfd);
            _exit(0);
        }

        // Parent process: keep listening socket only
        printf("[server] Created child %ld\n", (long)pid);
        close(connfd);
    }

    close(listenfd);
    return 0;
}
