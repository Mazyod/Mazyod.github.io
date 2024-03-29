---
title: "Skinning a Cat"
category: python
date: 2023-11-25T20:50:23Z
---

## Introduction

I find the saying "There's more than one way to skin a cat", just as much as the
next guy, quite morbid and gruesome. And yet, I like to use it and tell myself
that people aren't really skinning cats for sport or professionally, it's just a
saying. So the cat we are going to skin today is Visual Studio Code.

I can't believe I somehow, completely off-handedly and irresponsibly, added yet
another opinion to the heated question of whether VS Code is an Editor or an
IDE. I'm making a case it's a cat, apparently.

## Digging Tunnels

We recently got hold of the hottest piece of hardware on the market these days..
The glorious A100 GPU. Granted, the H100 eclipsed it, and next year we will see
the H200 and B100, however, for simple people like myself, the A100 is the best
hardware I could realistically expect to work with. Now, we have it.

This beast of a hardware has been installed in a data center at an undisclosed
location somewhere on earth, and attached to a Linux VM for us to use it
through. As soon as we were given access, we immediately fired up our browsers,
navigated to the JupyterLab service we previously prepared on this VM, and
started mining crypto in the name of "Benchmarking the System".

JK, of course, I would never admit to such illegal use of company hardware
_pfft_.

OK, in all honesty, we simply logged in to JupyterLab, pulled some 7B, 13B, 30B,
and 70B parameter LLMs, and let 'em rip on the GPU.

We .. Were .. Blown .. Away.

The fact that high quality models, like the [llama2 13B][llama-13b], loaded
pretty quickly, and started giving us wealth of knowledge to use was incredible.
My brain felt like fireworks were going off in it as I was thinking of all the
possibilities. At the same time, I also realized that JupyterLab isn't
necessarily the ideal environment for maximum productivity. Users shared the
same environment, it didn't have powerful extensions like VS Code, and it was
restricted in many ways.

It was time to dig some tunnels.

## The Cat

Visual Studio Code was our cat of choice. We primarily use it for Python, but it
also works well for Javascript development when we need to work on the frontend.
I started exploring remote development on VS Code back in 2021, I think, and at
that time, my goal was simply to write code on the go on my iPad, saving me the
hassle of carrying my laptop around (since I was already carrying my iPad
around).

### Code Server

I started with [Code Server][code-server], which is a project that aims to bring
VS Code to the browser. It was a bit annoying to setup (running it on Docker,
deploying it, connecting my stuff, security concerns, etc), but it worked well
enough. My biggest pain point by far, though, was the lack of extensions. I had
started using Github Copilot to write most of my code, as well as other
Microsoft extensions for Python development, and none of them were available on
Code Server.

Another serious issue I had was syncing my projects across devices. I always had
to save my changes, push to git, pull from the other device, even though it was
just me working on the project. Soon enough, I was able to get access to VS Code
private beta of their remote development extension, aptly named "VSCode Server".

### VSCode Server

[VSCode Server][vscode-server] was a retaliatory move by Microsoft to counter
the success of Code Server (I speculate). It unlocked the full power of VS Code
along with all the extensions we know and love. It was also much easier to
setup, since it was just a VS Code extension. And yet, there was still a catch.

You see, when I switched to VSCode Server, I needed a safe way to connect from
my iPad to whichever machine I was working on. Luckily, I stumbled upon
NordVPN's new feature at the time, Meshnet. It was an additional feature that
made any device connected to NordVPN appear on the same network, as if they were
all connected to the same router. :mind-blown:

If only it worked as reliably as it sounded.

Sadly, after the initial euphoria, I realized that the connection was
unreliable, and I would often lose connection to the remote machine. After some
time, I gave up on it, and came to terms with the fact that I would have to
carry my laptop around with me.

## Same Cat, Different Tunnel

Sorry for the unannounced segue regarding my previous attempts at remote
development outside work, but I felt it was necessary to set the stage for the
next part of this post.

So, let's get back to the A100 GPU and our local development needs.

### Corn Kernels

Since we were already running JupyterLab on the VM, the immediate solution that
came to mind was to use JupyterLab's VS Code extension to select a kernel
running on the VM, and use that to run our code. This worked seamlessly, and
honestly, I thought I as done then and there.

However, we quickly realized that code referencing broke. VS Code showed
squiggly lines under all the imports, and we couldn't navigate to the
definitions of any of the functions we were using. This was a deal breaker for
us.

Another side effect was the lack of structure parity between the local project
and the actual environment. For example, if you want to import a local file, or
use an LLM, you need to reference it from the remote server, which made it very
awkward to work with.

### Being a Good Host

At that point, I was like, no problem! We will just install Python 3 on the VM,
and use that as an SSH host similar to how we were using WSL2 on Windows
locally.

Since we are using RHEL 7, it had python 2.7 installed by default. So, I fired
up [perplexity][perplexity], and it gave me a perfect, step-by-step guide on how
to install Python 3 from source. I had to do it this way, since yum was
outdated, and I didn't want to risk downloading potentially incompatible
packages from other sources. The installation went fine, until I started the
REPL, and it turned out I now needed to install/compile openssl, sqlite, and a
bunch of other stuff. `(╯°□°）╯︵ ┻━┻`

### The Devil's in the Container

Since we deploy all our services on Docker, it made sense to give Docker a shot
at this. I wanted to try using Dev Containers for a while, but never had a good
reason to do so. This was the perfect opportunity.

I struggled for a bit at first, since the default dev container settings I had
was showing a warning as deprecated, while the new format didn't yet have enough
documentation and examples online. I eventually figured it out, but it was just
for running a local container as a dev environment. I needed it on the GPU VM.

I first tested the obvious way, which is to connect to the host through VS Code
SSH, then manage the dev containers. This kinda worked, but now you are in this
inception-like situation where you are connecting to a VM through SSH, to run a
container also on the remote host. Not a big fan.

I then researched on how to use the `DOCKER_HOST` environment variable to
connect the local docker client to a remote docker daemon. This had the
potential to eliminate the need for the SSH step, however, it introduced a new
more serious problem. When VS Code tries to prepare the dev container, it
symlinks the local project to a folder, which is then mounted to the container
as a volume. We can't symlink the local project to the VM, obviously.

### The Final Boss

As the weekend came around, I was thinking about what to try next, since it
seemed like such a simple problem! As I was thinking about the simple facts and
the problem I'm trying to solve here, I realized that I could just have a remote
container which the local VS Code can SSH into, just like WSL. I mean, just
because we will be running the code in a container, doesn't mean we have to use
dev containers!

This is the step we are at right now, honestly. Just setting up a simple
container that exposes an SSH server, and allows VS Code to connect to it
directly, without the need to go through the host first. An initial PoC showed
some promising results.

## Conclusion

I've been reading Elon Musk's biography, by Walter Isaacson, and I have to say,
it's been a very inspiring read. I shall impart a prat of the book I found
particularly useful to apply at work:

The Algorithm:

1. Question Every Requirement
2. Delete as Much as Possible
3. Simplify and Optimize
4. Automate
5. Accelerate

[llama-13b]: https://ollama.ai/library/llama2:13b
[code-server]: https://github.com/coder/code-server
[vscode-server]: https://code.visualstudio.com/docs/remote/vscode-server
[perplexity]: https://www.perplexity.ai/
