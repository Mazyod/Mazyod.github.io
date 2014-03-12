---
author: mazyod
comments: true
date: 2013-12-10 03:45:20+00:00
layout: post
slug: creating-a-map-editor-for-a-game-33
title: Creating a Map Editor for a Game (3/6)
wordpress_id: 400
categories:
- Game Development
- Never Ever
tags:
- argparse
- automation
- bash
- C++
- coding
- cpp
- editor
- file
- Game
- Game Development
- Games
- generating code
- intimidating
- jimmar
- map
- Map Editor
- plist
- plistlib
- Programming
- python
- read
- script
- scripting
- Software
- terminal
---

_This is the third post of a three post series regarding creating a map editor software for an RTS game. If you haven’t already, check out the [first](http://mazyod.com/2013/11/30/creating-a-map-editor-for-a-game-13/) and [second](http://mazyod.com/2013/12/06/creating-a-map-editor-for-a-game-23/) posts of the series._





## Recap:





Before we delve into the finale, let's see what we saw, read what we read, smell what we smelled... OK, we hopefully didn't smell anything, actually. RECAP!





First, we defined the **main constraint** of the Map Editor, namely, being **easy to iterate** on. We said that using a scripting language that binds to the engine would be ideal, since the interpreter can dynamically load the scripts at runtime, and the code written would be in a scripting language, aka trivial. Alas, that approach was not possible in our case.





That is when we thought of the **code-generating script** idea. Using a script, we can at least control all the data structures for the Map Editor entities using a **plist file**. The script would load the file, and **generate C++ code** that loads and uses these data structure. We will look in detail on how that happens today. Another interesting part could be exploring how the Map Editor app, written in Objective-C, handles it. This series might be a 4 part series after all...





## Python, [hisssssss](https://www.youtube.com/watch?v=J3dOrA2RWO4)!





This part is what I was **REALLY** looking forward to. If the post was a [Machboos](https://www.google.com/search?q=python&rls=ig&source=lnms&tbm=isch&sa=X&ei=_gSkUvK5K9jAoATpl4D4DQ&ved=0CAcQ_AUoAQ&biw=1440&bih=766#q=Machboos&rls=ig&tbm=isch), this is where the meat is. This part was really exciting for me beacuse: 1 - I'm a [n00b](http://www.urbandictionary.com/define.php?term=n00b) python developer, and python's awesomeness stunned me. 2 - This script can be thought of an automation kinda thing, and automation is always awesome. (And it is what one of my friends _always_ resorts to when faced with a tedious problem!)





Let us go ahead and tackle the first and most basic problem. We have a plist with structured data, and we want to convert that to actual C++ code (structs, in this case). We shall explain this through code. So, let us start the dissection, shall we:





### Entry Point





This is where the script's entry point is. We execute the code below and pass in some parameters, and then... Magic happens.




    
    <table cellpadding="0" cellspacing="0" class="code_page"><tr><td><span>  1 </span></td><td><div><span style="color:#F92672;">import</span><span style="color:#F8F8F2;"> argparse</span>
    </div></td></tr><tr><td><span>  2 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F92672;">from</span><span style="color:#F8F8F2;"> codegen_cpp </span><span style="color:#F92672;">import</span><span style="color:#F8F8F2;"> writeStructs</span>
    </div></td></tr><tr><td><span>  3 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  4 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">#</span><span style="color:#75715E;"> -- Application begin -- #</span>
    </div></td></tr><tr><td><span>  5 </span></td><td><div><span style="color:#75715E;"> </span>
    </div></td></tr><tr><td><span>  6 </span></td><td><div><span style="color:#F8F8F2;">parser </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">argparse.ArgumentParser</span><span style="color:#F8F8F2;">(</span><span style="color:#FD971F;">description</span><span style="color:#F92672;">=</span><span style="color:#E6DB74;">'</span><span style="color:#E6DB74;">Generates C++ code from plists.</span><span style="color:#E6DB74;">'</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span>  7 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">parser.add_argument</span><span style="color:#F8F8F2;">(</span><span style="color:#E6DB74;">'</span><span style="color:#E6DB74;">--plist</span><span style="color:#E6DB74;">'</span><span style="color:#F8F8F2;">, </span><span style="color:#FD971F;">metavar</span><span style="color:#F92672;">=</span><span style="color:#E6DB74;">'</span><span style="color:#E6DB74;">plist</span><span style="color:#E6DB74;">'</span><span style="color:#F8F8F2;">,</span><span style="color:#F8F8F2;"> </span><span style="color:#FD971F;">type</span><span style="color:#F92672;">=</span><span style="color:#66D9EF;">str</span><span style="color:#F8F8F2;">,</span><span style="color:#F8F8F2;"> </span><span style="color:#FD971F;">nargs</span><span style="color:#F92672;">=</span><span style="color:#AE81FF;">1</span><span style="color:#F8F8F2;">,</span><span style="color:#F8F8F2;"> </span><span style="color:#FD971F;">help</span><span style="color:#F92672;">=</span><span style="color:#E6DB74;">'</span><span style="color:#E6DB74;">plists that describe the code</span><span style="color:#E6DB74;">'</span><span style="color:#F8F8F2;">,</span><span style="color:#F8F8F2;"> </span><span style="color:#FD971F;">required</span><span style="color:#F92672;">=</span><span style="color:#AE81FF;">True</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span>  8 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">parser.add_argument</span><span style="color:#F8F8F2;">(</span><span style="color:#E6DB74;">'</span><span style="color:#E6DB74;">--include</span><span style="color:#E6DB74;">'</span><span style="color:#F8F8F2;">, </span><span style="color:#FD971F;">metavar</span><span style="color:#F92672;">=</span><span style="color:#E6DB74;">'</span><span style="color:#E6DB74;">include</span><span style="color:#E6DB74;">'</span><span style="color:#F8F8F2;">,</span><span style="color:#F8F8F2;"> </span><span style="color:#FD971F;">type</span><span style="color:#F92672;">=</span><span style="color:#66D9EF;">str</span><span style="color:#F8F8F2;">,</span><span style="color:#F8F8F2;"> </span><span style="color:#FD971F;">nargs</span><span style="color:#F92672;">=</span><span style="color:#E6DB74;">'</span><span style="color:#E6DB74;">+</span><span style="color:#E6DB74;">'</span><span style="color:#F8F8F2;">,</span><span style="color:#F8F8F2;"> </span><span style="color:#FD971F;">help</span><span style="color:#F92672;">=</span><span style="color:#E6DB74;">'</span><span style="color:#E6DB74;">header files to be included</span><span style="color:#E6DB74;">'</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span>  9 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">parser.add_argument</span><span style="color:#F8F8F2;">(</span><span style="color:#E6DB74;">'</span><span style="color:#E6DB74;">--header</span><span style="color:#E6DB74;">'</span><span style="color:#F8F8F2;">, </span><span style="color:#FD971F;">metavar</span><span style="color:#F92672;">=</span><span style="color:#E6DB74;">'</span><span style="color:#E6DB74;">headerFile</span><span style="color:#E6DB74;">'</span><span style="color:#F8F8F2;">,</span><span style="color:#F8F8F2;"> </span><span style="color:#FD971F;">type</span><span style="color:#F92672;">=</span><span style="color:#66D9EF;">str</span><span style="color:#F8F8F2;">,</span><span style="color:#F8F8F2;"> </span><span style="color:#FD971F;">nargs</span><span style="color:#F92672;">=</span><span style="color:#AE81FF;">1</span><span style="color:#F8F8F2;">,</span><span style="color:#F8F8F2;"> </span><span style="color:#FD971F;">help</span><span style="color:#F92672;">=</span><span style="color:#E6DB74;">'</span><span style="color:#E6DB74;">The header file to be generated</span><span style="color:#E6DB74;">'</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span> 10 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">parser.add_argument</span><span style="color:#F8F8F2;">(</span><span style="color:#E6DB74;">'</span><span style="color:#E6DB74;">--source</span><span style="color:#E6DB74;">'</span><span style="color:#F8F8F2;">, </span><span style="color:#FD971F;">metavar</span><span style="color:#F92672;">=</span><span style="color:#E6DB74;">'</span><span style="color:#E6DB74;">sourceFile</span><span style="color:#E6DB74;">'</span><span style="color:#F8F8F2;">,</span><span style="color:#F8F8F2;"> </span><span style="color:#FD971F;">type</span><span style="color:#F92672;">=</span><span style="color:#66D9EF;">str</span><span style="color:#F8F8F2;">,</span><span style="color:#F8F8F2;"> </span><span style="color:#FD971F;">nargs</span><span style="color:#F92672;">=</span><span style="color:#AE81FF;">1</span><span style="color:#F8F8F2;">,</span><span style="color:#F8F8F2;"> </span><span style="color:#FD971F;">help</span><span style="color:#F92672;">=</span><span style="color:#E6DB74;">'</span><span style="color:#E6DB74;">The source file to be generated</span><span style="color:#E6DB74;">'</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span> 11 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 12 </span></td><td><div><span style="color:#F8F8F2;">args </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">parser.parse_args</span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span> 13 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 14 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">writeStructs</span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">args.plist, args.include, args.header, args.source</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr></table>





Don't let no nothing intimidate you here. It is a simple use of the [argparse](http://docs.python.org/2.7/library/argparse.html) library. argparse makes it insanely easy for you to add command line interface to your script. As you see in the code above, a parser is created with a general description, and arguments are then added to the parser. You can specify lots of great option to the arguments, such as if it's optional or required, number of input variable, the type of the input, ... etc. After that, we parse the args, and call an external function. That's it. Let's see how this looks like in the terminal output when we execute "python codegen_structs.py --help":



[![Screenshot 2013-12-08 17.31.30](http://mazyod.files.wordpress.com/2013/12/screenshot-2013-12-08-17-31-30.png)](http://mazyod.files.wordpress.com/2013/12/screenshot-2013-12-08-17-31-30.png)



Now that right there is Python rocking out. The language has a _built-in_ library that handles these stuff for you... awesome. Period.





With the technicalities out of the way, what are we trying to achieve here? We are simply providing a command line interface script that takes a list of plist files that contain the data structure of a struct, an input header file (*.h), source file (*.cpp), and optional includes (<string>, <iostream>, ... etc). This script would take the arguments from the command line, and pass it to the real python script that will do all the hard work.





### Prepare For Take-Off





Getting excited to see the actual thing that does the conversion? Well, we still have ways to go... Coming up next, how to use the parameters given by the argparse library to get the actual data we need.




    
    <table cellpadding="0" cellspacing="0" class="code_page"><tr><td><span> 206 </span></td><td><div><span style="color:#75715E;">#</span><span style="color:#75715E;"> this method can only take one plist file</span>
    </div></td></tr><tr><td><span> 207 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#66D9EF;">def</span><span style="color:#F8F8F2;"> </span><span style="color:#A6E22E;">writeStructs</span><span style="color:#F8F8F2;">(</span><span style="color:#FD971F;">plistFiles</span><span style="color:#F8F8F2;">,</span><span style="color:#F8F8F2;"> </span><span style="color:#FD971F;">includes</span><span style="color:#F8F8F2;">,</span><span style="color:#F8F8F2;"> </span><span style="color:#FD971F;">outputHeaders</span><span style="color:#F8F8F2;">,</span><span style="color:#F8F8F2;"> </span><span style="color:#FD971F;">outputSources</span><span style="color:#F8F8F2;">)</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">:</span>
    </div></td></tr><tr><td><span> 208 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#75715E;">#</span><span style="color:#75715E;"> make sure everything is in place</span>
    </div></td></tr><tr><td><span> 209 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">assert</span><span style="color:#F8F8F2;"> (plistFiles </span><span style="color:#F92672;">and</span><span style="color:#F8F8F2;"> outputHeaders </span><span style="color:#F92672;">and</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">len</span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">outputHeaders</span><span style="color:#F8F8F2;">)</span><span style="color:#F8F8F2;"> </span><span style="color:#F92672;">==</span><span style="color:#F8F8F2;"> </span><span style="color:#AE81FF;">1</span><span style="color:#F8F8F2;">), </span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">writeStructs expects headers and plists</span><span style="color:#E6DB74;">"</span>
    </div></td></tr><tr><td><span> 210 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#75715E;">#</span><span style="color:#75715E;"> headers is passed in as a list with one item</span>
    </div></td></tr><tr><td><span> 211 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">    header </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">outputHeaders</span><span style="color:#F8F8F2;">[</span><span style="color:#AE81FF;">0</span><span style="color:#F8F8F2;">]</span>
    </div></td></tr><tr><td><span> 212 </span></td><td><div><span style="color:#F8F8F2;">    headerContents </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">"</span>
    </div></td></tr><tr><td><span> 213 </span></td><td><div><span style="color:#F8F8F2;">    sourceContents </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">"</span>
    </div></td></tr><tr><td><span> 214 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>...</span></td><td><div><span style="color:#F8F8F2;">...</span>
    </div></td></tr><tr><td><span> 219 </span></td><td><div><span style="color:#F8F8F2;">    plistFile </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">plistFiles</span><span style="color:#F8F8F2;">[</span><span style="color:#AE81FF;">0</span><span style="color:#F8F8F2;">]</span>
    </div></td></tr><tr><td><span> 220 </span></td><td><div><span style="color:#F8F8F2;">    alltypes </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">plistlib.readPlist</span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">plistFile</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span> 221 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 222 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">for</span><span style="color:#F8F8F2;"> atype </span><span style="color:#F92672;">in</span><span style="color:#F8F8F2;"> alltypes :</span>
    </div></td></tr><tr><td><span> 223 </span></td><td><div><span style="color:#F8F8F2;">        structName </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">atype</span><span style="color:#F8F8F2;">[</span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">name</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">]</span>
    </div></td></tr><tr><td><span> 224 </span></td><td><div><span style="color:#F8F8F2;">        params </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">atype</span><span style="color:#F8F8F2;">[</span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">parameters</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">]</span>
    </div></td></tr><tr><td><span>...</span></td><td><div><span style="color:#F8F8F2;">...</span>
    </div></td></tr><tr><td><span> 227 </span></td><td><div>
    </div></td></tr><tr><td><span> 228 </span></td><td><div><span style="color:#F8F8F2;">        headerContents </span><span style="color:#F92672;">+=</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">generateStructHeader</span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">structName, superStruct, params, userContent</span><span style="color:#F8F8F2;">)</span><span style="color:#F8F8F2;"> </span><span style="color:#F92672;">+</span><span style="color:#F8F8F2;"> </span><span style="color:#E6DB74;">'</span><span style="color:#AE81FF;">\n</span><span style="color:#E6DB74;">'</span>
    </div></td></tr><tr><td><span> 229 </span></td><td><div><span style="color:#F8F8F2;">        sourceContents </span><span style="color:#F92672;">+=</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">generateStructSource</span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">structName, superStruct, params</span><span style="color:#F8F8F2;">)</span><span style="color:#F8F8F2;"> </span><span style="color:#F92672;">+</span><span style="color:#F8F8F2;"> </span><span style="color:#E6DB74;">'</span><span style="color:#AE81FF;">\n</span><span style="color:#E6DB74;">'</span>
    </div></td></tr><tr><td><span> 230 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 231 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 232 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">writeHeader</span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">headerContents, includes, header</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span> 233 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 234 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> (outputSources </span><span style="color:#F92672;">!=</span><span style="color:#F8F8F2;"> </span><span style="color:#AE81FF;">None</span><span style="color:#F8F8F2;">) :</span>
    </div></td></tr><tr><td><span> 235 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">writeSource</span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">sourceContents, </span><span style="color:#F8F8F2;">outputSources</span><span style="color:#F8F8F2;">[</span><span style="color:#AE81FF;">0</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">, header</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span> 236 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr></table>





Starting from the top, we want to make sure we are getting what we expect. The argparse library actually generates a list of items for each argument, even if the argument is specified as a single item. For example, we specified before that [--header] is an argument with nargs [number of args] as 1. Even with that, argparse will send a list with one item in it, which is the header file. Let's take a quick detour and see an example:




    
    
    $ python codegen_struct.py --plists p1.plist p2.plist --header header.h
    # the code above will make argparse return: 
    # args.plists = ['p1.plist', 'p2.plist']
    # args.header = ['header.h']
    





It should be pretty clear by now how argparse provides you with the user's input. With that in mind, you can see how I retrieve the header file name by accessing the zero index of the header list directly. Then, we do the same thing for the plist files. Honestly, though, I could add a for loop over the plistFiles array, to support multiple plist files, but I didn't. After that, I read the plist file using plistlib, which is awesome, because it returns an object representation of the plist content. In this case, it will return a list of dictionaries. I call each dictionary "aType", and get the "name" (string), "parameters" (List), and pass those (and other arguments I stripped out for brevity sake) to the generateStructHeader and generateStructSource functions.





I explained the previous block of code in one shot and quickly because there isn't really much to it. The best take away is how easy it is to deal with plist files in Python, but that's about it.





### The Secret Sauce





In the following code, we will see exactly how the code is generated. Without further ado, let's dive right into it:




    
    <table cellpadding="0" cellspacing="0" class="code_page"><tr><td><span>  7 </span></td><td><div>
    </div></td></tr><tr><td><span>  8 </span></td><td><div><span style="color:#F8F8F2;">typeMapper </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  9 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">    </span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">int</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">:</span><span style="color:#F8F8F2;"> </span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">int</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">,</span>
    </div></td></tr><tr><td><span> 10 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">    </span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">str</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">:</span><span style="color:#F8F8F2;"> </span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">std::string</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">,</span>
    </div></td></tr><tr><td><span> 11 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">    </span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">float</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">:</span><span style="color:#F8F8F2;"> </span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">float</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">,</span>
    </div></td></tr><tr><td><span> 12 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">    </span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">double</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">:</span><span style="color:#F8F8F2;"> </span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">double</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">,</span>
    </div></td></tr><tr><td><span> 13 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">    </span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">bool</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">:</span><span style="color:#F8F8F2;"> </span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">bool</span><span style="color:#E6DB74;">"</span>
    </div></td></tr><tr><td><span> 14 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">}</span>
    </div></td></tr><tr><td><span> 15 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>...</span></td><td><div><span style="color:#F8F8F2;">...</span>
    </div></td></tr><tr><td><span> 56 </span></td><td><div>
    </div></td></tr><tr><td><span> 57 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#66D9EF;">def</span><span style="color:#F8F8F2;"> </span><span style="color:#A6E22E;">generateStructHeader</span><span style="color:#F8F8F2;">(</span><span style="color:#FD971F;">structName</span><span style="color:#F8F8F2;">,</span><span style="color:#F8F8F2;"> </span><span style="color:#FD971F;">superStruct</span><span style="color:#F8F8F2;">,</span><span style="color:#F8F8F2;"> </span><span style="color:#FD971F;">parameters</span><span style="color:#F8F8F2;">,</span><span style="color:#F8F8F2;"> </span><span style="color:#FD971F;">userContent</span><span style="color:#F8F8F2;">)</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">:</span>
    </div></td></tr><tr><td><span> 58 </span></td><td><div><span style="color:#F8F8F2;">    </span>
    </div></td></tr><tr><td><span> 59 </span></td><td><div><span style="color:#F8F8F2;">    content </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">"</span>
    </div></td></tr><tr><td><span> 60 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">for</span><span style="color:#F8F8F2;"> ivar </span><span style="color:#F92672;">in</span><span style="color:#F8F8F2;"> parameters:</span>
    </div></td></tr><tr><td><span> 61 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 62 </span></td><td><div><span style="color:#F8F8F2;">        name </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">ivar.get</span><span style="color:#F8F8F2;">(</span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">name</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">, </span><span style="color:#AE81FF;">None</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span> 63 </span></td><td><div><span style="color:#F8F8F2;">        value </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">ivar.get</span><span style="color:#F8F8F2;">(</span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">value</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">, </span><span style="color:#AE81FF;">None</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span> 64 </span></td><td><div><span style="color:#F8F8F2;">        custom </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">ivar.get</span><span style="color:#F8F8F2;">(</span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">custom_type</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">, </span><span style="color:#AE81FF;">None</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span> 65 </span></td><td><div><span style="color:#F8F8F2;">        cppignore </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">ivar.get</span><span style="color:#F8F8F2;">(</span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">cpp_ignore</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">, </span><span style="color:#AE81FF;">False</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span> 66 </span></td><td><div><span style="color:#F8F8F2;">        </span>
    </div></td></tr><tr><td><span> 67 </span></td><td><div><span style="color:#F8F8F2;">        ivarLine </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">"</span>
    </div></td></tr><tr><td><span> 68 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#75715E;">#</span><span style="color:#75715E;"> ignore this key, we don't want to generate it</span>
    </div></td></tr><tr><td><span> 69 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">        </span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> cppignore:</span>
    </div></td></tr><tr><td><span> 70 </span></td><td><div><span style="color:#F8F8F2;">            </span><span style="color:#F92672;">continue</span>
    </div></td></tr><tr><td><span> 71 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#75715E;">#</span><span style="color:#75715E;"> If we have a value, get its type from the mapper</span>
    </div></td></tr><tr><td><span> 72 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">        </span><span style="color:#F92672;">elif</span><span style="color:#F8F8F2;"> value </span><span style="color:#F92672;">is</span><span style="color:#F8F8F2;"> </span><span style="color:#F92672;">not</span><span style="color:#F8F8F2;"> </span><span style="color:#AE81FF;">None</span><span style="color:#F8F8F2;"> :</span>
    </div></td></tr><tr><td><span> 73 </span></td><td><div><span style="color:#F8F8F2;">            ivarLine </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#E6DB74;">"</span><span style="color:#AE81FF;">\t</span><span style="color:#E6DB74;">"</span><span style="color:#F92672;">+</span><span style="color:#F8F8F2;">typeMapper</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">value.</span><span style="color:#F8F8F2;">__class__</span><span style="color:#F8F8F2;">.</span><span style="color:#F8F8F2;">__name__</span><span style="color:#F8F8F2;">]</span>
    </div></td></tr><tr><td><span> 74 </span></td><td><div><span style="color:#F8F8F2;">            ivarLine </span><span style="color:#F92672;">+=</span><span style="color:#F8F8F2;"> </span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;"> </span><span style="color:#E6DB74;">"</span><span style="color:#F92672;">+</span><span style="color:#F8F8F2;">name</span><span style="color:#F92672;">+</span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">;</span><span style="color:#AE81FF;">\n</span><span style="color:#E6DB74;">"</span>
    </div></td></tr><tr><td><span> 75 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#75715E;">#</span><span style="color:#75715E;"> If it's a custom type, just use the name as the type</span>
    </div></td></tr><tr><td><span> 76 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">        </span><span style="color:#F92672;">elif</span><span style="color:#F8F8F2;"> custom </span><span style="color:#F92672;">is</span><span style="color:#F8F8F2;"> </span><span style="color:#F92672;">not</span><span style="color:#F8F8F2;"> </span><span style="color:#AE81FF;">None</span><span style="color:#F8F8F2;"> :</span>
    </div></td></tr><tr><td><span> 77 </span></td><td><div><span style="color:#F8F8F2;">            ivarLine </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#E6DB74;">"</span><span style="color:#AE81FF;">\t</span><span style="color:#E6DB74;">"</span><span style="color:#F92672;">+</span><span style="color:#F8F8F2;">custom</span>
    </div></td></tr><tr><td><span> 78 </span></td><td><div><span style="color:#F8F8F2;">            ivarLine </span><span style="color:#F92672;">+=</span><span style="color:#F8F8F2;"> </span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;"> </span><span style="color:#E6DB74;">"</span><span style="color:#F92672;">+</span><span style="color:#F8F8F2;">name</span><span style="color:#F92672;">+</span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">;</span><span style="color:#AE81FF;">\n</span><span style="color:#E6DB74;">"</span>
    </div></td></tr><tr><td><span> 79 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 80 </span></td><td><div><span style="color:#F8F8F2;">        content </span><span style="color:#F92672;">+=</span><span style="color:#F8F8F2;"> ivarLine</span>
    </div></td></tr><tr><td><span> 81 </span></td><td><div><span style="color:#F8F8F2;">    </span>
    </div></td></tr></table>





From the top, we define a global dictionary that can map the Python type to the C++ type. We will see how it is used in a bit. So, in the generateStructHeader, we loop over the parameters, such as each parameter is suppose to be an instance variable. We use Python's get(key, default) to access the dictionary, which helps us get a default value if the key we are trying to access isn't part of the dictionary. If the cpp_ignore key is defined, then this parameter should not be exported, so we continue. Else if the value is not None, we use the previously mentioned type dictionary to get the C++ type for that value, and then append the name of the ivar. Finally, if it is a custom type, we trust that this custom type will be defined somewhere, so we declare the variable as the custom type value, and append the name. You can clearly see the custom_type value in the previous post about plists, where custom_value = "MapPoint". So, it will be declared as "MapPoint position;"





This wasn't the end of the function, there is more. After we built the code for our ivars above, we will now see how we create the whole struct:




    
    <table cellpadding="0" cellspacing="0" class="code_page"><tr><td><span>  82 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#75715E;">#</span><span style="color:#75715E;"> load the template file</span>
    </div></td></tr><tr><td><span>  83 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">    structTemplateFile </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">open</span><span style="color:#F8F8F2;">(</span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">struct_template.txt</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">, </span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">r</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span>  84 </span></td><td><div><span style="color:#F8F8F2;">    structTemplateFmt </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">structTemplateFile.read</span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span>  85 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">structTemplateFile.close</span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span>  86 </span></td><td><div><span style="color:#F8F8F2;">    </span>
    </div></td></tr><tr><td><span>  87 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#75715E;">#</span><span style="color:#75715E;"> if the struct has a super class</span>
    </div></td></tr><tr><td><span>  88 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> superStruct </span><span style="color:#F92672;">is</span><span style="color:#F8F8F2;"> </span><span style="color:#F92672;">not</span><span style="color:#F8F8F2;"> </span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;"> :</span>
    </div></td></tr><tr><td><span>  89 </span></td><td><div><span style="color:#F8F8F2;">        superStruct </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;"> : </span><span style="color:#E6DB74;">"</span><span style="color:#F92672;">+</span><span style="color:#F8F8F2;">superStruct</span>
    </div></td></tr><tr><td><span>  90 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  91 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#75715E;">#</span><span style="color:#75715E;"> this is simply the constructor</span>
    </div></td></tr><tr><td><span>  92 </span></td><td><div><span style="color:#75715E;"></span><span style="color:#F8F8F2;">    content </span><span style="color:#F92672;">+=</span><span style="color:#F8F8F2;"> </span><span style="color:#E6DB74;">"</span><span style="color:#AE81FF;">\n</span><span style="color:#AE81FF;">\t</span><span style="color:#E6DB74;">"</span><span style="color:#F92672;">+</span><span style="color:#F8F8F2;">structName</span><span style="color:#F92672;">+</span><span style="color:#E6DB74;">"</span><span style="color:#E6DB74;">(const Json::Value&);</span><span style="color:#AE81FF;">\n</span><span style="color:#E6DB74;">"</span>
    </div></td></tr><tr><td><span>  93 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  94 </span></td><td><div><span style="color:#F8F8F2;">    structDef </span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">structTemplateFmt.format</span><span style="color:#F8F8F2;">(</span>
    </div></td></tr><tr><td><span>  95 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#FD971F;">structName</span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;">structName</span><span style="color:#F8F8F2;">,</span><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  96 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#FD971F;">superStruct</span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;">superStruct</span><span style="color:#F8F8F2;">,</span>
    </div></td></tr><tr><td><span>  97 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#FD971F;">structVars</span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;">content</span><span style="color:#F8F8F2;">,</span>
    </div></td></tr><tr><td><span>  98 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#FD971F;">userContent</span><span style="color:#F92672;">=</span><span style="color:#F8F8F2;">userContent</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span>  99 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 100 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">return</span><span style="color:#F8F8F2;"> structDef</span>
    </div></td></tr><tr><td><span> 101 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr></table>





Simpler than you thought? YES! We have a template file for how a C++ struct should look like, we load that, and plug in the data. Take note, though, at line 92 we are adding a **VERY SIMPLE** constructor that takes a single argument, "const Json::Value&". This is awesome because one would initially assume that we will create a constructor that takes arguments for **all** the ivars, but we don't. We will see why we do that later, and I can assure you, it's quite awesome.





Let's take a quick look at the template file:




    
    <table cellpadding="0" cellspacing="0" class="code_page"><tr><td><span> 1 </span></td><td><div><span style="color:#F8F8F2;">struct {structName}{superStruct}</span>
    </div></td></tr><tr><td><span> 2 </span></td><td><div><span style="color:#F8F8F2;">{{</span>
    </div></td></tr><tr><td><span> 3 </span></td><td><div><span style="color:#F8F8F2;">{structVars}</span>
    </div></td></tr><tr><td><span> 4 </span></td><td><div><span style="color:#F8F8F2;">#pragma START-{structName}-USERCODE</span>
    </div></td></tr><tr><td><span> 5 </span></td><td><div><span style="color:#F8F8F2;">{userContent}</span>
    </div></td></tr><tr><td><span> 6 </span></td><td><div><span style="color:#F8F8F2;">#pragma END-{structName}-USERCODE</span>
    </div></td></tr><tr><td><span> 7 </span></td><td><div><span style="color:#F8F8F2;">}};</span>
    </div></td></tr></table>





So, we simply plug in the structName, assume superStruct is empty, structVars is the ivars and constructor we generated above, and that's it! Don't worry about the #pragma stuff, and userContent. Note, though, how we are using double braces {{, }} to escape the actual braces, because a single brace {} is a python format specifier. 





## Conclusion





In this post, we concentrated at how the Python script works and generates the C++ code from the plist file. There are still a lot of questions to be answered, especially with the weird constructor shown above as well as how we plan to initialize these structs? What about the implementation of the constructor? I mean, this code will generate the structs, but there has to be code that loads a game map, and instantiate these struct and populate them with data and all that stuff. This is actually all part of the automation process!





I initially thought this would be a three part post, and boy was I far from right. This will probably be a 5 or even 6 part tutorial, where we will explore how the data is displayed in the Map Editor, and then exported and read into the engine. Stay tuned for more!
