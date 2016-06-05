---
layout: post
title: Be Animate!
date: 2016-05-29 11:04:13-0400
categories: 
- origami
---

## Introduction

Apparently, the word "animate" can be an adjective to "being alive or having life". Well, that could apply to animate and inanimate objects alike ... This is getting confusing.

Well, the point is, this will be a quick post about an animation prototyping tool called "Origami". I've been using it recently to test how an animation looks before the developer goes through the trouble of implementing it.

## Japanese Paper Models?

Well, yeah, originally at least. That's what the word origami initially means, however, the name was also used by facebook as the name for their animation tool, as well.

So, yeah, Facebook decided to build a free animation prototyping tool, and against all odds and expectations, the tool is actually just a bunch of "patches" on top of Quartz Composer!

Quartz Composer is an app which is part of Apple's developer tools, and it is almost as old as time itself. I don't recall it getting much recognition by the Apple developer communities, I guess mainly because it's a designer tool that requires technical expertise...

So, yeah, to wrap it up, if you are a developer who excels at designing animations and looking for a tool to quickly prototype your animation ideas, you fit nicely within Origami's target audience.

## How Good Exactly?

Origami is so good, to the point that I was able to prototype two relatively complex interactions and animations within than an hour .. while on a plane (as they say in Japanese "Sasuga, Digital Nomad-san!"). Granted, I spent a few hours a few days ago playing around with the workflow and getting my hands dirty with the nuts and bolts of this tool.

In any case, the main reason Origami either shines or diminishes in a team is because of its unique workflow. Until now, every single animation system I've ever worked with uses keyframes (Flash, AE, Unity, Spine, ... etc). That makes sense (kinda), but makes things hard and complicated once you start introducing interactions. Most people put up with it, tho, since everyone is familiar with keyframes.

Quartz Composer, however, allows you to create processing units, called "patches". Each patch has inputs and outputs, and you basically compose your whole setup using these units. That's it. The basic idea is so simple and elegant, you just have to fall in love with it .. Kinda reminds me of Elixir, actually, since its basically just a collection of units of work, as well. Except in Elixir, they are called "Processes".

The final note I want to shed some light on today is maintainability. Thanks to the availability of groups and other patches that allow you to breakdown your system into smaller pieces, it really allows you to build complicated hierarchies without losing your mind.

## Conclusion

I've tried Pixate studio, by Google, and saw other alternatives, but they were expensive (such as AE). So, I was kinda forced to try out Origami at first, but the short tutorials at their website was more than enough to convince me to test it out and ultimately use it as the primary animation tool.
