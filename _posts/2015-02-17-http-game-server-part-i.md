---
layout: post
title: "HTTP Game Server: Part I"
date: 2015-02-17 14:35:37 +0400
comments: true
categories:
- http
- game
- server
- implementation
- backend
- multiplayer
- checkers
- turn-based
- api
- restful
- gae
- google
- appengine
- apiary
---

## Introduction

I have been thinking of a topic to write about, and couldn't find a quick and easy win like the previous topics, unfortunately. No reason to fret, though. It just means I need to up the game.

This time around, I will be talking in details about things I'm working on, and how it came along. These posts might span multiple parts, but that's even better, as I have more content to roll out!

So, this post is going to be about how I built a RESTful API backend for my game. Hopefully it will be enjoyable, and useful! It reminds me of the Map Editor series, so if you haven't checked that one out, please do!

## Design

Before jumping into the implementation of your backend, you probably want to make sure you've designed and accommodated all the requirements, as to not waste effort building something that will change very soon.

> Measure twice, Cut once
> –– [Proverb](http://en.wiktionary.org/wiki/measure_twice_and_cut_once#English)

In order to make the most of your API design, what if I told you that you can actually provide a mock service that replicates your design? Yup, that exists, and my choice of poison was [Apiary](http://apiary.io).

Apiary let's you design your API using a very neat format they call ["API Blueprint"](https://apiblueprint.org/). Using that format, you can design your API in a parse-able format that can be consumed by different services.

So, once you've designed your API, you feed it to Apiary, and it spits out a link for you that you can plug into your app. Calls made to that URL will return a mocked response you specify in the API design. How neat is that?

So, while I was going through the design, I would actually run my game and see it functional even though I don't have a backend built up yet! Using this tight feedback loop, I refined the API design a lot, without wasting too much energy.

Finally, I plugged the API design into a machine, and a backend was built for me! OK, I was just kidding there. I simply used Google App Engine to implement this API, and I was able to focus on learning GAE and the implementation, with the design being out of the way.

**NOTE:** Admittedly, [I briefly talked about Apiary before](http://mazyod.com/blog/2014/04/04/apiary/), but that was before I actually used it, so it doesn't count.

## Conclusion

This was a quick look at the design phase of building the REST-based, turn-based game backend. In the upcoming article, we'll see how we can build this API using Google App Engine.
