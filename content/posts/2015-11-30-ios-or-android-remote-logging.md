title: iOS or Android Remote Logging
tags: software, development, mobile, ios, android, firebase, logging, remote, bugs, debugging, tracking, b2b, lean, startup
date: 2015-11-30 22:42:15+00:00

## Introduction

I have highlighted [in a previous post]({% post_url 2015-11-27-lavish-ideas %}) that I'll be writing a topic about [Sentry](https://getsentry.com/welcome/). The reason I said that was because I was in the process of building a remote logging service for an iOS app. Ultimately, it took less than two hours to implement.

Here is the scoop: Sentry is just impossible to deploy for a n00b like me. It is dependent on nginx, django, redis, and postgres... Can you believe that? I just want to get a logging server for a simple app, and I have to learn and deploy all these services? I didn't have the luxury of time, so a pivot was inevitable.

[Firebase](https://www.firebase.com/) came to the rescue. I was able to read their docs, learn how it worked, design and implement the remote logger in the iOS app, all in less then 2 hours. That's how great Firebase is.

## Business Needs

First off, let me shed some light on the situation here...

The App we are talking about is a B2B native iOS/Android application. It is deployed to a handful of businesses in order to streamline a certain activity of theirs. That's it, let's try to break this paragraph into requirements.

The fact that the application is B2B puts it at a whole other level than regular B2C apps. B2B implies higher standards, less error tolerance, and extremely high support expectancy. If the app crashes while they're using it, they expect you to be on top of it ASAP, with little intervention from their side.

Then, there is the fact that we have native apps out there. That puts us at a disadvantage in terms of reachability and maintainability, since it's almost impossible to quickly and accurately monitor user activity and provide support in real-time, like web apps do... But, we can actually address that.

Finally, we are only deploying to a handful of businesses. This eliminates the need of complex data arrangements and needs. For now, it's important to me mean and lean!

## Detailed Monitoring

The problem we would like to address today is: Monitoring.

After submitting the application to the AppStore, and our users downloading the apps, we would like to quickly find problems and be alerted, if any, before the users even reach out to us. This will help our company's image in being professional and on top of problems, as previously highlighted.

The parameters needed to make sure this works are:

+ The User
+ Log Type
+ Some Info

We really need to log events per user, have distinct log types in order to filter out the trace logs from the actual errors, and finally some info associated with these logs in order to figure out what is happening!

## Firebase Logger

That is how Firebase Logger was born. I apologize in advance for the crappy Obj-C code, but this is an old project:

```objc
/** A simple logger that sends all the logs to firebase
 */
@interface NSHFirebaseLogger : NSObject

- (void)logSuccess:(NSString *)message, ...;
- (void)logInfo:(NSString *)message, ...;
- (void)logWarn:(NSString *)message, ...;
- (void)logFail:(NSString *)message, ...;

@end
```

The interface of the logger is nothing exciting at all.. It simply takes in a message format with arguments to construct the actual log message for a certain log level. The actual log method is where things get interesting...

```objc
- (void)_log:(LogLevel)level format:(NSString *)format args:(va_list)args
{
    NSString *log = [[NSString alloc] initWithFormat:format arguments:args];
    log = [NSString stringWithFormat:@"[%@]: %@", LogLevelLabel(level), log];
    ...
```

The beginning of the method, we simply want to build the full log message, including the log level. So the code above simply spits our something like:

> [WARN]: User decided to actually press the delete all data button

```objc
    ...
    Firebase *firebaseLogs = nil;
    NSDictionary *deviceInfo = [NSDictionary deviceDetailsForLogin];
    NSHUser *user = [NSHAppManager sharedManager].account.loggedInUser;
    ...
```

Now it gets interesting... We first prepare a `Firebase` reference, we will see what that will do later on. Then, we use a convenient `NSDictionary` call to get the device info, like the device model, MAC address, ... etc. Finally, we try to query for the logged in user from the account manager class.

```objc
    ...
    if (user) {
        firebaseLogs = [self.firebaseRoot childByAppendingPath:user.username];
    }
    else {
        firebaseLogs = [self.firebaseRoot childByAppendingPath:deviceInfo[DeviceIdKey]];
    }
    ...
```

About the user, if there is a user logged in, we want the firebase log tree to start with that user's username. If that is not possible, then use the device ID, which we log in the backend anyway, as the root of the logs.

As you can see here, `Firebase` is a simple and elegant object that is like a key value "tree". Keys and values can be nested in a tree manner, as we will see in the end. So, taking the root `Firebase` object, we start to build the tree by creating a child using the `appendPath` method.

```objc
    ...
    firebaseLogs = [firebaseLogs childByAppendingPath:deviceInfo[DeviceModelKey]];
    firebaseLogs = [firebaseLogs childByAppendingPath:@"logs"];
    firebaseLogs = [firebaseLogs childByAutoId];    
    ...
```

Then, we simply continue building this tree by adding 3 more children. The first is the device model, just in case the user has multiple phones. I figured it's quite rare for a user to have two devices of the same model, so this should be ok.

Then, we add a hard-coded "logs" node to contain the keys for all the logs. We do that by immediately adding the `childByAutoId`, which simply creates a unique id for the log we are storing, right under "logs".

```objc
    ...
    [firebaseLogs setValue:log];
    
    NSLog(XCODE_COLORS_ESCAPE @"%@ %@ " XCODE_COLORS_RESET, LogLevelColor(level), log);
}
```

Finally, we assign the value of this node that we reached to the log message. We also print the log to the console for debugging purposes. I should probably wrap it with `#if DEBUG`, though.

Now, let's see what this handy work of ours gives us:

![image](/images/firebase-nashr.png)

Isn't that just dandy! This is the default firebase web viewer, and you can see how neatly the logs are structured, and how easy it is to quickly dig into them and find issues for a particular user.

## Conclusion

The best part is, it doesn't have to stop there! Adding a cron job to process the logs and give alerts or whatnot wouldn't be a bad idea. Also, it could provide a better log reading experience. The point is, the base is taken care of by Firebase, you just have to use your imagination from hereon onwards.
