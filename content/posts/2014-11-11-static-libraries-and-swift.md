title: Static Libraries and Swift
tags: swift, objective-c, library, static, link, import, module, umbrella, header, map, xcode, ios
comments: true
date: 2014-11-11 22:23:19+00:00

About two years ago, while developing a second Islamic application, I noticed that there is just too much shared code between the projects, and it will only get worse when I start developing the Mac versions. So, it made sense to group the shared code together into a single static library, linked against all the apps.

Honestly, it was just for fun at that time. Using static libraries wasn't the easiest way, simply importing all the classes by reference would've achieved the same result... However, today, the benefit of migrating to a static library really proved to be worth it:

```objc
#import <LPEngine/LPEngine.h>
```

Before explaining what the line above is, let me explain my current situation a bit. I have a completely new design for my app, and since the old code still has bits and pieces written since 2010, along with the urge to write code in swift, I decided to start with a fresh code base, written in swift from the ground up.

Now, since the core logic is all grouped into a static library, instead of having rouge imports all over the place, that code snippet written above, added to the [bridging header](https://developer.apple.com/library/ios/documentation/swift/conceptual/buildingcocoaapps/MixandMatch.html), was enough to start leveraging the whole library right from within swift... 

## Conclusion

If you have a project that you know you'll want to keep around for a while, best make use of best practices, and gift your future-self a piece of mind.
