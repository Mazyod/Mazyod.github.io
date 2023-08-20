---
title: 'Verdict: It's a Match!'
category: python
date: 2023-08-20T16:55:23Z
---

## Introduction

Second blog post since forever, and I have no idea what this one should be about. The main problem is I"m writing this a I finish my workout, so I don't have much going on in terms of setup, but that's fine.

After the rant in the last post, I would like to aim for a more informative post this time. Something with more "meat", so to speak. It's not much, but perhaps I'll share my experience using Python's `match` statement; introduced in Python 3.10.

## The Primal Age

In a not so distant past, writing code for checking the structure and types of objects was a huge pain in Python. Here is a real-world example of an object schema:

```python
{
  "job_type": "training",
  "train_config": "some config",
  "min_examples": 10,
}
```

Intuitively, `job_type` value can be one of several predefined values, and based on the `job_type`, we would like to invoke a custom flow, or banch of code if you will. How would one normally handle this in Python?

```python
def handle_job(job: dict):
  job_type = job.pop("job_type")
  if job_type == "training":
    train_job(**job)
  elif ...:
    ...
```

Looks fine to me, what do you think?


