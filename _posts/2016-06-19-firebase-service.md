---
layout: post
title: Firebase Service
date: 2016-06-19 05:24:02+0300
categories: 
- firebase
---

## Introduction

It's tons of fun running your own thing, working on your ideas and projects .. That is, until you're broke. Now, if your thing makes enough money for you to sustain and grow, then kudos, you've made it. For the rest of us stuck in the chasm, we need an alternative money source.

The common knowledge where I'm from is to take a government job, slack, and work on your own thing. You see, this doesn't cut it for me. Why would one deliberately choose to waste one's time with stuff trivial matters? The ideal scenario is a part-time job as a programmer that also pays enough for me to sustain. Luckily, I found such job.

So, while I focus on my own projects most of the time, I then get to switch gears and work on other challenging projects. These projects give me a lot of content to write about, which is also great for this blog! So, for today's post, we'll be covering the aspects of writing a backend service that syncs with Firebase.

The idea is simple:

Decouple the client apps from the backend by creating a micro-service that syncs the legacy backend's database to firebase. The client applications will then just use firebase to access the data.

Let's first take a deeper look at these design requirements.

## µService

First off, I'd like to take a closer look at the root problem that prompted the need for this task.

### Root of the Problem

The main issue is that the startup has relatively high engineering work to be done, and not enough engineers to carry out the tasks. If we had a sufficient supply of engineers, we wouldn't be bothering with this. So, to mitigate this issue, we decided it would be best to cut corners where-ever possible to reduce the engineering overhead involved.

Looking at our setup, and also due to my bias as the iOS engineer in the team, I realized the biggest drain of resources (by far) was the maintenance of two native mobile applications (iOS/Android). For a relatively simple app, I figured our first priority was to seek parity between these platforms.

### iOS 💘 Android

In order to unify the development process on these platforms, we must unify the way we consume the backend API and sync data, as well as unify the GUI development process. Due to our lack of expertise in cross-platform technologies, such as NativeScript and ReactNative, we shied off from going all out with those from the start. We figured we can do some initial work to achieve partial parity first, which puts us in a better position to decide later. This is where Firebase comes in.

Firebase offers cross-platform tools to manage and deal with common services your application might need, such as datastore, crash reporting, analtyics, ... etc. Utilizing Firebase would help us achieve some partial parity between the current code bases, and then, we can move to something like ReactNative when we're ready.

### Detailed Design

Currently, we have a very basic and common API that is being consumed by the client applications. After logging in and acquiring a secure token, you authenticate each API call thereafter with that token. There is one API call for now, and it is to retrieve the "user data" on a specific "date". Something like:

> /api/v1.1/user_data/YYYYMMDD/

As things are right now, the client app wakes up when a push notification is received signaling new data is available. The app then pulls the latest user data and adds it to the local store. The user also has the ability to browse old data, and another API call is issued if that data is missing.

After thinking of many ways to go about this, I had to prioritize the following constraint:

> Build a micro-service completely transparent the to the current backend.

What?! Impossible! How can that be?

Well, once the user logs in on the client app, the client app simply pushes that token to the new micro-service. The service then stores that token, and continues to sync its data on daily basis. If the user decides to browse an old entry, a "forced update" request is pushed to the micro-service, which attempts to retrieve the data and write it to Firebase. At that moment, the client app will receive the Firebase data update!

With this design at hand, there is absolutely no need to change a single line in the current legacy backend! Banzai!

So, let's write it! How hard can it be?

Well, this is actually my second time writing a Firebase service. The first time I wrote one, it was written in Elixir. It was so simple, I didn't feel the need to blog about it ... However, this time around, Firebase has changed a lot! Let's see what these changes brought us, and what it means for our micro-service.

## Shiny Fire

As we all know, Firebase has been overhauled recently with SDK v3. Google took Firebase to a whole new level (not necessarily a good thing).

#### The Good

I have to give Google credit for bundling push notification services, crash reporting, storage, and a bunch of other goodies with Firebase. For this job, I needed to migrate away from Parse as well. So, with these new goodies, Firebase has become an excellent alternative.

#### The Bad

Firebase got dragged into Google's auth system... DAMN IT!!! This part is really frustrating because Google's auth system is so friggin' complicated and convoluted, you can't make a single auth call without downloading 10 libraries, and reading 50 pages of docs.... It's really annoying.

No matter how challenging this new Firebase system is, the task has been set. The task shall be carried out!

### Carrying out the Task

I really love Python, and clinged on the possibility of using it till the end, but without avail. Without going into too much detail, let's say I was better off writing this micro-service in NodeJs.

Indeed, with the NodeJs library Firebase has, it was super simple to get started with manipulating the Firebase datastore. By following the NodeJs getting started guide on Heroku as well, I was able to finalize the service prototype within a day's worth of work.

It would be interesting to perhaps explore the details of this micro-service and how it works, but for now, I feel it's quite mundane. Besides, I am already way beyond the limit for this article!

## Conclusion

Writing JS code wasn't all that bad. It was a nice change. Sure, I wasn't able to find a good way to format string, and I had to import 10 libraries to write simple stuff, but at the end, the code was quite neat and readable. This reduces my "Languages that should 🔥" down by one. Topping that list is, of course, PHP.
