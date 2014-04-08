---
layout: post
title: "Expeling a Large Number of Words"
date: 2014-04-06 23:28:35 +0400
comments: true
categories: 
- rant
---

This post is complete rant about things ... So, prepare for I shall expel a large number of words at you! (This phrase is completely stolen from my super awesome boss [in the past], Geoffrey Hunt).

### How to Learn Coco2d-X

The best way to learn cocos2d-x is __by far__ to look at the tests. The cocos2d-x team got tired of regression, and need to move faster with their ever growing community, hence they allocated an insane number of man power to write tests for pretty much everything.

In any case, these tests are well written and not only provide a regression test, but also a great source for examples that you can learn from.

As for me, I need to start dispatching HTTP requests, and I discovered an `HTTPClient` class in cocos, and I have no idea how it should be used. That's when I read in the comments to look at the tests, and it hit me that I should have done that from the start.

### POST vs GET

Unfortunately, today I got stuck on a stupid problem related to HTTP requests, as well! While at work, I was trying to debug `NSURLCache`, which is this new hotness that should cache `NSURLRequest`s transparently, using `Last-Modified`, `ETag`, ... etc.

The cache in our app, though, was refusing to store the requests I was trying! I changed the headers, tried to call the cache and store the request manually, just nothing was working... I went on stackoverflow, and searched for like 10 different questions with my problem, and none of them gave a reasonable answer. I was at boiling point.

That's when I read this answer on stackoverflow that said:

> We changed our request from POST to GET, and passed the parameters in the URL instead. That made NSURLCache work.

I laughed so hard at that. I was like, "Dude, I wish life was that easy! GET requests are GET requests, and POST requests are POST requests!". I meant, we can't easily switch our API, and wreck havoc so easily...

So, I chat my colleague up about this answer, and he laughed a little, and then went, "Oh, dude. You can't cache POST requests at all, you know that, right?". I stood like a complete fool at that point...

Of course I knew!! Our professor at the uni specifically told us that sending POST requests will ignore the cache!! POST requests are suppose to change the state of the backend, so it won't be cached ... Ever. I completely missed that.

## Conclusion

I think I should get going now, and finish this HTTP thing I am doing, since it seems exciting, to say the least.
