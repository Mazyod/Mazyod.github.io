---
author: mazyod
comments: true
date: 2013-12-12 01:35:14+00:00
layout: post
slug: python-n00b-tip
title: Python n00b Tip
wordpress_id: 445
categories:
- Python
tags:
- Burhan
- coding
- how-to
- interface
- learn
- Programming
- python
- scripting
- sublime
- tip
- tutorial
- __init__
- __main__
---

As I was surfing wikipedia learning about design patterns, I saw this interesting piece of code in the python example of the command design pattern:




    
    <table cellpadding="0" cellspacing="0" class="code_page"><tr><td><span> 1 </span></td><td><div><span style="color:#75715E;">#</span><span style="color:#75715E;"> Execute if this file is run as a script and not imported as a module</span>
    </div></td></tr><tr><td><span> 2 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">__name__</span><span style="color:#F8F8F2;"> </span><span style="color:#F92672;">==</span><span style="color:#F8F8F2;"> </span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">__main__</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">:</span>
    </div></td></tr><tr><td><span> 3 </span></td><td><div><span style="color:#F8F8F2;">    light_switch </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">LightSwitch</span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span> 4 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">print</span><span style="color:#F8F8F2;">(</span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">Switch ON test.</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span> 5 </span></td><td><div><span style="color:#F8F8F2;">...</span>
    </div></td></tr></table>





I am referring to the if __name__ == "__main__" thing. This is probably the most n00bish Python tip of all time, but it has always slipped my mind! I am sure I heard its purpose before... In any case, there you have it. I am sure it won't slip my mind again this time! ... I hope.





On a side note, progress on the part 4 of the map editor thing is still WIP, and coming along nicely. It will probably take a while, since it's a long one. Reading about design patterns is also urging me to write something about that, too. But, I don't know. It is covered super clearly in wikipedia.



