title: GAE Follow Up
tags: backend, gae, google, appengine, development, python, pytest, test, testing, tdd, functional, rest, terminal, instance
comments: true
date: 2015-02-10 08:37:39+00:00

## Introduction

This is a quick follow up post to the previous post regarding [writing tests for Google App Engine applications]({% post_url 2015-02-08-testing-gae %}).

In the previous post, we just saw how to write quick functional tests to make sure the RESTful API is sane. This follow up is to shed a bit more light on py.test, and how it can be used to the fullest, as well as some more details on how the Google AppEngine (GAE) development instance is setup.

## Development Instance

To run your functional test, you probably want to create a new instance of your server just for the sake of running your tests. This will allow you to quickly deploy a pre-release version and test it without affecting your production setup.

Luckily, GAE developers know how important command line tools (cli) are to us, and have created a cli for GAE.

Here is the basic script:

```python
PORT = random.randrange(9000, 9999)
BASE_URL = "http://localhost:" + str(PORT) + "/{}"
PROJECT_DIR = "/path/to/project"
PROCESS = None

# noinspection Restricted_Python_calls
def setup_module(module):

    global PROCESS

    print
    print "Starting GAE server at", BASE_URL

    cmd = ["dev_appserver.py",
           "--datastore_path", "kod_test.datastore",
           "--skip_sdk_update_check", "yes",
           "--clear_datastore", "yes",
           "--port", str(PORT),
           "--admin_port", str(PORT + 1),
           "."]

    PROCESS = sp.Popen(cmd, cwd=PROJECT_DIR, stdout=sp.PIPE, stderr=sp.PIPE)

    while PROCESS.poll() is None:

        line = PROCESS.stderr.readline()
        print line
        if "Starting admin server" in line:
            break

    print "GAE started successfully..."
```

**Notice** that the code is in `setup_module`, which is the way pytest allows you to setup your testing environment for the current test module.

The code is a simply `subprocess` code that calls the GAE cli, namely `dev_appserver.py`. The flags are verbose and self-explanatory.

I had some issues when using the same port over and over, since sometimes the port is not released fast enough, so I generate a random port everytime.

Make sure when executing the command, make sure the `cwd` (current work directory) is the project directory, so it actually runs your app.

Finally, we poll the process till we get the "Starting admin server", which indicates that the instance has been created and ready for use.

## Teardown

Similar to `setup_module`, we have `teardown_module`. Here, we teardown the GAE instance, and cleanup all the resources.

Sometimes your tests might fail, but you want a chance to navigate to the instance admin page and inspect the datastore, memcache, or whatnot. So, if you see the code below, it actually never exits, since it is constantly polling the process.

```python
def teardown_module(module):

    print
    print "Terminate GAE subprocess"

    while PROCESS.poll() is None:
        print PROCESS.stderr.readline(),

    PROCESS.terminate()
```

## Flags

Finally, I would like to mention the flags that are super useful for these pytests. They are just two, honestly. `-v` `-s`.

`-v` is verbose, as with any other command. I am a glutton for nice output with lots of green text, and that flag gives me that.

`-s` pipes the output of all the print statements we have in the tests out to the terminal, so I use this one if a test fails, and I want to know more about what's happening on the instance output side.

## Conclusion

It's very simple to setup tests for GAE, and even more so create and teardown instances on the fly to perform tests. There aren't many reasons I can think of *not* to test your code, but **a lot** of reasons to do otherwise. So... write tests, and use the extra time to play League!
