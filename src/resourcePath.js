/**
 * This method is intended for encoding *key* or *value* parts of query component. We need a
 * custom method because encodeURIComponent is too aggressive and encodes stuff that doesn't
 * have to be encoded per http://tools.ietf.org/html/rfc3986:
 *    query       = *( pchar / "/" / "?" )
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 * Source: https://github.com/angular/angular.js/blob/720012eab6fef5e075a1d6876dd2e508c8e95b73/src/ngResource/resource.js#L405
 */
function encodeUriQuery(val, pctEncodeSpaces) {
  return encodeURIComponent(val)
    .replace(/%40/gi, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
}

/**
 * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
 * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set
 * (pchar) allowed in path segments:
 *    segment       = *pchar
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 * Source: https://github.com/angular/angular.js/blob/720012eab6fef5e075a1d6876dd2e508c8e95b73/src/ngResource/resource.js#L386
 */
function encodeUriSegment(val) {
  return encodeUriQuery(val, true)
    .replace(/%26/gi, '&')
    .replace(/%3D/gi, '=')
    .replace(/%2B/gi, '+');
}

/**
 * Generate a path given a URL with resource identifiers.
 * The URL should be a valid absolute/relative one, in the format of /path/to/resource
 * If identifiers are used, they will be preceded with a colon: /path/to/resource/:identifier
 * Parameters are optional, and if one is missing the rest of the path will be ignored.
 * This code has been ported from Angular's source: https://github.com/angular/angular.js/blob/720012eab6fef5e075a1d6876dd2e508c8e95b73/src/ngResource/resource.js#L420
 * @param uri Path to the resource
 * @param params Object containing {key: value} pairs for each parameter
 * @returns {*}
 */
function resource(uri, params = {}) {
  const PROTOCOL_AND_IPV6_REGEX = /^https?:\/\/\[[^\]]*][^/]*/;

  let url = uri;
  const urlParams = {};
  let encodedVal;
  let protocolAndIpv6 = '';

  url.split(/\W/).forEach((param) => {
    if (param === 'hasOwnProperty') {
      throw Error('badname', 'hasOwnProperty is not a valid parameter name.');
    }
    if (!(new RegExp('^\\d+$').test(param)) && param &&
      (new RegExp(`(^|[^\\\\]):${param}(\\W|$)`).test(url))) {
      urlParams[param] = {
        isQueryParamValue: (new RegExp(`\\?.*=:${param}(?:\\W|$)`)).test(url),
      };
    }
  });

  url = url.replace(/\\:/g, ':');
  url = url.replace(PROTOCOL_AND_IPV6_REGEX, (match) => {
    protocolAndIpv6 = match;
    return '';
  });

  Object.keys(urlParams).forEach((urlParam) => {
    const val = params[urlParam];
    const paramInfo = urlParams[urlParam];
    if (typeof val !== 'undefined' && val !== null) {
      if (paramInfo.isQueryParamValue) {
        encodedVal = encodeUriQuery(val, true);
      } else {
        encodedVal = encodeUriSegment(val);
      }
      url = url.replace(new RegExp(`:${urlParam}(\\W|$)`, 'g'), (match, p1) => encodedVal + p1);
    } else {
      url = url.replace(new RegExp(`(/?):${urlParam}(\\W|$)`, 'g'), (match, leadingSlashes, tail) => {
        if (tail.charAt(0) === '/') {
          return tail;
        }
        return leadingSlashes + tail;
      });
    }
  });

  // strip trailing slashes and set the url (unless this behavior is specifically disabled)
  url = url.replace(/\/+$/, '') || '/';

  url = protocolAndIpv6 + url.replace(/\/\\\./, '/.');

  return url;
}

module.exports = resource;
module.exports.default = resource;