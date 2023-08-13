title: Fine Grain
categories:
- development
- software
- engineering
- design
- pattern
- code
- structure
- architecture
- maintainability
- clean
- rant
- composition
- modular
comments: true
date: 2015-03-03 20:08:19+00:00

## Introduction

Heads up. Whenever you see the `rant` tag, brace yourselves for a post about some of my experiences, that aren't really based on true facts or data. It's just stuff that I found useful, and thought I'd share.

With that said, Fine Grain! Doing a quick google images search should give you an idea what this article is about. Yes, it's about breaking down your code base, [kind of like that post How to Compose]({% post_url 2014-09-04-how-to-compose %}), but a bit more ranty.

This post might not turn out to be ranty afterall. I have some pretty cool examples lined up.. Let's take a look.

## Return Values

First, ask yourself this question:

> How do I usually handle the case where I need a function to return multiple values?

Some languages support tuples, others support pointers, and maybe some language out there supports something else I'm not aware of .. The point being, answers will vary depending on what language you write in, probably.

[Remember this post?]({% post_url 2014-11-17-tol %}) It says "Program into a language". That's how it should be, and the answer should actually be consistent (for a OOP language, at least).

The real answer is to create a new class/struct that will aggregate the return values. This approach is guaranteed to be consistent across all OOP languages, since all it needs is a class, and that's what OO is good at.

It might sound like a stretch at first, but soon you might need to add an extra parameter to the return value, or change a type, or heck even upgrade it to its own class that is used elsewhere. This approach is future-proof and safe.

## Parameters

When ever you find yourself writing code like:

```python
def func_that_does_something(username, password):
    pass
```

You need to rethink your approach. Why not combine these to fields into a `Credentials` class? I can give you a few reasons why you should:

+ Easy to pass around: 1 object v 2 objects
+ Easy to extend: All of a sudden, you can do `credentials.validate()`
+ Reusable: I started sharing this credentials class across my projects!

Of course, other points made above for return values also apply.

## Conclusion

In general, trying to group your scattered parameters into small objects that make sense is just a useful way to better understand you system, to say the least. For me personally, the biggest gain is the extensibility, readability, and maintainability (makes refactoring easier).
