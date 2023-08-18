title: Smarter Game Results
tags: dama
date: 2016-07-22 13:10:21+00:00

Damn, that's why I was stuck on this all along!!

Remember the `GameResult` problem where I was thinking of how to represent who won? Well, the reason it was a bit more complicated than it seems is because I have "smart game results".

I don't generate a single `GameResult` and send it to all players, since there is player specific information, namely the rewards and rating delta. Instead, I generate a unique `GameResult` per player.

With that being said, it would be ideal to make use of this characteristic and just embed a simple enum in the `GameResult`:

+ won
+ lost
+ draw

That's it. I tell each player whether they won, lost, or if it was a draw... Will play nicely with Elixir, and make my life easier on the frontend side as well.
