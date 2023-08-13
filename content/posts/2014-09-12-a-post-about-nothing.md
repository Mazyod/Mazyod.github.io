title: A Post About Nothing
categories:
- nothing
comments: true
date: 2014-09-12 18:53:52+00:00

Inspired by [an episode from Seinfled](http://www.youtube.com/watch?v=EQnaRtNMGMI), I decided to make a post about nothing. Well, I do have to write *something*, so it will be an improvise of whatever comes to mind.

## What Is Nothing

Some might argue that in programming we have `null`, which is nothing. However, if `null` is nothing, then what is `void`?

I think `null` in most programming languages is just a sentinel value, hence it is *something*. Although some languages, like python and swift, actually have "nothing", which is the `None` type. If you have a function in python that returns nothing, and you try to assign the return to a variable anyway, that variable will hold `None`, which is literally nothing.

## Is It Important?

It is very important to have this concept of a well defined "nothingness" in a language. If you have it, you can easily express the nothingness of something...

I mean, in a typical case scenario, we might have a method that returns an `int`. If for some reason that method might fail to calculate the return type, we would want to return something to indicate the calculation failure. In a language like `objc`, we use `NSNotFound`, which is just `INT_MIN`. But what if that value is a possible value returned by the method?

So, adding a nothingness provides a consistent way of expressing a `no-value` thing that the caller understands.

## Conclusion

(null)
