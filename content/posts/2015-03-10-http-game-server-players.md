title: 'HTTP Game Server: Players'
tags: api, appengine, backend, design, gae, game, google, http, kod, multiplayer, restful, scalable, server, turn-based, player, user, model, ndb
comments: true
date: 2015-03-10 15:45:37+00:00

## Introduction

Yet another part of the HTTP Game server is upon us, and this time we shall be looking at the **Player model**. As always, you can check out the previous parts, [first]({filename}2015-02-17-http-game-server-part-i.md), [second]({filename}2015-02-24-http-game-server-part-ii.md), and [third]({filename}2015-03-01-http-game-server-part-iii.md).

One small note, I realized it was insanely stupid to mark the titles by parts. This makes the post ambiguous to the reader, so instead, I'll be highlighting the topic in the title from now on.

## Wassup Playa

### What is a Player?

A player in a game in a nutshell:

- Can be authenticated __->__ holds credentials
- Persists longterm data __->__ Achievements, stats, ... etc.
- Engage in multiplayer activities __->__ no direct implications

I'll honestly confess, initially I was completely confused how to approach this. With the functionality highlighted above, I still need a player model that will hold the game data itself. Like, what is the hitpoints of the player, what is his next move, etc. Thankfully, we haz teh Internetz.

I got [a brilliant answer on gamedev.stackexchange](http://gamedev.stackexchange.com/questions/80436/user-vs-player-model). They are completely different, and with that enlightenment, everything fell into place.

So here is the first lesson:

> Make a clear distinction between the in-game player and the human player.

With that distinction made, I now have to different player classes in the code base, each under its respective namespace.

### User Registration

This is actually [covered in the previous post]({filename}2015-03-01-http-game-server-part-iii.md)... Sorry about this disorganization from my part.

## Leaderboards

If you get right down to it, a Leaderboard is just a sorted list of players. With the `rating` property being part of the `player` model, we simply sort the players based on that key, and we are all set.

However, there are a few small gotchas that you might want take note of:

### Cache It

You could potentially be serving 1000s of CCU, so it be best to minimize the database calls and queries. To do that on AppEngine is a very simple task.

#### Enter the Cron Jobs

[Cron jobs](https://cloud.google.com/appengine/docs/python/config/cron) are the key here. 

Using a cron job, you can basically trigger a scheduled task that will run ever X amount of time. In our case, we can run the leaderboard query, and store the result on memcache, and voila. You got yourself a super efficient cache.

#### Alternative

You may also be thinking about computing the leaderboards lazily, meaning whenever you get a leaderboard request, check if you already computed the leaderboards and it didn't expire. If it is not present or is expired, compute it. This may work very well for single threaded servers, but forget it for GAE and large scale platforms, since you have to deal with transactions, collisions and other crap that you can easily avoid.

### Rank Change

My game's leaderboard does an extra neat thing. It shows an indicator next to the player's name on whether they are rising up the leaderboard, falling, or there is no change. I honestly had no idea how I am gonna implement that, but while typing this post, I figured it out.

It's very simple. Simply storing 2 versions of the leaderboard is all that is needed to implement this feature. As you generate the leaderboard, loop over the players, and check their position on the previous leaderboard. The pseudo code is something like:

```python
for current_rank, player in enumerate(current_leaderboard):
  try:
    previous_rank = previous_leaderboard.index(player)
    change = previous_rank - current_rank
  catch ValueError as e:
    change = 1
```

Finally, check if `change` is positive, that means the player has gone up. If the change is negative, he has fallen in the ranks. Else, there is no change.

## Conclusion

Nice .. We have completed the player concept in this post, and the leaderboard as well. We will hopefully start looking at the Match model next!
