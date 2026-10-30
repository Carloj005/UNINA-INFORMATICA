CC = gcc
CFLAGS = -std=c11 -O2 -Wall -Wextra -Wpedantic

PROGRAMS = dns_lookup http_unina whois_client

all: $(PROGRAMS)

dns_lookup: dns_lookup.c
	$(CC) $(CFLAGS) -o $@ $<

http_unina: http_unina.c
	$(CC) $(CFLAGS) -o $@ $<

whois_client: whois_client.c
	$(CC) $(CFLAGS) -o $@ $<

clean:
	rm -f $(PROGRAMS)

.PHONY: all clean
