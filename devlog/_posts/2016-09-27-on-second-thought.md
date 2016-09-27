---
layout: post
title: on second thought
date: 2016-09-27 15:59:32+0300
categories: 
- dama
---

Well, I did need to write about the current authentication design, not that I think it's amazing or anything like that, but in fact, I need to write it out in order to properly think about it.

So, what's the deal with the authentication flow?

So, I decided to go with a pretty "novel" approach for authentication, and that is to redirect the user to a website that (s)he can then authenticate through, which "upgrades" the associated account...

So, everytime a user installs the app, a new "guest" account is created, and a device token is associated with that account. The device token, as the name suggests, is a unique auth token for that device, which provides access to the account without the need to enter the username/password everytime. Pretty basic stuff..

Now, once the user logs in on the web portal, as I call it, the device needs to "know" about this authentication process, and change the initial guest account to the new logged in account.

My approach to this problem was to send the guest auth token with url redirect. I am not worried about the security of this token, since it is **always** a token of the guest account, which isn't significant.

So, once the user is on the login portal with that token, we can fetch the guest account and prepare for the upgrade process. If the auth process succeeds, there will be a new account we want to "migrate" to...

I am thinking of simply migrating the device token to that account, and once the user is back in the game, we detect the token and that it has been migrated, and send an updated token of the new account, which is then securely stored on the device for further operations.

Everytime I think about it or try to find issues with this approach, I don't see anything wrong, but also every "new" design you come up with in programming will always make you anxious since if this is so great, why isn't everyone using it?

Well, I don't have time to care about that, I need to get done with this...
