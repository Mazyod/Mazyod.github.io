---
author: mazyod
comments: true
date: 2011-11-21 19:10:46+00:00
layout: post
slug: a-packets-life
title: A Packet's Life
wordpress_id: 67
tags:
- inheritance
- Network
- Object Oriented Programming
- OOP
- Packet
- Programming
- Software Engineering
---

Ok, after the finalizing the annoying chatting view, I finally went into a programming frenzy and forgot all about this blog. Yes, this is something good. Very good. From the very first post, I admitted, I don't care about the reader :P.

Well, what's with this programming frenzy? It's a Packet's Life.

Initially, before thinking about implementing the chat, all the packets I sent through Game Center to play the game online were structs. Here is an example:

{% highlight objc %}
#pragma mark -
#pragma mark Network Packets

struct ColorPacket {
    BOOL isBlack;
};
typedef struct ColorPacket ColorPacket;

struct MovePacket {  
    NSInteger size;

    Block blocks[16];
    Block eaten[16];
};
typedef struct MovePacket MovePacket;

{% endhighlight %}

Why structs? They are lightweight, they can be used without memory management hassle, and best of all, it can be sent through the network as raw data. To send a struct packet, all you had to do is initialize it, then send it's memory content (&packet) with it's length (sizeof(packet)) .. Something like that. (Please request the specifics if you are interested). On the other hand, objects must implement the NSCoding protocol and then are encoded/decoded using the NSKeyedArchiver/Unarchiver.

BUT! How the heck am I suppose to stick a string inside the struct!! Adding an NSString* won't do, since only the pointer will be sent. Well, I did some research, and it turned out ugly... Just like that, I jumped to Objects. Obviously, the coolest thing about classes is the inheritance. A superclass `MMPacket` and subclasses `MMPacketChat`, `MMPacketMove`, ... etc.

This step REALLY helped me organize my code A LOT better. The class that was responsible for sending and receiving packets was a complete mess. Sometimes it would receive a packet and send it to a certain class. Sometimes it would process it itself. UGLY!

So, how about now? Well, Mr. MMPacket just refuses to be handled by other than his own dedicated handler. How cheap! :P This introduced the following classes:

{% highlight objc %}
id<GKHGameInitDelegate> delegateInit;     
id<GKHGameMoveDelegate> delegateMove;     
id<GKHGameChatDelegate> delegateChat;     
id<GKHGameRematchDelegate> delegateRematch;     
      
...     
      
- (BOOL)sendPacket:(MMPacket *)aPacket      
{     
    if (!isGameCenterAvailable)     
        return FALSE;     
      
    NSError* error  = nil;     
    NSData* data    = [NSKeyedArchiver archivedDataWithRootObject:aPacket];     
      
    BOOL didSendSuccessfully = [currentMatch sendDataToAllPlayers:data     
                                                     withDataMode:GKMatchSendDataReliable     
                                                            error:&amp;error];     
    return didSendSuccessfully;     
}     
      
- (void)match:(GKMatch *)match didReceiveData:(NSData *)data fromPlayer:(NSString *)playerID     
{     
    MMPacket* receivedPacket = [NSKeyedUnarchiver unarchiveObjectWithData:data];     
      
    if ([receivedPacket isKindOfClass:[MMPacketInit class]])      
    {     
        MMPacketInit* packetInit = (MMPacketInit*)receivedPacket;     
        [delegateInit receivedInitPacket:packetInit fromPeer:playerID];     
    }      
    else if ([receivedPacket isKindOfClass:[MMPacketMove class]])      
    {     
        MMPacketMove* packetMove = (MMPacketMove*)receivedPacket;     
        [delegateMove receivedMovePacket:packetMove fromPeer:playerID];             
    }      
    else if ([receivedPacket isKindOfClass:[MMPacketChat class]])      
    {     
        MMPacketChat* packetChat = (MMPacketChat*)receivedPacket;     
        [delegateChat receivedChatPacket:packetChat fromPeer:playerID];             
    }      
    else if ([receivedPacket isKindOfClass:[MMPacketRematch class]])      
    {     
        MMPacketRematch* packetRematch = (MMPacketRematch*)receivedPacket;     
        [delegateRematch receivedRematchPacket:packetRematch fromPeer:playerID];             
    }      
    else      
    {     
        //ignore packet =/
    }
 
{% endhighlight %}



Am really lazy right now to explain that code, but it should show you how awesome this design is!! :D

That's all folks ! More coming, hopefully!!
