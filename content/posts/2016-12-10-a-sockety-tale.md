title: A Sockety Tale
tags: websocket
date: 2016-12-10 14:16:51+00:00

## Introduction

On a fine Friday evening, after I went over my git repos making sure everything is synced with upstream, I delightfully pack up reminiscing the past week. It was a fine, productive week! Lots of trello cards moved over to the done column.

As my phone's slack was pinging, alerting me of the status of Unity cloud builds, I got an idea. Why not download a build on my Android and try it out on the way home? The bots server was already running, so they'll keep me company.

As I started strolling back home, I downloaded the app, installed it, and started using it...

## Let the Debugging Begin!

### Portable Debugger

To my utter horror, the user data was failing to load! I restarted the app, tried several retry buttons; alas, nothing seemed to work.

At this point, I usually despair at my future demise, as I had to hook up the device to a debugger to figure out what's going on ... However, as part of this productive week, I had hooked up a remote logger!

So, as I am still making my way back home, I launch the online console and immediately welcomed with a wall of logs so granular, they looked like this:

```text
[...]:  [DEBUG]: Logger initialized...
[...]:  [DEBUG]: [HTTPConnection]: 'ws://dama.level3.io:80/socket/websocket?token=...' - Connecting to dama.level3.io:80
[...]:  [INFO]: [HTTPConnection]: Connected to dama.level3.io:80
[...]:  [INFO]: [HTTPRequest]: Sending request: 'GET /socket/websocket?token=... HTTP/1.1'
[...]:  [INFO]: [HTTPRequest]: 'GET /socket/websocket?token=... HTTP/1.1' sent out
[...]:  [DEBUG]: [HTTPConnection]: ws://dama.level3.io:80/socket/websocket?token=... - Receive - protocol: WebSocket
[...]:  [DEBUG]: [HTTPResponse]: 'ws://dama.level3.io:80/socket/websocket?token=...' - Receive. forceReadRawContentLength: '-1', readPayloadData: 'True'
[...]:  [DEBUG]: [HTTPResponse]: 'ws://dama.level3.io:80/socket/websocket?token=...' - Status Line: 'HTTP/1.1'
[...]:  [DEBUG]: [HTTPResponse]: 'ws://dama.level3.io:80/socket/websocket?token=...' - HTTP Version: '1.1'
[...]:  [DEBUG]: [HTTPResponse]: 'ws://dama.level3.io:80/socket/websocket?token=...' - Status Code: '400'
[...]:  [DEBUG]: [HTTPResponse]: 'ws://dama.level3.io:80/socket/websocket?token=...' - Status Message: 'Bad Request'
[...]:  [DEBUG]: [HTTPResponse]: 'ws://dama.level3.io:80/socket/websocket?token=...' - Header - 'Server': 'Cowboy'
[...]:  [DEBUG]: [HTTPResponse]: 'ws://dama.level3.io:80/socket/websocket?token=...' - Header - 'Date': 'Fri, 09 [...]:  [DEBUG]: [HTTPResponse]: 'ws://dama.level3.io:80/socket/websocket?token=...' - Header - 'Content-Length': '0'
[...]:  [DEBUG]: [HTTPResponse]: 'ws://dama.level3.io:80/socket/websocket?token=...' - Header - 'Connection': 'keep-alive'
[...]:  [DEBUG]: [HTTPResponse]: 'ws://dama.level3.io:80/socket/websocket?token=...' - ReadRaw - contentLength: 0
[...]:  [DEBUG]: [HTTPResponse]: 'ws://dama.level3.io:80/socket/websocket?token=...' - ReadPayload Finished!
[...]:  [DEBUG]: [HTTPConnection]: ws://dama.level3.io:80/socket/websocket?token=... - Receive - Finished Successfully!
[...]:  [INFO]: [phx][socket]: Request Finished Successfully, but the server sent an error. Status Code: 400-Bad Request Message: 
[...]:  [INFO]: Websocket connection error: Request Finished Successfully, but the server sent an error. Status Code: 400-Bad Request Message: 
[...]:  [INFO]: Purchaser: OnInitialized - PASS
[...]:  [WARN]: We are not online
```

As I went through the logs, I found the culprit. For whatever reason, I was getting a `400 Bad Request` response from my websocket requests. Thankfully, my backend also logs warns and errors to the same console.

With a few taps, I switch over to the backend logs. Unfortunately, there were no logs whatsoever. That meant, the server wasn't throwing any warnings or errors...

### Dive Into the Logs

I was getting closer to the apartment, so I started thinking, where can I begin to debug this? The server verbose logs of course!

So, as soon as I entered the apartment, I took out my laptop and logged into the server to view the logs files. These were configured to log everything, with log rotation in place, it's bound to be useful, right? Nope. Even those logs didn't show me anything of interest about this bad request error!

Am I stuck at this point? Is it the new HTTP library that I switched to recently? .. Wait, this error never showed up on the Unity Editor, why is it happening on Android? The main difference was really the Internet connection. Android was using a data plan...

As I switched my phone over to the apartment WiFi, I prayed silently that the issue would persist and not go away (because how the hell am I suppose to debug an issue with the cellular connection!!). The moment of truth was clear, the issue did **not** persist! The issue was with a high degree of certainty with the cellular connection.

### Sysadmin Toolbelt

Now that I was certain the issue manifests itself while between the client and the server, I had to take a look from the server side as to what's going on.

I no longer remember when did I learn about `tcpdump`, but I do remember a developer taught me about this tool on some Slack channel. This is definitely the right tool for debugging this insane issue!

After launching tcpdump for the first time, and seeing it dump thousands of lines of gibberish, I had to first isolate the problem!

First, I shutdown the bots server, since it was still going strong and generating insane amount of traffic! After that, I wanted `tcpdump` to show me legible data about my specific tcp connection. To do that, I used `tcpdump` ascii output option, as well as source IP filter option:

```text
tcpdump -A -i eth0 src 31.4.188.x
```

That did it! As I launched my game and connected from the 3G connection, and then the apartment WiFi, the difference was clear... The headers when connecting through the 3G connection were malformed! Specifically, the `Upgrade: websocket` header was missing. How can the server process such a request? Obviously, it couldn't.

### Our Savior

As usual, the real solution is found on StackOverflow. I easily searched for the problem and found the answer. My cellular company were using a proxy in the middle, which counts as a hop, which removes the `Upgrade:` header. The solution? Use secure websockets!

I wanted to secure my server for a while, but it wasn't critical. This time around, I just had to do it for the sake of allowing users across the variety of connections out there to connect.

Since my server is running on DigitalOcean, it took me less than 10 mins to setup letsencrypt (certbot), generate self-signed certificates, switch phoenix to use https, and push a new build to Unity Cloud Build that uses secure websockets.

The rejoice came after the cloud builder finished, and I was able to install the new build, and confirm that the issue was resolved! Yay!

## Conclusion

What I really like about this tale is the range of technical knowhow involved in debugging the issue, including rudimentary steps performed on the phone itself!

Programmers make for great investigators. They live by Sherlock Holmes phrase:

> Once you've eliminated the impossible, what you're left with, however improbable, is the truth!
