title: Automating the Hijri Offset
categories:
- automation
- KPT
- python
- objective-c
- NSCalendar
- date
- snippets
comments: true
date: 2014-03-17 11:39:43+00:00

One of my apps has a lunar calendar integrated, and since lunar calendars aren't as predictable as solar calendars, I have to provide an offset from the backend to determine the correct date. That offset update process is tedious, and I have been forgetting to update it recently... Hence, automation is a must.

###### STEP 1: THE SOURCE

Let's find a reliable source to fetch the lunar date from... [I like this one](http://www.alriyadh.com/en).

###### STEP 2: THE PARSER

I first tried to use [beautifulsoup](http://www.crummy.com/software/BeautifulSoup/bs4/doc/), which was an utter failure. The library is so bad, and didn't work as I expect. Maybe it was because of unicode issues, I don't know...

In any case, I then just wrote my own regex, and wished I had just done that in the first place:

```python
regex = re.compile(r"<div class=\"date\">\s*(\w+), (\d+)", flags=(re.DOTALL))

```

###### STEP 3: THE BASE DATE

Unfortunately, my app doesn't query the date from the backend (silly me), it queries the offset instead (/facepalm). Hence, I need to know what the base date is in order to calculate the offset! The base date is calculated in the app from a library I compiled (called `MCEngine`). So, all I had to do is write a command line wrapper around it to give me the date:

```objc
int main(int argc, const char * argv[])
{
    @autoreleasepool
    {                
        MCDate *date = [MCDate dateNow];
        printf("%s~%s",
               [[date stringifyHijriDay] UTF8String],
               [[date stringifyWeekday] UTF8String]);
    }
    return 0;
}

```

###### STEP 4: THE GLITCH

As with most software, there is this awkward edge case that you have to take care of. Since I am querying the date from the website above, I may (for example) query it on Monday, when they are displaying the date for Tuesday! So, that's why in the code above I am printing the weekday (`stringifyWeekday`). Then, using some simple rules, I can find the "circular distance" from two indexes with the following:

```python
weekday_diff = min(
    abs(objc_index - actual_index),
    abs(len(en_weekdays) - objc_index - actual_index))

```

## Conclusion

I realized there is another thing I must take care of... The `weekday_diff` is always positive, but I need to know in which direction is the diff (i.e. is the objc date ahead, or is the website ahead?).
