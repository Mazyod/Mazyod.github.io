title: Unity + JSON
categories:
- unity
date: 2016-05-26 22:56:47+00:00

## Introduction

JSON is such a trivial matter to be discussed .. but for whatever reason, it's quite a chore on Unity.

## Newton?

`Newtonsoft.Json`, also known as `JSON.Net`, is the defacto JSON serialization in C#. It's superb, with great features, like automatic object serialization/deserialization, which reduces tons of boilerplate code.

Unfortunately, it's not stable on Unity. It's crazy, but it's true. As far as I can tell, it only crashes on IL2Cpp, and does so due to some unimplemented reflection feature of some sort .. So, we can't use this for serious Unity + iOS development!

## JsonUtility?

This ships with Unity, and guarantees the least footprint + garbage, which makes it super fast and efficient for games. Unfortunately, as with most thing in Unity, it's poorly documented making it almost useless.

Another issue is that it doesn't have a "JSON object" class that can dynamically construct a JSON object. For example, Newtonsoft has `JObject`, which you can instantiate and use like a dictionary.

## AssetStore?

Yeah, that's our final hope ... Tons of options are available, but since I am using a vendored library that uses the Newtonsoft namespace and `JObject` functionality extensively, hence I've decided to get a drop-in replacement.

The best option I found was [this][json-lib]. A highly rated, well received drop-in replacement, open-sourced replacement to the broken Newtonsoft. $25 means 30 minutes of my development service, definitely worthwhile.

## Conclusion

Unity is still lacking, but it has made insane leaps thanks to IL2Cpp, 2D support, UI system, and the great community. Please do consider it as an alternative to whatever else you're using. (_cough_ SpriteKit _cough_ Cocos2d)

[json-lib]: http://www.parentelement.com/assets/json_net_unity
