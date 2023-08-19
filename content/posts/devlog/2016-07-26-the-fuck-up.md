title: The Fuck Up
tags: null
date: 2016-07-26 19:31:34+00:00

I derailed, and I derailed hard...

I was simply focused on trying to implement animation ended hooks, so whenever an animation ends, the main game loop is informed, and the next task is processed...

Somehow, during that implementation, I found a nasty part in the project, but it was working well for the most part. For some reason, I decided to rewrite it... That was such a horrible idea.

No matter what the end result is, spending 4 - 5 hours perfecting minor stuff isn't what I should be concerned about now, and yet! In any case, I realized now that reverting might be even more painful, so I gotta get this through.

The thing I really need to think through now is how should I structure the UI code moving forward? My options are either to keep things decoupled and work through the global event system, or better yet, go back to having hard references to each part of the UI.

Even though having references couples things, but allows for much higher control and clarity, which is something I really need for this game. Hiring developers not aligned with me on this part was a huge mistake...

OK, let's just get this "hanging" task over with, I guess...
