---
layout: post
title: State, Logic, and Graphics
date: 2016-07-23 09:47:25+0300
categories: 
- dama
---

I am struggling to find the zen between three entities in my game:

+ State
+ Logic
+ Graphics

the game state is an immutable object that simply represents the state of the game. If you want to change the game state, a new copy is created. This makes game state super simple and easy to pass around with having to worry about it. As a bonus, implementing undo is literally as simple as having a stack of these game state objects.

Then we have the game logic. This is where the current game state is saved, and where the update loop happens, telling us if the game ended, or other similar events. The tricky part about this entity is that it could either be local or remote. When playing online, the logic actually completely runs on the server.

Finally, we have the graphics, which is the representation of the game logic and game state to the user. It needs the game state information in order to "know" what are the available moves, and that's about it.

Seems simple, except when you try to organize these entities around working with singleplayer, local multiplayer, and online multiplayer. The proper abstraction needs to be in place in order for things to work properly.

The most challenging aspect of singleplayer is handling the undo action. Sure it's as simple as a stack of `GameState` objects, but finding the right place in these entities to put it and update the game is tricky. Then, we have the fact that the game logic runs on the server in online games, and the game can end at __any given time__, if a player surrenders or disconnects, for example. We somehow need to signal that the game has ended at that point.

With all these pieces in mind ... There is only one answer I can think of. Make the logic hold the current game state, and that way, we can do the following:

For the remote game logic, we simply keep the game state in sync with the server, publishing new events to the graphics part. For the local game logic, we immediately apply changes to the game state, and publish the change events back to the graphics ... This should do it, I hope.

Sad part about this is, I was struggling with designing this and spent countless hours refactoring stuff back and forth because of an extremely old design mistake made in the Dama C library. In the library, I had made the GameState stateful, which was a premature optimization back in 2012!!! Haunted me to this day .. So, finally removed that optimization, cleaned stuff up, and now everything is yet simpler and easier to reason with.

All these changes I've been making for a whole week, btw, are for the simple reason that I need to implement "forced moves" from the server. You see, when a player fails to make a move within the alloted time, the server forced a move on them. This is very hard to accommodate without proper code design, because until now, I always assumed that moves are coming from the actual players! So, if it's the local player, it has to come from the graphics interaction part of the game ... Not the case anymore.
