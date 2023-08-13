title: Terminal Awesomeness
tags: terminal, snippets, scripting, Unix, command-line
comments: true
date: 2014-03-22 01:03:41+00:00

I just decided I want to share a few commands I use on daily basis that help me get around my daily terminal endeavors:

### Start With A BANG!!

Use `!!` to threaten terminal to do something. Actually, it repeats whatever you typed earlier:

```bash
$ some_command -option something
permission denied
# evaluates to sudo some_command -option something
$ sudo !!
Done

```

### Interested In Results

This is like how I perceive bosses and managers: They come in grumpy everyday, and are not interested in hearing about your recent breakthroughs or moments of enlightenments... "Show me some results!!".

Anyways, while writing a script, you might be interested in the output of a command, rather than the actual execution. Here is an example:

```bash
# pwd is a command that prints the current working directory
$ sound_convert_to_caf `pwd`/*.mp3

```

Here, my dumb python script doesn't take a relative path, nor resolves the current working directory, hence I must supply it with absolute paths. Using the back-ticks, one can easily resolve the absolute path! :D

### Oscillation

Did you ever want to `cd` into a directory, but remembered the effort required to `cd` back into the current directory? Yeah, a basic solution would probably be:

```bash
$ cwd=`pwd`
$ cd other_directory
$ cd $cwd

```

But! Another, much more elegant way exist that allows you to go back and forth between the two directories

```bash
$ cd other_directory
$ cd - # takes us back to initial directory
$ cd - # takes us to the other_directory

```

### Something Like... This?

Oh noes! You haz type cmd you can no longer .. have forgotten!!! Let terminal help you find it!!

Simply, hit `Ctrl + r`, and this will trigger the reverse search to allow you to do a fuzzy search on the commands you typed:

*Example:*

```bash
(reverse-i-search)`git ': git pull origin master

```

### Recursion

This blew my mind, as I have never come across it earlier (lair, obviously, I probably just overlooked it). The `/**/` syntax seems to be a recursion indication thing, not only in terminal, even in `gitignore`, for example.

```bash
$ images_convert_to_RGBA8888 directory/**/*.png

```

## Conclusion

This is definitely just a fraction of what is truly helpful in terminal. I must be missing a few, and **much, much more** that I am still ignorant about...
