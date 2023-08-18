title: C++ References
tags: cocos2dx, v3.0, snippets, c++, programming, reference
comments: true
date: 2014-04-05 23:54:47+00:00

This was ... The most annoying this about migrating a project from cocos2dx 2.x to 3.0 is by __far__ this problem, especially if you're an average C++ programmer, like me...

Have a look here:

```cpp
void setThingie(const std::vector<type>& other)
{
    _thingie = other;
}

...

std::vector<type> other;
setThingie(other);
other.push_back(something);

```

Do you see a problem above?

Here is the question:

We are passing the `other` vector by reference, that's as clear as daylight. Then, we mutate it by adding an object. Does that effect the `_thingie` variable? ... The answer is NO-da >.<

The previous containers used in cocos2d-x were all derived from `CCObject`, which meant you had to handle the memory management, as well as use pointers to pass things around. Switching to these objects made my design break.

In the game, I am creating a tree of possible paths, and each node contains a reference to the parent's container, so it can see it's "brothers".

"Why not just give the child a pointer to the parent, and access the container through the parent?"

Of course, I would have done that... The issue is that the parent has four containers, and the child could be in any one of them. It's as if the parent has 4 wives, and I am giving the child a pointer to the wife that gave birth to him!

In any case, with the issue above, the wife- I mean, the parent container was being mutated, but the child didn't know! For example, the wife had a baby, so this child should know he has a brother.

```cpp
// old code:
parent.containers = CCArray::create(4);
child.parentContainer = parent.containers[0];

// new code: BAD - Even by assigning a ref, it gets copied!
parent.containers = std::vector<Vector<Obj *>>(4);
// child.parentContainer is Vector<Obj *>
child.parentContainer = parent.containers[0];

// new code: GOOD - this finally solved it
parent.containers = std::vector<Vector<Obj *>>(4);
// child.parentContainer is const Vector<Obj *>*
child.parentContainer = &parent.containers[0];

```

This isn't all diamonds and roses, it's a very fragile design, unfortunately. By assigning a pointer, we risk having a dangling pointer when the parent goes away before the child, so we must make sure that never happens.

