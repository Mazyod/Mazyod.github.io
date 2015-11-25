---
author: mazyod
comments: true
date: 2013-12-12 20:31:26+00:00
layout: post
slug: design-patterns-behavioral-part-1
title: 'Design Patterns: Behavioral (Part 1)'
wordpress_id: 456
categories:
- Software Engineering
tags:
- AppKit
- book
- chain of responsibility
- cocoa
- code programming
- Design
- design patterns
- engineering
- help
- knowledge
- mediator
- memento
- message
- MVC
- nsnotification
- nsnotificationcenter
- objc
- Objective-C
- observer
- passing
- pattern
- processing
- Software
- threads
- UIKit
---

_This is a part of (hopefully) a 5 part series, where we rediscover the most popular software design patterns!It is split into 2 behavioral patterns overview, 1 structural, 1 creational, and 1 bonus patterns!_


You know, I seem to have forgotten how important it is to write a meaningful introduction recently! Let me try to pick that up again... Ehm, so, there were four-(someone in the back yells he already knows where this is going, I tell him to shut up). As I was saying, there were four amazing people whom were very talented with what they did. They didn't know each other initially, but eventually, the nature of their work and talent attracted them to each other, and they called themselves "The Gang of Four". Couldn't be more generic, but anyway. This "Gang" set out for a very challenging feat. They set out to write a book......... A gang writing a book? Yes, and just in case you don't believe me, [check it out](http://en.wikipedia.org/wiki/Gang_of_Four_%28software%29). With the awesome intro out-of-the-way, truth be told that this book is probably the most popular software design patterns book in the world. Onto the blog post...


I know that I said that I _might_ write about design patterns in the previous post, but apparently, I feel so enlightened with what I learned today, I have to dump it somewhere to cement the ideas! Hence, the urgency to write this post, even though it is like 12 am right now, and the next [bart](http://www.bart.gov/) is either in 15 or 60 minutes... Let's hope I can finish this in 15 minutes (impossible).


In order to have a very quick overview over the content of today's post, let us check out this awesome design patterns cheat sheet:


[![designpatterns1](/images/designpatterns1.jpg)](/images/designpatterns1.jpg)


* * *


## Memento


##### Use case: ★★★★  
##### Elegance: ★★★★★




#### Overview


You have an object. That object has literally no memory whatsoever, so whenever it wants to mark a state so it can go back to it later, it instantiate a memento and populates it with data that can help it recover back to this state later, if needed. That recovery data can either be in deltas or a whole dump of the state. Obviously, if you store a delta, that means there is dependency. You can only restore to a previous state by traversing all the states between the current and desired state (just like Git). If a pattern hasn't crossed my path frequently, though, I immediately take away a star from the use case.


My take on this design pattern is that it can be extremely useful if used with other design patterns. It is so simple and elegant, but I find it impractical to use it on its own, since it can easily overcomplicate your code. I would call it a "low-level design" kinda thing. For example, using the memento pattern along with mutated chain of responsibility would be super. Sending a memento to a caretaker that saves it on the RAM, then pass it to a cloud service synchronizer, then a local cache... ARGH, these design patterns are so delicious.


#### Example:


The most obvious use case for this design pattern is a simple undo stack. Let's say you have a Game controller class, that has a GameState object, which from an abstract level simply encapsulates a set of variables that define the game's state. So, after each player's turn, you would create a memento object from a custom class that you wrote, and send it a copy/clone of the GameState object. If we take chess as an example, the game state will be a representation of the board pieces, whose turn it is, and .... optionally the game status (running or ended). A simple struct or whatever would do for that. You would have written a memento class, say GameStateMemento, which derives from a Memento interface (for elegance, that interface can be empty), and simply declares a constructor that takes a GameState object, and stores it as an ivar. Then, make sure you have read only access to that ivar, and you are done.


* * *


## Chain of Responsibility


##### Use case: ★★★★  
##### Elegance: ★★★★★


#### Overview


Yet another extremely elegant pattern that has many use cases. The "pure" implementation goes something like: There is an orphan, and an agency with series of adopters sorted on FCFS basis. The agency gives the orphan to the first adopter, whom either adopts the orphan or passes him along to the next adopter, and so on. You can handle the terminal case, too. This pattern apparently has many variations associated with it, though. So, in a glance, you have "handler" interface for a certain "task", which any class can implement, and then register the handler to the client which generates the "tasks". In our story, the task would obviously be "adopt child".

#### Example

In one of the variations of this patterns, you would have a window which could have detected a mouse click event. The window will first pass this event to its subviews to see whether a view can handle it (typically, when the click is within that view's bounds). The views in turn may actually pass it to their subviews, and so on. This is actually how the Cocoa (Touch) framework works with event handling.


* * *


## Observer


##### Use case: ★★★★  
##### Elegance: ★★★★


#### Overview


In any project you are working on, you can easily start using this pattern immediately by doing 4 simple steps. You create an interface called Observer, with a single method called update. Then, an interface called Subject, with three methods, addObserver, removeObserver, and notify. Somewhere in your code, call addObserver on one of the subject implementing classes, and send it the observing instance, instantiated from a class that implements the observer interface. Finally, in the subject subclass, you have the power of determining when to notify the observers of any event you specify.


Even though this pattern is extremely useful and popular, unfortunately I find it not very elegant for a reason: The Subject hold pointer to its observers. Most of the languages I worked with require the observer instance to remove itself from the subject's list before being erased from memory, which sucks. The observer may not necessarily have access to a pointer to the subject, according to this pattern, which could make it challenging to remove itself from the subject. As we will see in the examples, we can reduce the side effect of this limitation by using the observer pattern in conjunction with the singleton and mediator patterns.


#### Example


The examples are "dime a dozen". Since it is extensively used in the Objective-c Foundation framework, let's take examples from there. In Foundation, they have eliminated the problematic access to the subject by making and adding a global mediator that you can observe, and other classes can send notifications to. So, it's a super observer-mediator-singleton combo! An example could be UIKeyboardNotifications. So, when the Keyboard on iOS is going to be displayed by the springboard app, it sends a notification to the NSNotificationCenter, with a string like "UIKeyboardWillShowNotification", or something. You would add the class that you want to listen to that notification, and assign a method to be invoked when the notification is sent. BAM, your object now knows when the keyboard will show! really great. It is a mediator because the NSNotificationCenter class is NOT INTERESTED in the notifications contents, nor is it generating the notifications itself. So, it's neither an observer nor subject! It does, however, help to objects work together, which is the definition of the mediator patter.


* * *


## Mediator


##### Use case: ★★★★★  
##### Elegance: ★★★


#### Overview


Since we mentioned the mediator pattern in the observer pattern, might as well jump right into it. This patter simply moves the interaction code between two collaborating objects to a third "mediator" object. Since pattern is one of those pattern that we all have (probably) used, maybe without even realizing it. It is just so natural and intuitive, that it is a core part of a very famous design patter, the infamous MVC! In MVC, we have a controller that mediates the model and the view! Throughout the Cocoa framework, we also mediate the views by using a ViewController! It's just so awesome. Unfortunately, the fact that it is super intuitive and used everywhere is probably due to its very blunt and verbose nature, far from elegant. You have to define everything yourself, and write tons of boiler plate code if you are developing a framework from scratch that uses this pattern. Hence the extensive features of the UIViewController class.


#### Example


Take your pick! You have a window with a table view and a button. When you press the button, the table view deletes the selected cell. No one in their sane mind will add the deletion code in the button class xD. Instead, an action is sent to a mediator that also has access to the table view, and hence updating the table view as necessary. Simple.


* * *


## Last words:


The rest of the patterns are either super-exciting or not so much. I am really looking forward in re-exploring the visitor pattern, for example, but the template method... Not so much. Tune in next time!!
