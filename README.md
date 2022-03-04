# parcel-transformer-meta-image

[![npm version](https://badge.fury.io/js/parcel-transformer-meta-image.svg)](https://badge.fury.io/js/parcel-transformer-meta-image)

Set absolute URL for og:image meta tags by parcel ver >= 2.0.0.

Inspired by [lukechilds/parcel-plugin-ogimage](https://github.com/lukechilds/parcel-plugin-ogimage)

## Install

```shell
$ npm install -D parcel-transformer-meta-image
```

Create `.parcelrc` file and paste:

```json
{
  "extends": "@parcel/config-default",
  "transformers": { "*.html": ["...", "parcel-transformer-meta-image"] }
}
```

## Usage

Just install this package as a development dependency. Parcel will automatically call it when building your application.

You **must** have both `og:image`, `twitter:image`, and `og:url` meta tags:

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

`parcel-plugin-image-meta` will then update the `og:image` with an absolute URL:

```html
<meta property="og:image" content="https://example.com/card.9190ce93.png" />
<meta
  property="twitter:image"
  content="https://example.com/card.9190ce93.png"
/>
<meta property="og:url" content="https://example.com" />
```

## LICENSE

MIT
