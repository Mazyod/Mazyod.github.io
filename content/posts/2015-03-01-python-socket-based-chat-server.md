title: Python Socket-Based Chat Server
categories:
- python
- chat
- server
- backend
- development
- programming
- snippet
- tutorial
- socket
- udp
comments: true
date: 2015-03-01 17:16:41+00:00

Recently, I wanted to write a voice chat app that is built using a UDP socket server. UDP for ultimate speed, and reliability doesn't really matter in this case.

This was suppose to be in GoLang, but it was so crappy trying to write it in Go, so I switched gears and did it in Python instead.

The first lesson I learned is that UDP doesn't have the `accept` method that TCP implementations usually have. If you're going the UDP route, you just open a UDP socket that listens to all traffic coming to a specified port. This implied two things:

1. Accept is usually used to create a connection with reliable channel with a client, and returns the address to you. In the UDP case, we don't have accept, so we can only get the address once we start receiving data from a user.
2. Checking if the user disconnected is no longer possible, our only way is to attempt to send a packet to the client, and check if an error is raised.

When I wrote this code, I thought that I needed to open a socket for each client, that's why I have an array of ports in the beginning. That is not necessary, all I need to do is record the address the packets are coming from, and broadcast the packets there.

The whole idea is really simple:

1. Open a UDP socket
2. Wait for data
3. On data received:
    a. Record the address
    b. Broadcast that data to all the other recorded addresses
4. Go to 2

Finally, to make the architecture simple, I have a producer thread, which is the socket listener. It listens to data, and adds data to a queue. I also create a consumer thread, which consumes the produced data by broadcasting it to the known clients.

For data synchronization between threads, I use python `Queue`, which is a thread safe queue.

Here is the code:

```python
"""
Created On: 2/27/15
"""

__author__ = 'mazyod'

import socket
import logging

from threading import Thread
from Queue import Queue

from serverutils.logutils import ubuntu_logger as logger


clients = {}

def queue_sync(sock, queue):
    """
    :type queue: Queue
    """

    while True:
        logger.info("Ready to send")
        data = queue.get()
        logger.info("Sending: {}".format(data))

        for k, v in clients.items():
            if k != sock:
                sock.sendto(data, v)


def serve(sock, queue):

    while True:
        logger.info("Ready to receive")
        data, addr = sock.recvfrom(4096)
        clients[sock] = addr
        logger.info("Received: {} from {}".format(data, addr))
        queue.put_nowait(data)


if __name__ == '__main__':

    ports = [5241, 5240]
    socks = []
    queues = []
    threads = []

    logger.addHandler(logging.StreamHandler())

    for port in ports:
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.bind(('0.0.0.0', port))
        socks.append(sock)

        q = Queue()
        queues.append(q)
        t = Thread(target=serve, args=(sock, q))
        t.start()
        threads.append(t)

        t = Thread(target=queue_sync, args=(sock, q))
        t.start()
        threads.append(t)

    try:
        map(Thread.join, threads)
    finally:
        map(socket.socket.close, socks)
```

