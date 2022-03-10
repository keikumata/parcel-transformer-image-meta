/**
 * Define package consts.
 */
const url = require('url');
const { Transformer } = require('@parcel/plugin');

/**
 * Extract a meta tag from given html strings.
 *
 * @param {String} html HTML strings.
 * @param {String} property Meta property name.
 * @returns {bool|String} Meta tag.
 */
const getMetaTag = (html, property) => {
  // Regex to match & fetch the meta tag by using name or property attr and it's value.
  const regex = new RegExp(
    `<meta[^>]*(name|property)=["|']${property}["|'][^>]*>`,
    'i',
  );
  // Execute the regex.
  const results = regex.exec(html);
  // Return false or [0] form results.
  return results ? results[0] : false;
};

/**
 * Extract the content of given meta tag html.
 *
 * @param {String} metaTagHtml Meta tag html.
 * @returns {bool|String} Meta content value.
 */
const getMetaTagContent = (metaTagHtml) => {
  // Regex to fetch the content value from the regex.
  const contentRegex = /content="([^"]*)"/i;
  // Execute the regex.
  const results = contentRegex.exec(metaTagHtml);
  // Return false or [1] form results.
  return results ? results[1] : false;
};

/**
 * Change the url of a meta by prepending the given baseUrl.
 *
 * @param {String} metaHTML Meta tag html.
 * @param {String} baseUrl Base url(site url)
 * @returns {String} Meta tag html.
 */
const getReplacedMetaTagContent = (metaHTML, baseUrl) => {
  // Get meta content from meta html.
  const metaContent = getMetaTagContent(metaHTML);

  // if meta content is not found then return original meta html.
  if (!metaContent) {
    return metaHTML;
  }

  /**
   * Removed contact system,it was failing if
   * '/' is not available at string on image content.
   *
   * used:  https://example.com in url
   *        example.png in image content
   * result: https://example.comexample.png
   */
  return metaHTML.replace(metaContent, url.resolve(baseUrl, metaContent));
};

/**
 * Find and replace meta in given html.
 *
 * @param {String} contents Html strings.
 * @param {String} imageProperty Image property name(og:image, twitter:image)
 * @param {String} urlProperty Url property name(og:url|twitter:url|(twitter:url|og:url))
 * @returns {String} Html strings
 */
const findReplaceMeta = (
  contents,
  imageProperty = 'og:image',
  urlProperty = 'og:url',
) => {
  // Find the meta tag for url;
  const urlTag = getMetaTag(contents, urlProperty);

  // Return original html if tag not found.
  if (!urlTag) {
    return contents;
  }

  // Find the url from the url tag.
  const baseUrl = getMetaTagContent(urlTag);

  // Return original htmle if tag content not found.
  if (!baseUrl) {
    return contents;
  }

  // Fetch the image tag
  const imageMeta = getMetaTag(contents, imageProperty);

  // Check if image meta tag is found.
  if (imageMeta) {
    // Replace the meta tag with replaced meta tag html.
    return contents.replace(
      imageMeta,
      getReplacedMetaTagContent(imageMeta, baseUrl),
    );
  }

  // Return original contents.
  return contents;
};

module.exports = new Transformer({
  async transform({ asset }) {
    const html = await asset.getCode();
    try {
      let patchedHtml = html;
      // Replace og:image with og:url
      patchedHtml = findReplaceMeta(patchedHtml, 'og:image', 'og:url');
      // Replace twitter:image with og:url or twitter:url(if og:url) is not available.
      // Based of regex whatever matched first will be used.
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
