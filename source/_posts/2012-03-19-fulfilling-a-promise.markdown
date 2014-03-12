---
author: mazyod
comments: true
date: 2012-03-19 22:50:21+00:00
layout: post
slug: fulfilling-a-promise
title: Fulfilling A Promise
wordpress_id: 201
tags:
- code
- example
- IAP
- in app purchase
- In-App
- iOS
- iPad
- iPhone
- iPod
- open-source
- Purchase
- source
- source code
- tutorial
---

So much of a promise, huh? >_>

On with it:


## iOS in-App Purchases (IAP) Made Simple:


Before proceeding, I am writing my experience with In-App purchases which I gained from developing a game recently. So, the idea presented here is actually implemented in a "real-world" app as they call it, but still!! No guarantees given!!

So, there are a lot of good, simple online tutorials about in-app purchases already, right? WRONG! :p

Of course, the famous [Ray Wenderlich](http://www.raywenderlich.com/) website does have a good tutorial, but, you guessed it, it wasn't simple enough for me.

So, what is the level of simplicity are we talking about here? It is a 1 in-app non-consumable in-app purchase simple!


### Ok, about time we start!!


First, you have to set up your in-app purchases in iTunes Connect. Very straight forward stuff. Check elsewhere if you have any difficulty.

Then, dive into your code! ... Or before that, link the StoreKit framework. We'll need it.

    
    <table cellpadding="0" cellspacing="0" class="code_page"><tr><td><span> 1 </span></td><td><div><span style="color:#66D9EF;">NSUserDefaults</span><span style="color:#F8F8F2;"> *defaults = </span><span style="color:#F8F8F2;">[</span><span style="color:#66D9EF;">NSUserDefaults</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">standardUserDefaults</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 2 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#66D9EF;">BOOL</span><span style="color:#F8F8F2;"> didPurchaseSolutions = </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">defaults </span><span style="color:#66D9EF;">objectForKey</span><span style="color:#66D9EF;">:</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">SolutionsKey</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> boolValue];</span>
    </div></td></tr><tr><td><span> 3 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> (didPurchaseSolutions) </span>
    </div></td></tr><tr><td><span> 4 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 5 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#75715E;">//</span><span style="color:#75715E;">The user purchased it already!           </span>
    </div></td></tr><tr><td><span> 6 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">}</span><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 7 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F92672;">else</span><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 8 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 9 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#75715E;">//</span><span style="color:#75715E;">purchasing code goes here!!</span>
    </div></td></tr><tr><td><span>10 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">}</span>
    </div></td></tr></table>


Ok, I think it is pretty straight forward? Somewhere in your app, you want to restrict the access of the user if he didn't purchase the IAP. That's basically how you check that. call NSUserDefaults and check the key!

Ok, now, what if he didn't purchase the IAP??

What I do first is explain to the user that if he deleted and reinstalled the app, his IAP will be available free of charge, even if it says that he'll have to purchase it again. After that, I check if the user is connected to the Internet using the Old [reachability class](https://developer.apple.com/library/ios/#samplecode/Reachability/index.html) from apple. Finally, before initiating the IAP, I display some indicator that the app is contacting IAP servers.

Now, to contact the IAP servers: I have the following code:

    
    <table cellpadding="0" cellspacing="0" class="code_page"><tr><td><span> 1 </span></td><td><div><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">PurchaseHelper </span><span style="color:#66D9EF;">sharedHelper</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">setDelegate</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">self</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 2 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">PurchaseHelper </span><span style="color:#66D9EF;">sharedHelper</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">requestInAppPurchase</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr></table>


That's a singleton class that handles IAP's. Reason it is a singleton? Reusabliity! I can just drop it in any project and access the class from anywhere. So, Let's start dissecting the PurchaseHelper:


### First: The Purchase Helper Protocol:



    
    <table cellpadding="0" cellspacing="0" class="code_page"><tr><td><span> 1 </span></td><td><div><span style="color:#75715E;">//</span><span style="color:#75715E;">Here is where the StoreKit framework comes into play!</span>
    </div></td></tr><tr><td><span> 2 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">#</span><span style="color:#F92672;">import</span><span style="color:#F8F8F2;"> </span><span style="color:#E6DB74;"><</span><span style="color:#E6DB74;">StoreKit/StoreKit.h</span><span style="color:#E6DB74;">></span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 3 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">//</span><span style="color:#75715E;">Protocol designed, keeping in mind that we have a single non-consumable IAP</span>
    </div></td></tr><tr><td><span> 4 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#66D9EF;">@</span><span style="color:#66D9EF;">protocol</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">PurchaseHelperDelegate</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;"><</span><span style="color:#F8F8F2;">NSObject</span><span style="color:#F8F8F2;">></span>
    </div></td></tr><tr><td><span> 5 </span></td><td><div><span style="color:#F8F8F2;">@required</span>
    </div></td></tr><tr><td><span> 6 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">- </span><span style="color:#F8F8F2;">(</span><span style="color:#66D9EF;">void</span><span style="color:#F8F8F2;">)</span><span style="color:#A6E22E;">purchaseCompletedSuccessfully</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 7 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">- </span><span style="color:#F8F8F2;">(</span><span style="color:#66D9EF;">void</span><span style="color:#F8F8F2;">)</span><span style="color:#A6E22E;">purchaseFailedWithError</span><span style="color:#A6E22E;">:</span><span style="color:#F8F8F2;">(</span><span style="color:#66D9EF;">NSString</span><span style="color:#F8F8F2;"> *</span><span style="color:#F8F8F2;">)</span><span style="color:#FD971F;">error</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 8 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#66D9EF;">@</span><span style="color:#66D9EF;">end</span>
    </div></td></tr></table>


Straight forward protocol that informs the delegate about the IAP result.


### Second: Public mehods



    
    <table cellpadding="0" cellspacing="0" class="code_page"><tr><td><span>  1 </span></td><td><div><span style="color:#75715E;">//</span><span style="color:#75715E;"> We have a set of public methods that control the IAP process at a high level:</span>
    </div></td></tr><tr><td><span>  2 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">#</span><span style="color:#F92672;">pragma mark</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">-</span>
    </div></td></tr><tr><td><span>  3 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">#</span><span style="color:#F92672;">pragma mark</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">Instance Methods</span>
    </div></td></tr><tr><td><span>  4 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  5 </span></td><td><div><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">void</span><span style="color:#F8F8F2;">)requestInAppPurchase </span>
    </div></td></tr><tr><td><span>  6 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  7 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">SKPaymentQueue </span><span style="color:#66D9EF;">canMakePayments</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">) </span>
    </div></td></tr><tr><td><span>  8 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  9 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#75715E;">//</span><span style="color:#75715E;">set up the SKRequest</span>
    </div></td></tr><tr><td><span> 10 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">        </span><span style="color:#66D9EF;">NSSet</span><span style="color:#F8F8F2;">* IDs = </span><span style="color:#F8F8F2;">[</span><span style="color:#66D9EF;">NSSet</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">setWithObject</span><span style="color:#66D9EF;">:</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">String_From_iTunes_Connect</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 11 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 12 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#75715E;">//</span><span style="color:#75715E;">productsRequest is an instance variable. ppl usually use _productRequest, meh.</span>
    </div></td></tr><tr><td><span> 13 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">        productsRequest = </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">SKProductsRequest </span><span style="color:#66D9EF;">alloc</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">initWithProductIdentifiers</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">IDs</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 14 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">productsRequest </span><span style="color:#66D9EF;">setDelegate</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">self</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 15 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">productsRequest </span><span style="color:#66D9EF;">start</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 16 </span></td><td><div><span style="color:#F8F8F2;">    }</span><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 17 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">else</span><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 18 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 19 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">delegate </span><span style="color:#66D9EF;">purchaseFailedWithError</span><span style="color:#66D9EF;">:</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">IAP not supported!</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 20 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F92672;">return</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 21 </span></td><td><div><span style="color:#F8F8F2;">    }</span>
    </div></td></tr><tr><td><span> 22 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr><tr><td><span> 23 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 24 </span></td><td><div><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">void</span><span style="color:#F8F8F2;">)cancelPurchase </span>
    </div></td></tr><tr><td><span> 25 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 26 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">productsRequest </span><span style="color:#66D9EF;">cancel</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 27 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">productsRequest </span><span style="color:#66D9EF;">release</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 28 </span></td><td><div><span style="color:#F8F8F2;">    productsRequest = </span><span style="color:#AE81FF;">nil</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 29 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr></table>


We already saw where we call requestInAppPurchase, and the cancel method is called when the user decides to cancel while we are displaying the activity indicator..Obviously enough. Now, the requestInAppPurchase method:

First, we wrap our only IAP ID into a set. The ID can be obtained from iTunesConnect after you set up your IAP. Then, we initialize an SKProductsRequest object with the wrapped object. Finally, set the delegate and start!


### Third: Delegate mehods


Now, we have to implement the delegate methods we troubled ourselves with. Those are for:
<SKPaymentTransactionObserver, SKProductsRequestDelegate>

And.. the functions:

    
    <table cellpadding="0" cellspacing="0" class="code_page"><tr><td><span>   1 </span></td><td><div><span style="color:#F8F8F2;">#</span><span style="color:#F92672;">pragma mark</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">-</span>
    </div></td></tr><tr><td><span>   2 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">#</span><span style="color:#F92672;">pragma mark</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">SKRequest Delegate Methods</span>
    </div></td></tr><tr><td><span>   3 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>   4 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">//</span><span style="color:#75715E;"> Sent immediately before -requestDidFinish:</span>
    </div></td></tr><tr><td><span>   5 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">void</span><span style="color:#F8F8F2;">)productsRequest:(SKProductsRequest *)request</span>
    </div></td></tr><tr><td><span>   6 </span></td><td><div><span style="color:#F8F8F2;">     didReceiveResponse:(SKProductsResponse *)response </span>
    </div></td></tr><tr><td><span>   7 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>   8 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">CCLOG</span><span style="color:#F8F8F2;">(</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">Product Request Received Response: %@</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">, response);</span>
    </div></td></tr><tr><td><span>   9 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">    </span><span style="color:#A6E22E;">NSAssert</span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">response </span><span style="color:#66D9EF;">products</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">count</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> == </span><span style="color:#AE81FF;">1</span><span style="color:#F8F8F2;">,</span>
    </div></td></tr><tr><td><span>  10 </span></td><td><div><span style="color:#F8F8F2;">             </span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">BRUTE FORCE FAIL: %@</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">, </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">response </span><span style="color:#66D9EF;">products</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">)</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  11 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  12 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">request </span><span style="color:#66D9EF;">isEqual</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">productsRequest</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">) </span>
    </div></td></tr><tr><td><span>  13 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  14 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">        </span><span style="color:#66D9EF;">CCLOG</span><span style="color:#F8F8F2;">(</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">Cleaning product Request iVar</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">);</span>
    </div></td></tr><tr><td><span>  15 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">productsRequest </span><span style="color:#66D9EF;">release</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  16 </span></td><td><div><span style="color:#F8F8F2;">        productsRequest = </span><span style="color:#AE81FF;">nil</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  17 </span></td><td><div><span style="color:#F8F8F2;">    }</span>
    </div></td></tr><tr><td><span>  18 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  19 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">SKPaymentQueue </span><span style="color:#66D9EF;">canMakePayments</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">) </span>
    </div></td></tr><tr><td><span>  20 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  21 </span></td><td><div><span style="color:#F8F8F2;">        SKProduct* product = </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">response </span><span style="color:#66D9EF;">products</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">objectAtIndex</span><span style="color:#66D9EF;">:</span><span style="color:#AE81FF;">0</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  22 </span></td><td><div><span style="color:#F8F8F2;">        SKPayment* payment = </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">SKPayment </span><span style="color:#66D9EF;">paymentWithProduct</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">product</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  23 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  24 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">SKPaymentQueue </span><span style="color:#66D9EF;">defaultQueue</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">addTransactionObserver</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">self</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  25 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">SKPaymentQueue </span><span style="color:#66D9EF;">defaultQueue</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">addPayment</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">payment</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  26 </span></td><td><div><span style="color:#F8F8F2;">    }</span><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  27 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">else</span><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  28 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  29 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">delegate </span><span style="color:#66D9EF;">purchaseFailedWithError</span><span style="color:#66D9EF;">:</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">IAP not supported!</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  30 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F92672;">return</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  31 </span></td><td><div><span style="color:#F8F8F2;">    }</span>
    </div></td></tr><tr><td><span>  32 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr><tr><td><span>  33 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  34 </span></td><td><div><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">void</span><span style="color:#F8F8F2;">)requestDidFinish:(SKRequest *)request </span>
    </div></td></tr><tr><td><span>  35 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  36 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">CCLOG</span><span style="color:#F8F8F2;">(</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">Product Request Done: %@</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">, request);</span>
    </div></td></tr><tr><td><span>  37 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr><tr><td><span>  38 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  39 </span></td><td><div><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">void</span><span style="color:#F8F8F2;">)request:(SKRequest *)request didFailWithError:(</span><span style="color:#66D9EF;">NSError</span><span style="color:#F8F8F2;"> *)error </span>
    </div></td></tr><tr><td><span>  40 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  41 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">NSLog</span><span style="color:#F8F8F2;">(</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">Request failed :( with error: %@</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">, error);</span>
    </div></td></tr><tr><td><span>  42 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">delegate </span><span style="color:#66D9EF;">purchaseFailedWithError</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">error </span><span style="color:#66D9EF;">localizedDescription</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  43 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">self</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">cancelPurchase</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  44 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr><tr><td><span>  45 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  46 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">#</span><span style="color:#F92672;">pragma mark</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">-</span>
    </div></td></tr><tr><td><span>  47 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">#</span><span style="color:#F92672;">pragma mark</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">SKPaymentTransactionObserver Delegate Methods</span>
    </div></td></tr><tr><td><span>  48 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  49 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">//</span><span style="color:#75715E;"> Sent when the transaction array has changed (additions or state changes).  </span>
    </div></td></tr><tr><td><span>  50 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#75715E;">//</span><span style="color:#75715E;">Client should check state of transactions and finish as appropriate.</span>
    </div></td></tr><tr><td><span>  51 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">void</span><span style="color:#F8F8F2;">)paymentQueue:(SKPaymentQueue *)queue </span>
    </div></td></tr><tr><td><span>  52 </span></td><td><div><span style="color:#F8F8F2;"> updatedTransactions:(</span><span style="color:#66D9EF;">NSArray</span><span style="color:#F8F8F2;"> *)transactions </span>
    </div></td></tr><tr><td><span>  53 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  54 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">CCLOG</span><span style="color:#F8F8F2;">(</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">Transactions Updated: %@</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">, transactions);</span>
    </div></td></tr><tr><td><span>  55 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  56 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">for</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">SKPaymentTransaction *transaction in transactions) </span>
    </div></td></tr><tr><td><span>  57 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  58 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F92672;">switch</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">transaction</span><span style="color:#F8F8F2;">.transactionState</span><span style="color:#F8F8F2;">) </span>
    </div></td></tr><tr><td><span>  59 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  60 </span></td><td><div><span style="color:#F8F8F2;">            </span><span style="color:#F92672;">case</span><span style="color:#F8F8F2;"> SKPaymentTransactionStatePurchased:</span>
    </div></td></tr><tr><td><span>  61 </span></td><td><div><span style="color:#F8F8F2;">            </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  62 </span></td><td><div><span style="color:#F8F8F2;">                </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">SKPaymentQueue </span><span style="color:#66D9EF;">defaultQueue</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">finishTransaction</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">transaction</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  63 </span></td><td><div><span style="color:#F8F8F2;">                </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#66D9EF;">NSUserDefaults</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">standardUserDefaults</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">setObject</span><span style="color:#66D9EF;">:</span><span style="color:#66D9EF;">@YES</span>
    </div></td></tr><tr><td><span>  64 </span></td><td><div><span style="color:#F8F8F2;">                                                          </span><span style="color:#66D9EF;">forKey</span><span style="color:#66D9EF;">:</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">SolutionsKey</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  65 </span></td><td><div><span style="color:#F8F8F2;">                </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#66D9EF;">NSUserDefaults</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">standardUserDefaults</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">synchronize</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  66 </span></td><td><div><span style="color:#F8F8F2;">                </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">delegate </span><span style="color:#66D9EF;">purchaseCompletedSuccessfully</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  67 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  68 </span></td><td><div><span style="color:#F8F8F2;">                </span><span style="color:#F92672;">break</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  69 </span></td><td><div><span style="color:#F8F8F2;">            }</span>
    </div></td></tr><tr><td><span>  70 </span></td><td><div><span style="color:#F8F8F2;">            </span><span style="color:#F92672;">case</span><span style="color:#F8F8F2;"> SKPaymentTransactionStateFailed:</span>
    </div></td></tr><tr><td><span>  71 </span></td><td><div><span style="color:#F8F8F2;">            </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  72 </span></td><td><div><span style="color:#F8F8F2;">                </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">SKPaymentQueue </span><span style="color:#66D9EF;">defaultQueue</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">finishTransaction</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">transaction</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  73 </span></td><td><div><span style="color:#F8F8F2;">                </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">delegate </span><span style="color:#66D9EF;">purchaseFailedWithError</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">transaction.error.localizedDescription</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  74 </span></td><td><div><span style="color:#F8F8F2;">                </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">self</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">cancelPurchase</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  75 </span></td><td><div><span style="color:#F8F8F2;">             </span>
    </div></td></tr><tr><td><span>  76 </span></td><td><div><span style="color:#F8F8F2;">                </span><span style="color:#F92672;">break</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  77 </span></td><td><div><span style="color:#F8F8F2;">            }</span>
    </div></td></tr><tr><td><span>  78 </span></td><td><div><span style="color:#F8F8F2;">            </span><span style="color:#F92672;">case</span><span style="color:#F8F8F2;"> SKPaymentTransactionStateRestored:</span>
    </div></td></tr><tr><td><span>  79 </span></td><td><div><span style="color:#F8F8F2;">            </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  80 </span></td><td><div><span style="color:#F8F8F2;">                </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">SKPaymentQueue </span><span style="color:#66D9EF;">defaultQueue</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">finishTransaction</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">transaction</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  81 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">                </span><span style="color:#66D9EF;">NSLog</span><span style="color:#F8F8F2;">(</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">Crappies .. Not implemented: %@</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">, transaction);</span>
    </div></td></tr><tr><td><span>  82 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  83 </span></td><td><div><span style="color:#F8F8F2;">                </span><span style="color:#F92672;">break</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  84 </span></td><td><div><span style="color:#F8F8F2;">            }</span>
    </div></td></tr><tr><td><span>  85 </span></td><td><div><span style="color:#F8F8F2;">            </span><span style="color:#F92672;">default</span><span style="color:#F8F8F2;">:</span>
    </div></td></tr><tr><td><span>  86 </span></td><td><div><span style="color:#F8F8F2;">                </span><span style="color:#F92672;">break</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  87 </span></td><td><div><span style="color:#F8F8F2;">        }</span>
    </div></td></tr><tr><td><span>  88 </span></td><td><div><span style="color:#F8F8F2;">    }</span>
    </div></td></tr><tr><td><span>  89 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr><tr><td><span>  90 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  91 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">//</span><span style="color:#75715E;"> Sent when transactions are removed from the queue</span>
    </div></td></tr><tr><td><span>  92 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#75715E;">//</span><span style="color:#75715E;">(via finishTransaction:).</span>
    </div></td></tr><tr><td><span>  93 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">void</span><span style="color:#F8F8F2;">)paymentQueue:(SKPaymentQueue *)queue</span>
    </div></td></tr><tr><td><span>  94 </span></td><td><div><span style="color:#F8F8F2;"> removedTransactions:(</span><span style="color:#66D9EF;">NSArray</span><span style="color:#F8F8F2;"> *)transactions </span>
    </div></td></tr><tr><td><span>  95 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  96 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">CCLOG</span><span style="color:#F8F8F2;">(</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">Transactions Removed: %@</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">, transactions);</span>
    </div></td></tr><tr><td><span>  97 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr><tr><td><span>  98 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  99 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">//</span><span style="color:#75715E;"> Sent when an error is encountered while adding transactions</span>
    </div></td></tr><tr><td><span> 100 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#75715E;">//</span><span style="color:#75715E;">from the user's purchase history back to the queue.</span>
    </div></td></tr><tr><td><span> 101 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">void</span><span style="color:#F8F8F2;">)paymentQueue:(SKPaymentQueue *)queue</span>
    </div></td></tr><tr><td><span> 102 </span></td><td><div><span style="color:#F8F8F2;">restoreCompletedTransactionsFailedWithError:(</span><span style="color:#66D9EF;">NSError</span><span style="color:#F8F8F2;"> *)error </span>
    </div></td></tr><tr><td><span> 103 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 104 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">CCLOG</span><span style="color:#F8F8F2;">(</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">Transaction Restoration Failed: %@</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">, error);</span>
    </div></td></tr><tr><td><span> 105 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr><tr><td><span> 106 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 107 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">//</span><span style="color:#75715E;"> Sent when all transactions from the user's purchase history have</span>
    </div></td></tr><tr><td><span> 108 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#75715E;">//</span><span style="color:#75715E;">successfully been added back to the queue.</span>
    </div></td></tr><tr><td><span> 109 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">void</span><span style="color:#F8F8F2;">)paymentQueueRestoreCompletedTransactionsFinished:(SKPaymentQueue *)queue </span>
    </div></td></tr><tr><td><span> 110 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 111 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">CCLOG</span><span style="color:#F8F8F2;">(</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">Transactions Restoration Completed: %@</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">, queue);</span>
    </div></td></tr><tr><td><span> 11
