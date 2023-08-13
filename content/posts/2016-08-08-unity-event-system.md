title: Doing Yoga with C#
categories:
- csharp
date: 2016-08-08 16:17:02+00:00

## Introduction

Throughout my game development journey with Unity + C#, I have found the C# language extremely flexible and versatile. By utilizing the right techniques, one could eliminate lots of boiler plate and achieve remarkable expressiveness.

I talk about expressive code a lot in my posts, but if you need a refresher, expressive code is simply doing more stuff with less code. I would like to shed some light on two use cases today, both of which utilize generics to achieve their expressive nature.

## Event System

An event system, observer patter, publish-subscribe .. etc, is a very basic design that is mostly needed in any type of software system. It helps you achieve decoupling between an event publisher and its subscribers.

So, we want to have a nice event system that satisfies the following conditions:

+ Statically typed
+ Clear usage
+ Easy to define new events

Since C# has the `event` data type, which allows you to define events and start utilizing the observer pattern, let's evaluate that first:

```csharp
public delegate void EventCallback();
public static event EventCallback OnAccountLogin;

// publish
if (OnAccountLogin != null) {
    OnAccountLogin();
}
// subscribe
AccountManager.OnAccountLogin += AttemptToConnect;
```

This is a bit redundant. We have to define the `delegate`, check for `null` if we want to trigger the event, and the line isn't very clear between who is the publisher, and who is the subscriber. Both perform a call on the event itself, after all..

The developer working with me took a slightly simpler approach using the `Action` class:

```csharp
public static Action<float> OnTurnTimeUpdated;

public static void TurnTimeUpdated(float time) {
    if (OnTurnTimeUpdated != null) {
        OnTurnTimeUpdated(time);
    }
}

// publish 
UIEvents.TurnTimeUpdated(dt);
// subscribe
UIEvents.onTurnTimeUpdated += TurnTimeUpdateHandler
```

It gets super annoying after defining a few events, rewriting that null check and extra method each and every single time...

This also has a horrible side effect .. Multiple times, the game crashed because someone was triggering the `Action` object directly, instead of going through the method!

```csharp
// instead of doing this...
UIEvents.TurnTimeUpdated(dt);
// they did this...
UIEvents.onTurnTimeUpdated();
```

The code above illustrates two valid ways to trigger the event, however, the second approach crashes the game if there aren't any handlers, since it's missing a `null` check. This made me seek C# for some yoga lessons and introduce some versatile construct that can solve this issue.

## Enter DKEvent

I called the class `DKEvent`, and this is how you can use it:

```csharp
public static DKEvent OnAuthStarted = new DKEvent();
// publish
UIEvents.OnAuthStarted.Trigger();
// subscribe
UIEvents.OnAuthStarted.action += AuthHandler;
```

Finally! No `null` checks, very clear distinction between publishing and subscribing, and best of all, it's a single line of code to define new events! How can we achieve this beauty?

Simple enough, by using generics!

```csharp
public class DKEvent {

    public Action action;

    public void Trigger() {
        if (action != null) {
            action();
        }
    }
}

public class DKEvent<D0> {

    public Action<D0> action;

    public void Trigger(D0 d0) {
        if (action != null) {
            action(d0);
        }
    }
}

...
```

Things to note about the code above:

1. You can redefine the same class name, but with different number of generic arguments, as many times as you like.
2. We have finally encapsulated the `null` check, and we simply define new events using the code we saw earlier.

## Stored Properties

Jumping directly to the second use case, which is stored properties. Imagine you have a class that has properties which need to persisted to disk. Typically, writing such property requires lots of boilerplate code:

```csharp
public GameParameters parameters {
    get {
        return PersistenceManager.Instance.GetValue<GameParameters>(GameParameters.PersistenceKey, GameParameters.DefaultParamters);
    }
    set {
        PersistenceManager.Instance.Set(GameParameters.PersistenceKey, value);
    }
}
```

The above code assumes you have a nice generic persistence manager class which you can easily call to store and retrieve properties as needed. This code isn't too bad, but we can do better.

Using the same approach demonstrated earlier, we can replace the code above with:

```csharp
public StoredProperty<GameParameters> parameters = new StoredProperty<GameParameters>(
    GameParameters.PersistenceKey, 
    GameParameters.DefaultParamters
);
```

The code may look ugly, but it's just a one liner. With a single line, we can define a new stored property, without the need to rewrite the calls to the persistence manager and whatnot. In order to use the new code, however, we have to use the designated accessors:

```csharp
parameters.Set(newValue);
var params = parameters.Get();
```

This is because of the way `StoredProperty` is implemented:

```csharp
public struct StoredProperty<T> where T: struct {

    private string key;
    private T defaultValue;


    public StoredProperty(string key, T defaultValue) {

        this.defaultValue = defaultValue;
        this.key = key;
    }

    public T Get() {
        return G.App.persistence.GetValue<T>(key, defaultValue);
    }

    public void Set(T val) { 
        G.App.persistence.Set(key, val); 
    }
}
```

## Conclusion

The only reason I know so much about generics is because I've played around it a lot with Swift. In swift, you can achieve a hell lot more than what was presented here, thanks to protocol extensions and type inference.

This feels like a rushed post :( .. it probably is... I just really didn't want one whole month to pass without posting anything!!
