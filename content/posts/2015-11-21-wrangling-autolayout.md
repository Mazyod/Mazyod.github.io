title: Wrangling Autolayout
categories:
- autolayout
- swift
- purelayout
- github
- opensource
- ios
- uikit
- uiview
- constraints
- layout
- snippet
comments: true
date: 2015-11-21 20:30:58+00:00

## Autolayout Ambiguity

I'd like to share today a short story about autolayout. Before I get into that, however, I'd like to give some background regarding my experience with autolayout for the sake of helping you better relate to the upcoming story.

Auto-layout was just an unusable nuisance for me when it came out on Xcode 4 for iOS. The first step after creating any XIB file was to turn it off. It's not like I didn't try it .. I did, but back then, Xcode would crash, layout would easily mess up your views, ... etc.

As I progressed in my career, I came across an use case that inevitably has to use autolayout (unless I want to lose my mind). That use case was Right-to-Left (RTL) support for the Telly app. In order to properly support RTL layout without writing a million tedious layout code everywhere, I had to use autolayout with its automatic layout correction. Luckily, that worked really well, since the views I needed to add support to were **all** properly broken down and created in XIB files. enabling autolayout and setting things up was child's play.

Those days are over now, and I've recently started doing some fresh projects and experimenting with Storyboards, Segues, and more Autolayout. Here is the weird part: I've built two apps that started with Storyboards and Autolayout, and ended up deleting them and using manual layout (`layoutSubviews()`)! Why?

I simply didn't have enough time to step back and see exactly where my layout was breaking. I remember quickly running into problems and quickly switched to something I am proficient at, manual frame calculation... But, the sad part follows.

Due to using manual frame layout, I lost considerable amount of time on those projects in total. Writing manual frame layout is very easy, but extremely tedious and fragile. I had to take the time to learn Autolayout properly, and make it work.

## Master of Autolayout

Let me go ahead and say this: The master of autolayout is [PureLayout](https://github.com/PureLayout/PureLayout). Let's see why...

I recently started yet another client project, and true to my earlier conviction, I've went full-blown Storyboard + Autolayout. What made matters even better was that the client was OK with supporting iOS 9+, pretty suh-weet, for only one reason: `UIStackView`. Let's leave that for another day .. For now, autolayout!

So, I was happily building the project, using autolayout all over the place, until I hit my first serious hurdle. The client wants to implement an intimidating looking transition. I can't post the assets here, but try to imagine it with me:

"There is a view with a stack of cards in the middle somewhere. When a card is tapped, it expands to fill the screen, and then scales back down when closed." 

I can't simply manipulate the view's frame right away, since it is embedded within the view hierarchy. So, the approach I thought of was the following:

1. Remove the view, and add it as a direct subview of the key window.
2. scale up the view

Sounds pretty reasonable ... But this is where autolayout haunted me.

After writing the code above, it simply didn't work. I would end up with an empty screen ... Debugging the view hierarchy using Xcode and Chisel, I can see that the transitioning view's frame always ends up being all zeros. Why??

The experimentation began ... I replaced it with a dummy view, it worked like a charm. I replaced it with a new copy of itself, and worked, but a bit funky ... I am missing something! Finally, setting `translateAuto..` to `true` made the view at least appear .. Oh no, an autolayout problem! Do I really want to bother with that? Should I just stick with what I know? ... Time to start learning new stuff!!!

So, I add PureLayout into my Podfile, created a container view for the transitioning view, and used `autoPinEdgesToSuperviewEdges`. That was the end of it ... The solution was insanely simple and worked like a charm! I guess the takeaway here is to either fully embrace Autolayout, or not. If you decide to embrace autolayout, just do yourself a favor and get PureLayout, it's kickass.

## Conclusion

I have mixed feelings about this .. I am glad and relieved for finding this solution, but also distressed at the fact that I've missed it for so many other projects. Well, our only choice ever in life is to look forward!
