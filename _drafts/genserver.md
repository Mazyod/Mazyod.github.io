---
layout: post
title: GenServer
date: PYSCRIPT_DATE
categories: 
- elixir
---

## Introduction

In the previous post, I didn't have enough space nor time to cover GenServers in Elixir, so this is a follow up to cover that.

## GenServer

GenServer stands for Generic Server. It's basically a server that you can spawn at runtime to server you various functionality. It is immune to race conditions and can do it's work synchronously and asynchronously, based on the function definition (as we will see in a sec).

Spend some time writing various GenServers, have them talk to one another, add them to the Elixir application supervision tree, and you should be golden.

Again, for illustration purposes, let's see an example:

{% highlight elixir %}
defmodule MyApp.Counter do
  # enable this module as a genserver
  use GenServer

  # this is the entry point to spawn a server
  def start_link do
    # just keep in mind :ok is passed to the init function below
    GenServer.start_link(__MODULE__, :ok, [])
  end

  # here, we define the "API" of the server

  def count(pid) do
    GenServer.call(pid, :count)
  end

  def increment(pid) do
    GenServer.cast(pid, :increment)
  end

  # now, we proceed with the server implementation

  def init(:ok) do
    # 0 is the state of the server
    {:ok, 0}
  end

  def handle_call(:count, _from, state) do
    # the first "state" we pass in, is the return value
    # the second "state" is the state of the server, which remains unchanged
    {:reply, state, state}
  end

  def handle_cast(:increment, state) do
    {:noreply, state + 1}
  end
end
{% endhighlight %}

That looks intimidating, even to me now, since I've been using ExActor for a while ... But, you really need to learn the basics before moving on. Just keep in mind that it get better. Once you learn GenServers the hard way, you can start utilizing ExActor to take care of the boilerplate crap.

So, what this?

### Start

To define an entry point for spawning a server, we have to define a `start` or `start_link` method. The difference is irrelevant now. The function simply calls into `GenServer` module to spawn and initialize a new process running our `Counter` server. The parameters we pass in are for initializing the server, but since this server is so simple, there is nothing to initialize.

### Init

Init is where you'd want to initialize your server state and prepare any data or timers. Once you're ready, you simply return `{:ok, state}` at the end. `:ok` indicates initialization was successful, and `state` is any arbitrary data you want the server to hold. In our case, the server's state is just a number.

### Cast vs Call

After that, we start defining the server API. What functionality do we want the server to provide? In this case, we want a way to increment the number of the server, and request that number sometime in the future.

We would like to implement the increment function asynchronously, so we don't block the caller as the server state is updated. We do that by calling `GenServer.cast` 

