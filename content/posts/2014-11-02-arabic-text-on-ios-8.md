title: Arabic Text on iOS 8
categories:
- ios
- arabic
- text
- string
- calculation
- attributed
- custom
- font
comments: true
date: 2014-11-02 15:19:18+00:00

While upgrading our app to iOS 8 SDK, something broke in the usual `NSAttributedString` method:

```objc
[string boundingRectWithSize:CGSizeMake(_suggestedBoundsWidth, CGFLOAT_MAX)
                     options:(NSStringDrawingUsesLineFragmentOrigin|NSStringDrawingUsesFontLeading)
                     context:nil];
```

It still works perfectly on iOS 7, but on iOS 8, we were seeing some clipping in our custom fonted Arabic text. Switching to system font would work, but we needed to use custom font anyway.

Thankfully, there was [an excellent stackoverflow answer](http://stackoverflow.com/a/13691568/456434) about a less efficient approach that is incredibly accurate. That saved the day!
