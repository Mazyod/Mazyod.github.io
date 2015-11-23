---
layout: post
title: "Twitter API Issue"
date: 2014-03-23 23:52:51 +0400
comments: true
categories: 
- twitter
- snippets
- api
- error
- json
- response
---

It seems twitter's API has a serious problem handling errors related to retweets... When you try and favorite an already favorited tweet through the API, it returns a proper error with a proper, identifiable code that tells you what's wrong:

{% highlight json %}
{
    code = 139;
    errors = "You have already favorited this status.";
}

{% endhighlight %}

From the above, the error message is precise, and the code helps you avoid showing the user an error, and fail silently by marking the tweet as favorited in the UI.

When you try to do the same thing for retweets, i.e. retweet a retweeted tweet, you get:

{% highlight json %}
{
    errors = "sharing is not permissible for this status (Share validations failed)";
}

{% endhighlight %}

Yeah, thanks. That was not helpful. At all.

## Conclusion

Testing an application is where 90% of the freaking effort goes. Not only are you testing each and every case, uncovering bugs, solving issues that originate elsewhere, but you also have to test the _whole_ app over again whenever you make the slightest change to the code base... Or else, you just might push something very unpresentable to your users.
