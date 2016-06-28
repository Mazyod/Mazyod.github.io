---
layout: post
title: Rev Up Your Engine
date: 2016-06-28 02:59:55+0300
categories: 
- game-development
---

## Introduction

In the second article in this game development series overway, I would like to shed some light on the aspects that make up the game engine. 

**Overview:**

+ [The GUI system][gui-system-post]
+ **The game engine**
+ The game services *(coming soon)*
+ The backend system *(coming soon)*

The term "Game Engine" is arguably not well defined. For example, I can call the following code a game engine:

{% highlight python %}
def run():
  while True:
    render = buffer.read_next()
    if render == 1:
      print "x"
    elif render == 2:
      print "y"
{% endhighlight %}

The code above has a run loop, renders some output, and can be used to make a simple game thingie .. I think.

Anyway, back to the point, a Game Engine can be graphical, with 2D and/or 3D support, or it can be text based, sound based, or any other sort of output. What I'm gonna be focusing on is a typical 2D/3D game engine, and I want to focus specifically on the graphics rendering aspects, and not other side features, like networking, persistence, memory management and whatnot.. That comes later.

## Revving Up

The declaimer, once again, is that I'll be exploring these gaming topics solely from the perspective of my game, and nothing else. So, let's things underway.

So my game is just a checkers thingie. Moreover, I'm not planning on adding any exciting features on top of the core experience, that is playing the damn game. It would be nice if the piece would become a pacman thingie, and walk around eating other pieces, for example... That's what we call "scope creep".

So, I really need any engine that will give me the ability to show sprites or 3D models if possible, and allow me to animate those objects around using a jump animation. Not surprisingly, most engines fit this requirement (not my previous python game engine tho, mind you).

Another important requirement was actually the interaction. Not many game engines provide sleek and simple interaction system that handles touches and clicks in a simple manner. Unity does quite well on this end as well, so no complaints about it there.

My final, super-weird requirement, which is one of the main reasons this game is delayed as much as it is, is C/C++ support! I really needed a game engine that allowed me to plug-in my game logic and AI, which is written in C. Unity used to require a pro license for that, which pushed me away from it. With Unity 5, it's available for all users, and they have a new plug-in inspector thingie that allows you easily create and target plug-ins for different platforms! It sure came a long way.

So, with a bit of SWIG and python magic, as [highlighted here][swig-article], Unity was a go!

## Conclusion

Sorry for the lack of excitement here, a topic about game engines should really be much more thrilling, lol. Again, my game is super simple on the gaming side, so learn something different for a change!


[gui-system-post]: {% post_url 2016-06-26-whats-in-a-game %}
[swig-article]: {% post_url 2016-02-16-swig-swag %}

