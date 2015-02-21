---
layout: post
title: "Updating Cocos2d-x"
date: 2015-02-21 11:50:08 +0400
comments: true
categories: 
- snippet
- cocos2d-x
- rant
- development
- mac
- ios
- xcode
- undefined
- symbols
- error
- linkage
- linker
- header
- not-found
---

Just a quick post, since I recently updated my project's cocos version to the latest and greatest.

It went surprisingly very smooth!

First of all, make sure you run the dependency script:

{% highlight bash %}
$ python download-deps.py
{% endhighlight %}

This will obviously make sure you have all the dependencies.

After that, make sure you remove all the linked libraries in the build phase, except cocos. Here are the before and after screenshots:

{%img center caption no-invert http://mazyod.com/images/build-phases-xcode-before.png "" "" %}

{%img center caption no-invert http://mazyod.com/images/build-phases-xcode-after.png "" "" %}

Finally, update the linker flags to use the new Cocos2d-x way of linking against libraries:

{%img center caption no-invert http://mazyod.com/images/xcode-linker-flags.png "" "" %}

That was pretty much it for me!

Now, time to look into all these deprecations, and see how can I resolve them ...

