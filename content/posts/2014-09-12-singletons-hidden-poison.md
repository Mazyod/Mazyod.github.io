title: Singletons Hidden Poison
tags: singleton, anti-pattern, software, programming, architecture
comments: true
date: 2014-09-12 11:26:30+00:00

The singleton design pattern is an extremely convenient weapon to utilize in any software project, be it a game, app, or whatever. For many years, I used singletons, and slowly formed a mental image of how they work. Today, I realize how poisoned my code is because of these treacherous snakes.

## Singleton Flaws

It is widely known that the main issue with singletons is that you need to make sure that you will ever need one object of the singleton class you're creating.

Another issue with singletons is how they seep through the code, and are hard to clean up once created, hence most use cases, if not all, require that the singleton instance is never destroyed. This global access also promotes contention and tight coupling, which is **bad ®**.

## The Poison

Moving on to the poison about the singleton pattern, it is actually part of the global access issue. After creating that singleton instance, one would be very tempted to access everything through that singleton instance. I'll explain with the problem I fell into:

When writing a game, I made the `GameScene` a singleton instance, since the game has so many layers and sublayers (objects) hierarchy. So, initially the intention was pure. I just wanted an object deep within the hierarchy to be easily able to send messages to the GameScene if an action happened...

The problem started when I ended up using the singleton instance to fetch information about the game.. Instead of initializing a layer with the necessary data, I would just initialize it normally, and query the singleton for the data. Sooooo bad...

The main issue with this is ... I can no longer test the components in separate/isolated context! The `GameScene`, along with all the layers that query it, have been tied by the chains of fate, and became this inseparable, monolithic component, which ended up being a burden on testing and maintainability.

## Conclusion

When the use of singletons is necessary, try using dependency injection, but in general, avoid relying on them for immediate convenience, and do your job of properly designing the object hierarchy and data flow!
