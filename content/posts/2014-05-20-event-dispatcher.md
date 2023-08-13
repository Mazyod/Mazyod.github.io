title: Event Dispatcher
categories:
- cocos2d-x
- event-dispatcher
- youtube
- tutorial
- notification
- ccnotificationcenter
- lambda
- video
comments: true
date: 2014-05-20 23:02:48+00:00

A special post is happening this time, and it is a video! We will explore the new cocos2d-x Event Dispatcher, and how to use it as a replacement for `CCNotificationCenter`.

Without further ado:

[Youtube link](https://www.youtube.com/watch?v=TyP0CZWED0M)

Here are some relevant code snippets:

```cpp
#define gEventDispatcher Director::getInstance()->getEventDispatcher()
#define NC_ADD(target, notif, handler) gEventDispatcher->addEventListenerWithSceneGraphPriority(EventListenerCustom::create(notif, handler), target);

```
