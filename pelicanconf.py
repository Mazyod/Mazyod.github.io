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

DIRECT_TEMPLATES = ["index", "archives", "tags", "categories", "offline"]

STATIC_PATHS = ["static"]

PATH_METADATA = r"static/(?P<path>.+)"

# PWA and Modern Web Features
MANIFEST_PATH = "themes/retrospective/static/manifest.json"
SERVICE_WORKER_PATH = "themes/retrospective/static/js/sw.js"

# Additional static files for modern features
EXTRA_PATH_METADATA = {
    'themes/retrospective/static/manifest.json': {'path': 'manifest.json'},
    'themes/retrospective/static/js/sw.js': {'path': 'sw.js'},
    'themes/retrospective/static/js/sw-register.js': {'path': 'theme/js/sw-register.js'},
    'themes/retrospective/static/css/modern-features.css': {'path': 'theme/css/modern-features.css'},
}

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

# Modern Web Standards and Performance
USE_CACHE = True
CACHE_CONTENT = True
CACHE_PATH = 'cache'
GZIP_CACHE = True

# SEO and Social Media
SITE_LOGO = "/images/Icon_BIG.png"
SITE_LOGO_SIZE = "192x192"

# OpenGraph defaults
DEFAULT_OG_IMAGE = "/images/Icon_BIG.png"
TWITTER_CARD_USE = True

# Security Headers (for server configuration reference)
SECURITY_HEADERS = {
    'Content-Security-Policy': "default-src 'self'; style-src 'self' 'unsafe-inline' fonts.googleapis.com cdn.jsdelivr.net; font-src 'self' fonts.gstatic.com; script-src 'self' 'unsafe-inline' www.googletagmanager.com cdn.jsdelivr.net; img-src 'self' data: https:; connect-src 'self' www.google-analytics.com",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
}

# PWA Configuration
PWA_CONFIG = {
    'name': SITENAME,
    'short_name': 'MazDev',
    'theme_color': '#212529',
    'background_color': '#212529',
    'display': 'standalone',
    'orientation': 'portrait-primary',
    'start_url': '/',
    'scope': '/'
}

# Uncomment following line if you want document-relative URLs when developing
RELATIVE_URLS = True
