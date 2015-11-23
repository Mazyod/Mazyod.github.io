---
layout: post
title: "Swift VIII"
date: 2015-02-25 13:51:29 +0400
comments: true
categories: 
- swift
- tips
- snippet
- static
- class
- singleton
- function
- method
- constant
- lazy
- safe
- property
---

I have to admit that the static variables we have in the C world (C/Cpp/ObjC) are pretty cool (Note, it's not thread safe. This is just an example):

{% highlight objc %}
- (void)someMethod {
    static id variable = nil;
    if (!variable) {
        // initialize variable
    }
}
{% endhighlight %}

What about our new favorite language, namely Swift? There is a way to achieve such awesomeness, with a little bit more code, however its more structured:

{% highlight swift %}
class var sharedManager: AppManager {
    struct Constants {
        static let instance = AppManager()
    }
    
    return Constants.instance
}
{% endhighlight %}

In the snippet above, I'm creating a singleton accessor, with a lazy initializer, as a class property. We can now even skip the brackets when accessing the shared instance:

{% highlight swift %}
// Somewhere in your code
AppManager.sharedManager.doSomething()
{% endhighlight %}
