---
author: mazyod
comments: true
date: 2012-05-04 19:15:36+00:00
layout: post
slug: a-bit-step-forward-2
title: A Bit Step Forward
wordpress_id: 230
tags:
- and
- bit operations
- Computer
- enterprise-it
- enum
- loading
- masking
- Objective-C
- or
- preferences
- Programming
- programming in objective c
- saving
- settings
- shift operator
- technology
---

**WARNING: This post is not intended for the faint heart and is also not intended for people who hate blabbers .. I am in a mood that tells me I am about blabber a LOT**

That warning reminded of the green screen warning you see before a movie trailer .. anyways, going on to the post!

Through the strive to move forward (Susume in Japanese, as I believe), I decided to take a Bit step forward.. Sometimes a Bit is better than a Byte! That is not a (Ga6ah), but it's the Shinri!! I mean, It's the Truth!!

While programming in objective-C, I have taken interest in something while looking at apple's header files code, and other awesome people's code around the net. They had very attractive code, at least to me, that I decided to try out today. With that being said, I have tried to apply it once in my Dama game, but failed horribly, whether because of my ignorance or it wasn't the appropriate place to use that thing..

If you are not jumping up and down on the chair, gritting your teeth, while pulling your hair from excitement, well go ahead and do it.. It's a really exciting topic! :)

... Done? Ok, let's start the real deal!


## Introduction


While coding the project that I have been talking about in some of the previous posts, yes the one I am yet to disclose, a very annoying problem popped up. Interestingly, it also has to do with the settings, which implies the settings journey wasn't over after all!

The problem was the large and ugly amount of primitives that are associated with the settings view that I had. (What the heck is that guy talking about?!) Don't worry, that was suppose to be a bit ambiguous :P. So, let's take an example, shall we? Take a good look at the following settings view:

[![](http://mazyod.files.wordpress.com/2012/05/settingsscreen-cocoa-nstoolbar.png)](http://mazyod.files.wordpress.com/2012/05/settingsscreen-cocoa-nstoolbar.png)

Ok, after looking at it, imagine how are we going to save the checkboxes states and the popup buttons selections. Don't worry about how to save the font, size, and colors for now. (NOTE: Without using Cocoa Bindings. I have my reasons for not using them).

Done? Ok, so, the checkboxes should obviously be saved as a boolean whether they are checked or not, and the popup button, we can just save the index selected. good enough?

Now imagine we have to pass these values all around the application. On top of that, we have 6 more settings view other than this one!! Previously, I implemented each setting by itself. As in, add a new class and call it StatusItemSettings with instance variables: boolean isEnabled, boolean isIconEnabled ... etc. that was hellishly annoying!


## Coding:



So here comes the awesome Bit! (For the record, the code has been changed for brevity sake, and partial closure of the idea :P)

{% highlight objc %}
/*    
    The binary awesomeness:    
    1-bit: Icon    
    1-bit: Name    
    2-bit: Extras    
*/    
typedef enum EStatusItemType     
{    
    //Masking awesomeness    
    EStatusItemOff             = 0,    
    EStatusItemIcon            = 1 << 0, //xxx1    
    EStatusItemName            = 1 << 1, //xx1x    
    //Just a start point, the rest are not masks    
    EStatusItemExtrasNone      = 0 << 2, //00xx    
    EStatusItemExtrasRemaining = 1 << 2, //01xx    
    EStatusItemExtrasTimeLeft  = 2 << 2, //10xx    
    EStatusItemExtrasTimeRem   = 3 << 2, //11xx    
    //Their awesome mask:    
    EStatusItemExtrasMask      = 3 << 2, //11xx    
    EStatusItemFontMask        = 7 << 1  //111x    
} EStatusItemType;

{% endhighlight %}


Wth... ? Well, erm, let me try to explain :). We shall save the setting in a single robust, reliable variable! YES, it is possible! :)

From what I figured, enums have two useful useness:
	
  1. What we are all aware of. Save a number of things as names instead of indicies. Then, we can use a switch statement or for loop to enumerate.

**Example:** enum Days { Sunday, Monday, ...}
**Note:** Notice how the enums are mutually exclusive. You can't have a day that is both saturday and sunday (that would be the best day ever, though).
	
  2. Save a bunch of stuff that are not necessarily mutually exclusive!
**Example:** The settings view we have!


Now, in the second case, it is most likely we cannot enumerate the enums, but check out they can be used!

We divide the enums in a binary string such that each each substring has some significance .. Let's look at our enum:

{% highlight objc %}
//Shift the 1 to the left by 0, making it take the first bit 
EStatusItemIcon            = 1 << 0, //xxxx1 
//Shift the 1 to the left by 1, making it take the second bit 
EStatusItemName            = 1 << 1, //xxx1x

{% endhighlight %}

So, that is basically how you reserve a bit for your setting option. Now, what if the setting option for the icon was selected and we wanted to save that? Easy!

{% highlight objc %}
// Start with a fresh type. It looks like '0000' 
EStatusItemType type = 0; 
  
if ( iconIsSelected ) 
    type = type | EStatusItemIcon; 
    // That's it!

{% endhighlight %}

Nifty ! That's the bit-wise OR operator. By using this operator, we effectively stored that the checkbox is checked in the type variable. This also applies to the Name checkbox, too!

Now, comes the other trick. The Popup button shows a list that is mutually exclusive. In other words, only one index can be selected at any one time. We can use the previous idea, and reserve a bit for each option, but that would be a waste! In my case, I have 4 options in that button, and that would mean I have to reserve 4 bits. Instead, I decided to reserve 2 bits, and make use of all the combinations! 00, 01, 10, 11 :D

Of course, I do not want to bother calculating how much is 0000, 0100, 1000, 1100 (because the first two bits are reserved), so, I just put 0, 1, 2 ,3 .. all shifted to the left by two bits :D

Now, onto the idea of how to use this new technique. Unlike the OR operator, we have to do things a bit (small case b) differently.

{% highlight objc %}
type = type | (selectedIndex << 2); 
    //That's it!!! xD

{% endhighlight %}

Notice how simple it is!! Of course, we just have to map the indices to the enum counterparts, but that's all!

The small caveat here is a bit of maintainability issues due to the brain stretching that would happen if you were to tamper with it to change/add/remove settings.
