---
layout: post
title: "Cocos2dx 3.0 createWithFormat"
date: 2014-04-04 22:09:09 +0400
comments: true
categories: 
- cocos2dx
- ccstring
- string
- createwithformat
- stringwithformat
- format
- c++
- snippets
---

Apparently, the cocos2dx guy introduced a new class, `Value`, which I can see lost of "value" coming from it (I had to get that out of my system).

In any case, `CCString` is gone... and so is the awesome `createWithFormat` method, which allowed us to create string on the fly with format, like the really awesome languages.

Fret not! There is actually a replacement for that in the new API:

{% highlight c++ %}
std::string string = StringUtils::format("Yaaay!! %s %s %s", "This", "is", "Aweeeesome!!")

{% endhighlight %}

