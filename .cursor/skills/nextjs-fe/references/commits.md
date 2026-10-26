# Commits

Follow Conventional Commits 1.0.0. Create a commit only when the user asks for one.

```text
type(scope): subject

why this change is needed
```

Use `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, or `revert`. `style` means formatting, not CSS. The subject is imperative, lowercase, and has no final period. Keep the header within 100 characters. Put a blank line before the body. Scope with the feature name when it helps, as in `feat(support):`. A breaking change uses `!` before the colon or a `BREAKING CHANGE:` footer. Split a change that needs two types into two commits.

Leave git config unchanged. Do not force-push, skip hooks, or commit secrets, `.env` files, or credentials. This repository does not run Commitlint, so the message has to follow these rules before it is created.

```text
feat(support): add the plain-text submit form

Keep the draft in the form until the server confirms creation.
```
