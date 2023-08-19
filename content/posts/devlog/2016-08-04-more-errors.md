title: More Errors
tags: dama
date: 2016-08-04 14:08:23+00:00

Even more errors, and more edge cases to solve ... If you are developing a game, really there is never a dull moment around here .. Every single detail is a challenge that requires careful thought and planning. The idea is that once you start executing, everything should just fall into place.

So, back to the issue at hand .. After handling the simple error dialogs part and food, now I reached the game scene, and need to handle the errors there. As highlighted previously, the game view syncs the game scene graphics through an event queue .. So, I could just create a new event for channel errors and call it a day .. But, there are many types of errors that could occur in a game.

First, there is the join error. So, the player somehow reached the game scene, but due to some circumstances, the game is no longer available, so that results in a join error. I think this is simple since I can just enqueue a join error event to the events queue, and it will be handled gracefully. This works well because I actually also have a "game ready" event in place which is only sent to the graphics part if the game has initialized successfully.

Then, there are two other errors related to rematch. Since rematch is a paid action, therefor the request may be rejected due to insufficient funds. Another issue may happen when a rematch is requested, but it goes away before that packet reaches the server.

I think that in either case I can just handle the error as a "Rematch Unavailable" event, which is already in place. That event will disable the rematch button, and show a label "rematch unavailable".

Hopefully, this will resolve all the channel error handling, for now!

The only missing piece in the game after that is implementing a proper account flow, where users can create accounts, login with existing accounts, logout, and hopefully be able to recover accounts .. I can't believe I'm saying this .. But once that's implemented, it's time for BETA TESTING!!
