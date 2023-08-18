title: Google App Engine (GAE)
author: mazyod
category: game-development
comments: true
date: 2013-12-27 21:46:06+00:00
slug: google-app-engine-gae
tags: app, application, billing, engine, free, GAE, google, instruction set architecture, introduction, PaaS, platform, python, service, Software, software developers, what is
wordpress_id: 551

When man first brought forth the power of programming, they were doing everything from scratch. Slowly, developers started to contribute frameworks and wrappers to make it easier to use a resource. I mean, imagine having to write an iOS app or a web app by aligning transistors? Yeah, it'll probably take 29343 years to write a hello world app, with bugs of course. Hence, people came up with the ISA (instruction set architecture) to facilitate software developers with the hardware they ultimately want to run programs on. That isn't enough, is it? It'll probably take 22 years to write an Assembly program that authenticates users, tracks sessions, connect to the datastore, ... etc. "Well, let's write a higher level language", developers agreed. Now, we have cool languages like C++, Java, ... etc. I am sure that is enough? Nope. Even with a high level programming language, we have frameworks on top of frameworks, and on top of all that a Platform as a Service (PaaS). That's GAE.





Even though I praised GAE a little too much in the introduction, it'll be all downhill from here (lol, no actually not that harsh). GAE is a great platform to deploy your applications and forget about them as they scale to accommodate millions of users. It scales automagically, it has a whole set of available tools for you to leverage, and many perks that makes it very desirable. The most glorious feature that dragged me in is the free-to-start price model that they have. You can deploy your full fledged app for FREE, and start using it and testing it all you want. The charges only kick in when you get some traction, which by then, you hopefully have some money from those users.





With all that being said, I came here to express my unlimited frustration regarding how some of their provided services work >_<. You want to use their built-in OAuth framework? Go ahead! :D But, the user must sign in using a google account... You want to track users automagically using their Users framework? Go ahead! :D But, the user must be authenticated with their accounts service **using a friggin' google account.** :| . OK, I give up. I'll still use GAE, but their is no way I can force my users to login using a google account, so I'll reinvent the wheel, in a way :'(.
