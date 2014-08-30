---
layout: post
title: "KPT v1.22 Submitted"
date: 2014-03-18 12:09:23 +0400
comments: true
categories: 
- Mac
- apps
- KPT
- Kuwait
- AppStore
- development
---

Finally, I went ahead and fixed all the unsettled issues in the [Kuwait Prayer Times application for Mac](https://itunes.apple.com/us/app/kuwait-prayer-times/id723108544?mt=12), and submitted to the AppStore. With Xcode's new profile management system, it was a **LOT** easier than last time...

## Changes

### Fixed Text Crash

There was a crash users experienced whenever they changed the icon of the application to text! Reason? I was an idiot and set the default font to a font that does **not** come on every Mac...

### Seeing Double

When the user has a multiple screen setup, the application may not show up properly on all screens. This turns out to be an easier fix than I would expect...

I had a silly code that was something like:

{% highlight objc %}
// BAD BAD BAD
// get rect from the first screen you find
CGRect frame = [[NSApp screens][0] visibleFrame];

// GOOD GOOD GOOD
// get the rect from the screen the event originated from
NSRect frame = [[[[NSApp currentEvent] window] screen] visibleFrame];

{% endhighlight %}

### Double Trouble

When the alarm fires, the logic was to *immediately* check for the next alarm, resulting in a possible "re-triggering" of the alarm. That's taken care of.

### STTwitter

[STTwitter](https://github.com/nst/STTwitter), IMHO, is a mediocre library, but it is the only one I could find... It was causing lots of issues, and the API is changing and getting fixed constantly. So, I moved that to a git submodule to stay up to date, and implemented categories to introduce my own functionalities.

Yeah, that won't change anything as far as the users are concerned.

## Conclusion

Yeah, that's just one thing out of my mind for now... I really wanted to take care of that for a while ^^;

