title: ReactNative as a Framework
categories: null
date: 2017-08-05 18:46:15+00:00

It has been a while since I have posted anything, and to be honest, I shouldn't be posting anything, since I've got loads of other things to worry about..! But oh well, I have searched the Internets high and wide for tids and bits about packaging ReactNative as an iOS framework, and couldn't find anything useful...

So, here I am saying that **it is indeed possible**.

I don't have the luxury to post a whole tutorial with pics and kitten gifs about the topic, but just enough time to brag- ehm, I mean _share_ some of the details of how it's possible.

To those of you who catch up quickly, and are just here for reassurance:

Simply, create a Framework target in the generated Xcode project, and make the settings and code identical to the app target already created by RN. Done.

For the rest of us, please follow along as I try to recall all the steps required to perform such a feat.

### Packaging RN

So, for the purpose of this post, you might wanna give it a shot on the side, and not directly apply the changes to your main project .. Just in case the Xcode project catches fire or something...

So, `react-native init PackagingReact` in terminal should give you a nice, clean RN project to experiment with. I'm using the following versions of RN:

- `react-native 0.47.1`
- `react-native-cli 2.0.1`

Simply, open the Xcode project residing in the newly created project, and observe in Xcode, under the targets panel, there should be an Application target `PackagingReact`, and some other stuff like testing and what not.

We simply need to do `new`, `Target...`, and choose `dynamic Framework`. I have tried for a few minutes to make it work for `static library` target, but that was horrible since we need to bundle some resources and other dependencies...

With the Framework target created, you can select it now under the targets panel where the application target was, and start replicating the settings from the application target onto the Framework target. As far as I recall, I had to do the following:

- Link the 11 static libraries
- Copy `other linker flags: -ObjC -lc++`
- Replicate the custom `Run script` phase to the Framework target
- Run `react-native bundle ...` command to generate `main.jsbundle`
- Add `main.jsbundle` to the framework target

That's about it, folks. Once that was done, I simply copied over the ObjC code from the application target, to a new class in the Framework, modified that code a bit to load the `main.jsbundle` instead of searching for the packager, and voala. Works like a charm.

### Final Remarks

I am now gonna test to see if I can make the framework target Swift based (no reason it can't be). After that, I would like to automate this process, so it becomes a single click deployment of the RN application to an iOS framework (which we can possibly link using Carthage even).
