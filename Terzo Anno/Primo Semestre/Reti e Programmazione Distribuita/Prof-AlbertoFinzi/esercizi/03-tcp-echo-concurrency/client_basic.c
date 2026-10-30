/* SIMPLE TCP ECHO CLIENT -- STARTING POINT FOR TWO EXERCISES.
 *
 * Build: make                 (or make bin/client_basic)
 * Run:   ./bin/client_basic [server_ip] [port]
 *
 * Currently: keyboard -> send -> WAIT for complete echo -> keyboard again.
 * There is only one thread and there is no I/O multiplexing.
 *
 * EXERCISE A -- SELECT CLIENT
 *   1. Copy this file to client_select.c.
 *   2. Use select() on STDIN_FILENO and the connected socket.
 *   3. On keyboard readiness: read input and send it (do not recv_exact()).
 *   4. On socket readiness: recv() available bytes and print them.
 *   5. On Ctrl+D: shutdown(sockfd, SHUT_WR), but KEEP receiving replies.
 *   Hints: fd_set, FD_ZERO, FD_SET, FD_ISSET, select(maxfd+1,...).
 *   Note: read(STDIN_FILENO, ...) avoids stdio buffering issues with select().
 *
 * EXERCISE B -- PTHREAD CLIENT
 *   1. Copy this file to client_thread.c.
 *   2. Use one thread to read the keyboard and send to the socket.
 *   3. Use another thread to recv() and print server data continuously.
 *   4. After Ctrl+D, shutdown(sockfd, SHUT_WR), then join the receiving
 *      thread before close(). Do not close() while it still needs the socket.
 *   Hints: pthread_create(), pthread_join(), shutdown(), recv().
 *   For a simple design, run keyboard/sending in main and receiving
 *   in the worker thread.
 *
 * IMPORTANT: Every client version works with EITHER server implementation.
 * The change is in the client architecture, not in the TCP protocol.
 */
#define _POSIX_C_SOURCE 200809L
#include <arpa/inet.h>
#include <errno.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
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

/* Echo is exactly as long as the request; TCP has no message boundaries. */
static int recv_exact(int fd, char *buf, size_t len)
{
    size_t done = 0;
    while (done < len) {
        ssize_t n = recv(fd, buf + done, len - done, 0);
        if (n < 0 && errno == EINTR) continue;
        if (n <= 0) return -1;
        done += (size_t)n;
    }
    return 0;
}

int main(int argc, char **argv)
{
    if (argc > 3) {
        fprintf(stderr, "Usage: %s [server_ip] [port]\n", argv[0]);
        return EXIT_FAILURE;
    }
    const char *ip = argc >= 2 ? argv[1] : "127.0.0.1";
    int port = get_port(argc == 3 ? argv[2] : NULL);
    signal(SIGPIPE, SIG_IGN);

    int fd = socket(AF_INET, SOCK_STREAM, 0);
    if (fd < 0) { perror("socket"); return EXIT_FAILURE; }

    struct sockaddr_in addr = {0};
    addr.sin_family = AF_INET;
    addr.sin_port = htons((uint16_t)port);
    if (inet_pton(AF_INET, ip, &addr.sin_addr) != 1) {
        fprintf(stderr, "Invalid IPv4 address: %s\n", ip);
        close(fd); return EXIT_FAILURE;
    }
    if (connect(fd, (struct sockaddr *)&addr, sizeof(addr)) < 0) {
        perror("connect"); close(fd); return EXIT_FAILURE;
    }

    char line[BUFSIZE], reply[BUFSIZE];
    printf("Connected to %s:%d. Type a line (Ctrl+D to quit).\n", ip, port);
    while (fgets(line, sizeof(line), stdin)) {
        size_t len = strlen(line);
        if (send_all(fd, line, len) < 0 || recv_exact(fd, reply, len) < 0) {
            fprintf(stderr, "Connection lost while exchanging data.\n");
            break;
        }
        printf("Echo: ");
        fwrite(reply, 1, len, stdout);
        if (len == 0 || reply[len - 1] != '\n') putchar('\n');
        fflush(stdout);
    }
    close(fd);
    return 0;
}
