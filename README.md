# Kairo

> A minimal new tab page for Google Chrome

![Chrome Web Store](https://img.shields.io/chrome-web-store/v/lcomlokgcbklomfecjjpjlncapnhepbl.svg)
![Chrome Web Store](https://img.shields.io/chrome-web-store/users/lcomlokgcbklomfecjjpjlncapnhepbl.svg)
![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/lcomlokgcbklomfecjjpjlncapnhepbl.svg)
![license](https://img.shields.io/github/license/jamiller619/kairo.svg)

# 🤖 Built with Web Components

- `<epic-unsplash />` Epic, full-page background photos from [Unsplash](http://www.unsplash.com).
- `<date-time />` A locale-aware date and time display.
- `<ziiiro-clock />` Make time for fun. [Inspired by Ziiiro.](http://www.ziiiro.com/)

# 💾 Install

From the [Google Chrome Web
Store.](https://chrome.google.com/webstore/detail/kairo/lcomlokgcbklomfecjjpjlncapnhepbl?hl=en-US)

# 🗒️ Dev Notes

### Install

To install locally, you need to run `yarn install` in
addition to `deno install` from the project root. If you're
still seeing errors in VS Code, run the `Developer: Restart
Extension Host` command.

### Monorepo

This monorepo consists two very small packages:

- `extension`: The Google Chrome extension
- `api`: A simple API for getting photos from Unsplash

### Unsplash

Unfortunately, Unsplash retired `source.unsplash.com` which
this extension used exclusively. Unsplash now requires using
their API which itself dictates we keep hidden all API keys.
So, yes, a monorepo which includes an API is hilarious
overkill for a new tab browser extension. But yet, here we are!

### Deno & Node.js

This entire project would have been in Deno, but to keep the
Chrome extension in TypeScript, a build step was necessary.
The current best options were Vite and Esbuild, neither of
which worked, without issue, in Deno. Vite works in Node.js, so
here we are. As a result, this monorepo requires both
Node.js and Deno.

### deployctl

Deno's CLI deploy app, is finicky af. As such, most of the
configuration can be found in `deno.json` with the exception
of `env-file` which needs to be set as a CLI option. In
addition, the `env-cmd` project is used to prevent creating
a new key for each deployment. This works by using the
`DENO_DEPLOY_TOKEN` env variable inside the `.env` file. Neato!

## What's with the name?

It's a play on the word "Kairos," Greek for the right or opportune time.
