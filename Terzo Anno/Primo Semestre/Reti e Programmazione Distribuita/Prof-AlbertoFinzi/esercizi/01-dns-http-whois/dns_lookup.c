/*
 * DNS translation example using the historical gethostbyname() API.
 * This mirrors the 'struct hostent' slides.
 *
 * Modern applications should prefer getaddrinfo() (used in the other examples).
 */
#include <arpa/inet.h>
#include <netdb.h>
#include <stdio.h>

int main(int argc, char *argv[])
{
    const char *hostname = (argc > 1) ? argv[1] : "www.unina.it";
    struct hostent *host = gethostbyname(hostname);

    if (host == NULL) {
        fprintf(stderr, "Could not resolve hostname: %s\n", hostname);
        return 1;
    }

    printf("Requested hostname: %s\n", hostname);
    printf("Canonical hostname: %s\n", host->h_name);
    printf("Address family: %s\n", host->h_addrtype == AF_INET ? "AF_INET (IPv4)" : "other");
    printf("Address length: %d bytes\n", host->h_length);

    puts("Aliases:");
    if (host->h_aliases[0] == NULL)
        puts("  (none)");
    for (int i = 0; host->h_aliases[i] != NULL; i++)
        printf("  %s\n", host->h_aliases[i]);

    if (host->h_addrtype != AF_INET) {
        fputs("This teaching example displays IPv4 addresses only.\n", stderr);
        return 1;
    }

    puts("IPv4 addresses:");
    for (int i = 0; host->h_addr_list[i] != NULL; i++) {
        char ip[INET_ADDRSTRLEN];
        if (inet_ntop(AF_INET, host->h_addr_list[i], ip, sizeof(ip)) == NULL) {
            perror("inet_ntop");
            return 1;
        }
        printf("  [%d] %s%s\n", i, ip, i == 0 ? " (first address)" : "");
    }

    return 0;
}
