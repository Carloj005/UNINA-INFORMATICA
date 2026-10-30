# Socket programming: UDP Broadcast and Multicast Chat

Examples in **C** for a computer networks / network programming course.

These programs show **how applications use socket options to request IPv4 network-layer behavior**, without examining the underlying routing or group-management protocols yet.

## Files

| File | Purpose |
| --- | --- |
| `broadcast_sender.c` | Sends one UDP datagram to an IPv4 broadcast address using `SO_BROADCAST`. |
| `broadcast_receiver.c` | Binds to a UDP port and prints received datagrams and their sender addresses. |
| `multicast_chat.c` | A small peer-to-peer multicast group chat. Each instance both sends and receives UDP datagrams; `select()` monitors keyboard input and the UDP socket. |
| `Makefile` | Builds the three programs. |

## Requirements and compilation

- **Linux or macOS** terminal with a C compiler (`cc`, `gcc`, or `clang`) and `make`.
- On Windows, use a Linux environment such as **WSL** (network behavior can vary with the WSL configuration).
- A local network that allows IPv4 broadcast/multicast traffic for tests involving multiple computers.

From the extracted folder:

```sh
make
```

This produces `broadcast_sender`, `broadcast_receiver`, and `multicast_chat`.
To remove the executables:

```sh
make clean
```

Without `make`, compile each example manually:

```sh
cc -std=c11 -Wall -Wextra -o broadcast_sender broadcast_sender.c
cc -std=c11 -Wall -Wextra -o broadcast_receiver broadcast_receiver.c
cc -std=c11 -Wall -Wextra -o multicast_chat multicast_chat.c
```

## Example 1 — UDP broadcast

**Terminal 1** (receiver):

```sh
./broadcast_receiver
```

The receiver binds to `0.0.0.0:5001` (all local IPv4 addresses, UDP port 5001).

**Terminal 2** (sender):

```sh
./broadcast_sender "Hello, broadcast!"
```

The default destination is `255.255.255.255:5001` (limited broadcast).
You can also specify the broadcast address for your subnet, e.g. on a **192.168.1.0/24** network:

```sh
./broadcast_sender "Hello, local network!" 192.168.1.255
```

**Important:** `192.168.1.255` is a broadcast address only if the subnet mask makes it one (for example `/24`); use the actual broadcast address of your network. Different networks, Wi-Fi access points, and firewalls may restrict broadcast traffic. IPv4 broadcast is not normally forwarded through routers.

You can customize the port (use the same port on both sides):

```sh
./broadcast_receiver 6001
./broadcast_sender "Hello!" 255.255.255.255 6001
```

Key socket call:

```c
setsockopt(sock, SOL_SOCKET, SO_BROADCAST, &enabled, sizeof(enabled));
```

## Example 2 — UDP multicast group chat

Open **two terminals** (on one computer or two computers on the same multicast-enabled LAN) and run in each:

```sh
./multicast_chat
```

Both instances join **239.255.0.1:5000**. Type a message and press Enter in either terminal. Every reachable member of the group can receive it. Each program uses **one UDP socket** for sending and receiving; there is **no central chat server**.

Type `/quit` and press Enter to exit, or press Ctrl+D on the input terminal.

To choose a different group and port, all participants must agree on both:

```sh
./multicast_chat 239.255.0.2 6000
```

Important socket options:

- `IP_ADD_MEMBERSHIP` (`IPPROTO_IP`): request to join the IPv4 multicast group on an interface selected by the OS (`imr_interface = INADDR_ANY`).
- `IP_MULTICAST_TTL = 1` (`IPPROTO_IP`): keep multicast datagrams within the local subnet; routers do not forward them beyond the first hop.
- `IP_MULTICAST_LOOP = 1` (`IPPROTO_IP`): permit local multicast loopback; **you may see your own messages**.
- `SO_REUSEADDR` (and `SO_REUSEPORT` where available): help multiple instances use the same UDP port.

The chat uses `select()` to monitor both `STDIN_FILENO` (keyboard) and the UDP socket. When a descriptor becomes ready, it uses `fgets()`/`sendto()` or `recvfrom()`/`printf()`. Both readiness checks are **inside** the `while` loop and are **independent `if` statements**, since both descriptors can be ready at once.

## Notes for students

- These are **IPv4/UDP examples**. UDP does not guarantee delivery, ordering, or protection against duplicates.
- `bind(..., INADDR_ANY, port)` listens on the specified UDP port across local IPv4 addresses; it is **not** the destination multicast address.
- `ip_mreq.imr_multiaddr` specifies the multicast group, and `ip_mreq.imr_interface` selects the local interface (using `INADDR_ANY` lets the OS choose).
- Multicast reception may depend on local interface selection, routing, firewall rules, Wi-Fi isolation, and OS configuration. On a machine with multiple network interfaces, the OS may select an unexpected interface. The examples intentionally use the simplest default-interface setup.
- Local broadcast and multicast behavior can differ in virtual machines, containers, VPNs, WSL, and managed campus/Wi-Fi networks. Start testing on one host or a simple LAN.
- The examples send **short text messages** (at most 1023 bytes per received datagram). The input chat example is intended for interactive terminals, not as a production chat system.

**Conceptual boundary for the course:** socket options configure/request behavior in the local network stack. The mechanisms used by routers and hosts to manage multicast groups and forward packets belong to the **network layer** and can be studied later (e.g. IGMP and multicast routing).
