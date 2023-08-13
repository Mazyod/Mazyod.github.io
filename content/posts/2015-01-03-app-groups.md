title: App Groups
categories:
- ios
- defaults
- persistence
- storage
- settings
- nsuserdefaults
- share
- data
- widget
- app
- groups
comments: true
date: 2015-01-03 12:10:49+00:00

## Introduction

While still developing a Widget (iOS Today Extension), I needed to reflect some settings that the user chose in the app on the widget itself. Since the widget is a separate app/process, it's not that straight forward, but still easy to figure out.

## App Groups

App groups is a concept introduced in iOS 7, which simply allows the developer to define "shared containers" that can be used by all the apps within an app group.

So, let's say you have 3 games on the app store, and you would like the score of the player to be an accumulation of all the game scores. You could hit the server and create a user profile and stuff like that, but it can also be done locally, using app groups.

To enable app groups, all you gotta do is head over to the project file, choose "capabilities", and enable "App Groups". Once you do that, you can start adding "containers". The preferred naming convention is:

```swift
group.COMPANY_NAME.GROUP_NAME
```

The group name should be meaningful to the set of apps that are going to be part of this group.

Once you create the container, and repeat the process to all the apps you want to be included in the group, you can then access the shared container like so:

```swift
extension NSUserDefaults {
    class var LPADefaults: NSUserDefaults {
        return NSUserDefaults(suiteName: "group.arabiandevs.lpa")!
    }    
}

NSUserDefaults.LPADefaults.setObject("An Object", forKey: "Testing")
NSUserDefaults.LPADefaults.synchronize()
```

It's as simple as that! Data written by one app, can be seen by other apps, and update as well.

## Conclusion

It is probably a good idea to always create an app group container and write to that, even if you have one app, because you never know if you are gonna need another app to access that data in the future.
