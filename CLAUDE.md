# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal tech blog published to GitHub Pages at https://mazyod.com using the Pelican static site generator. The blog contains posts about software engineering experiences covering Python, Docker, JavaScript, Elixir, Unity, and legacy work with Swift, Objective-C, and C++.

## Dependencies and Package Management

- Uses `uv` as the package manager (migrated from Poetry)
- Python version: 3.12-3.13
- Core dependencies: Pelican with Markdown support, various Pelican plugins
- Dev dependencies: Invoke for task automation, Ruff for linting

## Content Structure

- **Articles**: Located in `content/posts/` with date-based naming (YYYY-MM-DD-title.md)
- **Pages**: Static pages in `content/pages/` (e.g., about.md)
- **Static files**: Images and assets in `content/static/`
- **Theme**: Custom theme in `themes/retrospective/`

## Development Commands

### Local Development
```bash
# Build the site for development
uv run invoke build
# or
make html

# Serve locally with auto-regeneration
uv run invoke livereload
# or 
make devserver

# Build and serve (without auto-reload)
uv run invoke reserve
# or
make serve
```

### Content Creation
```bash
# Create a new blog post
uv run invoke new-post --title "Post Title" --category "Category"
```

### Production Commands
```bash
# Build for production
uv run invoke preview
# or
make publish

# Deploy to GitHub Pages (if using local deployment)
uv run invoke gh-pages
```

### Linting and Code Quality
```bash
# Run code linting
uv run ruff check
uv run ruff format
```

## Configuration Files

- **pelicanconf.py**: Main Pelican configuration for development
- **publishconf.py**: Production overrides (HTTPS URLs, feeds, analytics)
- **tasks.py**: Invoke task definitions for automation
- **Makefile**: Traditional make commands (alternative to invoke tasks)

## Site Configuration Details

- **URL Structure**: Maintains compatibility with old URLs using date-based paths
- **Timezone**: Asia/Kuwait
- **Theme**: Custom "retrospective" theme with CSS and templates
- **Markdown**: Uses PyMdown Extensions for enhanced markdown features including code highlighting, emoji, and magic links
- **Analytics**: Google Analytics (G-C0VPNBWBLL) and Disqus comments

## Deployment

The site automatically deploys via GitHub Actions when pushing to the master branch:
1. Installs uv and Python 3.12
2. Runs `uv sync` to install dependencies  
3. Runs `uv run make publish` to build production site
4. Deploys to GitHub Pages from `./output` directory

### Local Workflow Testing

The repository is configured with `act` for local GitHub Actions testing. Install act and Docker, then use:

```bash
# Install act (macOS)
brew install act

# Test the deployment workflow (dry run)
act push --dryrun

# Test the workflow with actual execution (without deployment)
act push --job deploy

# Test manual workflow trigger
act workflow_dispatch
```

**Configuration:**
- `.actrc` file configures act to use medium Docker image (~500MB) and proper architecture
- Docker Desktop must be running
- First run downloads the `catthehacker/ubuntu:act-latest` image
- Local testing successfully builds the site and validates all steps except actual GitHub Pages deployment

## Theme Development

The custom theme is located in `themes/retrospective/` and includes:
- Jinja2 templates in `templates/`
- CSS and static assets in `static/`
- Theme-specific dependencies managed via Poetry

## Important Notes

- Article URLs follow the pattern: `/blog/YYYY/MM/DD/slug/`
- Static files are served from the root via the `static/` directory mapping
- Author pages are disabled (`AUTHOR_SAVE_AS = ""`)
- Default pagination is disabled
- Development uses relative URLs, production uses absolute URLs