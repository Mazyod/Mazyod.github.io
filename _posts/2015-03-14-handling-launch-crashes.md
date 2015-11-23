---
layout: post
title: "Handling Launch Crashes"
date: 2015-03-14 20:45:46 +0400
comments: true
categories: 
- snippet
- hockeyapp
- sdk
- crash
- report
- error
- debug
- swift
- unowned
- closure
- callback
- selector
- ios
- sigtrap
- breakpoint
- fbkvocontroller
- sigsegv
---

## Introduction

__NOTE__: If you want to see what was actually happening, and how I managed to solve this issue, [please read this follow up](http://mazyod.com/blog/2015/03/21/swift-x/).

Here is a really quick post about properly handling crashes. There was [a previous post where I highlight how to reduce the damage of crashing](http://mazyod.com/blog/2015/02/01/reduce-the-damage-of-crashing/). This time, I'll highlight how you can go a step further to ensure you get those precious crash reports.

## Hell's Gate

Apple actually tries to make sure that you are not sending data regarding the user, without the consent of the user. That's why in [HockeyApp's SDK](http://hockeyapp.net) they present the user with a dialog that asks them whether the crash reports should be sent or not.

Now, this "gate" stops the SDK from submitting crashes to the service, until the user hits that "Allow" button. Problem is, my app was crashing on launch for a very small percentage of my users, which meant they didn't reach a stage where they can even hit the allow button!

I was getting bad reviews, complaints, and just an angry mob running after me .. I had to do something about this Hell's gate!

## Desperation

I was a bit desperate initially, so I went the HockeyApp SDK repo on github, since it is opensource, and decided, hey! I can hack the framework and try to block the main thread, pull the crash data, and submit it to **my** server. Then, I'll be able to solve the problem.

Hours of running around the HockeyApp SDK yielded that I should play around with PLCrashReporter and crash signals .. To me, that meant new code I had to write, that might not even be stable enough!

I slammed my laptop in frustration..

## Universal Approach

Finally, it clicked in my head that I can go ahead with a universal approach that I can use throughout my apps! What if I just show a temporary view in the beginning with a spinner, just to wait till the user hits "allow", and the crash is sent?

![](http://mazyod.com/images/crash-detected.jpg)

The users started seeing this screen instead of the app just crashing on launch. Even better, they were able to hit "allow", and I get my crash report!

## Some Codez

Time to see some code!

Let's make one thing clear:

__I am not relying on Storyboard initialization__

If you rely on the app entry point being in the storyboard itself, that means your app may crash before even reaching the application did launch method! That is because the storyboard will initialize a few classes itself, before you get your chance to run your code... Now that's no good, is it?

{% highlight swift %}
func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
    // 1
    let window = UIWindow(frame: UIScreen.mainScreen().bounds)
    window.backgroundColor = UIColor.whiteColor()
    self.window = window
    // 2
    let startupClosure: CrashViewController.CompletionCallback = {
        KIAppManager.sharedManager().initializeApplicationWithLaunchOptions(launchOptions)
        window.rootViewController = RootViewController()
    }
    // 3
    if appManager.applicationCrashedLastSession() {
        window.rootViewController = CrashViewController(completionCallback: startupClosure)
    }
    else {
        startupClosure()
    }
    
    window.makeKeyAndVisible()
    
    return true
}
{% endhighlight %}

Please take note of these important points:

1. We initialize the window. We need to show _something_.
2. Then, we can create the normal app launch procedure in a closure, to save duplicate code. That code __does not run immediately__.
3. Finally, we check if the app crashed. Based on that, we either show the crash view, or call the launch procedure and resume normally.

## One Last Advice

If you have a large user base, and your app actually matter, __don't use swift__. Don't even think about it. Consider it still in beta. Of course, I won't just say that and leave, here is why.

I got about three common swift crashes that only happen with a subset of my users. The crashes are vague with a `SIGTRAP` signal, and to solve them, all I did was migrate away from swift closures to something else... Especially `unowned self`. That one's a real pain. 

Since I have more than 100k active users, a small subset of crashes is still significant! Here are a few swift crashes I got (somehow, they are also linked to [FBKVOController](https://github.com/facebook/KVOController)):

{% highlight text %}
Exception Type:  SIGTRAP
Exception Codes: #0 at 0x1000580fc
Crashed Thread:  0

Application Specific Information:
Selector name found in current argument registers: name

Thread 0 Crashed:
0   Application                          0x00000001000580fc Application.HomeHeaderViewController.(viewDidLoad (Application.HomeHeaderViewController) -> () -> ()).(closure #1) (HomeHeaderViewController.swift:0)
1   Application                          0x0000000100133df0 -[FBKVOController(ExtendedAPI) observeAndExecute:keyPath:block:] (FBKVOController.m:675)
2   Application                          0x0000000100055460 Application.HomeHeaderViewController.viewDidLoad (Application.HomeHeaderViewController)() -> () (HomeHeaderViewController.swift:38)
3   UIKit                                0x000000018aca0958 -[UIViewController loadViewIfRequired] + 688
4   UIKit                                0x000000018aca0668 -[UIViewController view] + 28
5   Application                          0x000000010003117c @objc Application.HomeViewController.headerView.getter : ObjectiveC.UIView (HomeViewController.swift:21)
6   Application                          0x000000010006ac34 Application.MainViewController.(loadInitialViewController in _B5C9B7278B2090C19811857E444A7BD0) (Application.MainViewController)() -> () (MainViewController.swift:93)
7   Application                          0x000000010006a640 @objc Application.MainViewController.viewDidAppear (Application.MainViewController)(Swift.Bool) -> () (MainViewController.swift:75)
8   UIKit                                0x000000018acb796c -[UIViewController _setViewAppearState:isAnimating:] + 588
9   CoreFoundation                       0x000000018638fe14 __53-[__NSArrayI enumerateObjectsWithOptions:usingBlock:]_block_invoke + 84
10  CoreFoundation                       0x0000000186386774 -[__NSArrayI enumerateObjectsWithOptions:usingBlock:] + 296
11  UIKit                                0x000000018acb7ac0 -[UIViewController _setViewAppearState:isAnimating:] + 928
12  UIKit                                0x000000018ad22c24 -[UIViewController _executeAfterAppearanceBlock] + 60
13  UIKit                                0x000000018ad22b8c _applyBlockToCFArrayCopiedToStack + 352
14  UIKit                                0x000000018ac94618 _afterCACommitHandler + 568
15  CoreFoundation                       0x000000018644ad98 __CFRUNLOOP_IS_CALLING_OUT_TO_AN_OBSERVER_CALLBACK_FUNCTION__ + 28
16  CoreFoundation                       0x0000000186447d24 __CFRunLoopDoObservers + 356
17  CoreFoundation                       0x0000000186448104 __CFRunLoopRun + 832
18  CoreFoundation                       0x00000001863751f4 CFRunLoopRunSpecific + 392
19  GraphicsServices                     0x000000018f79f6fc GSEventRunModal + 164
20  UIKit                                0x000000018ad0610c UIApplicationMain + 1484
21  Application                          0x0000000100123960 main (main.swift:13)
22  libdyld.dylib                        0x0000000197a9aa08 start + 0
{% endhighlight %}

{% highlight text %}
Exception Type:  SIGSEGV
Exception Codes: SEGV_ACCERR at 0xde92bec8
Crashed Thread:  0

Thread 0 Crashed:
0   libswiftCore.dylib                   0x000000010060dd34 0x100494000 + 1547572
1   Application                          0x00000001001442bc objectdestroy1 (UIView+LPA.swift:0)
2   libsystem_blocks.dylib               0x0000000193981910 _Block_release + 252
3   Application                          0x0000000100144804 objectdestroy12 (UIView+LPA.swift:0)
4   Application                          0x0000000100144884 objectdestroy14 (UIView+LPA.swift:0)
5   libsystem_blocks.dylib               0x0000000193981910 _Block_release + 252
6   libsystem_blocks.dylib               0x0000000193981910 _Block_release + 252
7   Application                          0x0000000100154ac8 -[_FBKVOInfo .cxx_destruct] (FBKVOController.m:90)
8   libobjc.A.dylib                      0x00000001932e6b1c object_cxxDestructFromClass(objc_object*, objc_class*) + 144
9   libobjc.A.dylib                      0x00000001932f3f38 objc_destructInstance + 88
10  libobjc.A.dylib                      0x00000001932f3f90 object_dispose + 24
11  libobjc.A.dylib                      0x0000000193301724 (anonymous namespace)::AutoreleasePoolPage::pop(void*) + 560
12  CoreFoundation                       0x0000000182ab8e44 _CFAutoreleasePoolPop + 24
13  Foundation                           0x00000001839ba784 -[NSAutoreleasePool release] + 144
14  UIKit                                0x00000001873e56e8 -[UICollectionView layoutSubviews] + 268
15  UIKit                                0x0000000187385648 -[UIView(CALayerDelegate) layoutSublayersOfLayer:] + 568
16  QuartzCore                           0x0000000186cdd994 -[CALayer layoutSublayers] + 164
17  QuartzCore                           0x0000000186cd8564 CA::Layer::layout_if_needed(CA::Transaction*) + 316
18  QuartzCore                           0x0000000186cd8408 CA::Layer::layout_and_display_if_needed(CA::Transaction*) + 28
19  QuartzCore                           0x0000000186cd7c08 CA::Context::commit_transaction(CA::Transaction*) + 272
20  QuartzCore                           0x0000000186cd798c CA::Transaction::commit() + 432
21  QuartzCore                           0x0000000186d2d1d8 CA::Display::DisplayLink::dispatch_items(unsigned long long, unsigned long long, unsigned long long) + 512
22  IOKit                                0x0000000183d258d0 IODispatchCalloutFromCFMessage + 372
23  CoreFoundation                       0x0000000182b795e4 __CFMachPortPerform + 176
24  CoreFoundation                       0x0000000182b8e200 __CFRUNLOOP_IS_CALLING_OUT_TO_A_SOURCE1_PERFORM_FUNCTION__ + 52
25  CoreFoundation                       0x0000000182b8e160 __CFRunLoopDoSource1 + 432
26  CoreFoundation                       0x0000000182b8c0e0 __CFRunLoopRun + 1636
27  CoreFoundation                       0x0000000182ab90a4 CFRunLoopRunSpecific + 392
28  GraphicsServices                     0x000000018bc635a4 GSEventRunModal + 164
29  UIKit                                0x00000001873ee3c0 UIApplicationMain + 1484
30  Application                          0x0000000100146b3c main (main.swift:13)
31  libdyld.dylib                        0x0000000193956a08 start + 0
{% endhighlight %}
