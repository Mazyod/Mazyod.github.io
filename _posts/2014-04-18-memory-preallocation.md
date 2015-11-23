---
layout: post
title: "Memory Preallocation"
date: 2014-04-18 21:18:21 +0400
comments: true
categories: 
- memory
- malloc
- realloc
- c
- algorithms
- pooling
- slicing
- development
- performance
- 
---

No, no, I am not referring to the pooling of high-level objects and caching them, that's child's play. I am referring to hard core C level memory preallocation, slicing, and pooling.

What I'll do is, I'll run through the thought process I went through, and that should give the best perspective to the reader about how this works.

### Wait, Why?

I did mention this in [a post from long, long ago](http://mazyod.com/blog/2013/11/23/revving-up/). Read it up.

### The Problem Statement

Thankfully, we have a lot of constraints that makes this problem a lot easier than it would have been if they weren't there. I am taking advantage of most of the constraints, but not all, unfortunately.

The problem is:

> Preallocate and reuse blocks of memory that would service a single type of object, which is the GameState object.

Sweet! So, the size of the objects are all the same, since they are of the same type! That makes things a lot easier. There is also the fact that they are allocated and freed in a LIFO fashion, but I didn't rely on that property, which could've simplified things even more.

### The Block Of Memory

So... What is this block of memory? Should be easy! Just an array of whatever the type of objects we want to create!

{% highlight c %}
memBlock = malloc(sizeof(GameState)*preallocate);

{% endhighlight %}

Cool. Now, we have our memory block.

### The Tracking

We need to track which memory blocks are available and which are not! Again, if I were to use the fact that I am doing DFS in my code, I can easily do the tracking using a single index that tells me how much of the memory block is consumed. Whenever a block is returned to the pool, it has to be the last block, since it's LIFO...

(OK, I just went to check the code, and found something that bothered me, so I fixed it, then in turns out due to recent changes, the game is crashing, so I fixed that as well...)

I really need to make use of the LIFO property... It makes things a lot simpler, but anyway.

So, we are assuming that the memory is returned to us in random order. For example, we provide blocks 0, 1, 2, 3, and then block 2 is returned to us, while 3 is still being used. Hence, the requirement of a more detailed tracking.

The way I implement this is by creating an array of pointers. Pointers to what? GameState, of course!

{% highlight c %}
memPtrStack = malloc(memPtrStack, sizeof(GameState *)*preallocate;

{% endhighlight %}

The first thing I do, is initialize this array of pointers to point to the respective index in the memory blocks array:

![](http://mazyod.com/images/prealloc_1.png)

Then, let's say three requests came in for memory blocks. We move the index by three, and "give" those pointers to the caller:

![](http://mazyod.com/images/prealloc_2.png)

Finally, when the pointer is suppose to be freed, who ever called the alloc must give use the pointer back so we add it into the pointer stack, and that block will be available again for the next time alloc is called:

![](http://mazyod.com/images/prealloc_3.png)

### The Expansion

OK, if you think the above was a bit lame, I don't blame you. That was super basic stuff. The fun kicks when when we want to expand the memory.

A request for a memory block comes in, but we already gave out all the memory blocks! What should we do!! Expand the memory block, obviously. I wish we could use `realloc`, but we can't.

The most painless way is to probably do the following:

First, instead of allocating an array of memory blocks that is assigned to the `memBlock` variable, we change the variable to `memBlocks`, and make it an array to and array of memory blocks:

{% highlight c %}
memBlocks = realloc(memBlocks, sizeof(GameState *)*(index+1));
memBlocks[index] = malloc(sizeof(GameState)*preallocate);

{% endhighlight %}

So, on every expansion, we bump the number of blocks allocated, and dynamically increase the size of the `memBlocks` array with `realloc`, and then assign the newly created space to a memory block.

Of course, with the new block available, we expand the `memPtrStack` and add pointer of the newly created blocks. (I won't add the code, since it is ugly. I need to fix it).

#### Why we can't use realloc:

It would have been so awesome if the use of `realloc` was possible, but it isn't. What realloc does is request more contiguous memory, but the currently memory block allocated might not have any free memory beside it! In those cases, realloc needs to copy the current memory to another location, while allocating the new required space as well.

Since we are sending pointers to the callers, moving the underlying memory will make those pointers point to a memory address no longer managed by us!! Hello `EXC_BAD_ACCESS`.

### The Performance

I haven't really tested the performance of this versus the non prealloc's performance, but I really want to do that soon. I already have the benchmarks from the Objective-C bot, and the non prealloced C bot [on this page](http://islamicaster.com/dama/benchmarkView.php). I need to run the non prealloced tests again, since I moved to static libraries and cocos2d-x, which may or may not affect performance. Then, I can safely do the prealloc tests.

Now, if this prealloc thingie gives me another major boost, I can probably implement an AI that can easily beat top Dama players without breaking a sweat :D

## Conclusion

It kills me that this hasn't made it to my game's update yet.... IT KILLS ME.


