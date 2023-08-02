'use strict';

const path = require('path');
const generate = require('markdown-it-testgen');
const sinon = require('sinon');
const assert = require('assert');
const MarkdownItWikilinks = require('../')

/*eslint-env mocha*/

describe('markdown-it-wikilinks', function () {
  it('should run the test suite correctly', () => {
    const plugin = MarkdownItWikilinks()
    const md = require('markdown-it')()
           .use(plugin);
    generate(
      path.join(
        __dirname,
        'fixtures/wikilinks.txt'
      ),
      md
    );
  });

  describe('postProcessPagePath', () => {
    const TEST_PAGE_NAME = 'contact';
    const TEST_MARKDOWN = '[[contact]]';
    const EXPECTED_OUTPUT = '<a href="./contact.html">contact</a>';

    function execute(postProcessCallbackName) {
      const cb = sinon.stub();
      cb.returns(TEST_PAGE_NAME);
      const opts = {};
      opts[postProcessCallbackName] = cb;
      const plugin = MarkdownItWikilinks(opts)
      const md = require('markdown-it')()
             .use(plugin);
      const result = md.renderInline(TEST_MARKDOWN);
      assert.equal(result, EXPECTED_OUTPUT);
      assert.equal(cb.calledOnce, true);
      assert.equal(cb.lastCall.args[0], TEST_PAGE_NAME);
    }

    it('should pass the correct arguments to postProcessPagePath', () => {
      execute('postProcessPagePath');
    });
  
    it('should retain backwards compatibility with postProcessPageName', () => {
      execute('postProcessPageName');
    });
  });

  afterEach(() => {
    sinon.restore();
  });
});
