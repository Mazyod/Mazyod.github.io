title: A Game Dev Tale
categories:
- game-development
date: 2016-05-23 22:44:06+00:00

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

So, at some point, I decided to go full-fledged custom C++ (mid 2014 - mid 2015). At the same time, I looked at the UI designs I've had made about a year ago, and decided they are no good. I was gonna work my ass off on this C++ code base, the game better be worthwhile! So, it was time to overhaul the whole thing, design and development.

As for the code part, so much time was spent designing and implementing C++ code, on both the client and backend. The main reason I considered C++ was my discovery of the Poco libraries.

Poco is a really neat set of open-source C++ libraries. Browsing their code, I had faith that people __can__ write sane C++ code, without losing their mind. So, following their lead, and using most of their libraries, I was able to write a "working" game frontend and backend in like .. 6 months.

Now, "working" doesn't mean complete .. Actually, it was extremely far from complete. Even though it wasn't a horrible experience, it was ideal for a one-person team. Juggling the frontend and backend code bases in C++ was extremely painful, I needed help, and I needed it fast.

So, during my stay in SF, late 2015, I interviewed a seasoned C++ developer, actually a core Poco contributor. He was great, and I after setting everything up, preparing the tasks, and putting together a plan ... It struck me.

I was in a hostile-type place, with 2 other developers.. One of them recently graduated from a code bootcamp, and he and his mates already had a working platform with some pretty neat functionality. That really dragged me back into reality... Why not? What's so special about them? They used node! In conjunction with Socket.IO! ... URGH!

I quickly scrambled to see how easy it was, and I had a working, realtime server within the hour, just how cool is that? .. Yeah, I had to call that C++ developer and tell him not to show up for work (remotely). I really feel bad for backing off like that, but it had to be done .. I needed a sane technology like node, and to end this C++ madness.

### The Elixir of Immortality

Yeah, by late 2015, it was time for me to just take a deep breath, sit back and really weigh out my options here ..

Node was an extremely viable option, but I simply hate JS (pre-ES6). I desperately looking around the web for solutions.. People seem to like Ruby, so I gave that a go. Nope, won't work for me. It had so much of the crap I hated about python and GAE, in the sense that you do a lot of documentation reading and configuring rather than writing your business logic. At that point, it was gonna be Node...

God bless [this man][suraj], for he has planted the Elixir seed in my head. He is a Ruby developer by trade, but was fed up with Ruby, and wanted to try something new. He mentioned Elixir in the past, and it clicked with me while I was there .. Yeah, why not give that a try?

Thanks to all the amazing content online that talk about Elixir, and using it for game development even, I was able to come to peace that .. Yes. This is the technology most befitting for this project.

## What Now?

No, I haven't shipped yet, lol. However, For the first time in the history of this game, the backend is way ahead of the frontend. In fact, there was only one way I realized I can ever ship, and that is by using Unity and hiring a developer to do everything, lol.

Unity is great, it's a kitchen sink that just gives you everything you need to ship a great game, with the expense of forcing you to do things its way. I was able to get some good results on my own in Unity, but nothing close to what a veteran was able to do within a single day.

Yeah, today marked the first day working with a freelancing studio, and their progress was nothing short of staggering. Looking at their pipeline, I could see reused scripts, custom Unity editor controls, and tons of other important details they built during their 5-year experience with Unity. They went all in, and it is definitely paying off.

What now? Time to trust these guys with the Unity side, and do my best to support them where I can while implementing final touches on the backend! If this work out, that would mean the first 3.5 years where nothing but a learning journey, while the final 6 months were the actual work that made it into the game .. Since the backend, frontend, and design were all remade! (except the C game logic, lol. That is the only piece of legacy that survived this harsh journey).

## Conclusion

I am not even trying to obscure the root cause of this delay in the game development process. The root cause for the game taking 4 years up till now is most definitely due to my lack of experience and focus. All the technologies I mentioned work great for their purposes, but when you decide to go with something, don't hear the preaches.. Just cast it on your requirements.

[suraj]: http://surajms.com
