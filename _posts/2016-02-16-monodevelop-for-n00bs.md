---
layout: post
title: MonoDevelop For N00bs
date: 2016-02-16 09:53:31+0900
categories: 
---

## Introduction

Over the last weekend, I had the pleasure of committing to learning all about MonoDevelop. For those of you not in the know, MonoDevelop is the default IDE shipped with Unity.

In this article, I wanted to share my experience, and explain why I hated MonoDevelop so much in the past, and why I completely changed my mind now.
<h2>Setting Up</h2>

For whatever reason, it doesn't matter, I haven't had success in the past writing simple mono libraries using MonoDevelop. It was probably due to the fact that MonoDevelop refers to "projects" as "solutions". That confused me quite a bit in the past. Also, when linking with libraries, you had to refer to them as "references". Above all that, you had two different "solution" settings, the parent and the actual solution... Talk about being spoiled by Xcode!

So, anyways, the take away here is, you can do all the usual tasks any IDE does (duh!), but you need to be careful finding out what they are called, and how they are accessed.

## Linking

So, now we know the basics of MonoDevelop... Or at least, the basic terminologies. How about doing something useful this time? Let's try linking some references!

First, thing you might try is drag and drop. That will fail horribly, as MonoDevelop uses a very unique way for linking references.
All the referencing is actually done from within the references folder, located under your MonoDevelop solution:

### Linking System References

So, in order to link a System reference, look no further than the first tab. Over there, you can simply choose your pick of System libraries to leverage withing your solution. This is actually the same way you would link to an existing solution within the same MonoDevelop Workspace. That solution will simply show up on the first tab, and will be built accordingly as the main target gets built. Nifty!

### Linking To External Packages

It took me forever to figure this one out ... I kept dragging and dropping external libraries, adding them to /usr/local/lib, and even trying to link them through terminal. Non of that worked. I was getting frustrated when the solution was staring me in the face. It was under the third tab all along. Just navigate to that tab and hit "Browse...", import the library, and link!

## Testing

I had a real issue developing on MonoDevelop because I was never able to write proper unit tests. I found "NUnit", but seriously, there is absolutely NO resource out there I found that explains how to integrate NUnit with your MonoDevelop solution. Most articles assumed you had NUnit integrated for some reason, maybe because most C# developers are on Windows? Who knows ... But the way to do it is to download the library and add it as a reference using the explanation above as a reference.

Once you have the NUnit reference setup, you are all set! Simply follow any NUnit tutorial on how to write tests, and those are dime a dozen. Once you do, you will be rewarded with a really amazing UI that the MonoDevelop team have built for unit test writers:

## Conclusion

For those OSX users develop Unity apps, I am sure you feel my pain as I write this... I actually spent a whole day porting my logic code from C# to pure C, just because I could use Xcode Unit Tests!! After doing that, and integrating the C library with Unity using Swig, I realized that I can't keep writing everything in C... It's just too much of a commitment. That's when I decided to just spend a whole day learning this MonoDevelop tool and getting a basic Unit Tested library up and running... Well, it didn't stop there, actually. I was also able to get a basic C# client talking with a Phoenix server over websockets, yaaay.
