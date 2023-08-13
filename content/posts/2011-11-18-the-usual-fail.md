title: The Usual FAIL
author: mazyod
categories:
- ios
comments: true
date: 2011-11-18 18:09:04+00:00
slug: the-usual-fail
tags:
- iPhone
- Javascript
- UIKit
- UIWebview
wordpress_id: 40

Obviously enough .. I have failed to be the frequent poster I dreamt of being. (Why is dreamt not a word? Someone please contact the association responsible and force them to add it). Well, I **was** out of the country for more than a week. And I **was** bombarded with 2 projects and 2 midterms that I had to prepare within a week. Fortunate enough for me, I finished the projects and both midterms got postponed :D.

Well, I doubt anyone finds that interesting, so going to something that might actually be useful and interesting. Dama chat!

After clearing the way, I finally got back on track with the Dama chat implementation. It is going on smoothly, and I just bumped into an interesting problem that I thought I would post for permanent remembrance.

Let us first see how much the chatView evolved since the last time we spoke:

[![image](/images/screen-shot-2011-11-18-at-8-48-05-pm2.png)](/images/screen-shot-2011-11-18-at-8-48-05-pm2.png)

*It says (null) as the name because am calling [[GKLocalPlayer localPlayer] alias], and it is returning nil. Why? Because this is currently implemented in the single player mode for testing!*

Looks good enough. Might be improved .. The point, always focus on the point!! So, the cool SMS application-like keyboard and text have been taken from HPGrowingTextView code from GitHub. It is really something. As for the way the text is being appended to the gray webview, here is some code:

```objc
- (void)appendToChatViewName:(NSString*)name dialog:(NSString*)text isLocal:(BOOL)local 
{
    NSString* jsName    = [NSString stringWithFormat:@"'%@:'", name];
    NSString* jsDialog  = [NSString stringWithFormat:@"'%@'", text];
    NSString* jsLocal   = (local? @"1" : @"0");

    //call function called "fun" inside the HTML loaded in the Webview
    //the function simply createsElement("div") and sets the innerHTML, and appends it to document.body
    NSString* jsString  = [NSString stringWithFormat:@"fun(%@, %@, %@);", jsName, jsDialog, jsLocal];
    NSString* string    = [chatView stringByEvaluatingJavaScriptFromString:jsString];

    //move the view to the end to display the recently received message.
    //BRUTE FORCE: 90,000 :P
    string = [chatView stringByEvaluatingJavaScriptFromString:@"scroll(0, 90000)"];
}

```

Now, we can finally talk about the problem that I mention, the one that made me want to post. The above code has a problem, care to guess?

...

Ok, if you guessed that 90000 is too big, then congratulations! You guessed wrong!

The problem is that if the user sends some text including the line break character '\n'. The JS will end up crashing and doing absolutely nothing... Ok, for the solution? Exactly, it's as simple as:

```objc
//remove all \n and replace them with HTML break character.. <br />!!
    jsDialog = [jsDialog stringByReplacingOccurrencesOfString:@"\n" withString:@"<br />"];

```
