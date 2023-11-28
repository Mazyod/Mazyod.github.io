---
title: "Ignorance is a Blister"
category: software-engineering
date: 2023-11-28T20:50:23Z
---

## Introduction

This is yet another reboot of the attempt to dish out more fast-paced,
short-form content in order to keep the ball rolling. Previous attempts have not
been successful, so my hopes are not high, but I'm going to give it another shot
anyway.

That's it for the introduction.

## Good Ignorance

The saying goes, "Ignorance is bliss", and for good reason. Ignorance of bad
information is generally good. If you are not aware of certain suffering that is
going on in the world, or some ugly truth about a person you know, you are in
bliss.

This also applies to programming to a certain degree in certain contexts. For
example, PHP. I'm really sorry, but if you were a developer back in 2009, and
you started your programming journey with PHP, you probably had to unlearn a lot
of stuff to get back on track, in order to then improve from there. It was not a
language that promoted clean and simple code design.

Being ignorant of PHP in the 2000s was a bliss.

The final good ignorance I'll mention in programming is the ignorance of future
problems. Back when I was an inexperienced developer, not even aware of Git, I
used to ship "apps" on regular basis. They were simple apps, however, they were
useful in their own right. They provided a good starting point to grow from. I
feel like I was shipping for the sake of shipping, even though the final
products were imperfect (to say the least).

Nowadays, I spend a week figuring out which VS Code extension will work best for
Python linting before I even write a single line of code... You may not see it
as an "ignorance" problem per se, but I beg to differ. The fact that I know
about linting in the first place and care about it is partially the reason why
I'm having such issues.

## Bad Ignorance

The main reason for this post, however, is to talk about the bad ignorance that
has also plagued me recently in multiple ways.

### SQLAlchemy

I made a career transition from an iOS developer to a Python/Fullstack developer
when I started my current job. Needless to say, I had a lot to learn, and little
time to do so. Granted, I already built a backend for my Dama King game,
however, it was in a hustler fashion, just to get the game out the door. I
didn't spend the time to learn each technology I used in depth.

My job is in AI/ML, so naturally, I had to use python for most of my work.
Thankfully, I already built many internal tools in Python as an iOS developer,
so I was familiar with the language. However, I never really had to deal with a
database in any significant way. So, the first problem I was faced with was,
which ORM should I use?

Hold on, which ORM to use? What about using raw SQL? That wasn't even an option
I entertained at all. I thought it was a no-brainer to use an ORM, period. Now,
given that an ORM was a must, I had been to many python meetups, and everyone
swears by SQLAlchemy. So, I went with that. I remember posting a message in a
group chat asking for advice on how to learn the basics of SQLAlchemy for CRUD,
and one guy said, "O V E R K I L L L". I was adamant to use it anyway.

Here is where the lesson begins. I didn't spend nearly enough time learning
SQLAlchemy, and jumped in head first, flat on my face.

My biggest mistake was not learning SQL first. "Seriously, you don't know SQL?",
I hear you say. I knew the basics, just like any other developer, however, the
nuances of SQL were lost on me. Window functions, CTEs, JSON, useful EXISTS
subqueries, etc.

Why was that an issue? Well, I kept fighting SQLAlchemy, trying to make it do
things that simply don't make sense in SQL, so how can SQLAlchemy do it? Two, or
three, years into my job is when I finally took a step back and decided that I
should craft SQL queries at a lower level to control exactly what would
SQLAlchemy would generate. Thankfully, we were using SQLAlchemy 1.14, which
started a transition to SQLAlchemy 2.0 syntax. This was great since SQLA 2.0
uses a more SQL-like syntax, for example:

```python
import sqlalchemy as sa

# we have a repo class that wraps sqla engine.
with repo.session() as session:
  q = sa.select(MyTable).where(MyTable.id == 1)
  session.execute(q).all()
```

### War Stories

My biggest problem was with SQLAlchemy. The mere fact that it lingered for years
before I finally realized I should learn me some SQL, is just mind boggling. I
have similar war stories, albeit not as bad, with other technologies.

For example, I don't know why I felt I should try hard to always use the docker
images provided by the official maintainers of the technology I'm using. I used
FastAPI's, jupyterlab's, and other images provided by the maintainers, which I
would then extend to add my own customizations. This left me wasting a ton of
time trying to figure out how each base image worked, and how to adapt it to my
needs. Soon enough, we built our own solid base image, which became the
foundation for all our services.

Another example is Yup (a schema validation library for JavaScript). I thought
it was simple enough to use without reading the docs, nor preparing a sandbox
environment to test it out. Boy, was I wrong. I wasted hours (days?) wrangling
with it, and each time, I tested it against the UI with Formik, which made it
even more difficult to debug. I eventually created a sandbox environment and
used that to test out my schemas before using them in the project. The speed of
feedback was critical in this case.

## Conclusion

In conclusion, the lesson I impart to you is to realize when you are wasting
more time than necessary on a technology that you're treating as some sort of
black box, when you should instead take a step back and learn the basics first.
