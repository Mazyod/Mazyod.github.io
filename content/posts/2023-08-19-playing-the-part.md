---
title: Playing the Part
category: rant
date: 2023-08-19T12:55:23Z
---

## Introduction

Boy, has it been ages since I last wrote a post. I can hardly recall my style,
even, however that's not really an issue as we'll see.

## Out With the Old

As you may (or may not) have noticed, the blog is finally migrated to a sensible
static site generator, namely [Pelican][pelican-homepage]. I've been using
Jekyll for over a decade! Albeit a decade of frustration, unfortunately.

Look, I am not one to complain, especially when it comes to open source
software. As an open source contributor myself, I know how hard it is to
maintain a project, let alone a popular one. However, at the end of the day, you
have to be entitled to your own opinion, and sharing that opinion will help
others navigate the open source landscape better.

So, what's wrong with Jekyll?

### The Downsides

First and foremost, Ruby.

I've played around with Ruby in the past, and my experience was generally pretty
pleasant. I'm a big fan of Elixir, for that matter, and its syntax is heavily
inspired by Ruby. Heck, half of the Elixir core developers are recovering
Rubyists. Not only that, but I've also used Ruby with respect to iOS development
with projects like Cocoapods and Fastlane.

Alas, I've **never** really truly understood Ruby tooling. There is the rake
thing, then there is the Gem thing, and then there is the Bundler thing. Every
single time I came back to my blog in a new environment, I had to struggle with
these tools. I mean, don't get me wrong, I don't mind playing with a new
language for fun. I've written small projects with Go and Rust, but the tooling
they provide is phenomenal.

Next up, Jekyll itself (obviously).

As far as I can tell, ever since Github adopted (acquired?) Jekyll, development
of the framework slowed down tremendously. For a static site generator, keeping
with the times is crucial, to say the least. Even if the framework wants to be
minimalistic, constant refactoring and simplification for reduced complexity and
easier onboarding is paramount. I mean, Jekyll was so unapproachable to many in
the past, to the point that it lead to the development of
[Octopress][octopress-homepage]. _(Granted, Jekyll eventually got a bit better
over time and the need for Octopress greatly diminished after that)_.

Other issues I had with Jekyll were mostly inconveniences rather than
deal-breakers, however, you know how a thousand paper cuts _can_ kill you. These
range from the performance of Jekyll itself, to the insane number of
dependencies, some of which are just a pain to fetch/build (I'm looking at you,
nokogiri), and the lack of in-depth documentation. _(Just to make sure, I opened
the Jekyll website to see if it was improved, and sure enough, it's the same
website from a decade ago!)_

## In With the New

Enter [Hugo][hugo-homepage]!

Yes, you heard that right, I migrated to Hugo. The dazzling hotness of Go, in
combination with the clean website/docs of the framework, made me jump in head
over heels. And let me tell you, it was super exciting! At first anyway.

Migrating to Hugo was generally a pleasant experience. They had importers that
support importing a site from Jekyll, so that took a huge burden off my plate.
Next, I was just astonished by the performance. The whole site was being fully
generated in mere _milliseconds_ every time I made a change. I was in love...
Until.

Sadly, the honeymoon phase was over within mere days. I don't even recall
exactly what went wrong, to be honest. It was just too hard for me to work with,
constantly looking up documentation, spending time trying to figure out what are
the supported functions in the template engine, and so on... For example, in
order to format the date object, I was searching for the date specifiers for Go,
and to my astonishment, [they use an **actual** date for
formatting][go-date-format].

This gave me an immediate lightbulb moment. What if I used a static site
generator built with a language that I know and love?

## In With the Newer

Enter [Pelican][pelican-homepage]!

I have to say, when I was first exploring Pelican, I was extremely hesitant to
throw away the efforts I spent on the Hugo blog migration. Pelican uses
reStructured text as the default format, which rubbed me the wrong way as a
first impression...

**Start tangent**

Speaking of rubbed the wrong way, it is actually the exact same feeling when I
first learned about [pyproject.toml][pep-518]. I've been using Python for years,
and all of a sudden, there is this new markup language I've never used before,
[with a rather silly name, too][toml-abbreviation], and I'm suppose to adopt it
to manage my dependencies and project? The inner resistance was very high at
first, but as is always the case, I had trust in the seasoned developers of the
PSF, and decided to lower my guard and approach it with an open-mind. Few years
later, this is perhaps the cleanest, flat-structure markup language I've worked
with.

**End tangent**

Pelican also didn't use [frontmatter][frontmatter-spec], like Jekyll and Hugo.
Finally, I was having trouble with the bare-bones, minimalistic core that
Pelican aims to be. It felt like I'll be spending most of my time hunting for
plugins to make my workflow work. Thankfully, I was wrong.

## Great Artists

After getting past the initial learning curve of Pelican, which mostly consisted
of figuring out the structure and settings (like what are themes, how are static
files added, what is the best configuration for development vs. publishing,
...etc), I realized that I could just search Github for other Pelican-ians (?)
to see what their set up looked like and if I can, ehm, "borrow" some of their
knowledge. Surely enough, found the indispensible
[pymdown-extensions][pymdownext-homepage]. Basically, pymdown-extensions is to
Python markdown project, as oh-my-zsh is to the Zsh project.

Armed with these fantastic extensions, the migration progress pace started to
pick up. I spent _way_ more time than I should polishing the code blocks, and
trying out different themes and styles for that matter. Code blocks have been an
obsession that I haven't been able to crack before. I've tried to embed Github
gists, different highlight frameworks, both in Javascript and pre-rendered, but
was never really satisfied by the outcome. That is, until now.

## Closing the Loop

Remember that remark in the introduction? About how not remembering my style is
not really an issue? Well that's because of the following...

At the beginning of the migration, I was going to import all the Sass and HTML
templates setup from the old site. I wanted to finish this migration as fast as
possible, but quickly realized a few main points:

1. There was **A LOT** of unused crap laying around that I never really bothered
   to clean up in the past. Most of it was because of using a Jekyll theme as a
   base, and then heavily modified it to the point that I was probably using
   only 10% of the original theme.
2. I may not look like it, but I am a web developer now. Indeed, in the past 3
   years, I've engrossed myself in web development and I've become much more
   familiar with aspects of web development than before. I could easily see the
   many issues that existed, and how to quickly fix them.
3. Many of the assumptions I had around the structure of the blog and layout
   were simply wrong, and I was gonna port all that to this new, fresh beginning
   without a second thought. Alternatively, I could take it piece by piece and
   evaluate what stays and what goes.

Hence, I shall not simply keep carrying the baggage of the past for the mere
legacy of it. It shall be re-evaluated and, if needed, improved upon ... for a
better future(?).

## Conclusion

I'm wondering, as I always do, is this post a one-off, or is it a proper reboot
of this forgotten blog? It pains me to see the missing years in the home index,
as well as the existence of just a handful of posts in some years... But this
pain is but a motivator ... for a better future. (Maybe I should try openai
whisper to blog with just voice. That will be interesting.)

[pelican-homepage]: https://getpelican.com
[octopress-homepage]: http://octopress.org
[hugo-homepage]: https://gohugo.io
[go-date-format]: https://gosamples.dev/date-time-format-cheatsheet/
[pep-518]: https://peps.python.org/pep-0518/
[toml-abbreviation]: https://en.wikipedia.org/wiki/TOML
[frontmatter-spec]: https://frontmatter.codes/docs/markdown
[pymdownext-homepage]: https://facelessuser.github.io/pymdown-extensions/
