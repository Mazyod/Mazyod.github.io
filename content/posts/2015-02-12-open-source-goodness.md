title: Open Source Goodness
categories:
- open-source
- code
- programming
- github
- ios
- xcode
- objc
- reactive
- functional
- kvo
- cocoa
- libextobjc
- dznemptydataset
- fxforms
- blockskit
comments: true
date: 2015-02-12 22:27:28+00:00

## Introduction

In the spirit of the annual "The Future of Open Source" survey, [which can be found here](https://www.surveymonkey.com/s/FoOS-NB), I decided to make this blog post about open sources, as well.

The main reason I decided to make about open source, actually, is because recently I was given a nice iOS app description to make. When you have clear requirements from the getgo, you get the luxury of properly setting up your project upfront.

Apologies for the lack of steam and enthusiasm in this post, but it should still be useful.

Without further ado, here they come:

## ReactiveCocoa & libextobjc

These ones are just insane... Built by the same developers that work at Github, these two libraries make writing code in ObjC a hell lot painless and even enjoyable.

[ReactiveCocoa](https://github.com/ReactiveCocoa/ReactiveCocoa) is inspired from "Reactive functional programming". It basically allows your code to be this signal driven system, where one signal drives the other in a whole event driven application.

The main advantage here is the abstraction on top of KVO, and the binding/chaining of events in a very elegant way.

[libextobjc](https://github.com/jspahrsummers/libextobjc), on the other hand, provides an insane set of macro-extensions to ObjC. Things like statically typed keypaths and shadowing `self` are my absolute favorite.

The shadowing allows you to effectively avoid unintentionally capturing `self` inside a block, avoiding the possibility of a retain cycle. Statically typed keypaths are self-explanatory, and are awesome.

## DZNEmptyDataSet

This is by far the most misleading component, ever. I had no idea it would be this useful! I probably never wrote a project without using this library, even when I was at a hackathon, I still used it.

The main advantage of [DZNEmptyDataSet](https://github.com/dzenbot/DZNEmptyDataSet) is easily adding some content to explain why there is no data in the CollectionView/TableView... Wait, what? 

When you have an empty collection view, you probably want to show something to the user, right? Either that the data is loading, or give them instructions on how to fill this view with data. That is what this components solves for you... in an amazingly elegant way.

## FXForms

I use this mainly to avoid indulging into settings views. Whenever I write an app, I spend so much time trying to make the setting view as good as possible, both aesthetically and in terms of code structure. Adding animations, making it data-driven, .. etc.

Using [FXForms](https://github.com/nicklockwood/FXForms), I can throw all that obsession away, and focus on just rolling out a functional settings view. bootstrapping a settings view with this component is dead-simple and awesome.

The main advantage here is abstracting away the details of implementing the settings views, and focusing on the data side. You simply create a `FXForm` conforming object, and that object just returns data that describes the settings.

## BlocksKit

I hate to mention this last, but someone had to come last. They are all awesome, regardless.

[BlockKit](https://github.com/zwaldowski/BlocksKit) is your one-stop-shop for Blocks-ifying your interactions with Cocoa. This frameworks adds block interfaces for major UIKit classes, such as alert views, action sheets, and other. On top of that, it has some block based functional additions to Foundation collections, like `NSArray` and `NSDictionary`.

Needless to say, using block based API's is much more convenient that using delegates for the mentioned cases, and also functional programming is just so elegant and this library helps you write better functional code.

## Honorable Mentions

I don't need to talk about [AFNetworking](https://github.com/AFNetworking/AFNetworking), [Realm](https://github.com/realm/realm-cocoa), [Pop](https://github.com/facebook/pop), or similar frameworks, since they are probably the first components you learn about when you tackle networking, local data store, and animations, respectively.

Other cool frameworks include [ObjectiveSugar](https://github.com/supermarin/ObjectiveSugar) and [SVProgressHUD](https://github.com/TransitApp/SVProgressHUD). The former adds some neat functional additions to the language, and the latter is just a simple, yet elegant, HUD manager.

## Conclusion

I was able to build a sufficiently sophisticated app in 3 days thanks to all the open source contributions people are making. It is truly helping out thousands of developers world-side be more productive, and focus on their own problems that they are trying to solve.
