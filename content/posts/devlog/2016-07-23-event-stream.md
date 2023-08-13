title: Event Stream
categories:
- dama
date: 2016-07-23 18:06:19+00:00

After much struggling, procrastinating, and LoLing, I have finally set my mind to it. Previously, I have explained how I should be moving the game state within the game logic, but once I started looking at the code some more, something stood out.

The graphics part was tightly coupled with the game state. I was basically reading the game state each turn, and updating the graphics accordingly. This is great for extremely simple graphics, but it's impossible to have proper animations and sequential graphic events this way ...

To give you an example, imagine how we can implement a "game turn indicator" widget. The widget is a simple arrow that points at either the white or black team, based on the turn.

Currently, I am reading the game state each turn and updating the turn! This is nice because I am not assuming the turn is simply switching colors each turn. So, if the state is reloaded for any reason, everything just works out of the box...

However, this restricts us in terms of what we can do for animations. You see, since we can't assume the turn switch, we can't implement a simple turn change animation, unless we hold a diff state in the GUI! Something like, if previous turn doesn't equal next turn, then switch... This is ugly, and shouldn't be handled by the graphics part.

Another problem I was facing with this load-from-scratch-each-time approach is overlapping events. If during an online game a move comes in, and we want to apply that, obviously an animation will be started. What if during that animation, a game ended event comes in? If we keep inspecting the whole game state each time, it would be pretty hard to accommodate all these cases...

This leaves me with the hopefully most simple and elegant solution .. An event queue. Every single change on the graphics side has to be driven by a game logic event, be it a turn change, play move, or game ended. The graphics part simply "blocks" on that queue, and process it one at a time.

This tasks seems intimidating, and I'm trying to summon every last bit of willpower I have left for this game to pull it through ... I keep running into these issues, which is the most frustrating part. It's definitely my fault for spending unreasonable time on polish before figuring these details out, but all I can do now is learn the lesson and move on.
