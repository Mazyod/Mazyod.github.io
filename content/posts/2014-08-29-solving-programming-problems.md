title: Solving Programming Problems
categories:
- programming
- development
- problem-solving
- graph
- yed
- flow-chart
- state
- machine
- FSM
- design
comments: true
date: 2014-08-29 12:45:00+00:00

At sourcebits, I realized that whenever our technical lead wants to convey an idea to the team, he would always do that through a visual graph. He would quickly put together an FSM diagram, a flowchart, or whatever to materialize his thoughts and make sure we can all clearly see his idea.

I thought that was cool, but didn't quite do it myself because I work on my own project alone. The thing I realize now is that Joe, our tech lead, might've also used charts and graphs to organize his own thoughts and think about the problem, because I started doing that, and it's insanely helpful!

Here is an example of a problem I am trying to solve:

![image](/images/Screenshot_2014-08-29_12.50.02.png)

As you can probably tell, this is the matchmaking process in the game, and using [yEd](http://www.yworks.com/en/products_yed_about.html), I can easily draw this FSM and make sure I account for all situations.

Now, I am stuck at that last state. If the user presses "accept" to the matchmaking, we poll the match status to see if the other user accepts. If the user's device crashes, or the user kills the app, our game won't be able to report that the user is no longer available, so we have to set the match state as `INVALID` after a certain amount of time...

Sounds simple, although it isn't with the constraints I have. I can either have the client disconnect if a certain amount of time passed, but that doesn't concern the client app. It should be as dumb as possible and just poll the match status. If that magically becomes `INVALID` by any other means, then we can close the dialog.

So, this "magical" way of invalidating the match... I can think of two ways of doing this:

One approach is to add a timestamp variable to the session, and each time the user polls the status, we have some logic in the backend checking the timestamp to determine if the match should be invalidated. The problem is that we don't know exactly when the match state has switched from "looking for opponent" to "waiting for confirmation" (aka accept). We have to store the previous state and all that crap.

Another approach is to associate the timestamp with the match object, and check the timestamp from the match itself. This is easy to implement and the logic actually fits. Once we change the match state to `WAITING_CONFIRMATION`, we can set the timestamp then.

## Conclusion

Try drawing diagrams for your problems, it will help you model a solution!!
