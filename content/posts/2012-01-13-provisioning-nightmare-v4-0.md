title: Provisioning Nightmare v4.0
author: mazyod
tags: ios
comments: true
date: 2012-01-13 19:36:16+00:00
slug: provisioning-nightmare-v4-0
tags:
- CodeSign error
- Entitlements
- Entitlements.plist
- error
- iOS
- profile
- Provisioning
- StackOverflow
- Xcode
- Xcode 4
wordpress_id: 171

After experiencing Apple's provisioning nightmare with Xcode 3 several times, I finally mastered it. Unfortunately, it is time to submit my Dama game from Xcode 4, and it wasn't a pleasant experience =/.

First, I just built the project, and everything went suspiciously well, until I tried submitting my app. After selecting the App using Application Loader, I got the following error:

```text
application executable is missing a required architecture armv6

```


Ok ... At least that was an informative error! It was clear that the build settings were missing build for armv6. Googling that got me the answer in [this link](http://stackoverflow.com/questions/7053466/application-executable-is-missing-a-required-architecture-armv6). SOLVED.

Yay, now this should do it! YOU WISH.

After doing as the answer suggested, I got a linking error, something like Mach-O linkage something. I noticed it had to do with the Cocos2d static library. Turned out I had to apply the armv6 change above to the library, too, manually.

Yay, now this should do it! YOU WISH.

Later, it was this:

```text
XXX does not contain a single–bundle application or contains multiple 

```


This was actually specific to organizer. I tried the "Archive" scheme and got this error when trying to validate the product. Solution: Go to "Build Phases" and change the "Install - you know what, here is [a link](http://stackoverflow.com/questions/5206536/archiving-project-in-xcode-incorrectly-creates-multi-application-bundle). Notice that you have to do it to all your static libraries, too. (i.e Cocos2d).

Yay, now this should do it! YOU WISH.


```text
Codesign error: Provisioning profile XXX cannot be found.

```


This was sooo annoying, and the solution was sooo brute force-ish >_<. Check out [the solution here](http://stackoverflow.com/questions/1760518/codesign-error-provisioning-profile-cannot-be-found-after-deleting-expired-prof). Notice: you have to open the Xcode project using "Show package contents". The details are found on the site, just not on the highest voted answer.

Yay, now this should do it! YOU WISH.


```text
Codesign error: The identity 'iPhone Distribution: XXX' doesn't match any identity in any profile.

```


D:< ... MAN, this was 100% my fault xP. I forgot to download and install the distribution profile from the provisioning portal. I downloaded it, double clicked it, magically, it worked ... ? YOU WISH!! URGH?!


```text
CodeSign error: The entitlements file 'XXX/Entitlements.plist' is missing.

```

Why Entitlements.plist?! I remember needing it for generating an Ad-hoc distribution version, but not an AppStore version! Well, it seems all you had to do it remove that key from the build settings, [like this](http://stackoverflow.com/questions/5239800/entitlements-plist-error-when-trying-to-build-non-ad-hoc-versions).

Yay, now this should do it! YOU WISH. And, wish granted :D ... That was "all". Not bad huh? :P

Notice how all the answers where flawlessly solved thanks to StackOverflow!! Don't blame me for liking them so much and becoming a fanboy:

[![image](/images/img_1123.jpg)](/images/img_1123.jpg)
