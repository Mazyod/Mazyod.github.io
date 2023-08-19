title: Pick Your Container
tags: programming
date: 2018-04-03 19:30:43+00:00

## Dancing with the Snake

I've been engrossed in Python development lately, since we have requirements to build a unified platform for UI testing tasks, such as publishing results, browsing screenshots, ... etc.

Being a "seasoned" Python developer, I didn't think twice about going with Flask, so everything was build on top of that. However, after proceeding to add more UI tests, I ran into such an "unforgivable" error .. Flask wasn't detecting the HTTP method of the request properly :S

## A Leaky Flask

For whatever reason, when our app would send two consecutive requests, where the first request has a JSON body, the second request is improperly handled by the flask dev server .. It show something like:

```
"{"foo": "bar"}GET /api/path" 405
```

As you can see, the http method resolved contains the string from the previous request body, which then causes a method not allowed mismatch. I was in utter disbelief, and was certain it was due to HTTP pipelining or some other optimization on the client...

After digging deep and wide in the iOS code, no avail. Everything checks out fine, and Charles shows all requests properly .. It's time to get inventive.

## A Speedy Pivot

No idea how it hit me, but I recalled all of a sudden "bottle". The python micro-framework that works in an almost identical fashion as Flask .. It was gonna be time consuming, but with nothing else in mind, I moved forward with the migration.

After learning bottle basics, I was able to migrate the basic APIs with super minimal changes, and got the server up and running. That took maybe 15 minutes at most. Once I did that, I ran the UI tests again, and surely enough, the http method bug was resolved!! Yatta!

With this confidence boost, I proceeded to migrate the rest of the server parts to bottle, and completely nuked Flask. I guess that took about an hour or so... I'm now a very happy bottle user, and it is worth mentioning, bottle is WAY faster in launching and processing requests, for my case at least.

## Migrating from Flask to Bottle

Here are my learnings for migrating from Flask to bottle:

```diff
-import flask
-from werkzeug.http import Headers
+import bottle
 
 [ ... ]
 
+# Remove "hop-by-hop" headers (as defined by RFC2613, Section 13)
+# since they are not allowed by the WSGI standard.
+FILTER_HEADERS = [
+    'Connection',
+    'Keep-Alive',
+    'Proxy-Authenticate',
+    'Proxy-Authorization',
+    'TE',
+    'Trailers',
+    'Transfer-Encoding',
+    'Upgrade',
+]
+
+PROJECT_DIR = os.path.dirname(__file__)
+WEB_ROOT = os.path.join(PROJECT_DIR, "snap-audit", "build")
+STATIC_ROOT = os.path.join(WEB_ROOT, "static")
+
+

 [ ... ]

 # Server
 #
 
-app = flask.Flask(__name__, static_folder='snap-audit/build')
-

 [ ... ]

 # global handlers
 
-@app.errorhandler(400)
+@bottle.error(400)
 def bad_request(e):
-    return flask.jsonify(error=400, text=str(e)), 400
+    return dict(error=400, text=str(e))
 
 
-@app.errorhandler(404)
+@bottle.error(404)
 def page_not_found(e):
-    return flask.jsonify(error=404, text=str(e)), 404
+    return dict(error=404, text=str(e))
 
 
-@app.route('/')
+@bottle.get('/')
 def root_path():
-    return flask.jsonify(status="ok")
+    return {"status": "ok"}
 
 
 # mock-server-api
 
-@app.route('/mock-server-api/mount', methods=["GET", "POST"])
+@bottle.route('/mock-server-api/mount', method="ANY")
 def mock_server_mount():
     """Mounts a given postman group
     Expected Query: ?group={group_name}
     """
-    group = flask.request.args.get("group")
+    group = bottle.request.query.group
     if not group:
-        flask.abort(400, description="missing query parameter 'group'")
+        bottle.abort(400, "missing query parameter 'group'")
 
     if not mounting_service.push_group(group):
-        flask.abort(400, description="group not found")
+        bottle.abort(400, "group not found")
 
-    return flask.jsonify(status="ok")
+    return {"status": "ok"}
 
 
-@app.route('/mock-server-api/unmount', methods=["GET", "POST"])
+@bottle.route('/mock-server-api/unmount', method="ANY")
 def mock_server_unmount():
     """Unmounts a given postman group, otherwise unmounts all groups.
     Expected Query: ?group={group_name}
     """
-    group = flask.request.args.get("group")
+    group = bottle.request.query.group
     if group:
         mounting_service.unmount_group(group)
     else:
         mounting_service.unmount_all_groups()
 
-    return flask.jsonify(status="ok")
+    return {"status": "ok"}
 
 
 # mock-server
 
-@app.route('/mock-server/<path:mock_path>', methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
+@bottle.route('/mock-server/<mock_path:re:.+>', method="ANY")
 def mock_server(mock_path):
     """Serves the designated mock postman collection"""
     item = mounting_service.item_for(mock_path)
     if not item:
-        flask.abort(404)
+        bottle.abort(404)
 
     # TODO - perhaps find required example?
     response = item.response[0]
     jstring = response["body"]
     status = response["code"]
     # TODO - enable gzip encoding
-    ignored_headers = ["Content-Encoding"]
-    headers = [h for h in response["header"] if h["key"] not in ignored_headers]
+    headers = [h for h in response["header"] if h["key"] not in FILTER_HEADERS]
+
+    bottle.response.status = status
+    bottle.response.content_type = "application/json"
+
+    for h in headers:
+        bottle.response.set_header(h["key"], h["value"])
 
-    return app.response_class(response=jstring,
-                              status=status,
-                              headers=Headers([(h["key"], h["value"]) for h in headers]),
-                              mimetype="application/json")
+    return jstring
 
 
 # postman-dump
 
-@app.route('/postman-dump', methods=["POST"])
+@bottle.post('/postman-dump')
 def postman_dump():
     """Postman recording API. Incoming request will be captured into a postman collection
     Expected format:
@@ -295,52 +313,64 @@ def postman_dump():
       }
     }
     """
-    capture_service.add(flask.request.json)
-    return flask.jsonify(status="ok")
+    capture_service.add(bottle.request.json)
+    return {"status": "ok"}
 
 
 # snap-audit
 
-@app.route('/snap-audit', methods=["GET"])
+@bottle.get('/snap-audit')
+@bottle.get('/index.html')
 def serve_snap_audit():
     """snap audit is our React.js app"""
-    return flask.send_from_directory("snap-audit/build", "index.html")
+    return bottle.static_file("index.html", WEB_ROOT)
+
+
+@bottle.get('/manifest.json')
+def serve_snap_audit():
+    return bottle.static_file("manifest.json", WEB_ROOT)
+
+
+@bottle.get('/service-worker.js')
+def serve_snap_audit():
+    return bottle.static_file("service-worker.js", WEB_ROOT)
 
 
-@app.route('/static/<path:path>')
+@bottle.route('/static/<path:re:.+>', method="ANY")
 def serve_static_asset(path):
-    return flask.send_from_directory('snap-audit/build/static', path)
+    return bottle.static_file(path, STATIC_ROOT)
 
 
-@app.route('/snap-audit/test-result', methods=["POST"])
+@bottle.route('/snap-audit/test-result', method="ANY")
 def record_test_result():
     """Records the given test result as part of the test metadata
     Expected Header: Content-Type: application/json
     Expected Query: ?path=feature/variant/environment
     Expected Body: {"success": bool}
     """
-    path = flask.request.args.get("path")
+    path = bottle.request.query.path
     if not path:
-        flask.abort(400, description="please provide path query item")
+        bottle.abort(400, "please provide path query item")
 
-    firebase.upload_test_result(path, flask.request.json)
-    return flask.jsonify(status="ok")
+    firebase.upload_test_result(path, bottle.request.json)
+    return {"status": "ok"}
 
 
-@app.route('/snap-audit/screenshot/upload', methods=["POST", "PUT"])
+@bottle.route('/snap-audit/screenshot/upload', method="ANY")
 def upload_screenshot():
     """Uploads the given image asynchronously to our storage service. The reason we ask for arbitrary path variable is
     to allow clients to decide their preferred way to structure their screenshots.
     Expected Header: Content-Type: image/png
     Expected Query: ?path=feature/variant/environment&index=3"""
-    path = flask.request.args.get("path")
-    index = flask.request.args.get("index")
+    path = bottle.request.query.path
+    index = bottle.request.query.index
     if not path or not index:
-        flask.abort(400, description="please provide path and index query items")
+        bottle.abort(400, "please provide path and index query items")
 
-    firebase.upload_screenshot(path, index, flask.request.data)
-    return flask.jsonify(status="ok")
+    firebase.upload_screenshot(path, index, bottle.request.body.read())
+    return {"status": "ok"}
 
 
 if __name__ == '__main__':
-    app.run(host='0.0.0.0', port=5858)
+    bottle.debug(True)
+    bottle.run(host='0.0.0.0', port=5858)
diff --git a/requirements.txt b/requirements.txt
index be2a752..b78e1e9 100644
--- a/requirements.txt
+++ b/requirements.txt
@@ -1,9 +1,8 @@
+bottle==0.12.13
 cachetools==2.0.1
 certifi==2018.1.18
 chardet==3.0.4
-click==6.7
 firebase-admin==2.9.1
-Flask==0.12.2
 google-api-core==1.1.0
 google-auth==1.4.1
 google-cloud-core==0.28.1
@@ -12,9 +11,6 @@ google-cloud-storage==1.8.0
 google-resumable-media==0.3.1
 googleapis-common-protos==1.5.3
 idna==2.6
-itsdangerous==0.24
-Jinja2==2.10
-MarkupSafe==1.0
 protobuf==3.5.2.post1
 pyasn1==0.4.2
 pyasn1-modules==0.2.1
@@ -23,4 +19,3 @@ requests==2.18.4
 rsa==3.4.2
 six==1.11.0
 urllib3==1.22
-Werkzeug==0.14.1
-- 
2.15.1 (Apple Git-101)
```
