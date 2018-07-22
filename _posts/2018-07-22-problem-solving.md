---
layout: post
title: Problem Solving
date: 2018-07-22 09:04:11+0400
categories: 
- programming
---

## Introduction

I wanted to quickly write a python script that would solve a relatively simple problem. The problem is, I needed to generate a plist file based on data defined in a Swift file.

This will involve file access, regular expressions, and file templates. Sounded a bit daunting at first, especially since I don't have too much time to spend on this task, but I decided to do it anyway, and prove that by breaking down the problem, it shall be quite simple to resolve.

## Divide & Conquer

Thankfully, there was some solution in place to solve this problem using Sourcery (a tool used generally for Swift code generation, not plists), however, the main reason I decided to move away from it was the lack of regex support. I mean, what kind of file processing tool doesn't ship with regex support? Disappointing...

Anyhow... So, with a solution in place, I didn't have to write the plist file template from scratch, nor did I have to deal with figuring out all the file paths. I took them from the previous solution, and was ready to start!

```python
import os

tweaks_file = os.path.join(os.environ["SRCROOT"], "..", ...)
plist_template = os.path.join(os.environ["SRCROOT"], "sourcery", ...)
plist_output = os.path.join(os.environ["SRCROOT"], "..", ...)
```

OK, so the boilerplate is in place, what now?

I was writing this script directly into the Xcode build phases field, lol. So, I didn't have the luxury of an IDE or anything like that, hence I wanted to be able to quickly iterate and find bugs immediately. So, I first wrote how I expected the solution to look like:

```python
def parse_mixpanel_tweak_ids(tweaks_content):
    return ["a", "b", "c"]

def extract_plist_templates(template):
    return "<file>{tweaks}</file>", "<tweak>{display_name} - {key_id}</tweak>"

def generate_tweaks_xml(tweak_ids, tweak_template):
    xml = ""
    for tid in tweak_ids:
        xml += tweak_template.format(display_name="not yet..", key_id=tid)
    return xml


with open(tweaks_file) as f:
    tweaks_content = f.read()

mixpanel_tweak_ids = parse_mixpanel_tweak_ids(tweaks_content)

with open(plist_template) as f:
    template = f.read()

file_template, tweak_template = extract_plist_templates(template)
all_tweaks_xml = generate_tweaks_xml(mixpanel_tweak_ids, tweak_template)
final_content = file_template.format(tweaks=all_tweaks_xml)

with open(plist_output, "w+") as f:
    f.write(final_content)
```

That's it! I wrote how I expected the solution to work at a high-level, and them implemented the required functions as dummies in order to iterate on this first. Surely enough, in the code above, I found bugs due to typos, resolved them quickly, and the code was already working great!

Next was the toughest part, which wasn't too bad, and that is to implement the actual functions to do what they are suppose to.

I'll save you the boring details, and just say all it took was some regex magic. Again, I didn't write this 100% correct from the get go, but due to the iteration approach, I quickly know where the bug was introduced, and can easily look to resolve it:

```python
def parse_mixpanel_tweak_ids(tweaks_content):
    regex = re.compile(r"(?:let|var)\s*(.*?)\s*=\s*BoolTweak\(name:\s*\"(.*?)\"")
    return regex.findall(tweaks_content)

def extract_plist_templates(template):
    regex = re.compile(r"%template%(.*?)%endtemplate%", re.DOTALL)
    file_template = regex.sub("{tweaks}", template)
    tweak_template = regex.findall(template)[0]
    return file_template, tweak_template
```

The `generate_tweaks_xml` I didn't even have to change, since it was simple enough to work based on the initial implementation. The two functions above were quite heavy on the regex, and I was rusty ... So, I scratched my head quite a while to remember `re.DOTALL` was needed to match dots to newlines.

## Conclusion

The code above is written in a "functional programming" way, since the functions' outputs are only influenced by the input, and would give consistent results for the same input, no matter how many times they are called.

This way of programming simplifies your life, leads to less bugs, and much more maintainable code. If I wanted to write tests for this as well, it would also be a breeze, for that matter.
