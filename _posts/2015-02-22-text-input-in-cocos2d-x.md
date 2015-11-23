---
layout: post
title: "Text Input in Cocos2d-x"
date: 2015-02-22 21:50:07 +0400
comments: true
categories: 
- cocos2d-x
- text
- input
- texfield
- ttf
- editbox
- api
- c++
- snippet
- tip
---

## Introduction

For some historical reasons, cocos2d-x has three classes that supposedly can be used to take the user input. `TextField`, `TextFieldTTF`, and `EditBox`. We are trying to find out which one to use, and throw in a few tips on how to use them.

## The Champion

Out of the three classes, I find the `EditBox` to be the best for general use. It restricts you to a single line of text, but in general, has more features than the other classes.

`TextField` is not so bad, but doesn't have a bunch of supported features. Please refer to the cocos2d-x tests to see which features have been implemented.

Finally, `TextFieldTTF`. Just don't use it. It's pretty cool that this component is a subclass of the `Label` class. This means, it's not a native component, it's a simple OpenGL rendered label that will update as you enter text through the keyboard. The problem is, it's way out of date, and works like crap.

## Just a Tip

Now, for the tip:

The performance of `ui::TextField` and `ui::EditBox` were crappy as hell when I was running on iOS in debug. I searched online for solutions, but it seemed as if I am the only guy facing this problem!

I decided to run performance tests, so I run the profiler, which compiles the app in release mode... The textfields performance is stellar! What?! It seems that in debug mode, a lot of debugging crap happens that causes the performance issues, but not in release mode. So, don't worry about the performance issues and slow-ness you might encounter when running in debug mode.

## Conclusion

Use `EditBox` if you only need one line of text, `TextField` otherwise.
