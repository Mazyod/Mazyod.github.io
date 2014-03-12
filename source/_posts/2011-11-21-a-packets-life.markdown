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


Why structs? They are lightweight, they can be used without memory management hassle, and best of all, it can be sent through the network as raw data. To send a struct packet, all you had to do is initialize it, then send it's memory content (&packet) with it's length (sizeof(packet)) .. Something like that. (Please request the specifics if you are interested). On the other hand, objects must implement the NSCoding protocol and then are encoded/decoded using the NSKeyedArchiver/Unarchiver.

BUT! How the heck am I suppose to stick a string inside the struct!! Adding an NSString* won't do, since only the pointer will be sent. Well, I did some research, and it turned out ugly... Just like that, I jumped to Objects. Obviously, the coolest thing about classes is the inheritance. A superclass "MMPacket" and subclasses "MMPacketChat", "MMPacketMove", ... etc.

This step REALLY helped me organize my code A LOT better. The class that was responsible for sending and receiving packets was a complete mess. Sometimes it would receive a packet and send it to a certain class. Sometimes it would process it itself. UGLY!

So, how about now? Well, Mr. MMPacket just refuses to be handled by other than his own dedicated handler. How cheap! :P This introduced the following classes:

    
    <table cellpadding="0" cellspacing="0" class="code_page"><tr><td><span>  1 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">id</span><span style="color:#F8F8F2;"><</span><span style="color:#F8F8F2;">GKHGameInitDelegate</span><span style="color:#F8F8F2;">></span><span style="color:#F8F8F2;"> delegateInit;</span>
    </div></td></tr><tr><td><span>  2 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">id</span><span style="color:#F8F8F2;"><</span><span style="color:#F8F8F2;">GKHGameMoveDelegate</span><span style="color:#F8F8F2;">></span><span style="color:#F8F8F2;"> delegateMove;</span>
    </div></td></tr><tr><td><span>  3 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">id</span><span style="color:#F8F8F2;"><</span><span style="color:#F8F8F2;">GKHGameChatDelegate</span><span style="color:#F8F8F2;">></span><span style="color:#F8F8F2;"> delegateChat;</span>
    </div></td></tr><tr><td><span>  4 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">id</span><span style="color:#F8F8F2;"><</span><span style="color:#F8F8F2;">GKHGameRematchDelegate</span><span style="color:#F8F8F2;">></span><span style="color:#F8F8F2;"> delegateRematch;</span>
    </div></td></tr><tr><td><span>  5 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  6 </span></td><td><div><span style="color:#F8F8F2;">...</span>
    </div></td></tr><tr><td><span>  7 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  8 </span></td><td><div><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">BOOL</span><span style="color:#F8F8F2;">)sendPacket:(MMPacket *)aPacket </span>
    </div></td></tr><tr><td><span>  9 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 10 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">!isGameCenterAvailable)</span>
    </div></td></tr><tr><td><span> 11 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F92672;">return</span><span style="color:#F8F8F2;"> </span><span style="color:#AE81FF;">FALSE</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 12 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 13 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">NSError</span><span style="color:#F8F8F2;">* error  = </span><span style="color:#AE81FF;">nil</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 14 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">NSData</span><span style="color:#F8F8F2;">* data    = </span><span style="color:#F8F8F2;">[</span><span style="color:#66D9EF;">NSKeyedArchiver</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">archivedDataWithRootObject</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">aPacket</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 15 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 16 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">BOOL</span><span style="color:#F8F8F2;"> didSendSuccessfully = </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">currentMatch </span><span style="color:#66D9EF;">sendDataToAllPlayers</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">data</span>
    </div></td></tr><tr><td><span> 17 </span></td><td><div><span style="color:#F8F8F2;">                                                     </span><span style="color:#66D9EF;">withDataMode</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">GKMatchSendDataReliable</span>
    </div></td></tr><tr><td><span> 18 </span></td><td><div><span style="color:#F8F8F2;">                                                            </span><span style="color:#66D9EF;">error</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">&amp;error</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 19 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">return</span><span style="color:#F8F8F2;"> didSendSuccessfully;</span>
    </div></td></tr><tr><td><span> 20 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr><tr><td><span> 21 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 22 </span></td><td><div><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">void</span><span style="color:#F8F8F2;">)match:(GKMatch *)match didReceiveData:(</span><span style="color:#66D9EF;">NSData</span><span style="color:#F8F8F2;"> *)data fromPlayer:(</span><span style="color:#66D9EF;">NSString</span><span style="color:#F8F8F2;"> *)playerID</span>
    </div></td></tr><tr><td><span> 23 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 24 </span></td><td><div><span style="color:#F8F8F2;">    MMPacket* receivedPacket = </span><span style="color:#F8F8F2;">[</span><span style="color:#66D9EF;">NSKeyedUnarchiver</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">unarchiveObjectWithData</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">data</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 25 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 26 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">receivedPacket </span><span style="color:#66D9EF;">isKindOfClass</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">MMPacketInit </span><span style="color:#66D9EF;">class</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">) </span>
    </div></td></tr><tr><td><span> 27 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 28 </span></td><td><div><span style="color:#F8F8F2;">        MMPacketInit* packetInit = (MMPacketInit*)receivedPacket;</span>
    </div></td></tr><tr><td><span> 29 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">delegateInit </span><span style="color:#66D9EF;">receivedInitPacket</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">packetInit </span><span style="color:#66D9EF;">fromPeer</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">playerID</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 30 </span></td><td><div><span style="color:#F8F8F2;">    }</span><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 31 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">else</span><span style="color:#F8F8F2;"> </span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">receivedPacket </span><span style="color:#66D9EF;">isKindOfClass</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">MMPacketMove </span><span style="color:#66D9EF;">class</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">) </span>
    </div></td></tr><tr><td><span> 32 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 33 </span></td><td><div><span style="color:#F8F8F2;">        MMPacketMove* packetMove = (MMPacketMove*)receivedPacket;</span>
    </div></td></tr><tr><td><span> 34 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">delegateMove </span><span style="color:#66D9EF;">receivedMovePacket</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">packetMove </span><span style="color:#66D9EF;">fromPeer</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">playerID</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;        </span>
    </div></td></tr><tr><td><span> 35 </span></td><td><div><span style="color:#F8F8F2;">    }</span><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 36 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">else</span><span style="color:#F8F8F2;"> </span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">receivedPacket </span><span style="color:#66D9EF;">isKindOfClass</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">MMPacketChat </span><span style="color:#66D9EF;">class</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">) </span>
    </div></td></tr><tr><td><span> 37 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 38 </span></td><td><div><span style="color:#F8F8F2;">        MMPacketChat* packetChat = (MMPacketChat*)receivedPacket;</span>
    </div></td></tr><tr><td><span> 39 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">delegateChat </span><span style="color:#66D9EF;">receivedChatPacket</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">packetChat </span><span style="color:#66D9EF;">fromPeer</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">playerID</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;        </span>
    </div></td></tr><tr><td><span> 40 </span></td><td><div><span style="color:#F8F8F2;">    }</span><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 41 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">else</span><span style="color:#F8F8F2;"> </span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">receivedPacket </span><span style="color:#66D9EF;">isKindOfClass</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">MMPacketRematch </span><span style="color:#66D9EF;">class</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">) </span>
    </div></td></tr><tr><td><span> 42 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 43 </span></td><td><div><span style="color:#F8F8F2;">        MMPacketRematch* packetRematch = (MMPacketRematch*)receivedPacket;</span>
    </div></td></tr><tr><td><span> 44 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">delegateRematch </span><span style="color:#66D9EF;">receivedRematchPacket</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">packetRematch </span><span style="color:#66D9EF;">fromPeer</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">playerID</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;        </span>
    </div></td></tr><tr><td><span> 45 </span></td><td><div><span style="color:#F8F8F2;">    }</span><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 46 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">else</span><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 47 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 48 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#75715E;">//</span><span style="color:#75715E;">ignore packet =/</span>
    </div></td></tr><tr><td><span> 49 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">    }</span>
    </div></td></tr><tr><td><span> 50 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr></table>



Am really lazy right now to explain that code, but it should show you how awesome this design is!! :D

That's all folks ! More coming, hopefully!!
