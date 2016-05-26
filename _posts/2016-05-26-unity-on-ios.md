---
layout: post
title: Unity on iOS
date: 2016-05-26 19:08:35-0400
categories: 
- unity
---

## Introduction

So, over the past three days, I spent two sleepless nights, and kept on working with one goal in mind .. Get the game working on iOS.

Wait, this is Unity! The game engine that promises painless cross-platform compatibility! Why do I have to spend over three days to make the game work properly on iOS? Especially, given the game was developed for OS X, and works great there. I mean, not too far off, you know?

Let's see why Unity fails us here...

## Enter the Walled Garden of Apples

The main issue is that Apple's platform is "too closed". You can't dynamically link libraries. You can dynamically load scripts. You can't scratch your ear without Apple's written consent .... ARGH.

I'm not letting Unity off the hook easily, tho. They knew about this, and should work around it without exposing those issues to the end-developer. Granted, that's (much) easier said than done.

Here are some specific details about the issues...

### Native Code

The main issue I was wrestling was making my native library work on iOS. Sure, if you only wanted to compile the native functions and have them accessible from Unity, all you do is drop the `*.c` files into the Plugins/iOS folder. However, my library is complex, and even has C# wrappers generated with swig, so... It's gonna be a battle.

##### Mono2x

First issue was related to Mono `dllimport`'s `EntryPoint`. You see, when you generate C# wrappers with swig, it also generates a C wrapper that wraps all your methods within `CSharp_xxx` calls (for whatever reason). So, the C# wrappers are actually functions with the original C function names, but the entry point is set to the `CSharp_xxx` variant.... So?

Plain and simple, this breaks when compiling for iOS with Mono 2x scripting backend. The generated Xcode project and code simply fail to locate the original function symbols, when it should be looking for the `CSharp_xxx` variants ... This is confusing, see the example below:

{% highlight cs %}
// CSharp
[dllimport("MyLib", EntryPoint="CSharp_NativeMethod")]
public static extern void NativeMethod();
{% endhighlight %}

I hope it's clear now .. Unity generates an Xcode project that calls `NativeMethod` for some reason, when it should honor the `EntryPoint` argument and call that name instead... That easily cost me tons of headache.

So, I tackled this issue with my trusted friend, Python. By integrating a python script after the swig generation script, I was able to transform the generated swig methods (as seen above) to the following:

{% highlight cs %}
// CSharp
[dllimport("MyLib")]
public static extern void CSharp_NativeMethod();
public static extern void NativeMethod() {
    CSharp_NativeMethod();
}
{% endhighlight %}

I basically got rid of the useless `EntryPoint` argument, renamed the extern method to match the swig wrapper, and finally created an alias for the other C# scripts, for compatibility. Let's run and see ... Boom! Crashes and burns.

Looking closer at the errors, seems that they are related to the callbacks swig registers to the native code. Basically, there is C# code that swig generates to pass managed (C#) methods to the native code, in order for the native code to callback the C# code in case of an exception, for example.

Yay .... it finally works! ... oh, wait.

So, I ran the game on iOS, and indeed it worked for a bit, but quickly crashed because of `System.Linq` calls .. Apparently, Mono2x doesn't properly implement all `System.Linq` functionality. Since I am in love with functional programming, I really leveraged those methods everywhere! Is all hope lost? No .. It seems if I just switch to IL2Cpp, this would resolve the issue... Let's try that.

#### IL2Cpp

So, according to some resources I found online, it seems that switching the scripting backend to IL2Cpp seems to be the way Unity is moving, and is the best future proof solution. Also, it has better performance and compatibility (especially with iOS), and most importantly, it should resolve the `System.Linq` issues! Time to flip that switch, and hope for the best...

Boom! The native code I just fixed broke .. AGAIN. Well, at least it broke in a good way `( ͡° ͜ʖ ͡°)`. What does that even mean?

Well, it means the hacks I previously implemented are breaking the code! I need just remove them .. probably. So, I've deleted the previous python script that removes the callbacks and hacks the method names, and the result ... Ye-arr... Not quite.

I got an error from the callbacks that says:

> Please use "MonoPInvokeCallback"

hrm... Ok. So, back to the python script.. Let's hack this one, shouldn't be too hard, and it wasn't. I simply iterated over the callback methods being passed to the native code, and added the following decorator:

{% highlight cs %}
[MonoPInvokeCallback(typeof(DELEGATE))]
{% endhighlight %}

Instead of `DELEGATE`, I have the actual delegate definition that matches the callback signature ... Let's run it, one more time... Success! IL2Cpp banzai! It was unfortunate that I wasted time on the previous fix, but wasn't too bad.

### Being a Perfectionist

Because I unfortunately always strive for perfection, I was like:

> What if I can build the Swig C# code into mono DLLs, then conditionally compile them to each platform using the plugin inspector?

![cat]({{ site.url }}/images/cat-tie.jpg)

After much time ~~wasted~~ invested into learning how to build and package mono code on OS X, it just failed horribly. Managed libraries can't contain unmanaged code calls, it seems, so that had to be thrown out the window.

So, I went back to my old friend, again, and asked him to do me a solid. While processing the PInvoke C# file with all the decorators and such, I add some more python code to do the following:

{% highlight python %}
callback_decorator_template = """{indentation}#if UNITY_IOS
{indentation}{ios_decorator}
{indentation}#else
{indentation}{original_decrorator}
{indentation}#endif
"""
{% endhighlight %}

Basically, another regex processor that replaces the default native calls decorators and adds this conditional compilation directive based on the platform. This way, we can maintain iOS and OS X support!

## Conclusion

Yeah, quite a hearty post, with lots of issues and stuff .. Even though, I've yet to cover all the details! For example, the Xcode build process, the swig integration, the `mcs` tool to build the mono libraries, Unity's plugin inspector, ... and so on.

Well, at least the general idea is out there, hopefully the small details are easy to figure out! (yeah, that's rarely the case).
