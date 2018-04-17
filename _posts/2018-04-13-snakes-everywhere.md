---
layout: post
title: Snakes, Everywhere!
date: 2018-04-13 19:29:23+0400
categories:
- programming
---

## Introduction

Ehm, for this one, I am really disappointed at my network of pythonistas. I was looking for such critical tool that would change my life forever when it comes to developing Python applications, yet no one could point the ultimate solution I ended up finding by chance.

The problem statement goes:

- I have a Python app I would like to distribute to my teammates
- The app is written in Python 3 with many dependencies
- My team size is 20+, and not everyone is well-versed with Python
- More over, some have a broken Python environment!

So ... I need a way to distribute a Python application, absolutely hassle-free. What are my options?

## Eggs and Wheels

The most common solution I found online, and people proposed to me, is PyPi. Package your application as an Egg or Wheel, and use a distribution platform like PyPi.

### Why Not

The reason this is bad is mainly because it still requires `pip` and a proper python environment. Even if we assume that's easily conquered with virtualenv, still dealing with the distribution is a pain. My app has some secrets I don't want to get out, so ... Dealing with a private source is a pain.

## Homebrew

I have another inclination, which I was so close to doing. Distribute through Homebrew. I had released a Homebrew formula before ([truck][truck-link]), so it was not that bad of an option.

I started to look at the homebrew docs for defaults, and sure enough, homebrew runs your app in an isolated virtualenv, so you don't need to worry about the users' mess.

### Why Not

I ran into the same issue of private distribution. I thought I could solve that by giving out the secrets separately, and loading them using additional arguments. That is a legit solution.

Then I realized, I also wanted to distribute a webapp alongside the Python server! How would I deal with the static file distribution? It's probably solvable, but didn't seem to me like a worthwhile endeavor.

## Docker

Overkill.

## PyInstaller

😍 My new favorite thing in Python. PyInstaller is an absolute kickass tool for distributing Python apps. All you do is point to your main script, and PyInstaller does the rest of the work.

When configured properly, it can spit out a singl, stand-alone binary executable you can ship as a CLI app. That's just grand. All I had to do next was a simple shell Mac OS Cocoa application that packages the binary alongside the required resources, and BAM. You now even have some GUI for your Python application, and it is distributed as a Mac OS app.

## Next Steps

With the power of a Mac OS app, I intend to provide a slick UX for interacting with the underlying Python app. Things like drag & drop your configuration files, as well as some logging and helper actions to tame the Python.

## Conclusion

This post is really intended to take an overview about the available options for distributing Python apps, and doesn't go into details on how to actually use PyInstaller effectively. That's for another post....


[truck-link]: https://github.com/Mazyod/homebrew-truck
