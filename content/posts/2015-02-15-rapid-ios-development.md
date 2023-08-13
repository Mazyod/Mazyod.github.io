title: Rapid iOS Development
categories:
- ios
- development
- programming
- software
- engineering
- design
- pattern
- structure
- architecture
- rapid
- agile
- prototyping
comments: true
date: 2015-02-15 17:45:46+00:00

## Introduction

As I wrote my own app a few months back, I realized that I was really slow, and a lot of energy was wasted along they way because of mistakes I made along the way... Recently, I've been working on an app with a one week deadline, and that deadline pushed me to a new kind of evolution... Here it goes.

## Being Chased

While working so fast on the app, one might look at me and say, "Slow down! No one is chasing you". I am afraid someone is, and that is the strict deadline imposed by the project requirement.

Due to the deadline, I barely employed basic code design practices, and just focused on having a functional app the rest of the time. Here is the great enlightenment:

I ultimately went back and fixed *all* the code architectural problems, and it barely cost me a few hours! The app is simple, mind you, and I am trying to build an MVP/prototype thing. So, by managing the size of the code base, you can *discover* the architecture as you go along.

After discovering the architecture, now I can easily scale the code and build on this sane basic structure as much as I like.

## Examples

I hate talking in an abstract sense, and always prefer concrete examples, so here are some:

### Account Management

One of the most obvious design decisions you want to make is the separation of the account management code in a completely isolated component from the view itself.

I didn't have time to do that, since I was working with ParseSDK user management for the first time, so it was enough of a time waste to be learning that. While learning the SDK, I needed to rapidly test my code to make sure what I am doing is correct. That lead all the code to live inside the login view controller.

After proceeding with the app, I came with a requirement that needed me to know the current login state at all times, and receive notifications for that. This is the perfect opportunity to refactor that account code, and move it into its own component, and so I did.

With those few adjustments, the code is now perfectly isolated, and the new requirement can easily be accommodated.

## Conclusion

Now, I've already built apps using CoreData in the past, and I don't have to go through all the above hassle, since I already *learned* the best way to take from the start. But using the above example to guide you on how to explore a new SDK, and defer code design challenges till they actually become a bottleneck, I think would be best.

Some might disagree. I would agree to their disagreement. If you were asked to build Facebook's Paper app, you can't afford to do these experiments. The guys at Facebook had the MVVM design setup from the get go, and planned everything out beforehand. I'm mostly referring to those small apps you build for clients or yourself on the side, and the number 1 requirement is a really tight deadline.
