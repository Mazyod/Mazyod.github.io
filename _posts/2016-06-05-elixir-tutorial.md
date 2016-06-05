---
layout: post
title: Elixir Tutorial
date: 2016-06-05 21:30:37+0300
categories: 
- elixir
---

## Introduction

This is so nice... I've recently updated my sublime text theme, and the markdown plugin rendering is looking gorgeous.

Ehm, anyways. So, Jim has more ideas to share, and they still keep me up at night. I am not sure what this says about my personality, but usually I find other people's ideas much more fascinating than mine.

So, the idea was to write Elixir tutorials (or a single tutorial, I don't remember). I initially dismissed the idea, since I really didn't go through any useful tutorial at all. Most of my learning was through Elixir talks with practical demos, and by reading source code on github!! But! Just sharing that experience would be a tutorial in itself, so here it goes.

## Elixir?

Oh, yes. What is Elixir? Elixir is a concurrent, functional programming language built on top of Erlang. It brings you all the Erlang goodness that has been developed since 1986, with a clean and nice syntax that is actually usable and easy to work with.

Elixir excels at building highly scalable, fault-tolerant backend systems. Definitely use it to replace your background workers, Redis, RabbitMQ and other services, since Elixir is enough to do all that. As for web services, you can take a look at Phoenix, however, it wouldn't make much sense writing a web app in Phoenix, when Node and Rails exist for that purpose.

## Start Being Functional

I really believe people without object-oriented programming background are the people most suited to learning elixir. This is mainly because Elixir is a functional programing language.

Functional programming is simple and straight forward. The reason most developers I met found it difficult was because they were retrofitting object oriented concepts into this pristine language, which is a Very Bad Idea™.

So, even though I believe that, I am unfortunately burdened with an object-oriented mind while I was learning Elixir. So I have to present this post from the perspective of such persona.

OK, so before we proceed, I am presenting what really helped me get a hang of Elixir as a competent, object-oriented programmer with absolutely no prior experience with functional programming, so here it goes.

### Basics

First of, you need to get your hands dirty with the absolute basics. Don't even worry nor think about OTP, aynsc tasks, and all that exciting goodness. Just focus on the absolute basics, namely:

__Pattern Matching__

Pattern matching is everywhere in Elixir, and comes from Erlang. You must get this out of the way as soon as possible. While you learn pattern matching, you'll also see the different data types in Elixir, hopefully.

For the sake of example, let's put a few code snippets to illustrate:

{% highlight elixir %}
# string pattern matching
string = "I am string"
"I am " <> suffix = string
# suffix is a variable containing "string"

# tuple pattern matching
tuple = {"string", 123}
{"string", num} = tuple
# num is a variable containing 123

# list pattern matching
[head|tail] = [1, 2, 3, 4, 5]
# head contains 1, and tail contains [2, 3, 4, 5]

# map pattern matching
%{"x" => x} = %{"a" => 1, "x" => 2}
# x contains 2
{% endhighlight %}

A few remarks on the code illustrated above:

+ By providing the actual value, such as `"string"`, or `"x"`, that value is checked against by the pattern matching engine for conformance. If a mismatch occurs on a value, an error is raised.
+ On the other hand, providing a variable name, such as `head` or `suffix`, this will __capture__ the matching part into the variable for further processing.
+ Finally, notice that pattern matching on maps is special. Usually, when you pattern match, you have to pattern match against the whole thing. The whole list, or the whole string for example. But for maps, we are ignoring the extra keys we don't care about, and the pattern matching succeeds.

__Modules & Functions__

There is no such things as classes, so we have modules instead. A module is a collection of functions, almost like a namespace, but has other uses. There is not much to cover here, really. You just define a module, write some functions within, and you're done.

{% highlight elixir %}
defmodule MyApp.Calculator do
  def add(x, y) do
    x + y
  end
end

# somewhere else
result = MyApp.Calculator.add(1, 2)
# result contains 3
{% endhighlight %}

+ This should be straight-forward, really. If you come from a language that uses braces or something, just replace them with `do ... end`.
+ Most languages also have `return` keyword, but in elixir, everything is an expression. You don't need to worry about what that means, but just keep in mind that the last statement in the function will automatically be returned.
+ There are no objects, no constructors, no destructors. It's just so simple.

__Standard Library__

The Elixir standard library is quite neat with most of the functionality you'd probably need already built in. You got the usual suspects, like `IO`, `Enum`, `File`, and such. You also have the data types, like `String`, `List`, `Map`, and such.

My best friend when it comes to exploring and learning the standard library is [Dash][dash-link]. [DevDocs][devdocs-link] is a free and open source alternative, but isn't being updated as frequently. It suffers from the relatively high maintenance overhead.

Armed with those tools, you should be good to go. Don't spend too much time goofing around with the tools, once you start building your application, you should be able to pick it up easily without impeding momentum.

## GenServer

This is the last piece of the puzzle. Now, in order to actually build useful applications with Elixir, you really need to master GenServers. They are simple and easy to work with, but may be daunting to the uninitiated.

... After spending about 30 minutes writing about GenServers, I realized it's just too big of a topic to cover here! So, fret not. I simply moved the content I write to a new draft that I will hopefully cover next. For now, spend some time on the topics already covered!!

## Remarks

OK, I lied. There are some missing pieces you should learn and be wary of. Most importantly is message passing. Sending messages between processes is a super important feature to learn and understand properly if you plan on building anything useful with Elixir. 

It's quite a broad topic, but the basics should be simple enough to grasp on your own. I am out of time for now, so maybe it's worth exploring in its own article one day.

## Conclusion

The more Elixir developers out there, the better. If you ever fall in love with it, spread the word! Also, join the [elixir slack channel][elixir-slack], where the core team hangs out. Most importantly, don't give up on Elixir except after attempting to build a full app with it. If that leaves a bad taste in your mouth, then you're allowed to look at alternatives!


[dash-link]: https://kapeli.com/dash
[devdocs-link]: http://devdocs.io/
[elixir-slack]: https://elixir-lang.slack.com
