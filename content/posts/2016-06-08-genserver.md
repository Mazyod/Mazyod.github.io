title: GenServer
tags: elixir
date: 2016-06-08 17:42:57+00:00

## Introduction

In the previous post, I didn't have enough space nor time to cover GenServers in Elixir. This is a follow up to cover just that. Before actually talking about GenServers, let's discuss the design pattern behind it, namely, the Actor model.

## Cameras, Light, Action!

The actor model is an architectural design pattern that dictates how you structure your code. The basic building block in this design pattern is the "actor", hence comes the name. So, what is an actor?

An actor is a self-contained entity that has it's own model and logic. You can think of an actor as a small application running within your application! It is self-contained, so no one can access the actor's memory directly. In order to do useful things with actors, we use message passing to facilitate data flow and perform useful tasks.

In languages such as C++ and Swift, we usually see actors running in their own threads. This is perfect for concurrent applications, since you can then make use of as much CPU cores as you have. However, threads are not light-weight and can get rather computationally expensive.

That's why in Elixir, we have Erlang VM processes, which are super-light weight processes that provide us with the same features as OS processes, but can be created within a few µs.

Enough with the theoretical talks, and let's talk using some real examples.

### A Game Server

Since I'm building a game server with Elixir, I'll derive the example directly from how I built the backend.

First off, I define some global actors that are always needed and provide useful, persistent functionality to the rest of the application. Some of these actors include:

#### The Referee

The referee is an actor that accepts a `Game` object for further processing. That's it! So, for example, whenever a game ends on the server, we send the associated `Game` object to the referee, and move on. The referee looks at the `Game` object, and updates the players rating, stats, and rewards.

### The Matchmaker

Another interesting actor is the Matchmaker. It has a runloop that triggers every 5 seconds to process the players in the matchmaking queue, and matches them together so they can start playing a game. You send it the player data along with the "channel pid", and once it finds a match, it will respond to the "channel pid" with the result.

You don't have to worry about what "channel pid" is, but for the curious, it is like the "address" of the player actor. So, we use the address to communicate the result back to the player.

## GenServer

`GenServer` stands for Generic Server. It's basically a server that you can spawn at runtime to server you various functionality. It is immune to race conditions and can do it's work synchronously and asynchronously, based on the function definition (as we will see in a sec). With these features in mind, it makes it the basic building block for creating actors in Elixir. 

To get comfortable with GenServers, spend some time writing various GenServers, have them talk to one another, add them to the Elixir application supervision tree, and you should be golden.

Again, for illustration purposes, let's see an example:

```elixir
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
```

That looks intimidating, even to me now, since I've been using ExActor for a while ... But, you really need to learn the basics before moving on. Just keep in mind that it get better. Once you learn GenServers the hard way, you can start utilizing ExActor to take care of the boilerplate crap.

Before breaking this down and understanding it, let's run it!

### Execution

Simply, create a `counter.ex` file somewhere, and paste in the code above as is. Then, navigate to that file's directory in terminal, and launch `iex`. Once `iex` is launched, execute `c("counter.ex")`. This should load the `MyApp.Counter` module into `iex`.

We can then test the counter like so:

```elixir
iex(1)> c "counter.ex" 
[MyApp.Counter]
iex(2)> MyApp.Counter.
count/1         increment/1     start_link/0    
iex(2)> {:ok, c} = MyApp.Counter.start_link
{:ok, #PID<0.67.0>}
iex(4)> MyApp.Counter.count c
0
iex(6)> MyApp.Counter.increment c
:ok
iex(7)> MyApp.Counter.increment c
:ok
iex(8)> MyApp.Counter.increment c
:ok
iex(9)> MyApp.Counter.count c       
3
```

Yay, so it works! Let's take a close look as to why it works.

### Start

To define an entry point for spawning a server, we have to define a `start` or `start_link` method. The difference is irrelevant now. The function simply calls into `GenServer` module to spawn and initialize a new process running our `Counter` server. The parameters we pass in are for initializing the server, but since this server is so simple, there is nothing to initialize.

The start function returns a tuple `{:ok, pid}`, which we can pattern match against in order to extract the pid, which is the server address. We need it in order to perform the operations.

### Init

Init is where you'd want to initialize your server state and prepare any data or timers. Once you're ready, you simply return `{:ok, state}` at the end. `:ok` indicates initialization was successful, and `state` is any arbitrary data you want the server to hold. In our case, the server's state is just a number.

### Cast vs Call

After that, we start defining the server API. What functionality do we want the server to provide? In this case, we want a way to increment the number of the server, and request that number sometime in the future.

We would like to implement the increment function asynchronously, so we don't block the caller as the server state is updated. We do that by calling `GenServer.cast` in the API methods. This means, if we have a long running operation running after the call is made, the process performing the call will not block and wait for a response, it will simply move on.

However, if we want to implement retrieving the counter value, the caller process must block and wait for the response from the server with the counter value. We can instruct the caller to do that by using `GenServer.call`. After calling into the Counter server for the counter value, we use `{:reply, state, state}` to return the counter value.

The first `state` is just the return value to the caller. The second `state` means we want to maintain the current state of the server without changing anything. So, if for any reason we want to clear the counter after it has been read, we can do:

```elixir
def handle_call(:count, _from, state) do
  {:reply, state, 0}
end
```

Finally, note the function signature of the `handle_call` and `handle_cast` methods, and how they are different. The `handle_call` takes one more extra parameter, which is `from`. `from` is the pid of the caller! Since it is blocking and waiting for a response, you may not have a result yet, so you want to "reply later". This will allow you to reply whenever you want.

## ExActor

After looking at the previous example, let's look at how we can use the `ExActor` library to really simplify how we implement actors and GenServers in Elixir.

```elixir
def MyApp.Counter do
  use ExActor

  def start_link, do: initial_state(0)
  defcall count, state: state, do: reply(state)
  defcast incr, state: state, do: new_state(state + 1)
end
```

I know, this is absurdly OP!! We no longer have to define API methods and handler methods. We no longer have to worry about the function signatures nor the syntax of how we reply at the end of the function. This is objectively awesome and simple, and enhances readability A LOT.

The reason you should use vanilla `GenServer` before jumping on `ExActor` is because of ambiguity that `ExActor` introduces. For example, in `ExActor` there is no `pid` parameter passed into `count` and `increment` functions, even though we still need to pass in the pid of the server. This is taken care of by the library, but one may be confused by such details if they didn't try using vanilla `GenServer` first.

## Conclusion

The journey to master GenServers doesn't end here. I've missed out a lot of details because of time constraints. Details include passing in a name for the server, message handling using `handle_info` and other tips and tricks to make the most out of this extremely useful toy.

Don't get intimidated, tho. Once you've mastered `GenServer`, IMHO, you are good to go to use Elixir in your own projects.
