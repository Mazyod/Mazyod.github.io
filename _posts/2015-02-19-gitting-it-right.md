---
layout: post
title: "Gitting It Right"
date: 2015-02-19 14:12:40 +0400
comments: true
categories: 
- git
- development
- process
- ios
- programming
- vcs
- flow
- style
- productivity
- collaboration
- team
- branch
- fork
- repository
---

## Introduction

I had an interesting conversation recently about Git, and thought I'd make this post about that. People anticipating the second part of the HTTP game server article, don't fret! It's coming soon, just thought I'd take it easy today and write about a simpler topic.

Let's get something out of the way. If you are a bookworm, and read stuff in books on how things should be, and complain on that basis, please let me show you the way out. What I'm presenting is an actual git flow that worked for our team. 

So, unless you have your own experience working in teams with git, I don't think your contribution will be of any value (not that I get much comments anyway, lol).

## Gitting

First things first, everyone should have their own fork of the main repository. Some might say it's enough to have a local copy of the main repo, and call that a fork. Sure, whatever works, but if your laptop burns, or your colleagues blame you for slacking off, then tough luck!

Once you've settled on your fork, here is how your structure should look like:

![](http://mazyod.com/images/gitting-it-right-1.png)

Now that you have your own fork, celebrate! Once that's over, it's time to write some code. But, what is that code gonna be about? How will it affect/be affected by other changes? It's good to have these questions in mind, but the approach presented here should cleanly cover all that stuff.

Every new feature, bug fix, refactor you want to work on should go into its own branch. This allows the developer to focus on one properly contained problem. Let's assume you want to implement a features. So, you would branch from master, and implement the feature there:

![](http://mazyod.com/images/gitting-it-right-2.png)

Yay, you implemented your first feature! Celebrate once more. Then, it's time to submit your feature to the main repo so you're teammates can see how awesome you are... OH NOES! While you were implementing your features, someone merged their own progress into the main repo. Who knows how well your code will work with theirs?

![](http://mazyod.com/images/gitting-it-right-3.png)

Well, we can't just do a [hail Mary merge](https://www.youtube.com/watch?v=ywcD94gqxQM) and hope for the best. You have to make sure everything works!! So, first, you should update your repo with the latest code:

![](http://mazyod.com/images/gitting-it-right-4.png)

Then, you merge your code with your master branch:

![](http://mazyod.com/images/gitting-it-right-5.png)

Now, you can test and make sure your code doesn't affect the newly added code. If it does, you simply update your branch, and merge again with your master branch. Once everything is tiptop, you can proceed with updating the main repo:

![](http://mazyod.com/images/gitting-it-right-6.png)

## Conclusion

I haven't really explained what is git, why we should use it, but if you're a developer, you'll eventually run into it. Once you do, have this post bookmarked, and come back to it to git it right!
