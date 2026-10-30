/* TCP echo server: many clients, one thread, select() for read readiness.
 * Build: gcc -std=c11 -Wall -Wextra -O2 server.c -o server
 * Run:   ./server [port]  (default: 9090)
 */
#define _POSIX_C_SOURCE 200809L
#include <arpa/inet.h>
#include <errno.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/select.h>
#include <sys/socket.h>
#include <unistd.h>

#define BUFSIZE 4096
#define DEFAULT_PORT 9090

static int get_port(const char *s)
{
    if (!s) return DEFAULT_PORT;
    char *end;
    errno = 0;
    long p = strtol(s, &end, 10);
    if (errno || *s == '\0' || *end != '\0' || p < 1 || p > 65535) {
        fprintf(stderr, "Invalid port: %s\n", s);
        exit(EXIT_FAILURE);
    }
    return (int)p;
}

static int send_all(int fd, const char *buf, size_t len)
{
    size_t done = 0;
    while (done < len) {
        ssize_t n = send(fd, buf + done, len - done, 0);
        if (n < 0 && errno == EINTR) continue;
        if (n <= 0) return -1;
        done += (size_t)n;
    }
    return 0;
}

int main(int argc, char **argv)
{
    if (argc > 2) {
        fprintf(stderr, "Usage: %s [port]\n", argv[0]);
        return EXIT_FAILURE;
    }
    int port = get_port(argc == 2 ? argv[1] : NULL);
    signal(SIGPIPE, SIG_IGN);

    int listenfd = socket(AF_INET, SOCK_STREAM, 0);
    if (listenfd < 0) { perror("socket"); return EXIT_FAILURE; }
    /* select() can only represent descriptors below FD_SETSIZE. */
    if (listenfd >= FD_SETSIZE) {
        fprintf(stderr, "Listening descriptor exceeds FD_SETSIZE\n");
        close(listenfd); return EXIT_FAILURE;
    }

    int yes = 1;
    if (setsockopt(listenfd, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof(yes)) < 0) {
        perror("setsockopt"); close(listenfd); return EXIT_FAILURE;
    }

    struct sockaddr_in addr = {0};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = htonl(INADDR_ANY);
    addr.sin_port = htons((uint16_t)port);

    if (bind(listenfd, (struct sockaddr *)&addr, sizeof(addr)) < 0 ||
        listen(listenfd, 16) < 0) {
        perror("bind/listen"); close(listenfd); return EXIT_FAILURE;
    }

    /* client[] remembers accepted sockets; -1 means an unused slot. */
    int client[FD_SETSIZE];
    for (int i = 0; i < FD_SETSIZE; ++i) client[i] = -1;

    fd_set allset, rset;
    FD_ZERO(&allset);
    FD_SET(listenfd, &allset);
    int maxfd = listenfd; /* Highest descriptor monitored by select(). */
    int maxi = -1;       /* Highest occupied index in client[]. */

    printf("Multiplex echo server listening on port %d\n", port);
    fflush(stdout);

    for (;;) {
        rset = allset; /* select() changes rset, not allset. */
        int ready = select(maxfd + 1, &rset, NULL, NULL, NULL);
        if (ready < 0) {
            if (errno == EINTR) continue;
            perror("select");
            break;
        }

        /* A readable listening socket has a pending connection. */
        if (FD_ISSET(listenfd, &rset)) {
            int connfd = accept(listenfd, NULL, NULL);
            if (connfd < 0) {
                if (errno != EINTR) perror("accept");
            } else if (connfd >= FD_SETSIZE) {
                fprintf(stderr, "Too many descriptors for select(); rejecting client\n");
                close(connfd);
            } else {
                int i;
                for (i = 0; i < FD_SETSIZE; ++i)
                    if (client[i] == -1) break;
                if (i == FD_SETSIZE) {
                    fprintf(stderr, "client[] is full; rejecting client\n");
                    close(connfd);
                } else {
                    client[i] = connfd;
                    FD_SET(connfd, &allset); /* Add client for NEXT select(). */
                    if (connfd > maxfd) maxfd = connfd;
                    if (i > maxi) maxi = i;
                    printf("Client connected (fd=%d)\n", connfd);
                }
            }
            if (--ready == 0) continue;
        }

        /* Inspect the connected sockets reported readable by select(). */
        for (int i = 0; i <= maxi && ready > 0; ++i) {
            int fd = client[i];
            if (fd < 0 || !FD_ISSET(fd, &rset)) continue;
            --ready;

            char buf[BUFSIZE];
            ssize_t n = recv(fd, buf, sizeof(buf), 0);
            if (n > 0 && send_all(fd, buf, (size_t)n) == 0)
                continue; /* Successful echo: keep this client. */
            if (n < 0 && errno == EINTR) continue;

            /* EOF or I/O error: remove the socket from allset and client[]. */
            if (n < 0) perror("recv");
            close(fd);
            FD_CLR(fd, &allset);
            client[i] = -1;
            printf("Client disconnected (fd=%d)\n", fd);
        }
    }
    close(listenfd);
    return EXIT_FAILURE;
}
