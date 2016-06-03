---
layout: post
title: Phoenix Channel with a User
date: 2016-06-04 00:47:29+0300
categories: 
- phoenix
---

## Introduction

[Phoenix][phoenix-link] is a productive web framework written in Elixir. It excels in many things, but nothing nearly as amazing as realtime websockets.

Phoenix provides an abstraction over soft-realtime communication called "Channels". This basically handles structuring realtime communication for you. The way this structure works is out-of-scope for the moment, so please read on it from the Phoenix docs. It is really close to the Socket.IO model.

Onto the actual post!

## Say My Name

So, assuming you know what Phoenix channels are by now, let's look at an interesting problem you might easily find yourself handling: User data.

Assuming you only allow authenticated users to have access to your websocket connection (hint: good idea), you will need connecting clients to send some sort of credentials. Using these credentials, you can authenticate the user, and move on.

Since usually we would want to perform user-related actions throughout the span of the client's connection, this means we should associate the socket connection with that particular user somehow for later reference. Easily enough, we read the docs inlined in our `user_socket.ex` file and find:

{% highlight elixir %}
assign(socket, :user_id, verified_user_id)
{% endhighlight %}

Nice! We can assign arbitrary data to our socket, and it will be accessible on all our channels through `socket.assigns`! .. Not so fast. What should we actually store there? `user_id`? The whole `User` object? Something else?

### User Object

For my use case, I rely heavily on the user data, like the username and rating, so I decided to just assign the whole User object to the socket and move on. This served me quite well during the development process, and didn't cause any issues.. Until I reached the part of the implementation where I need to process and update user data.

You see, Elixir is a functional programming language, so everything is passed by value. The User object we assigned to the socket is no exception. With that in mind, it means I can't easily update all User objects being passed around the socket and channels easily.

Moreover, I was tempted in several places to update the user data on the DB using the `User` object I had .. But it could be outdated! That looked really dangerous, and had to be eliminated altogether.

### User Id

Let's just follow the guide and use `user_id`? NO. This will result in the need to make synchronous DB calls, which will render the whole reason we are using realtime websockets useless. It would also make the code unbearable.

This could work for other use cases where the user data isn't needed directly in the channels, but rather used in workers or background services. In that case, passing `user_id` around would be your best options.

### Global

The first solution I tried was so stupid, lol. I created a `GenServer` to hold the `User` object, and called it `UserService`. This process is registered globally, and hence can be accessed from anywhere! This would eliminate the update issues as well as the performance concerns. In fact, this service would perform updates quickly on its own state, then dispatch an async DB task. Sounds great!

The issue really became glaring once I started running the tests. Unless I create a new user for every single test, I'll have to properly clean up any running user process once each test is over... This is because after the first test runs and registers the user process globally, the second test then attempts to register the user process again, resulting in an error.

There are way to circumvent this particular issue, but that wouldn't overcomplicate the software at hand, making future me a sad panda. Instead, I took a step back and decided to simplify the solution.

### Ephemeral

Of course! First, instead of passing the process around and dealing with such an obscure data type, I decided to pass a `Player` object. `Player` is a struct with a subset of the `User` data, namely just the `username` and `rating`. I figured out that this is all I need, really! By moving to this new type, I am also safe from updating the actual `User` object using outdated info, since I can't simply use the `Player` object to update the user, I need the `User` object.

Then! In the places where I was actually performing the user updates, I simply spawned a new `UserService` process! With the new process, I perform all the updates I need, then simply wait for the process to expire and perish. No global state involved, still performant as hell, and encapsulated within `UserService`.

## Wrapping Up

Let's quickly skim over the final architecture we reached:

Once the client connects using a token, we authenticate the user, while fetching her data. We take a subset of that data and assign it to the socket.

As the user connects to channels and starts interacting with the server, we use this subset to perform the basic operations we need. Once we need to actually update the user's data, we spawn a `UserService` process, which has the available operations implemented. We perform the operations we need, and leave it to expire and die, cleaning up itself.

## Conclusion

That's it .. The fact that I can easily explain such a sophisticated topic with such simple terms is really a testament to the platform itself.

Elixir. Phoenix. Thank you.

[phoenix-link]: http://www.phoenixframework.org/
