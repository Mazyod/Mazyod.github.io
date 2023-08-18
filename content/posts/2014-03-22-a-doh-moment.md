title: A DO'H! Moment
tags: snippets, rant, stackOverflow, stack exchange
comments: true
date: 2014-03-22 22:58:10+00:00

Apparently, the main reason [Jeff Atwood](http://blog.codinghorror.com/) started stackOverflow is to trick programmers into writing. This is one of the many secrets he reveals in his book Effective programming [(discussed here)]({filename}2014-03-10-nsproxy-with-uikit.md). He explains how writing is a fundamental communication skill we should work on, and that's why he has his blog and all..

In any case! There is also this very interesting fact that he talks about, which is:

> How do I thank the community, even though they didn't do anything?

The idea here is, __lots__ of people, and just a few minutes ago myself, go on stackOverflow, or any other stack exchange websites honestly, and as soon as they open a new topic and start writing the details of their problem ... BAM! The solution hits them right in the head without warning. This is what is meant by thanking the community :D

So, let me present my problem, which was also solved...

### Objective-C Categories For Code Separation

I am __obsessed__ with Objective-C's categories. I tend to find them the best solution for everything... So, I have this problem where I need my top level singleton object, creatively named `AppManager`, to do various top-level functionality, such as debugging, analytic calls, crash reports, ... etc. But, I don't want to just dump 'em all into this single class/file!

My immediate obsession with categories told the answer was... Categories!! Just write a category for every functionality you need, and viola! Thankfully, I didn't, and decided to consult the community...

While writing the question and thinking about the consequences... Here are the problems:

1. Categories are __not__ meant to be used this way! This will lead other programmers to get confused and think I am crazy.
2. The categories created will not be able to have instance variables.
3. Reusability is __out of the question__. Period.

## Conclusion

Wth was I even thinking... I am just glad that all hit me before typing the third paragraph in the question. The answer is very simple, _composition_. Simply, make this `AppManager` composed of these different components, and __that__ makes sense. Sure, a little more work to pass stuff around, but it's all for the sake of maintainability and resuability, which are not to be taken for granted in today's collaborative world!!





