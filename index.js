const chalk = require('chalk');
const { Transformer } = require('@parcel/plugin');

const getMetaTag = (html, property) => {
  const regex = new RegExp(
    `<meta[^>]*property=["|']${property}["|'][^>]*>`,
    'i',
  );
  const results = regex.exec(html);

  if (!results) {
    throw new Error(`Missing ${property}`);
  }

  return results[0];
};

const getMetaTagContent = (metaTagHtml) => {
  const contentRegex = /content="([^"]*)"/i;
  const results = contentRegex.exec(metaTagHtml);

  if (!results) {
    throw new Error(`Missing content attribute in ${chalk.bold(metaTagHtml)}`);
  }

  return results[1];
};

module.exports = new Transformer({
  async transform({ asset }) {
    const html = await asset.getCode();
    try {
      const ogImageTag = getMetaTag(html, 'og:image');
      const ogImageContent = getMetaTagContent(ogImageTag);

      const twitterImageTag = getMetaTag(html, 'twitter:image');
      const twitterImageContent = getMetaTagContent(twitterImageTag);

      const ogUrlTag = getMetaTag(html, 'og:url');
      const ogUrlContent = getMetaTagContent(ogUrlTag);

      // instead of url.resolve, we just append directly.
      // the reason is it seems like Parcel 2 just goes through
      // and replaces content hash with string replace and adds a `/`
      // in front of it. So if we do url resolve then we get a double
      // `//` and the link won't work.
      const absoluteImageUrl = ogUrlContent + ogImageContent;

      const ogImageTagAbsoluteUrl = ogImageTag.replace(
        ogImageContent,
        absoluteImageUrl,
      );

      const twitterImageTagAbsoluteUrl = twitterImageTag.replace(
        twitterImageContent,
        absoluteImageUrl,
      );

      // we assume the twitter:image meta tag has the same URL as the og:image tag
      const patchedHtml = html
        .replace(ogImageTag, ogImageTagAbsoluteUrl)
        .replace(twitterImageTag, twitterImageTagAbsoluteUrl);

      asset.setCode(patchedHtml);
    } catch (error) {
      throw new Error(error.message);
    }

    return [asset];
  },
});
