---
author: mazyod
comments: true
date: 2012-08-12 12:13:38+00:00
layout: post
slug: kvc-kvo-replacing-pillars-with-magic
title: 'KVC & KVO: Replacing Pillars with Magic'
wordpress_id: 257
---

[Mukashi, Mukashi](wiki.answers.com/Q/What_does_mukashi_mean) .. There lived two young kids, a boy (names KVC) and his sister (named KVO). You see, they were born twins, and the laws of mortality did not apply to them. (Plain and simple, they never aged for some reason). They lived happily in the forest, where they survived by utilizing their two main skills:



	
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

    
    <table cellpadding="0" cellspacing="0" class="code_page"><tr><td><span> 1 </span></td><td><div><span style="color:#66D9EF;">@</span><span style="color:#66D9EF;">interface</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">Foo</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">:</span><span style="color:#F8F8F2;"> </span><span style="color:#A6E22E;">NSObject</span><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 2 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 3 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">id </span><span style="color:#F8F8F2;">var1;</span>
    </div></td></tr><tr><td><span> 4 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">id </span><span style="color:#F8F8F2;">var2;</span>
    </div></td></tr><tr><td><span> 5 </span></td><td><div><span style="color:#F8F8F2;">    ...</span>
    </div></td></tr><tr><td><span> 6 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">id </span><span style="color:#F8F8F2;">varN;</span>
    </div></td></tr><tr><td><span> 7 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr></table>


Now, with this class having all theses [iVars](en.wikipedia.org/wiki/Instance_variable), it would be a pain to do something like:


    
    <table cellpadding="0" cellspacing="0" class="code_page"><tr><td><span> 1 </span></td><td><div><span style="color:#F8F8F2;">Foo* foo = </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">Foo </span><span style="color:#66D9EF;">alloc</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">init</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 2 </span></td><td><div><span style="color:#F8F8F2;">foo.var1 = ...;</span>
    </div></td></tr><tr><td><span> 3 </span></td><td><div><span style="color:#F8F8F2;">foo.var2 = ...;</span>
    </div></td></tr><tr><td><span> 4 </span></td><td><div><span style="color:#F8F8F2;">...</span>
    </div></td></tr></table>



What's the alternative? KVC! Here is how it works:

    
    <table cellpadding="0" cellspacing="0" class="code_page"><tr><td><span> 1 </span></td><td><div><span style="color:#F92672;">for</span><span style="color:#F8F8F2;"> (</span><span style="color:#66D9EF;">int</span><span style="color:#F8F8F2;"> i = </span><span style="color:#AE81FF;">1</span><span style="color:#F8F8F2;"> ; i<=N ; i++) </span>
    </div></td></tr><tr><td><span> 2 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 3 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">NSString</span><span style="color:#F8F8F2;">* varName = </span><span style="color:#F8F8F2;">[</span><span style="color:#66D9EF;">NSString</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">stringWithFormat</span><span style="color:#66D9EF;">:</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">var%d</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">, i</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 4 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">foo </span><span style="color:#66D9EF;">setValue</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">[</span><span style="color:#66D9EF;">NSNumber</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">numberWithInt</span><span style="color:#66D9EF;">:</span><span style="color:#AE81FF;">22</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">forKey</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">varName</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 5 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr><tr><td><span> 6 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 7 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">//</span><span style="color:#75715E;"> And inorder to read the vars in a similar fashion:</span>
    </div></td></tr><tr><td><span> 8 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#66D9EF;">int</span><span style="color:#F8F8F2;"> var1 = </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">foo </span><span style="color:#66D9EF;">valueForKey</span><span style="color:#66D9EF;">:</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">var1</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">intValue</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr></table>


Notice two things:



	
  1. The instance variable we are setting is of type `int`, while we are sending and `NSNumber` object.

	
  2. What the heck happens if the setters and getters are overriden?!

	
  3. The value we are settings might not be so conveniently easy to determine.


Regarding the first note, it's fine. KVC is smart enough to send the NSNumber as an int to the instance variable. The second case is similarly handled by KVC, in the sense that it will call your custom setters & getters, no worries.  However, the third case is tough. It is true that most of the time you probably don't have such a convenient value to set.We will see about that after exploring KVO.


## KVO: Key-Value Observing


Remember what was KVO's job? Observe. Thus, it is quite simply useful to observe any changes on the instance variable that we have. This is a useful alternative for delegates in simple cases, where defining a protocol and setting up a delegate is just an overkill. Imagine a game with a gun. No, not a game holding a gun, but rather a game that contains a gun that the player can fire. Now, imagine that this gun cannot fire two simultaneous shots. Now, here are some approaches that are available:

    
    <table cellpadding="0" cellspacing="0" class="code_page"><tr><td><span>  1 </span></td><td><div><span style="color:#75715E;">/*</span><span style="color:#75715E;"> Polling approach. Yuck! </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span>  2 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  3 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">//</span><span style="color:#75715E;"> Inside the gun class:</span>
    </div></td></tr><tr><td><span>  4 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">void</span><span style="color:#F8F8F2;">)fireBullet </span>
    </div></td></tr><tr><td><span>  5 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  6 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#75715E;">//</span><span style="color:#75715E;"> check if bullet exited the screen</span>
    </div></td></tr><tr><td><span>  7 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">bullet</span><span style="color:#F8F8F2;">.ready</span><span style="color:#F8F8F2;"> || bullet</span><span style="color:#F8F8F2;">.position.x</span><span style="color:#F8F8F2;"> &gt; </span><span style="color:#AE81FF;">400</span><span style="color:#F8F8F2;">) </span>
    </div></td></tr><tr><td><span>  8 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  9 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">self</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">reloadBullet</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">bullet</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 10 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">bullet </span><span style="color:#66D9EF;">fireWithAngle</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">zelta</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 11 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">bullet </span><span style="color:#66D9EF;">setReady</span><span style="color:#66D9EF;">:</span><span style="color:#AE81FF;">NO</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 12 </span></td><td><div><span style="color:#F8F8F2;">    }</span>
    </div></td></tr><tr><td><span> 13 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr></table>


Some of us might started thinking, what's wrong with that? Nice, simple and it works! Well, not exactly. What if the player fires a shot and stops? The bullet would eventually go off screen and continue moving with no reason at all!! Even more, what if we wanted to show the user whether he has a bullet reloaded? It won't be possible without a delegate:

    
    <table cellpadding="0" cellspacing="0" class="code_page"><tr><td><span>  1 </span></td><td><div><span style="color:#75715E;">/*</span><span style="color:#75715E;"> Polling approach, with delegate. Gross! </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span>  2 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  3 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">//</span><span style="color:#75715E;"> Inside bullet class:</span>
    </div></td></tr><tr><td><span>  4 </span></td><td><div><span style="color:#75715E;"> </span>
    </div></td></tr><tr><td><span>  5 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">//</span><span style="color:#75715E;"> this method updates the bullet position each frame</span>
    </div></td></tr><tr><td><span>  6 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#75715E;">//</span><span style="color:#75715E;"> thus we see an animation of the bullet moving:</span>
    </div></td></tr><tr><td><span>  7 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">void</span><span style="color:#F8F8F2;">)update </span>
    </div></td></tr><tr><td><span>  8 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  9 </span></td><td><div><span style="color:#F8F8F2;">    self</span><span style="color:#F8F8F2;">.position.x</span><span style="color:#F8F8F2;"> += </span><span style="color:#AE81FF;">1</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 10 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">self</span><span style="color:#F8F8F2;">.position.x</span><span style="color:#F8F8F2;"> &gt; </span><span style="color:#AE81FF;">400</span><span style="color:#F8F8F2;">) </span>
    </div></td></tr><tr><td><span> 11 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 12 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">delegate </span><span style="color:#66D9EF;">bulletDidExitScreen</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">self</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 13 </span></td><td><div><span style="color:#F8F8F2;">    }</span>
    </div></td></tr><tr><td><span> 14 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr><tr><td><span> 15 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 16 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">//</span><span style="color:#75715E;"> Inside the gun class:</span>
    </div></td></tr><tr><td><span> 17 </span></td><td><div><span style="color:#75715E;"> </span>
    </div></td></tr><tr><td><span> 18 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">//</span><span style="color:#75715E;"> handle delegate method:</span>
    </div></td></tr><tr><td><span> 19 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">void</span><span style="color:#F8F8F2;">)bulletDidExitScreen:(Bullet *)bullet </span>
    </div></td></tr><tr><td><span> 20 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 21 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">self</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">showBulletAvailable</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 22 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">bullet </span><span style="color:#66D9EF;">setReady</span><span style="color:#66D9EF;">:</span><span style="color:#AE81FF;">YES</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 23 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr><tr><td><span> 24 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 25 </span></td><td><div><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">void</span><span style="color:#F8F8F2;">)fireBullet </span>
    </div></td></tr><tr><td><span> 26 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 27 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#75715E;">//</span><span style="color:#75715E;"> No longer need to check if bullet exited the screen</span>
    </div></td></tr><tr><td><span> 28 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">bullet</span><span style="color:#F8F8F2;">.read</span><span style="color:#F8F8F2;">) </span>
    </div></td></tr><tr><td><span> 29 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 30 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">self</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">reloadBullet</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">bullet</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 31 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">bullet </span><span style="color:#66D9EF;">fireWithAngle</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">zelta</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 32 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">self</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">showBulletUnavailable</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 33 </span></td><td><div><span style="color:#F8F8F2;">    }</span>
    </div></td></tr><tr><td><span> 34 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr></table>


OK, with that crap out of the way, let's see how KVO does it:

    
    <table cellpadding="0" cellspacing="0" class="code_page"><tr><td><span>  1 </span></td><td><div><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">void</span><span style="color:#F8F8F2;">)fireBullet </span>
    </div></td></tr><tr><td><span>  2 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  3 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#75715E;">//</span><span style="color:#75715E;"> check if bullet exited the screen</span>
    </div></td></tr><tr><td><span>  4 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">bullet</span><span style="color:#F8F8F2;">.ready</span><span style="color:#F8F8F2;">) </span>
    </div></td></tr><tr><td><span>  5 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  6 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">self</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">reloadBullet</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">bullet</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  7 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">bullet </span><span style="color:#66D9EF;">fireWithAngle</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">zelta</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  8 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">self</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">showBulletUnavailable</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  9 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 10 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">bullet </span><span style="color:#66D9EF;">addObserver</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">self</span>
    </div></td></tr><tr><td><span> 11 </span></td><td><div><span style="color:#F8F8F2;">                 </span><span style="color:#66D9EF;">forKeyPath</span><span style="color:#66D9EF;">:</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">position.x</span><span style="color:#E6DB74;">"</span>
    </div></td></tr><tr><td><span> 12 </span></td><td><div><span style="color:#F8F8F2;">                    </span><span style="color:#66D9EF;">options</span><span style="color:#66D9EF;">:</span><span style="color:#66D9EF;">NSKeyValueObservingOptionNew</span>
    </div></td></tr><tr><td><span> 13 </span></td><td><div><span style="color:#F8F8F2;">                    </span><span style="color:#66D9EF;">context</span><span style="color:#66D9EF;">:</span><span style="color:#AE81FF;">NULL</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 14 </span></td><td><div><span style="color:#F8F8F2;">    }</span>
    </div></td></tr><tr><td><span> 15 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr><tr><td><span> 16 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 17 </span></td><td><div><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">void</span><span style="color:#F8F8F2;">)observeValueForKeyPath:(</span><span style="color:#66D9EF;">NSString</span><span style="color:#F8F8F2;"> *)keyPath</span>
    </div></td></tr><tr><td><span> 18 </span></td><td><div><span style="color:#F8F8F2;">                      ofObject:(</span><span style="color:#66D9EF;">id</span><span style="color:#F8F8F2;">)object</span>
    </div></td></tr><tr><td><span> 19 </span></td><td><div><span style="color:#F8F8F2;">                        change:(</span><span style="color:#66D9EF;">NSDictionary</span><span style="color:#F8F8F2;"> *)change</span>
    </div></td></tr><tr><td><span> 20 </span></td><td><div><span style="color:#F8F8F2;">                       context:(</span><span style="color:#66D9EF;">void</span><span style="color:#F8F8F2;"> *)context </span>
    </div></td></tr><tr><td><span> 21 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 22 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">float</span><span style="color:#F8F8F2;"> newX = </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">change </span><span style="color:#66D9EF;">objectForKey</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">NSKeyValueChangeNewKey</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">floatValue</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 23 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#75715E;">//</span><span style="color:#75715E;"> do stuff...</span>
    </div></td></tr><tr><td><span> 24 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">}</span>
    </div></td></tr></table>


Just awesome :) I won't say more.


## With Our Powers Combined!


Now, let me show you how I recently used these two to end up with a pretty-darn darn-pretty design :D.

... I ran out of gas this time ^^; ... Hopefully next time I'll continue.
