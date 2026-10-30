/*
 * Minimal WHOIS client over TCP port 43.
 * Resolve WHOIS server with getaddrinfo(), connect, send "domain\r\n",
 * receive its reply and print it to standard output.
 *
 * Usage: ./whois_client domain [whois-server] [port]
 * Example: ./whois_client example.com whois.verisign-grs.com
 *
 * WHOIS is a legacy protocol; for current domain registration data,
 * RDAP is often preferable. Many networks block outbound TCP port 43.
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
    if (argc < 2 || argc > 4) {
        fprintf(stderr, "Usage: %s domain [whois-server] [port]\n", argv[0]);
        return 1;
    }

    const char *domain = argv[1];
    const char *server = (argc > 2) ? argv[2] : "whois.iana.org";
    const char *port = (argc > 3) ? argv[3] : "43";

    // WHOIS requests are one domain followed by CRLF.
    if (strchr(domain, '\r') || strchr(domain, '\n')) {
        fprintf(stderr, "Invalid domain name\n");
        return 1;
    }

    char query[1024];
    int length = snprintf(query, sizeof(query), "%s\r\n", domain);
    if (length < 0 || (size_t)length >= sizeof(query)) {
        fprintf(stderr, "Domain name too long\n");
        return 1;
    }

    int sock = connect_tcp(server, port);
    if (sock < 0)
        return 1;

    fprintf(stderr, "WHOIS server: %s:%s\nQuery: %s\n\n", server, port, domain);
    if (send_all(sock, query, (size_t)length) < 0) {
        perror("send");
        close(sock);
        return 1;
    }

    char buffer[4096];
    ssize_t n;
    while ((n = recv(sock, buffer, sizeof(buffer), 0)) != 0) {
        if (n < 0) {
            if (errno == EINTR)
                continue;
            perror("recv");
            close(sock);
            return 1;
        }
        if (fwrite(buffer, 1, (size_t)n, stdout) != (size_t)n) {
            perror("fwrite");
            close(sock);
            return 1;
        }
    }

    close(sock);
    return 0;
}
