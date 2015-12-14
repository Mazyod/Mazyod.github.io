---
layout: post
title: Swifty NSNotificationCenter
date: 2015-12-07 12:32:25-0800
categories: 
- swift
- foundation
- kitz
- nsnotification
- nsnotificationcenter
- library
- github
- opensource
- programming
- code
- raii
---

## Introduction

This is another post about [Kitz](http://Kitz.io). This time we will be looking at [Notificationz](https://github.com/SwiftKitz/Notificationz). We will cover the motivation behind the library, and how it can easily turn your code around to be a lot more readable.

## The Problem

One of the frequent pain points of iOS programming is dealing with `NSNotificationCenter`. It is has very "bulky" syntax, you must juggle a lot of constant string, and make sure you add and cleanup your observers properly. All this causes a lot of boiler plate code, and worst part is that it is all over the place:

{% highlight swift %}
class SomeClass {
    
    init() {
        // 1
        NSNotificationCenter.defaultCenter().addObserver(
            self,
            selector: "onApplicationDidBecomeActive:",
            name: UIApplicationDidBecomeActive,
            object: nil
        )
    }

    deinit {
        // 2
        NSNotificationCenter.defaultCenter().removeObserver(self)
    }

    // 3
    func onApplicationDidBecomeActive(notif: NSNotification) {
        // Do stuff
    }
}
{% endhighlight %}

As you see, three different places are littered with `NSNotificationCenter` dependency, not to mention this bulky API. Not only that, but you may mistakenly observe an event that sends notification on a background thread, then update your UI ... BOOM. So, now you have to wrap it around `dispatch_async` ... This is getting really ugly.

We want to do something about that...

## Import Notificationz

That's where Notificationz comes in. It is super light-weight and simple, and just aims to solve this problem. We introduce only 2 classes, and you go from the previous syntax to this:

{% highlight swift %}
import Notificationz

// Define your global helper only once for all files
let center = NSNotificationCenter.defaultCenter()
let NC = NotificationCenterAdapter(notificationCenter: center)

class Sample {

    private var keyboardObserver: Observer?
    private var reachabilityObserver: Observer?
    ...

    init() {
        keyboardObserver = NC.observeUI(UIKeyboardWillShowNotification) { [unowned self] _ in
            // you can write your handler code here, maybe call another function
        }
    }
}
{% endhighlight %}

That's it! The code above shows you 3 important concepts:

### RAII

You don't have to do any cleanup yourself. When this object is dealloc'd, the observer variable will automatically get dealloc'd and remove the observer from `NSNotificationCenter`. If you like, you can prematurely remove the observer by simply setting the value of the variable to `nil`:

{% highlight swift %}
keyboardObserver = nil
{% endhighlight %}

### Ensure Main Thread

The library provides `observe` and `observeUI`. As the name implies, observing for UI will guarantee that the notification block will be executed on the main thread. This means you can safely update your UI from the callback block.

### Conciseness

Now, if you want to know what this class observes, all you do is look at the instance variables. They tell you all you need to know about what this class observes.

Also, once you observe a notification name, you immediately follow with the handler code. This makes sure that you don't deal with "strings" that may easily break when the selector is removed for renamed.

## Extra Goodness

The library offers other helpful functions that complement the `observe` functionality:

{% highlight swift %}
NC.add(obj, selector: "call:")  // normal add observer
NC.observe { notification in }  // observe using blocks
NC.post("Ten-hut!")             // post a notification
NC.remove(obj)                  // remove from nsCenter
{% endhighlight %}

## Conclusion

If you want to make your code look pretty again, take a look at this library, and consider dropping it in. Contributions welcome, and there are some other [pretty cool](https://github.com/SwiftKitz/Appz) libraries as part of [Kitz](http://kitz.io)
