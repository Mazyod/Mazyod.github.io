---
layout: post
title: "Writing Unit Tests"
date: 2014-03-23 14:30:08 +0400
comments: true
categories: 
- software
- development
- programming
- testing
- unit test
- code design
---

Here I am struggling to learn a code base that has been under the works for half a decade or so, and I am finding some parts of it somewhat difficult to grasp. I resist an urge to refactor all the things:

![image](/images/clean-all-the-things.png)

The main reason is... I have no idea what is the systematic approach I should take that will ultimately yield the best results! I can't just jump at the code and subjectively make it my own, you know... Hence, my travels begin in search for the truth.

### Refactoring... What iz Zat?

I needed a clear idea about what is refactoring, how does it help, and what are the practices applied when doing so. I decided to go to my teachers of software design, the people behind [sourcemaking.com](http://sourcemaking.com). I decided to go there since I was thinking about large scale refactoring, at the scale of changing some design patterns in the project.

As I visited the site, and shot them an email about my problem, I actually noticed [a very interesting topic in the website](http://sourcemaking.com/refactoring)! "Are you serious, they teach refactoring as well?! Sweet!", I thought. So, I went ahead and started reading all about it, and it was nothing short of the awesome.

### Realization

While reading the refactoring topic in sourcemaking, I realized they mostly talk about small scale refactoring, one that would take 5 - 15 mins on average. I was honestly more interested in larger scale refactoring, and some serious code analysis and introspection. Then I thought to myself, "That would be a great topic if Atwood ever wrote about it".

With a rich blog like his, I am sure it's written somewhere, and I will reach it someday, however... I couldn't find it using humanities current search engine capabilities. So, I shot Jeff an email hoping for some guidance.

> Write unit tests for the existing code.

I got a reply in a few minutes with his suggestion. I would have __never__ guessed that writing unit tests would help, even in the remotest way ever. Then again, I have never wrote unit test before (I suck, I know). So, this is my call to delve into unit tests!!

## Conclusion

I don't really have a conclusion for this post, honestly. I feel that there is still something missing here... Something that has to do with how my brain compiles the code my eyes see...
