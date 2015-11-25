---
layout: post
title: "What the Snippet"
date: 2014-06-03 06:44:05 +0400
comments: true
categories: 
- cocos2dx
- v3.0
- snippets
- xcode
- video
- tutorial
- productivity
- development
- workflow
- fast
- code
---

I am **really** getting used to this video blogging business. It feels like I want to make all future posts videos. So easy, so convenient...

This one is about using Xcode snippets to speed up your development. I present a use case with cocos2d-x, but it can be used with anything really... Even [Swift](https://developer.apple.com/swift/) ;).

[Youtube link](https://www.youtube.com/watch?v=TSY0vNLnLYc)

Here are the snippets. Just drag the code over to the snippets area in Xcode:

{% highlight c++ %}
class <#class#> : public <#superclass#>
{
    
public:
    
    static <#class#> *create(<#args-definition#>);
    virtual bool init(<#args-definition#>);
    
};

{% endhighlight %}

{% highlight c++ %}
<#class#> *<#class#>::create(<#args-definition#>)
{
    <#class#> *obj = new <#class#>();
    obj->init(<#args#>);
    obj->autorelease();
    
    return obj;
}

bool <#class#>::init(<#args-definition#>)
{
    if (!<#superclass#>::init(<#superargs#>))
    {
        return false;
    }
    
    return true;
}

{% endhighlight %}
