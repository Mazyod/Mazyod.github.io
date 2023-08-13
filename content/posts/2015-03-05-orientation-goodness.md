title: Orientation Goodness
categories:
- ios
- swift
- ios
- rotation
- orientation
- animation
- transition
- view
- controller
- size
- change
- switch
- snippet
comments: true
date: 2015-03-05 23:02:11+00:00

## Introduction

This one is a quicky, due to bad time management from my end .. It is simply about showing two view controllers, and we transition between them as the user rotates the device.

## Failing

The app that requires this feature has already been developed, and the view hierarchy seemed to rigid to change and refactor, so as an ideal quick solution, I went with ...

### Change the RootViewController

Trying to change the `rootViewController` on the `window` property in AppDelegate seemed to be the best choice. I use this approach in other apps to show a login screen, so I'm familiar with it, as well..

To do this, I simple make the `UIDevice` generate rotation notifications, then respond to these notifications by changing the rootViewController. Simple enough!

This was a disaster. It was simply impossible to force the new view controller to be created and added with a "forced" orientation.

### Switch The Subviews

OK, I give up already. Just make a root "container view controller" that will hold two other view controllers and display either one based on the rotation change. Stupidly enough, this wasn't straight forward, either.

Thew views I want to switch between **only** support their respective orientations, meaning the portrait view only supports being shown in portrait, and will break otherwise. Same thing for landscape.

First, I tried to make them strictly show in their respective orientations. Meaning, setting the `autoresizingMask` to `.allZeros`. Unfortunately, that made the animation really ugly, as part of the window's background was showing, since neither view controllers can efficiently cover the background. How about I try the animation?

Sadly, when the container tries switching between the views, they animate as the container animates to the new orientation, showing some really bad looking stuff.

Bottom line, I have to ditch the animations for now, till I find enough time to provide a custom transition.

### Teh Codez

Here is the whole test project. Just create a single view app, and throw this in the ViewController class:

```swift
class ViewController: UIViewController {

    let portraitController = PortraitController()
    let landscapeController = LandscapeController()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        portraitController.view.frame = view.bounds
        
        view.addSubview(portraitController.view)
    }
    
    override func willRotateToInterfaceOrientation(toInterfaceOrientation: UIInterfaceOrientation, duration: NSTimeInterval) {
        
        UIView.setAnimationsEnabled(false)
        
        if UIInterfaceOrientationIsLandscape(toInterfaceOrientation) {
            portraitController.view.removeFromSuperview()
            self.landscapeController.view.frame = view.bounds
            view.addSubview(landscapeController.view)
        }
        else {
            landscapeController.view.removeFromSuperview()
            self.portraitController.view.frame = view.bounds
            view.addSubview(portraitController.view)
        }
    }
    
    override func didRotateFromInterfaceOrientation(fromInterfaceOrientation: UIInterfaceOrientation) {
        
        UIView.setAnimationsEnabled(true)
    }
}

class SuperController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        view.autoresizingMask = .FlexibleHeight | .FlexibleWidth
        
        let label = UILabel(frame: view.bounds)
        label.autoresizingMask = .FlexibleHeight | .FlexibleWidth
        label.text = "HAAA !!!!"
        label.textAlignment = .Center
        
        view.addSubview(label)
    }
    
    override func shouldAutorotate() -> Bool {
        return false
    }
    
    override func viewWillTransitionToSize(size: CGSize, withTransitionCoordinator coordinator: UIViewControllerTransitionCoordinator) {
        
        println("Reached")
    }
}


class LandscapeController: SuperController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor.redColor()
    }
    
    override func supportedInterfaceOrientations() -> Int {
        return UIInterfaceOrientation.LandscapeLeft.rawValue + UIInterfaceOrientation.LandscapeRight.rawValue
    }
}

class PortraitController: SuperController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor.purpleColor()
    }
    
    override func supportedInterfaceOrientations() -> Int {
        return UIInterfaceOrientation.Portrait.rawValue
    }
}
```

## Conclusion

I really have to rush, and the day is almost over ... I thought I should blog anyway, even if the quality isn't that great, at least I keep my streak, and this should be somewhat useful.
