AUTHOR = "Mazyad Alabduljaleel"
SITENAME = "Maz Development Directory"
SITEURL = ""
SITE_EMAIL = "mazyod@gmail.com"
GITHUB_USERNAME = "mazyod"

# maintain compatibility with old URLs
ARTICLE_URL = "blog/{date:%Y}/{date:%m}/{date:%d}/{slug}/"
ARTICLE_SAVE_AS = f"{ARTICLE_URL}index.html"

PAGE_URL = "{slug}/"
PAGE_SAVE_AS = f"{PAGE_URL}index.html"

# disable author pages
AUTHOR_SAVE_AS = ""

DIRECT_TEMPLATES = ["index", "archives", "tags", "categories"]

STATIC_PATHS = ["static"]

PATH_METADATA = r"static/(?P<path>.+)"

SITE_DESCRIPTION = """
Dumping ground for all my experiences as a Software Engineer.
<br />
I mostly work with Python and Docker, sometimes JS, Elixir and Unity.
<br />
Swift, Objective-C and C++ in a former life.
"""

PATH = "content"
ARTICLE_PATHS = ["posts"]

TIMEZONE = "Asia/Kuwait"
DEFAULT_LANG = "en"

THEME = "themes/retrospective"

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

MARKDOWN = {
    "extension_configs": {
        # 'markdown.extensions.codehilite': {'css_class': 'highlight'},
        "markdown.extensions.smarty": {},
        "markdown.extensions.sane_lists": {},
        # "proxy" for `markdown.extensions.extra``
        "pymdownx.extra": {},
        # emphasis that is more like GFM
        "pymdownx.betterem": {},
        # use emoji shortcodes
        "pymdownx.emoji": {},
        # code highlighting
        "pymdownx.highlight": {},
        "pymdownx.inlinehilite": {},
        "pymdownx.superfences": {},
        # turn markdown links into ... links
        "pymdownx.magiclink": {},
        # strict parsing of headers
        "pymdownx.saneheaders": {},
        # fancy symbols
        "pymdownx.smartsymbols": {},
    },
    "output_format": "html5",
    # "extensions": [
    #     "pymdownx.superfences",
    #     "pymdownx.inlinehilite",
    #     "pymdownx.tilde",
    #     "pymdownx.caret",
    #     "pymdownx.keys",
    #     "footnotes",
    #     "attr_list",
    #     "tables",
    # ],
}


# Blogroll
LINKS = (
    ("Pelican", "https://getpelican.com/"),
    ("Python.org", "https://www.python.org/"),
    ("Jinja2", "https://palletsprojects.com/p/jinja/"),
    ("You can modify those links in your config file", "#"),
)

# Social widget
SOCIAL = (
    ("You can add links in your config file", "#"),
    ("Another social link", "#"),
)

DEFAULT_PAGINATION = False

# Uncomment following line if you want document-relative URLs when developing
RELATIVE_URLS = True
