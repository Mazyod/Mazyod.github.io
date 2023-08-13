title: Spitting It Out
categories: null
date: 2016-08-07 18:26:02+00:00

Not a very friendly title, but I really need to throw out there what's happening these days. It's too valuable to be lost in translation or in a long term memory archives...

For starters, I finally realized that toon shaders don't cut it no more.. They are way too complicated for flat design! Besides, the whole idea behind toon shaders is to emphasize the edges and clean the surface of an otherwise rough texture.

So, while looking around the Unity project, I deleted the folder containing the toon shaders by mistake, and decide the heck with it. Let me find a better way to do dis.

Finally, I realize that the "Mobile" category in Unity shaders isn't for low quality shaders. In fact they are high quality, just optimized for mobile by limiting certain functionality. Over there I found VertexLit shader and Unlit.

Skipping VertexLit, Unlit was all I needed, really. Using the Unlit shader meant that the model texture will be draws AS IS, without any modification whatsoever by lighting, reflection or shadows in the render scene. For my flat game, this is a godsend.

After applying that shader and seeing how great the game started to look, I also decided to do a quick pass over the textures that were added to the game. Changing those as well helped me achieve the absolute perfect look I was aiming for! Yatta! Well.. one nuisance is that the 3D models themselves still look a bit off, but whatever.

The other thing which tempted me to write this post was the discovery of the `global` namespace in csharp, lol. I was having issues using a global class because I had defined the same name in a local scope... MonoDevelop was an absolute hero by suggesting that there is conflict with `global::ClassName`. Nice!! So, in order to use the global name, just add `global::`, and we are good to go..

That wraps it up for now, I need to go back to work! :D

