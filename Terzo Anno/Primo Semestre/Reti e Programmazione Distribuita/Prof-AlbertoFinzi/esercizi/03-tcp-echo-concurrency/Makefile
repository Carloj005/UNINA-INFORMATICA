CC = gcc
CFLAGS = -std=c11 -Wall -Wextra -Wpedantic -O2

.PHONY: all clean
all: bin/server_thread bin/server_select bin/client_basic

bin:
	mkdir -p bin

bin/server_thread: server_thread.c | bin
	$(CC) $(CFLAGS) -pthread $< -o $@

bin/server_select: server_select.c | bin
	$(CC) $(CFLAGS) $< -o $@

bin/client_basic: client_basic.c | bin
	$(CC) $(CFLAGS) $< -o $@

# These targets become available AFTER students create the corresponding files.
bin/client_select: client_select.c | bin
	$(CC) $(CFLAGS) $< -o $@

bin/client_thread: client_thread.c | bin
	$(CC) $(CFLAGS) -pthread $< -o $@

clean:
	rm -rf bin
