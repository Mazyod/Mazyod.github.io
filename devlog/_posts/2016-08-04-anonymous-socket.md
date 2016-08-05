---
layout: post
title: Anonymous Socket
date: 2016-08-04 16:45:04+0300
categories: 
- dama
---

Even though I set the title as "Anonymous Socket", I decided not to go that route after all...

Here is a quick brief of what's going on inside my head:

I need anonymous clients to connect to the backend and generate a temporary guest account to use in case the user doesn't want to create an account. In order to create the guest account, I have implemented a simple REST API.

After looking at the implementation on the client side, I realized that using Phoenix channels is way simpler and easier than performing API calls, so I was thinking of creating a new socket endpoint for anonymous clients. A client would connect anonymously, and be given a grace period of 5 minutes or so to perform the actions it needs, such as registration or login.

The second idea sounded great, easy to implement, and in alignment with the rest of the backend .. SHIKASHI!

It would mean I'd have to manage anonymous states and sockets, which can quickly become vague and cumbersome. When using REST APIs, the request/response cycle is all you have to worry about. Once the response is sent back to the client, it's over.

With that in mind, I figured in the future I'll have a separate "authoritative" server that would deal with these anonymous pricks and issue secure tokens for them to access the game servers. With that in mind, if I use a REST API, it would be easier to use Heroku or some other service and language to distribute the risk/load across many servers... I'm probably over-thinking this at this point xD

Honestly, the real reason to leave the anonymous socket behind for now is time. I keep thinking about how the anonymous socket implementation is gonna be, when I already have a working implementation of the REST API client and server. So, for the sake of time, let's stick with the REST API.

...

With that being said, I really need to move on to implementing the functionality required to register/login the user. The API is implemented, but still not hooked up to the UI yet... Should be simple enough to do that.

Once that's done, I should focus on logout, figure out how that should work, while making sure the user has the ability to recover their account... Finally, I really need to implement social login, for simplicity sake. Even Pokemon Go uses Google sign up, which means it's the way to go.

...

You know, for the logout stuff, I really have no choice but to add an email field when the user chooses to upgrade their guest account. The user would already be invested, anyway, and it will be for their sake so they don't lose their account. As for social login, the beauty is that we don't have to worry about them losing access there.
