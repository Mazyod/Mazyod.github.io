title: Basic C Programming
tags: c, programming, development, snippets, clion, tips
comments: true
date: 2015-07-22 13:14:11+00:00

## Introduction

After all this absence from my blog .. I just have to add an introduction! Well, since I stopped blogging a few months back, I was actually back home and for some reason, life is so easy going there, that I end up not able to work as effectively.. Weird. Anyways, my travels have resumed now, and life is tougher than ever, yet I now have time to blog! :D

Now, for an introduction about the actual topic...

C programming isn't something every programmer stumbles upon anymore. Even though I am mainly an iOS developer, and have written tons of, technically speaking, C code mushed together with the ObjC code, I never realized the "proper" was to write a well structured C program until very recently.

## Vitamin C Deficiency 

One of the first things I miss when coming to the C world are classes. After learning and writing C++, ObjC, Python, and especially Java, classes are just this central part of my design. I dealt with top-level functions in some of those languages, but in very limited, and usually hackish ways.

The lack of classes, meant lack of methods. Methods are insanely useful. Imagine not being able to write constructors for your classes. That will lead to so much boiler plate as you initialize all those properties whenever you instantiate a new instance of a class.

Of course, the language lacks a lot of other useful features, like closures, generics, exceptions, .. etc, but today's focus is on the classes.

## Taking Supplements

For some reason, it never really clicked in my head till I recently started reading some well written C libraries .. Lack of classes is not that big of an issues, especially where methods are concerned. To emphasize on this point, take a look at [go by Google](https://golang.org/). It doesn't have methods the way we are used to them in OOP languages.

So, the realization was, and I feel so stupid for realizing this just now, is to simply do the following:

+ Imagine you have a C++ class with a method
+ Take that method to an outer scope
+ Append the class name to the beginning, to add more context
+ add a first parameter, which takes a pointer to an instance of that class
+ Done!

As you can see, we are simply doing some more manual work to what the compiler used to do for us automatically. When we call a method in C++, we can use `this`, which is but the instance the method is called on, passed to the method automatically by the compiler. And, instead of using the nice `.` syntax, we simple have a function prefixed with the class name.

Here is a sample from the library I am working on:

```c
typedef struct _DMGameMode
{
    eGameType gameType;
    eColor color;
    eTimeLimit timeLimit;
    
} DMGameMode;
    
extern DMGameMode DMGameModeMake(eGameType);
extern DMGameMode DMGameModeMakeSingle(int level, eColor color);

extern int DMGameModeDifficulty(DMGameMode *mode);
extern int DMGameModeMaxDepth(DMGameMode *mode);
```

I add `DM` prefix for the lack of namespaces. Then, we have constructor like functions, and later methods that operator on an instance of that struct.

## Conclusion

I knew that, for example, in ObjC method calls are translated to `objc_msgSend` calls, and `self`, `_cmd` are passed in, but it didn't click that this is how developers generally write C code. I was mostly concerned about using pointers, but it's not that bad after all.
