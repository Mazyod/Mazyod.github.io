title: The One Thing I Wish ObjC Had
categories:
- objc
- rant
- snippets
- software
- python
comments: true
date: 2014-03-24 19:10:15+00:00

If I were to present the lords of Objective-C with a tribute and ask of them to allow the following syntax, I would gladly do so:

```objc
id object = [self loader1] || [self loader2]

```

Assuming that the `loader` methods return objects, I want to assign the return value of `loader1` if it is not nil, otherwise assign the value of `loader2`. This syntax is just so damn convenient T_T. As far as I know, JavaScript and Python have it (Yeah, they are scripting languages), but Objective-C is a dynamic language, so it is not far off, you know ..

## Conclusion

If there is a website that has feature requests for the Objective-C language, please direct me to it, otherwise let's start one and press hard.
