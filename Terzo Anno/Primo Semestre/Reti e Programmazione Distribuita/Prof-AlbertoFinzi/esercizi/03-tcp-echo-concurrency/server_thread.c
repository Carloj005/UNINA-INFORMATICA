/* TCP echo server: one detached pthread per client.
 * Build: gcc -std=c11 -Wall -Wextra -O2 -pthread server.c -o server
 * Run:   ./server [port] [delay_ms] (defaults: 9090, 0)
 */
#define _POSIX_C_SOURCE 200809L
#include <arpa/inet.h>
#include <errno.h>
#include <pthread.h>
#include <signal.h>
#include <time.h>
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

/* Keep calling send(): TCP can accept fewer bytes than requested. */
static int send_all(int fd, const char *buf, size_t len)
{
    size_t sent = 0;
    while (sent < len) {
        ssize_t n = send(fd, buf + sent, len - sent, 0);
        if (n < 0 && errno == EINTR) continue;
        if (n <= 0) return -1;
        sent += (size_t)n;
    }
    return 0;
}

struct worker_args {
    int fd;
    int delay_ms;
};

static void pause_before_echo(int delay_ms)
{
    if (delay_ms == 0) return;
    struct timespec delay = {delay_ms / 1000, (delay_ms % 1000) * 1000000L};
    while (nanosleep(&delay, &delay) < 0 && errno == EINTR) { }
}

static void *handle_client(void *arg)
{
    struct worker_args args = *(struct worker_args *)arg;
    free(arg);  /* Each thread receives its own socket descriptor. */
    int fd = args.fd;

    char buf[BUFSIZE];
    for (;;) {
        ssize_t n = recv(fd, buf, sizeof(buf), 0);
        if (n > 0) {
            pause_before_echo(args.delay_ms); /* Optional demonstration delay. */
            if (send_all(fd, buf, (size_t)n) < 0) break;
        } else if (n == 0) {  /* Client closed its sending side. */
            break;
        } else if (errno != EINTR) {
            perror("recv");
            break;
        }
    }
    close(fd);
    return NULL;
}

int main(int argc, char **argv)
{
    if (argc > 3) {
        fprintf(stderr, "Usage: %s [port] [delay_ms]\n", argv[0]);
        return EXIT_FAILURE;
    }
    int port = get_port(argc >= 2 ? argv[1] : NULL);
    int delay_ms = 0;
    if (argc == 3) {
        char *end;
        errno = 0;
        long n = strtol(argv[2], &end, 10);
        if (errno || *argv[2] == '\0' || *end != '\0' || n < 0 || n > 10000) {
            fprintf(stderr, "delay_ms must be between 0 and 10000\n");
            return EXIT_FAILURE;
        }
        delay_ms = (int)n;
    }
    signal(SIGPIPE, SIG_IGN);  /* Avoid process termination on a broken pipe. */

    int listenfd = socket(AF_INET, SOCK_STREAM, 0);
    if (listenfd < 0) { perror("socket"); return EXIT_FAILURE; }

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
    printf("Threaded echo server listening on port %d (delay=%d ms)\n", port, delay_ms);
    fflush(stdout);

    for (;;) {
        int connfd = accept(listenfd, NULL, NULL);
        if (connfd < 0) {
            if (errno == EINTR) continue;
            perror("accept");
            continue;
        }

        /* Heap allocation: do not pass the address of a reused local variable. */
        struct worker_args *arg = malloc(sizeof(*arg));
        if (!arg) { perror("malloc"); close(connfd); continue; }
        arg->fd = connfd;
        arg->delay_ms = delay_ms;

        pthread_t tid;
        int err = pthread_create(&tid, NULL, handle_client, arg);
        if (err != 0) {
            fprintf(stderr, "pthread_create: %s\n", strerror(err));
            free(arg);
            close(connfd);
            continue;
        }
        err = pthread_detach(tid); /* Reclaim thread resources when it exits. */
        if (err != 0)
            fprintf(stderr, "pthread_detach: %s\n", strerror(err));
    }
}
