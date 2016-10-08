# Markdown-It Wikilinks

[![Coverage Status](https://coveralls.io/repos/github/jsepia/markdown-it-wikilinks/badge.svg?branch=master)](https://coveralls.io/github/jsepia/markdown-it-wikilinks?branch=master)

Renders Wikimedia-style wiki links in [markdown-it](https://github.com/markdown-it/markdown-it). This is useful for making Markdown-based wikis.

## Usage

Install this into your project:

```bash
npm --save install git+https://github.com/jsepia/markdown-it-wikilinks.git
```

...and *use* it:

```js
var md = require('markdown-it')()
             .use(require('markdown-it-wikilinks')())
             .render('Click [[Wiki Links|here]] to learn about wiki links.')
```

**Output:**

```html
<p>Click <a href="./wiki-links">here</a> to learn about wiki links.</p>
```

## TODO

Document all the options.

## Credits

Based on [markdown-it-ins](https://github.com/markdown-it/markdown-it-ins) by Vitaly Puzrin, Alex Kocharin.
