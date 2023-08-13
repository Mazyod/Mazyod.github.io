title: Diving Into an Existing Project
tags: testing, unit tests, development, programming, snippets
comments: true
date: 2014-03-23 12:53:44+00:00

I am looking into [Test Driven Development (TDD)](http://en.wikipedia.org/wiki/Test-driven_development) these days for the reasons I mention in [this post]({% post_url 2014-03-23-writing-unit-tests %}), and I came across a seemingly famous book called, [Test-Driven iOS Development](http://www.amazon.com/Test-Driven-iOS-Development-Developers-Library/dp/0321774183). I have to say this... Stay away.

Maybe I am enjoying this critic business, but I also like to share my findings and try to raise the expectations for content that users consume. Basically, I found a few flaws in the book that I would like to point out:

### Being a Critic

The thing that really bewildered me is Chapter 3, which presents an example on how to write a simple unit tests in iOS. I mean, this is the most basic example, it should be 100% perfect in every way, since:

1. People reading it will probably fresh to the idea, and accept anything thrown at them.
2. It easily sets a minimum basic standard and norm on how to write tests.

So, what is the problem?

The book tries to describe how you one should choose test cases for a temperature unit conversion app:

> [...] I can see that I might want to test conversions at absolute zero (– 273.15 ° C/– 459.67 ° F) and the boiling point of water (100 ° C/ 212 ° F) to ensure that the conversion method works across a wide choice of input values.
> -- [Test-Driven iOS Development](http://www.amazon.com/Test-Driven-iOS-Development-Developers-Library/dp/0321774183).

I totally agree with "to ensure that the conversion method works across a wide choice of input values". What I totally refuse is the choice of tests!! __It doesn't freakin matter what the boiling point of water is!__ I hope I don't have to look up from wikipedia those numbers to write tests one day...

It should be completely systematic, objective, and ... systematic! So, what you would want to test here is, a positive integer, a negative floating point number, ... etc. __Those__ are the values that would make _much_ more sense to actually test.

## Conclusion

I have been reading books, not as much as I should, but I read a few... Most of them were an utter and complete waste of time. I realize that some authors write a book _for the sake of writing a book_. That is sad.

On the other hand, when you look at a book like [Effective Programming: More Than Just Writing Code](http://www.hyperink.com/Effective-Programming-More-Than-Writing-Code-b1559), which is a compilation of blog posts written deep from within the heart and soul of the author, you actually find invaluable riches.

I know, it seems like this book is the only thing I ever talk about, but I recently realized why I _thought_ I hated reading books. I am hopeful to find more great books that deliver content in such unique manner.
