---
layout: post
title: A Game Dev Tale
date: 2016-05-23 22:42:36-0400
categories: 
- game-dev
---

## Introduction

The main reason I sit on the computer these days and write code is mostly to ship a game .. A game that has become a serious stigma I can no longer ignore.

There are so many tales and angles to this journey, I cannot hope to cover it all in one post.. In fact, I started this post to write about integrating C with Elixir, and the introduction ended up being so long, to the point that it warranted a post in itself! So, let's leave the C and Elixir part, and take a look at how the development the game's backend underwent.

So.. Come a bit closer and hear, for there are some lessons for the programmer folk.

## Seeking the Truth

So, during my insane 4-year game development journey, one of my main sources of distress was the Game Logic. Since the beginning, I've decided to use C for performance and portability. I __really__ need C performance, and maybe even parallelism if this game makes it. Then there is portability, which is for the sake of running the code on the client and server... Here is where things get hairy.

### The Fox

The first server I wanted to use was SmartFoxServer or Photon server (mid 2013), but they had "lacking" capabilities, or so I thought. SmartFox didn't have great C++ client library support, and Photon didn't allow for custom game logic to run in the cloud (urgh, I didn't even need that back then). 

When I say the client library was bad, I mean it took me around a week to just compile it. It wasn't just me, people all over the SmartFoxServer forums were confused with all the issues the library had. Once it compiled, yeah, it crashed, and was no longer a feasible approach..

That made me go all custom backend, and start writing a game server using GAE and python.

### The Snake

The Python road was kinda documented on this blog a bit (late 2013 - mid 2014), and it was an utter disaster. For whatever reason, I thought I was doing things right, by incrementally building features, without a clear overview nor goal of the final backend...

To give you a glimpse of the issues, we can separate the issues into different groups, based on the source of the issue:

__GAE__

GAE was a promising platform back in 2013, but severely lacking. Getting SSL calls to work locally, you had to hack the GAE code. To run sockets, you had to add a payment method, which they promise they won't deduct from, but they eventually do. And of course, to run background jobs on GAE, you could only schedule 1-minute interval cron jobs ... How limiting.

Testing GAE was horrible. Period. You gotta setup a testbed, do some various crap, just to be able to test a limited part of the code ... Damn... I ended up writing functional tests rather than unit tests, which as we all know, aren't viable for quickly catching bugs during development.

An important problem that I completely ignored here was the game logic. I had no way to run C code on GAE, so I was gonna depend on the client code being 100%, which will __never__ go well .. Yeah ...

Now, after gaining some experience about backends, I could've solved the background jobs as well as the C library stuff using RPC. GAE has great RPC support, but oh well.

__REST__

REST APIs are horrible for games. I don't care about all the hacky workarounds that people have built around REST to make it work for games, it is just horrible... Every small feature I wanted to implement on top of REST took tons of hours of design and implementation. Think about how to solve game rooms, matchmaking and game sessions using REST apis, it's really awkward.

The best way I learned to make REST work was to wrap everything in timers. So, the backend has an "inactivity timer" to determine if a client is still connected. The client has a "heartbeat" timer to poll the backend for results, as well as inform the backend that it is alive .. Yuck ...

__Webapp2__

The default web service framework shipping with GAE back then, and to put it simply, it ain't Django. It was severely lacking, resources were scarce, and for a frontend developer like me jumping to backend development through this .. It was just a bad idea.

__Scalability__

That sounds really appealing to most developers, but is just a another painful obstacle between you and shipping your crap. The seamless scalability GAE offers is at the expense of various restrictions, really hurtful at time, with of course, the added overhead of learning new design patterns to do simple stuff.

Thanks to scalability, the recommended approach I came across was to use secure cookies. This makes your backend stateless, and the client maintains the state with each request .. Countless headaches were there. Then comes the shared backend state, which is just inevitable in games. You had to use the memcache thingie, and writing models and using it was also yet another pain.

All that to say, it wasn't a good idea to go head first into a new technology like GAE back then, without clearly knowing what I was after.. Yeah, sounds obvious, but ... oh well.

__Moving On__

Yeah, that fell flat on it's face... So, let's write C++!

### The Goliath

So, at some point, I decided to go full-fledged custom C++ (mid 2014 - mid 2015). So much time was spend designing and implementing C++ code, on both the client and backend, until I finally realized .. I already spent so much time, and yet I've only finished like 30% of the app .. WTH?

### The Elixir of Immortality

Yeah, by late 2015, it was time for me to just take a deep breath, sit back and really weigh out my options here .. Why do I need to do everything myself? Time to hire experts and learn from them, while I focus on what I know best: Game design. I did however need to figure out the technologies to be used by myself.



The root cause for the game taking 4 years up till now is due to my lack of experience and focus.
