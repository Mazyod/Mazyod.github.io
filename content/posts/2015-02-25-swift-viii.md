title: Swift VIII
tags: swift, tips, snippet, static, class, singleton, function, method, constant, lazy, safe, property
comments: true
date: 2015-02-25 13:51:29+00:00

I have to admit that the static variables we have in the C world (C/Cpp/ObjC) are pretty cool (Note, it's not thread safe. This is just an example):

```objc
- (void)someMethod {
    static id variable = nil;
    if (!variable) {
        // initialize variable
    }
}
```

What about our new favorite language, namely Swift? There is a way to achieve such awesomeness, with a little bit more code, however its more structured:

```swift
class var sharedManager: AppManager {
    struct Constants {
        static let instance = AppManager()
    }
    
    return Constants.instance
}
```

In the snippet above, I'm creating a singleton accessor, with a lazy initializer, as a class property. We can now even skip the brackets when accessing the shared instance:

```swift
// Somewhere in your code
AppManager.sharedManager.doSomething()
```
