title: A Quick Abstraction
categories:
- programming
date: 2018-11-02 22:30:23+00:00

## Introduction

As software engineers, our job is to make sure computers behave in very specific ways when the software we have built is being executed. Now, this sounds extremely trivial, but this is what it really boils down to...

Unfortunately, the tools we are provided to make this happen are extremely flawed and rudimentary. Even if I'm passionate about software and programming, building software shouldn't be so hard. But it is, and we end up making tens, if not hundreds, of micro-decisions when writing software..

Perhaps the noblest of all goals a software engineer could ever cherish is fighting complexity. Less complexity leads to so many wonderful things, some of which are less chances for error, easier maintenance, and many times, less code overall.

An important weapon against complexity is abstraction. If done right, a proper abstraction could help you break down a very complicated problem into it's essential parts, and make it much more manageable when looking at it as a whole. I wanted to demonstrate one example of that today.

## Perform Once

Here is an exercise for you, dear reader. Say we have some class, and within that class, we have some code we want to execute only once during the whole life of its object. How would we achieve that?

... Think about it for a bit.

Well, the answer here should be relatively easy and simple. Put that code in the constructor of that object. Done. The constructor is guaranteed (by the compiler) to be executed only once. Not bad, so, let's throw in an extra piece of the requirement.

Now, what if that code we want to execute only once, depends on some condition. This condition might be `true` when the object is initialized, meaning we can execute the code in the constructor as we did previously, but it may also be the case where the condition is initially `false`, and at a later time becomes `true`?

... The immediate answer should be clear.

Generally, the inclination would be to check for that condition as it changes, cache it somewhere to detect how it is changing, and in order to make sure that piece of code is executed only once. Something like:

```swift
func conditionChanged() {
    if codeDidNotExecuteBefore {
        executeCode()
    }
}
```

The code above is really bad, and is the worst possible solution for this problem, probably. This doesn't protect the function from other possible call sites, and decouples the condition from it's actual purpose. Let's fix that:

```swift
func executeCodeOnce() {
    guard codeDidNotExecuteBefore else { return }
    codeDidNotExecuteBefore = true

    // ...
}
```

Much better. There is no way we might accidentally run the code twice this way (assuming single threaded environment). Also, the condition is tied to the code it's guarding.

Now, we can do even better, by getting rid of this explicit branching. Branching is generally bad and if we can avoid it, it's much better, as it's simpler to make sense of flat code that executes all sequential statements every time. Take a look:

```swift
func conditionChanged() {
    executeCode?()
    executeCode = nil
}
```

What happened here? Setting a function to `nil`?! Well, this is a closure in Swift, and a closure is basically a pointer to a function. By putting the statements this way, we avoid any branching, while ensuring the code is still executed once... Given that all call sites remember to set the closure to `nil`!! How annoying, I though we were done.

## The Abstraction

```swift
private struct PerformOnce {
    
    private var operation: (() -> ())?
    
    init(_ operation: @escaping () -> ()) {
        self.operation = operation
    }
    
    mutating func execute() {
        operation?()
        operation = nil
    }
}
```

Finally, the simple abstraction to solve this problem, and hide as much of the unnecessary low-level complexity we don't care about within another class we don't have to worry about too much, as long as it's heavily unit tested.

With the code above, we can now do this:

```swift
let doSomethingOnce = PerformOnce {
    // ...
}

doSomethingOnce.execute()
doSomethingOnce.execute()
doSomethingOnce.execute()
```

Even though there are 3 calls, the code will be executed once. No branching, no `nil` setting, nothing! Just a very explicit and expressive variable name that indicates the code will be executed once, and indeed that's what happens.
