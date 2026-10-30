# TCP echo: two client-side concurrency exercises

**C / POSIX / Linux**. Two complete TCP servers and one *sequential* TCP client.
The client exercises are deliberately **not solved** in this package.

## Included files

| File | Description |
|---|---|
| `server_thread.c` | Concurrent echo server: one detached `pthread` per connection |
| `server_select.c` | Single-threaded multiplexing server: `select()`, `allset`, `rset`, `client[]` |
| `client_basic.c` | Sequential request/reply echo client, with TODO/hints for both exercises |
| `Makefile` | Builds all supplied programs; includes rules for student implementations |

## Build and run

```sh
make
```

Terminal 1 (multiplexed server):

```sh
./bin/server_select 9091
```

Terminal 2 (initial client):

```sh
./bin/client_basic 127.0.0.1 9091
```

Run a second client from a third terminal to see that the server can accept
multiple connections on the same listening port.

To run the threaded server instead (stop the other server, or use a new port):

```sh
./bin/server_thread 9090
./bin/client_basic 127.0.0.1 9090
```

## Exercise A: client using select()

**Goal:** Make a *single-threaded* client able to send new messages while it is
still waiting for previous echo replies.

1. Copy `client_basic.c` to `client_select.c`.
2. Monitor the keyboard (`STDIN_FILENO`) and the connected socket with `select()`.
3. When standard input is readable, read and send the available bytes.
4. When the socket is readable, `recv()` and display any bytes received.
5. On keyboard EOF (Ctrl+D), stop sending via `shutdown(fd, SHUT_WR)`, but
   continue receiving until the server closes its sending side (`recv() == 0`).
6. Compile and test:

```sh
make bin/client_select
./bin/client_select 127.0.0.1 9091
```

**Hints:** `FD_ZERO()`, `FD_SET()`, `select()`, `FD_ISSET()`.
Rebuild your `fd_set` before **each** `select()` call. Remember to handle
`select()` errors (including `EINTR`) and avoid calling `recv_exact()` after
sending: that would reintroduce the old request/reply blocking behaviour.
Prefer `read(STDIN_FILENO,...)` to `fgets()` in the `select()` loop because
`stdio` may read ahead into a userspace buffer.

## Exercise B: client using pthreads

**Goal:** Achieve the same independent input/output behaviour using **two
threads**, *not* using `select()`.

1. Copy `client_basic.c` to `client_thread.c`.
2. Use one thread for keyboard input and `send()` to the server.
3. Use the other thread for receiving from the socket and printing the echo.
4. Do **not** call `recv_exact()` after each `send()`.
5. On Ctrl+D, call `shutdown(fd, SHUT_WR)` (half-close: no further sends),
   then `pthread_join()` the receiver and finally `close(fd)`.
6. Compile and test:

```sh
make bin/client_thread
./bin/client_thread 127.0.0.1 9091
```

**Hints:** `pthread_create()`, `pthread_join()`, `recv()`, `shutdown()`.
For a minimal solution, use `main()` for keyboard/sending and one worker
thread for socket receiving. `pthread_create()` returns an error **number**,
not `-1`; use `strerror(err)` to describe a failure.

## Visualising the difference

The threaded server can intentionally delay replies, **independently for each
client** (example: 2000 milliseconds):

```sh
./bin/server_thread 9090 2000
```

Connect **any** client to this server. Type several lines quickly:

- `client_basic`: waits for an echo before taking the next line.
- `client_select` / `client_thread`: can send further text without waiting
  for the previous echo (and can show a reply while keyboard input is pending).

The basic client still works when the server is multiplexed, and both upgraded
clients still work with the threaded server. **Client and server concurrency
models are independent.** A server does not require clients to use the same
model. All three clients open one TCP connection; the pthread-based client
uses two threads *on that same socket*.

## Notes

- TCP is a **byte stream**, not a message protocol: a single `recv()` may
  return part of one line, one line, or pieces of several lines.
- These examples assume small inputs and blocking `send_all()` calls. Even a
  `select()`-based client or server can still block during large sends or
  other blocking operations. Fully nonblocking software needs output buffers
  and write readiness as well.
- The `select()` server uses `FD_SETSIZE`-bounded descriptor sets. `FD_ISSET()`
  checks membership; it does not remove a descriptor. `rset = allset`
  restores the descriptors before the next `select()` call.
- The optional echo delay is on the **threaded** server only. Deliberately
  sleeping inside the single-threaded `select()` server would suspend handling
  of **all** clients during the sleep.
- Ctrl+C stops the servers; Ctrl+D finishes keyboard input on the client.
- Classroom code, not production-ready: no authentication, TLS, asynchronous
  error protocol, per-client backpressure management or graceful server stop.
