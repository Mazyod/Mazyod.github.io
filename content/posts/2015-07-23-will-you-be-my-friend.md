title: Will You Be My Friend?
categories:
- friend
- poco
- pocoproject
- class
- c++
- programming
- tips
- nullable
- optional
- template
- safety
- encapsulation
- oop
- design
comments: true
date: 2015-07-23 23:37:28+00:00

## Introduction

A friend is someone who you can share __private__ secrets with, and they will never betray that trust. A friend is someone __you choose__, not the other way around. A friend makes your life __safe__ by helping you out.

In short .. Friends are awesome. 

## Friends in C++

In C++, we have things called "friend classes". I remember our TA at college making fun of us when we answered the trick question "Can private members ever be exposed to an outside class?" wrongly..

Ehm, anyways. As mentioned in the introduction, a friend class is a class you share your __private__ members with. You __choose__ which classes are your friends by declaring them as friend classes in the class definition. Finally, as we will see, this feature will allow you to __safely__ control access to specific "dangerous" members.

The best thing about this feature is the syntax. The word "friend" is just so expressive, and to use it is a simple one liner:

```cpp
struct Block {

    Block(short row, short col);

private:

    Block() {};

    short _row;
    short _col;

    friend class TheFriendClass;
};
```

## Use Case

After writing Swift code, and dealing with optionals, I really fell in love with this concept (Optionals). It eliminated null pointers and empty value issues in one go. Now that I am working on a C++ project; luckily, I found that [POCO](http://pocoproject.org) has Optionals (and Nullables)! I started using this feature heavily right away.

The biggest issue that I faced was that, in order to use `Poco::Nullable`, the type had to have the default, no-argument constructor. This is because the `Nullable` class had to always initialize the type memory to _something_, even if it was null. Of course, pointers weren't used, because if you want dynamic allocation, just go use `std::shared_ptr` instead.

What if the type you want to use with `Nullable` doesn't provide a default, no-argument constructor because it doesn't make sense to have one? Yeah, it should be obvious now ... Friend dat class!

By looking at the example above, and replacing `TheFriendClass` with `Poco::Nullable<Block>`, we safely expose the unreliable no-argument constructor only to the `Nullable` class, so it can just initialize that memory to something. So, we are 100% certain now, that `Block` objects can't be initialized with the default constructor, unless they are safely within the `Nullable` class, which won't operate on the instantiated instance, anyway!

## Conclusion

`Nullable` implementation wouldn't be possible without generics, and thankfully, C++ had that feature way back. I still get developers asking, "Are generics really useful?". Yes. Yes they are.
