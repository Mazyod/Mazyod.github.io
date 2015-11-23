---
layout: post
title: "UITableViews and Enums"
date: 2014-03-26 19:50:24 +0400
comments: true
categories: 
- ios
- objective-c
- pro-tip
- snippets
- programming
- development
- enums
- uitableview
---

I discovered a very nifty code in our iOS project, and I will probably start using it forever. It makes the `UITableViewDataSource` code much more readable and manageable without using "magical numbers" (hard coded values) by utilizing enums.

### UITableViewDataSource

As we all (should) know, in order to use a slightly dynamic table view in iOS, we create a `UITableView` and hook that with a delegate and dataSource. The dataSource is responsible for telling the table view how many sections and rows it has, as well as provide the actual `UITableViewCell` instance.

Here is what we are typically looking at:

{% highlight objc %}
#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return NUMBER_OF_SECTIONS;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return NUMBER_OF_ROWS_FOR_SECTION(section);
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *CellIdentifier = @"Cell";
    KIAlertCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    
    cell.textLabel.text = SOMETHING;
    
    return cell;
}

{% endhighlight %}

Now, the ALL_CAPS_WORDS in the code are just placeholders to indicate what we should fill them in with something reasonable.

Sometimes, the developer doesn't even have sections to display, hence they don't need to return the number of sections, or hard coding it to `1` is fine. Another case would be that the sections are loaded from a backend service or a persistent store, in which case, there is nothing to be hard coded, so that is dandy as well.

### Dealing with static tables

Our use case is gonna be a static table that is just gonna be defined in the code for maximum simplicity. Let's just look at the solution:

{% highlight objc %}
typedef NS_ENUM(NSInteger, KITableViewSections)
{
    KITableViewSectionOne,
    KITableViewSectionTwo,
    KITableViewSectionThree,
    KITableViewSectionCount
};

...

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return KITableViewSectionCount;
}

{% endhighlight %}

The advantages of using the above setup are really awesome:

1. Adding/removing a sections only requires editing this enum definition. The count is updated automatically.
2. If you need to do control flow logic that is based on the section, you can use `if (section == KITableViewSectionOne)` check, which is much more readable than using a number.

## Conclusion

While writing this, I also realized that I would _probably_ never use this myself. This approach is _much_ better than hard coded values, but it is still _considerably_ worse than using a persistent, data-driven approach, which would allow you to change your table view properties without editing a single line of code.

Actually, I was gonna write about this persistent approach a while back, back in the old blog days, but I never came around to it. I should do that someday.
