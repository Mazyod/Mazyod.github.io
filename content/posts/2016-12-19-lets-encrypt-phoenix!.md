title: Let's Encrypt Phoenix!
categories:
- phoenix
date: 2016-12-19 18:53:02+00:00

## Introduction

After a previous post outlining the importance of using SSL, especially when dealing with websockets, I needed now to implement auto-renewing certificates as a cron job or whatever.

Previously, I had used the "standalone" approach to get my certs, which worked great.. However, it's not ideal when you want to keep your server running during the renewal process! You see, the standalone server needs to bind to port 80/443, but the running server already occupies those ports.

## The Root of Groot

![][root-of-groot]

Actually, I wanna talk about Webroot, a certbot plugin that allows you to verify your domain through an existing web server.

So, the way webroot works is it basically writes the authentication files to a path you specify, and then attempts to request that file for the authentication process.

Sounds awesome, right! Just write your files to `priv/static`, and we're golden! .. Not. Even though I tested creating files in that directory, then requesting them using curl, and it worked.. This approach didn't work in production. I believe it has to do with the code reloader.

After much dabbling around with the production server, I finally realized that the actual server is running in the `_build` folder! Simply changing `priv/static` to `_build/prod/lib/app/priv/static` finally did the trick..

## The Steps

So, to get webroot working with your phoenix server, first change your `cli.ini` configuration like so:

```text
rsa-key-size = 4096
email = me@example.com
# disabled for renew: domains = my.domain.com
text = True
authenticator = webroot
webroot-path = /path/to/project/_build/prod/lib/myapp/priv/static
```

Please take note above of the following:

+ We disable the domains options since it upsets the renewal process. Uncomment if you are generating for the first time.
+ Make sure to set your email.

Once you do that, you can proceed with running the certbot program:

```text
./certbot-auto renew --dry-run
```

## Conclusion

I felt inclined to donate to EFF for their fantastic work on let's encrypt, and so feel inclined to promote them here as well:

[Donate to EFF][eff-donation]

[root-of-groot]: http://i.imgur.com/Te9RTcn.png
[eff-donation]: https://supporters.eff.org/donate/support-work-on-certbot
