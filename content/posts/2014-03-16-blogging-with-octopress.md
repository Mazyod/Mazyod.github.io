title: Blogging With Octopress
tags: blogging, sublime text, octopress, terminal, python
comments: true
date: 2014-03-16 08:50:12+00:00

Here is the way I have my blogging pipeline setup. First, I launch terminal and type:

```bash
$ blog_new_post "blogging-with-octopress"

```

Then, sublime opens up, and I am ready to start writing things!

![image](/images/sublime-markdown.png)

And, the way I add images like the one above is, after taking the screenshot, I would call this:

```bash
$ blog_add_images ~/Desktop/sublime-markdown.png 
# for multiple images, just do this
$ blog_add_images ~/Desktop/*.png
# or...
$ blog_add_images imagepath1 imagepath2 ...

```

BAM! And now that I am done, I'll run the final command:

```bash
$ blog_deploy

```

... And the post is live!

## Conclusion

These commands are of course custom made, and they allow the user to set the blog directory before hand, so you don't have to bother `cd` into the blog directory each and every time to do things. The way I added these commands in the first place, and how, is a whole topic by itself :D
