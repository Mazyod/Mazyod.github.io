---
layout: post
title: "Regex Disaster"
date: 2014-05-22 14:15:12 +0400
comments: true
categories: 
- regex
- python
- scripting
- snippets
- pycharm
- search
- replace
- re
- sub
---

It was such a painful lesson, almost as painful as my previous bash lesson, only mildly less awful.

Le me once wanted to write pretty bash code:

{% highlight bash %}
~$ var=5    # Ugly!
~$ var = 5  # better...

{% endhighlight %}

... Only to realize that the second line is an error. The script I was modifying was not through interactive shell, so I had no idea what is was throwing errors... Till this day, whitespace haunts me in my sleep.

As for the regex part, it was this:

{% highlight python %}
regex = r"(?:.*\n.*){0, 3}"

{% endhighlight %}

This looks like a perfectly healthy regex expression, **except that it is not**. Adding that extra space within the braces made the whole thing break and produced unpredictable results. Don't do that.
