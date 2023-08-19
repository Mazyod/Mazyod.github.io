title: Kitz is Live!
tags: opensource, github, code, swift, programming, library, kit, framework, cocoapods, carthage, tests, easy, simple, modular, ios, osx, tvos, watchos, travis, ci, developer, apple
date: 2015-12-19 20:11:44+00:00

## Kitz Debut

I am officially announcing the simultaneous release of __four__ [Kitz][kitz-link]. Well, [Kitz][kitz-link] is the name of the project, and it is a collection of quality Swift libraries. Four of those libraries have been released today! In celebration of this prosperous release, I propose [a toast][toast-link]! (Make sure you come back and not enter the youtube paradox)

These libraries were suppose to be a quick release of components that I wrote for an app, however, nothing is ever quick. It became apparent that the libraries had a very rigid API that fit that app, and that app alone. I abandoned the idea for a while since...

It came back to me after starting the next app, and needing those libraries badly. Now, with two different apps that need to use these libraries, I was able to generalize the APIs and make the libraries a lot more flexible .. That took time, along with all the tests and documentation. About 1.5 months worth of time.

Thanks to encouraging contributions and feedback from various developers, I started to see potential in these libraries if done well. I guess I tried to invest just enough effort as to not make it suck, while still not putting in too much effort as to not regret it if it fails..

## The Goodies

I'll go over the most important points that makes [Kitz][kitz-link] super awesome.

### Self-Contained

Each library is self-contained, with minimal dependencies. The only dependencies allowed are Apple frameworks, since let's face it, they are still needed instead of reinventing everything.

### Minimalistic

Each library is also so small and tries to do one thing, and one thing only, right. You will notice that the libraries don't need extensive documentation. The constraint here is to actually limit the documentation to a single page, the README file. 

### Real-World Requirements

All these libraries came from real-world apps pushed to production. They are not contrived nor built for the sake of using every single feature in Swift. They are genuinely built to make the life of the everyday Swift developer easier.

### Testing

Every library is full tested, in production, as well as through the extensive unit tests. Unit tests are an extremely important part of these libraries, since we would like to evolve them as fast as possible without worrying too much about regression.

### Continuous Integration

Last, but not least, [continuous integration, brought to you by Travis][travis-kitz]. This step is crucial to embrace the opensource community and their contribution. Without CI, it would be a tedious chore to manage contributions.

## Conclusion

Give these libraries a try, open issues, submit PRs, I'll even add you to the organization if you like. It's meant to be a collaborative effort in a fun environment. Also, star, share and spread the ❤️.

[kitz-link]: http://kitz.io
[toast-link]: https://www.youtube.com/watch?v=MwDhUt5ewKk
[travis-kitz]: https://travis-ci.org/SwiftKitz
