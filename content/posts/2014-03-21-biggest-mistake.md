title: Biggest Mistake
categories:
- snippets
- development
- ios
- NSUserDefaults
- settings
- persistence
- version control
comments: true
date: 2014-03-21 19:14:38+00:00

Here I am today to make a very deep and honest confession about the biggest mistake I made when I developed a couple of my apps. Those apps where utility apps, and they relied on many user customization to work properly. So, the users would go to the settings and choose how the app would like to behave.

Completely clueless of what's to come, I have saved my settings by serializing an ObjC object using `NSKeyedArchiver`... **Never do that in production software! :(**

### What is NSKeyedArchiver

Let's quickly go over what exactly is `NSKeyedArchiver`.

In the most basic form ever of `NSKeyedArchiver`, it is a class that sends the object to be archived an `encoder` object (let's call that object `car`). You can think of the encoder object as a shitsuji, err, I mean a butler. Within the `car` implementation, you would have something like:

```objc
[encoder encodeBool:self.available forKey:@"available"];
[encoder encodeInteger:self.model forKey:@"model"];
...

```

What we are doing is saying, "Please, butler, take `self.model`, label it as `@"model"`, and put it in a box". We do that for all the properties we want to serialize. Finally, the `NSKeyedArchiver` returns as this "box" as `NSData`, which is essentially a [black box](http://en.wikipedia.org/wiki/Black_box) that only `NSKeyedUnArchiver` can make use of.

### The Problem

Well... Everything is nice and dandy, no? What's wrong here?

I'll tell you what's wrong. Unfortunately, what this approach implies is that you can never delete or rename the class that has been archived... Ever. If you archive a class called `GeneralSettings` with certain properties, you have to stick with that class and implement backwards compatible code to resolve the old version.

Here is a very simple example:

```objc
// remember this? We switched "model" to a string now!!
// if it is data saved by the old version, we have to do this
self.model = [decoder decodeIntegerForKey:@"model"];
// if it is the new version, we have to do this
self.model = [decode decodeObjectForKey:@"model"];

```

### The Solution

But how can we find out which one to use?! Answer: you can't :/ You have to do something like this:

```objc
// archive the new model variable of type string with a different key:
[encoder setObject:self.model forKey:@"modelAsString"];

```

... And when you load from disk, you do this:

```objc
// check if the new model is saved:
NSString *modelString = [decoder decodeObjectForKey:@"modelAsString"];
if (!modelAsString)
{
    NSInteger model = [decoder decodeIntegerForKey:@"model"];
    // figure out a way to transition 
    modelAsString = [NSString stringWithFormat:@"%d", model];
}

self.model = modelAsString;

```

Such a pain, and as versions increase, it won't get any simpler... The biggest mistake I made by far, though, is not even hooking up analytics, so I can't even see what my user base looks like.

## Conclusion

From now on, it's all gonna be CoreData. It has a version control system that can resolve these issues for you, and it is 100x more manageable using the GUI editor.



