title: Not Fast Enough
category: programming
date: 2022-01-18T20:30:23Z


## Introduction

Why am I writing after such a long absence? Wrong question. Why _haven't_ I been writing for so long?!

I could just sit here and give all kinds of excuses and reasons as to why that is, but the truth is ... I slipped. I think.

Programming was pretty much my life back in the day. I was writing code and learning on such a constant pace, it only made sense to keep writing these blog posts as a way to channel the residual energy. Not so much now.

Not the time to cover this, it's time to get my time's worth in reviving this zombie of a blog!!

## The Mourning

As previously expressed, emphasized, and then over-emphasized, Elixir is the dream language for me. I wouldn't waste time nor effort on other programming languages if I had the choice, alas, life ain't that rosy.

In my current project, I have to settle with Python, which would be my second best choice... Although that might change given the introduction of the Actor pattern in Swift. Back to the point.

Python is a very productive language, generally speaking. There is not much worry about in terms of syntax, however, other quite critical things are missing. Paralellism.

## The Multiverse

In python, you could try and make your code "parallel" by using threads or asyncio, but you shall not achieve much success. Threads are haunted by the all-evil GIL, which is a global interpreter lock. It won't actually allow mutiple threads to run at the same time, and it will also block the main thread from doing anything else.

As for asyncio, it is single-threaded by definition, so it is not a parallelism tool. It is, however, useful for concurrency. That leaves us with the only remaining viable option, that is multiprocessing.

## The Future

Hello, this is Maz from the future! Maz from 15 minutes ago wrote the post up till now, and he already made a mistake!

Multiprocessing is indeed an option, but not the only remaining option. You could do distributed computing, just as an example. Actually, after I wrote the last line about multiprocessing above, I thought to myself how the multiprocessing module is extremely limited!

You can't really send local funtions/classes, as the pickling process to send the information to the subprocesses uses pickle, which only sends a reference. Dill, however, is a third-party module that allows you to send local objects. Instead of using dill on top of multiprocessing, however, might as well find a all-in-one solution that replaces multiprocessing usage altogether.

Just to mention another annoying limitation of the multiprocessing module, it doesn't allow spawining nested multiprocessing pools. This is because the multiprocessing pool creates daemon processes, which aren't allowed to have children.

## Follow the Light (Ray)

Ray is a python package that promises to keep things simple, while still being able to do some pretty cool things. Right off the bat, they seem to have the actor pattern as a feature. Besides that, they allow you to structure your code declaratively in order to make it executable in a parallel environment. After that, it's totally up to you how you want to parallelize the execution. You could use threads, processes, or even distributed systems.

Gotta hand it to them, I am sold.

## Conclusion

I had to clear my head, lay out everything on the table, hence I decided to write again. This was extremely helpful in articulating my thoughts and reaching a conclusion on what I should do about this parallelism problem. Perhaps I should do this more often.

I leave you with a nice quote:

> "The best way to predict the future is to invent it."

Umm, no ... The above quote was actually predicted by github copilot. I wanted to write a different one:

> "If this were easy, how would it look like?"
>
> -- <cite>Tim Ferriss</cite>
