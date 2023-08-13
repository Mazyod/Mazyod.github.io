title: Over Gitting It
tags: git, rant, brainfart, daily, diary, why, life, programmer, developer
comments: true
date: 2014-05-07 20:49:17+00:00

A guy once said, "You can never have enough of git". Clearly he is mistaken, as I have completely overkilled it with the use of git for a mundane task, solved by much easier means.

There is this page in Humble Indie Bundle, that shows you your downloads, and you can switch between direct download and bit torrent. I wanted to know which downloads are only available as direct download.

Ding! My brain orders me to copy the list of direct downloads to a file, initialize a git repo, commit, replace the contents with the bit torrent downloads, check the diff for missing links.

After doing that, [Mr. Jim](http://jimmaru.wordpress.com/) gives another solution through `diff`. That reminds me how he praised that command in the past, but I never actually used it, which is probably why I completely forgot about it.

The ultimate answer, however, was to simply to highlight the list, switch to Bit torrent and back to direct downloads, then deselect. Now, the missing downloads from the bit torrent page should be highlighted!

