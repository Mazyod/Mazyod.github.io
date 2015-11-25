---
layout: post
title: "NSParagraphStyle"
date: 2014-03-23 22:46:30 +0400
comments: true
categories: 
- ios
- custom fonts
- font
- style
- NSParagraphStyle
- line height
- uilabel
- clipping
---

As I was suffering from a serious regression due to compiling my app against the iOS 7 SDK, it was fortunate that the SDK caused me this headache.

It was not trivial to render custom Arabic fonts in the past on iOS. You had to either use low-level API, such as `CoreText`, or utilize a `CATextLayer` with custom drawing options... This solution was working fine until iOS 7 came along.

With iOS 7, I found myself inclined to use AutoLayout (which is insanely awesome on Xcode 5, btw), and this completely broke the `CATextLayer` approach used in the application. The problem is, when using AutoLayout with `UILabels`, the label's size is calculated based on what is called an "intrinsic size". This intrinsic size cannot be calculated properly, since I was drawing custom fonts with custom metrics!!

I was thinking about patching the whole thing, or even ditching AutoLayout, but thankfully, I somehow persevered (I know, such a big word for such context) and stuck with AutoLayout. I also remembered `NSAttributedString` along with `NSParagraphStyle`. These two are like Batman and Robbin.

Thankfully, `NSAttributedString` knew how to render custom Arabic fonts without any extra work! And since that was handled by UILabel, it also calculated the intrinsic size semi-correctly! (it was just cutting off some letter from the top and bottom).

![](/images/bad-text.png)

As you can see, some of the text is cut off :(. Fret not! `NSParagraphStyle` to the rescue!

{% highlight objc %}
NSMutableParagraphStyle *style = [[NSMutableParagraphStyle alloc] init];
style.lineHeightMultiple = 1.2;
style.alignment = self.textAlignment;

{% endhighlight %}

And the results!!

![](/images/good-text.png)

## Conclusion

I can't really skip the conclusion, so ... The conclusion this time is... I am spending way too much time on blogging rather than getting this app on the AppStore Dx
