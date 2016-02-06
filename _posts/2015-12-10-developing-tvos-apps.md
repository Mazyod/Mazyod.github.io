---
layout: post
title: Developing tvOS Apps
date: 2015-12-10 00:28:04-0500
categories:
- tvos
- uikit
- programming
- ios
- xcode
- swift
- appletv
- apple
- introduction
- tutorial
- dependencies
- restkit
---

## Introduction

> "Hey, Maz. We would like a port of our iOS app on AppleTV within one month max"

My response ....

![One does not simply copy paste iOS code into tvos]({{ site.url }}/images/one-does-not-simple-tvos.jpg)

Yes, lots of work is involved in porting an app to tvOS, but it wasn't too bad all things considered. Let's see the highlights of this experience.

## RingoTV

### TVJS

Before doing anything with the tvOS app, I wanted to get my hands dirty with some basic UI programming. First thing I decided to do was try out the new [TVML and TVJS APIs](https://developer.apple.com/library/tvos/documentation/TVMLJS/Reference/TVJSFrameworkReference/index.html). They seem to be recommended and are quite a streamlined way of building tvOS apps... Why not?

It was terrible idea. I easily threw a whole week worth of work out the window because... [JavaScript](https://www.destroyallsoftware.com/talks/wat). I dread this language... It was hard to figure your way around, everything is so streamlined and also rigid, so you have to follow some pretty dumb and strict syntax and methods to do things.

The ultimate bad thing about this was the need to rewrite all the code that deals with API calls, parses the JSON, authentication, ... etc. Just. Too. Much. Work.

### Dependencies

I spent a lot of time looking around for ports of dependencies we were using in the project, but without luck. We were using the monolithic [RestKit](https://github.com/RestKit/RestKit) as well as [MagicalRecord](https://github.com/magicalpanda/MagicalRecord). Both don't support tvOS, how nice...

Then, I spent some time looking for good forks, without luck. I tried to fork these projects, update dependencies, but RestKit dependency tree is actually a hedge maze. That didn't go well at all...

I abandoned all hope of coming up with an elegant solution at this point, and decided to just download all the sources, and drop them into the project. Using some regex, the imports were resolved, and deleting all the fat from the projects, they were up and running perfectly well withing a couple of hours. Yay!! Porting RestKit to tvOS was definitely the biggest challenge in this project, and was actually simple enough.

### UIKit

This was an immediate win, and immediately felt like the right solutions. Creating a storyboard, and adding simple collection views and navigation controllers got me up and running in no time, thanks to reusing my iOS experience.

At that point, an important decision was made, which is to simplify the tvOS app as much as possible, such that it would fit one storyboard. We don't have time for bells and whistles, so constraints had to be put in place early on to ensure the project will make it.

I would say that I only faced really few major issues, and they were pretty manageable. Keep in mind, I wanted to reuse as much of the iOS code as possible.

#### SELECTION

OK, so I ported the dependencies, then ported the models, and those worked great. Now, time to port the UI, or at least try to replicate it. The biggest issue here was selection. You don't have a finger touching your UI, it's now a mouse pad thingie!

It was actually really simple thanks to the built-in "Focus Engine". Apple has already incorporated most of the selection logic needed, you just need to update your UI in respond to an item being focused/unfocused on.

For `UITableView` and `UIButton`, it just worked out of the box. However, `UICollectionView` required some work to get up and running ... The work for the most part was just:

{% highlight swift %}
imageView.userInteractionEnabled = true
imageView.adjustsImageWhenAncestorFocused = true
{% endhighlight %}

Amazing! But there was an edge case where we showed a label when the image wasn't available, so we had to handle the `UILabel` changing colors on focus like so (pardon the objc):

{% highlight objc %}
[coordinator addCoordinatedAnimations:^{

    if (context.nextFocusedView == self) {
        self.backgroundColor = [UIColor whiteColor];
        self.label.textColor = [UIColor darkGrayColor];
    }
    else if (context.previouslyFocusedView == self) {
        self.backgroundColor = [UIColor colorWithRGB:0x8C8988];
        self.label.textColor = [UIColor whiteColor];
    }
} completion:nil];
{% endhighlight %}

#### NAVIGATION

The final issue was navigation. After implementing a `UINavigationController`, the app kept entering background after pressing the Menu button on the remote. We needed to explicitly handle that event to make sure it controls the navigation controller instead.

{% highlight swift %}
override func pressesBegan(presses: Set<UIPress>, withEvent event: UIPressesEvent?) {

    if presses.first?.type != .Menu {
        super.pressesBegan(presses, withEvent: event)
    }
}

override func pressesEnded(presses: Set<UIPress>, withEvent event: UIPressesEvent?) {

    if presses.first?.type != .Menu {
        super.pressesEnded(presses, withEvent: event)
    }
    else {
        detailNavigationController.popViewControllerAnimated(true)
    }
}
{% endhighlight %}

We had a `UISplitViewController` as the main controller in the app, so these methods were added there. Then, we get the navigation controller of the detail view controller and pop there. Maybe a check should be added to make sure the navigation controller isn't already at root, but meh. This works.

### Authentication

This is the last piece of the puzzle, and honestly, still unresolved. I've communicated with the backend engineer that we need new endpoints for implementing authentication on tvOS, since we can't expect the user to enter their login using the remote.

We decided to go with something [similar to what digits does](http://get.digits.com/blog/introducing-digits-for-tvos). That was super simple to implement on the tvOS side, but still waiting for the backend to update the APIs.

## Conclusion

YES, that was pretty much it. The rest of the implementation went super smooth. The models with `NSFetchedResultsController` worked seamlessly with the tvOS `UICollectionViewController`s. The process of hooking the models with the new UI was just a single good afternoon's worth of work.
