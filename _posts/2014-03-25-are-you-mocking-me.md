---
layout: post
title: "Are You Mocking Me?!"
date: 2014-03-25 13:39:04 +0400
comments: true
categories: 
- TDD
- test driven development
- ios
- XCTests
- OCMock
- programming
---

Let's look at what the dictionary has to say about the word "mock":

> tease or laugh at in a scornful or contemptuous manner: he mocks them as Washington insiders.

Hmm... How is that suppose to be related to programming? Let's ask [wikipedia](http://en.wikipedia.org/w/index.php?title=Mock_object) this time:

> In object-oriented programming, mock objects are simulated objects that mimic the behavior of real objects in controlled ways. A programmer typically creates a mock object to test the behavior of some other object, in much the same way that a car designer uses a crash test dummy to simulate the dynamic behavior of a human in vehicle impacts.

The first thing I thought of doing after reading this was to try and capture mocking objects in Slo-Mo. Alas, that property isn't similar to crash test dummies.

### Mock Objects

The use case that made me discover these nifty little creatures was trying to test backend calls without actually making the call. An important property of a unit test is that it is independently repeatable regardless of external factors to the system, such as the backend, the testing environment, ... etc.

So, using mocking objects, one can mock the application with a fake response that acts the same way as a normal response from the server. 

## Conclusion

I think who ever called these objects as "Mock Objects" went a tad too far...
