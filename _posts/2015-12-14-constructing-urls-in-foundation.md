---
layout: post
title: Constructing URLs in Foundation
date: 2015-12-14 19:23:26-0500
categories:
- Foundation
- NSURL
- query
- path
- escape
- hardcode
- clean
- snippet
- tutorial
- ios
- osx
- swift
---

## Introduction

While building [Appz][appz-repo], we had to deal with a lot of URLs; constructing URLs for both opening other apps as well as websites.

Once [the first Kitz contributor][holyalgorithm-pr] started submitting pull requests, it was apparent that it was error prone for developers to add support for other apps. The API was expecting a fully constructed URL string, so it was the responsibility of the app URL definitions to perform the escaping and full URL construction, which didn't make sense. That is too much burden for all the App definitions collectively.

Instead .... Actually, it's about time we transitioned into the blog post!

## EZ URL Definitions

So, the API was rewritten to make the definitions easier to write and maintain. For that, a `Path` class was introduced. It simply gives a very convenient way to define a url path by assigning a list of path components as well as query parameters, without worrying how they will be encoded in the end.

{% highlight swift %}
struct Path {

    var pathComponents = [String]()
    var queryParameters = [String:String]()
}
{% endhighlight %}

Honestly, the `Path` class is a bit redundant to something that `NSURL` or `NSURLComponents` should already do, but they require lots of boilerplate code to get right, so we opted-in for a custom class.

## EZ URL Encoding

So, now we have the path definition, but how do we actually encode it to a URL? I stumbled upon a bunch of answers on stackoverflow, but almost all of them had annoying drawbacks ... Until I came across `NSURLQueryItem`.

First, let's take a look at the classes Foundation offers for dealing with URLs:

+ `NSURL`: Base class for representing a URL
+ `NSURLComponents`: Factory class for assembling URLs (iOS 7+)
+ `NSURLQueryItem`: a name/value pair for a URL query (iOS 8+)

### NSURL

I'd assume anyone who spent a few weeks writing Foundation based application will have definitely come across `NSURL`. It is used in the `NSFileManager` and `NSBundle` APIs for dealing with filepaths, `NSURLSession` for web resources, and many other use cases.

The biggest caveat about `NSURL` that developers miss is its immutability. It has a very shallow API for constructing and changing the underlying URL, and when it does, it would return a new `NSURL` instance. The most famous method that fits this criteria is `URLByAppendingPathComponent:`, which returns a new `NSURL?` after attempting to append the passed value as a path. Not very helpful, as we well see later.

### NSURLComponents

As mentioned, this class acts as a factory for `NSURL` instances. You can initialize an instance of `NSURLComponents`, then start customizing how the resulting `NSURL` instances will be. Let's see an example:

{% highlight swift %}
let comps = NSURLComponents()
comps.scheme = "https"
comps.host = "github.com"
comps.path = "/SwiftKitz/Appz"
comps.queryItems = [NSURLQueryItem(name: "example", value: "1")]
comps.URL // https://github.com/SwiftKitz/Appz?example=1
{% endhighlight %}

The beauty of the example above is the absolute lack of special characters, like colons `:`, question marks `?`, equal sign `=`, and ampersands `&`. That is all taken care of for us by this lovely class.

### NSURLQueryItem

You should haven't gotten the gist of this class from the example above. It is a very basic class that represents a name/value pair in a URL query. The cool part about this class is that it takes care of encoding all special characters that might appear in the query parameters. Hence, you should use it!

## Conclusion

It is very important for developers, especially seasoned ones, to continuously research for better ways to tasks they are used to performing, like constructing an `NSURL` instance. New, better APIs might be available, and leveraging them might resolve hidden bugs in your code, and probably help speed your development process further.

[appz-repo]: https://github.com/SwiftKitz/Appz
[holyalgorithm-pr]: https://github.com/SwiftKitz/Appz/pull/6
