title: See Windows
categories:
- programming
date: 2016-06-16 05:46:36+00:00

## Introduction

In this widely generic programming post, I'd like to go over the experience of building a C dynamic library (DLL) on windows. The reason I'm interested in building for windows is because my game's logic is written in C, and my new programmer is running Unity on windows. To properly run the game on windows, he needs a version of the game logic library targeted to windows. So annoying!

## Setup

To my great fortune, I had actually installed a VM manager recently, called [veertu][veertu-link]. With this app, I had a quick and easy solution to quickly run VMs running windows, ubuntu, ... etc.

With that, I ran windows 10 installation, and using Github for Windows, Microsoft visual studio, Unity, and SWIG installed, the environment was all set.

Using Github app made it a breeze to quickly clone the game logic repo into the VM. After that, I quickly downloaded and ran swig to regenerate the C wrapper. I am not sure if that is required to be generated separately on each platform, but that's what I did anyway.

Finally, it was time to figure out how to build this DLL!

## Windows DLLs

After meaningless research and reading on how to build a C DLL on windows, I launched Microsoft Visual Studio and stared experimenting. The thing that worked was actually choosing "Command line application", and selecting "DLL" on the next screen...

> WHY IN THE NAME OF BILL GATES IS DLL UNDER COMMAND LINE APPLICATIONS?!

So, anyway, I chose "export symbols", and leaved all other options unchecked, and that created the project (or solution, as it is called in MCVS).

After losing hope on figuring out how to import a folder into the solution, I simply dragged all files from windows explorer into the MCSV project. After those were added, I got a bunch of errors because of invalid includes.

Apparently, I had structured my imports cleanly using:

```c
#include <LibName/Directory/File.h>
```

You see, these angle bracket header includes indicate that the compile will "know" about the location of the "LibName" directory, but in MCSV, it doesn't. I had no idea how to point the compiler to search for header files in "LibName", so I just renamed all the includes to be relative imports:

```c
#include "Directory/File.h"
#include "../File.h"
```

That resolved the include issues, and surprisingly enough, the DLL was built successfully! That was the least painful build experience I've had so far, so I'm not complaining about the few hurdles above.

## Enter Unity

After dropping the windows native plugin into Unity, which is running in the windows VM, I selected the plugin to play around with the plugin inspector. The plugin inspector is __super__, and I'm really thankful the Unity people had put it there...

I noticed that the settings for the plugin should be set to "Standalone - Windows x86_64" as well as the "Editor - Windows x86_64". with these two options set, the game was running like a charm on the windows installation of Unity.

That was the end of it, really. I checked in the changes, and it's time for the developer to take over from here.

## Conclusion

I cannot explain how many days of this everlasting project have been drained on this freaking C game logic. To run it on the server, I had to figure out how to compile it on linux, and played around with CMake. In order to develop and test it properly on OS X, I had to prepare an Xcode project and Swift tests. Then, there is this post, where I had to run a windows VM and compile a DLL. But that's not all...

Recently, I've been running game bots on my machine that automatically login to the server and play games against each other. After leaving the bots running for a few hours, I noticed my computer was getting quite slow... Yup, it was a memory leak, and the only possible culprit was the C library. The other languages in the stack (Elixir, Python) are garbage collected language, that don't leak memory.... Also...

In order to connect the logic to the server, I had to use python and distutils to wrap the C code with a sane python script that Elixir can interact with. On the Unity game side, I needed to play around a lot with Swig and building the library for all sorts of target platforms...

> QUITE A FREAKING ORDEAL!

[veertu-link]: https://veertu.com/
