title: Syntax Highlighting [WIP!]
author: mazyod
category: Open Source
comments: true
date: 2013-11-30 23:36:20+00:00
slug: syntax-highlighting-wip
tags: code, embedded, export, highlighting, HTML, HTMLExport, online, open-source, Programming, python, snippet, sublime, sublime text, syntax, tools, web, website
wordpress_id: 360

**This post was addressing an issue back in the dark wordpress ages, so it may no longer be relevent**

So, I go on a journey with my board and surf all over the Internet for a decent open-source syntax highlighter for websites, but I couldn't find one... At least, not with the exact functionality I had in mind. Good news is, I found something [_very close_](https://github.com/facelessuser/ExportHtml) to what I needed! But... Still, not what I needed. Due to the beauty of open-source software, all I had to do is fork that repo, and do the changes that I need to perfect it!

[ExportHTML](https://github.com/facelessuser/ExportHtml) is an awesome tool that allows you to export the code in [sublime text](http://www.sublimetext.com/) (as you are seeing it) as an HTML page. This means you can share your code with your blog readers as you intended it to be! (Well, if you want them to see the awesome sublime highlighting). Actually, even though the software is a plugin to sublime, it exports the code based on \*.tmtheme files (which is presumably a TextMate thing), but hey! Sublime Text uses \*.tmtheme files internally, anyways. There is one issue with ExportHTML, however, and that is the export feature. When you export the code, is generates a whole, full-fledged HTML page that you cannot really embed into your blog post. I was looking for something that would just export a "pre", "div", or "span" that you can just drop in the middle of your post. Instead of wasting more time searching for something else, I decided to fork ExportHTML and add that feature (since is seemed really trivial, especially using Python).

After forking the repo, I learned so much about how sublime plugins are developed, and it simply beautiful. It is SO EASY to get started!! I could figure 99.73% of what was going on without even reading the docs. The only gotcha I ran into was, when you create a command and define it in the commands list, you should create an adjacent script that has the same name as the defined command:

```text
ex. "command": "export_html_panel" --> ExportHtml.py

```

So, all I did was duplicate the ExportHtml.py, rename it to ExportEmbedded.py, clean up the script from generating all the other stuff not related to the code snippet, and BAM! It's working!

One of the issues I ran into, however, was the the way ExportHTML exports the HTML code. For some reason, it assigns the uniform background-color property to each-and-every-single tag. I can understand that sometimes you have a line highlighted in SL, and you would like to show that, but that only means you should set the **default** to whatever, and then **override it** for the selection! ... I guess, people quickly get lazy when the code is generated for them, sigh... This issue also applied to other tags, like color, valign, ... etc. I have only cleaned up the background-color as of this writing, but will clean up the rest today, hopefully.

## Sample:

```text
/* General */
a:hover{background:transparent; }
body{color: /* %body_fg% */; }
pre{border:0;margin:0;padding:0; }

```

## Conclusion:

Feel free to use the software as much as you like! It works exactly like ExportHTML, so you can start there, but if you use my fork, there will be an extra options "Export Embedded" with the "Monokai" theme! :D HURRAY MONOKAI!! Kudos are appreciated in the comments if you use it :D
