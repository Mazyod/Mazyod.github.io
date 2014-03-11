---
layout: post
title: "Using NSProxy With UIKit"
date: 2014-03-10 19:22:35 +0400
comments: true
categories: [objective-c, uikit, nsproxy, proxy-design-pattern, ios]
---

## Introduction <sup>[(?)](/about#post-introduction)</sup>

I am really having trouble with this introduction... I erased it and started all over like 5 times now. Well, no more. What ever comes out, it shalt remain... 

I wanted to express this new source of inspiration, motivation and even escape from the endless piles of work that is waiting to get done. That source is ... Books! Not any type of books, though. Books that provide extremely useful information and advice, and at the same time are deep and honest, as well as funny, mind you. Can't stay focused without a little laugh. The first book I started with is [Jeff Atwood's](http://blog.codinghorror.com/) awesome book, [Effective Programming: More Than Writing Code](http://www.hyperink.com/Effective-Programming-More-Than-Writing-Code-b1559). I have honestly yet to finish the book, I recently started.

The great thing about this book is how it insanely it influences my thoughts, mood, and motivation. I have stopped to read this book three times now, and I couldn't continue reading more than 8 pages at a time (plus the links to videos and posts). I would start reading the book because I am feeling tired from working, or I just woke up in the morning, and I'm just not feeling it. After reading through the book, just a few pages, I just can't help but jump and start getting productive. The only reason I am writing this blog right here, right now, is because of that freakin' Voodoo book... I say that because, while reading the book just now (I read 3 pages), I reached this part:

> I wasn't trying hard enough. I had forgotten. I can't fully process all the things that are happening to me until I write about them. I have to be able to tell the story to understand it myself. My happiness only becomes real when I share it with all of you.
> <cite>[Jeff Atwood](http://blog.codinghorror.com/10-years-of-coding-horror/)</cite>

After working the whole day on this problem (which I have been thinking about for a while), I came up with some interesting results that weren't found in the [StackOverflow question](http://stackoverflow.com/questions/5061223/anybody-successful-with-nsproxy-of-uiview-e-g-uilabel) that addresses that exact same problem. Unfortunately, tired from grinding the whole day, I decided to leave writing about it to another day... A day that may never come. Fortunately, I picked up Jeff's book (or actually the iPad) and started reading. 15 minutes later, here I am writing the post I wanted to write! Tell me this isn't Voodoo.

## Problem Statement

I was entrusted with the deceivingly mundane task of localization. The task quickly because more interesting when I realized we need to support two languages: English (Left-To-Right) and Arabic (Right-To-Left). Text alignment and other code-side changes weren't anything if statements couldn't solve. However, the dreaded XIB files were the main issue. In my previous apps that preceeded Xcode 5, I had to create and manage multiple XIB files, which was just plain annoying... Not with Xcode 5!

Thanks to [Apple's AutoLayout system](https://developer.apple.com/library/ios/documentation/userexperience/conceptual/AutolayoutPG/Introduction/Introduction.html), flipping the UI around was surprisingly easy! Specifically, assigning leading and trailing spaces for subviews will make the layout intelligently switch between LTR and RTL. Unfortunately, Apple didn't take it a step further to support flipped controls, specifically `UISegmentedControl` in my case.

{% img center caption /images/segmented-en.png "" "LTR segmented control" %} {% img center caption /images/segmented-ar.png "" "RTL segmented control" %}

As you can see, this is the problem:

{% codeblock lang:objc SegmenedControl %}
// We need to set the first word at the left for LTR, and right for RTL:
NSString *title = NSLocalizedString(@"First", @"");
// LTR languages
[segmentControl setTitle:title atIndex:0];
// RTL languages
[segmentControl setTitle:title atIndex:lastIndex];
{% endcodeblock %}

But doing this manually is error prone, and gets tedious really quickly... So, that needed to be solved.

## The Solution

The first thing that crossed my mind was to wrap the object with a proxy that would flip all the segment indexes coming in and out of the control:

{% img center caption http://www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgUHJveHkgU29sdXRpb24gTG9naWMgRmxvdwoKT3V0c2lkZXItPgAgBTogc2VsZWN0ZWRTZWdtZW50SW5kZXgoKQoAPgUtPgAPB2VkQ29udHJvbAAXGQAZEC0AWAlyZXN1bHQKbm90ZSByaWdodCBvZgCBHAY6IENoZWNrIHRoZSB1c2VyJ3MgbGFuZ3VhZ2UKYWx0IEwABgcgTFRSAIEKBy0-AIE5CABQCWVsc2UAIQpSVEwAGBNzAIFXBkNvdW50IC0AgQwHIC0gMQplbmQ&s=napkin "" "This is a simple example. You can imagine how it would be for all the cases, right?" %}

That seemed like to much work, so I went ahead and implemented a simple category that the developer has to call in order to get the proper result, [available on github](https://github.com/Mazyod/RTLSegmentedControl). The way it works is simple: Replace all your calls that are related to the segment index with the methods found in the category, and it will check if the user's language is RTL, and flip accordingly:

{% codeblock lang:objc SegmenedControl %}
// Old code
[control insertSegmentWithTitle:title atIndex:segment animated:animated];
[control insertSegmentWithImage:image  atIndex:segment animated:animated];
[control removeSegmentAtIndex:segment animated:animated];

// New code
[control insertSegmentWithTitle:title atLocalizedIndex:segment animated:animated];
[control insertSegmentWithImage:image  atLocalizedIndex:segment animated:animated];
[control removeSegmentAtLocalizedIndex:segment animated:animated];
{% endcodeblock %}

**Is that it?** No way. I came here today *mainly* to discuss my findings realted to marrying `NSProxy` to `UIKit`, so let's move to that.

## The Real Cheese


