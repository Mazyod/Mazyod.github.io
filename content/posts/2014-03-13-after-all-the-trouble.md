title: After All That Trouble...
tags: snippets, python, programming, scripting, subprocess
comments: true
date: 2014-03-13 17:15:55+00:00


I made a change today to my DNS settings for `mazyod.com`, and whenever I run:

```bash
$ dig mazyod.com

```

I am seeing the old IP address!! I got sick of waiting and trying every now and then, so I open terminal and script it:
```python
>>> import time
>>> import subprocess as sp
>>> 
>>> time.sleep(1)
>>> while 1:
...     time.sleep(10)
...     IP = '184.168.221.12'
...     process = sp.Popen(['dig', 'mazyod.com'], stdout=sp.PIPE)
...     output, something = process.communicate()
...     
...     if IP not in output:
...         print 'YAAAY'
...         break
...     else:
...         print 'no.. '+output
... 

```

I **literally** go to the bathroom, and come back to find the output:

```text
YAAAY

```

... Took exactly 3 tries before the DNS updated. That's 3 tries multiplied by 10 second intervals between them tries... 

