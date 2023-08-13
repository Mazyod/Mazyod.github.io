title: Updating Cocos2d-x
categories:
- snippet
- cocos2d-x
- rant
- development
- mac
- ios
- xcode
- undefined
- symbols
- error
- linkage
- linker
- header
- not-found
comments: true
date: 2015-02-21 11:50:08+00:00

Just a quick post, since I recently updated my project's cocos version to the latest and greatest.

It went surprisingly very smooth!

First of all, make sure you run the dependency script:

```bash
$ python download-deps.py
```

This will obviously make sure you have all the dependencies.

After that, make sure you remove all the linked libraries in the build phase, except cocos. Here are the before and after screenshots:

![image](/images/build-phases-xcode-before.png)

![image](/images/build-phases-xcode-after.png)

Finally, update the linker flags to use the new Cocos2d-x way of linking against libraries:

![image](/images/xcode-linker-flags.png)

That was pretty much it for me!

Now, time to look into all these deprecations, and see how can I resolve them ...

