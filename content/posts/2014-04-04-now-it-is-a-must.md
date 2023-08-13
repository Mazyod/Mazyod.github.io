title: Now, It is a Must
categories:
- kpt
- ios
- programming
- software
- rant
- apple
- appstore
- library
comments: true
date: 2014-04-04 01:06:48+00:00

I don't even recall if I... Oh, I did blog a bit about what I have been doing, which is the code sharing thing and stuff related to Kuwait Prayer Times. Well, there we go:

![image](/images/kpt_v5.0.0.png)

I finally submitted. Even though I wrote [that blog post about testing]({% post_url 2014-03-28-close-call %}), I did even more testing, and found like a bunch of other bugs, that lead to other bugs in the Mac app, which almost drove me nuts trying to make everything perfect. It just can't be perfect.

In any case, the most important "feature" I added lately, is to properly support migrating all the user preferences from the old version. I usually don't care about that, and require the user to delete the app and reinstall it or something, but not this time, and no more of that in the future.

Hmm... Let's see what else was there... Yeah, if you used the app, and selected an athan sound, the label shows truncated in the settings view. I decided to remedy that, and use the [MarqueeLabel library](https://github.com/cbpowell/MarqueeLabel). It has quite a few problems, but it works with a small hacks here and there.

The most apparent issues that I faced was that the label just completely disappears, the animation stops, and the animation speed plays at half speed, initially. I hacked all but the last issue, which I found to be too mundane to work on.

## Conclusion

Mac KPT update, iOS KPT update pushed to Apple... You just cannot imagine how it feels to free up that task from my plate.
