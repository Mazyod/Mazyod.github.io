title: Async Pipes
tags: programming
date: 2022-03-10T03:55:23Z


## Introduction

Over the past couple of posts, I explored basic parallelism in Python with the help of Ray. Since then, I've adopted the library in my work and built some pretty cool things with it, all of which I would like to cover in detail someday:

- _Actor Pools_: I've touched on the topic briefly in the last post.
- _Worker Queues_: Implementing a robust queue with progress updates around Ray workers.
- _Async Pipeline_: Implementing a flexible, reusable data processing pipeline with Ray.

Since I would like to cover the Async Pipelines in this post, let's see what they're all about, shall we?

## The Shrinking Middle Class

Before we can talk about async pipelines, we must first talk about the shrinking Middle Class.

I follow U.S. politics simply because it's interesting to me. You could say it's the same reason I watch shows on Netflix, or browse YouTube for Mario speedruns. One key topic that keeps being brought in U.S. politics up is the problem of "The Shrinking Middle Class".

Given the existence of a Middle Class, this means that there is also an Upper Class and a Lower Class. The Upper Class are your CEOs, Investors, and Leaders of the nation. Although they are a small percentage, but effectively they are responsible for most of the **jobs** in the country.

The Lower Class, on the other hand, are your student-debt ridden youth and immigrants who are left to pick up the slack, doing meaningless jobs that no one else wants to do.

So, what is the problem if the Middle Class is shrinking?

Well, people in the Lower Class might lose hope of one day reaching the Middle Class, given its inevitable demise. The people of the Upper Class won't have people doing the interesting work for them, slowing down innovation and economical growth.

I know what you're thinking right about now. How on earth is this remotely relevant to the topic of this post?

Glad you asked.

## Scaling the Middle Class

Aside from my need for parallelism in Python to simply scale a worker pool that handles API requests, I also needed that same pool to process work within a data pipeline.

The data pipelines I have usually involves one (or a few) data generators that are simply Python generators that generate data for processing. (Say, _generate_, one more time...)

That's your Upper Class.

Data is then consumed by workers that perform some _interesting_ processing, generating a result. This processing is where the bulk of the CPU cycles go to.

That's your Middle Class.

Finally, a collector collects the results and commits them to a database, taking care of any data inconsistencies and reporting the results at the end.

That's your Lower Class.

And hence, our goal today is to scale the Middle Class only, in order to process as much data as possible, maximizing CPU utilization (productivity) along the way.

## Fan-out & Fan-in

Let's try our hands on a basic approach to tackle the problem statement above, shall we?

```python
import time
from concurrent.futures import ThreadPoolExecutor

def work(data):
	time.sleep(1)
	return "done"

def callback(future):
	print(future.result())

with ThreadPoolExecutor() as executor:
    for data in data_generator:
        future = executor.submit(work, data)
        future.add_done_callback(callback)
```

This is fine ... except, the whole place is on fire, and I'm too busy supressing the cringe to care. Let's ignore the fact that we are using threads here, because that part is just for demonstration purposes.

My issue with this code is the nesting and lack of clarity. I also believe the `data_generator` will fill up the executor as fast as it possibly can, which can lead to memory growth. Back-pressure to limit the data generator output would be nice, too. This problem also makes it harder to track our progress of how much data was processed.

Finally, we are in an era of `async` / `await`. I don't even want to try throwing that into the mix, in fear of reaching depths for which there is no escape.

(_DISCLAIMER_: I have to admit though, I didn't expect to come up with a palatable solution on the fly for this problem, lol. I spent way too much time solving it in our project)

## I Hereby Declare

... the scalability of the Middle Class!

```python
await async_flow.pipeline(
    async_flow.Layer(data_generator),
    async_flow.Layer(work, 8),
    async_flow.Layer(callback),
)
```

`async_flow` is the basic utility I prepared in order to reuse the scalability semantics across the project. The details of the utility is too much to cover in this post, but it basically has two types:

- `Layer`: Declaring a function, optionally scaling it as needed.
- `pipeline`: To declare your `Layer`s in for execution

Not only is it a pleasure to just look at, but it also supports back-pressure, because the `Layer` objects passed in are stitched togething using `asyncio.Queue`. This way, if the `work` `Queue` object is full, for example, the `data_generator` will patiently block on the `await queue.put(data)` statement till it's free.

## Conclusion

Although I meant to cover a little more details about `async_flow`, or at least give a full working example for that matter, I spend too much time on the introduction and now it's getting late. Regardless, the internals are worthy of a whole post on it's own.
