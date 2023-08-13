title: Multiplayer
categories:
- multiplayer
- online
- game
- development
- challenge
- c++
- indie
- design
- architecture
- question
- rant
comments: true
date: 2015-08-02 02:00:07+00:00

## Introduction

I am really high on game development these days .. Much of my time and focus is on building this core game "framework" that will basically be the building block of all future awesomeness. I can't make any compromises at this stage, as the technical debts accumulates insanely fast when you're working without a large team.

Anyways, the idea is to either launch these amazing game series, or somehow get acquired for 500 million pesos. lol, yeah, I am high.

## Abstraction

The main issue with designing a multiplayer game, from the client app perspective, is how to properly abstract away the network events, such that most of the app doesn't really care where the events are coming from or going to. You don't want to litter through out the code base with backend calls, obviously.

To deal with this design problem, we need to find the right abstraction. What does the network mean to our game? Well, for my game the network is just a pipe that sends local events to a remote player, as well as receive events from the other end of the pipe ... So, the abstraction unit for the game is the player!

Indeed, imagine you are sitting in a checkers game, and you are playing against an AI, like physically. The game board is the same, you are you obviously, but what changes is that instead of sitting in front of a human being, you will be sitting in front of a robot or something. Same thing goes for a remote player.

## Materialize

Now, we need to materialize the abstraction, and actually implement this setup.

By creating an abstract player class, we can have a common interface for the main runloop to deal with the players without caring what type of players they are. Basic OOP stuff, moving right along, since designing the player interface is what is actually interesting.

To do that, let's see what information a real physical player receives throughout the game. A player would obviously be looking at the game board, and knows the game state, so we need to pass the `GameLogic` to the player. The player also would see their opponent making moves, so we either send the move to the opponent, or simply pass a `GameLogic` update. That way, the player would also know its their turn now.

That is pretty much it. Anything else you add to the player might be redundant or a mistake in the abstraction. When I first designed the game, I thought the player owned her pieces, but that just complicated things, and it was better to just keep the pieces as part of the game board.

## Conclusion

I really hope this post was actually useful, since I didn't even bother add code snippets nor images, so it looks quite dull ... Anyways, happy coding!
