---
layout: post
title: "Continuous Integration With Unity"
date: 2015-01-20 14:41:48 +0400
comments: true
categories: 
- unity3d
- ci
- continuous
- integration
- automation
- xcode
- ios
- workflow
- jenkins
- cli
- terminal
---

## Introduction

This post will be a tad bit different than the usual. It's regarding continuous integration in Unity3D, since I had to do that recently.

I'll cut the rant here, and focus on the technicalities.

## Unity's Side

Unity doesn't provide a command line interface (cli) for generating builds, so you have to add a script yourself first.

The script is going to be an [Editor Script](http://docs.unity3d.com/Manual/ExtendingTheEditor.html), meaning you must create a new script in the project, and add it to "Editor" directory in the root of the project directory:

{%img center caption no-invert http://mazyod.com/images/unity-script.png "" "" %}

The script should contain code to call the build pipeline, and generate the Xcode project. In the code below, I hardcoded the output directory, so you must make sure the directory `Builds/iOS` exists in the project.

Alternatively, you have use command line arguments code to pass the output directory.

{% highlight csharp %}
using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;
using System.IO;

public static class AutoBuilder {

    static string GetProjectName()
    {
        string[] s = Application.dataPath.Split('/');
        return s[s.Length - 2];
    }
    
    static string[] GetScenePaths()
    {
        string[] scenes = new string[EditorBuildSettings.scenes.Length];
        
        for(int i = 0; i < scenes.Length; i++)
        {
            scenes[i] = EditorBuildSettings.scenes[i].path;
        }
        
        return scenes;
    }

    [MenuItem("File/AutoBuilder/iOS")]
    static void PerformiOSBuild ()
    {
        var args = System.Environment.GetCommandLineArgs();
        System.Console.WriteLine(args.ToString());

        EditorUserBuildSettings.SwitchActiveBuildTarget(BuildTarget.iPhone);
        BuildPipeline.BuildPlayer(GetScenePaths(), "Builds/iOS",BuildTarget.iPhone,BuildOptions.None);
    }

}
{% endhighlight %}

After adding the script above, you will now be able to see an option in the editor to generate the Xcode project:

{%img center caption no-invert http://mazyod.com/images/unity-editor-script.png "" "" %}

OK, it's cool that we have the option to do it through UI, but what if we want to incorporate that with a build script? Simple task.

All you got to do is run the following script:

{% highlight bash %}
$ /Applications/Unity/Unity.app/Contents/MacOS/Unity -batchmode -executeMethod AutoBuilder.PerformiOSBuild -quit
{% endhighlight %}

Now, you should be able to generate the Xcode project with ease.

## Xcode Side

In order to easily build the Xcode project, we make use of [nomad-cli](http://nomad-cli.com/), and specifically [Shenzhen](https://github.com/nomad/Shenzhen), to generate the `ipa` file to be uploaded to our distribution service. Thankfully, It's a very simple task.

First, make sure you unlock the keychain:

{% highlight bash %}
$ security unlock-keychain -p $YOUR_PASSWORD
{% endhighlight %}

Then, while in the Xcode project directory, generate the `ipa` with the following command:

{% highlight bash %}
$ ipa build
{% endhighlight %}

Wait for it to build, and finally distribute!

{% highlight bash %}
ipa distribute:testflight -a APP_TOKEN -T TEAM_TOKEN
{% endhighlight %}

## Conclusion

Automate away! don't bog yourself with these tedious tasks, and free up your time for other things!!

