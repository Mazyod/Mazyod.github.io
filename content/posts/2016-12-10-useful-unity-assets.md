title: Useful Unity Assets
tags: unity
date: 2016-12-10 21:49:46+00:00

## Introduction

As I wait for my laptop battery to drain so I can do complete power cycle for the battery, might as well write a post!

I recently started digging through the Unity Asset Store, and found some gems of assets! Let's take a look.

## Moderation

Before I go into this, let me say this: **Moderation**.

Pulling every asset store package to "speed up" your development process would be a fatal mistake. A lot of assets out there will actually do more harm than good. So, let's first take a look at which assets are OK to use:

1. **Battle-Tested**: The asset must have 4.5+ rating, and reviewed by a reasonable number of users, with insightful reviews.
2. **Focused**: The asset must solve a specific problem, and does it well, instead of advertising that it solves *everything* for you.
3. **Docs & Features**: Make sure their docs are readable so you can actually use it! Also, it supports the build configurations you need.

With that being said, here is my list sorted from my favorite, all the way down to the least preferred. However, I use them all, so they're all great!

#### Json.NET

This one gave me a true piece of mind with so little done on my end. Basically, I was using Newtonsoft.Json in my game, and it was breaking under certain conditions in different build configurations. I would have to spend days testing and making sure I work around all the issues!

Thankfully, I found this neat fellow! It has the exact same namespace and APIs as Newtonsoft.Json, so all I did was nuke the open-source version and import this one from the asset store, and just like that... All errors begone!

I love it the most because it solves a super specific problem, JSON serialization, in a super efficient and straight-forward manner.

#### I2Localization

As I was losing my mind managing localized strings, trying to solve Arabic RTL issues with NGUI, I stopped everything and started doing some research. How do people deal with this issue?

That's when I found I2Localization. It boasts RTL support, and with a little bit of a setup, it syncs with Google docs right from the Unity editor! Another super useful feature is statically typed localized strings, using the helper scripts that ship with this asset.

I had some issues with RTL initially, but I quickly added a fix, and submitted a report to their forums. They were fast to respond with confirmation of the bug and shipping a fix soon after.

It's also kind of unfortunate how they don't support multi-line RTL 100%, but it works for my current needs, so meh. Ultimately, I would really recommend this for the Google docs syncing and statically typed strings alone!

#### BestHTTP

This is the last one I want to mention, which ironically, is what I need the most. I don't love it as much as the ones before, but I needed it so badly, that I have to overlook its issues.

BestHTTP is simply the best HTTP experience you can have in a cross-platform Unity game. I say cross platform because, if it was for one platform, I'd personally prefer to use native networking capabilities instead. Alas, my game is cross platform.

The HTTP request APIs are 100x better than the stupid `WWW` thingie Unity provides us. The recent `UnityWebRequest` is even worse in terms of stability! So, I use this library for `GET`/`POST` HTTP requests, and it really delivers the thing you need.

The main reason I got it, however, is the websocket feature it has. It's a well written/maintained websocket implementation, with main thread callbacks, very detailed logging and error handling that helps you crack down the nastiest of issues. The next best thing I found that provides websockets was an outdated websocket-sharp package from 2014, which worked surprisingly OK, but I just did trust it..

The only reason this isn't on the top of the list is the way it synchronizes callbacks to the main thread. It uses a MonoBehaviour, which uses mutex to check for updates **on update**! Like, why?! I don't need to check HTTP results 60 times a second. There should be a better way using semaphores or similar to only trigger updates when needed.

All in all, this library is great, and you should get it if you need serious HTTP functionality or websockets.

## Conclusion

My laptop is out of battery! Time to shut it down.
