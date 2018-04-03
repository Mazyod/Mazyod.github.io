---
layout: post
title: Pick Your Container
date: 2018-04-03 19:30:43+0400
categories: 
- programming
---

## Dancing with the Snake

I've been engrossed in Python development lately, since we have requirements to build a unified platform for UI testing tasks, such as publishing results, browsing screenshots, ... etc.

Being a "seasoned" Python developer, I didn't think twice about going with Flask, so everything was build on top of that. However, after proceeding to add more UI tests, I ran into such an "unforgivable" error .. Flask wasn't detecting the HTTP method of the request properly :S

## A Leaky Flask

For whatever reason, when our app would send two consecutive requests, where the first request has a JSON body, the second request is improperly handled by the flask dev server .. It show something like:

```
"{"foo": "bar"}GET /api/path" 405
```

As you can see, the http method resolved contains the string from the previous request body, which then causes a method not allowed mismatch. I was in utter disbelief, and was certain it was due to HTTP pipelining or some other optimization on the client...

After digging deep and wide in the iOS code, no avail. Everything checks out fine, and Charles shows all requests properly .. It's time to get inventive.

## A Speedy Pivot

No idea how it hit me, but I recalled all of a sudden "bottle". The python micro-framework that works in an almost identical fashion as Flask .. It was gonna be time consuming, but with nothing else in mind, I moved forward with the migration.

After learning bottle basics, I was able to migrate the basic APIs with super minimal changes, and got the server up and running. That took maybe 15 minutes at most. Once I did that, I ran the UI tests again, and surely enough, the http method bug was resolved!! Yatta!

With this confidence boost, I proceeded to migrate the rest of the server parts to bottle, and completely nuked Flask. I guess that took about an hour or so... I'm now a very happy bottle user, and it is worth mentioning, bottle is WAY faster in launching and processing requests, for my case at least.

## Migrating from Flask to Bottle

Here are my learnings for migrating from Flask to bottle:

{% gist Mazyod/bcd63906f275cf8ebded653557bb341c %}
