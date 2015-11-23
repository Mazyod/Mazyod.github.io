---
layout: post
title: "The Daily WTF"
date: 2014-09-03 15:29:41 +0400
comments: true
categories: 
- daily
- wtf
- code
- horrible
- horror
- coding
- programing
- job
- rant
---

I just can't take it anymore.. I have been quite conservative of some really *wtf code*, and it's going on the blog form now on.

Apparently, we have these two methods in our class:

```objc
- (void)requestFacebookPermissionsWithCompletionHandler:(void (^)(NSArray *permissions, NSError *error))completion
{
    ...
}

- (void)requestFacebookPermissions:(void (^)())completionHandler
{
    ...
}
```

Here is the best part: 

**THEY SERVE COMPLETELY INDEPENDENT PURPOSES**.

While refactoring the code, I did cleanups to the method names, so in the process, both these methods had the exact same name... Who in their right mind would do such a horrible thing...
