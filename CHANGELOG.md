# Changelog

## [1.4.0] - 2023-08-01

### Added

* Support for anchors in wikilinks

### Changed

* Renamed `generatePageNameFromLabel` and `postProcessPageName` to `generatePagePathFromLabel` and `postProcessPagePath` respectively. The module retains backwards compatibility with the previous property names.

## [1.3.0] - 2023-06-22

### Added

* This changelog.

### Changed

* Now replaces every space in a wiki link with an underscore (`_`). Previous versions only replaced the first space. (implements [#3](https://github.com/jsepia/markdown-it-wikilinks/issues/3))

### Security

* Upgraded `json-schema` and `jsprim` to address a critical vulnerability
* Removed unused `request` dependency

## [1.2.0] - 2021-10-29

### Added

* Supports a broader set of valid characters in links, including hyphens

## [1.1.0] - 2021-10-28

### Added

* Support for a broader set of valid characters in links, including hyphens

### Changed

* Upgraded most dependencies

## [1.1.0] - 2021-10-28

### Added

* Support for punctuation in wiki links
