title: How to Compose
categories:
- composition
- design
- code
- implementation
- architecture
- aspect
- modular
- programming
comments: true
date: 2014-09-04 15:39:15+00:00

In a previous post, I talked about [the beauty of composition]({% post_url 2014-09-03-the-beauty-of-composition %}). Today, I want to extend on that with a beautiful enlightenment that I had. Lucky you, I am gonna share it, and you are reading it!

## Breaking It Down

It is all about breaking those methods calls down!

Let's assume you are building an application that authenticates with different services, like twitter, facebook, google, ... etc. If you have this in your code, you're doing it wrong (I used python because it's easier to write):

```python
class AuthManager(Object):
    def authenticateWithTwitter(self):
        ...

    def logoutFromTwitter(self):
        ...

    def authenticateWithFacebook(self):
        ...

    def logoutFromFacebook(self):
        ...

authManager = AuthManager()
if user.selection() == 'Twitter':
    authManager.authenticateWithTwitter()

elif user.selection() == 'Facebook':
    authManager.authenticateWithFacebook()
```

Now, notice how you can achieve a much more modular design with even better readability:

```python
class AuthManager(Object):
    
    def __init__(self):
        self.twitter = TwitterService()
        self.facebook = FacebookService()

authManager = AuthManager()
authService = None
if user.selection() == 'Twitter':
    authService = authManager.twitter

elif user.selection() == 'Facebook':
    authService = authManager.facebook

authService.authenticate()
```

I know, I could've used `getattr`, but that's not the point. The point is how we managed to break the long method name into a nicely composited object!! This is actually the obvious example, let's see a bit more challenging one:

```python
class Person(Object):
    
    def __init__(self):
        self.name = "Kirito"
        self.DOB = datetime.now() # whatever

    @property
    def age(self):
        """Compute age from DOB"""
        return ...

    def getLocalizedAge(self):
        """Return a localization friendly age"""
        return LocalizationManager.instance().localizeNumber(self.age)

    def getLocalizedDOB(self):
        """Return a localization friendly date"""
        return LocalizaitonManager.instance().localizedDate(self.DOB)
```

You can see it now, can't you ;) **YES!!** This is bad, and should be changed to:

```python
class Person(Object):
    
    def __init__(self):
        self.name = "Kirito"
        self.DOB = datetime.now() # whatever
        self.localized = PersonLocalizer()

    @property
    def age(self):
        """Compute age from DOB"""
        return ...

person = Person()
person.localized.DOB()
```

## Conclusion

I don't think I will ever write anything in the blog of more value than this post... I desperately needed this advice ages ago.
