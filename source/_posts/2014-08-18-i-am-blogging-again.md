---
layout: post
title: "I Am Blogging, Again!"
date: 2014-08-18 18:04:32 +0400
comments: true
categories: 
- rant
- blogging
- technology
- philosophy
---

Holy crap... It has been so long since I last blogged, I missed this awesome feeling of typing things into the computer. In any case, onto the blog!

## Introduction

I have came into an important realization today, and that is, the programmer's philosophy. I am not sure if there is such a thing, but if there isn't, there sure should be one and it should be taught to all programmers..

## Time to Get Philosophical

What is programming? Jk, not **that** philosophical, just a tad bit.

Before a programmer writes code, there must be something that they want to achieve. That goal is (in most cases) well defined, and can be verified. The approach the programmer takes to achieve that goal can be in so many different ways, I dare say infinite.

Recently, I found myself writing contradicting code. This is because my philosophy hasn't been laid out before hand, and the span of the project exceeds a whole year, which made me change philosophies quite often...

## Time to Get Practical

In my example, I'll talk about this game backend I have been writing...

So, writing backend code is awesome. There is no GUI involved, it is just pure data manipulation.

Initially, I started writing and designing the backend in such a way that the client doesn't compute the "business logic". This means, that the backend does the computation for the frontend, and sends the result...

Today, I while I was implementing this new feature, I decided I want the client to compute the result instead, forgetting that the rest of the code depends on the fact that the backend should compute the logic! I did that because I was thinking about moving computation costs to the frontend.

The moment I realized how I had set everything else up to compute the results in the backend, I switched the implementation to follow that philosophy immediately, and that's when I came with this important realization...

## Time to Realize Things

First, my former self is no idiot. He didn't decide to compute the logic on the backend for no reason! It was because of security concerns, and that was arguably the right choice, I can still see that.

The issue, though, is when I tried to make the frontend compute the result, I kept bumping into hurdles and obstacles that were very annoying. I am suppose to be at a stage of development where the base is all laid out, why the hell is it so hard to add this simple thing!!

Yes, the realization being, I'm doing it wrong! It is a relief that I am in sync with my former self, so I consulted him, and he told me about the computation thingie... The problem begins when you start working with a team or an open source project. 

## Conclusion

I love how python, lua, and many language specify their philosophies, but I don't think there are enough of them out there.

