/*!
 * Name: vue-upload-component
 * Version: 2.9.0
 * Author: LianYue
 */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(36)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssridKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(45);

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = marked;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = Vuex;

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_i18n__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_i18n___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue_i18n__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__en__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__zh_cn__ = __webpack_require__(30);
// import Vue from 'vue'




// Vue.use(VueI18n)

/* harmony default export */ __webpack_exports__["a"] = (new __WEBPACK_IMPORTED_MODULE_0_vue_i18n___default.a({
  locale: 'en',
  messages: {
    'zh-cn': __WEBPACK_IMPORTED_MODULE_2__zh_cn__["a" /* default */],
    en: __WEBPACK_IMPORTED_MODULE_1__en__["a" /* default */]
  }
}));

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_marked__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_marked___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_marked__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
  mounted: function mounted() {
    // auto scrollTo hash
    if (this.$route.hash) {
      var el = document.querySelector(decodeURIComponent(this.$route.hash));
      if (el) {
        window.scrollTo(0, el.offsetTop);
      }
    }
  },


  computed: {
    document: function document() {
      return __webpack_require__(37)("./" + this.$i18n.locale);
    },
    navs: function navs() {
      var tokens = __WEBPACK_IMPORTED_MODULE_0_marked___default.a.lexer(this.document);
      var rootNode = {
        name: '',
        children: [],
        level: 1
      };
      var parent = rootNode;
      var navPrev = void 0;
      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        if (token.type !== 'heading') {
          continue;
        }

        var nav = {
          name: token.text,
          hash: token.text.toLowerCase().replace(/([\u0000-\u002F\u003A-\u0060\u007B-\u007F]+)/g, '-').replace(/^\-+|\-+$/, ''),
          level: token.depth,
          children: []
        };
        if (!navPrev || nav.level === navPrev.level) {
          // empty
        } else if (nav.level > navPrev.level) {
          // next
          parent = navPrev;
        } else {
          while (nav.level < navPrev.level && navPrev.parent) {
            navPrev = navPrev.parent;
            parent = navPrev.parent;
          }
        }

        nav.parent = parent;
        parent.children.push(nav);
        navPrev = nav;
      }
      return rootNode.children;
    }
  }
});

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = "\r\n> **The document uses Google Translate**\r\n\r\n## Getting Started\r\n\r\n### NPM\r\n\r\n``` bash\r\nnpm install vue-upload-component --save\r\n```\r\n\r\n``` js\r\nconst VueUploadComponent = require('vue-upload-component')\r\nVue.component('file-upload', VueUploadComponent)\r\n```\r\n\r\n### Curated\r\n\r\n**No data**\r\n\r\n\r\n### Script\r\n\r\n\r\nunpkg\r\n\r\n``` html\r\n<script src=\"https://unpkg.com/vue\"></script>\r\n<script src=\"https://unpkg.com/vue-upload-component\"></script>\r\n<script>\r\nVue.component('file-upload', VueUploadComponent)\r\n</script>\r\n```\r\n\r\njsDelivr\r\n\r\n``` html\r\n<script src=\"https://cdn.jsdelivr.net/npm/vue/dist/vue.js\"></script>\r\n<script src=\"https://cdn.jsdelivr.net/npm/vue-upload-component\"></script>\r\n<script>\r\nVue.component('file-upload', VueUploadComponent)\r\n</script>\r\n```\r\n\r\n\r\n### Simple example\r\n\r\n\r\n\r\n```html\r\n<!DOCTYPE html>\r\n<html>\r\n<head>\r\n  <meta charset=\"utf-8\">\r\n  <title>Vue-upload-component Test</title>\r\n  <script src=\"https://unpkg.com/vue\"></script>\r\n  <script src=\"https://unpkg.com/vue-upload-component\"></script>\r\n</head>\r\n<body>\r\n<div id=\"app\">\r\n  <ul>\r\n    <li v-for=\"file in files\">{{file.name}} - Error: {{file.error}}, Success: {{file.success}}</li>\r\n  </ul>\r\n  <file-upload\r\n    ref=\"upload\"\r\n    v-model=\"files\"\r\n    post-action=\"/post.method\"\r\n    put-action=\"/put.method\"\r\n    @input-file=\"inputFile\"\r\n    @input-filter=\"inputFilter\"\r\n  >\r\n  Upload file\r\n  </file-upload>\r\n  <button v-show=\"!$refs.upload || !$refs.upload.active\" @click.prevent=\"$refs.upload.active = true\" type=\"button\">Start upload</button>\r\n  <button v-show=\"$refs.upload && $refs.upload.active\" @click.prevent=\"$refs.upload.active = false\" type=\"button\">Stop upload</button>\r\n</div>\r\n<script>\r\nnew Vue({\r\n  el: '#app',\r\n  data: function () {\r\n    return {\r\n      files: []\r\n    }\r\n  },\r\n  components: {\r\n    FileUpload: VueUploadComponent\r\n  },\r\n  methods: {\r\n    /**\r\n     * Has changed\r\n     * @param  Object|undefined   newFile   Read only\r\n     * @param  Object|undefined   oldFile   Read only\r\n     * @return undefined\r\n     */\r\n    inputFile: function (newFile, oldFile) {\r\n      if (newFile && oldFile && !newFile.active && oldFile.active) {\r\n        // Get response data\r\n        console.log('response', newFile.response)\r\n        if (newFile.xhr) {\r\n          //  Get the response status code\r\n          console.log('status', newFile.xhr.status)\r\n        }\r\n      }\r\n    },\r\n    /**\r\n     * Pretreatment\r\n     * @param  Object|undefined   newFile   Read and write\r\n     * @param  Object|undefined   oldFile   Read only\r\n     * @param  Function           prevent   Prevent changing\r\n     * @return undefined\r\n     */\r\n    inputFilter: function (newFile, oldFile, prevent) {\r\n      if (newFile && !oldFile) {\r\n        // Filter non-image file\r\n        if (!/\\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {\r\n          return prevent()\r\n        }\r\n      }\r\n\r\n      // Create a blob field\r\n      newFile.blob = ''\r\n      let URL = window.URL || window.webkitURL\r\n      if (URL && URL.createObjectURL) {\r\n        newFile.blob = URL.createObjectURL(newFile.file)\r\n      }\r\n    }\r\n  }\r\n});\r\n</script>\r\n</body>\r\n</html>\r\n```\r\n\r\n### Chunk Upload\r\n\r\nThis package allows chunk uploads, which means you can upload a file in different parts.\r\n\r\nThis process is divided in three phases: <strong>start</strong>, <strong>upload</strong>,<strong>finish</strong></p>\r\n\r\n#### start\r\n\r\nThis is the first phase of the process. We'll tell the backend that we are going to upload a file, with certain `size` and `mime_type`.\r\n\r\nUse the option `startBody` to add more parameters to the body of this request.\r\n\r\nThe backend should provide a `session_id` (to identify the upload) and a `end_offset` which is the size of every chunk\r\n\r\n#### upload\r\n\r\nIn this phase we'll upload every chunk until all of them are uploaded. This step allows some failures in the backend, and will retry up to `maxRetries` times.\r\n\r\nWe'll send the `session_id`, `start_chunk` and `chunk` (the sliced blob - part of file we are uploading). We expect the backend to return `{ status: 'success' }`, we'll retry otherwise.\r\n\r\nUse the option `uploadBody` to add more parameters to the body of this request.\r\n\r\n#### finish\r\n\r\nIn this phase we tell the backend that there are no more chunks to upload, so it can wrap everything. We send the `session_id` in this phase.\r\n\r\nUse the option `finishBody` to add more parameters to the body of this request.\r\n\r\n#### Example\r\n\r\nIn the following example we are going to add `Chunk Upload Functionality`. This component will use `Chunk Upload` when the size of the file is > `1MB`, it will behave as the `Simple example` when the size of the file is lower.\r\n\r\n```html\r\n  <file-upload\r\n    ref=\"upload\"\r\n    v-model=\"files\"\r\n    post-action=\"/post.method\"\r\n    put-action=\"/put.method\"\r\n\r\n    chunk-enabled\r\n    :chunk=\"{\r\n      action: '/upload/chunk',\r\n      minSize: 1048576,\r\n      maxActive: 3,\r\n      maxRetries: 5,\r\n\r\n      // Example in the case your backend also needs the user id to operate\r\n      startBody: {\r\n        user_id: user.id\r\n      }\r\n    }\"\r\n\r\n    @input-file=\"inputFile\"\r\n    @input-filter=\"inputFilter\"\r\n  >\r\n  Upload file\r\n  </file-upload>\r\n```\r\n\r\n#### Extending the handler\r\n\r\nWe are using the class `src/chunk/ChunkUploadHandler` class to implement this protocol. You can extend this class (or even create a different one from scratch) to implement your own way to communicat with the backend.\r\n\r\nThis class must implement a method called `upload` which **must** return a promise. This promise will be used by the `FileUpload` component to determinate whether the file was uploaded or failed.\r\n\r\nUse the `handler` parameter to use a different Handler\r\n\r\n```html\r\n :chunk=\"{\r\n   action: '/upload/chunk',\r\n   minSize: 1048576,\r\n   maxActive: 3,\r\n   maxRetries: 5,\r\n\r\n   handler: MyHandlerClass\r\n }\r\n```\r\n\r\n### SSR (Server isomorphism)\r\n\r\n\r\n```html\r\n<template>\r\n  <file-upload v-model=\"files\" post-action=\"/\">Upload file</file-upload>\r\n</template>\r\n<style>\r\n/*\r\nimport '~vue-upload-component/dist/vue-upload-component.part.css'\r\n\r\n\r\nor\r\n\r\n\r\n */\r\n.file-uploads {\r\n  overflow: hidden;\r\n  position: relative;\r\n  text-align: center;\r\n  display: inline-block;\r\n}\r\n.file-uploads.file-uploads-html4 input[type=\"file\"] {\r\n  opacity: 0;\r\n  font-size: 20em;\r\n  z-index: 1;\r\n  top: 0;\r\n  left: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  position: absolute;\r\n  width: 100%;\r\n  height: 100%;\r\n}\r\n.file-uploads.file-uploads-html5 input[type=\"file\"] {\r\n  overflow: hidden;\r\n  position: fixed;\r\n  width: 1px;\r\n  height: 1px;\r\n  z-index: -1;\r\n  opacity: 0;\r\n}\r\n</style>\r\n<script>\r\nimport FileUpload from 'vue-upload-component/dist/vue-upload-component.part.js'\r\nexport default {\r\n  components: {\r\n    FileUpload,\r\n  },\r\n  data() {\r\n    return {\r\n      files: []\r\n    }\r\n  },\r\n}\r\n</script>\r\n```\r\n\r\n\r\n** OR **\r\n\r\n\r\n```js\r\nimport FileUpload from 'vue-upload-component/src'\r\n```\r\n\r\n\r\nwebpack.config.js\r\n\r\n```js\r\nconst nodeExternals = require('webpack-node-externals');\r\n{\r\n  //.....\r\n  externals: [\r\n    nodeExternals({whitelist:[/^vue-upload-component\\/src/]})\r\n  ]\r\n  //.....\r\n}\r\n```\r\n\r\n* [https://github.com/liady/webpack-node-externals](https://github.com/liady/webpack-node-externals)\r\n\r\n* [**`vue-hackernews` demo**](https://github.com/lian-yue/vue-hackernews-2.0/)\r\n\r\n* [**View changes**](https://github.com/lian-yue/vue-hackernews-2.0/commit/bd6c58a30cc6b8ba6c0148e737b3ce9336b99cf8)\r\n\r\n\r\n\r\n\r\n## Options / Props\r\n\r\n\r\n### input-id\r\n\r\nThe `id` attribute of the input tag\r\n\r\n* **Type:** `String`\r\n\r\n* **Default:** `this.name`\r\n\r\n* **Usage:**\r\n  ```html\r\n  <file-upload input-id=\"file2\"></file-upload>\r\n  <!--Output-->\r\n  <input id=\"file2\" />\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n### name\r\n\r\nThe `name` attribute of the input tag\r\n\r\n* **Type:** `String`\r\n\r\n* **Default:** `file`\r\n\r\n* **Usage:**\r\n  ```html\r\n  <file-upload name=\"file\"></file-upload>\r\n  <!--Output-->\r\n  <input name=\"file\" />\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n### post-action\r\n\r\n`POST` Request upload URL\r\n\r\n* **Type:** `String`\r\n\r\n* **Default:** `undefined`\r\n\r\n* **Usage:**\r\n  ```html\r\n  <file-upload post-action=\"/upload/post.php\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n### put-action\r\n\r\n`PUT` Request upload URL\r\n\r\n* **Type:** `String`\r\n\r\n* **Default:** `undefined`\r\n\r\n* **Browser:** `> IE9`\r\n\r\n* **Details:**\r\n\r\n  `put-action` is not empty Please give priority to` PUT` request\r\n\r\n* **Usage:**\r\n  ```html\r\n  <file-upload put-action=\"/upload/put.php\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n### custom-action\r\n\r\nCustom upload method\r\n\r\n* **Type:** `async Function`\r\n\r\n* **Default:** `undefined`\r\n\r\n* **Details:**  \r\n\r\n  `custom-action` priority than `put-action, post-action`\r\n\r\n* **Usage:**\r\n  ```html\r\n  <file-upload :custom-action=\"customAction\"></file-upload>\r\n  ```\r\n  ```js\r\n  async function customAction(file, component) {\r\n    // return await component.uploadPut(file)\r\n    return await component.uploadHtml4(file)\r\n  }\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n### headers\r\n\r\nAttach `header` data\r\n\r\n* **Type:** `Object`\r\n\r\n* **Default:** `{}`\r\n\r\n* **Browser:** `> IE9`\r\n\r\n* **Usage:**\r\n  ```html\r\n  <file-upload :headers=\"{'X-Token-CSRF': 'code'}\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n### data\r\n\r\n`POST request`:  Append request `body`\r\n`PUT request`:  Append request `query`\r\n\r\n* **Type:** `Object`\r\n\r\n* **Default:** `{}`\r\n\r\n* **Usage:**\r\n  ```html\r\n  <file-upload :data=\"{access_token: 'access_token'}\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n\r\n### value, v-model\r\n\r\nFile List\r\n\r\n* **Type:** `Array<File | Object>`\r\n\r\n* **Default:** `[]`\r\n\r\n* **Details:**\r\n\r\n  View **[`File`](#file)** details\r\n  > In order to prevent unpredictable errors, can not directly modify the `files`, please use [`add`](#instance-methods-add), [`update`](#instance-methods-update), [`remove`](#instance-methods-remove) method to modify\r\n\r\n* **Usage:**\r\n  ```html\r\n  <file-upload :value=\"files\" @input=\"updatetValue\"></file-upload>\r\n  <!--or-->\r\n  <file-upload v-model=\"files\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n### accept\r\n\r\nThe `accept` attribute of the input tag, MIME type\r\n\r\n* **Type:** `String`\r\n\r\n* **Default:** `undefined`\r\n\r\n* **Browser:** `> IE9`\r\n\r\n* **Usage:**\r\n  ```html\r\n  <file-upload accept=\"image/png,image/gif,image/jpeg,image/webp\"></file-upload>\r\n  <!--or-->\r\n  <file-upload accept=\"image/*\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n### multiple\r\n\r\nThe `multiple` attribute of the input tag\r\nWhether to allow multiple files to be selected\r\n\r\n* **Type:** `Boolean`\r\n\r\n* **Default:** `false`\r\n\r\n* **Details:**\r\n\r\n  If it is `false` file inside only one file will be automatically deleted\r\n\r\n* **Usage:**\r\n  ```html\r\n  <file-upload :multiple=\"true\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n### directory\r\n\r\nThe `directory` attribute of the input tag\r\nWhether it is a upload folder\r\n\r\n* **Type:** `Boolean`\r\n\r\n* **Default:** `false`\r\n\r\n* **Browser:** [http://caniuse.com/#feat=input-file-directory](http://caniuse.com/#feat=input-file-directory)\r\n\r\n* **Usage:**\r\n  ```html\r\n  <file-upload :directory=\"true\" :multiple=\"true\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n### extensions\r\n\r\nAllow upload file extensions\r\n\r\n* **Type:** `Array | String | RegExp`\r\n\r\n* **Default:** `undefined`\r\n\r\n* **Usage:**\r\n  ```html\r\n  <file-upload extensions=\"jpg,gif,png,webp\"></file-upload>\r\n  <!--or-->\r\n  <file-upload :extensions=\"['jpg', 'gif', 'png', 'webp']\"></file-upload>\r\n  <!--or-->\r\n  <file-upload :extensions=\"/\\.(gif|jpe?g|png|webp)$/i\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n\r\n### size\r\n\r\nAllow the maximum byte to upload\r\n\r\n* **Type:** `Number`\r\n\r\n* **Default:** `0`\r\n\r\n* **Browser:** `> IE9`\r\n\r\n* **Details:**\r\n\r\n  `0` is equal to not limit\r\n\r\n* **Usage:**\r\n  ```html\r\n  <file-upload :size=\"1024 * 1024\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n\r\n### timeout\r\n\r\nUpload timeout time in milliseconds\r\n\r\n* **Type:** `Number`\r\n\r\n* **Default:** `0`\r\n\r\n* **Browser:** `> IE9`\r\n\r\n* **Usage:**\r\n  ```html\r\n  <file-upload :timeout=\"600 * 1000\"></file-upload>\r\n  ```\r\n\r\n### maximum\r\n\r\nList the maximum number of files\r\n\r\n* **Type:** `Number`\r\n\r\n* **Default:** `props.multiple ? 0 : 1`\r\n\r\n* **Usage:**\r\n  ```html\r\n  <file-upload :maximum=\"10\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n### thread\r\n\r\nAlso upload the number of files at the same time (number of threads)\r\n\r\n* **Type:** `Number`\r\n\r\n* **Default:** `1`\r\n\r\n* **Browser:** `> IE9`\r\n\r\n* **Usage:**\r\n  ```html\r\n  <file-upload :thread=\"3\"></file-upload>\r\n  ```\r\n\r\n### chunk-enabled\r\n\r\nWhether chunk uploads is enabled or not\r\n\r\n* **Type:** `Boolean`\r\n\r\n* **Default:** `false`\r\n\r\n* **Usage:**\r\n  ```html\r\n  <file-upload :chunk-enabled=\"true\"></file-upload>\r\n  <file-upload chunk-enabled></file-upload>\r\n  ```\r\n\r\n### chunk\r\n\r\nAll the options to handle chunk uploads\r\n\r\n* **Type:** `Object`\r\n\r\n* **Default:**\r\n```js\r\n{\r\n    headers: {\r\n      'Content-Type': 'application/json'\r\n    },\r\n    action: '',\r\n    minSize: 1048576,\r\n    maxActive: 3,\r\n    maxRetries: 5,\r\n\r\n    // This is the default Handler implemented in this package\r\n    // you can use your own handler if your protocol is different\r\n    handler: ChunkUploadDefaultHandler\r\n}\r\n```\r\n\r\n### drop\r\n\r\nDrag and drop upload\r\n\r\n* **Type:** `Boolean | Element | CSS selector`\r\n\r\n* **Default:** `false`\r\n\r\n* **Browser:** [http://caniuse.com/#feat=dragndrop](http://caniuse.com/#feat=dragndrop)\r\n\r\n* **Details:**\r\n\r\n  If set to `true`, read the parent component as a container\r\n\r\n* **Usage:**\r\n  ```html\r\n  <file-upload :drop=\"true\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n### drop-directory\r\n\r\nWhether to open the drag directory\r\n\r\n* **Type:** `Boolean`\r\n\r\n* **Default:** `true`\r\n\r\n* **Details:**\r\n\r\n  If set to `false` filter out the directory\r\n\r\n* **Usage:**\r\n  ```html\r\n  <file-upload :drop-directory=\"false\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n### add-index\r\n\r\n* **Type:** `Boolean, Number`\r\n\r\n* **Default:** `undefined`\r\n\r\n* **Version:** : `>=2.6.1`\r\n\r\n* **Details:**\r\n\r\n  The default value of the `index` parameter for the [`add()`](#instance-methods-add) method\r\n\r\n* **Usage:**\r\n  ```html\r\n  <file-upload :add-index=\"true\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n\r\n## Options / Events\r\n\r\nThe files is changed to trigger the method\r\nDefault for `v-model` binding\r\n\r\n### @input\r\n* **Arguments:**\r\n\r\n  * `files: Array<File | Object>`\r\n\r\n\r\n* **Usage:**\r\n  ```html\r\n  <template>\r\n    <file-upload :value=\"files\" @input=\"updatetValue\"></file-upload>\r\n    <!--or-->\r\n    <file-upload v-model=\"files\"></file-upload>\r\n  </template>\r\n  <script>\r\n  export default {\r\n    data() {\r\n      return {\r\n        files: []\r\n      }\r\n    },\r\n    methods: {\r\n      updatetValue(value) {\r\n        this.files = value\r\n      }\r\n    }\r\n  }\r\n  </script>\r\n  ```\r\n\r\n\r\n\r\n### @input-filter\r\n\r\nAdd, update, remove pre-filter\r\n\r\n* **Arguments:**\r\n\r\n  * `newFile: File | Object | undefined`  `Read and write`\r\n  * `oldFile: File | Object | undefined`  `Read only`\r\n  * `prevent: Function`   Call this function to prevent modification\r\n\r\n\r\n* **Details:**\r\n\r\n  If the `newFile` value is `undefined` 'is deleted\r\n  If the `oldFile` value is `undefined` 'is added\r\n  If `newFile`, `oldFile` is exist, it is updated\r\n\r\n  > Synchronization modify `newFile`\r\n  > Asynchronous Please use `update`,` add`, `remove`,` clear` method\r\n  > Asynchronous Please set an error first to prevent being uploaded\r\n\r\n  > Synchronization can not use `update`,` add`, `remove`,` clear` methods\r\n  > Asynchronous can not modify `newFile`\r\n\r\n* **Usage:**\r\n  ```html\r\n  <template>\r\n    <ul>\r\n      <li v-for=\"file in files\">\r\n        <img :src=\"file.blob\" width=\"50\" height=\"50\" />\r\n      </li>\r\n    </ul>\r\n    <file-upload :value=\"files\" @input-filter=\"inputFilter\"></file-upload>\r\n  </template>\r\n  <script>\r\n  export default {\r\n    data() {\r\n      return {\r\n        files: []\r\n      }\r\n    },\r\n    methods: {\r\n      inputFilter(newFile, oldFile, prevent) {\r\n        if (newFile && !oldFile) {\r\n          // Add file\r\n\r\n          // Filter non-image file\r\n          // Will not be added to files\r\n          if (!/\\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {\r\n            return prevent()\r\n          }\r\n\r\n          // Create the 'blob' field for thumbnail preview\r\n          newFile.blob = ''\r\n          let URL = window.URL || window.webkitURL\r\n          if (URL && URL.createObjectURL) {\r\n            newFile.blob = URL.createObjectURL(newFile.file)\r\n          }\r\n        }\r\n\r\n        if (newFile && oldFile) {\r\n          // Update file\r\n\r\n          // Increase the version number\r\n          if (!newFile.version) {\r\n            newFile.version = 0\r\n          }\r\n          newFile.version++\r\n        }\r\n\r\n        if (!newFile && oldFile) {\r\n          // Remove file\r\n\r\n          // Refused to remove the file\r\n          // return prevent()\r\n        }\r\n      }\r\n    }\r\n  }\r\n  </script>\r\n  ```\r\n\r\n### @input-file\r\n\r\nAdd, update, remove after\r\n\r\n* **Arguments:**\r\n\r\n  * `newFile: File | Object | undefined` `Read only`\r\n  * `oldFile: File | Object | undefined` `Read only`\r\n\r\n\r\n* **Details:**\r\n\r\n  If the `newFile` value is `undefined` 'is deleted\r\n  If the `oldFile` value is `undefined` 'is added\r\n  If `newFile`, `oldFile` is exist, it is updated\r\n\r\n\r\n  >You can use `update`,` add`, `remove`,` clear` methods in the event\r\n  >You can not modify the `newFile` object in the event\r\n  >You can not modify the `oldFile` object in the event\r\n\r\n* **Usage:**\r\n  ```html\r\n  <template>\r\n    <file-upload ref=\"upload\" v-model=\"files\" @input-file=\"inputFile\"></file-upload>\r\n  </template>\r\n  <script>\r\n  export default {\r\n    data() {\r\n      return {\r\n        files: []\r\n      }\r\n    },\r\n    methods: {\r\n      inputFile(newFile, oldFile) {\r\n        if (newFile && !oldFile) {\r\n          // Add file\r\n        }\r\n\r\n        if (newFile && oldFile) {\r\n          // Update file\r\n\r\n          // Start upload\r\n          if (newFile.active !== oldFile.active) {\r\n            console.log('Start upload', newFile.active, newFile)\r\n\r\n            // min size\r\n            if (newFile.size >= 0 && newFile.size < 100 * 1024) {\r\n              newFile = this.$refs.upload.update(newFile, {error: 'size'})\r\n            }\r\n          }\r\n\r\n          // Upload progress\r\n          if (newFile.progress !== oldFile.progress) {\r\n            console.log('progress', newFile.progress, newFile)\r\n          }\r\n\r\n          // Upload error\r\n          if (newFile.error !== oldFile.error) {\r\n            console.log('error', newFile.error, newFile)\r\n          }\r\n\r\n          // Uploaded successfully\r\n          if (newFile.success !== oldFile.success) {\r\n            console.log('success', newFile.success, newFile)\r\n          }\r\n        }\r\n\r\n        if (!newFile && oldFile) {\r\n          // Remove file\r\n\r\n          // Automatically delete files on the server\r\n          if (oldFile.success && oldFile.response.id) {\r\n            // $.ajax({\r\n            //   type: 'DELETE',\r\n            //   url: '/file/delete?id=' + oldFile.response.id,\r\n            // });\r\n          }\r\n        }\r\n\r\n        // Automatic upload\r\n        if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {\r\n          if (!this.$refs.upload.active) {\r\n            this.$refs.upload.active = true\r\n          }\r\n        }\r\n      }\r\n    }\r\n  }\r\n  </script>\r\n  ```\r\n\r\n\r\n\r\n## Instance / Data\r\n\r\n### features\r\n\r\nUsed to determine the browser support features\r\n\r\n* **Type:** `Object`\r\n\r\n* **Read only:** `true`\r\n\r\n* **Default:** `{ html5: true, directory: false, drag: false }`\r\n\r\n* **Usage:**\r\n  ```html\r\n  <app>\r\n    <file-upload ref=\"upload\"></file-upload>\r\n    <span v-show=\"$refs.upload && $refs.upload.features.drag\">Support drag and drop upload</span>\r\n    <span v-show=\"$refs.upload && $refs.upload.features.directory\">Support folder upload</span>\r\n    <span v-show=\"$refs.upload && $refs.upload.features.html5\">Support for HTML5</span>\r\n  </app>\r\n  ```\r\n\r\n\r\n\r\n### active\r\n\r\nActivation or abort upload\r\n\r\n* **Type:** `Boolean`\r\n\r\n* **Read only:** `false`\r\n\r\n* **Default:** `false`\r\n\r\n* **Usage:**\r\n  ```html\r\n  <app>\r\n    <file-upload ref=\"upload\"></file-upload>\r\n    <span v-if=\"!$refs.upload || !$refs.upload.active\" @click=\"$refs.upload.active = true\">Start upload</span>\r\n    <span v-else @click=\"$refs.upload.active = false\">Stop upload</span>\r\n  </app>\r\n  ```\r\n\r\n\r\n\r\n### dropActive\r\n\r\nIs dragging\r\n\r\n* **Type:** `Boolean`\r\n\r\n* **Read only:** `true`\r\n\r\n* **Default:** `false`\r\n\r\n* **Usage:**\r\n  ```html\r\n  <app>\r\n    <file-upload ref=\"upload\" :drop=\"true\"></file-upload>\r\n    <span v-show=\"$refs.upload && $refs.upload.dropActive\">Drag and drop here for upload</span>\r\n  </app>\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n### uploaded\r\n\r\nAll uploaded\r\n\r\n* **Type:** `Boolean`\r\n\r\n* **Read only:** `true`\r\n\r\n* **Default:** `true`\r\n\r\n* **Usage:**\r\n  ```html\r\n  <app>\r\n    <file-upload ref=\"upload\"></file-upload>\r\n    <span v-show=\"$refs.upload && $refs.upload.uploaded\">All files have been uploaded</span>\r\n  </app>\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n## Instance / Methods\r\n\r\n\r\n\r\n### get()\r\n\r\nUse `id` to get a file object\r\n\r\n* **Arguments:**\r\n\r\n  * `id: File | Object | String`\r\n\r\n\r\n* **Result:** `File | Object | Boolean` There is a return file, object that otherwise returns `false`\r\n\r\n\r\n\r\n### add()\r\n\r\nAdd one or more files\r\n\r\n* **Arguments:**\r\n\r\n  * `files: Array<File | window.File | Object> | File | window.File | Object`     If it is an array of responses will be an array\r\n  * `index: Number | Boolean` = [`props.add-index`](#options-props-add-index)   `true = ` Start, `false = ` End, `Number = ` Index\r\n\r\n\r\n* **Result:** `Object | Array<File | Object> | Boolean`     The incoming array is returned to the array otherwise the object or `false`\r\n\r\n* **Usage:**\r\n  ```html\r\n  <template>\r\n    <ul>\r\n      <li v-for=\"file in files\">\r\n        <span>{{file.name}}</span>\r\n      </li>\r\n    </ul>\r\n    <file-upload v-model=\"files\"></file-upload>\r\n    <button type=\"button\" @click.prevent=\"addText\">Add a file</button>\r\n  </template>\r\n  <script>\r\n  export default {\r\n    data() {\r\n      return {\r\n        files: []\r\n      }\r\n    },\r\n    methods: {\r\n      addText() {\r\n        let file = new window.File(['foo'], 'foo.txt', {\r\n          type: \"text/plain\",\r\n        })\r\n        this.$refs.upload.add(file)\r\n      }\r\n    }\r\n  }\r\n  </script>\r\n  ```\r\n\r\n\r\n###  addInputFile()\r\n\r\nAdd the file selected by `<input type = \"file\">` to the upload list\r\n\r\n* **Arguments:**\r\n\r\n  * `el: HTMLInputElement`     File element\r\n\r\n\r\n* **Result:** `Array<File>`  Added list of files\r\n\r\n* **Version:** : `>=2.5.1`\r\n\r\n\r\n\r\n###  addDataTransfer()\r\n\r\nAdd files that are dragged or pasted into the upload list\r\n\r\n* **Arguments:**\r\n\r\n  * `dataTransfer: DataTransfer`  Drag or paste data\r\n\r\n\r\n* **Result:** `Promise<Array<File>>`   Added list of files\r\n\r\n\r\n* **Version:** : `>=2.5.1`\r\n\r\n\r\n\r\n### update()\r\n\r\nUpdate a file object\r\n\r\n* **Arguments:**\r\n\r\n  * `id: File | Object | String`\r\n  * `data: Object`                    Updated data object\r\n\r\n\r\n* **Result:**  `Object | Boolean`  Successfully returned `newFile` failed to return` false`\r\n\r\n\r\n* **Usage:**\r\n  ```html\r\n  <template>\r\n    <ul>\r\n      <li v-for=\"file in files\">\r\n        <span>{{file.name}}</span>\r\n        <button v-show=\"file.active\" type=\"button\" @click.prevent=\"abort(file)\">Abort</button>\r\n      </li>\r\n    </ul>\r\n    <file-upload v-model=\"files\"></file-upload>\r\n  </template>\r\n  <script>\r\n  export default {\r\n    data() {\r\n      return {\r\n        files: []\r\n      }\r\n    },\r\n    methods: {\r\n      abort(file) {\r\n        this.$refs.upload.update(file, {active: false})\r\n        // or\r\n        // this.$refs.upload.update(file, {error: 'abort'})\r\n      }\r\n    }\r\n  }\r\n  </script>\r\n  ```\r\n\r\n### remove()\r\n\r\nRemove a file object\r\n\r\n* **Arguments:**\r\n\r\n  * `id: File | Object | String`\r\n\r\n\r\n* **Result:**  `Object | Boolean`  Successfully returned `oldFile` failed to return` false`\r\n\r\n* **Usage:**\r\n  ```html\r\n  <template>\r\n    <ul>\r\n      <li v-for=\"file in files\">\r\n        <span>{{file.name}}</span>\r\n        <button type=\"button\" @click.prevent=\"remove(file)\">Remove</button>\r\n      </li>\r\n    </ul>\r\n    <file-upload v-model=\"files\"></file-upload>\r\n  </template>\r\n  <script>\r\n  export default {\r\n    data() {\r\n      return {\r\n        files: []\r\n      }\r\n    },\r\n    methods: {\r\n      remove(file) {\r\n        this.$refs.upload.remove(file)\r\n      }\r\n    }\r\n  }\r\n  </script>\r\n  ```\r\n\r\n### replace()\r\n  Replace the location of the two files\r\n\r\n* **Arguments:**\r\n\r\n  * `id1: File | Object | String`\r\n  * `id2: File | Object | String`\r\n\r\n\r\n* **Result:**  `Boolean`\r\n\r\n\r\n### clear()\r\n\r\nEmpty the file list\r\n\r\n* **Result:**  `Boolean`  Always return `true`\r\n\r\n\r\n\r\n## Instance / File\r\n\r\n\r\n\r\n> **File object in the `@input-filter` event outside the use of [`update`](#instance-methods-update) method**\r\n\r\n\r\n\r\n\r\n### fileObject\r\n\r\n* **Type:** `Boolean`\r\n\r\n* **Read only:** `true`\r\n\r\n* **Required:** `true`\r\n\r\n* **Default:** `true`\r\n\r\n* **Version:** : `>=2.6.0`\r\n\r\n* **Details:**\r\n\r\n  If the attribute does not exist, the object will not be processed internally\r\n  If the attribute does not exist, it is not `File` but `Object`\r\n\r\n\r\n\r\n\r\n### id\r\n\r\nFile ID\r\n\r\n* **Type:** `String | Number`\r\n\r\n* **Read only:** `false`\r\n\r\n* **Default:** `Math.random().toString(36).substr(2)`\r\n\r\n* **Details:**\r\n\r\n  >`id` can not be repeated\r\n  >Upload can not modify `id`\r\n\r\n\r\n### size\r\n\r\nFile size\r\n\r\n* **Type:** `Number`\r\n\r\n* **Read only:** `false`\r\n\r\n* **Default:** `-1`\r\n\r\n* **Browser:** `> IE9`\r\n\r\n\r\n### name\r\n\r\nFilename\r\n\r\n* **Type:** `String`\r\n\r\n* **Read only:** `false`\r\n\r\n* **Default:** ` `\r\n\r\n* **Details:**\r\n\r\n  Format:  `directory/filename.gif`  `filename.gif`\r\n\r\n\r\n\r\n### type\r\n\r\nMIME type\r\n\r\n* **Type:** `String`\r\n\r\n* **Read only:** `false`\r\n\r\n* **Default:** ` `\r\n\r\n* **Browser:** `> IE9`\r\n\r\n* **Details:**\r\n\r\n  Format:  `image/gif`   `image/png`  `text/html`\r\n\r\n\r\n\r\n\r\n### active\r\n\r\nActivation or abort upload\r\n\r\n* **Type:** `Boolean`\r\n\r\n* **Read only:** `false`\r\n\r\n* **Default:** `false`\r\n\r\n* **Details:**\r\n\r\n  `true` = Upload\r\n  `false` = Abort\r\n\r\n\r\n\r\n\r\n\r\n\r\n### error\r\n\r\nUpload failed error code\r\n\r\n* **Type:** `String`\r\n\r\n* **Read only:** `false`\r\n\r\n* **Default:** ` `\r\n\r\n* **Details:**\r\n\r\n  Built-in\r\n  `size`, `extension`, `timeout`, `abort`, `network`, `server`, `denied`\r\n\r\n\r\n\r\n\r\n### success\r\n\r\nWhether the upload was successful\r\n\r\n* **Type:** `Boolean`\r\n\r\n* **Read only:** `false`\r\n\r\n* **Default:** `false`\r\n\r\n\r\n### putAction\r\n\r\nCustomize the current file `PUT` URL\r\n\r\n* **Type:** `String`\r\n\r\n* **Read only:** `false`\r\n\r\n* **Default:** `this.putAction`\r\n\r\n\r\n\r\n### postAction\r\n\r\nCustomize the current file `POST` URL\r\n\r\n* **Type:** `String`\r\n\r\n* **Read only:** `false`\r\n\r\n* **Default:** `this.postAction`\r\n\r\n\r\n\r\n\r\n### headers\r\n\r\nCustomize the current file `HTTP` Header\r\n\r\n* **Type:** `Object`\r\n\r\n* **Read only:** `false`\r\n\r\n* **Default:** `this.headers`\r\n\r\n\r\n### data\r\n\r\nCustomize the current file `body` or` query` to attach content\r\n\r\n* **Type:** `Object`\r\n\r\n* **Read only:** `false`\r\n\r\n* **Default:** `this.data`\r\n\r\n\r\n### timeout\r\n\r\nCustomize the upload timeout for a current single file\r\n\r\n* **Type:** `Number`\r\n\r\n* **Read only:** `false`\r\n\r\n* **Default:** `this.timeout`\r\n\r\n\r\n### response\r\n\r\nResponse data\r\n\r\n* **Type:** `Object | String`\r\n\r\n* **Read only:** `false`\r\n\r\n* **Default:** `{}`\r\n\r\n\r\n\r\n\r\n### progress\r\n\r\nUpload progress\r\n\r\n* **Type:** `String`\r\n\r\n* **Read only:** `false`\r\n\r\n* **Default:** `0.00`\r\n\r\n* **Browser:** `> IE9`\r\n\r\n\r\n\r\n### speed\r\n\r\nPer second upload speed\r\n\r\n* **Type:** `Number`\r\n\r\n* **Read only:** `true`\r\n\r\n* **Default:** `0`\r\n\r\n* **Browser:** `> IE9`\r\n\r\n\r\n\r\n\r\n### xhr\r\n\r\n`HTML5` upload` XMLHttpRequest` object\r\n\r\n* **Type:** `XMLHttpRequest`\r\n\r\n* **Read only:** `true`\r\n\r\n* **Default:** `undefined`\r\n\r\n* **Browser:** `> IE9`\r\n\r\n\r\n\r\n\r\n### iframe\r\n\r\n`HTML4` upload` iframe` element\r\n\r\n* **Type:** `Element`\r\n\r\n* **Read only:** `true`\r\n\r\n* **Default:** `undefined`\r\n\r\n* **Browser:** `= IE9`\r\n"

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = "## 入门开始\r\n\r\n### NPM\r\n\r\n``` bash\r\nnpm install vue-upload-component --save\r\n```\r\n\r\n``` js\r\nconst VueUploadComponent = require('vue-upload-component')\r\nVue.component('file-upload', VueUploadComponent)\r\n```\r\n\r\n### Curated\r\n\r\n**No data**\r\n\r\n\r\n### 直接使用\r\n\r\n\r\nunpkg\r\n\r\n``` html\r\n<script src=\"https://unpkg.com/vue\"></script>\r\n<script src=\"https://unpkg.com/vue-upload-component\"></script>\r\n<script>\r\nVue.component('file-upload', VueUploadComponent)\r\n</script>\r\n```\r\n\r\njsDelivr\r\n\r\n``` html\r\n<script src=\"https://cdn.jsdelivr.net/npm/vue/dist/vue.js\"></script>\r\n<script src=\"https://cdn.jsdelivr.net/npm/vue-upload-component\"></script>\r\n<script>\r\nVue.component('file-upload', VueUploadComponent)\r\n</script>\r\n```\r\n\r\n\r\n### 简单的例子\r\n\r\n\r\n\r\n```html\r\n<!DOCTYPE html>\r\n<html>\r\n<head>\r\n  <meta charset=\"utf-8\">\r\n  <title>Vue-upload-component Test</title>\r\n  <script src=\"https://unpkg.com/vue\"></script>\r\n  <script src=\"https://unpkg.com/vue-upload-component\"></script>\r\n</head>\r\n<body>\r\n<div id=\"app\">\r\n  <ul>\r\n    <li v-for=\"file in files\">{{file.name}} - Error: {{file.error}}, Success: {{file.success}}</li>\r\n  </ul>\r\n  <file-upload\r\n    ref=\"upload\"\r\n    v-model=\"files\"\r\n    post-action=\"/post.method\"\r\n    put-action=\"/put.method\"\r\n    @input-file=\"inputFile\"\r\n    @input-filter=\"inputFilter\"\r\n  >\r\n  上传文件\r\n  </file-upload>\r\n  <button v-show=\"!$refs.upload || !$refs.upload.active\" @click.prevent=\"$refs.upload.active = true\" type=\"button\">开始上传</button>\r\n  <button v-show=\"$refs.upload && $refs.upload.active\" @click.prevent=\"$refs.upload.active = false\" type=\"button\">停止上传</button>\r\n</div>\r\n<script>\r\nnew Vue({\r\n  el: '#app',\r\n  data: function () {\r\n    return {\r\n      files: []\r\n    }\r\n  },\r\n  components: {\r\n    FileUpload: VueUploadComponent\r\n  },\r\n  methods: {\r\n    /**\r\n     * Has changed\r\n     * @param  Object|undefined   newFile   只读\r\n     * @param  Object|undefined   oldFile   只读\r\n     * @return undefined\r\n     */\r\n    inputFile: function (newFile, oldFile) {\r\n      if (newFile && oldFile && !newFile.active && oldFile.active) {\r\n        // 获得相应数据\r\n        console.log('response', newFile.response)\r\n        if (newFile.xhr) {\r\n          //  获得响应状态码\r\n          console.log('status', newFile.xhr.status)\r\n        }\r\n      }\r\n    },\r\n    /**\r\n     * Pretreatment\r\n     * @param  Object|undefined   newFile   读写\r\n     * @param  Object|undefined   oldFile   只读\r\n     * @param  Function           prevent   阻止回调\r\n     * @return undefined\r\n     */\r\n    inputFilter: function (newFile, oldFile, prevent) {\r\n      if (newFile && !oldFile) {\r\n        // 过滤不是图片后缀的文件\r\n        if (!/\\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {\r\n          return prevent()\r\n        }\r\n      }\r\n\r\n      // 创建 blob 字段 用于图片预览\r\n      newFile.blob = ''\r\n      let URL = window.URL || window.webkitURL\r\n      if (URL && URL.createObjectURL) {\r\n        newFile.blob = URL.createObjectURL(newFile.file)\r\n      }\r\n    }\r\n  }\r\n});\r\n</script>\r\n</body>\r\n</html>\r\n```\r\n\r\n\r\n\r\n### SSR (服务器同构)\r\n\r\n\r\n```html\r\n<template>\r\n  <file-upload v-model=\"files\" post-action=\"/\">Upload file</file-upload>\r\n</template>\r\n<style>\r\n/*\r\nimport '~vue-upload-component/dist/vue-upload-component.part.css'\r\n\r\n\r\n或\r\n\r\n\r\n */\r\n.file-uploads {\r\n  overflow: hidden;\r\n  position: relative;\r\n  text-align: center;\r\n  display: inline-block;\r\n}\r\n.file-uploads.file-uploads-html4 input[type=\"file\"] {\r\n  opacity: 0;\r\n  font-size: 20em;\r\n  z-index: 1;\r\n  top: 0;\r\n  left: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  position: absolute;\r\n  width: 100%;\r\n  height: 100%;\r\n}\r\n.file-uploads.file-uploads-html5 input[type=\"file\"] {\r\n  overflow: hidden;\r\n  position: fixed;\r\n  width: 1px;\r\n  height: 1px;\r\n  z-index: -1;\r\n  opacity: 0;\r\n}\r\n</style>\r\n<script>\r\nimport FileUpload from 'vue-upload-component/dist/vue-upload-component.part.js'\r\nexport default {\r\n  components: {\r\n    FileUpload,\r\n  },\r\n  data() {\r\n    return {\r\n      files: []\r\n    }\r\n  },\r\n}\r\n</script>\r\n```\r\n\r\n\r\n** 或者 **\r\n\r\n\r\n```js\r\nimport FileUpload from 'vue-upload-component/src'\r\n```\r\n\r\nwebpack.config.js\r\n\r\n```js\r\nconst nodeExternals = require('webpack-node-externals');\r\n{\r\n  //...\r\n  externals: [\r\n    nodeExternals({whitelist:[/^vue-upload-component\\/src/]})\r\n  ]\r\n  //...\r\n}\r\n```\r\n\r\n* [https://github.com/liady/webpack-node-externals](https://github.com/liady/webpack-node-externals)  \r\n\r\n* [**`vue-hackernews` 演示**](https://github.com/lian-yue/vue-hackernews-2.0/)  \r\n\r\n* [**浏览修改文件**](https://github.com/lian-yue/vue-hackernews-2.0/commit/bd6c58a30cc6b8ba6c0148e737b3ce9336b99cf8)\r\n\r\n\r\n\r\n\r\n## 选项 / 属性\r\n\r\n\r\n### input-id\r\n\r\ninput 标签的 `id` 属性\r\n\r\n* **类型:** `String`\r\n\r\n* **默认值:** `this.name`\r\n\r\n* **示例:**\r\n  ```html\r\n  <file-upload input-id=\"file2\"></file-upload>\r\n  <!--输出-->\r\n  <input id=\"file2\" />\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n### name\r\n\r\ninput标签的 `name` 属性\r\n\r\n* **类型:** `String`\r\n\r\n* **默认值:** `file`\r\n\r\n* **示例:**\r\n  ```html\r\n  <file-upload name=\"file\"></file-upload>\r\n  <!--输出-->\r\n  <input name=\"file\" />\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n### post-action\r\n\r\n`POST` 请求的上传URL\r\n\r\n* **类型:** `String`\r\n\r\n* **默认值:** `undefined`\r\n\r\n* **示例:**\r\n  ```html\r\n  <file-upload post-action=\"/upload/post.php\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n### put-action\r\n\r\n`PUT` 请求的上传URL\r\n\r\n* **类型:** `String`\r\n\r\n* **默认值:** `undefined`\r\n\r\n* **浏览器:** `> IE9`\r\n\r\n* **详细:**  \r\n\r\n  `put-action` 不为空请优先 `PUT` 请求  \r\n\r\n* **示例:**\r\n  ```html\r\n  <file-upload put-action=\"/upload/put.php\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n### custom-action\r\n\r\n自定义上传方法\r\n\r\n* **类型:** `async Function`\r\n\r\n* **默认值:** `undefined`\r\n\r\n* **详细:**  \r\n\r\n  `custom-action` 优先级高于 `put-action, post-action`\r\n\r\n* **示例:**\r\n  ```html\r\n  <file-upload :custom-action=\"customAction\"></file-upload>\r\n  ```\r\n  ```js\r\n  async function customAction(file, component) {\r\n    // return await component.uploadPut(file)\r\n    return await component.uploadHtml4(file)\r\n  }\r\n  ```\r\n\r\n\r\n\r\n### headers\r\n\r\n自定义上传请求 `header` 数据\r\n\r\n* **类型:** `Object`\r\n\r\n* **默认值:** `{}`\r\n\r\n* **浏览器:** `> IE9`\r\n\r\n* **示例:**\r\n  ```html\r\n  <file-upload :headers=\"{'X-Token-CSRF': 'code'}\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n### data\r\n\r\n`POST 请求`: 附加请求的 body  \r\n`PUT 请求`: 附加请求的 query  \r\n\r\n* **类型:** `Object`\r\n\r\n* **默认值:** `{}`\r\n\r\n* **示例:**\r\n  ```html\r\n  <file-upload :data=\"{access_token: 'access_token'}\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n\r\n### value, v-model\r\n\r\n文件列表\r\n\r\n* **类型:** `Array<File | Object>`\r\n\r\n* **默认值:** `[]`\r\n\r\n* **详细:**  \r\n\r\n  浏览 **[`File`](#file)** 详细信息  \r\n  > 为了防止不可预知的错误，不可直接修改 `files`，请使用 [`add`](#实例-方法-add), [`update`](#实例-方法-update), [`remove`](#实例-方法-remove) 方法修改\r\n\r\n* **示例:**\r\n  ```html\r\n  <file-upload :value=\"files\" @input=\"updatetValue\"></file-upload>\r\n  <!--或-->\r\n  <file-upload v-model=\"files\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n### accept\r\n\r\n表单的`accept`属性, MIME type  \r\n\r\n* **类型:** `String`\r\n\r\n* **默认值:** `undefined`\r\n\r\n* **浏览器:** `> IE9`\r\n\r\n* **示例:**\r\n  ```html\r\n  <file-upload accept=\"image/png,image/gif,image/jpeg,image/webp\"></file-upload>\r\n  <!--或-->\r\n  <file-upload accept=\"image/*\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n### multiple\r\n\r\n文件表单的 `multiple` 属性  \r\n是否允许选择多个文件  \r\n\r\n* **类型:** `Boolean`\r\n\r\n* **默认值:** `false`\r\n\r\n* **详细:**  \r\n\r\n  如果是 `false` `files` 里面最多只有一个文件 多的会自动删除  \r\n\r\n* **示例:**\r\n  ```html\r\n  <file-upload :multiple=\"true\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n### directory\r\n\r\n文件表单的 `directory` 属性  \r\n是否是上传文件夹  \r\n\r\n* **类型:** `Boolean`\r\n\r\n* **默认值:** `false`\r\n\r\n* **浏览器:** [http://caniuse.com/#feat=input-file-directory](http://caniuse.com/#feat=input-file-directory)\r\n\r\n* **示例:**\r\n  ```html\r\n  <file-upload :directory=\"true\" :multiple=\"true\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n### extensions\r\n\r\n允许上传的文件后缀\r\n\r\n* **类型:** `Array | String | RegExp`\r\n\r\n* **默认值:** `undefined`\r\n\r\n* **示例:**\r\n  ```html\r\n  <file-upload extensions=\"jpg,gif,png,webp\"></file-upload>\r\n  <!--或-->\r\n  <file-upload :extensions=\"['jpg', 'gif', 'png', 'webp']\"></file-upload>\r\n  <!--或-->\r\n  <file-upload :extensions=\"/\\.(gif|jpe?g|png|webp)$/i\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n\r\n### size\r\n\r\n允许上传的最大字节\r\n\r\n* **类型:** `Number`\r\n\r\n* **默认值:** `0`\r\n\r\n* **浏览器:** `> IE9`\r\n\r\n* **详细:**\r\n\r\n  `0` 等于不限制\r\n\r\n* **示例:**\r\n  ```html\r\n  <file-upload :size=\"1024 * 1024\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n\r\n### timeout\r\n\r\n上传超时时间毫秒\r\n\r\n* **类型:** `Number`\r\n\r\n* **默认值:** `0`\r\n\r\n* **浏览器:** `> IE9`\r\n\r\n* **示例:**\r\n  ```html\r\n  <file-upload :timeout=\"600 * 1000\"></file-upload>\r\n  ```\r\n\r\n\r\n### maximum\r\n\r\n列表最大文件数\r\n\r\n* **类型:** `Number`\r\n\r\n* **默认值:** `props.multiple ? 0 : 1`\r\n\r\n* **示例:**\r\n  ```html\r\n  <file-upload :maximum=\"10\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n\r\n### thread\r\n\r\n同时并发上传的文件数量 线程数  \r\n\r\n* **类型:** `Number`\r\n\r\n* **默认值:** `1`\r\n\r\n* **浏览器:** `> IE9`\r\n\r\n* **示例:**\r\n  ```html\r\n  <file-upload :thread=\"3\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n### drop\r\n\r\n拖拽上传  \r\n\r\n* **类型:** `Boolean | Element | CSS selector`\r\n\r\n* **默认值:** `false`\r\n\r\n* **浏览器:** [http://caniuse.com/#feat=dragndrop](http://caniuse.com/#feat=dragndrop)\r\n\r\n* **详细:**\r\n\r\n  如果设置成 `true` 则读取父组件作为容器  \r\n\r\n* **示例:**\r\n  ```html\r\n  <file-upload :drop=\"true\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n### drop-directory\r\n\r\n是否开启拖拽目录  \r\n\r\n* **类型:** `Boolean`\r\n\r\n* **默认值:** `true`\r\n\r\n* **详细:**\r\n\r\n  如果设置成 `false` 则过滤掉目录\r\n\r\n* **示例:**\r\n  ```html\r\n  <file-upload :drop-directory=\"false\"></file-upload>\r\n  ```\r\n\r\n\r\n### add-index\r\n\r\n* **类型:** `Boolean, Number`\r\n\r\n* **默认值:** `undefined`\r\n\r\n* **版本:** `>= 2.6.1`\r\n\r\n* **详细:**\r\n\r\n  [`add()`](#实例-方法-add) 方法 `index` 参数的默认值\r\n\r\n* **示例:**\r\n  ```html\r\n  <file-upload :add-index=\"true\"></file-upload>\r\n  ```\r\n\r\n\r\n\r\n## 选项 / 事件\r\n\r\n文件被改变触发的方法  \r\n默认用于`v-model`绑定\r\n\r\n### @input\r\n* **参数:**\r\n\r\n  * `files: Array<File | Object>`\r\n\r\n\r\n* **示例:**\r\n  ```html\r\n  <template>\r\n    <file-upload :value=\"files\" @input=\"updatetValue\"></file-upload>\r\n    <!--或者-->\r\n    <file-upload v-model=\"files\"></file-upload>\r\n  </template>\r\n  <script>\r\n  export default {\r\n    data() {\r\n      return {\r\n        files: []\r\n      }\r\n    },\r\n    methods: {\r\n      updatetValue(value) {\r\n        this.files = value\r\n      }\r\n    }\r\n  }\r\n  </script>\r\n  ```\r\n\r\n\r\n\r\n### @input-filter\r\n\r\nAdd, update, remove pre-filter  \r\n\r\n* **参数:**\r\n\r\n  * `newFile: File | Object | undefined`  `读写`\r\n  * `oldFile: File | Object | undefined`  `只读`\r\n  * `prevent: Function`   调用该方法 阻止修改\r\n\r\n\r\n* **详细:**\r\n\r\n  如果 `newFile` 值为 `undefined` 则是删除  \r\n  如果 `oldFile` 值为 `undefined` 则是添加  \r\n  如果 `newFile`, `oldFile` 都存在则是更新\r\n\r\n  > 事件内同步处理请直接修改 `newFile`  \r\n  > 事件内异步处理请使用 `update`, `add`, `remove`, `clear` 方法  \r\n  > 异步请先设置一个错误以防止被上传\r\n\r\n  > 同步不能使用 `update`, `add`, `remove`, `clear` 方法  \r\n  > 异步不能修改 `newFile`\r\n\r\n\r\n* **示例:**  \r\n  ```html\r\n  <template>\r\n    <ul>\r\n      <li v-for=\"file in files\">\r\n        <img :src=\"file.blob\" width=\"50\" height=\"50\" />\r\n      </li>\r\n    </ul>\r\n    <file-upload :value=\"files\" @input-filter=\"inputFilter\"></file-upload>\r\n  </template>\r\n  <script>\r\n  export default {\r\n    data() {\r\n      return {\r\n        files: []\r\n      }\r\n    },\r\n    methods: {\r\n      inputFilter(newFile, oldFile, prevent) {\r\n        if (newFile && !oldFile) {\r\n          // 添加文件\r\n\r\n          // 过滤非图片文件\r\n          // 不会添加到 files 去\r\n          if (!/\\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {\r\n            return prevent()\r\n          }\r\n\r\n          // 创建 `blob` 字段 用于缩略图预览\r\n          newFile.blob = ''\r\n          let URL = window.URL || window.webkitURL\r\n          if (URL && URL.createObjectURL) {\r\n            newFile.blob = URL.createObjectURL(newFile.file)\r\n          }\r\n        }\r\n\r\n        if (newFile && oldFile) {\r\n          // 更新文件\r\n\r\n          // 增加版本号\r\n          if (!newFile.version) {\r\n            newFile.version = 0\r\n          }\r\n          newFile.version++\r\n        }\r\n\r\n        if (!newFile && oldFile) {\r\n          // 移除文件\r\n\r\n          // 拒绝删除文件\r\n          // return prevent()\r\n        }\r\n      }\r\n    }\r\n  }\r\n  </script>\r\n  ```\r\n\r\n### @input-file\r\n\r\n添加，更新，移除 后\r\n\r\n* **参数:**\r\n\r\n  * `newFile: File | Object | undefined` `只读`\r\n  * `oldFile: File | Object | undefined` `只读`\r\n\r\n\r\n* **详细:**\r\n\r\n  如果 `newFile` 值为 `undefined` 则是删除  \r\n  如果 `oldFile` 值为 `undefined` 则是添加  \r\n  如果 `newFile`, `oldFile` 都存在则是更新\r\n\r\n  >事件内可使用 `update`, `add`, `remove`, `clear` 方法  \r\n  >事件内不可修改 `newFile` 对象  \r\n  >事件内不可修改 `oldFile` 对象\r\n\r\n* **示例:**\r\n  ```html\r\n  <template>\r\n    <file-upload ref=\"upload\" v-model=\"files\" @input-file=\"inputFile\"></file-upload>\r\n  </template>\r\n  <script>\r\n  export default {\r\n    data() {\r\n      return {\r\n        files: []\r\n      }\r\n    },\r\n    methods: {\r\n      inputFile(newFile, oldFile) {\r\n        if (newFile && !oldFile) {\r\n          // 添加文件\r\n        }\r\n\r\n        if (newFile && oldFile) {\r\n          // 更新文件\r\n\r\n          // 开始上传\r\n          if (newFile.active !== oldFile.active) {\r\n            console.log('Start upload', newFile.active, newFile)\r\n\r\n            // 限定最小字节\r\n            if (newFile.size >= 0 && newFile.size < 100 * 1024) {\r\n              newFile = this.$refs.upload.update(newFile, {error: 'size'})\r\n            }\r\n          }\r\n\r\n          // 上传进度\r\n          if (newFile.progress !== oldFile.progress) {\r\n            console.log('progress', newFile.progress, newFile)\r\n          }\r\n\r\n          // 上传错误\r\n          if (newFile.error !== oldFile.error) {\r\n            console.log('error', newFile.error, newFile)\r\n          }\r\n\r\n          // 上传成功\r\n          if (newFile.success !== oldFile.success) {\r\n            console.log('success', newFile.success, newFile)\r\n          }\r\n        }\r\n\r\n        if (!newFile && oldFile) {\r\n          // 删除文件\r\n\r\n          // 自动删除 服务器上的文件\r\n          if (oldFile.success && oldFile.response.id) {\r\n            // $.ajax({\r\n            //   type: 'DELETE',\r\n            //   url: '/file/delete?id=' + oldFile.response.id,\r\n            // });\r\n          }\r\n        }\r\n\r\n        // 自动上传\r\n        if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {\r\n          if (!this.$refs.upload.active) {\r\n            this.$refs.upload.active = true\r\n          }\r\n        }\r\n      }\r\n    }\r\n  }\r\n  </script>\r\n  ```\r\n\r\n\r\n\r\n## 实例 / 数据\r\n\r\n### features\r\n\r\n用于判断浏览器支持的特性\r\n\r\n* **类型:** `Object`\r\n\r\n* **只读:** `true`\r\n\r\n* **默认值:** `{ html5: true, directory: false, drag: false }`\r\n\r\n* **示例:**\r\n  ```html\r\n  <app>\r\n    <file-upload ref=\"upload\"></file-upload>\r\n    <span v-show=\"$refs.upload && $refs.upload.features.drag\">支持拖拽上传</span>\r\n    <span v-show=\"$refs.upload && $refs.upload.features.directory\">支持文件夹上传</span>\r\n    <span v-show=\"$refs.upload && $refs.upload.features.html5\">支持HTML5</span>\r\n  </app>\r\n  ```\r\n\r\n\r\n\r\n### active\r\n\r\n激活或停止上传\r\n\r\n* **类型:** `Boolean`\r\n\r\n* **只读:** `false`\r\n\r\n* **默认值:** `false`\r\n\r\n* **示例:**\r\n  ```html\r\n  <app>\r\n    <file-upload ref=\"upload\"></file-upload>\r\n    <span v-if=\"!$refs.upload || !$refs.upload.active\" @click=\"$refs.upload.active = true\">开始上传</span>\r\n    <span v-else @click=\"$refs.upload.active = false\">停止上传</span>\r\n  </app>\r\n  ```\r\n\r\n\r\n\r\n### dropActive\r\n\r\n是否正在拖拽\r\n\r\n* **类型:** `Boolean`\r\n\r\n* **只读:** `true`\r\n\r\n* **默认值:** `false`\r\n\r\n* **示例:**\r\n  ```html\r\n  <app>\r\n    <file-upload ref=\"upload\" :drop=\"true\"></file-upload>\r\n    <span v-show=\"$refs.upload && $refs.upload.dropActive\">拖拽到这里上传</span>\r\n  </app>\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n### uploaded\r\n\r\n是否全部已上传\r\n\r\n* **类型:** `Boolean`\r\n\r\n* **只读:** `true`\r\n\r\n* **默认值:** `true`\r\n\r\n* **示例:**\r\n  ```html\r\n  <app>\r\n    <file-upload ref=\"upload\"></file-upload>\r\n    <span v-show=\"$refs.upload && $refs.upload.uploaded\">全部文件已上传完毕</span>\r\n  </app>\r\n  ```\r\n\r\n\r\n\r\n\r\n\r\n## 实例 / 方法\r\n\r\n\r\n\r\n### get()\r\n\r\n使用`id`获得某个对象\r\n\r\n* **参数:**\r\n\r\n  * `id: File | Object | String`\r\n\r\n\r\n* **结果:** `File | Object | Boolean` 存在返回文件对象否则返回 `false`\r\n\r\n\r\n\r\n### add()\r\n\r\n添加一个或多个文件\r\n\r\n* **参数:**\r\n\r\n  * `files: Array<File | window.File | Object> | File | window.File | Object`     如果它是一个数组的响应将是一个数组\r\n  * `index: Number | Boolean` = [`props.add-index`](#选项-属性-add-index)   `true = ` 开始位置, `false = ` 结束位置, `Number = ` 下标位置\r\n\r\n\r\n* **结果:** `Object | Array<File | Object> | Boolean`     传入的是数组返回数组否则对象或`false`\r\n\r\n* **示例:**\r\n  ```html\r\n  <template>\r\n    <ul>\r\n      <li v-for=\"file in files\">\r\n        <span>{{file.name}}</span>\r\n      </li>\r\n    </ul>\r\n    <file-upload v-model=\"files\"></file-upload>\r\n    <button type=\"button\" @click.prevent=\"addText\">添加文件</button>\r\n  </template>\r\n  <script>\r\n  export default {\r\n    data() {\r\n      return {\r\n        files: []\r\n      }\r\n    },\r\n    methods: {\r\n      addText() {\r\n        let file = new window.File(['foo'], 'foo.txt', {\r\n          type: \"text/plain\",\r\n        })\r\n        this.$refs.upload.add(file)\r\n      }\r\n    }\r\n  }\r\n  </script>\r\n  ```\r\n\r\n\r\n###  addInputFile()\r\n\r\n把`<input type=\"file\">`选择的文件添加进上传列表  \r\n\r\n* **参数:**\r\n\r\n  * `el: HTMLInputElement`     文件元素\r\n\r\n\r\n* **结果:** `Array<File>`  返回已添加的文件列表\r\n\r\n* **版本:** : `>=2.5.1`\r\n\r\n\r\n\r\n###  addDataTransfer()\r\n\r\n把拖拽或者粘贴的数据的文件添加进上传列表  \r\n\r\n* **参数:**\r\n\r\n  * `dataTransfer: DataTransfer`  拖拽或者粘贴的数据\r\n\r\n\r\n* **结果:** `Promise<Array<File>>`   返回已添加的文件列表\r\n\r\n\r\n* **版本:** : `>=2.5.1`\r\n\r\n\r\n\r\n### update()\r\n\r\n更新某个对象\r\n\r\n* **参数:**\r\n\r\n  * `id: File | Object | String`\r\n  * `data: Object`                    更新的数据对象\r\n\r\n\r\n* **结果:**  `Object | Boolean`  成功返回 `newFile` 失败返回 `false`\r\n\r\n\r\n* **示例:**\r\n  ```html\r\n  <template>\r\n    <ul>\r\n      <li v-for=\"file in files\">\r\n        <span>{{file.name}}</span>\r\n        <button v-show=\"file.active\" type=\"button\" @click.prevent=\"abort(file)\">停止</button>\r\n      </li>\r\n    </ul>\r\n    <file-upload v-model=\"files\"></file-upload>\r\n  </template>\r\n  <script>\r\n  export default {\r\n    data() {\r\n      return {\r\n        files: []\r\n      }\r\n    },\r\n    methods: {\r\n      abort(file) {\r\n        this.$refs.upload.update(file, {active: false})\r\n        // 或\r\n        // this.$refs.upload.update(file, {error: 'abort'})\r\n      }\r\n    }\r\n  }\r\n  </script>\r\n  ```\r\n\r\n### remove()\r\n\r\n移除某个文件对象\r\n\r\n* **参数:**\r\n\r\n  * `id: File | Object | String`\r\n\r\n\r\n* **结果:**  `Object | Boolean`  成功返回 `oldFile` 失败返回 `false`\r\n\r\n* **示例:**\r\n  ```html\r\n  <template>\r\n    <ul>\r\n      <li v-for=\"file in files\">\r\n        <span>{{file.name}}</span>\r\n        <button type=\"button\" @click.prevent=\"remove(file)\">移除</button>\r\n      </li>\r\n    </ul>\r\n    <file-upload v-model=\"files\"></file-upload>\r\n  </template>\r\n  <script>\r\n  export default {\r\n    data() {\r\n      return {\r\n        files: []\r\n      }\r\n    },\r\n    methods: {\r\n      remove(file) {\r\n        this.$refs.upload.remove(file)\r\n      }\r\n    }\r\n  }\r\n  </script>\r\n  ```\r\n\r\n\r\n### replace()\r\n  替换两个文件的位置\r\n\r\n* **参数:**\r\n\r\n  * `id1: File | Object | String`\r\n  * `id2: File | Object | String`\r\n\r\n\r\n* **结果:**  `Boolean`\r\n\r\n\r\n\r\n### clear()\r\n\r\n清空文件列表\r\n\r\n* **结果:**  `Boolean`  总是返回 `true`\r\n\r\n\r\n\r\n## 实例 / File\r\n\r\n\r\n> **文件对象在`input-filter`事件外修改请使用 [`update`](#实例-方法-update) 方法**\r\n\r\n\r\n### fileObject\r\n\r\n* **类型:** `Boolean`\r\n\r\n* **只读:** `true`\r\n\r\n* **Required:** `true`\r\n\r\n* **默认值:** `true`\r\n\r\n* **版本:** : `>=2.6.0`\r\n\r\n* **详细:**\r\n\r\n  如果属性不存在，则不会在内部处理该对象  \r\n  如果属性不存在，它不是 `File` 而是 `Object`\r\n\r\n\r\n\r\n### id\r\n\r\n文件id\r\n\r\n* **类型:** `String | Number`\r\n\r\n* **只读:** `false`\r\n\r\n* **默认值:** `Math.random().toString(36).substr(2)`\r\n\r\n* **详细:**\r\n\r\n  >`id` can not be repeated  \r\n  >Upload can not modify `id`\r\n\r\n\r\n### size\r\n\r\n文件大小\r\n\r\n* **类型:** `Number`\r\n\r\n* **只读:** `false`\r\n\r\n* **默认值:** `-1`\r\n\r\n* **浏览器:** `> IE9`\r\n\r\n\r\n### name\r\n\r\n文件名  \r\n\r\n* **类型:** `String`\r\n\r\n* **只读:** `false`\r\n\r\n* **默认值:** ` `\r\n\r\n* **详细:**\r\n\r\n  格式:  `directory/filename.gif`  `filename.gif`  \r\n\r\n\r\n\r\n### type\r\n\r\nMIME类型\r\n\r\n* **类型:** `String`\r\n\r\n* **只读:** `false`\r\n\r\n* **默认值:** ` `\r\n\r\n* **浏览器:** `> IE9`\r\n\r\n* **详细:**\r\n\r\n  格式:  `image/gif`   `image/png`  `text/html`\r\n\r\n\r\n\r\n\r\n### active\r\n\r\n激活或终止上传\r\n\r\n* **类型:** `Boolean`\r\n\r\n* **只读:** `false`\r\n\r\n* **默认值:** `false`\r\n\r\n* **详细:**\r\n\r\n  `true` = 上传  \r\n  `false` = 停止  \r\n\r\n\r\n\r\n\r\n\r\n\r\n### error\r\n\r\n上传失败错误代码\r\n\r\n* **类型:** `String`\r\n\r\n* **只读:** `false`\r\n\r\n* **默认值:** ` `\r\n\r\n* **详细:**\r\n\r\n  内置\r\n  `size`, `extension`, `timeout`, `abort`, `network`, `server`, `denied`\r\n\r\n\r\n\r\n\r\n### success\r\n\r\n是否上传成功\r\n\r\n* **类型:** `Boolean`\r\n\r\n* **只读:** `false`\r\n\r\n* **默认值:** `false`\r\n\r\n\r\n### putAction\r\n\r\n自定义当前文件 `PUT` 地址\r\n\r\n* **类型:** `String`\r\n\r\n* **只读:** `false`\r\n\r\n* **默认值:** `this.putAction`\r\n\r\n\r\n\r\n### postAction\r\n\r\n自定义当前文件 `POST` 地址\r\n\r\n* **类型:** `String`\r\n\r\n* **只读:** `false`\r\n\r\n* **默认值:** `this.postAction`\r\n\r\n\r\n\r\n\r\n### headers\r\n\r\n自定义当前文件 `HTTP` Header\r\n\r\n* **类型:** `Object`\r\n\r\n* **只读:** `false`\r\n\r\n* **默认值:** `this.headers`\r\n\r\n\r\n### data\r\n\r\n自定义当前文件 `body` 或 `query` 附加内容\r\n\r\n* **类型:** `Object`\r\n\r\n* **只读:** `false`\r\n\r\n* **默认值:** `this.data`\r\n\r\n\r\n### timeout\r\n\r\n自定义当前单个文件的上传超时时间\r\n\r\n* **类型:** `Number`\r\n\r\n* **只读:** `false`\r\n\r\n* **默认值:** `this.timeout`\r\n\r\n\r\n### response\r\n\r\n响应的数据\r\n\r\n* **类型:** `Object | String`\r\n\r\n* **只读:** `false`\r\n\r\n* **默认值:** `{}`\r\n\r\n\r\n\r\n\r\n### progress\r\n\r\n上传进度\r\n\r\n* **类型:** `String`\r\n\r\n* **只读:** `false`\r\n\r\n* **默认值:** `0.00`\r\n\r\n* **浏览器:** `> IE9`\r\n\r\n\r\n\r\n### speed\r\n\r\n每秒的上传速度\r\n\r\n* **类型:** `Number`\r\n\r\n* **只读:** `true`\r\n\r\n* **默认值:** `0`\r\n\r\n* **浏览器:** `> IE9`\r\n\r\n\r\n\r\n\r\n### xhr\r\n\r\n`HTML5` 上传 `XMLHttpRequest` 对象\r\n\r\n* **类型:** `XMLHttpRequest`\r\n\r\n* **只读:** `true`\r\n\r\n* **默认值:** `undefined`\r\n\r\n* **浏览器:** `> IE9`\r\n\r\n\r\n\r\n\r\n### iframe\r\n\r\n`HTML4` 上传 `iframe` 元素\r\n\r\n* **类型:** `Element`\r\n\r\n* **只读:** `true`\r\n\r\n* **默认值:** `undefined`\r\n\r\n* **浏览器:** `= IE9`\r\n"

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_cropperjs__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_cropperjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_cropperjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__xkeshi_image_compressor__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__xkeshi_image_compressor___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__xkeshi_image_compressor__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue_upload_component__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue_upload_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_vue_upload_component__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
  components: {
    FileUpload: __WEBPACK_IMPORTED_MODULE_2_vue_upload_component___default.a
  },

  data: function data() {
    return {
      files: [],
      accept: 'image/png,image/gif,image/jpeg,image/webp',
      extensions: 'gif,jpg,jpeg,png,webp',
      // extensions: ['gif', 'jpg', 'jpeg','png', 'webp'],
      // extensions: /\.(gif|jpe?g|png|webp)$/i,
      minSize: 1024,
      size: 1024 * 1024 * 10,
      multiple: true,
      directory: false,
      drop: true,
      dropDirectory: true,
      addIndex: false,
      thread: 3,
      name: 'file',
      postAction: '/upload/post',
      putAction: '/upload/put',
      headers: {
        'X-Csrf-Token': 'xxxx'
      },
      data: {
        '_csrf_token': 'xxxxxx'
      },

      autoCompress: 1024 * 1024,
      uploadAuto: false,
      isOption: false,

      addData: {
        show: false,
        name: '',
        type: '',
        content: ''
      },

      editFile: {
        show: false,
        name: ''
      }
    };
  },


  watch: {
    'editFile.show': function editFileShow(newValue, oldValue) {
      // 关闭了 自动删除 error
      if (!newValue && oldValue) {
        this.$refs.upload.update(this.editFile.id, { error: this.editFile.error || '' });
      }

      if (newValue) {
        this.$nextTick(function () {
          if (!this.$refs.editImage) {
            return;
          }
          var cropper = new __WEBPACK_IMPORTED_MODULE_0_cropperjs___default.a(this.$refs.editImage, {
            autoCrop: false
          });
          this.editFile = babelHelpers.extends({}, this.editFile, {
            cropper: cropper
          });
        });
      }
    },
    'addData.show': function addDataShow(show) {
      if (show) {
        this.addData.name = '';
        this.addData.type = '';
        this.addData.content = '';
      }
    }
  },

  methods: {
    inputFilter: function inputFilter(newFile, oldFile, prevent) {
      var _this = this;

      if (newFile && !oldFile) {
        // Before adding a file
        // 添加文件前

        // Filter system files or hide files
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent();
        }

        // Filter php html js file
        // 过滤 php html js 文件
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent();
        }

        // Automatic compression
        // 自动压缩
        if (newFile.file && newFile.type.substr(0, 6) === 'image/' && this.autoCompress > 0 && this.autoCompress < newFile.size) {
          newFile.error = 'compressing';
          var imageCompressor = new __WEBPACK_IMPORTED_MODULE_1__xkeshi_image_compressor___default.a(null, {
            convertSize: Infinity,
            maxWidth: 512,
            maxHeight: 512
          });
          imageCompressor.compress(newFile.file).then(function (file) {
            _this.$refs.upload.update(newFile, { error: '', file: file, size: file.size, type: file.type });
          }).catch(function (err) {
            _this.$refs.upload.update(newFile, { error: err.message || 'compress' });
          });
        }
      }

      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {

        // Create a blob field
        // 创建 blob 字段
        newFile.blob = '';
        var URL = window.URL || window.webkitURL;
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file);
        }

        // Thumbnails
        // 缩略图
        newFile.thumb = '';
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumb = newFile.blob;
        }
      }
    },


    // add, update, remove File Event
    inputFile: function inputFile(newFile, oldFile) {
      if (newFile && oldFile) {
        // update

        if (newFile.active && !oldFile.active) {
          // beforeSend

          // min size
          if (newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize) {
            this.$refs.upload.update(newFile, { error: 'size' });
          }
        }

        if (newFile.progress !== oldFile.progress) {
          // progress
        }

        if (newFile.error && !oldFile.error) {
          // error
        }

        if (newFile.success && !oldFile.success) {
          // success
        }
      }

      if (!newFile && oldFile) {
        // remove
        if (oldFile.success && oldFile.response.id) {
          // $.ajax({
          //   type: 'DELETE',
          //   url: '/upload/delete?id=' + oldFile.response.id,
          // })
        }
      }

      // Automatically activate upload
      if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
        if (this.uploadAuto && !this.$refs.upload.active) {
          this.$refs.upload.active = true;
        }
      }
    },
    alert: function (_alert) {
      function alert(_x) {
        return _alert.apply(this, arguments);
      }

      alert.toString = function () {
        return _alert.toString();
      };

      return alert;
    }(function (message) {
      alert(message);
    }),
    onEditFileShow: function onEditFileShow(file) {
      this.editFile = babelHelpers.extends({}, file, { show: true });
      this.$refs.upload.update(file, { error: 'edit' });
    },
    onEditorFile: function onEditorFile() {
      if (!this.$refs.upload.features.html5) {
        this.alert('Your browser does not support');
        this.editFile.show = false;
        return;
      }

      var data = {
        name: this.editFile.name
      };
      if (this.editFile.cropper) {
        var binStr = atob(this.editFile.cropper.getCroppedCanvas().toDataURL(this.editFile.type).split(',')[1]);
        var arr = new Uint8Array(binStr.length);
        for (var i = 0; i < binStr.length; i++) {
          arr[i] = binStr.charCodeAt(i);
        }
        data.file = new File([arr], data.name, { type: this.editFile.type });
        data.size = data.file.size;
      }
      this.$refs.upload.update(this.editFile.id, data);
      this.editFile.error = '';
      this.editFile.show = false;
    },


    // add folader
    onAddFolader: function onAddFolader() {
      var _this2 = this;

      if (!this.$refs.upload.features.directory) {
        this.alert('Your browser does not support');
        return;
      }

      var input = this.$refs.upload.$el.querySelector('input');
      input.directory = true;
      input.webkitdirectory = true;
      this.directory = true;

      input.onclick = null;
      input.click();
      input.onclick = function (e) {
        _this2.directory = false;
        input.directory = false;
        input.webkitdirectory = false;
      };
    },
    onAddData: function onAddData() {
      this.addData.show = false;
      if (!this.$refs.upload.features.html5) {
        this.alert('Your browser does not support');
        return;
      }

      var file = new window.File([this.addData.content], this.addData.name, {
        type: this.addData.type
      });
      this.$refs.upload.add(file);
    }
  }
});

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = Cropper;

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__InputFile_vue__ = __webpack_require__(46);
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'file-upload',

  components: {
    InputFile: __WEBPACK_IMPORTED_MODULE_0__InputFile_vue__["a" /* default */]
  },

  props: {
    inputId: {
      type: String
    },

    name: {
      type: String,
      default: 'file'
    },

    accept: {
      type: String
    },

    multiple: {
      type: Boolean
    },

    maximum: {
      type: Number,
      default: function _default() {
        return this.multiple ? 0 : 1;
      }
    },

    addIndex: {
      type: [Boolean, Number]
    },

    directory: {
      type: Boolean
    },

    postAction: {
      type: String
    },

    headers: {
      type: Object,
      default: Object
    },

    data: {
      type: Object,
      default: Object
    },

    timeout: {
      type: Number,
      default: 0
    },

    drop: {
      default: false
    },

    dropDirectory: {
      type: Boolean,
      default: true
    },

    size: {
      type: Number,
      default: 0
    },

    extensions: {
      default: Array
    },

    value: {
      type: Array,
      default: Array
    },

    thread: {
      type: Number,
      default: 1
    }
  },

  data: function data() {
    return {
      files: this.value,
      features: {
        html5: true,
        directory: false,
        drag: false
      },

      active: false,
      dropActive: false,

      uploading: 0,

      destroy: false
    };
  },
  mounted: function mounted() {
    var input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;

    // html5
    if (window.FormData && input.files) {
      if (typeof input.webkitdirectory === 'boolean' || typeof input.directory === 'boolean') {
        this.features.directory = true;
      }

      if (this.features.html5 && typeof input.ondrop !== 'undefined') {
        this.features.drop = true;
      }
    } else {
      this.features.html5 = false;
    }

    // files
    this.maps = {};

    this.$nextTick(function () {
      if (this.$parent) {
        this.$parent.$forceUpdate();
      }

      this.watchDrop(this.drop);
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.destroy = true;
    this.active = false;
  },


  computed: {
    uploaded: function uploaded() {
      var file = void 0;
      for (var i = 0; i < this.files.length; i++) {
        file = this.files[i];
        if (file.fileObject && !file.error && !file.success) {
          return false;
        }
      }
      return true;
    },
    className: function className() {
      return [];
    }
  },

  watch: {
    active: function active(_active) {
      this.watchActive(_active);
    },
    dropActive: function dropActive() {
      if (this.$parent) {
        this.$parent.$forceUpdate();
      }
    },
    drop: function drop(value) {
      this.watchDrop(value);
    },
    value: function value(files) {
      if (this.files === files) {
        return;
      }
      this.files = files;

      var oldMaps = this.maps;

      // Maps
      this.maps = {};
      for (var i = 0; i < this.files.length; i++) {
        var file = this.files[i];
        this.maps[file.id] = file;
      }

      // add, update
      for (var key in this.maps) {
        var newFile = this.maps[key];
        var oldFile = oldMaps[key];
        if (newFile !== oldFile) {
          this.emitFile(newFile, oldFile);
        }
      }

      // Delete
      for (var _key in oldMaps) {
        if (!this.maps[_key]) {
          this.emitFile(undefined, oldMaps[_key]);
        }
      }
    }
  },

  methods: {

    // Clear - Empty the file list
    clear: function clear() {
      if (this.files.length) {
        var files = this.files;
        this.files = [];

        this.maps = {};

        this.emitInput();
        for (var i = 0; i < files.length; i++) {
          this.emitFile(undefined, files[i]);
        }
      }
      return true;
    },


    // Get - Get file by Id
    get: function get(id) {
      if (!id) {
        return false;
      }

      if ((typeof id === 'undefined' ? 'undefined' : babelHelpers.typeof(id)) === 'object') {
        return this.maps[id.id] || false;
      }

      return this.maps[id] || false;
    },


    // Add file - Generate new Id if not provided
    add: function add(_files) {
      var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.addIndex;

      var files = _files;
      var isArray = files instanceof Array;

      if (!isArray) {
        files = [files];
      }

      var addFiles = [];
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (this.features.html5 && file instanceof Blob) {
          file = {
            file: file,
            size: file.size,
            name: file.webkitRelativePath || file.relativePath || file.name || 'unknown',
            type: file.type
          };
        }
        var fileObject = false;
        if (file.fileObject === false) {
          // false
        } else if (file.fileObject) {
          fileObject = true;
        } else if (typeof Element !== 'undefined' && file.el instanceof Element) {
          fileObject = true;
        } else if (typeof Blob !== 'undefined' && file.file instanceof Blob) {
          fileObject = true;
        }
        if (fileObject) {
          file = Object.assign({
            fileObject: true,
            size: -1,
            name: 'Filename',
            type: '',
            active: false,
            error: '',
            success: false,
            putAction: this.putAction,
            postAction: this.postAction,
            timeout: this.timeout
          }, file, {
            response: {},

            progress: '0.00',
            speed: 0
          });

          file.data = Object.assign({}, this.data, file.data ? file.data : {});

          file.headers = Object.assign({}, this.headers, file.headers ? file.headers : {});
        }

        if (!file.id) {
          file.id = Math.random().toString(36).substr(2);
        }

        if (this.emitFilter(file, undefined)) {
          continue;
        }

        if (this.maximum > 1 && addFiles.length + this.files.length >= this.maximum) {
          break;
        }

        addFiles.push(file);

        if (this.maximum === 1) {
          break;
        }
      }

      if (!addFiles.length) {
        return false;
      }

      if (this.maximum === 1) {
        this.clear();
      }

      var newFiles = void 0;
      if (index === true || index === 0) {
        newFiles = addFiles.concat(this.files);
      } else if (index) {
        newFiles = addFiles.concat([]);
        newFiles.splice(index, 0, addFiles);
      } else {
        newFiles = this.files.concat(addFiles);
      }

      this.files = newFiles;

      for (var _i = 0; _i < addFiles.length; _i++) {
        var _file2 = addFiles[_i];
        this.maps[_file2.id] = _file2;
      }

      this.emitInput();
      for (var _i2 = 0; _i2 < addFiles.length; _i2++) {
        this.emitFile(addFiles[_i2], undefined);
      }

      return isArray ? addFiles : addFiles[0];
    },


    // InputFile - Add the file selected by <input type = "file"> to the upload list
    addInputFile: function addInputFile(el) {
      var files = [];
      if (el.files) {
        for (var i = 0; i < el.files.length; i++) {
          var file = el.files[i];
          files.push({
            size: file.size,
            name: file.webkitRelativePath || file.relativePath || file.name,
            type: file.type,
            file: file,
            el: el
          });
        }
      } else {
        files.push({
          name: el.value.replace(/^.*?([^\/\\\r\n]+)$/, '$1'),
          el: el
        });
      }
      return this.add(files);
    },


    // DataTransfer - Add files that are dragged or pasted into the upload list
    addDataTransfer: function addDataTransfer(dataTransfer) {
      var _this = this;

      var files = [];
      if (dataTransfer.items && dataTransfer.items.length) {
        var items = [];
        for (var i = 0; i < dataTransfer.items.length; i++) {
          var item = dataTransfer.items[i];
          if (item.getAsEntry) {
            item = item.getAsEntry() || item.getAsFile();
          } else if (item.webkitGetAsEntry) {
            item = item.webkitGetAsEntry() || item.getAsFile();
          } else {
            item = item.getAsFile();
          }
          if (item) {
            items.push(item);
          }
        }

        return new Promise(function (resolve, reject) {
          var forEach = function forEach(i) {
            var item = items[i];
            if (!item || _this.maximum > 0 && files.length >= _this.maximum) {
              return resolve(_this.add(files));
            }
            _this.getEntry(item).then(function (results) {
              files.push.apply(files, results);
              forEach(i + 1);
            });
          };
          forEach(0);
        });
      }

      if (dataTransfer.files.length) {
        for (var _i3 = 0; _i3 < dataTransfer.files.length; _i3++) {
          files.push(dataTransfer.files[_i3]);
          if (this.maximum > 0 && files.length >= this.maximum) {
            break;
          }
        }
        return Promise.resolve(this.add(files));
      }

      return Promise.resolve([]);
    },
    getEntry: function getEntry(entry) {
      var _this2 = this;

      var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      return new Promise(function (resolve, reject) {
        if (entry.isFile) {
          entry.file(function (file) {
            resolve([{
              size: file.size,
              name: path + file.name,
              type: file.type,
              file: file
            }]);
          });
        } else if (entry.isDirectory && _this2.dropDirectory) {
          var files = [];
          var dirReader = entry.createReader();
          var readEntries = function readEntries() {
            dirReader.readEntries(function (entries) {
              var forEach = function forEach(i) {
                if (!entries[i] && i === 0 || _this2.maximum > 0 && files.length >= _this2.maximum) {
                  return resolve(files);
                }
                if (!entries[i]) {
                  return readEntries();
                }
                _this2.getEntry(entries[i], path + entry.name + '/').then(function (results) {
                  files.push.apply(files, results);
                  forEach(i + 1);
                });
              };
              forEach(0);
            });
          };
          readEntries();
        } else {
          resolve([]);
        }
      });
    },


    // Remove a file object
    remove: function remove(id) {
      var file = this.get(id);
      if (file) {
        if (this.emitFilter(undefined, file)) {
          return false;
        }
        var files = this.files.concat([]);
        var index = files.indexOf(file);
        if (index === -1) {
          console.error('remove', file);
          return false;
        }
        files.splice(index, 1);
        this.files = files;

        delete this.maps[file.id];

        this.emitInput();
        this.emitFile(undefined, file);
      }
      return file;
    },


    // Update a file object
    update: function update(id, data) {
      var file = this.get(id);
      if (file) {
        var newFile = Object.assign({}, file, data);
        if (file.fileObject && file.active && !newFile.active && !newFile.error && !newFile.success) {
          newFile.error = 'abort';
        }

        if (this.emitFilter(newFile, file)) {
          return false;
        }

        var files = this.files.concat([]);
        var index = files.indexOf(file);
        if (index === -1) {
          console.error('update', file);
          return false;
        }
        files.splice(index, 1, newFile);
        this.files = files;

        delete this.maps[file.id];
        this.maps[newFile.id] = newFile;

        this.emitInput();
        this.emitFile(newFile, file);
        return newFile;
      }
      return false;
    },
    emitFilter: function emitFilter(newFile, oldFile) {
      var isPrevent = false;
      this.$emit('input-filter', newFile, oldFile, function () {
        isPrevent = true;
        return isPrevent;
      });
      return isPrevent;
    },
    emitFile: function emitFile(newFile, oldFile) {
      this.$emit('input-file', newFile, oldFile);
      if (newFile && newFile.fileObject && newFile.active && (!oldFile || !oldFile.active)) {
        this.uploading++;
        this.$nextTick(function () {
          var _this3 = this;

          setTimeout(function () {
            _this3.upload(newFile).then(function () {
              if (newFile && newFile.fileObject) {
                _this3.update(newFile, {
                  active: false,
                  success: !newFile.error
                });
              }
            }).catch(function (e) {
              _this3.update(newFile, {
                active: false,
                success: false,
                error: e.code || e.error || e.message || e
              });
            });
          }, parseInt(Math.random() * 50 + 50, 10));
        });
      } else if ((!newFile || !newFile.fileObject || !newFile.active) && oldFile && oldFile.fileObject && oldFile.active) {
        this.uploading--;
      }

      if (this.active && (Boolean(newFile) !== Boolean(oldFile) || newFile.active !== oldFile.active)) {
        this.watchActive(true);
      }
    },
    emitInput: function emitInput() {
      this.$emit('input', this.files);
    },


    // Validate then upload file
    upload: function upload(id) {
      var file = this.get(id);

      // Validate file
      if (!file) {
        return Promise.reject('not_exists');
      }

      // Validate file object data
      if (!file.fileObject) {
        return Promise.reject('file_object');
      }

      // Reject if there is an error
      if (file.error) {
        return Promise.reject(file.error);
      }

      // If the file is already downloaded, don't download-it again
      if (file.success) {
        return Promise.resolve(file);
      }

      // Validate extensions
      var extensions = this.extensions;
      if (extensions && (extensions.length || typeof extensions.length === 'undefined')) {
        if ((typeof extensions === 'undefined' ? 'undefined' : babelHelpers.typeof(extensions)) !== 'object' || !(extensions instanceof RegExp)) {
          if (typeof extensions === 'string') {
            extensions = extensions.split(',').map(function (value) {
              return value.trim();
            }).filter(function (value) {
              return value;
            });
          }
          extensions = new RegExp('\\.(' + extensions.join('|').replace(/\./g, '\\.') + ')$', 'i');
        }
        if (file.name.search(extensions) === -1) {
          return Promise.reject('extension');
        }
      }

      // Validate size
      if (this.size > 0 && file.size >= 0 && file.size > this.size) {
        return Promise.reject('size');
      }

      // Upload with Html5 specs or Html4 if not supported
      if (this.features.html5) {
        return this.uploadHtml5(file);
      }
      return this.uploadHtml4(file);
    },
    uploadHtml5: function uploadHtml5(file) {
      var form = new window.FormData();
      var value = void 0;
      for (var key in file.data) {
        value = file.data[key];
        if (value && (typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value)) === 'object' && typeof value.toString !== 'function') {
          if (value instanceof File) {
            form.append(key, value, value.name);
          } else {
            form.append(key, JSON.stringify(value));
          }
        } else if (value !== null && value !== undefined) {
          form.append(key, value);
        }
      }
      form.append(this.name, file.file, file.file.filename || file.name);
      var xhr = new XMLHttpRequest();
      xhr.open('POST', file.postAction);
      return this.uploadXhr(xhr, file, form);
    },


    // HTML5 uploadXMLHttpRequest object
    uploadXhr: function uploadXhr(xhr, _file, body) {
      var _this4 = this;

      var file = _file;
      var speedTime = 0;
      var speedLoaded = 0;

      xhr.upload.onprogress = function (e) {
        file = _this4.get(file);
        if (!e.lengthComputable || !file || !file.fileObject || !file.active) {
          return;
        }

        var speedTime2 = Math.round(Date.now() / 1000);
        if (speedTime2 === speedTime) {
          return;
        }
        speedTime = speedTime2;

        file = _this4.update(file, {
          progress: (e.loaded / e.total * 100).toFixed(2),
          speed: e.loaded - speedLoaded
        });
        speedLoaded = e.loaded;
      };

      var interval = setInterval(function () {
        file = _this4.get(file);
        if (file && file.fileObject && !file.success && !file.error && file.active) {
          return;
        }

        if (interval) {
          clearInterval(interval);
          interval = false;
        }

        try {
          xhr.abort();
          xhr.timeout = 1;
        } catch (e) {}
      }, 100);

      return new Promise(function (resolve, reject) {
        var complete = void 0;
        var fn = function fn(e) {
          if (complete) {
            return;
          }
          complete = true;
          if (interval) {
            clearInterval(interval);
            interval = false;
          }

          file = _this4.get(file);

          if (!file) {
            return reject('not_exists');
          }

          if (!file.fileObject) {
            return reject('file_object');
          }

          if (file.error) {
            return reject(file.error);
          }

          if (!file.active) {
            return reject('abort');
          }

          if (file.success) {
            return resolve(file);
          }

          var data = {};

          switch (e.type) {
            case 'timeout':
            case 'abort':
              data.error = e.type;
              break;
            case 'error':
              if (!xhr.status) {
                data.error = 'network';
              } else if (xhr.status >= 500) {
                data.error = 'server';
              } else if (xhr.status >= 400) {
                data.error = 'denied';
              }
              break;
            default:
              if (xhr.status >= 500) {
                data.error = 'server';
              } else if (xhr.status >= 400) {
                data.error = 'denied';
              } else {
                data.progress = '100.00';
              }
          }

          if (xhr.responseText) {
            var contentType = xhr.getResponseHeader('Content-Type');
            if (contentType && contentType.indexOf('/json') !== -1) {
              data.response = JSON.parse(xhr.responseText);
            } else {
              data.response = xhr.responseText;
            }
          }

          file = _this4.update(file, data);

          if (file.error) {
            return reject(file.error);
          }

          return resolve(file);
        };

        xhr.onload = fn;
        xhr.onerror = fn;
        xhr.onabort = fn;
        xhr.ontimeout = fn;

        if (file.timeout) {
          xhr.timeout = file.timeout;
        }

        // headers
        for (var key in file.headers) {
          xhr.setRequestHeader(key, file.headers[key]);
        }

        file = _this4.update(file, { xhr: xhr });

        xhr.send(body);
      });
    },
    uploadHtml4: function uploadHtml4(_file) {
      var _this5 = this;

      var file = _file;
      var onKeydown = function onKeydown(e) {
        if (e.keyCode === 27) {
          e.preventDefault();
        }
      };

      var iframe = document.createElement('iframe');
      iframe.id = 'upload-iframe-' + file.id;
      iframe.name = 'upload-iframe-' + file.id;
      iframe.src = 'about:blank';
      iframe.setAttribute('style', 'width:1px;height:1px;top:-999em;position:absolute; margin-top:-999em;');

      var form = document.createElement('form');

      form.action = file.postAction;

      form.name = 'upload-form-' + file.id;

      form.setAttribute('method', 'POST');
      form.setAttribute('target', 'upload-iframe-' + file.id);
      form.setAttribute('enctype', 'multipart/form-data');

      var value = void 0;
      var input = void 0;
      for (var key in file.data) {
        value = file.data[key];
        if (value && (typeof value === 'undefined' ? 'undefined' : babelHelpers.typeof(value)) === 'object' && typeof value.toString !== 'function') {
          value = JSON.stringify(value);
        }
        if (value !== null && value !== undefined) {
          input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        }
      }
      form.appendChild(file.el);

      document.body.appendChild(iframe).appendChild(form);

      var getResponseData = function getResponseData() {
        var doc = void 0;
        try {
          if (iframe.contentWindow) {
            doc = iframe.contentWindow.document;
          }
        } catch (err) {}
        if (!doc) {
          try {
            doc = iframe.contentDocument ? iframe.contentDocument : iframe.document;
          } catch (err) {
            doc = iframe.document;
          }
        }
        if (doc && doc.body) {
          return doc.body.innerHTML;
        }
        return null;
      };

      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          file = _this5.update(file, { iframe: iframe });

          // Validate file
          if (!file) {
            return reject('not_exists');
          }

          var interval = setInterval(function () {
            file = _this5.get(file);
            if (file && file.fileObject && !file.success && !file.error && file.active) {
              return;
            }

            if (interval) {
              clearInterval(interval);
              interval = false;
            }

            iframe.onabort({ type: file ? 'abort' : 'not_exists' });
          }, 100);

          var complete = void 0;
          var fn = function fn(e) {
            if (complete) {
              return;
            }
            complete = true;

            if (interval) {
              clearInterval(interval);
              interval = false;
            }

            document.body.removeEventListener('keydown', onKeydown);

            file = _this5.get(file);

            if (!file) {
              return reject('not_exists');
            }

            if (!file.fileObject) {
              return reject('file_object');
            }

            if (file.error) {
              return reject(file.error);
            }

            if (!file.active) {
              return reject('abort');
            }

            if (file.success) {
              return resolve(file);
            }

            var response = getResponseData();
            var data = {};
            switch (e.type) {
              case 'abort':
                data.error = 'abort';
                break;
              case 'error':
                if (file.error) {
                  data.error = file.error;
                } else if (response === null) {
                  data.error = 'network';
                } else {
                  data.error = 'denied';
                }
                break;
              default:
                if (file.error) {
                  data.error = file.error;
                } else if (data === null) {
                  data.error = 'network';
                } else {
                  data.progress = '100.00';
                }
            }

            if (response !== null) {
              if (response && response.substr(0, 1) === '{' && response.substr(response.length - 1, 1) === '}') {
                try {
                  response = JSON.parse(response);
                } catch (err) {}
              }
              data.response = response;
            }

            file = _this5.update(file, data);

            if (file.error) {
              return reject(file.error);
            }

            return resolve(file);
          };

          iframe.onload = fn;
          iframe.onerror = fn;
          iframe.onabort = fn;

          document.body.addEventListener('keydown', onKeydown);

          form.submit();
        }, 50);
      }).then(function (res) {
        iframe.parentNode && iframe.parentNode.removeChild(iframe);
        return res;
      }).catch(function (res) {
        iframe.parentNode && iframe.parentNode.removeChild(iframe);
        return res;
      });
    },
    watchActive: function watchActive(active) {
      var file = void 0;
      var index = 0;
      while (file = this.files[index]) {
        index++;
        if (!file.fileObject) {
          // Do nothing
        } else if (active && !this.destroy) {
          if (this.uploading >= this.thread || this.uploading && !this.features.html5) {
            break;
          }
          if (!file.active && !file.error && !file.success) {
            this.update(file, { active: true });
          }
        } else {
          if (file.active) {
            this.update(file, { active: false });
          }
        }
      }
      if (this.uploading === 0) {
        this.active = false;
      }
    },
    watchDrop: function watchDrop(_el) {
      var el = _el;
      if (!this.features.drop) {
        return;
      }

      if (this.dropElement) {
        try {
          document.removeEventListener('dragenter', this.onDragenter, false);
          document.removeEventListener('dragleave', this.onDragleave, false);
          document.removeEventListener('drop', this.onDocumentDrop, false);
          this.dropElement.removeEventListener('dragover', this.onDragover, false);
          this.dropElement.removeEventListener('drop', this.onDrop, false);
        } catch (e) {}
      }

      if (!el) {
        el = false;
      } else if (typeof el === 'string') {
        el = document.querySelector(el) || this.$root.$el.querySelector(el);
      } else if (el === true) {
        el = this.$parent.$el;
      }

      this.dropElement = el;

      if (this.dropElement) {
        document.addEventListener('dragenter', this.onDragenter, false);
        document.addEventListener('dragleave', this.onDragleave, false);
        document.addEventListener('drop', this.onDocumentDrop, false);
        this.dropElement.addEventListener('dragover', this.onDragover, false);
        this.dropElement.addEventListener('drop', this.onDrop, false);
      }
    },
    onDragenter: function onDragenter(e) {
      e.preventDefault();
      if (!this.dropActive) {
        this.dropActive = true;
      }
    },
    onDragleave: function onDragleave(e) {
      e.preventDefault();
      if (e.target.nodeName === 'HTML' || e.screenX === 0 && e.screenY === 0 && !e.fromElement && e.offsetX <= 0) {
        this.dropActive = false;
      }
    },
    onDragover: function onDragover(e) {
      e.preventDefault();
    },
    onDocumentDrop: function onDocumentDrop() {
      this.dropActive = false;
    },
    onDrop: function onDrop(e) {
      e.preventDefault();
      this.addDataTransfer(e.dataTransfer);
    }
  }
});

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  methods: {
    change: function change(e) {
      this.$destroy();
      this.$parent.addInputFile(e.target);
    }
  }
});

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_upload_component__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_upload_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue_upload_component__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
  components: {
    FileUpload: __WEBPACK_IMPORTED_MODULE_0_vue_upload_component___default.a
  },

  data: function data() {
    return {
      files: []
    };
  },


  methods: {
    inputFilter: function inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file
        // 添加文件前

        // Filter system files or hide files
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent();
        }

        // Filter php html js file
        // 过滤 php html js 文件
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent();
        }
      }
    },
    inputFile: function inputFile(newFile, oldFile) {
      if (newFile && !oldFile) {
        // add
        console.log('add', newFile);
      }
      if (newFile && oldFile) {
        // update
        console.log('update', newFile);
      }

      if (!newFile && oldFile) {
        // remove
        console.log('remove', oldFile);
      }
    }
  }
});

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_cropperjs__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_cropperjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_cropperjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_upload_component__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_upload_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_upload_component__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  components: {
    FileUpload: __WEBPACK_IMPORTED_MODULE_1_vue_upload_component___default.a
  },

  data: function data() {
    return {
      files: [],
      edit: false,
      cropper: false
    };
  },


  watch: {
    edit: function edit(value) {
      if (value) {
        this.$nextTick(function () {
          if (!this.$refs.editImage) {
            return;
          }
          var cropper = new __WEBPACK_IMPORTED_MODULE_0_cropperjs___default.a(this.$refs.editImage, {
            aspectRatio: 1 / 1,
            viewMode: 1
          });
          this.cropper = cropper;
        });
      } else {
        if (this.cropper) {
          this.cropper.destroy();
          this.cropper = false;
        }
      }
    }
  },

  methods: {
    editSave: function editSave() {
      this.edit = false;

      var oldFile = this.files[0];

      var binStr = atob(this.cropper.getCroppedCanvas().toDataURL(oldFile.type).split(',')[1]);
      var arr = new Uint8Array(binStr.length);
      for (var i = 0; i < binStr.length; i++) {
        arr[i] = binStr.charCodeAt(i);
      }

      var file = new File([arr], oldFile.name, { type: oldFile.type });

      this.$refs.upload.update(oldFile.id, {
        file: file,
        type: file.type,
        size: file.size,
        active: true
      });
    },
    alert: function (_alert) {
      function alert(_x) {
        return _alert.apply(this, arguments);
      }

      alert.toString = function () {
        return _alert.toString();
      };

      return alert;
    }(function (message) {
      alert(message);
    }),
    inputFile: function inputFile(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        this.$nextTick(function () {
          this.edit = true;
        });
      }
      if (!newFile && oldFile) {
        this.edit = false;
      }
    },
    inputFilter: function inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (!/\.(gif|jpg|jpeg|png|webp)$/i.test(newFile.name)) {
          this.alert('Your choice is not a picture');
          return prevent();
        }
      }

      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        newFile.url = '';
        var URL = window.URL || window.webkitURL;
        if (URL && URL.createObjectURL) {
          newFile.url = URL.createObjectURL(newFile.file);
        }
      }
    }
  }
});

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_upload_component__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_upload_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue_upload_component__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
  components: {
    FileUpload: __WEBPACK_IMPORTED_MODULE_0_vue_upload_component___default.a
  },

  data: function data() {
    return {
      files: []
    };
  }
});

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_upload_component__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_upload_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue_upload_component__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
  components: {
    FileUpload: __WEBPACK_IMPORTED_MODULE_0_vue_upload_component___default.a
  },

  data: function data() {
    return {
      files1: [],
      files2: []
    };
  }
});

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_upload_component__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_upload_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue_upload_component__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
  components: {
    FileUpload: __WEBPACK_IMPORTED_MODULE_0_vue_upload_component___default.a
  },

  data: function data() {
    return {
      files: [],

      chunkEnabled: true,

      // 1MB by default
      chunkMinSize: 1,
      chunkMaxActive: 3,
      chunkMaxRetries: 5
    };
  },


  methods: {
    inputFilter: function inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file
        // 添加文件前

        // Filter system files or hide files
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent();
        }

        // Filter php html js file
        // 过滤 php html js 文件
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent();
        }
      }
    },
    inputFile: function inputFile(newFile, oldFile) {
      if (newFile && !oldFile) {
        // add
        console.log('add', newFile);
        this.$refs.upload.active = true;
      }
      if (newFile && oldFile) {
        // update
        console.log('update', newFile);
      }

      if (!newFile && oldFile) {
        // remove
        console.log('remove', oldFile);
      }
    }
  }
});

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vuex__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_upload_component__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_upload_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue_upload_component__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  components: {
    FileUpload: __WEBPACK_IMPORTED_MODULE_1_vue_upload_component___default.a
  },

  computed: babelHelpers.extends({}, Object(__WEBPACK_IMPORTED_MODULE_0_vuex__["mapState"])(['files'])),

  methods: {
    inputUpdate: function inputUpdate(files) {
      this.$store.commit('updateFiles', files);
    }
  }
});

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      showLocale: false,
      showNav: false
    };
  },
  beforeCreate: function beforeCreate() {
    if (this.$route.params.locale && this.$route.params.locale !== this.$i18n.locale) {
      this.$i18n.locale = this.$route.params.locale;
    }
  },
  beforeUpdate: function beforeUpdate() {
    if (this.$route.params.locale && this.$route.params.locale !== this.$i18n.locale) {
      this.$i18n.locale = this.$route.params.locale;
    }
  },

  computed: {
    locale: function locale() {
      var i18n = this.$i18n;
      return i18n.messages[i18n.locale].locale;
    }
  },
  methods: {
    onLocale: function onLocale(show) {
      var _this = this;

      if (show) {
        this.showLocale = show;
      } else {
        setTimeout(function () {
          _this.showLocale = show;
        }, 128);
      }
    }
  }
});

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(22);


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_marked__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_marked___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_marked__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_highlight_js__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_highlight_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_highlight_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__store__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__router__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__i18n__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__views_App__ = __webpack_require__(76);








__WEBPACK_IMPORTED_MODULE_0_vue___default.a.config.silent = false;
__WEBPACK_IMPORTED_MODULE_0_vue___default.a.config.devtools = true;

var Renderer = function (_marked$Renderer) {
  babelHelpers.inherits(Renderer, _marked$Renderer);

  function Renderer() {
    babelHelpers.classCallCheck(this, Renderer);
    return babelHelpers.possibleConstructorReturn(this, (Renderer.__proto__ || Object.getPrototypeOf(Renderer)).apply(this, arguments));
  }

  babelHelpers.createClass(Renderer, [{
    key: 'heading',
    value: function heading(text, level, raw) {
      var rawName = raw.toLowerCase().replace(/([\u0000-\u002F\u003A-\u0060\u007B-\u007F]+)/g, '-').replace(/^\-+|\-+$/, '');

      if (!this.options.headers) {
        this.options.headers = [];
      }
      while (this.options.headers.length >= level) {
        this.options.headers.pop();
      }
      var parent = this.options.headers.filter(function (value) {
        return !!value;
      }).join('-');
      if (parent) {
        parent = parent + '-';
      }
      while (this.options.headers.length < level - 1) {
        this.options.headers.push('');
      }
      this.options.headers.push(rawName);
      return '<h' + level + ' id="' + this.options.headerPrefix + parent + rawName + '">' + text + '</h' + level + '>\n';
    }
  }]);
  return Renderer;
}(__WEBPACK_IMPORTED_MODULE_1_marked___default.a.Renderer);

__WEBPACK_IMPORTED_MODULE_1_marked___default.a.setOptions({
  renderer: new Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight: function highlight(code, lang) {
    if (lang) {
      return __WEBPACK_IMPORTED_MODULE_2_highlight_js___default.a.highlight(lang, code).value;
    } else {
      return __WEBPACK_IMPORTED_MODULE_2_highlight_js___default.a.highlightAuto(code).value;
    }
  }
});

__WEBPACK_IMPORTED_MODULE_0_vue___default.a.directive('markdown', function (el, binding, vnode) {
  if (!el.className || !/vue-markdown/.test(el.className)) {
    el.className += ' vue-markdown';
  }
  var text = '';
  for (var i = 0; i < vnode.children.length; i++) {
    text += vnode.children[i].text || '';
  }
  if (el.markdown === text) {
    return;
  }

  el.markdown = text;

  el.innerHTML = __WEBPACK_IMPORTED_MODULE_1_marked___default()(text);
  var selectorList = el.querySelectorAll('a');
  for (var _i = 0; _i < selectorList.length; _i++) {
    selectorList[_i].onclick = function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) {
        return;
      }
      if (e.defaultPrevented) {
        return;
      }
      if (e.button !== undefined && e.button !== 0) {
        return;
      }

      if (this.host !== window.location.host) {
        return;
      }

      var href = this.getAttribute('href');
      if (!href) {
        return;
      }

      if (href.charAt(0) !== '#') {
        return;
      }

      e.preventDefault();
      __WEBPACK_IMPORTED_MODULE_4__router__["a" /* default */].push(href);
    };
  }
});

__WEBPACK_IMPORTED_MODULE_0_vue___default.a.filter('formatSize', function (size) {
  if (size > 1024 * 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB';
  } else if (size > 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB';
  } else if (size > 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + ' MB';
  } else if (size > 1024) {
    return (size / 1024).toFixed(2) + ' KB';
  }
  return size.toString() + ' B';
});

__WEBPACK_IMPORTED_MODULE_0_vue___default.a.filter('toLocale', function (to) {
  return '/' + __WEBPACK_IMPORTED_MODULE_5__i18n__["a" /* default */].locale + to;
});

new __WEBPACK_IMPORTED_MODULE_0_vue___default.a(babelHelpers.extends({
  store: __WEBPACK_IMPORTED_MODULE_3__store__["a" /* default */],
  router: __WEBPACK_IMPORTED_MODULE_4__router__["a" /* default */],
  i18n: __WEBPACK_IMPORTED_MODULE_5__i18n__["a" /* default */]
}, __WEBPACK_IMPORTED_MODULE_6__views_App__["a" /* default */])).$mount('#app');

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = Vue;

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = hljs;

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vuex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vuex__);
// import Vue from 'vue'

//
// Vue.use(Vuex)


var state = {
  files: []
};

var mutations = {
  updateFiles: function updateFiles(state, files) {
    state.files = files;
  }
};
/* harmony default export */ __webpack_exports__["a"] = (new __WEBPACK_IMPORTED_MODULE_0_vuex___default.a.Store({
  strict: true,
  state: state,
  mutations: mutations
}));

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_router__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__i18n__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__views_Router__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__views_Document__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__views_Example__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__views_examples_Full__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__views_examples_Simple__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__views_examples_Avatar__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__views_examples_Drag__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__views_examples_Multiple__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__views_examples_Chunk__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__views_examples_Vuex__ = __webpack_require__(72);
// import Vue from 'vue'















// Vue.use(VueRouter)


var examples = [{
  path: '',
  component: __WEBPACK_IMPORTED_MODULE_5__views_examples_Full__["a" /* default */]
}, {
  path: 'full',
  component: __WEBPACK_IMPORTED_MODULE_5__views_examples_Full__["a" /* default */]
}, {
  path: 'simple',
  component: __WEBPACK_IMPORTED_MODULE_6__views_examples_Simple__["a" /* default */]
}, {
  path: 'avatar',
  component: __WEBPACK_IMPORTED_MODULE_7__views_examples_Avatar__["a" /* default */]
}, {
  path: 'drag',
  component: __WEBPACK_IMPORTED_MODULE_8__views_examples_Drag__["a" /* default */]
}, {
  path: 'multiple',
  component: __WEBPACK_IMPORTED_MODULE_9__views_examples_Multiple__["a" /* default */]
}, {
  path: 'chunk',
  component: __WEBPACK_IMPORTED_MODULE_10__views_examples_Chunk__["a" /* default */]
}, {
  path: 'vuex',
  component: __WEBPACK_IMPORTED_MODULE_11__views_examples_Vuex__["a" /* default */]
}];

var router = new __WEBPACK_IMPORTED_MODULE_0_vue_router___default.a({
  mode: 'hash',
  fallback: false,
  scrollBehavior: function scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      var el = document.querySelector(to.hash);
      return { x: 0, y: el ? el.offsetTop : 0 };
    } else {
      return { x: 0, y: 0 };
    }
  },

  routes: [{
    path: '/:locale(' + Object.keys(__WEBPACK_IMPORTED_MODULE_1__i18n__["a" /* default */].messages).join('|') + ')?',
    component: __WEBPACK_IMPORTED_MODULE_2__views_Router__["a" /* default */],
    children: [{
      path: 'documents',
      component: __WEBPACK_IMPORTED_MODULE_3__views_Document__["a" /* default */]
    }, {
      path: 'examples',
      component: __WEBPACK_IMPORTED_MODULE_4__views_Example__["a" /* default */],
      children: examples
    }, {
      path: '',
      component: __WEBPACK_IMPORTED_MODULE_4__views_Example__["a" /* default */],
      children: examples
    }]
  }]
});
/* harmony default export */ __webpack_exports__["a"] = (router);

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = VueRouter;

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = VueI18n;

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  header: {
    logo: 'Vuejs',
    home: 'Home',
    examples: 'Examples',
    documents: 'Documentation',
    blog: 'Blog',
    locale: 'Language(语言)',
    issues: 'Issues',
    github: 'Github'
  },

  locale: {
    en: 'English',
    'zh-cn': '中文(简体)'
  },

  document: {
    title: 'Documentation'
  },

  example: {
    full: 'Full Example',
    simple: 'Simple',
    avatar: 'Upload avatar',
    drag: 'Drag and drop',
    multiple: 'Multiple instances',
    chunk: 'Chunk upload',
    vuex: 'Vuex'
  }
});

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  header: {
    logo: 'Vuejs',
    home: '首页',
    examples: '演示',
    documents: '文档',
    blog: 'Blog',
    locale: 'Language(语言)',
    issues: 'Issues',
    github: 'Github'
  },

  locale: {
    en: 'English',
    'zh-cn': '中文(简体)'
  },

  document: {
    title: '文档'
  },

  example: {
    full: '完整例子',
    simple: '简单例子',
    avatar: '上传头像',
    drag: '拖拽上传',
    multiple: '多个实例',
    vuex: 'Vuex'
  }
});

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_aa322866_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Router_vue__ = __webpack_require__(32);
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = null
/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_aa322866_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Router_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('router-view')}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_Document_vue__ = __webpack_require__(7);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3c2a08e8_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Document_vue__ = __webpack_require__(38);
function injectStyle (ssrContext) {
  __webpack_require__(34)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_Document_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3c2a08e8_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Document_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(35);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("9c1d01b2", content, true, {});

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, ".document-title{margin-bottom:2rem;padding-bottom:1rem;border-bottom:1px solid #ddd}.document-content h2{padding-top:1rem;padding-bottom:1rem;margin-top:4rem;border-bottom:1px solid #eaecef}.document-content h2+h3,.document-content h2:first-child{margin-top:0}.document-content h3{margin-top:1.5rem;padding-top:1rem;margin-bottom:1rem}", ""]);

// exports


/***/ }),
/* 36 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles(parentId, list) {
  var styles = [];
  var newStyles = {};
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = item[0];
    var css = item[1];
    var media = item[2];
    var sourceMap = item[3];
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    };
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] });
    } else {
      newStyles[id].parts.push(part);
    }
  }
  return styles;
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./en": 8,
	"./en.md": 8,
	"./zh-cn": 9,
	"./zh-cn.md": 9
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 37;

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"container-fluid"},[_c('div',{staticClass:"row flex-xl-nowrap"},[_c('div',{staticClass:"col-12 col-md-3 col-xl-2",attrs:{"id":"sidebar"}},[_c('nav',{staticClass:"collapse show",attrs:{"id":"sidebar-nav"}},[_c('ul',{staticClass:"nav"},_vm._l((_vm.navs),function(group,index){return _c('li',{class:{'nav-item': true, active: (!_vm.$route.hash && !index) || _vm.$route.hash.indexOf(group.hash) === 1}},[_c('router-link',{class:{'nav-link': true, active: _vm.$route.hash.indexOf(group.hash) === 1},attrs:{"active-class":"active","to":'#' + group.hash}},[_vm._v(_vm._s(group.name))]),(group.children.length)?_c('ul',{staticClass:"nav"},_vm._l((group.children),function(child){return _c('li',{staticClass:"nav-item"},[_c('router-link',{staticClass:"nav-link",attrs:{"active-class":"active","to":'#' + group.hash + '-' + child.hash}},[_vm._v(_vm._s(child.name))])],1)})):_vm._e()],1)}))])]),_c('main',{staticClass:"col-12 col-md-9 col-xl-10 py-md-3 pr-md-5 pl-md-5",attrs:{"id":"main","role":"main"}},[_c('h1',{staticClass:"document-title",attrs:{"id":"document-title"}},[_vm._v(_vm._s(_vm.$t('document.title')))]),_c('div',{directives:[{name:"markdown",rawName:"v-markdown"}],staticClass:"document-content"},[_vm._v(_vm._s(_vm.document))])])])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8abae946_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Example_vue__ = __webpack_require__(40);
var normalizeComponent = __webpack_require__(0)
/* script */
var __vue_script__ = null
/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __WEBPACK_IMPORTED_MODULE_0__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8abae946_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Example_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"container-fluid"},[_c('div',{staticClass:"row flex-xl-nowrap"},[_c('div',{staticClass:"col-12 col-md-3 col-xl-2",attrs:{"id":"sidebar"}},[_c('nav',{staticClass:"collapse show",attrs:{"id":"sidebar-nav"}},[_c('ul',{staticClass:"nav"},[_c('li',{staticClass:"nav-item"},[_c('router-link',{staticClass:"nav-link",attrs:{"active-class":"active","to":_vm._f("toLocale")('/examples/full')}},[_vm._v(_vm._s(_vm.$t('example.full')))])],1),_c('li',{staticClass:"nav-item"},[_c('router-link',{staticClass:"nav-link",attrs:{"active-class":"active","to":_vm._f("toLocale")('/examples/simple')}},[_vm._v(_vm._s(_vm.$t('example.simple')))])],1),_c('li',{staticClass:"nav-item"},[_c('router-link',{staticClass:"nav-link",attrs:{"active-class":"active","to":_vm._f("toLocale")('/examples/avatar')}},[_vm._v(_vm._s(_vm.$t('example.avatar')))])],1),_c('li',{staticClass:"nav-item"},[_c('router-link',{staticClass:"nav-link",attrs:{"active-class":"active","to":_vm._f("toLocale")('/examples/drag')}},[_vm._v(_vm._s(_vm.$t('example.drag')))])],1),_c('li',{staticClass:"nav-item"},[_c('router-link',{staticClass:"nav-link",attrs:{"active-class":"active","to":_vm._f("toLocale")('/examples/multiple')}},[_vm._v(_vm._s(_vm.$t('example.multiple')))])],1),_c('li',{staticClass:"nav-item"},[_c('router-link',{staticClass:"nav-link",attrs:{"active-class":"active","to":_vm._f("toLocale")('/examples/chunk')}},[_vm._v(_vm._s(_vm.$t('example.chunk')))])],1),_c('li',{staticClass:"nav-item"},[_c('router-link',{staticClass:"nav-link",attrs:{"active-class":"active","to":_vm._f("toLocale")('/examples/vuex')}},[_vm._v(_vm._s(_vm.$t('example.vuex')))])],1)])])]),_c('main',{staticClass:"col-12 col-md-9 col-xl-10 py-md-3 pr-md-5 pl-md-5",attrs:{"id":"main","role":"main"}},[_c('router-view')],1)])])}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_Full_vue__ = __webpack_require__(10);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_635f372c_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Full_vue__ = __webpack_require__(49);
function injectStyle (ssrContext) {
  __webpack_require__(42)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_Full_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_635f372c_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Full_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(43);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("65203ea0", content, true, {});

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, ".example-full .btn-group .dropdown-menu{display:block;visibility:hidden;transition:all .2s}.example-full .btn-group:hover>.dropdown-menu{visibility:visible}.example-full label.dropdown-item{margin-bottom:0}.example-full .btn-group .dropdown-toggle{margin-right:.6rem}.example-full .filename{margin-bottom:.3rem}.example-full .btn-is-option{margin-top:.25rem}.example-full .example-foorer{padding:.5rem 0;border-top:1px solid #e9ecef;border-bottom:1px solid #e9ecef}.example-full .edit-image img{max-width:100%}.example-full .edit-image-tool{margin-top:.6rem}.example-full .edit-image-tool .btn-group{margin-right:.6rem}.example-full .footer-status{padding-top:.4rem}.example-full .drop-active{top:0;bottom:0;right:0;left:0;position:fixed;z-index:9999;opacity:.6;text-align:center;background:#000}.example-full .drop-active h3{margin:-.5em 0 0;position:absolute;top:50%;left:0;right:0;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);font-size:40px;color:#fff;padding:0}", ""]);

// exports


/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = ImageCompressor;

/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_FileUpload_vue__ = __webpack_require__(12);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0945f938_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_FileUpload_vue__ = __webpack_require__(48);
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_FileUpload_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0945f938_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_FileUpload_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_InputFile_vue__ = __webpack_require__(13);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_59bfe359_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_InputFile_vue__ = __webpack_require__(47);
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_InputFile_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_59bfe359_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_InputFile_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('input',{attrs:{"type":"file","name":_vm.$parent.name,"id":_vm.$parent.inputId || _vm.$parent.name,"accept":_vm.$parent.accept,"webkitdirectory":_vm.$parent.directory && _vm.$parent.features.directory,"directory":_vm.$parent.directory && _vm.$parent.features.directory,"multiple":_vm.$parent.multiple && _vm.$parent.features.html5},on:{"change":_vm.change}})}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('label',{class:_vm.className},[_vm._t("default"),_c('input-file')],2)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"example-full"},[_c('button',{staticClass:"btn btn-danger float-right btn-is-option",attrs:{"type":"button"},on:{"click":function($event){$event.preventDefault();_vm.isOption = !_vm.isOption}}},[_c('i',{staticClass:"fa fa-cog",attrs:{"aria-hidden":"true"}}),_vm._v("\r\n    Options\r\n  ")]),_c('h1',{staticClass:"example-title",attrs:{"id":"example-title"}},[_vm._v("Full Example")]),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.$refs.upload && _vm.$refs.upload.dropActive),expression:"$refs.upload && $refs.upload.dropActive"}],staticClass:"drop-active"},[_c('h3',[_vm._v("Drop files to upload")])]),_c('div',{directives:[{name:"show",rawName:"v-show",value:(!_vm.isOption),expression:"!isOption"}],staticClass:"upload"},[_c('div',{staticClass:"table-responsive"},[_c('table',{staticClass:"table table-hover"},[_vm._m(0),_c('tbody',[(!_vm.files.length)?_c('tr',[_c('td',{attrs:{"colspan":"7"}},[_c('div',{staticClass:"text-center p-5"},[_vm._m(1),_c('label',{staticClass:"btn btn-lg btn-primary",attrs:{"for":_vm.name}},[_vm._v("Select Files")])])])]):_vm._e(),_vm._l((_vm.files),function(file,index){return _c('tr',{key:file.id},[_c('td',[_vm._v(_vm._s(index))]),_c('td',[(file.thumb)?_c('img',{attrs:{"src":file.thumb,"width":"40","height":"auto"}}):_c('span',[_vm._v("No Image")])]),_c('td',[_c('div',{staticClass:"filename"},[_vm._v("\r\n                "+_vm._s(file.name)+"\r\n              ")]),(file.active || file.progress !== '0.00')?_c('div',{staticClass:"progress"},[_c('div',{class:{'progress-bar': true, 'progress-bar-striped': true, 'bg-danger': file.error, 'progress-bar-animated': file.active},style:({width: file.progress + '%'}),attrs:{"role":"progressbar"}},[_vm._v(_vm._s(file.progress)+"%")])]):_vm._e()]),_c('td',[_vm._v(_vm._s(_vm._f("formatSize")(file.size)))]),_c('td',[_vm._v(_vm._s(_vm._f("formatSize")(file.speed)))]),(file.error)?_c('td',[_vm._v(_vm._s(file.error))]):(file.success)?_c('td',[_vm._v("success")]):(file.active)?_c('td',[_vm._v("active")]):_c('td'),_c('td',[_c('div',{staticClass:"btn-group"},[_c('button',{staticClass:"btn btn-secondary btn-sm dropdown-toggle",attrs:{"type":"button"}},[_vm._v("\r\n                  Action\r\n                ")]),_c('div',{staticClass:"dropdown-menu"},[_c('a',{class:{'dropdown-item': true, disabled: file.active || file.success || file.error === 'compressing'},attrs:{"href":"#"},on:{"click":function($event){$event.preventDefault();file.active || file.success || file.error === 'compressing' ? false :  _vm.onEditFileShow(file)}}},[_vm._v("Edit")]),_c('a',{class:{'dropdown-item': true, disabled: !file.active},attrs:{"href":"#"},on:{"click":function($event){$event.preventDefault();file.active ? _vm.$refs.upload.update(file, {error: 'cancel'}) : false}}},[_vm._v("Cancel")]),(file.active)?_c('a',{staticClass:"dropdown-item",attrs:{"href":"#"},on:{"click":function($event){$event.preventDefault();_vm.$refs.upload.update(file, {active: false})}}},[_vm._v("Abort")]):(file.error && file.error !== 'compressing' && _vm.$refs.upload.features.html5)?_c('a',{staticClass:"dropdown-item",attrs:{"href":"#"},on:{"click":function($event){$event.preventDefault();_vm.$refs.upload.update(file, {active: true, error: '', progress: '0.00'})}}},[_vm._v("Retry upload")]):_c('a',{class:{'dropdown-item': true, disabled: file.success || file.error === 'compressing'},attrs:{"href":"#"},on:{"click":function($event){$event.preventDefault();file.success || file.error === 'compressing' ? false : _vm.$refs.upload.update(file, {active: true})}}},[_vm._v("Upload")]),_c('div',{staticClass:"dropdown-divider"}),_c('a',{staticClass:"dropdown-item",attrs:{"href":"#"},on:{"click":function($event){$event.preventDefault();_vm.$refs.upload.remove(file)}}},[_vm._v("Remove")])])])])])})],2)])]),_c('div',{staticClass:"example-foorer"},[_c('div',{staticClass:"footer-status float-right"},[_vm._v("\r\n        Drop: "+_vm._s(_vm.$refs.upload ? _vm.$refs.upload.drop : false)+",\r\n        Active: "+_vm._s(_vm.$refs.upload ? _vm.$refs.upload.active : false)+",\r\n        Uploaded: "+_vm._s(_vm.$refs.upload ? _vm.$refs.upload.uploaded : true)+",\r\n        Drop active: "+_vm._s(_vm.$refs.upload ? _vm.$refs.upload.dropActive : false)+"\r\n      ")]),_c('div',{staticClass:"btn-group"},[_c('file-upload',{ref:"upload",staticClass:"btn btn-primary dropdown-toggle",attrs:{"post-action":_vm.postAction,"put-action":_vm.putAction,"extensions":_vm.extensions,"accept":_vm.accept,"multiple":_vm.multiple,"directory":_vm.directory,"size":_vm.size || 0,"thread":_vm.thread < 1 ? 1 : (_vm.thread > 5 ? 5 : _vm.thread),"headers":_vm.headers,"data":_vm.data,"drop":_vm.drop,"drop-directory":_vm.dropDirectory,"add-index":_vm.addIndex},on:{"input-filter":_vm.inputFilter,"input-file":_vm.inputFile},model:{value:(_vm.files),callback:function ($$v) {_vm.files=$$v},expression:"files"}},[_c('i',{staticClass:"fa fa-plus"}),_vm._v("\r\n          Select\r\n        ")]),_c('div',{staticClass:"dropdown-menu"},[_c('label',{staticClass:"dropdown-item",attrs:{"for":_vm.name}},[_vm._v("Add files")]),_c('a',{staticClass:"dropdown-item",attrs:{"href":"#"},on:{"click":_vm.onAddFolader}},[_vm._v("Add folder")]),_c('a',{staticClass:"dropdown-item",attrs:{"href":"#"},on:{"click":function($event){$event.preventDefault();_vm.addData.show = true}}},[_vm._v("Add data")])])],1),(!_vm.$refs.upload || !_vm.$refs.upload.active)?_c('button',{staticClass:"btn btn-success",attrs:{"type":"button"},on:{"click":function($event){$event.preventDefault();_vm.$refs.upload.active = true}}},[_c('i',{staticClass:"fa fa-arrow-up",attrs:{"aria-hidden":"true"}}),_vm._v("\r\n        Start Upload\r\n      ")]):_c('button',{staticClass:"btn btn-danger",attrs:{"type":"button"},on:{"click":function($event){$event.preventDefault();_vm.$refs.upload.active = false}}},[_c('i',{staticClass:"fa fa-stop",attrs:{"aria-hidden":"true"}}),_vm._v("\r\n        Stop Upload\r\n      ")])])]),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.isOption),expression:"isOption"}],staticClass:"option"},[_c('div',{staticClass:"form-group"},[_c('label',{attrs:{"for":"accept"}},[_vm._v("Accept:")]),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.accept),expression:"accept"}],staticClass:"form-control",attrs:{"type":"text","id":"accept"},domProps:{"value":(_vm.accept)},on:{"input":function($event){if($event.target.composing){ return; }_vm.accept=$event.target.value}}}),_c('small',{staticClass:"form-text text-muted"},[_vm._v("Allow upload mime type")])]),_c('div',{staticClass:"form-group"},[_c('label',{attrs:{"for":"extensions"}},[_vm._v("Extensions:")]),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.extensions),expression:"extensions"}],staticClass:"form-control",attrs:{"type":"text","id":"extensions"},domProps:{"value":(_vm.extensions)},on:{"input":function($event){if($event.target.composing){ return; }_vm.extensions=$event.target.value}}}),_c('small',{staticClass:"form-text text-muted"},[_vm._v("Allow upload file extension")])]),_c('div',{staticClass:"form-group"},[_c('label',[_vm._v("PUT Upload:")]),_c('div',{staticClass:"form-check"},[_c('label',{staticClass:"form-check-label"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.putAction),expression:"putAction"}],staticClass:"form-check-input",attrs:{"type":"radio","name":"put-action","id":"put-action","value":""},domProps:{"checked":_vm._q(_vm.putAction,"")},on:{"change":function($event){_vm.putAction=""}}}),_vm._v(" Off\r\n        ")])]),_c('div',{staticClass:"form-check"},[_c('label',{staticClass:"form-check-label"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.putAction),expression:"putAction"}],staticClass:"form-check-input",attrs:{"type":"radio","name":"put-action","id":"put-action","value":"/upload/put"},domProps:{"checked":_vm._q(_vm.putAction,"/upload/put")},on:{"change":function($event){_vm.putAction="/upload/put"}}}),_vm._v(" On\r\n        ")])]),_c('small',{staticClass:"form-text text-muted"},[_vm._v("After the shutdown, use the POST method to upload")])]),_c('div',{staticClass:"form-group"},[_c('label',{attrs:{"for":"thread"}},[_vm._v("Thread:")]),_c('input',{directives:[{name:"model",rawName:"v-model.number",value:(_vm.thread),expression:"thread",modifiers:{"number":true}}],staticClass:"form-control",attrs:{"type":"number","max":"5","min":"1","id":"thread"},domProps:{"value":(_vm.thread)},on:{"input":function($event){if($event.target.composing){ return; }_vm.thread=_vm._n($event.target.value)},"blur":function($event){_vm.$forceUpdate()}}}),_c('small',{staticClass:"form-text text-muted"},[_vm._v("Also upload the number of files at the same time (number of threads)")])]),_c('div',{staticClass:"form-group"},[_c('label',{attrs:{"for":"size"}},[_vm._v("Max size:")]),_c('input',{directives:[{name:"model",rawName:"v-model.number",value:(_vm.size),expression:"size",modifiers:{"number":true}}],staticClass:"form-control",attrs:{"type":"number","min":"0","id":"size"},domProps:{"value":(_vm.size)},on:{"input":function($event){if($event.target.composing){ return; }_vm.size=_vm._n($event.target.value)},"blur":function($event){_vm.$forceUpdate()}}})]),_c('div',{staticClass:"form-group"},[_c('label',{attrs:{"for":"minSize"}},[_vm._v("Min size:")]),_c('input',{directives:[{name:"model",rawName:"v-model.number",value:(_vm.minSize),expression:"minSize",modifiers:{"number":true}}],staticClass:"form-control",attrs:{"type":"number","min":"0","id":"minSize"},domProps:{"value":(_vm.minSize)},on:{"input":function($event){if($event.target.composing){ return; }_vm.minSize=_vm._n($event.target.value)},"blur":function($event){_vm.$forceUpdate()}}})]),_c('div',{staticClass:"form-group"},[_c('label',{attrs:{"for":"autoCompress"}},[_vm._v("Automatically compress:")]),_c('input',{directives:[{name:"model",rawName:"v-model.number",value:(_vm.autoCompress),expression:"autoCompress",modifiers:{"number":true}}],staticClass:"form-control",attrs:{"type":"number","min":"0","id":"autoCompress"},domProps:{"value":(_vm.autoCompress)},on:{"input":function($event){if($event.target.composing){ return; }_vm.autoCompress=_vm._n($event.target.value)},"blur":function($event){_vm.$forceUpdate()}}}),(_vm.autoCompress > 0)?_c('small',{staticClass:"form-text text-muted"},[_vm._v("More than "+_vm._s(_vm._f("formatSize")(_vm.autoCompress))+" files are automatically compressed")]):_c('small',{staticClass:"form-text text-muted"},[_vm._v("Set up automatic compression")])]),_c('div',{staticClass:"form-group"},[_c('div',{staticClass:"form-check"},[_c('label',{staticClass:"form-check-label"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.addIndex),expression:"addIndex"}],staticClass:"form-check-input",attrs:{"type":"checkbox","id":"add-index"},domProps:{"checked":Array.isArray(_vm.addIndex)?_vm._i(_vm.addIndex,null)>-1:(_vm.addIndex)},on:{"change":function($event){var $$a=_vm.addIndex,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.addIndex=$$a.concat([$$v]))}else{$$i>-1&&(_vm.addIndex=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{_vm.addIndex=$$c}}}}),_vm._v(" Start position to add\r\n        ")])]),_c('small',{staticClass:"form-text text-muted"},[_vm._v("Add a file list to start the location to add")])]),_c('div',{staticClass:"form-group"},[_c('div',{staticClass:"form-check"},[_c('label',{staticClass:"form-check-label"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.drop),expression:"drop"}],staticClass:"form-check-input",attrs:{"type":"checkbox","id":"drop"},domProps:{"checked":Array.isArray(_vm.drop)?_vm._i(_vm.drop,null)>-1:(_vm.drop)},on:{"change":function($event){var $$a=_vm.drop,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.drop=$$a.concat([$$v]))}else{$$i>-1&&(_vm.drop=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{_vm.drop=$$c}}}}),_vm._v(" Drop\r\n        ")])]),_c('small',{staticClass:"form-text text-muted"},[_vm._v("Drag and drop upload")])]),_c('div',{staticClass:"form-group"},[_c('div',{staticClass:"form-check"},[_c('label',{staticClass:"form-check-label"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.dropDirectory),expression:"dropDirectory"}],staticClass:"form-check-input",attrs:{"type":"checkbox","id":"drop-directory"},domProps:{"checked":Array.isArray(_vm.dropDirectory)?_vm._i(_vm.dropDirectory,null)>-1:(_vm.dropDirectory)},on:{"change":function($event){var $$a=_vm.dropDirectory,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.dropDirectory=$$a.concat([$$v]))}else{$$i>-1&&(_vm.dropDirectory=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{_vm.dropDirectory=$$c}}}}),_vm._v(" Drop directory\r\n        ")])]),_c('small',{staticClass:"form-text text-muted"},[_vm._v("Not checked, filter the dragged folder")])]),_c('div',{staticClass:"form-group"},[_c('div',{staticClass:"form-check"},[_c('label',{staticClass:"form-check-label"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.uploadAuto),expression:"uploadAuto"}],staticClass:"form-check-input",attrs:{"type":"checkbox","id":"upload-auto"},domProps:{"checked":Array.isArray(_vm.uploadAuto)?_vm._i(_vm.uploadAuto,null)>-1:(_vm.uploadAuto)},on:{"change":function($event){var $$a=_vm.uploadAuto,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.uploadAuto=$$a.concat([$$v]))}else{$$i>-1&&(_vm.uploadAuto=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{_vm.uploadAuto=$$c}}}}),_vm._v(" Auto start\r\n        ")])]),_c('small',{staticClass:"form-text text-muted"},[_vm._v("Automatically activate upload")])]),_c('div',{staticClass:"form-group"},[_c('button',{staticClass:"btn btn-primary btn-lg btn-block",attrs:{"type":"button"},on:{"click":function($event){$event.preventDefault();_vm.isOption = !_vm.isOption}}},[_vm._v("Confirm")])])]),_c('div',{class:{'modal-backdrop': true, 'fade': true, show: _vm.addData.show}}),_c('div',{class:{modal: true, fade: true, show: _vm.addData.show},attrs:{"id":"modal-add-data","tabindex":"-1","role":"dialog"}},[_c('div',{staticClass:"modal-dialog",attrs:{"role":"document"}},[_c('div',{staticClass:"modal-content"},[_c('div',{staticClass:"modal-header"},[_c('h5',{staticClass:"modal-title"},[_vm._v("Add data")]),_c('button',{staticClass:"close",attrs:{"type":"button"},on:{"click":function($event){$event.preventDefault();_vm.addData.show = false}}},[_c('span',[_vm._v("×")])])]),_c('form',{on:{"submit":function($event){$event.preventDefault();_vm.onAddData($event)}}},[_c('div',{staticClass:"modal-body"},[_c('div',{staticClass:"form-group"},[_c('label',{attrs:{"for":"name"}},[_vm._v("Name:")]),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.addData.name),expression:"addData.name"}],staticClass:"form-control",attrs:{"type":"text","required":"","id":"name","placeholder":"Please enter a file name"},domProps:{"value":(_vm.addData.name)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(_vm.addData, "name", $event.target.value)}}}),_vm._m(2)]),_c('div',{staticClass:"form-group"},[_c('label',{attrs:{"for":"type"}},[_vm._v("Type:")]),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.addData.type),expression:"addData.type"}],staticClass:"form-control",attrs:{"type":"text","required":"","id":"type","placeholder":"Please enter the MIME type"},domProps:{"value":(_vm.addData.type)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(_vm.addData, "type", $event.target.value)}}}),_vm._m(3)]),_c('div',{staticClass:"form-group"},[_c('label',{attrs:{"for":"content"}},[_vm._v("Content:")]),_c('textarea',{directives:[{name:"model",rawName:"v-model",value:(_vm.addData.content),expression:"addData.content"}],staticClass:"form-control",attrs:{"required":"","id":"content","rows":"3","placeholder":"Please enter the file contents"},domProps:{"value":(_vm.addData.content)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(_vm.addData, "content", $event.target.value)}}})])]),_c('div',{staticClass:"modal-footer"},[_c('button',{staticClass:"btn btn-secondary",attrs:{"type":"button"},on:{"click":function($event){$event.preventDefault();_vm.addData.show = false}}},[_vm._v("Close")]),_c('button',{staticClass:"btn btn-primary",attrs:{"type":"submit"}},[_vm._v("Save")])])])])])]),_c('div',{class:{'modal-backdrop': true, 'fade': true, show: _vm.editFile.show}}),_c('div',{class:{modal: true, fade: true, show: _vm.editFile.show},attrs:{"id":"modal-edit-file","tabindex":"-1","role":"dialog"}},[_c('div',{staticClass:"modal-dialog modal-lg",attrs:{"role":"document"}},[_c('div',{staticClass:"modal-content"},[_c('div',{staticClass:"modal-header"},[_c('h5',{staticClass:"modal-title"},[_vm._v("Edit file")]),_c('button',{staticClass:"close",attrs:{"type":"button"},on:{"click":function($event){$event.preventDefault();_vm.editFile.show = false}}},[_c('span',[_vm._v("×")])])]),_c('form',{on:{"submit":function($event){$event.preventDefault();_vm.onEditorFile($event)}}},[_c('div',{staticClass:"modal-body"},[_c('div',{staticClass:"form-group"},[_c('label',{attrs:{"for":"name"}},[_vm._v("Name:")]),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.editFile.name),expression:"editFile.name"}],staticClass:"form-control",attrs:{"type":"text","required":"","id":"name","placeholder":"Please enter a file name"},domProps:{"value":(_vm.editFile.name)},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(_vm.editFile, "name", $event.target.value)}}})]),(_vm.editFile.show && _vm.editFile.blob && _vm.editFile.type && _vm.editFile.type.substr(0, 6) === 'image/')?_c('div',{staticClass:"form-group"},[_c('label',[_vm._v("Image: ")]),_c('div',{staticClass:"edit-image"},[_c('img',{ref:"editImage",attrs:{"src":_vm.editFile.blob}})]),_c('div',{staticClass:"edit-image-tool"},[_c('div',{staticClass:"btn-group",attrs:{"role":"group"}},[_c('button',{staticClass:"btn btn-primary",attrs:{"type":"button","title":"cropper.rotate(-90)"},on:{"click":function($event){_vm.editFile.cropper.rotate(-90)}}},[_c('i',{staticClass:"fa fa-undo",attrs:{"aria-hidden":"true"}})]),_c('button',{staticClass:"btn btn-primary",attrs:{"type":"button","title":"cropper.rotate(90)"},on:{"click":function($event){_vm.editFile.cropper.rotate(90)}}},[_c('i',{staticClass:"fa fa-repeat",attrs:{"aria-hidden":"true"}})])]),_c('div',{staticClass:"btn-group",attrs:{"role":"group"}},[_c('button',{staticClass:"btn btn-primary",attrs:{"type":"button","title":"cropper.crop()"},on:{"click":function($event){_vm.editFile.cropper.crop()}}},[_c('i',{staticClass:"fa fa-check",attrs:{"aria-hidden":"true"}})]),_c('button',{staticClass:"btn btn-primary",attrs:{"type":"button","title":"cropper.clear()"},on:{"click":function($event){_vm.editFile.cropper.clear()}}},[_c('i',{staticClass:"fa fa-remove",attrs:{"aria-hidden":"true"}})])])])]):_vm._e()]),_c('div',{staticClass:"modal-footer"},[_c('button',{staticClass:"btn btn-secondary",attrs:{"type":"button"},on:{"click":function($event){$event.preventDefault();_vm.editFile.show = false}}},[_vm._v("Close")]),_c('button',{staticClass:"btn btn-primary",attrs:{"type":"submit"}},[_vm._v("Save")])])])])])]),_vm._m(4)])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('thead',[_c('tr',[_c('th',[_vm._v("#")]),_c('th',[_vm._v("Thumb")]),_c('th',[_vm._v("Name")]),_c('th',[_vm._v("Size")]),_c('th',[_vm._v("Speed")]),_c('th',[_vm._v("Status")]),_c('th',[_vm._v("Action")])])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('h4',[_vm._v("Drop files anywhere to upload"),_c('br'),_vm._v("or")])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('small',{staticClass:"form-text text-muted"},[_vm._v("Such as "),_c('code',[_vm._v("filename.txt")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('small',{staticClass:"form-text text-muted"},[_vm._v("Such as "),_c('code',[_vm._v("text/plain")])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"pt-5"},[_vm._v("\r\n    Source code: "),_c('a',{attrs:{"href":"https://github.com/lian-yue/vue-upload-component/blob/master/docs/views/examples/Full.vue"}},[_vm._v("/docs/views/examples/Full.vue")])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_Simple_vue__ = __webpack_require__(14);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_17eaeea2_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Simple_vue__ = __webpack_require__(53);
function injectStyle (ssrContext) {
  __webpack_require__(51)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_Simple_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_17eaeea2_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Simple_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(52);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("7920f3c0", content, true, {});

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, ".example-simple label.btn{margin-bottom:0;margin-right:1rem}", ""]);

// exports


/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"example-simple"},[_c('h1',{staticClass:"example-title",attrs:{"id":"example-title"}},[_vm._v("Simple Example")]),_c('div',{staticClass:"upload"},[_c('ul',_vm._l((_vm.files),function(file,index){return _c('li',{key:file.id},[_c('span',[_vm._v(_vm._s(file.name))]),_vm._v(" -\n        "),_c('span',[_vm._v(_vm._s(_vm._f("formatSize")(file.size)))]),_vm._v(" -\n        "),(file.error)?_c('span',[_vm._v(_vm._s(file.error))]):(file.success)?_c('span',[_vm._v("success")]):(file.active)?_c('span',[_vm._v("active")]):(file.active)?_c('span',[_vm._v("active")]):_c('span')])})),_c('div',{staticClass:"example-btn"},[_c('file-upload',{ref:"upload",staticClass:"btn btn-primary",attrs:{"post-action":"/upload/post","extensions":"gif,jpg,jpeg,png,webp","accept":"image/png,image/gif,image/jpeg,image/webp","multiple":true,"size":1024 * 1024 * 10},on:{"input-filter":_vm.inputFilter,"input-file":_vm.inputFile},model:{value:(_vm.files),callback:function ($$v) {_vm.files=$$v},expression:"files"}},[_c('i',{staticClass:"fa fa-plus"}),_vm._v("\n        Select files\n      ")]),(!_vm.$refs.upload || !_vm.$refs.upload.active)?_c('button',{staticClass:"btn btn-success",attrs:{"type":"button"},on:{"click":function($event){$event.preventDefault();_vm.$refs.upload.active = true}}},[_c('i',{staticClass:"fa fa-arrow-up",attrs:{"aria-hidden":"true"}}),_vm._v("\n        Start Upload\n      ")]):_c('button',{staticClass:"btn btn-danger",attrs:{"type":"button"},on:{"click":function($event){$event.preventDefault();_vm.$refs.upload.active = false}}},[_c('i',{staticClass:"fa fa-stop",attrs:{"aria-hidden":"true"}}),_vm._v("\n        Stop Upload\n      ")])],1)]),_vm._m(0)])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"pt-5"},[_vm._v("\n    Source code: "),_c('a',{attrs:{"href":"https://github.com/lian-yue/vue-upload-component/blob/master/docs/views/examples/Simple.vue"}},[_vm._v("/docs/views/examples/Simple.vue")])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_Avatar_vue__ = __webpack_require__(15);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1c6ae484_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Avatar_vue__ = __webpack_require__(57);
function injectStyle (ssrContext) {
  __webpack_require__(55)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_Avatar_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1c6ae484_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Avatar_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(56);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("32897e8b", content, true, {});

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, ".example-avatar .avatar-upload .rounded-circle{width:200px;height:200px}.example-avatar .text-center .btn{margin:0 .5rem}.example-avatar .avatar-edit-image{max-width:100%}.example-avatar .drop-active{top:0;bottom:0;right:0;left:0;position:fixed;z-index:9999;opacity:.6;text-align:center;background:#000}.example-avatar .drop-active h3{margin:-.5em 0 0;position:absolute;top:50%;left:0;right:0;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);font-size:40px;color:#fff;padding:0}", ""]);

// exports


/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"example-avatar"},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.$refs.upload && _vm.$refs.upload.dropActive),expression:"$refs.upload && $refs.upload.dropActive"}],staticClass:"drop-active"},[_c('h3',[_vm._v("Drop files to upload")])]),_c('div',{directives:[{name:"show",rawName:"v-show",value:(!_vm.edit),expression:"!edit"}],staticClass:"avatar-upload"},[_c('div',{staticClass:"text-center p-2"},[_c('label',{attrs:{"for":"avatar"}},[_c('img',{staticClass:"rounded-circle",attrs:{"src":_vm.files.length ? _vm.files[0].url : 'https://www.gravatar.com/avatar/default?s=200&r=pg&d=mm'}}),_vm._m(0)])]),_c('div',{staticClass:"text-center p-2"},[_c('file-upload',{ref:"upload",staticClass:"btn btn-primary",attrs:{"extensions":"gif,jpg,jpeg,png,webp","accept":"image/png,image/gif,image/jpeg,image/webp","name":"avatar","post-action":"/upload/post","drop":!_vm.edit},on:{"input-filter":_vm.inputFilter,"input-file":_vm.inputFile},model:{value:(_vm.files),callback:function ($$v) {_vm.files=$$v},expression:"files"}},[_vm._v("\n        Upload avatar\n      ")])],1)]),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.files.length && _vm.edit),expression:"files.length && edit"}],staticClass:"avatar-edit"},[(_vm.files.length)?_c('div',{staticClass:"avatar-edit-image"},[_c('img',{ref:"editImage",attrs:{"src":_vm.files[0].url}})]):_vm._e(),_c('div',{staticClass:"text-center p-4"},[_c('button',{staticClass:"btn btn-secondary",attrs:{"type":"button"},on:{"click":function($event){$event.preventDefault();_vm.$refs.upload.clear($event)}}},[_vm._v("Cancel")]),_c('button',{staticClass:"btn btn-primary",attrs:{"type":"submit"},on:{"click":function($event){$event.preventDefault();_vm.editSave($event)}}},[_vm._v("Save")])])]),_vm._m(1)])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('h4',{staticClass:"pt-2"},[_vm._v("or"),_c('br'),_vm._v("Drop files anywhere to upload")])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"pt-5"},[_vm._v("\n    Source code: "),_c('a',{attrs:{"href":"https://github.com/lian-yue/vue-upload-component/blob/master/docs/views/examples/Avatar.vue"}},[_vm._v("/docs/views/examples/Avatar.vue")])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_Drag_vue__ = __webpack_require__(16);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_503a4dd5_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Drag_vue__ = __webpack_require__(61);
function injectStyle (ssrContext) {
  __webpack_require__(59)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_Drag_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_503a4dd5_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Drag_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(60);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("06c66da9", content, true, {});

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, ".example-drag label.btn{margin-bottom:0;margin-right:1rem}.example-drag .drop-active{top:0;bottom:0;right:0;left:0;position:fixed;z-index:9999;opacity:.6;text-align:center;background:#000}.example-drag .drop-active h3{margin:-.5em 0 0;position:absolute;top:50%;left:0;right:0;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);font-size:40px;color:#fff;padding:0}", ""]);

// exports


/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"example-drag"},[_c('div',{staticClass:"upload"},[(_vm.files.length)?_c('ul',_vm._l((_vm.files),function(file,index){return _c('li',{key:file.id},[_c('span',[_vm._v(_vm._s(file.name))]),_vm._v(" -\n        "),_c('span',[_vm._v(_vm._s(_vm._f("formatSize")(file.size)))]),_vm._v(" -\n        "),(file.error)?_c('span',[_vm._v(_vm._s(file.error))]):(file.success)?_c('span',[_vm._v("success")]):(file.active)?_c('span',[_vm._v("active")]):(file.active)?_c('span',[_vm._v("active")]):_c('span')])})):_c('ul',[_vm._m(0)]),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.$refs.upload && _vm.$refs.upload.dropActive),expression:"$refs.upload && $refs.upload.dropActive"}],staticClass:"drop-active"},[_c('h3',[_vm._v("Drop files to upload")])]),_c('div',{staticClass:"example-btn"},[_c('file-upload',{ref:"upload",staticClass:"btn btn-primary",attrs:{"post-action":"/upload/post","multiple":true,"drop":true,"drop-directory":true},model:{value:(_vm.files),callback:function ($$v) {_vm.files=$$v},expression:"files"}},[_c('i',{staticClass:"fa fa-plus"}),_vm._v("\n        Select files\n      ")]),(!_vm.$refs.upload || !_vm.$refs.upload.active)?_c('button',{staticClass:"btn btn-success",attrs:{"type":"button"},on:{"click":function($event){$event.preventDefault();_vm.$refs.upload.active = true}}},[_c('i',{staticClass:"fa fa-arrow-up",attrs:{"aria-hidden":"true"}}),_vm._v("\n        Start Upload\n      ")]):_c('button',{staticClass:"btn btn-danger",attrs:{"type":"button"},on:{"click":function($event){$event.preventDefault();_vm.$refs.upload.active = false}}},[_c('i',{staticClass:"fa fa-stop",attrs:{"aria-hidden":"true"}}),_vm._v("\n        Stop Upload\n      ")])],1)]),_vm._m(1)])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('td',{attrs:{"colspan":"7"}},[_c('div',{staticClass:"text-center p-5"},[_c('h4',[_vm._v("Drop files anywhere to upload"),_c('br'),_vm._v("or")]),_c('label',{staticClass:"btn btn-lg btn-primary",attrs:{"for":"file"}},[_vm._v("Select Files")])])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"pt-5"},[_vm._v("\n    Source code: "),_c('a',{attrs:{"href":"https://github.com/lian-yue/vue-upload-component/blob/master/docs/views/examples/Drag.vue"}},[_vm._v("/docs/views/examples/Drag.vue")])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_Multiple_vue__ = __webpack_require__(17);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d796f814_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Multiple_vue__ = __webpack_require__(65);
function injectStyle (ssrContext) {
  __webpack_require__(63)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_Multiple_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_d796f814_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Multiple_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(64);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("fd4d0ee4", content, true, {});

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, ".example-multiple label.btn{margin-bottom:0;margin-right:1rem}.example-multiple .upload{margin-bottom:1rem}", ""]);

// exports


/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"example-multiple"},[_c('h1',{staticClass:"example-title",attrs:{"id":"example-title"}},[_vm._v("Multiple instances")]),_c('div',{staticClass:"upload"},[_c('ul',_vm._l((_vm.files1),function(file,index){return _c('li',{key:file.id},[_c('span',[_vm._v(_vm._s(file.name))]),_vm._v(" -\n        "),_c('span',[_vm._v(_vm._s(_vm._f("formatSize")(file.size)))]),_vm._v(" -\n        "),(file.error)?_c('span',[_vm._v(_vm._s(file.error))]):(file.success)?_c('span',[_vm._v("success")]):(file.active)?_c('span',[_vm._v("active")]):(file.active)?_c('span',[_vm._v("active")]):_c('span')])})),_c('div',{staticClass:"example-btn"},[_c('file-upload',{ref:"upload1",staticClass:"btn btn-primary",attrs:{"input-id":"file1","post-action":"/upload/post"},model:{value:(_vm.files1),callback:function ($$v) {_vm.files1=$$v},expression:"files1"}},[_c('i',{staticClass:"fa fa-plus"}),_vm._v("\n        Select files\n      ")]),_c('label',{staticClass:"btn btn-primary",attrs:{"for":"file1"}},[_vm._v("Label Select files")]),(!_vm.$refs.upload1 || !_vm.$refs.upload1.active)?_c('button',{staticClass:"btn btn-success",attrs:{"type":"button"},on:{"click":function($event){$event.preventDefault();_vm.$refs.upload1.active = true}}},[_c('i',{staticClass:"fa fa-arrow-up",attrs:{"aria-hidden":"true"}}),_vm._v("\n        Start Upload\n      ")]):_c('button',{staticClass:"btn btn-danger",attrs:{"type":"button"},on:{"click":function($event){$event.preventDefault();_vm.$refs.upload1.active = false}}},[_c('i',{staticClass:"fa fa-stop",attrs:{"aria-hidden":"true"}}),_vm._v("\n        Stop Upload\n      ")])],1)]),_c('div',{staticClass:"upload"},[_c('ul',_vm._l((_vm.files2),function(file,index){return _c('li',{key:file.id},[_c('span',[_vm._v(_vm._s(file.name))]),_vm._v(" -\n        "),_c('span',[_vm._v(_vm._s(_vm._f("formatSize")(file.size)))]),_vm._v(" -\n        "),(file.error)?_c('span',[_vm._v(_vm._s(file.error))]):(file.success)?_c('span',[_vm._v("success")]):(file.active)?_c('span',[_vm._v("active")]):(file.active)?_c('span',[_vm._v("active")]):_c('span')])})),_c('div',{staticClass:"example-btn"},[_c('file-upload',{ref:"upload2",staticClass:"btn btn-primary",attrs:{"input-id":"file2","post-action":"/upload/post"},model:{value:(_vm.files2),callback:function ($$v) {_vm.files2=$$v},expression:"files2"}},[_c('i',{staticClass:"fa fa-plus"}),_vm._v("\n        Select files\n      ")]),_c('label',{staticClass:"btn btn-primary",attrs:{"for":"file2"}},[_vm._v("Label Select files")]),(!_vm.$refs.upload2 || !_vm.$refs.upload2.active)?_c('button',{staticClass:"btn btn-success",attrs:{"type":"button"},on:{"click":function($event){$event.preventDefault();_vm.$refs.upload2.active = true}}},[_c('i',{staticClass:"fa fa-arrow-up",attrs:{"aria-hidden":"true"}}),_vm._v("\n        Start Upload\n      ")]):_c('button',{staticClass:"btn btn-danger",attrs:{"type":"button"},on:{"click":function($event){$event.preventDefault();_vm.$refs.upload2.active = false}}},[_c('i',{staticClass:"fa fa-stop",attrs:{"aria-hidden":"true"}}),_vm._v("\n        Stop Upload\n      ")])],1)]),_vm._m(0)])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"pt-5"},[_vm._v("\n    Source code: "),_c('a',{attrs:{"href":"https://github.com/lian-yue/vue-upload-component/blob/master/docs/views/examples/Multiple.vue"}},[_vm._v("/docs/views/examples/Multiple.vue")])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_Chunk_vue__ = __webpack_require__(18);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2e13353d_hasScoped_true_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Chunk_vue__ = __webpack_require__(71);
function injectStyle (ssrContext) {
  __webpack_require__(67)
  __webpack_require__(69)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-2e13353d"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_Chunk_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_2e13353d_hasScoped_true_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Chunk_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(68);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("28b43249", content, true, {});

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, ".example-simple label.btn{margin-bottom:0;margin-right:1rem}", ""]);

// exports


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(70);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("7acda8fe", content, true, {});

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, ".chunk-loading[data-v-2e13353d]{margin:-12px;display:flex;width:calc(100% + 24px)}.chunk-loading .chunk-loading-part[data-v-2e13353d]{height:25px;line-height:25px;flex:1;background:#ccc;font-size:14px;color:#fff;text-align:center}.chunk-loading .chunk-loading-part.chunk-loading-part__uploaded[data-v-2e13353d]{background:#28a745}", ""]);

// exports


/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"example-simple"},[_c('h1',{staticClass:"example-title",attrs:{"id":"example-title"}},[_vm._v("Chunk Upload Example")]),_c('p',[_vm._v("When using chunk uploads, the file will be uploaded in different parts (or chunks). All the files with a size higher than the set in the input will be uploaded using this method.")]),_vm._m(0),_c('p',[_vm._v("You can also pause / resume the upload process.")]),_c('div',{staticClass:"upload"},[_c('div',{staticClass:"form-horizontal"},[_c('div',{staticClass:"form-group"},[_c('div',{staticClass:"col-sm-offset-2 col-sm-10"},[_c('div',{staticClass:"checkbox"},[_c('label',[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.chunkEnabled),expression:"chunkEnabled"}],attrs:{"type":"checkbox"},domProps:{"checked":Array.isArray(_vm.chunkEnabled)?_vm._i(_vm.chunkEnabled,null)>-1:(_vm.chunkEnabled)},on:{"change":function($event){var $$a=_vm.chunkEnabled,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.chunkEnabled=$$a.concat([$$v]))}else{$$i>-1&&(_vm.chunkEnabled=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}}else{_vm.chunkEnabled=$$c}}}}),_vm._v(" Use chunk upload\n            ")])])])]),_c('div',{staticClass:"form-group"},[_c('label',{staticClass:"col-sm-2 control-label",attrs:{"for":"inputMinSize"}},[_vm._v("Min Size")]),_c('div',{staticClass:"col-sm-10"},[_c('div',{staticClass:"input-group"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.chunkMinSize),expression:"chunkMinSize"}],staticClass:"form-control",attrs:{"id":"inputMinSize","type":"number"},domProps:{"value":(_vm.chunkMinSize)},on:{"input":function($event){if($event.target.composing){ return; }_vm.chunkMinSize=$event.target.value}}}),_c('span',{staticClass:"input-group-addon"},[_vm._v("MB")])])])]),_c('div',{staticClass:"form-group"},[_c('label',{staticClass:"col-sm-2 control-label",attrs:{"for":"inputMaxActive"}},[_vm._v("Max Active Chunks")]),_c('div',{staticClass:"col-sm-10"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.chunkMaxActive),expression:"chunkMaxActive"}],staticClass:"form-control",attrs:{"id":"inputMaxActive","type":"number"},domProps:{"value":(_vm.chunkMaxActive)},on:{"input":function($event){if($event.target.composing){ return; }_vm.chunkMaxActive=$event.target.value}}})])]),_c('div',{staticClass:"form-group"},[_c('label',{staticClass:"col-sm-2 control-label",attrs:{"for":"inputMaxRetries"}},[_vm._v("Max Chunk Retries")]),_c('div',{staticClass:"col-sm-10"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.chunkMaxRetries),expression:"chunkMaxRetries"}],staticClass:"form-control",attrs:{"id":"inputMaxRetries","type":"number"},domProps:{"value":(_vm.chunkMaxRetries)},on:{"input":function($event){if($event.target.composing){ return; }_vm.chunkMaxRetries=$event.target.value}}})])])]),_c('table',{staticClass:"table table-striped table-condensed"},[_vm._m(1),_c('tbody',[_vm._l((_vm.files),function(file){return [_c('tr',{key:file.id + '-info'},[_c('td',[_vm._v(_vm._s(file.name))]),_c('td',{staticClass:"text-right"},[_vm._v(_vm._s(_vm._f("formatSize")(file.size)))]),_c('td',{staticClass:"text-right"},[_vm._v(_vm._s(file.progress)+"%")]),(file.error)?_c('td',[_vm._v(_vm._s(file.error))]):(file.success)?_c('td',[_vm._v("Success")]):(file.active)?_c('td',[_vm._v("Active")]):_c('td',[_vm._v(" - ")]),_c('td',[(file.chunk)?[(file.active)?_c('button',{staticClass:"btn btn-sm btn-danger",on:{"click":function($event){file.chunk.pause()}}},[_c('i',{staticClass:"fa fa-pause"})]):_vm._e(),(!file.active && file.chunk.hasChunksToUpload)?_c('button',{staticClass:"btn btn-sm btn-primary",on:{"click":function($event){file.chunk.resume()}}},[_c('i',{staticClass:"fa fa-play"})]):_vm._e()]:_vm._e()],2),(file.chunk)?[_c('td',{staticClass:"text-right"},[_vm._v(_vm._s(file.chunk.chunks.length))]),_c('td',{staticClass:"text-right"},[_vm._v(_vm._s(file.chunk.chunksUploading.length))]),_c('td',{staticClass:"text-right"},[_vm._v(_vm._s(file.chunk.chunksUploaded.length))])]:[_c('td',{staticClass:"text-right"},[_vm._v(" - ")]),_c('td',{staticClass:"text-right"},[_vm._v(" - ")]),_c('td',{staticClass:"text-right"},[_vm._v(" - ")])]],2),_c('tr',{key:file.id + '-loading'},[_c('td',{attrs:{"colspan":"8"}},[(file.chunk)?_c('div',{staticClass:"chunk-loading"},_vm._l((file.chunk.chunks),function(chunk,index){return _c('span',{key:index,staticClass:"chunk-loading-part",class:{'chunk-loading-part__uploaded': chunk.uploaded}},[(chunk.retries != file.chunk.maxRetries)?[_vm._v("\n                    "+_vm._s(file.chunk.maxRetries - chunk.retries)+" error(s)\n                  ")]:_vm._e()],2)})):_vm._e()])])]})],2)]),_c('div',{staticClass:"example-btn"},[_c('file-upload',{ref:"upload",staticClass:"btn btn-primary",attrs:{"post-action":"/upload/post","chunk-enabled":_vm.chunkEnabled,"chunk":{
          action: '/upload/chunk',
          minSize: _vm.chunkMinSize * 1048576,
          maxActive: _vm.chunkMaxActive,
          maxRetries: _vm.chunkMaxRetries
        },"extensions":"gif,jpg,jpeg,png,webp","accept":"image/png,image/gif,image/jpeg,image/webp","multiple":true,"size":1024 * 1024 * 10},on:{"input-filter":_vm.inputFilter,"input-file":_vm.inputFile},model:{value:(_vm.files),callback:function ($$v) {_vm.files=$$v},expression:"files"}},[_c('i',{staticClass:"fa fa-plus"}),_vm._v("\n        Select files\n      ")])],1)]),_vm._m(2)])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('p',[_vm._v("You will be able to see the different parts being uploaded individually. Some parts might fail, and the package is prepared to "),_c('em',[_vm._v("retry")]),_vm._v(" up to a certain amount of times.")])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('thead',{staticClass:"thead-dark"},[_c('tr',[_c('th',[_vm._v("Name")]),_c('th',{staticClass:"text-right"},[_vm._v("Size")]),_c('th',{staticClass:"text-right"},[_vm._v("Progress")]),_c('th',[_vm._v("Status")]),_c('th',[_vm._v("Pause")]),_c('th',{staticClass:"text-center",attrs:{"colspan":"3"}},[_vm._v("Chunks")])]),_c('tr',[_c('th',{attrs:{"colspan":"5"}}),_c('th',{staticClass:"text-right"},[_vm._v("Total")]),_c('th',{staticClass:"text-right"},[_vm._v("Active")]),_c('th',{staticClass:"text-right"},[_vm._v("Completed")])])])},function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"pt-5"},[_vm._v("\n    Source code: "),_c('a',{attrs:{"href":"https://github.com/lian-yue/vue-upload-component/blob/master/docs/views/examples/Chunk.vue"}},[_vm._v("/docs/views/examples/Chunk.vue")])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_Vuex_vue__ = __webpack_require__(19);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_df415d08_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Vuex_vue__ = __webpack_require__(75);
function injectStyle (ssrContext) {
  __webpack_require__(73)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_Vuex_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_df415d08_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Vuex_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(74);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("72c8f186", content, true, {});

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, ".example-vuex label.btn{margin-bottom:0;margin-right:1rem}", ""]);

// exports


/***/ }),
/* 75 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"example-vuex"},[_c('h1',{staticClass:"example-title",attrs:{"id":"example-title"}},[_vm._v("Vuex Example")]),_c('div',{staticClass:"upload"},[_c('ul',_vm._l((_vm.files),function(file,index){return _c('li',{key:file.id},[_c('span',[_vm._v(_vm._s(file.name))]),_vm._v(" -\n        "),_c('span',[_vm._v(_vm._s(_vm._f("formatSize")(file.size)))]),_vm._v(" -\n        "),(file.error)?_c('span',[_vm._v(_vm._s(file.error))]):(file.success)?_c('span',[_vm._v("success")]):(file.active)?_c('span',[_vm._v("active")]):(file.active)?_c('span',[_vm._v("active")]):_c('span')])})),_c('div',{staticClass:"example-btn"},[_c('file-upload',{ref:"upload",staticClass:"btn btn-primary",attrs:{"post-action":"/upload/post","extensions":"gif,jpg,jpeg,png,webp","accept":"image/png,image/gif,image/jpeg,image/webp","multiple":true,"size":1024 * 1024 * 10,"value":_vm.files},on:{"input":_vm.inputUpdate}},[_c('i',{staticClass:"fa fa-plus"}),_vm._v("\n        Select files\n      ")]),(!_vm.$refs.upload || !_vm.$refs.upload.active)?_c('button',{staticClass:"btn btn-success",attrs:{"type":"button"},on:{"click":function($event){$event.preventDefault();_vm.$refs.upload.active = true}}},[_c('i',{staticClass:"fa fa-arrow-up",attrs:{"aria-hidden":"true"}}),_vm._v("\n        Start Upload\n      ")]):_c('button',{staticClass:"btn btn-danger",attrs:{"type":"button"},on:{"click":function($event){$event.preventDefault();_vm.$refs.upload.active = false}}},[_c('i',{staticClass:"fa fa-stop",attrs:{"aria-hidden":"true"}}),_vm._v("\n        Stop Upload\n      ")])],1)]),_vm._m(0)])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"pt-5"},[_vm._v("\n    Source code: "),_c('a',{attrs:{"href":"https://github.com/lian-yue/vue-upload-component/blob/master/docs/views/examples/Vuex.vue"}},[_vm._v("/docs/views/examples/Vuex.vue")]),_vm._v(", "),_c('a',{attrs:{"href":"https://github.com/lian-yue/vue-upload-component/blob/master/docs/store.js"}},[_vm._v("/docs/store.js")])])}]
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__ = __webpack_require__(20);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_95eafede_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__ = __webpack_require__(79);
function injectStyle (ssrContext) {
  __webpack_require__(77)
}
var normalizeComponent = __webpack_require__(0)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_presets_env_modules_false_stage_0_plugins_transform_runtime_helpers_false_polyfill_false_regenerator_true_moduleName_babel_runtime_cacheDirectory_false_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_95eafede_hasScoped_false_preserveWhitespace_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(78);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("71f172a9", content, true, {});

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "#header{position:-webkit-sticky;position:sticky;top:0;z-index:1071}#sidebar{background:#fff;border-right:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5}@media (min-width:768px){#sidebar{position:-webkit-sticky;position:sticky;top:3.5rem;z-index:1000;max-height:calc(100vh - 3.5rem);border-right:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5}}#sidebar-nav{padding-top:1rem;padding-bottom:1rem;margin-right:-15px;margin-left:-15px;max-height:100%;overflow-y:auto}#sidebar-nav .nav{display:block}#sidebar-nav .nav .nav-item .nav{display:none;margin-bottom:1rem}#sidebar-nav .nav .active+.nav,#sidebar-nav .nav .nav-item.active .nav{display:block}@media (min-width:768px){#sidebar-nav .nav .nav-item .nav{display:block}}#sidebar-nav .nav .active>.nav-link,#sidebar-nav .nav .nav-link.active{color:#262626;font-weight:500}#sidebar-nav .nav-item .nav-link{padding:.25rem 1rem;font-weight:500;color:#666}#sidebar-nav .nav-item .nav-item .nav-link{font-weight:400;font-size:85%;margin-left:1rem}#main{padding-top:1rem;margin-bottom:2rem}blockquote{margin-bottom:1rem;font-size:1.25rem;padding:0 1em;color:#6a737d;border-left:.25em solid #dfe2e5}pre{padding:16px;overflow:auto;font-size:85%;line-height:1.45;background-color:#f6f8fa;border-radius:3px}.modal-backdrop.fade{visibility:hidden}.modal-backdrop.fade.show{visibility:visible}.fade.show{display:block;z-index:1072}", ""]);

// exports


/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('header',{staticClass:"navbar navbar-expand-lg navbar-dark bg-dark",attrs:{"id":"header"}},[_c('router-link',{staticClass:"navbar-brand",attrs:{"exact":true,"to":_vm._f("toLocale")('/')}},[_vm._v(_vm._s(_vm.$t('header.logo')))]),_c('button',{staticClass:"navbar-toggler",attrs:{"type":"button"},on:{"click":function($event){$event.preventDefault();_vm.showNav = !_vm.showNav}}},[_c('span',{staticClass:"navbar-toggler-icon"})]),_c('nav',{class:{collapse: true, 'navbar-collapse': true, show: _vm.showNav},attrs:{"id":"navbar"}},[_c('ul',{staticClass:"navbar-nav"},[_c('li',{staticClass:"nav-item"},[_c('router-link',{class:'nav-link' + (_vm.$route.path === '/' ? ' active' : ''),attrs:{"active-class":"active","exact":true,"to":_vm._f("toLocale")('/')}},[_vm._v(_vm._s(_vm.$t('header.home')))])],1),_c('li',{staticClass:"nav-item"},[_c('router-link',{staticClass:"nav-link",attrs:{"active-class":"active","to":_vm._f("toLocale")('/documents')}},[_vm._v(_vm._s(_vm.$t('header.documents')))])],1),_c('li',{staticClass:"nav-item"},[_c('router-link',{staticClass:"nav-link",attrs:{"active-class":"active","to":_vm._f("toLocale")('/examples')}},[_vm._v(_vm._s(_vm.$t('header.examples')))])],1),_c('li',{staticClass:"nav-item"},[_c('a',{staticClass:"nav-link",attrs:{"rel":"license noopener","href":"https://www.lianyue.org","target":"_blank"}},[_vm._v(_vm._s(_vm.$t('header.blog')))])])]),_c('ul',{staticClass:"navbar-nav ml-md-auto"},[_c('li',{staticClass:"nav-item dropdown"},[_c('a',{staticClass:"nav-link dropdown-toggle",attrs:{"href":"#"},on:{"click":function($event){$event.preventDefault();_vm.onLocale(true)},"focus":function($event){_vm.onLocale(true)},"blur":function($event){_vm.onLocale(false)}}},[_vm._v("\n            "+_vm._s(_vm.$t('header.locale'))+"\n          ")]),_c('div',{class:{'dropdown-menu': true, show: _vm.showLocale},on:{"blur":function($event){_vm.onLocale(false)}}},_vm._l((_vm.locale),function(value,name){return _c('router-link',{key:name,staticClass:"dropdown-item",attrs:{"to":'/' + name + (_vm.$route.params.locale ? _vm.$route.fullPath.substr(_vm.$route.params.locale.length + 1) : _vm.$route.fullPath)}},[_vm._v(_vm._s(value))])}))]),_c('li',{staticClass:"nav-item"},[_c('a',{staticClass:"nav-link",attrs:{"href":"https://github.com/lian-yue/vue-upload-component/issues"}},[_vm._v("\n            "+_vm._s(_vm.$t('header.issues'))+"\n          ")])]),_c('li',{staticClass:"nav-item"},[_c('a',{staticClass:"nav-link",attrs:{"href":"https://github.com/lian-yue/vue-upload-component"}},[_vm._v("\n            "+_vm._s(_vm.$t('header.github'))+"\n          ")])])])])],1),_c('router-view')],1)}
var staticRenderFns = []
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map