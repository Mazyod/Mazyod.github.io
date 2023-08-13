title: iOS 8 User Notifications
categories:
- apple
- notification
- local
- push
- user
- xcode
- swift
- objc
- programming
- tutorial
- best
- practice
comments: true
date: 2015-01-20 13:12:17+00:00

## Introduction

Previously, I highlighted some key points regarding the changes iOS 8 brought to [local and push notifications]({% post_url 2014-10-24-on-apns %}). Using those points, and taking it a step further, I'd like to share today how to properly handle `UIUserNotification` in iOS 8. 

(Remember, User Notifications are now the combined API for both local and remote notifications).

## Registration

Registering for user notifications is straight forward. After creating a User Notification Settings object with the desired notification types, you call the application to register those types. The application will ask the user for permission, if needed, and send you a callback after that.

Here is how you register the notification:

```objc
BOOL needsPermissions = [[UIApplication sharedApplication] respondsToSelector:@selector(registerUserNotificationSettings:)];

if (needsPermissions)
{
    UIUserNotificationType types = UIUserNotificationTypeSound|UIUserNotificationTypeAlert;
    UIUserNotificationSettings *notifSettings = [UIUserNotificationSettings settingsForTypes:types categories:nil];
    
    [[UIApplication sharedApplication] registerUserNotificationSettings:notifSettings];
}
```

`needsPermissions` is only true on iOS 8+, since on previous iOS versions you don't need to ask the user for permission for local notifications.

If the application got registered, you get a callback on AppDelegate:

```swift
func application(application: UIApplication, didRegisterUserNotificationSettings notificationSettings: UIUserNotificationSettings) {
    
    let permissionDenied = notificationSettings.types & .Alert == nil
    // ... do something if permission was denied
}
```

## Taking It A Step Further

In my application, local notifications are everything. If that feature doesn't work 100%, the app becomes as useless as [Apple's tips app](https://discussions.apple.com/thread/6537309). 

Here is the whole flow of how things work:

![image](/images/Notifications.png)

### Checking Permissions

The first thing I had to do is check the permissions every time the app becomes active. This makes sure I track the application's notification settings:

```swift
func applicationDidBecomeActive(application: UIApplication) {
    appManager.registerUserNotificationsIfNeeded()
}
```

**NOTE:** `registerUserNotifications` simply calls the code I posted previously, where I check if we need permissions, and then register user notifications if that is the case.

### Responding To Permission Changes

In order to provide the best experience possible, whenever the app is denied permission, I cache the current notification settings in a temporary place, disable the notification settings, and alert the user that notifications have been disabled. 

If the app is granted permission after that, I restore the cached settings and tell the user the notifications are back to normal.

### Perfection

With the new iOS 8 features came a really spot on feature that makes this experience very smooth. That feature is the ability for app developers to direct the user to the Settings.app.

When we show the warning that the alerts have been disabled, we can add a button in the alert for the user to directly go to the settings.app and enable them, which removes the confusion on what they are suppose to do.

### Relevant Code

```swift
func application(application: UIApplication, didRegisterUserNotificationSettings notificationSettings: UIUserNotificationSettings) {
    
    let settings = MCSettingsManager.sharedManager().alertSettings
    let permissionDenied = notificationSettings.types & .Alert == nil
    
    if permissionDenied && settings.disableAlerts() {
        
        let title = NSLocalizedString("Alerts Disabled", comment: "")
        let message = NSLocalizedString("Please enable notifications from the Settings app.", comment: "")
        let action = NSLocalizedString("Settings", comment: "")
        let cancel = MCLocalize("Cancel", "")
        let analyticsId = "notifications-disabled"
        
        appManager.showAlertWithAnalyticsID(
            analyticsId, title: title, message: message, action: action, cancel: cancel
        ) {
            handle in
            
            if handle {
                application.openURL(NSURL(string:UIApplicationOpenSettingsURLString)!)
            }
        }
    }
    else if !permissionDenied && settings.enableAlerts() {
        let message = NSLocalizedString("Alerts have been successfully enabled!", comment: "")
        MCAlertWarning("notifications-enabled", message)
    }
}
```

## Conclusion

Looking at how the whole thing works now, holistically, I think iOS 8 was a huge step for Apple in terms of raw API and technical goodness. Hopefully, they're spending their time fixing all the bugs for iOS 9.
