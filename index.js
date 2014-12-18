'use strict';

function classMatchesTest(klass, test) {
  if(!test) {
    return false;
  }

  if(test instanceof RegExp) {
    return test.exec(klass);
  }
  return klass === test;
}

function isClassSelector(selector) {
  return selector.indexOf('.') === 0;
}

module.exports = function classPrefix(prefix, options) {
  options = options || {};

  function isIgnoredClass(klass) {
    return classMatchesTest(klass, options.not);
  }

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
          if(isIgnoredClass(klass) || klass.trim().length === 0) {
            return klass;
          }
          return prefix + klass;
        }).join('.');
      });
    });
  };
};
