var axios = require("axios");
let url = require("url");

function getMatches(regex, string) {
  var match;
  var matches = [];
  while ((match = regex.exec(string))) {
    matches.push(match[1]);
  }

  return matches;
}

function baseUrl(url_string) {
  const url_parts = url.parse(url_string);

  return `${url_parts.protocol}//${url_parts.host}`;
}

function removeBaseUrlIfExists(base, url) {
  if (url.indexOf(base) === 0) {
    return url.substring(base.length);
  }

  return url;
}

exports.index = async function(req, res, next) {
  const page_url = req.query.url;
  const base = baseUrl(page_url);
  const response = await axios.get(page_url);
  const regex = /<a([^>]*?)href\s*=\s*(['"])([^\2]*?)\2\1*>/i;

  let links = getMatches(/<a[^>]+href=["|'](.*?)["|']/g, response.data)
    .map(link => removeBaseUrlIfExists(base, link))
    .filter(link => link[0] === "/")
    .map(link => `${base}${link}`);

  return res.json([...new Set(links)]);
};
