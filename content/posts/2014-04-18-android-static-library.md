title: Android Static Libraries
tags: android, cocos2dx, v3.0, android, static-library, makefile, programming, snippets, compile, architecture, arm
comments: true
date: 2014-04-18 21:14:05+00:00

I have had some grief trying to link the AI library of my game with the cocos2d-x game. Most of the grief was due to a silly, silly mistake from my end.

First, I didn't immediately realize that I need to compile the library for Android, as I tried to link it against the iOS library. I quickly realized how silly this was, so I went on a journey on how to compile static libraries for Android.

It wasn't bad. All I had to was provide an Android make file with the build steps, and an application make file with the supported architectures. Then, I had to plug these to a dummy project, so the make file gets triggered or something.

That was pretty easy, especially with the samples provided with the NDK. I replaced one of the samples organs with my things, and it compiled the thing! Hurray!

Then begins my nightmare...

As I tried to link it against my game, I used some reference online, which is to simply do the following:

```text
include $(CLEAR_VARS)

LOCAL_MODULE := my_static_lib
LOCAL_SRC_FILES := ../../lib/MyLib/$(TARGET_ARCH_ABI)/libMyLib.a

include $(PREBUILT_STATIC_LIBRARY)

include $(CLEAR_VARS)

```

This is probably the first thing I tried, and it gave me errors about missing symbols... WHAT?! I freak out and use `nm` command, and it shows that the library doesn't have any symbols... "GREAT! THE BUILD SYSTEM IS BROKEN", I cried in rage. As I hopelessly spend hours trying to figure the source of the problem, I keep telling myself: "It's working on iOS, why not android? Because the build toolchain is broken". If something like that was broken, someone ought've noticed... /facepalm.

After posting on stackOverflow, a guy told me how the `nm` command doesn't work on these libraries, and I should use the binaries provided by the ndk to check, which I did. The symbols were all there.... WHAT?!

I kind of lost hope there... So, I took all the source files and included them into the project directly. No more static library linkage... Oh wait, but there is more.

As I added the source files, the iOS no longer compiled, and complained about missing symbols!! As I looked closely, I laughed hysterically at my silly, silly mistake...

So, in the code, which I only built for iOS up until now, it was using an *old* version of the library, and when I added the most recent source files, it threw errors, since in the up-to-date source I had done major function name changes...

While biting my lips, I updated the code to the newer APIs, and decided to build the libraries again. Voilla, it worked like a charm.

**tl;dr**: iOS was linked against an old library, android was linked against a new library, code was referencing older library API, Android failed to build, I laughed hysterically at one point.

## Conclusion

Again... Think clearly, identify the root problem properly, don't making any friggin assumptions.
