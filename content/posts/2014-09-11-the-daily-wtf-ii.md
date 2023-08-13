title: The Daily WTF II
tags: daily-wtf, code, programming, fail, bad, development
comments: true
date: 2014-09-11 09:56:22+00:00

This one is my favorite, and was the first *wtf* I fixed, because it was so 
bad...

## The WTF

In iOS, we have view controllers, and the whole app is built around the concept of view controllers. Now, someone decided that if we are going to present a modal view controller, the view life cycle calls are no longer relevant, and they used a cached boolean for a check (not even bothering with `self.presentedViewController`) (/facepalm-all-the-way-to-the-back-of-my-skull):

```objc
- (void)viewWillAppear
{
    if (self.modalPreseted) {
        return;
    }

    [super viewWillAppear];
    // ... more stuff
}

- (void)viewWillDisappear
{
    if (self.modalPreseted) {
        return;
    }

    [super viewWillDisappear];
    // ... more stuff
}
```

## Why Is It So Bad?

These methods are provided by UIKit, and we are overriding them. These methods are sacred, and are expected to execute the way they are designed to be executed. 

As an iOS developer coming to the project, it's hard and painful enough to learn the code base and the custom implementation, and now you expect me to unlearn UIKit, and learn those hacky ways that don't even make sense?

![image](/images/srsly.png)
