title: Come Again?
tags: dama
date: 2016-07-30 22:04:18+00:00

So, after spending all that time perfecting the relationship between the game logic, graphics, and view, the game started coming together. Implementing new crap is much simpler, since everything is where it belongs, and it doesn't take time to think about where to implement it.

With that, my trello board quickly started draining down cards, thankfully, but it's way too early to celebrate.

Speaking of celebration, I was psyched to see the game performance go through the roof after simply turning off a clipping feature in NGUI. It had something to do with Physx processing, hogging tons of resource.. So, I wanted to check if the performance gain was real, and wanted to build the game on iOS.

As I was making changes and pushing to github, the iOS build on UCB kept failing... Weird.. It usually fails for no reason from time to time, but now it failed like 3 times in a row! Something was amiss.

Well, the biggest change I made which impacted platform specific stuff was upgrading the native dama logic plugin. I've made changes in the library to remove dynamic memory allocation from certain parts, in order to simplify memory management a bit ... which was nice, but it's a chore to build the library and update the server, bots, and unity with the new version.

So, after spending an hour or two updating and running the new library on the servers, after updating Pyport obviously, which is the python shim wrapping the C library, I updated unity simply by replacing the old libraries with the new ones. At that point, I hastily tested the Mac build, which worked fine, so life went on.

Now, after seeing the iOS build failures pile up, I looked deeper into the logs, and yup... the dreaded iOS native lib was causing issues because of some undefined symbols. The annoying this was the Unity itself generated C++ code through IL2Cpp that was named exactly the same name as my native code, except it had a number suffix at the end, like `xyz_m12839213`. This made the linker go, "Did you mean xyz_m12839213?". I'm like, no! the suffix shouldn't be there!

So I dig through my blog, go over git changes like 5 times to see what changed?? I did upgrade Unity to 5.4.0F2, but seriously? Even cloud build was failing, so it should be something else...

Finally, I use the best tool for inspecting libraries, `nm`. Using it revealed that indeed all the "glue code" generated by SWIG, to glue the C code with CSharp was missing! Going back to the Xcode project that built the native library, it seems that yeah ... I was an idiot at some point and excluded that file from the build `>_<`.

So, finally, I mark that file as part of the built library, build the library, and off to Unity it goes ... The issue now is, I've built too many times within a short period of time on UCB, so it will be a while till my build will be executed ... Too lazy to build it locally, so just distracting myself with this blog entry and probably going out for food... Hopefully, it will be ready after that.

Once it's really, it would be time to download it on an iPad and hope for that sweet, sweet 60 FPS glamor `*_*`.
