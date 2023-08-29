---
title: "Appease Your AI"
category: python
date: 2023-08-29T17:55:23Z
---

## Introduction

Who isn't talking about AI these days? This topic has made its way into every
conversation, in every field, in every way imaginable (and unimaginable).

The obvious areas where AI is mentioned could be automation, robotics, and
perhaps the hardware accelerator manufacturers. These areas are basically
intertwined with AI, no doubt about that.

Then comes the second wave of areas, where AI _applications_ made sense, not
necessarily the underlying details. This ranges widely, from Software
Engineering, health care and wellness, education, all the way to weaponizing AI
at the military, scammers / bots, and other nefarious applications.

Nowadays, you can bring up AI in _every conversation imaginable_. Building a toy
for kids? Stick an AI in that and have it talk to your kids so you don't have
to. How about making sandwiches? You got to pre-scan those ingredients with AI.
Also, have it optimize your menu over time to drive sales.

Just to be clear, I am not saying AI is new, or it hasn't touched our lives in
profound ways yet. It has, for decades now, even if most people are oblivious to
this fact. However, the surfacing of this topic and more ubiquitous applications
is what has changed recently.

## So, Let's Talk AI

Writing code alongside Github Copilot has influenced the way I write code. I
can't tell for sure whether it's good or bad in many cases, but it's a bit scary
as probably millions of programmers out there are experiencing this affect as
well, as we all unknowingly converge because of the advent of code generating
LLMs.

### Bad Copilot

When using Github Copilot for any reasonable amount of time, you will quickly
face an undeniable shortfall. It can only suggest code where the cursor is
pointing. I know, I know, you can use Github Copilot Chat / ChatGPT / ... etc to
sort of work around this, but that really breaks your flow. I like writing code
in small chunks, and would expect Copilot to mimic the way I write code, namely,
but moving the cursor and making changes in several places to achieve the
desired result.

Instead, we get this:

```python
import os
from typing import Any

def run_some_code(config: dict[str, Any]):
  some_value = os.environ.get("FOO_BAR")
  output_file = "file.txt"

  # check if the file exists
  # if os.path.exists(...)
```

Copilot will invariably use the available imports to deduce that you probably
want to use them as oppose to other, potentially better, approaches. In this
case, I usually stick to using `pathlib.Path`. Honestly, I've avoided `pathlib`
perhaps once in my career due to performance concerns, but in all other cases,
the ergonomics beats `os.path` 10-0.

Another issue that may arise is the lack of proper type hints. Since we only
import `Any` from `typing` module, Copilot will use `Any` and built-ins
exclusively to annotate your code (99% of the time). Many cases where I wanted
it to use `Callable` it would just use `callable` built-in instead, for example.

### Good Pilot

I actually started to change the way I write code in order to make copilot more
capable and expressive, so to speak. Here is one obvious improvement over the
above:

```python
import dataclasses as dc
import datetime as dt
import typing as t

@dc.dataclass
class Foo:
  date: dt.datetime
  callback: t.Callable[[], t.Any]
```

By importing the modules themselves (and using aliases to reduce verbosity), we
have effectively prepared the environment for Copilot to be able to work more
efficiently, making me the copilot, effectively!

This is a very simple change that anyone can adopt to their code style, and
would pay back dividends in time saved trying to steer Copilot to use certain
imports.

## First of Many

This is just one very obvious impact using Copilot has had over my code style,
while I am sure many less obvious have already made their way in. Personally, I
am embracing it as a good thing. At the end of the day, code is not really art.
It is instructions arranged in specific ways to serve a higher purpose, not
more.

I keep trying to think of other possibilities to better leverage Github Copilot.
A perhaps extreme example would be to force myself to document each function
with a Copilot-friendly docstring that should produce the desired result + unit
test without any intervention from me besides iterating on the docstring.

## Conclusion

Whenever you feel useless in the face of AI's quasi-infinite potential...
Whenever you see yourself unable to cope with AI's lighting-fast advancements...
Whenever you want to just shut all this out and live in simpler times...

Remember...

It's already here, and there is no stopping it.

![AI Overlord](/images/super-ai.png)
