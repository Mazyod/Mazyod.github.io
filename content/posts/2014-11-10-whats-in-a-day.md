title: What's in a Day
categories:
- ios
- swift
- xcode
- learn
- rant
- life
- development
- programming
comments: true
date: 2014-11-10 01:46:45+00:00

I had a lovely, and productive day, so might as well end it with a blog post.

## iOS Transitions

In my app update, I am doing some pretty cool, high-profile interactive animation thingies. What is that, you say? To you, I say this:

First, if you are an Android dork, just forget it. There is no way Android will reach this elegance.

Interactive animations are when the animation can either play fully on its own, or be controlled by a gesture from the user:

![image](/images/1.3mb.gif)

I really don't want to explain how they work, as there are [two](http://www.objc.io/issue-12/custom-container-view-controller-transitions.html) of them [tutorials](http://www.iosnomad.com/blog/2014/5/12/interactive-custom-container-view-controller-transitions) that cover the subject pretty thoroughly.

## Design thingies

I came across an app called [Sketch](http://bohemiancoding.com/sketch/). I haven't tried it yet, but it looks pretty insane. I think it's worth taking a look at for any developer out there looking to streamline their development process.

## More Swift

Swift is just full of surprises... I learned that the `didSet`, `willSet` property observers don't get triggered when the property is mutated in the `init` method, and for good reason, if you ask me. For example, if the property is non-optional, the old value will be nil, which doesn't make sense, since it's a non-nilable property... See? Confusing.

The first use-case for the so called property observers was to implement a highlight effect for my custom drawn `UIButtons`. Since I use `PaintCode` to import my assets, all assets are drawn with code. So, I have to subclass `UIButton` to add the drawing code. The point is, I need to call `setNeedsDisplay` when the button state is highlighted. 

To do that, all I did was:

```swift
class VectorizedButton: UIButton {
    override var highlighted: Bool {
        didSet {
            setNeedsDisplay()
        }
    }
}
```

Yeah, I never new you can override properties that way in swift. Pretty freaking awesome, if you ask me.

Even more on swift, `IBDesignable` is a pain to implement. This is one reason why the dynamical nature of ObjC rocks. In order to make a Swift class `IBDesignable`, you need to add it to a separate framework, that can then be built and run by Xcode for interface builder. 

The problem with that is if you have linked against any Objective-C static libraries, the compiler will start crying that you can't do that... I still don't know what the problem is, I just gave up on `IBDesignable`.

## Storyboards

As embarrassing as it is for me to say that, the truth must be told. Today I touched the awesomeness of storyboards, and truly appreciated the power of creating collection view cell prototypes right inside the collection view. So fast, easy and awesome.

The only problem was trying to use autolayout and the transitioning thingies that I mentioned above. It seemed cumbersome, so I gave up on using autolayout for the container view that transitions between the views.

## Conclusion

So many things to say, even more things to do, very limited time to spare... 
