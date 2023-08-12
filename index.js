'use strict'

const Plugin = require('markdown-it-regexp')
const extend = require('extend')
const sanitize = require('sanitize-filename')
const Url = require('reurl').RawUrl

const INITIAL_HASH_REGEX = /^#/
const DIR_SEPARATOR_REGEX = /[/\\]/g

module.exports = (options) => {

  const defaults = {
    baseURL: '/',
    relativeBaseURL: './',
    makeAllLinksAbsolute: false,
    uriSuffix: '.html',
    htmlAttributes: {
    },
    generatePagePathFromLabel: (label) => {
      return label
    },
    postProcessPagePath: (pagePath) => {
      pagePath = pagePath.trim()
      pagePath = pagePath.split('/').map(sanitize).join('/')
      pagePath = pagePath.replace(/\s+/g, '_')
      return pagePath
    },
    postProcessPageHash: (pageHash) => {
      pageHash = pageHash.trim()
      pageHash = pageHash.split('/').map(sanitize).join('/')
      pageHash = pageHash.replace(/\s+/g, '_')
      return pageHash
    },
    postProcessLabel: (label) => {
      label = label.trim()
      if (label.match(INITIAL_HASH_REGEX)) {
        label = label.replace(INITIAL_HASH_REGEX, '')
      }
      else {
        label = label.replace(/#[^#]*$/, '')
      }
      return label
    }
  }

  options = extend(true, defaults, options)

  function isAbsolute(pagePath) {
    return options.makeAllLinksAbsolute || pagePath.charCodeAt(0) === 0x2F/* / */
  }

  /**
   * Converts a path from the form '/path/to'
   * to an array of the form ['path', 'to']
   */
  function pathStrToArray(pathStr) {
    return (
      pathStr.split(DIR_SEPARATOR_REGEX)
        .filter(dirName => !!dirName)
    )
  }

  return Plugin(
    /\[\[([^|\]\n]+)(\|([^\]\n]+))?\]\]/,
    (match, utils) => {
      let label = ''
      let pagePath = null
      let htmlAttrs = []
      let htmlAttrsString = ''

      const absoluteBaseDirs = pathStrToArray(options.baseURL)
      const relativeBaseDirs = pathStrToArray(options.relativeBaseURL)

      const postProcessLabel = options.postProcessLabel
      const postProcessPagePath = (
        options.postProcessPageName ||
        options.postProcessPagePath
      )
      const postProcessPageHash = options.postProcessPageHash
      const generatePagePathFromLabel = (
        options.generatePageNameFromLabel ||
        options.generatePagePathFromLabel
      )

      const isSplit = !!match[3]
      if (isSplit) {
        label = match[3]
        pagePath = match[1]
      }
      else {
        label = match[1]
        pagePath = generatePagePathFromLabel(match[1])
      }

      // parse page path
      let pageUrl = new Url(pagePath)

      // run postprocessing
      if (pageUrl.file) {
        const file = postProcessPagePath(pageUrl.file)
        pageUrl = pageUrl.set({
          file
        })
      }

      if (pageUrl.hash) {
        const hash = postProcessPageHash(pageUrl.hash)
        pageUrl = pageUrl.set({
          hash
        })
      }

      label = postProcessLabel(label)

      if (isAbsolute(pagePath)) {
        const dirs = absoluteBaseDirs.concat(
          pageUrl.dirs || []
        )
        pageUrl = pageUrl.set({
          root: '/',
          dirs,
        })
      }
      else if(pageUrl.file) { // relative
        const dirs = relativeBaseDirs.concat(
          pageUrl.dirs || []
        )
        pageUrl = pageUrl.set({
          root: null,
          dirs,
        })
      }
      
      // add the URI suffix (e.g. `.html`)
      // but only if the filename is not empty
      if (pageUrl.file && options.uriSuffix) {
        pageUrl = pageUrl.set({
          file: pageUrl.file + options.uriSuffix
        })
      }
      
      const href = pageUrl.toString()
      const escapedHref = utils.escape(href)

      htmlAttrs.push(`href="${escapedHref}"`)
      for (let attrName in options.htmlAttributes) {
        const attrValue = options.htmlAttributes[attrName]
        htmlAttrs.push(`${attrName}="${attrValue}"`)
      }
      htmlAttrsString = htmlAttrs.join(' ')

      return `<a ${htmlAttrsString}>${label}</a>`
    }
  )
}
