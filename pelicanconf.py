AUTHOR = 'Mazyad Alabduljaleel'
SITENAME = 'Maz Development Directory'
SITEURL = ''
SITE_EMAIL = 'mazyod@gmail.com'
GITHUB_USERNAME = 'mazyod'

# maintain compatibility with old URLs
ARTICLE_URL = 'blog/{date:%Y}/{date:%m}/{date:%d}/{slug}/'
ARTICLE_SAVE_AS = f'{ARTICLE_URL}index.html'

PAGE_URL = '{slug}/'
PAGE_SAVE_AS = f'{PAGE_URL}index.html'

SITE_DESCRIPTION = '''
I call this place my Development Directory, where I just dump all the
experiences I have duing my development career. I mostly work with Swift,
and C++, for iOS apps and cross-platform games.
'''

PATH = 'content'
ARTICLE_PATHS = ["posts"]

TIMEZONE = 'Asia/Kuwait'
DEFAULT_LANG = 'en'

THEME = '../pelican-press-start'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (('Pelican', 'https://getpelican.com/'),
         ('Python.org', 'https://www.python.org/'),
         ('Jinja2', 'https://palletsprojects.com/p/jinja/'),
         ('You can modify those links in your config file', '#'),)

# Social widget
SOCIAL = (('You can add links in your config file', '#'),
          ('Another social link', '#'),)

DEFAULT_PAGINATION = False

# Uncomment following line if you want document-relative URLs when developing
RELATIVE_URLS = True
