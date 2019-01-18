/*!
 * *//* eslint-disable */
/*!
 * react-urlstack v0.2.3
 * (c) 2018-present Javier Marquez
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react-native'), require('react'), require('prop-types')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react-native', 'react', 'prop-types'], factory) :
  (factory((global.UrlStack = {}),global.ReactNative,global.React,global.PropTypes));
}(this, (function (exports,reactNative,React,PropTypes) { 'use strict';

  var reactNative__default = 'default' in reactNative ? reactNative['default'] : reactNative;
  var React__default = 'default' in React ? React['default'] : React;
  PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  var isarray = require('isarray');
  /**
   * Expose `pathToRegexp`.
   */


  module.exports = pathToRegexp;
  module.exports.parse = parse;
  module.exports.compile = compile;
  module.exports.tokensToFunction = tokensToFunction;
  module.exports.tokensToRegExp = tokensToRegExp;
  /**
   * The main path matching regexp utility.
   *
   * @type {RegExp}
   */

  var PATH_REGEXP = new RegExp([// Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)', // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'].join('|'), 'g');
  /**
   * Parse a string for the raw tokens.
   *
   * @param  {string}  str
   * @param  {Object=} options
   * @return {!Array}
   */

  function parse(str, options) {
    var tokens = [];
    var key = 0;
    var index = 0;
    var path = '';
    var defaultDelimiter = options && options.delimiter || '/';
    var res;

    while ((res = PATH_REGEXP.exec(str)) != null) {
      var m = res[0];
      var escaped = res[1];
      var offset = res.index;
      path += str.slice(index, offset);
      index = offset + m.length; // Ignore already escaped sequences.

      if (escaped) {
        path += escaped[1];
        continue;
      }

      var next = str[index];
      var prefix = res[2];
      var name = res[3];
      var capture = res[4];
      var group = res[5];
      var modifier = res[6];
      var asterisk = res[7]; // Push the current path onto the tokens.

      if (path) {
        tokens.push(path);
        path = '';
      }

      var partial = prefix != null && next != null && next !== prefix;
      var repeat = modifier === '+' || modifier === '*';
      var optional = modifier === '?' || modifier === '*';
      var delimiter = res[2] || defaultDelimiter;
      var pattern = capture || group;
      tokens.push({
        name: name || key++,
        prefix: prefix || '',
        delimiter: delimiter,
        optional: optional,
        repeat: repeat,
        partial: partial,
        asterisk: !!asterisk,
        pattern: pattern ? escapeGroup(pattern) : asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?'
      });
    } // Match any characters still remaining.


    if (index < str.length) {
      path += str.substr(index);
    } // If the path exists, push it onto the end.


    if (path) {
      tokens.push(path);
    }

    return tokens;
  }
  /**
   * Compile a string to a template function for the path.
   *
   * @param  {string}             str
   * @param  {Object=}            options
   * @return {!function(Object=, Object=)}
   */


  function compile(str, options) {
    return tokensToFunction(parse(str, options));
  }
  /**
   * Prettier encoding of URI path segments.
   *
   * @param  {string}
   * @return {string}
   */


  function encodeURIComponentPretty(str) {
    return encodeURI(str).replace(/[\/?#]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
  }
  /**
   * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
   *
   * @param  {string}
   * @return {string}
   */


  function encodeAsterisk(str) {
    return encodeURI(str).replace(/[?#]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
  }
  /**
   * Expose a method for transforming tokens into the path function.
   */


  function tokensToFunction(tokens) {
    // Compile all the tokens into regexps.
    var matches = new Array(tokens.length); // Compile all the patterns before compilation.

    for (var i = 0; i < tokens.length; i++) {
      if (_typeof(tokens[i]) === 'object') {
        matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
      }
    }

    return function (obj, opts) {
      var path = '';
      var data = obj || {};
      var options = opts || {};
      var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          path += token;
          continue;
        }

        var value = data[token.name];
        var segment;

        if (value == null) {
          if (token.optional) {
            // Prepend partial segment prefixes.
            if (token.partial) {
              path += token.prefix;
            }

            continue;
          } else {
            throw new TypeError('Expected "' + token.name + '" to be defined');
          }
        }

        if (isarray(value)) {
          if (!token.repeat) {
            throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`');
          }

          if (value.length === 0) {
            if (token.optional) {
              continue;
            } else {
              throw new TypeError('Expected "' + token.name + '" to not be empty');
            }
          }

          for (var j = 0; j < value.length; j++) {
            segment = encode(value[j]);

            if (!matches[i].test(segment)) {
              throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`');
            }

            path += (j === 0 ? token.prefix : token.delimiter) + segment;
          }

          continue;
        }

        segment = token.asterisk ? encodeAsterisk(value) : encode(value);

        if (!matches[i].test(segment)) {
          throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
        }

        path += token.prefix + segment;
      }

      return path;
    };
  }
  /**
   * Escape a regular expression string.
   *
   * @param  {string} str
   * @return {string}
   */


  function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1');
  }
  /**
   * Escape the capturing group by escaping special characters and meaning.
   *
   * @param  {string} group
   * @return {string}
   */


  function escapeGroup(group) {
    return group.replace(/([=!:$\/()])/g, '\\$1');
  }
  /**
   * Attach the keys as a property of the regexp.
   *
   * @param  {!RegExp} re
   * @param  {Array}   keys
   * @return {!RegExp}
   */


  function attachKeys(re, keys) {
    re.keys = keys;
    return re;
  }
  /**
   * Get the flags for a regexp from the options.
   *
   * @param  {Object} options
   * @return {string}
   */


  function flags(options) {
    return options.sensitive ? '' : 'i';
  }
  /**
   * Pull out keys from a regexp.
   *
   * @param  {!RegExp} path
   * @param  {!Array}  keys
   * @return {!RegExp}
   */


  function regexpToRegexp(path, keys) {
    // Use a negative lookahead to match only capturing groups.
    var groups = path.source.match(/\((?!\?)/g);

    if (groups) {
      for (var i = 0; i < groups.length; i++) {
        keys.push({
          name: i,
          prefix: null,
          delimiter: null,
          optional: false,
          repeat: false,
          partial: false,
          asterisk: false,
          pattern: null
        });
      }
    }

    return attachKeys(path, keys);
  }
  /**
   * Transform an array into a regexp.
   *
   * @param  {!Array}  path
   * @param  {Array}   keys
   * @param  {!Object} options
   * @return {!RegExp}
   */


  function arrayToRegexp(path, keys, options) {
    var parts = [];

    for (var i = 0; i < path.length; i++) {
      parts.push(pathToRegexp(path[i], keys, options).source);
    }

    var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));
    return attachKeys(regexp, keys);
  }
  /**
   * Create a path regexp from string input.
   *
   * @param  {string}  path
   * @param  {!Array}  keys
   * @param  {!Object} options
   * @return {!RegExp}
   */


  function stringToRegexp(path, keys, options) {
    return tokensToRegExp(parse(path, options), keys, options);
  }
  /**
   * Expose a function for taking tokens and returning a RegExp.
   *
   * @param  {!Array}          tokens
   * @param  {(Array|Object)=} keys
   * @param  {Object=}         options
   * @return {!RegExp}
   */


  function tokensToRegExp(tokens, keys, options) {
    if (!isarray(keys)) {
      options =
      /** @type {!Object} */
      keys || options;
      keys = [];
    }

    options = options || {};
    var strict = options.strict;
    var end = options.end !== false;
    var route = ''; // Iterate over the tokens and create our regexp string.

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        route += escapeString(token);
      } else {
        var prefix = escapeString(token.prefix);
        var capture = '(?:' + token.pattern + ')';
        keys.push(token);

        if (token.repeat) {
          capture += '(?:' + prefix + capture + ')*';
        }

        if (token.optional) {
          if (!token.partial) {
            capture = '(?:' + prefix + '(' + capture + '))?';
          } else {
            capture = prefix + '(' + capture + ')?';
          }
        } else {
          capture = prefix + '(' + capture + ')';
        }

        route += capture;
      }
    }

    var delimiter = escapeString(options.delimiter || '/');
    var endsWithDelimiter = route.slice(-delimiter.length) === delimiter; // In non-strict mode we allow a slash at the end of match. If the path to
    // match already ends with a slash, we remove it for consistency. The slash
    // is valid at the end of a path match, not in the middle. This is important
    // in non-ending mode, where "/test/" shouldn't match "/test//route".

    if (!strict) {
      route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
    }

    if (end) {
      route += '$';
    } else {
      // In non-ending mode, we need the capturing groups to match as much as
      // possible by using a positive lookahead to the end or next path segment.
      route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
    }

    return attachKeys(new RegExp('^' + route, flags(options)), keys);
  }
  /**
   * Normalize the given path string, returning a regular expression.
   *
   * An empty array can be passed in for the keys, which will hold the
   * placeholder key descriptions. For example, using `/user/:id`, `keys` will
   * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
   *
   * @param  {(string|RegExp|Array)} path
   * @param  {(Array|Object)=}       keys
   * @param  {Object=}               options
   * @return {!RegExp}
   */


  function pathToRegexp(path, keys, options) {
    if (!isarray(keys)) {
      options =
      /** @type {!Object} */
      keys || options;
      keys = [];
    }

    options = options || {};

    if (path instanceof RegExp) {
      return regexpToRegexp(path,
      /** @type {!Array} */
      keys);
    }

    if (isarray(path)) {
      return arrayToRegexp(
      /** @type {!Array} */
      path,
      /** @type {!Array} */
      keys, options);
    }

    return stringToRegexp(
    /** @type {string} */
    path,
    /** @type {!Array} */
    keys, options);
  }

  var pathToRegexp$1 = /*#__PURE__*/Object.freeze({

  });

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var dist = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _a = Object.prototype,
      toString = _a.toString,
      hasOwnProperty = _a.hasOwnProperty;
  var OBJECT_TYPE = "[object Object]";
  var ARRAY_TYPE = "[object Array]";
  /**
   * @description
   * Creates a querystring style object from a nested one.
   *
   * @example
   * var result = flatten({ a: { b: 1 }, c: { d: 1 } });
   * result; //-> { "a[b]": 1, "c[d]": 2 }
   *
   * @param obj The object to flatten.
   */

  function flatten(obj, path, result) {
    var type = toString.call(obj);

    if (result === undefined) {
      if (type === OBJECT_TYPE) {
        result = {};
      } else if (type === ARRAY_TYPE) {
        result = [];
      } else {
        return;
      }
    }

    for (var key in obj) {
      /* istanbul ignore if */
      if (!hasOwnProperty.call(obj, key)) {
        continue;
      }

      var val = obj[key];

      if (val == null) {
        continue;
      }

      switch (toString.call(val)) {
        case ARRAY_TYPE:
        case OBJECT_TYPE:
          flatten(val, join(path, key), result);
          break;

        default:
          result[join(path, key)] = val;
          break;
      }
    }

    return result;
  }

  exports.flatten = flatten;
  /**
   * Join path keys using query string `a[b]` style syntax.
   */

  function join(path, key) {
    return path != null ? path + "[" + key + "]" : key;
  }
  });

  unwrapExports(dist);
  var dist_1 = dist.flatten;

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var matchArray = /[^\[\]]+|\[\]/g;
  var matchInteger = /^\d+$/;
  var temp = [];
  /**
   * @description
   * A setter for querystring style fields like "a[b][c]".
   * The setter will create arrays for repeat keys and supports the "[]" push syntax.
   *
   * @example
   * deep({}, "a[b][c]", 1) // { a: { b: { c: 1 } } }
   *
   * @param obj The object to set a value on.
   * @param path The querystring path to set.
   * @param value The value to set at the path.
   */

  function deep(obj, path, value) {
    var keys = path === "" ? [""] : path.match(matchArray);
    var len = keys.length;
    var cur = obj;
    var prev;
    var key;
    var exists;

    for (var i = 0; i < len; i++) {
      prev = cur;
      key = keys[i];
      var next = keys[i + 1];

      if (key === "[]") {
        key = cur.length;
      } // Make path as we go.


      cur = (exists = _typeof(cur) === "object" && key in cur) ? cur[key] : // Check if the next path is an explicit array.
      cur[key] = next === "[]" || matchInteger.test(next) ? [] : {};
    }

    prev[key] = exists ? temp.concat(cur, value) : value;
    return obj;
  }

  exports.deep = deep;
  /**
   * @description
   * Appends to an object using query string syntax with "[]" syntax push support.
   *
   * @example
   * shallow({}, "a[b][c]", 1) // { "a[b][c]": 1 }
   * shallow({}, "a[]", 1) // { a: [1] }
   *
   * @param obj The object to set a value on.
   * @param path The querystring path to set.
   * @param value The value to set at the path.
   */

  function shallow(obj, key, val) {
    key = arrayPushIndexes(obj, key);
    obj[key] = key in obj ? temp.concat(obj[key], val) : val;
    return obj;
  }

  exports.shallow = shallow;
  /**
   * Given a qs style key and an object will convert array push syntax to integers.
   * Eg: a[b][] -> a[b][0]
   */

  function arrayPushIndexes(obj, key) {
    var path = key.split("[]");

    if (path.length === 1) {
      return key;
    }

    var cur = path[0];
    var keys = Object.keys(obj);

    for (var i = 1, len = path.length; i < len; i++) {
      cur += "[" + findLastIndex(keys, cur) + "]" + path[i];
    }

    return cur;
  }
  /**
   * Given a path to push to will return the next valid index if possible.
   * Eg: a[b][] -> 0 // if array is empty.
   */


  function findLastIndex(keys, path) {
    var last = -1;

    for (var i = keys.length; i--;) {
      var key = keys[i];

      if (key.indexOf(path) !== 0) {
        continue;
      }

      var index = Number(key.replace(path, "").slice(1, key.indexOf("]") - 1));

      if (index > last) {
        last = index;
      }
    }

    return last + 1;
  }

  var dist$1 = /*#__PURE__*/Object.freeze({

  });

  var dist$2 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });





  var parseReg = /([^=?&]+)=?([^&]*)/g;
  /**
   * @description
   * Converts an object to a query string and optionally flattens it.
   *
   * @example
   * stringify({ a: 1 }) === 'a=1'
   *
   * stringify({ a: { b: 1 } }, true) === 'a[b]=1'
   *
   * @param obj The object to stringify.
   * @param deep If true the object will be flattened using query string syntax.
   */

  function stringify(obj, deep) {
    if (deep) {
      obj = dist.flatten(obj);
    }

    var keys = Object.keys(obj);

    if (!keys.length) {
      return "";
    }

    for (var i = 0, len = keys.length; i < len; i++) {
      var key = keys[i];
      keys[i] = encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
    }

    return keys.join("&");
  }

  exports.stringify = stringify;
  /**
   * @description
   * Parses a query string and optionally unflattens it.
   *
   * @example
   * parse('a=1&b=2&') === "{ a: '1', b: '2' }"
   *
   * parse('a=1&b[c]=2', true) === "{ a: '1', b: { c: '1' } }"
   *
   * @param str The string to parse.
   * @param deep If true, nested querystring paths will be resolved.
   */

  function parse(str, deep) {
    var set = deep ? dist$1.deep : dist$1.shallow;
    var result = {};

    for (;;) {
      var part = parseReg.exec(str);

      if (!part) {
        break;
      }

      var prop = part[1],
          val = part[2];
      set(result, decodeURIComponent(prop), decodeURIComponent(val));
    }

    return result;
  }

  exports.parse = parse;
  });

  unwrapExports(dist$2);
  var dist_1$1 = dist$2.stringify;
  var dist_2 = dist$2.parse;

  /*
  routes = {
    path: '/hola',
    cb: fn,
    children: []
  }
  */
  // parseUrl function needed for testing


  var parseUrl;

  if (typeof window !== 'undefined') {
    parseUrl = function parseUrl(url) {
      var a = document.createElement('a');
      a.href = url;
      return a;
    };
  } // The lib


  var urlhub = {
    create: function create(options) {
      return new Urlhub(options);
    },
    joinUrls: joinUrls // just for testing never used, see helpers at bottom
    // The class

  };

  var Urlhub = function Urlhub(options) {
    if (!options || !options.strategy) {
      throw new Error('Router needs an strategy to listen to url changes.');
    }

    var s = options.strategy;
    var ops = {};
    Object.keys(options).forEach(function (key) {
      if (key === 'strategy') return;
      ops[key] = options[key];
    });
    s.init && s.init(ops);
    this.strategy = s; // Callbacks before the route change

    this.obc = []; // Callbacks to be called on route change

    this.cbs = [];
  };

  var prototype = {
    setRoutes: function setRoutes(routes) {
      this.routes = this.parseRoutes(routes);
    },
    // Route translation methods
    parseRoutes: function parseRoutes(routes, parent) {
      if (!routes) console.warn('No routes provided to parseRoutes');

      if (!routes.length) {
        routes = [routes];
      }

      var parsedRoutes = [],
          me = this;
      routes.forEach(function (r) {
        var path = joinUrls(parent, r.path);
        var params = [],
            parsed = {
          regex: pathToRegexp$1(path, params),
          id: path,
          cb: r.cb
        };
        parsed.params = params.map(function (p) {
          return p.name;
        });

        if (r.children && r.children.length) {
          parsed.childRegex = pathToRegexp$1(path, [], {
            end: false
          });
          parsed.children = me.parseRoutes(r.children, path);
        }

        parsedRoutes.push(parsed);
      });
      return parsedRoutes;
    },
    match: function match(location, candidates, isChild) {
      var i = 0,
          url = sanitizeUrl(location),
          path,
          found,
          match,
          c;

      if (!candidates) {
        candidates = this.routes;
      }

      var parsed = (this.strategy.parseUrl || parseUrl)(url);
      path = parsed.pathname; // Normalize pathname

      if (path[0] !== '/') {
        path = '/' + path;
      }

      while (i < candidates.length && !found) {
        c = candidates[i];

        if (c.childRegex) {
          //console.log( 'failed', c.regex, path );
          found = c.childRegex.exec(path);

          if (found) {
            match = this.match(url, c.children, true);

            if (match.matches.length) {
              match.matches = [c.cb].concat(match.matches);
              match.matchIds = [c.id].concat(match.matchIds);
              return match; // The recursive call will give all the info
            } else {
              found = false;
            }
          }
        }

        found = c.regex.exec(path);

        if (found) {
          found = {
            id: c.id,
            cb: c.cb,
            params: found.slice(1)
          };
        }

        if (!found) {
          i++;
        }
      }

      var matches = [];
      var matchIds = [];

      if (found) {
        matches.push(found.cb);
        matchIds.push(found.id);
      } else if (!isChild) {
        console.error('There is no route match for ' + location);
      }

      match = {
        matches: matches,
        matchIds: matchIds,
        pathname: path,
        search: parsed.search,
        query: dist$2.parse(parsed.search),
        hash: parsed.hash,
        route: found && found.id || false,
        params: {}
      };

      if (found) {
        c.params.forEach(function (p, i) {
          match.params[p] = found.params[i];
        });
      }

      return match;
    },
    // Routing methods
    start: function start() {
      var me = this;
      this.strategy.onChange(function () {
        var change = me.checkChange();
        if (!change.next) return;

        if (change.current !== change.next) {
          me.strategy.replace(change.next);
        } else {
          me.location = change.nextLocation;
          me.cbs.forEach(function (cb) {
            cb(change.nextLocation);
          });
        }
      });
      this.strategy.start();
      this.location = this.match(this.strategy.getLocation());
      return this.location;
    },
    stop: function stop() {
      this.strategy.onChange(function () {});
    },
    refresh: function refresh() {
      var change = this.checkChange();
      change.next && change.current !== change.next && this.strategy.replace(change.next);
    },
    checkChange: function checkChange() {
      var current = this.strategy.getLocation(),
          nextLocation = this.runOnBeforeChange(this.match(current)),
          next = nextLocation && nextLocation.pathname + nextLocation.search + nextLocation.hash;
      return {
        current: current,
        next: next,
        nextLocation: nextLocation
      };
    },
    runOnBeforeChange: function runOnBeforeChange(match) {
      var me = this;
      this.obc.forEach(function (cb) {
        if (match) {
          match = cb(match);

          if (typeof match === 'string') {
            match = me.match(match);
          }
        }
      });
      return match;
    },
    onBeforeChange: function onBeforeChange(cb) {
      this.obc.push(cb);
    },
    onChange: function onChange(cb) {
      this.cbs.push(cb);
    },
    push: function push(location) {
      this.updateLocation('push', location);
    },
    replace: function replace(location) {
      this.updateLocation('replace', location);
    },
    back: function back() {
      this.strategy.back();
    },
    updateLocation: function updateLocation(method, location) {
      var current = this.strategy.getLocation();
      var next;

      if (typeof location === 'string') {
        next = location;
      } else {
        next = mergeLocations(this.match(current), location);
      }

      var nextLocation = this.runOnBeforeChange(this.match(next));

      if (nextLocation) {
        next = nextLocation.pathname + nextLocation.search + nextLocation.hash;

        if (current !== next) {
          this.strategy[method](next);
        }
      }
    }
  };

  for (var method in prototype) {
    Urlhub.prototype[method] = prototype[method];
  }

  var urlhub_1 = urlhub;
  /********* HELPERS */

  function joinUrls(one, two) {
    var first = sanitizeUrl(one),
        second = sanitizeUrl(two);
    if (!one) return second;
    if (!two) return first;

    if (first === '/') {
      return second;
    } else if (second === '/') {
      return first;
    } else {
      return first + second;
    }
  }

  function sanitizeUrl(url) {
    if (!url) return '/';
    var sanitized = url;

    if (sanitized[sanitized.length - 1] === '/') {
      sanitized = sanitized.slice(0, sanitized.length - 1);
    }

    if (sanitized[0] !== '/') {
      sanitized = '/' + sanitized;
    }

    return sanitized;
  }

  function mergeLocations(prev, next) {
    var location = Object.assign(prev, next),
        search = location.search;

    if (Object.keys(location.query).length) {
      search = '?' + dist$2.stringify(location.query);
    } else {
      search = '';
    }

    return location.pathname + search + location.hash;
  }

  var _onChange = function onChange() {};

  var nodeStrategy = {
    init: function init(options) {
      this.history = [options.initialLocation || '/'];
    },
    start: function start() {
      this.emit();
    },
    push: function push(location) {
      this.history.push(location);
      this.emit();
    },
    replace: function replace(location) {
      this.history[this.history.length] = location;
      this.emit();
    },
    onChange: function onChange(cb) {
      _onChange = cb;
    },
    getLocation: function getLocation() {
      return this.history[this.history.length - 1];
    },
    emit: function emit() {
      _onChange && _onChange(this.getLocation());
    },
    parseUrl: function parseUrl(str) {
      var parts = str.split('?');
      var searchParts = parts[1] ? parts[1].split('#') : [];
      return {
        pathname: parts[0],
        search: searchParts[0] ? '?' + searchParts[0] : '',
        hash: searchParts[1] ? '#' + searchParts[1] : '',
        query: searchParts[0] ? dist$2.parse(searchParts[0]) : {}
      };
    },
    back: function back() {
      if (this.history.length > 1) {
        this.history.pop();
      }

      this.emit();
    }
  };
  var nodeStrategy_1 = nodeStrategy;

  var _onChange$1 = function onChange() {};

  var hashStrategy = {
    init: function init(options) {},
    start: function start() {
      var me = this;

      if (!location.hash) {
        location.hash = '#/';
      } // Register event listener


      window.onhashchange = function () {
        me.emit();
      }; // Emit first onChange


      me.emit();
    },
    push: function push(route) {
      window.location.hash = '#' + route;
    },
    replace: function replace(route) {
      var url = location.protocol + '//' + location.host + location.pathname + '#' + route;
      location.replace(url);
    },
    onChange: function onChange(cb) {
      _onChange$1 = cb;
    },
    getLocation: function getLocation() {
      if (!location.hash) {
        return '/';
      } else if (location.hash[1] !== '/') {
        return '/' + location.hash;
      }

      return location.hash.slice(1);
    },
    emit: function emit() {
      _onChange$1(this.getLocation());
    },
    back: function back() {
      window.history.back();
    }
  };
  var hashStrategy_1 = hashStrategy;

  var _onChange$2 = function onChange() {};

  var pushStrategy = {
    init: function init(options) {
      this.basePath = options.basePath || '';

      if (this.basePath.slice(-1) === '/') {
        this.basePath = this.basePath.slice(0, -1);
      }
    },
    start: function start() {
      var me = this; // Register event listener

      window.onpopstate = function () {
        me.emit();
      }; // Emit first onChange


      me.emit();
    },
    push: function push(location) {
      history.pushState({}, '', this.basePath + location);
      this.emit();
    },
    replace: function replace(location) {
      history.replaceState({}, '', this.basePath + location);
      this.emit();
    },
    onChange: function onChange(cb) {
      _onChange$2 = cb;
    },
    getLocation: function getLocation() {
      var l = location.pathname + location.search + location.hash,
          basePathLength = this.basePath.length;

      if (l.slice(0, basePathLength) === this.basePath) {
        l = l.slice(basePathLength);
      }

      return l;
    },
    emit: function emit() {
      _onChange$2 && _onChange$2(this.getLocation());
    },
    back: function back() {
      window.history.back();
    }
  };
  var pushStrategy_1 = pushStrategy;

  // Changes in the current routes will be stacking the screens,
  // if going back the screens don't get unmounted, there is an index
  // that points to the current active route
  //
  // The route also handles tab screens. Navegating in a tab screen doesn't
  // update the main stack, but the children inside the tab screen
  // If we imagine a linear stack of routes like this:
  // /a ---> /a/tab ---> /a/tab/2 ---> /a/tab/2/details ( activeIndex: 2 )
  // [0]     [1]         [2]           [3]
  // But the real stack that handles the tab screens would be like this:
  //
  //   [0]     [1]         [2]
  //   /a ---> /a/tab ---> /a/tab/2/details (activeIndex: 1)
  //              |
  //              V
  // [/a/tab/1, /a/tab/2, /a/tab/3 ] (activeTabIndex: 1)
  // [0]        [1]       [2]
  //
  // So there is a new stack for every tab

  function create(routes, options) {
    var strategy;

    if (typeof document === 'undefined') {
      strategy = nodeStrategy_1;
    } else if (options && options.strategy === 'hash') {
      strategy = hashStrategy_1;
    } else {
      strategy = pushStrategy_1;
    }

    var router = urlhub_1.create({
      strategy: strategy
    }); // callbacks registered for be called on route changes

    var callbacks = [];
    var stackRouter = {
      // The actual urlhub router
      urlhub: router,
      // The stack of screens in place, with nested tabs [{Screen, route, isTabs, isModal, key}]
      stack: [],
      // The current screen in the view port
      activeIndex: -1,
      // Route cache to generate new routes
      _nestedStack: [],
      // Last navigated URLs
      _lastNavigated: [],
      modal: {
        active: false,
        stack: [],
        activeIndex: -1
      },
      // What to do when the URL changes
      onChange: function onChange(handler) {
        callbacks.push(handler);
      },
      // The main method to update the current screen
      navigate: function navigate(route) {
        var isBack = route === this._lastNavigated[this._lastNavigated.length - 2];

        if (isBack) {
          this._lastNavigated.pop(); // unfortunatelly this is buggy in chrome
          // router.back();


          router.push.apply(router, arguments);
        } else {
          this._lastNavigated.push(route);

          router.push.apply(router, arguments);
        }
      }
    }; // Set routes and our callback that will generate the stacks

    router.setRoutes(routes);
    router.onChange(createRouteChanger(stackRouter, routes, callbacks)); // Some extra methods from urlhub

    ['start', 'stop', 'onBeforeChange', 'replace'].forEach(function (method) {
      stackRouter[method] = function () {
        return this.urlhub[method].apply(this.urlhub, arguments);
      };
    });
    return stackRouter;
  } // Helper to translate urlhub's location changes to the model {stack, index}

  function createRouteChanger(router, routes, callbacks) {
    // Get the hierarchy of absolute routes
    var routeData = getRouteData(routes);

    var onChange = function onChange(location) {
      // Check if the change hasn't been programmatic (by the browser history or address bar )
      var route = location.pathname + location.search + location.hash;

      if (route !== router._lastNavigated[router._lastNavigated.length - 1]) {
        // In this case we flush the last navigated as we can't rely on our history to try to predict
        // going back interactions anymore
        router._lastNavigated = [];
      } // Create a nested stack based on the current location


      var nestedStack = createNestedStack(location, routeData);

      var _mergeStacks = mergeStacks(router._nestedStack || [], nestedStack, routeData),
          stack = _mergeStacks.stack,
          index = _mergeStacks.index;

      setStacksAndIndexes(router, splitStack(stack), index, routeData); // Update attributes of the router

      router.location = location;
      router._nestedStack = stack; // Call user's callbacks

      callbacks.forEach(function (clbk) {
        return clbk(location);
      });
    };

    return onChange;
  }

  function createNestedStack(location, routeData) {
    var matchIds = location.matchIds;
    var inTab = false;
    var stack = [];
    matchIds.forEach(function (route) {
      var data = routeData[route];

      if (inTab) {
        // If we are in a tab we won't push this route to the main stack, but to the tab one
        inTab.tabs.stack.push(createStackItem(route, location, data)); // Get out the stack

        inTab = false;
        return;
      }

      var item = createStackItem(route, location, data);

      if (item.isTabs) {
        item.tabs = {
          activeIndex: 0,
          stack: []
        };
        inTab = item;
      }

      stack.push(item);
    });

    if (inTab) {
      // This means that the last screen in the hierarchy was a tab wrapper
      // We need to fill the tab stack at least with one ticket
      var tab = routeData[matchIds[matchIds.length - 1]];
      var child = getFirstTab(tab);
      var route = location.pathname + child.path;
      inTab.tabs.stack.push(createStackItem(route, location, routeData[route]));
    }

    return stack;
  }

  function splitStack(nestedStack) {
    var allStacks = [];
    var currentStack = [];
    nestedStack.forEach(function (item) {
      if (item.isModal) {
        allStacks.push(currentStack);
        currentStack = [item];
      } else {
        currentStack.push(item);
      }
    });

    if (currentStack.length) {
      allStacks.push(currentStack);
    }

    return allStacks;
  }

  function setStacksAndIndexes(router, stacks, targetIndex, routeData) {
    if (!stacks[0].length) {
      // If the first element is empty means that we are in a modal
      if (!router.stack.length) {
        // if the currentstack is empty we need to get the default screen
        var bgRoute = routeData[stacks[1][0].route].backgroundRoute || '/*';
        var location = router.urlhub.match(bgRoute);

        var _mergeStacks2 = mergeStacks([], createNestedStack(location, routeData), routeData),
            stack = _mergeStacks2.stack,
            index = _mergeStacks2.index;

        router.stack = stack;
        router.activeIndex = index;
      } // otherwise we need to preserve the current stack

    } else {
      router.stack = stacks[0];
      router.activeIndex = Math.max(0, Math.min(targetIndex, stacks[0].length - 1));

      if (router.modal) {
        router.modal.active = false;
      }
    }

    if (stacks.length > 1) {
      if (!router.modal) {
        router.modal = {
          stack: [],
          activeIndex: 0
        };
      }

      router.modal.active = targetIndex >= 0;
      setStacksAndIndexes(router.modal, stacks.slice(1), targetIndex - stacks[0].length, routeData);
    }
  }

  function createStackItem(route, location, routeData) {
    return {
      Screen: routeData.cb,
      route: route,
      isTabs: !!routeData.isTabs,
      isModal: !!routeData.isModal,
      location: location,
      path: getRoutePath(route, location.pathname),
      key: generateKey()
    };
  }

  function getRoutePath(route, pathname) {
    var routeParts = route.split('/');
    var pathParts = pathname.split('/');
    var routePath = [];
    routeParts.forEach(function (p, i) {
      routePath.push(pathParts[i] || p);
    });
    return routePath.join('/');
  }

  function mergeStacks(currentStack, candidateStack, routeData) {
    var nextStack = [];
    var i = 0;
    var sameRoot = true;
    var current = currentStack[0];
    var candidate = candidateStack[0];

    while (current || candidate) {
      if (sameRoot && current && candidate) {
        if (current.Screen === candidate.Screen) {
          nextStack.push(mergeItems(current, candidate, routeData));

          if (current.path !== candidate.path) {
            // If the paths are not the same, some parameter might have changed
            // discard the rest of the current stack. We already have reused the id
            sameRoot = false;
          }
        } else {
          sameRoot = false;
          nextStack.push(candidate);
        }
      } else if (sameRoot && current) {
        nextStack.push(current);
      } else if (candidate) {
        nextStack.push(candidate);
      } // else if( current ) do nothing because is not the same root


      i++;
      current = currentStack[i];
      candidate = candidateStack[i];
    }

    return {
      stack: nextStack,
      index: candidateStack.length - 1
    };
  }

  function mergeItems(current, candidate, routeData) {
    var item = Object.assign({}, candidate, {
      key: current.key
    });

    if (item.tabs) {
      var tabOrder = routeData[current.route].children;
      var toAdd = candidate.tabs.stack[0];
      var tabStack = current.tabs.stack.slice();
      var i = 0;
      var added = false;
      tabOrder.forEach(function (tab) {
        if (added) return;
        var route = current.route + tab.path;
        var currentTab = tabStack[i];

        if (toAdd.route === route) {
          if (currentTab && currentTab.route === route) {
            toAdd.key = currentTab.key;
            tabStack[i] = toAdd;
          } else {
            tabStack.splice(i, 0, toAdd);
          }

          added = true;
        } else if (currentTab && currentTab.route === route) {
          i++;
        }
      });
      item.tabs = {
        stack: tabStack,
        activeIndex: i
      };
    }

    return item;
  }

  function getFirstTab(tabScreen) {
    var i = 0;
    var child;

    while (i < tabScreen.children.length) {
      child = tabScreen.children[i];

      if (!child.isTabs && !child.isModal) {
        return child;
      }
    }

    console.warn('Urlstack: Hit a tabs URL without any children: ' + tabScreen.path);
  }
  /**
   * Transform the route definition for urlhub to an object where the keys are the absolute
   * path of every route, this way we don't need to navigate through childrens to get
   * the information of a router given its path.
   * 
   * @param {*} routes The route object for urlhub
   * @param {*} parentRoute The path of the parent route to get the absolute path of children
   */


  function getRouteData(routes) {
    var parentRoute = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var h = {};
    routes.forEach(function (r) {
      var route = parentRoute + r.path;
      h[route] = r;

      if (r.children) {
        var childrenData = getRouteData(r.children, route);
        h = Object.assign({}, h, childrenData);
      }
    });
    return h;
  }
  /**
   * Generate a random key to identify a route
   */


  function generateKey() {
    var number = Math.floor(Math.random() * 100000); // Make sure it starts with a varter - j is first varter of my name :)

    return 'j' + number.toString(36);
  }

  function memoize(fn) {
    var args, value;

    function recalculate(fnArgs) {
      args = fnArgs;
      value = fn.apply(null, fnArgs);
      return value;
    }

    return function memoized() {
      if (!args || args.length !== arguments.length) {
        return recalculate(arguments);
      }

      var i = 0;

      while (i < args.length) {
        if (args[i] !== arguments[i]) {
          return recalculate(arguments);
        }

        i++;
      }

      return value;
    };
  }
  function createId() {
    return Math.round(Math.random() * 10000000).toString(36);
  }
  function nofn() {}
  function bind(that, methods) {
    methods.forEach(function (m) {
      that[m] = that[m].bind(that);
    });
  }

  function TabTransitionDefault(indexes, layout) {
    var scroll = layout.width / 2;
    return {
      styles: {
        left: {
          inputRange: [-2, -1, 0, 1, 2],
          outputRange: [scroll, scroll, 0, -scroll, -scroll]
        },
        opacity: {
          inputRange: [-2, -1, 0, .8, 1],
          outputRange: [0, 0, 1, 0, 0]
        }
      },
      easing: reactNative.Easing.linear,
      duration: 300
    };
  }

  function animatedStyles(generator, indexes, layout) {
    var transition = typeof generator === 'function' ? generator(indexes, layout) : generator;
    var styles = transition.styles || {};
    var animatedStyles = {};
    var transformStyles = [];

    if (indexes.count) {
      animatedStyles.zIndex = indexes.count - Math.abs(indexes.relative);
    }

    Object.keys(styles).forEach(function (key) {
      if (styleKeys[key]) {
        animatedStyles[key] = indexes.transition.interpolate(styles[key]);
      }

      if (transformKeys[key]) {
        transformStyles.push(_defineProperty({}, key, indexes.transition.interpolate(styles[key])));
      }
    });

    if (transformStyles.length) {
      animatedStyles.transform = transformStyles;
    }

    return animatedStyles;
  }
  var transformKeys = {};
  ['perspective', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'translateX', 'translateY', 'skewX', 'skewY'].forEach(function (key) {
    return transformKeys[key] = 1;
  });
  var styleKeys = {};
  ['left', 'right', 'top', 'bottom', 'width', 'height', 'opacity', 'backgroundColor'].forEach(function (key) {
    return styleKeys[key] = 1;
  });

  var Context = React__default.createContext();

  var ScreenWrapper =
  /*#__PURE__*/
  function (_Component) {
    _inherits(ScreenWrapper, _Component);

    function ScreenWrapper(props) {
      var _this;

      _classCallCheck(this, ScreenWrapper);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ScreenWrapper).call(this, props));
      _this.id = createId();

      _this.setAnimatedLayout(props.indexes, props.layout);

      return _this;
    }

    _createClass(ScreenWrapper, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        var item = this.props.item;
        var containerStyles = [styles.container, this.animatedStyles];
        var contextValue = {
          transition: this.props.transition,
          indexes: this.props.indexes,
          id: item.key
        };
        return React__default.createElement(reactNative.Animated.View, {
          style: containerStyles,
          onLayout: function onLayout() {
            return _this2.props.onReady(item.key);
          }
        }, React__default.createElement(Context.Provider, {
          value: contextValue
        }, this.renderScreen()));
      }
    }, {
      key: "renderScreen",
      value: function renderScreen() {
        var _this$props = this.props,
            item = _this$props.item,
            ScreenStack = _this$props.ScreenStack,
            router = _this$props.router,
            transition = _this$props.transition,
            indexes = _this$props.indexes,
            layout = _this$props.layout,
            drawer = _this$props.drawer;
        var Screen = item.Screen,
            location = item.location;

        if (item.isTabs) {
          return React__default.createElement(Screen, {
            router: router,
            location: location,
            indexes: indexes,
            layout: layout,
            drawer: drawer
          }, React__default.createElement(ScreenStack, {
            router: router,
            screenTransition: transition.tabTransition || TabTransitionDefault,
            stack: item.tabs.stack,
            index: item.tabs.activeIndex
          }));
        }

        return React__default.createElement(Screen, {
          router: router,
          location: location,
          indexes: indexes,
          layout: layout,
          drawer: drawer
        });
      }
    }, {
      key: "setAnimatedLayout",
      value: function setAnimatedLayout(indexes, layout) {
        this.animatedStyles = animatedStyles(this.props.transition, indexes, layout);
      }
    }, {
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(nextProps) {
        if (this.hasLayoutChanged(nextProps)) {
          this.setAnimatedLayout(nextProps.indexes, nextProps.layout);
        }
      }
    }, {
      key: "hasLayoutChanged",
      value: function hasLayoutChanged(nextProps) {
        if (!nextProps.indexes) return;
        var width = nextProps.layout.width;
        var _nextProps$indexes = nextProps.indexes,
            screen = _nextProps$indexes.screen,
            relative = _nextProps$indexes.relative;
        var _this$props2 = this.props,
            layout = _this$props2.layout,
            indexes = _this$props2.indexes;
        return width !== layout.width || screen !== indexes.screen || relative !== indexes.relative || this.props.transition !== nextProps.transition;
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.props.onUnmount(this.props.item.key);
      }
    }]);

    return ScreenWrapper;
  }(React.Component);

  _defineProperty(ScreenWrapper, "defaultProps", {
    onReady: nofn,
    onUnmount: nofn
  });
  var styles = reactNative.StyleSheet.create({
    container: {
      backgroundColor: '#eee',
      overflow: 'hidden',
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      zIndex: 10
    }
  });

  var Context$1 = React__default.createContext('sharedElement'); // We will be storing the mounted elements by routes

  var mountedElements = {}; // When a shared element is mounted it calls to this function
  // and we register it

  function register(instance, props) {
    var wrapper = props.wrapper.id;

    if (!mountedElements[wrapper]) {
      mountedElements[wrapper] = [];
    }

    mountedElements[wrapper].push(instance);
    console.log("Mounting ".concat(wrapper), mountedElements[wrapper]);
  } // When it's unmounted we delete the references to it


  function unregister(instance) {
    var wrapper = instance.props.wrapper.id;
    var stack = mountedElements[wrapper];
    if (!stack) return;

    if (stack) {
      var i = stack.length;

      while (i-- > 0) {
        if (stack[i] === instance) {
          stack.splice(i, 1);
        }
      }
    }

    console.log("Unmounting ".concat(wrapper), mountedElements[wrapper]);
  } // Layers registered callback to listen to transitions


  var clbks = []; // This method is called just before starting the screen transition when the URL changes
  // Screen stack is the one responsible of calling it through the context

  function startTransition(prevIndexes, nextIndexes) {
    // return console.log( 'Start transition');
    var screens = {};
    Object.keys(prevIndexes).forEach(function (id) {
      if (prevIndexes[id].relative === 0) {
        screens.fromScreen = {
          id: id,
          index: nextIndexes[id].relative
        };
      }
    });
    Object.keys(nextIndexes).forEach(function (id) {
      if (nextIndexes[id].relative === 0) {
        screens.toScreen = {
          id: id,
          index: prevIndexes[id].relative
        };
      }
    }); // Call the layer callback to print out the shared element transitions

    clbks.forEach(function (clbk) {
      return clbk(screens);
    });
  }

  var TransitionLayer =
  /*#__PURE__*/
  function (_Component) {
    _inherits(TransitionLayer, _Component);

    function TransitionLayer(props) {
      var _this;

      _classCallCheck(this, TransitionLayer);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(TransitionLayer).call(this, props));
      _this.state = {
        elements: []
      };
      _this.checkForTransitions = _this.checkForTransitions.bind(_assertThisInitialized(_assertThisInitialized(_this)));
      return _this;
    }

    _createClass(TransitionLayer, [{
      key: "render",
      value: function render() {
        return React__default.createElement(reactNative.View, {
          style: styles$1.container,
          pointerEvents: "none"
        }, this.state.elements);
      }
    }, {
      key: "checkForTransitions",
      value: function checkForTransitions(_ref) {
        var _this2 = this;

        var fromScreen = _ref.fromScreen,
            toScreen = _ref.toScreen;
        var couples = this.getTransitionCouples(fromScreen.id, toScreen.id);
        console.log('Couples', couples);
        if (!couples.length) return;
        var elements = couples.map(function (couple) {
          return _this2.renderElement(couple, toScreen.index);
        });
        this.setState({
          elements: elements
        });
        this.setRemoveElements(elements);
      }
    }, {
      key: "setRemoveElements",
      value: function setRemoveElements(elements) {
        var _this3 = this;

        // Delete the elements from the state when the transition is over
        setTimeout(function () {
          var stateElements = _this3.state.elements.slice();

          var i = stateElements.length;
          var j = elements.length;

          while (i-- > 0 && j > 0) {
            while (j-- > 0 && elements[j] !== stateElements[i]) {// Pass
            }

            if (j >= 0) {
              // We have a match
              stateElements.splice(j, 1);
            }
          }

          _this3.setState({
            elements: stateElements
          });
        }, 500);
      }
    }, {
      key: "renderElement",
      value: function renderElement(_ref2, enteringFrom) {
        var leaving = _ref2.leaving,
            entering = _ref2.entering;
        var SharedElement = leaving.SE;
        return React__default.createElement(SharedElement, {
          toIndex: enteringFrom,
          fromBox: leaving.box,
          toBox: entering.box,
          fromProps: leaving.props,
          toProps: entering.props,
          style: leaving.props.style
        }, leaving.props.children);
      }
    }, {
      key: "cleanProps",
      value: function cleanProps(props) {
        var clean = {};
        Object.keys(props).forEach(function (p) {
          if (p !== 'se' && p !== 'wrapper' && p !== 'children' && p !== 'transitionStyles') {
            clean[p] = props[p];
          }
        });
        return clean;
      }
    }, {
      key: "getTransitionCouples",
      value: function getTransitionCouples(fromId, toId) {
        var leaving = mountedElements[fromId];
        var entering = mountedElements[toId];
        if (!leaving || !entering) return [];
        leaving = leaving.slice();
        entering = entering.slice();
        var couples = [];
        var i = leaving.length;

        while (i-- > 0) {
          var id = leaving[i].props.sharedId;
          var j = entering.length;

          while (j-- > 0 && entering[j].props.sharedId !== id) {// Pass
          }

          if (j >= 0) {
            // We have a match
            couples.push({
              leaving: leaving[i],
              entering: entering[j]
            });
          }
        }

        return couples;
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        // Start listening to transitions
        clbks.push(this.checkForTransitions);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        var i = clbks.length;

        while (i-- > 0) {
          if (clbks[i] === this.checkForTransitions) {
            // Remove the callback
            clbks.splice(i, 1);
          }
        }
      }
    }]);

    return TransitionLayer;
  }(React.Component);

  var styles$1 = reactNative.StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      zIndex: 10000
    }
  });

  var SharedElementWrapper = function SharedElementWrapper(props) {
    return React__default.createElement(Context$1.Provider, {
      value: {
        register: register,
        unregister: unregister,
        startTransition: startTransition
      }
    }, props.children, React__default.createElement(TransitionLayer, {
      router: props.router
    }));
  };

  var ScreenStack =
  /*#__PURE__*/
  function (_Component) {
    _inherits(ScreenStack, _Component);

    function ScreenStack(props) {
      var _this;

      _classCallCheck(this, ScreenStack);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ScreenStack).call(this, props));
      var stack = props.stack,
          index = props.index;
      _this.state = {
        indexes: _this.calculateIndexes({}, stack, index),
        layout: false
      };
      _this.previousIndex = index; // memoize a couple of methods

      _this.calculateIndexes = memoize(_this.calculateIndexes.bind(_assertThisInitialized(_assertThisInitialized(_this))));
      _this.updateRelativeIndexes = memoize(_this.updateRelativeIndexes.bind(_assertThisInitialized(_assertThisInitialized(_this)))); // Track the screens that are ready for transitions
      // the one who have already a layout

      _this.readyScreens = {};
      bind(_assertThisInitialized(_assertThisInitialized(_this)), ['_onScreenReady', '_onScreenUnmount']);
      return _this;
    }

    _createClass(ScreenStack, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$props = this.props,
            stack = _this$props.stack,
            router = _this$props.router;
        var containerStyles = [styles$2.container, this.animatedStyles];
        return React__default.createElement(reactNative.Animated.View, {
          style: containerStyles
        }, React__default.createElement(reactNative.View, {
          style: styles$2.stack,
          onLayout: function onLayout(e) {
            return _this2.updateLayout(e);
          }
        }, this.renderScreens(router, stack)));
      }
    }, {
      key: "renderScreens",
      value: function renderScreens(router, stack) {
        var _this3 = this;

        var _this$state = this.state,
            layout = _this$state.layout,
            indexes = _this$state.indexes; // Wait for the layout to be drawn

        if (!layout) return;
        var screens = [];
        stack.forEach(function (item) {
          var key = item.key;

          if (!indexes[key]) {
            // We are probably rebuilding indexes after navigating
            return;
          }

          screens.push(React__default.createElement(ScreenWrapper, {
            item: item,
            ScreenStack: ScreenStack,
            router: router,
            indexes: indexes[key],
            layout: layout,
            transition: item.Screen.transition || _this3.props.screenTransition,
            onReady: _this3._onScreenReady,
            onUnmount: _this3._onScreenUnmount,
            drawer: _this3.props.drawer,
            key: key
          }));
        });
        return screens;
      }
    }, {
      key: "updateLayout",
      value: function updateLayout(e) {
        this.setState({
          layout: e.nativeEvent.layout
        });
        this.animatedStyles = animatedStyles(this.props.stackTransition, this.props.stackIndexes, e.nativeEvent.layout);
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        var _this$props2 = this.props,
            stack = _this$props2.stack,
            index = _this$props2.index,
            screenTransition = _this$props2.screenTransition;
        var indexes = this.calculateIndexes(this.state.indexes, stack, this.previousIndex, screenTransition); // Check if the indexes has changed

        if (indexes !== this.state.indexes) {
          this.setState({
            indexes: indexes
          });
        } // If the flag needRelativeUpdate is up, we need to update the relative
        // indexes to start the animations


        if (this.needRelativeUpdate) {
          var nextIndexes = this.updateRelativeIndexes(indexes, stack, index);
          this.updateIndexesWhenReady(nextIndexes);
        } // If the pointer to the current screen has changed we need to start
        // the animations at the next tick, so raise the flag needRelativeUpdate


        if (index !== this.previousIndex) {
          this.needRelativeUpdate = true;
          this.previousIndex = index;
          this.forceUpdate();
        }
      }
      /**
       * Calculate new indexes based on the previous one and the stack.
       * If there are no changes in the indexes, returns oldIndexes.
       */

    }, {
      key: "calculateIndexes",
      value: function calculateIndexes(oldIndexes, stack, activeIndex) {
        var count = stack.length;
        var indexes = Object.assign({}, oldIndexes);
        var unusedIndexes = Object.assign({}, oldIndexes);
        var updated = false;
        stack.forEach(function (_ref, i) {
          var Screen = _ref.Screen,
              key = _ref.key;

          if (unusedIndexes[key]) {
            return delete unusedIndexes[key];
          }

          updated = true;
          indexes[key] = {
            screen: i,
            count: count,
            relative: activeIndex - i,
            transition: new reactNative.Animated.Value(activeIndex - i)
          };
        }); // Delete tranistions not used

        Object.keys(unusedIndexes).forEach(function (key) {
          delete indexes[key];
          updated = true;
        });
        return updated ? indexes : oldIndexes;
      }
      /**
       * Updates the relative index and the transitions.
       * Needs to be called when the activeIndex changes.
       */

    }, {
      key: "updateRelativeIndexes",
      value: function updateRelativeIndexes(oldIndexes, stack, activeIndex) {
        var indexes = Object.assign({}, oldIndexes);
        var count = stack.length;
        stack.forEach(function (_ref2, i) {
          var key = _ref2.key;
          var index = {
            screen: i,
            count: count,
            relative: activeIndex - i,
            transition: indexes[key].transition
          };
          indexes[key] = index;
        });
        return indexes;
      }
    }, {
      key: "updateIndexesWhenReady",
      value: function updateIndexesWhenReady(nextIndexes) {
        var _this4 = this;

        var allReady = true;
        var stack = this.props.stack;
        var i = stack.length;

        while (i-- > 0 && allReady) {
          allReady = this.readyScreens[stack[i].key];
        }

        if (allReady) {
          this.needRelativeUpdate = false;
          this.startTransition(this.state.indexes, nextIndexes);
          this.setState({
            indexes: nextIndexes
          });
        } else {
          // Wait for the ready (onLayout) signal from the wrappers
          setTimeout(function () {
            return _this4.updateIndexesWhenReady(nextIndexes);
          });
        }
      }
    }, {
      key: "startTransition",
      value: function startTransition(prevIndexes, nextIndexes) {
        var _this5 = this;

        console.log('Transitions start');
        var layout = this.state.layout; // Screen transitions

        this.props.stack.forEach(function (_ref3) {
          var key = _ref3.key,
              Screen = _ref3.Screen;
          var prevIndex = prevIndexes[key];
          var nextIndex = nextIndexes[key];

          if (prevIndex && nextIndex && prevIndex.relative !== nextIndex.relative) {
            var transition = _this5.calculateScreenTransition(Screen.transition, nextIndex, layout);

            reactNative.Animated.timing(nextIndex.transition, {
              toValue: nextIndex.relative,
              easing: transition.easing,
              duration: transition.duration || 300,
              useNativeDriver: true
            }).start();
          }
        }); // Signal for shared elements transition to start

        this.context.startTransition(prevIndexes, nextIndexes);
      }
    }, {
      key: "calculateScreenTransition",
      value: function calculateScreenTransition(generator, indexes, layout) {
        var g = generator || this.props.screenTransition;

        if (typeof g === 'function') {
          return g(indexes, layout);
        }

        return g;
      }
    }, {
      key: "_onScreenReady",
      value: function _onScreenReady(id) {
        this.readyScreens[id] = 1;
      }
    }, {
      key: "_onScreenUnmount",
      value: function _onScreenUnmount(id) {
        delete this.readyScreens[id];
      }
    }]);

    return ScreenStack;
  }(React.Component);

  _defineProperty(ScreenStack, "propTypes", {
    router: PropTypes.object,
    screenTransition: PropTypes.func,
    stackTransition: PropTypes.func,
    stackIndexes: PropTypes.object,
    stack: PropTypes.array,
    index: PropTypes.number,
    layout: PropTypes.object
  });

  _defineProperty(ScreenStack, "defaultProps", {
    stackTransition: function stackTransition() {
      return {};
    },
    stackIndexes: {}
  });

  _defineProperty(ScreenStack, "contextType", Context$1);
  var styles$2 = reactNative.StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      flex: 1
    },
    drawer: {},
    stack: {
      height: '100%',
      width: '100%'
    }
  });

  var ModalWrapper =
  /*#__PURE__*/
  function (_Component) {
    _inherits(ModalWrapper, _Component);

    function ModalWrapper(props) {
      var _this;

      _classCallCheck(this, ModalWrapper);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ModalWrapper).call(this, props));

      _this.setAnimatedLayout(props.indexes, props.layout);

      return _this;
    }

    _createClass(ModalWrapper, [{
      key: "render",
      value: function render() {
        var containerStyles = [styles$3.container, this.animatedStyles];
        var item = this.props.stack[0];
        var content = item ? React__default.createElement(item.Screen, null) : React__default.createElement(reactNative.View, null);
        return React__default.createElement(reactNative.Animated.View, {
          style: containerStyles
        }, content);
      }
    }, {
      key: "getScreenItem",
      value: function getScreenItem(item) {
        if (item && item !== this.item) {
          this.item = item;
        }

        return this.item;
      }
    }, {
      key: "setAnimatedLayout",
      value: function setAnimatedLayout(indexes, layout) {
        this.animatedStyles = animatedStyles(this.props.transition, indexes, layout);
      }
    }, {
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(nextProps) {
        if (this.hasLayoutChanged(nextProps)) {
          this.setAnimatedLayout(nextProps.indexes, nextProps.layout);
        }
      }
    }, {
      key: "hasLayoutChanged",
      value: function hasLayoutChanged(nextProps) {
        if (!nextProps.indexes) return;
        var width = nextProps.layout.width;
        var showing = nextProps.indexes.showing;
        var _this$props = this.props,
            layout = _this$props.layout,
            indexes = _this$props.indexes;
        return width !== layout.width || showing !== indexes.showing;
      }
    }]);

    return ModalWrapper;
  }(React.Component);
  var styles$3 = reactNative.StyleSheet.create({
    container: {
      backgroundColor: '#eee',
      overflow: 'hidden',
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      zIndex: 10,
      shadowColor: '#000',
      shadowOpacity: .1,
      shadowRadius: 10,
      elevation: 3
    }
  });

  var interactable_native = createCommonjsModule(function (module, exports) {
  /*!
   * *//* eslint-disable */
  /*!
   * react-interactable v0.6.3
   * (c) 2018-present Javier Marquez
   * Released under the MIT License.
   */
  (function (global, factory) {
    module.exports = factory(React__default, PropTypes, reactNative__default);
  }(commonjsGlobal, (function (React$$1,PropTypes$$1,reactNative$$1) {
    var React__default$$1 = 'default' in React$$1 ? React$$1['default'] : React$$1;
    PropTypes$$1 = PropTypes$$1 && PropTypes$$1.hasOwnProperty('default') ? PropTypes$$1['default'] : PropTypes$$1;

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    function _extends() {
      _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];

          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }

        return target;
      };

      return _extends.apply(this, arguments);
    }

    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          writable: true,
          configurable: true
        }
      });
      if (superClass) _setPrototypeOf(subClass, superClass);
    }

    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _getPrototypeOf(o);
    }

    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

      return _setPrototypeOf(o, p);
    }

    function _assertThisInitialized(self) {
      if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return self;
    }

    function _possibleConstructorReturn(self, call) {
      if (call && (typeof call === "object" || typeof call === "function")) {
        return call;
      }

      return _assertThisInitialized(self);
    }

    var Utils = {
      createArea: function createArea(boundaries) {
        return {
          minPoint: {
            x: boundaries.left === undefined ? -Infinity : boundaries.left,
            y: boundaries.top === undefined ? -Infinity : boundaries.top
          },
          maxPoint: {
            x: boundaries.right === undefined ? Infinity : boundaries.right,
            y: boundaries.bottom === undefined ? Infinity : boundaries.bottom
          }
        };
      },
      createAreaFromRadius: function createAreaFromRadius(radius, anchor) {
        return {
          minPoint: {
            x: anchor.x - radius,
            y: anchor.y - radius
          },
          maxPoint: {
            x: anchor.x + radius,
            y: anchor.y + radius
          }
        };
      },
      isPointInArea: function isPointInArea(_ref, area) {
        var x = _ref.x,
            y = _ref.y;
        if (!area) return true;
        var minPoint = area.minPoint,
            maxPoint = area.maxPoint;
        return x >= minPoint.x && x <= maxPoint.x && y >= minPoint.y && y <= maxPoint.y;
      },
      findClosest: function findClosest(origin, points) {
        var _this = this;

        var minDistance = Infinity;
        var closestPoint = null;
        points.forEach(function (point) {
          var distance = _this.getDistance(point, origin);

          if (distance < minDistance) {
            minDistance = distance;
            closestPoint = point;
          }
        }); // console.log( distances )

        return closestPoint;
      },
      getDistance: function getDistance(point, relative) {
        var p = {
          x: point.x === undefined ? Infinity : point.x,
          y: point.y === undefined ? Infinity : point.y
        };
        var r = {
          x: relative.x === undefined ? Infinity : relative.x,
          y: relative.y === undefined ? Infinity : relative.y
        };
        if (p.x === Infinity && p.y === Infinity) return Infinity;
        var dx = p.x === Infinity ? 0 : Math.abs(r.x - p.x);
        var dy = p.y === Infinity ? 0 : Math.abs(r.y - p.y);
        return Math.sqrt(dx * dx + dy * dy);
      },
      getDelta: function getDelta(point, origin) {
        return {
          x: point.x - origin.x,
          y: point.y - origin.y
        };
      }
    };

    function def(value, defaultValue) {
      return value === undefined ? defaultValue : value;
    }

    var Behaviors = {
      anchor: {
        create: function create(options) {
          var isTemp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          return {
            x0: options.x,
            y0: options.y,
            priority: 1,
            isTemp: isTemp,
            type: 'anchor'
          };
        },
        doFrame: function doFrame(options, deltaTime, state, coords) {
          // Velocity = dx / deltaTime
          state.vx = (options.x0 - coords.x) / deltaTime;
          state.vy = (options.y0 - coords.y) / deltaTime;
        }
      },
      bounce: {
        create: function create(options) {
          var isTemp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          return {
            type: 'bounce',
            bounce: def(options.bounce, .5),
            minPoint: options.influence.minPoint,
            maxPoint: options.influence.maxPoint,
            priority: 3,
            isTemp: isTemp
          };
        },
        doFrame: function doFrame(_ref, deltaTime, state, _ref2, target) {
          var minPoint = _ref.minPoint,
              maxPoint = _ref.maxPoint,
              bounce = _ref.bounce;
          var x = _ref2.x,
              y = _ref2.y;
          // Apply limits
          if (minPoint.x > x) target.setTranslationX(minPoint.x);
          if (minPoint.y > y) target.setTranslationY(minPoint.y);
          if (maxPoint.x < x) target.setTranslationX(maxPoint.x);
          if (maxPoint.y < y) target.setTranslationY(maxPoint.y);
          var vx = state.vx,
              vy = state.vy;

          if (minPoint.x > x && vx < 0) {
            state.vx = -vx * bounce;
          }

          if (minPoint.y > y && vy < 0) {
            state.vy = -vy * bounce;
          }

          if (maxPoint.x < x && vx > 0) {
            state.vx = -vx * bounce;
          }

          if (maxPoint.y < y && vy > 0) {
            state.vy = -vy * bounce;
          }
        }
      },
      friction: {
        create: function create(options) {
          var isTemp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          return {
            type: 'friction',
            damping: def(options.damping, .7),
            influence: Utils.createArea(options.influenceArea || {}),
            priority: 2,
            isTemp: isTemp
          };
        },
        doFrame: function doFrame(options, deltaTime, state, coords) {
          if (!Utils.isPointInArea(coords, options.influence)) return;
          var pow = Math.pow(options.damping, 60.0 * deltaTime);
          state.vx = pow * state.vx;
          state.vy = pow * state.vy;
        }
      },
      gravity: {
        create: function create(options) {
          var isTemp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          return {
            type: 'gravity',
            x0: def(options.x, Infinity),
            y0: def(options.y, Infinity),
            strength: def(options.strength, 400),
            falloff: def(options.falloff, 40),
            damping: def(options.damping, 0),
            influence: Utils.createArea(options.influenceArea || {}),
            isTemp: isTemp,
            priority: 1
          };
        },
        doFrame: function doFrame(options, deltaTime, state, coords) {
          if (!Utils.isPointInArea(coords, options.influence)) return;
          var dx = options.x0 !== Infinity ? coords.x - options.x0 : 0;
          var dy = options.y0 !== Infinity ? coords.y - options.y0 : 0;
          var dr = Math.sqrt(dx * dx + dy * dy);
          if (!dr) return;
          var falloff = options.falloff,
              strength = options.strength;
          var a = -strength * dr * Math.exp(-0.5 * (dr * dr) / (falloff * falloff)) / state.mass;
          var ax = dx / dr * a;
          var ay = dy / dr * a;
          state.vx += deltaTime * ax;
          state.vy += deltaTime * ay;
        }
      },
      spring: {
        create: function create(options) {
          var isTemp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
          return {
            type: 'spring',
            x0: def(options.x, 0),
            y0: def(options.y, 0),
            tension: def(options.tension, 300),
            influence: Utils.createArea(options.influenceArea || {}),
            isTemp: isTemp,
            priority: 1
          };
        },
        doFrame: function doFrame(options, deltaTime, state, coords) {
          if (!Utils.isPointInArea(coords, options.influence)) return;
          var dx = coords.x - options.x0;

          if (dx) {
            // time * acceleration
            state.vx += deltaTime * (-1 * options.tension * dx / state.mass);
          }

          var dy = coords.y - options.y0;

          if (dy) {
            // time * acceleration
            state.vy += deltaTime * (-1 * options.tension * dy / state.mass);
          }
        }
      }
    };

    var ANIMATOR_PAUSE_CONSECUTIVE_FRAMES = 10;
    var ANIMATOR_PAUSE_ZERO_VELOCITY = 1.0;

    var PhysicsAnimator =
    /*#__PURE__*/
    function () {
      function PhysicsAnimator(View, listener, debug) {
        _classCallCheck(this, PhysicsAnimator);

        _defineProperty(this, "behaviors", []);

        _defineProperty(this, "physicsObject", {
          vx: 0,
          vy: 0,
          mass: 1
        });

        _defineProperty(this, "consecutiveFramesWithNoMovement", 0);

        _defineProperty(this, "screenScale", 1);

        _defineProperty(this, "lastFrameTS", 0);

        _defineProperty(this, "isRunning", false);

        _defineProperty(this, "ticking", false);

        _defineProperty(this, "isDragging", false);

        this.View = View;
        this.animatorListener = listener;

        if (!debug) {
          var nofn = function nofn() {};

          this.debugStart = nofn;
          this.debugEnd = nofn;
        }
      }

      _createClass(PhysicsAnimator, [{
        key: "doFrame",
        value: function doFrame(frameTimeMillis) {
          var _this = this;

          if (!this.isRunning) return;

          if (this.lastFrameTS) {
            this.animateFrameWithDeltaTime((frameTimeMillis - this.lastFrameTS) * 1e-3);
          }

          this.lastFrameTS = frameTimeMillis;
          this.animatorListener.onAnimationFrame();
          requestAnimationFrame(function () {
            return _this.doFrame(Date.now());
          });
        }
      }, {
        key: "debugStart",
        value: function debugStart(behavior) {
          if (this.debug !== true && this.debug !== behavior.type) return;
          this.debugB = behavior;
          this.debugInitialV = Object.assign({}, this.physicsObject);
        }
      }, {
        key: "debugEnd",
        value: function debugEnd() {
          if (!this.debugB || this.debug !== true && this.debug !== this.debugB.type) return;
          console.log("Debug ".concat(this.debugB.type), {
            dvx: this.physicsObject.vx - this.debugInitialV.vx,
            dvy: this.physicsObject.vy - this.debugInitialV.vy
          });
        }
      }, {
        key: "animateFrameWithDeltaTime",
        value: function animateFrameWithDeltaTime(deltaTime) {
          var _this2 = this;

          if (!deltaTime) return;
          var physicsObject = this.physicsObject,
              behaviors = this.behaviors,
              View = this.View;
          var hadMovement = false;
          var coords = View.getTranslation();
          behaviors.forEach(function (behavior) {
            _this2.debugStart(behavior);

            Behaviors[behavior.type].doFrame(behavior, deltaTime, physicsObject, coords, View);

            _this2.debugEnd();
          });
          var dx = 0;
          var vx = physicsObject.vx,
              vy = physicsObject.vy;

          if (Math.abs(vx) > ANIMATOR_PAUSE_ZERO_VELOCITY) {
            dx = deltaTime * vx;
            hadMovement = true;
          }

          var dy = 0;

          if (Math.abs(vy) > ANIMATOR_PAUSE_ZERO_VELOCITY) {
            dy = deltaTime * vy;
            hadMovement = true;
          }

          View.animate(dx, dy);
          var cfwnm = hadMovement ? 0 : this.consecutiveFramesWithNoMovement + 1;
          this.consecutiveFramesWithNoMovement = cfwnm;

          if (cfwnm >= ANIMATOR_PAUSE_CONSECUTIVE_FRAMES && !this.isDragging) {
            this.stopRunning();
            this.animatorListener.onAnimatorPause();
          }
        }
      }, {
        key: "addBehavior",
        value: function addBehavior(type, options, isTemp) {
          var b = Behaviors[type];
          if (!b) return;
          var behavior = b.create(options, isTemp);
          var behaviors = this.behaviors;
          var idx = 0;

          while (behaviors.length > idx && behaviors[idx].priority <= behavior.priority) {
            ++idx;
          }

          behaviors.splice(idx, 0, behavior);
          this.ensureRunning();
          return behavior;
        }
      }, {
        key: "remove",
        value: function remove(condition) {
          var behaviors = this.behaviors;
          var i = behaviors.length;

          while (i-- > 0) {
            if (condition(behaviors[i])) {
              behaviors.splice(i, 1);
            }
          }
        }
      }, {
        key: "removeBehavior",
        value: function removeBehavior(behavior) {
          this.remove(function (target) {
            return target === behavior;
          });
        }
      }, {
        key: "removeTypeBehaviors",
        value: function removeTypeBehaviors(type) {
          this.remove(function (target) {
            return target.type === type;
          });
        }
      }, {
        key: "removeTempBehaviors",
        value: function removeTempBehaviors() {
          this.remove(function (target) {
            return target.isTemp;
          });
        }
      }, {
        key: "getVelocity",
        value: function getVelocity() {
          return {
            x: this.physicsObject.vx,
            y: this.physicsObject.vy
          };
        }
      }, {
        key: "ensureRunning",
        value: function ensureRunning() {
          this.isRunning || this.startRunning();
        }
      }, {
        key: "startRunning",
        value: function startRunning() {
          var _this3 = this;

          this.isRunning = true;
          this.lastFrameTS = 0;
          this.consecutiveFramesWithNoMovement = 0;
          requestAnimationFrame(function () {
            return _this3.doFrame(Date.now());
          });
        }
      }, {
        key: "stopRunning",
        value: function stopRunning() {
          this.removeTempBehaviors();
          this.physicsObject = {
            vx: 0,
            vy: 0,
            mass: this.physicsObject.mass
          };
          this.isRunning = false;
        }
      }]);

      return PhysicsAnimator;
    }();

    var propBehaviors = {
      frictionAreas: 'friction',
      gravityPoints: 'gravity',
      springPoints: 'spring'
    };
    var isWeb = typeof document !== 'undefined';
    function injectDependencies(Animated, PanResponder) {
      var _class, _temp;

      return _temp = _class =
      /*#__PURE__*/
      function (_Component) {
        _inherits(InteractableView, _Component);

        function InteractableView(props) {
          var _this;

          _classCallCheck(this, InteractableView);

          _this = _possibleConstructorReturn(this, _getPrototypeOf(InteractableView).call(this, props));

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "initialPositionSet", false);

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "isDragging", false);

          var _props$initialPositio = props.initialPosition,
              _props$initialPositio2 = _props$initialPositio.x,
              x = _props$initialPositio2 === void 0 ? 0 : _props$initialPositio2,
              _props$initialPositio3 = _props$initialPositio.y,
              y = _props$initialPositio3 === void 0 ? 0 : _props$initialPositio3; // In case animatedValueXY is not given

          _this.animated = new Animated.ValueXY({
            x: x,
            y: y
          }); // This guy will apply all the physics

          _this.animator = _this.createAnimator(props); // Cache when the view is inside of an alert area

          _this.insideAlertAreas = {}; // cache calculated areas

          _this.propAreas = {
            alert: [],
            boundaries: false
          };
          _this._pr = _this.createPanResponder(props); // Set behaviors and prop defaults

          _this.setPropBehaviours({}, props); // Set initial position


          var animated = _this.getAnimated(props);

          animated.x.setValue(x);
          animated.y.setValue(y);
          animated.x._startingValue = x;
          animated.y._startingValue = y; // Save the last animation end position to report good coordinates in the events

          _this.lastEnd = Object.assign({}, _this.initialPosition);
          return _this;
        }

        _createClass(InteractableView, [{
          key: "render",
          value: function render() {
            var _this$getAnimated = this.getAnimated(),
                x = _this$getAnimated.x,
                y = _this$getAnimated.y;

            var style = this.props.style;
            var withPosition = Object.assign({
              transform: [{
                translateX: x
              }, {
                translateY: y
              }].concat(style.transform || [])
            }, style);
            var panHandlers = this.props.dragEnabled ? this._pr.panHandlers : {};
            return React__default$$1.createElement(Animated.View, _extends({
              style: withPosition
            }, panHandlers), this.props.children);
          }
        }, {
          key: "getTranslation",
          value: function getTranslation() {
            var _this$getAnimated2 = this.getAnimated(),
                x = _this$getAnimated2.x,
                y = _this$getAnimated2.y;

            return {
              x: x._value + x._offset,
              y: y._value + y._offset
            };
          }
        }, {
          key: "setTranslationX",
          value: function setTranslationX(tx) {
            var animated = this.props.animatedValueX || this.animated.x;
            animated.setValue(tx - animated._offset);
          }
        }, {
          key: "setTranslationY",
          value: function setTranslationY(ty) {
            var animated = this.props.animatedValueY || this.animated.y;
            animated.setValue(ty - animated._offset);
          }
        }, {
          key: "setTranslation",
          value: function setTranslation(tx, ty) {
            this.setTranslationX(tx);
            this.setTranslationY(ty);
          }
        }, {
          key: "createAnimator",
          value: function createAnimator() {
            var _this2 = this;

            return new PhysicsAnimator(this, {
              onAnimatorPause: function onAnimatorPause() {
                var _this2$getTranslation = _this2.getTranslation(),
                    x = _this2$getTranslation.x,
                    y = _this2$getTranslation.y;

                _this2.lastEnd = {
                  x: Math.round(x),
                  y: Math.round(y)
                };

                _this2.props.onStop(_this2.lastEnd);
              },
              onAnimationFrame: function onAnimationFrame() {
                _this2.reportAlertEvent(_this2.getTranslation());
              }
            }, false // Set true or behavior type to output debug info in the console
            );
          }
        }, {
          key: "animate",
          value: function animate(dx, dy) {
            if (!dx && !dy) return; // let animated = this.getAnimated()
            // console.log( dx + animated.x._value + animated.x._offset )

            var _this$getTranslation = this.getTranslation(),
                x = _this$getTranslation.x,
                y = _this$getTranslation.y;

            this.setTranslation(x + dx, y + dy);
          }
        }, {
          key: "getAnimated",
          value: function getAnimated(props) {
            var _ref = props || this.props,
                animatedValueX = _ref.animatedValueX,
                animatedValueY = _ref.animatedValueY;

            return {
              x: animatedValueX || this.animated.x,
              y: animatedValueY || this.animated.y
            };
          }
        }, {
          key: "createPanResponder",
          value: function createPanResponder() {
            var _this3 = this;

            return PanResponder.create({
              onMoveShouldSetResponderCapture: function onMoveShouldSetResponderCapture() {
                return true;
              },
              onMoveShouldSetPanResponderCapture: function onMoveShouldSetPanResponderCapture() {
                return true;
              },
              onPanResponderGrant: function onPanResponderGrant(e, _ref2) {
                var x0 = _ref2.x0,
                    y0 = _ref2.y0;

                _this3.startDrag({
                  x: x0,
                  y: y0
                });
              },
              onPanResponderMove: function onPanResponderMove(evt, gesture) {
                _this3.onDragging(gesture);
              },
              onPanResponderRelease: function onPanResponderRelease() {
                _this3.endDrag();
              }
            });
          }
        }, {
          key: "reportAlertEvent",
          value: function reportAlertEvent(position) {
            var inside = this.insideAlertAreas;
            var onAlert = this.props.onAlert;
            this.propAreas.alert.forEach(function (_ref3) {
              var influence = _ref3.influence,
                  id = _ref3.id;
              if (!influence || !id) return;

              if (Utils.isPointInArea(position, influence)) {
                if (!inside[id]) {
                  onAlert({
                    id: id,
                    value: "enter"
                  });
                  inside[id] = 1;
                }
              } else if (inside[id]) {
                onAlert({
                  id: id,
                  value: "leave"
                });
                inside[id] = 0;
              }
            });
          }
        }, {
          key: "startDrag",
          value: function startDrag(ev) {
            // Prepare the animated
            var _this$getAnimated3 = this.getAnimated(),
                x = _this$getAnimated3.x,
                y = _this$getAnimated3.y;

            var offset = {
              x: x._value,
              y: y._value
            };
            x.setOffset(offset.x);
            y.setOffset(offset.y);
            x.setValue(0);
            y.setValue(0); // Save the offset for triggering events with the right coordinates

            this.lastEnd = offset; // console.log( offset )
            // Set boundaries to fast access

            this.dragBoundaries = this.propAreas.boundaries ? this.propAreas.boundaries.influence : {}; // Prepare the animation

            this.props.onDrag({
              state: 'start',
              x: offset.x,
              y: offset.y
            });
            this.dragStartLocation = {
              x: ev.x,
              y: ev.y
            };
            this.animator.removeTempBehaviors();
            this.animator.isDragging = true;
            this.animator.vx = 0;
            this.animator.vy = 0;
            this.addTempDragBehavior(this.props.dragWithSpring); // Stop text selection

            if (isWeb) {
              var styles = document.body.style;
              this.userSelectCache = styles.userSelect;
              styles.userSelect = "none";
            }
          }
        }, {
          key: "onDragging",
          value: function onDragging(_ref4) {
            var dx = _ref4.dx,
                dy = _ref4.dy;
            if (!this.animator.isDragging) return false;
            if (!this.props.dragEnabled) return this.endDrag();
            var pos = this.lastEnd;
            var x = dx + pos.x;
            var y = dy + pos.y; // console.log( this.dragBoundaries.minPoint )

            var _this$dragBoundaries = this.dragBoundaries,
                minPoint = _this$dragBoundaries.minPoint,
                maxPoint = _this$dragBoundaries.maxPoint;

            if (!this.props.verticalOnly) {
              if (minPoint) {
                if (minPoint.x > x) x = minPoint.x;
                if (maxPoint.x < x) x = maxPoint.x;
              }

              this.dragBehavior.x0 = x;
            }

            if (!this.props.horizontalOnly) {
              if (minPoint) {
                if (minPoint.y > y) y = minPoint.y;
                if (maxPoint.y < y) y = maxPoint.y;
              }

              this.dragBehavior.y0 = y;
            } // console.log( this.dragBehavior )

          }
        }, {
          key: "endDrag",
          value: function endDrag() {
            this.animator.removeTempBehaviors();
            this.dragBehavior = null;
            this.animator.isDragging = false;
            var animator = this.animator,
                horizontalOnly = this.horizontalOnly,
                verticalOnly = this.verticalOnly,
                dragWithSprings = this.dragWithSprings;
            var velocity = animator.getVelocity();
            if (horizontalOnly) velocity.y = 0;
            if (verticalOnly) velocity.x = 0;
            var toss = dragWithSprings && dragWithSprings.toss || this.props.dragToss;

            var _this$getTranslation2 = this.getTranslation(),
                x = _this$getTranslation2.x,
                y = _this$getTranslation2.y;

            var projectedCenter = {
              x: x + toss * velocity.x,
              y: y + toss * velocity.y
            }; // console.log( 'pc', projectedCenter, velocity)

            var snapPoint = Utils.findClosest(projectedCenter, this.props.snapPoints);
            var targetSnapPointId = snapPoint && snapPoint.id || "";
            this.props.onDrag({
              state: 'end',
              x: x,
              y: y,
              targetSnapPointId: targetSnapPointId
            });
            this.addTempSnapToPointBehavior(snapPoint);
            this.addTempBoundaries();
            var animated = this.getAnimated();
            animated.x.flattenOffset();
            animated.y.flattenOffset(); // Restore text selection

            if (isWeb) {
              document.body.userSelect = this.userSelectCache || '';
            }
          }
        }, {
          key: "addTempDragBehavior",
          value: function addTempDragBehavior(drag) {
            var pos = this.getTranslation();

            if (!drag || drag.tension === Infinity) {
              this.dragBehavior = this.animator.addBehavior('anchor', pos, true);
            } else {
              pos.tension = drag.tension || 300;
              this.dragBehavior = this.animator.addBehavior('spring', pos, true);

              if (drag.damping) {
                this.animator.addBehavior('friction', drag, true);
              }
            }
          }
        }, {
          key: "addTempSnapToPointBehavior",
          value: function addTempSnapToPointBehavior(snapPoint) {
            if (!snapPoint) return;
            var _this$props = this.props,
                snapPoints = _this$props.snapPoints,
                onSnap = _this$props.onSnap,
                onSnapStart = _this$props.onSnapStart;
            var index = snapPoints.indexOf(snapPoint);
            onSnap({
              index: index,
              id: snapPoint.id
            });
            onSnapStart({
              index: index,
              id: snapPoint.id
            });
            var springOptions = Object.assign({
              damping: .7,
              tension: 300
            }, snapPoint);
            this.addBehavior('spring', springOptions, true);
          }
        }, {
          key: "setVelocity",
          value: function setVelocity(velocity) {
            if (this.dragBehavior) return;
            this.animator.physicsObject.vx = velocity.x;
            this.animator.physicsObject.vy = velocity.y;
            this.endDrag();
          }
        }, {
          key: "snapTo",
          value: function snapTo(_ref5) {
            var index = _ref5.index;
            var snapPoints = this.props.snapPoints;
            if (!snapPoints || index === undefined || index >= snapPoints.length) return;
            this.animator.removeTempBehaviors();
            this.dragBehavior = null;
            var snapPoint = snapPoints[index];
            this.addTempSnapToPointBehavior(snapPoint);
            this.addTempBoundaries();
          }
        }, {
          key: "addTempBoundaries",
          value: function addTempBoundaries() {
            var boundaries = this.propAreas.boundaries;
            if (!boundaries) return;
            this.animator.addBehavior('bounce', boundaries, true);
          }
        }, {
          key: "changePosition",
          value: function changePosition(position) {
            if (this.dragBehavior) return;
            this.setTranslation(position.x, position.y);
            this.endDrag();
          }
        }, {
          key: "componentDidUpdate",
          value: function componentDidUpdate(prevProps) {
            this.setPropBehaviours(prevProps, this.props);
          }
        }, {
          key: "setPropBehaviours",
          value: function setPropBehaviours(prevProps, props) {
            var _this4 = this;

            // spring, gravity, friction
            Object.keys(propBehaviors).forEach(function (prop) {
              if (prevProps[prop] !== props[prop]) {
                _this4.animator.removeTypeBehaviors(propBehaviors[prop]);

                _this4.addTypeBehaviors(propBehaviors[prop], props[prop]);
              }
            });

            if (prevProps.alertAreas !== props.alertAreas) {
              var alertAreas = [];
              props.alertAreas.forEach(function (area) {
                alertAreas.push({
                  id: area.id,
                  influence: Utils.createArea(area.influenceArea)
                });
              });
              this.propAreas.alert = alertAreas;
            }

            if (prevProps.boundaries !== props.boundaries) {
              this.animator.removeBehavior(this.oldBoundariesBehavior);

              if (props.boundaries) {
                var bounce = {
                  bounce: props.boundaries.bounce || 0,
                  influence: Utils.createArea(props.boundaries)
                };
                this.propAreas.boundaries = bounce;
                this.oldBoundariesBehavior = this.animator.addBehavior('bounce', bounce);
              } else {
                this.propAreas.boundaries = false;
              }
            }

            if (!this.props.dragEnabled && prevProps.dragEnabled && this.dragBehavior) {
              this.endDrag();
            }
          }
        }, {
          key: "addTypeBehaviors",
          value: function addTypeBehaviors(type, behaviors, isTemp) {
            var _this5 = this;

            behaviors.forEach(function (b) {
              return _this5.addBehavior(type, b, isTemp);
            });
          }
        }, {
          key: "addBehavior",
          value: function addBehavior(type, behavior, isTemp) {
            this.animator.addBehavior(type, behavior, isTemp);

            if (behavior.damping && type !== 'friction') {
              var b = this.animator.addBehavior('friction', behavior, isTemp);

              if (type === 'gravity' && !behavior.influenceArea) {
                b.influence = Utils.createAreaFromRadius(1.4 * (behavior.falloff || 40), behavior);
              }
            }
          }
        }]);

        return InteractableView;
      }(React$$1.Component), _defineProperty(_class, "propTypes", {
        snapPoints: PropTypes$$1.array,
        frictionAreas: PropTypes$$1.array,
        alertAreas: PropTypes$$1.array,
        gravityPoints: PropTypes$$1.array,
        horizontalOnly: PropTypes$$1.bool,
        verticalOnly: PropTypes$$1.bool,
        dragWithSpring: PropTypes$$1.object,
        dragEnabled: PropTypes$$1.bool,
        animatedValueX: PropTypes$$1.instanceOf(Animated.Value),
        animatedValueY: PropTypes$$1.instanceOf(Animated.Value),
        onSnap: PropTypes$$1.func,
        onSnapStart: PropTypes$$1.func,
        onEnd: PropTypes$$1.func,
        onDrag: PropTypes$$1.func,
        boundaries: PropTypes$$1.object,
        initialPosition: PropTypes$$1.object,
        dragToss: PropTypes$$1.number
      }), _defineProperty(_class, "defaultProps", {
        snapPoints: [],
        frictionAreas: [],
        alertAreas: [],
        gravityPoints: [],
        boundaries: {},
        initialPosition: {
          x: 0,
          y: 0
        },
        dragToss: .1,
        dragEnabled: true,
        onSnap: function onSnap() {},
        onSnapStart: function onSnapStart() {},
        onStop: function onStop() {},
        onDrag: function onDrag() {},
        onAlert: function onAlert() {},
        style: {}
      }), _temp;
    }

    var Interactable = injectDependencies(reactNative$$1.Animated, reactNative$$1.PanResponder);
    var native = {
      View: Interactable
    };

    return native;

  })));

  });

  var DrawerWrapper =
  /*#__PURE__*/
  function (_Component) {
    _inherits(DrawerWrapper, _Component);

    function DrawerWrapper(props) {
      var _this;

      _classCallCheck(this, DrawerWrapper);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(DrawerWrapper).call(this, props));
      _this.drawerWidth = 300;
      _this.drawerPos = new reactNative.Animated.Value(0);

      _this.calculateDrawerIndex();

      _this.open = false;
      _this.overlayAnimStyle = {
        transform: [{
          translateX: _this.drawerIndex.interpolate({
            inputRange: [0, 0.01, 1],
            outputRange: [-10000, 0, 0]
          })
        }],
        opacity: _this.drawerIndex.interpolate({
          inputRange: [0, 0, 1, 1],
          outputRange: [0, 0, .5, .5]
        })
      };
      var drawerMethods = {
        open: function open() {
          return _this.openDrawer();
        },
        close: function close() {
          return _this.closeDrawer();
        }
      };
      _this._drawerMethods = drawerMethods;
      return _this;
    }

    _createClass(DrawerWrapper, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        var _this$props = this.props,
            Drawer = _this$props.Drawer,
            router = _this$props.router,
            collapsible = _this$props.collapsible;
        var handle, overlay;

        if (collapsible) {
          handle = React__default.createElement(reactNative.View, {
            style: styles$4.handle
          });
          overlay = React__default.createElement(reactNative.Animated.View, {
            style: [styles$4.overlay, this.overlayAnimStyle],
            onClick: function onClick() {
              return _this2.closeDrawer();
            }
          });
        }

        var containerStyles = [styles$4.container, collapsible && styles$4.collapsibleContainer, this.animatedStyles];
        var drawerStyles = [styles$4.drawer, collapsible && styles$4.collapsibleDrawer];
        var snapPoints = [{
          x: 0,
          id: 'closed'
        }, {
          x: this.drawerWidth,
          id: 'open'
        }];
        return React__default.createElement(reactNative.Animated.View, {
          style: containerStyles
        }, overlay, React__default.createElement(interactable_native.View, {
          dragEnabled: !!collapsible,
          ref: "drawer",
          horizontalOnly: true,
          snapPoints: snapPoints,
          boundaries: {
            right: this.drawerWidth,
            bounce: 0.5
          },
          onSnapStart: function onSnapStart(e) {
            return _this2.onSnap(e);
          },
          animatedValueX: this.drawerPos
        }, React__default.createElement(reactNative.View, {
          style: drawerStyles,
          onLayout: function onLayout(e) {
            return _this2.updateLayout(e);
          }
        }, React__default.createElement(Drawer, {
          router: router,
          drawer: this._drawerMethods
        }), handle)));
      }
    }, {
      key: "updateLayout",
      value: function updateLayout(e) {
        var layout = e.nativeEvent.layout;
        this.animatedStyles = animatedStyles(this.props.transition, this.props.indexes, layout);
        this.drawerWidth = layout.width;
        this.calculateDrawerIndex();
        this.forceUpdate();
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        if (prevProps.collapsible && !this.props.collapsible) {
          this.drawerPos.setValue(0);
          console.log('Resetting position');
          this.forceUpdate();
        }
      }
    }, {
      key: "calculateDrawerIndex",
      value: function calculateDrawerIndex() {
        var di = this.drawerIndex;
        var index = this.drawerPos.interpolate({
          inputRange: [0, this.drawerWidth],
          outputRange: [0, 1]
        });

        if (di) {
          di._config = index._config;
          di._interpolation = index._interpolation;
        } else {
          this.drawerIndex = index;
        }
      }
    }, {
      key: "openDrawer",
      value: function openDrawer() {
        if (!this.props.collapsible || this.open) return;
        var drawer = this.refs.drawer;
        drawer && drawer.setVelocity({
          x: 2000
        });
      }
    }, {
      key: "closeDrawer",
      value: function closeDrawer() {
        if (!this.props.collapsible || !this.open) return;
        var drawer = this.refs.drawer;
        drawer && drawer.setVelocity({
          x: -2000
        });
      }
    }, {
      key: "onSnap",
      value: function onSnap(e) {
        if (e.nativeEvent) e = e.nativeEvent;
        this.open = e.id === 'open';
      }
    }]);

    return DrawerWrapper;
  }(React.Component);
  var styles$4 = reactNative.StyleSheet.create({
    container: {
      flexDirection: 'row'
    },
    collapsibleContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: '-100%',
      width: '100%',
      flexDirection: 'row-reverse',
      zIndex: 2000,
      backgroundColor: '#e0e0e0'
    },
    drawer: {
      // position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      flex: 1,
      zIndex: 20000
    },
    collapsibleDrawer: {
      left: 0,
      width: '100%',
      flex: 1,
      backgroundColor: '#e0e0e0',
      position: 'relative',
      zIndex: 20000
    },
    handle: {
      width: 40,
      top: 0,
      bottom: 0,
      right: -20,
      // backgroundColor: 'green',
      position: 'absolute',
      zIndex: 10
    },
    overlay: {
      backgroundColor: 'black',
      height: '100%',
      width: '100%',
      position: 'absolute',
      left: '100%'
    },
    expander: {
      position: 'absolute',
      height: '100%',
      top: 0,
      left: 0,
      bottom: 0
    }
  });

  function TransitionNarrowDefault(indexes, layout) {
    var leftColumn = indexes.screen ? 400 : 0;
    return {
      styles: {
        width: {
          inputRange: [-2, -1, 0, 1, 2, 3],
          outputRange: [0, 0, layout.width - leftColumn, 400, 0, 0]
        },
        left: {
          inputRange: [-2, -1, 0, 1, 2],
          outputRange: [layout.width, layout.width, leftColumn, 0, 0]
        }
      },
      easing: reactNative.Easing.linear,
      duration: 300
    };
  }

  function TransitionMobileDefault(indexes, layout) {
    return {
      styles: {
        left: {
          inputRange: [-2, -1, 0, 1],
          outputRange: [layout.width, layout.width, 0, 0]
        },
        opacity: {
          inputRange: [-2, -1, 0, .8, 1],
          outputRange: [0, 1, 1, 0, 0]
        },
        scale: {
          inputRange: [-1, 0, 1, 2],
          outputRange: [1, 1, .5, .5]
        }
      },
      easing: reactNative.Easing.linear,
      duration: 300,
      collapsibleDrawer: true
    };
  }

  var stackAndDock = function stackAndDock(indexes, layout) {
    return {
      styles: {
        translateY: {
          inputRange: [0, 1],
          outputRange: [-100, 0]
        },
        opacity: {
          inputRange: [0, 1],
          outputRange: [0, 1]
        }
      },
      easing: reactNative.Easing.linear,
      duration: 300
    };
  };

  var TransitionModalDefault = {
    stack: stackAndDock,
    dock: stackAndDock,
    modal: function modal(indexes, layout) {
      return {
        styles: {
          translateY: {
            inputRange: [0, 1],
            outputRange: [layout.height, 0]
          }
        },
        easing: reactNative.Easing.linear,
        duration: 300
      };
    }
  };

  var Navigator =
  /*#__PURE__*/
  function (_Component) {
    _inherits(Navigator, _Component);

    function Navigator(props) {
      var _this;

      _classCallCheck(this, Navigator);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Navigator).call(this, props));
      _this.state = _this.getDimensionData();
      _this.getCurrentTransition = memoize(_this.getCurrentTransition);
      _this.getScreenStack = memoize(_this.getScreenStack);
      _this.drawer = {
        open: function open() {
          return _this.drawerInstance.openDrawer();
        },
        close: function close() {
          return _this.drawerInstance.closeDrawer();
        }
      };
      return _this;
    }

    _createClass(Navigator, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        var router = this.router;
        if (!router) return null;
        var _this$props = this.props,
            DrawerComponent = _this$props.DrawerComponent,
            transitions = _this$props.transitions;
        var _this$state = this.state,
            width = _this$state.width,
            height = _this$state.height,
            indexes = _this$state.indexes;
        var transition = this.getCurrentTransition(transitions, width, height);
        var modalTransition = this.getModalTransitions(transition);

        var _this$getScreenStack = this.getScreenStack(router.stack, router.activeIndex),
            stack = _this$getScreenStack.stack,
            index = _this$getScreenStack.index;

        var layout = {
          width: width,
          height: height
        };
        return React__default.createElement(SharedElementWrapper, {
          router: router
        }, React__default.createElement(reactNative.View, {
          style: styles$5.container
        }, React__default.createElement(DrawerWrapper, {
          ref: function ref(component) {
            return _this2.drawerInstance = component;
          },
          router: router,
          transition: modalTransition.dock,
          indexes: indexes.stack,
          collapsible: transition({}, {}).collapsibleDrawer,
          Drawer: DrawerComponent
        }), React__default.createElement(ScreenStack, {
          router: router,
          screenTransition: transition,
          stackTransition: modalTransition.stack,
          stackIndexes: indexes.stack,
          stack: stack,
          index: index,
          layout: layout,
          drawer: this.drawer
        }), React__default.createElement(ModalWrapper, {
          router: router,
          stack: router.modal.stack,
          index: router.modal.stack,
          transition: modalTransition.modal,
          indexes: indexes.modal,
          layout: layout,
          drawer: this.drawer
        })));
      }
    }, {
      key: "getCurrentTransition",
      value: function getCurrentTransition(transitions, width, height) {
        var breakPoints = Object.keys(transitions);
        var i = breakPoints.length;

        while (i-- > 0) {
          if (width >= parseInt(breakPoints[i])) {
            return transitions[breakPoints[i]];
          }
        }

        return transitions[breakPoints[0]];
      }
    }, {
      key: "getModalTransitions",
      value: function getModalTransitions(transition) {
        var t = transition;

        if (!t) {
          var transitions = this.props.transitions;
          var _this$state2 = this.state,
              width = _this$state2.width,
              height = _this$state2.height;
          t = this.getCurrentTransition(transitions, width, height);
        }

        return t.modalTransition || TransitionModalDefault;
      } // Takes the modal screens out of the stack

    }, {
      key: "getScreenStack",
      value: function getScreenStack(routerStack, routerIndex) {
        var stack = routerStack.slice();
        var index = routerIndex;
        var lastIndex = routerStack.length - 1;
        var last = stack[lastIndex];
        var options = last.Screen.urlstackOptions || {};

        if (options.modal) {
          stack.pop();

          if (index === lastIndex) {
            index--;
          }
        }

        return {
          stack: stack,
          index: index
        };
      }
    }, {
      key: "startRouter",
      value: function startRouter(routes) {
        var _this3 = this;

        this.router = create(routes);

        this.fu = function () {
          return _this3.forceUpdate();
        };

        this.router.onChange(function () {
          return _this3.fu();
        });
        this.router.start();
        this.showingModal = this.detectModal();
        this.updateModalIndexes(this.showingModal);
      }
    }, {
      key: "listenToResize",
      value: function listenToResize() {
        var _this4 = this;

        this.onResize = function () {
          return _this4.setState(_this4.getDimensionData());
        };

        reactNative.Dimensions.addEventListener('change', this.onResize);
      }
    }, {
      key: "getDimensionData",
      value: function getDimensionData() {
        var _Dimensions$get = reactNative.Dimensions.get('window'),
            width = _Dimensions$get.width,
            height = _Dimensions$get.height;

        return {
          width: width,
          height: height
        };
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        this.startRouter(this.props.routes);
        this.listenToResize();
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.fu = function () {};

        reactNative.Dimensions.removeEventListener('change', this.onResize);
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        var showModal = this.detectModal();

        if (this.showingModal !== showModal) {
          this.showingModal = showModal;
          this.updateModalIndexes(showModal);
        }

        console.log(this.drawerInstance);
      }
    }, {
      key: "detectModal",
      value: function detectModal() {
        return this.router.modal.active;
      }
    }, {
      key: "updateModalIndexes",
      value: function updateModalIndexes(showModal) {
        var indexes = this.state.indexes;

        if (!indexes) {
          indexes = {
            modal: {
              showing: !!showModal,
              transition: new reactNative.Animated.Value(showModal ? 1 : 0)
            },
            stack: {
              showing: !showModal,
              transition: new reactNative.Animated.Value(showModal ? 0 : 1)
            }
          };
        } else {
          var _this$state3 = this.state,
              width = _this$state3.width,
              height = _this$state3.height;
          var transitions = this.getModalTransitions();
          var modalTransition = transitions.modal(indexes.modal, {
            width: width,
            height: height
          });
          var stackTransition = transitions.stack(indexes.stack, {
            width: width,
            height: height
          });
          indexes = {
            modal: {
              showing: !!showModal,
              transition: indexes.modal.transition
            },
            stack: {
              showing: !showModal,
              transition: indexes.stack.transition
            }
          };
          reactNative.Animated.timing(indexes.modal.transition, {
            toValue: showModal ? 1 : 0,
            easing: modalTransition.easing,
            duration: modalTransition.duration || 300,
            useNativeDriver: true
          }).start();
          reactNative.Animated.timing(indexes.stack.transition, {
            toValue: showModal ? 0 : 1,
            easing: stackTransition.easing,
            duration: stackTransition.duration || 300,
            useNativeDriver: true
          }).start();
        }

        this.setState({
          indexes: indexes
        });
      }
    }]);

    return Navigator;
  }(React.Component);

  _defineProperty(Navigator, "propTypes", {
    transitions: PropTypes.object
  });

  _defineProperty(Navigator, "defaultProps", {
    transitions: {
      0: TransitionMobileDefault,
      800: TransitionNarrowDefault
    }
  });
  var styles$5 = reactNative.StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      overflow: 'hidden'
    }
  });

  var boxAttrs = {
    x: 'left',
    y: 'top',
    width: 'width',
    height: 'height'
  };

  var SharedElement =
  /*#__PURE__*/
  function (_Component) {
    _inherits(SharedElement, _Component);

    function SharedElement(props) {
      var _this;

      _classCallCheck(this, SharedElement);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SharedElement).call(this, props));

      if (props.fromProps) {
        // We are in the transition layer, prepare the animation
        console.log('Amazing we got it!', props);
        _this.animatedLeaving = new reactNative.Animated.Value(0);
        _this.animatedEntering = new reactNative.Animated.Value(-props.toIndex);
      } else if (props.wrapper) {
        // We are mounted by the user, register the shared element
        props.se.register(_assertThisInitialized(_assertThisInitialized(_this)), props);
        _this.registered = true;
      }

      _this.SE = SharedElement;
      return _this;
    }

    _createClass(SharedElement, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        if (this.animatedLeaving) {
          return this.renderTransition();
        }

        var viewStyles = [this.props.style];

        if (this.animatedLeaving) {
          viewStyles = viewStyles.concat([styles$6.position, this.props.fromBox, this.getTransitionStyle()]);
        } // console.log('Shared', this.props.se, this.props.wrapper );


        return React__default.createElement(reactNative.Animated.View, {
          style: this.props.style,
          onLayout: function onLayout(e) {
            return _this2._setBox(e);
          },
          pointerEvents: "auto"
        }, this.props.children);
      }
    }, {
      key: "renderTransition",
      value: function renderTransition() {
        var viewStyles = this.getTransitionStyle();
        return React__default.createElement(reactNative.Animated.View, {
          style: viewStyles.container,
          pointerEvents: "auto"
        }, React__default.createElement(reactNative.Animated.View, {
          style: viewStyles.leaving
        }, this.props.fromProps.children), React__default.createElement(reactNative.Animated.View, {
          style: viewStyles.entering
        }, this.props.toProps.children));
      }
    }, {
      key: "getTransitionStyle",
      value: function getTransitionStyle() {
        if (this.transitionStyles) return this.transitionStyles;
        var _this$props = this.props,
            transitionStyle = _this$props.transitionStyle,
            fromBox = _this$props.fromBox,
            toBox = _this$props.toBox,
            fromProps = _this$props.fromProps,
            toProps = _this$props.toProps,
            toIndex = _this$props.toIndex;
        var st = {};
        var fb = this.boxToStyle(fromBox);
        var tb = this.boxToStyle(toBox);
        var containerStyles = transitionStyle ? transitionStyle(this.animatedLeaving, toIndex, fromBox, toBox, fromProps, toProps) : this.boxInterpolator();
        st.container = [styles$6.transition, this.props.style, fb, containerStyles];
        var leavingStyles = {};

        if (fromProps.contentTransition) {
          leavingStyles = fromProps.contentTransition(this.animatedLeaving, 0, toIndex, fb);
        }

        st.leaving = [styles$6.transition, fb, leavingStyles];
        var enteringStyles = {};

        if (fromProps.contentTransition) {
          enteringStyles = fromProps.contentTransition(this.animatedEntering, -toIndex, 0, tb);
        }

        st.entering = [styles$6.transition, tb, enteringStyles];
        return this.transitionStyles = st;
      }
    }, {
      key: "boxToStyle",
      value: function boxToStyle(box) {
        return {
          left: box.x,
          top: box.y,
          width: box.width,
          height: box.height
        };
      }
    }, {
      key: "_setBox",
      value: function _setBox(e) {
        this.props.wrapper && console.log('Setting box', this.props.wrapper.id);
        this.box = e.nativeEvent.layout;
      }
    }, {
      key: "boxInterpolator",
      value: function boxInterpolator(animatedLeaving, fromIndex, toIndex, fromBox, toBox) {
        var _this3 = this;

        var styles = {};
        var props = this.props;
        ['x', 'y', 'width', 'height'].forEach(function (attr) {
          styles[boxAttrs[attr]] = _this3.interpolator(animatedLeaving || _this3.animatedLeaving, fromIndex || props.fromIndex, toIndex || props.toIndex, (fromBox || props.fromBox)[attr], (toBox || props.toBox)[attr]);
        });
        return styles;
      }
    }, {
      key: "interpolator",
      value: function interpolator(animatedLeaving, fromIndex, toIndex, fromValue, toValue) {
        if (fromValue === toValue) return fromValue;
        var inverted = fromValue > toValue;
        return animatedLeaving.interpolate({
          inputRange: inverted ? [toIndex, toIndex, fromIndex, fromIndex] : [fromIndex, fromIndex, toIndex, toIndex],
          outputRange: inverted ? [toValue, toValue, fromValue, fromValue] : [fromValue, fromValue, toValue, toValue]
        });
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        this.props.wrapper && console.log('Mounted', this.props.wrapper.id);

        if (this.animatedLeaving) {
          // We are in the transition layer, start the animation
          reactNative.Animated.timing(this.animatedLeaving, {
            toValue: this.props.toIndex,
            duration: 500
          }).start();
          reactNative.Animated.timing(this.animatedEntering, {
            toValue: 0,
            duration: 500
          }).start();
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        if (this.registered) {
          this.props.se.unregister(this);
        }
      }
    }]);

    return SharedElement;
  }(React.Component);

  var styles$6 = reactNative.StyleSheet.create({
    transition: {
      position: 'absolute',
      overflow: 'hidden'
    }
  });

  function ContextConsumerHOC(Component) {
    return function SharedElementHOC(props) {
      return React__default.createElement(Context$1.Consumer, null, function (se) {
        return React__default.createElement(Context.Consumer, null, function (wrapper) {
          return React__default.createElement(Component, _extends({}, props, {
            se: se,
            wrapper: wrapper
          }));
        });
      });
    };
  }

  var SharedElementWithContext = ContextConsumerHOC(SharedElement);

  exports.Navigator = Navigator;
  exports.SharedElement = SharedElementWithContext;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
