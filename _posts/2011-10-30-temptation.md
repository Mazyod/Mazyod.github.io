---
author: mazyod
comments: true
date: 2011-10-30 19:53:29+00:00
layout: post
slug: temptation
title: Temptation!
wordpress_id: 21
categories:
- rant
---

So, the title says it all!! Actually, it is rather awkward and misleading ...

It's just that I wanted to write this post somewhere, which lead me to actually start posting on my WP blog (I've had it for a while now .. It was suppose to be an interface between ArabianDevs and the public).

Wiz out furzer a-do ...

I got a tweet earlier today requesting the chat feature in the [Dama](http://itunes.apple.com/us/app/id442570707?ls=1&mt=8) game, and for some reason, I decided it is time to take this request seriously!! I mean, I did some of it before (graphics and some UITableView to display the chat dialogs), but this time, it gotta finish!! .. That's it for the introduction.

So ... I opened the code from**_ long ago_**, and saw that I had implemented the the text chatting dialogs as follows:

* A subclassed UIView that has been tweaked to have rounded edges and a special pointed edge to imitate the speech bubble thing.

* Inside it was the dreaded UITableView, which has its own UITableViewController.

* Moreover, as if that was not enough, came the custom UITableViewCell, which has a customized UIWebView embedded to allow special CSS formatting.


The Result:

[![image](/images/screen-shot-2011-10-30-at-10-30-25-pm2.png)](/images/screen-shot-2011-10-30-at-10-30-25-pm2.png)[
](/images/screen-shot-2011-10-30-at-10-30-25-pm1.png)


(The reason it says "Mazyod" and "JiMMaR" is that I was transferring the feed directly from MSN to this program ... Not really, that would be awesome, though.)


**Back to the point:**


Remember above, when I said **long ago**? How long ago is long ago? Well, it's long ago enough to be before I started CpE402 course, Internet Programming course with Dr. Khalid Alzamil. In that course, we explored HTML, CSS, Javascript, DOM and AJAX. It was my first exposure to many of these new languages/technologies. Thus, I was amazed of their power, as I bet many of you did when they tapped their untapped potential.




Where is this leading? It's leading to awesomeness... No, really. After seeing what I have made** long ago**, and reading more about UIWebview's insane versatility, it happened to be possible to implement the whole white view, you see in the image above, using a single UIWebView!!


Time for some coding action?

{% highlight objc %}
- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.

    //obvious enough, a UIWebview instance variable intialization in a UIViewController:
    webView = [[UIWebView alloc] initWithFrame:self.view.frame];
    [self.view insertSubview:webView atIndex:0];
    [webView release];

    //Load some random HTML things
    [webView loadHTMLString:@"<pre>
    <h1>Hello World!!</h1>
    </pre>
    Testing" baseURL:nil];
}

- (IBAction)buttonPressed {
    //Literially, tap the untapped potential !!!
    [webView stringByEvaluatingJavaScriptFromString:
     @"var par = document.createElement('p');\
     par.innerHTML = 'This is awesomeness!! xD'; \
     document.body.appendChild(par);"];
}

{% endhighlight %}

You get:

![s](/images/screen-shot-2011-10-30-at-10-30-25-pm2.png?w=640)
![s](/images/webview1.png)
![s](/images/webview2.png)
