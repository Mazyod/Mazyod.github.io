title: Cocoapods Headers
tags: ios, cocoapods, snippet, tip, xcode, error, header, not, found, link, search, swift
comments: true
date: 2015-02-25 12:48:33+00:00

Since I started to heavily rely on [Cocoapods](http://cocoapods.org/) for my projects, and since I am exclusively using swift for my small projects, I am constantly running into this error, that I keep resolving then forgetting about...

The error is when you try to build your Cocoapods-dependent app, you get an error saying that the header is not found. You don't have to look further than [this stackoverflow question](http://stackoverflow.com/questions/12002905).

The issue is actually that the test target isn't finding the header files, not the main target. So, all you do is make sure that the Pods.xcconfig is applied to both targets. In my case, I just deleted the test target, since I don't do unit tests, yet (bad me).
