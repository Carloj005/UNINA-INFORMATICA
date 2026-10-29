# Makefile per compilare gli esercizi su Thread, Mutex, Semafori e Condition Variables (Sistemi Operativi)
CC      := gcc
CFLAGS  := -Wall -Wextra -O2 -pthread

SRCS    := $(wildcard *.c)
TARGETS := $(SRCS:.c=)

.PHONY: all clean

all: $(TARGETS)

%: %.c
	$(CC) $(CFLAGS) $< -o $@

clean:
	rm -f $(TARGETS) barriera pong pong-sem stampante thread-no-race
