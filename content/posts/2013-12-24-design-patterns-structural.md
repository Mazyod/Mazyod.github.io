title: 'Design Patterns: Structural'
author: mazyod
category: Software Engineering
comments: true
date: 2013-12-24 21:39:03+00:00
slug: design-patterns-structural
tags: adapter pattern, article, book, code, Design, design patterns, education, engineering, examples, Games, implementation, Java, knowledge, maz, objc, Objective-C, patterns, Programming, Software, source, structural, structural design patterns, tutorial
wordpress_id: 533

_In previous posts, we covered 11 behavioral design patterns. For now, we will switch to structural design patterns, and hopefully, Creational design patterns will follow._



In life, when something doesn't work out, I have the tendency to view it as an advantage. This is actually one of the first lessons I learned in the Kuwait Fund training I went through. It may sound cheesy and simple, but you might be astonished how worked up and stressed we get sometimes over the smallest things that we can take to our advantage. Stuck in traffic? Listen to a useful audio book. Cancelled a trip to the Maldives? Do so more coding :D. And so on...



With that weird introduction out of the way, let's dive into a real intro. What are structural patterns? It's a pattern where you simply organize the structural flow of your objects. When we talked about behavioral patterns, each pattern allowed us to impose new behaviors based on the program flow. Here, it is a lot simpler, where we simply organize the objects in a way that gives us new desirable features, which in turn solves important design problems. So, let us present the patterns we will be exploring today!



[![designpatterns_struct](/images/designpatterns_struct.jpg)](/images/designpatterns_struct.jpg)



* * *





## Proxy




##### Use case: ★★★★  
##### Elegance: ★★★★★


  



#### Overview





The proxy pattern is quite simple, and clicks very well with Objective-C, especially. I don't know about other languages. As a matter of fact, ObjC has an NSProxy class, which eliminates the need to write the boiler plate code to implement this design. So, onto the design! It is simply like putting a body guard/secretary for an object. Instead of holding a pointer to the object itself, and passing that around, you would create a proxy object which references the "protected" object.





#### Examples





The reasons why we would want to do this are abundant. Smart pointers in C++ do that, so the proxy keeps count of how many references are pointing the object, and deallocates it when all the references are gone. Notice, this is not a garbage collector! This is a much more efficient approach that involves creating a "small garbage collector" for each object you want to NOT bother deallocate when you are done with it.





Another good reason to use this pattern is when the protected object is actually huge, or resides in a database, and we do NOT want to use it immediately. Hence, we defer that objects allocation to a later time, a time when we actually need it. Let'd give an analogy for this first. This works as if you really want to sleep, but if don't want to be caught flatfooted. So, you would ask someone to stand outside, and wake you up if the boss approaches. So, back to the proxy pattern, when you try to access the not-yet-initialized object through the proxy object, it will intelligently allocate the object it's protecting first, then passes your access message. Lazy loading at its best. This pattern is used extensively in CoreData, actually.





* * *





## Adapter




##### Use case: ★★★  
##### Elegance: ★


  



#### Overview





This pattern is lucky to get a once star for elegance. It is really basic, and I would advise **against** using it for your own classes. The only good thing about this pattern is that the name is so clear to us, and we can immediately realize what is the use case for it would be. We use adapters everyday in our lives to plug an old thunderbolt display's power cord to a new Retina MacBook Pro (In this case, we use the MagSafe to MagSafe2 adapter). We use adapters when traveling to plug our electronics to the countries power sockets, and so on.





It is exactly the same use case in the programming world. You would have an old or incompatible component that you would really like to reuse with your code, given that you don't want to change the code in the component's class (or you can't). You would write an adapter class that, when instantiated, creates the reusable component immediately. Then, you would define specific operations for the adapter and implement them my mapping those calls to the encapsulated component.





#### Examples





I think the examples are abundant in this field. A simple example would be an adapter class I wrote when developing Islamicaster, not knowing this is the adapter pattern. I had the Objective-C NSCalendar and NSDate classes, but it was a pain to use them in my code, since they don't provide direct access to simple things, like return the first day of the month. I either have to write redundant code everywhere, or write an MCDate class that uses internal NSCalendar & NSDate objects to calculate those calls, which is what I did. So, when I call "First day of the month", the method invoked would call certain methods on the NSDate class, pass that to NSCalendar, and with a little bit of luck, return the expected result.





Another cool example would be if you have a class that can format text, but you wrote it without following any specific standard, then you want to reuse it in your Cocoa application. In Cocoa, you're better off attaching an NSFormatter subclass to a Text field, since everything would be handled for you that way. So, you would create an NSFormatter subclass that implements the necessary subclass requirements, and computes the results by using the formatting code you wrote earlier.





* * *





## Bridge




##### Use case: ★★  
##### Elegance: ★★★


  



#### Overview





I really don't have anything against this pattern, it just feels like the type that only clicks when it clicks. I mean, there are very special cases where it works epic-ly. So, this pattern is actually awesome. It allows you to grow two separate class hierarchies independently, and link them with each other dynamically. Ooooo, such big words there, so let's dumbify it a bit. This pattern allows us to have two class hierarchies that are related to each other, since one of them uses the other, but we don't want to impose changes to one hierarchy when the other changes. When I think about it, this pattern is actually VERY close to the visitor pattern, but instead of decoupling the classes and varying the behavior, the classes from one hierarchy would hold pointers to objects from the other hierarchy, based on the requirement.





#### Examples





Let us imagine ... Wait, before we imagine, I am a game developer, and most of my examples aren't game related :(. Let me fix that. Ehm, so... Let's imagine we have a hierarchy on "GameObject" classes. Inheriting from this class, we have "Unit", "Building", ... etc. Now, we have a requirement to implement a custom Christmas theme, which changes the sound played when selecting buildings, the particle effects, ... etc. The cleanest way we can do that is by writing a separate Theme hierarchy, which is inherited by X-mas theme, halloween theme, etc., and then the class would simply query the theme object it has for the appropriate data. Alternatively, the object can just make calls like: "playSound(getID())", and make it the theme's job to play the asset, but that is less likely to work.





* * *





## Decorator




##### Use case: ★★★  
##### Elegance: ★★★


  




#### Overview





I think Java is the only language that tends to have almost all these design patterns in its frameworks :s. Not necessarily a good thing, nor a bad thing, it probably just contributes to the learning curve. Anyways, the decorator pattern in a nutshell: You have a base object that you want to enhance dynamically, so you would define a base decorator interface, and any other class that implements this interface can decorate your object (Your object must implement that interface as well).





#### Examples





So, let's say you have a Sound class that plays a sound. You want to apply different filters to that sound, based on the user's selection (reverb, hall, bass, ... etc). You can achieve that using the decorator pattern as follows: When the user select the sound he wants to play, you would instantiate a base sound object with the sound file, and set a variable "AudioStreamer playingSound;" to that object. The Sound object implements the interface "AudioStreamer", which simply defines a method that takes in an audio stream "stream(Audio a);". We would also write classes, like "ReverbFilter", "AcousticFilter", ... etc that all implement the "AudioStreamer" interface. So, when the user enabled reverb effect, all we have to do is: "playingSound = new ReverbFilter(playingSound)". Now, when we play the sound, we go through the reverb effect class, which adds the effect to the sound object found within.





* * *





## Facade




##### Use case: ★★★  
##### Elegance: ★★★


  




#### Overview





In the facade pattern, we are simply trying to reduce a complicated system into a single class that can be easily used by the client. That's all there is to it, really. (I wonder if it is just me, or these structural patterns are boring compared to behavioral patterns.)





#### Examples





You have downloaded this shiny new SDK for this new technology you have, and you want to get started with the device ASAP, but you realize that there are TONS of classes, and they are all interlinked. If you want to play audio on the device, you first have to query the kernel for that resource, and get permission, and then do some I/O to fetch the sound data, and encode it using another class to a suitable format for the device, and then execute a blocking call to the audio hardware to play the sound... You might as well go do something else, right? OR! You can write this facade object and implement these steps in a function called "playSound(s)", and now you can use this facade to easily play sounds in the rest of your application.





* * *





## Flyweight




##### Use case: ★  
##### Elegance: ★★★★


  




#### Overview





Flyweight is kind of awesome, but super specialized. You would basically use a flyweight to support large number of "heavy" objects. By using the flyweight pattern, you would actually cause these objects to have a "weight so light, they almost fly", hence the flyweight name. How can we turn these heavy objects to lighter ones? We simply separate the object's heavy/reusable parts from the light/configurable parts. The heavy part is cached and is unchangeable, while the lighter part is easily changed and created.





#### Examples





If we had a game with 1000 sprites, where each sprite is either a dog, a cat, or a unicorn, we can make our sprite class a flyweight object by making it hold a reference to the image data, instead of creating one for its own. So, when you instantiate a cat object, it would go through the cache FIRST, and try and get the image data from there. The position, anchor point, ... etc of the sprite, however, are instantiated each and every time, which makes sense.





* * *





## Conclusion





I apologize for the crappy work I did here in this particular post, I sometimes thing I would've been better off holding it till I actually feel like writing about design patterns (Now, I sooooo want to write about web app development). Anyways, this is out of the way, at least, and there is one more set of patterns to cover (creational)... Or wait, there is also the bonus patterns, which should actually be awesome. Until then, stay hungry, stay foolish!
