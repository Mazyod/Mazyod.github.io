---
author: mazyod
comments: true
date: 2012-08-12 12:13:38+00:00
layout: post
slug: kvc-kvo-replacing-pillars-with-magic
title: 'KVC & KVO: Replacing Pillars with Magic'
wordpress_id: 257
---

[Mukashi, Mukashi](http://wiki.answers.com/Q/What_does_mukashi_mean) .. There lived two young kids, a boy (names KVC) and his sister (named KVO). You see, they were born twins, and the laws of mortality did not apply to them. (Plain and simple, they never aged for some reason). They lived happily in the forest, where they survived by utilizing their two main skills:




  * KVC would use his awesome trap **setting **techniques to place traps near rabbit holes, then go rest.


  * KVO would then use her keen eyes to **observe** the traps for any changes, and promptly alert her brother if anything happened.


  * KVC would finally **get** the trap containing their loot, and they would enjoy a delicious meal at the end of the day.


Countless years passed, while KVC & KVO enjoyed their peaceful lives in the forest. Until one day, they had an unexpected visitor. They were baffled by his white tuxedo, his silver pocket watch and his shiny shoes. "My name is Mr. Appolous, but you could just call me Apple", said the stranger with a gleeful smirk. The kids just stood there gazing upon Apple.

"Say", Apple broke the silence, "Would you two like to help me by being part of a very successful programming language?" -- BZZT. Wait, say what?!



* * *



Ok, enough with the silly introduction, and onto the blog post :p. I just hope this silly story somehow sticks to your mind and helps you comprehend to some extent what KVC and KVO are, until we dwell into their guts in a bit.

Before writing the blog post about KVC & KVO ... Man, has it been a while!! >.< This Islamicaster project of mine has been ever so stressful with a never ending TODO list. The good news is, it's still full of new things to learn! And thanks to that, I have completely mastered KVC & KVO! (jk, I am no where near a master of them, but I do have enough knowledge to give an overview on their awesomeness ;))

**"KVC & KVO: Replacing Pillars with Magic" **is the title, but what does it really mean? Well, keep that question in one corner of your mind till we explore what KVC & KVO are, then we shall answer this question.

First off, KVC & KVO are **not** always used together. Each has its own divine purpose, and can be used separately. The awesomeness comes from combining them. However, for the sake of this blog post, we shall tackle them one at a time.


## KVC: Key-Value Coding


As you might have deduced from the boring tale above, KVC does two main things:




  1. Sets <del>traps</del> values.


  2. Gets values.


... OK, so what's so cool about that? Well, the way we set and get the values is what's cool. To put it clear and simple, "**KVC allows us to get and set the variables of an object as though it was a dictionary**" (That's not 100% accurate, but leave it like this for now). Consider the following example:

{% highlight objc %}
@interface Foo : NSObject  
{
    id var1;
    id var2;
    ...
    id varN;
}

{% endhighlight %}

Now, with this class having all theses [iVars](http://en.wikipedia.org/wiki/Instance_variable), it would be a pain to do something like:


{% highlight objc %}
Foo* foo = [[Foo alloc] init];
foo.var1 = ...;
foo.var2 = ...;
...

{% endhighlight %}


What's the alternative? KVC! Here is how it works:

{% highlight objc %}
for (int i = 1 ; i<=N ; i++)  
{
    NSString* varName = [NSString stringWithFormat:@"var%d", i];
    [foo setValue:[NSNumber numberWithInt:22] forKey:varName];
}

// And inorder to read the vars in a similar fashion:
int var1 = [[foo valueForKey:@"var1"] intValue];

{% endhighlight %}

Notice two things:




  1. The instance variable we are setting is of type `int`, while we are sending and `NSNumber` object.


  2. What the heck happens if the setters and getters are overriden?!


  3. The value we are settings might not be so conveniently easy to determine.


Regarding the first note, it's fine. KVC is smart enough to send the NSNumber as an int to the instance variable. The second case is similarly handled by KVC, in the sense that it will call your custom setters & getters, no worries.  However, the third case is tough. It is true that most of the time you probably don't have such a convenient value to set.We will see about that after exploring KVO.


## KVO: Key-Value Observing


Remember what was KVO's job? Observe. Thus, it is quite simply useful to observe any changes on the instance variable that we have. This is a useful alternative for delegates in simple cases, where defining a protocol and setting up a delegate is just an overkill. Imagine a game with a gun. No, not a game holding a gun, but rather a game that contains a gun that the player can fire. Now, imagine that this gun cannot fire two simultaneous shots. Now, here are some approaches that are available:

{% highlight objc %}
/* Polling approach. Yuck! */    

// Inside the gun class:    
- (void)fireBullet     
{    
    // check if bullet exited the screen    
    if (bullet.ready || bullet.position.x &gt; 400)     
    {    
        [self reloadBullet:bullet];    
        [bullet fireWithAngle:zelta];    
        [bullet setReady:NO];    
    }    
}

{% endhighlight %}

Some of us might started thinking, what's wrong with that? Nice, simple and it works! Well, not exactly. What if the player fires a shot and stops? The bullet would eventually go off screen and continue moving with no reason at all!! Even more, what if we wanted to show the user whether he has a bullet reloaded? It won't be possible without a delegate:

{% highlight objc %}
/* Polling approach, with delegate. Gross! */    

// Inside bullet class:    

// this method updates the bullet position each frame    
// thus we see an animation of the bullet moving:    
- (void)update     
{    
    self.position.x += 1;    
    if (self.position.x &gt; 400)     
    {    
        [delegate bulletDidExitScreen:self];    
    }    
}    

// Inside the gun class:    

// handle delegate method:    
- (void)bulletDidExitScreen:(Bullet *)bullet     
{    
    [self showBulletAvailable];    
    [bullet setReady:YES];    
}    

- (void)fireBullet     
{    
    // No longer need to check if bullet exited the screen    
    if (bullet.read)     
    {    
        [self reloadBullet:bullet];    
        [bullet fireWithAngle:zelta];    
        [self showBulletUnavailable];    
    }    
}

{% endhighlight %}

OK, with that crap out of the way, let's see how KVO does it:

{% highlight objc %}
- (void)fireBullet     
{    
    // check if bullet exited the screen    
    if (bullet.ready)     
    {    
        [self reloadBullet:bullet];    
        [bullet fireWithAngle:zelta];    
        [self showBulletUnavailable];    

        [bullet addObserver:self    
                 forKeyPath:@"position.x"    
                    options:NSKeyValueObservingOptionNew    
                    context:NULL];    
    }    
}    

- (void)observeValueForKeyPath:(NSString *)keyPath    
                      ofObject:(id)object    
                        change:(NSDictionary *)change    
                       context:(void *)context     
{    
    float newX = [[change objectForKey:NSKeyValueChangeNewKey] floatValue];    
    // do stuff...    
}

{% endhighlight %}

Just awesome :) I won't say more.


## With Our Powers Combined!


Now, let me show you how I recently used these two to end up with a pretty-darn darn-pretty design :D.

... I ran out of gas this time ^^; ... Hopefully next time I'll continue.
