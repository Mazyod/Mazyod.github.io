---
layout: post
title: "Close Call"
date: 2014-03-28 17:52:12 +0400
comments: true
categories: 
- rant
- testing
- objective-c
- library
- development
- programming
- snippets
- xcode
- UILocalNotification
---

## Introduction

After writing this post, I realized I am writing too much "crap" in the middle, which loses context and may not benefit the readers as it would if I audit it properly ... but hey, this __is a DevDiary__. I'll just leave it there and try to fix those problems in subsequent posts!

So, let's just to the actual thing.

## The Actual Thing

Due to my screw-ups in the past, I have become a testing Nazi.

![](http://mazyod.com/images/testing.jpg)

No matter how confident I feel about the small changes I make; before releasing software, I just test... and test... and test... which ends up taking like 60% of the actual development time cycle.

In today's case, it goes as follows:

### Code Sharing

So, now I have to maintain 2 iOS apps, and 1 Mac application that have so much shared code. There are plans to increase the number of application in the future as well, so some kind of code sharing solution had to be implemented.

Since I started writing the functionality for the second app, I had a goal to reintegrate it back to the first app, yet I simply wrote all the code within the second application. Thankfully, the code was separated, so it was a simple matter of moving the source files to another project (for the most part).

Hence, __MCEngine__ was born.

MCEngine is now the project that builds a static Objective-C library that can be used by all the apps mentioned. Think about it this way: Fixing a bug has become 3x more valuable than before!!

For now, the only released product that uses this library is the [KPT Mac application](https://itunes.apple.com/us/app/kuwait-prayer-times/id723108544?mt=12), while the iOS app is in the works and should be released soon with the integration. The thing is, how much could possible go wrong with a simple integration?

### The Thing About Static Libraries

One of the painful moments of migrating to static libraries was managing the assets (images, sounds, ... etc). The library can't contain resources, so a separate dependent target had to be in place with the resources required by the library.

After debugging and testing the integration of the iOS app, and clearing the most obvious bugs, I was urged to push the update. My testing habit just won't let me do that, and I realized a key point:

> __By far__, the most important feature in these applications is the notification system. If I test everything in the app, and fail to test it, I might as well abandon the project!

That was key. Hence, testing the notifications began... and, they didn't work!!

Wait, what? I already made sure the code was running fine, and I even have in the debug output something that tells me that the notifications are being scheduled properly... What could possibly go wrong?

Remember the library assets? That separate target? Yeah, that's the issue. The notification sounds (associated with `UILocalNotification`) were inside the library bundle, and I was assigning the _full_ url to notification object... Even though the property name is: `soundName`.

### TL;DR

Because of the way Apple designed the `UILocalNotification` class, you must assign the `soundName` property with a path relative to the main resource bundle.

## Conclusion

I can't stress enough how important testing is... Scratch extra features, cancel your therapist session, and even skip bowling night if you have to, just please... _Test your sh*t_.

Of course, the way I do it is inefficient, and actually _absurd_ for larger teams to deal with, hence the need for unit testing... I should do that. Future me, please do that.
