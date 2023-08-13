title: UIApplication Trap
categories:
- uiapplication
- shared
- application
- ios
- swift
- launch
- main
- xcode
- weird
- bug
- programming
- debugging
- broken
comments: true
date: 2015-11-18 17:03:03+00:00

## Introduction

To all my readers out there .. An apology is in order. I have been blogging non-stop for a while, but there was a very unsettling series of sudden pauses recently! I promise it wasn't due to lack of motivation nor interesting topics .. It was a simple matter of prioritization.

Working on about 6 project at the same time is just not something I've been used to, since I usually put my all into one single thing. Believe me when I say, spreading out like this is much more rewarding, since all your eggs are no longer in one basket.

In all cases! With that lifestyle, returning to [Habitica](http://habitica.com) was a no-brainer. With Habitica back in the picture, its time to level up like crazy!!

![image](/images/lvlup.gif)

## The Wrath of the Singleton

Singletons are very handy, and I don't even remember how many times I've blogged about them ... Unfortunately, I ran into one of those cases where it just kicks your ass.

The code I have in my app is like this:

```swift
class NotificationsMigration: MigrationTask {
    
    func shouldExecute(previousVersion: Int) -> Bool {
        return previousVersion < 2
    }
    
    func execute() {
        UIApplication.sharedApplication().cancelAllLocalNotifications()
    }
}
```

So, in my app I can easily define subclass of `MigrationTask` in order to add code that should be run only once when migrating from a previous version. 

With that said, this migration code is suppose to cleanup previous local notifications because the new version of the app handles notifications in a different way. If I don't do this, users migrating from the old version will experience double notifications (ones that are setup previously, and new ones setup by the new version).

Well, that looks nice and dandy! There is just _no way_ this code has a bug, right? There is no need to test it, right? Right, I thought! .. and boy was I mistaken...

After publishing the app to the AppStore (Yes, it's that bad), I got a horde of users coming at me complaining about seeing double notifications firing! What?! Why?! How?!!?!

I had no choice but to put a break point there, and see what was going on. Was the code even reached? Yes, the code reaches the statements and executes perfectly?? WHY?! I brushed it as a glitch in iOS, and submitted another update with other fixes ... No, that's not the end of it.

While refactoring another part of the app that dealt with notifications as well, I started testing the new code. After running the app, I noticed that notifications were not being scheduled at all ... The code was this:

```swift
application.scheduleLocalNotification(notification)
```

The `app` variable was captured by calling `UIApplication`'s `sharedApplication()` accessor as soon as the object is initialized. That was really weird, why won't it get scheduled?

By doing some excessive debugging and investigative work, I noticed that this object is initialized before:

```swift
UIApplicationMain(Process.argc, Process.unsafeArgv, nil, NSStringFromClass(AppDelegate))
```

Yes, I override `main.swift`, and do some stuff there necessary for language settings, and somehow this object initialization slipped there! To my pleasant surprise, querying for `sharedApplication` at that point returns some dummy object! Not even `nil`! The app continued to "not crash", but doesn't function properly `>_<`.

After suffering from this singleton wrath, I appropriately moved most of the code that executes before the `UIApplicationMain` call into the app itself, somewhere where it executes after `applicationDidFinishLaunching` is called.

## Conclusion

Seemingly simple tweaks in the code are still considered "rewrites" if they change the behavior of the program. Rewrites are hard, because they need to be tested thoroughly, and testing itself is hard. That is probably the topic of the next post, so stay tuned!
