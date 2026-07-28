# Logo playground

Logo playground implemented with React and Zustand-managed command state.

## Run locally

```sh
npm install
npm run dev
```

## User-defined procedures

Create reusable Logo procedures with `to`, name parameters with a leading
colon, and close the definition with `end`:

```logo
to square :size
  repeat 4 [fd :size tr 90]
end

repeat 12 [square 80 tr 30]
```

Run a definition on its own to save it for the current playground session,
then call it in later submissions. Parameters can be used anywhere a command
expects a number, color, animation setting, or another procedure argument.
Defining the same name again replaces its previous body. Built-in command
names are reserved, and recursive procedure cycles are rejected to keep
programs safe.

## Deploy to GitHub Pages

Push the repository to GitHub and, under **Settings → Pages**, select
**GitHub Actions** as the source. Every push to `master` then builds and deploys
the site to:

<https://tomaszunek.github.io/logo/>

The workflow also supports manual deployments from the Actions tab.
