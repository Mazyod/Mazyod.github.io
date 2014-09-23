---
layout: post
title: "The Daily WTF III"
date: 2014-09-14 15:26:59 +0400
comments: true
categories: 
- daily-wtf
- code
- horror
- fail
- programming
---

In today's wtf, we will looking at a very peculiar case.

## The Fail

While going over the code, I noticed a very strange block. The programmer was constructing a JSON payload from available variables and then passing the payload to the visible view controller, like so:

{% highlight objc %}
NSString *vanityURL = params[@"vanity_url"];
NSDictionary *payloadParams = @{@"endpoint" : @"story/profile",
                                @"params" : @{@"vanity_url": vanityURL},
                                @"type" : @"story"};

NSData *jsonData = [NSJSONSerialization dataWithJSONObject:payloadParams
                                                   options:0
                                                     error:nil];

NSString *payload = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];

params = @{@"feedbackPayload" : payload,
           @"user_vanity_url" : vanityURL,
           @"analytics_key": vanityURL,
           @"title": vanityURL};
{% endhighlight %}

I really don't want to get into the details of where these hardcoded strings came from, or why the hell a JSON payload is created in the first place, but there is no limit to how bad code can be, apparently.

**NOTE:** I added newline separations for the reader to be able to read the code. It was actually all smushed together without any spacing.

... One more fun fact, this code lies in the infamously abused AppDelegate class.
