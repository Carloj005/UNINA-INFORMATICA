CC = cc
CFLAGS = -std=c11 -O2 -Wall -Wextra -Wpedantic

PROGRAMS = broadcast_sender broadcast_receiver multicast_chat

all: $(PROGRAMS)

broadcast_sender: broadcast_sender.c
	$(CC) $(CFLAGS) -o $@ $<

broadcast_receiver: broadcast_receiver.c
	$(CC) $(CFLAGS) -o $@ $<

multicast_chat: multicast_chat.c
	$(CC) $(CFLAGS) -o $@ $<

clean:
	rm -f $(PROGRAMS)

.PHONY: all clean
