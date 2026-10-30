UDP client/server examples (C)

These examples use POSIX sockets and were written for Linux.
They all use UDP port 8080 and 127.0.0.1 (localhost).
Run only one server at a time.

Files:

01-basic
  A client sends a message and the server sends a reply.

02-implicit-bind
  The client sends a datagram, prints its assigned local port,
  then tries to call bind(). The error is intentional.

03-timeout
  The client waits up to 5 seconds for a reply.
  Change DELAY in server-timeout.c to 3 or 7 seconds, recompile
  and compare the results.

04-keyboard-one-way
  The client sends messages typed at the keyboard.
  The server displays them. Type exit to stop.

05-keyboard-echo
  The server sends each message back to the client.
  Type exit to stop.

06-multi-client-echo
  The same server handles messages from two clients.
  Run the client twice, with different names (Alice and Bob).

Compiling and running:

Open a terminal in the directory of the example.
Compile each .c file with gcc. For example, in 01-basic:

  gcc server.c -o server
  gcc client.c -o client

Run ./server in one terminal and ./client in another.
Start the server first.

For 06-multi-client-echo:

  gcc server-echo-multi.c -o server-echo-multi
  gcc client-echo-multi.c -o client-echo-multi

Run the server in one terminal:

  ./server-echo-multi

Then start two clients in separate terminals:

  ./client-echo-multi Alice
  ./client-echo-multi Bob

Use Ctrl+C to stop a server running in a loop.

To test with two different machines, change 127.0.0.1
(or SERVER_IP) in the client to the server's IP address.
Make sure UDP port 8080 is allowed by the server firewall.

Note: UDP does not guarantee delivery. These examples do not
implement retransmission or other reliability mechanisms.
