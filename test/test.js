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

  it('ignores a classes given in except', function() {
    var out = rework(fixture('filter.css')).use(
      classPrfx('prfx-',
        { except: /^is-/ }
      )).toString().trim();
    var expected = fixture('filter.css.expected');
    assert.equal(out, expected);
  });
});
