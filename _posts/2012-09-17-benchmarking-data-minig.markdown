---
author: mazyod
comments: true
date: 2012-09-17 11:40:13+00:00
layout: post
slug: benchmarking-data-minig
title: Benchmarking & Data mining
wordpress_id: 262
tags:
- artificial intelligence
- benchmarking
- blogging
- bot
- Dama
- gaming
- optimization
- technology
---

One of the things that makes my blood boil while programming is **benchmarking**. First, let us see what benchmarking is, and which type am I talking about... Rejoice! No crude introduction. Not this time, at least!

Ehm, so, benchmarking is "_evaluate or check (something) by comparison with a standard_", straight out of the dictionary. In software development, it has become common that the standard is nothing but your yet-to-be-optimized program. So, after all the main aspects of the software are laid out and implemented, the program's performance is measured and used as a standard, then the excitement begins! Who shall overcome this standard, and by how much!

Why do I find it so exciting? I'll just jump to the example (which actually happened to me one day). I had a TableView in my iOS app, and the scrolling was simply _**horrible**_. Something had to be optimized in order to increase the speed of the TableView's scrolling. I measured the amount it takes to generate one row of the table, and it was **450 - 550 ms**! That was simply unacceptable. Hence, the optimization and benchmarking began. By simply adding NSLog statements between different part of the row's initialization process, I was able to find the culprit. It was because I was drawing the image manually in CoreGraphics, instead of using a normal ImageView. That's not the point, the point was how awesome it felt when I fixed this part, and the generation time fell all the way down to **150 - 200 ms** !! It really feels like I accomplished something :p. Further optimization were also made, and it was (overall) a fun process.

OK, so now, it is even more exciting than ever. The Dama AI (Arificial Intelligence/Bot) player is slow, and I am finally taking the bold step of optimizing it. Unlike the previous case, the bot cannot be further optimized by playing around with the code alone. Some logical changes are necessary. By logical changes, I mean making the AI smarter by ignoring bad moves and going deeper in promising moves. In order to do all that properly, **data mining** is required 8).

I am not really gonna "data mine", that's too much for a small project like this one. However, I need to prepare proper test cases, and automate the process of extracting the data from the test cases and comparing them with other cases. Makes sense? No? Hmmm... I am gonna write my whole plan in a sec, so it should make it clear.

First, let us see our candidates, or basically the AI players that shall be benchmarked.



## Test Candidate #1


**Name:** QDBot
**Age:** 1 year 1 month
**Bio:** Original Bot written with the initial game. It received many criticism for its slow Hard level, which predicts 4 moves + the eats. It is mainly a brute-force algorithm, exploring the whole search space, but does have minimal optimization.


## Test Candidate #2


**Name:** PikiBot
**Age:** -1 days
**Bio:** The Bot that I am hoping to complete by tomorrow. It kicks off where QDBot left off, and selectively decides which path to traverse, instead of blindly exploring the whole search space. This selective nature of his earned him the "Picky" name.


## 




## Test Candidate #3


**Name:** iBot
**Age:** TBA
**Bio:** It is phenomenal. The best I have ever written at that time ([sounds familiar?](http://www.apple.com/)). This test candidate should come with many goodies, however, it might take a while to achieve. It is still uncertain whether it'll actually make it for the benchmarks.

... On with the test cases. Unfortunately, I couldn't visualize the cases, so it will be in plain text:




## Test Case #1


Each Bot's speed shall be tested on all the difficulties. The depth will be equal on bots.




## Test Case #2


Each Bot shall try to come up with the best move within a certain time constraint. 1 sec, 3 sec, and 5 sec.




## Test Case #3


The Arena! I shall buy some popcorn, along with [my favorite drink](http://thetravellersnest.files.wordpress.com/2011/01/lipton-ice-tea-peach-330ml-full2.jpg), and watch the bots in their battle of survival! xD



EOF
