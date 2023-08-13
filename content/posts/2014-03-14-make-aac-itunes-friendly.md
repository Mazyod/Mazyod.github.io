title: Forcing AAC Down iTunes' Throat
categories:
- iTunes
- AAC
- Audio
- convert
- ffmpeg
- afconvert
- snippets
comments: true
date: 2014-03-14 09:56:27+00:00

I had this batch of `*.aac` files that are just being refused by iTunes. I know it can play it, it's Apple's format for crying out loud... But, iTunes is just being... iTunes.

So, without **any** quality loss, [this answer on stackOverflow](http://stackoverflow.com/questions/70513/what-is-the-easiest-way-to-wrap-a-raw-aac-file-into-a-m4a-container) hit the nail on the head. Just wrap the `aac` file into an `m4a`! Yes, this is impersonation, which may be a felony, but till iTunes figures that out, we'll be able to play those files!

The scriptness!! (If there wasn't any coding involved, I wouldn't post about that, now would I?)

```bash
$ for file in *.aac 
> do 
> ffmpeg -i "$file" -codec: copy ${file:0:${#file}-3}.m4a
> done

```

