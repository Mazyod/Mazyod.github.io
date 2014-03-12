---
author: mazyod
comments: true
date: 2014-01-02 13:42:49+00:00
layout: post
slug: creating-a-map-editor-for-a-game-56
title: Creating a Map Editor for a Game (5/6)
wordpress_id: 553
categories:
- Game Development
- Never Ever
tags:
- AppKit
- application
- binding
- cocoa
- coding
- controller
- customize
- Design
- development
- editor
- Game
- map
- model
- MVC
- NSObject
- NSObjectController
- NSOutlineView
- NSTableCellView
- NSTreeController
- objc
- Objective-C
- paradigm
- pattern
- Programming
- rendering
- Software Engineering
- subclass
- tools
- UI
- view
---

_This is the fifth part of a series highlighting the process developing a Map Editor for a game. In the previous posts, we looked at the data model that drives the map editor, and how we are generating C++ code automatically using python scripts. As promised, this part will be all about the Cocoa application, that is, the Map Editor itself._





I believe that there is a very interesting relationship between the size of a development team, the scope of the project, and the number of tools and scripts that have been developed for the project. Obviously, as the number of developers in a team increases, the project can afford to set aside some man hours for tool development that in turn contributes the the success of the project. On the other hand, when you have a small team, there isn't much that you can do except salvage the Internet for tools already developed for you that you can start using immediately. Meh... Let's just get started with the post already.





YES! Today we will actually see the UI of this so-called map editor! :D. I mean, initially I didn't want to divert any attention to the Map Editor itself, since the novelty lies in the data driven process of manipulating the Map Editor's features. Ultimately, I realized there is a lot to learn from the Map Editor UI development side, too. Without further Ado, let us look at how it looks like as of Today!



[![meta](http://mazyod.files.wordpress.com/2013/12/meta.png)](http://mazyod.files.wordpress.com/2013/12/meta.png)

[![prefab](http://mazyod.files.wordpress.com/2013/12/prefab.png)](http://mazyod.files.wordpress.com/2013/12/prefab.png)

[![selection](http://mazyod.files.wordpress.com/2013/12/selection.png)](http://mazyod.files.wordpress.com/2013/12/selection.png)



I thought I'd give a glimpse of the UI before we see the inner details. Mind you, there is no way I can cover all the details exhaustively, but a quick run through all the major components that make this Map Editor possible.





First, I would like to shed some light on the views of the application. We will see the view components in detail, and a little bit of the controller part, too, to get a complete picture regarding the views. Only after we talk about all the views, will we start discussing the application model. So, the first view we will be presenting is the upper left panel that has the basic structure of the map components.






[![meta](http://mazyod.files.wordpress.com/2014/01/meta-e1388638813598.png?w=240)](http://mazyod.files.wordpress.com/2014/01/meta-e1388638813598.png)

Before we see the code for this component, let me try and explain it at a relatively abstract level. This component is referred to as [NSOutlineView](https://developer.apple.com/library/mac/documentation/cocoa/reference/applicationkit/classes/NSOutlineView_Class/Reference/Reference.html). You can provide it with a tree of objects, and it will properly show the objects in a hierarchal fashion. So, when an object has children, it will show the expand triangle to indicate that children exist. That is all there is to it, really. Remember, the UI is not concerned with the implementation details and logic, it is just representing the data for the user.






There are a few things I want to talk about here: How are we supplying the objects to the outline view? How does the outline view know that the object has children, or what to set as the row name?





To answer the first question, we are using an [NSTreeController](https://developer.apple.com/library/mac/documentation/cocoa/reference/applicationkit/Classes/NSTreeController_Class/Reference/Reference.html). This class is just another object controller that can handle a tree of objects. You can think of object controllers as predefined controllers (from the MVC pattern) that can automagically connect a model to a view without writing the controller code yourself. Other examples include an array controller, which you can bind to a table view, and BAM! The table view displays the objects that are inside an array.





[![Screenshot 2014-01-01 21.38.53](http://mazyod.files.wordpress.com/2014/01/screenshot-2014-01-01-21-38-53.png?w=300)](http://mazyod.files.wordpress.com/2014/01/screenshot-2014-01-01-21-38-53.png)With the tree controller representing the model to the outline view, we can then use [Cocoa Bindings](https://developer.apple.com/library/mac/documentation/cocoa/reference/CocoaBindingsRef/CocoaBindingsRef.html) to say something like: "Hey, outline view. Get the object tree from the controller, and fetch the 'label' property from any object inside the tree and use it as the row name". Yeah, sounds crazy, but that's how it works!





What was said previously begs the question: But where does this label come from? Excellent question, Bob. I have been talking about object hierarchy and structure, but I never really talked about the object itself. The objects in the hierarchy are actually instances of a custom class called: ECObject. By looking at the structure of this class, you can easily realize that the properties defined are what we bind to the outline view and tree controller.





    
    <table cellpadding="0" cellspacing="0" class="code_page"><tr><td><span>  1 </span></td><td><div><span style="color:#66D9EF;">@</span><span style="color:#66D9EF;">interface</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">ECObject</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">:</span><span style="color:#F8F8F2;"> </span><span style="color:#A6E22E;">NSObject</span>
    </div></td></tr><tr><td><span>  2 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span>  3 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> Label is set by the user and displayed with the object in the renderer </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span>  4 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F92672;">@</span><span style="color:#F92672;">property</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F92672;">copy</span><span style="color:#F8F8F2;">)</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">NSString</span><span style="color:#F8F8F2;"> *label; </span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> DATA </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span>  5 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> The fixed class_id or prefab_id this object was instantiated from </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span>  6 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F92672;">@</span><span style="color:#F92672;">property</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F92672;">copy</span><span style="color:#F8F8F2;">)</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">NSString</span><span style="color:#F8F8F2;"> *class_id; </span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> LINK </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span>  7 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> The parameters of the prefab </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span>  8 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F92672;">@</span><span style="color:#F92672;">property</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F92672;">copy</span><span style="color:#F8F8F2;">)</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">NSArray</span><span style="color:#F8F8F2;"> *parameters; </span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> INDEPENDENT </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span>  9 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> The child prefabs that this instance can instantiate </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span> 10 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F92672;">@</span><span style="color:#F92672;">property</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F92672;">copy</span><span style="color:#F8F8F2;">)</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">NSArray</span><span style="color:#F8F8F2;"> *prefabs; </span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> CONFIG </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span> 11 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> The children container </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span> 12 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F92672;">@</span><span style="color:#F92672;">property</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">strong</span><span style="color:#F8F8F2;">)</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">NSMutableArray</span><span style="color:#F8F8F2;"> *children; </span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> DATA </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span> 13 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> The links between subjects and observers. Retained for a reason </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span> 14 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F92672;">@</span><span style="color:#F92672;">property</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">strong</span><span style="color:#F8F8F2;">)</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">NSArray</span><span style="color:#F8F8F2;"> *links; </span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> CONFIG </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span> 15 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 16 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> COCOA BINDINGS HELPERS </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span> 17 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> Is this value fixed or can be changed by the user? </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span> 18 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F92672;">@</span><span style="color:#F92672;">property</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F92672;">getter</span><span style="color:#F8F8F2;">=isFixed</span><span style="color:#F8F8F2;">)</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">BOOL</span><span style="color:#F8F8F2;"> fixed; </span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> CONFIG </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span> 19 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> Can the user delete this instance in the GUI? </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span> 20 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F92672;">@</span><span style="color:#F92672;">property</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F92672;">getter</span><span style="color:#F8F8F2;">=isDeletable</span><span style="color:#F8F8F2;">)</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">BOOL</span><span style="color:#F8F8F2;"> deletable; </span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> CONFIG </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span> 21 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 22 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> selection </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span> 23 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F92672;">@</span><span style="color:#F92672;">property</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F92672;">getter</span><span style="color:#F8F8F2;">=isSelected</span><span style="color:#F8F8F2;">)</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">BOOL</span><span style="color:#F8F8F2;"> selected;</span>
    </div></td></tr></table>





[![Screenshot 2014-01-01 21.53.32](http://mazyod.files.wordpress.com/2014/01/screenshot-2014-01-01-21-53-32.png?w=300)](http://mazyod.files.wordpress.com/2014/01/screenshot-2014-01-01-21-53-32.png)Now, regarding how the outline view knows the object has children, this comes for free when we bound it to the tree controller. The tree controller has to be set up with the property that refers to the children in the ECObject. I also set the object type of the tree controller content to ECObject. Note, the image on the left has been photoshoped for brevity sake.





One last thing I would like to cover here are the "Add" and "Delete" buttons. Because I need granular control on adding objects to this outline view, I cannot simply bind the add button to the tree controller (Even though that is possible!!). If we did bind them, what will happen is, an ECObject will be instantiated by passing alloc and then init messages to the ECObject class (a fancy way of saying, [[ECObject alloc] init] is called). That won't do. We need to allocate the ECObject based on the parent's prefab property. For example, from the images in the very beginning, "Objects" has a prefab "MapObject", so we need to allocate an ECObject that has "MapObject" parameters and properties. This is all part of the Model, though, so we will see the details later. The important point here is, we enable "Add" if the ECObject has prefabs, and clicking "Add" will display the prefabs for the user to choose from. After choosing a prefab, an ECObject is instantiated from the prefab and added as a child of the selected ECObject. Delete is simply enabled if the deletable property is true on the ECObject.





I think this covers the components outline view pretty well (this is what I refer to the outline view we just covered). Moving along, we shall now look at the lower left view, which also happens to be an outline view! The difference, though, is that this one is view-based, and the previous was cell based. Don't concern yourself with this difference, though. Anyways, this component is referred to as the parameters outline view, since it displays the parameters of an ECObject. Refer to the previous code snippet, and look for the parameters property.





[![meta](http://mazyod.files.wordpress.com/2014/01/meta1-e1388643846879.png?w=300)](http://mazyod.files.wordpress.com/2014/01/meta1-e1388643846879.png) In the MapMeta example on the left, you can see that based on the parameter's type, we show the appropriate UI component. For example, if the parameter is a boolean, a checkmark is shown. Unfortunately, all we have in this example are numbers, which use an NSTextField component with an attached NSFormatter that makes sure the user enters a valid number. Note how parameters can have children. "map_size" is of type "Size", which is just a parameter with two child number parameters.





Similar to how we used the ECObject class to represent an object in the components outline view, we use ECParameter class here to represent the objects in the parameters outline view. Since it is pretty much the same procedure, I won't bother explain it again. However, one interesting part is how the parameters outline view _morphs_ based on the parameter type! I'll just paste the code that does that. It is located in an NSTableCellView subclass, called ECMorphingCell.





    
    <table cellpadding="0" cellspacing="0" class="code_page"><tr><td><span>  1 </span></td><td><div><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">NSControl</span><span style="color:#F8F8F2;"> *)_morphToSwitchCell</span>
    </div></td></tr><tr><td><span>  2 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  3 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">NSButton</span><span style="color:#F8F8F2;"> *button = </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#66D9EF;">NSButton</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">alloc</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">initWithFrame</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">self</span><span style="color:#F8F8F2;">.bounds</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  4 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">button </span><span style="color:#66D9EF;">setButtonType</span><span style="color:#66D9EF;">:</span><span style="color:#66D9EF;">NSSwitchButton</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  5 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">button </span><span style="color:#66D9EF;">setTitle</span><span style="color:#66D9EF;">:</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  6 </span></td><td><div><span style="color:#F8F8F2;">    </span>
    </div></td></tr><tr><td><span>  7 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">return</span><span style="color:#F8F8F2;"> button;</span>
    </div></td></tr><tr><td><span>  8 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr><tr><td><span>  9 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 10 </span></td><td><div><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">NSControl</span><span style="color:#F8F8F2;"> *)_morphToTextFieldCell</span>
    </div></td></tr><tr><td><span> 11 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 12 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">NSTextField</span><span style="color:#F8F8F2;"> *field = </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#66D9EF;">NSTextField</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">alloc</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">init</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 13 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">return</span><span style="color:#F8F8F2;"> field;</span>
    </div></td></tr><tr><td><span> 14 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr><tr><td><span> 15 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 16 </span></td><td><div><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">NSControl</span><span style="color:#F8F8F2;"> *)_morphToNumberInputCell</span>
    </div></td></tr><tr><td><span> 17 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 18 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">NSNumberFormatter</span><span style="color:#F8F8F2;"> *formatter = </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#66D9EF;">NSNumberFormatter</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">alloc</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">init</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 19 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">formatter </span><span style="color:#66D9EF;">setNumberStyle</span><span style="color:#66D9EF;">:</span><span style="color:#66D9EF;">NSNumberFormatterDecimalStyle</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 20 </span></td><td><div><span style="color:#F8F8F2;">    </span>
    </div></td></tr><tr><td><span> 21 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">NSTextField</span><span style="color:#F8F8F2;"> *field = </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#66D9EF;">NSTextField</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">alloc</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">init</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 22 </span></td><td><div><span style="color:#F8F8F2;">    field</span><span style="color:#F8F8F2;">.formatter</span><span style="color:#F8F8F2;"> = formatter;</span>
    </div></td></tr><tr><td><span> 23 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">return</span><span style="color:#F8F8F2;"> field;</span>
    </div></td></tr><tr><td><span> 24 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr><tr><td><span> 25 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 26 </span></td><td><div><span style="color:#F8F8F2;">...</span>
    </div></td></tr><tr><td><span> 27 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 28 </span></td><td><div><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">NSControl</span><span style="color:#F8F8F2;"> *)_resolveParameter:(ECParameter *)param</span>
    </div></td></tr><tr><td><span> 29 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 30 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">id </span><span style="color:#F8F8F2;">value = param</span><span style="color:#F8F8F2;">.value</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 31 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">NSString</span><span style="color:#F8F8F2;"> *content = param</span><span style="color:#F8F8F2;">.content</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 32 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">NSString</span><span style="color:#F8F8F2;"> *enums = param</span><span style="color:#F8F8F2;">.enumRef</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 33 </span></td><td><div><span style="color:#F8F8F2;">    </span>
    </div></td></tr><tr><td><span> 34 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">content || enums)</span>
    </div></td></tr><tr><td><span> 35 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 36 </span></td><td><div><span style="color:#F8F8F2;">        ...</span>
    </div></td></tr><tr><td><span> 37 </span></td><td><div><span style="color:#F8F8F2;">    }</span>
    </div></td></tr><tr><td><span> 38 </span></td><td><div><span style="color:#F8F8F2;">    </span>
    </div></td></tr><tr><td><span> 39 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">else</span><span style="color:#F8F8F2;"> </span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">value </span><span style="color:#66D9EF;">isKindOfClass</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">[</span><span style="color:#66D9EF;">NSString</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">class</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span> 40 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 41 </span></td><td><div><span style="color:#F8F8F2;">        self</span><span style="color:#F8F8F2;">.type</span><span style="color:#F8F8F2;"> = eMorphingCellTypeText;</span>
    </div></td></tr><tr><td><span> 42 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F92672;">return</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">self</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">_morphToTextFieldCell</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 43 </span></td><td><div><span style="color:#F8F8F2;">    }</span>
    </div></td></tr><tr><td><span> 44 </span></td><td><div><span style="color:#F8F8F2;">    </span>
    </div></td></tr><tr><td><span> 45 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">else</span><span style="color:#F8F8F2;"> </span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">value </span><span style="color:#66D9EF;">isKindOfClass</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">[</span><span style="color:#66D9EF;">NSNumber</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">class</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span> 46 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 47 </span></td><td><div><span style="color:#F8F8F2;">        CFNumberType numberType =</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">CFNumberGetType</span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">(CFNumberRef)value);</span>
    </div></td></tr><tr><td><span> 48 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F92672;">switch</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">numberType)</span>
    </div></td></tr><tr><td><span> 49 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 50 </span></td><td><div><span style="color:#F8F8F2;">            </span><span style="color:#F92672;">case</span><span style="color:#F8F8F2;"> </span><span style="color:#AE81FF;">kCFNumberCharType</span><span style="color:#F8F8F2;">:</span>
    </div></td></tr><tr><td><span> 51 </span></td><td><div><span style="color:#F8F8F2;">                self</span><span style="color:#F8F8F2;">.type</span><span style="color:#F8F8F2;"> = eMorphingCellTypeSwitch;</span>
    </div></td></tr><tr><td><span> 52 </span></td><td><div><span style="color:#F8F8F2;">                </span><span style="color:#F92672;">return</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">self</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">_morphToSwitchCell</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 53 </span></td><td><div><span style="color:#F8F8F2;">                </span>
    </div></td></tr><tr><td><span> 54 </span></td><td><div><span style="color:#F8F8F2;">            </span><span style="color:#F92672;">default</span><span style="color:#F8F8F2;">:</span>
    </div></td></tr><tr><td><span> 55 </span></td><td><div><span style="color:#F8F8F2;">                self</span><span style="color:#F8F8F2;">.type</span><span style="color:#F8F8F2;"> = eMorphingCellTypeNumber;</span>
    </div></td></tr><tr><td><span> 56 </span></td><td><div><span style="color:#F8F8F2;">                </span><span style="color:#F92672;">return</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">self</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">_morphToNumberInputCell</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 57 </span></td><td><div><span style="color:#F8F8F2;">        }</span>
    </div></td></tr><tr><td><span> 58 </span></td><td><div><span style="color:#F8F8F2;">    }</span>
    </div></td></tr><tr><td><span> 59 </span></td><td><div><span style="color:#F8F8F2;">    </span>
    </div></td></tr><tr><td><span> 60 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">value)</span>
    </div></td></tr><tr><td><span> 61 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 62 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">        </span><span style="color:#66D9EF;">NSLog</span><span style="color:#F8F8F2;">(</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">Warning: unresolved object type: %@</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">, value);</span>
    </div></td></tr><tr><td><span> 63 </span></td><td><div><span style="color:#F8F8F2;">    }</span>
    </div></td></tr><tr><td><span> 64 </span></td><td><div><span style="color:#F8F8F2;">    </span>
    </div></td></tr><tr><td><span> 65 </span></td><td><div><span style="color:#F8F8F2;">    self</span><span style="color:#F8F8F2;">.type</span><span style="color:#F8F8F2;"> = eMorphingCellTypeNone;</span>
    </div></td></tr><tr><td><span> 66 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">return</span><span style="color:#F8F8F2;"> </span><span style="color:#AE81FF;">nil</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 67 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr></table>





I will only mention that this is all pretty straight forward, except the **enum and options** type. When the type of a ECParameter is an enum, we need to show a combo box with the available enums. Similarly, if the type is a list of options (strings). This is a bit more involved, were we query the "Model Manager" for these options, and assign them to a combo box so the user can see his options.





**DAMN IT!! I PUBLISHED THE POST BY MISTAKE!!** I am typing the rest right now...





Anyways, all I have left is the rendering view, which renders all the entities as visual objects the user can interact with. It might look a bit complicated, but it is actually quite simple.





[![prefab](http://mazyod.files.wordpress.com/2014/01/prefab-e1388670561213.png?w=300)](http://mazyod.files.wordpress.com/2014/01/prefab.png) The basic idea behind this is: I subclassed NSView and overrided drawRect: in order to render the Model. Inside the view, I dispatch a timer that calls setNeedsDisplay 2 times per second, so I don't have to worry about the model changing at all. This is a less efficient polling approach, but works really well, so meh. Then, within drawRect:, I get the model, and do some quartz drawing! I'll post some code so you can get the main idea:




    
    <table cellpadding="0" cellspacing="0" class="code_page"><tr><td><span>  1 </span></td><td><div><span style="color:#F8F8F2;">- (</span><span style="color:#66D9EF;">void</span><span style="color:#F8F8F2;">)drawRect:(</span><span style="color:#66D9EF;">CGRect</span><span style="color:#F8F8F2;">)r</span>
    </div></td></tr><tr><td><span>  2 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span>  3 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> Get all the data model </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span>  4 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">NSArray</span><span style="color:#F8F8F2;"> *meta = </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">ECDataBank </span><span style="color:#66D9EF;">sharedBank</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">mapMeta</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  5 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">NSArray</span><span style="color:#F8F8F2;"> *objs = </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">ECDataBank </span><span style="color:#66D9EF;">sharedBank</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">mapObjects</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  6 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">NSArray</span><span style="color:#F8F8F2;"> *zones = </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">ECDataBank </span><span style="color:#66D9EF;">sharedBank</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">mapZones</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  7 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">NSArray</span><span style="color:#F8F8F2;"> *spawns = </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">ECDataBank </span><span style="color:#66D9EF;">sharedBank</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">mapSpawnAreas</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span>  8 </span></td><td><div><span style="color:#F8F8F2;">    </span>
    </div></td></tr><tr><td><span>  9 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">int</span><span style="color:#F8F8F2;"> padding = </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">meta</span><span style="color:#F8F8F2;">[</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">padding</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">[</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">value</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">intValue</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 10 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">NSArray</span><span style="color:#F8F8F2;"> *size = meta</span><span style="color:#F8F8F2;">[</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">map_size</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">[</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">children</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 11 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">CGSize</span><span style="color:#F8F8F2;"> mapSize =</span>
    </div></td></tr><tr><td><span> 12 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 13 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#AE81FF;">2</span><span style="color:#F8F8F2;">*padding + </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">size</span><span style="color:#F8F8F2;">[</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">width</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">[</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">value</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">doubleValue</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">,</span>
    </div></td></tr><tr><td><span> 14 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#AE81FF;">2</span><span style="color:#F8F8F2;">*padding + </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">size</span><span style="color:#F8F8F2;">[</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">height</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">[</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">value</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">doubleValue</span><span style="color:#F8F8F2;">]</span>
    </div></td></tr><tr><td><span> 15 </span></td><td><div><span style="color:#F8F8F2;">    }</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 16 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> map size is used to compute the transform </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span> 17 </span></td><td><div><span style="color:#F8F8F2;">    self</span><span style="color:#F8F8F2;">.mapSize</span><span style="color:#F8F8F2;"> = mapSize;</span>
    </div></td></tr><tr><td><span> 18 </span></td><td><div><span style="color:#F8F8F2;">    </span>
    </div></td></tr><tr><td><span> 19 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#66D9EF;">id </span><span style="color:#F8F8F2;">selection = </span><span style="color:#AE81FF;">nil</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 20 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> render the objects as a box on the tilemap </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span> 21 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F92672;">for</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#66D9EF;">NSArray</span><span style="color:#F8F8F2;"> *obj in objs)</span>
    </div></td></tr><tr><td><span> 22 </span></td><td><div><span style="color:#F8F8F2;">    </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 23 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F92672;">if</span><span style="color:#F8F8F2;"> </span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">obj</span><span style="color:#F8F8F2;">[</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">isSelected</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">boolValue</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">)</span>
    </div></td></tr><tr><td><span> 24 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">{</span>
    </div></td></tr><tr><td><span> 25 </span></td><td><div><span style="color:#F8F8F2;">            selection = obj;</span>
    </div></td></tr><tr><td><span> 26 </span></td><td><div><span style="color:#F8F8F2;">        }</span>
    </div></td></tr><tr><td><span> 27 </span></td><td><div><span style="color:#F8F8F2;">        </span>
    </div></td></tr><tr><td><span> 28 </span></td><td><div><span style="color:#F8F8F2;">        rect = </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">self</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">_rectFromObject</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">obj</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 29 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">rects </span><span style="color:#66D9EF;">addObject</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">[</span><span style="color:#66D9EF;">NSValue</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">valueWithRect</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">rect</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 30 </span></td><td><div><span style="color:#F8F8F2;"> </span>
    </div></td></tr><tr><td><span> 31 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#66D9EF;">NSColor</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">colorWithCalibratedWhite</span><span style="color:#66D9EF;">:</span><span style="color:#AE81FF;">0.6</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">alpha</span><span style="color:#66D9EF;">:</span><span style="color:#AE81FF;">1.0</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">set</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 32 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">[</span><span style="color:#66D9EF;">NSColor</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">blackColor</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">setStroke</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 33 </span></td><td><div><span style="color:#F8F8F2;">        </span>
    </div></td></tr><tr><td><span> 34 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">        </span><span style="color:#66D9EF;">CGContextAddRect</span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">ctx, rect);</span>
    </div></td></tr><tr><td><span> 35 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">        </span><span style="color:#66D9EF;">CGContextDrawPath</span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">ctx, </span><span style="color:#AE81FF;">kCGPathFillStroke</span><span style="color:#F8F8F2;">);</span>
    </div></td></tr><tr><td><span> 36 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#75715E;">/*</span><span style="color:#75715E;"> render the name of the object on the top left </span><span style="color:#75715E;">*/</span>
    </div></td></tr><tr><td><span> 37 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">        </span><span style="color:#66D9EF;">CGContextConcatCTM</span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">ctx, </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">self</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">_textTransfromForRect</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">rect</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">);</span>
    </div></td></tr><tr><td><span> 38 </span></td><td><div><span style="color:#F8F8F2;">        </span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">obj</span><span style="color:#F8F8F2;">[</span><span style="color:#E6DB74;">@"</span><span style="color:#E6DB74;">name</span><span style="color:#E6DB74;">"</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">drawInRect</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">rect </span><span style="color:#66D9EF;">withAttributes</span><span style="color:#66D9EF;">:</span><span style="color:#AE81FF;">nil</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">;</span>
    </div></td></tr><tr><td><span> 39 </span></td><td><div><span style="color:#F8F8F2;"></span><span style="color:#F8F8F2;">        </span><span style="color:#66D9EF;">CGContextConcatCTM</span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">ctx,</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">CGAffineTransformInvert</span><span style="color:#F8F8F2;">(</span><span style="color:#F8F8F2;">[</span><span style="color:#F8F8F2;">self</span><span style="color:#F8F8F2;"> </span><span style="color:#66D9EF;">_textTransfromForRect</span><span style="color:#66D9EF;">:</span><span style="color:#F8F8F2;">rect</span><span style="color:#F8F8F2;">]</span><span style="color:#F8F8F2;">));</span>
    </div></td></tr><tr><td><span> 40 </span></td><td><div><span style="color:#F8F8F2;">    }</span>
    </div></td></tr><tr><td><span> 41 </span></td><td><div><span style="color:#F8F8F2;">    </span>
    </div></td></tr><tr><td><span> 42 </span></td><td><div><span style="color:#F8F8F2;">    ...</span>
    </div></td></tr><tr><td><span> 43 </span></td><td><div><span style="color:#F8F8F2;">}</span>
    </div></td></tr></table>





Actually, there is one really cool and super complicated part in this: **The ISO Transform!** I am sure you noticed, the map is skewed and rotated. The (0,0) point in the map is the top middle block, which is not the same as the regular cocoa coordinate system, where (0,0) is in the bottom left. We achieve that by transforming the renderer to achieve that ISO look. The biggest challenge is not that, though. It is mapping the mouse events to the transformed coordinates! So, we know that our custom NSView has (0,0) at the bottom left, but we want the mouse to give us (0,0) when we click at the top of the map! We achieve that through affine transforms, which I won't bother explaining! :D





## Conclusion:





Actually, writing about the model of this application will take a while, might as well take that on in part 6... So, make sure you come back for that one, too!
