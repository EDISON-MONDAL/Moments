/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/test/sharescreen.js":
/*!*********************************!*\
  !*** ./src/test/sharescreen.js ***!
  \*********************************/
/***/ (() => {

eval("/*\r\n *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.\r\n *\r\n *  Use of this source code is governed by a BSD-style license\r\n *  that can be found in the LICENSE file in the root of the source\r\n *  tree.\r\n */\r\n\r\n\r\nconst preferredDisplaySurface = document.getElementById('displaySurface');\r\nconst startButton = document.getElementById('startButton');\r\n\r\nif (adapter.browserDetails.browser === 'chrome' &&\r\n    adapter.browserDetails.version >= 107) {\r\n  // See https://developer.chrome.com/docs/web-platform/screen-sharing-controls/\r\n  document.getElementById('options').style.display = 'block';\r\n} else if (adapter.browserDetails.browser === 'firefox') {\r\n  // Polyfill in Firefox.\r\n  // See https://blog.mozilla.org/webrtc/getdisplaymedia-now-available-in-adapter-js/\r\n  adapter.browserShim.shimGetDisplayMedia(window, 'screen');\r\n}\r\n\r\nfunction handleSuccess(stream) {\r\n  startButton.disabled = true;\r\n  preferredDisplaySurface.disabled = true;\r\n  const video = document.querySelector('video');\r\n  video.srcObject = stream;\r\n\r\n  // demonstrates how to detect that the user has stopped\r\n  // sharing the screen via the browser UI.\r\n  stream.getVideoTracks()[0].addEventListener('ended', () => {\r\n    errorMsg('The user has ended sharing the screen');\r\n    startButton.disabled = false;\r\n    preferredDisplaySurface.disabled = false;\r\n  });\r\n}\r\n\r\nfunction handleError(error) {\r\n  errorMsg(`getDisplayMedia error: ${error.name}`, error);\r\n}\r\n\r\nfunction errorMsg(msg, error) {\r\n  const errorElement = document.querySelector('#errorMsg');\r\n  errorElement.innerHTML += `<p>${msg}</p>`;\r\n  if (typeof error !== 'undefined') {\r\n    console.error(error);\r\n  }\r\n}\r\n\r\n\r\nstartButton.addEventListener('click', () => {\r\n  const options = {audio: true, video: true};\r\n  /*\r\n  const displaySurface = preferredDisplaySurface.options[preferredDisplaySurface.selectedIndex].value;\r\n  if (displaySurface !== 'default') {\r\n    options.video = {displaySurface};\r\n  }\r\n  */\r\n  navigator.mediaDevices.getDisplayMedia(options)\r\n      .then(handleSuccess, handleError);\r\n});\r\n\r\nif ((navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices)) {\r\n  startButton.disabled = false;\r\n} else {\r\n  errorMsg('getDisplayMedia is not supported');\r\n}\n\n//# sourceURL=webpack://moments/./src/test/sharescreen.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/test/sharescreen.js"]();
/******/ 	
/******/ })()
;