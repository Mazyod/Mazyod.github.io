# -*- coding: utf-8 -*-

import datetime
import os
import shlex
import shutil
import sys

from invoke import task
from invoke.main import program
from invoke.util import cd
from pelican import main as pelican_main
from pelican.server import ComplexHTTPRequestHandler, RootedHTTPServer
from pelican.settings import DEFAULT_CONFIG, get_settings_from_file

OPEN_BROWSER_ON_SERVE = True
SETTINGS_FILE_BASE = "pelicanconf.py"
SETTINGS = {}
SETTINGS.update(DEFAULT_CONFIG)
LOCAL_SETTINGS = get_settings_from_file(SETTINGS_FILE_BASE)
SETTINGS.update(LOCAL_SETTINGS)

CONFIG = {
    "settings_base": SETTINGS_FILE_BASE,
    "settings_publish": "publishconf.py",
    # Output path. Can be absolute or relative to tasks.py. Default: 'output'
    "deploy_path": SETTINGS["OUTPUT_PATH"],
    # Github Pages configuration
    "github_pages_branch": "gh-pages",
    "commit_message": "'Publish site on {}'".format(datetime.date.today().isoformat()),
    # Host and port for `serve`
    "host": "localhost",
    "port": 8000,
}


@task
def new_post(c, title: str, category: str):
    """Prepare a new post"""
    from pathlib import Path

    posts_dir = Path(__file__).parent / "content" / "posts"

    # Format the current date
    date = datetime.datetime.now()
    date_str = date.strftime("%Y-%m-%d")

    # Replace spaces in the title with dashes for the filename
    filename = "-".join([date_str, *title.lower().split()]) + ".md"

    # YAML front matter template
    front_matter = f"""---
title: "{title}"
category: "{category}"
date: {date.isoformat()}
---

Your content goes here.
"""

    filepath = posts_dir / filename
    with filepath.open("w") as f:
        f.write(front_matter)

    print(f"Created {filepath}")


@task
def clean(c):
    """Remove generated files"""
    if os.path.isdir(CONFIG["deploy_path"]):
        shutil.rmtree(CONFIG["deploy_path"])
        os.makedirs(CONFIG["deploy_path"])


@task
def build(c):
    """Build local version of site"""
    pelican_run("-s {settings_base}".format(**CONFIG))


@task
def rebuild(c):
    """`build` with the delete switch"""
    pelican_run("-d -s {settings_base}".format(**CONFIG))


@task
def regenerate(c):
    """Automatically regenerate site upon file modification"""
    pelican_run("-r -s {settings_base}".format(**CONFIG))


@task
def serve(c):
    """Serve site at http://$HOST:$PORT/ (default is localhost:8000)"""

    class AddressReuseTCPServer(RootedHTTPServer):
        allow_reuse_address = True

    server = AddressReuseTCPServer(
        CONFIG["deploy_path"],
        (CONFIG["host"], CONFIG["port"]),
        ComplexHTTPRequestHandler,
    )

    if OPEN_BROWSER_ON_SERVE:
        # Open site in default browser
        import webbrowser

        webbrowser.open("http://{host}:{port}".format(**CONFIG))

    sys.stderr.write("Serving at {host}:{port} ...\n".format(**CONFIG))
    server.serve_forever()


@task
def reserve(c):
    """`build`, then `serve`"""
    build(c)
    serve(c)


@task
def preview(c):
    """Build production version of site"""
    pelican_run("-s {settings_publish}".format(**CONFIG))


@task
def livereload(c):
    """Automatically reload browser tab upon file modification."""
    from livereload import Server

    def cached_build():
        cmd = "-s {settings_base} -e CACHE_CONTENT=true LOAD_CONTENT_CACHE=true"
        pelican_run(cmd.format(**CONFIG))

    cached_build()
    server = Server()
    theme_path = SETTINGS["THEME"]
    watched_globs = [
        CONFIG["settings_base"],
        "{}/templates/**/*.html".format(theme_path),
    ]

    content_file_extensions = [".md", ".rst"]
    for extension in content_file_extensions:
        content_glob = "{0}/**/*{1}".format(SETTINGS["PATH"], extension)
        watched_globs.append(content_glob)

    static_file_extensions = [".css", ".js"]
    for extension in static_file_extensions:
        static_file_glob = "{0}/static/**/*{1}".format(theme_path, extension)
        watched_globs.append(static_file_glob)

    for glob in watched_globs:
        server.watch(glob, cached_build)

    if OPEN_BROWSER_ON_SERVE:
        # Open site in default browser
        import webbrowser

        webbrowser.open("http://{host}:{port}".format(**CONFIG))

    server.serve(host=CONFIG["host"], port=CONFIG["port"], root=CONFIG["deploy_path"])


@task
def publish(c):
    """Publish to production via rsync"""
    pelican_run("-s {settings_publish}".format(**CONFIG))
    c.run(
        'rsync --delete --exclude ".DS_Store" -pthrvz -c '
        '-e "ssh -p {ssh_port}" '
        "{} {ssh_user}@{ssh_host}:{ssh_path}".format(
            CONFIG["deploy_path"].rstrip("/") + "/", **CONFIG
        )
    )


@task
def gh_pages(c):
    """Publish to GitHub Pages"""
    preview(c)
    c.run(
        "ghp-import -b {github_pages_branch} "
        "-m {commit_message} "
        "{deploy_path} -p".format(**CONFIG)
    )


def pelican_run(cmd):
    cmd += " " + program.core.remainder  # allows to pass-through args to pelican
    pelican_main(shlex.split(cmd))


# Cross-Browser Testing Tasks

@task
def test_setup(c):
    """Set up browser testing environment"""
    print("Installing Node.js dependencies...")
    c.run("npm install")
    print("Installing Playwright browsers...")
    c.run("npx playwright install")
    print("Installing Python testing dependencies...")
    c.run("uv sync --group testing")


@task
def test_browsers(c, headed=False):
    """Run cross-browser compatibility tests"""
    build(c)  # Build the site first
    
    cmd = "npx playwright test"
    if headed:
        cmd += " --headed"
    
    print("Running cross-browser tests...")
    c.run(cmd)


@task
def test_visual(c, update=False):
    """Run visual regression tests"""
    build(c)
    
    cmd = "npx playwright test tests/browser/visual-regression.spec.js"
    if update:
        cmd += " --update-snapshots"
    
    print("Running visual regression tests...")
    c.run(cmd)


@task
def test_accessibility(c):
    """Run accessibility tests"""
    build(c)
    
    print("Running accessibility tests...")
    c.run("npx playwright test tests/browser/accessibility.spec.js")


@task
def test_progressive(c):
    """Run progressive enhancement tests"""
    build(c)
    
    print("Running progressive enhancement tests...")
    c.run("npx playwright test tests/browser/progressive-enhancement.spec.js")


@task
def test_mobile(c):
    """Run mobile browser tests"""
    build(c)
    
    print("Running mobile browser tests...")
    c.run("npx playwright test --project=mobile-chrome --project=mobile-safari")


@task
def test_legacy(c):
    """Run legacy browser tests (IE11 simulation)"""
    build(c)
    
    print("Running legacy browser tests...")
    c.run("npx playwright test --project=legacy-ie11")


@task
def test_all(c):
    """Run all browser tests"""
    build(c)
    
    print("Running all browser tests...")
    c.run("npx playwright test")
    
    print("Generating test report...")
    c.run("npx playwright show-report")


@task
def test_ci(c):
    """Run tests optimized for CI/CD"""
    build(c)
    
    print("Running CI-optimized tests...")
    c.run("npx playwright test --reporter=github")


@task
def browser_support_matrix(c):
    """Generate browser support matrix documentation"""
    browsers = [
        ("Chrome", "Latest 2 versions", "Full support"),
        ("Firefox", "Latest 2 versions", "Full support"),
        ("Safari", "Latest 2 versions", "Full support"),
        ("Edge", "Latest 2 versions", "Full support"),
        ("Chrome Mobile", "Latest version", "Full support"),
        ("Safari Mobile", "Latest version", "Full support"),
        ("IE11", "Legacy support", "Graceful degradation with polyfills"),
    ]
    
    print("\n=== Browser Support Matrix ===")
    print(f"{'Browser':<15} {'Version':<20} {'Support Level':<35}")
    print("-" * 70)
    for browser, version, support in browsers:
        print(f"{browser:<15} {version:<20} {support:<35}")
    print("\nKey Features:")
    print("- CSS Grid with flexbox fallback")
    print("- CSS Custom Properties with IE11 fallbacks")
    print("- Modern JavaScript with polyfills")
    print("- Progressive enhancement")
    print("- Accessibility compliance (WCAG 2.1 AA)")
    print("- Mobile-first responsive design")
    print("- High contrast and reduced motion support")
