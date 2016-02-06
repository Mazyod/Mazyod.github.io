---
layout: post
title: Playing With ReactiveCocoa
date: 2015-12-05 02:10:51 -0800
categories:
- ios
- swift
- xcode
- reactive
- programming
- functional
- reactivecocoa
- github
- framework
- library
- review
- design
- uikit
---

## Introduction

ReactiveCocoa is a long standing library, it's by no means something new. The cool kids were already high on [ReactiveCocoa](https://github.com/ReactiveCocoa/ReactiveCocoa) since the Objective-C days. Alas, it wasn't something I decided to try before today.

Through this article, I'd like to cover my initial impressions in using ReactiveCocoa with Swift, especially because of the insane potential that it has to dramatically streamline apps.

## Reactions

I will not sit here and talk about reactive programming and pretend I am an expert, because I am not. I will simply present a metaphor that I like to keep in mind, then share a bunch of useful links on the topic. I hope you are familiar with circuit boards, because that will be the basis of our metaphor.

When designing a circuit board, the usual parts we tend to use often are the power source, resistor, capacitor, inductor, ... etc. The power source would be the "producer", such as a battery, and the resistor would be the "consumer", such as a lamp. Then, we have other parts that incur various effects. For example, we can think of a capacitor as a gatekeeper, since it only allows alternating current to pass, and serves as open-circuit when full.

Now, you as the circuit designer, would probably start with the power source, and decide how the current should flow, doing any processing as necessary. For example, you may add two power sources, and only switch on the light if both are active.

That's pretty much it, as far as I know. Reactive programming has "signals" instead of power sources, and you observe these signals, react to them, apply various processing routines around them, and something else happens as a result.

[See ReactiveX](http://reactivex.io/)
[See wikipedia](https://en.wikipedia.org/wiki/Reactive_programming)

## Functional Reactions

Now all that is nice and dandy, but how about a practical example with Swift and ReactiveCocoa 4.0 alpha4?

The example we will take a look at is something I am actually using in a shipping app, so it should be practical and useful. I admit, though, it's the same example you'd see everywhere else... Taking user input, validating, then reacting with colors and enable/disable button, specifically for login and signup.

What does this look like?

![Reactive Login]({{ site.url }}/images/reactive-login.png)

What about teh codez?

First, we simply store the actors in our little reactive play in local variables. We will see later this will prove useful for many things, like breaking retain cycles.

Note how we store `NameValidator.validate` into an array. This is simple a static method that takes in a `String` and returns a `Bool`. This means, `validators` is an array of functions that all take a `String` and return a `Bool`.

{% highlight swift %}
// Prepare actors (avoid retain cycle)
let button = signupButton

let fields = [
    firstnameField,
    lastnameField,
    mobileNumberField,
]

let validators = [
    NameValidator.validate,
    NameValidator.validate,
    MobileNumberValidator.validate,
]
{% endhighlight %}

Now, we prepare the signals we would like to observe and process. The signal we are interested in is the `rac_textSignal`. It emits a signal whenever the `text` property of `UITextField` changes.

We create the signals by first `zip`-ing the field with its validator, the iterating on those by getting the text signal and mapping its result to the validator. This is the first arrow in the graph above. The signal emits a `String` each time `text` changes, then we pass that to the validator, returning for us a `Bool`.

{% highlight swift %}
// Prepare signals
let signals = zip(fields, validators).map { field, validator in

    field
        .rac_textSignal()
        .map { validator($0 as! String) }
}
{% endhighlight %}

Now, we simply add our process block that will set the color based on whether the validator returned `true` or `false`.

We iterate a `zip`-ed fields and signals this time, and for each signal we add a process block that will set the field `valid` property to the validator result. This is actually a `UITextField` subclass that has a `valid` property, which upon being set, updates the colors.

{% highlight swift %}
// Apply color subscribers
zip(fields, signals).forEach { field, signal in
    signal.subscribeNext { field.valid = ($0 as! NSNumber).boolValue }
}
{% endhighlight %}

Now, this may be achieved in a better way by including this code in the `UITextField` subclass, then assigning the validator to the `UITextField` itself. That's not a bad approach, I might go with that actually.

Now, let's see how we can reduce the three signals emitted from the `textfields` into one signal using `&&`. We only enable the sign up button if all textfields validate, after all.

First, we "combine" the signals, which simply puts all the latest signal results into a `RACTuple`. Then, we "normalize" the `RACTuple` using `allObjects`. After that, we cast that array to `[NSNumber]`, and reduce that using `&&`, meaning _all_ signals must be `true`. Finally, we add our custom process block, which updates the `button` enabled state to the reduced result we just computed!

{% highlight swift %}
// Apply button state subscriber
RACSignal
    .combineLatest(signals)
    .map { ($0 as! RACTuple).allObjects() }
    .map {
        return ($0 as! [NSNumber])
            .map { $0.boolValue }
            .reduce(true) { $0 && $1 }
    }
    .subscribeNext { button.enabled = ($0 as! NSNumber).boolValue }
{% endhighlight %}

I really have no more things to say, it almost works like magic. All this is a one time setup in `viewDidLoad`, which just makes life way easier.

## Conclusion

I always try to be honest and blunt about my thoughts, so here is the last bit. I would probably never use `ReactiveCocoa` in a long term project that I need to personally maintain. Dealing with Swift flux is painful enough, and thus apps that I look to maintain have absolutely minimum external dependencies, _especially_ enormous libraries that I can just fork and build my own version of.

Then, why did I use it? I am working for a client on a simple app, and the goal here is to cut costs and roll out an app ASAP. This app won't be doing any insane UI/UX features, it's all about building a small footprint application to validate the market. Hence, ReactiveCocoa saved me a whole bunch of extra code I would otherwise had to write and prolong the project.

P.S. I really don't get developers who refuse to check in the project's podspec into the main repo. Something about not willing to maintain it, or incur the burden ... I mean, c'mon, just do the whole iOS community a solid here and check it in...
