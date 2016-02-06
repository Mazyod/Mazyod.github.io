---
layout: post
title: "No Freaking Way"
date: 2014-03-17 20:43:28 +0400
comments: true
categories: 
- python
- objective-c
- MCEngine
- lunar
- date
- calculation
- ftp
- automation
---

There is just no freaking way such a simple programming task takes so much time!! Remember the [hijri automation thingie?]({% post_url 2014-03-17-automating-the-hijri-offset %}). Well, turns out I have not thought it thoroughly enough...

###### STEP 1: THE FACEPALM

I have no idea how many days is the default for each lunar month!! It could be either 29 or 30. That should also ideally be given from the `MCEngine` side... Hence, throw everything on ObjC instead of python:

{% highlight objc %}
// fetch the website...
NSURL *url = [NSURL URLWithString:@"http://www.alriyadh.com/en"];
NSString *newspaper = [NSString stringWithContentsOfURL:url encoding:NSUTF8StringEncoding error:nil];
// Stupidest string checking EVER!!
NSRange range = [newspaper rangeOfString:@"<div class=\"date\">"];
newspaper = [newspaper substringWithRange:(NSRange){NSMaxRange(range), 30}];
// figure our the weekday offset...
NSArray *en_weekdays = @[@"Sunday", @"Monday", @"Tuesday", @"Wednesday", @"Thursday", @"Friday", @"Saturday"];
NSInteger daWeekday = -1;
NSInteger daDate = 0;
for (NSString *weekday in en_weekdays)
{
    NSRange range = [newspaper rangeOfString:weekday];
    if (range.location != NSNotFound)
    {
        daWeekday = [en_weekdays indexOfObject:weekday];
        daDate = [[newspaper substringWithRange:(NSRange){NSMaxRange(range)+@", ".length, 2}] integerValue];
    }
}

// Assertions
if (daWeekday == -1 || !daDate)
    abort();

// don't ask
[[HRAppManager sharedManager] initializeApplication];

MCDate *date = [[MCDate alloc] initWithNSDate:[NSDate date]];

// ONLY ONCE, calculate the weekday offset
NSInteger taWeekday = [en_weekdays indexOfObject:[date stringifyWeekday]];
NSInteger wdiff = daWeekday - taWeekday;
if (wdiff && labs(wdiff) > 3)
{
    wdiff = wdiff + (wdiff > 3 ? -7 : 7);
}

NSInteger offset = 0;
while (true)
{
    // while true, update the offset, and see if we attained awesome
    MCDate *date = [[MCDate alloc] initWithNSDate:[NSDate date]];
    NSInteger taDate = [[date hijriDate] day]+1 + wdiff;
    // if attained awesome, YAY!
    if (taDate == daDate)
    {
        break;
    }
    
    NSInteger soffset = daDate - taDate;
    if (labs(offset) > 15)
    {
        soffset = (soffset > 15 ? -1 : 1);
    }
    
    offset += soffset;
    [[MCSettingsManager generalSettings] setHijriOffset:offset];
}
// shouldn't happen...
if (labs(offset) > 2)
    abort();
// spit it out
printf("%ld", offset);

{% endhighlight %}

I will leave the details for the reader to figure out as an exercise!

###### STEP 2: FTP OF GLORY

Then, we use python to get the offset, and access the server through FTP and update the things:

{% highlight python %}
# coding=utf-8

import subprocess as sp
import ftplib
import re

# This is the ObjC app working with MCEngine
process = sp.Popen(["./HijriReference"], stdout=sp.PIPE)
output, whatever = process.communicate()

global offset
global new_file

# callback for retrieving the file we want to update
def callback(line):

    global new_file
    # update the hijri offset...
    if "hijriOffset" in line:
        # replace the number with a new one
        line = re.sub(r"\d", offset, line)
    # write to the new_file
    new_file.write(line+"\n")

if process.returncode == 0:

    global offset
    global new_file

    offset = output
    new_file = open("temp.json", "w")
    # connect to FTP, read the file, edit it...
    ftp = ftplib.FTP('DOMAIN', user='USER', passwd="PASS")
    ftp.retrlines("RETR file.json", callback=callback)
    new_file.close()
    # ... Push it back up
    with open("temp.json") as newj:
        ftp.storlines("STOR file.json", newj)
    # DONE
    print "updated offset:", offset

else:
    print "Error with the freaking website :/", process.returncode, output


{% endhighlight %}

###### STEP 3: THE SHORTCUT

Finally, of course, we have the shortcut! Remember the post about [how my blog pipeline is setup]({% post_url 2014-03-16-blogging-with-octopress %})? Remember those convenient commands? Well, one coming up for the kpt update script!

{% highlight bash %}
$ kpt_update_hijri 
updated offset: 1

{% endhighlight %}

Yaaaaaay!

## Conclusion

This took longer than ever necessary... And I don't feel like explaining, so I just dumped the whole code!! :D Note though, the above code could go into an infinite loop, can you figure out when?
