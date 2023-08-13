title: iOS Widgets
categories:
- ios
- programming
- rant
- widget
- extension
- today
- development
- error
- autolayout
- interface-builder
- xcode
- swift
comments: true
date: 2014-12-26 01:19:07+00:00

## Introduction

When a doctor makes a mistake, a person dies. When an engineer makes a mistake, thousands of people die. When a programmer makes a mistake, millions of people lose their minds.

## iOS Today Extension

Recently, I spent some time programming an iOS Today extension (aka Widget), and it was a nightmare... So many things just don't work! Let's me share some of those stuff.

### It Doesn't Work

From the get go, barely anything looked right, and sometimes it doesn't work or load, and I kept thinking it's something that I did...

Turns out, quite a few important things you have to do to make the widget work:

1. Don't use iOS Simulator
2. Set the `preferredContentSize`
3. override `widgetMarginInsets...`

Using iOS simulator proved to be very buggy, and the extension didn't seem to load properly sometimes, and had me restarting the simulator very often. So, that's lesson #1, test on a real device.

Then, it seems that sometimes the widget would be empty, as in only the extension header would show! To fix that, I had to add this in `awakeFromNib`:

```swift
override func awakeFromNib() {
    super.awakeFromNib()
    preferredContentSize = CGSize(width: view.bounds.width, height: 130)
}
```

Finally, things seem not to show up in the correct place, and it turns out because Apple is just being Apple, and forcing people to leave an edge inset on the right of the widget. Fortunately, that was easily fixed:


```swift
func widgetMarginInsetsForProposedMarginInsets(defaultMarginInsets: UIEdgeInsets) -> UIEdgeInsets {
    return UIEdgeInsetsZero
}
```

### Autolayout Nightmare

Finally, I have something showing in the widget section. I go ahead and open the main storyboard for the extension, and start adding labels with autolayout constraints and stuff... And that was a complete mess!

After launching the widget, I'd get some error because interface builder is adding runtime constraints just for the heck of it... WHY?!

```swift
NSIBPrototypingLayoutConstraint
```

I didn't have time to dig into it, so I turned auto layout completely off, and honestly, I didn't need its power, anyway.

### That Freaking Lifecycle

The life-cycle of an extension is, what can I say, whacked. You don't have a single entry point method that you can use, so your best bet is using a GCD dispatch once in the awakeFromNIB of the main storyboard controller.

What seems to happen is, that iOS destroys your view and recreates it everytime the user hides and shows the notification center. I mean, why? Apple probably doesn't trust developers with cleaning up properly, so they just dispose the whole view. But then, when it is recreated, you realize that the global state you had is still there, so there is no need to reinitialize it...

In any case, just initialize the global state using GCD, and don't assume that awakeFromNIB is only gonna be called once, like you would normally assume in a regular app.

### Psycho

This is just an arbitrary "wtf" moment I had with extensions...

While programming the extension, I created a new `UIView` subclass that upon creation, adds some labels as subviews... To my freaking surprise, the labels never get added to the view! It sounds weird, but I did debug it and after `addSubview` is called, the view would remain empty!

I don't have time to file a radar or dig deeper, so I wrapped that code in yet another GCD block, that is dispatched asycn on the main thread, that worked, and all is good for now.

## Conclusion

I wouldn't bother making a widget as perfect as possible, in terms of code and features. It's just not worth the time right now. Just roll out what needs to be rolled out, and move on.

