/*
 * Simple HTTP/1.1 client using TCP sockets (plain HTTP, no TLS).
 * Default target: www.unina.it /chi-siamo/cenni-storici with a HEAD request.
 *
 * Usage: ./http_unina [host] [path] [GET|HEAD] [port]
 * Example: ./http_unina www.unina.it /chi-siamo/cenni-storici GET
 *
 * Modern web servers commonly redirect HTTP to HTTPS. This example only
 * prints that HTTP response; it does not follow redirects or implement TLS.
 */
#define _POSIX_C_SOURCE 200809L
#include <errno.h>
#include <netdb.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <unistd.h>

static int connect_tcp(const char *hostname, const char *port)
{
    struct addrinfo hints, *results, *p;
    int sock = -1;

    memset(&hints, 0, sizeof(hints));
    hints.ai_family = AF_UNSPEC;      // IPv4 or IPv6
    hints.ai_socktype = SOCK_STREAM;  // TCP socket

    int err = getaddrinfo(hostname, port, &hints, &results);
    if (err != 0) {
        fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(err));
        return -1;
    }

    for (p = results; p != NULL; p = p->ai_next) {
        sock = socket(p->ai_family, p->ai_socktype, p->ai_protocol);
        if (sock < 0)
            continue;
        if (connect(sock, p->ai_addr, p->ai_addrlen) == 0)
            break;
        close(sock);
        sock = -1;
    }

    freeaddrinfo(results);
    if (sock < 0)
        fprintf(stderr, "Could not connect to %s:%s\n", hostname, port);
    return sock;
}

static int send_all(int sock, const char *data, size_t length)
{
    size_t sent = 0;
    while (sent < length) {
        ssize_t n = send(sock, data + sent, length - sent, 0);
        if (n < 0 && errno == EINTR)
            continue;
        if (n <= 0)
            return -1;
        sent += (size_t)n;
    }
    return 0;
}

int main(int argc, char *argv[])
{
    const char *hostname = (argc > 1) ? argv[1] : "www.unina.it";
    const char *path = (argc > 2) ? argv[2] : "/chi-siamo/cenni-storici";
    const char *method = (argc > 3) ? argv[3] : "HEAD";
    const char *port = (argc > 4) ? argv[4] : "80";

    if (argc > 5 || (strcmp(method, "GET") != 0 && strcmp(method, "HEAD") != 0)
        || path[0] != '/') {
        fprintf(stderr, "Usage: %s [host] [/path] [GET|HEAD] [port]\n", argv[0]);
        return 1;
    }

    int sock = connect_tcp(hostname, port);
    if (sock < 0)
        return 1;

    char request[2048];
    // For non-standard ports, include the port number in the Host header.
    int n = snprintf(request, sizeof(request),
                     "%s %s HTTP/1.1\r\n"
                     "Host: %s%s%s\r\n"
                     "Connection: close\r\n"
                     "User-Agent: SocketCourseExample/1.0\r\n"
                     "\r\n",
                     method, path, hostname,
                     strcmp(port, "80") == 0 ? "" : ":",
                     strcmp(port, "80") == 0 ? "" : port);
    if (n < 0 || (size_t)n >= sizeof(request)) {
        fprintf(stderr, "HTTP request too long\n");
        close(sock);
        return 1;
    }

    printf("HTTP request:\n%s\n", request);
    fflush(stdout);

    if (send_all(sock, request, (size_t)n) < 0) {
        perror("send");
        close(sock);
        return 1;
    }

    puts("HTTP response:");
    char buffer[4096];
    ssize_t bytes;
    while ((bytes = recv(sock, buffer, sizeof(buffer), 0)) != 0) {
        if (bytes < 0) {
            if (errno == EINTR)
                continue;
            perror("recv");
            close(sock);
            return 1;
        }
        // fwrite prints exactly 'bytes' bytes: no terminating '\0' is needed.
        if (fwrite(buffer, 1, (size_t)bytes, stdout) != (size_t)bytes) {
            perror("fwrite");
            close(sock);
            return 1;
        }
    }

    close(sock);
    return 0;
}
