---
author: mazyod
comments: true
date: 2012-04-21 07:11:42+00:00
layout: post
slug: a-bunch-of-nonsense
title: A Bunch Of Nonsense
wordpress_id: 217
tags:
- cocos2d
- delegate
- delegation
- design patterns
- iOS
- journey
- Mac
- Objective-C
- objects
- observer
- OOP
- Programming
- Settings programming
---

I really do not know why I suddenly decided to call a blog post "Nonsense", since they have all been pretty much nonsense-ful...

Either ways, since the title is very ambiguous and vague, let me give you a briefing about the things that will (or at least should be) covered by this post. It's like the abstract that you see before reading a publication, or the back of a story that gives you the plot, or .. that's enough examples I say.

So, this post should cover:



	
  1. How the settings journey ended.

	
  2. Some Dama news

	
  3. Some personal stuff, that I advise you skip




* * *





## "The 1000 Mile Journey Starts With a Step" - Unknown


I am not sure who said the previous proverb, but it was clearly someone who has never heard of JetPacks. So, I'll write my own modern proverb that will be remembered more than his: "The 1000 Mile Journey Starts With an Ignition!".

That's all for an introduction.. As for the blog post:
The settings journey was a mess. It was like you would head out of your home, with absolutely no idea where the nearest KFC is. After thinking about how it should be implemented, and discussing it with my mates, it turned out to boil down to two approaches:



	
  1. Add a Singleton Settings manager. Inside, implement methods to change a group of settings as necessary, and then add a protocol to each group. Finally, make the interested views implement the protocol and become a delegate at the settings manager. That is to day, the settings manager will have an array of delegates for every set of settings.

_**Example:**_ We have a group of settings to change the sounds associated with the alerts that the application shows. So, by changing a group of sounds in the settings, the user Innocently invokes a method call on the settings manager that could be something like:

{% highlight objc %}
- (void)settingsChangedAlert1Sound:(NSString*)newSound1 alert2Sound:(NSString*)newSound2 
// ... and so on, and so forth.

{% endhighlight %}

Then, inside the settings manager, and specifically inside the invoked method, we do something like: 

{% highlight objc %}
for (id<soundSettingsDelegate> delegate in self.soundSettingsDelegate) 
    [delegate settingsChangedAlert1Sound:newSound1 alert2Sound:newSound2 ...]

{% endhighlight %}

	
  2.  Add a Singleton Settings manager. Inside, implement methods to change a group of settings as necessary. Nothing new up until now.. Then, send a notification using NSNotificationCenter that the settings have been changed. This is awesome, that we don't have to worry about who is listening to the settings changed ..

BUT! The problem is, how can we send the objects newSound1, newSound2, ...)?? Our possibly only choice is to create a new NSDictionary and add the objects to it and send it inside the NSNotification* as a userInfo. This introduces unnecessary headache to the observers, as they have to read the dictionary and figure out the keys and .. it is simply a pain.


After the above compare and contrast, we came to the conclusion that the settings manager should be implemented using the first method. However, after using the first method, it turned out torturing.. That was because we have to worry about two painful things:

	
  1. the NSArray of delegates retains the delegates, so we must somehow remove the delegate from the array before the dealloc method, which is REALLY not trivial in a Mac (Cocoa) application (unlike an iOS app). However, this was thankfully solved by a stackOverflow guy who wrote a category for NSMutableArray to hold weak references to its objects .. awesome, I know.

	
  2. ... I don't remember the second one anymore >_>.


Anyways, this is where the hybrid mode came into existence! The hybrid mode says: "Use the best of the two worlds! Use the observer pattern to remove any delegation complication, and use the parameter passing to give fine-tuned access to the observers!"

.. but how?? Well, you make a new class for each and every group of settings!! For the sound example we have, you would post an NSNotification with the object as a new (SoundSettings*) object. This class is specially added to contain the parameters! Then, in the observer, we would use: SoundSettings* settings = [notification object]; .. And life is good!!


* * *


## "Cocos2d awesomeness"


Cocos2d is truly awesome .. It is not epic, but only awesome. By spending only a couple of hours on the Dama iOS project, which was based on Cocos2d v.1.0.1, I was able to port it to the Cocos2d v2.0 Mac version! Yes, the game now runs on Mac!! :D

[![](/images/screen-shot-2012-04-20-at-6-41-01-pm.png)](/images/screen-shot-2012-04-20-at-6-41-01-pm.png)

Not to say there aren't any caveats, but it runs! With sound!

Now, why isn't this epic? Because it can't be ported as easily to Android :(.




* * *



## "What 45 Days Mean"


+ 45 Days = Freedom.
+ 45 Days = Full time programming.
+ 45 Days = An eng. prefix.
+ 45 Days = AppStore Domination.
+ 45 Days = Chilli's Molten cake + candle.
+ 45 Days = Travel.

...

45 Days Simply Equals ...


### GRADUATION.
