title: What Shall It Be ... ?
author: mazyod
tags: ios
comments: true
date: 2012-02-10 08:44:57+00:00
slug: what-shall-it-be
tags:
- c classes
- dama game
- iPhone
- mac development
- opengl api
- prayer times
wordpress_id: 192

The urge of writing a blog post pursues me, even when I have no idea what I want to blog about!! It occurred to me to blog about Mac development, but I just started yesterday! Hopefully it will make a good blog post after I get the hang of it...

So, the new game? Nah, I will hopefully release it next week, THEN I might blog about it...

... Nothing. Bummer.

Oh, well. I guess I'll blabber about the HUGE difference about iPhone Application development and iPhone Game development. This is also because many people come to me saying, "Hi! You are that guys who made the Dama? Please make us this app!!".

Wooh, wait a sec. That's almost like going to the barber shop telling him, "Gimme a Kilo of meat". Honestly.


## iPhone Game Development


This is done by utilizing the OpenGL ES 2.0 library found in the iPhone SDK. OpenGL development involves drawing everything you see on the screen by setting an (x,y,z) 3-dimension position value to your objects that you want to display on the screen. This is done by calling certain functions found in the OpenGL API. You can also tell OpenGL to draw certain shapes without having an image at your disposal. With that being said, you can still make a game without learning OpenGL... Really?!

Yup, really. This is possible thanks to the enormous effort done by some developers to wrap OpenGL with Objective-C classes, such that you learn their simplified APIs instead and you are ready to build your own game! The best wrapper, or game engine, I tried was [cocos2d](https://github.com/cocos2d/cocos2d-objc).

Examples of iPhone Game development is the [Dama game](http://itunes.apple.com/il/app/id442570707?mt=8) and [E'9a2aat](http://itunes.apple.com/kw/app/ada-at/id433857439?mt=8).


## iPhone Application Development


This involves utilizing the iPhone SDK's UIKit. This is a VERY simple library that helps you build iPhone applications in a few hours!! Most of the time you spend will be on a WYSIWYG editor customizing how you want your application to look like.

Example of an iPhone Application is [Kuwait Prayer Times](http://itunes.apple.com/kw/app/kuwait-prayer-times/id395107915?mt=8).



**That's all! .. Or wait, before you start telling me that iPhone Applications INCLUDE iPhone Games, I know :P. What I mean by iPhone application is regular applications like the stock applications on the iPhone, such as Messages, Contacts, Calculator ...etc.**
