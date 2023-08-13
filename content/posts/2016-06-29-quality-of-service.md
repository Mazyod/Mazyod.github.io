title: Quality of Service
tags: game-development
date: 2016-06-29 19:20:13+00:00

## Introduction

As highlighted by the nifty list below, this is part III of the four part series about game development!

+ [The GUI system][gui-system-link]
+ [The game engine][game-engine-link]
+ **The game services**
+ [The backend system][backend-post]

I apologize for the ambiguous, possibly inaccurate, name "game services". I just didn't know what to call these features, even though we use them in every single game we ever make.

The game services I am referring to are the supporting features we need around our game. JSON parsing, persistence, networking, ... etc. These aren't necessarily provided by the engine (I think it should never be), but we should easily find and integrate a third-party plug-in that provides the needed services.

So, let's see exactly what services we need, and how our game engine can help with that.

## Quality of Service

For my development needs, I needed the ability to access these basic services:

+ Persistence
+ Websocket networking
+ HTTP GET, POST requests
+ JSON parsing
+ Analytics
+ IAP (In app purchases)

Nothing fancy, really. Other games might require much more than this, including things like:

+ TCP/UDP networking
+ Compression
+ Encryption
+ ... etc

Once you highlight your needed services, just take a stab at implementing a basic game that simply exercises using them. For example, if you use an engine like Cocos2d-x, you'll find it cumbersome to integrate third party libraries for IAP, and JSON serialization is painful with C++ (especially so since they chose rapidJSON over JsonCPP).

But still, if you take a step back and realize how customizable Cocos2d-x is, you can simply nuke the services it provides for you, and integrate your own from the vast open source libraries in the C++ landscape.

That is, until you turn around and peek at what the Unity people are doing. You just wanna take a brief look, and you see them partying and having fun! You're now like, "WTH?! Game development is hard! How come these people are celebrating at such a crucial time??".

The thing is, Unity pretty much solved the services issue by having an Asset Store. Developers had an incentive to share their reusable services through a market place that provided them with an alternative source of income, so why not?

No matter how good an engine gets, it'll fail horribly if it tries to be a "do-it-all", kitchen-sink type of deal. Developers come in many flavors, and the best way to keep them happy is to allow them to bring their own tools and technologies they love, instead of forcing everything down their throat.

## Conclusion

This one was brief, as it should be, and it concludes the client-side part! In the next post, we will switch over to the server, and see how game development looks from that angle.

[gui-system-link]: {% post_url 2016-06-26-whats-in-a-game %}
[game-engine-link]: {% post_url 2016-06-28-rev-up-your-engine %}
[backend-post]: {% post_url 2016-07-01-back-me-up! %}
