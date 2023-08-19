title: The Beauty of Composition
tags: software, design, pattern, programming, architecture, structure, modular, reusable, view, controller, composition, ios, controller
comments: true
date: 2014-09-03 11:10:12+00:00

On of the highly debatable problems that we come across as programmers is the classical inheritance vs composition problem. It haunts us as we try to figure out how to group duplicate code across multiple classes, and today the rant shall be about that.

## Hierarchical 

A language like Java uses the keyword "extends" to indicate inheritance. I love that, because it helps the code become more readable, and it becomes clear to any programmer what our class's relationship is to its superclass.

From there, you just have to keep in mind that when you design your class hierarchies that any superclass within that hierarchy will impose itself as an "alias" to the subclass... I don't think that was clear, so let's see an example:

Let's say we are designing a "View Controller" hierarchy. In `UIKit`, the developers decided to go with `ViewController`, then under that comes `CollectionViewController`, `TableViewController`, ... etc. Notice that `TableViewController` can still be called a `ViewController`, so we say that `ViewController` is just an abstract alias of `TableViewController`.

Notice also how this imposes the type of hierarchy we have here. We are essentially making a controllers hierarchy based on the type of view they have. This isn't a must, it's just how developers of `UIKit`/`AppKit` decided to go.

That's all nice and dandy.. The trouble starts creeping in when the developers want to extend these classes to provide their application-specific hierarchies.

So, in the problem I am having, we have a bunch of `ViewControllers` that are related to the login process. The duplicate code that we want to eliminate is related to the HUD loading indicator that we show when the authentication process starts, and then removing it when the authentication is complete.

The code I came across made the obvious approach of defining a `LoginViewController` superclass, and extended that class in the different login service (facebook, twitter, email). The only problem here is that some of the classes are `TableViewController` while others are not! So, if they all inherit from `LoginViewController`, they either all have to be `TableViewController` or plain `ViewController`, depending on what `LoginViewController` derives from...

## Composite

Now, we reach the composite approach. In the problem described above, we simply inherit from `TableViewController` or `ViewController` in each of the login classes depending on the use case. This hierarchy matches what we see in `UIKit` so it is the best approach. How about the duplicate HUD code?

We simply have to define a new class, call it `AuthHUDController`. That class will then be instantiated in those classes in a single line of code, then some customization can be made to it per use case, giving us more flexibility.

Ideally, we would want to eliminate **all** duplicate code, including the instantiation of the `AuthHUDController`, but doing that without ending up with a weird and implicit implementation (using AOP or similar) is very tricky, and would probably be best avoided.

There is actually another composite solution, and that is to make `LoginViewController` a subclass of `ViewController`, then in the classes that were deriving from `TableViewController` we move the table view code to a new class, and make that a composite in the old class.

In any case, it's both using the beauty of composition.

## Conclusion

The problem ends up not being that difficult if we realized the above definitions and sticked to them!
