---
layout: post
title: Chewy GUI
date: 2016-06-26 05:46:36+0300
categories: 
- game-development
---

## Introduction

There is always something to post about when it comes to game development it's so vast!! So, this is a post just to talk about how vast it can be! (think meta).

Look, before you get all intimidated on me, game development can be as simple as drag and drop ... Not even writing a single line of code, **and** still be [a world-wide success][color-switch-article]. It can also be an insanely huge collaborative effort that takes years, thousands of man-hours, and cost [up to half a billion dollar to make ._.][expensive-aaa-games]

So, even though my game is obviously on the lower end of the spectrum, it's not trivial, and has tons of features that makes it exciting to develop as well. Since this blog is concerned with software development, I'll only cover that part.

Now, let's break it down, shall we?

__Overview:__

+ __The GUI system__
+ [The game engine][game-engine-post]
+ [The game services][game-services-post]
+ [The backend system][backend-post]

## Chewy GUI

My game falls into that group of games which are UI-heavy. For these games, a GUI system can either make or break the game. A classical example are RPGs. 

Imagine an RPG game without a proper GUI system ... You probably can't, because if it had a horrible GUI system, you probably wouldn't ever hear about it because of hard it failed.

![FF-VII GUI]({{ site.url }}/images/ff-vii-gui.jpg)

The key here is to __avoid fancy crap!__ The Final Fantasy GUI system is super simple, and has been reused since Final Fantasy I!! It is one of the most renowned and celebrated series of all time, and since you spend arguably most of your time on the GUI system, they must have done it right.

Since my game is heavy on GUI, I had to make sure I choose a game engine that will not fail me on that front. Some of the things you wanna look for in a game engine you're gonna use:

+ WYSIWYG GUI editor
+ Adaptive to screen resolutions
+ Easy GUI navigation
+ Localization support
+ Out-of-box widgets (text fields, labels, buttons, ... etc)
+ Simple animation support

My favorite engine until now, Cocos2d, fails horribly when it comes to GUI development, unfortunately. The lack of a usable editor, as well as the constant turmoil their GUI system goes through made me move away from it.

My eyes fell on other open-source game engines, such as LibGDX and Godot, but unfortunately, even those (at that time) weren't usable for indie development (we are still talking about GUI side of things). I didn't want to spend more time digging around other game engines, so I just decided to make a deal with the devil (aka Unity).

Honestly, for an engine as established as Unity, it was still very annoying to work with their new GUI system. I had issues mostly with tweening and implementing a proper navigation system... I couldn't waste my time here, though, so I hired some else to take care of the GUI stuff.

The developers I hired were more comfortable working with NGUI than the native uGUI system shipping with Unity, which is a bit annoying for me, but they really breezed through the GUI tasks, so I didn't have a reason to complain.

__Verdict__

So, Unity is the ultimate answer for GUI games? Not at all. If I were to start over, I'll probably shock you ... I'd use ReactNative or some other app framework!! My game is so heavy on GUI, it makes less sense to use a game engine and more sense to use a cross-platform app framework! It would be super easy to develop the app, and once I reach the game part, I can just use WebGL!

Well, I know, that won't be fun at all, but I really believe it would be the best choice. Also, I think there might be other game engines that would be a better fit, possibly BuildBox, MonoGame, or some other simpler game engine (as long as it is easy to develop GUI stuff!).

## Conclusion

As far as my current game goes, I've optimized the backend development, the service, game logic, and even the art! The only pain point left I have is a proper GUI system, and even though what I currently have is kinda good, it's far from ideal .. Ideally, I don't have to hire anyone just to do GUI work. Ideally, GUI would be so simple, I don't have to write a post about it (or, at least, it can be a subtopic of the game engine).

Look forward to future posts about the rest of the topics!

[color-switch-article]: https://www.buildbox.com/number-one-iphone-app-made-with-buildbox/
[expensive-aaa-games]: https://en.wikipedia.org/wiki/List_of_most_expensive_video_games_to_develop
[game-engine-post]: {% post_url 2016-06-28-rev-up-your-engine %}
[game-services-post]: {% post_url 2016-06-29-quality-of-service %}
[backend-post]: {% post_url 2016-07-01-back-me-up! %}

