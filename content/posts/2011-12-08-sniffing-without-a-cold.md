title: Sniffing without a Cold
author: mazyod
category: hacking
comments: true
date: 2011-12-08 20:12:20+00:00
slug: sniffing-without-a-cold
tags: College, Network, Packet Sniffing, Privacy, Security, Whatsapp
wordpress_id: 127

People usually sniff when they have a common cold, flu or other runny nose diseases. Well, I have been sniffing without being affected by any of these!

The story began when [JiMMaR](http://jimmaru.wordpress.com/), whose name has been popping up in many posts, told me about a whatsapp deficiency:

```text
4:13:59 PM Jimmar:   whatsapp sends everything in plain text
4:14:02 PM Jimmar:  [link](http://eva-quirinius.blogspot.com/2011/05/whatsapp-sends-contact-info-en-messages.html?m=1)
4:14:38 PM Mazyod:   happy sniffing then
4:14:53 PM Jimmar:   >:D

```

Even though I wished him happy sniffing, he did not attempt to sniff. Then, the day came when I discovered that my design course doctor has posted an assignment about dissecting a software program, finding problems with it and suggest a solution. The assignment title was "Reverse Engineering", but I believe reverse engineering is a much more evil field :). Anyways, I also found out that our Wireless and Mobile Networks doctor wants us to do a presentation about topics related to the course, **ON THE SAME DAY**.

My mind quickly solved the equation: **Network Presentation + Software Deficiency = Whatsapp** :D

So ... Now we finally get to the main event, the story you have all been waiting for, the interesting part of this post, the- that's enough, dude >_>.

Ok, so, now I should first prove that Whatsapp fails at privacy. I am sure they would believe me if I posted information from the blog post (link above), but it would be better rated, as a report, if I attempted an experiment, and definitely it would be a much more interesting presentation if I actually showed the class the packets and its contents with a live capture. So, it's basically _show time! _(Note: When you read "Show Time!", make sure you sound excited).

The blog post attempted the sniffing by:



	
  1. Set up an access point

	
  2. Connect the access point to an Ethernet hub.

	
  3. Connect your PC with a packet sniffer program to the hub.


How does it work:
Simple. The Phone would be connected to the access point. The access point sends the request to the hub. The hub _broadcasts_ the request to all parties connected to it, including the PC with the sniffer. Yes, the hub is like that guy you swore never to tell him a secret ever again.

With that setup in mind, I head to "The techy's heaven" in Kuwait, Bin Khaldoon Street, analogous to Akihabara :P. To my surprise, I ask for an Ethernet hub and I get an Ethernet switch >_>. I try to explain that a switch does not broadcast the request, but they change the subject and try to sell me a USB hub. Either ways, I was lucky enough to find one intelligent man who told me: "I haven't seen a hub around here since ten years ago" O_O. I launch safari on my iPhone, look it up on amazon, and there it is... An Ethernet hub sold since 1998. This kinda reminded me of how "Okabe Rintarou" was searching for the "IBN 5100" in "Stein's Gate" :P.

C'mon, I cannot afford to wait 10 days for the hub to arrive from amazon!! Think .. Think .. Blimp!

I go to an old friend who works in one of the shops and ask: "Do you have some kind of device that can make wireless devices connect to a PC with an internet connection?". Malik: "Yes, an access point" .. wow!! :D

Basic idea: Connect the PC to the internet though a USB dongle (the 3G internet thingies) and share this internet through the Ethernet port to the access point, which in its turn advertises this internet to the wireless devices. This means that all the requests of the wireless devices will eventually go through the PC's Ethernet port. As soon as they arrive to the port, we tell them: "Say hello to Mr. Sniffer!!". So, I bought a D-Link access point (~$50) and went back home.

Thinking that the setup will be painless, I connected the access point, turned it on and waited... Nothing. The PC shows an IP address of 169.254.*.*, which seems to be a common error with wrong network setups. I hastily grabbed the access point and abused the reset button till the thing's firmware burned to crisp :(. After burning it, the only way I actually found that out was when I assigned a static IP to my PC, and accessed the router's IP, it finally showed: "Recovery Mode", but no response from clicking the buttons... I should have accessed the console through a static IP from the start =/.

I have to attempt this no matter what. I bought another brand, TP-Link access point (cheaper by $10), and immediately installed it, set the static IP, logged to the console and found out the following:



	
  * DHCP was initially OFF. (Explains the IP problems)

	
  * Access point mode was on "Range extender" instead of "Access Point".


Fixing those, the PC was finally getting a valid IP from the DHCP. Then, as the guy who sold me the second access point told me, I went to the connections settings and enabled sharing for the 3G connection. Finally, I connected my phone to the Access Point, which I called "Middle-Man" (SSID. clearly why so). So that's all? You wish.

The phone was not connecting... That was when the fruits of taking Networks I with Dr. Ibraheem Al-Rashed was really showing. I intruded the access point's settings again, and found that you can play with the IP address, Gateway and DNS server of the router. They were set to 0.0.0.0, with "optional" written next to them. "Kangairo!" .. Think!! Gateway, what did we learn about that? Obviously, it was the "Gateway" between our local network and the rest of the world!! Well, our gateway should be the PC!

Went back to a static IP with the PC (So it doesn't change, and cause me to change the access point's settings), and set the Gateway and DNS fields to the PC's static IP address. There.. Connected my phone and it was alive!

Then, Mr. Wireshark (the most awesome sniffing tool I came across) took it from here:

[![image](/images/sniff3.png)](/images/sniff3.png)

Yeah, I sent through whatsapp: "Muwahahahaha!!" (Mind the number of "haha"s) and there it was .. Plain text! Moreover, the blurred area are JiMMaR's and my phone number! This message was sent to a group which included both of us...

## Conclusion:

Spam whatsapp to solve this issue and secure your privacy!
