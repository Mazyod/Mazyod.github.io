title: Cocos2d-x With a RESTful Backend
categories:
- rant
- dev-diary
- c++
- game-development
- snippets
- http
- restful
- backend
comments: true
date: 2014-04-07 23:09:51+00:00

For the upcoming game, I want to build a very simple, yet scalable, convenient backend service that can easily be reused across multiple platforms.

After researching and checking, it seemed that all the game server solutions that provide TCP/UDP streaming and whatnot are extremely overrated for simplistic games that one developer like me could ever hope to make. Hence, I shut that door firmly, and moved on. (I am looking at you, SmartFoxServer).

After researching even more, it was as clear as day that RESTful service are dominating the backend development world. Not only are they super popular, and usually supported by any client app development tool, but it is also ... awesome.

There are already attempts to make RESTful APIs for streaming, and that's what twitter recently implemented. This changes everything, and makes a RESTful backend my target for the upcoming, and hopefully all future games.

### Doing it in Cocos2d-x

In cocos2d-x, I wrote a very simple wrapper around the `HttpClient` class that defined my RESTful API:

```cpp
namespace KDAPI
{
    /* API callbacks */
    
    typedef std::function<void(std::string error)> RegisterCallback;

    typedef std::function<void(std::string error)> LoginCallback;
    typedef std::function<void(std::string error)> LogoutCallback;

    ...
    
    /* API requests */
    
    void Register(const std::string& username, const std::string& password, RegisterCallback& callback);
    
    void Login(const std::string& username, const std::string& password, RegisterCallback& callback);
    void Logout(const std::string& username, RegisterCallback& callback);

    ...
}

```

The callbacks are in the form of C++11 lambda functions, and the API calls are simply C++ functions, not even included in a class or nothin.

So... Now, I need to make this work.

## Conclusion

Only fools will tend to conceal knowledge!! I will try my best to write all my silly findings here, just in case someone finds it useful, for some reason.
