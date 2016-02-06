---
author: mazyod
comments: true
date: 2013-12-24 03:48:58+00:00
layout: post
slug: terminology-wsgi
title: Terminology! [WSGI]
wordpress_id: 543
categories:
- Web
tags:
- app
- code
- development
- engine
- frameworks
- GAE
- gateway
- google
- interface
- internet
- Programming
- python
- server
- Software
- terminology
- web
- WSGI
---

_This is part of the [Terminology series]({% post_url 2013-12-24-terminology-series %})._

**Wikipedia:** [http://en.wikipedia.org/wiki/Web_Server_Gateway_Interface](http://en.wikipedia.org/wiki/Web_Server_Gateway_Interface)

WSGI is Web Server Gateway Interface, and is mainly a standard for Python web applications and frameworks to talk to the web server. The idea came from the incompatibility that was brought from the diversity of Python web applications and frameworks. Each application should be supported explicitly by a service provider, or you would be completely out of luck to use that framework with this provider... Well, that sucks. Up until WSGI came along, and told both parties, let us sandwich an interface layer that abstracts the web server from the web app, eliminating any compatibility issues. The interface does NOT support neither the web servers nor the web frameworks. The web servers and web frameworks are suppose to be WSGI compatible (Or so did I understand). So, the effort is carried by the servers and frameworks.
