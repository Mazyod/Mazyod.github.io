title: 'HTTP Game Server: Part III'
categories:
- http
- design
- api
- game
- turn-based
- backend
- gae
- google
- appengine
- scalable
- restful
- multiplayer
- server
- kod
comments: true
date: 2015-03-01 15:32:18+00:00

## Introduction

Welcome to part three, which was preceded by parts [one]({% post_url 2015-02-17-http-game-server-part-i %}) and [two]({% post_url 2015-02-24-http-game-server-part-ii %}). For this part, I wanted to go into a bit more details about the design and implementation of the API. Unfortunately, I don't think I've built the backend robust enough for me to just put everything out there.. But, the main parts are pretty secure, so I'll share those.

Please keep in mind, this game backend design and implementation is kinda specific to HTTP and GAE. Using this design for other setups is not recommended, and you are proceeding on your own risk, if that is the case.

With all that out of the way, how much exactly are we gonna cover today? Well, a good start would be the user registration.

## The Lean User

In our game, we want to implement multiplayer capabilities, leaderboards, scores, ... etc. The core entity behind all this is the player, or what we'll call the User. Here is a typical user model for the game:

```python
class Player(WebappUser):
    """A KoD player."""

    username = ndb.StringProperty(required=True, validator=username_validator)
    rating = ndb.IntegerProperty(default=NULL_RATING)
    sigma = ndb.IntegerProperty(indexed=False)

    stats = ndb.JsonProperty(default=DEFAULT_STATS)
    last_seen = ndb.DateTimeProperty(auto_now=True, indexed=False)
```

First off, notice how the User class extends `WebappUser`. I'm using `webapp2`, which is provided in GAE, to handle the users logic. `WebappUser` class is so convenient, it handles all the following:

+ Registration
+ Email verification
+ Password hashing/salting
+ Authentication (Login)
+ User sessions/cookies
+ ... and more

As for the custom properties defined above, it's as simple as:

+ *username*: duh
+ *rating & sigma*: To rank the players. See [TrueSkill][trueskill].
+ *stats*: Just to log how many games the user played.
+ *last_seen*: For various reasons, including idle user detection.

As for the account handlers to do all the registration, login, logout, ... etc, all I needed was [this blog post][app-engine-auth]. I won't be covering this part, since it's really a duplicate of what's on that post.

The only real addition I added was "The Lean User", as the title suggests.. But, what is a lean user??

My game allows the user to open the game and start playing with other players right from the get go. No registration required at all, not even picking a nickname. 

To do that, I transparently create a guest account that represents the player, and use that account to allow the user to play. Once the user creates an account, I simply migrate the data gathered on the guest account to the new user.

Here is a typical flow of how this works:

![image](/images/backend-diagram.png)

There isn't really much to cover, otherwise. After the user logs in or registered, I add them to the session. Because of GAE's scalable nature, it's much more efficient for the RESTful API to be stateless, and the users send their state using a secure cookie. This means, the secure cookie is decrypted for each requests, and the user is served based on that state. No DB access required.

## Conclusion

This is as far as the user registration goes. As far as I can tell, what is presented here is not really specific to games. Still, I think it's important to cover for the uninitiated.

Hopefully, in the next part we will start covering more about the actual game mechanics. I haven't decided what to start with. The choices are:

+ Game Rooms
+ Matchmaking queues
+ Leaderboard and stats

[trueskill]: http://trueskill.org/
[app-engine-auth]: https://blog.abahgat.com/2013/01/07/user-authentication-with-webapp2-on-google-app-engine/
