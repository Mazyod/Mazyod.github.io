---
layout: post
title: "Migrating to App Groups"
date: 2015-01-03 15:57:38 +0400
comments: true
categories: 
- ios
- xcode
- widget
- app
- groups
- extensions
- defaults
- migration
- backward
- compatibility
- data
- nsuserdefaults
- persistence
- share
- settings
---

## Quick Follow Up

This is a quick follow up to the [previous post regarding app groups](http://mazyod.com/blog/2015/01/03/app-groups/). After verifying how it works, I went ahead and looked at how I can migrate my current settings from the standard defaults to the app group container. Here is how it went down...

First, I over-complicated things, as usual. I thought I could use a cascading similar to the one we saw in [the UIFont post](http://mazyod.com/blog/2014/12/19/ios-feast/). Basically, I would have to wrap the `NSUserDefault` with a subclass, and on every access to the defaults, I would check if that key is migrated or not, then migrate it from the standard defaults if it isn't.

Something like:

{% highlight swift %}
var object: AnyObject? = objectForKey(defaultKey)
if object == nil {
    object = NSUserDefaults.standardUserDefaults().objectForKey(defaultName)
    setObject(object, forKey: defaultName)
}
return object
{% endhighlight %}

Then, I found an interesting method on `NSUserDefaults`, namely `addSuiteNamed:`. It seems that I can somehow compose the two defaults without worrying much about where the setting was actually read from.

Ultimately, I realized that this "lazy loading" approach is a really bad idea, since I can't guarantee that the settings have been all migrated! I need them migrated ASAP, so the widget can make use of it.

## Solution

The final solution was extremely simple, and I should've seen it coming. All we do is copy all the settings from the old defaults to the new container (pardon the ugly ObjC):

{% highlight objc %}
static NSString *const didMigrateToAppGroups = @"MCEngineSettingsMigrateToAppGroups";

if (![[NSUserDefaults MCDefaults] boolForKey:didMigrateToAppGroups])
{
    NSDictionary *oldDefaults = [[NSUserDefaults standardUserDefaults] dictionaryRepresentation];
    
    // Massive kudos to Sean for pointing this out
    for (id key in oldDefaults.allKeys)
    {
        [[NSUserDefaults MCDefaults] setObject:oldDefaults[key] forKey:key];
    }    

    [[NSUserDefaults MCDefaults] setBool:YES forKey:didMigrateToAppGroups];
    [[NSUserDefaults MCDefaults] synchronize];
}
{% endhighlight %}

**NOTE:** `MCDefaults`, as presented in the previous post, is just a convenience method that returns the user defaults associated with the app group identifier.

