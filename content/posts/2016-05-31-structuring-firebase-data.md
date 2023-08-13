title: Structuring Firebase Data
tags: firebase
date: 2016-05-31 12:17:32+00:00


## Introduction

This isn't the first Firebase post, however, it is the first since the recent revamp Google introduced to Firebase. It has a neat new logo, website, and features! It's no longer just a datastore, but includes analytics, crash reporting, push notifications, and tons of other features.

Recently, I've worked with Firebase again for a client, and this time, it was about consuming data, not generating it. This presented an interesting challenge, how should the data be structured?

## Basics

There are a few select rules you should bear in mind while designing your data, and they will allow you to achieve maximum efficiency while working with Firebase.

### UI Driven

This is really counter-intuitive to DBAs. Usually, data is structured using ER diagrams or whatnot, and modeled in a DB regardless of how the UI is gonna present it. Not the case with Firebase.

Since Firebase is **directly** consumed on the client side, the data should be designed around the UI. Doing this will give you realtime super-powers and maximum flexibility in managing your apps data.

The not-so-bad downside is, you're gonna have to replicate your datastore everytime you make a breaking change to the datastore schema, in order to not break existing clients. Not too bad.

### Flat vs Nested

One simple rule:

> Nest static data. Flatten dynamic data.

The real challenge here is identifying what is static data and what's dynamic data.

Basically, if you have a nested type which once you instantiate, you really don't want to get updates on that object anymore, that's static data. A good example of this is the menu of an e-Commerce application. You simply create the whole menu hierarchy once, and load it. We don't really care if a new category is added, we can reload the next time the app launches.

Dynamic data, on the other hand, is data that can change after being loaded the first time. I would go as far as saying, it's any data that you attach a Firebase observer to. This data should be flat, for the sake of reducing the updates overhead, as well as keeping your client code clean and segregated. Let's expand on this a little with an example.

You've got a user's feed of stories, and each story has comments. So, if you decide to use a nested structure where you have:

+ Root/users/USER/feed/[STORY]/[COMMENT]

Anytime a comment is added to that last array, the **whole** object gets rewritten, all the way from the /users path, which can get insanely expensive pretty quickly. The alternative, is to denormalize your data, and just include object ids, which you later fetch using another Firebase instance:

+ Root/users/[USER_ID]
+ Root/[USER_ID]/user_data
+ Root/[USER_STORIES]/[STORY]
+ Root/[STORY_COMMENTS]/[COMMENT]

By moving everything to the root, it may seem like a chore at first, but this isolation is quite neat, as it allows you to fetch and update data in an isolated way.

The drawback this time is, what if we want to inform the user object of an update, when a new comment is added? Using nesting, the whole tree will get rewritten, and hence causing the whole tree to get an update notification.

The only reasonable way I know of is to wire things together on the client side. So, once a new comment is added, for example, you would update the UI to add that comment. As you do that, the user-related UI would be fetching the comment count from deep within the tree.

## Conclusion

It's gonna be really painful if Firebase meets the same fate as StackMob and Parse, but for rapid development, you really don't have much of a choice but use these services...
