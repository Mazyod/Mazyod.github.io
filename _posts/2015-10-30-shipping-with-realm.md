---
layout: post
title: "Shipping With Realm"
date: 2015-10-30 15:45:59 -0700
comments: true
categories: 
- realm
- ios
- swift
- xcode
- app
- appstore
- release
- impression
- review
- migration
- schema
- version
---

## Introduction

I have recently announced starting to use [Realm](http://realm.io) for my iOS projects. Then, I had just started using the technology, but didn't really reach shipping stage until now. When it's time to ship, that is when every ugly detail surfaces.

_Note: This post is sponsored by [fastlane](http://fastlane.tools)! I found time to blog while it is busy building my app and generating screenshots._

## Use Cases

For starters, I'll be going over my use cases for using Realm, and then study each use case separately.

### Shared Settings

The first use case is using Realm to store app settings (preferences), and sharing them across all bundles (Main app, extension, AppleWatch app). This was supremely handled well by Realm, and I probably can't be happier with the setup.

__Migration__

Application settings change very easily and quickly. Adding more settings in the future won't be a problem at all thanks to Realm's clean Migration APIs. Breaking the settings down into small tables also helps a lot in managing migrations and changes, so keep that in mind.

For starters, all you really need to do is set the `schemaVersion` property on your `Configuration` object to `1`.

__Shared Container__

First step is to [set up an application group, and get a shared container going]({% post_url 2015-01-03-app-groups %}). The shared container will host the Realm files, and as per the docs, they can be accessed concurrently across processes without issues!

{% highlight swift %}
let fileManager = NSFileManager.defaultManager()
if let path = fileManager.containerURLForSecurityApplicationGroupIdentifier("group.identifier")?.path {
    // do something with path
}
{% endhighlight %}

__Simple API__

It is extremely important to have a simple API to read and update the settings, as well as extend the settings later. I probably have never had the pleasure of working with a cleaner API before, Realm takes the cake here as well.

To minimize duplicate code and stream line settings tables, though, I had to leverage Swift protocol extensions to roll out some convenient accessors.

First, let's see how my current settings code looks like:
_Note: I use capital letters for static accessors_

{% highlight swift %}
public class LocaleSettingsTable: Object {
    
    public dynamic var languageLocale = "en"
    public dynamic var regionLocale = "en"
    public dynamic var timeFormat = "12"
}

// get Locale settings:
let language = LocaleSettingsTable.CurrentSettings.languageLocale

// update Locale settings:
let newValue = "ar"
LocaleSettingsTable.CurrentSettings.commit { settings in
    settings.languageLocale = newValue
}
{% endhighlight %}

That is all there is to it! There is actually a lot of hidden power behind this concise syntax, so let's dig deeper.

First, you should be asking: Where is `CurrentSettings` class variable coming from? Also, same thing goes to `commit` method?

Aha! Here is where Swift protocol extensions come into play. The common settings functionality is grouped into the protocol extension below:

{% highlight swift %}
public protocol SettingsTable: class {

    static var HostRealm: Realm { get }
    
    func preCommitHook()    // You can validate settings here
    func postCommitHook()   // You can apply more changes here
}

public extension SettingsTable where Self: Object {
    
    // NotificationCenter key for observers
    static var NotificationKey: String {
        return "\(className()).On.Update"
    }
    
    // lazy loaded settings
    public static var CurrentSettings: Self {
        
        if let settings = HostRealm.objects(self).first {
            return settings
        }
        
        let settings = self.init()
        
        try! HostRealm.write {
            HostRealm.add(settings)
        }
        
        return settings
    }
    
    public func commit(changes: ((Self) -> ())? = nil) {
        
        preCommitHook()

        let klass = self.dynamicType
        if let changes = changes {
            
            let realm = klass.HostRealm
            try! realm.write { changes(self) }
        }
        
        postCommitHook()
        
        NSNotificationCenter.defaultCenter()
            .postNotificationName(klass.NotificationKey, object: self)
    }
    
    func preCommitHook() {}
    func postCommitHook() {}
}
{% endhighlight %}

Now if you followed that properly, you'll realize that any new settings table can easily get all these goodies by simply conforming to `SettingsTable` and implementing the `HostRealm` accessor.

{% highlight swift %}
extension LocaleSettingsTable: SettingsTable {
    
    public static var HostRealm: Realm {
        return Localez.SettingsRealm
    }
}
{% endhighlight %}

To wrap up this section about __Simple API__, I'll just say that it was quite important to break my application settings into smaller parts and pieces. This allows Realm tables to evolve independently, therefor giving us granular control over each settings group.

__Performance__

Nothing to be said here about performance, really. We have a single object per table, and about 5 tables total. Everything ran fast enough for me to just ignore benchmarking this.

__Further Work__

To take this a step further, notifications should work across processes. I am not too worried or keen about taking care of that right now, so meh.

### Key Value Store

The second use case for Realm was to be used as a key-value cache for downloads. The key type is `String`, however, the value is a JSON serialized `NSData` blob. Finally, we add an auto-updating `NSDate()` there to maintain the cache timestamp. This use case is also neatly covered by Realm + Swift generics. 

__Realm Table__

If we take a look at the Realm part of this sub-system, it is summed up in a few lines of code:

{% highlight swift %}
class CacheTable: Object {
    
    dynamic var key = ""
    dynamic var timestamp = NSDate()
    dynamic var data = NSData()
    
    override class func primaryKey() -> String? {
        return "key"
    }
}
{% endhighlight %}

__Generic Wrapper__

As for Swift generics, it's pretty lengthy an can't be fully covered in this article. A quick skim, however, is in order. The wrapper is just two classes:

+ __`Task`__<br />
Wraps the cache by providing an ability to instantiate a network task that automatically writes its result to the Realm cache.
+ __`TaskMeta`__<br />
Facilitates the data that describes a `Task`. It is typically a URL which we sync the data from, a notification key which gets fired when the cache data is updated, and finally an expiration interval

Here is an example of how a `Task` is created:

{% highlight swift %}
var meta = TaskMeta(urlString: "\(hostname)/kpt/tweets")!
meta.expirationInterval = 1.hour.timeInterval
meta.notificationKey = On.TweetsUpdate

let task: Task<[AnyObject]> = Task(meta: meta)
task.updateIfNeeded()
{% endhighlight %}

You may notice:
+ `Task<[AnyObject]>`: This decides how the network response is parsed
+ `1.hour.timeInterval`: This is just a convenience time library I use

Performance isn't a big issue here. Since network operations are asynchronous by nature, we simply chain them with an asynchronous background access to the cache. Same thing goes to the deserialization.

### Static Data

My final use case was to ship static data with my apps. I had two different types of static data:

1. Small number of "sounds" shipped with the app __(39 total)__
2. Large number of "prayer times" for all the cities in Kuwait __(26k)__

__Manipulating Static Realm Files__

Dealing with static data was a __huge__ pain, in general, due to the lack of a interpreter interface. Every time I needed to manipulate the data, I had to write full-fledged swift apps to parse and manipulate realm files.

Once you do that, you'll quickly realize it is no fun. Realm files are very rigid, and quickly throw errors when the schema changes, objects are copied between realms, and possibly the most annoying is dropping existing tables (not possible).

I swallowed my pride for a good of two days, and dished out two realm files. The sounds realm file worked to date without any real issues. However, the humongous prayer times file wasn't snappy at all. Performance became a bottleneck.

Thankfully, my data was easy to break down into smaller parts, so that's what I did. Each city's prayer times was moved to a separate realm file, then there was a single realm file with all the cities. Once I did that, a realm file would have 2196 objects, and that brought the performance back up again.

__API__

As for the API, I was easily able to write a nice wrapper around Realm to make the queries really easy and simple. Here is an example of how the `City` objects are queried:

{% highlight swift %}
public extension City {
    
    private static func Results() -> RealmSwift.Results<CityTable> {
        return CitiesRealm.objects(CityTable)
    }
    
    private static func Results(cityId cid: String) -> RealmSwift.Results<CityTable> {
        return Results().filter("id == %@", cid)
    }
    
    public static func Query() -> [City] {
        
        return Results()
            .map { City(city: $0) }
    }

    ...
}
{% endhighlight %}

The main issue here is that I duplicate the `CityTable` class, and create a light-weight `City` struct that is returned to the caller. However, by doing that, I can now essentially switch out my core static data provider anytime I like without worrying about app wide changes. Also, I can control Realm's complexity, since changing these Realm objects is a no-no (it's a read-only realm!).

## Conclusion

Realm is definitely better than any other persistence option, IMO. The only worry is performance. If you need that, you might as well roll out your own in memory map and use that.

Also, Fastlane has finished running a while ago, so time to get back to work!

