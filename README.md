# parcel-transformer-meta-image

[![npm version](https://badge.fury.io/js/parcel-transformer-meta-image.svg)](https://badge.fury.io/js/parcel-transformer-meta-image)

Set absolute URL for `og:image` & `twitter:image` meta tags. This is required by the spec and relative URLs will not work on some sites such as Facebook or Twitter.

This plugin uses the value of the `og:url` meta tag to convert `og:image` & `twitter:image` to an absolute URL.
if you're only using twitter meta tags then `twitter:url` will be used for twitter tags but if `og:url` is available and used before `twitter:url` then `og:url` value will be used.

*Important:* This plugin request [Parcel v2](https://v2.parceljs.org/)

Inspired by [lukechilds/parcel-plugin-ogimage](https://github.com/lukechilds/parcel-plugin-ogimage)

## Install

```shell
npm install --save-dev parcel-transformer-meta-image
```
```shell
yarn add --dev parcel-transformer-meta-image
```

Next, add the plugin to the transformer entry in your `.parcelrc`:

```json
{
  "extends": "@parcel/config-default",
  "transformers": { "*.html": ["...", "parcel-transformer-meta-image"] }
}
```

## Usage

You **must** have `og:image`, `twitter:image`, and `og:url` meta tags:

```html
<meta property="og:image" content="card.png" />
<meta property="twitter:image" content="card.png" />
<meta property="og:url" content="https://example.com" />
```

Parcel will generate that into something like this:

```html
<meta property="og:image" content="/card.9190ce93.png" />
<meta property="twitter:image" content="/card.9190ce93.png" />
<meta property="og:url" content="https://example.com" />
```

`parcel-transformer-meta-image` will then update the `og:image` & `twitter:image` with an absolute URL:

```html
<meta property="og:image" content="https://example.com/card.9190ce93.png" />
<meta property="twitter:image" content="https://example.com/card.9190ce93.png" />
<meta property="og:url" content="https://example.com" />
```

## LICENSE

MIT
