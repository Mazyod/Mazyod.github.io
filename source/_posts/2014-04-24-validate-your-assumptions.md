---
layout: post
title: "Validate Your Assumptions"
date: 2014-04-24 11:11:20 +0400
comments: true
categories: 
- rant
- development
- testing
- workflow
- programming
- iOS
---

When working with a scripting language like python, it is so awesome how easily you can test your assumptions or experiment with module. You simply launch terminal, go into python's interactive interpreter and you test to your heart's content.

What about iOS apps?

As far as my Google ship sailed, I couldn't find anything solid. People always recommended starting a new project in Xcode and doing stuff there.

Well, what I came here to say is, I will probably use this approach as my second debugging step. The first debugging step is simply using the interactive console to dump the variables and see if anything looks awkward.

It may seem like an overkill to create a new project and build the setup to test something, but in most cases it's probably not. The freedom to focus on a single component in the project rids you of having to worry about other code affecting the component's behavior. It also gives you the perfect environment to further explore and learn more about the component, by iterating quickly with the fresh project.

## Conclusion

This was probably a useless rant for the sake of writing a blog post today, and not falling behind.
