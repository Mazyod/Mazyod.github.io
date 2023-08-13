title: Notification Center
categories:
- cocos2dx
- notification-center
- ccnotificationcenter
- observer
- pattern
- notify
- deprecations
- v3.0
comments: true
date: 2014-04-12 14:44:21+00:00

After scratching my head for a while looking for a reason why cocos2d-x's latest version deprecates `NotificationCenter` (formerly known as `CCNotificationCenter`), [I found this thread in the issues section](http://www.cocos2d-x.org/issues/2865).

Apparently, the `NotificationCenter` was deprecated in favor of the new `EventDispatcher` class, which handles every single event you can think of, from keyboard strokes, touches, actions, ... you name it.

So, the new way to do notification thingies is:

```cpp
Director::getInstance()
  ->getEventDispatcher()
  ->dispatchCustomEvent("This is an event!");

```

Of course, this is a bit ridiculous to type all over the place, so we `#define` it:

```cpp
#define gEventDispatcher Director::getInstance()->getEventDispatcher()

// Much better:
gEventDispatcher->dispatchCustomEvent("This is an event!");

```

