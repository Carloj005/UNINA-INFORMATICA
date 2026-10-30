# Application Layer: DNS, HTTP, and WHOIS (C socket examples)

Small, self-contained examples for a networking/socket-programming course.
The programs are written in **C** (not C++) and target Linux/WSL2.

## Files

| File | Purpose |
| --- | --- |
| `dns_lookup.c` | DNS hostname resolution with the historical `gethostbyname()` API and `struct hostent`, as shown in class. Prints canonical name, aliases, and all returned IPv4 addresses. |
| `http_unina.c` | TCP socket HTTP/1.1 client: resolves a host, connects to port 80, sends a `HEAD` or `GET` request, and prints the response. Defaults to a page on `www.unina.it`. |
| `whois_client.c` | Minimal WHOIS client: uses `getaddrinfo()` to resolve a WHOIS server, connects to TCP port 43, sends a domain followed by `\r\n`, receives and prints the reply. |
| `Makefile` | Builds the three executables. |

## Requirements

- Linux or WSL2 (e.g., Ubuntu)
- GCC and `make` (`sudo apt install build-essential` on Ubuntu if needed)
- Network access for remote DNS, HTTP, and WHOIS examples

## Compile

```bash
make
```

Or compile individually:

```bash
gcc -std=c11 -Wall -Wextra -Wpedantic -o dns_lookup dns_lookup.c
gcc -std=c11 -Wall -Wextra -Wpedantic -o http_unina http_unina.c
gcc -std=c11 -Wall -Wextra -Wpedantic -o whois_client whois_client.c
```

Run `make clean` to remove the executables.

## Example 1: DNS resolution (`struct hostent`)

```bash
./dns_lookup www.unina.it
./dns_lookup example.com
```

Omit the argument to use `www.unina.it` by default.

**Concepts:** DNS name resolution, `gethostbyname()`, `h_name`, `h_aliases`, `h_addr_list`, `inet_ntop()`.

> `gethostbyname()` is an older, IPv4-oriented API used here because it matches the lecture slide. For new applications, prefer `getaddrinfo()`, which supports IPv4 and IPv6.

## Example 2: HTTP request to Unina

```bash
./http_unina
./http_unina www.unina.it /chi-siamo/cenni-storici HEAD
./http_unina www.unina.it /chi-siamo/cenni-storici GET
```

Syntax: `./http_unina [host] [path] [GET|HEAD] [port]`.

- `HEAD` requests **response headers only** (no HTML response body).
- `GET` requests the resource (headers and, if returned, an HTML body).
- The program uses **plain HTTP (TCP port 80)**. Modern sites, including university websites, may redirect requests to HTTPS (e.g., status `301`/`302`, with a `Location` header). The example prints the redirect response but **does not follow redirects or support TLS/HTTPS**. Therefore it is not guaranteed to display the page HTML.
- This demonstration does not parse HTTP headers, decode chunked transfer encoding, or follow redirects. It prints the raw HTTP response.

**Concepts:** `getaddrinfo()`, TCP `connect()`, an HTTP request line and headers, `send()`, repeated `recv()` calls, `close()`.

## Example 3: WHOIS client

```bash
./whois_client com
./whois_client example.com whois.verisign-grs.com
./whois_client unina.it whois.iana.org
```

Syntax: `./whois_client domain [whois-server] [port]`.

- Default server: `whois.iana.org`; default port: `43`.
- **IANA WHOIS** primarily provides top-level-domain (TLD) and referral information, not necessarily full registration details for an individual domain.
- For `.com`/`.net` registrations, `whois.verisign-grs.com` is a more appropriate traditional WHOIS server.
- WHOIS server policies and output vary. Some WHOIS servers no longer offer detailed records, or require a different server; for current domain registration data the HTTPS-based **RDAP** service is often preferable.
- Outbound **TCP port 43** may be blocked by a firewall or network provider; the program will then be unable to connect even if the code is correct.

**Concepts:** `getaddrinfo()`, TCP port 43, application-level request terminated by CRLF, reading until the server closes the connection.

## Course notes

- These examples demonstrate the **application layer**, using socket APIs for underlying network communication.
- DNS lookup provides the IP address needed before making a TCP connection. The HTTP and WHOIS clients use `getaddrinfo()` for this step automatically.
- TCP is a byte stream: a single `recv()` call does **not** necessarily return a complete response. Both clients read in a loop until the peer closes its connection.
- Code deliberately emphasizes socket concepts, not production-ready HTTP or WHOIS implementations.
