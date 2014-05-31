---
layout: post
title: "Event Dispatcher"
date: 2014-05-20 23:02:48 +0400
comments: true
categories: 
- cocos2d-x
- event-dispatcher
- youtube
- tutorial
- notification
- ccnotificationcenter
- lambda
- video
---

A special post is happening this time, and it is a video! We will explore the new cocos2d-x Event Dispatcher, and how to use it as a replacement for `CCNotificationCenter`.

Without further ado:

<iframe width="240" height="180" src="http://www.youtube.com/embed/TyP0CZWED0M" frameborder="0" allowfullscreen="allowfullscreen"> </iframe>

Here are some relevent code snippets:

```c++
#define gEventDispatcher Director::getInstance()->getEventDispatcher()
#define NC_ADD(target, notif, handler) gEventDispatcher->addEventListenerWithSceneGraphPriority(EventListenerCustom::create(notif, handler), target);
```
