"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkfrontend"] = self["webpackChunkfrontend"] || []).push([["src_components_Room_js"],{

/***/ "./src/components/Room.js":
/*!********************************!*\
  !*** ./src/components/Room.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ RoomWrapper)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ \"./node_modules/react-router/esm/react-router.js\");\n\n\nclass Room extends react__WEBPACK_IMPORTED_MODULE_0__.Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      votesToSkip: 2,\n      guestCanPause: false,\n      isHost: false\n    };\n    this.roomCode = this.props.roomCode;\n    this.getRoomDetails();\n  }\n  getRoomDetails() {\n    fetch(\"/api/get-room\" + \"?code=\" + this.roomCode).then(response => response.json()).then(data => {\n      this.setState({\n        votesToSkip: data.votes_to_skip,\n        guestCanPause: data.guest_can_pause,\n        isHost: data.is_host\n      });\n    });\n  }\n  render() {\n    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"div\", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"h3\", null, this.roomCode), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"p\", null, \"Votes: \", this.state.votesToSkip), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"p\", null, \"Guest Can Pause: \", this.state.guestCanPause.toString()), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(\"p\", null, \"Host: \", this.state.isHost.toString()));\n  }\n}\nfunction RoomWrapper() {\n  const {\n    roomCode\n  } = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_1__.useParams)();\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0__.createElement(Room, {\n    roomCode: roomCode\n  });\n}\n\n//# sourceURL=webpack://frontend/./src/components/Room.js?");

/***/ })

}]);