title: Copy to Clone
categories:
- cocos2dx
- v3.0
- snippets
- copy
- clone
- memory-management
- crash
- c++
comments: true
date: 2014-04-05 22:47:56+00:00

One the annoying changes introduced in cocos2d-x 3.0 is changing the `copy` method to `clone`. I don't know why honestly, but it silently changes the return value from a retained object to an autoreleased object >.<

Since `copy` is based on the Objective-C copy method, developers expected it to return an object with a retain count of one, which it did. So, you would have to manage the memory yourself:

```cpp
auto object = otherObject->copy()
object->doSomething();
object->release();

```

Unfortunately, if my use case was the code above, I wouldn't have spent 10 minutes trying to find the cause of the crash. I did something asynchronous with the copied object, hence it crashed on a different runloop, making it 10x harder to debug >.<

In any case, from now on, use the new `clone` method, since `copy` is deprecated, and make sure you keep in mind that it's autoreleased!!

