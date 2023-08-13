title: Benefits of Unit Tests
tags: unit-test, snippet, code, programming, tdd, game, development
comments: true
date: 2015-04-13 10:53:37+00:00

## Introduction

There is a very common problems among programmers that haven't tried unit tests .. They don't know how to start. Most of the programmers that I've met, including myself, had this problem, and the natural way to go about this is to buy a book and start reading.

Problem is, I had some [really bad experience with books on that topic]({% post_url 2014-03-23-diving-into-an-existing-project %}), so did the people I met.

Today, I have finally had enough unit test experience that allows me to explain how to go about this.

## Clarity

Let's be clear first ... There are many types of testing, unit testing, system testing, integration testing, black-box testing, white-box testing, ... etc. Make sure you read about all types of testing methodologies, because they will teach you __what unit tests aren't__.

To highlight some of the important topics here:

__Unit testing isn't [BDD](http://en.wikipedia.org/wiki/Behavior-driven_development)__

BDD is writing high level tests that the business understands and can be expressed in terms of the system output. That means you don't really care about the internal workings of the system as long as the correct output comes out.

Integration tests, functional tests, system testing aren't much different. They only differ in subtle ways, but they are all high level testing that usually doesn't need knowledge of the internal system workings.

__What Unit Tests are__

Unit tests are tests that are written for every single part of your system. You test that your object contains certain properties, you test that invoking a certain method returns a certain result, and you even test the output signals generating from your system. It is a very low level rigorous testing.

## Learnings

Now, here are the enlightenments I had while writing those tests...

### No Duplication

The fact that you have to test every single operation in your system makes you never want to write duplicate code .. ever. If you write duplicate code, you will duplicate your tests, and things will start looking shitty. I have a rule that, once you start copy pasting your unit tests, that means your program isn't DRY enough, or you're doing it all wrong.

One reason you might end up writing duplicate tests is not necessarily duplicate code. You might be mixing BDD with TDD. Here is an example:

```python
class Component:
  def __init__(self, operation):
    self.operation = operation

  def perform(self, input):
    return self.operation(input)
```

Notice that the component receives an operation that changes the behavior of this `Component` class. How are you suppose to test this?

If you are new to TDD, you might be tempted to instantiate a `Component`, set the operation to something, and then make sure that operation performs properly. That is not proper TDD, because you will be duplicating the testing of the operation, which is external to this class!

The test for this case is to simply pass a dummy operation with a mock object, and assert that when we call the `perform` method, the mock object will be called:

```python
class Stub:
  def __init__(self):
    self.did_call = false
  def __call__(self):
    self.did_call = true

Component(Stub()).perform()
```

I hope the above example is clear. We are simply testing that if we pass an `operation` to the `Component`, the `Component` will perform a call using that `operation` when `perform` is called.

Fortunately, you are a passionate programmer, you can't leave things the way they are! So, while writing unit tests for the system, that will be a perfect opportunity to find and eliminate duplication, and discover better ways to come up with abstractions.

### Break Dependencies

Imagine if for you to write a test for a function that is the handler of a button click. So, on button clicked, you want to send an HTTP request, and schedule a notification (those are totally random things, but you might be doing something similar). Testing this function because almost impossible.

You have to instantiate the HttpClient singleton, initialize the notification scheduler somehow in order to for the function to be tested properly .. That won't do at all.

The rule is:

> When writing unit tests, you must test each component in isolation. 

Taking the previous example into consideration, we first need to make this function serve one purpose, and then test that alone. So, what we might have is another core component, completely separated from the UI, that receives a signal through some `NotificationCenter`.

This way, all we have to do to test this function is make sure that it submits that notification! As for the other stuff that needs to happen, we can design it in the observing component.

In this case, the component might have services registered to handle certain signals. So, there is an HTTPService that registers for that signal, and will send a request when that signal is received. Notice, that now we can test this HTTPService separately! The test is to make sure that when a signal is generated, the HTTPService attempts to send an HTTP request.

### Catch Bug Early

Needless to say, that one of the toughest things we programmers go through is finding the origin of a bug, especially a semantic one. By unit testing, you can verify all your assumptions you are making by simply running the tests. That will help you catch bugs faster, because you are testing your changes at a micro level, before running them at a macro level.

This is especially useful when you are writing C/C++ code, or in some scripting language, since it's easy to make mistakes there. Something could easily slip by because of the extreme low-level/high-level programming.

## Conclusion

Yeah, I am not gonna go through other obvious TDD benefits that people evangelize in books, since this post is all about practical advice that I actually experienced.
