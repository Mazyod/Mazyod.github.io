title: Generic Constraints with Optionals
tags: swift, code, programming, xcode, generics, optional, nullability, conformance, inheritance, typealias, constraints
comments: true
date: 2015-11-20 13:13:34+00:00

## Introduction

Recently, I've been spending a lot of time polishing and testing a collection of Swift frameworks and releasing them on github. [You can see the website here](http://kitz.io).

The lessons learned from this experience were unbelievable. There is way more to Swift that I could have ever imagined. The fun part is, each kit in the project comes with its own design problems, and hence requires different approaches and tapping into more amazing Swift features.

For this post, I'll be going over a design challenge I faced when writing [Storez](https://github.com/SwiftKitz/Storez). 

## Conformance

So, Storez is a a very flexible Key/Value store for Swift that allows end-developers to easily define their keys in a type-safe manner (with custom behaviors). The biggest challenge faced when doing that is the "type-safe" part. How do you ensure that?

Well, let's take the `UserDefaultsStore` as an example. It uses `NSUserDefaults` as an underlying persistence store. `NSUserDefaults` doesn't support every single type of object, only a certain subset. How do we make sure that objects to be stored can be serialized to those types?

Protocol conformance is the key! By defining the following protocol:

```swift
// inherits from class, since we need to cast it to AnyObject
protocol UserDefaultsSerializable: class {}
```

We can then "tag" the classes which are supported by the store:

```swift
extension NSNumber: UserDefaultsSerializable {}
extension NSDate: UserDefaultsSerializable {}
extension NSData: UserDefaultsSerializable {}
...
```

Now, we write two simple `get` and `set` functions to access the store:

```swift
func get<V: SerializableType>(key: String) -> V? {
    return defaults.objectForKey(key) as? V
}

func set(key: String, value: SerializableType?) {
    
    defaults.setObject(value, forKey: entry.key)
    defaults.synchronize()
}
```

The above code is a complete example of providing a safe API on top of `NSUserDefaults`... But, adding custom type support would be nice, won't it?

## Convertibles

This time, we use "conformance" to provide a set or rules for custom objects that want to store themselves in the key-value store. Here is the one written in Storez:

```swift
/** Other types can conform to this protocol to add  support.
    It simply requires the class to convert to and from one of
    the supported types.
*/
public protocol UserDefaultsConvertible {

    typealias UnderlyingType: UserDefaultsSerializable
    
    static func decode(value: UnderlyingType) -> Self?
    var encode: UnderlyingType? { get }
}
```

This is really interesting, isn't it? First, we provide a generic type requirement, which is furthermore constrained to a `UserDefaultsSerializable` type. Then, the conforming type needs to provide two function implementations, one for decoding (de-serializing), and one for encoding (serializing).

Note, even an enum can easily be a conforming type! Since it is a pure Swift protocol, there are absolutely no limitations to which type can add support.

One last caveat remains .. What about non-optionals? If you look closely at the `get` function, it always returns an optional. What if we wanted to support non optional values, that return some default value when the persisted value doesn't exist? This presents its own set of challenges, since we now have to provide two separate flows for option, and non-optional types.

Read on...

## Get Under Optional Skin

Let's first see how we provide the two `get` variations:

```swift
public func get<E: EntryType where E.ValueType: SerializableType>(entry: E) -> E.ValueType {
    return _get(entry.key) ?? entry.defaultValue
}

public func get<E: EntryType, V: SerializableType where E.ValueType == V?>(entry: E) -> V? {
    return _get(entry.key)
}
```

So, what do we have here... The first method is the "nonnull" variant which always returns a non-optional value, while the second method simply returns a nullable value.

The key difference between these two methods is the way we check to make sure that the value conforms to `UserDefaultsSerializable` type. In the first method, it's pretty straight forward. We immediately assert that the `ValueType` of the `EntryType` is a conforming type.

For optionals, it was whole journey to reach this final, succulent form. When you look at it now, it feels very natural and straight-forward! It basically says: Define two generic types, one is the `EntryType` and another is a value type that conforms to `UserDefaultsSerializable`. Then, simply make sure that the `EntryType`'s `ValueType` is an optional of the conforming value type!

## Conclusion

The power of Swift is just mind blowing. I've worked quite a bit with C++ generics, and they are much more flexible, but no where as safe and well defined as Swift's.
