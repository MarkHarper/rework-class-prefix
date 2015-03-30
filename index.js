'use strict';

/**
 * Convert regular expression string to RegExp.
 * @param  {RegExp|string} str Input string to convert
 * @return {RegExp} Converted RegExp or the original string.
 */
function strToRegExp(str) {
  if(str instanceof RegExp) {
    return str;
  }

  var parts = str.match(/^\/(.*?)\/([gim]*)$/);
  if (parts) {
    return new RegExp(parts[1], parts[2]);
  }
  else {
    return new RegExp(str);
  }
}

function isClassSelector(selector) {
  return selector.indexOf('.') === 0;
}

function notTester(matcher) {

  // If we have no matcher (i.e. options.not is undefined),
  // all classes will be accepted.
  if(!matcher) {
    return function testNotBlank(klass) { return false; };
  }
  matcher = strToRegExp(matcher);
  return function testNotForClass(klass) {
    return matcher.exec(klass);
  };
}

module.exports = function classPrefix(prefix, options) {
  options = options || {};

  function isPrefixed(klass) {
    return (klass.indexOf(prefix) === 0);
  }

  var isIgnoredClass = notTester(options.not);

  return function classPrefix(styling) {
    var walk = require('rework-walk');
    walk(styling, function(rule, node) {
      if (!rule.selectors){
        return rule;
      }

      rule.selectors = rule.selectors.map(function(selector) {
        if (!isClassSelector(selector)) {
          return selector;
        }

        var classes = selector.split('.');

        return classes.map(function(klass){
          if(klass.trim().length === 0 || isIgnoredClass(klass) || isPrefixed(klass)) {
            return klass;
          }
          return prefix + klass;
        }).join('.');
      });
    });
  };
};
