title: Spine Skeleton Data Caching in Cocos2d-X
tags: spine, skeleton, cache, pool, reuse, faster, performance, v3, cocos2d-x, c++, esoteric
comments: true
date: 2014-10-10 20:42:25+00:00

## Introduction

While integrating the amazing [Spine editor](http://esotericsoftware.com/) by esoteric software with my cocos2d-x game, I ran into an issue where the game would take a while to load. Since the only thing I changed since the last time I tested the game was add new spine animations, that was most likely the cause of this performance hit.

By following the definition of:

```cpp
SkeletonAnimation::createWithFile(...);
```

I realized the runtime was loading the file everytime without any sort of caching going on. Mature frameworks most certainly take care of this task automatically for you (for example, UIKit's convenient method in the `UIImage` class that we all use, `imageNamed:`). Alas, that had to be solved by us, but thanks to open source software, it's as easy as pie.

## The Meat

So, once you see the implementation of `SkeletonAnimation`, you realize that it creates a `SkeletonRenderer` object with the named files. That class loads the files into a `spSkeleton` object, which holds the parsed data in the `data` member. `data` is `const`, and [according to the runtime diagram](http://esotericsoftware.com/files/runtime-diagram.png), it should be fine to reuse.

So, here is the solution!

```cpp
static Map<std::string, SkeletonRenderer *> skeleRendererCache;
if (!skeleRendererCache.at(filename))
{
    auto skeleRenderer = SkeletonRenderer::createWithFile(jsonFile.c_str(), atlasFile.c_str()/*,  0.1 */);
    skeleRendererCache.insert(filename, skeleRenderer);
}

auto cacheData = skeleRendererCache.at(filename)->getSkeleton()->data;

SkeletonAnimation* skelly = SkeletonAnimation::createWithData(cacheData);
skelly->setSkin(skin.c_str());
skelly->setSlotsToSetupPose();
skelly->setAnimation(0, "idle-simple", true);

skelly->update(0);

return skelly;
```

## Conclusion

All hail open source, for which without, this task would've been boring, dull, and time consuming!

