---
layout: post
title: "Mother Flippin C++"
date: 2014-04-07 22:14:19 +0400
comments: true
categories: 
- c++
- cocos2d-x
- rapidjson
- linker
- error
- rant
---

I have spent a considerable amount of time due mainly to my lack of C++ knowledge, but I can't help but blame the [mother flippin](http://www.youtube.com/watch?v=TwJheWwW7rw) C++ compiler and rapidjson developers... (P.S link is SFW).

In C++, there is a concept known as sending an object by value, as a whole. We don't see that in Objective-C nor Java, let alone scripting or higher level languages. That object you pass around by value gets copied implicitly, sometimes:

{% highlight c++ %}
class Car
{
    std::string model;
};

void printCar(Car car)
{
    std::cout << car.model << std::endl;
}

int main()
{
    Car car;
    printCar(car);

    return 0;
}

{% endhighlight %}

A very basic entry level C++ example (that I hope I didn't mess up). Sending `Car` this way will **implicitly** invoke the copy constructor, since:

1. We are passing `car` by value.
2. We aren't invoking the copy constructor explicitly, so it is implicit.

This can obviously get very dangerous if you are not careful, since the car object can get pretty damn big. Hence, some developers, especially ones writing reusable code, such as a library, can add restrictions to stop you from making this mistake.

In [rapidjson](https://code.google.com/p/rapidjson/wiki/UserGuide), the developers chose to simply override the freakin copy constructor and make it completely unavailable. To my _extreme_ misfortune, I was doing an implicit copy to a JSON object, and the library didn't like it.

Fine, just change it? Well, that's easy to say after I figured out the freaking problem!! The error was so absurdly vague, it made me grow a few white hairs. The error was so bad because, for one, it was a linker error, and second, it was something like:

{% highlight text %}
Undefined symbols for architecture i386:
rapidjson::GenericValue<rapidjson::UTF8<char>, rapidjson::MemoryPoolAllocator<rapidjson::CrtAllocator> >::GenericValue(rapidjson::GenericValue<rapidjson::UTF8<char>, rapidjson::MemoryPoolAllocator<rapidjson::CrtAllocator> > const&)

{% endhighlight %}

If you haven't realize it , the second line is a single type... `ლ(ಠ益ಠლ)`. It's equivalent, in a sense, to `int` or `std::string`. Yeah, that is totally ambiguous.

Let's break it down:

{% highlight c++ %}
rapidjson::GenericValue
<
    rapidjson::UTF8<char>, 
    rapidjson::MemoryPoolAllocator
    <
        rapidjson::CrtAllocator
    >
>::GenericValue(rapidjson::GenericValue
<
    rapidjson::UTF8<char>, 
    rapidjson::MemoryPoolAllocator
    <
        rapidjson::CrtAllocator
    > 
> const&)

{% endhighlight %}

**I REPEAT... THAT IS A SINGLE TYPE!!!!!**

"Yo, Joe. Can you implement this _simple_ algorithm for me in C++? Oh look, you probably finished it... Wait, what? That is just you declaring a variable?"

![](/images/yao-ming-rage-face.png)

Now, the C++ compiler is blamed for throwing such an undebuggable error, and the rapidjson developers are blamed for not using `explicit` keyword on the copy constructor.

Explicit copy constructors is a concept one of the developers at Sourcebits taught me, which is quite something. You can mark a copy constructor with an `explicit` keyword, which will make an object throw a **compilation** error if it was gonna be copied implicitly. It also gives the developer an option to copy the object explicitly, since he's doing it, well, explicitly.

## Conclusion

I have already downloaded Unity3D, but I can't make myself abandon what I started, so I'll see this through, and see if I can retain my sanity before this project ends...

