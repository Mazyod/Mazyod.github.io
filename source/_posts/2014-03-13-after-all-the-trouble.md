---
layout: post
title: "After All That Trouble..."
date: 2014-03-13 17:15:55 +0400
comments: true
categories: 
- snippets
- python
- programming
- scripting
- subprocess
---


I made a change today to my DNS settings for `mazyod.com`, and whenever I run:

{% highlight bash %}
$ dig mazyod.com

{% endhighlight %}

I am seeing the old IP address!! I got sick of waiting and trying every now and then, so I open terminal and script it:
{% highlight python %}
>>> import time
>>> import subprocess as sp
>>> 
>>> time.sleep(1)
>>> while 1:
...     time.sleep(10)
...     IP = '184.168.221.12'
...     process = sp.Popen(['dig', 'mazyod.com'], stdout=sp.PIPE)
...     output, something = process.communicate()
...     
...     if IP not in output:
...         print 'YAAAY'
...         break
...     else:
...         print 'no.. '+output
... 

{% endhighlight %}

I **literally** go to the bathroom, and come back to find the output:

{% highlight text %}
YAAAY

{% endhighlight %}

... Took exactly 3 tries before the DNS updated. That's 3 tries multiplied by 10 second intervals between them tries... 

