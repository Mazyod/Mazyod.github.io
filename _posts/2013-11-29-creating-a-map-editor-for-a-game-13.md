---
author: mazyod
comments: true
date: 2013-11-29 22:30:11+00:00
layout: post
slug: creating-a-map-editor-for-a-game-13
title: Creating a Map Editor for a Game (1/6)
wordpress_id: 324
categories:
- game-development
- Never Ever
tags:
- application
- cocoa
- code
- code generation
- geeky
- Map Editor
- mobile
- Never Ever
- plist
- Programming
- python
- RTS
- scripting
- source code
- startcraft
---

_This is a 6 part series of how I carried out a task of creating a map editor for our mobile RTS game. As of the this writing, 3 parts have already been published._



So, I have decided to make this the first topic to blog about in the upcoming series of topics! I think it is also the most interesting one! Well, all of my posts are super interesting, but this one is special ... Well, all of them are special, too. Ok, let's dive right into it!


## Background:


In the company I'm currently in, we are building a mobile RTS game, with some casual game-play elements into it. This game needs to have a campaign mode, with boss fights and whatnot. The campaign levels have pretty much been designed on paper, and even some of the art assets were created for them, but we needed a tool to lay out the art and add certain "triggers" and "actions" tied to specific "zones" (more about that later). In order to do that without hard coding all the values in the game, and wasting precious engineers' time in satisfying the perfection nature of the game designers, we had to build a tool the game designers can use to their heart's extent to reach the experience they are after. Hence, we called in a meeting to discuss how we should approach this problem.


## The Map Editor We Need, Not the One We Deserve:


The reason I say it's the one we need, not the one we deserve is because of time constraints. Even though our ideal case scenario for the map editor is to actually ship it with the game and let the players make their own maps on multiple platforms and whatnot, or at least make it highly visual and easy to use so the game design team doesn't have to spend a week building a single map, alas, we are short on time. The tool we needed should reduce engineering iteration time rather than design. What I mean by that is, the editor should be built such that there is minimal engineering effort needed to add features the designers would want. We also ended up deciding to go with a Cocoa (Objective-C) application, because of the available expertise.

Now, regarding reducing the engineering iteration time, I can think of 2 ways to solve this problem:




  1. Create an editor that initially has all the functionality that the designers need. Implement it once and get it over with. **NOT POSSIBLE**. Requirements change over time, and we have to embrace change as part of our agile process.


  2. Design the editor with a very generic base that can accommodate 93.6% of the designers needs, then make that generic base **data-driven** using "plugins". This is the approach we took, so more about this later.




> If we can't add scripting support to the engine, we can at least add scripts that generate code compatible with the engine!


In order to get an idea of how map editors work, we took out the [Starcraft 2 Map Editor](http://starcraft.wikia.com/wiki/Galaxy_Map_Editor), and started dissecting the hell out of it.

The first thing we loved was the generic nature of the editor. Basically, you can achieve virtually _anything_ by just building an expression. Some examples:

{% highlight text %}
if [unit] [enters] [zone] apply [action]
if [unit.property] [less_than] [value] apply [action]
if [any_unit] [attaks] [unit] apply [action]

{% endhighlight %}

Some actions:

{% highlight text %}
**[affected_unit] kill**
**[affected_unit] set attack +%50**
**[player_inventory] add [item_id]**

{% endhighlight %}

We can break the above examples into 5 different entities:




  1. **Object**: Any unit or building placed on the map.


  2. **Zone**: A geographical area of the map specified by an array of tiles.


  3. **Event**: A condition. (Boss.hp < 30%, unit enters zone, ...etc.)


  4. **Trigger**: A collection of events that collectively define a trigger.


  5. **Action**: A predefined algorithm that executes when a trigger is invoked (kill_unit(), set_hp(+10), ...etc.)


As you can see, the possible combinations that can be generated are endless. A possible approach to implement this system is through scripting. So, you would have a script that takes some parameters, such as the associated zone, the affected_unit, etc., and within that script, you would implement the action's behavior (e.g, `unit.hp += HEAL_AMNT`). This script can be the **Action** as shown above, or even an **Event**. This is probably the most versatile approach, since you can add new actions and behaviors right within the Map Editor by adding a new action with an associated script function, and no further change to the game code is required. Unfortunately, we couldn't go that way because adding scripting support to our engine proved to be very expensive (time wise). This was the consequence of not designing the engine ahead of time to play nicely with script binding. So, we decided to abandon all hope, and resign from our jobs... jk.

With scripting out of the question, it immediately means we are going to have tedious C++ code whenever a new action or event is needed, *Sigh*. Can we do anything about that? Hmmm... That's when I started thinking, if we can't add scripting support to the engine, we can at least add scripts that generate code compatible with the engine! This is easier said than done, of course.

The first task we had to do was think about how the Python script is going to generate the C++ code from all the actions, events, ...etc. (going with Python was a no-brainer). There were a lot of possibilities there:




  * We could write the code in Objective-C, so it would run on the map editor, and then convert that code to C++ whenever the Objective-C code changes.


    * Even though Objective-C is a lot more friendly than C++, it is still tedious to write code there, and bugs can happen.





  * We could write the code in Python, and somehow convert that code to C++, and maybe interface it directly with the Objective-C code.


    * One issue is, you need a very proficient Python coder, which we don't have.


    * Second, converting data structures from Python to C++ can be tricky, since variables in Python are loosely typed (no type definitions).





  * Or, we can define everything we need as plist files. These files are loaded and used in Objective-C directly, and loaded by the Python script to generate C++ code from the contents.


    * With the awesomeness of [plistlib](http://docs.python.org/2/library/plistlib.html) in Python, and the simplicity of reading plists in Objective-C, as well, it became apparent that this would be the best approach.








## Where to go from here



This is it for the first post in this series! In the next post, we will explore how the plist files are structured and how to make the best out of their organized structure! [Click here to go to the next post]({% post_url 2013-12-06-creating-a-map-editor-for-a-game-23 %}).
