---
layout: post
title: "Testing GAE"
date: 2015-02-08 12:46:10 +0400
comments: true
categories: 
- gae
- google
- app
- engine
- development
- backend
- ndb
- test
- testing
- unit-test
- tdd
- mock
- api
- script
- python
- integration
- system
- pytest
---

## Introduction

Currently, I have stepped back into a game I was developing for a while, and the game is written in [Cocos2d-x](http://cocos2d-x.org/) with a [GAE backend](https://appengine.google.com/) for multiplayer, leaderboards, and profile capabilities.

After coming back to an old project, you tend to forget much of the practices you were doing, and may miss quite a few essential steps when implementing new functionality. Other than that, you may have just made an honest mistake, and BOOM, your backend comes crashing at your feet.

To avoid all that, backend developers write tests. Jumping into backend development myself, I wasn't a big believer in unit test on the client side, but for the backend, it's just essential to have some sort of testing in place.

## Google App Engine Testing

I've gone through [Google's guide to testing your GAE application](https://cloud.google.com/appengine/docs/python/tools/localunittesting), and it is rather complicated and mundane. They show you how to write *local unit tests* for the logic of your application, and completely ignoring the datastore and top level handler testing.

After looking at my usecase, I determined that the best tests I can write are tests that act like a client connecting to the server, and go through all the APIs that the client can reach. This means, the tests will create a dummy client that logs in to the server, attempts to create a game, then plays a match, then checks the leaderboard, ... etc. If all these tests pass, then my backend should be working perfectly.

For testing, I decided to go with [pytest](http://pytest.org/latest/).

## Writing the Tests

Granted the tests aren't by any means fast, nor very well structured, but they work for my current requirements. I will need to structure them better later on.

Here is the general structure:

{%img center caption no-invert http://mazyod.com/images/Screenshot_2015-02-08_12.58.08.png "" "" %}

As you can see, first we test the account management stuff by registering a new user, attempting to login after that, then retrieving and updating the user info .. stuff like that.

Similarly, we do the same thing for testing leaderboards, rooms, and matchmaking. Here is some code for how the test code looks like:

{% highlight python %}
# Let's start by testing and registering a new user
def test_register(self):
    client = Client.Random_Client()
    clients.append(client)

    client.register()
{% endhighlight %}

You might notice there aren't any assert statements? This is because the `Client` class is a class created specifically for these tests, and it already has assert statements for the response code we get from the server. In other cases where we get custom data with the response, we have asserts in the test method:

{% highlight python %}
# Sanity check, is the room we just created found in the room list?
@eventually_consistent
def test_room_list_revisited(self):
    """This time, we get the room list and assert there is at least one room"""

    response, rooms = clients[1].get_room_list()

    assert len(rooms) >= 1
    assert rooms[0]["name"]
{% endhighlight %}

## Pro Tip

If you notice, we have a decorator on one of the tests, which says "eventually consistent". Due to GAE's architecture, the data you write to the datastore may not be immediately available to all the clients. We say, this data is "eventually consistent".

To accommodate this GAE restriction, I created this decorator that I decorate test cases that are eventually consistent. Test cases decorated with eventually consistent attempt the same test again, even if it fails the first time. Here is the Eventually consistent decorator:

{% highlight python %}
eventually_consistent = pytest.mark.flaky(reruns=10)
{% endhighlight %}

The flaky marker has been imported from [here](https://github.com/klrmn/pytest-rerunfailures).

## The Sample

{%img center caption no-invert http://mazyod.com/images/Screenshot_2015-02-08_13.11.47.png "" "" %}

## Conclusion

I hope this was a useful post about testing in google app engine! I will hopefully post a follow up post about how to actually setup and teardown a testing GAE instance that can be used solely for the purpose of these tests. 

I actually have even more things to say, like explain some useful pytest flags, and why I don't terminate my tests automatically when they are done. (HINT: Examine the instance state before it terminates)

Stay tuned!

**Update**

[Here you go! the follow up, as promised](http://mazyod.com/blog/2015/02/10/gae-follow-up/).
