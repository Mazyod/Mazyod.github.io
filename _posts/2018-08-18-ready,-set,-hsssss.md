---
layout: post
title: Ready, Set, Hsssss!
date: 2018-08-18 14:43:09+0400
categories: 
- programming
---

## Introduction

I was waken up at 3:30 am by the sound of the fire alarm ... I tried to ignore it, but that deemed a fruitless effort. So, I moved to the living room, tried my luck there. No dice. So? Screw it. Go to the nearest Costa, have some coffee, and write a game!

Actually, that's what I've been contemplating since yesterday, to write a game with a clean architecture. I have never tried to write a game after acquiring the knowledge from Game Coding Complete book about game architectures.

## A Game With a View

While "porting" my Dama game from Cocos to Unity, my 7 year old design couldn't hold. I kept running into bugs and issues, and sought a better architecture. I don't recall writing much about "Game View" approach, and doing a quick search on my blog shows only a hit at this design within the devlog.

Basically, "Game Views" is a concept I borrowed from Game Coding Complete book, and it radically improved my Dama King implementation. The idea is simple:

- A game view is both a driver + consumer of the game logic.
- AI agent, remote player, and even local game graphics are all views.
    + AI agent consumes new turn event, and calculates it's move.
    + Remote player consumes a new turn by sending it over the wire.
    + Local game graphics represent all the visuals of these events.

## New Game?

Why go with a complete new game?

Well, Dama implementation is riddled with legacy decisions, and that will just take too much time and effort to unravel. Instead, to write a simple game, open-source it even, would prove to be a much better learning experience.

## Get Down to It

**4:56 AM** _Open Xcode, Create a new project_
I think it's best to write this in Swift, and make it a SpriteKit Game.

**5:02 AM** _Exploring the SpriteKit template_
I haven't touched SpriteKit since 2015 ... It sure has changed.

**5:03 AM** _High-level Architecture_
Regardless, let's plow ahead. At a high-level, I would like to make a game that requires both an AI _and_ a multiplayer aspect. This means, at least a 3 player game... Snake (the game I originally planned to write) won't really do in that case...

**5:08 AM** _Struggling to find the right game..._
What should it be? ... It should be a card game. A card game we call "War" where I come from. Basically, you should claim as many cards as possible, and to do so, you need ...

**5:10 AM** _I'm making Swake after all!_
Screw it, I'm making Swake. It will just have a single player mode, but that doesn't mean I can't leverage the Game View architecture!

**5:12 AM** _Starting with the Game Logic_
So, I'm starting with the game logic... What is the game logic of a snake game?

+ Snake representation:
    * Which blocks it covers
    * Which direction it's headed
+ Food representation:
    * Which block it covers
+ Game Rules:
    * Snake moves towards its set direction by one unit every turn
    * Snake consumed food -> Grows by one unit
    * Snake collided with walls/itself -> Game Over

**5:37 AM** _Game Logic in place?_
I now have this simple game logic representation in place ... I would like to get a simple graphics representation out of it next, and then a game loop to make it tick:

_I removed a bunch of code, as this will hopefully be published in github anyway_

```swift
final class GameLogic {
    
    private struct Const {
        static let size = Size(width: 10, height: 20)
    }
    
    private var state: GameState
    
    init() {
        state = GameState()
        state.food.position = generateFoodPosition()
    }
    
    private func generateFoodPosition() -> Point { ... }
    private func displaceSnakeOrGrow() { ... }
}

// Game State:

struct GameState {
    
    struct Snake {
        var points: [Point] = [...]
        var direction: Direction = .east
    }
    
    struct Food {
        var position = Point(x: -1, y: -1)
    }
    
    var snake = Snake()
    var food = Food()
}
```

**6:00 AM** _Crap is happening on the screen!_
So, I just went with the most rough implementation, and just updated the `GameScene` class which was part of the template to be:

```swift
override func update(_ currentTime: TimeInterval) {
    gameLogic.tick()
    gameView.tick(state: gameLogic.state)
}
```

... and then, proceeded to implement the game view itself, as follows:

```swift
final class GameGraphicalView: GameView {
    
    var scene: SKScene!
    
    private var snake: [SKNode] = []
    private var food = SKNode()
    
        
    func tick(state: GameState) {
        cleanUp()
        prepareNodes(state: state)
        positionNodes(state: state)
    }
    
    private func cleanUp() { ... }
    private func prepareNodes(state: GameState) { ... }
    private func positionNodes(state: GameState) { ... }
}
```

This is extremely rough because I don't do any kind of optimization nor animation. I simply remove all the objects, and then add them back again based on the new game state. It's essentially recreating the whole scene, every single time.

Ideally, we should simply generate "events" from the game logic, perhaps for another day...

For now, this is good enough, and I need to go check if my apartment is on fire or something...

**10:00 AM** _Insomnia_
No matter how hard I try to sleep, it's not possible ... Also, the my allergies made me snap, as I literally can't keep my eyes open for 2 seconds straight... So, it's time to get your maid on.

**12:52 PM** _A fresh start_
Placebo or not, my allergies are significantly better, and it's time to get back to it! ... First thing I want to do is implement controls!

**1:08 PM** _Navigate away, Cap'!_
Navigation is working, after a little bit or trouble converting input touches to the appropriate coordinate space, and doing the calculation based on that:

```swift
func processTouch(at point: CGPoint) {
    
    let topThird = view!.frame.height / 3
    let bottomThird = 2 * view!.frame.height / 3
    let centerX = view!.frame.midX
    
    let direction: Direction
    switch (point.x, point.y) {
    case (_, ...topThird):
        direction = .south
    case (_, bottomThird...):
        direction = .north
    case (...centerX, _):
        direction = .west
    case (centerX..., _):
        direction = .east
    default:
        fatalError("can't happen")
    }
    
    gameLogic.directionEvent(direction)
}
```

Now, I would like to actually see the food, and a proper snake! Currently, it looks quite crappy, and the food is indistinguishable.

**1:25 PM** _Things are happening!_
So, now I have a red snake moving about at a reasonable pace, and I can control its direction using "touch" controls! ... I just tried to run it on my device, but I've updated to iOS 12, and don't have Xcode 10 installed... Dang it!

Anyways, so the biggest issue this time around was slowing the run loop. What happened was, after I applied the proper displacement calculation for the graphics based on the game logic representation of where the snake is, the snake would fly off the screen within a second.

I initially thought this was a graphics problem, so I applied a slower loop on the graphical game view, using the `currentTime` to calculate the time delta, but that just made the game "choppy". I then realized, the game logic was still running at full speed! So, instead of applying the update throttle on the graphical view, I applied it all the way at the game scene, for both the game logic and the graphics.

This is not ideal, as the graphics should update at 60 FPS! Only the game logic needs to have it's run loop slowed down, as to control the speed of the snake and such... But meh.

Besides that, now I have a snake that grows as it eats stuff! Time to tackle two remaining concepts: Game Bounds + Game Over.

**2:02 PM** _That took longer than expected..._
Game bounds was very tricky to get right. First, I couldn't figure out if the border I was drawing was at all correct or not. Turns out it is, but the translation of GameLogic's point to scene space was wrong, as it required some calculations and offset.

Even with that out the way, I couldn't find `anchorPoint` property on `SKShapeNode`, which led to a lot of manual work to tweak the Point -> Scene coordinate conversion formula. Eventually, managed to get it done.

So .. Will slow the app down a bit, add game over logic, and call it a day.

**2:27 PM** _Last few touches_
After adding a game status enum to indicate whether the game ended or not, I actually found a lot of flaws in the implementation. I wasn't resetting the user input buffer variable, I wasn't cleaning the snake SKNodes properly as well...

I had to take it across the finish line, so I went ahead and showed a game over label when the game ends, and then automatically restarts on any tap.

## Further Works

Even though this was a quick and dirty experimentation with Game View design, it proved worthwhile. What I would like to do with this is implement less dependency between GameLogic and the graphical representation, where they have their own run loops, and they communicate through events rather than the current polling/boil-the-ocean approach.

Here's da repo!

[https://github.com/Mazyod/Swake](https://github.com/Mazyod/Swake)
