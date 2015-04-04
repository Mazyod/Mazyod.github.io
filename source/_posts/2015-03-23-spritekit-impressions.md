---
layout: post
title: "SpriteKit Impressions"
date: 2015-03-23 18:06:46 +0400
comments: true
categories: 
- spritekit
- ios
- swift
- development
- game
- xcode
- 2d
- programming
- code
- pinball
- breakout
- physics
- software
- architecture
- cocos2d
- game-design
---

## Introduction

I recently started a new game project, and for now, all I want is a simple, functional prototype that we can play through and potentially show to investors. This has many implications:

Since this is a prototype, our number one priority is not polish, not maintainability, nor even performance (game is capped at 30 FPS). The number one priority is __speed__.

We need to build this game in record time, and be able to iterate and change it quickly, as we validate our assumptions or invalidate them for that matter. It would be highly beneficial if I were to use a familiar game engine, but I could, unfortunately... Why?

## Name Your Poison

### Cocos2d

My first choice was obviously gonna be Cocos2d, the iOS version. I am pretty strong with ObjC/Swift, and all the games I've actually shipped in the past (three total) are written in Cocos2d. I didn't choose that engine, unfortunately.

It seems that since I left the cocos2d iOS scene, something fundamental changed in the engine, and that is their merge with SpriteBuidler. SpriteBuilder looks like a really slick editor, and I can understand why that decision was made. But, for me, that rendered the engine unusable.

There were many things that ended up changing in the engine, even core functionality like `CCAction`, and during the transition, things break, because there weren't any good testing practices, I guess.

Also, I tried to work with the engine, nevertheless, and SpriteBuilder is missing a lot of features, and the integration is so rigid and if it breaks, you're screwed, basically.

After evaluating all the aspects of the engine, I realized this isn't something worth investing my time in. If I were to invest that much time on an engine, I'd rather it be Unity or Unreal.

### Cocos2d-X

My second natural choice was this engine that I've invested all my time in for the last couple of years. Makes sense to use this, I thought.

After creating the project, and spending 10 years writing classes and definitions in C++, I reached a stage where I wanted to handle touch events. I remembered that the engine recently changed the way you handle touch events, and it because really cumbersome to handle touches. You have to define methods, bind them to a scheduler, and assign the schedule to the event dispatcher ... WHY?!

That made me go:

> No way in hell ... 

### SpriteKit

I am basically left with one choice, and if that choice didn't work, I'd have to use Unity one way or the other. That choice is SpriteKit.

I'll tell you this straight away: It was the one. Everything clicked so well, and progress is being made at an insane pace.

## Impressions

Now that I have been using sprite kit for the past 4 days or so, here are my impression regarding the engine. Keep in mind, I am doing some sort of [breakout type game](http://en.wikipedia.org/wiki/Breakout_%28video_game%29):

### It's Swift

This freakin language is so amazing, you write code at top speed, and that code is maintainable and looks awesome!! It's really made programming fun again, not just a monkey type job.

I would like to share a few code snippets here to show you what I mean, and I dare someone say you can achieve better looking code in another compiled language:

{% highlight swift %}
struct Properties {
    /** on collision effects parameters */
    struct OnCollision {
        let fuelConsumption: Double?
        let clearDelay: Double?         // if nil, doesn't clear, else clears
        let reward: Double?
    }
    
    let collidable: Bool
    let shape: CGImage.Shape
    let collisionEffects: [CollisionEffect]
    let onCollision: OnCollision
}
{% endhighlight %}

Here is a building block of [the component based design pattern](http://gameprogrammingpatterns.com/component.html). These properties define how an obstacle in the game behaves, as simple as that.

So, take `collidable` for example. The game designer creates many types of obstacles in a spreadsheet, and they can tweak their parameters. When that spreadsheet is fed into the game, it is translated into an instance of this struct. This is to make the game data driven.

Now, I've worked with the component system in the past, but it was written in C++, and I gotta tell you, the code was so ugly and __huge__, which `const` and `ref` definitions everywhere. This is not needed in swift, since the compiler is smart enough to optimize those away.

{% highlight swift %}
class Ball: SKNode {

    var state: BallState = BallIdleState() {
        willSet {
            state.onExit()
        }
        didSet {
            state.onEnter()
        }
    }

    ...
}
{% endhighlight %}

I am using [state machines](http://en.wikipedia.org/wiki/Finite-state_machine) heavily in this game to tweak the objects behavior during runtime. Probably the code above can't get any simpler. When we set the state of the ball to a new state, the old state gets a `onExit` call, so it cleans up, and the new state gets `onEnter`.

{% highlight swift %}
class GameScene: SKScene, SKPhysicsContactDelegate {
    
    struct Outlet {
        static let CanvasNode = "CanvasNode"
        static let OverlayNode = "OverlayNode"        
    }

    ...
}
{% endhighlight %}

This is my favorite feature. Within each class/struct, I can define "namespaces" that group constants together. This is especially important at this stage, since I am hard coding a lot of things to get a prototype out the door, but I will surely need to migrate to a better data driven approach later. These groups helps me track those hard coded values easily.

Ok .. enough about swift, even though there is much more awesome to it.

### It's Simple

I don't think there is a simpler engine out there. Things work the way you expect them to, and everything clicks so well together. I have to say the engine's optimizations and capabilities are limited, but who cares as long as I can build my prototype?

One thing that blew my mind is how SpriteKit automatically scales the game for different devices. I wouldn't expect a game engine to take care of that for me so transparently, but it does!

### It's iOS Friendly

This goes without saying, but all my iOS knowledge is an instant transfer. CI setup, tests, crash reporting, and even [my MazKit](https://github.com/Mazyod/MazKit) were easily dropped into the project using Cocoapods, and eveything is working so well. That makes me just so happy with the engine.

## Conclusion

Up till now, I've been really happy with SpriteKit, and my partner has been really impressed with the daily builds I've been sending him. This seems to be going well, and if this game ever makes it to the AppStore ... Let me not get ahead of myself...
