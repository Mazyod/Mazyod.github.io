---
layout: post
title: "Welcome to Realm"
date: 2015-09-09 00:01:28 +0300
comments: true
categories: 
- realm
- ios
- swift
- core-data
- sqlite
- data
- persistence
- rest
- api
- backend
- sync
- json
- parse
- mapping
- mantle
- swiftyJSON
- github
---

Finally .. I've made the move to [Realm](http://realm.io/).

{%img center caption no-invert http://mazyod.com/images/realm-logo.png "" "" %}

## What Happened?

Recently, I've been working an iOS project for some client, and obviously went with Swift for everything. The app is a very typical RESTful consumer, with a relatively simple data model.

For the first phase of the app, I focused on implementing and polishing the UI, and everything was great. Then, the time came .. I had to integrate with the backend.

I sticked to my guns, created a new core data model, and started creating all those various entities. Life was good.

While defining the models, generating `NSManagedObject` subclasses, and integrating the JSON mapping using `MagicalRecord`, things slowly started to break.

The first annoyance was when I got a crash from Swift's unexpectedly unwrapped and found nil thingy. Apparently, generated Swift models don't mark their properties as optional .. Not even implicitly unwrapped. I took a breath, downloaded Xcode 7 and generated the classes there.

Second annoyance was that now, everything was optional! Argh! Who cares, just wrap with some getters or use MVVM or something. Not a big deal ...

Finally, two things happened simultaneously:

+ I was trying to get to-many relationship to work, and `MagicalRecord` failed.
+ Swift compiler crashed ...

{%img center caption no-invert http://mazyod.com/images/justjimmar_2015-Jul-22.jpg "" "" %}

Seriously...

## What now?

My best course of action was to move all the CoreData crap to Objective-C land, where I'm comfortable working with. Thinking of that made my head spin because of all the bridging management I had to do (nullability, generics).

It is a no-brainer. I shall use Realm, and it shall work.

## Zero to One

I hope Peter doesn't sue me on this one.. In any case, time is short, and lots of code to be migrated, so I had to start right away.

#### NSManagedObejct -> Object

Migrating the model classes to realm was a delight thanks to a few search and replace, regex-fu, and `zmv`s. The checklist is:

+ Change `NSManagedObject` superclass to `Object`
+ replace `@NSManaged` with `dynamic`

Inverse relationships were all removed, normal relationships were easily migrated, and the actual properties were assigned default values. Next!

#### NSManagedObjectContext -> Realm

Since I haven't proven that this app needs background data saving and processing, I've been using the main thread for data operations. The app isn't ready to ship yet, as well, so migration hasn't been set up properly yet. I'm glad I haven't invested in those yet, since look. I've completely rewired the data layer!

It was simple to migrate `NSManagedObjectContext` by creating a `Realms.swift` class with:

{% highlight swift %}
import Foundation
import RealmSwift

let MainRealm: Realm = {
   
    let config = Realm.Configuration.defaultConfiguration
    let realm = Realm(configuration: config, error: nil)!
    
    return realm
}()
{% endhighlight %}

I plan to add two more realms here, and setup all the configurations properly, but that's about it.

#### JSON Mapping

Realm had recently published a talk that discusses using `Mantle` as a way to approach JSON serialization... I didn't like that approach at all. As far as I could tell, it involved rewriting the model classes into `Mantle` subclasses, and .. so much duplication is what I was seeing.

Instead, I imported `SwiftyJSON`, and started rolling out my own simple mapper using `convenience init` on Realm `Object` extension. I bumped into a real annoyance here, but it was Swift's issue:

The idea was that each model class would take a json, deserialize, then pass the json to it's superclass, so it could continue building the object. That didn't work.

Apparently, Swift doesn't yet support overriding functions in Extensions (Swift 1.2). I mean, if you define a function in class `A` extension, and override it in class `B` extension, where `B` inherits from `A`, Swift compiler will complain. That annoyance made me break the model hierarchy into a flat hierarchy, where all models inherit from `RealmSwift.Object`.

That's not too bad. The only annoyance is that I had to repeat the primary key declaration across all objects, instead of having a root class with an `id` property and primary key. Once Swift implements this feature, that code can go away!

{% highlight swift %}
import Foundation
import SwiftyJSON


extension ServerResult {

    convenience init?(json: JSON) {
        self.init()
     
        msg = json["msg"].stringValue
        status = json["status"].stringValue
    }
}
{% endhighlight %}


## OK, I Lied

I really hope you are not reading this waiting for the part where I talk about hooking up Realm with your UI, since I didn't do that yet ^^;. I have a rough idea how I will approach this, but it's definitely not as neat as `NSFetchedResultsController`. Dat class is da bomb.

## Conclusion

When the initial setup is just so smooth, and the issues I faced are just a tiny learning curve mixed with a few road-bumps unrelated to Realm, I gotta say my iOS development game is gonna change.

Realm is approaching v1.0 rapidly, with null-support just around the corner. I find it hard to think I'll be switching back to CoreData .. Ever.
