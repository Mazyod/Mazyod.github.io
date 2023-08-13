title: How to Logout from Hockeyapp
categories:
- snippets
- hockeyapp
- development
- uninstall
- defaults
- tricks
- pro-tip
comments: true
date: 2014-08-20 12:53:08+00:00

As silly as it may sound, but there doesn't seem to be a way for the HockeyApp user on Mac to sign out once he signed in...

With just a tiny bit of knowledge about how the Foundation framework offers app the ability to save preferences, I realized I can probably delete the preferences file:

```bash
$ defaults find hockey
[... huge lump of text, and somewhere in the middle:]
Found 19 keys in domain 'com.hockeyapp.mac': {
[...]

```

With the domain of the app figured out (maybe I could've just checked the app bundle's info.plist?), it was as simple as:

```bash
$ defaults delete com.hockeyapp.mac

```

And now, I have been signed out!
