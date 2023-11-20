/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/test/faceDetect.js":
/*!********************************!*\
  !*** ./src/test/faceDetect.js ***!
  \********************************/
/***/ (() => {

eval("// Function to detect faces\r\nasync function detectFaces() {\r\n    // Load the models\r\n    await Promise.all([\r\n      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),\r\n      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),\r\n      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),\r\n      faceapi.nets.faceExpressionNet.loadFromUri('/models')\r\n    ]);\r\n\r\n    // Get the canvas and video elements\r\n    const canvas = document.getElementById('canvas');\r\n    const video = document.getElementById('video');\r\n\r\n    // Load the video stream\r\n    navigator.mediaDevices.getUserMedia({ video: true })\r\n      .then(function (stream) {\r\n        video.srcObject = stream;\r\n      })\r\n      .catch(function (error) {\r\n        console.log(\"Error accessing the camera: \" + error);\r\n      });\r\n\r\n    // Detect faces in the video stream\r\n    video.addEventListener('play', () => {\r\n      const displaySize = { width: video.width, height: video.height };\r\n      faceapi.matchDimensions(canvas, displaySize);\r\n\r\n      setInterval(async () => {\r\n        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();\r\n        const resizedDetections = faceapi.resizeResults(detections, displaySize);\r\n        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);\r\n        faceapi.draw.drawDetections(canvas, resizedDetections);\r\n        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);\r\n        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);\r\n      }, 100);\r\n    });\r\n  }\r\n\r\n  // Call the detectFaces function when the page finishes loading\r\n  window.onload = function () {\r\n    detectFaces();\r\n  };\r\n\n\n//# sourceURL=webpack://moments/./src/test/faceDetect.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/test/faceDetect.js"]();
/******/ 	
/******/ })()
;