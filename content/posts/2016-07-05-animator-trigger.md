title: Animator Trigger
tags: unity
date: 2016-07-05 22:14:01+00:00

Less programming these days, and more animation design. I've been using Unity's animation system to bring the game to life, and it's a pretty solid system, I have to say.

![states-image](/images/states.png)

As with all things Unity, it has gotchas, so this post will cover some of them.

### Triggers

While attempting to animate an object, I ran into a bug where after setting the trigger to "state_2" it would go to "state_2", and back again to "state_1". It was really weird, and I had no clue why...

The first thing that comes to mind is "Exit time". If that property is set on the animation transition, it will automatically leave the current state onto the destination state of that transition... Nope, no exit state was being set.

After fiddling around the code for a while, I found that I was using `SetTrigger` on "state_1" while the object was still in "state_1". Since I didn't allow the transition to animate to itself, the trigger would be set, and later be triggered after we leave the state.

The solution here is either to use `ResetTrigger` to make sure no outstanding triggers remain, or in my case, I simply allowed the animation state to transition to itself. That made the trigger clear after being set twice.

![transition-settings](/images/transition-settings.png)

### Atomic

As much as I tried, I couldn't manipulate a property of a game object that had an animation controller manipulating the same property.. It's annoying, but understandable, I guess...

What I mean is, if you wanted to animate the position and scale of an object, you can either tween them or use Unity's animation system, right? Well, if you choose to use both for any reason, you can't have both systems modify the scale or the position at the same time. You must either let Unity's system animate the scale, and using tweening for the position, or vice versa.

### Discrete

When setting up your animation states in the animation controller, you might want your animations to play discretely (separately) without any blending. Well, the thing is, Unity's default animation settings add a certain amount of blending, depending on today's weather.

The gotcha here is, just make sure to open the transition settings again, and set the transition duration to 0 in order to disable animation blending, and have nice discrete animations.

Obviously, that's not always the case. For my animations, I've actually set the blending to full. So the animation actually happens in the transition rather than the animation state itself (if that makes any sense)

## Conclusion

Unity has really come a long way.. I've tried it a year and two years ago, and it's nothing like it used to be. It has finally matured to the point of actually being usable to a certain degree...

If you haven't looked at Unity for a while, make sure to give it another shot!
