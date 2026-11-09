#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <ctype.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/select.h>
#include <netinet/in.h>

#define PORT 5201

int main(void) {
    int listenfd = socket(AF_INET, SOCK_STREAM, 0);
    if (listenfd < 0) { perror("socket"); return 1; }

    int reuse = 1;
    setsockopt(listenfd, SOL_SOCKET, SO_REUSEADDR, &reuse, sizeof(reuse));

    struct sockaddr_in addr;
    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = htonl(INADDR_ANY);
    addr.sin_port = htons(PORT);

    if (bind(listenfd, (struct sockaddr *)&addr, sizeof(addr)) < 0) {
        perror("bind"); close(listenfd); return 1;
    }
    if (listen(listenfd, 8) < 0) {
        perror("listen"); close(listenfd); return 1;
    }

    fd_set allset, rset;
    FD_ZERO(&allset);
    FD_SET(listenfd, &allset);
    int maxfd = listenfd;

    printf("Server TCP in ascolto sulla porta %d\n", PORT);
    fflush(stdout);

    for (;;) {
        /* TODO S1 (2 punti)
           Preparare rset a ogni iterazione e chiamare select().
           Uscire dal ciclo in caso di errore.
        */
        rset = allset;
        if (select(maxfd + 1, &rset, NULL, NULL, NULL) < 0) {
            perror("select");
            break;
        }

        if (FD_ISSET(listenfd, &rset)) {
            int c = accept(listenfd, NULL, NULL);
            if (c >= 0) {
                if (c >= FD_SETSIZE) {
                    close(c);
                } else {
                    /* TODO S2 (2 punti)
                       Aggiungere c all'insieme dei descrittori
                       da monitorare e aggiornare maxfd se necessario.
                    */
                    FD_SET(c, &allset);
                    if (c > maxfd) {
                        maxfd = c;
                    }
                }
            }
        }

        for (int fd = 0; fd <= maxfd; fd++) {
            if (fd == listenfd || !FD_ISSET(fd, &rset)) continue;

            char ch;
            ssize_t n = recv(fd, &ch, 1, 0);
            if (n > 0) {
                ch = (char)toupper((unsigned char)ch);
                if (send(fd, &ch, 1, 0) < 0) perror("send");
            } else if (n < 0) {
                perror("recv");
            }

            /* TODO S3 (3 punti)
               Dopo la risposta (o se il client ha chiuso / c'e' stato
               un errore), chiudere la connessione e togliere fd
               dall'insieme dei descrittori monitorati.
            */
            close(fd);
            FD_CLR(fd, &allset);
        }
    }

    close(listenfd);
    return 0;
}
