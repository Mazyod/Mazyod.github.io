title: 'HTTP Game Server: The Rewrite'
categories:
- api
- appengine
- backend
- design
- gae
- game
- google
- http
- kod
- multiplayer
- restful
- scalable
- server
- turn-based
- c++
comments: true
date: 2015-05-05 18:03:22+00:00

## Introduction

I've stopped blogging for a while, and for no good reason, really. I will not make up any excuses, but will try to get the ball going once more.

## The Past

I've been blogging recently about my experience regarding building a game server on top of Google Appengine, and it was a nice journey. The game server was running pretty nicely, the tests were well integrated, and everything seemed to be on the right track. Except, when you think everything is going fine, nothing is.

As of last month, I completely steered away from the Google AppEngine platform, and no longer maintaining that HTTP game server. I am glad (I think) the game hasn't been shipped yet, so I can easily change gears without really affecting anything.

But, what happened?

As I started writing more and more client code, things quickly started getting ugly. In order to fix the client, I needed to update the backend. The backend already had tons of tests, so I needed to update those as well ... That's when I lost the last thread of patience with Google AppEngine.

To be honest, the issues isn't really with Google AppEngine in itself, rather it was the language and the Restful API design.

## What Now?

In order to write proper client networking code, I started utilizing the Poco C++ libraries. After using those libraries and tinkering around with other library components, I realized how amazing this library is, and how I can simply write the whole goddamn system on top of Poco, so it started.

So, halfway through writing the client networking library code, I split the common networking part into a separate library, and started a new C++ server project that utilizes this shared library. Now, changing a single library will update both client and server!! NEAT!

Not only that, but I also lost a shitload of time trying to implement a restful service in C++. After going through the implementation more and more, I kept refactoring till I finally reached a very minimal and functional client-server architecture!

I reached this amazing design about 3 days ago, and I already have user registration, login, sessions, and matchmaking up and running. I had few small issues, but progress has never been faster. Finally, I can say that all that is left is grunt work of rolling out all the functionality, and then integrating it into the game.

## More Guts and Gore

To share more insight on the design, here are some details:

### What is Shared, Exactly?

The shared code is mostly entity classes that know how to serialize and unserialize themselves. This allows us to instantiate objects on the client/server then transport them and recreate them easily on the other side. Since it is a shared library, changing things will automatically reflect on both sides.

This means we don't even require a transport spec between the client and server, since the serialization happens in the shared library as well. 

Another amazing benefit is sharing actions and results. Now, whenever we want to perform an action from the client, the actions are all defined in the shared library, and so are the possible results. This allows the server to know what actions are possible, and the client to know what the possible results are, as well. Amazing.

### How to Write Such Things?

This is C++, and it is not the most usable language. Actually, it is by far the most unusable language I care about. I had issues with templating, passing data around, but mostly, objects life time.

After learning about the benefit of value types, and how they contribute to reducing overall system complexity, I dedicated myself to write as much value types as possible. I don't really care at this point about efficiency, I care about correctness. There are some edge cases where pointers and dynamically allocated memory was necessary, and `std::shared_ptr` was the star there, and I never had to manually manage any memory at all.

To top it all off, I dedicated myself to writing a single threaded server. There was no need to deal with multithreading and the dreaded consequences that comes with it. Instead, even though the server is multithreaded, it dispatches all the work on a queue that gets consumed by a single thread. All the business logic runs exclusively on that thread.

## Conclusion

Hopefully this will lead to a HTTP Game Server series rewrite, and if you are lucky, I really want to open source this and make it a starting point for all game developers out there.
