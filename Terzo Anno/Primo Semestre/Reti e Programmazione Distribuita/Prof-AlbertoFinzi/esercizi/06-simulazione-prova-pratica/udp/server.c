#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>

#define PORT 5002

int main(void) {
    int sockfd = socket(AF_INET, SOCK_DGRAM, 0);
    if (sockfd < 0) { perror("socket"); return 1; }

    struct sockaddr_in addr = {0};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = htonl(INADDR_ANY);
    addr.sin_port = htons(PORT);
    if (bind(sockfd, (struct sockaddr *)&addr, sizeof(addr)) < 0) {
        perror("bind"); close(sockfd); return 1;
    }

    struct sockaddr_in client_addr;
    socklen_t client_len;
    unsigned char buffer[sizeof(uint32_t)];
    ssize_t n = 0;

    printf("Server UDP in ascolto sulla porta %d\n", PORT);
    fflush(stdout);

    /* TODO U3 (2 punti)
       Il blocco seguente gestisce una sola richiesta.
       Inserirlo in un ciclo che permetta di servire richieste successive.
       client_len deve essere reimpostato prima di ogni ricezione.
    */
    for (;;) {
        client_len = sizeof(client_addr);

        /* TODO U1 (2 punti)
           Ricevere un datagramma in buffer e memorizzare l'indirizzo
           del mittente in client_addr (e la sua lunghezza in client_len).
           Salvare in n il numero di byte ricevuti.
        */
        n = recvfrom(sockfd, buffer, sizeof(buffer), 0,
                     (struct sockaddr *)&client_addr, &client_len);

        if (n < 0) {
            perror("recvfrom");
        } else if (n != (ssize_t)sizeof(buffer)) {
            fprintf(stderr, "Richiesta di dimensione non valida: %zd byte\n", n);
        } else {
            uint32_t net_number;
            memcpy(&net_number, buffer, sizeof(net_number));
            uint32_t number = ntohl(net_number);
            uint32_t result = number * number;
            uint32_t net_result = htonl(result);

            /* TODO U2 (2 punti)
               Inviare net_result al mittente della richiesta.
            */
            if (sendto(sockfd, &net_result, sizeof(net_result), 0,
                       (struct sockaddr *)&client_addr, client_len) < 0) {
                perror("sendto");
            }
        }
    }

    close(sockfd);
    return 0;
}
