title: Unity So Far
tags: unity, unity3d, review, gotchas, transition, animation, state, FSM, any-state
comments: true
date: 2014-04-23 21:41:29+00:00

If I had a choice, I'd go back to cocos in a blink of an eye. It's is so unfortunate that the conditions of out team forces us to use Unity (it is mainly artists and designers), as well as the fact that, well... The freakin game is in 3D! So, Unity is the only feasible solution for our needs...

## Animation States

I ran into this weird and super annoying issue in my very first Unity game, which is dead simple! Actually, make that two weird issues.

### The Any State

When setting up an animation in Unity, there is a convenient "Any State" block that allows you to transition to a state from any other state. The obvious need for this is the death animation state, which can occur at any given time.

Believe it or not, when you set a condition to move to transition from the "Any State", it also includes the state you just transitioned to!!

"What do you mean?"

Adding a transition to the "death" state from "Any State" using a condition like "if isDead is true", will cause the animator to transition from whatever state to the death state, and then transition from the death state to itself as long as the `isDead` is still evaluating to true!! `ლ(ಠ益ಠლ)`

### Atomicity

Animation transitions created are atomic by default, i.e. they cannot be interrupted. So, when you have a player banging on the keyboard, and you are using the "Any State" explained above, you have a serious problem.

Since the "Any State approach" requires you to reset the condition after transitioning, what I did was simply:

```csharp
void Update()
{
    // update animator (Stupid transition from any state includes current state -_-")
    int heading = CalculateHeading(horizontalInput, verticalInput);

    if (heading != previousHeading)
    {
        anim.SetInteger("direction", heading);
        previousHeading = heading;
    }
    else
    {
        anim.SetInteger("direction", -heading);
    }
}

```

Looks good to me. Set the integer, and on next update clear it, and so on... Not so fast there, buddy. Remember that talk about atomicity? Well, even if you freakin turn it off, the transition still cannot be interrupted `>__<`. That is to say, if you do "transition to x, transition to y, stop" fast enough, the transition to y will never happen!

I really don't want to explain this again, please see my [stackOverflow question](http://stackoverflow.com/questions/23237292/unity3d-when-are-transition-conditions-evaluated)...

## Conclusion

Don't sweat it... As long as Unity enables you to achieve your goal, endure it like a women would endure a delivery to see the smile of her child... Saying that felt so weird.
