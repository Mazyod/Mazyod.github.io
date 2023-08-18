title: Hacking With Jekyll
tags: blog, jekyll, octopress, markdown, python, scripting, ruby, github, pages, post, entry
date: 2015-11-25 18:03:49+00:00

## Introduction

For those of you who are new here, welcome! For the rest of the old time readers, yeah, the blog has been completely redesigned .. From scratch. I hope the new design is a step forward at least, and in this post, I'll be covering the transition experience.

## Where Were We?

The previous blog was built on top of [Octopress](http://octopress.org/) and using a [heavily modified](https://github.com/Mazyod/octoflat) [octoflat theme](https://github.com/alexgaribay/octoflat). That is to try and say ... It was ultra-bloated.

### Octopress

Octopress was amazing .. As long as it was actually working. It had many convenient wrappers around Jekyll, uses Ruby `rake` to do stuff, and wasn't so bad all things considered. The only problem was, it was complicated.

Octopress was using Jekyll plugins to its fullest. Also, I was using it pre-v3.0, so it was tightly integrated with git. That made upgrading octopress an unpleasant chore.

Most annoying crap I dealt with was [compass](http://compass-style.org/). It just didn't work most of the time, hard to configure, and full of bugs. Thankfully, it's removed in most recent octopress releases.

Another pain point was generating the blog from source ... Since I was using lots of plugins, I couldn't make github generate the website for me, so I had to build it locally, then push the result. Generating the blog took about 10 - 15 mins! That was crazy .. I know I have 200+ posts, but still! This was really annoying, especially if I had made some sort of syntax error or want to preview a post.

Finally, the elaborate directory structure and options were overwhelming for my needs, hence it was time to be minimalistic.

### Octoflat

I shouldn't talk about this .. Countless times I get hollered at by [Jim](https://twitter.com/jimmarxd) because something broke, like pagination or image size on Android. Even more annoying was tweaking the design a bit, and watching all hell break loose. It is just a very bloated theme for my simple needs. How not when it includes bootstrap, flat-ui, and a million other styles, all mushed together. The `!important` tags were countless, lol.

All things considered, I really appreciate the author's efforts in open sourcing it. It served me well these past few years.

### Experience

I noticed that the reader feature on iPhone wasn't available, which is a huge missing feature for readers. Another problem was the overall design of the blog. I hadn't thoroughly thought about UX back then, so colors, fonts, layouts were all just a huge letdown.

## Where Are We?

The new blog is so simple, I don't even have to break it down into sections. It's a pure Jekyll powered blog with minimal changes on the default theme. Yup, all I did was tweak the default theme a bit to achieve the current look, without adding a single dependency or framework.

The blog finally generates in just _7 seconds_, compared to the original 15 minutes, I'd say that's a significant win. Also, all I have to do is push the changes to github, and github will build the blog for me! Yatta!

Admittedly, I had to [rewrite all the script I had]({filename}2014-03-16-blogging-with-octopress.md), but that's ok! Now that I have full control over the template created for a new post, I went ahead and created a much more sensible default template for my needs. All it took was a couple of minutes, really. I'll probably blog about the new workflow some day!

Last but not least, now I have the capacity to maybe do A/B testing, see which changes readers like more and so on, since making changes is so easy!

## Conclusion

I am in love with [zsh](http://www.zsh.org/). [Seriously, if you're not on that thing, you're missing out, because this shit is thoroughly good](http://genius.com/2448969)!
