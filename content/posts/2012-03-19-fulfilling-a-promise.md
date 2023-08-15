title: Fulfilling A Promise
author: mazyod
category: ios
comments: true
date: 2012-03-19 22:50:21+00:00
slug: fulfilling-a-promise
tags: code, example, IAP, in app purchase, In-App, iOS, iPad, iPhone, iPod, open-source, Purchase, source, source code, tutorial
wordpress_id: 201

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

```objc
NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];  
BOOL didPurchaseSolutions = [defaults objectForKey:@"SolutionsKey"] boolValue];  
if (didPurchaseSolutions)   
{  
    //The user purchased it already!             
}   
else   
{  
    //purchasing code goes here!!
}

```

Ok, I think it is pretty straight forward? Somewhere in your app, you want to restrict the access of the user if he didn't purchase the IAP. That's basically how you check that. call NSUserDefaults and check the key!

Ok, now, what if he didn't purchase the IAP??

What I do first is explain to the user that if he deleted and reinstalled the app, his IAP will be available free of charge, even if it says that he'll have to purchase it again. After that, I check if the user is connected to the Internet using the Old [reachability class](https://developer.apple.com/library/ios/#samplecode/Reachability/index.html) from apple. Finally, before initiating the IAP, I display some indicator that the app is contacting IAP servers.

Now, to contact the IAP servers: I have the following code:

```objc
[[PurchaseHelper sharedHelper] setDelegate:self];  
[[PurchaseHelper sharedHelper] requestInAppPurchase];

```


That's a singleton class that handles IAP's. Reason it is a singleton? Reusabliity! I can just drop it in any project and access the class from anywhere. So, Let's start dissecting the PurchaseHelper:


### First: The Purchase Helper Protocol:



```objc
//Here is where the StoreKit framework comes into play!  
#import <StoreKit/StoreKit.h>;  
//Protocol designed, keeping in mind that we have a single non-consumable IAP  
@protocol PurchaseHelperDelegate <NSObject>  
@required  
- (void)purchaseCompletedSuccessfully;  
- (void)purchaseFailedWithError:(NSString *)error;  
@end

```

Straight forward protocol that informs the delegate about the IAP result.


### Second: Public mehods

```objc
// We have a set of public methods that control the IAP process at a high level:     
#pragma mark -     
#pragma mark Instance Methods     
      
- (void)requestInAppPurchase      
{     
    if ([SKPaymentQueue canMakePayments])      
    {     
        //set up the SKRequest     
        NSSet* IDs = [NSSet setWithObject:@"String_From_iTunes_Connect"];     
      
        //productsRequest is an instance variable. ppl usually use _productRequest, meh.     
        productsRequest = [[SKProductsRequest alloc] initWithProductIdentifiers:IDs];     
        [productsRequest setDelegate:self];     
        [productsRequest start];     
    }      
    else      
    {     
        [delegate purchaseFailedWithError:@"IAP not supported!"];     
        return;     
    }     
}     
      
- (void)cancelPurchase      
{     
    [productsRequest cancel];     
    [productsRequest release];     
    productsRequest = nil;     
}

```

We already saw where we call requestInAppPurchase, and the cancel method is called when the user decides to cancel while we are displaying the activity indicator..Obviously enough. Now, the requestInAppPurchase method:

First, we wrap our only IAP ID into a set. The ID can be obtained from iTunesConnect after you set up your IAP. Then, we initialize an SKProductsRequest object with the wrapped object. Finally, set the delegate and start!


### Third: Delegate mehods


Now, we have to implement the delegate methods we troubled ourselves with. Those are for:
```text
<SKPaymentTransactionObserver, SKProductsRequestDelegate>

```

And.. the functions:
    
```objc
#pragma mark -
#pragma mark SKRequest Delegate Methods

// Sent immediately before -requestDidFinish:
- (void)productsRequest:(SKProductsRequest *)request 
     didReceiveResponse:(SKProductsResponse *)response {
    CCLOG(@"Product Request Received Response: %@", response);
    NSAssert([[response products] count] == 1, 
             @"BRUTE FORCE FAIL: %@", [response products]);
    
    if ([request isEqual:productsRequest]) {
        CCLOG(@"Cleaning product Request iVar");
        [productsRequest release];
        productsRequest = nil;
    }
    
    if ([SKPaymentQueue canMakePayments]) {
        SKProduct* product = [[response products] objectAtIndex:0];
        SKPayment* payment = [SKPayment paymentWithProduct:product];

        [[SKPaymentQueue defaultQueue] addTransactionObserver:self];
        [[SKPaymentQueue defaultQueue] addPayment:payment];
    } else {
        [delegate purchaseFailedWithError:@"IAP not supported!"];
        return;
    }
}

- (void)requestDidFinish:(SKRequest *)request {
    CCLOG(@"Product Request Done: %@", request);
}

- (void)request:(SKRequest *)request didFailWithError:(NSError *)error {
    NSLog(@"Request failed :( with error: %@", error);
    [delegate purchaseFailedWithError:[error localizedDescription]];
    [self cancelPurchase];
}

#pragma mark -
#pragma mark SKPaymentTransactionObserver Delegate Methods

// Sent when the transaction array has changed (additions or state changes).  
//Client should check state of transactions and finish as appropriate.
- (void)paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transactions {
    CCLOG(@"Transactions Updated: %@", transactions);
    
    for (SKPaymentTransaction *transaction in transactions) {
        switch (transaction.transactionState) {
            case SKPaymentTransactionStatePurchased:
                [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
                [[NSUserDefaults standardUserDefaults] setObject:[NSNumber numberWithBool:YES] 
                                                          forKey:@"SolutionsKey"];
                [[NSUserDefaults standardUserDefaults] synchronize];
                [delegate purchaseCompletedSuccessfully];
                break;
            case SKPaymentTransactionStateFailed:
                [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
                [delegate purchaseFailedWithError:transaction.error.localizedDescription];
                [self cancelPurchase];
                break;
            case SKPaymentTransactionStateRestored:
                [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
                NSLog(@"Crappies .. Not implemented: %@", transaction);
            default:
                break;
        }
    }
}

// Sent when transactions are removed from the queue 
//(via finishTransaction:).
- (void)paymentQueue:(SKPaymentQueue *)queue 
 removedTransactions:(NSArray *)transactions {
    CCLOG(@"Transactions Removed: %@", transactions);
}

// Sent when an error is encountered while adding transactions
//from the user's purchase history back to the queue.
- (void)paymentQueue:(SKPaymentQueue *)queue 
restoreCompletedTransactionsFailedWithError:(NSError *)error {
    CCLOG(@"Transaction Restoration Failed: %@", error);
}

// Sent when all transactions from the user's purchase history have 
//successfully been added back to the queue.
- (void)paymentQueueRestoreCompletedTransactionsFinished:(SKPaymentQueue *)queue {
    CCLOG(@"Transactions Restoration Completed: %@", queue);
}

```

So, what do we need to take note of here??

1. The request you send will receive a response, calling: `productRequest:…`
2. Defensive programming!! Remind your self that you are supporting a single IAP with a nice `NSAssert`.
3. Set up the `paymentQueue` exactly the way I did. (aka Copy/paste).
4. The Payment Queue delegate method is called: `paymentQueue:…`
5. In the switch statement, we only use: `SKPaymentTransactionStatePurchased` and `SKPaymentTransactionStateFailed`.
6. In case of failing, just inform the delegate and reset everything.
7. In case of Purchased, call the `finishedTransaction` (as writtten), then set your `NSUserDefaults` to save the purchase. Finally, inform your delegate.
8. Go test it!! We are done :D

Phew … That was long, but simple .. I hope :p.
