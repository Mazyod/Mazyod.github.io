title: Speed Tests
tags: elixir
date: 2016-07-11 08:29:57+00:00

## Introduction

Finally, I'm back in the game (literally?), and working on the Elixir side of things for a change.

So, my Elixir backend is heavily tested using unit and integration test. For now, a total of 83 unit tests assert their way through my code, all way from checking the password hashing result, to making sure I don't have any typos.

![elixir tests](/images/elixir-tests.png)

Life wasn't this good just yesterday. My tests were taking 7.2 seconds to run, which for Ruby people is a dream, but for Elixir folks, we can do better.

So, I want to quickly explore the idea of tracking down the slow down and how I managed to resolve it.

## Crypt Lord

So, in my case, it really wasn't too hard to track down the slowdown. After integrating the authentication features, which uses `Comeonin.Bcrypt`, I noticed that a simple test is taking +300 ms to finish, sometimes +800 ms. Wat?! Why so slow?

Turns out the Crypt lord is just too heavy .. Any Warcraft fans out there?

![crypt lord](/images/Cryptlord.jpg)

You see, Bcrypt is slow, and that is by design. If your password database gets compromised for any reason, the hacker will have to use the purposely designed, slow algorithm to apply a rainbow table attack on the data, which would take forever. For example, just to crack a single password, it would probably take a single CPU core an excess of 5 years total.

Well, that sounds great! I mean, even though it's slow, it is secure... However, while unit testing, we really don't need this functionality at all. In fact, unit testing is by definition testing your code in small, isolated units. We can leave the actual Bcrypt testing for integration tests.

So, how should we go about this?

### Mockery

One could easily utilize the great [mock library][mock-github] to mock the Bcrypt module, and we are done! Unfortunately, mocking in this specific case has tons of drawbacks:

1. You can no longer run your tests asynchronously
2. You must repeat the mock setup anywhere your test invokes `Comeonin.Bcrypt`

This is Elixir, obviously we can do better.

### DI

I am not really sure if this counts as Dependency Injection, but it sure smells like it. What we basically do is head over to our configuration files and setup the modules which provide us with certain services. Based on the run configuration, we provide a different module!

```elixir
# this is in config.exs
config :myapp, :modules,
  bcrypt: Comeonin.Bcrypt

# this is in test.exs
config :myapp, :modules,
  bcrypt: MyApp.BcryptStub
```

Finally, head over to your main app module, and do:

```elixir
defmodule MyApp do
  use Application

  ### services

  @config Application.get_env(:myapp, :modules)
  def bcrypt, do: @config[:bcrypt]

  ...
end
```

That's about it. Now, instead of referencing `Comeonin.Bcrypt` in your code everywhere, you use `MyApp.bcrypt` instead. If your tests are running, the function will return the stub Bcrypt module which you have already setup to be speedy. While running in dev or prod configuration, the real Bcrypt module will take the wheel.

For the sake of completeness, this is how I setup the `MyApp.BcryptStub` module:

```elixir
defmodule MyApp.BcryptStub do

  def hashpwsalt(password),
  do: "bcrypt-hash:" <> password

  def checkpw(password, "bcrypt-hash:" <> pass),
  do: password == pass

  def checkpw(_, _), do: false

end
```

As you can see, I simply replicate the functions in `Comeonin.Bcrypt` that I am using, and replace them with a predictable "hashing" algorithm which runs in the microsecond time order.

## Conclusion

Elixir continues to kick ass, whether it was parallelism, functionality, or just pure productivity tools. With this simple trick above, the tests now run in ~1.2 seconds. incidentally, I've disabled async testing because I access the DB everywhere, but once I upgrade to Phoenix 1.2.0 and turn on async testing as well, tests might as well run within 800 ms or less.

[mock-github]: https://github.com/jjh42/mock
