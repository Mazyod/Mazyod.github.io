---
layout: post
title: "Cocos2dx 3.0 Callbacks"
date: 2014-04-04 22:44:57 +0400
comments: true
categories: 
- cocos2dx
- v3.0
- callbacks
- callfunc
- std
- bind
- callfuncO_selector
- c++11
---

Another seemingly interesting change is to callbacks. Previously, relied on ugly macros and weird syntax to pass a callback method to an instance:

{% highlight c++ %}
FiniteTimeAction* callback = CCCallFuncO::create(
    this, 
    callfuncO_selector(
        KDContentLayer::_switchLayer
    ), 
    screenLayer
);

{% endhighlight %}

However, they now migrated to one of the new awesome features of C++11, which is `std::bind`.

{% highlight c++ %}
FiniteTimeAction* callback = CallFuncN::create(
    std::bind(&KDContentLayer::_switchLayer, this, screenLayer)
);

{% endhighlight %}


