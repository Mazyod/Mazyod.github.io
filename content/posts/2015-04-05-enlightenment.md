title: Enlightenment
tags: rant, change, development, programming, process, game, code
comments: true
date: 2015-04-05 22:17:27+00:00

## Introduction

I've been blogging recently about Swift and SpriteKit, and that's mostly eating up all my time, making me miss a blogging day, and also writing a [completely useless post]({filename}2015-04-02-brain-dot-dump.md).

Now, to justify this, the previous three posts before that have been quite lengthy and informative, so it's only natural that the bigger you are the harder you fall, lol.

This post is just me trying to recover from the fail streak I've been having.

## What Happened?

Actually, what __didn't__ happen is I haven't shipped my game yet. After three years of development on the side, it should have been released ages ago, and even new versions already out, but no ... That never happened.

What did happen after that is I built a solid game prototype with my partner in two weeks. Two weeks vs Three years. And I am not talking about a throw away prototype, here. My partner suggested a throw away prototype, but I just went ahead and made it as solid as possible, with a simple yet rich architecture, that can easily evolve in the future.

## How Is That Possible?

The infinitely long game was developed in Cocos2d-x using C++. It was initially built by a dump port of Objective-C code, and sustained all cocos2d-x's updates ... It evolved into a really shitty beast. Adding new assets, moving things around, changing animations speeds, and all that still takes me a few days to get right, that is insane!

Meanwhile, the new game prototype uses external tested components, and a very small footprint core engine that drives the game. Making new builds and testing takes _seconds_. And of course, the language I am using is Swift. It is truly a reflection of its name.

## What Now?

Now, it's time to upgrade into a real game developer. 

Game development in itself is such a daunting and difficult task and doing it part time with hacks and workarounds isn't sustainable. I did that a lot in the app development business, and it worked quite well, especially with a development cycle less than 1 month. Again, not in game development.

It's time to actually architect each component separately, test it, and decide on the integrations. You'd probably be reading this and saying "But, of course!". Well, I am the only programmer in the team, and buying in to such approach is a huge time investment, that requires significant solo experience, since you don't have much people around to bounce ideas off of.

## Conclusion

In a nutshell, if you are doing game development for real, and looking to have that as you long term goal, __STOP hacking and START building!__, and remember, it's not a sprint, it's a marathon.
