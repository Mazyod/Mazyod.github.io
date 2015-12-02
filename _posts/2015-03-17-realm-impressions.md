---
layout: post
title: "Realm Impressions"
date: 2015-03-17 22:39:10 +0400
comments: true
categories: 
- rant
- realm
- ios
- swift
- opensource
- api
- code
- development
- persistence
- database
- tightdb
- null
- coredata
---

## Introduction

If you haven't heard about [Realm](http://realm.io/) yet, you might be living under a rock or something .. Realm has been hailed as the savior of all iOS/Mac developers out there from the clutches of CoreData.

Its SDKs are opensourced and available on github, but the core database itself isn't opensourced just yet. Let's back up a bit, since I'm getting ahead of myself.

## Realm

![image](/images/realm-logo.png)

> Realm is a mobile database: a replacement for SQLite & Core Data

As simple as that.

## Impression

I haven't used Realm in an actual shipping application, but I did use it for prototyping and an attempt to replace CoreData. So, I have some impressions I would like to share:

### Potential

I think Realm has enormous potential once the opensource community start hacking away at this beast. The SDK itself is opensource, and the simple, yet rich APIs are crying to be hacked and extended.

The SDK already comes with Swift support, and that alone is amazing. The project is quite active and continuously growing with lots of feedback coming from the community.

### Flaws

Nothing comes without its flaws, and here are realm's flaws in a nutshell:

1. [No `nil` support](https://github.com/realm/realm-cocoa/issues/628):
    + That sounds like a big deal to some people, but `nil` support is planned for the future, and for now, just use the Null Object Pattern.

2. [No Granular Notifications](https://github.com/realm/realm-cocoa/issues/601):
    + This is the biggest issue for me, personally. CoreData has amazing granular notification support.

## Conclusion

Think about the flaws that come with Realm, and also think about your inner hipster, and whether you want to have fun coding your app, or just role it out with what you already know and is already there.

Granted, MagicalRecord + CoreData = Win. Working together, these two beasts beat Realm for me, for the time being, because of all the great features they come with. On top of that, `NSFetchResultsController` is a pretty sweet deal that comes with CoreData, not Realm.
