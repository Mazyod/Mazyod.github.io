---
layout: post
title: "App Submission Nightmare"
date: 2015-11-01 10:36:47 -0800
comments: true
categories: 
- appstore
- submission
- error
- apple-watch
- xcode
- itunes
- connect
- upload
- size
- realm
- embed
- framework
- code
- signing
- archive
- generic
- provisioning
- profile
---

## Introduction

It's that time of the year where I need to submit an app to the AppStore. This time around, I had a completely new setup that I've never attempted to ship before. As expected, since it's a new setup, it came with its own submission error variety.

## The Setup

My setup is quite complicated, and neatly sits in the edge cases of Xcode project setups.

### The Workspace

The project workspace and directory structure looks something like:

+ Workspace
    * Framework1.xcodeproj
    * Framework2.xcodeproj
    * ...
    * Framework10.xcodeproj
    * MainAppProject
        - Framework1.xcodeproj
        - ...
        - Framework10.xcodeproj
        - MainAppGroup
        - MainAppUnitTests
        - MainAppUITests
        - TodayExtensionGroup
        - AppleWatchExtensionGroup
        - AppleWatchAppGroup
    * Pods
    * Pods

Here is what we are dealing with here:

1. We have 10 Framework projects + 2 cocoapods projects + 1 iOS app project
2. Everything is Swift based, except Framework1, which is Objc.
3. The main app depends on cocoapods as well as all included framework projects
4. One of the framework projects also depends on cocoapods
5. The main app itself has 6 targets
    1. iOS app
    2. unit tests
    3. UI tests
    4. today extension
    5. AppleWatch app
    6. AppleWatch extension

## Submission and Dominance

At least, this is the game Xcode was playing .. 

### Code Signing & Provisioning

First problem that every iOS developer on earth faces came jumping at me:

> Code signing in today extension doesn't match provisioning profile

I checked the today extension target, and it had a bundle ID that seemed different than the one I had ... Instead of fighting Xcode, I launched [sigh](http://github.com/fastlane/sigh) and typed:

{% highlight bash %}
sigh renew -a com.ArabianDevs.PrayerTimes.today-extension --force
{% endhighlight %}

### Warning Galore

For some reason, Xcode was throwing 100s of warnings about "stripping sybmbols":

> warning: skipping copy phase strip, binary is code signed

First search through stackoverflow and google led me to disable "strip debug symbols during copy" for release builds as well as debug. After researching more about it for this article, I read an answer from a TestFlight engineer that this bloats the app by about 30% - 50%, which is insane. So, better just ignore this harmless warning.

### Archiving

Finally! The archive is complete, and showing up in Organizer... Wait, why is it listed under "Other Items", and not iOS apps?! I can't submit to the AppStore this way :(

Most answers on google point you to making sure that you set "Skip install" to true for all subproject frameworks and libraries... I checked, and double checked all 10 frameworks several times, they were all correctly configured.

I had no idea what was going on, but the only thing I could do is inspect the generated archive, so I did. Opening it revealed that in the `Products` directory, there was "/Library/Frameworks/Framework1.framework" ... Why the heck was it there??

Coincidently, Framework1 was the only ObjC framework in the lot, so that aroused my suspicion. However, after looking more closely at the project, I realized that it also utilizes Cocoapods! I recall reading that Cocoapods had issues with archiving frameworks pre version 0.39.0 .. Checking Cocoapods for that framework, and true enough, it was built with cocoapods 0.38.2.

Thankfully, all it took was another `pod install`, and cocoapods took care of upgrading the project. Archiving the app again made it appear under iOS Apps! Yay!

### Submitting

So, it's finally time to hit that `Submit` button in Organizer, and hope for the best ... That didn't go far at all. After choosing the team and hitting submit, I immediately ran into this error:

> The archive did not contain DVTFilePath: X: 'X/Library/Developer/Xcode .. X.xcarchive/BCSymbolMaps .. .bcsymbolmap'> as expected.

That was a really weird error to get .. I remembered that my binary isn't bitcode compatible, so I unchecked that ... No dice. Searching online led me to [this post](https://forums.developer.apple.com/thread/14729). Surely enough, after unchecking the "include app symbols", the error went away .. Phew.

### Validation

After the app started validating with iTunes connect, that is when things got rowdy. I got 4 annoying errors, with varying duplication of each:

1. `Realm` contains unsupported architecture:<br />
2. AppleWatch app size exceeds permitted 50 MB
3. AppleWatch missing 44x44 icon
4. Framework8 contains a framework in its belly, and causes an error

The exact __Realm__ error was:

> Unsupported architectures.  The executable for xxxx/Realm.framwork contains unsupported architectures [x86_64, i386]

Thankfully, I had just missed a step in integrating the framework, which [can be found here](https://github.com/realm/realm-cocoa/issues/2352).

As for the __AppleWatch__ issues, I was easily able to reduce the size by compressing the icon images using [ImageAlpha](http://pngmini.com/). How much, you say? saved about 7.5 MB!

The second, and more important time save was by setting the "Embedded content contains Swift" to "NO" in the AppleWatch app project settings. The reason I did this is because I noticed that 33 MB of the app size was due to swift libraries being embedded twice in the binary. So, setting the option to false on the main app reduced the size by 16.5 MB! Phew!

As for the missing icon, I had simply assumed that it was OK to only support Watch OS 2.0 icons, but I actually needed to add Watch OS 1.1 assets to the asset catalog, and accommodate that as well.

Finally, the embedded __Framework__ error... Cocoapods strikes again! Framework8 utilizes cocoapods to link against SwiftJSON. In return, I integrate Framework8 manually using Xcode workspaces into the main project.. Apparently, you can't do that for dynamic frameworks.

> Invalid Bundle. The bundle at 'X.app/Frameworks/X.framework' contains disallowed file 'Frameworks'

[According to this issue](https://github.com/CocoaPods/CocoaPods/issues/3440), Cocoapods just insists on embedding the linked framework into its target even if the target is a framework itself. The suggested way to solve the issue is to convert the intermediate framework (Framework8) into a pod itself ...

{%img center caption no-invert http://mazyod.com/images/jaa7pj5.jpg "" "" %}

So, instead, I pull SwiftyJSON, build it locally, drop it into the workspace, add it to Framework8 framework search paths (without linking it!!), and finally make sure SwiftyJSON is added to the main app pod file. DONE.

## Conclusion

Unfortunately, I didn't write the issues I faced in detail, since I am writing this now after resolving all them issues .. Lesson learned for next time!
