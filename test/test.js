var assert    = require('assert'),
    fs        = require('fs'),
    rework    = require('rework'),
    classPrfx = require('..');

function fixture(name) {
  return fs.readFileSync('test/fixtures/' + name, 'utf8').trim();
}

describe('rework-class-prefix', function() {
  it('prefixes all classes', function() {
    var output = rework(fixture('source.css')).use(classPrfx('prfx-')).toString().trim();
    var expected = fixture('source.css.expected');

    assert.equal(output, expected);
  });

  it('ignores already prefixed classes', function() {
    var output = rework(fixture('prefixed.css')).use(classPrfx('prfx-')).toString().trim();
    var expected = fixture('prefixed.css.expected');

    assert.equal(output, expected);
  })

  describe('options.not', function() {
    var original = fixture('filter.css');
    var expected = fixture('filter.css.expected');
    it('ignores a classes matching a "not" RegExp', function() {
      var out = rework(original).use(
        classPrfx('prfx-',
          { not: /^is-/ }
        )).toString().trim();
      assert.equal(out, expected);
    });

    it('accepts regular expression as a string for "not"', function() {
      var out = rework(original).use(
        classPrfx('prfx-',
          { not: '/^is-/' }
        )).toString().trim();
      assert.equal(out, expected);
    });

  });

});
