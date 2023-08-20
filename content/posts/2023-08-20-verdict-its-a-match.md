---
title: 'Verdict: It's a Match!'
category: python
date: 2023-08-20T16:55:23Z
---

## Introduction

Second blog post since forever, and I have no idea what this one should be
about. The main problem is I"m writing this a I finish my workout, so I don't
have much going on in terms of setup, but that's fine.

After the rant in the last post, I would like to aim for a more informative post
this time. Something with more "meat", so to speak. It's not much, but perhaps
I'll share my experience using Python's `match` statement; introduced in Python
3.10.

## The Primal Age

In a not so distant past, writing code for checking the structure and types of
objects was a huge pain in Python. Here is a real-world example of an object
schema:

```python
{
  "job_type": "training",
  "train_config": "some config",
  "min_examples": 10,
}
```

Intuitively, `job_type` value can be one of several predefined values, and based
on the `job_type`, we would like to invoke a custom flow, or banch of code if
you will. How would one normally handle this in Python?

```python
def handle_job(job: dict):
  job_type = job.pop("job_type")
  if job_type == "training":
    train_job(**job)
  elif ...:
    ...
```

Looks fine to me, what do you think?

The main concern that screams danger at me is the full trust we have that the
job is indeed a dict and that is has the key `job_type`. Granted, fixing the
potential `KeyError` is easy, just add a default and you're golden. Regarding
the type assurance, you have to have some level of trust, especially if this is
an internal function that you fully own.

This code is actually perfectly fine, and I wouldn't necessary bark at it during
a code review.

Let's take another, rather similar example:

```python
# snippet from a function that takes an SQLAlchemy orm type and a "dynamic filter",
# and returns a SQLAlchemy filter expression.
#
# e.g.
# ("date", ("2022-01-01", "2023-01-01")) -> orm_type.date.between(date1, date2)
#
if isinstance(filter_, (list, tuple)):
  if len(filter_) == 2 and isinstance(filter_[0], str) and isinstance(filter_[1], (list, tuple)):
    return getattr(orm_type, key).between(filter_[1][0], filter_[1][1])
  elif ...:
    ...
else:
  return filter_
```

If you want to go ahead and gouge your eyeballs out, please, be my guest. I
started this project when my dependencies required me to use Python 3.8, and
then soon after Python 3.9. I remember how badly I wanted to "matchify" this
code...

I mean, even if one is more inclined to make it self-documenting, it may look
something like this:

```python
if isinstance(filter_, (list, tuple)):
  key = filter_[0]
  is_between_expr = len(filter_) == 2 and isinstance(filter[1], (tuple, list)
  if isbetween_expr:
    ...
else:
  return filter_
```

Yikes, doesn't look any better to me, honestly.

## Eye Candy

```python
match filter_:
    case (str() as key, (start, end)):
        return getattr(orm_type, key).between(start, end)
    case (str() as key, str() as value) if re.match(r"^%[^%]+%$", value):
        return getattr(orm_type, key).like(value)
    case (str() as key, value):
        return getattr(orm_type, key) == value
    case (str() as key, str() as operation, _ as value):
        op = getattr(operator, operation)
        return op(getattr(orm_type, key), value)
    case _:
        return filter_
```

Huge sigh of relief! Not only is the code succinct, safe, expressive it's also
self-documenting. Keep in mind this code is deep within the code base, after
Pydantic has done its validation on the input, so no need for us to be pedantic
about it (pun intended). Yet we really do need to check types and structure to
properly determine what to execute.

I can hear you already from shouting from behind the screen:

> "_Actually_, the problem here is the spec itself. It's too vague."

Fair enough. If we had passed the actual operation as some sort of `OP_CODE`
type of thing, parsing would definitely be less hairy. To be completely honest,
this code is not used anymore, lol. But for that time when I needed to quickly
have a simple spec to manage sql filters dynamically, `match` had my back.

## Match Madness

For the final piece of this post, I present you with an actually useful use case
for the `match` statement:

```python
# Recursively parse an SQLAlchemy ORM type, mapping everything to primitive types.
match obj:
    case dict():
        return {
            _to_dict_or_list(k, exclude_refs): _to_dict_or_list(v, exclude_refs)
            for k, v in obj.items()
            if not isinstance(k, str) or not k.startswith("_")
        }
    case tuple() | sa.engine.Row() if hasattr(obj, "_fields"):
        return {
            _to_dict_or_list(k, exclude_refs): _to_dict_or_list(v, exclude_refs)
            for k, v in zip(obj._fields, obj)
        }  # noqa
    case list() | tuple():
        return list(_to_dict_or_list(v, exclude_refs) for v in obj)
    case Enum():
        return obj.value
    case _:
        return copy.deepcopy(obj)

```

Honestly, this looks like a monster. The value of this code will also greatly
diminish once we migrate to SQLAlchemy 2.0 with `Mapped` attributes, but the
main use-case still holds true.

The idea is that working with arbitrary data structures, with various shapes and
sizes, can get out of hand very quickly. Being able to break down the conditions
that need to be met into readable statements goes a long way. This code could
use a bit of cleaning as well, perhaps using local functions to keep each `case`
body as simple as possible, so there is still room to improve beyond just using
`match`.

## Conclusion

I am all for Python's steady march towards the functional paradigm. The less
side-effects, mutation, inheritance, and other monsters you can avoid, the
better off we'll all be. I just wish pipes come very soon. They just can't come
soon enough, that's for sure.
