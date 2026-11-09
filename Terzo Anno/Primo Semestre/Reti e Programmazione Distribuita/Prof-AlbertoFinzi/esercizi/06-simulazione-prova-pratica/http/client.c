#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>

int main(void) {
    int sockfd = -1;
    struct sockaddr_in server_addr;
    struct hostent *server;
    char request[512];
    char buffer[4096];
    ssize_t n;

    /* TODO H1 (2 punti)
       Creare una socket IPv4 adatta alla comunicazione con il server Web.
       Salvare il descrittore in sockfd e controllare gli errori.
    */
    sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (sockfd < 0) {
        perror("socket");
        return 1;
    }

    /* Risoluzione del nome e preparazione dell'indirizzo: gia' forniti. */
    server = gethostbyname("info.cern.ch");
    if (server == NULL) {
        fprintf(stderr, "Risoluzione DNS non riuscita\n");
        close(sockfd);
        return 1;
    }

    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(80);
    memcpy(&server_addr.sin_addr, server->h_addr_list[0], server->h_length);

    /* TODO H2 (1 punto)
       Stabilire la connessione usando connect() e server_addr.
       Controllare gli errori.
    */
    if (connect(sockfd, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0) {
        perror("connect");
        close(sockfd);
        return 1;
    }

    /* TODO H3 (2 punti)
       Costruire e inviare una richiesta HTTP/1.1 GET valida per
       /hypertext/WWW/TheProject.html, chiedendo al server di chiudere
       la connessione al termine della risposta.
       Usare il buffer request.
    */
    snprintf(request, sizeof(request),
             "GET /hypertext/WWW/TheProject.html HTTP/1.1\r\n"
             "Host: info.cern.ch\r\n"
             "Connection: close\r\n\r\n");
    size_t len = strlen(request);
    size_t sent = 0;
    while (sent < len) {
        n = send(sockfd, request + sent, len - sent, 0);
        if (n <= 0) {
            perror("send");
            close(sockfd);
            return 1;
        }
        sent += (size_t)n;
    }

    /* Ricezione e stampa della risposta: gia' fornite. */
    while ((n = recv(sockfd, buffer, sizeof(buffer), 0)) > 0) {
        write(STDOUT_FILENO, buffer, (size_t)n);
    }
    if (n < 0) perror("recv");

    close(sockfd);
    return n < 0 ? 1 : 0;
}
