---
layout: post
title: "Textfields in Cocos"
date: 2014-04-13 07:00:29 +0400
comments: true
categories: 
- cocos2dx
- textfieldttf
- editbox
- v3.0
- text
- input
---

I reached that part where I need the user to type stuff into the game... To my surprise, the first implementation that jumped at me was in `CCTextFieldTTF`, namely, the `TextFieldTTF` class.

This class didn't have the `create` methods conventions, and felt weird. After implementing the thing, it turns out that the freaking thing is so bad, and barely looks anything remotely like a textfield. I was in shock.

I did a quick search about this, and it seems that the implementation of `TextFieldTTF` is in pure OpenGL, to be multiplatform as other parts of the code are. That's when the `CCEditBox` implementation caught my eye.

I launched the cocos2d-x tests, and navigated to `Extensions->EditBox`, and there it was. A native, responsive, fully functional textfield that your eyes would love to see. Makes me wonder why not just wipe `TextFieldTTF` off the face of the planet.

Then, I found the sad truth. Since `TextFieldTTF` was a native implementation, it had to be implemented separately for each platform, and that is not trivial, especially with all the platforms that cocos2d-x supports.

The current implementations are half decent, but there were missing parts in the Mac implementation, that [I went ahead and patched](https://github.com/cocos2d/cocos2d-x/pull/6262). I think I can actually contribute to this part as I develop my game, since I need it, and it's behind in the cocos2d-x repo.

## Conclusion

ALL HAIL OPEN SOURCE!!
