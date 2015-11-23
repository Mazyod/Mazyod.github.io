---
layout: post
title: "Creating A Custom Collection View Layout"
date: 2014-11-08 17:07:11 +0400
comments: true
categories: 
- swift
- collectionview
- layout
- ios
- uikit
- tip
- tutorial
- learn
- custom
---

Today is a sneak peak of my custom Collection View Layout implementation. I wanted it to be as perfect and painless as possible, so I ended up with this:

{% highlight swift %}
override func collectionViewContentSize() -> CGSize {
    let width = self.collectionView?.bounds.width ?? 0
    let height = allMetas.reduce(0) {
        $0 + $1.rect.height
    }
    
    return CGSize(width: width, height: height)
}

override func layoutAttributesForElementsInRect(rect: CGRect) -> [AnyObject]? {
    return allMetas.filter {
        $0.rect.intersects(rect)
    }.map {
        $0.asCollectionViewLayoutAttributes
    }
}

override func layoutAttributesForItemAtIndexPath... {
    return cellMetas[indexPath.item].asCollectionViewLayoutAttributes
}

override func layoutAttributesForSupplementaryViewOfKind... {
    return supplementaryMetas[indexPath.item].asCollectionViewLayoutAttributes
}

override func layoutAttributesForDecorationViewOfKind... {
    return nil
}
{% endhighlight %}

And a preview:

![](http://mazyod.com/images/custom-collection-view-layout.png)

What is this magic, you say? Well, it's thanks to these meta structures that describe our layout for us. Along with some slick swift functional tricks, this code can't get any simpler!

I still need to implement sticky headers, and efficient scrolling, so I'll write a complete post about this when I am done, hopefully!

Shtay tuned!
