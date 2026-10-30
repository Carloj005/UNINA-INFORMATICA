TCP Socket Examples (C / POSIX)

Examples for Linux. Each folder contains a separate exercise.
Start the server first, then the client, in a different terminal.
Only run one server on a given port at a time.

01-basic
  One TCP connection, one text message and a reply. Port 5000.
  gcc -Wall -Wextra server-basic.c -o server-basic
  gcc -Wall -Wextra client-basic.c -o client-basic
  ./server-basic
  ./client-basic

02-increment
  The client sends one 32-bit integer; the server returns x + 1.
  The server accepts successive connections. Port 5201.
  gcc -Wall -Wextra server-increment.c -o server-increment
  gcc -Wall -Wextra client-increment.c -o client-increment
  ./server-increment
  ./client-increment

03-sum
  The client sends pairs of integers over one persistent TCP connection.
  The server returns their sum. Port 5201.
  gcc -Wall -Wextra server-sum.c -o server-sum
  gcc -Wall -Wextra client-sum.c -o client-sum
  ./server-sum
  ./client-sum

04-sum-safe
  Same exercise as 03-sum, using recv_all() and send_all(). Port 5201.
  gcc -Wall -Wextra server-sum-safe.c -o server-sum-safe
  gcc -Wall -Wextra client-sum-safe.c -o client-sum-safe
  ./server-sum-safe
  ./client-sum-safe

05-fork
  Concurrent server: one child process per TCP connection. Port 5202.
  gcc -Wall -Wextra server-fork.c -o server-fork
  ./server-fork
  See EXERCISE.txt for the client programming task.
  No completed client is included.

Notes
  - Commands are run inside the indicated exercise directory.
  - The clients connect to 127.0.0.1 (same machine). For remote access,
    change the client IP address to the address of the server.
  - Press Ctrl+C to stop a server. Press Ctrl+D to end input in sum clients.
  - Examples 02-increment and 03-sum intentionally use one send()/recv()
    per exchange for simplicity. TCP can transfer fewer bytes per call.
    Example 04-sum-safe demonstrates how to handle partial transfers.
  - The sum uses unsigned 32-bit arithmetic (wraparound is possible).
  - All servers use SO_REUSEADDR to ease restarts after previous connections.
  - Examples are teaching code, not production network services.
