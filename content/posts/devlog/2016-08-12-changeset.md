title: Changeset
categories:
- dama
date: 2016-08-12 14:59:05+00:00

That was painful ... Dealing with Ecto changesets.

The thing is, I've been trying to implement a way to use changesets in order to protect certain properties of the model from being modified by an external source. For example, users of the app can change their username, but not their rating.

To achieve something like that, I first created `external_changeset` on the `user` model:

```elixir
def external_changeset(user, params) do
  ...
end
```

Given the user, and the proposed parameters to be changed, we should return a changeset with the following conditions:

1. The changes shouldn't modify protected members
2. The changes shouldn't render the model in an invalid state (e.g. empty username)

Well, I thought it was simple at first, because I've seen the `cast` method in action. `cast` is a method on `Ecto.Changeset` that allows you to control the changes in a certain way...

The thing is, I've always thought that the rules you pass into the `cast` method are applied to the `Ecto.Changeset` model itself, but no! The rules are actually applied to the final resulting model! What does that mean?

Well, first, let's see what the `cast` method does:

```elixir
user
|> cast(%{username: "mazyod"}, ~w(username email))
```

Depending on whether you are on the latest ecto release or not, cast takes the model or changeset as the first parameter, then the changes as a map, then an enumerable of fields that are required or can be modified.

That's where my earlier statement comes into play. Notice how even though we "require" an email field, the changes map doesn't have an email. That's fine, because if the user object itself has the email set, that means the overall changeset is still valid!

Phew! I needed to write all that out, since I am sure my future self will need it.
