title: Elixir Exits
tags: elixir
date: 2016-06-15 21:22:24+00:00

## Introduction

While working with Elixir and building a dope server, I came across an annoying error resulting from an "exit".

Exits in Elixir are propagated in processes similar to how errors and exceptions do in your other familiar languages. When a process exits abnormally, the "exit" hits the linked nodes, possibly crashing them if they don't handle the exit properly.

I won't be covering exits in details, since there is already a great resource that explains this concepts really well [over here][elixir-school]. What I will be covering is one painful place where an exit can kill your app!

## Taming GenServers

While running integration tests on my server, I noticed an annoying occasional error that kept occurring from time to time:

```text
** (EXIT from #PID<0.276.0>) exited in: GenServer.call(#PID<0.279.0>, :msg, 5000)
    ** (EXIT) no process
```

Hrm .. that's a pretty obvious error. We are attempting to do a `GenServer.call`, but the process we are calling into is not available. Looking at my code, and indeed. Sometimes I receive a late incoming message after the "Game Process" has been terminated, causing this error to be thrown.

"Simple enough!", I thought to myself. "I'll just check if the process is available before I perform any calls!"

```elixir
if Process.alive? pid do
  reply = Server.perform_call(pid)
end
```

Hmm ... On second thought, that won't do it. Care to spot the error in the code above?

Indeed, Elixir is a highly concurrent language, and if the process happens to exit after the `Process.alive?` check is evaluated, we will end up crashing nevertheless!! We need to improve this somehow ... How about being optimistic?

```elixir
try do
  # optimistically run the code expecting it to succeed
  Server.perform_call(pid)
catch
  # if it fails, we'll just absorb the error
  :exit, _ -> :ok
end
```

Looks good, doesn't it? Well, kind of. The code above does work as advertised, and it may make sense in many situations, but it doesn't make the most sense in my situation. You see, when you run into these issues in Elixir, the first solution you should think of is "how can I better refactor my code to avoid this error completely?". Is that possible? YES!

## Ideal Solution

After conceiving the previous error handling solution, I launched atom and started writing unit tests that reproduce the failing situation. After I wrote the tests, I ran then, and ... they didn't fail! WAT?!

Looking at the code, I am pretty sure I am triggering a `GenServer` call after the `GenServer` process has died .. But no exits are raised this time?

After looking closer at the code, I was actually testing against one of the methods that performed a `GenServer` _cast_ rather than a _call_. Since performing a call is suppose to return a reply, the `GenServer` throws an error, since no reply is gonna be given back! But if we do a `cast`, there is no reply anyway, so the message fails silently...

Once I realized this neat property of `call` vs `cast`, I simply realized that the best solution is to decouple my phoenix channel process from the game state process, by always perform casts instead of calls. If there is a result to be sent back to the client, the game state will just push the event from within.

## Conclusion

Even though time is super scarce these days to be writing blog posts, these types of stories and encounters are the reason I have this blog in the first place, so indeed .. It would be foolish to skip on this.

The quality of the post is admittedly bad and vague at best, but it hopefully delivers at least once useful lesson:

> Always be casting!

[elixir-school]: https://elixirschool.com/lessons/advanced/error-handling/#exiting
