title: Ecto.Multi
categories:
- programming
date: 2018-03-29 02:46:53+00:00

## Introduction

I have been ignoring errors coming in from my backend for a while now .. There is only one serious and frequent error, actually, and I've no idea how it's happening, so decided to ignore it .. That was a grave mistake.

Today, a user reached out and complained about his purchases not reflecting on his account! That's quite serious, and needed to be dealt with ASAP...

## Debugging

First, I looked at all the logs I had, and that's a really annoying chore ... I have logs on Papertrail, heroku, custom logging server, and sentry. Yeah .. I was paranoid about the time where I would need to debug purchases, and indeed, that time has come.

The best thing was, the logged exception on sentry had the exact payload sent from the client, hence I was able to replay the request, and get the same error. Perfect! Reproducibility, check!

Now, what is the error? Actually, elixir/phoenix apps default to 8 frames on the stacktrace, so all I could see was:

```
Elixir.DBConnection.ConnectionError: transaction rolling back
  File "lib/db_connection.ex", line 1523, in DBConnection.fetch_info/1
  File "lib/db_connection.ex", line 738, in DBConnection.run/3
  File "lib/db_connection.ex", line 636, in DBConnection.execute/4
  File "lib/ecto/adapters/postgres/connection.ex", line 105, in Ecto.Adapters.Postgres.Connection.execute/4
  File "lib/ecto/adapters/sql.ex", line 243, in Ecto.Adapters.SQL.sql_call/6
  File "lib/ecto/adapters/sql.ex", line 441, in Ecto.Adapters.SQL.execute_or_reset/7
  File "lib/ecto/repo/queryable.ex", line 130, in Ecto.Repo.Queryable.execute/5
  File "lib/ecto/repo/queryable.ex", line 35, in Ecto.Repo.Queryable.all/4
```

Dang it!! But you know what the beauty was? I had the foresight to split my backend into micro-services :D .. The affected server was hosted on Heroku, and publishing a new version was as simple as pushing a new commit to Github.

Hence, I configured phoenix to show more stackes, and pushed a new release:

```
config :phoenix, :stacktrace_depth, 20
```

## The Culprit

After seeing the 20 line stacktrace, even that didn't make sense, lol, but it at least confirmed my suspicion of which function the error was being thrown.

After looking deep and hard at the function, I was finally able to see it .. it was there, as clear as day... The function, which was part of an `Ecto.Multi` was handling a `Repo.insert` with a `with` statement that "suppressed" a certain DB error that detected duplicate purchase receipts... You can't do that.

You see, if a DB error is thrown during a transaction, the whole transaction is marked as invalid, and you should rollback before you can start querying the db again. The rollback for `Ecto.Multi` happens at the end, so I couldn't suppress this error, unfortunately.

## The Solution

Even being away from this code for a freakin year now, I wrote a simple solution that first enumerates the purchases, and filters out duplicates found in the DB. The tests passed from the first try... I was in disbelief.

I changed the function around to break the tests, truly enough, the failed as intended. I kept changing things around just to make sure I'm not missing anything, and nope .. nothing was missing at all. The code simply works. Elixir is the freakin best.
