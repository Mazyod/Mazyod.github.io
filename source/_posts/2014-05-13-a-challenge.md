---
layout: post
title: "A Challenge"
date: 2014-05-13 17:07:23 +0400
comments: true
categories:
- python
- import
- clean
- xcode
- objective-c
- script
- programming
- ocd
---

I am collaborating on a iOS project, and the team is using Xcode. The issue with Xcode is that it doesn't do any kind of `#import` management.

The challenge is to write a script that simply checks the import and searches the file for that class. If not present, remove that import. This is naive, since that imported file might contain other headers, variables, ... etc, that are needed, but for the purposes of getting this over quickly, we will overlook that part.

**5:11 pm:** START!

Obviously it's gonna be python...

**5:16 pm:**

Instead of defining a function that taken a path pointing to a file, I should make it take a string, so I can easily test it when I am done!

{% highlight python %}
def clean_imports(file_contents):
    # stuff

{% endhighlight %}

**5:24 pm:**

I am slow... And I wish I used PyCharm for this, not sublime.
Anyways, v0.0.0.1 is working!

{% highlight python %}
import os
import re

def clean_imports(file_contents):
    """"""

    import_regex = re.compile(r'#import\s+"(\w+)\.h"')
    check_regex_raw = r"{}[^(\.h)]"

    all_classes = []
    for match in import_regex.finditer(file_contents):
        all_classes.append(match.group(1))

    print repr(all_classes)

clean_imports('#import "thisisatest.h" akdjsf a;ksldfj')

{% endhighlight %}

**5:33 pm**

I think it is done, and ready to be hooked with a "crawler".

{% highlight python %}
import os
import re

def clean_imports(file_contents):
    """"""

    import_regex = re.compile(r'#import\s+"(\w+)\.h"')
    check_regex_raw = r"{}[^(\.h)]"

    all_classes = []
    for match in import_regex.finditer(file_contents):
        all_classes.append(match.group(1))

    for klass in all_classes:
        check_regex = re.compile(check_regex_raw.format(klass))

        if not check_regex.findall(file_contents):
            file_contents = file_contents.replace(klass, klass + "NOTUSED")

        else :
            print repr(check_regex.findall(file_contents))

    print file_contents

clean_imports('#import "thisisatest.h" akdjsf a;ksldfj thisisatest ')

{% endhighlight %}

**5:37 pm**

Time to test!!

{% highlight python %}
import os
import re

def clean_imports(file_contents):
    """"""

    import_regex = re.compile(r'#import\s+"(\w+)\.h"')
    check_regex_raw = r"{}[^(\.h)]"

    all_classes = []
    for match in import_regex.finditer(file_contents):
        all_classes.append(match.group(1))

    for klass in all_classes:
        check_regex = re.compile(check_regex_raw.format(klass))

        if not check_regex.findall(file_contents):
            file_contents = file_contents.replace(klass, klass + "NOTUSED")

        else :
            print repr(check_regex.findall(file_contents))

    return file_contents

if __name__ == "__main__":
    walk = os.walk(".")

    for dirname, dirs, files in walk:
        src_files = [x for x in files if x[:-2] in [".h", ".m"]]
        for afile in src_files:
            filepath = os.path.join(dirname, afile)
            with open(filepath) as f:
                contents = f.read()

            new_contents = clean_imports(contents)
            with open(filepath, "w+") as f:
                contents.write(new_contents)


{% endhighlight %}

**5:43 pm**

Tested... found so many bugs... Try to spot them. Time to run this beast!

**5:48 pm**

Fail. This is the worst idea I had ever. Xcode refused to compile anything when it saw the #import "blahblahUNUSED.h". The premise was to comment it out type of deal, but it doesn't work like commenting it out.

Need to revisit this later.

## Conclusion

Whatever.. It was a nice exercise anyways.
