title: Errors Localization
tags: null
date: 2016-08-04 12:01:48+00:00

Forgot that on a similar note to the previous post, I was wondering how I should deal with error message localization. I can deal with the localization on the frontend or the backend. If I choose either, there are also multiple ways to approach either one... Then, there is the hybrid approach, where the backend sends all localized strings, and the client picks the right one...

Ideally, I would probably just tag the locale when opening the socket, assign that to the socket assigns map, and use that throughout the backend to return the appropriate localized string... Actually, I really should do just that.

In elixir, people seem to be using `gettext` to localize stuff, but I haven't tested it out yet, hopefully it'll be simple to use, and would solve this issue for me.

Well, I guess that's it then! Just attach the locale to the socket when joining.
