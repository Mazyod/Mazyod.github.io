title: Synchronized
categories:
- sync
- rsync
- server
- ubuntu
- ssh
- remote
- files
- project
- directory
comments: true
date: 2014-10-05 16:22:02+00:00

## Introduction

Whenever I write something about synchronization, I am required, by law, to reference this picture:

![image](/images/golden-pair.jpg)

If you don't get it, just let it slide.

**Disclaimer: Vim/emacs users, stop reading. Now. Probably.**

## The Problem

As with all useful articles, we are ultimately aiming to solve a problem. The problem we would like to amend is the slow process of developing projects on a remote sever. 

Hence, what we are trying to achieve is **Simple, iterative process of developing projects on a remote server**

## The Story

After launching a Amazon EC2 Ubuntu instance, I moved all my projects to the server in order to run them, and they instantly broke. Thankfully, I had setup a logging mechanism, so I realized what the problems were, but now I need to fix them!

I launch my favorite IDE, PyCharm, and fix those issues, and commit to the [VCS](http://en.wikipedia.org/wiki/Revision_control). Only problem now is, I need the server to get those changes!

First thing I did was, I would ssh into the server, navigate to the project root, and pull latest, execute a deploy script. This deemed very mundane and time consuming!

I then tried utilizing an old script I had, which uses [`scp`](https://linuxacademy.com/blog/linux/ssh-and-scp-howto-tips-tricks/), to transfer my files. The problem now was, scp was transferring *everything, every single time*. Not only that, but I no longer need the `.git` directory to be sent, as well as all the patterns that are specified in the `.gitignore`! Something had to change. It was time to learn something new.

## The rsync

After searching on how to exclude files from `scp`, the answer was: "You can't. Use rsync, instead". Best part about this is, `rsync` comes with so many more benefits other than excluding files, as we we'll see now.

`rsync`'s beauty in this context can be described in three points:

1. **Effeciency**: Only sends the new/changed files! Doesn't transfer the whole directory every single time, like scp did.
2. **Control**: Using `--include, --exclude`, you can easily control what gets synced, and what doesn't.
3. **Organization**: By specifying the `--delete` options, files deleted locally will also be deleted from the remote directory.

Needless to say, that's all I ever wanted.

## The Scripts

Now, let's take a look at how this works:

```python
def cmd_ec2_rsyc_project(project_path="."):
    """Syncs the project path with the ec instances projects dir, optionally invoking 'deploy.py' remotely"""

    project_path = resolve_path(project_path)
    # Important: Make sure we have a trailing slash! Read more:
    # http://bit.ly/1rYK94U
    project_path += "/" if not project_path.endswith("/") else ""

    # Resolve the remote path
    project_name = os.path.basename(project_path[:-1])
    target_project_path = os.path.join(REMOTE_PROJECTS_DIR, project_name)
    remote_path = REMOTE_ADDRESS + ":" + target_project_path

    # Read more about the extra options here: http://bit.ly/1rYK94U
    os.system("rsync -azP --delete --exclude '.*' {src} {dst}".format(
        src=project_path, dst=remote_path
    ))

    if not os.path.exists(os.path.join(project_path, "deploy.py")):
        return

    # Silver lining: Execute the deploy script after syncing
    os.system("ssh {addr} 'sudo python {script_path}'".format(
        addr=REMOTE_ADDRESS, script_path=os.path.join(target_project_path, "deploy.py")
    ))
```

## Conclusion

With all that setup in [the pythonic terminal]({% post_url 2014-03-18-make-your-terminal-pythonic %}), it's as tasty as pie!
