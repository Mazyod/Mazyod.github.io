---
layout: post
title: "Blocks Are Evil"
date: 2014-03-23 01:23:57 +0400
comments: true
categories: 
- objective-c
- blocks
- snippets
- rant
- programming
---

I really hope it is not just me who get gets obsessed with a technique and thinks it solves everything... Back in the day, learning about singletons made me write freaking UI components as singletons. It seemed like it's the solution to everything... Then, there is my obsession with [Objective-C's categories](http://mazyod.com/blog/2014/03/22/a-doh-moment/), and now them C-Blocks!

{% highlight objc %}
// C block sample (lambda functions)
void(^completionHandler)(id, NSError *) = void(^)(id result, NSError *error)
{
    if (!error)
    {
        // yaay! do stuff with result
    }
    else
    {
        // Booo! Fail/degrade gracefully
    }
}

// to trigger:
completionHandler();

// can even be stored as ivars and passed as arguments:
self.handler = completionHandler;
[otherObject downloadStuffWithCompletionHandler:completionHandler];

{% endhighlight %}

Trust me, it becomes so tempting to write these blocks for everything...

### The Twitter Problem

Writing a wrapper around Twitter's service has been extremely painful with [`STTwitter`](https://github.com/nst/STTwitter). When I made the switch from Apple's APIs, the first thing that bit me hard is the in ability to clearly distinguish the privileges I have.

To use `STTwitter`, you have to initialize it with some stuff that determine what time of authentication the API uses beneath... __And that freaking auth object is private!__ 

I mean, I can't easily tell in the middle of execution what privileges I have. Can I access the user's timeline? How about Direct messages? ... etc. Apple's API was so awesome, since you only had to manage a single object, that can upgrade and degrade as necessary. Not here, where you have to reinitialize your object each time something happens.

Let's make a quick sequence diagram, since I feel like making one:

![](/images/twitter-auth-sequence.png)

### Which Brings Us to the Problem

So, the problem is, the view above is passing a `CompletionHandler` block to the custom application wrapper, which sends a block to the `STTwitterAPI`, since that is how it's built, and then I have asynchronous madness going on all of the sudden, that gets more complicated when I need to show the user a list of twitter accounts to choose from before I can proceed...

## Conclusion

Blocks are awesome, they are not the solution to everything. It makes 100x more sense in this case for the view to request-and-forget the timeline, then whenever it is ready, the `TwitterWrapper` sets the timeline property on itself, which is observed for changes by the View. Le Done!

