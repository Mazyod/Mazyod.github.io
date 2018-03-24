---
layout: post
title: Mining, ethOS and Bots!
date: 2018-03-24 22:33:57+0400
categories: 
- programming
---

## Introduction

I've been into mining Crypto-currencies recently (I'm not sure what's the proper way to type that, so will refer to them as cryptos from now on .. with the added bonus of triggering cryptography nerds :troll:).

So, what's the big deal? I'm actually quite late to hop on the bandwagon to be honest. People have been mining ever since the inception of Bitcoin, and that was way back when ... The deal is, I've applied some python goodness to the mining operations.

Since I use [ethOS][ethos-link] on my mining rigs, it has been an extremely pleasurable experience configuring and monitoring the rigs. The best part of all this is that the rigs are a source of income rather than another unjustified subscription to satisfy my unquenchable geekness.

Without further ado, let's breaking this story down. The post is covering these main points:
- What is mining?
- How's ethOS working for far?
- Solving the monitoring problem

## Solving Math Problems

Mining is actually a really clever pun invented by the crypto lords to describe the process of earning cryptos. Gold, even today, is considered to be a valuable material due to its scarcity and defined availability. You can't synthesize gold out of thin air, and once all the gold on the plant has been **mined**, that's it .. People can only circulate the existing gold.

Now, given that you, me, Alice, bob, or anyone for that matter can try their luck and go try mining for gold, and finding gold through such means is fair game, one could say that is a possible way to try and earn a living or perhaps be rich.

Given that definition above, the exact same principle applies to Cryptos. Through an ingenious system developed on top of the blockchain technology, humans were able to somehow come up with a software system that functions in the same way as gold! The main catch here is, literally _anyone_ can define their own Crypto, as opposed to no one being able to define their own "gold".

So, with that said, the process of mining Crypto, not surprisingly, does not involve digging a mine or any physical activity. After all, the whole system is software-based! How does one mine Cryptos then?

Well, without getting into the hairy details of Cryptos, let's just say that Cryptos' reward system is based on lottery, where the more computing power you have gives you a better chance of winning the lottery. (In retrospect, having more gold mining operations means you have better chances of finding more gold).

I am sure you have lots of questions about this, but let's just leave this here, and move on the to the next topic.

## The Mighty ethOS

ethOS is by far the easiest way to get a mining machine up and running (for me at least). Alternatives I've tinkered with were simplemining.net and the dreaded Windows 10. Both were surprisingly painful to deal with, and had extremely limited support online in terms of identifying similar issues we were facing.

I mean, think about it. Windows 10 is such a bloated operating system relative to most Linux distros, and everyone has their variation of Windows installation, with a different permutation of software and drivers installed. Hence, it seems people are not able to debug issues properly and detect problems with their setup.

Besides that, it's not as programmer friendly as a Linux distro, such as ethOS. I haven't done it yet, but spinning up a crontab with custom scripts to perform my biddings is [easy-peasy, lemon squeezy][ozzy-man].

Finally, also in contrast with the other options I've tried, ethOS simply has all the drivers and scripts you need built-in. I've had to run some extra commands to make MSI z270-A PRO and GTX 1060 Rev2 6GB work, but those steps were all properly documented on the ethOS online knowledge base.

To be quite frank tho, some crap was quite annoying to get your head around, especially the config stuff. I used local config for no reason initially, then realized I can just just use gist.github.com for that. Also, there is configmaker thingie advertised by ethOS, but I really want a private, secure config, so ... gist was the way to go for me.

P.S. ethOS has built in TeamViewer support, and it is truly kickass.

## Better Than Slack

Slack has been my go-to platform for receiving alerts and such .. up until I found out how easy it was to write a Telegram bot. Instead of spinning up a webhook, and dealing with all the setup, which has some very rigid and annoying limitations, Telegram opens a world of possibilities.

So, the story goes ... After setting up the rigs, sometimes the rigs would malfunction, and a GPU or two or all would stop hashing. I would like to know about that, so ... I noticed that the ethOS panel website provides a JSON api. Hence, why not monitor the API, and trigger me some alerts? Alerts on where?

Given that Telegram is the platform of Crypto, might as well just do it there. It would be a nice exercise as well to finally write me own Telegram Bot. And so, [ethogram][ethogram-link] was born.

With ethogram, we were able to monitor our rigs from within the Telegram group, and given the bot was written in Python, it was absolutely trivial to write various alerts on different metrics. It took me some time to come up with an optimal design for the classes and such, especially when I decided to add unit tests, but since then, I think it is at a perfect place... And now, I want to port it to Elixir xD

## Next

Honestly, I've been contemplating moving to Elixir since I want to write a more reliable, extensible platform that doesn't just monitor ethOS, but also tracks Crypto prices, mining pools, profitability, ... etc.

I don't think I'm gonna be doing that anytime soon, if at all, tho ... I need to focus on finalizing the UI Testing project I've been committed to for the past 5 months or so first... It's annoying to have such a project lingering around for so long!! Put it's at a pretty kickass state right now ... Once that's over, I would like to switch my attention to A.I. for a bit, so look forward to reading about that soon!!


[ethos-link]: http://ethosdistro.com/
[ozzy-man]: https://youtu.be/4I39dmsWKpw
[ethogram-link]: https://github.com/Mazyod/ethogram
