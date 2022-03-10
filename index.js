/**
 * Define packages.
 */
const url = require('url');
const { Transformer } = require('@parcel/plugin');

/**
 * Extract a meta from a given html string.
 *
 * @param {String} html File HTML.
 * @param {String} property Property name.
 * @returns {bool|String}
 */
const getMetaTag = (html, property) => {
  const regex = new RegExp(
    `<meta[^>]*(name|property)=["|']${property}["|'][^>]*>`,
    'i',
  );
  const results = regex.exec(html);
  return results ? results[0] : false;
};

/**
 * Extract the content of a given meta html.
 *
 * @param {String} metaTagHtml Meta tag html.
 * @returns {bool|String}
 */
const getMetaTagContent = (metaTagHtml) => {
  const contentRegex = /content="([^"]*)"/i;
  const results = contentRegex.exec(metaTagHtml);
  return results ? results[1] : false;
};

/**
 * Change the url of a meta by prepending the given baseUrl.
 *
 * @param {String} metaHTML Meta tag html.
 * @param {String} baseUrl Base url(site url)
 * @returns {String}
 */
const getReplacedMetaTagContent = (metaHTML, baseUrl) => {
  const metaContent = getMetaTagContent(metaHTML);
  // Removed contact system,it was failing if
  // '/' is not available at string on image content.
  return metaHTML.replace(metaContent, url.resolve(baseUrl, metaContent));
};

/**
 * Find and replace meta.
 *
 * @param {String} contents Html content.
 * @param {String} imageProperty Image property name(og:image, twitter:image)
 * @param {String} urlProperty Url property name(og:url)
 * @returns {String}
 */
const findReplaceMeta = (
  contents,
  imageProperty = 'og:image',
  urlProperty = 'og:url',
) => {
  const urlTag = getMetaTag(contents, urlProperty);
  if (!urlTag) {
    return contents;
  }

  const baseUrl = getMetaTagContent(urlTag);
  if (!baseUrl) {
    return contents;
  }

  // Fetch original meta.
  const imageMeta = getMetaTag(contents, imageProperty);
  if (imageMeta) {
    return contents.replace(
      imageMeta,
      getReplacedMetaTagContent(imageMeta, baseUrl),
    );
  }

  return contents;
};

module.exports = new Transformer({
  async transform({ asset }) {
    const html = await asset.getCode();
    try {
      let patchedHtml = html;
      // we assume the twitter:image meta tag has the same URL as the og:image tag
      patchedHtml = findReplaceMeta(patchedHtml, 'og:image', 'og:url');
      patchedHtml = findReplaceMeta(
        patchedHtml,
        'twitter:image',
        '(og:url|twitter:url)',
      );
      asset.setCode(patchedHtml);
    } catch (error) {
      throw new Error(error.message);
    }

    return [asset];
  },
});
