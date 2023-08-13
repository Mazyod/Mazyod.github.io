title: Reduce the Damage of Crashing
categories:
- crash
- report
- software
- programming
- ios
- cocoa
- mac
- hockeyapp
- analytics
- service
- programming
- development
- swift
- objc
comments: true
date: 2015-02-01 09:40:32+00:00

## Introduction

We all build apps, and they crash all the time. It's really bad experience for the user when the app abruptly quits. Some still don't know that it's a crash, and think it's just a bad app that does this intentionally.

Now honestly, before I migrated my app to swift, My crash reporting service would alert me of 3 crashes a day, on average. Given that my app has around 100k active sessions a day, that's pretty sweet. The crashes I get are from low level frameworks, too. So, very little I can do about it, if I cared in the first place.

After migrating to swift, that number rose to a shameful 500 crashes a day! It's unacceptable, and whether it is an issue with the language or just me writing bad code, it wasn't a very wise idea to migrate to swift.

## Handling Crashes Like a Boss

So, I already migrated to swift, and it's only gonna get better and more stable in the future, so I don't feel compelled enough to rollback to ObjC. Also, I can completely avoid the approach I was using that caused the crashes, and come up with alternative ways to solve the same problem.

For example, I noticed most of my crashes came from a Swift extension on `UIView`, where I had blocks registering to [`KVOController`](https://github.com/facebook/KVOController). I refactored that code to avoid all that hassle, and created an associated object instead that uses `NSNotificationCenter`.

Back to issue at hand, handling crashes! Here are the main points:

### Before Doing Anything, Initialize the Service

This was a really bad one for me...

For some reason in my code, I had a bunch of code executing before the crash reporting service was initialized. That meant, if that code crashes, I wouldn't know about it, and I'd have a mob of angry users that can't even launch the app because it crashes at such an early stage.

So, before any of your custom code executes, make sure that the crash reporting service is initialized in order to detect early crashes.

### Handle Startup Crash

If you use a service as good as [HockeyApp](http://hockeyapp.net/) for crash reporting, you have a way for handling crashes that happened on app launch.

I mean, there is nothing worse than a crash on app launch, since it renders the app useless and user can't even open the app to report that issue or anything!!

So, if you have a way to gracefully degrade the performance of your app, you can actually handle that case and work your magic. More on that topic can be found on [the HockeyApp article](http://support.hockeyapp.net/kb/client-integration-ios-mac-os-x/how-to-handle-crashes-during-startup-on-ios).

### Don't Keep Users in the Dark

This is just as important as writing excellent code. You should never keep your users in the dark not knowing if the app will ever be fixed. Make sure there is a way for the users to stay up to date with the application news. This is all basic community management, but it ties back directly to crashes.

Good ideas include adding a twitter feed in the app, publicizing updates and fixes, and just simple customer support by replying to user inquiries.

## Conclusion

If you really care about your app, though, try not to crash at all. Make sure you set up a proper QA process, where the product is thoroughly tested before it is released. But hey, no matter how good you are, shit happens `¯\_(ツ)_/¯`.
