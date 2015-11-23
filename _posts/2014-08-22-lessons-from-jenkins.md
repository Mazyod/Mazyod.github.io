---
layout: post
title: "Lessons from Jenkins"
date: 2014-08-22 09:55:47 +0400
comments: true
categories: 
- jenkins
- cli
- development
- server
- build
- automation
- remote
- vnc
---

## Introduction

Recently, I was privileged with the task of configuring a mac mini server with Jenkins to automate our build process, and distribute new versions OTA using HockeyApp.

![](https://wiki.jenkins-ci.org/download/attachments/2916393/logo.png?version=1&modificationDate=1302753947000)

The task was anything but smooth. I did not expect Jenkins to have so many bugs!! Well, less Jenkins, and more the plugins that are around it. Anyways, let's dive right into it.

## Hello, Jenkins

Before anything, you probably want to give yourself remote access to the Jenkins server. Configuring jenkins through VNC, SSH, or other indirect manner is not feasible, as you'll probably spend quite a few hours working on Jenkins.

Fortunately, this is quite simple. First, make sure that your server is secure by setting up some authentication method. This is done in Jenkins preferences. Choose whatever suits you, so long as not anyone with that knows the IP address of the server and port number can access Jenkins. That would be really bad.

> A word of caution: While setting up the credentials, make sure you give the anonymous user full privileges, and only remove them once you've set everything up. You could end up locking yourself out of the server, otherwise. (which is easy to fix, but better avoid it altogether)

Once that is setup, open the Jenkins config.xml (possibly located in `~/.jenkins`) and change the value `127.0.0.1` to `0.0.0.0`. I forgot the exact name of the key, but just tells Jenkins to accept incoming connections from all addresses.

YAY! Now you can play around with Jenkins from your iPad.

## Hello, Xcode

This is when I realized how really aweful those plugins for Jenkins are. They are suppose to serve as a UI replacement for common commands used by Jenkins users, but they ultimately fail to deliver. I am sorry if the truth hurts, but I did waste a lot of time on them, and that hurt as well.

If you want to see for yourself, download the Xcode plugin for Jenkins, and just try to build your project through it. It's hard to specify the freakin details, especially if you have a complex project setup. On top of that, it always added an argument that broke my build, and you can't turn it off..

In any case, I prefer and ultimately used [Shenzhen](https://github.com/nomad/shenzhen), which is part of the [Nomad cli](http://nomad-cli.com) package. My thoughts?

So painless, so simple, so awesome.

{% highlight bash %}
# Unlock the keychain
security unlock-keychain -p PASSWORD

# Increment the build number
agvtool next-version -all
# build the IPA
ipa build --scheme TellyApp-On-Commit --configuration Ad-Hoc
# distribute through hockey app
ipa distribute:hockeyapp -m "Jenkins build" --token

{% endhighlight %}

The few lines of script above replaces two Jenkins plugins, the Xcode one and the HockeyApp distributor one.

## Hello, GitHub

Github uses a concept called "Webhooks" to do a very convenient thing for us. Once a push has been made to master, or a pull request is submitted, we can tell github, through webhooks, to submit a POST request to our server informing it about the change. This rids us of polling the SCM for changes, and even get instant results!

Those webhooks were a nightmare, though. Throughout the guides I read, there was nothing specifying that you should choose the `urlencoded` content type instead of the `application/json`, but you have to do that. Another issue is that Github sends a `ping` notification first, which fails... I tried to make it work, but ultimately found out that it's not supported by the Jenkins Github plugin. It is destined to fail, I guess :( ... 

## Thank You, Knowledge Sharing People

This is a very detailed and organized [article on integrating Jenkins with Xcode](http://orangejuiceliberationfront.com/setting-up-jenkins-for-github-and-xcode-with-nightlies/). Another important resource was [this simple set of steps](http://blog.denivip.ru/index.php/2014/01/how-to-configure-jenkins-ci-on-mac-os-x-to-build-android-and-ios-phonegapcordova-apps-and-deliver-them-to-testflighthockeyapp/?lang=en) that helped me debug a few issues.

## Goodbye, Everyone

That was what it took to get it up and running! The devil is in the detail, and I am sure I am missing bits and pieces here and there... The main take away is: __DON'T RELY ON PLUGINS UNLESS YOU ABSOLUTELY MUST__.

