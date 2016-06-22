---
layout: post
title: Elixir Metrics
date: 2016-06-22 05:42:02+0300
categories: 
- elixir
---

## Introduction

Yet another post about the Elixir game server, and this time it's about how I should be monitoring the server metrics, such as the game rooms, matchmaking queues, and actual games...

## Ideally Speaking

I guess, the ideal situation I'd like to be in is to have a time machine that would allow me to go back in time, and learn web development instead of wasting all that time with C++ and Java.

No, really. Ideally speaking, having a properly built website is awesome, but it seems like a huge investment everytime I give it a shot. You see, for a person without much frontend development knowledge, it gets intimidating which framework one should use, which template, which IDE, and so on.

Also, there is the simple reality that I am not familiar with the Phoenix JavaScript frontend library. All this meant to me that I'd be spending a full week to get something respectable out the door .. There is no way I got time for that.

## Hacking a Solution

Apparently, one of the services I already have integrated, namely DataDog, has some sort of custom metric tracking. With a community contributed Elixir library, it was quite simple to get up and running with something small and simple.

With custom metrics, you can have your backend report various data points, such as counters, gouges, histograms, ... and so on. The counter sounded perfect! ... Except, it wasn't perfect at all.

[According to this Github issue][datadog-github-issue], datadog does some sort of normalization on the data sent, and you end up with vague numbers that sort of give you a clue of the general "rate" and not "count" of the metric you are monitoring...

So, as an example, I had my `:room_store` process emit a `statsd.increment` event whenever a new room was opened, and `statsd.decrement` event when a room was closed ... What I ended up with were fractions, since the numbers where divided over a regular interval, and are not aggregated. Doesn't solve my issue.

## MOAR Services

I've touched upon LogEntries in the past and how it seemed like an exciting service to try out, but never really got to that, so .. I think it's time. Perhaps the answer lies with this service.. Maybe, just maybe, I can finish this task in a few minutes ... Let's see.

Doesn't cut it for me, unfortunately... The minimum plan you must get to unlock real-time analytics will set you back at least $1200/yr. Maybe it's worthwhile, but for something so uncertain as a game that's being developed for half a decade ... Moving on!

## iOS

I seriously considered just wiring together an iOS app, since that's what I am most comfortable with. The problem is, this approach doesn't scale. After writing an iOS app, I'll need to run it as a daemon and constantly monitor the numbers and metrics, which just doesn't work for iOS.

Yes, Swift now runs on Linux, but that doesn't mean it's feasible to go and download the Swift 3 toolchain, set up all this headache, and hope there is a compatible websocket/phoenix library out there. That just doesn't work.

## Conclusion

I really don't have a choice, my only option is as plain as day. Whatever it takes, I must implement an admin dashboard on top of my backend that will show me all these metrics. It can be the most basic, ugly looking hack every conceived, but it will get the job done and set us of the right foot!

Time for Brunch!

[datadog-github-issue]: https://github.com/DataDog/dd-agent/issues/659
