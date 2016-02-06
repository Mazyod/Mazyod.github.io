---
layout: post
title: "Using NSProxy With UIKit"
date: 2014-03-10 19:22:35 +0400
comments: true
categories: [objective-c, uikit, nsproxy, proxy-design-pattern, ios]
---

## Introduction

I am really having trouble with this introduction... I erased it and started all over like 5 times now. Well, no more. What ever comes out, it shalt remain...

I wanted to express this new source of inspiration, motivation and even an escape from the endless piles of work that is waiting to get done. That source is ... Books! Not any type of books, though. Books that provide extremely useful information and advice, and at the same time are deep and honest, as well as funny, mind you. Can't stay focused without a little laugh. The first book I started with is [Jeff Atwood's](http://blog.codinghorror.com/) awesome book, [Effective Programming: More Than Writing Code](http://www.hyperink.com/Effective-Programming-More-Than-Writing-Code-b1559). I have honestly yet to finish the book, I recently started.

The great thing about this book is how it insanely it influences my thoughts, mood, and motivation. I have stopped to read this book three times now, and I couldn't continue reading more than 8 pages at a time (plus the links to videos and posts). I would start reading the book because I am feeling tired from working, or I just woke up in the morning, and I'm just not feeling it. After reading through the book, just a few pages, I just can't help but jump and start getting productive. The only reason I am writing this blog right here, right now, is because of that freakin' Voodoo book... I say that because, while reading the book just now (I read 3 pages), I reached this part:

> I wasn't trying hard enough. I had forgotten. I can't fully process all the things that are happening to me until I write about them. I have to be able to tell the story to understand it myself. My happiness only becomes real when I share it with all of you.
> <cite>[Jeff Atwood](http://blog.codinghorror.com/10-years-of-coding-horror/)</cite>

After working the whole day on this problem (which I have been thinking about for a while), I came up with some interesting results that weren't found in the [StackOverflow question](http://stackoverflow.com/questions/5061223/anybody-successful-with-nsproxy-of-uiview-e-g-uilabel) that addresses that exact same problem. Unfortunately, tired from grinding the whole day, I decided to leave writing about it to another day... A day that may never come. Fortunately, I picked up Jeff's book (or actually the iPad) and started reading. 15 minutes later, here I am writing the post I wanted to write! Tell me this isn't Voodoo.

## Problem Statement

I was entrusted with the deceivingly mundane task of localization. The task quickly because more interesting when I realized we need to support two languages: English (Left-To-Right) and Arabic (Right-To-Left). Text alignment and other code-side changes weren't anything if statements couldn't solve, however, the dreaded XIB files were the main issue. In my previous apps that preceded Xcode 5, I had to create and manage multiple XIB files, which was just plain annoying... Not with Xcode 5!

Thanks to Apple's AutoLayout system, flipping the UI around was surprisingly easy! Specifically, assigning leading and trailing spaces for subviews will make the layout intelligently switch between LTR and RTL. Unfortunately, Apple didn't take it a step further to support flipped controls, specifically `UISegmentedControl` in my case.

![image](/images/segmented-en.png) ![image](/images/segmented-ar.png)

As you can see, this is the problem:

{% highlight objc %}
SegmenedControl
// We need to set the first word at the left for LTR, and right for RTL:
NSString *title = NSLocalizedString(@"First", @"");
// LTR languages
[segmentControl setTitle:title atIndex:0];
// RTL languages
[segmentControl setTitle:title atIndex:lastIndex];

{% endhighlight %}

Doing this manually everywhere is error prone, and gets tedious really quickly... So, that needed to be solved.

## The Solution

If you are thinking about sub-classing; just forget it. Using a subclass solution requires knowledge or control over the instance storage, especially when the guys who wrote those classes work at Apple. Let's look at this simple reversed back-trace to see how sub-classing can easily break:

{% highlight objc %}
SegmenedControl Possible Backtrace
- [SegmentControlOwner drawViews]
- [UISegmentedControl drawRect:]
/* will the drawing logic use the accessor... */
- [CustomSegmentedControl selectedSegmentIndex]
 /* ...or directly read the _selectedSegment ivar? */

{% endhighlight %}

As you can see, the superclass may query the selected segment's index either through direct instance variable access or by using the `selectedSegmentIndex` accessor. Since these two approaches yield different results, we might leave the object at an inconsistent state. "How about we disable localization logic when the calls are coming from the object itself?". [Not possible, at least not in ObjC](https://www.google.ae/webhp?gfe_rd=cr&ei=zdMeU6CuOuLW8genmYHIDQ#q=objc+check+method+caller).

The first thing that crossed my mind was to wrap the object with a proxy that would flip all the segment indexes coming in and out of the control:

![image](/images/segment-sequence-1.png)

That seemed like to much work, so I went ahead and implemented a simple category that the developer has to call in order to get the proper result [(available on github)](https://github.com/Mazyod/RTLSegmentedControl). The way it works is simple: Replace all your calls that are related to the segment index with the methods found in the category, and it will check if the user's language is RTL, and flip accordingly:

{% highlight objc %}
SegmenedControl
// Old code
[control insertSegmentWithTitle:title atIndex:segment animated:animated];
[control insertSegmentWithImage:image  atIndex:segment animated:animated];
[control removeSegmentAtIndex:segment animated:animated];

// New code
[control insertSegmentWithTitle:title atLocalizedIndex:segment animated:animated];
[control insertSegmentWithImage:image  atLocalizedIndex:segment animated:animated];
[control removeSegmentAtLocalizedIndex:segment animated:animated];

{% endhighlight %}

**Is that it?** No way. I summoned the motivation necessary to try out the proxy design, and I came here today *mainly* to discuss my findings.

## Marrying NSProxy to UIKit

Let's first debrief the reader (hey, that would be you!) about the `NSProxy` class.

<a name="Enter-the-NSProxy-Class"></a>
### Enter the NSProxy Class

The `NSProxy` class is one the *very* special classes, since it **does not** inherit from `NSObject`. It is also an "abstract" class. I add the quotes since the compiler doesn't stop you from instantiating an object, as you might see in other languages. It is, however, useless without a subclass.

Remember, a proxy is like a middle-man between an object and the outside (or inside) world (*see sequence diagram figure above*). Hence, sub-classing `NSProxy` allows you to handle the intercepted messages. It can also allow you to wreck havoc by altering method signatures, provide fake interfaces, and all sorts of voodoo, but let's leave that for another time... A time when I have my handy staff with me.

So, the method we are interested in is:

{% highlight objc %}
NSProxy Forwarding Method
- (void)forwardInvocation:(NSInvocation *)invocation;

{% endhighlight %}

Whenever a method is called on the proxy object (e.g. `selectedSegmentIndex` shown in the example above), you probably don't want to implement that method in the `NSProxy` subclass! Before raising an exception, the [Objective-C runtime](https://developer.apple.com/library/ios/documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Articles/ocrtForwarding.html) will attempt to forward you the **invocation** that occurred to the target, and give it another chance to respond. *(An invocation is simply a structure that defines a target and a selector)(The example found in Apple's docs is awesome. Link above)*.

Code speaks louder than words:

{% highlight objc %}
forwardInvocation: example PART 1
- (void)forwardInvocation:(NSInvocation *)invocation
{
    NSString *selString = NSStringFromSelector(invocation.selector);
    /* e.g. just return an NSNull, we don't handle this */
    if ([selString isEqual:@"someMethodName"])
    {
        /* let's assume we want to return NSNull */
        void *returnValue = (__bridge void *)[NSNull null];
        [invocation setReturnValue:&returnValue];
    }
    /* e.g. we want to alter the arguments */
    else if ([selString isEqual:@"getThingAtIndex:"])
    {
        NSInteger index;
        [invocation getArgument:&index atIndex:2];
        /* note above, arg0 is ALWAYS the target, arg1 is _cmd */

        /* Do validation, maybe? set the index again */
        index = MAX(0, index);
        [invocation setArgument:&index atIndex:2];

        /* self.target is the encapsulated object */
        /* calling invoke will also set the returnValue for us */
        [invocation invokeWithTarget:self.target];
    }
}

{% endhighlight %}

The above means...

{% highlight objc %}
forwardInvocation: example PART 2
id returns = [daProxy someMethodName];
/* Yay! We handled the method, and even returned a value! */
NSAssert(returns == [NSNull null], @"Must succeed");

{% endhighlight %}

OK, that about sums it up as far as the `NSProxy` introduction goes.

### The Fail

OK, so now we are going to see how the proxy implementation went as far as wrapping it around a `UISegmentedControl`. Remember, we want to take an incoming index, and flip it. We also want to do the same for the outgoing indexes.

I'll also say this: The journey down this path was full of failed attempts, so brace yourselves for what's to come.

#### ROUND 1

The first fail was 100% my fault. I jumped headfirst into the implementation and got a punch right between the eyes. You see the `forwardInvocation:` example above? I assumed that ALL return values and arguments are objects. I assumed that much because that's how KVC works. Even if you have an `int` property, when accessed via KVC, you would use `NSNumber` object wrappers.

#### ROUND 2

After fixing the issue above, I got a really strange error from `initWithCoder:`, which is called, since the object is instantiated from a nib.

{% highlight text %}
*** Terminating app due to uncaught exception 'NSGenericException', reason:
'This coder requires that replaced objects be returned from initWithCoder:'

{% endhighlight %}

What's that suppose to mean? After thinking about it for a bit, I realized that `initWithCoder:` returns `self`, which is the internal protected object! (The segmentedControl in our case). BAD! Let's fix that. So, here is what I did:

{% highlight objc %}
Protecting the Proxied Object
[invocation invokeWithTarget:self.target];
/* if returnValue is the target, substitute with self */
/* NOTE: returnValue is a convenience method from a category */
NSValue *returnValue = [invocation returnValue];

if (self.target == [returnValue pointerValue])
{
    void *newValue = (__bridge void *)(self);
    [invocation setReturnValue:&newValue];
}

{% endhighlight %}

That should be easy to grasp, right? Rule #1 in the proxy design pattern, don't talk about the proxy design pattern. No, really, rule #1 is to **never** expose the internal object. That's why whenever we catch an invocation in `forwardInvocation:`, we have to check if the invocation's method returns the internal object. If it does, replace it with the proxy.

#### ROUND 3

This is when I reached the real roadblock. [This is where developers from StackOverflow stopped, as well](http://stackoverflow.com/questions/5061223/anybody-successful-with-nsproxy-of-uiview-e-g-uilabel). We got a strange error:

{% highlight text %}
The Crash
-[RTLSegmentedControl superlayer]: unrecognized selector

{% endhighlight %}

The most important question that we should be asking ourselves here is, how in the name of- did someone access the RTLSegmentedControl without our knowledge! I made a dump of all the messages passed to the proxy (which itself passes them to the internal object), and `superLayer` was **not** one of them! This is when you use your knowledge from lower level languages!! By observing the `UIView` headers, I noticed that:

1. The first instance variable is `CALayer *layer`
2. The variables were declared as `@package` accessible
3. `UIView`'s superclasses don't have *any* instance variables (besides the `isa`)

**Interesting!** We obviously have a situation of direct pointer access here, for optimization maybe? What apple is doing in their framework is something like:

{% highlight objc %}
Direct Pointer Access
/* Somehow, instantiate a view */
UIView *theView = ... /* Remember, here we pass the proxy! */;
[theView->_layer superlayer];

{% endhighlight %}

To quickly test this out, I added a property above the target property in the proxy subclass, and it got me a bit further down the chain! Didn't quite work, mind you, just proved that this is issue.

So, what should we do to solve that? Summon the Black Magics.

### Don't Try This At Home

To solve this problem I thought of two solutions, an awful one, and a crappy one.

#### TRANSFORMERS

The first solution I implemented was to *transform* the proxy object. *What does that mean?* Exactly what it sounds like! Temporarily change the proxy object to the internal object! *Uh, is that even possible?* You bet it is, and here is how it's done:

{% highlight objc %}
NSObject+Voodoo
@implementation NSObject (Voodoo)

+ (void)hotSeat:(id *)original :(id *)replacement
{
    *original = *replacement;
}

@end

/* ... Somewhere in the proxy class */
[NSObject hotSeat:&self :&_target];

/* So, what we are doing ultimately is... */
self = target; // THIS!

{% endhighlight %}

We simply reassign self to something else! The only reason I went through the trouble of implementing a Voodoo category, and passed pointers around is because direct self assignment is disabled in ARC. So, yes, the category has ARC disabled.

Did that work? No, it was the worst idea of all time. It wasn't easy to revert back after transforming! What would Optimus Prime say?

#### ROBIN HOOD

Instead of the above, I thought about stealing instead... Let's not transform the proxy object, but rather, have it *steal* the pointers from the protected segmentedControl object! What I mean is this:

{% highlight objc %}
Stealing Like a Pro
/* This is inside the proxy class, self is the proxy object */
// 1 - Treat the target object as a pointer to a pointer
// 2 - Get the address at index 1 (index 0 is the isa)
self->_layer = ((id *)_target)[1];

{% endhighlight %}

And **THAT** worked! When that piece of code in apple's framework tried to access the layer through direct pointer access, it finds it in the proxy object!! Yaaay!

### The Win

So, it worked! I ran the project, and all the controls are being flipped automagically, and it seemed like it's raining unicorns and kittens. Actually, note really :(

### The Fail, Revisited

Here is when I noticed that stealing is bad. I only handled the CALayer's case, and it seems like there is another access optimization going with AutoLayout, since that gave out errors as well when enabled. I also got a few random crashes from time to time. Random crashes are the Aizen of programming, or the Yagami Light, or even the Hisoka!! (OK, that's going too far there).

In any case, that's where I decided to leave it at, and that's that as far as this thing goes!!

*P.S: The complete code can be found in the `RTLSegmentedControl` repository, [under the proxy-pattern branch](https://github.com/Mazyod/RTLSegmentedControl/tree/proxy-pattern).*
