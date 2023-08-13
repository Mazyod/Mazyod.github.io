title: Binary, Or Not!
tags: binary, binaryornot, file, files, string, python, pip, pypi
comments: true
date: 2014-05-05 11:46:47+00:00

One of the [terminal scripts]({% post_url 2014-03-18-make-your-terminal-pythonic %}) that I heavily use is the search and replace script. It simply searches for occurrences of a string, and highlights the results in terminal. You can optionally choose to replace that string with something else.

In any case, it caused me a lot of headaches and unnecessarily slowed down the search when the script scanned binary files. Not only is it not useful to search those files, but the binary can easily corrupt if we replace something in it by mistake.

It is unfortunate that python doesn't seem to have a library included that solves this issue, but thankfully pypi has the answer.

## binaryornot

Talk about originality, eh? `binaryornot` is a very simple module that serves the purpose of detecting whether a file or string is binary. I have no idea how it internally works, but it gets the job done:

```python
# Import the check module, and name it something more relevant.
from binaryornot import check as bcheck

if not bcheck.is_binary(pathToFile):
    # Do the search!


```

Simple, and super handy.

## Conclusion

I love python, and dream that one day I can talk python with other people.
