title: Cocos2dx 3.0 createWithFormat
categories:
- cocos2dx
- ccstring
- string
- createwithformat
- stringwithformat
- format
- c++
- snippets
comments: true
date: 2014-04-04 22:09:09+00:00

Apparently, the cocos2dx guy introduced a new class, `Value`, which I can see lost of "value" coming from it (I had to get that out of my system).

In any case, `CCString` is gone... and so is the awesome `createWithFormat` method, which allowed us to create string on the fly with format, like the really awesome languages.

Fret not! There is actually a replacement for that in the new API:

```cpp
std::string string = StringUtils::format("Yaaay!! %s %s %s", "This", "is", "Aweeeesome!!")

```

