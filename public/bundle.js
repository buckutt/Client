/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "61c507b184943efdd8fc"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				fn[name] = __webpack_require__[name];
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/* global window, componentHandler */
	
	// Styles
	
	var _Object, _Object2;
	
	__webpack_require__(2);
	
	__webpack_require__(6);
	
	__webpack_require__(8);
	
	__webpack_require__(10);
	
	__webpack_require__(12);
	
	__webpack_require__(14);
	
	__webpack_require__(16);
	
	__webpack_require__(18);
	
	__webpack_require__(20);
	
	__webpack_require__(21);
	
	var _filters = __webpack_require__(30);
	
	var _filters2 = _interopRequireDefault(_filters);
	
	var _vue = __webpack_require__(32);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _articles = __webpack_require__(35);
	
	var _articles2 = _interopRequireDefault(_articles);
	
	var _connection = __webpack_require__(39);
	
	var _connection2 = _interopRequireDefault(_connection);
	
	var _promotions = __webpack_require__(48);
	
	var _promotions2 = _interopRequireDefault(_promotions);
	
	var _reloads = __webpack_require__(51);
	
	var _reloads2 = _interopRequireDefault(_reloads);
	
	var _sendBasket = __webpack_require__(54);
	
	var _sendBasket2 = _interopRequireDefault(_sendBasket);
	
	var _initTabs = __webpack_require__(57);
	
	var _initTabs2 = _interopRequireDefault(_initTabs);
	
	var _error = __webpack_require__(58);
	
	var _error2 = _interopRequireDefault(_error);
	
	var _tabs = __webpack_require__(59);
	
	var _tabs2 = _interopRequireDefault(_tabs);
	
	var _dataLoader = __webpack_require__(60);
	
	var _dataLoader2 = _interopRequireDefault(_dataLoader);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var data = {
	    startedLoading: false,
	    config: {}
	};
	
	var methods = {};
	
	var values = function values(obj) {
	    return Object.keys(obj).map(function (k) {
	        return obj[k];
	    });
	};
	
	var modules = []; // articles, filterBestPrice, filterPoint
	// connection, authInput, ejecter
	// promotions, promotionsEvents
	// askReload, reloadMenu
	// doubleValidation, sendBasket
	
	modules.push(values(_articles2.default));
	modules.push(values(_connection2.default));
	modules.push(values(_promotions2.default));
	modules.push(values(_reloads2.default));
	modules.push(values(_sendBasket2.default));
	modules.push(_initTabs2.default);
	modules.push(_error2.default);
	modules.push(_tabs2.default);
	modules.push(_dataLoader2.default);
	
	// Get only modules data
	var modulesDatas = modules.map(function (module) {
	    return module && module.data ? module.data : {};
	});
	var modulesMethods = modules.map(function (module) {
	    return module && module.methods ? module.methods : {};
	});
	
	// Merge all of it on data
	(_Object = Object).assign.apply(_Object, [data].concat(_toConsumableArray(modulesDatas)));
	(_Object2 = Object).assign.apply(_Object2, [methods].concat(_toConsumableArray(modulesMethods)));
	
	var app = new _vue2.default({
	    el: '#main',
	    data: data,
	    methods: methods
	});
	
	modules.forEach(function (module) {
	    if (module && typeof module.controller === 'function') {
	        module.controller(app);
	    }
	});
	
	componentHandler.upgradeAllRegistered();
	
	window.app = app;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(3, function() {
				var newContent = __webpack_require__(3);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports
	
	
	// module
	exports.push([module.id, "/**\n * material-design-lite - Material Design Components in CSS, JS and HTML\n * @version v1.0.6\n * @license Apache-2.0\n * @copyright 2015 Google, Inc.\n * @link https://github.com/google/material-design-lite\n */\n@charset \"UTF-8\";html{color:rgba(0,0,0,.87)}::-moz-selection{background:#b3d4fc;text-shadow:none}::selection{background:#b3d4fc;text-shadow:none}hr{display:block;height:1px;border:0;border-top:1px solid #ccc;margin:1em 0;padding:0}audio,canvas,iframe,img,svg,video{vertical-align:middle}fieldset{border:0;margin:0;padding:0}textarea{resize:vertical}.browserupgrade{margin:.2em 0;background:#ccc;color:#000;padding:.2em 0}.hidden{display:none!important}.visuallyhidden{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.visuallyhidden.focusable:active,.visuallyhidden.focusable:focus{clip:auto;height:auto;margin:0;overflow:visible;position:static;width:auto}.invisible{visibility:hidden}.clearfix:before,.clearfix:after{content:\" \";display:table}.clearfix:after{clear:both}@media print{*,*:before,*:after,*:first-letter,*:first-line{background:0 0!important;color:#000!important;box-shadow:none!important;text-shadow:none!important}a,a:visited{text-decoration:underline}a[href]:after{content:\" (\" attr(href)\")\"}abbr[title]:after{content:\" (\" attr(title)\")\"}a[href^=\"#\"]:after,a[href^=\"javascript:\"]:after{content:\"\"}pre,blockquote{border:1px solid #999;page-break-inside:avoid}thead{display:table-header-group}tr,img{page-break-inside:avoid}img{max-width:100%!important}p,h2,h3{orphans:3;widows:3}h2,h3{page-break-after:avoid}}a,.mdl-accordion,.mdl-button,.mdl-card,.mdl-checkbox,.mdl-dropdown-menu,.mdl-icon-toggle,.mdl-item,.mdl-radio,.mdl-slider,.mdl-switch,.mdl-tabs__tab{-webkit-tap-highlight-color:transparent;-webkit-tap-highlight-color:rgba(255,255,255,0)}html{width:100%;height:100%;-ms-touch-action:manipulation;touch-action:manipulation}body{width:100%;min-height:100%;margin:0}main{display:block}*[hidden]{display:none!important}html,body{font-family:\"Helvetica\",\"Arial\",sans-serif;font-size:14px;font-weight:400;line-height:20px}h1,h2,h3,h4,h5,h6,p{padding:0}h1 small,h2 small,h3 small,h4 small,h5 small,h6 small{font-family:\"Roboto\",\"Helvetica\",\"Arial\",sans-serif;font-weight:400;line-height:1.35;letter-spacing:-.02em;opacity:.54;font-size:.6em}h1{font-size:56px;line-height:1.35;letter-spacing:-.02em;margin:24px 0}h1,h2{font-family:\"Roboto\",\"Helvetica\",\"Arial\",sans-serif;font-weight:400}h2{font-size:45px;line-height:48px}h2,h3{margin:24px 0}h3{font-size:34px;line-height:40px}h3,h4{font-family:\"Roboto\",\"Helvetica\",\"Arial\",sans-serif;font-weight:400}h4{font-size:24px;line-height:32px;-moz-osx-font-smoothing:grayscale;margin:24px 0 16px}h5{font-size:20px;font-weight:500;line-height:1;letter-spacing:.02em}h5,h6{font-family:\"Roboto\",\"Helvetica\",\"Arial\",sans-serif;margin:24px 0 16px}h6{font-size:16px;letter-spacing:.04em}h6,p{font-weight:400;line-height:24px}p{font-size:14px;letter-spacing:0;margin:0 0 16px}a{color:#ff4081;font-weight:500}blockquote{font-family:\"Roboto\",\"Helvetica\",\"Arial\",sans-serif;position:relative;font-size:24px;font-weight:300;font-style:italic;line-height:1.35;letter-spacing:.08em}blockquote:before{position:absolute;left:-.5em;content:'\\201C'}blockquote:after{content:'\\201D';margin-left:-.05em}mark{background-color:#f4ff81}dt{font-weight:700}address{font-size:12px;line-height:1;font-style:normal}address,ul,ol{font-weight:400;letter-spacing:0}ul,ol{font-size:14px;line-height:24px}.mdl-typography--display-4,.mdl-typography--display-4-color-contrast{font-family:\"Roboto\",\"Helvetica\",\"Arial\",sans-serif;font-size:112px;font-weight:300;line-height:1;letter-spacing:-.04em}.mdl-typography--display-4-color-contrast{opacity:.54}.mdl-typography--display-3,.mdl-typography--display-3-color-contrast{font-family:\"Roboto\",\"Helvetica\",\"Arial\",sans-serif;font-size:56px;font-weight:400;line-height:1.35;letter-spacing:-.02em}.mdl-typography--display-3-color-contrast{opacity:.54}.mdl-typography--display-2,.mdl-typography--display-2-color-contrast{font-family:\"Roboto\",\"Helvetica\",\"Arial\",sans-serif;font-size:45px;font-weight:400;line-height:48px}.mdl-typography--display-2-color-contrast{opacity:.54}.mdl-typography--display-1,.mdl-typography--display-1-color-contrast{font-family:\"Roboto\",\"Helvetica\",\"Arial\",sans-serif;font-size:34px;font-weight:400;line-height:40px}.mdl-typography--display-1-color-contrast{opacity:.54}.mdl-typography--headline,.mdl-typography--headline-color-contrast{font-family:\"Roboto\",\"Helvetica\",\"Arial\",sans-serif;font-size:24px;font-weight:400;line-height:32px;-moz-osx-font-smoothing:grayscale}.mdl-typography--headline-color-contrast{opacity:.87}.mdl-typography--title,.mdl-typography--title-color-contrast{font-family:\"Roboto\",\"Helvetica\",\"Arial\",sans-serif;font-size:20px;font-weight:500;line-height:1;letter-spacing:.02em}.mdl-typography--title-color-contrast{opacity:.87}.mdl-typography--subhead,.mdl-typography--subhead-color-contrast{font-family:\"Roboto\",\"Helvetica\",\"Arial\",sans-serif;font-size:16px;font-weight:400;line-height:24px;letter-spacing:.04em}.mdl-typography--subhead-color-contrast{opacity:.87}.mdl-typography--body-2,.mdl-typography--body-2-color-contrast{font-size:14px;font-weight:700;line-height:24px;letter-spacing:0}.mdl-typography--body-2-color-contrast{opacity:.87}.mdl-typography--body-1,.mdl-typography--body-1-color-contrast{font-size:14px;font-weight:400;line-height:24px;letter-spacing:0}.mdl-typography--body-1-color-contrast{opacity:.87}.mdl-typography--body-2-force-preferred-font,.mdl-typography--body-2-force-preferred-font-color-contrast{font-family:\"Roboto\",\"Helvetica\",\"Arial\",sans-serif;font-size:14px;font-weight:500;line-height:24px;letter-spacing:0}.mdl-typography--body-2-force-preferred-font-color-contrast{opacity:.87}.mdl-typography--body-1-force-preferred-font,.mdl-typography--body-1-force-preferred-font-color-contrast{font-family:\"Roboto\",\"Helvetica\",\"Arial\",sans-serif;font-size:14px;font-weight:400;line-height:24px;letter-spacing:0}.mdl-typography--body-1-force-preferred-font-color-contrast{opacity:.87}.mdl-typography--caption,.mdl-typography--caption-force-preferred-font{font-size:12px;font-weight:400;line-height:1;letter-spacing:0}.mdl-typography--caption-force-preferred-font{font-family:\"Roboto\",\"Helvetica\",\"Arial\",sans-serif}.mdl-typography--caption-color-contrast,.mdl-typography--caption-force-preferred-font-color-contrast{font-size:12px;font-weight:400;line-height:1;letter-spacing:0;opacity:.54}.mdl-typography--caption-force-preferred-font-color-contrast,.mdl-typography--menu{font-family:\"Roboto\",\"Helvetica\",\"Arial\",sans-serif}.mdl-typography--menu{font-size:14px;font-weight:500;line-height:1;letter-spacing:0}.mdl-typography--menu-color-contrast{opacity:.87}.mdl-typography--menu-color-contrast,.mdl-typography--button,.mdl-typography--button-color-contrast{font-family:\"Roboto\",\"Helvetica\",\"Arial\",sans-serif;font-size:14px;font-weight:500;line-height:1;letter-spacing:0}.mdl-typography--button,.mdl-typography--button-color-contrast{text-transform:uppercase}.mdl-typography--button-color-contrast{opacity:.87}.mdl-typography--text-left{text-align:left}.mdl-typography--text-right{text-align:right}.mdl-typography--text-center{text-align:center}.mdl-typography--text-justify{text-align:justify}.mdl-typography--text-nowrap{white-space:nowrap}.mdl-typography--text-lowercase{text-transform:lowercase}.mdl-typography--text-uppercase{text-transform:uppercase}.mdl-typography--text-capitalize{text-transform:capitalize}.mdl-typography--font-thin{font-weight:200!important}.mdl-typography--font-light{font-weight:300!important}.mdl-typography--font-regular{font-weight:400!important}.mdl-typography--font-medium{font-weight:500!important}.mdl-typography--font-bold{font-weight:700!important}.mdl-typography--font-black{font-weight:900!important}.mdl-color-text--red{color:#f44336 !important}.mdl-color--red{background-color:#f44336 !important}.mdl-color-text--red-50{color:#ffebee !important}.mdl-color--red-50{background-color:#ffebee !important}.mdl-color-text--red-100{color:#ffcdd2 !important}.mdl-color--red-100{background-color:#ffcdd2 !important}.mdl-color-text--red-200{color:#ef9a9a !important}.mdl-color--red-200{background-color:#ef9a9a !important}.mdl-color-text--red-300{color:#e57373 !important}.mdl-color--red-300{background-color:#e57373 !important}.mdl-color-text--red-400{color:#ef5350 !important}.mdl-color--red-400{background-color:#ef5350 !important}.mdl-color-text--red-500{color:#f44336 !important}.mdl-color--red-500{background-color:#f44336 !important}.mdl-color-text--red-600{color:#e53935 !important}.mdl-color--red-600{background-color:#e53935 !important}.mdl-color-text--red-700{color:#d32f2f !important}.mdl-color--red-700{background-color:#d32f2f !important}.mdl-color-text--red-800{color:#c62828 !important}.mdl-color--red-800{background-color:#c62828 !important}.mdl-color-text--red-900{color:#b71c1c !important}.mdl-color--red-900{background-color:#b71c1c !important}.mdl-color-text--red-A100{color:#ff8a80 !important}.mdl-color--red-A100{background-color:#ff8a80 !important}.mdl-color-text--red-A200{color:#ff5252 !important}.mdl-color--red-A200{background-color:#ff5252 !important}.mdl-color-text--red-A400{color:#ff1744 !important}.mdl-color--red-A400{background-color:#ff1744 !important}.mdl-color-text--red-A700{color:#d50000 !important}.mdl-color--red-A700{background-color:#d50000 !important}.mdl-color-text--pink{color:#e91e63 !important}.mdl-color--pink{background-color:#e91e63 !important}.mdl-color-text--pink-50{color:#fce4ec !important}.mdl-color--pink-50{background-color:#fce4ec !important}.mdl-color-text--pink-100{color:#f8bbd0 !important}.mdl-color--pink-100{background-color:#f8bbd0 !important}.mdl-color-text--pink-200{color:#f48fb1 !important}.mdl-color--pink-200{background-color:#f48fb1 !important}.mdl-color-text--pink-300{color:#f06292 !important}.mdl-color--pink-300{background-color:#f06292 !important}.mdl-color-text--pink-400{color:#ec407a !important}.mdl-color--pink-400{background-color:#ec407a !important}.mdl-color-text--pink-500{color:#e91e63 !important}.mdl-color--pink-500{background-color:#e91e63 !important}.mdl-color-text--pink-600{color:#d81b60 !important}.mdl-color--pink-600{background-color:#d81b60 !important}.mdl-color-text--pink-700{color:#c2185b !important}.mdl-color--pink-700{background-color:#c2185b !important}.mdl-color-text--pink-800{color:#ad1457 !important}.mdl-color--pink-800{background-color:#ad1457 !important}.mdl-color-text--pink-900{color:#880e4f !important}.mdl-color--pink-900{background-color:#880e4f !important}.mdl-color-text--pink-A100{color:#ff80ab !important}.mdl-color--pink-A100{background-color:#ff80ab !important}.mdl-color-text--pink-A200{color:#ff4081 !important}.mdl-color--pink-A200{background-color:#ff4081 !important}.mdl-color-text--pink-A400{color:#f50057 !important}.mdl-color--pink-A400{background-color:#f50057 !important}.mdl-color-text--pink-A700{color:#c51162 !important}.mdl-color--pink-A700{background-color:#c51162 !important}.mdl-color-text--purple{color:#9c27b0 !important}.mdl-color--purple{background-color:#9c27b0 !important}.mdl-color-text--purple-50{color:#f3e5f5 !important}.mdl-color--purple-50{background-color:#f3e5f5 !important}.mdl-color-text--purple-100{color:#e1bee7 !important}.mdl-color--purple-100{background-color:#e1bee7 !important}.mdl-color-text--purple-200{color:#ce93d8 !important}.mdl-color--purple-200{background-color:#ce93d8 !important}.mdl-color-text--purple-300{color:#ba68c8 !important}.mdl-color--purple-300{background-color:#ba68c8 !important}.mdl-color-text--purple-400{color:#ab47bc !important}.mdl-color--purple-400{background-color:#ab47bc !important}.mdl-color-text--purple-500{color:#9c27b0 !important}.mdl-color--purple-500{background-color:#9c27b0 !important}.mdl-color-text--purple-600{color:#8e24aa !important}.mdl-color--purple-600{background-color:#8e24aa !important}.mdl-color-text--purple-700{color:#7b1fa2 !important}.mdl-color--purple-700{background-color:#7b1fa2 !important}.mdl-color-text--purple-800{color:#6a1b9a !important}.mdl-color--purple-800{background-color:#6a1b9a !important}.mdl-color-text--purple-900{color:#4a148c !important}.mdl-color--purple-900{background-color:#4a148c !important}.mdl-color-text--purple-A100{color:#ea80fc !important}.mdl-color--purple-A100{background-color:#ea80fc !important}.mdl-color-text--purple-A200{color:#e040fb !important}.mdl-color--purple-A200{background-color:#e040fb !important}.mdl-color-text--purple-A400{color:#d500f9 !important}.mdl-color--purple-A400{background-color:#d500f9 !important}.mdl-color-text--purple-A700{color:#a0f !important}.mdl-color--purple-A700{background-color:#a0f !important}.mdl-color-text--deep-purple{color:#673ab7 !important}.mdl-color--deep-purple{background-color:#673ab7 !important}.mdl-color-text--deep-purple-50{color:#ede7f6 !important}.mdl-color--deep-purple-50{background-color:#ede7f6 !important}.mdl-color-text--deep-purple-100{color:#d1c4e9 !important}.mdl-color--deep-purple-100{background-color:#d1c4e9 !important}.mdl-color-text--deep-purple-200{color:#b39ddb !important}.mdl-color--deep-purple-200{background-color:#b39ddb !important}.mdl-color-text--deep-purple-300{color:#9575cd !important}.mdl-color--deep-purple-300{background-color:#9575cd !important}.mdl-color-text--deep-purple-400{color:#7e57c2 !important}.mdl-color--deep-purple-400{background-color:#7e57c2 !important}.mdl-color-text--deep-purple-500{color:#673ab7 !important}.mdl-color--deep-purple-500{background-color:#673ab7 !important}.mdl-color-text--deep-purple-600{color:#5e35b1 !important}.mdl-color--deep-purple-600{background-color:#5e35b1 !important}.mdl-color-text--deep-purple-700{color:#512da8 !important}.mdl-color--deep-purple-700{background-color:#512da8 !important}.mdl-color-text--deep-purple-800{color:#4527a0 !important}.mdl-color--deep-purple-800{background-color:#4527a0 !important}.mdl-color-text--deep-purple-900{color:#311b92 !important}.mdl-color--deep-purple-900{background-color:#311b92 !important}.mdl-color-text--deep-purple-A100{color:#b388ff !important}.mdl-color--deep-purple-A100{background-color:#b388ff !important}.mdl-color-text--deep-purple-A200{color:#7c4dff !important}.mdl-color--deep-purple-A200{background-color:#7c4dff !important}.mdl-color-text--deep-purple-A400{color:#651fff !important}.mdl-color--deep-purple-A400{background-color:#651fff !important}.mdl-color-text--deep-purple-A700{color:#6200ea !important}.mdl-color--deep-purple-A700{background-color:#6200ea !important}.mdl-color-text--indigo{color:#3f51b5 !important}.mdl-color--indigo{background-color:#3f51b5 !important}.mdl-color-text--indigo-50{color:#e8eaf6 !important}.mdl-color--indigo-50{background-color:#e8eaf6 !important}.mdl-color-text--indigo-100{color:#c5cae9 !important}.mdl-color--indigo-100{background-color:#c5cae9 !important}.mdl-color-text--indigo-200{color:#9fa8da !important}.mdl-color--indigo-200{background-color:#9fa8da !important}.mdl-color-text--indigo-300{color:#7986cb !important}.mdl-color--indigo-300{background-color:#7986cb !important}.mdl-color-text--indigo-400{color:#5c6bc0 !important}.mdl-color--indigo-400{background-color:#5c6bc0 !important}.mdl-color-text--indigo-500{color:#3f51b5 !important}.mdl-color--indigo-500{background-color:#3f51b5 !important}.mdl-color-text--indigo-600{color:#3949ab !important}.mdl-color--indigo-600{background-color:#3949ab !important}.mdl-color-text--indigo-700{color:#303f9f !important}.mdl-color--indigo-700{background-color:#303f9f !important}.mdl-color-text--indigo-800{color:#283593 !important}.mdl-color--indigo-800{background-color:#283593 !important}.mdl-color-text--indigo-900{color:#1a237e !important}.mdl-color--indigo-900{background-color:#1a237e !important}.mdl-color-text--indigo-A100{color:#8c9eff !important}.mdl-color--indigo-A100{background-color:#8c9eff !important}.mdl-color-text--indigo-A200{color:#536dfe !important}.mdl-color--indigo-A200{background-color:#536dfe !important}.mdl-color-text--indigo-A400{color:#3d5afe !important}.mdl-color--indigo-A400{background-color:#3d5afe !important}.mdl-color-text--indigo-A700{color:#304ffe !important}.mdl-color--indigo-A700{background-color:#304ffe !important}.mdl-color-text--blue{color:#2196f3 !important}.mdl-color--blue{background-color:#2196f3 !important}.mdl-color-text--blue-50{color:#e3f2fd !important}.mdl-color--blue-50{background-color:#e3f2fd !important}.mdl-color-text--blue-100{color:#bbdefb !important}.mdl-color--blue-100{background-color:#bbdefb !important}.mdl-color-text--blue-200{color:#90caf9 !important}.mdl-color--blue-200{background-color:#90caf9 !important}.mdl-color-text--blue-300{color:#64b5f6 !important}.mdl-color--blue-300{background-color:#64b5f6 !important}.mdl-color-text--blue-400{color:#42a5f5 !important}.mdl-color--blue-400{background-color:#42a5f5 !important}.mdl-color-text--blue-500{color:#2196f3 !important}.mdl-color--blue-500{background-color:#2196f3 !important}.mdl-color-text--blue-600{color:#1e88e5 !important}.mdl-color--blue-600{background-color:#1e88e5 !important}.mdl-color-text--blue-700{color:#1976d2 !important}.mdl-color--blue-700{background-color:#1976d2 !important}.mdl-color-text--blue-800{color:#1565c0 !important}.mdl-color--blue-800{background-color:#1565c0 !important}.mdl-color-text--blue-900{color:#0d47a1 !important}.mdl-color--blue-900{background-color:#0d47a1 !important}.mdl-color-text--blue-A100{color:#82b1ff !important}.mdl-color--blue-A100{background-color:#82b1ff !important}.mdl-color-text--blue-A200{color:#448aff !important}.mdl-color--blue-A200{background-color:#448aff !important}.mdl-color-text--blue-A400{color:#2979ff !important}.mdl-color--blue-A400{background-color:#2979ff !important}.mdl-color-text--blue-A700{color:#2962ff !important}.mdl-color--blue-A700{background-color:#2962ff !important}.mdl-color-text--light-blue{color:#03a9f4 !important}.mdl-color--light-blue{background-color:#03a9f4 !important}.mdl-color-text--light-blue-50{color:#e1f5fe !important}.mdl-color--light-blue-50{background-color:#e1f5fe !important}.mdl-color-text--light-blue-100{color:#b3e5fc !important}.mdl-color--light-blue-100{background-color:#b3e5fc !important}.mdl-color-text--light-blue-200{color:#81d4fa !important}.mdl-color--light-blue-200{background-color:#81d4fa !important}.mdl-color-text--light-blue-300{color:#4fc3f7 !important}.mdl-color--light-blue-300{background-color:#4fc3f7 !important}.mdl-color-text--light-blue-400{color:#29b6f6 !important}.mdl-color--light-blue-400{background-color:#29b6f6 !important}.mdl-color-text--light-blue-500{color:#03a9f4 !important}.mdl-color--light-blue-500{background-color:#03a9f4 !important}.mdl-color-text--light-blue-600{color:#039be5 !important}.mdl-color--light-blue-600{background-color:#039be5 !important}.mdl-color-text--light-blue-700{color:#0288d1 !important}.mdl-color--light-blue-700{background-color:#0288d1 !important}.mdl-color-text--light-blue-800{color:#0277bd !important}.mdl-color--light-blue-800{background-color:#0277bd !important}.mdl-color-text--light-blue-900{color:#01579b !important}.mdl-color--light-blue-900{background-color:#01579b !important}.mdl-color-text--light-blue-A100{color:#80d8ff !important}.mdl-color--light-blue-A100{background-color:#80d8ff !important}.mdl-color-text--light-blue-A200{color:#40c4ff !important}.mdl-color--light-blue-A200{background-color:#40c4ff !important}.mdl-color-text--light-blue-A400{color:#00b0ff !important}.mdl-color--light-blue-A400{background-color:#00b0ff !important}.mdl-color-text--light-blue-A700{color:#0091ea !important}.mdl-color--light-blue-A700{background-color:#0091ea !important}.mdl-color-text--cyan{color:#00bcd4 !important}.mdl-color--cyan{background-color:#00bcd4 !important}.mdl-color-text--cyan-50{color:#e0f7fa !important}.mdl-color--cyan-50{background-color:#e0f7fa !important}.mdl-color-text--cyan-100{color:#b2ebf2 !important}.mdl-color--cyan-100{background-color:#b2ebf2 !important}.mdl-color-text--cyan-200{color:#80deea !important}.mdl-color--cyan-200{background-color:#80deea !important}.mdl-color-text--cyan-300{color:#4dd0e1 !important}.mdl-color--cyan-300{background-color:#4dd0e1 !important}.mdl-color-text--cyan-400{color:#26c6da !important}.mdl-color--cyan-400{background-color:#26c6da !important}.mdl-color-text--cyan-500{color:#00bcd4 !important}.mdl-color--cyan-500{background-color:#00bcd4 !important}.mdl-color-text--cyan-600{color:#00acc1 !important}.mdl-color--cyan-600{background-color:#00acc1 !important}.mdl-color-text--cyan-700{color:#0097a7 !important}.mdl-color--cyan-700{background-color:#0097a7 !important}.mdl-color-text--cyan-800{color:#00838f !important}.mdl-color--cyan-800{background-color:#00838f !important}.mdl-color-text--cyan-900{color:#006064 !important}.mdl-color--cyan-900{background-color:#006064 !important}.mdl-color-text--cyan-A100{color:#84ffff !important}.mdl-color--cyan-A100{background-color:#84ffff !important}.mdl-color-text--cyan-A200{color:#18ffff !important}.mdl-color--cyan-A200{background-color:#18ffff !important}.mdl-color-text--cyan-A400{color:#00e5ff !important}.mdl-color--cyan-A400{background-color:#00e5ff !important}.mdl-color-text--cyan-A700{color:#00b8d4 !important}.mdl-color--cyan-A700{background-color:#00b8d4 !important}.mdl-color-text--teal{color:#009688 !important}.mdl-color--teal{background-color:#009688 !important}.mdl-color-text--teal-50{color:#e0f2f1 !important}.mdl-color--teal-50{background-color:#e0f2f1 !important}.mdl-color-text--teal-100{color:#b2dfdb !important}.mdl-color--teal-100{background-color:#b2dfdb !important}.mdl-color-text--teal-200{color:#80cbc4 !important}.mdl-color--teal-200{background-color:#80cbc4 !important}.mdl-color-text--teal-300{color:#4db6ac !important}.mdl-color--teal-300{background-color:#4db6ac !important}.mdl-color-text--teal-400{color:#26a69a !important}.mdl-color--teal-400{background-color:#26a69a !important}.mdl-color-text--teal-500{color:#009688 !important}.mdl-color--teal-500{background-color:#009688 !important}.mdl-color-text--teal-600{color:#00897b !important}.mdl-color--teal-600{background-color:#00897b !important}.mdl-color-text--teal-700{color:#00796b !important}.mdl-color--teal-700{background-color:#00796b !important}.mdl-color-text--teal-800{color:#00695c !important}.mdl-color--teal-800{background-color:#00695c !important}.mdl-color-text--teal-900{color:#004d40 !important}.mdl-color--teal-900{background-color:#004d40 !important}.mdl-color-text--teal-A100{color:#a7ffeb !important}.mdl-color--teal-A100{background-color:#a7ffeb !important}.mdl-color-text--teal-A200{color:#64ffda !important}.mdl-color--teal-A200{background-color:#64ffda !important}.mdl-color-text--teal-A400{color:#1de9b6 !important}.mdl-color--teal-A400{background-color:#1de9b6 !important}.mdl-color-text--teal-A700{color:#00bfa5 !important}.mdl-color--teal-A700{background-color:#00bfa5 !important}.mdl-color-text--green{color:#4caf50 !important}.mdl-color--green{background-color:#4caf50 !important}.mdl-color-text--green-50{color:#e8f5e9 !important}.mdl-color--green-50{background-color:#e8f5e9 !important}.mdl-color-text--green-100{color:#c8e6c9 !important}.mdl-color--green-100{background-color:#c8e6c9 !important}.mdl-color-text--green-200{color:#a5d6a7 !important}.mdl-color--green-200{background-color:#a5d6a7 !important}.mdl-color-text--green-300{color:#81c784 !important}.mdl-color--green-300{background-color:#81c784 !important}.mdl-color-text--green-400{color:#66bb6a !important}.mdl-color--green-400{background-color:#66bb6a !important}.mdl-color-text--green-500{color:#4caf50 !important}.mdl-color--green-500{background-color:#4caf50 !important}.mdl-color-text--green-600{color:#43a047 !important}.mdl-color--green-600{background-color:#43a047 !important}.mdl-color-text--green-700{color:#388e3c !important}.mdl-color--green-700{background-color:#388e3c !important}.mdl-color-text--green-800{color:#2e7d32 !important}.mdl-color--green-800{background-color:#2e7d32 !important}.mdl-color-text--green-900{color:#1b5e20 !important}.mdl-color--green-900{background-color:#1b5e20 !important}.mdl-color-text--green-A100{color:#b9f6ca !important}.mdl-color--green-A100{background-color:#b9f6ca !important}.mdl-color-text--green-A200{color:#69f0ae !important}.mdl-color--green-A200{background-color:#69f0ae !important}.mdl-color-text--green-A400{color:#00e676 !important}.mdl-color--green-A400{background-color:#00e676 !important}.mdl-color-text--green-A700{color:#00c853 !important}.mdl-color--green-A700{background-color:#00c853 !important}.mdl-color-text--light-green{color:#8bc34a !important}.mdl-color--light-green{background-color:#8bc34a !important}.mdl-color-text--light-green-50{color:#f1f8e9 !important}.mdl-color--light-green-50{background-color:#f1f8e9 !important}.mdl-color-text--light-green-100{color:#dcedc8 !important}.mdl-color--light-green-100{background-color:#dcedc8 !important}.mdl-color-text--light-green-200{color:#c5e1a5 !important}.mdl-color--light-green-200{background-color:#c5e1a5 !important}.mdl-color-text--light-green-300{color:#aed581 !important}.mdl-color--light-green-300{background-color:#aed581 !important}.mdl-color-text--light-green-400{color:#9ccc65 !important}.mdl-color--light-green-400{background-color:#9ccc65 !important}.mdl-color-text--light-green-500{color:#8bc34a !important}.mdl-color--light-green-500{background-color:#8bc34a !important}.mdl-color-text--light-green-600{color:#7cb342 !important}.mdl-color--light-green-600{background-color:#7cb342 !important}.mdl-color-text--light-green-700{color:#689f38 !important}.mdl-color--light-green-700{background-color:#689f38 !important}.mdl-color-text--light-green-800{color:#558b2f !important}.mdl-color--light-green-800{background-color:#558b2f !important}.mdl-color-text--light-green-900{color:#33691e !important}.mdl-color--light-green-900{background-color:#33691e !important}.mdl-color-text--light-green-A100{color:#ccff90 !important}.mdl-color--light-green-A100{background-color:#ccff90 !important}.mdl-color-text--light-green-A200{color:#b2ff59 !important}.mdl-color--light-green-A200{background-color:#b2ff59 !important}.mdl-color-text--light-green-A400{color:#76ff03 !important}.mdl-color--light-green-A400{background-color:#76ff03 !important}.mdl-color-text--light-green-A700{color:#64dd17 !important}.mdl-color--light-green-A700{background-color:#64dd17 !important}.mdl-color-text--lime{color:#cddc39 !important}.mdl-color--lime{background-color:#cddc39 !important}.mdl-color-text--lime-50{color:#f9fbe7 !important}.mdl-color--lime-50{background-color:#f9fbe7 !important}.mdl-color-text--lime-100{color:#f0f4c3 !important}.mdl-color--lime-100{background-color:#f0f4c3 !important}.mdl-color-text--lime-200{color:#e6ee9c !important}.mdl-color--lime-200{background-color:#e6ee9c !important}.mdl-color-text--lime-300{color:#dce775 !important}.mdl-color--lime-300{background-color:#dce775 !important}.mdl-color-text--lime-400{color:#d4e157 !important}.mdl-color--lime-400{background-color:#d4e157 !important}.mdl-color-text--lime-500{color:#cddc39 !important}.mdl-color--lime-500{background-color:#cddc39 !important}.mdl-color-text--lime-600{color:#c0ca33 !important}.mdl-color--lime-600{background-color:#c0ca33 !important}.mdl-color-text--lime-700{color:#afb42b !important}.mdl-color--lime-700{background-color:#afb42b !important}.mdl-color-text--lime-800{color:#9e9d24 !important}.mdl-color--lime-800{background-color:#9e9d24 !important}.mdl-color-text--lime-900{color:#827717 !important}.mdl-color--lime-900{background-color:#827717 !important}.mdl-color-text--lime-A100{color:#f4ff81 !important}.mdl-color--lime-A100{background-color:#f4ff81 !important}.mdl-color-text--lime-A200{color:#eeff41 !important}.mdl-color--lime-A200{background-color:#eeff41 !important}.mdl-color-text--lime-A400{color:#c6ff00 !important}.mdl-color--lime-A400{background-color:#c6ff00 !important}.mdl-color-text--lime-A700{color:#aeea00 !important}.mdl-color--lime-A700{background-color:#aeea00 !important}.mdl-color-text--yellow{color:#ffeb3b !important}.mdl-color--yellow{background-color:#ffeb3b !important}.mdl-color-text--yellow-50{color:#fffde7 !important}.mdl-color--yellow-50{background-color:#fffde7 !important}.mdl-color-text--yellow-100{color:#fff9c4 !important}.mdl-color--yellow-100{background-color:#fff9c4 !important}.mdl-color-text--yellow-200{color:#fff59d !important}.mdl-color--yellow-200{background-color:#fff59d !important}.mdl-color-text--yellow-300{color:#fff176 !important}.mdl-color--yellow-300{background-color:#fff176 !important}.mdl-color-text--yellow-400{color:#ffee58 !important}.mdl-color--yellow-400{background-color:#ffee58 !important}.mdl-color-text--yellow-500{color:#ffeb3b !important}.mdl-color--yellow-500{background-color:#ffeb3b !important}.mdl-color-text--yellow-600{color:#fdd835 !important}.mdl-color--yellow-600{background-color:#fdd835 !important}.mdl-color-text--yellow-700{color:#fbc02d !important}.mdl-color--yellow-700{background-color:#fbc02d !important}.mdl-color-text--yellow-800{color:#f9a825 !important}.mdl-color--yellow-800{background-color:#f9a825 !important}.mdl-color-text--yellow-900{color:#f57f17 !important}.mdl-color--yellow-900{background-color:#f57f17 !important}.mdl-color-text--yellow-A100{color:#ffff8d !important}.mdl-color--yellow-A100{background-color:#ffff8d !important}.mdl-color-text--yellow-A200{color:#ff0 !important}.mdl-color--yellow-A200{background-color:#ff0 !important}.mdl-color-text--yellow-A400{color:#ffea00 !important}.mdl-color--yellow-A400{background-color:#ffea00 !important}.mdl-color-text--yellow-A700{color:#ffd600 !important}.mdl-color--yellow-A700{background-color:#ffd600 !important}.mdl-color-text--amber{color:#ffc107 !important}.mdl-color--amber{background-color:#ffc107 !important}.mdl-color-text--amber-50{color:#fff8e1 !important}.mdl-color--amber-50{background-color:#fff8e1 !important}.mdl-color-text--amber-100{color:#ffecb3 !important}.mdl-color--amber-100{background-color:#ffecb3 !important}.mdl-color-text--amber-200{color:#ffe082 !important}.mdl-color--amber-200{background-color:#ffe082 !important}.mdl-color-text--amber-300{color:#ffd54f !important}.mdl-color--amber-300{background-color:#ffd54f !important}.mdl-color-text--amber-400{color:#ffca28 !important}.mdl-color--amber-400{background-color:#ffca28 !important}.mdl-color-text--amber-500{color:#ffc107 !important}.mdl-color--amber-500{background-color:#ffc107 !important}.mdl-color-text--amber-600{color:#ffb300 !important}.mdl-color--amber-600{background-color:#ffb300 !important}.mdl-color-text--amber-700{color:#ffa000 !important}.mdl-color--amber-700{background-color:#ffa000 !important}.mdl-color-text--amber-800{color:#ff8f00 !important}.mdl-color--amber-800{background-color:#ff8f00 !important}.mdl-color-text--amber-900{color:#ff6f00 !important}.mdl-color--amber-900{background-color:#ff6f00 !important}.mdl-color-text--amber-A100{color:#ffe57f !important}.mdl-color--amber-A100{background-color:#ffe57f !important}.mdl-color-text--amber-A200{color:#ffd740 !important}.mdl-color--amber-A200{background-color:#ffd740 !important}.mdl-color-text--amber-A400{color:#ffc400 !important}.mdl-color--amber-A400{background-color:#ffc400 !important}.mdl-color-text--amber-A700{color:#ffab00 !important}.mdl-color--amber-A700{background-color:#ffab00 !important}.mdl-color-text--orange{color:#ff9800 !important}.mdl-color--orange{background-color:#ff9800 !important}.mdl-color-text--orange-50{color:#fff3e0 !important}.mdl-color--orange-50{background-color:#fff3e0 !important}.mdl-color-text--orange-100{color:#ffe0b2 !important}.mdl-color--orange-100{background-color:#ffe0b2 !important}.mdl-color-text--orange-200{color:#ffcc80 !important}.mdl-color--orange-200{background-color:#ffcc80 !important}.mdl-color-text--orange-300{color:#ffb74d !important}.mdl-color--orange-300{background-color:#ffb74d !important}.mdl-color-text--orange-400{color:#ffa726 !important}.mdl-color--orange-400{background-color:#ffa726 !important}.mdl-color-text--orange-500{color:#ff9800 !important}.mdl-color--orange-500{background-color:#ff9800 !important}.mdl-color-text--orange-600{color:#fb8c00 !important}.mdl-color--orange-600{background-color:#fb8c00 !important}.mdl-color-text--orange-700{color:#f57c00 !important}.mdl-color--orange-700{background-color:#f57c00 !important}.mdl-color-text--orange-800{color:#ef6c00 !important}.mdl-color--orange-800{background-color:#ef6c00 !important}.mdl-color-text--orange-900{color:#e65100 !important}.mdl-color--orange-900{background-color:#e65100 !important}.mdl-color-text--orange-A100{color:#ffd180 !important}.mdl-color--orange-A100{background-color:#ffd180 !important}.mdl-color-text--orange-A200{color:#ffab40 !important}.mdl-color--orange-A200{background-color:#ffab40 !important}.mdl-color-text--orange-A400{color:#ff9100 !important}.mdl-color--orange-A400{background-color:#ff9100 !important}.mdl-color-text--orange-A700{color:#ff6d00 !important}.mdl-color--orange-A700{background-color:#ff6d00 !important}.mdl-color-text--deep-orange{color:#ff5722 !important}.mdl-color--deep-orange{background-color:#ff5722 !important}.mdl-color-text--deep-orange-50{color:#fbe9e7 !important}.mdl-color--deep-orange-50{background-color:#fbe9e7 !important}.mdl-color-text--deep-orange-100{color:#ffccbc !important}.mdl-color--deep-orange-100{background-color:#ffccbc !important}.mdl-color-text--deep-orange-200{color:#ffab91 !important}.mdl-color--deep-orange-200{background-color:#ffab91 !important}.mdl-color-text--deep-orange-300{color:#ff8a65 !important}.mdl-color--deep-orange-300{background-color:#ff8a65 !important}.mdl-color-text--deep-orange-400{color:#ff7043 !important}.mdl-color--deep-orange-400{background-color:#ff7043 !important}.mdl-color-text--deep-orange-500{color:#ff5722 !important}.mdl-color--deep-orange-500{background-color:#ff5722 !important}.mdl-color-text--deep-orange-600{color:#f4511e !important}.mdl-color--deep-orange-600{background-color:#f4511e !important}.mdl-color-text--deep-orange-700{color:#e64a19 !important}.mdl-color--deep-orange-700{background-color:#e64a19 !important}.mdl-color-text--deep-orange-800{color:#d84315 !important}.mdl-color--deep-orange-800{background-color:#d84315 !important}.mdl-color-text--deep-orange-900{color:#bf360c !important}.mdl-color--deep-orange-900{background-color:#bf360c !important}.mdl-color-text--deep-orange-A100{color:#ff9e80 !important}.mdl-color--deep-orange-A100{background-color:#ff9e80 !important}.mdl-color-text--deep-orange-A200{color:#ff6e40 !important}.mdl-color--deep-orange-A200{background-color:#ff6e40 !important}.mdl-color-text--deep-orange-A400{color:#ff3d00 !important}.mdl-color--deep-orange-A400{background-color:#ff3d00 !important}.mdl-color-text--deep-orange-A700{color:#dd2c00 !important}.mdl-color--deep-orange-A700{background-color:#dd2c00 !important}.mdl-color-text--brown{color:#795548 !important}.mdl-color--brown{background-color:#795548 !important}.mdl-color-text--brown-50{color:#efebe9 !important}.mdl-color--brown-50{background-color:#efebe9 !important}.mdl-color-text--brown-100{color:#d7ccc8 !important}.mdl-color--brown-100{background-color:#d7ccc8 !important}.mdl-color-text--brown-200{color:#bcaaa4 !important}.mdl-color--brown-200{background-color:#bcaaa4 !important}.mdl-color-text--brown-300{color:#a1887f !important}.mdl-color--brown-300{background-color:#a1887f !important}.mdl-color-text--brown-400{color:#8d6e63 !important}.mdl-color--brown-400{background-color:#8d6e63 !important}.mdl-color-text--brown-500{color:#795548 !important}.mdl-color--brown-500{background-color:#795548 !important}.mdl-color-text--brown-600{color:#6d4c41 !important}.mdl-color--brown-600{background-color:#6d4c41 !important}.mdl-color-text--brown-700{color:#5d4037 !important}.mdl-color--brown-700{background-color:#5d4037 !important}.mdl-color-text--brown-800{color:#4e342e !important}.mdl-color--brown-800{background-color:#4e342e !important}.mdl-color-text--brown-900{color:#3e2723 !important}.mdl-color--brown-900{background-color:#3e2723 !important}.mdl-color-text--grey{color:#9e9e9e !important}.mdl-color--grey{background-color:#9e9e9e !important}.mdl-color-text--grey-50{color:#fafafa !important}.mdl-color--grey-50{background-color:#fafafa !important}.mdl-color-text--grey-100{color:#f5f5f5 !important}.mdl-color--grey-100{background-color:#f5f5f5 !important}.mdl-color-text--grey-200{color:#eee !important}.mdl-color--grey-200{background-color:#eee !important}.mdl-color-text--grey-300{color:#e0e0e0 !important}.mdl-color--grey-300{background-color:#e0e0e0 !important}.mdl-color-text--grey-400{color:#bdbdbd !important}.mdl-color--grey-400{background-color:#bdbdbd !important}.mdl-color-text--grey-500{color:#9e9e9e !important}.mdl-color--grey-500{background-color:#9e9e9e !important}.mdl-color-text--grey-600{color:#757575 !important}.mdl-color--grey-600{background-color:#757575 !important}.mdl-color-text--grey-700{color:#616161 !important}.mdl-color--grey-700{background-color:#616161 !important}.mdl-color-text--grey-800{color:#424242 !important}.mdl-color--grey-800{background-color:#424242 !important}.mdl-color-text--grey-900{color:#212121 !important}.mdl-color--grey-900{background-color:#212121 !important}.mdl-color-text--blue-grey{color:#607d8b !important}.mdl-color--blue-grey{background-color:#607d8b !important}.mdl-color-text--blue-grey-50{color:#eceff1 !important}.mdl-color--blue-grey-50{background-color:#eceff1 !important}.mdl-color-text--blue-grey-100{color:#cfd8dc !important}.mdl-color--blue-grey-100{background-color:#cfd8dc !important}.mdl-color-text--blue-grey-200{color:#b0bec5 !important}.mdl-color--blue-grey-200{background-color:#b0bec5 !important}.mdl-color-text--blue-grey-300{color:#90a4ae !important}.mdl-color--blue-grey-300{background-color:#90a4ae !important}.mdl-color-text--blue-grey-400{color:#78909c !important}.mdl-color--blue-grey-400{background-color:#78909c !important}.mdl-color-text--blue-grey-500{color:#607d8b !important}.mdl-color--blue-grey-500{background-color:#607d8b !important}.mdl-color-text--blue-grey-600{color:#546e7a !important}.mdl-color--blue-grey-600{background-color:#546e7a !important}.mdl-color-text--blue-grey-700{color:#455a64 !important}.mdl-color--blue-grey-700{background-color:#455a64 !important}.mdl-color-text--blue-grey-800{color:#37474f !important}.mdl-color--blue-grey-800{background-color:#37474f !important}.mdl-color-text--blue-grey-900{color:#263238 !important}.mdl-color--blue-grey-900{background-color:#263238 !important}.mdl-color--black{background-color:#000 !important}.mdl-color-text--black{color:#000 !important}.mdl-color--white{background-color:#fff !important}.mdl-color-text--white{color:#fff !important}.mdl-color--primary{background-color:#3f51b5 !important}.mdl-color--primary-contrast{background-color:#fff !important}.mdl-color--primary-dark{background-color:#303f9f !important}.mdl-color--accent{background-color:#ff4081 !important}.mdl-color--accent-contrast{background-color:#fff !important}.mdl-color-text--primary{color:#3f51b5 !important}.mdl-color-text--primary-contrast{color:#fff !important}.mdl-color-text--primary-dark{color:#303f9f !important}.mdl-color-text--accent{color:#ff4081 !important}.mdl-color-text--accent-contrast{color:#fff !important}.mdl-ripple{background:#000;border-radius:50%;height:50px;left:0;opacity:0;pointer-events:none;position:absolute;top:0;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);width:50px;overflow:hidden}.mdl-ripple.is-animating{-webkit-transition:-webkit-transform .3s cubic-bezier(0,0,.2,1),width .3s cubic-bezier(0,0,.2,1),height .3s cubic-bezier(0,0,.2,1),opacity .6s cubic-bezier(0,0,.2,1);transition:transform .3s cubic-bezier(0,0,.2,1),width .3s cubic-bezier(0,0,.2,1),height .3s cubic-bezier(0,0,.2,1),opacity .6s cubic-bezier(0,0,.2,1)}.mdl-ripple.is-visible{opacity:.3}.mdl-animation--default,.mdl-animation--fast-out-slow-in{-webkit-transition-timing-function:cubic-bezier(.4,0,.2,1);transition-timing-function:cubic-bezier(.4,0,.2,1)}.mdl-animation--linear-out-slow-in{-webkit-transition-timing-function:cubic-bezier(0,0,.2,1);transition-timing-function:cubic-bezier(0,0,.2,1)}.mdl-animation--fast-out-linear-in{-webkit-transition-timing-function:cubic-bezier(.4,0,1,1);transition-timing-function:cubic-bezier(.4,0,1,1)}.mdl-badge{position:relative;white-space:nowrap;margin-right:24px}.mdl-badge:not([data-badge]){margin-right:auto}.mdl-badge[data-badge]:after{content:attr(data-badge);display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-content:center;-ms-flex-line-pack:center;align-content:center;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;position:absolute;top:-11px;right:-24px;font-family:\"Roboto\",\"Helvetica\",\"Arial\",sans-serif;font-weight:600;font-size:12px;width:22px;height:22px;border-radius:50%;background:#ff4081;color:#fff}.mdl-button .mdl-badge[data-badge]:after{top:-10px;right:-5px}.mdl-badge.mdl-badge--no-background[data-badge]:after{color:#ff4081;background:#fff;box-shadow:0 0 1px gray}.mdl-button{background:0 0;border:none;border-radius:2px;color:#000;position:relative;height:36px;min-width:64px;padding:0 16px;display:inline-block;font-family:\"Roboto\",\"Helvetica\",\"Arial\",sans-serif;font-size:14px;font-weight:500;text-transform:uppercase;letter-spacing:0;overflow:hidden;will-change:box-shadow,transform;-webkit-transition:box-shadow .2s cubic-bezier(.4,0,1,1),background-color .2s cubic-bezier(.4,0,.2,1),color .2s cubic-bezier(.4,0,.2,1);transition:box-shadow .2s cubic-bezier(.4,0,1,1),background-color .2s cubic-bezier(.4,0,.2,1),color .2s cubic-bezier(.4,0,.2,1);outline:none;cursor:pointer;text-decoration:none;text-align:center;line-height:36px;vertical-align:middle}.mdl-button::-moz-focus-inner{border:0}.mdl-button:hover{background-color:rgba(158,158,158,.2)}.mdl-button:focus:not(:active){background-color:rgba(0,0,0,.12)}.mdl-button:active{background-color:rgba(158,158,158,.4)}.mdl-button.mdl-button--colored{color:#3f51b5}.mdl-button.mdl-button--colored:focus:not(:active){background-color:rgba(0,0,0,.12)}input.mdl-button[type=\"submit\"]{-webkit-appearance:none}.mdl-button--raised{background:rgba(158,158,158,.2);box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12)}.mdl-button--raised:active{box-shadow:0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2);background-color:rgba(158,158,158,.4)}.mdl-button--raised:focus:not(:active){box-shadow:0 0 8px rgba(0,0,0,.18),0 8px 16px rgba(0,0,0,.36);background-color:rgba(158,158,158,.4)}.mdl-button--raised.mdl-button--colored{background:#3f51b5;color:#fff}.mdl-button--raised.mdl-button--colored:hover{background-color:#3f51b5}.mdl-button--raised.mdl-button--colored:active{background-color:#3f51b5}.mdl-button--raised.mdl-button--colored:focus:not(:active){background-color:#3f51b5}.mdl-button--raised.mdl-button--colored .mdl-ripple{background:#fff}.mdl-button--fab{border-radius:50%;font-size:24px;height:56px;margin:auto;min-width:56px;width:56px;padding:0;overflow:hidden;background:rgba(158,158,158,.2);box-shadow:0 1px 1.5px 0 rgba(0,0,0,.12),0 1px 1px 0 rgba(0,0,0,.24);position:relative;line-height:normal}.mdl-button--fab .material-icons{position:absolute;top:50%;left:50%;-webkit-transform:translate(-12px,-12px);-ms-transform:translate(-12px,-12px);transform:translate(-12px,-12px);line-height:24px;width:24px}.mdl-button--fab.mdl-button--mini-fab{height:40px;min-width:40px;width:40px}.mdl-button--fab .mdl-button__ripple-container{border-radius:50%;-webkit-mask-image:-webkit-radial-gradient(circle,#fff,#000)}.mdl-button--fab:active{box-shadow:0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2);background-color:rgba(158,158,158,.4)}.mdl-button--fab:focus:not(:active){box-shadow:0 0 8px rgba(0,0,0,.18),0 8px 16px rgba(0,0,0,.36);background-color:rgba(158,158,158,.4)}.mdl-button--fab.mdl-button--colored{background:#ff4081;color:#fff}.mdl-button--fab.mdl-button--colored:hover{background-color:#ff4081}.mdl-button--fab.mdl-button--colored:focus:not(:active){background-color:#ff4081}.mdl-button--fab.mdl-button--colored:active{background-color:#ff4081}.mdl-button--fab.mdl-button--colored .mdl-ripple{background:#fff}.mdl-button--icon{border-radius:50%;font-size:24px;height:32px;margin-left:0;margin-right:0;min-width:32px;width:32px;padding:0;overflow:hidden;color:inherit;line-height:normal}.mdl-button--icon .material-icons{position:absolute;top:50%;left:50%;-webkit-transform:translate(-12px,-12px);-ms-transform:translate(-12px,-12px);transform:translate(-12px,-12px);line-height:24px;width:24px}.mdl-button--icon.mdl-button--mini-icon{height:24px;min-width:24px;width:24px}.mdl-button--icon.mdl-button--mini-icon .material-icons{top:0;left:0}.mdl-button--icon .mdl-button__ripple-container{border-radius:50%;-webkit-mask-image:-webkit-radial-gradient(circle,#fff,#000)}.mdl-button__ripple-container{display:block;height:100%;left:0;position:absolute;top:0;width:100%;z-index:0;overflow:hidden}.mdl-button[disabled] .mdl-button__ripple-container .mdl-ripple,.mdl-button.mdl-button--disabled .mdl-button__ripple-container .mdl-ripple{background-color:transparent}.mdl-button--primary.mdl-button--primary{color:#3f51b5}.mdl-button--primary.mdl-button--primary .mdl-ripple{background:#fff}.mdl-button--primary.mdl-button--primary.mdl-button--raised,.mdl-button--primary.mdl-button--primary.mdl-button--fab{color:#fff;background-color:#3f51b5}.mdl-button--accent.mdl-button--accent{color:#ff4081}.mdl-button--accent.mdl-button--accent .mdl-ripple{background:#fff}.mdl-button--accent.mdl-button--accent.mdl-button--raised,.mdl-button--accent.mdl-button--accent.mdl-button--fab{color:#fff;background-color:#ff4081}.mdl-button[disabled][disabled],.mdl-button.mdl-button--disabled.mdl-button--disabled{color:rgba(0,0,0,.26);cursor:default;background-color:transparent}.mdl-button--fab[disabled][disabled],.mdl-button--fab.mdl-button--disabled.mdl-button--disabled,.mdl-button--raised[disabled][disabled],.mdl-button--raised.mdl-button--disabled.mdl-button--disabled{background-color:rgba(0,0,0,.12);color:rgba(0,0,0,.26);box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12)}.mdl-button--colored[disabled][disabled],.mdl-button--colored.mdl-button--disabled.mdl-button--disabled{color:rgba(0,0,0,.26)}.mdl-button .material-icons{vertical-align:middle}.mdl-card{display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;font-size:16px;font-weight:400;min-height:200px;overflow:hidden;width:330px;z-index:1;position:relative;background:#fff;border-radius:2px;box-sizing:border-box}.mdl-card__media{background-color:#ff4081;background-repeat:repeat;background-position:50% 50%;background-size:cover;background-origin:padding-box;background-attachment:scroll;box-sizing:border-box}.mdl-card__title{-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;color:#000;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:stretch;-webkit-justify-content:stretch;-ms-flex-pack:stretch;justify-content:stretch;line-height:normal;padding:16px;-webkit-perspective-origin:165px 56px;perspective-origin:165px 56px;-webkit-transform-origin:165px 56px;-ms-transform-origin:165px 56px;transform-origin:165px 56px;box-sizing:border-box}.mdl-card__title.mdl-card--border{border-bottom:1px solid rgba(0,0,0,.1)}.mdl-card__title-text{-webkit-align-self:flex-end;-ms-flex-item-align:end;align-self:flex-end;color:inherit;display:-webkit-flex;display:-ms-flexbox;display:flex;font-size:24px;font-weight:300;line-height:normal;overflow:hidden;-webkit-transform-origin:149px 48px;-ms-transform-origin:149px 48px;transform-origin:149px 48px;margin:0}.mdl-card__subtitle-text{font-size:14px;color:rgba(0,0,0,.54);margin:0}.mdl-card__supporting-text{color:rgba(0,0,0,.54);font-size:13px;line-height:18px;overflow:hidden;padding:16px;width:90%}.mdl-card__actions{font-size:16px;line-height:normal;width:100%;background-color:transparent;padding:8px;box-sizing:border-box}.mdl-card__actions.mdl-card--border{border-top:1px solid rgba(0,0,0,.1)}.mdl-card--expand{-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1}.mdl-card__menu{position:absolute;right:16px;top:16px}.mdl-checkbox{position:relative;z-index:1;vertical-align:middle;display:inline-block;box-sizing:border-box;width:100%;height:24px;margin:0;padding:0}.mdl-checkbox.is-upgraded{padding-left:24px}.mdl-checkbox__input{line-height:24px}.mdl-checkbox.is-upgraded .mdl-checkbox__input{position:absolute;width:0;height:0;margin:0;padding:0;opacity:0;-ms-appearance:none;-moz-appearance:none;-webkit-appearance:none;appearance:none;border:none}.mdl-checkbox__box-outline{position:absolute;top:3px;left:0;display:inline-block;box-sizing:border-box;width:16px;height:16px;margin:0;cursor:pointer;overflow:hidden;border:2px solid rgba(0,0,0,.54);border-radius:2px;z-index:2}.mdl-checkbox.is-checked .mdl-checkbox__box-outline{border:2px solid #3f51b5}.mdl-checkbox.is-disabled .mdl-checkbox__box-outline{border:2px solid rgba(0,0,0,.26);cursor:auto}.mdl-checkbox__focus-helper{position:absolute;top:3px;left:0;display:inline-block;box-sizing:border-box;width:16px;height:16px;border-radius:50%;background-color:transparent}.mdl-checkbox.is-focused .mdl-checkbox__focus-helper{box-shadow:0 0 0 8px rgba(0,0,0,.1);background-color:rgba(0,0,0,.1)}.mdl-checkbox.is-focused.is-checked .mdl-checkbox__focus-helper{box-shadow:0 0 0 8px rgba(63,81,181,.26);background-color:rgba(63,81,181,.26)}.mdl-checkbox__tick-outline{position:absolute;top:0;left:0;height:100%;width:100%;-webkit-mask:url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8ZGVmcz4KICAgIDxjbGlwUGF0aCBpZD0iY2xpcCI+CiAgICAgIDxwYXRoCiAgICAgICAgIGQ9Ik0gMCwwIDAsMSAxLDEgMSwwIDAsMCB6IE0gMC44NTM0Mzc1LDAuMTY3MTg3NSAwLjk1OTY4NzUsMC4yNzMxMjUgMC40MjkzNzUsMC44MDM0Mzc1IDAuMzIzMTI1LDAuOTA5Njg3NSAwLjIxNzE4NzUsMC44MDM0Mzc1IDAuMDQwMzEyNSwwLjYyNjg3NSAwLjE0NjU2MjUsMC41MjA2MjUgMC4zMjMxMjUsMC42OTc1IDAuODUzNDM3NSwwLjE2NzE4NzUgeiIKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8bWFzayBpZD0ibWFzayIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgbWFza0NvbnRlbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8cGF0aAogICAgICAgICBkPSJNIDAsMCAwLDEgMSwxIDEsMCAwLDAgeiBNIDAuODUzNDM3NSwwLjE2NzE4NzUgMC45NTk2ODc1LDAuMjczMTI1IDAuNDI5Mzc1LDAuODAzNDM3NSAwLjMyMzEyNSwwLjkwOTY4NzUgMC4yMTcxODc1LDAuODAzNDM3NSAwLjA0MDMxMjUsMC42MjY4NzUgMC4xNDY1NjI1LDAuNTIwNjI1IDAuMzIzMTI1LDAuNjk3NSAwLjg1MzQzNzUsMC4xNjcxODc1IHoiCiAgICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIC8+CiAgICA8L21hc2s+CiAgPC9kZWZzPgogIDxyZWN0CiAgICAgd2lkdGg9IjEiCiAgICAgaGVpZ2h0PSIxIgogICAgIHg9IjAiCiAgICAgeT0iMCIKICAgICBjbGlwLXBhdGg9InVybCgjY2xpcCkiCiAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KPC9zdmc+Cg==\");mask:url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8ZGVmcz4KICAgIDxjbGlwUGF0aCBpZD0iY2xpcCI+CiAgICAgIDxwYXRoCiAgICAgICAgIGQ9Ik0gMCwwIDAsMSAxLDEgMSwwIDAsMCB6IE0gMC44NTM0Mzc1LDAuMTY3MTg3NSAwLjk1OTY4NzUsMC4yNzMxMjUgMC40MjkzNzUsMC44MDM0Mzc1IDAuMzIzMTI1LDAuOTA5Njg3NSAwLjIxNzE4NzUsMC44MDM0Mzc1IDAuMDQwMzEyNSwwLjYyNjg3NSAwLjE0NjU2MjUsMC41MjA2MjUgMC4zMjMxMjUsMC42OTc1IDAuODUzNDM3NSwwLjE2NzE4NzUgeiIKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8bWFzayBpZD0ibWFzayIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgbWFza0NvbnRlbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8cGF0aAogICAgICAgICBkPSJNIDAsMCAwLDEgMSwxIDEsMCAwLDAgeiBNIDAuODUzNDM3NSwwLjE2NzE4NzUgMC45NTk2ODc1LDAuMjczMTI1IDAuNDI5Mzc1LDAuODAzNDM3NSAwLjMyMzEyNSwwLjkwOTY4NzUgMC4yMTcxODc1LDAuODAzNDM3NSAwLjA0MDMxMjUsMC42MjY4NzUgMC4xNDY1NjI1LDAuNTIwNjI1IDAuMzIzMTI1LDAuNjk3NSAwLjg1MzQzNzUsMC4xNjcxODc1IHoiCiAgICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIC8+CiAgICA8L21hc2s+CiAgPC9kZWZzPgogIDxyZWN0CiAgICAgd2lkdGg9IjEiCiAgICAgaGVpZ2h0PSIxIgogICAgIHg9IjAiCiAgICAgeT0iMCIKICAgICBjbGlwLXBhdGg9InVybCgjY2xpcCkiCiAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KPC9zdmc+Cg==\");background:0 0;-webkit-transition-duration:.28s;transition-duration:.28s;-webkit-transition-timing-function:cubic-bezier(.4,0,.2,1);transition-timing-function:cubic-bezier(.4,0,.2,1);-webkit-transition-property:background;transition-property:background}.mdl-checkbox.is-checked .mdl-checkbox__tick-outline{background:#3f51b5 url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8cGF0aAogICAgIGQ9Ik0gMC4wNDAzODA1OSwwLjYyNjc3NjcgMC4xNDY0NDY2MSwwLjUyMDcxMDY4IDAuNDI5Mjg5MzIsMC44MDM1NTMzOSAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IE0gMC4yMTcxNTcyOSwwLjgwMzU1MzM5IDAuODUzNTUzMzksMC4xNjcxNTcyOSAwLjk1OTYxOTQxLDAuMjczMjIzMyAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IgogICAgIGlkPSJyZWN0Mzc4MCIKICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiAvPgo8L3N2Zz4K\")}.mdl-checkbox.is-checked.is-disabled .mdl-checkbox__tick-outline{background:rgba(0,0,0,.26)url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8cGF0aAogICAgIGQ9Ik0gMC4wNDAzODA1OSwwLjYyNjc3NjcgMC4xNDY0NDY2MSwwLjUyMDcxMDY4IDAuNDI5Mjg5MzIsMC44MDM1NTMzOSAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IE0gMC4yMTcxNTcyOSwwLjgwMzU1MzM5IDAuODUzNTUzMzksMC4xNjcxNTcyOSAwLjk1OTYxOTQxLDAuMjczMjIzMyAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IgogICAgIGlkPSJyZWN0Mzc4MCIKICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiAvPgo8L3N2Zz4K\")}.mdl-checkbox__label{position:relative;cursor:pointer;font-size:16px;line-height:24px;margin:0}.mdl-checkbox.is-disabled .mdl-checkbox__label{color:rgba(0,0,0,.26);cursor:auto}.mdl-checkbox__ripple-container{position:absolute;z-index:2;top:-6px;left:-10px;box-sizing:border-box;width:36px;height:36px;border-radius:50%;cursor:pointer;overflow:hidden;-webkit-mask-image:-webkit-radial-gradient(circle,#fff,#000)}.mdl-checkbox__ripple-container .mdl-ripple{background:#3f51b5}.mdl-checkbox.is-disabled .mdl-checkbox__ripple-container{cursor:auto}.mdl-checkbox.is-disabled .mdl-checkbox__ripple-container .mdl-ripple{background:0 0}.mdl-data-table{position:relative;border:1px solid rgba(0,0,0,.12);border-collapse:collapse;white-space:nowrap;font-size:13px;background-color:#fff}.mdl-data-table thead{padding-bottom:3px}.mdl-data-table thead .mdl-data-table__select{margin-top:0}.mdl-data-table tbody tr{position:relative;height:48px;-webkit-transition-duration:.28s;transition-duration:.28s;-webkit-transition-timing-function:cubic-bezier(.4,0,.2,1);transition-timing-function:cubic-bezier(.4,0,.2,1);-webkit-transition-property:background-color;transition-property:background-color}.mdl-data-table tbody tr.is-selected{background-color:#e0e0e0}.mdl-data-table tbody tr:hover{background-color:#eee}.mdl-data-table td{text-align:right}.mdl-data-table th{padding:0 18px;text-align:right}.mdl-data-table td:first-of-type,.mdl-data-table th:first-of-type{padding-left:24px}.mdl-data-table td:last-of-type,.mdl-data-table th:last-of-type{padding-right:24px}.mdl-data-table td{position:relative;vertical-align:top;height:48px;border-top:1px solid rgba(0,0,0,.12);border-bottom:1px solid rgba(0,0,0,.12);padding:12px 18px 0;box-sizing:border-box}.mdl-data-table td .mdl-data-table__select{vertical-align:top;position:absolute;left:24px}.mdl-data-table th{position:relative;vertical-align:bottom;text-overflow:ellipsis;font-weight:700;line-height:24px;letter-spacing:0;height:48px;font-size:12px;color:rgba(0,0,0,.54);padding-bottom:8px;box-sizing:border-box}.mdl-data-table th .mdl-data-table__select{position:absolute;bottom:8px;left:24px}.mdl-data-table__select{width:16px}.mdl-data-table__cell--non-numeric.mdl-data-table__cell--non-numeric{text-align:left}.mdl-mega-footer{padding:16px 40px;color:#9e9e9e;background-color:#424242}.mdl-mega-footer--top-section:after,.mdl-mega-footer--middle-section:after,.mdl-mega-footer--bottom-section:after,.mdl-mega-footer__top-section:after,.mdl-mega-footer__middle-section:after,.mdl-mega-footer__bottom-section:after{content:'';display:block;clear:both}.mdl-mega-footer--left-section,.mdl-mega-footer__left-section,.mdl-mega-footer--right-section,.mdl-mega-footer__right-section{margin-bottom:16px}.mdl-mega-footer--right-section a,.mdl-mega-footer__right-section a{display:block;margin-bottom:16px;color:inherit;text-decoration:none}@media screen and (min-width:760px){.mdl-mega-footer--left-section,.mdl-mega-footer__left-section{float:left}.mdl-mega-footer--right-section,.mdl-mega-footer__right-section{float:right}.mdl-mega-footer--right-section a,.mdl-mega-footer__right-section a{display:inline-block;margin-left:16px;line-height:36px;vertical-align:middle}}.mdl-mega-footer--social-btn,.mdl-mega-footer__social-btn{width:36px;height:36px;padding:0;margin:0;background-color:#9e9e9e;border:none}.mdl-mega-footer--drop-down-section,.mdl-mega-footer__drop-down-section{display:block;position:relative}@media screen and (min-width:760px){.mdl-mega-footer--drop-down-section,.mdl-mega-footer__drop-down-section{width:33%}.mdl-mega-footer--drop-down-section:nth-child(1),.mdl-mega-footer--drop-down-section:nth-child(2),.mdl-mega-footer__drop-down-section:nth-child(1),.mdl-mega-footer__drop-down-section:nth-child(2){float:left}.mdl-mega-footer--drop-down-section:nth-child(3),.mdl-mega-footer__drop-down-section:nth-child(3){float:right}.mdl-mega-footer--drop-down-section:nth-child(3):after,.mdl-mega-footer__drop-down-section:nth-child(3):after{clear:right}.mdl-mega-footer--drop-down-section:nth-child(4),.mdl-mega-footer__drop-down-section:nth-child(4){clear:right;float:right}.mdl-mega-footer--middle-section:after,.mdl-mega-footer__middle-section:after{content:'';display:block;clear:both}.mdl-mega-footer--bottom-section,.mdl-mega-footer__bottom-section{padding-top:0}}@media screen and (min-width:1024px){.mdl-mega-footer--drop-down-section,.mdl-mega-footer--drop-down-section:nth-child(3),.mdl-mega-footer--drop-down-section:nth-child(4),.mdl-mega-footer__drop-down-section,.mdl-mega-footer__drop-down-section:nth-child(3),.mdl-mega-footer__drop-down-section:nth-child(4){width:24%;float:left}}.mdl-mega-footer--heading-checkbox,.mdl-mega-footer__heading-checkbox{position:absolute;width:100%;height:55.8px;padding:32px;margin:-16px 0 0;cursor:pointer;z-index:1;opacity:0}.mdl-mega-footer--heading-checkbox+.mdl-mega-footer--heading:after,.mdl-mega-footer--heading-checkbox+.mdl-mega-footer__heading:after,.mdl-mega-footer__heading-checkbox+.mdl-mega-footer--heading:after,.mdl-mega-footer__heading-checkbox+.mdl-mega-footer__heading:after{font-family:'Material Icons';content:'\\E5CE'}.mdl-mega-footer--heading-checkbox:checked~.mdl-mega-footer--link-list,.mdl-mega-footer--heading-checkbox:checked~.mdl-mega-footer__link-list,.mdl-mega-footer--heading-checkbox:checked+.mdl-mega-footer--heading+.mdl-mega-footer--link-list,.mdl-mega-footer--heading-checkbox:checked+.mdl-mega-footer__heading+.mdl-mega-footer__link-list,.mdl-mega-footer__heading-checkbox:checked~.mdl-mega-footer--link-list,.mdl-mega-footer__heading-checkbox:checked~.mdl-mega-footer__link-list,.mdl-mega-footer__heading-checkbox:checked+.mdl-mega-footer--heading+.mdl-mega-footer--link-list,.mdl-mega-footer__heading-checkbox:checked+.mdl-mega-footer__heading+.mdl-mega-footer__link-list{display:none}.mdl-mega-footer--heading-checkbox:checked+.mdl-mega-footer--heading:after,.mdl-mega-footer--heading-checkbox:checked+.mdl-mega-footer__heading:after,.mdl-mega-footer__heading-checkbox:checked+.mdl-mega-footer--heading:after,.mdl-mega-footer__heading-checkbox:checked+.mdl-mega-footer__heading:after{font-family:'Material Icons';content:'\\E5CF'}.mdl-mega-footer--heading,.mdl-mega-footer__heading{position:relative;width:100%;padding-right:39.8px;margin-bottom:16px;box-sizing:border-box;font-size:14px;line-height:23.8px;font-weight:500;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;color:#e0e0e0}.mdl-mega-footer--heading:after,.mdl-mega-footer__heading:after{content:'';position:absolute;top:0;right:0;display:block;width:23.8px;height:23.8px;background-size:cover}.mdl-mega-footer--link-list,.mdl-mega-footer__link-list{list-style:none;padding:0;margin:0 0 32px}.mdl-mega-footer--link-list:after,.mdl-mega-footer__link-list:after{clear:both;display:block;content:''}.mdl-mega-footer--link-list li,.mdl-mega-footer__link-list li{font-size:14px;font-weight:400;letter-spacing:0;line-height:20px}.mdl-mega-footer--link-list a,.mdl-mega-footer__link-list a{color:inherit;text-decoration:none;white-space:nowrap}@media screen and (min-width:760px){.mdl-mega-footer--heading-checkbox,.mdl-mega-footer__heading-checkbox{display:none}.mdl-mega-footer--heading-checkbox+.mdl-mega-footer--heading:after,.mdl-mega-footer--heading-checkbox+.mdl-mega-footer__heading:after,.mdl-mega-footer__heading-checkbox+.mdl-mega-footer--heading:after,.mdl-mega-footer__heading-checkbox+.mdl-mega-footer__heading:after{background-image:none}.mdl-mega-footer--heading-checkbox:checked~.mdl-mega-footer--link-list,.mdl-mega-footer--heading-checkbox:checked~.mdl-mega-footer__link-list,.mdl-mega-footer--heading-checkbox:checked+.mdl-mega-footer__heading+.mdl-mega-footer__link-list,.mdl-mega-footer--heading-checkbox:checked+.mdl-mega-footer--heading+.mdl-mega-footer--link-list,.mdl-mega-footer__heading-checkbox:checked~.mdl-mega-footer--link-list,.mdl-mega-footer__heading-checkbox:checked~.mdl-mega-footer__link-list,.mdl-mega-footer__heading-checkbox:checked+.mdl-mega-footer__heading+.mdl-mega-footer__link-list,.mdl-mega-footer__heading-checkbox:checked+.mdl-mega-footer--heading+.mdl-mega-footer--link-list{display:block}.mdl-mega-footer--heading-checkbox:checked+.mdl-mega-footer--heading:after,.mdl-mega-footer--heading-checkbox:checked+.mdl-mega-footer__heading:after,.mdl-mega-footer__heading-checkbox:checked+.mdl-mega-footer--heading:after,.mdl-mega-footer__heading-checkbox:checked+.mdl-mega-footer__heading:after{content:''}}.mdl-mega-footer--bottom-section,.mdl-mega-footer__bottom-section{padding-top:16px;margin-bottom:16px}.mdl-logo{margin-bottom:16px;color:#fff}.mdl-mega-footer--bottom-section .mdl-mega-footer--link-list li,.mdl-mega-footer__bottom-section .mdl-mega-footer__link-list li{float:left;margin-bottom:0;margin-right:16px}@media screen and (min-width:760px){.mdl-logo{float:left;margin-bottom:0;margin-right:16px}}.mdl-mini-footer{display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-flow:row wrap;-ms-flex-flow:row wrap;flex-flow:row wrap;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;padding:32px 16px;color:#9e9e9e;background-color:#424242}.mdl-mini-footer:after{content:'';display:block}.mdl-mini-footer .mdl-logo{line-height:36px}.mdl-mini-footer--link-list,.mdl-mini-footer__link-list{display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-flow:row nowrap;-ms-flex-flow:row nowrap;flex-flow:row nowrap;list-style:none;margin:0;padding:0}.mdl-mini-footer--link-list li,.mdl-mini-footer__link-list li{margin-bottom:0;margin-right:16px}@media screen and (min-width:760px){.mdl-mini-footer--link-list li,.mdl-mini-footer__link-list li{line-height:36px}}.mdl-mini-footer--link-list a,.mdl-mini-footer__link-list a{color:inherit;text-decoration:none;white-space:nowrap}.mdl-mini-footer--left-section,.mdl-mini-footer__left-section{display:inline-block;-webkit-box-ordinal-group:1;-webkit-order:0;-ms-flex-order:0;order:0}.mdl-mini-footer--right-section,.mdl-mini-footer__right-section{display:inline-block;-webkit-box-ordinal-group:2;-webkit-order:1;-ms-flex-order:1;order:1}.mdl-mini-footer--social-btn,.mdl-mini-footer__social-btn{width:36px;height:36px;padding:0;margin:0;background-color:#9e9e9e;border:none}.mdl-icon-toggle{position:relative;z-index:1;vertical-align:middle;display:inline-block;height:32px;margin:0;padding:0}.mdl-icon-toggle__input{line-height:32px}.mdl-icon-toggle.is-upgraded .mdl-icon-toggle__input{position:absolute;width:0;height:0;margin:0;padding:0;opacity:0;-ms-appearance:none;-moz-appearance:none;-webkit-appearance:none;appearance:none;border:none}.mdl-icon-toggle__label{display:inline-block;position:relative;cursor:pointer;height:32px;width:32px;min-width:32px;color:#616161;border-radius:50%;padding:0;margin-left:0;margin-right:0;text-align:center;background-color:transparent;will-change:background-color;-webkit-transition:background-color .2s cubic-bezier(.4,0,.2,1),color .2s cubic-bezier(.4,0,.2,1);transition:background-color .2s cubic-bezier(.4,0,.2,1),color .2s cubic-bezier(.4,0,.2,1)}.mdl-icon-toggle__label.material-icons{line-height:32px;font-size:24px}.mdl-icon-toggle.is-checked .mdl-icon-toggle__label{color:#3f51b5}.mdl-icon-toggle.is-disabled .mdl-icon-toggle__label{color:rgba(0,0,0,.26);cursor:auto;-webkit-transition:none;transition:none}.mdl-icon-toggle.is-focused .mdl-icon-toggle__label{background-color:rgba(0,0,0,.12)}.mdl-icon-toggle.is-focused.is-checked .mdl-icon-toggle__label{background-color:rgba(63,81,181,.26)}.mdl-icon-toggle__ripple-container{position:absolute;z-index:2;top:-2px;left:-2px;box-sizing:border-box;width:36px;height:36px;border-radius:50%;cursor:pointer;overflow:hidden;-webkit-mask-image:-webkit-radial-gradient(circle,#fff,#000)}.mdl-icon-toggle__ripple-container .mdl-ripple{background:#616161}.mdl-icon-toggle.is-disabled .mdl-icon-toggle__ripple-container{cursor:auto}.mdl-icon-toggle.is-disabled .mdl-icon-toggle__ripple-container .mdl-ripple{background:0 0}.mdl-menu__container{display:block;margin:0;padding:0;border:none;position:absolute;overflow:visible;height:0;width:0;visibility:hidden;z-index:-1}.mdl-menu__container.is-visible,.mdl-menu__container.is-animating{z-index:999;visibility:visible}.mdl-menu__outline{display:block;background:#fff;margin:0;padding:0;border:none;border-radius:2px;position:absolute;top:0;left:0;overflow:hidden;opacity:0;-webkit-transform:scale(0);-ms-transform:scale(0);transform:scale(0);-webkit-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0;box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);will-change:transform;-webkit-transition:-webkit-transform .3s cubic-bezier(.4,0,.2,1),opacity .2s cubic-bezier(.4,0,.2,1);transition:transform .3s cubic-bezier(.4,0,.2,1),opacity .2s cubic-bezier(.4,0,.2,1);z-index:-1}.mdl-menu__container.is-visible .mdl-menu__outline{opacity:1;-webkit-transform:scale(1);-ms-transform:scale(1);transform:scale(1);z-index:999}.mdl-menu__outline.mdl-menu--bottom-right{-webkit-transform-origin:100% 0;-ms-transform-origin:100% 0;transform-origin:100% 0}.mdl-menu__outline.mdl-menu--top-left{-webkit-transform-origin:0 100%;-ms-transform-origin:0 100%;transform-origin:0 100%}.mdl-menu__outline.mdl-menu--top-right{-webkit-transform-origin:100% 100%;-ms-transform-origin:100% 100%;transform-origin:100% 100%}.mdl-menu{position:absolute;list-style:none;top:0;left:0;height:auto;width:auto;min-width:124px;padding:8px 0;margin:0;opacity:0;clip:rect(0 0 0 0);z-index:-1}.mdl-menu__container.is-visible .mdl-menu{opacity:1;z-index:999}.mdl-menu.is-animating{-webkit-transition:opacity .2s cubic-bezier(.4,0,.2,1),clip .3s cubic-bezier(.4,0,.2,1);transition:opacity .2s cubic-bezier(.4,0,.2,1),clip .3s cubic-bezier(.4,0,.2,1)}.mdl-menu.mdl-menu--bottom-right{left:auto;right:0}.mdl-menu.mdl-menu--top-left{top:auto;bottom:0}.mdl-menu.mdl-menu--top-right{top:auto;left:auto;bottom:0;right:0}.mdl-menu.mdl-menu--unaligned{top:auto;left:auto}.mdl-menu__item{display:block;border:none;color:rgba(0,0,0,.87);background-color:transparent;text-align:left;margin:0;padding:0 16px;outline-color:#bdbdbd;position:relative;overflow:hidden;font-size:14px;font-weight:400;letter-spacing:0;text-decoration:none;cursor:pointer;height:48px;line-height:48px;white-space:nowrap;opacity:0;-webkit-transition:opacity .2s cubic-bezier(.4,0,.2,1);transition:opacity .2s cubic-bezier(.4,0,.2,1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mdl-menu__container.is-visible .mdl-menu__item{opacity:1}.mdl-menu__item::-moz-focus-inner{border:0}.mdl-menu__item[disabled]{color:#bdbdbd;background-color:transparent;cursor:auto}.mdl-menu__item[disabled]:hover{background-color:transparent}.mdl-menu__item[disabled]:focus{background-color:transparent}.mdl-menu__item[disabled] .mdl-ripple{background:0 0}.mdl-menu__item:hover{background-color:#eee}.mdl-menu__item:focus{outline:none;background-color:#eee}.mdl-menu__item:active{background-color:#e0e0e0}.mdl-menu__item--ripple-container{display:block;height:100%;left:0;position:absolute;top:0;width:100%;z-index:0;overflow:hidden}.mdl-progress{display:block;position:relative;height:4px;width:500px}.mdl-progress>.bar{display:block;position:absolute;top:0;bottom:0;width:0%;-webkit-transition:width .2s cubic-bezier(.4,0,.2,1);transition:width .2s cubic-bezier(.4,0,.2,1)}.mdl-progress>.progressbar{background-color:#3f51b5;z-index:1;left:0}.mdl-progress>.bufferbar{background-image:-webkit-linear-gradient(left,rgba(255,255,255,.7),rgba(255,255,255,.7)),-webkit-linear-gradient(left,#3f51b5 ,#3f51b5);background-image:linear-gradient(to right,rgba(255,255,255,.7),rgba(255,255,255,.7)),linear-gradient(to right,#3f51b5 ,#3f51b5);z-index:0;left:0}.mdl-progress>.auxbar{right:0}@supports (-webkit-appearance:none){.mdl-progress:not(.mdl-progress__indeterminate):not(.mdl-progress__indeterminate)>.auxbar{background-image:-webkit-linear-gradient(left,rgba(255,255,255,.7),rgba(255,255,255,.7)),-webkit-linear-gradient(left,#3f51b5 ,#3f51b5);background-image:linear-gradient(to right,rgba(255,255,255,.7),rgba(255,255,255,.7)),linear-gradient(to right,#3f51b5 ,#3f51b5);-webkit-mask:url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjEyIiBoZWlnaHQ9IjQiIHZpZXdQb3J0PSIwIDAgMTIgNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxlbGxpcHNlIGN4PSIyIiBjeT0iMiIgcng9IjIiIHJ5PSIyIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImN4IiBmcm9tPSIyIiB0bz0iLTEwIiBkdXI9IjAuNnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPgogIDwvZWxsaXBzZT4KICA8ZWxsaXBzZSBjeD0iMTQiIGN5PSIyIiByeD0iMiIgcnk9IjIiIGNsYXNzPSJsb2FkZXIiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iY3giIGZyb209IjE0IiB0bz0iMiIgZHVyPSIwLjZzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4KICA8L2VsbGlwc2U+Cjwvc3ZnPgo=\");mask:url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjEyIiBoZWlnaHQ9IjQiIHZpZXdQb3J0PSIwIDAgMTIgNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxlbGxpcHNlIGN4PSIyIiBjeT0iMiIgcng9IjIiIHJ5PSIyIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImN4IiBmcm9tPSIyIiB0bz0iLTEwIiBkdXI9IjAuNnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPgogIDwvZWxsaXBzZT4KICA8ZWxsaXBzZSBjeD0iMTQiIGN5PSIyIiByeD0iMiIgcnk9IjIiIGNsYXNzPSJsb2FkZXIiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iY3giIGZyb209IjE0IiB0bz0iMiIgZHVyPSIwLjZzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4KICA8L2VsbGlwc2U+Cjwvc3ZnPgo=\")}}.mdl-progress:not(.mdl-progress__indeterminate)>.auxbar{background-image:-webkit-linear-gradient(left,rgba(255,255,255,.9),rgba(255,255,255,.9)),-webkit-linear-gradient(left,#3f51b5 ,#3f51b5);background-image:linear-gradient(to right,rgba(255,255,255,.9),rgba(255,255,255,.9)),linear-gradient(to right,#3f51b5 ,#3f51b5)}.mdl-progress.mdl-progress__indeterminate>.bar1{-webkit-animation-name:indeterminate1;animation-name:indeterminate1}.mdl-progress.mdl-progress__indeterminate>.bar1,.mdl-progress.mdl-progress__indeterminate>.bar3{background-color:#3f51b5;-webkit-animation-duration:2s;animation-duration:2s;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;-webkit-animation-timing-function:linear;animation-timing-function:linear}.mdl-progress.mdl-progress__indeterminate>.bar3{background-image:none;-webkit-animation-name:indeterminate2;animation-name:indeterminate2}@-webkit-keyframes indeterminate1{0%{left:0%;width:0%}50%{left:25%;width:75%}75%{left:100%;width:0%}}@keyframes indeterminate1{0%{left:0%;width:0%}50%{left:25%;width:75%}75%{left:100%;width:0%}}@-webkit-keyframes indeterminate2{0%,50%{left:0%;width:0%}75%{left:0%;width:25%}100%{left:100%;width:0%}}@keyframes indeterminate2{0%,50%{left:0%;width:0%}75%{left:0%;width:25%}100%{left:100%;width:0%}}.mdl-navigation{display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;box-sizing:border-box}.mdl-navigation__link{color:#424242;text-decoration:none;font-weight:500;font-size:13px;margin:0}.mdl-layout{width:100%;height:100%;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;overflow-y:auto;overflow-x:hidden;position:relative;-webkit-overflow-scrolling:touch}.mdl-layout.is-small-screen .mdl-layout--large-screen-only{display:none}.mdl-layout:not(.is-small-screen) .mdl-layout--small-screen-only{display:none}.mdl-layout__container{position:absolute;width:100%;height:100%}.mdl-layout__title,.mdl-layout-title{display:block;position:relative;font-family:\"Roboto\",\"Helvetica\",\"Arial\",sans-serif;font-size:20px;line-height:1;letter-spacing:.02em;font-weight:400;box-sizing:border-box}.mdl-layout-spacer{-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1}.mdl-layout__drawer{display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;width:240px;height:100%;max-height:100%;position:absolute;top:0;left:0;box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);box-sizing:border-box;border-right:1px solid #e0e0e0;background:#fafafa;-webkit-transform:translateX(-250px);-ms-transform:translateX(-250px);transform:translateX(-250px);-webkit-transform-style:preserve-3d;transform-style:preserve-3d;will-change:transform;-webkit-transition-duration:.2s;transition-duration:.2s;-webkit-transition-timing-function:cubic-bezier(.4,0,.2,1);transition-timing-function:cubic-bezier(.4,0,.2,1);-webkit-transition-property:-webkit-transform;transition-property:transform;color:#424242;overflow:visible;overflow-y:auto;z-index:5}.mdl-layout__drawer.is-visible{-webkit-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0)}.mdl-layout__drawer.is-visible~.mdl-layout__content.mdl-layout__content{overflow:hidden}.mdl-layout__drawer>*{-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.mdl-layout__drawer>.mdl-layout__title,.mdl-layout__drawer>.mdl-layout-title{line-height:64px;padding-left:40px}@media screen and (max-width:1024px){.mdl-layout__drawer>.mdl-layout__title,.mdl-layout__drawer>.mdl-layout-title{line-height:56px;padding-left:16px}}.mdl-layout__drawer .mdl-navigation{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:stretch;-webkit-align-items:stretch;-ms-flex-align:stretch;align-items:stretch;padding-top:16px}.mdl-layout__drawer .mdl-navigation .mdl-navigation__link{display:block;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;padding:16px 40px;margin:0;color:#757575}@media screen and (max-width:1024px){.mdl-layout__drawer .mdl-navigation .mdl-navigation__link{padding:16px}}.mdl-layout__drawer .mdl-navigation .mdl-navigation__link:hover{background-color:#e0e0e0}.mdl-layout__drawer .mdl-navigation .mdl-navigation__link--current{background-color:#000;color:#e0e0e0}@media screen and (min-width:1025px){.mdl-layout--fixed-drawer>.mdl-layout__drawer{-webkit-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0)}}.mdl-layout__drawer-button{display:block;position:absolute;height:48px;width:48px;border:0;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;overflow:hidden;text-align:center;cursor:pointer;font-size:26px;line-height:50px;font-family:Helvetica,Arial,sans-serif;margin:10px 12px;top:0;left:0;color:#fff;z-index:4}.mdl-layout__header .mdl-layout__drawer-button{position:absolute;color:#fff;background-color:inherit}@media screen and (max-width:1024px){.mdl-layout__header .mdl-layout__drawer-button{margin:4px}}@media screen and (max-width:1024px){.mdl-layout__drawer-button{margin:4px;color:rgba(0,0,0,.5)}}@media screen and (min-width:1025px){.mdl-layout--fixed-drawer>.mdl-layout__drawer-button{display:none}}.mdl-layout__header{display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;box-sizing:border-box;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;width:100%;margin:0;padding:0;border:none;min-height:64px;max-height:1000px;z-index:3;background-color:#3f51b5;color:#fff;box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);-webkit-transition-duration:.2s;transition-duration:.2s;-webkit-transition-timing-function:cubic-bezier(.4,0,.2,1);transition-timing-function:cubic-bezier(.4,0,.2,1);-webkit-transition-property:max-height,box-shadow;transition-property:max-height,box-shadow}@media screen and (max-width:1024px){.mdl-layout__header{min-height:56px}}.mdl-layout--fixed-drawer.is-upgraded:not(.is-small-screen)>.mdl-layout__header{margin-left:240px;width:calc(100% - 240px)}@media screen and (min-width:1025px){.mdl-layout--fixed-drawer>.mdl-layout__header .mdl-layout__header-row{padding-left:40px}}.mdl-layout__header>.mdl-layout-icon{position:absolute;left:40px;top:16px;height:32px;width:32px;overflow:hidden;z-index:3;display:block}@media screen and (max-width:1024px){.mdl-layout__header>.mdl-layout-icon{left:16px;top:12px}}.mdl-layout.has-drawer .mdl-layout__header>.mdl-layout-icon{display:none}.mdl-layout__header.is-compact{max-height:64px}@media screen and (max-width:1024px){.mdl-layout__header.is-compact{max-height:56px}}.mdl-layout__header.is-compact.has-tabs{height:112px}@media screen and (max-width:1024px){.mdl-layout__header.is-compact.has-tabs{min-height:104px}}@media screen and (max-width:1024px){.mdl-layout__header{display:none}.mdl-layout--fixed-header>.mdl-layout__header{display:-webkit-flex;display:-ms-flexbox;display:flex}}.mdl-layout__header--transparent.mdl-layout__header--transparent{background-color:transparent;box-shadow:none}.mdl-layout__header--seamed,.mdl-layout__header--scroll{box-shadow:none}.mdl-layout__header--waterfall{box-shadow:none;overflow:hidden}.mdl-layout__header--waterfall.is-casting-shadow{box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12)}.mdl-layout__header-row{display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;box-sizing:border-box;-webkit-align-self:stretch;-ms-flex-item-align:stretch;align-self:stretch;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;height:64px;margin:0;padding:0 40px 0 80px}@media screen and (max-width:1024px){.mdl-layout__header-row{height:56px;padding:0 16px 0 72px}}.mdl-layout__header-row>*{-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.mdl-layout__header--scroll .mdl-layout__header-row{width:100%}.mdl-layout__header-row .mdl-navigation{margin:0;padding:0;height:64px;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}@media screen and (max-width:1024px){.mdl-layout__header-row .mdl-navigation{height:56px}}.mdl-layout__header-row .mdl-navigation__link{display:block;color:#fff;line-height:64px;padding:0 24px}@media screen and (max-width:1024px){.mdl-layout__header-row .mdl-navigation__link{line-height:56px;padding:0 16px}}.mdl-layout__obfuscator{background-color:transparent;position:absolute;top:0;left:0;height:100%;width:100%;z-index:4;visibility:hidden;-webkit-transition-property:background-color;transition-property:background-color;-webkit-transition-duration:.2s;transition-duration:.2s;-webkit-transition-timing-function:cubic-bezier(.4,0,.2,1);transition-timing-function:cubic-bezier(.4,0,.2,1)}.mdl-layout__obfuscator.is-visible{background-color:rgba(0,0,0,.5);visibility:visible}.mdl-layout__content{-ms-flex:0 1 auto;display:inline-block;overflow-y:auto;overflow-x:hidden;-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;z-index:1;-webkit-overflow-scrolling:touch}.mdl-layout--fixed-drawer>.mdl-layout__content{margin-left:240px}.mdl-layout__container.has-scrolling-header .mdl-layout__content{overflow:visible}@media screen and (max-width:1024px){.mdl-layout--fixed-drawer>.mdl-layout__content{margin-left:0}.mdl-layout__container.has-scrolling-header .mdl-layout__content{overflow-y:auto;overflow-x:hidden}}.mdl-layout__tab-bar{height:96px;margin:0;width:calc(100% - 112px);padding:0 0 0 56px;display:-webkit-flex;display:-ms-flexbox;display:flex;background-color:#3f51b5;overflow-y:hidden;overflow-x:scroll}.mdl-layout__tab-bar::-webkit-scrollbar{display:none}@media screen and (max-width:1024px){.mdl-layout__tab-bar{width:calc(100% - 60px);padding:0 0 0 60px}}.mdl-layout--fixed-tabs .mdl-layout__tab-bar{padding:0;overflow:hidden;width:100%}.mdl-layout__tab-bar-container{position:relative;height:48px;width:100%;border:none;margin:0;z-index:2;-webkit-box-flex:0;-webkit-flex-grow:0;-ms-flex-positive:0;flex-grow:0;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;overflow:hidden}.mdl-layout__container>.mdl-layout__tab-bar-container{position:absolute;top:0;left:0}.mdl-layout__tab-bar-button{display:inline-block;position:absolute;top:0;height:48px;width:56px;z-index:4;text-align:center;background-color:#3f51b5;color:transparent;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}@media screen and (max-width:1024px){.mdl-layout__tab-bar-button{display:none;width:60px}}.mdl-layout--fixed-tabs .mdl-layout__tab-bar-button{display:none}.mdl-layout__tab-bar-button .material-icons{line-height:48px}.mdl-layout__tab-bar-button.is-active{color:#fff}.mdl-layout__tab-bar-left-button{left:0}.mdl-layout__tab-bar-right-button{right:0}.mdl-layout__tab{margin:0;border:none;padding:0 24px;float:left;position:relative;display:block;-webkit-box-flex:0;-webkit-flex-grow:0;-ms-flex-positive:0;flex-grow:0;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;text-decoration:none;height:48px;line-height:48px;text-align:center;font-weight:500;font-size:14px;text-transform:uppercase;color:rgba(255,255,255,.6);overflow:hidden}@media screen and (max-width:1024px){.mdl-layout__tab{padding:0 12px}}.mdl-layout--fixed-tabs .mdl-layout__tab{float:none;-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;padding:0}.mdl-layout.is-upgraded .mdl-layout__tab.is-active{color:#fff}.mdl-layout.is-upgraded .mdl-layout__tab.is-active::after{height:2px;width:100%;display:block;content:\" \";bottom:0;left:0;position:absolute;background:#ff4081;-webkit-animation:border-expand .2s cubic-bezier(.4,0,.4,1).01s alternate forwards;animation:border-expand .2s cubic-bezier(.4,0,.4,1).01s alternate forwards;-webkit-transition:all 1s cubic-bezier(.4,0,1,1);transition:all 1s cubic-bezier(.4,0,1,1)}.mdl-layout__tab .mdl-layout__tab-ripple-container{display:block;position:absolute;height:100%;width:100%;left:0;top:0;z-index:1;overflow:hidden}.mdl-layout__tab .mdl-layout__tab-ripple-container .mdl-ripple{background-color:#fff}.mdl-layout__tab-panel{display:block}.mdl-layout.is-upgraded .mdl-layout__tab-panel{display:none}.mdl-layout.is-upgraded .mdl-layout__tab-panel.is-active{display:block}.mdl-radio{position:relative;font-size:16px;line-height:24px;display:inline-block;box-sizing:border-box;margin:0;padding-left:0}.mdl-radio.is-upgraded{padding-left:24px}.mdl-radio__button{line-height:24px}.mdl-radio.is-upgraded .mdl-radio__button{position:absolute;width:0;height:0;margin:0;padding:0;opacity:0;-ms-appearance:none;-moz-appearance:none;-webkit-appearance:none;appearance:none;border:none}.mdl-radio__outer-circle{position:absolute;top:4px;left:0;display:inline-block;box-sizing:border-box;width:16px;height:16px;margin:0;cursor:pointer;border:2px solid rgba(0,0,0,.54);border-radius:50%;z-index:2}.mdl-radio.is-checked .mdl-radio__outer-circle{border:2px solid #3f51b5}.mdl-radio.is-disabled .mdl-radio__outer-circle{border:2px solid rgba(0,0,0,.26);cursor:auto}.mdl-radio__inner-circle{position:absolute;z-index:1;margin:0;top:8px;left:4px;box-sizing:border-box;width:8px;height:8px;cursor:pointer;-webkit-transition-duration:.28s;transition-duration:.28s;-webkit-transition-timing-function:cubic-bezier(.4,0,.2,1);transition-timing-function:cubic-bezier(.4,0,.2,1);-webkit-transition-property:-webkit-transform;transition-property:transform;-webkit-transform:scale3d(0,0,0);transform:scale3d(0,0,0);border-radius:50%;background:#3f51b5}.mdl-radio.is-checked .mdl-radio__inner-circle{-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}.mdl-radio.is-disabled .mdl-radio__inner-circle{background:rgba(0,0,0,.26);cursor:auto}.mdl-radio.is-focused .mdl-radio__inner-circle{box-shadow:0 0 0 10px rgba(0,0,0,.1)}.mdl-radio__label{cursor:pointer}.mdl-radio.is-disabled .mdl-radio__label{color:rgba(0,0,0,.26);cursor:auto}.mdl-radio__ripple-container{position:absolute;z-index:2;top:-9px;left:-13px;box-sizing:border-box;width:42px;height:42px;border-radius:50%;cursor:pointer;overflow:hidden;-webkit-mask-image:-webkit-radial-gradient(circle,#fff,#000)}.mdl-radio__ripple-container .mdl-ripple{background:#3f51b5}.mdl-radio.is-disabled .mdl-radio__ripple-container{cursor:auto}.mdl-radio.is-disabled .mdl-radio__ripple-container .mdl-ripple{background:0 0}_:-ms-input-placeholder,:root .mdl-slider.mdl-slider.is-upgraded{-ms-appearance:none;height:32px;margin:0}.mdl-slider{width:calc(100% - 40px);margin:0 20px}.mdl-slider.is-upgraded{-webkit-appearance:none;-moz-appearance:none;appearance:none;height:2px;background:0 0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:0;padding:0;color:#3f51b5;-webkit-align-self:center;-ms-flex-item-align:center;align-self:center;z-index:1;cursor:pointer}.mdl-slider.is-upgraded::-moz-focus-outer{border:0}.mdl-slider.is-upgraded::-ms-tooltip{display:none}.mdl-slider.is-upgraded::-webkit-slider-runnable-track{background:0 0}.mdl-slider.is-upgraded::-moz-range-track{background:0 0;border:none}.mdl-slider.is-upgraded::-ms-track{background:0 0;color:transparent;height:2px;width:100%;border:none}.mdl-slider.is-upgraded::-ms-fill-lower{padding:0;background:linear-gradient(to right,transparent,transparent 16px,#3f51b5 16px,#3f51b5 0)}.mdl-slider.is-upgraded::-ms-fill-upper{padding:0;background:linear-gradient(to left,transparent,transparent 16px,rgba(0,0,0,.26)16px,rgba(0,0,0,.26)0)}.mdl-slider.is-upgraded::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;box-sizing:border-box;border-radius:50%;background:#3f51b5;border:none;-webkit-transition:-webkit-transform .18s cubic-bezier(.4,0,.2,1),border .18s cubic-bezier(.4,0,.2,1),box-shadow .18s cubic-bezier(.4,0,.2,1),background .28s cubic-bezier(.4,0,.2,1);transition:transform .18s cubic-bezier(.4,0,.2,1),border .18s cubic-bezier(.4,0,.2,1),box-shadow .18s cubic-bezier(.4,0,.2,1),background .28s cubic-bezier(.4,0,.2,1)}.mdl-slider.is-upgraded::-moz-range-thumb{-moz-appearance:none;width:12px;height:12px;box-sizing:border-box;border-radius:50%;background-image:none;background:#3f51b5;border:none}.mdl-slider.is-upgraded:focus:not(:active)::-webkit-slider-thumb{box-shadow:0 0 0 10px rgba(63,81,181,.26)}.mdl-slider.is-upgraded:focus:not(:active)::-moz-range-thumb{box-shadow:0 0 0 10px rgba(63,81,181,.26)}.mdl-slider.is-upgraded:active::-webkit-slider-thumb{background-image:none;background:#3f51b5;-webkit-transform:scale(1.5);transform:scale(1.5)}.mdl-slider.is-upgraded:active::-moz-range-thumb{background-image:none;background:#3f51b5;transform:scale(1.5)}.mdl-slider.is-upgraded::-ms-thumb{width:32px;height:32px;border:none;border-radius:50%;background:#3f51b5;-ms-transform:scale(.375);transform:scale(.375);transition:transform .18s cubic-bezier(.4,0,.2,1),background .28s cubic-bezier(.4,0,.2,1)}.mdl-slider.is-upgraded:focus:not(:active)::-ms-thumb{background:radial-gradient(circle closest-side,#3f51b5 0%,#3f51b5 37.5%,rgba(63,81,181,.26)37.5%,rgba(63,81,181,.26)100%);-ms-transform:scale(1);transform:scale(1)}.mdl-slider.is-upgraded:active::-ms-thumb{background:#3f51b5;-ms-transform:scale(.5625);transform:scale(.5625)}.mdl-slider.is-upgraded.is-lowest-value::-webkit-slider-thumb{border:2px solid rgba(0,0,0,.26);background:0 0}.mdl-slider.is-upgraded.is-lowest-value::-moz-range-thumb{border:2px solid rgba(0,0,0,.26);background:0 0}.mdl-slider.is-upgraded.is-lowest-value+.mdl-slider__background-flex>.mdl-slider__background-upper{left:6px}.mdl-slider.is-upgraded.is-lowest-value:focus:not(:active)::-webkit-slider-thumb{box-shadow:0 0 0 10px rgba(0,0,0,.12);background:rgba(0,0,0,.12)}.mdl-slider.is-upgraded.is-lowest-value:focus:not(:active)::-moz-range-thumb{box-shadow:0 0 0 10px rgba(0,0,0,.12);background:rgba(0,0,0,.12)}.mdl-slider.is-upgraded.is-lowest-value:active::-webkit-slider-thumb{border:1.6px solid rgba(0,0,0,.26);-webkit-transform:scale(1.5);transform:scale(1.5)}.mdl-slider.is-upgraded.is-lowest-value:active+.mdl-slider__background-flex>.mdl-slider__background-upper{left:9px}.mdl-slider.is-upgraded.is-lowest-value:active::-moz-range-thumb{border:1.5px solid rgba(0,0,0,.26);transform:scale(1.5)}.mdl-slider.is-upgraded.is-lowest-value::-ms-thumb{background:radial-gradient(circle closest-side,transparent 0%,transparent 66.67%,rgba(0,0,0,.26)66.67%,rgba(0,0,0,.26)100%)}.mdl-slider.is-upgraded.is-lowest-value:focus:not(:active)::-ms-thumb{background:radial-gradient(circle closest-side,rgba(0,0,0,.12)0%,rgba(0,0,0,.12)25%,rgba(0,0,0,.26)25%,rgba(0,0,0,.26)37.5%,rgba(0,0,0,.12)37.5%,rgba(0,0,0,.12)100%);-ms-transform:scale(1);transform:scale(1)}.mdl-slider.is-upgraded.is-lowest-value:active::-ms-thumb{-ms-transform:scale(.5625);transform:scale(.5625);background:radial-gradient(circle closest-side,transparent 0%,transparent 77.78%,rgba(0,0,0,.26)77.78%,rgba(0,0,0,.26)100%)}.mdl-slider.is-upgraded.is-lowest-value::-ms-fill-lower{background:0 0}.mdl-slider.is-upgraded.is-lowest-value::-ms-fill-upper{margin-left:6px}.mdl-slider.is-upgraded.is-lowest-value:active::-ms-fill-upper{margin-left:9px}.mdl-slider.is-upgraded:disabled:focus::-webkit-slider-thumb,.mdl-slider.is-upgraded:disabled:active::-webkit-slider-thumb,.mdl-slider.is-upgraded:disabled::-webkit-slider-thumb{-webkit-transform:scale(.667);transform:scale(.667);background:rgba(0,0,0,.26)}.mdl-slider.is-upgraded:disabled:focus::-moz-range-thumb,.mdl-slider.is-upgraded:disabled:active::-moz-range-thumb,.mdl-slider.is-upgraded:disabled::-moz-range-thumb{transform:scale(.667);background:rgba(0,0,0,.26)}.mdl-slider.is-upgraded:disabled+.mdl-slider__background-flex>.mdl-slider__background-lower{background-color:rgba(0,0,0,.26);left:-6px}.mdl-slider.is-upgraded:disabled+.mdl-slider__background-flex>.mdl-slider__background-upper{left:6px}.mdl-slider.is-upgraded.is-lowest-value:disabled:focus::-webkit-slider-thumb,.mdl-slider.is-upgraded.is-lowest-value:disabled:active::-webkit-slider-thumb,.mdl-slider.is-upgraded.is-lowest-value:disabled::-webkit-slider-thumb{border:3px solid rgba(0,0,0,.26);background:0 0;-webkit-transform:scale(.667);transform:scale(.667)}.mdl-slider.is-upgraded.is-lowest-value:disabled:focus::-moz-range-thumb,.mdl-slider.is-upgraded.is-lowest-value:disabled:active::-moz-range-thumb,.mdl-slider.is-upgraded.is-lowest-value:disabled::-moz-range-thumb{border:3px solid rgba(0,0,0,.26);background:0 0;transform:scale(.667)}.mdl-slider.is-upgraded.is-lowest-value:disabled:active+.mdl-slider__background-flex>.mdl-slider__background-upper{left:6px}.mdl-slider.is-upgraded:disabled:focus::-ms-thumb,.mdl-slider.is-upgraded:disabled:active::-ms-thumb,.mdl-slider.is-upgraded:disabled::-ms-thumb{-ms-transform:scale(.25);transform:scale(.25);background:rgba(0,0,0,.26)}.mdl-slider.is-upgraded.is-lowest-value:disabled:focus::-ms-thumb,.mdl-slider.is-upgraded.is-lowest-value:disabled:active::-ms-thumb,.mdl-slider.is-upgraded.is-lowest-value:disabled::-ms-thumb{-ms-transform:scale(.25);transform:scale(.25);background:radial-gradient(circle closest-side,transparent 0%,transparent 50%,rgba(0,0,0,.26)50%,rgba(0,0,0,.26)100%)}.mdl-slider.is-upgraded:disabled::-ms-fill-lower{margin-right:6px;background:linear-gradient(to right,transparent,transparent 25px,rgba(0,0,0,.26)25px,rgba(0,0,0,.26)0)}.mdl-slider.is-upgraded:disabled::-ms-fill-upper{margin-left:6px}.mdl-slider.is-upgraded.is-lowest-value:disabled:active::-ms-fill-upper{margin-left:6px}.mdl-slider__ie-container{height:18px;overflow:visible;border:none;margin:none;padding:none}.mdl-slider__container{height:18px;position:relative;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row}.mdl-slider__container,.mdl-slider__background-flex{background:0 0;display:-webkit-flex;display:-ms-flexbox;display:flex}.mdl-slider__background-flex{position:absolute;height:2px;width:calc(100% - 52px);top:50%;left:0;margin:0 26px;overflow:hidden;border:0;padding:0;-webkit-transform:translate(0,-1px);-ms-transform:translate(0,-1px);transform:translate(0,-1px)}.mdl-slider__background-lower{background:#3f51b5}.mdl-slider__background-lower,.mdl-slider__background-upper{-webkit-box-flex:0;-webkit-flex:0;-ms-flex:0;flex:0;position:relative;border:0;padding:0}.mdl-slider__background-upper{background:rgba(0,0,0,.26);-webkit-transition:left .18s cubic-bezier(.4,0,.2,1);transition:left .18s cubic-bezier(.4,0,.2,1)}.mdl-spinner{display:inline-block;position:relative;width:28px;height:28px}.mdl-spinner:not(.is-upgraded).is-active:after{content:\"Loading...\"}.mdl-spinner.is-upgraded.is-active{-webkit-animation:mdl-spinner__container-rotate 1568.23529412ms linear infinite;animation:mdl-spinner__container-rotate 1568.23529412ms linear infinite}@-webkit-keyframes mdl-spinner__container-rotate{to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes mdl-spinner__container-rotate{to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.mdl-spinner__layer{position:absolute;width:100%;height:100%;opacity:0}.mdl-spinner__layer-1{border-color:#42a5f5}.mdl-spinner--single-color .mdl-spinner__layer-1{border-color:#3f51b5}.mdl-spinner.is-active .mdl-spinner__layer-1{-webkit-animation:mdl-spinner__fill-unfill-rotate 5332ms cubic-bezier(.4,0,.2,1)infinite both,mdl-spinner__layer-1-fade-in-out 5332ms cubic-bezier(.4,0,.2,1)infinite both;animation:mdl-spinner__fill-unfill-rotate 5332ms cubic-bezier(.4,0,.2,1)infinite both,mdl-spinner__layer-1-fade-in-out 5332ms cubic-bezier(.4,0,.2,1)infinite both}.mdl-spinner__layer-2{border-color:#f44336}.mdl-spinner--single-color .mdl-spinner__layer-2{border-color:#3f51b5}.mdl-spinner.is-active .mdl-spinner__layer-2{-webkit-animation:mdl-spinner__fill-unfill-rotate 5332ms cubic-bezier(.4,0,.2,1)infinite both,mdl-spinner__layer-2-fade-in-out 5332ms cubic-bezier(.4,0,.2,1)infinite both;animation:mdl-spinner__fill-unfill-rotate 5332ms cubic-bezier(.4,0,.2,1)infinite both,mdl-spinner__layer-2-fade-in-out 5332ms cubic-bezier(.4,0,.2,1)infinite both}.mdl-spinner__layer-3{border-color:#fdd835}.mdl-spinner--single-color .mdl-spinner__layer-3{border-color:#3f51b5}.mdl-spinner.is-active .mdl-spinner__layer-3{-webkit-animation:mdl-spinner__fill-unfill-rotate 5332ms cubic-bezier(.4,0,.2,1)infinite both,mdl-spinner__layer-3-fade-in-out 5332ms cubic-bezier(.4,0,.2,1)infinite both;animation:mdl-spinner__fill-unfill-rotate 5332ms cubic-bezier(.4,0,.2,1)infinite both,mdl-spinner__layer-3-fade-in-out 5332ms cubic-bezier(.4,0,.2,1)infinite both}.mdl-spinner__layer-4{border-color:#4caf50}.mdl-spinner--single-color .mdl-spinner__layer-4{border-color:#3f51b5}.mdl-spinner.is-active .mdl-spinner__layer-4{-webkit-animation:mdl-spinner__fill-unfill-rotate 5332ms cubic-bezier(.4,0,.2,1)infinite both,mdl-spinner__layer-4-fade-in-out 5332ms cubic-bezier(.4,0,.2,1)infinite both;animation:mdl-spinner__fill-unfill-rotate 5332ms cubic-bezier(.4,0,.2,1)infinite both,mdl-spinner__layer-4-fade-in-out 5332ms cubic-bezier(.4,0,.2,1)infinite both}@-webkit-keyframes mdl-spinner__fill-unfill-rotate{12.5%{-webkit-transform:rotate(135deg);transform:rotate(135deg)}25%{-webkit-transform:rotate(270deg);transform:rotate(270deg)}37.5%{-webkit-transform:rotate(405deg);transform:rotate(405deg)}50%{-webkit-transform:rotate(540deg);transform:rotate(540deg)}62.5%{-webkit-transform:rotate(675deg);transform:rotate(675deg)}75%{-webkit-transform:rotate(810deg);transform:rotate(810deg)}87.5%{-webkit-transform:rotate(945deg);transform:rotate(945deg)}to{-webkit-transform:rotate(1080deg);transform:rotate(1080deg)}}@keyframes mdl-spinner__fill-unfill-rotate{12.5%{-webkit-transform:rotate(135deg);transform:rotate(135deg)}25%{-webkit-transform:rotate(270deg);transform:rotate(270deg)}37.5%{-webkit-transform:rotate(405deg);transform:rotate(405deg)}50%{-webkit-transform:rotate(540deg);transform:rotate(540deg)}62.5%{-webkit-transform:rotate(675deg);transform:rotate(675deg)}75%{-webkit-transform:rotate(810deg);transform:rotate(810deg)}87.5%{-webkit-transform:rotate(945deg);transform:rotate(945deg)}to{-webkit-transform:rotate(1080deg);transform:rotate(1080deg)}}@-webkit-keyframes mdl-spinner__layer-1-fade-in-out{from,25%{opacity:.99}26%,89%{opacity:0}90%,100%{opacity:.99}}@keyframes mdl-spinner__layer-1-fade-in-out{from,25%{opacity:.99}26%,89%{opacity:0}90%,100%{opacity:.99}}@-webkit-keyframes mdl-spinner__layer-2-fade-in-out{from,15%{opacity:0}25%,50%{opacity:.99}51%{opacity:0}}@keyframes mdl-spinner__layer-2-fade-in-out{from,15%{opacity:0}25%,50%{opacity:.99}51%{opacity:0}}@-webkit-keyframes mdl-spinner__layer-3-fade-in-out{from,40%{opacity:0}50%,75%{opacity:.99}76%{opacity:0}}@keyframes mdl-spinner__layer-3-fade-in-out{from,40%{opacity:0}50%,75%{opacity:.99}76%{opacity:0}}@-webkit-keyframes mdl-spinner__layer-4-fade-in-out{from,65%{opacity:0}75%,90%{opacity:.99}100%{opacity:0}}@keyframes mdl-spinner__layer-4-fade-in-out{from,65%{opacity:0}75%,90%{opacity:.99}100%{opacity:0}}.mdl-spinner__gap-patch{position:absolute;box-sizing:border-box;top:0;left:45%;width:10%;height:100%;overflow:hidden;border-color:inherit}.mdl-spinner__gap-patch .mdl-spinner__circle{width:1000%;left:-450%}.mdl-spinner__circle-clipper{display:inline-block;position:relative;width:50%;height:100%;overflow:hidden;border-color:inherit}.mdl-spinner__circle-clipper .mdl-spinner__circle{width:200%}.mdl-spinner__circle{box-sizing:border-box;height:100%;border-width:3px;border-style:solid;border-color:inherit;border-bottom-color:transparent!important;border-radius:50%;-webkit-animation:none;animation:none;position:absolute;top:0;right:0;bottom:0;left:0}.mdl-spinner__left .mdl-spinner__circle{border-right-color:transparent!important;-webkit-transform:rotate(129deg);-ms-transform:rotate(129deg);transform:rotate(129deg)}.mdl-spinner.is-active .mdl-spinner__left .mdl-spinner__circle{-webkit-animation:mdl-spinner__left-spin 1333ms cubic-bezier(.4,0,.2,1)infinite both;animation:mdl-spinner__left-spin 1333ms cubic-bezier(.4,0,.2,1)infinite both}.mdl-spinner__right .mdl-spinner__circle{left:-100%;border-left-color:transparent!important;-webkit-transform:rotate(-129deg);-ms-transform:rotate(-129deg);transform:rotate(-129deg)}.mdl-spinner.is-active .mdl-spinner__right .mdl-spinner__circle{-webkit-animation:mdl-spinner__right-spin 1333ms cubic-bezier(.4,0,.2,1)infinite both;animation:mdl-spinner__right-spin 1333ms cubic-bezier(.4,0,.2,1)infinite both}@-webkit-keyframes mdl-spinner__left-spin{from{-webkit-transform:rotate(130deg);transform:rotate(130deg)}50%{-webkit-transform:rotate(-5deg);transform:rotate(-5deg)}to{-webkit-transform:rotate(130deg);transform:rotate(130deg)}}@keyframes mdl-spinner__left-spin{from{-webkit-transform:rotate(130deg);transform:rotate(130deg)}50%{-webkit-transform:rotate(-5deg);transform:rotate(-5deg)}to{-webkit-transform:rotate(130deg);transform:rotate(130deg)}}@-webkit-keyframes mdl-spinner__right-spin{from{-webkit-transform:rotate(-130deg);transform:rotate(-130deg)}50%{-webkit-transform:rotate(5deg);transform:rotate(5deg)}to{-webkit-transform:rotate(-130deg);transform:rotate(-130deg)}}@keyframes mdl-spinner__right-spin{from{-webkit-transform:rotate(-130deg);transform:rotate(-130deg)}50%{-webkit-transform:rotate(5deg);transform:rotate(5deg)}to{-webkit-transform:rotate(-130deg);transform:rotate(-130deg)}}.mdl-switch{position:relative;z-index:1;vertical-align:middle;display:inline-block;box-sizing:border-box;width:100%;height:24px;margin:0;padding:0;overflow:visible;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mdl-switch.is-upgraded{padding-left:28px}.mdl-switch__input{line-height:24px}.mdl-switch.is-upgraded .mdl-switch__input{position:absolute;width:0;height:0;margin:0;padding:0;opacity:0;-ms-appearance:none;-moz-appearance:none;-webkit-appearance:none;appearance:none;border:none}.mdl-switch__track{background:rgba(0,0,0,.26);position:absolute;left:0;top:5px;height:14px;width:36px;border-radius:14px;cursor:pointer}.mdl-switch.is-checked .mdl-switch__track{background:rgba(63,81,181,.5)}.mdl-switch.is-disabled .mdl-switch__track{background:rgba(0,0,0,.12);cursor:auto}.mdl-switch__thumb{background:#fafafa;position:absolute;left:0;top:2px;height:20px;width:20px;border-radius:50%;cursor:pointer;box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);-webkit-transition-duration:.28s;transition-duration:.28s;-webkit-transition-timing-function:cubic-bezier(.4,0,.2,1);transition-timing-function:cubic-bezier(.4,0,.2,1);-webkit-transition-property:left;transition-property:left}.mdl-switch.is-checked .mdl-switch__thumb{background:#3f51b5;left:16px;box-shadow:0 3px 4px 0 rgba(0,0,0,.14),0 3px 3px -2px rgba(0,0,0,.2),0 1px 8px 0 rgba(0,0,0,.12)}.mdl-switch.is-disabled .mdl-switch__thumb{background:#bdbdbd;cursor:auto}.mdl-switch__focus-helper{position:absolute;top:50%;left:50%;-webkit-transform:translate(-4px,-4px);-ms-transform:translate(-4px,-4px);transform:translate(-4px,-4px);display:inline-block;box-sizing:border-box;width:8px;height:8px;border-radius:50%;background-color:transparent}.mdl-switch.is-focused .mdl-switch__focus-helper{box-shadow:0 0 0 20px rgba(0,0,0,.1);background-color:rgba(0,0,0,.1)}.mdl-switch.is-focused.is-checked .mdl-switch__focus-helper{box-shadow:0 0 0 20px rgba(63,81,181,.26);background-color:rgba(63,81,181,.26)}.mdl-switch__label{position:relative;cursor:pointer;font-size:16px;line-height:24px;margin:0;left:24px}.mdl-switch.is-disabled .mdl-switch__label{color:#bdbdbd;cursor:auto}.mdl-switch__ripple-container{position:absolute;z-index:2;top:-12px;left:-14px;box-sizing:border-box;width:48px;height:48px;border-radius:50%;cursor:pointer;overflow:hidden;-webkit-mask-image:-webkit-radial-gradient(circle,#fff,#000);-webkit-transition-duration:.4s;transition-duration:.4s;-webkit-transition-timing-function:step-end;transition-timing-function:step-end;-webkit-transition-property:left;transition-property:left}.mdl-switch__ripple-container .mdl-ripple{background:#3f51b5}.mdl-switch.is-disabled .mdl-switch__ripple-container{cursor:auto}.mdl-switch.is-disabled .mdl-switch__ripple-container .mdl-ripple{background:0 0}.mdl-switch.is-checked .mdl-switch__ripple-container{cursor:auto;left:2px}.mdl-tabs{display:block;width:100%}.mdl-tabs__tab-bar{display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-content:space-between;-ms-flex-line-pack:justify;align-content:space-between;-webkit-box-align:start;-webkit-align-items:flex-start;-ms-flex-align:start;align-items:flex-start;height:48px;padding:0;margin:0;border-bottom:1px solid #e0e0e0}.mdl-tabs__tab{margin:0;border:none;padding:0 24px;float:left;position:relative;display:block;color:red;text-decoration:none;height:48px;line-height:48px;text-align:center;font-weight:500;font-size:14px;text-transform:uppercase;color:rgba(0,0,0,.54);overflow:hidden}.mdl-tabs.is-upgraded .mdl-tabs__tab.is-active{color:rgba(0,0,0,.87)}.mdl-tabs.is-upgraded .mdl-tabs__tab.is-active:after{height:2px;width:100%;display:block;content:\" \";bottom:0;left:0;position:absolute;background:#3f51b5;-webkit-animation:border-expand .2s cubic-bezier(.4,0,.4,1).01s alternate forwards;animation:border-expand .2s cubic-bezier(.4,0,.4,1).01s alternate forwards;-webkit-transition:all 1s cubic-bezier(.4,0,1,1);transition:all 1s cubic-bezier(.4,0,1,1)}.mdl-tabs__tab .mdl-tabs__ripple-container{display:block;position:absolute;height:100%;width:100%;left:0;top:0;z-index:1;overflow:hidden}.mdl-tabs__tab .mdl-tabs__ripple-container .mdl-ripple{background:#3f51b5}.mdl-tabs__panel{display:block}.mdl-tabs.is-upgraded .mdl-tabs__panel{display:none}.mdl-tabs.is-upgraded .mdl-tabs__panel.is-active{display:block}@-webkit-keyframes border-expand{0%{opacity:0;width:0}100%{opacity:1;width:100%}}@keyframes border-expand{0%{opacity:0;width:0}100%{opacity:1;width:100%}}.mdl-textfield{position:relative;font-size:16px;display:inline-block;box-sizing:border-box;width:300px;max-width:100%;margin:0;padding:20px 0}.mdl-textfield .mdl-button{position:absolute;bottom:20px}.mdl-textfield--align-right{text-align:right}.mdl-textfield--full-width{width:100%}.mdl-textfield--expandable{min-width:32px;width:auto;min-height:32px}.mdl-textfield__input{border:none;border-bottom:1px solid rgba(0,0,0,.12);display:block;font-size:16px;margin:0;padding:4px 0;width:100%;background:0 0;text-align:left;color:inherit}.mdl-textfield.is-focused .mdl-textfield__input{outline:none}.mdl-textfield.is-invalid .mdl-textfield__input{border-color:#de3226;box-shadow:none}.mdl-textfield.is-disabled .mdl-textfield__input{background-color:transparent;border-bottom:1px dotted rgba(0,0,0,.12);color:rgba(0,0,0,.26)}.mdl-textfield textarea.mdl-textfield__input{display:block}.mdl-textfield__label{bottom:0;color:rgba(0,0,0,.26);font-size:16px;left:0;right:0;pointer-events:none;position:absolute;display:block;top:24px;width:100%;overflow:hidden;white-space:nowrap;text-align:left}.mdl-textfield.is-dirty .mdl-textfield__label{visibility:hidden}.mdl-textfield--floating-label .mdl-textfield__label{-webkit-transition-duration:.2s;transition-duration:.2s;-webkit-transition-timing-function:cubic-bezier(.4,0,.2,1);transition-timing-function:cubic-bezier(.4,0,.2,1)}.mdl-textfield.is-disabled.is-disabled .mdl-textfield__label{color:rgba(0,0,0,.26)}.mdl-textfield--floating-label.is-focused .mdl-textfield__label,.mdl-textfield--floating-label.is-dirty .mdl-textfield__label{color:#3f51b5;font-size:12px;top:4px;visibility:visible}.mdl-textfield--floating-label.is-focused .mdl-textfield__expandable-holder .mdl-textfield__label,.mdl-textfield--floating-label.is-dirty .mdl-textfield__expandable-holder .mdl-textfield__label{top:-16px}.mdl-textfield--floating-label.is-invalid .mdl-textfield__label{color:#de3226;font-size:12px}.mdl-textfield__label:after{background-color:#3f51b5;bottom:20px;content:'';height:2px;left:45%;position:absolute;-webkit-transition-duration:.2s;transition-duration:.2s;-webkit-transition-timing-function:cubic-bezier(.4,0,.2,1);transition-timing-function:cubic-bezier(.4,0,.2,1);visibility:hidden;width:10px}.mdl-textfield.is-focused .mdl-textfield__label:after{left:0;visibility:visible;width:100%}.mdl-textfield.is-invalid .mdl-textfield__label:after{background-color:#de3226}.mdl-textfield__error{color:#de3226;position:absolute;font-size:12px;margin-top:3px;visibility:hidden;display:block}.mdl-textfield.is-invalid .mdl-textfield__error{visibility:visible}.mdl-textfield__expandable-holder{position:relative;margin-left:32px;-webkit-transition-duration:.2s;transition-duration:.2s;-webkit-transition-timing-function:cubic-bezier(.4,0,.2,1);transition-timing-function:cubic-bezier(.4,0,.2,1);display:inline-block;max-width:.1px}.mdl-textfield.is-focused .mdl-textfield__expandable-holder,.mdl-textfield.is-dirty .mdl-textfield__expandable-holder{max-width:600px}.mdl-textfield__expandable-holder .mdl-textfield__label:after{bottom:0}.mdl-tooltip{-webkit-transform:scale(0);-ms-transform:scale(0);transform:scale(0);-webkit-transform-origin:top center;-ms-transform-origin:top center;transform-origin:top center;will-change:transform;z-index:999;background:rgba(97,97,97,.9);border-radius:2px;color:#fff;display:inline-block;font-size:10px;font-weight:500;line-height:14px;max-width:170px;position:fixed;top:-500px;left:-500px;padding:8px;text-align:center}.mdl-tooltip.is-active{-webkit-animation:pulse 200ms cubic-bezier(0,0,.2,1)forwards;animation:pulse 200ms cubic-bezier(0,0,.2,1)forwards}.mdl-tooltip--large{line-height:14px;font-size:14px;padding:16px}@-webkit-keyframes pulse{0%{-webkit-transform:scale(0);transform:scale(0);opacity:0}50%{-webkit-transform:scale(.99);transform:scale(.99)}100%{-webkit-transform:scale(1);transform:scale(1);opacity:1;visibility:visible}}@keyframes pulse{0%{-webkit-transform:scale(0);transform:scale(0);opacity:0}50%{-webkit-transform:scale(.99);transform:scale(.99)}100%{-webkit-transform:scale(1);transform:scale(1);opacity:1;visibility:visible}}.mdl-shadow--2dp{box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12)}.mdl-shadow--3dp{box-shadow:0 3px 4px 0 rgba(0,0,0,.14),0 3px 3px -2px rgba(0,0,0,.2),0 1px 8px 0 rgba(0,0,0,.12)}.mdl-shadow--4dp{box-shadow:0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2)}.mdl-shadow--6dp{box-shadow:0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.2)}.mdl-shadow--8dp{box-shadow:0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12),0 5px 5px -3px rgba(0,0,0,.2)}.mdl-shadow--16dp{box-shadow:0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12),0 8px 10px -5px rgba(0,0,0,.2)}.mdl-grid{display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-flow:row wrap;-ms-flex-flow:row wrap;flex-flow:row wrap;margin:0 auto;-webkit-box-align:stretch;-webkit-align-items:stretch;-ms-flex-align:stretch;align-items:stretch}.mdl-grid.mdl-grid--no-spacing{padding:0}.mdl-cell{box-sizing:border-box}.mdl-cell--top{-webkit-align-self:flex-start;-ms-flex-item-align:start;align-self:flex-start}.mdl-cell--middle{-webkit-align-self:center;-ms-flex-item-align:center;align-self:center}.mdl-cell--bottom{-webkit-align-self:flex-end;-ms-flex-item-align:end;align-self:flex-end}.mdl-cell--stretch{-webkit-align-self:stretch;-ms-flex-item-align:stretch;align-self:stretch}.mdl-grid.mdl-grid--no-spacing>.mdl-cell{margin:0}@media (max-width:479px){.mdl-grid{padding:8px}.mdl-cell{margin:8px;width:calc(100% - 16px)}.mdl-grid--no-spacing>.mdl-cell{width:100%}.mdl-cell--hide-phone{display:none!important}.mdl-cell--1-col,.mdl-cell--1-col-phone.mdl-cell--1-col-phone{width:calc(25% - 16px)}.mdl-grid--no-spacing>.mdl-cell--1-col,.mdl-grid--no-spacing>.mdl-cell--1-col-phone.mdl-cell--1-col-phone{width:25%}.mdl-cell--2-col,.mdl-cell--2-col-phone.mdl-cell--2-col-phone{width:calc(50% - 16px)}.mdl-grid--no-spacing>.mdl-cell--2-col,.mdl-grid--no-spacing>.mdl-cell--2-col-phone.mdl-cell--2-col-phone{width:50%}.mdl-cell--3-col,.mdl-cell--3-col-phone.mdl-cell--3-col-phone{width:calc(75% - 16px)}.mdl-grid--no-spacing>.mdl-cell--3-col,.mdl-grid--no-spacing>.mdl-cell--3-col-phone.mdl-cell--3-col-phone{width:75%}.mdl-cell--4-col,.mdl-cell--4-col-phone.mdl-cell--4-col-phone{width:calc(100% - 16px)}.mdl-grid--no-spacing>.mdl-cell--4-col,.mdl-grid--no-spacing>.mdl-cell--4-col-phone.mdl-cell--4-col-phone{width:100%}.mdl-cell--5-col,.mdl-cell--5-col-phone.mdl-cell--5-col-phone{width:calc(100% - 16px)}.mdl-grid--no-spacing>.mdl-cell--5-col,.mdl-grid--no-spacing>.mdl-cell--5-col-phone.mdl-cell--5-col-phone{width:100%}.mdl-cell--6-col,.mdl-cell--6-col-phone.mdl-cell--6-col-phone{width:calc(100% - 16px)}.mdl-grid--no-spacing>.mdl-cell--6-col,.mdl-grid--no-spacing>.mdl-cell--6-col-phone.mdl-cell--6-col-phone{width:100%}.mdl-cell--7-col,.mdl-cell--7-col-phone.mdl-cell--7-col-phone{width:calc(100% - 16px)}.mdl-grid--no-spacing>.mdl-cell--7-col,.mdl-grid--no-spacing>.mdl-cell--7-col-phone.mdl-cell--7-col-phone{width:100%}.mdl-cell--8-col,.mdl-cell--8-col-phone.mdl-cell--8-col-phone{width:calc(100% - 16px)}.mdl-grid--no-spacing>.mdl-cell--8-col,.mdl-grid--no-spacing>.mdl-cell--8-col-phone.mdl-cell--8-col-phone{width:100%}.mdl-cell--9-col,.mdl-cell--9-col-phone.mdl-cell--9-col-phone{width:calc(100% - 16px)}.mdl-grid--no-spacing>.mdl-cell--9-col,.mdl-grid--no-spacing>.mdl-cell--9-col-phone.mdl-cell--9-col-phone{width:100%}.mdl-cell--10-col,.mdl-cell--10-col-phone.mdl-cell--10-col-phone{width:calc(100% - 16px)}.mdl-grid--no-spacing>.mdl-cell--10-col,.mdl-grid--no-spacing>.mdl-cell--10-col-phone.mdl-cell--10-col-phone{width:100%}.mdl-cell--11-col,.mdl-cell--11-col-phone.mdl-cell--11-col-phone{width:calc(100% - 16px)}.mdl-grid--no-spacing>.mdl-cell--11-col,.mdl-grid--no-spacing>.mdl-cell--11-col-phone.mdl-cell--11-col-phone{width:100%}.mdl-cell--12-col,.mdl-cell--12-col-phone.mdl-cell--12-col-phone{width:calc(100% - 16px)}.mdl-grid--no-spacing>.mdl-cell--12-col,.mdl-grid--no-spacing>.mdl-cell--12-col-phone.mdl-cell--12-col-phone{width:100%}}@media (min-width:480px) and (max-width:839px){.mdl-grid{padding:8px}.mdl-cell{margin:8px;width:calc(50% - 16px)}.mdl-grid--no-spacing>.mdl-cell{width:50%}.mdl-cell--hide-tablet{display:none!important}.mdl-cell--1-col,.mdl-cell--1-col-tablet.mdl-cell--1-col-tablet{width:calc(12.5% - 16px)}.mdl-grid--no-spacing>.mdl-cell--1-col,.mdl-grid--no-spacing>.mdl-cell--1-col-tablet.mdl-cell--1-col-tablet{width:12.5%}.mdl-cell--2-col,.mdl-cell--2-col-tablet.mdl-cell--2-col-tablet{width:calc(25% - 16px)}.mdl-grid--no-spacing>.mdl-cell--2-col,.mdl-grid--no-spacing>.mdl-cell--2-col-tablet.mdl-cell--2-col-tablet{width:25%}.mdl-cell--3-col,.mdl-cell--3-col-tablet.mdl-cell--3-col-tablet{width:calc(37.5% - 16px)}.mdl-grid--no-spacing>.mdl-cell--3-col,.mdl-grid--no-spacing>.mdl-cell--3-col-tablet.mdl-cell--3-col-tablet{width:37.5%}.mdl-cell--4-col,.mdl-cell--4-col-tablet.mdl-cell--4-col-tablet{width:calc(50% - 16px)}.mdl-grid--no-spacing>.mdl-cell--4-col,.mdl-grid--no-spacing>.mdl-cell--4-col-tablet.mdl-cell--4-col-tablet{width:50%}.mdl-cell--5-col,.mdl-cell--5-col-tablet.mdl-cell--5-col-tablet{width:calc(62.5% - 16px)}.mdl-grid--no-spacing>.mdl-cell--5-col,.mdl-grid--no-spacing>.mdl-cell--5-col-tablet.mdl-cell--5-col-tablet{width:62.5%}.mdl-cell--6-col,.mdl-cell--6-col-tablet.mdl-cell--6-col-tablet{width:calc(75% - 16px)}.mdl-grid--no-spacing>.mdl-cell--6-col,.mdl-grid--no-spacing>.mdl-cell--6-col-tablet.mdl-cell--6-col-tablet{width:75%}.mdl-cell--7-col,.mdl-cell--7-col-tablet.mdl-cell--7-col-tablet{width:calc(87.5% - 16px)}.mdl-grid--no-spacing>.mdl-cell--7-col,.mdl-grid--no-spacing>.mdl-cell--7-col-tablet.mdl-cell--7-col-tablet{width:87.5%}.mdl-cell--8-col,.mdl-cell--8-col-tablet.mdl-cell--8-col-tablet{width:calc(100% - 16px)}.mdl-grid--no-spacing>.mdl-cell--8-col,.mdl-grid--no-spacing>.mdl-cell--8-col-tablet.mdl-cell--8-col-tablet{width:100%}.mdl-cell--9-col,.mdl-cell--9-col-tablet.mdl-cell--9-col-tablet{width:calc(100% - 16px)}.mdl-grid--no-spacing>.mdl-cell--9-col,.mdl-grid--no-spacing>.mdl-cell--9-col-tablet.mdl-cell--9-col-tablet{width:100%}.mdl-cell--10-col,.mdl-cell--10-col-tablet.mdl-cell--10-col-tablet{width:calc(100% - 16px)}.mdl-grid--no-spacing>.mdl-cell--10-col,.mdl-grid--no-spacing>.mdl-cell--10-col-tablet.mdl-cell--10-col-tablet{width:100%}.mdl-cell--11-col,.mdl-cell--11-col-tablet.mdl-cell--11-col-tablet{width:calc(100% - 16px)}.mdl-grid--no-spacing>.mdl-cell--11-col,.mdl-grid--no-spacing>.mdl-cell--11-col-tablet.mdl-cell--11-col-tablet{width:100%}.mdl-cell--12-col,.mdl-cell--12-col-tablet.mdl-cell--12-col-tablet{width:calc(100% - 16px)}.mdl-grid--no-spacing>.mdl-cell--12-col,.mdl-grid--no-spacing>.mdl-cell--12-col-tablet.mdl-cell--12-col-tablet{width:100%}}@media (min-width:840px){.mdl-grid{padding:8px}.mdl-cell{margin:8px;width:calc(33.3333333333% - 16px)}.mdl-grid--no-spacing>.mdl-cell{width:33.3333333333%}.mdl-cell--hide-desktop{display:none!important}.mdl-cell--1-col,.mdl-cell--1-col-desktop.mdl-cell--1-col-desktop{width:calc(8.3333333333% - 16px)}.mdl-grid--no-spacing>.mdl-cell--1-col,.mdl-grid--no-spacing>.mdl-cell--1-col-desktop.mdl-cell--1-col-desktop{width:8.3333333333%}.mdl-cell--2-col,.mdl-cell--2-col-desktop.mdl-cell--2-col-desktop{width:calc(16.6666666667% - 16px)}.mdl-grid--no-spacing>.mdl-cell--2-col,.mdl-grid--no-spacing>.mdl-cell--2-col-desktop.mdl-cell--2-col-desktop{width:16.6666666667%}.mdl-cell--3-col,.mdl-cell--3-col-desktop.mdl-cell--3-col-desktop{width:calc(25% - 16px)}.mdl-grid--no-spacing>.mdl-cell--3-col,.mdl-grid--no-spacing>.mdl-cell--3-col-desktop.mdl-cell--3-col-desktop{width:25%}.mdl-cell--4-col,.mdl-cell--4-col-desktop.mdl-cell--4-col-desktop{width:calc(33.3333333333% - 16px)}.mdl-grid--no-spacing>.mdl-cell--4-col,.mdl-grid--no-spacing>.mdl-cell--4-col-desktop.mdl-cell--4-col-desktop{width:33.3333333333%}.mdl-cell--5-col,.mdl-cell--5-col-desktop.mdl-cell--5-col-desktop{width:calc(41.6666666667% - 16px)}.mdl-grid--no-spacing>.mdl-cell--5-col,.mdl-grid--no-spacing>.mdl-cell--5-col-desktop.mdl-cell--5-col-desktop{width:41.6666666667%}.mdl-cell--6-col,.mdl-cell--6-col-desktop.mdl-cell--6-col-desktop{width:calc(50% - 16px)}.mdl-grid--no-spacing>.mdl-cell--6-col,.mdl-grid--no-spacing>.mdl-cell--6-col-desktop.mdl-cell--6-col-desktop{width:50%}.mdl-cell--7-col,.mdl-cell--7-col-desktop.mdl-cell--7-col-desktop{width:calc(58.3333333333% - 16px)}.mdl-grid--no-spacing>.mdl-cell--7-col,.mdl-grid--no-spacing>.mdl-cell--7-col-desktop.mdl-cell--7-col-desktop{width:58.3333333333%}.mdl-cell--8-col,.mdl-cell--8-col-desktop.mdl-cell--8-col-desktop{width:calc(66.6666666667% - 16px)}.mdl-grid--no-spacing>.mdl-cell--8-col,.mdl-grid--no-spacing>.mdl-cell--8-col-desktop.mdl-cell--8-col-desktop{width:66.6666666667%}.mdl-cell--9-col,.mdl-cell--9-col-desktop.mdl-cell--9-col-desktop{width:calc(75% - 16px)}.mdl-grid--no-spacing>.mdl-cell--9-col,.mdl-grid--no-spacing>.mdl-cell--9-col-desktop.mdl-cell--9-col-desktop{width:75%}.mdl-cell--10-col,.mdl-cell--10-col-desktop.mdl-cell--10-col-desktop{width:calc(83.3333333333% - 16px)}.mdl-grid--no-spacing>.mdl-cell--10-col,.mdl-grid--no-spacing>.mdl-cell--10-col-desktop.mdl-cell--10-col-desktop{width:83.3333333333%}.mdl-cell--11-col,.mdl-cell--11-col-desktop.mdl-cell--11-col-desktop{width:calc(91.6666666667% - 16px)}.mdl-grid--no-spacing>.mdl-cell--11-col,.mdl-grid--no-spacing>.mdl-cell--11-col-desktop.mdl-cell--11-col-desktop{width:91.6666666667%}.mdl-cell--12-col,.mdl-cell--12-col-desktop.mdl-cell--12-col-desktop{width:calc(100% - 16px)}.mdl-grid--no-spacing>.mdl-cell--12-col,.mdl-grid--no-spacing>.mdl-cell--12-col-desktop.mdl-cell--12-col-desktop{width:100%}}\n/*# sourceMappingURL=material.min.css.map */\n", ""]);
	
	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(7);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(7, function() {
				var newContent = __webpack_require__(7);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports
	
	
	// module
	exports.push([module.id, "@font-face {\n\tfont-family: 'Roboto';\n\tfont-style: normal;\n\tfont-weight: 700;\n\tsrc:\n\t\tlocal('Roboto Bold'),\n\t\tlocal('Roboto-Bold'),\n\t\turl('../fonts/Roboto_700.eot?#iefix') format('embedded-opentype'),\n\t\turl('../fonts/Roboto_700.woff') format('woff'),\n\t\turl('../fonts/Roboto_700.svg#Roboto') format('svg'),\n\t\turl('../fonts/Roboto_700.ttf') format('truetype');\n}\n\n@font-face {\n    font-family: 'Roboto';\n    font-style: normal;\n    font-weight: 400;\n    src:\n        local('Roboto'),\n        local('Roboto Regular'),\n        local('Roboto-Regular'),\n        url('../fonts/Roboto_400.eot?#iefix') format('embedded-opentype'),\n        url('../fonts/Roboto_400.woff') format('woff'),\n        url('../fonts/Roboto_400.svg#Roboto') format('svg'),\n        url('../fonts/Roboto_400.ttf') format('truetype');\n}\n\n@font-face {\n  font-family: 'Material Icons';\n  font-style: normal;\n  font-weight: 400;\n  src: url('../fonts/MaterialIcons-Regular.eot');\n  src: local('Material Icons'),\n       local('MaterialIcons-Regular'),\n       url('../fonts/MaterialIcons-Regular.woff2') format('woff2'),\n       url('../fonts/MaterialIcons-Regular.woff') format('woff'),\n       url('../fonts/MaterialIcons-Regular.ttf') format('truetype');\n}\n", ""]);
	
	// exports


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(9);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(9, function() {
				var newContent = __webpack_require__(9);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports
	
	
	// module
	exports.push([module.id, "html, body {\n    font-family: 'Roboto', sans-serif;\n}\n\n.page-content {\n    height: 100%;\n}\n\nmain.mdl-layout__content {\n    overflow: hidden;\n}\n\n.page-content > .mdl-grid {\n    height: calc(100% - 112px);\n    padding: 0;\n    position: absolute;\n    width: 100%;\n}\n\n.material-icons {\n    font-family: 'Material Icons';\n    font-weight: normal;\n    font-style: normal;\n    font-size: 24px;\n    display: inline-block;\n    width: 1em;\n    height: 1em;\n    line-height: 1;\n    text-transform: none;\n    letter-spacing: normal;\n    word-wrap: normal;\n    -webkit-font-smoothing: antialiased;\n    text-rendering: optimizeLegibility;\n    font-feature-settings: 'liga';\n}\n\n/* Paid button */\n#done {\n    background-color: #2ecc71;\n    bottom: 15px;\n    cursor: pointer;\n    height: 72px;\n    margin: 0 0 0 15px;\n    position: absolute;\n    right: 15px;\n    transition: .3s background-color ease,\n                .3s box-shadow ease;\n    width: 72px;\n    z-index: 10;\n}\n\n#done.error {\n    background-color: #e74c3c;\n}\n\n#done.hiddenFab {\n    background-color: transparent;\n    box-shadow: none;\n}\n\n#done i {\n    font-size: 36px;\n    transform: translate(-18px, -12px);\n}\n\n#done .mdl-spinner--single-color {\n    height: 70px;\n    width: 70px;\n}\n\n#done .mdl-spinner--single-color .mdl-spinner__layer {\n    border-color: #2ecc71;\n    zoom: 2;\n}\n\n/* Loader and modal */\n.shadow-loader {\n    background-color: rgba(0, 0, 0, 0.6);\n    height: 100%;\n    left: 0;\n    position: absolute;\n    text-align: center;\n    top: 0;\n    width: 100%;\n    z-index: 20;\n}\n\n.shadow-loader > .mdl-spinner {\n    margin-top: 10%;\n}\n\n.shadow-loader .mdl-spinner--single-color .mdl-spinner__layer {\n    border-color: #fff;\n}\n\n/* Error card */\n.modal-error {\n    background-color: rgba(0, 0, 0, 0.6);\n    height: 100%;\n    left: 0;\n    position: absolute;\n    text-align: center;\n    top: 0;\n    width: 100%;\n    z-index: 20;\n}\n\n.modal-error > .mdl-card {\n    margin: 150px auto 0 auto;\n    min-height: 0;\n    width: 350px;\n}\n\n.modal-error .mdl-card__title {\n    padding: 20px 20px 0 20px;\n    text-align: center;\n}\n\n.modal-error p {\n    text-align: left;\n}\n\n/* Revalidation */\n#revalidation {\n    background: #34495e;\n    box-sizing: border-box;\n    color: #fff;\n    font-size: 30px;\n    height: 100%;\n    left: 0;\n    padding-top: 140px;\n    position: absolute;\n    text-align: center;\n    top: 0;\n    width: 100%;\n    z-index: 15;\n}\n", ""]);
	
	// exports


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(11);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(11, function() {
				var newContent = __webpack_require__(11);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports
	
	
	// module
	exports.push([module.id, "/* Promotions */\n.promotionButton {\n    color: #fff;\n}\n\n.mdl-layout__header {\n    background-color: #34495e;\n    box-shadow: none;\n}\n\n/* User info in header */\n.picture {\n    background: #34495e;\n    height: 112px;\n    position: absolute;\n    width: 100px;\n}\n\n.picture img {\n    margin-top: 6px;\n}\n\n.picture i {\n    color: rgba(255, 255, 255, 0.9);\n    font-size: 90px;\n    height: 112px;\n    line-height: 112px;\n    text-align: center;\n    width: 100px;\n}\n\n.mdl-layout__header.with-picture {\n    width: calc(100% - 100px);\n    margin-left: 100px;\n}\n\n.mdl-layout__header .mdl-layout-spacer {\n    font-size: 18px;\n    line-height: 20px;\n    padding: 0 20px;\n}\n\n.mdl-layout__header .mdl-layout-spacer > div > span {\n    font-size: 17px;\n}\n\n.userCredit {\n    float: left;\n    line-height: 22px;\n    margin-right: 20px;\n    text-align: center;\n\n    transition: margin-right .3s ease;\n}\n\n.userCredit.mdl-badge {\n    margin-right: 70px;\n}\n\n.userCredit.mdl-badge[data-badge]:after {\n    border-radius: 2px;\n    background-color: #2ecc71;\n    opacity: 0;\n    right: -60px;\n    top: 11px;\n    width: 52px;\n\n    transition: opacity .3s ease;\n}\n\n.userCredit.mdl-badge.showBadge[data-badge]:after {\n    opacity: 1;\n}\n\n.userBasket {\n    line-height: 44px;\n}\n\n/* Invalid price */\n.mdl-layout__header .invalidPrice {\n    color: #ff3333;\n    font-weight: bold;\n}\n\n/* Spacer has defined width */\n.mdl-layout__header .mdl-layout-spacer {\n    flex-shrink: 1;\n    padding-left: 0;\n}\n\n.mdl-layout__header .mdl-layout-spacer > div {\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    width: 100%;\n}\n\n/* Fix hamburger icon */\n.mdl-layout__header .mdl-layout__drawer-button {\n    display: none;\n}\n\n/* Unifies padding on header */\n.mdl-layout__header-row {\n    border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n    padding-right: 0;\n    padding-left: 20px;\n}\n\n/* Forces tab size*/\n.mdl-layout__tab-bar {\n    background-color: transparent;\n    height: 48px;\n}\n\n.mdl-layout.is-upgraded .mdl-layout__tab.is-active::after {\n    background-color: #e74c3c;\n}\n\n.mdl-layout__tab-bar .mdl-layout__tab {\n    cursor: pointer;\n}\n", ""]);
	
	// exports


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(13);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(13, function() {
				var newContent = __webpack_require__(13);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports
	
	
	// module
	exports.push([module.id, ".articlesContainer {\n    align-content: flex-start;\n    display: flex;\n    flex-wrap: wrap;\n}\n\n.buckutt-card-image {\n    background: url('../images/placeholder.jpg');\n    cursor: pointer;\n    margin: 15px;\n    max-height: 150px;\n    max-width: 150px;\n    min-height: 150px;\n    min-width: 150px;\n    overflow: visible;\n}\n\n\n/* Activated */\n.buckutt-card-image.active {\n    border: 5px solid #2980b9;\n}\n\n/* Badge correction */\n.buckutt-card-image.active::after {\n    background-color: #e74c3c;\n    font-size: 16px;\n    height: 27px;\n    top: -20px;\n    width: 27px;\n}\n\n/* Blurry div */\n.buckutt-card-image > .mdl-card__actions::before {\n    content: ' ';\n    background-position: 50% 36px !important;\n    background-size: 100%;\n    background: url('../images/placeholder.jpg');\n    display: inline-block;\n    height: 35px;\n    position: relative;\n    top: 35px;\n    width: 150px;\n    -webkit-filter: blur(2px);\n}\n\n.buckutt-card-image.active > .mdl-card__actions::before {\n    content: ' ';\n    background-position: 50% 45px !important;\n    background-size: 100%;\n    background: url('../images/placeholder.jpg');\n    display: inline-block;\n    height: 34px;\n    position: relative;\n    top: 11px;\n    width: 150px;\n    -webkit-filter: blur(2px);\n}\n\n.buckutt-card-image > .mdl-card__actions {\n    font-size: 17px;\n    overflow: hidden;\n    padding: 0;\n}\n\n.buckutt-card-image > .mdl-card__actions > .buckutt-card-image__filename {\n    background-color: rgba(255, 255, 255, 0.6);\n    display: inline-block;\n    height: 35px;\n    left: 0;\n    line-height: 35px;\n    padding-left: 5px;\n    position: relative;\n    width: 100%;\n    z-index: 2;\n}\n\n.buckutt-card-image.active > .mdl-card__actions > .buckutt-card-image__filename {\n    left: -155px;\n}\n\n/* -1 Button */\n.buckutt-card-image > .mdl-button {\n    display: none;\n}\n\n.buckutt-card-image.active > .mdl-button {\n    background-color: #f39c12;\n    display: block;\n    height: 36px;\n    margin-right: -20px;\n    margin-top: -85px;\n    max-width: 36px;\n    min-width: 36px;\n    position: absolute;\n    right: 0;\n    z-index: 2;\n}\n\n.mdl-button--fab.mdl-button--colored:focus:not(:active) {\n    background-color: #e67e22;\n}\n", ""]);
	
	// exports


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(15);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(15, function() {
				var newContent = __webpack_require__(15);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports
	
	
	// module
	exports.push([module.id, ".infoCard {\n    font-size: 24px;\n    height: 150px;\n    line-height: 150px;\n    margin: 40px auto;\n    min-height: 150px;\n    text-align: center;\n    width: 600px;\n}\n\n.infoCard.authCard {\n    height: 445px;\n}\n\n.infoCard.authCard .mdl-grid {\n    box-sizing: border-box;\n    width: 100%;\n}\n\n.infoCard.authCard .mdl-cell {\n    border: 1px solid #ddd;\n    cursor: pointer;\n    font-size: 24px;\n    height: 70px;\n    line-height: 70px;\n\n    -webkit-user-select: none;\n            user-select: none;\n}\n\n.infoCard.authCard .mdl-cell:first-child {\n    border: 1px solid #ddd;\n    cursor: default;\n\n    transition: border .3s ease;\n}\n\n.infoCard.authCard .mdl-cell.wrong:first-child {\n    border: 2px solid #e74c3c;\n}\n\n.infoCard.authCard .mdl-cell > i {\n    font-size: 34px;\n    line-height: 70px;\n}\n", ""]);
	
	// exports


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(17);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(17, function() {
				var newContent = __webpack_require__(17);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports
	
	
	// module
	exports.push([module.id, ".modal-reload-credit {\n    background-color: rgba(0, 0, 0, 0.6);\n    height: 100%;\n    left: 0;\n    position: absolute;\n    text-align: center;\n    top: 0;\n    width: 100%;\n    z-index: 20;\n}\n\n#reloadCard {\n    margin: 150px auto 0 auto;\n    width: 450px;\n}\n\n/* Center grid */\n#reloadCard .mdl-card__supporting-text {\n    margin: 0 auto;\n}\n\n/* Prepare amount grid for animation */\n#reloadCard .amountGrid {\n    height: 242px;\n    margin: 10px;\n    overflow: hidden;\n    padding: 0;\n\n    transition: height .3s ease;\n}\n\n#reloadCard .amountGrid .mdl-button {\n    border: 1px solid #ddd;\n}\n\n/* Prepare buttons grid for animation */\n#reloadCard .buttonsGrid {\n    height: 0;\n    margin: 10px;\n    overflow: hidden;\n    padding: 0;\n\n    transition: height .3s ease;\n}\n\n/* Means of payment buttons */\n#reloadCard button {\n    margin: 0 5px;\n}\n\n#reloadCard .material-icons {\n    line-height: 36px;\n}\n\n#reloadCard button.mdl-button--raised:not([disabled]) {\n    background-color: #3498db;\n}\n\n#reloadCard button.mdl-button--raised[disabled] {\n    color: #3498db;\n}\n\n#reloadCard button:not([disabled]):not(.mdl-button--raised) {\n    color: #3498db;\n}\n\n/* Close button */\n#reloadCard > .mdl-card__title > button {\n    color: #f39c12;\n    position: absolute;\n    right: 20px;\n}\n\n/* Reload amount */\n#creditToReload {\n    font-size: 25px;\n}\n\n#reloadCard .buttonsGrid button {\n    height: 45px;\n}\n\n#reloadCard .buttonsGrid .validate button {\n    background-color: #2ecc71;\n    display: block;\n    width: 100%;\n}\n\n#reloadCard .buttonsGrid .cancel button {\n    background-color: #f39c12;\n    display: block;\n    width: 100%;\n}\n\n/* Menu under reload amount */\n#reloadMenu {\n    cursor: pointer;\n    height: 22px;\n    margin-left: -63px;\n    margin-top: 11px;\n    position: absolute;\n    width: 53px;\n}\n\n#reloadMenu i {\n    color: #555;\n    left: 5px;\n    position: relative;\n    top: -2px;\n    vertical-align: middle;\n}\n", ""]);
	
	// exports


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(19);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(19, function() {
				var newContent = __webpack_require__(19);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports
	
	
	// module
	exports.push([module.id, ".fade-transition {\n    transition: opacity .3s ease;\n}\n\n.fade-enter, .fade-leave {\n    opacity: 0;\n}\n", ""]);
	
	// exports


/***/ },
/* 20 */
/***/ function(module, exports) {

	;(function() {
	"use strict";
	
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	/**
	 * A component handler interface using the revealing module design pattern.
	 * More details on this design pattern here:
	 * https://github.com/jasonmayes/mdl-component-design-pattern
	 *
	 * @author Jason Mayes.
	 */
	/* exported componentHandler */
	
	// Pre-defining the componentHandler interface, for closure documentation and
	// static verification.
	var componentHandler = {
	  /**
	   * Searches existing DOM for elements of our component type and upgrades them
	   * if they have not already been upgraded.
	   *
	   * @param {string=} optJsClass the programatic name of the element class we
	   * need to create a new instance of.
	   * @param {string=} optCssClass the name of the CSS class elements of this
	   * type will have.
	   */
	  upgradeDom: function(optJsClass, optCssClass) {},
	  /**
	   * Upgrades a specific element rather than all in the DOM.
	   *
	   * @param {!Element} element The element we wish to upgrade.
	   * @param {string=} optJsClass Optional name of the class we want to upgrade
	   * the element to.
	   */
	  upgradeElement: function(element, optJsClass) {},
	  /**
	   * Upgrades a specific list of elements rather than all in the DOM.
	   *
	   * @param {!Element|!Array<!Element>|!NodeList|!HTMLCollection} elements
	   * The elements we wish to upgrade.
	   */
	  upgradeElements: function(elements) {},
	  /**
	   * Upgrades all registered components found in the current DOM. This is
	   * automatically called on window load.
	   */
	  upgradeAllRegistered: function() {},
	  /**
	   * Allows user to be alerted to any upgrades that are performed for a given
	   * component type
	   *
	   * @param {string} jsClass The class name of the MDL component we wish
	   * to hook into for any upgrades performed.
	   * @param {function(!HTMLElement)} callback The function to call upon an
	   * upgrade. This function should expect 1 parameter - the HTMLElement which
	   * got upgraded.
	   */
	  registerUpgradedCallback: function(jsClass, callback) {},
	  /**
	   * Registers a class for future use and attempts to upgrade existing DOM.
	   *
	   * @param {componentHandler.ComponentConfigPublic} config the registration configuration
	   */
	  register: function(config) {},
	  /**
	   * Downgrade either a given node, an array of nodes, or a NodeList.
	   *
	   * @param {!Node|!Array<!Node>|!NodeList} nodes
	   */
	  downgradeElements: function(nodes) {}
	};
	
	componentHandler = (function() {
	  'use strict';
	
	  /** @type {!Array<componentHandler.ComponentConfig>} */
	  var registeredComponents_ = [];
	
	  /** @type {!Array<componentHandler.Component>} */
	  var createdComponents_ = [];
	
	  var downgradeMethod_ = 'mdlDowngrade';
	  var componentConfigProperty_ = 'mdlComponentConfigInternal_';
	
	  /**
	   * Searches registered components for a class we are interested in using.
	   * Optionally replaces a match with passed object if specified.
	   *
	   * @param {string} name The name of a class we want to use.
	   * @param {componentHandler.ComponentConfig=} optReplace Optional object to replace match with.
	   * @return {!Object|boolean}
	   * @private
	   */
	  function findRegisteredClass_(name, optReplace) {
	    for (var i = 0; i < registeredComponents_.length; i++) {
	      if (registeredComponents_[i].className === name) {
	        if (typeof optReplace !== 'undefined') {
	          registeredComponents_[i] = optReplace;
	        }
	        return registeredComponents_[i];
	      }
	    }
	    return false;
	  }
	
	  /**
	   * Returns an array of the classNames of the upgraded classes on the element.
	   *
	   * @param {!Element} element The element to fetch data from.
	   * @return {!Array<string>}
	   * @private
	   */
	  function getUpgradedListOfElement_(element) {
	    var dataUpgraded = element.getAttribute('data-upgraded');
	    // Use `['']` as default value to conform the `,name,name...` style.
	    return dataUpgraded === null ? [''] : dataUpgraded.split(',');
	  }
	
	  /**
	   * Returns true if the given element has already been upgraded for the given
	   * class.
	   *
	   * @param {!Element} element The element we want to check.
	   * @param {string} jsClass The class to check for.
	   * @returns {boolean}
	   * @private
	   */
	  function isElementUpgraded_(element, jsClass) {
	    var upgradedList = getUpgradedListOfElement_(element);
	    return upgradedList.indexOf(jsClass) !== -1;
	  }
	
	  /**
	   * Searches existing DOM for elements of our component type and upgrades them
	   * if they have not already been upgraded.
	   *
	   * @param {string=} optJsClass the programatic name of the element class we
	   * need to create a new instance of.
	   * @param {string=} optCssClass the name of the CSS class elements of this
	   * type will have.
	   */
	  function upgradeDomInternal(optJsClass, optCssClass) {
	    if (typeof optJsClass === 'undefined' &&
	        typeof optCssClass === 'undefined') {
	      for (var i = 0; i < registeredComponents_.length; i++) {
	        upgradeDomInternal(registeredComponents_[i].className,
	            registeredComponents_[i].cssClass);
	      }
	    } else {
	      var jsClass = /** @type {string} */ (optJsClass);
	      if (typeof optCssClass === 'undefined') {
	        var registeredClass = findRegisteredClass_(jsClass);
	        if (registeredClass) {
	          optCssClass = registeredClass.cssClass;
	        }
	      }
	
	      var elements = document.querySelectorAll('.' + optCssClass);
	      for (var n = 0; n < elements.length; n++) {
	        upgradeElementInternal(elements[n], jsClass);
	      }
	    }
	  }
	
	  /**
	   * Upgrades a specific element rather than all in the DOM.
	   *
	   * @param {!Element} element The element we wish to upgrade.
	   * @param {string=} optJsClass Optional name of the class we want to upgrade
	   * the element to.
	   */
	  function upgradeElementInternal(element, optJsClass) {
	    // Verify argument type.
	    if (!(typeof element === 'object' && element instanceof Element)) {
	      throw new Error('Invalid argument provided to upgrade MDL element.');
	    }
	    var upgradedList = getUpgradedListOfElement_(element);
	    var classesToUpgrade = [];
	    // If jsClass is not provided scan the registered components to find the
	    // ones matching the element's CSS classList.
	    if (!optJsClass) {
	      var classList = element.classList;
	      registeredComponents_.forEach(function(component) {
	        // Match CSS & Not to be upgraded & Not upgraded.
	        if (classList.contains(component.cssClass) &&
	            classesToUpgrade.indexOf(component) === -1 &&
	            !isElementUpgraded_(element, component.className)) {
	          classesToUpgrade.push(component);
	        }
	      });
	    } else if (!isElementUpgraded_(element, optJsClass)) {
	      classesToUpgrade.push(findRegisteredClass_(optJsClass));
	    }
	
	    // Upgrade the element for each classes.
	    for (var i = 0, n = classesToUpgrade.length, registeredClass; i < n; i++) {
	      registeredClass = classesToUpgrade[i];
	      if (registeredClass) {
	        // Mark element as upgraded.
	        upgradedList.push(registeredClass.className);
	        element.setAttribute('data-upgraded', upgradedList.join(','));
	        var instance = new registeredClass.classConstructor(element);
	        instance[componentConfigProperty_] = registeredClass;
	        createdComponents_.push(instance);
	        // Call any callbacks the user has registered with this component type.
	        for (var j = 0, m = registeredClass.callbacks.length; j < m; j++) {
	          registeredClass.callbacks[j](element);
	        }
	
	        if (registeredClass.widget) {
	          // Assign per element instance for control over API
	          element[registeredClass.className] = instance;
	        }
	      } else {
	        throw new Error(
	          'Unable to find a registered component for the given class.');
	      }
	
	      var ev = document.createEvent('Events');
	      ev.initEvent('mdl-componentupgraded', true, true);
	      element.dispatchEvent(ev);
	    }
	  }
	
	  /**
	   * Upgrades a specific list of elements rather than all in the DOM.
	   *
	   * @param {!Element|!Array<!Element>|!NodeList|!HTMLCollection} elements
	   * The elements we wish to upgrade.
	   */
	  function upgradeElementsInternal(elements) {
	    if (!Array.isArray(elements)) {
	      if (typeof elements.item === 'function') {
	        elements = Array.prototype.slice.call(/** @type {Array} */ (elements));
	      } else {
	        elements = [elements];
	      }
	    }
	    for (var i = 0, n = elements.length, element; i < n; i++) {
	      element = elements[i];
	      if (element instanceof HTMLElement) {
	        upgradeElementInternal(element);
	        if (element.children.length > 0) {
	          upgradeElementsInternal(element.children);
	        }
	      }
	    }
	  }
	
	  /**
	   * Registers a class for future use and attempts to upgrade existing DOM.
	   *
	   * @param {componentHandler.ComponentConfigPublic} config
	   */
	  function registerInternal(config) {
	    // In order to support both Closure-compiled and uncompiled code accessing
	    // this method, we need to allow for both the dot and array syntax for
	    // property access. You'll therefore see the `foo.bar || foo['bar']`
	    // pattern repeated across this method.
	    var widgetMissing = (typeof config.widget === 'undefined' &&
	        typeof config['widget'] === 'undefined');
	    var widget = true;
	
	    if (!widgetMissing) {
	      widget = config.widget || config['widget'];
	    }
	
	    var newConfig = /** @type {componentHandler.ComponentConfig} */ ({
	      classConstructor: config.constructor || config['constructor'],
	      className: config.classAsString || config['classAsString'],
	      cssClass: config.cssClass || config['cssClass'],
	      widget: widget,
	      callbacks: []
	    });
	
	    registeredComponents_.forEach(function(item) {
	      if (item.cssClass === newConfig.cssClass) {
	        throw new Error('The provided cssClass has already been registered: ' + item.cssClass);
	      }
	      if (item.className === newConfig.className) {
	        throw new Error('The provided className has already been registered');
	      }
	    });
	
	    if (config.constructor.prototype
	        .hasOwnProperty(componentConfigProperty_)) {
	      throw new Error(
	          'MDL component classes must not have ' + componentConfigProperty_ +
	          ' defined as a property.');
	    }
	
	    var found = findRegisteredClass_(config.classAsString, newConfig);
	
	    if (!found) {
	      registeredComponents_.push(newConfig);
	    }
	  }
	
	  /**
	   * Allows user to be alerted to any upgrades that are performed for a given
	   * component type
	   *
	   * @param {string} jsClass The class name of the MDL component we wish
	   * to hook into for any upgrades performed.
	   * @param {function(!HTMLElement)} callback The function to call upon an
	   * upgrade. This function should expect 1 parameter - the HTMLElement which
	   * got upgraded.
	   */
	  function registerUpgradedCallbackInternal(jsClass, callback) {
	    var regClass = findRegisteredClass_(jsClass);
	    if (regClass) {
	      regClass.callbacks.push(callback);
	    }
	  }
	
	  /**
	   * Upgrades all registered components found in the current DOM. This is
	   * automatically called on window load.
	   */
	  function upgradeAllRegisteredInternal() {
	    for (var n = 0; n < registeredComponents_.length; n++) {
	      upgradeDomInternal(registeredComponents_[n].className);
	    }
	  }
	
	  /**
	   * Finds a created component by a given DOM node.
	   *
	   * @param {!Node} node
	   * @return {*}
	   */
	  function findCreatedComponentByNodeInternal(node) {
	    for (var n = 0; n < createdComponents_.length; n++) {
	      var component = createdComponents_[n];
	      if (component.element_ === node) {
	        return component;
	      }
	    }
	  }
	
	  /**
	   * Check the component for the downgrade method.
	   * Execute if found.
	   * Remove component from createdComponents list.
	   *
	   * @param {*} component
	   */
	  function deconstructComponentInternal(component) {
	    if (component &&
	        component[componentConfigProperty_]
	          .classConstructor.prototype
	          .hasOwnProperty(downgradeMethod_)) {
	      component[downgradeMethod_]();
	      var componentIndex = createdComponents_.indexOf(component);
	      createdComponents_.splice(componentIndex, 1);
	
	      var upgrades = component.element_.getAttribute('data-upgraded').split(',');
	      var componentPlace = upgrades.indexOf(
	          component[componentConfigProperty_].classAsString);
	      upgrades.splice(componentPlace, 1);
	      component.element_.setAttribute('data-upgraded', upgrades.join(','));
	
	      var ev = document.createEvent('Events');
	      ev.initEvent('mdl-componentdowngraded', true, true);
	      component.element_.dispatchEvent(ev);
	    }
	  }
	
	  /**
	   * Downgrade either a given node, an array of nodes, or a NodeList.
	   *
	   * @param {!Node|!Array<!Node>|!NodeList} nodes
	   */
	  function downgradeNodesInternal(nodes) {
	    /**
	     * Auxiliary function to downgrade a single node.
	     * @param  {!Node} node the node to be downgraded
	     */
	    var downgradeNode = function(node) {
	      deconstructComponentInternal(findCreatedComponentByNodeInternal(node));
	    };
	    if (nodes instanceof Array || nodes instanceof NodeList) {
	      for (var n = 0; n < nodes.length; n++) {
	        downgradeNode(nodes[n]);
	      }
	    } else if (nodes instanceof Node) {
	      downgradeNode(nodes);
	    } else {
	      throw new Error('Invalid argument provided to downgrade MDL nodes.');
	    }
	  }
	
	  // Now return the functions that should be made public with their publicly
	  // facing names...
	  return {
	    upgradeDom: upgradeDomInternal,
	    upgradeElement: upgradeElementInternal,
	    upgradeElements: upgradeElementsInternal,
	    upgradeAllRegistered: upgradeAllRegisteredInternal,
	    registerUpgradedCallback: registerUpgradedCallbackInternal,
	    register: registerInternal,
	    downgradeElements: downgradeNodesInternal
	  };
	})();
	
	/**
	 * Describes the type of a registered component type managed by
	 * componentHandler. Provided for benefit of the Closure compiler.
	 *
	 * @typedef {{
	 *   constructor: Function,
	 *   classAsString: string,
	 *   cssClass: string,
	 *   widget: (string|boolean|undefined)
	 * }}
	 */
	componentHandler.ComponentConfigPublic;  // jshint ignore:line
	
	/**
	 * Describes the type of a registered component type managed by
	 * componentHandler. Provided for benefit of the Closure compiler.
	 *
	 * @typedef {{
	 *   constructor: !Function,
	 *   className: string,
	 *   cssClass: string,
	 *   widget: (string|boolean),
	 *   callbacks: !Array<function(!HTMLElement)>
	 * }}
	 */
	componentHandler.ComponentConfig;  // jshint ignore:line
	
	/**
	 * Created component (i.e., upgraded element) type as managed by
	 * componentHandler. Provided for benefit of the Closure compiler.
	 *
	 * @typedef {{
	 *   element_: !HTMLElement,
	 *   className: string,
	 *   classAsString: string,
	 *   cssClass: string,
	 *   widget: string
	 * }}
	 */
	componentHandler.Component;  // jshint ignore:line
	
	// Export all symbols, for the benefit of Closure compiler.
	// No effect on uncompiled code.
	componentHandler['upgradeDom'] = componentHandler.upgradeDom;
	componentHandler['upgradeElement'] = componentHandler.upgradeElement;
	componentHandler['upgradeElements'] = componentHandler.upgradeElements;
	componentHandler['upgradeAllRegistered'] =
	    componentHandler.upgradeAllRegistered;
	componentHandler['registerUpgradedCallback'] =
	    componentHandler.registerUpgradedCallback;
	componentHandler['register'] = componentHandler.register;
	componentHandler['downgradeElements'] = componentHandler.downgradeElements;
	window.componentHandler = componentHandler;
	window['componentHandler'] = componentHandler;
	
	window.addEventListener('load', function() {
	  'use strict';
	
	  /**
	   * Performs a "Cutting the mustard" test. If the browser supports the features
	   * tested, adds a mdl-js class to the <html> element. It then upgrades all MDL
	   * components requiring JavaScript.
	   */
	  if ('classList' in document.createElement('div') &&
	      'querySelector' in document &&
	      'addEventListener' in window && Array.prototype.forEach) {
	    document.documentElement.classList.add('mdl-js');
	    componentHandler.upgradeAllRegistered();
	  } else {
	    /**
	     * Dummy function to avoid JS errors.
	     */
	    componentHandler.upgradeElement = function() {};
	    /**
	     * Dummy function to avoid JS errors.
	     */
	    componentHandler.register = function() {};
	  }
	});
	
	// Source: https://github.com/darius/requestAnimationFrame/blob/master/requestAnimationFrame.js
	// Adapted from https://gist.github.com/paulirish/1579671 which derived from
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	// requestAnimationFrame polyfill by Erik Möller.
	// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon
	// MIT license
	if (!Date.now) {
	    /**
	   * Date.now polyfill.
	   * @return {number} the current Date
	   */
	    Date.now = function () {
	        return new Date().getTime();
	    };
	    Date['now'] = Date.now;
	}
	var vendors = [
	    'webkit',
	    'moz'
	];
	for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
	    var vp = vendors[i];
	    window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
	    window.cancelAnimationFrame = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame'];
	    window['requestAnimationFrame'] = window.requestAnimationFrame;
	    window['cancelAnimationFrame'] = window.cancelAnimationFrame;
	}
	if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
	    var lastTime = 0;
	    /**
	   * requestAnimationFrame polyfill.
	   * @param  {!Function} callback the callback function.
	   */
	    window.requestAnimationFrame = function (callback) {
	        var now = Date.now();
	        var nextTime = Math.max(lastTime + 16, now);
	        return setTimeout(function () {
	            callback(lastTime = nextTime);
	        }, nextTime - now);
	    };
	    window.cancelAnimationFrame = clearTimeout;
	    window['requestAnimationFrame'] = window.requestAnimationFrame;
	    window['cancelAnimationFrame'] = window.cancelAnimationFrame;
	}
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Button MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialButton = function MaterialButton(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialButton'] = MaterialButton;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialButton.prototype.Constant_ = {};
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialButton.prototype.CssClasses_ = {
	    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	    RIPPLE_CONTAINER: 'mdl-button__ripple-container',
	    RIPPLE: 'mdl-ripple'
	};
	/**
	   * Handle blur of element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialButton.prototype.blurHandler_ = function (event) {
	    if (event) {
	        this.element_.blur();
	    }
	};
	// Public methods.
	/**
	   * Disable button.
	   *
	   * @public
	   */
	MaterialButton.prototype.disable = function () {
	    this.element_.disabled = true;
	};
	MaterialButton.prototype['disable'] = MaterialButton.prototype.disable;
	/**
	   * Enable button.
	   *
	   * @public
	   */
	MaterialButton.prototype.enable = function () {
	    this.element_.disabled = false;
	};
	MaterialButton.prototype['enable'] = MaterialButton.prototype.enable;
	/**
	   * Initialize element.
	   */
	MaterialButton.prototype.init = function () {
	    if (this.element_) {
	        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
	            var rippleContainer = document.createElement('span');
	            rippleContainer.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
	            this.rippleElement_ = document.createElement('span');
	            this.rippleElement_.classList.add(this.CssClasses_.RIPPLE);
	            rippleContainer.appendChild(this.rippleElement_);
	            this.boundRippleBlurHandler = this.blurHandler_.bind(this);
	            this.rippleElement_.addEventListener('mouseup', this.boundRippleBlurHandler);
	            this.element_.appendChild(rippleContainer);
	        }
	        this.boundButtonBlurHandler = this.blurHandler_.bind(this);
	        this.element_.addEventListener('mouseup', this.boundButtonBlurHandler);
	        this.element_.addEventListener('mouseleave', this.boundButtonBlurHandler);
	    }
	};
	/**
	   * Downgrade the element.
	   *
	   * @private
	   */
	MaterialButton.prototype.mdlDowngrade_ = function () {
	    if (this.rippleElement_) {
	        this.rippleElement_.removeEventListener('mouseup', this.boundRippleBlurHandler);
	    }
	    this.element_.removeEventListener('mouseup', this.boundButtonBlurHandler);
	    this.element_.removeEventListener('mouseleave', this.boundButtonBlurHandler);
	};
	/**
	   * Public alias for the downgrade method.
	   *
	   * @public
	   */
	MaterialButton.prototype.mdlDowngrade = MaterialButton.prototype.mdlDowngrade_;
	MaterialButton.prototype['mdlDowngrade'] = MaterialButton.prototype.mdlDowngrade;
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialButton,
	    classAsString: 'MaterialButton',
	    cssClass: 'mdl-js-button',
	    widget: true
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Checkbox MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialCheckbox = function MaterialCheckbox(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialCheckbox'] = MaterialCheckbox;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialCheckbox.prototype.Constant_ = { TINY_TIMEOUT: 0.001 };
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialCheckbox.prototype.CssClasses_ = {
	    INPUT: 'mdl-checkbox__input',
	    BOX_OUTLINE: 'mdl-checkbox__box-outline',
	    FOCUS_HELPER: 'mdl-checkbox__focus-helper',
	    TICK_OUTLINE: 'mdl-checkbox__tick-outline',
	    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
	    RIPPLE_CONTAINER: 'mdl-checkbox__ripple-container',
	    RIPPLE_CENTER: 'mdl-ripple--center',
	    RIPPLE: 'mdl-ripple',
	    IS_FOCUSED: 'is-focused',
	    IS_DISABLED: 'is-disabled',
	    IS_CHECKED: 'is-checked',
	    IS_UPGRADED: 'is-upgraded'
	};
	/**
	   * Handle change of state.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialCheckbox.prototype.onChange_ = function (event) {
	    this.updateClasses_();
	};
	/**
	   * Handle focus of element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialCheckbox.prototype.onFocus_ = function (event) {
	    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
	};
	/**
	   * Handle lost focus of element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialCheckbox.prototype.onBlur_ = function (event) {
	    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
	};
	/**
	   * Handle mouseup.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialCheckbox.prototype.onMouseUp_ = function (event) {
	    this.blur_();
	};
	/**
	   * Handle class updates.
	   *
	   * @private
	   */
	MaterialCheckbox.prototype.updateClasses_ = function () {
	    this.checkDisabled();
	    this.checkToggleState();
	};
	/**
	   * Add blur.
	   *
	   * @private
	   */
	MaterialCheckbox.prototype.blur_ = function () {
	    // TODO: figure out why there's a focus event being fired after our blur,
	    // so that we can avoid this hack.
	    window.setTimeout(function () {
	        this.inputElement_.blur();
	    }.bind(this), this.Constant_.TINY_TIMEOUT);
	};
	// Public methods.
	/**
	   * Check the inputs toggle state and update display.
	   *
	   * @public
	   */
	MaterialCheckbox.prototype.checkToggleState = function () {
	    if (this.inputElement_.checked) {
	        this.element_.classList.add(this.CssClasses_.IS_CHECKED);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
	    }
	};
	MaterialCheckbox.prototype['checkToggleState'] = MaterialCheckbox.prototype.checkToggleState;
	/**
	   * Check the inputs disabled state and update display.
	   *
	   * @public
	   */
	MaterialCheckbox.prototype.checkDisabled = function () {
	    if (this.inputElement_.disabled) {
	        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
	    }
	};
	MaterialCheckbox.prototype['checkDisabled'] = MaterialCheckbox.prototype.checkDisabled;
	/**
	   * Disable checkbox.
	   *
	   * @public
	   */
	MaterialCheckbox.prototype.disable = function () {
	    this.inputElement_.disabled = true;
	    this.updateClasses_();
	};
	MaterialCheckbox.prototype['disable'] = MaterialCheckbox.prototype.disable;
	/**
	   * Enable checkbox.
	   *
	   * @public
	   */
	MaterialCheckbox.prototype.enable = function () {
	    this.inputElement_.disabled = false;
	    this.updateClasses_();
	};
	MaterialCheckbox.prototype['enable'] = MaterialCheckbox.prototype.enable;
	/**
	   * Check checkbox.
	   *
	   * @public
	   */
	MaterialCheckbox.prototype.check = function () {
	    this.inputElement_.checked = true;
	    this.updateClasses_();
	};
	MaterialCheckbox.prototype['check'] = MaterialCheckbox.prototype.check;
	/**
	   * Uncheck checkbox.
	   *
	   * @public
	   */
	MaterialCheckbox.prototype.uncheck = function () {
	    this.inputElement_.checked = false;
	    this.updateClasses_();
	};
	MaterialCheckbox.prototype['uncheck'] = MaterialCheckbox.prototype.uncheck;
	/**
	   * Initialize element.
	   */
	MaterialCheckbox.prototype.init = function () {
	    if (this.element_) {
	        this.inputElement_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);
	        var boxOutline = document.createElement('span');
	        boxOutline.classList.add(this.CssClasses_.BOX_OUTLINE);
	        var tickContainer = document.createElement('span');
	        tickContainer.classList.add(this.CssClasses_.FOCUS_HELPER);
	        var tickOutline = document.createElement('span');
	        tickOutline.classList.add(this.CssClasses_.TICK_OUTLINE);
	        boxOutline.appendChild(tickOutline);
	        this.element_.appendChild(tickContainer);
	        this.element_.appendChild(boxOutline);
	        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
	            this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
	            this.rippleContainerElement_ = document.createElement('span');
	            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
	            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_EFFECT);
	            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER);
	            this.boundRippleMouseUp = this.onMouseUp_.bind(this);
	            this.rippleContainerElement_.addEventListener('mouseup', this.boundRippleMouseUp);
	            var ripple = document.createElement('span');
	            ripple.classList.add(this.CssClasses_.RIPPLE);
	            this.rippleContainerElement_.appendChild(ripple);
	            this.element_.appendChild(this.rippleContainerElement_);
	        }
	        this.boundInputOnChange = this.onChange_.bind(this);
	        this.boundInputOnFocus = this.onFocus_.bind(this);
	        this.boundInputOnBlur = this.onBlur_.bind(this);
	        this.boundElementMouseUp = this.onMouseUp_.bind(this);
	        this.inputElement_.addEventListener('change', this.boundInputOnChange);
	        this.inputElement_.addEventListener('focus', this.boundInputOnFocus);
	        this.inputElement_.addEventListener('blur', this.boundInputOnBlur);
	        this.element_.addEventListener('mouseup', this.boundElementMouseUp);
	        this.updateClasses_();
	        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
	    }
	};
	/**
	   * Downgrade the component.
	   *
	   * @private
	   */
	MaterialCheckbox.prototype.mdlDowngrade_ = function () {
	    if (this.rippleContainerElement_) {
	        this.rippleContainerElement_.removeEventListener('mouseup', this.boundRippleMouseUp);
	    }
	    this.inputElement_.removeEventListener('change', this.boundInputOnChange);
	    this.inputElement_.removeEventListener('focus', this.boundInputOnFocus);
	    this.inputElement_.removeEventListener('blur', this.boundInputOnBlur);
	    this.element_.removeEventListener('mouseup', this.boundElementMouseUp);
	};
	/**
	   * Public alias for the downgrade method.
	   *
	   * @public
	   */
	MaterialCheckbox.prototype.mdlDowngrade = MaterialCheckbox.prototype.mdlDowngrade_;
	MaterialCheckbox.prototype['mdlDowngrade'] = MaterialCheckbox.prototype.mdlDowngrade;
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialCheckbox,
	    classAsString: 'MaterialCheckbox',
	    cssClass: 'mdl-js-checkbox',
	    widget: true
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for icon toggle MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialIconToggle = function MaterialIconToggle(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialIconToggle'] = MaterialIconToggle;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialIconToggle.prototype.Constant_ = { TINY_TIMEOUT: 0.001 };
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialIconToggle.prototype.CssClasses_ = {
	    INPUT: 'mdl-icon-toggle__input',
	    JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
	    RIPPLE_CONTAINER: 'mdl-icon-toggle__ripple-container',
	    RIPPLE_CENTER: 'mdl-ripple--center',
	    RIPPLE: 'mdl-ripple',
	    IS_FOCUSED: 'is-focused',
	    IS_DISABLED: 'is-disabled',
	    IS_CHECKED: 'is-checked'
	};
	/**
	   * Handle change of state.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialIconToggle.prototype.onChange_ = function (event) {
	    this.updateClasses_();
	};
	/**
	   * Handle focus of element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialIconToggle.prototype.onFocus_ = function (event) {
	    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
	};
	/**
	   * Handle lost focus of element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialIconToggle.prototype.onBlur_ = function (event) {
	    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
	};
	/**
	   * Handle mouseup.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialIconToggle.prototype.onMouseUp_ = function (event) {
	    this.blur_();
	};
	/**
	   * Handle class updates.
	   *
	   * @private
	   */
	MaterialIconToggle.prototype.updateClasses_ = function () {
	    this.checkDisabled();
	    this.checkToggleState();
	};
	/**
	   * Add blur.
	   *
	   * @private
	   */
	MaterialIconToggle.prototype.blur_ = function () {
	    // TODO: figure out why there's a focus event being fired after our blur,
	    // so that we can avoid this hack.
	    window.setTimeout(function () {
	        this.inputElement_.blur();
	    }.bind(this), this.Constant_.TINY_TIMEOUT);
	};
	// Public methods.
	/**
	   * Check the inputs toggle state and update display.
	   *
	   * @public
	   */
	MaterialIconToggle.prototype.checkToggleState = function () {
	    if (this.inputElement_.checked) {
	        this.element_.classList.add(this.CssClasses_.IS_CHECKED);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
	    }
	};
	MaterialIconToggle.prototype['checkToggleState'] = MaterialIconToggle.prototype.checkToggleState;
	/**
	   * Check the inputs disabled state and update display.
	   *
	   * @public
	   */
	MaterialIconToggle.prototype.checkDisabled = function () {
	    if (this.inputElement_.disabled) {
	        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
	    }
	};
	MaterialIconToggle.prototype['checkDisabled'] = MaterialIconToggle.prototype.checkDisabled;
	/**
	   * Disable icon toggle.
	   *
	   * @public
	   */
	MaterialIconToggle.prototype.disable = function () {
	    this.inputElement_.disabled = true;
	    this.updateClasses_();
	};
	MaterialIconToggle.prototype['disable'] = MaterialIconToggle.prototype.disable;
	/**
	   * Enable icon toggle.
	   *
	   * @public
	   */
	MaterialIconToggle.prototype.enable = function () {
	    this.inputElement_.disabled = false;
	    this.updateClasses_();
	};
	MaterialIconToggle.prototype['enable'] = MaterialIconToggle.prototype.enable;
	/**
	   * Check icon toggle.
	   *
	   * @public
	   */
	MaterialIconToggle.prototype.check = function () {
	    this.inputElement_.checked = true;
	    this.updateClasses_();
	};
	MaterialIconToggle.prototype['check'] = MaterialIconToggle.prototype.check;
	/**
	   * Uncheck icon toggle.
	   *
	   * @public
	   */
	MaterialIconToggle.prototype.uncheck = function () {
	    this.inputElement_.checked = false;
	    this.updateClasses_();
	};
	MaterialIconToggle.prototype['uncheck'] = MaterialIconToggle.prototype.uncheck;
	/**
	   * Initialize element.
	   */
	MaterialIconToggle.prototype.init = function () {
	    if (this.element_) {
	        this.inputElement_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);
	        if (this.element_.classList.contains(this.CssClasses_.JS_RIPPLE_EFFECT)) {
	            this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
	            this.rippleContainerElement_ = document.createElement('span');
	            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
	            this.rippleContainerElement_.classList.add(this.CssClasses_.JS_RIPPLE_EFFECT);
	            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER);
	            this.boundRippleMouseUp = this.onMouseUp_.bind(this);
	            this.rippleContainerElement_.addEventListener('mouseup', this.boundRippleMouseUp);
	            var ripple = document.createElement('span');
	            ripple.classList.add(this.CssClasses_.RIPPLE);
	            this.rippleContainerElement_.appendChild(ripple);
	            this.element_.appendChild(this.rippleContainerElement_);
	        }
	        this.boundInputOnChange = this.onChange_.bind(this);
	        this.boundInputOnFocus = this.onFocus_.bind(this);
	        this.boundInputOnBlur = this.onBlur_.bind(this);
	        this.boundElementOnMouseUp = this.onMouseUp_.bind(this);
	        this.inputElement_.addEventListener('change', this.boundInputOnChange);
	        this.inputElement_.addEventListener('focus', this.boundInputOnFocus);
	        this.inputElement_.addEventListener('blur', this.boundInputOnBlur);
	        this.element_.addEventListener('mouseup', this.boundElementOnMouseUp);
	        this.updateClasses_();
	        this.element_.classList.add('is-upgraded');
	    }
	};
	/**
	   * Downgrade the component
	   *
	   * @private
	   */
	MaterialIconToggle.prototype.mdlDowngrade_ = function () {
	    if (this.rippleContainerElement_) {
	        this.rippleContainerElement_.removeEventListener('mouseup', this.boundRippleMouseUp);
	    }
	    this.inputElement_.removeEventListener('change', this.boundInputOnChange);
	    this.inputElement_.removeEventListener('focus', this.boundInputOnFocus);
	    this.inputElement_.removeEventListener('blur', this.boundInputOnBlur);
	    this.element_.removeEventListener('mouseup', this.boundElementOnMouseUp);
	};
	/**
	   * Public alias for the downgrade method.
	   *
	   * @public
	   */
	MaterialIconToggle.prototype.mdlDowngrade = MaterialIconToggle.prototype.mdlDowngrade_;
	MaterialIconToggle.prototype['mdlDowngrade'] = MaterialIconToggle.prototype.mdlDowngrade;
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialIconToggle,
	    classAsString: 'MaterialIconToggle',
	    cssClass: 'mdl-js-icon-toggle',
	    widget: true
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for dropdown MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialMenu = function MaterialMenu(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialMenu'] = MaterialMenu;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialMenu.prototype.Constant_ = {
	    // Total duration of the menu animation.
	    TRANSITION_DURATION_SECONDS: 0.3,
	    // The fraction of the total duration we want to use for menu item animations.
	    TRANSITION_DURATION_FRACTION: 0.8,
	    // How long the menu stays open after choosing an option (so the user can see
	    // the ripple).
	    CLOSE_TIMEOUT: 150
	};
	/**
	   * Keycodes, for code readability.
	   *
	   * @enum {number}
	   * @private
	   */
	MaterialMenu.prototype.Keycodes_ = {
	    ENTER: 13,
	    ESCAPE: 27,
	    SPACE: 32,
	    UP_ARROW: 38,
	    DOWN_ARROW: 40
	};
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialMenu.prototype.CssClasses_ = {
	    CONTAINER: 'mdl-menu__container',
	    OUTLINE: 'mdl-menu__outline',
	    ITEM: 'mdl-menu__item',
	    ITEM_RIPPLE_CONTAINER: 'mdl-menu__item-ripple-container',
	    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
	    RIPPLE: 'mdl-ripple',
	    // Statuses
	    IS_UPGRADED: 'is-upgraded',
	    IS_VISIBLE: 'is-visible',
	    IS_ANIMATING: 'is-animating',
	    // Alignment options
	    BOTTOM_LEFT: 'mdl-menu--bottom-left',
	    // This is the default.
	    BOTTOM_RIGHT: 'mdl-menu--bottom-right',
	    TOP_LEFT: 'mdl-menu--top-left',
	    TOP_RIGHT: 'mdl-menu--top-right',
	    UNALIGNED: 'mdl-menu--unaligned'
	};
	/**
	   * Initialize element.
	   */
	MaterialMenu.prototype.init = function () {
	    if (this.element_) {
	        // Create container for the menu.
	        var container = document.createElement('div');
	        container.classList.add(this.CssClasses_.CONTAINER);
	        this.element_.parentElement.insertBefore(container, this.element_);
	        this.element_.parentElement.removeChild(this.element_);
	        container.appendChild(this.element_);
	        this.container_ = container;
	        // Create outline for the menu (shadow and background).
	        var outline = document.createElement('div');
	        outline.classList.add(this.CssClasses_.OUTLINE);
	        this.outline_ = outline;
	        container.insertBefore(outline, this.element_);
	        // Find the "for" element and bind events to it.
	        var forElId = this.element_.getAttribute('for');
	        var forEl = null;
	        if (forElId) {
	            forEl = document.getElementById(forElId);
	            if (forEl) {
	                this.forElement_ = forEl;
	                forEl.addEventListener('click', this.handleForClick_.bind(this));
	                forEl.addEventListener('keydown', this.handleForKeyboardEvent_.bind(this));
	            }
	        }
	        var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
	        this.boundItemKeydown_ = this.handleItemKeyboardEvent_.bind(this);
	        this.boundItemClick_ = this.handleItemClick_.bind(this);
	        for (var i = 0; i < items.length; i++) {
	            // Add a listener to each menu item.
	            items[i].addEventListener('click', this.boundItemClick_);
	            // Add a tab index to each menu item.
	            items[i].tabIndex = '-1';
	            // Add a keyboard listener to each menu item.
	            items[i].addEventListener('keydown', this.boundItemKeydown_);
	        }
	        // Add ripple classes to each item, if the user has enabled ripples.
	        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
	            this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
	            for (i = 0; i < items.length; i++) {
	                var item = items[i];
	                var rippleContainer = document.createElement('span');
	                rippleContainer.classList.add(this.CssClasses_.ITEM_RIPPLE_CONTAINER);
	                var ripple = document.createElement('span');
	                ripple.classList.add(this.CssClasses_.RIPPLE);
	                rippleContainer.appendChild(ripple);
	                item.appendChild(rippleContainer);
	                item.classList.add(this.CssClasses_.RIPPLE_EFFECT);
	            }
	        }
	        // Copy alignment classes to the container, so the outline can use them.
	        if (this.element_.classList.contains(this.CssClasses_.BOTTOM_LEFT)) {
	            this.outline_.classList.add(this.CssClasses_.BOTTOM_LEFT);
	        }
	        if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
	            this.outline_.classList.add(this.CssClasses_.BOTTOM_RIGHT);
	        }
	        if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
	            this.outline_.classList.add(this.CssClasses_.TOP_LEFT);
	        }
	        if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
	            this.outline_.classList.add(this.CssClasses_.TOP_RIGHT);
	        }
	        if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
	            this.outline_.classList.add(this.CssClasses_.UNALIGNED);
	        }
	        container.classList.add(this.CssClasses_.IS_UPGRADED);
	    }
	};
	/**
	   * Handles a click on the "for" element, by positioning the menu and then
	   * toggling it.
	   *
	   * @param {Event} evt The event that fired.
	   * @private
	   */
	MaterialMenu.prototype.handleForClick_ = function (evt) {
	    if (this.element_ && this.forElement_) {
	        var rect = this.forElement_.getBoundingClientRect();
	        var forRect = this.forElement_.parentElement.getBoundingClientRect();
	        if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
	        } else if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
	            // Position below the "for" element, aligned to its right.
	            this.container_.style.right = forRect.right - rect.right + 'px';
	            this.container_.style.top = this.forElement_.offsetTop + this.forElement_.offsetHeight + 'px';
	        } else if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
	            // Position above the "for" element, aligned to its left.
	            this.container_.style.left = this.forElement_.offsetLeft + 'px';
	            this.container_.style.bottom = forRect.bottom - rect.top + 'px';
	        } else if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
	            // Position above the "for" element, aligned to its right.
	            this.container_.style.right = forRect.right - rect.right + 'px';
	            this.container_.style.bottom = forRect.bottom - rect.top + 'px';
	        } else {
	            // Default: position below the "for" element, aligned to its left.
	            this.container_.style.left = this.forElement_.offsetLeft + 'px';
	            this.container_.style.top = this.forElement_.offsetTop + this.forElement_.offsetHeight + 'px';
	        }
	    }
	    this.toggle(evt);
	};
	/**
	   * Handles a keyboard event on the "for" element.
	   *
	   * @param {Event} evt The event that fired.
	   * @private
	   */
	MaterialMenu.prototype.handleForKeyboardEvent_ = function (evt) {
	    if (this.element_ && this.container_ && this.forElement_) {
	        var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM + ':not([disabled])');
	        if (items && items.length > 0 && this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
	            if (evt.keyCode === this.Keycodes_.UP_ARROW) {
	                evt.preventDefault();
	                items[items.length - 1].focus();
	            } else if (evt.keyCode === this.Keycodes_.DOWN_ARROW) {
	                evt.preventDefault();
	                items[0].focus();
	            }
	        }
	    }
	};
	/**
	   * Handles a keyboard event on an item.
	   *
	   * @param {Event} evt The event that fired.
	   * @private
	   */
	MaterialMenu.prototype.handleItemKeyboardEvent_ = function (evt) {
	    if (this.element_ && this.container_) {
	        var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM + ':not([disabled])');
	        if (items && items.length > 0 && this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
	            var currentIndex = Array.prototype.slice.call(items).indexOf(evt.target);
	            if (evt.keyCode === this.Keycodes_.UP_ARROW) {
	                evt.preventDefault();
	                if (currentIndex > 0) {
	                    items[currentIndex - 1].focus();
	                } else {
	                    items[items.length - 1].focus();
	                }
	            } else if (evt.keyCode === this.Keycodes_.DOWN_ARROW) {
	                evt.preventDefault();
	                if (items.length > currentIndex + 1) {
	                    items[currentIndex + 1].focus();
	                } else {
	                    items[0].focus();
	                }
	            } else if (evt.keyCode === this.Keycodes_.SPACE || evt.keyCode === this.Keycodes_.ENTER) {
	                evt.preventDefault();
	                // Send mousedown and mouseup to trigger ripple.
	                var e = new MouseEvent('mousedown');
	                evt.target.dispatchEvent(e);
	                e = new MouseEvent('mouseup');
	                evt.target.dispatchEvent(e);
	                // Send click.
	                evt.target.click();
	            } else if (evt.keyCode === this.Keycodes_.ESCAPE) {
	                evt.preventDefault();
	                this.hide();
	            }
	        }
	    }
	};
	/**
	   * Handles a click event on an item.
	   *
	   * @param {Event} evt The event that fired.
	   * @private
	   */
	MaterialMenu.prototype.handleItemClick_ = function (evt) {
	    if (evt.target.hasAttribute('disabled')) {
	        evt.stopPropagation();
	    } else {
	        // Wait some time before closing menu, so the user can see the ripple.
	        this.closing_ = true;
	        window.setTimeout(function (evt) {
	            this.hide();
	            this.closing_ = false;
	        }.bind(this), this.Constant_.CLOSE_TIMEOUT);
	    }
	};
	/**
	   * Calculates the initial clip (for opening the menu) or final clip (for closing
	   * it), and applies it. This allows us to animate from or to the correct point,
	   * that is, the point it's aligned to in the "for" element.
	   *
	   * @param {number} height Height of the clip rectangle
	   * @param {number} width Width of the clip rectangle
	   * @private
	   */
	MaterialMenu.prototype.applyClip_ = function (height, width) {
	    if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
	        // Do not clip.
	        this.element_.style.clip = '';
	    } else if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
	        // Clip to the top right corner of the menu.
	        this.element_.style.clip = 'rect(0 ' + width + 'px ' + '0 ' + width + 'px)';
	    } else if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
	        // Clip to the bottom left corner of the menu.
	        this.element_.style.clip = 'rect(' + height + 'px 0 ' + height + 'px 0)';
	    } else if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
	        // Clip to the bottom right corner of the menu.
	        this.element_.style.clip = 'rect(' + height + 'px ' + width + 'px ' + height + 'px ' + width + 'px)';
	    } else {
	        // Default: do not clip (same as clipping to the top left corner).
	        this.element_.style.clip = '';
	    }
	};
	/**
	   * Adds an event listener to clean up after the animation ends.
	   *
	   * @private
	   */
	MaterialMenu.prototype.addAnimationEndListener_ = function () {
	    var cleanup = function () {
	        this.element_.removeEventListener('transitionend', cleanup);
	        this.element_.removeEventListener('webkitTransitionEnd', cleanup);
	        this.element_.classList.remove(this.CssClasses_.IS_ANIMATING);
	    }.bind(this);
	    // Remove animation class once the transition is done.
	    this.element_.addEventListener('transitionend', cleanup);
	    this.element_.addEventListener('webkitTransitionEnd', cleanup);
	};
	/**
	   * Displays the menu.
	   *
	   * @public
	   */
	MaterialMenu.prototype.show = function (evt) {
	    if (this.element_ && this.container_ && this.outline_) {
	        // Measure the inner element.
	        var height = this.element_.getBoundingClientRect().height;
	        var width = this.element_.getBoundingClientRect().width;
	        // Apply the inner element's size to the container and outline.
	        this.container_.style.width = width + 'px';
	        this.container_.style.height = height + 'px';
	        this.outline_.style.width = width + 'px';
	        this.outline_.style.height = height + 'px';
	        var transitionDuration = this.Constant_.TRANSITION_DURATION_SECONDS * this.Constant_.TRANSITION_DURATION_FRACTION;
	        // Calculate transition delays for individual menu items, so that they fade
	        // in one at a time.
	        var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
	        for (var i = 0; i < items.length; i++) {
	            var itemDelay = null;
	            if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT) || this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
	                itemDelay = (height - items[i].offsetTop - items[i].offsetHeight) / height * transitionDuration + 's';
	            } else {
	                itemDelay = items[i].offsetTop / height * transitionDuration + 's';
	            }
	            items[i].style.transitionDelay = itemDelay;
	        }
	        // Apply the initial clip to the text before we start animating.
	        this.applyClip_(height, width);
	        // Wait for the next frame, turn on animation, and apply the final clip.
	        // Also make it visible. This triggers the transitions.
	        window.requestAnimationFrame(function () {
	            this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
	            this.element_.style.clip = 'rect(0 ' + width + 'px ' + height + 'px 0)';
	            this.container_.classList.add(this.CssClasses_.IS_VISIBLE);
	        }.bind(this));
	        // Clean up after the animation is complete.
	        this.addAnimationEndListener_();
	        // Add a click listener to the document, to close the menu.
	        var callback = function (e) {
	            // Check to see if the document is processing the same event that
	            // displayed the menu in the first place. If so, do nothing.
	            // Also check to see if the menu is in the process of closing itself, and
	            // do nothing in that case.
	            // Also check if the clicked element is a menu item
	            // if so, do nothing.
	            if (e !== evt && !this.closing_ && e.target.parentNode !== this.element_) {
	                document.removeEventListener('click', callback);
	                this.hide();
	            }
	        }.bind(this);
	        document.addEventListener('click', callback);
	    }
	};
	MaterialMenu.prototype['show'] = MaterialMenu.prototype.show;
	/**
	   * Hides the menu.
	   *
	   * @public
	   */
	MaterialMenu.prototype.hide = function () {
	    if (this.element_ && this.container_ && this.outline_) {
	        var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
	        // Remove all transition delays; menu items fade out concurrently.
	        for (var i = 0; i < items.length; i++) {
	            items[i].style.transitionDelay = null;
	        }
	        // Measure the inner element.
	        var rect = this.element_.getBoundingClientRect();
	        var height = rect.height;
	        var width = rect.width;
	        // Turn on animation, and apply the final clip. Also make invisible.
	        // This triggers the transitions.
	        this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
	        this.applyClip_(height, width);
	        this.container_.classList.remove(this.CssClasses_.IS_VISIBLE);
	        // Clean up after the animation is complete.
	        this.addAnimationEndListener_();
	    }
	};
	MaterialMenu.prototype['hide'] = MaterialMenu.prototype.hide;
	/**
	   * Displays or hides the menu, depending on current state.
	   *
	   * @public
	   */
	MaterialMenu.prototype.toggle = function (evt) {
	    if (this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
	        this.hide();
	    } else {
	        this.show(evt);
	    }
	};
	MaterialMenu.prototype['toggle'] = MaterialMenu.prototype.toggle;
	/**
	   * Downgrade the component.
	   *
	   * @private
	   */
	MaterialMenu.prototype.mdlDowngrade_ = function () {
	    var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
	    for (var i = 0; i < items.length; i++) {
	        items[i].removeEventListener('click', this.boundItemClick_);
	        items[i].removeEventListener('keydown', this.boundItemKeydown_);
	    }
	};
	/**
	   * Public alias for the downgrade method.
	   *
	   * @public
	   */
	MaterialMenu.prototype.mdlDowngrade = MaterialMenu.prototype.mdlDowngrade_;
	MaterialMenu.prototype['mdlDowngrade'] = MaterialMenu.prototype.mdlDowngrade;
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialMenu,
	    classAsString: 'MaterialMenu',
	    cssClass: 'mdl-js-menu',
	    widget: true
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Progress MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialProgress = function MaterialProgress(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialProgress'] = MaterialProgress;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialProgress.prototype.Constant_ = {};
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialProgress.prototype.CssClasses_ = { INDETERMINATE_CLASS: 'mdl-progress__indeterminate' };
	/**
	   * Set the current progress of the progressbar.
	   *
	   * @param {number} p Percentage of the progress (0-100)
	   * @public
	   */
	MaterialProgress.prototype.setProgress = function (p) {
	    if (this.element_.classList.contains(this.CssClasses_.INDETERMINATE_CLASS)) {
	        return;
	    }
	    this.progressbar_.style.width = p + '%';
	};
	MaterialProgress.prototype['setProgress'] = MaterialProgress.prototype.setProgress;
	/**
	   * Set the current progress of the buffer.
	   *
	   * @param {number} p Percentage of the buffer (0-100)
	   * @public
	   */
	MaterialProgress.prototype.setBuffer = function (p) {
	    this.bufferbar_.style.width = p + '%';
	    this.auxbar_.style.width = 100 - p + '%';
	};
	MaterialProgress.prototype['setBuffer'] = MaterialProgress.prototype.setBuffer;
	/**
	   * Initialize element.
	   */
	MaterialProgress.prototype.init = function () {
	    if (this.element_) {
	        var el = document.createElement('div');
	        el.className = 'progressbar bar bar1';
	        this.element_.appendChild(el);
	        this.progressbar_ = el;
	        el = document.createElement('div');
	        el.className = 'bufferbar bar bar2';
	        this.element_.appendChild(el);
	        this.bufferbar_ = el;
	        el = document.createElement('div');
	        el.className = 'auxbar bar bar3';
	        this.element_.appendChild(el);
	        this.auxbar_ = el;
	        this.progressbar_.style.width = '0%';
	        this.bufferbar_.style.width = '100%';
	        this.auxbar_.style.width = '0%';
	        this.element_.classList.add('is-upgraded');
	    }
	};
	/**
	   * Downgrade the component
	   *
	   * @private
	   */
	MaterialProgress.prototype.mdlDowngrade_ = function () {
	    while (this.element_.firstChild) {
	        this.element_.removeChild(this.element_.firstChild);
	    }
	};
	/**
	   * Public alias for the downgrade method.
	   *
	   * @public
	   */
	MaterialProgress.prototype.mdlDowngrade = MaterialProgress.prototype.mdlDowngrade_;
	MaterialProgress.prototype['mdlDowngrade'] = MaterialProgress.prototype.mdlDowngrade;
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialProgress,
	    classAsString: 'MaterialProgress',
	    cssClass: 'mdl-js-progress',
	    widget: true
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Radio MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialRadio = function MaterialRadio(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialRadio'] = MaterialRadio;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialRadio.prototype.Constant_ = { TINY_TIMEOUT: 0.001 };
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialRadio.prototype.CssClasses_ = {
	    IS_FOCUSED: 'is-focused',
	    IS_DISABLED: 'is-disabled',
	    IS_CHECKED: 'is-checked',
	    IS_UPGRADED: 'is-upgraded',
	    JS_RADIO: 'mdl-js-radio',
	    RADIO_BTN: 'mdl-radio__button',
	    RADIO_OUTER_CIRCLE: 'mdl-radio__outer-circle',
	    RADIO_INNER_CIRCLE: 'mdl-radio__inner-circle',
	    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
	    RIPPLE_CONTAINER: 'mdl-radio__ripple-container',
	    RIPPLE_CENTER: 'mdl-ripple--center',
	    RIPPLE: 'mdl-ripple'
	};
	/**
	   * Handle change of state.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialRadio.prototype.onChange_ = function (event) {
	    // Since other radio buttons don't get change events, we need to look for
	    // them to update their classes.
	    var radios = document.getElementsByClassName(this.CssClasses_.JS_RADIO);
	    for (var i = 0; i < radios.length; i++) {
	        var button = radios[i].querySelector('.' + this.CssClasses_.RADIO_BTN);
	        // Different name == different group, so no point updating those.
	        if (button.getAttribute('name') === this.btnElement_.getAttribute('name')) {
	            radios[i]['MaterialRadio'].updateClasses_();
	        }
	    }
	};
	/**
	   * Handle focus.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialRadio.prototype.onFocus_ = function (event) {
	    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
	};
	/**
	   * Handle lost focus.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialRadio.prototype.onBlur_ = function (event) {
	    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
	};
	/**
	   * Handle mouseup.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialRadio.prototype.onMouseup_ = function (event) {
	    this.blur_();
	};
	/**
	   * Update classes.
	   *
	   * @private
	   */
	MaterialRadio.prototype.updateClasses_ = function () {
	    this.checkDisabled();
	    this.checkToggleState();
	};
	/**
	   * Add blur.
	   *
	   * @private
	   */
	MaterialRadio.prototype.blur_ = function () {
	    // TODO: figure out why there's a focus event being fired after our blur,
	    // so that we can avoid this hack.
	    window.setTimeout(function () {
	        this.btnElement_.blur();
	    }.bind(this), this.Constant_.TINY_TIMEOUT);
	};
	// Public methods.
	/**
	   * Check the components disabled state.
	   *
	   * @public
	   */
	MaterialRadio.prototype.checkDisabled = function () {
	    if (this.btnElement_.disabled) {
	        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
	    }
	};
	MaterialRadio.prototype['checkDisabled'] = MaterialRadio.prototype.checkDisabled;
	/**
	   * Check the components toggled state.
	   *
	   * @public
	   */
	MaterialRadio.prototype.checkToggleState = function () {
	    if (this.btnElement_.checked) {
	        this.element_.classList.add(this.CssClasses_.IS_CHECKED);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
	    }
	};
	MaterialRadio.prototype['checkToggleState'] = MaterialRadio.prototype.checkToggleState;
	/**
	   * Disable radio.
	   *
	   * @public
	   */
	MaterialRadio.prototype.disable = function () {
	    this.btnElement_.disabled = true;
	    this.updateClasses_();
	};
	MaterialRadio.prototype['disable'] = MaterialRadio.prototype.disable;
	/**
	   * Enable radio.
	   *
	   * @public
	   */
	MaterialRadio.prototype.enable = function () {
	    this.btnElement_.disabled = false;
	    this.updateClasses_();
	};
	MaterialRadio.prototype['enable'] = MaterialRadio.prototype.enable;
	/**
	   * Check radio.
	   *
	   * @public
	   */
	MaterialRadio.prototype.check = function () {
	    this.btnElement_.checked = true;
	    this.updateClasses_();
	};
	MaterialRadio.prototype['check'] = MaterialRadio.prototype.check;
	/**
	   * Uncheck radio.
	   *
	   * @public
	   */
	MaterialRadio.prototype.uncheck = function () {
	    this.btnElement_.checked = false;
	    this.updateClasses_();
	};
	MaterialRadio.prototype['uncheck'] = MaterialRadio.prototype.uncheck;
	/**
	   * Initialize element.
	   */
	MaterialRadio.prototype.init = function () {
	    if (this.element_) {
	        this.btnElement_ = this.element_.querySelector('.' + this.CssClasses_.RADIO_BTN);
	        this.boundChangeHandler_ = this.onChange_.bind(this);
	        this.boundFocusHandler_ = this.onChange_.bind(this);
	        this.boundBlurHandler_ = this.onBlur_.bind(this);
	        this.boundMouseUpHandler_ = this.onMouseup_.bind(this);
	        var outerCircle = document.createElement('span');
	        outerCircle.classList.add(this.CssClasses_.RADIO_OUTER_CIRCLE);
	        var innerCircle = document.createElement('span');
	        innerCircle.classList.add(this.CssClasses_.RADIO_INNER_CIRCLE);
	        this.element_.appendChild(outerCircle);
	        this.element_.appendChild(innerCircle);
	        var rippleContainer;
	        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
	            this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
	            rippleContainer = document.createElement('span');
	            rippleContainer.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
	            rippleContainer.classList.add(this.CssClasses_.RIPPLE_EFFECT);
	            rippleContainer.classList.add(this.CssClasses_.RIPPLE_CENTER);
	            rippleContainer.addEventListener('mouseup', this.boundMouseUpHandler_);
	            var ripple = document.createElement('span');
	            ripple.classList.add(this.CssClasses_.RIPPLE);
	            rippleContainer.appendChild(ripple);
	            this.element_.appendChild(rippleContainer);
	        }
	        this.btnElement_.addEventListener('change', this.boundChangeHandler_);
	        this.btnElement_.addEventListener('focus', this.boundFocusHandler_);
	        this.btnElement_.addEventListener('blur', this.boundBlurHandler_);
	        this.element_.addEventListener('mouseup', this.boundMouseUpHandler_);
	        this.updateClasses_();
	        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
	    }
	};
	/**
	   * Downgrade the element.
	   *
	   * @private
	   */
	MaterialRadio.prototype.mdlDowngrade_ = function () {
	    var rippleContainer = this.element_.querySelector('.' + this.CssClasses_.RIPPLE_CONTAINER);
	    this.btnElement_.removeEventListener('change', this.boundChangeHandler_);
	    this.btnElement_.removeEventListener('focus', this.boundFocusHandler_);
	    this.btnElement_.removeEventListener('blur', this.boundBlurHandler_);
	    this.element_.removeEventListener('mouseup', this.boundMouseUpHandler_);
	    if (rippleContainer) {
	        rippleContainer.removeEventListener('mouseup', this.boundMouseUpHandler_);
	        this.element_.removeChild(rippleContainer);
	    }
	};
	/**
	   * Public alias for the downgrade method.
	   *
	   * @public
	   */
	MaterialRadio.prototype.mdlDowngrade = MaterialRadio.prototype.mdlDowngrade_;
	MaterialRadio.prototype['mdlDowngrade'] = MaterialRadio.prototype.mdlDowngrade;
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialRadio,
	    classAsString: 'MaterialRadio',
	    cssClass: 'mdl-js-radio',
	    widget: true
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Slider MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialSlider = function MaterialSlider(element) {
	    this.element_ = element;
	    // Browser feature detection.
	    this.isIE_ = window.navigator.msPointerEnabled;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialSlider'] = MaterialSlider;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialSlider.prototype.Constant_ = {};
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialSlider.prototype.CssClasses_ = {
	    IE_CONTAINER: 'mdl-slider__ie-container',
	    SLIDER_CONTAINER: 'mdl-slider__container',
	    BACKGROUND_FLEX: 'mdl-slider__background-flex',
	    BACKGROUND_LOWER: 'mdl-slider__background-lower',
	    BACKGROUND_UPPER: 'mdl-slider__background-upper',
	    IS_LOWEST_VALUE: 'is-lowest-value',
	    IS_UPGRADED: 'is-upgraded'
	};
	/**
	   * Handle input on element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialSlider.prototype.onInput_ = function (event) {
	    this.updateValueStyles_();
	};
	/**
	   * Handle change on element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialSlider.prototype.onChange_ = function (event) {
	    this.updateValueStyles_();
	};
	/**
	   * Handle mouseup on element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialSlider.prototype.onMouseUp_ = function (event) {
	    event.target.blur();
	};
	/**
	   * Handle mousedown on container element.
	   * This handler is purpose is to not require the use to click
	   * exactly on the 2px slider element, as FireFox seems to be very
	   * strict about this.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   * @suppress {missingProperties}
	   */
	MaterialSlider.prototype.onContainerMouseDown_ = function (event) {
	    // If this click is not on the parent element (but rather some child)
	    // ignore. It may still bubble up.
	    if (event.target !== this.element_.parentElement) {
	        return;
	    }
	    // Discard the original event and create a new event that
	    // is on the slider element.
	    event.preventDefault();
	    var newEvent = new MouseEvent('mousedown', {
	        target: event.target,
	        buttons: event.buttons,
	        clientX: event.clientX,
	        clientY: this.element_.getBoundingClientRect().y
	    });
	    this.element_.dispatchEvent(newEvent);
	};
	/**
	   * Handle updating of values.
	   *
	   * @private
	   */
	MaterialSlider.prototype.updateValueStyles_ = function () {
	    // Calculate and apply percentages to div structure behind slider.
	    var fraction = (this.element_.value - this.element_.min) / (this.element_.max - this.element_.min);
	    if (fraction === 0) {
	        this.element_.classList.add(this.CssClasses_.IS_LOWEST_VALUE);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_LOWEST_VALUE);
	    }
	    if (!this.isIE_) {
	        this.backgroundLower_.style.flex = fraction;
	        this.backgroundLower_.style.webkitFlex = fraction;
	        this.backgroundUpper_.style.flex = 1 - fraction;
	        this.backgroundUpper_.style.webkitFlex = 1 - fraction;
	    }
	};
	// Public methods.
	/**
	   * Disable slider.
	   *
	   * @public
	   */
	MaterialSlider.prototype.disable = function () {
	    this.element_.disabled = true;
	};
	MaterialSlider.prototype['disable'] = MaterialSlider.prototype.disable;
	/**
	   * Enable slider.
	   *
	   * @public
	   */
	MaterialSlider.prototype.enable = function () {
	    this.element_.disabled = false;
	};
	MaterialSlider.prototype['enable'] = MaterialSlider.prototype.enable;
	/**
	   * Update slider value.
	   *
	   * @param {number} value The value to which to set the control (optional).
	   * @public
	   */
	MaterialSlider.prototype.change = function (value) {
	    if (typeof value !== 'undefined') {
	        this.element_.value = value;
	    }
	    this.updateValueStyles_();
	};
	MaterialSlider.prototype['change'] = MaterialSlider.prototype.change;
	/**
	   * Initialize element.
	   */
	MaterialSlider.prototype.init = function () {
	    if (this.element_) {
	        if (this.isIE_) {
	            // Since we need to specify a very large height in IE due to
	            // implementation limitations, we add a parent here that trims it down to
	            // a reasonable size.
	            var containerIE = document.createElement('div');
	            containerIE.classList.add(this.CssClasses_.IE_CONTAINER);
	            this.element_.parentElement.insertBefore(containerIE, this.element_);
	            this.element_.parentElement.removeChild(this.element_);
	            containerIE.appendChild(this.element_);
	        } else {
	            // For non-IE browsers, we need a div structure that sits behind the
	            // slider and allows us to style the left and right sides of it with
	            // different colors.
	            var container = document.createElement('div');
	            container.classList.add(this.CssClasses_.SLIDER_CONTAINER);
	            this.element_.parentElement.insertBefore(container, this.element_);
	            this.element_.parentElement.removeChild(this.element_);
	            container.appendChild(this.element_);
	            var backgroundFlex = document.createElement('div');
	            backgroundFlex.classList.add(this.CssClasses_.BACKGROUND_FLEX);
	            container.appendChild(backgroundFlex);
	            this.backgroundLower_ = document.createElement('div');
	            this.backgroundLower_.classList.add(this.CssClasses_.BACKGROUND_LOWER);
	            backgroundFlex.appendChild(this.backgroundLower_);
	            this.backgroundUpper_ = document.createElement('div');
	            this.backgroundUpper_.classList.add(this.CssClasses_.BACKGROUND_UPPER);
	            backgroundFlex.appendChild(this.backgroundUpper_);
	        }
	        this.boundInputHandler = this.onInput_.bind(this);
	        this.boundChangeHandler = this.onChange_.bind(this);
	        this.boundMouseUpHandler = this.onMouseUp_.bind(this);
	        this.boundContainerMouseDownHandler = this.onContainerMouseDown_.bind(this);
	        this.element_.addEventListener('input', this.boundInputHandler);
	        this.element_.addEventListener('change', this.boundChangeHandler);
	        this.element_.addEventListener('mouseup', this.boundMouseUpHandler);
	        this.element_.parentElement.addEventListener('mousedown', this.boundContainerMouseDownHandler);
	        this.updateValueStyles_();
	        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
	    }
	};
	/**
	   * Downgrade the component
	   *
	   * @private
	   */
	MaterialSlider.prototype.mdlDowngrade_ = function () {
	    this.element_.removeEventListener('input', this.boundInputHandler);
	    this.element_.removeEventListener('change', this.boundChangeHandler);
	    this.element_.removeEventListener('mouseup', this.boundMouseUpHandler);
	    this.element_.parentElement.removeEventListener('mousedown', this.boundContainerMouseDownHandler);
	};
	/**
	   * Public alias for the downgrade method.
	   *
	   * @public
	   */
	MaterialSlider.prototype.mdlDowngrade = MaterialSlider.prototype.mdlDowngrade_;
	MaterialSlider.prototype['mdlDowngrade'] = MaterialSlider.prototype.mdlDowngrade;
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialSlider,
	    classAsString: 'MaterialSlider',
	    cssClass: 'mdl-js-slider',
	    widget: true
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Spinner MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @param {HTMLElement} element The element that will be upgraded.
	   * @constructor
	   */
	var MaterialSpinner = function MaterialSpinner(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialSpinner'] = MaterialSpinner;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialSpinner.prototype.Constant_ = { MDL_SPINNER_LAYER_COUNT: 4 };
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialSpinner.prototype.CssClasses_ = {
	    MDL_SPINNER_LAYER: 'mdl-spinner__layer',
	    MDL_SPINNER_CIRCLE_CLIPPER: 'mdl-spinner__circle-clipper',
	    MDL_SPINNER_CIRCLE: 'mdl-spinner__circle',
	    MDL_SPINNER_GAP_PATCH: 'mdl-spinner__gap-patch',
	    MDL_SPINNER_LEFT: 'mdl-spinner__left',
	    MDL_SPINNER_RIGHT: 'mdl-spinner__right'
	};
	/**
	   * Auxiliary method to create a spinner layer.
	   *
	   * @param {number} index Index of the layer to be created.
	   * @public
	   */
	MaterialSpinner.prototype.createLayer = function (index) {
	    var layer = document.createElement('div');
	    layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER);
	    layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER + '-' + index);
	    var leftClipper = document.createElement('div');
	    leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER);
	    leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_LEFT);
	    var gapPatch = document.createElement('div');
	    gapPatch.classList.add(this.CssClasses_.MDL_SPINNER_GAP_PATCH);
	    var rightClipper = document.createElement('div');
	    rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER);
	    rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_RIGHT);
	    var circleOwners = [
	        leftClipper,
	        gapPatch,
	        rightClipper
	    ];
	    for (var i = 0; i < circleOwners.length; i++) {
	        var circle = document.createElement('div');
	        circle.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE);
	        circleOwners[i].appendChild(circle);
	    }
	    layer.appendChild(leftClipper);
	    layer.appendChild(gapPatch);
	    layer.appendChild(rightClipper);
	    this.element_.appendChild(layer);
	};
	MaterialSpinner.prototype['createLayer'] = MaterialSpinner.prototype.createLayer;
	/**
	   * Stops the spinner animation.
	   * Public method for users who need to stop the spinner for any reason.
	   *
	   * @public
	   */
	MaterialSpinner.prototype.stop = function () {
	    this.element_.classList.remove('is-active');
	};
	MaterialSpinner.prototype['stop'] = MaterialSpinner.prototype.stop;
	/**
	   * Starts the spinner animation.
	   * Public method for users who need to manually start the spinner for any reason
	   * (instead of just adding the 'is-active' class to their markup).
	   *
	   * @public
	   */
	MaterialSpinner.prototype.start = function () {
	    this.element_.classList.add('is-active');
	};
	MaterialSpinner.prototype['start'] = MaterialSpinner.prototype.start;
	/**
	   * Initialize element.
	   */
	MaterialSpinner.prototype.init = function () {
	    if (this.element_) {
	        for (var i = 1; i <= this.Constant_.MDL_SPINNER_LAYER_COUNT; i++) {
	            this.createLayer(i);
	        }
	        this.element_.classList.add('is-upgraded');
	    }
	};
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialSpinner,
	    classAsString: 'MaterialSpinner',
	    cssClass: 'mdl-js-spinner',
	    widget: true
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Checkbox MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialSwitch = function MaterialSwitch(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialSwitch'] = MaterialSwitch;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialSwitch.prototype.Constant_ = { TINY_TIMEOUT: 0.001 };
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialSwitch.prototype.CssClasses_ = {
	    INPUT: 'mdl-switch__input',
	    TRACK: 'mdl-switch__track',
	    THUMB: 'mdl-switch__thumb',
	    FOCUS_HELPER: 'mdl-switch__focus-helper',
	    RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
	    RIPPLE_CONTAINER: 'mdl-switch__ripple-container',
	    RIPPLE_CENTER: 'mdl-ripple--center',
	    RIPPLE: 'mdl-ripple',
	    IS_FOCUSED: 'is-focused',
	    IS_DISABLED: 'is-disabled',
	    IS_CHECKED: 'is-checked'
	};
	/**
	   * Handle change of state.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialSwitch.prototype.onChange_ = function (event) {
	    this.updateClasses_();
	};
	/**
	   * Handle focus of element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialSwitch.prototype.onFocus_ = function (event) {
	    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
	};
	/**
	   * Handle lost focus of element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialSwitch.prototype.onBlur_ = function (event) {
	    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
	};
	/**
	   * Handle mouseup.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialSwitch.prototype.onMouseUp_ = function (event) {
	    this.blur_();
	};
	/**
	   * Handle class updates.
	   *
	   * @private
	   */
	MaterialSwitch.prototype.updateClasses_ = function () {
	    this.checkDisabled();
	    this.checkToggleState();
	};
	/**
	   * Add blur.
	   *
	   * @private
	   */
	MaterialSwitch.prototype.blur_ = function () {
	    // TODO: figure out why there's a focus event being fired after our blur,
	    // so that we can avoid this hack.
	    window.setTimeout(function () {
	        this.inputElement_.blur();
	    }.bind(this), this.Constant_.TINY_TIMEOUT);
	};
	// Public methods.
	/**
	   * Check the components disabled state.
	   *
	   * @public
	   */
	MaterialSwitch.prototype.checkDisabled = function () {
	    if (this.inputElement_.disabled) {
	        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
	    }
	};
	MaterialSwitch.prototype['checkDisabled'] = MaterialSwitch.prototype.checkDisabled;
	/**
	   * Check the components toggled state.
	   *
	   * @public
	   */
	MaterialSwitch.prototype.checkToggleState = function () {
	    if (this.inputElement_.checked) {
	        this.element_.classList.add(this.CssClasses_.IS_CHECKED);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
	    }
	};
	MaterialSwitch.prototype['checkToggleState'] = MaterialSwitch.prototype.checkToggleState;
	/**
	   * Disable switch.
	   *
	   * @public
	   */
	MaterialSwitch.prototype.disable = function () {
	    this.inputElement_.disabled = true;
	    this.updateClasses_();
	};
	MaterialSwitch.prototype['disable'] = MaterialSwitch.prototype.disable;
	/**
	   * Enable switch.
	   *
	   * @public
	   */
	MaterialSwitch.prototype.enable = function () {
	    this.inputElement_.disabled = false;
	    this.updateClasses_();
	};
	MaterialSwitch.prototype['enable'] = MaterialSwitch.prototype.enable;
	/**
	   * Activate switch.
	   *
	   * @public
	   */
	MaterialSwitch.prototype.on = function () {
	    this.inputElement_.checked = true;
	    this.updateClasses_();
	};
	MaterialSwitch.prototype['on'] = MaterialSwitch.prototype.on;
	/**
	   * Deactivate switch.
	   *
	   * @public
	   */
	MaterialSwitch.prototype.off = function () {
	    this.inputElement_.checked = false;
	    this.updateClasses_();
	};
	MaterialSwitch.prototype['off'] = MaterialSwitch.prototype.off;
	/**
	   * Initialize element.
	   */
	MaterialSwitch.prototype.init = function () {
	    if (this.element_) {
	        this.inputElement_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);
	        var track = document.createElement('div');
	        track.classList.add(this.CssClasses_.TRACK);
	        var thumb = document.createElement('div');
	        thumb.classList.add(this.CssClasses_.THUMB);
	        var focusHelper = document.createElement('span');
	        focusHelper.classList.add(this.CssClasses_.FOCUS_HELPER);
	        thumb.appendChild(focusHelper);
	        this.element_.appendChild(track);
	        this.element_.appendChild(thumb);
	        this.boundMouseUpHandler = this.onMouseUp_.bind(this);
	        if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
	            this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
	            this.rippleContainerElement_ = document.createElement('span');
	            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
	            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_EFFECT);
	            this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER);
	            this.rippleContainerElement_.addEventListener('mouseup', this.boundMouseUpHandler);
	            var ripple = document.createElement('span');
	            ripple.classList.add(this.CssClasses_.RIPPLE);
	            this.rippleContainerElement_.appendChild(ripple);
	            this.element_.appendChild(this.rippleContainerElement_);
	        }
	        this.boundChangeHandler = this.onChange_.bind(this);
	        this.boundFocusHandler = this.onFocus_.bind(this);
	        this.boundBlurHandler = this.onBlur_.bind(this);
	        this.inputElement_.addEventListener('change', this.boundChangeHandler);
	        this.inputElement_.addEventListener('focus', this.boundFocusHandler);
	        this.inputElement_.addEventListener('blur', this.boundBlurHandler);
	        this.element_.addEventListener('mouseup', this.boundMouseUpHandler);
	        this.updateClasses_();
	        this.element_.classList.add('is-upgraded');
	    }
	};
	/**
	   * Downgrade the component.
	   *
	   * @private
	   */
	MaterialSwitch.prototype.mdlDowngrade_ = function () {
	    if (this.rippleContainerElement_) {
	        this.rippleContainerElement_.removeEventListener('mouseup', this.boundMouseUpHandler);
	    }
	    this.inputElement_.removeEventListener('change', this.boundChangeHandler);
	    this.inputElement_.removeEventListener('focus', this.boundFocusHandler);
	    this.inputElement_.removeEventListener('blur', this.boundBlurHandler);
	    this.element_.removeEventListener('mouseup', this.boundMouseUpHandler);
	};
	/**
	   * Public alias for the downgrade method.
	   *
	   * @public
	   */
	MaterialSwitch.prototype.mdlDowngrade = MaterialSwitch.prototype.mdlDowngrade_;
	MaterialSwitch.prototype['mdlDowngrade'] = MaterialSwitch.prototype.mdlDowngrade;
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialSwitch,
	    classAsString: 'MaterialSwitch',
	    cssClass: 'mdl-js-switch',
	    widget: true
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Tabs MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialTabs = function MaterialTabs(element) {
	    // Stores the HTML element.
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialTabs'] = MaterialTabs;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialTabs.prototype.Constant_ = {};
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialTabs.prototype.CssClasses_ = {
	    TAB_CLASS: 'mdl-tabs__tab',
	    PANEL_CLASS: 'mdl-tabs__panel',
	    ACTIVE_CLASS: 'is-active',
	    UPGRADED_CLASS: 'is-upgraded',
	    MDL_JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	    MDL_RIPPLE_CONTAINER: 'mdl-tabs__ripple-container',
	    MDL_RIPPLE: 'mdl-ripple',
	    MDL_JS_RIPPLE_EFFECT_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events'
	};
	/**
	   * Handle clicks to a tabs component
	   *
	   * @private
	   */
	MaterialTabs.prototype.initTabs_ = function () {
	    if (this.element_.classList.contains(this.CssClasses_.MDL_JS_RIPPLE_EFFECT)) {
	        this.element_.classList.add(this.CssClasses_.MDL_JS_RIPPLE_EFFECT_IGNORE_EVENTS);
	    }
	    // Select element tabs, document panels
	    this.tabs_ = this.element_.querySelectorAll('.' + this.CssClasses_.TAB_CLASS);
	    this.panels_ = this.element_.querySelectorAll('.' + this.CssClasses_.PANEL_CLASS);
	    // Create new tabs for each tab element
	    for (var i = 0; i < this.tabs_.length; i++) {
	        new MaterialTab(this.tabs_[i], this);
	    }
	    this.element_.classList.add(this.CssClasses_.UPGRADED_CLASS);
	};
	/**
	   * Reset tab state, dropping active classes
	   *
	   * @private
	   */
	MaterialTabs.prototype.resetTabState_ = function () {
	    for (var k = 0; k < this.tabs_.length; k++) {
	        this.tabs_[k].classList.remove(this.CssClasses_.ACTIVE_CLASS);
	    }
	};
	/**
	   * Reset panel state, droping active classes
	   *
	   * @private
	   */
	MaterialTabs.prototype.resetPanelState_ = function () {
	    for (var j = 0; j < this.panels_.length; j++) {
	        this.panels_[j].classList.remove(this.CssClasses_.ACTIVE_CLASS);
	    }
	};
	/**
	   * Initialize element.
	   */
	MaterialTabs.prototype.init = function () {
	    if (this.element_) {
	        this.initTabs_();
	    }
	};
	/**
	   * Constructor for an individual tab.
	   *
	   * @constructor
	   * @param {HTMLElement} tab The HTML element for the tab.
	   * @param {MaterialTabs} ctx The MaterialTabs object that owns the tab.
	   */
	function MaterialTab(tab, ctx) {
	    if (tab) {
	        if (ctx.element_.classList.contains(ctx.CssClasses_.MDL_JS_RIPPLE_EFFECT)) {
	            var rippleContainer = document.createElement('span');
	            rippleContainer.classList.add(ctx.CssClasses_.MDL_RIPPLE_CONTAINER);
	            rippleContainer.classList.add(ctx.CssClasses_.MDL_JS_RIPPLE_EFFECT);
	            var ripple = document.createElement('span');
	            ripple.classList.add(ctx.CssClasses_.MDL_RIPPLE);
	            rippleContainer.appendChild(ripple);
	            tab.appendChild(rippleContainer);
	        }
	        tab.addEventListener('click', function (e) {
	            e.preventDefault();
	            var href = tab.href.split('#')[1];
	            var panel = ctx.element_.querySelector('#' + href);
	            ctx.resetTabState_();
	            ctx.resetPanelState_();
	            tab.classList.add(ctx.CssClasses_.ACTIVE_CLASS);
	            panel.classList.add(ctx.CssClasses_.ACTIVE_CLASS);
	        });
	    }
	}
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialTabs,
	    classAsString: 'MaterialTabs',
	    cssClass: 'mdl-js-tabs'
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Textfield MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialTextfield = function MaterialTextfield(element) {
	    this.element_ = element;
	    this.maxRows = this.Constant_.NO_MAX_ROWS;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialTextfield'] = MaterialTextfield;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialTextfield.prototype.Constant_ = {
	    NO_MAX_ROWS: -1,
	    MAX_ROWS_ATTRIBUTE: 'maxrows'
	};
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialTextfield.prototype.CssClasses_ = {
	    LABEL: 'mdl-textfield__label',
	    INPUT: 'mdl-textfield__input',
	    IS_DIRTY: 'is-dirty',
	    IS_FOCUSED: 'is-focused',
	    IS_DISABLED: 'is-disabled',
	    IS_INVALID: 'is-invalid',
	    IS_UPGRADED: 'is-upgraded'
	};
	/**
	   * Handle input being entered.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialTextfield.prototype.onKeyDown_ = function (event) {
	    var currentRowCount = event.target.value.split('\n').length;
	    if (event.keyCode === 13) {
	        if (currentRowCount >= this.maxRows) {
	            event.preventDefault();
	        }
	    }
	};
	/**
	   * Handle focus.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialTextfield.prototype.onFocus_ = function (event) {
	    this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
	};
	/**
	   * Handle lost focus.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialTextfield.prototype.onBlur_ = function (event) {
	    this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
	};
	/**
	   * Handle class updates.
	   *
	   * @private
	   */
	MaterialTextfield.prototype.updateClasses_ = function () {
	    this.checkDisabled();
	    this.checkValidity();
	    this.checkDirty();
	};
	// Public methods.
	/**
	   * Check the disabled state and update field accordingly.
	   *
	   * @public
	   */
	MaterialTextfield.prototype.checkDisabled = function () {
	    if (this.input_.disabled) {
	        this.element_.classList.add(this.CssClasses_.IS_DISABLED);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
	    }
	};
	MaterialTextfield.prototype['checkDisabled'] = MaterialTextfield.prototype.checkDisabled;
	/**
	   * Check the validity state and update field accordingly.
	   *
	   * @public
	   */
	MaterialTextfield.prototype.checkValidity = function () {
	    if (this.input_.validity) {
	        if (this.input_.validity.valid) {
	            this.element_.classList.remove(this.CssClasses_.IS_INVALID);
	        } else {
	            this.element_.classList.add(this.CssClasses_.IS_INVALID);
	        }
	    }
	};
	MaterialTextfield.prototype['checkValidity'] = MaterialTextfield.prototype.checkValidity;
	/**
	   * Check the dirty state and update field accordingly.
	   *
	   * @public
	   */
	MaterialTextfield.prototype.checkDirty = function () {
	    if (this.input_.value && this.input_.value.length > 0) {
	        this.element_.classList.add(this.CssClasses_.IS_DIRTY);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_DIRTY);
	    }
	};
	MaterialTextfield.prototype['checkDirty'] = MaterialTextfield.prototype.checkDirty;
	/**
	   * Disable text field.
	   *
	   * @public
	   */
	MaterialTextfield.prototype.disable = function () {
	    this.input_.disabled = true;
	    this.updateClasses_();
	};
	MaterialTextfield.prototype['disable'] = MaterialTextfield.prototype.disable;
	/**
	   * Enable text field.
	   *
	   * @public
	   */
	MaterialTextfield.prototype.enable = function () {
	    this.input_.disabled = false;
	    this.updateClasses_();
	};
	MaterialTextfield.prototype['enable'] = MaterialTextfield.prototype.enable;
	/**
	   * Update text field value.
	   *
	   * @param {string} value The value to which to set the control (optional).
	   * @public
	   */
	MaterialTextfield.prototype.change = function (value) {
	    this.input_.value = value || '';
	    this.updateClasses_();
	};
	MaterialTextfield.prototype['change'] = MaterialTextfield.prototype.change;
	/**
	   * Initialize element.
	   */
	MaterialTextfield.prototype.init = function () {
	    if (this.element_) {
	        this.label_ = this.element_.querySelector('.' + this.CssClasses_.LABEL);
	        this.input_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);
	        if (this.input_) {
	            if (this.input_.hasAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE)) {
	                this.maxRows = parseInt(this.input_.getAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE), 10);
	                if (isNaN(this.maxRows)) {
	                    this.maxRows = this.Constant_.NO_MAX_ROWS;
	                }
	            }
	            this.boundUpdateClassesHandler = this.updateClasses_.bind(this);
	            this.boundFocusHandler = this.onFocus_.bind(this);
	            this.boundBlurHandler = this.onBlur_.bind(this);
	            this.input_.addEventListener('input', this.boundUpdateClassesHandler);
	            this.input_.addEventListener('focus', this.boundFocusHandler);
	            this.input_.addEventListener('blur', this.boundBlurHandler);
	            if (this.maxRows !== this.Constant_.NO_MAX_ROWS) {
	                // TODO: This should handle pasting multi line text.
	                // Currently doesn't.
	                this.boundKeyDownHandler = this.onKeyDown_.bind(this);
	                this.input_.addEventListener('keydown', this.boundKeyDownHandler);
	            }
	            var invalid = this.element_.classList.contains(this.CssClasses_.IS_INVALID);
	            this.updateClasses_();
	            this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
	            if (invalid) {
	                this.element_.classList.add(this.CssClasses_.IS_INVALID);
	            }
	        }
	    }
	};
	/**
	   * Downgrade the component
	   *
	   * @private
	   */
	MaterialTextfield.prototype.mdlDowngrade_ = function () {
	    this.input_.removeEventListener('input', this.boundUpdateClassesHandler);
	    this.input_.removeEventListener('focus', this.boundFocusHandler);
	    this.input_.removeEventListener('blur', this.boundBlurHandler);
	    if (this.boundKeyDownHandler) {
	        this.input_.removeEventListener('keydown', this.boundKeyDownHandler);
	    }
	};
	/**
	   * Public alias for the downgrade method.
	   *
	   * @public
	   */
	MaterialTextfield.prototype.mdlDowngrade = MaterialTextfield.prototype.mdlDowngrade_;
	MaterialTextfield.prototype['mdlDowngrade'] = MaterialTextfield.prototype.mdlDowngrade;
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialTextfield,
	    classAsString: 'MaterialTextfield',
	    cssClass: 'mdl-js-textfield',
	    widget: true
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Tooltip MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialTooltip = function MaterialTooltip(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialTooltip'] = MaterialTooltip;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialTooltip.prototype.Constant_ = {};
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialTooltip.prototype.CssClasses_ = { IS_ACTIVE: 'is-active' };
	/**
	   * Handle mouseenter for tooltip.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialTooltip.prototype.handleMouseEnter_ = function (event) {
	    event.stopPropagation();
	    var props = event.target.getBoundingClientRect();
	    var left = props.left + props.width / 2;
	    var marginLeft = -1 * (this.element_.offsetWidth / 2);
	    if (left + marginLeft < 0) {
	        this.element_.style.left = 0;
	        this.element_.style.marginLeft = 0;
	    } else {
	        this.element_.style.left = left + 'px';
	        this.element_.style.marginLeft = marginLeft + 'px';
	    }
	    this.element_.style.top = props.top + props.height + 10 + 'px';
	    this.element_.classList.add(this.CssClasses_.IS_ACTIVE);
	    window.addEventListener('scroll', this.boundMouseLeaveHandler, false);
	    window.addEventListener('touchmove', this.boundMouseLeaveHandler, false);
	};
	/**
	   * Handle mouseleave for tooltip.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialTooltip.prototype.handleMouseLeave_ = function (event) {
	    event.stopPropagation();
	    this.element_.classList.remove(this.CssClasses_.IS_ACTIVE);
	    window.removeEventListener('scroll', this.boundMouseLeaveHandler);
	    window.removeEventListener('touchmove', this.boundMouseLeaveHandler, false);
	};
	/**
	   * Initialize element.
	   */
	MaterialTooltip.prototype.init = function () {
	    if (this.element_) {
	        var forElId = this.element_.getAttribute('for');
	        if (forElId) {
	            this.forElement_ = document.getElementById(forElId);
	        }
	        if (this.forElement_) {
	            // Tabindex needs to be set for `blur` events to be emitted
	            if (!this.forElement_.hasAttribute('tabindex')) {
	                this.forElement_.setAttribute('tabindex', '0');
	            }
	            this.boundMouseEnterHandler = this.handleMouseEnter_.bind(this);
	            this.boundMouseLeaveHandler = this.handleMouseLeave_.bind(this);
	            this.forElement_.addEventListener('mouseenter', this.boundMouseEnterHandler, false);
	            this.forElement_.addEventListener('click', this.boundMouseEnterHandler, false);
	            this.forElement_.addEventListener('blur', this.boundMouseLeaveHandler);
	            this.forElement_.addEventListener('touchstart', this.boundMouseEnterHandler, false);
	            this.forElement_.addEventListener('mouseleave', this.boundMouseLeaveHandler);
	        }
	    }
	};
	/**
	   * Downgrade the component
	   *
	   * @private
	   */
	MaterialTooltip.prototype.mdlDowngrade_ = function () {
	    if (this.forElement_) {
	        this.forElement_.removeEventListener('mouseenter', this.boundMouseEnterHandler, false);
	        this.forElement_.removeEventListener('click', this.boundMouseEnterHandler, false);
	        this.forElement_.removeEventListener('touchstart', this.boundMouseEnterHandler, false);
	        this.forElement_.removeEventListener('mouseleave', this.boundMouseLeaveHandler);
	    }
	};
	/**
	   * Public alias for the downgrade method.
	   *
	   * @public
	   */
	MaterialTooltip.prototype.mdlDowngrade = MaterialTooltip.prototype.mdlDowngrade_;
	MaterialTooltip.prototype['mdlDowngrade'] = MaterialTooltip.prototype.mdlDowngrade;
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialTooltip,
	    classAsString: 'MaterialTooltip',
	    cssClass: 'mdl-tooltip'
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Layout MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialLayout = function MaterialLayout(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialLayout'] = MaterialLayout;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialLayout.prototype.Constant_ = {
	    MAX_WIDTH: '(max-width: 1024px)',
	    TAB_SCROLL_PIXELS: 100,
	    MENU_ICON: 'menu',
	    CHEVRON_LEFT: 'chevron_left',
	    CHEVRON_RIGHT: 'chevron_right'
	};
	/**
	   * Modes.
	   *
	   * @enum {number}
	   * @private
	   */
	MaterialLayout.prototype.Mode_ = {
	    STANDARD: 0,
	    SEAMED: 1,
	    WATERFALL: 2,
	    SCROLL: 3
	};
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialLayout.prototype.CssClasses_ = {
	    CONTAINER: 'mdl-layout__container',
	    HEADER: 'mdl-layout__header',
	    DRAWER: 'mdl-layout__drawer',
	    CONTENT: 'mdl-layout__content',
	    DRAWER_BTN: 'mdl-layout__drawer-button',
	    ICON: 'material-icons',
	    JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	    RIPPLE_CONTAINER: 'mdl-layout__tab-ripple-container',
	    RIPPLE: 'mdl-ripple',
	    RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
	    HEADER_SEAMED: 'mdl-layout__header--seamed',
	    HEADER_WATERFALL: 'mdl-layout__header--waterfall',
	    HEADER_SCROLL: 'mdl-layout__header--scroll',
	    FIXED_HEADER: 'mdl-layout--fixed-header',
	    OBFUSCATOR: 'mdl-layout__obfuscator',
	    TAB_BAR: 'mdl-layout__tab-bar',
	    TAB_CONTAINER: 'mdl-layout__tab-bar-container',
	    TAB: 'mdl-layout__tab',
	    TAB_BAR_BUTTON: 'mdl-layout__tab-bar-button',
	    TAB_BAR_LEFT_BUTTON: 'mdl-layout__tab-bar-left-button',
	    TAB_BAR_RIGHT_BUTTON: 'mdl-layout__tab-bar-right-button',
	    PANEL: 'mdl-layout__tab-panel',
	    HAS_DRAWER: 'has-drawer',
	    HAS_TABS: 'has-tabs',
	    HAS_SCROLLING_HEADER: 'has-scrolling-header',
	    CASTING_SHADOW: 'is-casting-shadow',
	    IS_COMPACT: 'is-compact',
	    IS_SMALL_SCREEN: 'is-small-screen',
	    IS_DRAWER_OPEN: 'is-visible',
	    IS_ACTIVE: 'is-active',
	    IS_UPGRADED: 'is-upgraded',
	    IS_ANIMATING: 'is-animating',
	    ON_LARGE_SCREEN: 'mdl-layout--large-screen-only',
	    ON_SMALL_SCREEN: 'mdl-layout--small-screen-only'
	};
	/**
	   * Handles scrolling on the content.
	   *
	   * @private
	   */
	MaterialLayout.prototype.contentScrollHandler_ = function () {
	    if (this.header_.classList.contains(this.CssClasses_.IS_ANIMATING)) {
	        return;
	    }
	    if (this.content_.scrollTop > 0 && !this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
	        this.header_.classList.add(this.CssClasses_.CASTING_SHADOW);
	        this.header_.classList.add(this.CssClasses_.IS_COMPACT);
	        this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
	    } else if (this.content_.scrollTop <= 0 && this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
	        this.header_.classList.remove(this.CssClasses_.CASTING_SHADOW);
	        this.header_.classList.remove(this.CssClasses_.IS_COMPACT);
	        this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
	    }
	};
	/**
	   * Handles changes in screen size.
	   *
	   * @private
	   */
	MaterialLayout.prototype.screenSizeHandler_ = function () {
	    if (this.screenSizeMediaQuery_.matches) {
	        this.element_.classList.add(this.CssClasses_.IS_SMALL_SCREEN);
	    } else {
	        this.element_.classList.remove(this.CssClasses_.IS_SMALL_SCREEN);
	        // Collapse drawer (if any) when moving to a large screen size.
	        if (this.drawer_) {
	            this.drawer_.classList.remove(this.CssClasses_.IS_DRAWER_OPEN);
	            this.obfuscator_.classList.remove(this.CssClasses_.IS_DRAWER_OPEN);
	        }
	    }
	};
	/**
	   * Handles toggling of the drawer.
	   *
	   * @private
	   */
	MaterialLayout.prototype.drawerToggleHandler_ = function () {
	    this.drawer_.classList.toggle(this.CssClasses_.IS_DRAWER_OPEN);
	    this.obfuscator_.classList.toggle(this.CssClasses_.IS_DRAWER_OPEN);
	};
	/**
	   * Handles (un)setting the `is-animating` class
	   *
	   * @private
	   */
	MaterialLayout.prototype.headerTransitionEndHandler_ = function () {
	    this.header_.classList.remove(this.CssClasses_.IS_ANIMATING);
	};
	/**
	   * Handles expanding the header on click
	   *
	   * @private
	   */
	MaterialLayout.prototype.headerClickHandler_ = function () {
	    if (this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
	        this.header_.classList.remove(this.CssClasses_.IS_COMPACT);
	        this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
	    }
	};
	/**
	   * Reset tab state, dropping active classes
	   *
	   * @private
	   */
	MaterialLayout.prototype.resetTabState_ = function (tabBar) {
	    for (var k = 0; k < tabBar.length; k++) {
	        tabBar[k].classList.remove(this.CssClasses_.IS_ACTIVE);
	    }
	};
	/**
	   * Reset panel state, droping active classes
	   *
	   * @private
	   */
	MaterialLayout.prototype.resetPanelState_ = function (panels) {
	    for (var j = 0; j < panels.length; j++) {
	        panels[j].classList.remove(this.CssClasses_.IS_ACTIVE);
	    }
	};
	/**
	   * Initialize element.
	   */
	MaterialLayout.prototype.init = function () {
	    if (this.element_) {
	        var container = document.createElement('div');
	        container.classList.add(this.CssClasses_.CONTAINER);
	        this.element_.parentElement.insertBefore(container, this.element_);
	        this.element_.parentElement.removeChild(this.element_);
	        container.appendChild(this.element_);
	        var directChildren = this.element_.childNodes;
	        var numChildren = directChildren.length;
	        for (var c = 0; c < numChildren; c++) {
	            var child = directChildren[c];
	            if (child.classList && child.classList.contains(this.CssClasses_.HEADER)) {
	                this.header_ = child;
	            }
	            if (child.classList && child.classList.contains(this.CssClasses_.DRAWER)) {
	                this.drawer_ = child;
	            }
	            if (child.classList && child.classList.contains(this.CssClasses_.CONTENT)) {
	                this.content_ = child;
	            }
	        }
	        if (this.header_) {
	            this.tabBar_ = this.header_.querySelector('.' + this.CssClasses_.TAB_BAR);
	        }
	        var mode = this.Mode_.STANDARD;
	        if (this.header_) {
	            if (this.header_.classList.contains(this.CssClasses_.HEADER_SEAMED)) {
	                mode = this.Mode_.SEAMED;
	            } else if (this.header_.classList.contains(this.CssClasses_.HEADER_WATERFALL)) {
	                mode = this.Mode_.WATERFALL;
	                this.header_.addEventListener('transitionend', this.headerTransitionEndHandler_.bind(this));
	                this.header_.addEventListener('click', this.headerClickHandler_.bind(this));
	            } else if (this.header_.classList.contains(this.CssClasses_.HEADER_SCROLL)) {
	                mode = this.Mode_.SCROLL;
	                container.classList.add(this.CssClasses_.HAS_SCROLLING_HEADER);
	            }
	            if (mode === this.Mode_.STANDARD) {
	                this.header_.classList.add(this.CssClasses_.CASTING_SHADOW);
	                if (this.tabBar_) {
	                    this.tabBar_.classList.add(this.CssClasses_.CASTING_SHADOW);
	                }
	            } else if (mode === this.Mode_.SEAMED || mode === this.Mode_.SCROLL) {
	                this.header_.classList.remove(this.CssClasses_.CASTING_SHADOW);
	                if (this.tabBar_) {
	                    this.tabBar_.classList.remove(this.CssClasses_.CASTING_SHADOW);
	                }
	            } else if (mode === this.Mode_.WATERFALL) {
	                // Add and remove shadows depending on scroll position.
	                // Also add/remove auxiliary class for styling of the compact version of
	                // the header.
	                this.content_.addEventListener('scroll', this.contentScrollHandler_.bind(this));
	                this.contentScrollHandler_();
	            }
	        }
	        // Add drawer toggling button to our layout, if we have an openable drawer.
	        if (this.drawer_) {
	            var drawerButton = this.element_.querySelector('.' + this.CssClasses_.DRAWER_BTN);
	            if (!drawerButton) {
	                drawerButton = document.createElement('div');
	                drawerButton.classList.add(this.CssClasses_.DRAWER_BTN);
	                var drawerButtonIcon = document.createElement('i');
	                drawerButtonIcon.classList.add(this.CssClasses_.ICON);
	                drawerButtonIcon.textContent = this.Constant_.MENU_ICON;
	                drawerButton.appendChild(drawerButtonIcon);
	            }
	            if (this.drawer_.classList.contains(this.CssClasses_.ON_LARGE_SCREEN)) {
	                //If drawer has ON_LARGE_SCREEN class then add it to the drawer toggle button as well.
	                drawerButton.classList.add(this.CssClasses_.ON_LARGE_SCREEN);
	            } else if (this.drawer_.classList.contains(this.CssClasses_.ON_SMALL_SCREEN)) {
	                //If drawer has ON_SMALL_SCREEN class then add it to the drawer toggle button as well.
	                drawerButton.classList.add(this.CssClasses_.ON_SMALL_SCREEN);
	            }
	            drawerButton.addEventListener('click', this.drawerToggleHandler_.bind(this));
	            // Add a class if the layout has a drawer, for altering the left padding.
	            // Adds the HAS_DRAWER to the elements since this.header_ may or may
	            // not be present.
	            this.element_.classList.add(this.CssClasses_.HAS_DRAWER);
	            // If we have a fixed header, add the button to the header rather than
	            // the layout.
	            if (this.element_.classList.contains(this.CssClasses_.FIXED_HEADER)) {
	                this.header_.insertBefore(drawerButton, this.header_.firstChild);
	            } else {
	                this.element_.insertBefore(drawerButton, this.content_);
	            }
	            var obfuscator = document.createElement('div');
	            obfuscator.classList.add(this.CssClasses_.OBFUSCATOR);
	            this.element_.appendChild(obfuscator);
	            obfuscator.addEventListener('click', this.drawerToggleHandler_.bind(this));
	            this.obfuscator_ = obfuscator;
	        }
	        // Keep an eye on screen size, and add/remove auxiliary class for styling
	        // of small screens.
	        this.screenSizeMediaQuery_ = window.matchMedia(this.Constant_.MAX_WIDTH);
	        this.screenSizeMediaQuery_.addListener(this.screenSizeHandler_.bind(this));
	        this.screenSizeHandler_();
	        // Initialize tabs, if any.
	        if (this.header_ && this.tabBar_) {
	            this.element_.classList.add(this.CssClasses_.HAS_TABS);
	            var tabContainer = document.createElement('div');
	            tabContainer.classList.add(this.CssClasses_.TAB_CONTAINER);
	            this.header_.insertBefore(tabContainer, this.tabBar_);
	            this.header_.removeChild(this.tabBar_);
	            var leftButton = document.createElement('div');
	            leftButton.classList.add(this.CssClasses_.TAB_BAR_BUTTON);
	            leftButton.classList.add(this.CssClasses_.TAB_BAR_LEFT_BUTTON);
	            var leftButtonIcon = document.createElement('i');
	            leftButtonIcon.classList.add(this.CssClasses_.ICON);
	            leftButtonIcon.textContent = this.Constant_.CHEVRON_LEFT;
	            leftButton.appendChild(leftButtonIcon);
	            leftButton.addEventListener('click', function () {
	                this.tabBar_.scrollLeft -= this.Constant_.TAB_SCROLL_PIXELS;
	            }.bind(this));
	            var rightButton = document.createElement('div');
	            rightButton.classList.add(this.CssClasses_.TAB_BAR_BUTTON);
	            rightButton.classList.add(this.CssClasses_.TAB_BAR_RIGHT_BUTTON);
	            var rightButtonIcon = document.createElement('i');
	            rightButtonIcon.classList.add(this.CssClasses_.ICON);
	            rightButtonIcon.textContent = this.Constant_.CHEVRON_RIGHT;
	            rightButton.appendChild(rightButtonIcon);
	            rightButton.addEventListener('click', function () {
	                this.tabBar_.scrollLeft += this.Constant_.TAB_SCROLL_PIXELS;
	            }.bind(this));
	            tabContainer.appendChild(leftButton);
	            tabContainer.appendChild(this.tabBar_);
	            tabContainer.appendChild(rightButton);
	            // Add and remove buttons depending on scroll position.
	            var tabScrollHandler = function () {
	                if (this.tabBar_.scrollLeft > 0) {
	                    leftButton.classList.add(this.CssClasses_.IS_ACTIVE);
	                } else {
	                    leftButton.classList.remove(this.CssClasses_.IS_ACTIVE);
	                }
	                if (this.tabBar_.scrollLeft < this.tabBar_.scrollWidth - this.tabBar_.offsetWidth) {
	                    rightButton.classList.add(this.CssClasses_.IS_ACTIVE);
	                } else {
	                    rightButton.classList.remove(this.CssClasses_.IS_ACTIVE);
	                }
	            }.bind(this);
	            this.tabBar_.addEventListener('scroll', tabScrollHandler);
	            tabScrollHandler();
	            if (this.tabBar_.classList.contains(this.CssClasses_.JS_RIPPLE_EFFECT)) {
	                this.tabBar_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
	            }
	            // Select element tabs, document panels
	            var tabs = this.tabBar_.querySelectorAll('.' + this.CssClasses_.TAB);
	            var panels = this.content_.querySelectorAll('.' + this.CssClasses_.PANEL);
	            // Create new tabs for each tab element
	            for (var i = 0; i < tabs.length; i++) {
	                new MaterialLayoutTab(tabs[i], tabs, panels, this);
	            }
	        }
	        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
	    }
	};
	/**
	   * Constructor for an individual tab.
	   *
	   * @constructor
	   * @param {HTMLElement} tab The HTML element for the tab.
	   * @param {!Array<HTMLElement>} tabs Array with HTML elements for all tabs.
	   * @param {!Array<HTMLElement>} panels Array with HTML elements for all panels.
	   * @param {MaterialLayout} layout The MaterialLayout object that owns the tab.
	   */
	function MaterialLayoutTab(tab, tabs, panels, layout) {
	    if (layout.tabBar_.classList.contains(layout.CssClasses_.JS_RIPPLE_EFFECT)) {
	        var rippleContainer = document.createElement('span');
	        rippleContainer.classList.add(layout.CssClasses_.RIPPLE_CONTAINER);
	        rippleContainer.classList.add(layout.CssClasses_.JS_RIPPLE_EFFECT);
	        var ripple = document.createElement('span');
	        ripple.classList.add(layout.CssClasses_.RIPPLE);
	        rippleContainer.appendChild(ripple);
	        tab.appendChild(rippleContainer);
	    }
	    tab.addEventListener('click', function (e) {
	        e.preventDefault();
	        var href = tab.href.split('#')[1];
	        var panel = layout.content_.querySelector('#' + href);
	        layout.resetTabState_(tabs);
	        layout.resetPanelState_(panels);
	        tab.classList.add(layout.CssClasses_.IS_ACTIVE);
	        panel.classList.add(layout.CssClasses_.IS_ACTIVE);
	    });
	}
	window['MaterialLayoutTab'] = MaterialLayoutTab;
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialLayout,
	    classAsString: 'MaterialLayout',
	    cssClass: 'mdl-js-layout'
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Data Table Card MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialDataTable = function MaterialDataTable(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialDataTable'] = MaterialDataTable;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialDataTable.prototype.Constant_ = {};
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialDataTable.prototype.CssClasses_ = {
	    DATA_TABLE: 'mdl-data-table',
	    SELECTABLE: 'mdl-data-table--selectable',
	    SELECT_ELEMENT: 'mdl-data-table__select',
	    IS_SELECTED: 'is-selected',
	    IS_UPGRADED: 'is-upgraded'
	};
	/**
	   * Generates and returns a function that toggles the selection state of a
	   * single row (or multiple rows).
	   *
	   * @param {Element} checkbox Checkbox that toggles the selection state.
	   * @param {HTMLElement} row Row to toggle when checkbox changes.
	   * @param {(Array<Object>|NodeList)=} opt_rows Rows to toggle when checkbox changes.
	   * @private
	   */
	MaterialDataTable.prototype.selectRow_ = function (checkbox, row, opt_rows) {
	    if (row) {
	        return function () {
	            if (checkbox.checked) {
	                row.classList.add(this.CssClasses_.IS_SELECTED);
	            } else {
	                row.classList.remove(this.CssClasses_.IS_SELECTED);
	            }
	        }.bind(this);
	    }
	    if (opt_rows) {
	        return function () {
	            var i;
	            var el;
	            if (checkbox.checked) {
	                for (i = 0; i < opt_rows.length; i++) {
	                    el = opt_rows[i].querySelector('td').querySelector('.mdl-checkbox');
	                    el['MaterialCheckbox'].check();
	                    opt_rows[i].classList.add(this.CssClasses_.IS_SELECTED);
	                }
	            } else {
	                for (i = 0; i < opt_rows.length; i++) {
	                    el = opt_rows[i].querySelector('td').querySelector('.mdl-checkbox');
	                    el['MaterialCheckbox'].uncheck();
	                    opt_rows[i].classList.remove(this.CssClasses_.IS_SELECTED);
	                }
	            }
	        }.bind(this);
	    }
	};
	/**
	   * Creates a checkbox for a single or or multiple rows and hooks up the
	   * event handling.
	   *
	   * @param {HTMLElement} row Row to toggle when checkbox changes.
	   * @param {(Array<Object>|NodeList)=} opt_rows Rows to toggle when checkbox changes.
	   * @private
	   */
	MaterialDataTable.prototype.createCheckbox_ = function (row, opt_rows) {
	    var label = document.createElement('label');
	    var labelClasses = [
	        'mdl-checkbox',
	        'mdl-js-checkbox',
	        'mdl-js-ripple-effect',
	        this.CssClasses_.SELECT_ELEMENT
	    ];
	    label.className = labelClasses.join(' ');
	    var checkbox = document.createElement('input');
	    checkbox.type = 'checkbox';
	    checkbox.classList.add('mdl-checkbox__input');
	    checkbox.addEventListener('change', this.selectRow_(checkbox, row, opt_rows));
	    label.appendChild(checkbox);
	    componentHandler.upgradeElement(label, 'MaterialCheckbox');
	    return label;
	};
	/**
	   * Initialize element.
	   */
	MaterialDataTable.prototype.init = function () {
	    if (this.element_) {
	        var firstHeader = this.element_.querySelector('th');
	        var rows = this.element_.querySelector('tbody').querySelectorAll('tr');
	        if (this.element_.classList.contains(this.CssClasses_.SELECTABLE)) {
	            var th = document.createElement('th');
	            var headerCheckbox = this.createCheckbox_(null, rows);
	            th.appendChild(headerCheckbox);
	            firstHeader.parentElement.insertBefore(th, firstHeader);
	            for (var i = 0; i < rows.length; i++) {
	                var firstCell = rows[i].querySelector('td');
	                if (firstCell) {
	                    var td = document.createElement('td');
	                    var rowCheckbox = this.createCheckbox_(rows[i]);
	                    td.appendChild(rowCheckbox);
	                    rows[i].insertBefore(td, firstCell);
	                }
	            }
	        }
	        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
	    }
	};
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialDataTable,
	    classAsString: 'MaterialDataTable',
	    cssClass: 'mdl-js-data-table'
	});
	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	/**
	   * Class constructor for Ripple MDL component.
	   * Implements MDL component design pattern defined at:
	   * https://github.com/jasonmayes/mdl-component-design-pattern
	   *
	   * @constructor
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	var MaterialRipple = function MaterialRipple(element) {
	    this.element_ = element;
	    // Initialize instance.
	    this.init();
	};
	window['MaterialRipple'] = MaterialRipple;
	/**
	   * Store constants in one place so they can be updated easily.
	   *
	   * @enum {string | number}
	   * @private
	   */
	MaterialRipple.prototype.Constant_ = {
	    INITIAL_SCALE: 'scale(0.0001, 0.0001)',
	    INITIAL_SIZE: '1px',
	    INITIAL_OPACITY: '0.4',
	    FINAL_OPACITY: '0',
	    FINAL_SCALE: ''
	};
	/**
	   * Store strings for class names defined by this component that are used in
	   * JavaScript. This allows us to simply change it in one place should we
	   * decide to modify at a later date.
	   *
	   * @enum {string}
	   * @private
	   */
	MaterialRipple.prototype.CssClasses_ = {
	    RIPPLE_CENTER: 'mdl-ripple--center',
	    RIPPLE_EFFECT_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
	    RIPPLE: 'mdl-ripple',
	    IS_ANIMATING: 'is-animating',
	    IS_VISIBLE: 'is-visible'
	};
	/**
	   * Handle mouse / finger down on element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialRipple.prototype.downHandler_ = function (event) {
	    if (!this.rippleElement_.style.width && !this.rippleElement_.style.height) {
	        var rect = this.element_.getBoundingClientRect();
	        this.boundHeight = rect.height;
	        this.boundWidth = rect.width;
	        this.rippleSize_ = Math.sqrt(rect.width * rect.width + rect.height * rect.height) * 2 + 2;
	        this.rippleElement_.style.width = this.rippleSize_ + 'px';
	        this.rippleElement_.style.height = this.rippleSize_ + 'px';
	    }
	    this.rippleElement_.classList.add(this.CssClasses_.IS_VISIBLE);
	    if (event.type === 'mousedown' && this.ignoringMouseDown_) {
	        this.ignoringMouseDown_ = false;
	    } else {
	        if (event.type === 'touchstart') {
	            this.ignoringMouseDown_ = true;
	        }
	        var frameCount = this.getFrameCount();
	        if (frameCount > 0) {
	            return;
	        }
	        this.setFrameCount(1);
	        var bound = event.currentTarget.getBoundingClientRect();
	        var x;
	        var y;
	        // Check if we are handling a keyboard click.
	        if (event.clientX === 0 && event.clientY === 0) {
	            x = Math.round(bound.width / 2);
	            y = Math.round(bound.height / 2);
	        } else {
	            var clientX = event.clientX ? event.clientX : event.touches[0].clientX;
	            var clientY = event.clientY ? event.clientY : event.touches[0].clientY;
	            x = Math.round(clientX - bound.left);
	            y = Math.round(clientY - bound.top);
	        }
	        this.setRippleXY(x, y);
	        this.setRippleStyles(true);
	        window.requestAnimationFrame(this.animFrameHandler.bind(this));
	    }
	};
	/**
	   * Handle mouse / finger up on element.
	   *
	   * @param {Event} event The event that fired.
	   * @private
	   */
	MaterialRipple.prototype.upHandler_ = function (event) {
	    // Don't fire for the artificial "mouseup" generated by a double-click.
	    if (event && event.detail !== 2) {
	        this.rippleElement_.classList.remove(this.CssClasses_.IS_VISIBLE);
	    }
	    // Allow a repaint to occur before removing this class, so the animation
	    // shows for tap events, which seem to trigger a mouseup too soon after
	    // mousedown.
	    window.setTimeout(function () {
	        this.rippleElement_.classList.remove(this.CssClasses_.IS_VISIBLE);
	    }.bind(this), 0);
	};
	/**
	   * Initialize element.
	   */
	MaterialRipple.prototype.init = function () {
	    if (this.element_) {
	        var recentering = this.element_.classList.contains(this.CssClasses_.RIPPLE_CENTER);
	        if (!this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT_IGNORE_EVENTS)) {
	            this.rippleElement_ = this.element_.querySelector('.' + this.CssClasses_.RIPPLE);
	            this.frameCount_ = 0;
	            this.rippleSize_ = 0;
	            this.x_ = 0;
	            this.y_ = 0;
	            // Touch start produces a compat mouse down event, which would cause a
	            // second ripples. To avoid that, we use this property to ignore the first
	            // mouse down after a touch start.
	            this.ignoringMouseDown_ = false;
	            this.boundDownHandler = this.downHandler_.bind(this);
	            this.element_.addEventListener('mousedown', this.boundDownHandler);
	            this.element_.addEventListener('touchstart', this.boundDownHandler);
	            this.boundUpHandler = this.upHandler_.bind(this);
	            this.element_.addEventListener('mouseup', this.boundUpHandler);
	            this.element_.addEventListener('mouseleave', this.boundUpHandler);
	            this.element_.addEventListener('touchend', this.boundUpHandler);
	            this.element_.addEventListener('blur', this.boundUpHandler);
	            /**
	         * Getter for frameCount_.
	         * @return {number} the frame count.
	         */
	            this.getFrameCount = function () {
	                return this.frameCount_;
	            };
	            /**
	         * Setter for frameCount_.
	         * @param {number} fC the frame count.
	         */
	            this.setFrameCount = function (fC) {
	                this.frameCount_ = fC;
	            };
	            /**
	         * Getter for rippleElement_.
	         * @return {Element} the ripple element.
	         */
	            this.getRippleElement = function () {
	                return this.rippleElement_;
	            };
	            /**
	         * Sets the ripple X and Y coordinates.
	         * @param  {number} newX the new X coordinate
	         * @param  {number} newY the new Y coordinate
	         */
	            this.setRippleXY = function (newX, newY) {
	                this.x_ = newX;
	                this.y_ = newY;
	            };
	            /**
	         * Sets the ripple styles.
	         * @param  {boolean} start whether or not this is the start frame.
	         */
	            this.setRippleStyles = function (start) {
	                if (this.rippleElement_ !== null) {
	                    var transformString;
	                    var scale;
	                    var size;
	                    var offset = 'translate(' + this.x_ + 'px, ' + this.y_ + 'px)';
	                    if (start) {
	                        scale = this.Constant_.INITIAL_SCALE;
	                        size = this.Constant_.INITIAL_SIZE;
	                    } else {
	                        scale = this.Constant_.FINAL_SCALE;
	                        size = this.rippleSize_ + 'px';
	                        if (recentering) {
	                            offset = 'translate(' + this.boundWidth / 2 + 'px, ' + this.boundHeight / 2 + 'px)';
	                        }
	                    }
	                    transformString = 'translate(-50%, -50%) ' + offset + scale;
	                    this.rippleElement_.style.webkitTransform = transformString;
	                    this.rippleElement_.style.msTransform = transformString;
	                    this.rippleElement_.style.transform = transformString;
	                    if (start) {
	                        this.rippleElement_.classList.remove(this.CssClasses_.IS_ANIMATING);
	                    } else {
	                        this.rippleElement_.classList.add(this.CssClasses_.IS_ANIMATING);
	                    }
	                }
	            };
	            /**
	         * Handles an animation frame.
	         */
	            this.animFrameHandler = function () {
	                if (this.frameCount_-- > 0) {
	                    window.requestAnimationFrame(this.animFrameHandler.bind(this));
	                } else {
	                    this.setRippleStyles(false);
	                }
	            };
	        }
	    }
	};
	/**
	   * Downgrade the component
	   *
	   * @private
	   */
	MaterialRipple.prototype.mdlDowngrade_ = function () {
	    this.element_.removeEventListener('mousedown', this.boundDownHandler);
	    this.element_.removeEventListener('touchstart', this.boundDownHandler);
	    this.element_.removeEventListener('mouseup', this.boundUpHandler);
	    this.element_.removeEventListener('mouseleave', this.boundUpHandler);
	    this.element_.removeEventListener('touchend', this.boundUpHandler);
	    this.element_.removeEventListener('blur', this.boundUpHandler);
	};
	/**
	   * Public alias for the downgrade method.
	   *
	   * @public
	   */
	MaterialRipple.prototype.mdlDowngrade = MaterialRipple.prototype.mdlDowngrade_;
	MaterialRipple.prototype['mdlDowngrade'] = MaterialRipple.prototype.mdlDowngrade;
	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	    constructor: MaterialRipple,
	    classAsString: 'MaterialRipple',
	    cssClass: 'mdl-js-ripple-effect',
	    widget: false
	});
	}());


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	__webpack_require__(22);
	
	__webpack_require__(23);
	
	__webpack_require__(24);
	
	__webpack_require__(25);
	
	__webpack_require__(26);
	
	__webpack_require__(27);
	
	var _q = __webpack_require__(28);
	
	var _q2 = _interopRequireDefault(_q);
	
	var _selector = __webpack_require__(29);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = { q: _q2.default, $: _selector.$, $$: _selector.$$ };

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Check if the string is a card number
	 * @return {Boolean} True if the string is an card number
	 */
	String.prototype.isCardNumber = function () {
	  return this.slice(0, 8) === '22000000';
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";
	
	/**
	 * Filters an array and return the first match which validates id
	 * @param  {Function} id id to validate
	 * @return {Mixed} The result
	 */
	Array.prototype.filterObjId = function (id) {
	  var filtered = this.filter(function (item) {
	    return item.id === id;
	  });
	
	  return filtered.length > 0 ? filtered[0] : undefined;
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";
	
	/**
	 * Filters an array and return what's defined
	 * @return {Mixed} The result
	 */
	Array.prototype.filerUndefined = function () {
	  return this.filter(function (item) {
	    return item !== undefined;
	  });
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	"use strict";
	
	/* global Document, Element */
	
	/**
	 * Listen for only one event
	 * @param {String}   event    The event name
	 * @param {Function} callback The listener
	 */
	Document.prototype.once = Element.prototype.once = function (event, callback) {
	    var _this = this;
	
	    this.addEventListener(event, function () {
	        callback();
	        _this.removeEventListener(event, callback);
	    }, false);
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	"use strict";
	
	/* global document, Element */
	
	/**
	 * Search among all parents of a child, stops when the wanted parent is found
	 * @param  {String} selector CSS3 selector
	 * @return {HTMLElement} The parent
	 */
	Element.prototype.parents = function (selector) {
	    var $matches = Array.prototype.slice.call(document.querySelectorAll(selector));
	    // jscs:disable
	    var parent = this;
	    // jscs:enable
	
	    do {
	        if ($matches.indexOf(parent) !== -1) {
	            return parent;
	        }
	        parent = parent.parentElement;
	    } while (parent !== document.documentElement);
	
	    return parent;
	};

/***/ },
/* 27 */
/***/ function(module, exports) {

	"use strict";
	
	/**
	 * Uniquify an array
	 * @return {Array} Uniquified array
	 */
	Array.prototype.uniq = function () {
	  var self = this;
	
	  return self.filter(function (elem, pos) {
	    return self.indexOf(elem) === pos;
	  });
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (obj) {
	  return encodeURIComponent(JSON.stringify(obj));
	};

/***/ },
/* 29 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/* global document, Node */
	
	exports.default = {
	    $: function $(s, fromEl) {
	        if (fromEl instanceof Node) {
	            return fromEl.querySelector(s);
	        }
	
	        return document.querySelector(s);
	    },
	    $$: function $$() {
	        return function (s, fromEl) {
	            if (fromEl instanceof Node) {
	                return Array.prototype.slice.call(fromEl.querySelectorAll(s));
	            }
	
	            return Array.prototype.slice.call(document.querySelectorAll(s));
	        };
	    }
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(31);

	__webpack_require__(33);

	__webpack_require__(34);

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _utils = __webpack_require__(21);
	
	var _utils2 = _interopRequireDefault(_utils);
	
	var _vue = __webpack_require__(32);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	_vue2.default.filter('basket', function () {
	    var _this = this;
	
	    var basket = {};
	    var promotion = {};
	
	    // Articles display
	    this.basket.forEach(function (item) {
	        var fullItem = _this.articles.filterObjId(item);
	
	        if (!fullItem) {
	            return;
	        }
	
	        basket[fullItem.name] = basket.hasOwnProperty(fullItem.name) ? basket[fullItem.name] + 1 : 1;
	    });
	
	    // Promotions display
	    this.basketPromotions.forEach(function (promo) {
	        var _promotion$fullItem$n;
	
	        var promotionId = promo.id;
	        var promotionsArticles = promo.contents;
	
	        var fullItem = _this.promotions.filterObjId(promotionId);
	
	        if (!fullItem) {
	            return;
	        }
	
	        // Store more complex structure for promotions
	        if (!promotion.hasOwnProperty(fullItem.name)) {
	            promotion[fullItem.name] = {
	                count: 0,
	                articles: [],
	                name: fullItem.name
	            };
	        }
	
	        promotion[fullItem.name].count++;
	        (_promotion$fullItem$n = promotion[fullItem.name].articles).push.apply(_promotion$fullItem$n, _toConsumableArray(promotionsArticles));
	    });
	
	    // Stringify promotions
	    promotion = Object.keys(promotion).map(function (item) {
	        var fullName = promotion[item].name + ' x' + promotion[item].count;
	        var template = '<button class="mdl-button mdl-js-button promotionButton" @click="onPromotionExpand">\n                                ' + fullName + '\n                            </button>\n                            <ul class="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect">';
	
	        template += promotion[item].articles.map(function (articleId) {
	            return _this.articles.filterObjId(articleId);
	        }).filerUndefined().map(function (article) {
	            return '<li class="mdl-menu__item">' + article.name + '</li>';
	        }).join('\n');
	
	        template += '</ul>';
	
	        return template;
	    }).join(', ');
	
	    // Stringify basket
	    basket = Object.keys(basket).map(function (item) {
	        return item + ' x' + basket[item];
	    }).join(', ');
	
	    _vue2.default.nextTick(function () {
	        var $node = (0, _utils2.default)('.mdl-layout-spacer');
	
	        if ($node) {
	            _this.$compile($node);
	        }
	    });
	
	    if (basket === '' && promotion === '') {
	        return 'vide';
	    }
	
	    var total = '';
	    total += promotion.length > 0 ? promotion : '';
	    total += basket.length > 0 ? basket : '';
	
	    return total;
	});

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Vue.js v1.0.7
	 * (c) 2015 Evan You
	 * Released under the MIT License.
	 */
	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory();
		else if(typeof define === 'function' && define.amd)
			define([], factory);
		else if(typeof exports === 'object')
			exports["Vue"] = factory();
		else
			root["Vue"] = factory();
	})(this, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	
	
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var extend = _.extend
	
		/**
		 * The exposed Vue constructor.
		 *
		 * API conventions:
		 * - public API methods/properties are prefiexed with `$`
		 * - internal methods/properties are prefixed with `_`
		 * - non-prefixed properties are assumed to be proxied user
		 *   data.
		 *
		 * @constructor
		 * @param {Object} [options]
		 * @public
		 */
	
		function Vue (options) {
		  this._init(options)
		}
	
		/**
		 * Mixin global API
		 */
	
		extend(Vue, __webpack_require__(13))
	
		/**
		 * Vue and every constructor that extends Vue has an
		 * associated options object, which can be accessed during
		 * compilation steps as `this.constructor.options`.
		 *
		 * These can be seen as the default options of every
		 * Vue instance.
		 */
	
		Vue.options = {
		  replace: true,
		  directives: __webpack_require__(16),
		  elementDirectives: __webpack_require__(50),
		  filters: __webpack_require__(53),
		  transitions: {},
		  components: {},
		  partials: {}
		}
	
		/**
		 * Build up the prototype
		 */
	
		var p = Vue.prototype
	
		/**
		 * $data has a setter which does a bunch of
		 * teardown/setup work
		 */
	
		Object.defineProperty(p, '$data', {
		  get: function () {
		    return this._data
		  },
		  set: function (newData) {
		    if (newData !== this._data) {
		      this._setData(newData)
		    }
		  }
		})
	
		/**
		 * Mixin internal instance methods
		 */
	
		extend(p, __webpack_require__(55))
		extend(p, __webpack_require__(56))
		extend(p, __webpack_require__(57))
		extend(p, __webpack_require__(60))
		extend(p, __webpack_require__(62))
	
		/**
		 * Mixin public API methods
		 */
	
		extend(p, __webpack_require__(63))
		extend(p, __webpack_require__(64))
		extend(p, __webpack_require__(65))
		extend(p, __webpack_require__(66))
	
		Vue.version = '1.0.7'
		module.exports = _.Vue = Vue
	
		/* istanbul ignore if */
		if (true) {
		  if (_.inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
		    window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit('init', Vue)
		  }
		}
	
	
	/***/ },
	/* 1 */
	/***/ function(module, exports, __webpack_require__) {
	
		var lang = __webpack_require__(2)
		var extend = lang.extend
	
		extend(exports, lang)
		extend(exports, __webpack_require__(3))
		extend(exports, __webpack_require__(4))
		extend(exports, __webpack_require__(10))
		extend(exports, __webpack_require__(11))
		extend(exports, __webpack_require__(12))
	
	
	/***/ },
	/* 2 */
	/***/ function(module, exports) {
	
		/**
		 * Set a property on an object. Adds the new property and
		 * triggers change notification if the property doesn't
		 * already exist.
		 *
		 * @param {Object} obj
		 * @param {String} key
		 * @param {*} val
		 * @public
		 */
	
		exports.set = function set (obj, key, val) {
		  if (obj.hasOwnProperty(key)) {
		    obj[key] = val
		    return
		  }
		  if (obj._isVue) {
		    set(obj._data, key, val)
		    return
		  }
		  var ob = obj.__ob__
		  if (!ob) {
		    obj[key] = val
		    return
		  }
		  ob.convert(key, val)
		  ob.dep.notify()
		  if (ob.vms) {
		    var i = ob.vms.length
		    while (i--) {
		      var vm = ob.vms[i]
		      vm._proxy(key)
		      vm._digest()
		    }
		  }
		}
	
		/**
		 * Delete a property and trigger change if necessary.
		 *
		 * @param {Object} obj
		 * @param {String} key
		 */
	
		exports.delete = function (obj, key) {
		  if (!obj.hasOwnProperty(key)) {
		    return
		  }
		  delete obj[key]
		  var ob = obj.__ob__
		  if (!ob) {
		    return
		  }
		  ob.dep.notify()
		  if (ob.vms) {
		    var i = ob.vms.length
		    while (i--) {
		      var vm = ob.vms[i]
		      vm._unproxy(key)
		      vm._digest()
		    }
		  }
		}
	
		/**
		 * Check if an expression is a literal value.
		 *
		 * @param {String} exp
		 * @return {Boolean}
		 */
	
		var literalValueRE = /^\s?(true|false|[\d\.]+|'[^']*'|"[^"]*")\s?$/
		exports.isLiteral = function (exp) {
		  return literalValueRE.test(exp)
		}
	
		/**
		 * Check if a string starts with $ or _
		 *
		 * @param {String} str
		 * @return {Boolean}
		 */
	
		exports.isReserved = function (str) {
		  var c = (str + '').charCodeAt(0)
		  return c === 0x24 || c === 0x5F
		}
	
		/**
		 * Guard text output, make sure undefined outputs
		 * empty string
		 *
		 * @param {*} value
		 * @return {String}
		 */
	
		exports.toString = function (value) {
		  return value == null
		    ? ''
		    : value.toString()
		}
	
		/**
		 * Check and convert possible numeric strings to numbers
		 * before setting back to data
		 *
		 * @param {*} value
		 * @return {*|Number}
		 */
	
		exports.toNumber = function (value) {
		  if (typeof value !== 'string') {
		    return value
		  } else {
		    var parsed = Number(value)
		    return isNaN(parsed)
		      ? value
		      : parsed
		  }
		}
	
		/**
		 * Convert string boolean literals into real booleans.
		 *
		 * @param {*} value
		 * @return {*|Boolean}
		 */
	
		exports.toBoolean = function (value) {
		  return value === 'true'
		    ? true
		    : value === 'false'
		      ? false
		      : value
		}
	
		/**
		 * Strip quotes from a string
		 *
		 * @param {String} str
		 * @return {String | false}
		 */
	
		exports.stripQuotes = function (str) {
		  var a = str.charCodeAt(0)
		  var b = str.charCodeAt(str.length - 1)
		  return a === b && (a === 0x22 || a === 0x27)
		    ? str.slice(1, -1)
		    : str
		}
	
		/**
		 * Camelize a hyphen-delmited string.
		 *
		 * @param {String} str
		 * @return {String}
		 */
	
		var camelizeRE = /-(\w)/g
		exports.camelize = function (str) {
		  return str.replace(camelizeRE, toUpper)
		}
	
		function toUpper (_, c) {
		  return c ? c.toUpperCase() : ''
		}
	
		/**
		 * Hyphenate a camelCase string.
		 *
		 * @param {String} str
		 * @return {String}
		 */
	
		var hyphenateRE = /([a-z\d])([A-Z])/g
		exports.hyphenate = function (str) {
		  return str
		    .replace(hyphenateRE, '$1-$2')
		    .toLowerCase()
		}
	
		/**
		 * Converts hyphen/underscore/slash delimitered names into
		 * camelized classNames.
		 *
		 * e.g. my-component => MyComponent
		 *      some_else    => SomeElse
		 *      some/comp    => SomeComp
		 *
		 * @param {String} str
		 * @return {String}
		 */
	
		var classifyRE = /(?:^|[-_\/])(\w)/g
		exports.classify = function (str) {
		  return str.replace(classifyRE, toUpper)
		}
	
		/**
		 * Simple bind, faster than native
		 *
		 * @param {Function} fn
		 * @param {Object} ctx
		 * @return {Function}
		 */
	
		exports.bind = function (fn, ctx) {
		  return function (a) {
		    var l = arguments.length
		    return l
		      ? l > 1
		        ? fn.apply(ctx, arguments)
		        : fn.call(ctx, a)
		      : fn.call(ctx)
		  }
		}
	
		/**
		 * Convert an Array-like object to a real Array.
		 *
		 * @param {Array-like} list
		 * @param {Number} [start] - start index
		 * @return {Array}
		 */
	
		exports.toArray = function (list, start) {
		  start = start || 0
		  var i = list.length - start
		  var ret = new Array(i)
		  while (i--) {
		    ret[i] = list[i + start]
		  }
		  return ret
		}
	
		/**
		 * Mix properties into target object.
		 *
		 * @param {Object} to
		 * @param {Object} from
		 */
	
		exports.extend = function (to, from) {
		  var keys = Object.keys(from)
		  var i = keys.length
		  while (i--) {
		    to[keys[i]] = from[keys[i]]
		  }
		  return to
		}
	
		/**
		 * Quick object check - this is primarily used to tell
		 * Objects from primitive values when we know the value
		 * is a JSON-compliant type.
		 *
		 * @param {*} obj
		 * @return {Boolean}
		 */
	
		exports.isObject = function (obj) {
		  return obj !== null && typeof obj === 'object'
		}
	
		/**
		 * Strict object type check. Only returns true
		 * for plain JavaScript objects.
		 *
		 * @param {*} obj
		 * @return {Boolean}
		 */
	
		var toString = Object.prototype.toString
		var OBJECT_STRING = '[object Object]'
		exports.isPlainObject = function (obj) {
		  return toString.call(obj) === OBJECT_STRING
		}
	
		/**
		 * Array type check.
		 *
		 * @param {*} obj
		 * @return {Boolean}
		 */
	
		exports.isArray = Array.isArray
	
		/**
		 * Define a non-enumerable property
		 *
		 * @param {Object} obj
		 * @param {String} key
		 * @param {*} val
		 * @param {Boolean} [enumerable]
		 */
	
		exports.define = function (obj, key, val, enumerable) {
		  Object.defineProperty(obj, key, {
		    value: val,
		    enumerable: !!enumerable,
		    writable: true,
		    configurable: true
		  })
		}
	
		/**
		 * Debounce a function so it only gets called after the
		 * input stops arriving after the given wait period.
		 *
		 * @param {Function} func
		 * @param {Number} wait
		 * @return {Function} - the debounced function
		 */
	
		exports.debounce = function (func, wait) {
		  var timeout, args, context, timestamp, result
		  var later = function () {
		    var last = Date.now() - timestamp
		    if (last < wait && last >= 0) {
		      timeout = setTimeout(later, wait - last)
		    } else {
		      timeout = null
		      result = func.apply(context, args)
		      if (!timeout) context = args = null
		    }
		  }
		  return function () {
		    context = this
		    args = arguments
		    timestamp = Date.now()
		    if (!timeout) {
		      timeout = setTimeout(later, wait)
		    }
		    return result
		  }
		}
	
		/**
		 * Manual indexOf because it's slightly faster than
		 * native.
		 *
		 * @param {Array} arr
		 * @param {*} obj
		 */
	
		exports.indexOf = function (arr, obj) {
		  var i = arr.length
		  while (i--) {
		    if (arr[i] === obj) return i
		  }
		  return -1
		}
	
		/**
		 * Make a cancellable version of an async callback.
		 *
		 * @param {Function} fn
		 * @return {Function}
		 */
	
		exports.cancellable = function (fn) {
		  var cb = function () {
		    if (!cb.cancelled) {
		      return fn.apply(this, arguments)
		    }
		  }
		  cb.cancel = function () {
		    cb.cancelled = true
		  }
		  return cb
		}
	
		/**
		 * Check if two values are loosely equal - that is,
		 * if they are plain objects, do they have the same shape?
		 *
		 * @param {*} a
		 * @param {*} b
		 * @return {Boolean}
		 */
	
		exports.looseEqual = function (a, b) {
		  /* eslint-disable eqeqeq */
		  return a == b || (
		    exports.isObject(a) && exports.isObject(b)
		      ? JSON.stringify(a) === JSON.stringify(b)
		      : false
		  )
		  /* eslint-enable eqeqeq */
		}
	
	
	/***/ },
	/* 3 */
	/***/ function(module, exports) {
	
		// can we use __proto__?
		exports.hasProto = '__proto__' in {}
	
		// Browser environment sniffing
		var inBrowser = exports.inBrowser =
		  typeof window !== 'undefined' &&
		  Object.prototype.toString.call(window) !== '[object Object]'
	
		exports.isIE9 =
		  inBrowser &&
		  navigator.userAgent.toLowerCase().indexOf('msie 9.0') > 0
	
		exports.isAndroid =
		  inBrowser &&
		  navigator.userAgent.toLowerCase().indexOf('android') > 0
	
		// Transition property/event sniffing
		if (inBrowser && !exports.isIE9) {
		  var isWebkitTrans =
		    window.ontransitionend === undefined &&
		    window.onwebkittransitionend !== undefined
		  var isWebkitAnim =
		    window.onanimationend === undefined &&
		    window.onwebkitanimationend !== undefined
		  exports.transitionProp = isWebkitTrans
		    ? 'WebkitTransition'
		    : 'transition'
		  exports.transitionEndEvent = isWebkitTrans
		    ? 'webkitTransitionEnd'
		    : 'transitionend'
		  exports.animationProp = isWebkitAnim
		    ? 'WebkitAnimation'
		    : 'animation'
		  exports.animationEndEvent = isWebkitAnim
		    ? 'webkitAnimationEnd'
		    : 'animationend'
		}
	
		/**
		 * Defer a task to execute it asynchronously. Ideally this
		 * should be executed as a microtask, so we leverage
		 * MutationObserver if it's available, and fallback to
		 * setTimeout(0).
		 *
		 * @param {Function} cb
		 * @param {Object} ctx
		 */
	
		exports.nextTick = (function () {
		  var callbacks = []
		  var pending = false
		  var timerFunc
		  function nextTickHandler () {
		    pending = false
		    var copies = callbacks.slice(0)
		    callbacks = []
		    for (var i = 0; i < copies.length; i++) {
		      copies[i]()
		    }
		  }
		  /* istanbul ignore if */
		  if (typeof MutationObserver !== 'undefined') {
		    var counter = 1
		    var observer = new MutationObserver(nextTickHandler)
		    var textNode = document.createTextNode(counter)
		    observer.observe(textNode, {
		      characterData: true
		    })
		    timerFunc = function () {
		      counter = (counter + 1) % 2
		      textNode.data = counter
		    }
		  } else {
		    timerFunc = setTimeout
		  }
		  return function (cb, ctx) {
		    var func = ctx
		      ? function () { cb.call(ctx) }
		      : cb
		    callbacks.push(func)
		    if (pending) return
		    pending = true
		    timerFunc(nextTickHandler, 0)
		  }
		})()
	
	
	/***/ },
	/* 4 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var config = __webpack_require__(5)
		var transition = __webpack_require__(9)
	
		/**
		 * Query an element selector if it's not an element already.
		 *
		 * @param {String|Element} el
		 * @return {Element}
		 */
	
		exports.query = function (el) {
		  if (typeof el === 'string') {
		    var selector = el
		    el = document.querySelector(el)
		    if (!el) {
		      ("development") !== 'production' && _.warn(
		        'Cannot find element: ' + selector
		      )
		    }
		  }
		  return el
		}
	
		/**
		 * Check if a node is in the document.
		 * Note: document.documentElement.contains should work here
		 * but always returns false for comment nodes in phantomjs,
		 * making unit tests difficult. This is fixed by doing the
		 * contains() check on the node's parentNode instead of
		 * the node itself.
		 *
		 * @param {Node} node
		 * @return {Boolean}
		 */
	
		exports.inDoc = function (node) {
		  var doc = document.documentElement
		  var parent = node && node.parentNode
		  return doc === node ||
		    doc === parent ||
		    !!(parent && parent.nodeType === 1 && (doc.contains(parent)))
		}
	
		/**
		 * Get and remove an attribute from a node.
		 *
		 * @param {Node} node
		 * @param {String} attr
		 */
	
		exports.attr = function (node, attr) {
		  var val = node.getAttribute(attr)
		  if (val !== null) {
		    node.removeAttribute(attr)
		  }
		  return val
		}
	
		/**
		 * Get an attribute with colon or v-bind: prefix.
		 *
		 * @param {Node} node
		 * @param {String} name
		 * @return {String|null}
		 */
	
		exports.getBindAttr = function (node, name) {
		  var val = exports.attr(node, ':' + name)
		  if (val === null) {
		    val = exports.attr(node, 'v-bind:' + name)
		  }
		  return val
		}
	
		/**
		 * Insert el before target
		 *
		 * @param {Element} el
		 * @param {Element} target
		 */
	
		exports.before = function (el, target) {
		  target.parentNode.insertBefore(el, target)
		}
	
		/**
		 * Insert el after target
		 *
		 * @param {Element} el
		 * @param {Element} target
		 */
	
		exports.after = function (el, target) {
		  if (target.nextSibling) {
		    exports.before(el, target.nextSibling)
		  } else {
		    target.parentNode.appendChild(el)
		  }
		}
	
		/**
		 * Remove el from DOM
		 *
		 * @param {Element} el
		 */
	
		exports.remove = function (el) {
		  el.parentNode.removeChild(el)
		}
	
		/**
		 * Prepend el to target
		 *
		 * @param {Element} el
		 * @param {Element} target
		 */
	
		exports.prepend = function (el, target) {
		  if (target.firstChild) {
		    exports.before(el, target.firstChild)
		  } else {
		    target.appendChild(el)
		  }
		}
	
		/**
		 * Replace target with el
		 *
		 * @param {Element} target
		 * @param {Element} el
		 */
	
		exports.replace = function (target, el) {
		  var parent = target.parentNode
		  if (parent) {
		    parent.replaceChild(el, target)
		  }
		}
	
		/**
		 * Add event listener shorthand.
		 *
		 * @param {Element} el
		 * @param {String} event
		 * @param {Function} cb
		 */
	
		exports.on = function (el, event, cb) {
		  el.addEventListener(event, cb)
		}
	
		/**
		 * Remove event listener shorthand.
		 *
		 * @param {Element} el
		 * @param {String} event
		 * @param {Function} cb
		 */
	
		exports.off = function (el, event, cb) {
		  el.removeEventListener(event, cb)
		}
	
		/**
		 * Add class with compatibility for IE & SVG
		 *
		 * @param {Element} el
		 * @param {Strong} cls
		 */
	
		exports.addClass = function (el, cls) {
		  if (el.classList) {
		    el.classList.add(cls)
		  } else {
		    var cur = ' ' + (el.getAttribute('class') || '') + ' '
		    if (cur.indexOf(' ' + cls + ' ') < 0) {
		      el.setAttribute('class', (cur + cls).trim())
		    }
		  }
		}
	
		/**
		 * Remove class with compatibility for IE & SVG
		 *
		 * @param {Element} el
		 * @param {Strong} cls
		 */
	
		exports.removeClass = function (el, cls) {
		  if (el.classList) {
		    el.classList.remove(cls)
		  } else {
		    var cur = ' ' + (el.getAttribute('class') || '') + ' '
		    var tar = ' ' + cls + ' '
		    while (cur.indexOf(tar) >= 0) {
		      cur = cur.replace(tar, ' ')
		    }
		    el.setAttribute('class', cur.trim())
		  }
		  if (!el.className) {
		    el.removeAttribute('class')
		  }
		}
	
		/**
		 * Extract raw content inside an element into a temporary
		 * container div
		 *
		 * @param {Element} el
		 * @param {Boolean} asFragment
		 * @return {Element}
		 */
	
		exports.extractContent = function (el, asFragment) {
		  var child
		  var rawContent
		  /* istanbul ignore if */
		  if (
		    exports.isTemplate(el) &&
		    el.content instanceof DocumentFragment
		  ) {
		    el = el.content
		  }
		  if (el.hasChildNodes()) {
		    exports.trimNode(el)
		    rawContent = asFragment
		      ? document.createDocumentFragment()
		      : document.createElement('div')
		    /* eslint-disable no-cond-assign */
		    while (child = el.firstChild) {
		    /* eslint-enable no-cond-assign */
		      rawContent.appendChild(child)
		    }
		  }
		  return rawContent
		}
	
		/**
		 * Trim possible empty head/tail textNodes inside a parent.
		 *
		 * @param {Node} node
		 */
	
		exports.trimNode = function (node) {
		  trim(node, node.firstChild)
		  trim(node, node.lastChild)
		}
	
		function trim (parent, node) {
		  if (node && node.nodeType === 3 && !node.data.trim()) {
		    parent.removeChild(node)
		  }
		}
	
		/**
		 * Check if an element is a template tag.
		 * Note if the template appears inside an SVG its tagName
		 * will be in lowercase.
		 *
		 * @param {Element} el
		 */
	
		exports.isTemplate = function (el) {
		  return el.tagName &&
		    el.tagName.toLowerCase() === 'template'
		}
	
		/**
		 * Create an "anchor" for performing dom insertion/removals.
		 * This is used in a number of scenarios:
		 * - fragment instance
		 * - v-html
		 * - v-if
		 * - v-for
		 * - component
		 *
		 * @param {String} content
		 * @param {Boolean} persist - IE trashes empty textNodes on
		 *                            cloneNode(true), so in certain
		 *                            cases the anchor needs to be
		 *                            non-empty to be persisted in
		 *                            templates.
		 * @return {Comment|Text}
		 */
	
		exports.createAnchor = function (content, persist) {
		  return config.debug
		    ? document.createComment(content)
		    : document.createTextNode(persist ? ' ' : '')
		}
	
		/**
		 * Find a component ref attribute that starts with $.
		 *
		 * @param {Element} node
		 * @return {String|undefined}
		 */
	
		var refRE = /^v-ref:/
		exports.findRef = function (node) {
		  if (node.hasAttributes()) {
		    var attrs = node.attributes
		    for (var i = 0, l = attrs.length; i < l; i++) {
		      var name = attrs[i].name
		      if (refRE.test(name)) {
		        node.removeAttribute(name)
		        return _.camelize(name.replace(refRE, ''))
		      }
		    }
		  }
		}
	
		/**
		 * Map a function to a range of nodes .
		 *
		 * @param {Node} node
		 * @param {Node} end
		 * @param {Function} op
		 */
	
		exports.mapNodeRange = function (node, end, op) {
		  var next
		  while (node !== end) {
		    next = node.nextSibling
		    op(node)
		    node = next
		  }
		  op(end)
		}
	
		/**
		 * Remove a range of nodes with transition, store
		 * the nodes in a fragment with correct ordering,
		 * and call callback when done.
		 *
		 * @param {Node} start
		 * @param {Node} end
		 * @param {Vue} vm
		 * @param {DocumentFragment} frag
		 * @param {Function} cb
		 */
	
		exports.removeNodeRange = function (start, end, vm, frag, cb) {
		  var done = false
		  var removed = 0
		  var nodes = []
		  exports.mapNodeRange(start, end, function (node) {
		    if (node === end) done = true
		    nodes.push(node)
		    transition.remove(node, vm, onRemoved)
		  })
		  function onRemoved () {
		    removed++
		    if (done && removed >= nodes.length) {
		      for (var i = 0; i < nodes.length; i++) {
		        frag.appendChild(nodes[i])
		      }
		      cb && cb()
		    }
		  }
		}
	
	
	/***/ },
	/* 5 */
	/***/ function(module, exports, __webpack_require__) {
	
		module.exports = {
	
		  /**
		   * Whether to print debug messages.
		   * Also enables stack trace for warnings.
		   *
		   * @type {Boolean}
		   */
	
		  debug: false,
	
		  /**
		   * Whether to suppress warnings.
		   *
		   * @type {Boolean}
		   */
	
		  silent: false,
	
		  /**
		   * Whether to use async rendering.
		   */
	
		  async: true,
	
		  /**
		   * Whether to warn against errors caught when evaluating
		   * expressions.
		   */
	
		  warnExpressionErrors: true,
	
		  /**
		   * Internal flag to indicate the delimiters have been
		   * changed.
		   *
		   * @type {Boolean}
		   */
	
		  _delimitersChanged: true,
	
		  /**
		   * List of asset types that a component can own.
		   *
		   * @type {Array}
		   */
	
		  _assetTypes: [
		    'component',
		    'directive',
		    'elementDirective',
		    'filter',
		    'transition',
		    'partial'
		  ],
	
		  /**
		   * prop binding modes
		   */
	
		  _propBindingModes: {
		    ONE_WAY: 0,
		    TWO_WAY: 1,
		    ONE_TIME: 2
		  },
	
		  /**
		   * Max circular updates allowed in a batcher flush cycle.
		   */
	
		  _maxUpdateCount: 100
	
		}
	
		/**
		 * Interpolation delimiters. Changing these would trigger
		 * the text parser to re-compile the regular expressions.
		 *
		 * @type {Array<String>}
		 */
	
		var delimiters = ['{{', '}}']
		var unsafeDelimiters = ['{{{', '}}}']
		var textParser = __webpack_require__(6)
	
		Object.defineProperty(module.exports, 'delimiters', {
		  get: function () {
		    return delimiters
		  },
		  set: function (val) {
		    delimiters = val
		    textParser.compileRegex()
		  }
		})
	
		Object.defineProperty(module.exports, 'unsafeDelimiters', {
		  get: function () {
		    return unsafeDelimiters
		  },
		  set: function (val) {
		    unsafeDelimiters = val
		    textParser.compileRegex()
		  }
		})
	
	
	/***/ },
	/* 6 */
	/***/ function(module, exports, __webpack_require__) {
	
		var Cache = __webpack_require__(7)
		var config = __webpack_require__(5)
		var dirParser = __webpack_require__(8)
		var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g
		var cache, tagRE, htmlRE
	
		/**
		 * Escape a string so it can be used in a RegExp
		 * constructor.
		 *
		 * @param {String} str
		 */
	
		function escapeRegex (str) {
		  return str.replace(regexEscapeRE, '\\$&')
		}
	
		exports.compileRegex = function () {
		  var open = escapeRegex(config.delimiters[0])
		  var close = escapeRegex(config.delimiters[1])
		  var unsafeOpen = escapeRegex(config.unsafeDelimiters[0])
		  var unsafeClose = escapeRegex(config.unsafeDelimiters[1])
		  tagRE = new RegExp(
		    unsafeOpen + '(.+?)' + unsafeClose + '|' +
		    open + '(.+?)' + close,
		    'g'
		  )
		  htmlRE = new RegExp(
		    '^' + unsafeOpen + '.*' + unsafeClose + '$'
		  )
		  // reset cache
		  cache = new Cache(1000)
		}
	
		/**
		 * Parse a template text string into an array of tokens.
		 *
		 * @param {String} text
		 * @return {Array<Object> | null}
		 *               - {String} type
		 *               - {String} value
		 *               - {Boolean} [html]
		 *               - {Boolean} [oneTime]
		 */
	
		exports.parse = function (text) {
		  if (!cache) {
		    exports.compileRegex()
		  }
		  var hit = cache.get(text)
		  if (hit) {
		    return hit
		  }
		  text = text.replace(/\n/g, '')
		  if (!tagRE.test(text)) {
		    return null
		  }
		  var tokens = []
		  var lastIndex = tagRE.lastIndex = 0
		  var match, index, html, value, first, oneTime
		  /* eslint-disable no-cond-assign */
		  while (match = tagRE.exec(text)) {
		  /* eslint-enable no-cond-assign */
		    index = match.index
		    // push text token
		    if (index > lastIndex) {
		      tokens.push({
		        value: text.slice(lastIndex, index)
		      })
		    }
		    // tag token
		    html = htmlRE.test(match[0])
		    value = html ? match[1] : match[2]
		    first = value.charCodeAt(0)
		    oneTime = first === 42 // *
		    value = oneTime
		      ? value.slice(1)
		      : value
		    tokens.push({
		      tag: true,
		      value: value.trim(),
		      html: html,
		      oneTime: oneTime
		    })
		    lastIndex = index + match[0].length
		  }
		  if (lastIndex < text.length) {
		    tokens.push({
		      value: text.slice(lastIndex)
		    })
		  }
		  cache.put(text, tokens)
		  return tokens
		}
	
		/**
		 * Format a list of tokens into an expression.
		 * e.g. tokens parsed from 'a {{b}} c' can be serialized
		 * into one single expression as '"a " + b + " c"'.
		 *
		 * @param {Array} tokens
		 * @return {String}
		 */
	
		exports.tokensToExp = function (tokens) {
		  if (tokens.length > 1) {
		    return tokens.map(function (token) {
		      return formatToken(token)
		    }).join('+')
		  } else {
		    return formatToken(tokens[0], true)
		  }
		}
	
		/**
		 * Format a single token.
		 *
		 * @param {Object} token
		 * @param {Boolean} single
		 * @return {String}
		 */
	
		function formatToken (token, single) {
		  return token.tag
		    ? inlineFilters(token.value, single)
		    : '"' + token.value + '"'
		}
	
		/**
		 * For an attribute with multiple interpolation tags,
		 * e.g. attr="some-{{thing | filter}}", in order to combine
		 * the whole thing into a single watchable expression, we
		 * have to inline those filters. This function does exactly
		 * that. This is a bit hacky but it avoids heavy changes
		 * to directive parser and watcher mechanism.
		 *
		 * @param {String} exp
		 * @param {Boolean} single
		 * @return {String}
		 */
	
		var filterRE = /[^|]\|[^|]/
		function inlineFilters (exp, single) {
		  if (!filterRE.test(exp)) {
		    return single
		      ? exp
		      : '(' + exp + ')'
		  } else {
		    var dir = dirParser.parse(exp)
		    if (!dir.filters) {
		      return '(' + exp + ')'
		    } else {
		      return 'this._applyFilters(' +
		        dir.expression + // value
		        ',null,' +       // oldValue (null for read)
		        JSON.stringify(dir.filters) + // filter descriptors
		        ',false)'        // write?
		    }
		  }
		}
	
	
	/***/ },
	/* 7 */
	/***/ function(module, exports) {
	
		/**
		 * A doubly linked list-based Least Recently Used (LRU)
		 * cache. Will keep most recently used items while
		 * discarding least recently used items when its limit is
		 * reached. This is a bare-bone version of
		 * Rasmus Andersson's js-lru:
		 *
		 *   https://github.com/rsms/js-lru
		 *
		 * @param {Number} limit
		 * @constructor
		 */
	
		function Cache (limit) {
		  this.size = 0
		  this.limit = limit
		  this.head = this.tail = undefined
		  this._keymap = Object.create(null)
		}
	
		var p = Cache.prototype
	
		/**
		 * Put <value> into the cache associated with <key>.
		 * Returns the entry which was removed to make room for
		 * the new entry. Otherwise undefined is returned.
		 * (i.e. if there was enough room already).
		 *
		 * @param {String} key
		 * @param {*} value
		 * @return {Entry|undefined}
		 */
	
		p.put = function (key, value) {
		  var entry = {
		    key: key,
		    value: value
		  }
		  this._keymap[key] = entry
		  if (this.tail) {
		    this.tail.newer = entry
		    entry.older = this.tail
		  } else {
		    this.head = entry
		  }
		  this.tail = entry
		  if (this.size === this.limit) {
		    return this.shift()
		  } else {
		    this.size++
		  }
		}
	
		/**
		 * Purge the least recently used (oldest) entry from the
		 * cache. Returns the removed entry or undefined if the
		 * cache was empty.
		 */
	
		p.shift = function () {
		  var entry = this.head
		  if (entry) {
		    this.head = this.head.newer
		    this.head.older = undefined
		    entry.newer = entry.older = undefined
		    this._keymap[entry.key] = undefined
		  }
		  return entry
		}
	
		/**
		 * Get and register recent use of <key>. Returns the value
		 * associated with <key> or undefined if not in cache.
		 *
		 * @param {String} key
		 * @param {Boolean} returnEntry
		 * @return {Entry|*}
		 */
	
		p.get = function (key, returnEntry) {
		  var entry = this._keymap[key]
		  if (entry === undefined) return
		  if (entry === this.tail) {
		    return returnEntry
		      ? entry
		      : entry.value
		  }
		  // HEAD--------------TAIL
		  //   <.older   .newer>
		  //  <--- add direction --
		  //   A  B  C  <D>  E
		  if (entry.newer) {
		    if (entry === this.head) {
		      this.head = entry.newer
		    }
		    entry.newer.older = entry.older // C <-- E.
		  }
		  if (entry.older) {
		    entry.older.newer = entry.newer // C. --> E
		  }
		  entry.newer = undefined // D --x
		  entry.older = this.tail // D. --> E
		  if (this.tail) {
		    this.tail.newer = entry // E. <-- D
		  }
		  this.tail = entry
		  return returnEntry
		    ? entry
		    : entry.value
		}
	
		module.exports = Cache
	
	
	/***/ },
	/* 8 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var Cache = __webpack_require__(7)
		var cache = new Cache(1000)
		var filterTokenRE = /[^\s'"]+|'[^']*'|"[^"]*"/g
		var reservedArgRE = /^in$|^-?\d+/
	
		/**
		 * Parser state
		 */
	
		var str, dir
		var c, i, l, lastFilterIndex
		var inSingle, inDouble, curly, square, paren
	
		/**
		 * Push a filter to the current directive object
		 */
	
		function pushFilter () {
		  var exp = str.slice(lastFilterIndex, i).trim()
		  var filter
		  if (exp) {
		    filter = {}
		    var tokens = exp.match(filterTokenRE)
		    filter.name = tokens[0]
		    if (tokens.length > 1) {
		      filter.args = tokens.slice(1).map(processFilterArg)
		    }
		  }
		  if (filter) {
		    (dir.filters = dir.filters || []).push(filter)
		  }
		  lastFilterIndex = i + 1
		}
	
		/**
		 * Check if an argument is dynamic and strip quotes.
		 *
		 * @param {String} arg
		 * @return {Object}
		 */
	
		function processFilterArg (arg) {
		  if (reservedArgRE.test(arg)) {
		    return {
		      value: _.toNumber(arg),
		      dynamic: false
		    }
		  } else {
		    var stripped = _.stripQuotes(arg)
		    var dynamic = stripped === arg
		    return {
		      value: dynamic ? arg : stripped,
		      dynamic: dynamic
		    }
		  }
		}
	
		/**
		 * Parse a directive value and extract the expression
		 * and its filters into a descriptor.
		 *
		 * Example:
		 *
		 * "a + 1 | uppercase" will yield:
		 * {
		 *   expression: 'a + 1',
		 *   filters: [
		 *     { name: 'uppercase', args: null }
		 *   ]
		 * }
		 *
		 * @param {String} str
		 * @return {Object}
		 */
	
		exports.parse = function (s) {
	
		  var hit = cache.get(s)
		  if (hit) {
		    return hit
		  }
	
		  // reset parser state
		  str = s
		  inSingle = inDouble = false
		  curly = square = paren = 0
		  lastFilterIndex = 0
		  dir = {}
	
		  for (i = 0, l = str.length; i < l; i++) {
		    c = str.charCodeAt(i)
		    if (inSingle) {
		      // check single quote
		      if (c === 0x27) inSingle = !inSingle
		    } else if (inDouble) {
		      // check double quote
		      if (c === 0x22) inDouble = !inDouble
		    } else if (
		      c === 0x7C && // pipe
		      str.charCodeAt(i + 1) !== 0x7C &&
		      str.charCodeAt(i - 1) !== 0x7C
		    ) {
		      if (dir.expression == null) {
		        // first filter, end of expression
		        lastFilterIndex = i + 1
		        dir.expression = str.slice(0, i).trim()
		      } else {
		        // already has filter
		        pushFilter()
		      }
		    } else {
		      switch (c) {
		        case 0x22: inDouble = true; break // "
		        case 0x27: inSingle = true; break // '
		        case 0x28: paren++; break         // (
		        case 0x29: paren--; break         // )
		        case 0x5B: square++; break        // [
		        case 0x5D: square--; break        // ]
		        case 0x7B: curly++; break         // {
		        case 0x7D: curly--; break         // }
		      }
		    }
		  }
	
		  if (dir.expression == null) {
		    dir.expression = str.slice(0, i).trim()
		  } else if (lastFilterIndex !== 0) {
		    pushFilter()
		  }
	
		  cache.put(s, dir)
		  return dir
		}
	
	
	/***/ },
	/* 9 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
	
		/**
		 * Append with transition.
		 *
		 * @param {Element} el
		 * @param {Element} target
		 * @param {Vue} vm
		 * @param {Function} [cb]
		 */
	
		exports.append = function (el, target, vm, cb) {
		  apply(el, 1, function () {
		    target.appendChild(el)
		  }, vm, cb)
		}
	
		/**
		 * InsertBefore with transition.
		 *
		 * @param {Element} el
		 * @param {Element} target
		 * @param {Vue} vm
		 * @param {Function} [cb]
		 */
	
		exports.before = function (el, target, vm, cb) {
		  apply(el, 1, function () {
		    _.before(el, target)
		  }, vm, cb)
		}
	
		/**
		 * Remove with transition.
		 *
		 * @param {Element} el
		 * @param {Vue} vm
		 * @param {Function} [cb]
		 */
	
		exports.remove = function (el, vm, cb) {
		  apply(el, -1, function () {
		    _.remove(el)
		  }, vm, cb)
		}
	
		/**
		 * Apply transitions with an operation callback.
		 *
		 * @param {Element} el
		 * @param {Number} direction
		 *                  1: enter
		 *                 -1: leave
		 * @param {Function} op - the actual DOM operation
		 * @param {Vue} vm
		 * @param {Function} [cb]
		 */
	
		var apply = exports.apply = function (el, direction, op, vm, cb) {
		  var transition = el.__v_trans
		  if (
		    !transition ||
		    // skip if there are no js hooks and CSS transition is
		    // not supported
		    (!transition.hooks && !_.transitionEndEvent) ||
		    // skip transitions for initial compile
		    !vm._isCompiled ||
		    // if the vm is being manipulated by a parent directive
		    // during the parent's compilation phase, skip the
		    // animation.
		    (vm.$parent && !vm.$parent._isCompiled)
		  ) {
		    op()
		    if (cb) cb()
		    return
		  }
		  var action = direction > 0 ? 'enter' : 'leave'
		  transition[action](op, cb)
		}
	
	
	/***/ },
	/* 10 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var config = __webpack_require__(5)
		var extend = _.extend
	
		/**
		 * Option overwriting strategies are functions that handle
		 * how to merge a parent option value and a child option
		 * value into the final value.
		 *
		 * All strategy functions follow the same signature:
		 *
		 * @param {*} parentVal
		 * @param {*} childVal
		 * @param {Vue} [vm]
		 */
	
		var strats = config.optionMergeStrategies = Object.create(null)
	
		/**
		 * Helper that recursively merges two data objects together.
		 */
	
		function mergeData (to, from) {
		  var key, toVal, fromVal
		  for (key in from) {
		    toVal = to[key]
		    fromVal = from[key]
		    if (!to.hasOwnProperty(key)) {
		      _.set(to, key, fromVal)
		    } else if (_.isObject(toVal) && _.isObject(fromVal)) {
		      mergeData(toVal, fromVal)
		    }
		  }
		  return to
		}
	
		/**
		 * Data
		 */
	
		strats.data = function (parentVal, childVal, vm) {
		  if (!vm) {
		    // in a Vue.extend merge, both should be functions
		    if (!childVal) {
		      return parentVal
		    }
		    if (typeof childVal !== 'function') {
		      ("development") !== 'production' && _.warn(
		        'The "data" option should be a function ' +
		        'that returns a per-instance value in component ' +
		        'definitions.'
		      )
		      return parentVal
		    }
		    if (!parentVal) {
		      return childVal
		    }
		    // when parentVal & childVal are both present,
		    // we need to return a function that returns the
		    // merged result of both functions... no need to
		    // check if parentVal is a function here because
		    // it has to be a function to pass previous merges.
		    return function mergedDataFn () {
		      return mergeData(
		        childVal.call(this),
		        parentVal.call(this)
		      )
		    }
		  } else if (parentVal || childVal) {
		    return function mergedInstanceDataFn () {
		      // instance merge
		      var instanceData = typeof childVal === 'function'
		        ? childVal.call(vm)
		        : childVal
		      var defaultData = typeof parentVal === 'function'
		        ? parentVal.call(vm)
		        : undefined
		      if (instanceData) {
		        return mergeData(instanceData, defaultData)
		      } else {
		        return defaultData
		      }
		    }
		  }
		}
	
		/**
		 * El
		 */
	
		strats.el = function (parentVal, childVal, vm) {
		  if (!vm && childVal && typeof childVal !== 'function') {
		    ("development") !== 'production' && _.warn(
		      'The "el" option should be a function ' +
		      'that returns a per-instance value in component ' +
		      'definitions.'
		    )
		    return
		  }
		  var ret = childVal || parentVal
		  // invoke the element factory if this is instance merge
		  return vm && typeof ret === 'function'
		    ? ret.call(vm)
		    : ret
		}
	
		/**
		 * Hooks and param attributes are merged as arrays.
		 */
	
		strats.init =
		strats.created =
		strats.ready =
		strats.attached =
		strats.detached =
		strats.beforeCompile =
		strats.compiled =
		strats.beforeDestroy =
		strats.destroyed = function (parentVal, childVal) {
		  return childVal
		    ? parentVal
		      ? parentVal.concat(childVal)
		      : _.isArray(childVal)
		        ? childVal
		        : [childVal]
		    : parentVal
		}
	
		/**
		 * 0.11 deprecation warning
		 */
	
		strats.paramAttributes = function () {
		  /* istanbul ignore next */
		  ("development") !== 'production' && _.warn(
		    '"paramAttributes" option has been deprecated in 0.12. ' +
		    'Use "props" instead.'
		  )
		}
	
		/**
		 * Assets
		 *
		 * When a vm is present (instance creation), we need to do
		 * a three-way merge between constructor options, instance
		 * options and parent options.
		 */
	
		function mergeAssets (parentVal, childVal) {
		  var res = Object.create(parentVal)
		  return childVal
		    ? extend(res, guardArrayAssets(childVal))
		    : res
		}
	
		config._assetTypes.forEach(function (type) {
		  strats[type + 's'] = mergeAssets
		})
	
		/**
		 * Events & Watchers.
		 *
		 * Events & watchers hashes should not overwrite one
		 * another, so we merge them as arrays.
		 */
	
		strats.watch =
		strats.events = function (parentVal, childVal) {
		  if (!childVal) return parentVal
		  if (!parentVal) return childVal
		  var ret = {}
		  extend(ret, parentVal)
		  for (var key in childVal) {
		    var parent = ret[key]
		    var child = childVal[key]
		    if (parent && !_.isArray(parent)) {
		      parent = [parent]
		    }
		    ret[key] = parent
		      ? parent.concat(child)
		      : [child]
		  }
		  return ret
		}
	
		/**
		 * Other object hashes.
		 */
	
		strats.props =
		strats.methods =
		strats.computed = function (parentVal, childVal) {
		  if (!childVal) return parentVal
		  if (!parentVal) return childVal
		  var ret = Object.create(null)
		  extend(ret, parentVal)
		  extend(ret, childVal)
		  return ret
		}
	
		/**
		 * Default strategy.
		 */
	
		var defaultStrat = function (parentVal, childVal) {
		  return childVal === undefined
		    ? parentVal
		    : childVal
		}
	
		/**
		 * Make sure component options get converted to actual
		 * constructors.
		 *
		 * @param {Object} options
		 */
	
		function guardComponents (options) {
		  if (options.components) {
		    var components = options.components =
		      guardArrayAssets(options.components)
		    var def
		    var ids = Object.keys(components)
		    for (var i = 0, l = ids.length; i < l; i++) {
		      var key = ids[i]
		      if (_.commonTagRE.test(key)) {
		        ("development") !== 'production' && _.warn(
		          'Do not use built-in HTML elements as component ' +
		          'id: ' + key
		        )
		        continue
		      }
		      def = components[key]
		      if (_.isPlainObject(def)) {
		        components[key] = _.Vue.extend(def)
		      }
		    }
		  }
		}
	
		/**
		 * Ensure all props option syntax are normalized into the
		 * Object-based format.
		 *
		 * @param {Object} options
		 */
	
		function guardProps (options) {
		  var props = options.props
		  var i
		  if (_.isArray(props)) {
		    options.props = {}
		    i = props.length
		    while (i--) {
		      options.props[props[i]] = null
		    }
		  } else if (_.isPlainObject(props)) {
		    var keys = Object.keys(props)
		    i = keys.length
		    while (i--) {
		      var val = props[keys[i]]
		      if (typeof val === 'function') {
		        props[keys[i]] = { type: val }
		      }
		    }
		  }
		}
	
		/**
		 * Guard an Array-format assets option and converted it
		 * into the key-value Object format.
		 *
		 * @param {Object|Array} assets
		 * @return {Object}
		 */
	
		function guardArrayAssets (assets) {
		  if (_.isArray(assets)) {
		    var res = {}
		    var i = assets.length
		    var asset
		    while (i--) {
		      asset = assets[i]
		      var id = typeof asset === 'function'
		        ? ((asset.options && asset.options.name) || asset.id)
		        : (asset.name || asset.id)
		      if (!id) {
		        ("development") !== 'production' && _.warn(
		          'Array-syntax assets must provide a "name" or "id" field.'
		        )
		      } else {
		        res[id] = asset
		      }
		    }
		    return res
		  }
		  return assets
		}
	
		/**
		 * Merge two option objects into a new one.
		 * Core utility used in both instantiation and inheritance.
		 *
		 * @param {Object} parent
		 * @param {Object} child
		 * @param {Vue} [vm] - if vm is present, indicates this is
		 *                     an instantiation merge.
		 */
	
		exports.mergeOptions = function merge (parent, child, vm) {
		  guardComponents(child)
		  guardProps(child)
		  var options = {}
		  var key
		  if (child.mixins) {
		    for (var i = 0, l = child.mixins.length; i < l; i++) {
		      parent = merge(parent, child.mixins[i], vm)
		    }
		  }
		  for (key in parent) {
		    mergeField(key)
		  }
		  for (key in child) {
		    if (!(parent.hasOwnProperty(key))) {
		      mergeField(key)
		    }
		  }
		  function mergeField (key) {
		    var strat = strats[key] || defaultStrat
		    options[key] = strat(parent[key], child[key], vm, key)
		  }
		  return options
		}
	
		/**
		 * Resolve an asset.
		 * This function is used because child instances need access
		 * to assets defined in its ancestor chain.
		 *
		 * @param {Object} options
		 * @param {String} type
		 * @param {String} id
		 * @return {Object|Function}
		 */
	
		exports.resolveAsset = function resolve (options, type, id) {
		  var assets = options[type]
		  var camelizedId
		  return assets[id] ||
		    // camelCase ID
		    assets[camelizedId = _.camelize(id)] ||
		    // Pascal Case ID
		    assets[camelizedId.charAt(0).toUpperCase() + camelizedId.slice(1)]
		}
	
	
	/***/ },
	/* 11 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
	
		/**
		 * Check if an element is a component, if yes return its
		 * component id.
		 *
		 * @param {Element} el
		 * @param {Object} options
		 * @return {Object|undefined}
		 */
	
		exports.commonTagRE = /^(div|p|span|img|a|b|i|br|ul|ol|li|h1|h2|h3|h4|h5|h6|code|pre|table|th|td|tr|form|label|input|select|option|nav|article|section|header|footer)$/
		exports.checkComponent = function (el, options) {
		  var tag = el.tagName.toLowerCase()
		  var hasAttrs = el.hasAttributes()
		  if (!exports.commonTagRE.test(tag) && tag !== 'component') {
		    if (_.resolveAsset(options, 'components', tag)) {
		      return { id: tag }
		    } else {
		      var is = hasAttrs && getIsBinding(el)
		      if (is) {
		        return is
		      } else if (true) {
		        if (
		          tag.indexOf('-') > -1 ||
		          (
		            /HTMLUnknownElement/.test(el.toString()) &&
		            // Chrome returns unknown for several HTML5 elements.
		            // https://code.google.com/p/chromium/issues/detail?id=540526
		            !/^(data|time|rtc|rb)$/.test(tag)
		          )
		        ) {
		          _.warn(
		            'Unknown custom element: <' + tag + '> - did you ' +
		            'register the component correctly?'
		          )
		        }
		      }
		    }
		  } else if (hasAttrs) {
		    return getIsBinding(el)
		  }
		}
	
		/**
		 * Get "is" binding from an element.
		 *
		 * @param {Element} el
		 * @return {Object|undefined}
		 */
	
		function getIsBinding (el) {
		  // dynamic syntax
		  var exp = _.attr(el, 'is')
		  if (exp != null) {
		    return { id: exp }
		  } else {
		    exp = _.getBindAttr(el, 'is')
		    if (exp != null) {
		      return { id: exp, dynamic: true }
		    }
		  }
		}
	
		/**
		 * Set a prop's initial value on a vm and its data object.
		 *
		 * @param {Vue} vm
		 * @param {Object} prop
		 * @param {*} value
		 */
	
		exports.initProp = function (vm, prop, value) {
		  if (exports.assertProp(prop, value)) {
		    var key = prop.path
		    vm[key] = vm._data[key] = value
		  }
		}
	
		/**
		 * Assert whether a prop is valid.
		 *
		 * @param {Object} prop
		 * @param {*} value
		 */
	
		exports.assertProp = function (prop, value) {
		  // if a prop is not provided and is not required,
		  // skip the check.
		  if (prop.raw === null && !prop.required) {
		    return true
		  }
		  var options = prop.options
		  var type = options.type
		  var valid = true
		  var expectedType
		  if (type) {
		    if (type === String) {
		      expectedType = 'string'
		      valid = typeof value === expectedType
		    } else if (type === Number) {
		      expectedType = 'number'
		      valid = typeof value === 'number'
		    } else if (type === Boolean) {
		      expectedType = 'boolean'
		      valid = typeof value === 'boolean'
		    } else if (type === Function) {
		      expectedType = 'function'
		      valid = typeof value === 'function'
		    } else if (type === Object) {
		      expectedType = 'object'
		      valid = _.isPlainObject(value)
		    } else if (type === Array) {
		      expectedType = 'array'
		      valid = _.isArray(value)
		    } else {
		      valid = value instanceof type
		    }
		  }
		  if (!valid) {
		    ("development") !== 'production' && _.warn(
		      'Invalid prop: type check failed for ' +
		      prop.path + '="' + prop.raw + '".' +
		      ' Expected ' + formatType(expectedType) +
		      ', got ' + formatValue(value) + '.'
		    )
		    return false
		  }
		  var validator = options.validator
		  if (validator) {
		    if (!validator.call(null, value)) {
		      ("development") !== 'production' && _.warn(
		        'Invalid prop: custom validator check failed for ' +
		        prop.path + '="' + prop.raw + '"'
		      )
		      return false
		    }
		  }
		  return true
		}
	
		function formatType (val) {
		  return val
		    ? val.charAt(0).toUpperCase() + val.slice(1)
		    : 'custom type'
		}
	
		function formatValue (val) {
		  return Object.prototype.toString.call(val).slice(8, -1)
		}
	
	
	/***/ },
	/* 12 */
	/***/ function(module, exports, __webpack_require__) {
	
		/**
		 * Enable debug utilities.
		 */
	
		if (true) {
	
		  var config = __webpack_require__(5)
		  var hasConsole = typeof console !== 'undefined'
	
		  /**
		   * Log a message.
		   *
		   * @param {String} msg
		   */
	
		  exports.log = function (msg) {
		    if (hasConsole && config.debug) {
		      console.log('[Vue info]: ' + msg)
		    }
		  }
	
		  /**
		   * We've got a problem here.
		   *
		   * @param {String} msg
		   */
	
		  exports.warn = function (msg, e) {
		    if (hasConsole && (!config.silent || config.debug)) {
		      console.warn('[Vue warn]: ' + msg)
		      /* istanbul ignore if */
		      if (config.debug) {
		        console.warn((e || new Error('Warning Stack Trace')).stack)
		      }
		    }
		  }
	
		  /**
		   * Assert asset exists
		   */
	
		  exports.assertAsset = function (val, type, id) {
		    if (!val) {
		      exports.warn('Failed to resolve ' + type + ': ' + id)
		    }
		  }
		}
	
	
	/***/ },
	/* 13 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var config = __webpack_require__(5)
	
		/**
		 * Expose useful internals
		 */
	
		exports.util = _
		exports.config = config
		exports.set = _.set
		exports.delete = _.delete
		exports.nextTick = _.nextTick
	
		/**
		 * The following are exposed for advanced usage / plugins
		 */
	
		exports.compiler = __webpack_require__(14)
		exports.FragmentFactory = __webpack_require__(21)
		exports.internalDirectives = __webpack_require__(36)
		exports.parsers = {
		  path: __webpack_require__(43),
		  text: __webpack_require__(6),
		  template: __webpack_require__(19),
		  directive: __webpack_require__(8),
		  expression: __webpack_require__(42)
		}
	
		/**
		 * Each instance constructor, including Vue, has a unique
		 * cid. This enables us to create wrapped "child
		 * constructors" for prototypal inheritance and cache them.
		 */
	
		exports.cid = 0
		var cid = 1
	
		/**
		 * Class inheritance
		 *
		 * @param {Object} extendOptions
		 */
	
		exports.extend = function (extendOptions) {
		  extendOptions = extendOptions || {}
		  var Super = this
		  var isFirstExtend = Super.cid === 0
		  if (isFirstExtend && extendOptions._Ctor) {
		    return extendOptions._Ctor
		  }
		  var name = extendOptions.name || Super.options.name
		  var Sub = createClass(name || 'VueComponent')
		  Sub.prototype = Object.create(Super.prototype)
		  Sub.prototype.constructor = Sub
		  Sub.cid = cid++
		  Sub.options = _.mergeOptions(
		    Super.options,
		    extendOptions
		  )
		  Sub['super'] = Super
		  // allow further extension
		  Sub.extend = Super.extend
		  // create asset registers, so extended classes
		  // can have their private assets too.
		  config._assetTypes.forEach(function (type) {
		    Sub[type] = Super[type]
		  })
		  // enable recursive self-lookup
		  if (name) {
		    Sub.options.components[name] = Sub
		  }
		  // cache constructor
		  if (isFirstExtend) {
		    extendOptions._Ctor = Sub
		  }
		  return Sub
		}
	
		/**
		 * A function that returns a sub-class constructor with the
		 * given name. This gives us much nicer output when
		 * logging instances in the console.
		 *
		 * @param {String} name
		 * @return {Function}
		 */
	
		function createClass (name) {
		  return new Function(
		    'return function ' + _.classify(name) +
		    ' (options) { this._init(options) }'
		  )()
		}
	
		/**
		 * Plugin system
		 *
		 * @param {Object} plugin
		 */
	
		exports.use = function (plugin) {
		  /* istanbul ignore if */
		  if (plugin.installed) {
		    return
		  }
		  // additional parameters
		  var args = _.toArray(arguments, 1)
		  args.unshift(this)
		  if (typeof plugin.install === 'function') {
		    plugin.install.apply(plugin, args)
		  } else {
		    plugin.apply(null, args)
		  }
		  plugin.installed = true
		  return this
		}
	
		/**
		 * Apply a global mixin by merging it into the default
		 * options.
		 */
	
		exports.mixin = function (mixin) {
		  var Vue = _.Vue
		  Vue.options = _.mergeOptions(Vue.options, mixin)
		}
	
		/**
		 * Create asset registration methods with the following
		 * signature:
		 *
		 * @param {String} id
		 * @param {*} definition
		 */
	
		config._assetTypes.forEach(function (type) {
		  exports[type] = function (id, definition) {
		    if (!definition) {
		      return this.options[type + 's'][id]
		    } else {
		      /* istanbul ignore if */
		      if (true) {
		        if (type === 'component' && _.commonTagRE.test(id)) {
		          _.warn(
		            'Do not use built-in HTML elements as component ' +
		            'id: ' + id
		          )
		        }
		      }
		      if (
		        type === 'component' &&
		        _.isPlainObject(definition)
		      ) {
		        definition.name = id
		        definition = _.Vue.extend(definition)
		      }
		      this.options[type + 's'][id] = definition
		      return definition
		    }
		  }
		})
	
	
	/***/ },
	/* 14 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
	
		_.extend(exports, __webpack_require__(15))
		_.extend(exports, __webpack_require__(49))
	
	
	/***/ },
	/* 15 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var publicDirectives = __webpack_require__(16)
		var internalDirectives = __webpack_require__(36)
		var compileProps = __webpack_require__(48)
		var textParser = __webpack_require__(6)
		var dirParser = __webpack_require__(8)
		var templateParser = __webpack_require__(19)
		var resolveAsset = _.resolveAsset
	
		// special binding prefixes
		var bindRE = /^v-bind:|^:/
		var onRE = /^v-on:|^@/
		var argRE = /:(.*)$/
		var modifierRE = /\.[^\.]+/g
		var transitionRE = /^(v-bind:|:)?transition$/
	
		// terminal directives
		var terminalDirectives = [
		  'for',
		  'if'
		]
	
		// default directive priority
		var DEFAULT_PRIORITY = 1000
	
		/**
		 * Compile a template and return a reusable composite link
		 * function, which recursively contains more link functions
		 * inside. This top level compile function would normally
		 * be called on instance root nodes, but can also be used
		 * for partial compilation if the partial argument is true.
		 *
		 * The returned composite link function, when called, will
		 * return an unlink function that tearsdown all directives
		 * created during the linking phase.
		 *
		 * @param {Element|DocumentFragment} el
		 * @param {Object} options
		 * @param {Boolean} partial
		 * @return {Function}
		 */
	
		exports.compile = function (el, options, partial) {
		  // link function for the node itself.
		  var nodeLinkFn = partial || !options._asComponent
		    ? compileNode(el, options)
		    : null
		  // link function for the childNodes
		  var childLinkFn =
		    !(nodeLinkFn && nodeLinkFn.terminal) &&
		    el.tagName !== 'SCRIPT' &&
		    el.hasChildNodes()
		      ? compileNodeList(el.childNodes, options)
		      : null
	
		  /**
		   * A composite linker function to be called on a already
		   * compiled piece of DOM, which instantiates all directive
		   * instances.
		   *
		   * @param {Vue} vm
		   * @param {Element|DocumentFragment} el
		   * @param {Vue} [host] - host vm of transcluded content
		   * @param {Object} [scope] - v-for scope
		   * @param {Fragment} [frag] - link context fragment
		   * @return {Function|undefined}
		   */
	
		  return function compositeLinkFn (vm, el, host, scope, frag) {
		    // cache childNodes before linking parent, fix #657
		    var childNodes = _.toArray(el.childNodes)
		    // link
		    var dirs = linkAndCapture(function compositeLinkCapturer () {
		      if (nodeLinkFn) nodeLinkFn(vm, el, host, scope, frag)
		      if (childLinkFn) childLinkFn(vm, childNodes, host, scope, frag)
		    }, vm)
		    return makeUnlinkFn(vm, dirs)
		  }
		}
	
		/**
		 * Apply a linker to a vm/element pair and capture the
		 * directives created during the process.
		 *
		 * @param {Function} linker
		 * @param {Vue} vm
		 */
	
		function linkAndCapture (linker, vm) {
		  var originalDirCount = vm._directives.length
		  linker()
		  var dirs = vm._directives.slice(originalDirCount)
		  dirs.sort(directiveComparator)
		  for (var i = 0, l = dirs.length; i < l; i++) {
		    dirs[i]._bind()
		  }
		  return dirs
		}
	
		/**
		 * Directive priority sort comparator
		 *
		 * @param {Object} a
		 * @param {Object} b
		 */
	
		function directiveComparator (a, b) {
		  a = a.descriptor.def.priority || DEFAULT_PRIORITY
		  b = b.descriptor.def.priority || DEFAULT_PRIORITY
		  return a > b ? -1 : a === b ? 0 : 1
		}
	
		/**
		 * Linker functions return an unlink function that
		 * tearsdown all directives instances generated during
		 * the process.
		 *
		 * We create unlink functions with only the necessary
		 * information to avoid retaining additional closures.
		 *
		 * @param {Vue} vm
		 * @param {Array} dirs
		 * @param {Vue} [context]
		 * @param {Array} [contextDirs]
		 * @return {Function}
		 */
	
		function makeUnlinkFn (vm, dirs, context, contextDirs) {
		  return function unlink (destroying) {
		    teardownDirs(vm, dirs, destroying)
		    if (context && contextDirs) {
		      teardownDirs(context, contextDirs)
		    }
		  }
		}
	
		/**
		 * Teardown partial linked directives.
		 *
		 * @param {Vue} vm
		 * @param {Array} dirs
		 * @param {Boolean} destroying
		 */
	
		function teardownDirs (vm, dirs, destroying) {
		  var i = dirs.length
		  while (i--) {
		    dirs[i]._teardown()
		    if (!destroying) {
		      vm._directives.$remove(dirs[i])
		    }
		  }
		}
	
		/**
		 * Compile link props on an instance.
		 *
		 * @param {Vue} vm
		 * @param {Element} el
		 * @param {Object} props
		 * @param {Object} [scope]
		 * @return {Function}
		 */
	
		exports.compileAndLinkProps = function (vm, el, props, scope) {
		  var propsLinkFn = compileProps(el, props)
		  var propDirs = linkAndCapture(function () {
		    propsLinkFn(vm, scope)
		  }, vm)
		  return makeUnlinkFn(vm, propDirs)
		}
	
		/**
		 * Compile the root element of an instance.
		 *
		 * 1. attrs on context container (context scope)
		 * 2. attrs on the component template root node, if
		 *    replace:true (child scope)
		 *
		 * If this is a fragment instance, we only need to compile 1.
		 *
		 * @param {Vue} vm
		 * @param {Element} el
		 * @param {Object} options
		 * @param {Object} contextOptions
		 * @return {Function}
		 */
	
		exports.compileRoot = function (el, options, contextOptions) {
		  var containerAttrs = options._containerAttrs
		  var replacerAttrs = options._replacerAttrs
		  var contextLinkFn, replacerLinkFn
	
		  // only need to compile other attributes for
		  // non-fragment instances
		  if (el.nodeType !== 11) {
		    // for components, container and replacer need to be
		    // compiled separately and linked in different scopes.
		    if (options._asComponent) {
		      // 2. container attributes
		      if (containerAttrs && contextOptions) {
		        contextLinkFn = compileDirectives(containerAttrs, contextOptions)
		      }
		      if (replacerAttrs) {
		        // 3. replacer attributes
		        replacerLinkFn = compileDirectives(replacerAttrs, options)
		      }
		    } else {
		      // non-component, just compile as a normal element.
		      replacerLinkFn = compileDirectives(el.attributes, options)
		    }
		  } else if (("development") !== 'production' && containerAttrs) {
		    // warn container directives for fragment instances
		    var names = containerAttrs
		      .filter(function (attr) {
		        // allow vue-loader/vueify scoped css attributes
		        return attr.name.indexOf('_v-') < 0 &&
		          // allow event listeners
		          !onRE.test(attr.name) &&
		          // allow slots
		          attr.name !== 'slot'
		      })
		      .map(function (attr) {
		        return '"' + attr.name + '"'
		      })
		    if (names.length) {
		      var plural = names.length > 1
		      _.warn(
		        'Attribute' + (plural ? 's ' : ' ') + names.join(', ') +
		        (plural ? ' are' : ' is') + ' ignored on component ' +
		        '<' + options.el.tagName.toLowerCase() + '> because ' +
		        'the component is a fragment instance: ' +
		        'http://vuejs.org/guide/components.html#Fragment_Instance'
		      )
		    }
		  }
	
		  return function rootLinkFn (vm, el, scope) {
		    // link context scope dirs
		    var context = vm._context
		    var contextDirs
		    if (context && contextLinkFn) {
		      contextDirs = linkAndCapture(function () {
		        contextLinkFn(context, el, null, scope)
		      }, context)
		    }
	
		    // link self
		    var selfDirs = linkAndCapture(function () {
		      if (replacerLinkFn) replacerLinkFn(vm, el)
		    }, vm)
	
		    // return the unlink function that tearsdown context
		    // container directives.
		    return makeUnlinkFn(vm, selfDirs, context, contextDirs)
		  }
		}
	
		/**
		 * Compile a node and return a nodeLinkFn based on the
		 * node type.
		 *
		 * @param {Node} node
		 * @param {Object} options
		 * @return {Function|null}
		 */
	
		function compileNode (node, options) {
		  var type = node.nodeType
		  if (type === 1 && node.tagName !== 'SCRIPT') {
		    return compileElement(node, options)
		  } else if (type === 3 && node.data.trim()) {
		    return compileTextNode(node, options)
		  } else {
		    return null
		  }
		}
	
		/**
		 * Compile an element and return a nodeLinkFn.
		 *
		 * @param {Element} el
		 * @param {Object} options
		 * @return {Function|null}
		 */
	
		function compileElement (el, options) {
		  // preprocess textareas.
		  // textarea treats its text content as the initial value.
		  // just bind it as an attr directive for value.
		  if (el.tagName === 'TEXTAREA') {
		    var tokens = textParser.parse(el.value)
		    if (tokens) {
		      el.setAttribute(':value', textParser.tokensToExp(tokens))
		      el.value = ''
		    }
		  }
		  var linkFn
		  var hasAttrs = el.hasAttributes()
		  // check terminal directives (for & if)
		  if (hasAttrs) {
		    linkFn = checkTerminalDirectives(el, options)
		  }
		  // check element directives
		  if (!linkFn) {
		    linkFn = checkElementDirectives(el, options)
		  }
		  // check component
		  if (!linkFn) {
		    linkFn = checkComponent(el, options)
		  }
		  // normal directives
		  if (!linkFn && hasAttrs) {
		    linkFn = compileDirectives(el.attributes, options)
		  }
		  return linkFn
		}
	
		/**
		 * Compile a textNode and return a nodeLinkFn.
		 *
		 * @param {TextNode} node
		 * @param {Object} options
		 * @return {Function|null} textNodeLinkFn
		 */
	
		function compileTextNode (node, options) {
		  var tokens = textParser.parse(node.data)
		  if (!tokens) {
		    return null
		  }
		  var frag = document.createDocumentFragment()
		  var el, token
		  for (var i = 0, l = tokens.length; i < l; i++) {
		    token = tokens[i]
		    el = token.tag
		      ? processTextToken(token, options)
		      : document.createTextNode(token.value)
		    frag.appendChild(el)
		  }
		  return makeTextNodeLinkFn(tokens, frag, options)
		}
	
		/**
		 * Process a single text token.
		 *
		 * @param {Object} token
		 * @param {Object} options
		 * @return {Node}
		 */
	
		function processTextToken (token, options) {
		  var el
		  if (token.oneTime) {
		    el = document.createTextNode(token.value)
		  } else {
		    if (token.html) {
		      el = document.createComment('v-html')
		      setTokenType('html')
		    } else {
		      // IE will clean up empty textNodes during
		      // frag.cloneNode(true), so we have to give it
		      // something here...
		      el = document.createTextNode(' ')
		      setTokenType('text')
		    }
		  }
		  function setTokenType (type) {
		    if (token.descriptor) return
		    var parsed = dirParser.parse(token.value)
		    token.descriptor = {
		      name: type,
		      def: publicDirectives[type],
		      expression: parsed.expression,
		      filters: parsed.filters
		    }
		  }
		  return el
		}
	
		/**
		 * Build a function that processes a textNode.
		 *
		 * @param {Array<Object>} tokens
		 * @param {DocumentFragment} frag
		 */
	
		function makeTextNodeLinkFn (tokens, frag) {
		  return function textNodeLinkFn (vm, el, host, scope) {
		    var fragClone = frag.cloneNode(true)
		    var childNodes = _.toArray(fragClone.childNodes)
		    var token, value, node
		    for (var i = 0, l = tokens.length; i < l; i++) {
		      token = tokens[i]
		      value = token.value
		      if (token.tag) {
		        node = childNodes[i]
		        if (token.oneTime) {
		          value = (scope || vm).$eval(value)
		          if (token.html) {
		            _.replace(node, templateParser.parse(value, true))
		          } else {
		            node.data = value
		          }
		        } else {
		          vm._bindDir(token.descriptor, node, host, scope)
		        }
		      }
		    }
		    _.replace(el, fragClone)
		  }
		}
	
		/**
		 * Compile a node list and return a childLinkFn.
		 *
		 * @param {NodeList} nodeList
		 * @param {Object} options
		 * @return {Function|undefined}
		 */
	
		function compileNodeList (nodeList, options) {
		  var linkFns = []
		  var nodeLinkFn, childLinkFn, node
		  for (var i = 0, l = nodeList.length; i < l; i++) {
		    node = nodeList[i]
		    nodeLinkFn = compileNode(node, options)
		    childLinkFn =
		      !(nodeLinkFn && nodeLinkFn.terminal) &&
		      node.tagName !== 'SCRIPT' &&
		      node.hasChildNodes()
		        ? compileNodeList(node.childNodes, options)
		        : null
		    linkFns.push(nodeLinkFn, childLinkFn)
		  }
		  return linkFns.length
		    ? makeChildLinkFn(linkFns)
		    : null
		}
	
		/**
		 * Make a child link function for a node's childNodes.
		 *
		 * @param {Array<Function>} linkFns
		 * @return {Function} childLinkFn
		 */
	
		function makeChildLinkFn (linkFns) {
		  return function childLinkFn (vm, nodes, host, scope, frag) {
		    var node, nodeLinkFn, childrenLinkFn
		    for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
		      node = nodes[n]
		      nodeLinkFn = linkFns[i++]
		      childrenLinkFn = linkFns[i++]
		      // cache childNodes before linking parent, fix #657
		      var childNodes = _.toArray(node.childNodes)
		      if (nodeLinkFn) {
		        nodeLinkFn(vm, node, host, scope, frag)
		      }
		      if (childrenLinkFn) {
		        childrenLinkFn(vm, childNodes, host, scope, frag)
		      }
		    }
		  }
		}
	
		/**
		 * Check for element directives (custom elements that should
		 * be resovled as terminal directives).
		 *
		 * @param {Element} el
		 * @param {Object} options
		 */
	
		function checkElementDirectives (el, options) {
		  var tag = el.tagName.toLowerCase()
		  if (_.commonTagRE.test(tag)) return
		  var def = resolveAsset(options, 'elementDirectives', tag)
		  if (def) {
		    return makeTerminalNodeLinkFn(el, tag, '', options, def)
		  }
		}
	
		/**
		 * Check if an element is a component. If yes, return
		 * a component link function.
		 *
		 * @param {Element} el
		 * @param {Object} options
		 * @return {Function|undefined}
		 */
	
		function checkComponent (el, options) {
		  var component = _.checkComponent(el, options)
		  if (component) {
		    var ref = _.findRef(el)
		    var descriptor = {
		      name: 'component',
		      ref: ref,
		      expression: component.id,
		      def: internalDirectives.component,
		      modifiers: {
		        literal: !component.dynamic
		      }
		    }
		    var componentLinkFn = function (vm, el, host, scope, frag) {
		      if (ref) {
		        _.defineReactive((scope || vm).$refs, ref, null)
		      }
		      vm._bindDir(descriptor, el, host, scope, frag)
		    }
		    componentLinkFn.terminal = true
		    return componentLinkFn
		  }
		}
	
		/**
		 * Check an element for terminal directives in fixed order.
		 * If it finds one, return a terminal link function.
		 *
		 * @param {Element} el
		 * @param {Object} options
		 * @return {Function} terminalLinkFn
		 */
	
		function checkTerminalDirectives (el, options) {
		  // skip v-pre
		  if (_.attr(el, 'v-pre') !== null) {
		    return skip
		  }
		  // skip v-else block, but only if following v-if
		  if (el.hasAttribute('v-else')) {
		    var prev = el.previousElementSibling
		    if (prev && prev.hasAttribute('v-if')) {
		      return skip
		    }
		  }
		  var value, dirName
		  for (var i = 0, l = terminalDirectives.length; i < l; i++) {
		    dirName = terminalDirectives[i]
		    /* eslint-disable no-cond-assign */
		    if (value = el.getAttribute('v-' + dirName)) {
		      return makeTerminalNodeLinkFn(el, dirName, value, options)
		    }
		    /* eslint-enable no-cond-assign */
		  }
		}
	
		function skip () {}
		skip.terminal = true
	
		/**
		 * Build a node link function for a terminal directive.
		 * A terminal link function terminates the current
		 * compilation recursion and handles compilation of the
		 * subtree in the directive.
		 *
		 * @param {Element} el
		 * @param {String} dirName
		 * @param {String} value
		 * @param {Object} options
		 * @param {Object} [def]
		 * @return {Function} terminalLinkFn
		 */
	
		function makeTerminalNodeLinkFn (el, dirName, value, options, def) {
		  var parsed = dirParser.parse(value)
		  var descriptor = {
		    name: dirName,
		    expression: parsed.expression,
		    filters: parsed.filters,
		    raw: value,
		    // either an element directive, or if/for
		    def: def || publicDirectives[dirName]
		  }
		  // check ref for v-for and router-view
		  if (dirName === 'for' || dirName === 'router-view') {
		    descriptor.ref = _.findRef(el)
		  }
		  var fn = function terminalNodeLinkFn (vm, el, host, scope, frag) {
		    if (descriptor.ref) {
		      _.defineReactive((scope || vm).$refs, descriptor.ref, null)
		    }
		    vm._bindDir(descriptor, el, host, scope, frag)
		  }
		  fn.terminal = true
		  return fn
		}
	
		/**
		 * Compile the directives on an element and return a linker.
		 *
		 * @param {Array|NamedNodeMap} attrs
		 * @param {Object} options
		 * @return {Function}
		 */
	
		function compileDirectives (attrs, options) {
		  var i = attrs.length
		  var dirs = []
		  var attr, name, value, rawName, rawValue, dirName, arg, modifiers, dirDef, tokens
		  while (i--) {
		    attr = attrs[i]
		    name = rawName = attr.name
		    value = rawValue = attr.value
		    tokens = textParser.parse(value)
		    // reset arg
		    arg = null
		    // check modifiers
		    modifiers = parseModifiers(name)
		    name = name.replace(modifierRE, '')
	
		    // attribute interpolations
		    if (tokens) {
		      value = textParser.tokensToExp(tokens)
		      arg = name
		      pushDir('bind', publicDirectives.bind, true)
		      // warn against mixing mustaches with v-bind
		      if (true) {
		        if (name === 'class' && Array.prototype.some.call(attrs, function (attr) {
		          return attr.name === ':class' || attr.name === 'v-bind:class'
		        })) {
		          _.warn(
		            'class="' + rawValue + '": Do not mix mustache interpolation ' +
		            'and v-bind for "class" on the same element. Use one or the other.'
		          )
		        }
		      }
		    } else
	
		    // special attribute: transition
		    if (transitionRE.test(name)) {
		      modifiers.literal = !bindRE.test(name)
		      pushDir('transition', internalDirectives.transition)
		    } else
	
		    // event handlers
		    if (onRE.test(name)) {
		      arg = name.replace(onRE, '')
		      pushDir('on', publicDirectives.on)
		    } else
	
		    // attribute bindings
		    if (bindRE.test(name)) {
		      dirName = name.replace(bindRE, '')
		      if (dirName === 'style' || dirName === 'class') {
		        pushDir(dirName, internalDirectives[dirName])
		      } else {
		        arg = dirName
		        pushDir('bind', publicDirectives.bind)
		      }
		    } else
	
		    // normal directives
		    if (name.indexOf('v-') === 0) {
		      // check arg
		      arg = (arg = name.match(argRE)) && arg[1]
		      if (arg) {
		        name = name.replace(argRE, '')
		      }
		      // extract directive name
		      dirName = name.slice(2)
	
		      // skip v-else (when used with v-show)
		      if (dirName === 'else') {
		        continue
		      }
	
		      dirDef = resolveAsset(options, 'directives', dirName)
	
		      if (true) {
		        _.assertAsset(dirDef, 'directive', dirName)
		      }
	
		      if (dirDef) {
		        pushDir(dirName, dirDef)
		      }
		    }
		  }
	
		  /**
		   * Push a directive.
		   *
		   * @param {String} dirName
		   * @param {Object|Function} def
		   * @param {Boolean} [interp]
		   */
	
		  function pushDir (dirName, def, interp) {
		    var parsed = dirParser.parse(value)
		    dirs.push({
		      name: dirName,
		      attr: rawName,
		      raw: rawValue,
		      def: def,
		      arg: arg,
		      modifiers: modifiers,
		      expression: parsed.expression,
		      filters: parsed.filters,
		      interp: interp
		    })
		  }
	
		  if (dirs.length) {
		    return makeNodeLinkFn(dirs)
		  }
		}
	
		/**
		 * Parse modifiers from directive attribute name.
		 *
		 * @param {String} name
		 * @return {Object}
		 */
	
		function parseModifiers (name) {
		  var res = Object.create(null)
		  var match = name.match(modifierRE)
		  if (match) {
		    var i = match.length
		    while (i--) {
		      res[match[i].slice(1)] = true
		    }
		  }
		  return res
		}
	
		/**
		 * Build a link function for all directives on a single node.
		 *
		 * @param {Array} directives
		 * @return {Function} directivesLinkFn
		 */
	
		function makeNodeLinkFn (directives) {
		  return function nodeLinkFn (vm, el, host, scope, frag) {
		    // reverse apply because it's sorted low to high
		    var i = directives.length
		    while (i--) {
		      vm._bindDir(directives[i], el, host, scope, frag)
		    }
		  }
		}
	
	
	/***/ },
	/* 16 */
	/***/ function(module, exports, __webpack_require__) {
	
		// text & html
		exports.text = __webpack_require__(17)
		exports.html = __webpack_require__(18)
	
		// logic control
		exports['for'] = __webpack_require__(20)
		exports['if'] = __webpack_require__(23)
		exports.show = __webpack_require__(24)
	
		// two-way binding
		exports.model = __webpack_require__(25)
	
		// event handling
		exports.on = __webpack_require__(30)
	
		// attributes
		exports.bind = __webpack_require__(31)
	
		// ref & el
		exports.el = __webpack_require__(33)
		exports.ref = __webpack_require__(34)
	
		// cloak
		exports.cloak = __webpack_require__(35)
	
	
	/***/ },
	/* 17 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
	
		module.exports = {
	
		  bind: function () {
		    this.attr = this.el.nodeType === 3
		      ? 'data'
		      : 'textContent'
		  },
	
		  update: function (value) {
		    this.el[this.attr] = _.toString(value)
		  }
		}
	
	
	/***/ },
	/* 18 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var templateParser = __webpack_require__(19)
	
		module.exports = {
	
		  bind: function () {
		    // a comment node means this is a binding for
		    // {{{ inline unescaped html }}}
		    if (this.el.nodeType === 8) {
		      // hold nodes
		      this.nodes = []
		      // replace the placeholder with proper anchor
		      this.anchor = _.createAnchor('v-html')
		      _.replace(this.el, this.anchor)
		    }
		  },
	
		  update: function (value) {
		    value = _.toString(value)
		    if (this.nodes) {
		      this.swap(value)
		    } else {
		      this.el.innerHTML = value
		    }
		  },
	
		  swap: function (value) {
		    // remove old nodes
		    var i = this.nodes.length
		    while (i--) {
		      _.remove(this.nodes[i])
		    }
		    // convert new value to a fragment
		    // do not attempt to retrieve from id selector
		    var frag = templateParser.parse(value, true, true)
		    // save a reference to these nodes so we can remove later
		    this.nodes = _.toArray(frag.childNodes)
		    _.before(frag, this.anchor)
		  }
		}
	
	
	/***/ },
	/* 19 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var Cache = __webpack_require__(7)
		var templateCache = new Cache(1000)
		var idSelectorCache = new Cache(1000)
	
		var map = {
		  _default: [0, '', ''],
		  legend: [1, '<fieldset>', '</fieldset>'],
		  tr: [2, '<table><tbody>', '</tbody></table>'],
		  col: [
		    2,
		    '<table><tbody></tbody><colgroup>',
		    '</colgroup></table>'
		  ]
		}
	
		map.td =
		map.th = [
		  3,
		  '<table><tbody><tr>',
		  '</tr></tbody></table>'
		]
	
		map.option =
		map.optgroup = [
		  1,
		  '<select multiple="multiple">',
		  '</select>'
		]
	
		map.thead =
		map.tbody =
		map.colgroup =
		map.caption =
		map.tfoot = [1, '<table>', '</table>']
	
		map.g =
		map.defs =
		map.symbol =
		map.use =
		map.image =
		map.text =
		map.circle =
		map.ellipse =
		map.line =
		map.path =
		map.polygon =
		map.polyline =
		map.rect = [
		  1,
		  '<svg ' +
		    'xmlns="http://www.w3.org/2000/svg" ' +
		    'xmlns:xlink="http://www.w3.org/1999/xlink" ' +
		    'xmlns:ev="http://www.w3.org/2001/xml-events"' +
		    'version="1.1">',
		  '</svg>'
		]
	
		/**
		 * Check if a node is a supported template node with a
		 * DocumentFragment content.
		 *
		 * @param {Node} node
		 * @return {Boolean}
		 */
	
		function isRealTemplate (node) {
		  return _.isTemplate(node) &&
		    node.content instanceof DocumentFragment
		}
	
		var tagRE = /<([\w:]+)/
		var entityRE = /&\w+;|&#\d+;|&#x[\dA-F]+;/
	
		/**
		 * Convert a string template to a DocumentFragment.
		 * Determines correct wrapping by tag types. Wrapping
		 * strategy found in jQuery & component/domify.
		 *
		 * @param {String} templateString
		 * @return {DocumentFragment}
		 */
	
		function stringToFragment (templateString) {
		  // try a cache hit first
		  var hit = templateCache.get(templateString)
		  if (hit) {
		    return hit
		  }
	
		  var frag = document.createDocumentFragment()
		  var tagMatch = templateString.match(tagRE)
		  var entityMatch = entityRE.test(templateString)
	
		  if (!tagMatch && !entityMatch) {
		    // text only, return a single text node.
		    frag.appendChild(
		      document.createTextNode(templateString)
		    )
		  } else {
	
		    var tag = tagMatch && tagMatch[1]
		    var wrap = map[tag] || map._default
		    var depth = wrap[0]
		    var prefix = wrap[1]
		    var suffix = wrap[2]
		    var node = document.createElement('div')
	
		    node.innerHTML = prefix + templateString.trim() + suffix
		    while (depth--) {
		      node = node.lastChild
		    }
	
		    var child
		    /* eslint-disable no-cond-assign */
		    while (child = node.firstChild) {
		    /* eslint-enable no-cond-assign */
		      frag.appendChild(child)
		    }
		  }
	
		  templateCache.put(templateString, frag)
		  return frag
		}
	
		/**
		 * Convert a template node to a DocumentFragment.
		 *
		 * @param {Node} node
		 * @return {DocumentFragment}
		 */
	
		function nodeToFragment (node) {
		  // if its a template tag and the browser supports it,
		  // its content is already a document fragment.
		  if (isRealTemplate(node)) {
		    _.trimNode(node.content)
		    return node.content
		  }
		  // script template
		  if (node.tagName === 'SCRIPT') {
		    return stringToFragment(node.textContent)
		  }
		  // normal node, clone it to avoid mutating the original
		  var clone = exports.clone(node)
		  var frag = document.createDocumentFragment()
		  var child
		  /* eslint-disable no-cond-assign */
		  while (child = clone.firstChild) {
		  /* eslint-enable no-cond-assign */
		    frag.appendChild(child)
		  }
		  _.trimNode(frag)
		  return frag
		}
	
		// Test for the presence of the Safari template cloning bug
		// https://bugs.webkit.org/show_bug.cgi?id=137755
		var hasBrokenTemplate = (function () {
		  /* istanbul ignore else */
		  if (_.inBrowser) {
		    var a = document.createElement('div')
		    a.innerHTML = '<template>1</template>'
		    return !a.cloneNode(true).firstChild.innerHTML
		  } else {
		    return false
		  }
		})()
	
		// Test for IE10/11 textarea placeholder clone bug
		var hasTextareaCloneBug = (function () {
		  /* istanbul ignore else */
		  if (_.inBrowser) {
		    var t = document.createElement('textarea')
		    t.placeholder = 't'
		    return t.cloneNode(true).value === 't'
		  } else {
		    return false
		  }
		})()
	
		/**
		 * 1. Deal with Safari cloning nested <template> bug by
		 *    manually cloning all template instances.
		 * 2. Deal with IE10/11 textarea placeholder bug by setting
		 *    the correct value after cloning.
		 *
		 * @param {Element|DocumentFragment} node
		 * @return {Element|DocumentFragment}
		 */
	
		exports.clone = function (node) {
		  if (!node.querySelectorAll) {
		    return node.cloneNode()
		  }
		  var res = node.cloneNode(true)
		  var i, original, cloned
		  /* istanbul ignore if */
		  if (hasBrokenTemplate) {
		    var clone = res
		    if (isRealTemplate(node)) {
		      node = node.content
		      clone = res.content
		    }
		    original = node.querySelectorAll('template')
		    if (original.length) {
		      cloned = clone.querySelectorAll('template')
		      i = cloned.length
		      while (i--) {
		        cloned[i].parentNode.replaceChild(
		          exports.clone(original[i]),
		          cloned[i]
		        )
		      }
		    }
		  }
		  /* istanbul ignore if */
		  if (hasTextareaCloneBug) {
		    if (node.tagName === 'TEXTAREA') {
		      res.value = node.value
		    } else {
		      original = node.querySelectorAll('textarea')
		      if (original.length) {
		        cloned = res.querySelectorAll('textarea')
		        i = cloned.length
		        while (i--) {
		          cloned[i].value = original[i].value
		        }
		      }
		    }
		  }
		  return res
		}
	
		/**
		 * Process the template option and normalizes it into a
		 * a DocumentFragment that can be used as a partial or a
		 * instance template.
		 *
		 * @param {*} template
		 *    Possible values include:
		 *    - DocumentFragment object
		 *    - Node object of type Template
		 *    - id selector: '#some-template-id'
		 *    - template string: '<div><span>{{msg}}</span></div>'
		 * @param {Boolean} clone
		 * @param {Boolean} noSelector
		 * @return {DocumentFragment|undefined}
		 */
	
		exports.parse = function (template, clone, noSelector) {
		  var node, frag
	
		  // if the template is already a document fragment,
		  // do nothing
		  if (template instanceof DocumentFragment) {
		    _.trimNode(template)
		    return clone
		      ? exports.clone(template)
		      : template
		  }
	
		  if (typeof template === 'string') {
		    // id selector
		    if (!noSelector && template.charAt(0) === '#') {
		      // id selector can be cached too
		      frag = idSelectorCache.get(template)
		      if (!frag) {
		        node = document.getElementById(template.slice(1))
		        if (node) {
		          frag = nodeToFragment(node)
		          // save selector to cache
		          idSelectorCache.put(template, frag)
		        }
		      }
		    } else {
		      // normal string template
		      frag = stringToFragment(template)
		    }
		  } else if (template.nodeType) {
		    // a direct node
		    frag = nodeToFragment(template)
		  }
	
		  return frag && clone
		    ? exports.clone(frag)
		    : frag
		}
	
	
	/***/ },
	/* 20 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var FragmentFactory = __webpack_require__(21)
		var isObject = _.isObject
		var uid = 0
	
		module.exports = {
	
		  priority: 2000,
	
		  params: [
		    'track-by',
		    'stagger',
		    'enter-stagger',
		    'leave-stagger'
		  ],
	
		  bind: function () {
		    // support "item in items" syntax
		    var inMatch = this.expression.match(/(.*) in (.*)/)
		    if (inMatch) {
		      var itMatch = inMatch[1].match(/\((.*),(.*)\)/)
		      if (itMatch) {
		        this.iterator = itMatch[1].trim()
		        this.alias = itMatch[2].trim()
		      } else {
		        this.alias = inMatch[1].trim()
		      }
		      this.expression = inMatch[2]
		    }
	
		    if (!this.alias) {
		      ("development") !== 'production' && _.warn(
		        'Alias is required in v-for.'
		      )
		      return
		    }
	
		    // uid as a cache identifier
		    this.id = '__v-for__' + (++uid)
	
		    // check if this is an option list,
		    // so that we know if we need to update the <select>'s
		    // v-model when the option list has changed.
		    // because v-model has a lower priority than v-for,
		    // the v-model is not bound here yet, so we have to
		    // retrive it in the actual updateModel() function.
		    var tag = this.el.tagName
		    this.isOption =
		      (tag === 'OPTION' || tag === 'OPTGROUP') &&
		      this.el.parentNode.tagName === 'SELECT'
	
		    // setup anchor nodes
		    this.start = _.createAnchor('v-for-start')
		    this.end = _.createAnchor('v-for-end')
		    _.replace(this.el, this.end)
		    _.before(this.start, this.end)
	
		    // cache
		    this.cache = Object.create(null)
	
		    // fragment factory
		    this.factory = new FragmentFactory(this.vm, this.el)
		  },
	
		  update: function (data) {
		    this.diff(data)
		    this.updateRef()
		    this.updateModel()
		  },
	
		  /**
		   * Diff, based on new data and old data, determine the
		   * minimum amount of DOM manipulations needed to make the
		   * DOM reflect the new data Array.
		   *
		   * The algorithm diffs the new data Array by storing a
		   * hidden reference to an owner vm instance on previously
		   * seen data. This allows us to achieve O(n) which is
		   * better than a levenshtein distance based algorithm,
		   * which is O(m * n).
		   *
		   * @param {Array} data
		   */
	
		  diff: function (data) {
		    // check if the Array was converted from an Object
		    var item = data[0]
		    var convertedFromObject = this.fromObject =
		      isObject(item) &&
		      item.hasOwnProperty('$key') &&
		      item.hasOwnProperty('$value')
	
		    var trackByKey = this.params.trackBy
		    var oldFrags = this.frags
		    var frags = this.frags = new Array(data.length)
		    var alias = this.alias
		    var iterator = this.iterator
		    var start = this.start
		    var end = this.end
		    var inDoc = _.inDoc(start)
		    var init = !oldFrags
		    var i, l, frag, key, value, primitive
	
		    // First pass, go through the new Array and fill up
		    // the new frags array. If a piece of data has a cached
		    // instance for it, we reuse it. Otherwise build a new
		    // instance.
		    for (i = 0, l = data.length; i < l; i++) {
		      item = data[i]
		      key = convertedFromObject ? item.$key : null
		      value = convertedFromObject ? item.$value : item
		      primitive = !isObject(value)
		      frag = !init && this.getCachedFrag(value, i, key)
		      if (frag) { // reusable fragment
		        frag.reused = true
		        // update $index
		        frag.scope.$index = i
		        // update $key
		        if (key) {
		          frag.scope.$key = key
		        }
		        // update iterator
		        if (iterator) {
		          frag.scope[iterator] = key !== null ? key : i
		        }
		        // update data for track-by, object repeat &
		        // primitive values.
		        if (trackByKey || convertedFromObject || primitive) {
		          frag.scope[alias] = value
		        }
		      } else { // new isntance
		        frag = this.create(value, alias, i, key)
		        frag.fresh = !init
		      }
		      frags[i] = frag
		      if (init) {
		        frag.before(end)
		      }
		    }
	
		    // we're done for the initial render.
		    if (init) {
		      return
		    }
	
		    // Second pass, go through the old fragments and
		    // destroy those who are not reused (and remove them
		    // from cache)
		    var removalIndex = 0
		    var totalRemoved = oldFrags.length - frags.length
		    for (i = 0, l = oldFrags.length; i < l; i++) {
		      frag = oldFrags[i]
		      if (!frag.reused) {
		        this.deleteCachedFrag(frag)
		        this.remove(frag, removalIndex++, totalRemoved, inDoc)
		      }
		    }
	
		    // Final pass, move/insert new fragments into the
		    // right place.
		    var targetPrev, prevEl, currentPrev
		    var insertionIndex = 0
		    for (i = 0, l = frags.length; i < l; i++) {
		      frag = frags[i]
		      // this is the frag that we should be after
		      targetPrev = frags[i - 1]
		      prevEl = targetPrev
		        ? targetPrev.staggerCb
		          ? targetPrev.staggerAnchor
		          : targetPrev.end || targetPrev.node
		        : start
		      if (frag.reused && !frag.staggerCb) {
		        currentPrev = findPrevFrag(frag, start, this.id)
		        if (currentPrev !== targetPrev) {
		          this.move(frag, prevEl)
		        }
		      } else {
		        // new instance, or still in stagger.
		        // insert with updated stagger index.
		        this.insert(frag, insertionIndex++, prevEl, inDoc)
		      }
		      frag.reused = frag.fresh = false
		    }
		  },
	
		  /**
		   * Create a new fragment instance.
		   *
		   * @param {*} value
		   * @param {String} alias
		   * @param {Number} index
		   * @param {String} [key]
		   * @return {Fragment}
		   */
	
		  create: function (value, alias, index, key) {
		    var host = this._host
		    // create iteration scope
		    var parentScope = this._scope || this.vm
		    var scope = Object.create(parentScope)
		    // ref holder for the scope
		    scope.$refs = Object.create(parentScope.$refs)
		    scope.$els = Object.create(parentScope.$els)
		    // make sure point $parent to parent scope
		    scope.$parent = parentScope
		    // for two-way binding on alias
		    scope.$forContext = this
		    // define scope properties
		    _.defineReactive(scope, alias, value)
		    _.defineReactive(scope, '$index', index)
		    if (key) {
		      _.defineReactive(scope, '$key', key)
		    } else if (scope.$key) {
		      // avoid accidental fallback
		      _.define(scope, '$key', null)
		    }
		    if (this.iterator) {
		      _.defineReactive(scope, this.iterator, key !== null ? key : index)
		    }
		    var frag = this.factory.create(host, scope, this._frag)
		    frag.forId = this.id
		    this.cacheFrag(value, frag, index, key)
		    return frag
		  },
	
		  /**
		   * Update the v-ref on owner vm.
		   */
	
		  updateRef: function () {
		    var ref = this.descriptor.ref
		    if (!ref) return
		    var hash = (this._scope || this.vm).$refs
		    var refs
		    if (!this.fromObject) {
		      refs = this.frags.map(findVmFromFrag)
		    } else {
		      refs = {}
		      this.frags.forEach(function (frag) {
		        refs[frag.scope.$key] = findVmFromFrag(frag)
		      })
		    }
		    hash[ref] = refs
		  },
	
		  /**
		   * For option lists, update the containing v-model on
		   * parent <select>.
		   */
	
		  updateModel: function () {
		    if (this.isOption) {
		      var parent = this.start.parentNode
		      var model = parent && parent.__v_model
		      if (model) {
		        model.forceUpdate()
		      }
		    }
		  },
	
		  /**
		   * Insert a fragment. Handles staggering.
		   *
		   * @param {Fragment} frag
		   * @param {Number} index
		   * @param {Node} prevEl
		   * @param {Boolean} inDoc
		   */
	
		  insert: function (frag, index, prevEl, inDoc) {
		    if (frag.staggerCb) {
		      frag.staggerCb.cancel()
		      frag.staggerCb = null
		    }
		    var staggerAmount = this.getStagger(frag, index, null, 'enter')
		    if (inDoc && staggerAmount) {
		      // create an anchor and insert it synchronously,
		      // so that we can resolve the correct order without
		      // worrying about some elements not inserted yet
		      var anchor = frag.staggerAnchor
		      if (!anchor) {
		        anchor = frag.staggerAnchor = _.createAnchor('stagger-anchor')
		        anchor.__vfrag__ = frag
		      }
		      _.after(anchor, prevEl)
		      var op = frag.staggerCb = _.cancellable(function () {
		        frag.staggerCb = null
		        frag.before(anchor)
		        _.remove(anchor)
		      })
		      setTimeout(op, staggerAmount)
		    } else {
		      frag.before(prevEl.nextSibling)
		    }
		  },
	
		  /**
		   * Remove a fragment. Handles staggering.
		   *
		   * @param {Fragment} frag
		   * @param {Number} index
		   * @param {Number} total
		   * @param {Boolean} inDoc
		   */
	
		  remove: function (frag, index, total, inDoc) {
		    if (frag.staggerCb) {
		      frag.staggerCb.cancel()
		      frag.staggerCb = null
		      // it's not possible for the same frag to be removed
		      // twice, so if we have a pending stagger callback,
		      // it means this frag is queued for enter but removed
		      // before its transition started. Since it is already
		      // destroyed, we can just leave it in detached state.
		      return
		    }
		    var staggerAmount = this.getStagger(frag, index, total, 'leave')
		    if (inDoc && staggerAmount) {
		      var op = frag.staggerCb = _.cancellable(function () {
		        frag.staggerCb = null
		        frag.remove()
		      })
		      setTimeout(op, staggerAmount)
		    } else {
		      frag.remove()
		    }
		  },
	
		  /**
		   * Move a fragment to a new position.
		   * Force no transition.
		   *
		   * @param {Fragment} frag
		   * @param {Node} prevEl
		   */
	
		  move: function (frag, prevEl) {
		    frag.before(prevEl.nextSibling, false)
		  },
	
		  /**
		   * Cache a fragment using track-by or the object key.
		   *
		   * @param {*} value
		   * @param {Fragment} frag
		   * @param {Number} index
		   * @param {String} [key]
		   */
	
		  cacheFrag: function (value, frag, index, key) {
		    var trackByKey = this.params.trackBy
		    var cache = this.cache
		    var primitive = !isObject(value)
		    var id
		    if (key || trackByKey || primitive) {
		      id = trackByKey
		        ? trackByKey === '$index'
		          ? index
		          : value[trackByKey]
		        : (key || value)
		      if (!cache[id]) {
		        cache[id] = frag
		      } else if (trackByKey !== '$index') {
		        ("development") !== 'production' &&
		        this.warnDuplicate(value)
		      }
		    } else {
		      id = this.id
		      if (value.hasOwnProperty(id)) {
		        if (value[id] === null) {
		          value[id] = frag
		        } else {
		          ("development") !== 'production' &&
		          this.warnDuplicate(value)
		        }
		      } else {
		        _.define(value, id, frag)
		      }
		    }
		    frag.raw = value
		  },
	
		  /**
		   * Get a cached fragment from the value/index/key
		   *
		   * @param {*} value
		   * @param {Number} index
		   * @param {String} key
		   * @return {Fragment}
		   */
	
		  getCachedFrag: function (value, index, key) {
		    var trackByKey = this.params.trackBy
		    var primitive = !isObject(value)
		    var frag
		    if (key || trackByKey || primitive) {
		      var id = trackByKey
		        ? trackByKey === '$index'
		          ? index
		          : value[trackByKey]
		        : (key || value)
		      frag = this.cache[id]
		    } else {
		      frag = value[this.id]
		    }
		    if (frag && (frag.reused || frag.fresh)) {
		      ("development") !== 'production' &&
		      this.warnDuplicate(value)
		    }
		    return frag
		  },
	
		  /**
		   * Delete a fragment from cache.
		   *
		   * @param {Fragment} frag
		   */
	
		  deleteCachedFrag: function (frag) {
		    var value = frag.raw
		    var trackByKey = this.params.trackBy
		    var scope = frag.scope
		    var index = scope.$index
		    // fix #948: avoid accidentally fall through to
		    // a parent repeater which happens to have $key.
		    var key = scope.hasOwnProperty('$key') && scope.$key
		    var primitive = !isObject(value)
		    if (trackByKey || key || primitive) {
		      var id = trackByKey
		        ? trackByKey === '$index'
		          ? index
		          : value[trackByKey]
		        : (key || value)
		      this.cache[id] = null
		    } else {
		      value[this.id] = null
		      frag.raw = null
		    }
		  },
	
		  /**
		   * Get the stagger amount for an insertion/removal.
		   *
		   * @param {Fragment} frag
		   * @param {Number} index
		   * @param {Number} total
		   * @param {String} type
		   */
	
		  getStagger: function (frag, index, total, type) {
		    type = type + 'Stagger'
		    var trans = frag.node.__v_trans
		    var hooks = trans && trans.hooks
		    var hook = hooks && (hooks[type] || hooks.stagger)
		    return hook
		      ? hook.call(frag, index, total)
		      : index * parseInt(this.params[type] || this.params.stagger, 10)
		  },
	
		  /**
		   * Pre-process the value before piping it through the
		   * filters. This is passed to and called by the watcher.
		   */
	
		  _preProcess: function (value) {
		    // regardless of type, store the un-filtered raw value.
		    this.rawValue = value
		    return value
		  },
	
		  /**
		   * Post-process the value after it has been piped through
		   * the filters. This is passed to and called by the watcher.
		   *
		   * It is necessary for this to be called during the
		   * wathcer's dependency collection phase because we want
		   * the v-for to update when the source Object is mutated.
		   */
	
		  _postProcess: function (value) {
		    if (_.isArray(value)) {
		      return value
		    } else if (_.isPlainObject(value)) {
		      // convert plain object to array.
		      var keys = Object.keys(value)
		      var i = keys.length
		      var res = new Array(i)
		      var key
		      while (i--) {
		        key = keys[i]
		        res[i] = {
		          $key: key,
		          $value: value[key]
		        }
		      }
		      return res
		    } else {
		      if (typeof value === 'number') {
		        value = range(value)
		      }
		      return value || []
		    }
		  },
	
		  unbind: function () {
		    if (this.descriptor.ref) {
		      (this._scope || this.vm).$refs[this.descriptor.ref] = null
		    }
		    if (this.frags) {
		      var i = this.frags.length
		      var frag
		      while (i--) {
		        frag = this.frags[i]
		        this.deleteCachedFrag(frag)
		        frag.destroy()
		      }
		    }
		  }
		}
	
		/**
		 * Helper to find the previous element that is a fragment
		 * anchor. This is necessary because a destroyed frag's
		 * element could still be lingering in the DOM before its
		 * leaving transition finishes, but its inserted flag
		 * should have been set to false so we can skip them.
		 *
		 * If this is a block repeat, we want to make sure we only
		 * return frag that is bound to this v-for. (see #929)
		 *
		 * @param {Fragment} frag
		 * @param {Comment|Text} anchor
		 * @param {String} id
		 * @return {Fragment}
		 */
	
		function findPrevFrag (frag, anchor, id) {
		  var el = frag.node.previousSibling
		  /* istanbul ignore if */
		  if (!el) return
		  frag = el.__vfrag__
		  while (
		    (!frag || frag.forId !== id || !frag.inserted) &&
		    el !== anchor
		  ) {
		    el = el.previousSibling
		    /* istanbul ignore if */
		    if (!el) return
		    frag = el.__vfrag__
		  }
		  return frag
		}
	
		/**
		 * Find a vm from a fragment.
		 *
		 * @param {Fragment} frag
		 * @return {Vue|undefined}
		 */
	
		function findVmFromFrag (frag) {
		  return frag.node.__vue__ || frag.node.nextSibling.__vue__
		}
	
		/**
		 * Create a range array from given number.
		 *
		 * @param {Number} n
		 * @return {Array}
		 */
	
		function range (n) {
		  var i = -1
		  var ret = new Array(n)
		  while (++i < n) {
		    ret[i] = i
		  }
		  return ret
		}
	
		if (true) {
		  module.exports.warnDuplicate = function (value) {
		    _.warn(
		      'Duplicate value found in v-for="' + this.descriptor.raw + '": ' +
		      JSON.stringify(value) + '. Use track-by="$index" if ' +
		      'you are expecting duplicate values.'
		    )
		  }
		}
	
	
	/***/ },
	/* 21 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var compiler = __webpack_require__(14)
		var templateParser = __webpack_require__(19)
		var Fragment = __webpack_require__(22)
		var Cache = __webpack_require__(7)
		var linkerCache = new Cache(5000)
	
		/**
		 * A factory that can be used to create instances of a
		 * fragment. Caches the compiled linker if possible.
		 *
		 * @param {Vue} vm
		 * @param {Element|String} el
		 */
	
		function FragmentFactory (vm, el) {
		  this.vm = vm
		  var template
		  var isString = typeof el === 'string'
		  if (isString || _.isTemplate(el)) {
		    template = templateParser.parse(el, true)
		  } else {
		    template = document.createDocumentFragment()
		    template.appendChild(el)
		  }
		  this.template = template
		  // linker can be cached, but only for components
		  var linker
		  var cid = vm.constructor.cid
		  if (cid > 0) {
		    var cacheId = cid + (isString ? el : el.outerHTML)
		    linker = linkerCache.get(cacheId)
		    if (!linker) {
		      linker = compiler.compile(template, vm.$options, true)
		      linkerCache.put(cacheId, linker)
		    }
		  } else {
		    linker = compiler.compile(template, vm.$options, true)
		  }
		  this.linker = linker
		}
	
		/**
		 * Create a fragment instance with given host and scope.
		 *
		 * @param {Vue} host
		 * @param {Object} scope
		 * @param {Fragment} parentFrag
		 */
	
		FragmentFactory.prototype.create = function (host, scope, parentFrag) {
		  var frag = templateParser.clone(this.template)
		  return new Fragment(this.linker, this.vm, frag, host, scope, parentFrag)
		}
	
		module.exports = FragmentFactory
	
	
	/***/ },
	/* 22 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var transition = __webpack_require__(9)
	
		/**
		 * Abstraction for a partially-compiled fragment.
		 * Can optionally compile content with a child scope.
		 *
		 * @param {Function} linker
		 * @param {Vue} vm
		 * @param {DocumentFragment} frag
		 * @param {Vue} [host]
		 * @param {Object} [scope]
		 */
	
		function Fragment (linker, vm, frag, host, scope, parentFrag) {
		  this.children = []
		  this.childFrags = []
		  this.vm = vm
		  this.scope = scope
		  this.inserted = false
		  this.parentFrag = parentFrag
		  if (parentFrag) {
		    parentFrag.childFrags.push(this)
		  }
		  this.unlink = linker(vm, frag, host, scope, this)
		  var single = this.single = frag.childNodes.length === 1
		  if (single) {
		    this.node = frag.childNodes[0]
		    this.before = singleBefore
		    this.remove = singleRemove
		  } else {
		    this.node = _.createAnchor('fragment-start')
		    this.end = _.createAnchor('fragment-end')
		    this.frag = frag
		    _.prepend(this.node, frag)
		    frag.appendChild(this.end)
		    this.before = multiBefore
		    this.remove = multiRemove
		  }
		  this.node.__vfrag__ = this
		}
	
		/**
		 * Call attach/detach for all components contained within
		 * this fragment. Also do so recursively for all child
		 * fragments.
		 *
		 * @param {Function} hook
		 */
	
		Fragment.prototype.callHook = function (hook) {
		  var i, l
		  for (i = 0, l = this.children.length; i < l; i++) {
		    hook(this.children[i])
		  }
		  for (i = 0, l = this.childFrags.length; i < l; i++) {
		    this.childFrags[i].callHook(hook)
		  }
		}
	
		/**
		 * Destroy the fragment.
		 */
	
		Fragment.prototype.destroy = function () {
		  if (this.parentFrag) {
		    this.parentFrag.childFrags.$remove(this)
		  }
		  this.unlink()
		}
	
		/**
		 * Insert fragment before target, single node version
		 *
		 * @param {Node} target
		 * @param {Boolean} withTransition
		 */
	
		function singleBefore (target, withTransition) {
		  this.inserted = true
		  var method = withTransition !== false
		    ? transition.before
		    : _.before
		  method(this.node, target, this.vm)
		  if (_.inDoc(this.node)) {
		    this.callHook(attach)
		  }
		}
	
		/**
		 * Remove fragment, single node version
		 */
	
		function singleRemove () {
		  this.inserted = false
		  var shouldCallRemove = _.inDoc(this.node)
		  var self = this
		  self.callHook(destroyChild)
		  transition.remove(this.node, this.vm, function () {
		    if (shouldCallRemove) {
		      self.callHook(detach)
		    }
		    self.destroy()
		  })
		}
	
		/**
		 * Insert fragment before target, multi-nodes version
		 *
		 * @param {Node} target
		 * @param {Boolean} withTransition
		 */
	
		function multiBefore (target, withTransition) {
		  this.inserted = true
		  var vm = this.vm
		  var method = withTransition !== false
		    ? transition.before
		    : _.before
		  _.mapNodeRange(this.node, this.end, function (node) {
		    method(node, target, vm)
		  })
		  if (_.inDoc(this.node)) {
		    this.callHook(attach)
		  }
		}
	
		/**
		 * Remove fragment, multi-nodes version
		 */
	
		function multiRemove () {
		  this.inserted = false
		  var self = this
		  var shouldCallRemove = _.inDoc(this.node)
		  self.callHook(destroyChild)
		  _.removeNodeRange(this.node, this.end, this.vm, this.frag, function () {
		    if (shouldCallRemove) {
		      self.callHook(detach)
		    }
		    self.destroy()
		  })
		}
	
		/**
		 * Call attach hook for a Vue instance.
		 *
		 * @param {Vue} child
		 */
	
		function attach (child) {
		  if (!child._isAttached) {
		    child._callHook('attached')
		  }
		}
	
		/**
		 * Call destroy for all contained instances,
		 * with remove:false and defer:true.
		 * Defer is necessary because we need to
		 * keep the children to call detach hooks
		 * on them.
		 *
		 * @param {Vue} child
		 */
	
		function destroyChild (child) {
		  child.$destroy(false, true)
		}
	
		/**
		 * Call detach hook for a Vue instance.
		 *
		 * @param {Vue} child
		 */
	
		function detach (child) {
		  if (child._isAttached) {
		    child._callHook('detached')
		  }
		}
	
		module.exports = Fragment
	
	
	/***/ },
	/* 23 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var FragmentFactory = __webpack_require__(21)
	
		module.exports = {
	
		  priority: 2000,
	
		  bind: function () {
		    var el = this.el
		    if (!el.__vue__) {
		      // check else block
		      var next = el.nextElementSibling
		      if (next && _.attr(next, 'v-else') !== null) {
		        _.remove(next)
		        this.elseFactory = new FragmentFactory(this.vm, next)
		      }
		      // check main block
		      this.anchor = _.createAnchor('v-if')
		      _.replace(el, this.anchor)
		      this.factory = new FragmentFactory(this.vm, el)
		    } else {
		      ("development") !== 'production' && _.warn(
		        'v-if="' + this.expression + '" cannot be ' +
		        'used on an instance root element.'
		      )
		      this.invalid = true
		    }
		  },
	
		  update: function (value) {
		    if (this.invalid) return
		    if (value) {
		      if (!this.frag) {
		        this.insert()
		      }
		    } else {
		      this.remove()
		    }
		  },
	
		  insert: function () {
		    if (this.elseFrag) {
		      this.elseFrag.remove()
		      this.elseFrag = null
		    }
		    this.frag = this.factory.create(this._host, this._scope, this._frag)
		    this.frag.before(this.anchor)
		  },
	
		  remove: function () {
		    if (this.frag) {
		      this.frag.remove()
		      this.frag = null
		    }
		    if (this.elseFactory && !this.elseFrag) {
		      this.elseFrag = this.elseFactory.create(this._host, this._scope, this._frag)
		      this.elseFrag.before(this.anchor)
		    }
		  },
	
		  unbind: function () {
		    if (this.frag) {
		      this.frag.destroy()
		    }
		  }
		}
	
	
	/***/ },
	/* 24 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var transition = __webpack_require__(9)
	
		module.exports = {
	
		  bind: function () {
		    // check else block
		    var next = this.el.nextElementSibling
		    if (next && _.attr(next, 'v-else') !== null) {
		      this.elseEl = next
		    }
		  },
	
		  update: function (value) {
		    this.apply(this.el, value)
		    if (this.elseEl) {
		      this.apply(this.elseEl, !value)
		    }
		  },
	
		  apply: function (el, value) {
		    function done () {
		      el.style.display = value ? '' : 'none'
		    }
		    // do not apply transition if not in doc
		    if (_.inDoc(el)) {
		      transition.apply(el, value ? 1 : -1, done, this.vm)
		    } else {
		      done()
		    }
		  }
		}
	
	
	/***/ },
	/* 25 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
	
		var handlers = {
		  text: __webpack_require__(26),
		  radio: __webpack_require__(27),
		  select: __webpack_require__(28),
		  checkbox: __webpack_require__(29)
		}
	
		module.exports = {
	
		  priority: 800,
		  twoWay: true,
		  handlers: handlers,
		  params: ['lazy', 'number', 'debounce'],
	
		  /**
		   * Possible elements:
		   *   <select>
		   *   <textarea>
		   *   <input type="*">
		   *     - text
		   *     - checkbox
		   *     - radio
		   *     - number
		   */
	
		  bind: function () {
		    // friendly warning...
		    this.checkFilters()
		    if (this.hasRead && !this.hasWrite) {
		      ("development") !== 'production' && _.warn(
		        'It seems you are using a read-only filter with ' +
		        'v-model. You might want to use a two-way filter ' +
		        'to ensure correct behavior.'
		      )
		    }
		    var el = this.el
		    var tag = el.tagName
		    var handler
		    if (tag === 'INPUT') {
		      handler = handlers[el.type] || handlers.text
		    } else if (tag === 'SELECT') {
		      handler = handlers.select
		    } else if (tag === 'TEXTAREA') {
		      handler = handlers.text
		    } else {
		      ("development") !== 'production' && _.warn(
		        'v-model does not support element type: ' + tag
		      )
		      return
		    }
		    el.__v_model = this
		    handler.bind.call(this)
		    this.update = handler.update
		    this._unbind = handler.unbind
		  },
	
		  /**
		   * Check read/write filter stats.
		   */
	
		  checkFilters: function () {
		    var filters = this.filters
		    if (!filters) return
		    var i = filters.length
		    while (i--) {
		      var filter = _.resolveAsset(this.vm.$options, 'filters', filters[i].name)
		      if (typeof filter === 'function' || filter.read) {
		        this.hasRead = true
		      }
		      if (filter.write) {
		        this.hasWrite = true
		      }
		    }
		  },
	
		  unbind: function () {
		    this.el.__v_model = null
		    this._unbind && this._unbind()
		  }
		}
	
	
	/***/ },
	/* 26 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
	
		module.exports = {
	
		  bind: function () {
		    var self = this
		    var el = this.el
		    var isRange = el.type === 'range'
		    var lazy = this.params.lazy
		    var number = this.params.number
		    var debounce = this.params.debounce
	
		    // handle composition events.
		    //   http://blog.evanyou.me/2014/01/03/composition-event/
		    // skip this for Android because it handles composition
		    // events quite differently. Android doesn't trigger
		    // composition events for language input methods e.g.
		    // Chinese, but instead triggers them for spelling
		    // suggestions... (see Discussion/#162)
		    var composing = false
		    if (!_.isAndroid && !isRange) {
		      this.on('compositionstart', function () {
		        composing = true
		      })
		      this.on('compositionend', function () {
		        composing = false
		        // in IE11 the "compositionend" event fires AFTER
		        // the "input" event, so the input handler is blocked
		        // at the end... have to call it here.
		        //
		        // #1327: in lazy mode this is unecessary.
		        if (!lazy) {
		          self.listener()
		        }
		      })
		    }
	
		    // prevent messing with the input when user is typing,
		    // and force update on blur.
		    this.focused = false
		    if (!isRange) {
		      this.on('focus', function () {
		        self.focused = true
		      })
		      this.on('blur', function () {
		        self.focused = false
		        self.listener()
		      })
		    }
	
		    // Now attach the main listener
		    this.listener = function () {
		      if (composing) return
		      var val = number || isRange
		        ? _.toNumber(el.value)
		        : el.value
		      self.set(val)
		      // force update on next tick to avoid lock & same value
		      // also only update when user is not typing
		      _.nextTick(function () {
		        if (self._bound && !self.focused) {
		          self.update(self._watcher.value)
		        }
		      })
		    }
	
		    // apply debounce
		    if (debounce) {
		      this.listener = _.debounce(this.listener, debounce)
		    }
	
		    // Support jQuery events, since jQuery.trigger() doesn't
		    // trigger native events in some cases and some plugins
		    // rely on $.trigger()
		    //
		    // We want to make sure if a listener is attached using
		    // jQuery, it is also removed with jQuery, that's why
		    // we do the check for each directive instance and
		    // store that check result on itself. This also allows
		    // easier test coverage control by unsetting the global
		    // jQuery variable in tests.
		    this.hasjQuery = typeof jQuery === 'function'
		    if (this.hasjQuery) {
		      jQuery(el).on('change', this.listener)
		      if (!lazy) {
		        jQuery(el).on('input', this.listener)
		      }
		    } else {
		      this.on('change', this.listener)
		      if (!lazy) {
		        this.on('input', this.listener)
		      }
		    }
	
		    // IE9 doesn't fire input event on backspace/del/cut
		    if (!lazy && _.isIE9) {
		      this.on('cut', function () {
		        _.nextTick(self.listener)
		      })
		      this.on('keyup', function (e) {
		        if (e.keyCode === 46 || e.keyCode === 8) {
		          self.listener()
		        }
		      })
		    }
	
		    // set initial value if present
		    if (
		      el.hasAttribute('value') ||
		      (el.tagName === 'TEXTAREA' && el.value.trim())
		    ) {
		      this.afterBind = this.listener
		    }
		  },
	
		  update: function (value) {
		    this.el.value = _.toString(value)
		  },
	
		  unbind: function () {
		    var el = this.el
		    if (this.hasjQuery) {
		      jQuery(el).off('change', this.listener)
		      jQuery(el).off('input', this.listener)
		    }
		  }
		}
	
	
	/***/ },
	/* 27 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
	
		module.exports = {
	
		  bind: function () {
		    var self = this
		    var el = this.el
	
		    this.getValue = function () {
		      // value overwrite via v-bind:value
		      if (el.hasOwnProperty('_value')) {
		        return el._value
		      }
		      var val = el.value
		      if (self.params.number) {
		        val = _.toNumber(val)
		      }
		      return val
		    }
	
		    this.listener = function () {
		      self.set(self.getValue())
		    }
		    this.on('change', this.listener)
	
		    if (el.checked) {
		      this.afterBind = this.listener
		    }
		  },
	
		  update: function (value) {
		    this.el.checked = _.looseEqual(value, this.getValue())
		  }
		}
	
	
	/***/ },
	/* 28 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
	
		module.exports = {
	
		  bind: function () {
		    var self = this
		    var el = this.el
	
		    // method to force update DOM using latest value.
		    this.forceUpdate = function () {
		      if (self._watcher) {
		        self.update(self._watcher.get())
		      }
		    }
	
		    // check if this is a multiple select
		    var multiple = this.multiple = el.hasAttribute('multiple')
	
		    // attach listener
		    this.listener = function () {
		      var value = getValue(el, multiple)
		      value = self.params.number
		        ? _.isArray(value)
		          ? value.map(_.toNumber)
		          : _.toNumber(value)
		        : value
		      self.set(value)
		    }
		    this.on('change', this.listener)
	
		    // if has initial value, set afterBind
		    var initValue = getValue(el, multiple, true)
		    if ((multiple && initValue.length) ||
		        (!multiple && initValue !== null)) {
		      this.afterBind = this.listener
		    }
	
		    // All major browsers except Firefox resets
		    // selectedIndex with value -1 to 0 when the element
		    // is appended to a new parent, therefore we have to
		    // force a DOM update whenever that happens...
		    this.vm.$on('hook:attached', this.forceUpdate)
		  },
	
		  update: function (value) {
		    var el = this.el
		    el.selectedIndex = -1
		    var multi = this.multiple && _.isArray(value)
		    var options = el.options
		    var i = options.length
		    var op, val
		    while (i--) {
		      op = options[i]
		      val = op.hasOwnProperty('_value')
		        ? op._value
		        : op.value
		      /* eslint-disable eqeqeq */
		      op.selected = multi
		        ? indexOf(value, val) > -1
		        : _.looseEqual(value, val)
		      /* eslint-enable eqeqeq */
		    }
		  },
	
		  unbind: function () {
		    /* istanbul ignore next */
		    this.vm.$off('hook:attached', this.forceUpdate)
		  }
		}
	
		/**
		 * Get select value
		 *
		 * @param {SelectElement} el
		 * @param {Boolean} multi
		 * @param {Boolean} init
		 * @return {Array|*}
		 */
	
		function getValue (el, multi, init) {
		  var res = multi ? [] : null
		  var op, val, selected
		  for (var i = 0, l = el.options.length; i < l; i++) {
		    op = el.options[i]
		    selected = init
		      ? op.hasAttribute('selected')
		      : op.selected
		    if (selected) {
		      val = op.hasOwnProperty('_value')
		        ? op._value
		        : op.value
		      if (multi) {
		        res.push(val)
		      } else {
		        return val
		      }
		    }
		  }
		  return res
		}
	
		/**
		 * Native Array.indexOf uses strict equal, but in this
		 * case we need to match string/numbers with custom equal.
		 *
		 * @param {Array} arr
		 * @param {*} val
		 */
	
		function indexOf (arr, val) {
		  var i = arr.length
		  while (i--) {
		    if (_.looseEqual(arr[i], val)) {
		      return i
		    }
		  }
		  return -1
		}
	
	
	/***/ },
	/* 29 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
	
		module.exports = {
	
		  bind: function () {
		    var self = this
		    var el = this.el
	
		    this.getValue = function () {
		      return el.hasOwnProperty('_value')
		        ? el._value
		        : self.params.number
		          ? _.toNumber(el.value)
		          : el.value
		    }
	
		    function getBooleanValue () {
		      var val = el.checked
		      if (val && el.hasOwnProperty('_trueValue')) {
		        return el._trueValue
		      }
		      if (!val && el.hasOwnProperty('_falseValue')) {
		        return el._falseValue
		      }
		      return val
		    }
	
		    this.listener = function () {
		      var model = self._watcher.value
		      if (_.isArray(model)) {
		        var val = self.getValue()
		        if (el.checked) {
		          if (_.indexOf(model, val) < 0) {
		            model.push(val)
		          }
		        } else {
		          model.$remove(val)
		        }
		      } else {
		        self.set(getBooleanValue())
		      }
		    }
	
		    this.on('change', this.listener)
		    if (el.checked) {
		      this.afterBind = this.listener
		    }
		  },
	
		  update: function (value) {
		    var el = this.el
		    if (_.isArray(value)) {
		      el.checked = _.indexOf(value, this.getValue()) > -1
		    } else {
		      if (el.hasOwnProperty('_trueValue')) {
		        el.checked = _.looseEqual(value, el._trueValue)
		      } else {
		        el.checked = !!value
		      }
		    }
		  }
		}
	
	
	/***/ },
	/* 30 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
	
		// keyCode aliases
		var keyCodes = {
		  esc: 27,
		  tab: 9,
		  enter: 13,
		  space: 32,
		  'delete': 46,
		  up: 38,
		  left: 37,
		  right: 39,
		  down: 40
		}
	
		function keyFilter (handler, keys) {
		  var codes = keys.map(function (key) {
		    var code = keyCodes[key]
		    if (!code) {
		      code = parseInt(key, 10)
		    }
		    return code
		  })
		  return function keyHandler (e) {
		    if (codes.indexOf(e.keyCode) > -1) {
		      return handler.call(this, e)
		    }
		  }
		}
	
		function stopFilter (handler) {
		  return function stopHandler (e) {
		    e.stopPropagation()
		    return handler.call(this, e)
		  }
		}
	
		function preventFilter (handler) {
		  return function preventHandler (e) {
		    e.preventDefault()
		    return handler.call(this, e)
		  }
		}
	
		module.exports = {
	
		  acceptStatement: true,
		  priority: 700,
	
		  bind: function () {
		    // deal with iframes
		    if (
		      this.el.tagName === 'IFRAME' &&
		      this.arg !== 'load'
		    ) {
		      var self = this
		      this.iframeBind = function () {
		        _.on(self.el.contentWindow, self.arg, self.handler)
		      }
		      this.on('load', this.iframeBind)
		    }
		  },
	
		  update: function (handler) {
		    // stub a noop for v-on with no value,
		    // e.g. @mousedown.prevent
		    if (!this.descriptor.raw) {
		      handler = function () {}
		    }
	
		    if (typeof handler !== 'function') {
		      ("development") !== 'production' && _.warn(
		        'v-on:' + this.arg + '="' +
		        this.expression + '" expects a function value, ' +
		        'got ' + handler
		      )
		      return
		    }
	
		    // apply modifiers
		    if (this.modifiers.stop) {
		      handler = stopFilter(handler)
		    }
		    if (this.modifiers.prevent) {
		      handler = preventFilter(handler)
		    }
		    // key filter
		    var keys = Object.keys(this.modifiers)
		      .filter(function (key) {
		        return key !== 'stop' && key !== 'prevent'
		      })
		    if (keys.length) {
		      handler = keyFilter(handler, keys)
		    }
	
		    this.reset()
		    var scope = this._scope || this.vm
		    this.handler = function (e) {
		      scope.$event = e
		      var res = handler(e)
		      scope.$event = null
		      return res
		    }
		    if (this.iframeBind) {
		      this.iframeBind()
		    } else {
		      _.on(this.el, this.arg, this.handler)
		    }
		  },
	
		  reset: function () {
		    var el = this.iframeBind
		      ? this.el.contentWindow
		      : this.el
		    if (this.handler) {
		      _.off(el, this.arg, this.handler)
		    }
		  },
	
		  unbind: function () {
		    this.reset()
		  }
		}
	
	
	/***/ },
	/* 31 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
	
		// xlink
		var xlinkNS = 'http://www.w3.org/1999/xlink'
		var xlinkRE = /^xlink:/
	
		// these input element attributes should also set their
		// corresponding properties
		var inputProps = {
		  value: 1,
		  checked: 1,
		  selected: 1
		}
	
		// these attributes should set a hidden property for
		// binding v-model to object values
		var modelProps = {
		  value: '_value',
		  'true-value': '_trueValue',
		  'false-value': '_falseValue'
		}
	
		// check for attributes that prohibit interpolations
		var disallowedInterpAttrRE = /^v-|^:|^@|^(is|transition|transition-mode|debounce|track-by|stagger|enter-stagger|leave-stagger)$/
	
		module.exports = {
	
		  priority: 850,
	
		  bind: function () {
		    var attr = this.arg
		    var tag = this.el.tagName
		    // should be deep watch on object mode
		    if (!attr) {
		      this.deep = true
		    }
		    // handle interpolation bindings
		    if (this.descriptor.interp) {
		      // only allow binding on native attributes
		      if (
		        disallowedInterpAttrRE.test(attr) ||
		        (attr === 'name' && (tag === 'PARTIAL' || tag === 'SLOT'))
		      ) {
		        ("development") !== 'production' && _.warn(
		          attr + '="' + this.descriptor.raw + '": ' +
		          'attribute interpolation is not allowed in Vue.js ' +
		          'directives and special attributes.'
		        )
		        this.el.removeAttribute(attr)
		        this.invalid = true
		      }
	
		      /* istanbul ignore if */
		      if (true) {
		        var raw = attr + '="' + this.descriptor.raw + '": '
		        // warn src
		        if (attr === 'src') {
		          _.warn(
		            raw + 'interpolation in "src" attribute will cause ' +
		            'a 404 request. Use v-bind:src instead.'
		          )
		        }
	
		        // warn style
		        if (attr === 'style') {
		          _.warn(
		            raw + 'interpolation in "style" attribute will cause ' +
		            'the attribute to be discarded in Internet Explorer. ' +
		            'Use v-bind:style instead.'
		          )
		        }
		      }
		    }
		  },
	
		  update: function (value) {
		    if (this.invalid) {
		      return
		    }
		    var attr = this.arg
		    if (this.arg) {
		      this.handleSingle(attr, value)
		    } else {
		      this.handleObject(value || {})
		    }
		  },
	
		  // share object handler with v-bind:class
		  handleObject: __webpack_require__(32).handleObject,
	
		  handleSingle: function (attr, value) {
		    if (inputProps[attr] && attr in this.el) {
		      this.el[attr] = attr === 'value'
		        ? (value || '') // IE9 will set input.value to "null" for null...
		        : value
		    }
		    // set model props
		    var modelProp = modelProps[attr]
		    if (modelProp) {
		      this.el[modelProp] = value
		      // update v-model if present
		      var model = this.el.__v_model
		      if (model) {
		        model.listener()
		      }
		    }
		    // do not set value attribute for textarea
		    if (attr === 'value' && this.el.tagName === 'TEXTAREA') {
		      this.el.removeAttribute(attr)
		      return
		    }
		    // update attribute
		    if (value != null && value !== false) {
		      if (xlinkRE.test(attr)) {
		        this.el.setAttributeNS(xlinkNS, attr, value)
		      } else {
		        this.el.setAttribute(attr, value)
		      }
		    } else {
		      this.el.removeAttribute(attr)
		    }
		  }
		}
	
	
	/***/ },
	/* 32 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var prefixes = ['-webkit-', '-moz-', '-ms-']
		var camelPrefixes = ['Webkit', 'Moz', 'ms']
		var importantRE = /!important;?$/
		var testEl = null
		var propCache = {}
	
		module.exports = {
	
		  deep: true,
	
		  update: function (value) {
		    if (typeof value === 'string') {
		      this.el.style.cssText = value
		    } else if (_.isArray(value)) {
		      this.handleObject(value.reduce(_.extend, {}))
		    } else {
		      this.handleObject(value || {})
		    }
		  },
	
		  handleObject: function (value) {
		    // cache object styles so that only changed props
		    // are actually updated.
		    var cache = this.cache || (this.cache = {})
		    var name, val
		    for (name in cache) {
		      if (!(name in value)) {
		        this.handleSingle(name, null)
		        delete cache[name]
		      }
		    }
		    for (name in value) {
		      val = value[name]
		      if (val !== cache[name]) {
		        cache[name] = val
		        this.handleSingle(name, val)
		      }
		    }
		  },
	
		  handleSingle: function (prop, value) {
		    prop = normalize(prop)
		    if (!prop) return // unsupported prop
		    // cast possible numbers/booleans into strings
		    if (value != null) value += ''
		    if (value) {
		      var isImportant = importantRE.test(value)
		        ? 'important'
		        : ''
		      if (isImportant) {
		        value = value.replace(importantRE, '').trim()
		      }
		      this.el.style.setProperty(prop, value, isImportant)
		    } else {
		      this.el.style.removeProperty(prop)
		    }
		  }
	
		}
	
		/**
		 * Normalize a CSS property name.
		 * - cache result
		 * - auto prefix
		 * - camelCase -> dash-case
		 *
		 * @param {String} prop
		 * @return {String}
		 */
	
		function normalize (prop) {
		  if (propCache[prop]) {
		    return propCache[prop]
		  }
		  var res = prefix(prop)
		  propCache[prop] = propCache[res] = res
		  return res
		}
	
		/**
		 * Auto detect the appropriate prefix for a CSS property.
		 * https://gist.github.com/paulirish/523692
		 *
		 * @param {String} prop
		 * @return {String}
		 */
	
		function prefix (prop) {
		  prop = _.hyphenate(prop)
		  var camel = _.camelize(prop)
		  var upper = camel.charAt(0).toUpperCase() + camel.slice(1)
		  if (!testEl) {
		    testEl = document.createElement('div')
		  }
		  if (camel in testEl.style) {
		    return prop
		  }
		  var i = prefixes.length
		  var prefixed
		  while (i--) {
		    prefixed = camelPrefixes[i] + upper
		    if (prefixed in testEl.style) {
		      return prefixes[i] + prop
		    }
		  }
		}
	
	
	/***/ },
	/* 33 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
	
		module.exports = {
	
		  priority: 1500,
	
		  bind: function () {
		    /* istanbul ignore if */
		    if (!this.arg) {
		      return
		    }
		    var id = this.id = _.camelize(this.arg)
		    var refs = (this._scope || this.vm).$els
		    if (refs.hasOwnProperty(id)) {
		      refs[id] = this.el
		    } else {
		      _.defineReactive(refs, id, this.el)
		    }
		  },
	
		  unbind: function () {
		    var refs = (this._scope || this.vm).$els
		    if (refs[this.id] === this.el) {
		      refs[this.id] = null
		    }
		  }
		}
	
	
	/***/ },
	/* 34 */
	/***/ function(module, exports, __webpack_require__) {
	
		if (true) {
		  module.exports = {
		    bind: function () {
		      __webpack_require__(1).warn(
		        'v-ref:' + this.arg + ' must be used on a child ' +
		        'component. Found on <' + this.el.tagName.toLowerCase() + '>.'
		      )
		    }
		  }
		}
	
	
	/***/ },
	/* 35 */
	/***/ function(module, exports) {
	
		module.exports = {
		  bind: function () {
		    var el = this.el
		    this.vm.$once('hook:compiled', function () {
		      el.removeAttribute('v-cloak')
		    })
		  }
		}
	
	
	/***/ },
	/* 36 */
	/***/ function(module, exports, __webpack_require__) {
	
		exports.style = __webpack_require__(32)
		exports['class'] = __webpack_require__(37)
		exports.component = __webpack_require__(38)
		exports.prop = __webpack_require__(39)
		exports.transition = __webpack_require__(45)
	
	
	/***/ },
	/* 37 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var addClass = _.addClass
		var removeClass = _.removeClass
	
		module.exports = {
	
		  deep: true,
	
		  update: function (value) {
		    if (value && typeof value === 'string') {
		      this.handleObject(stringToObject(value))
		    } else if (_.isPlainObject(value)) {
		      this.handleObject(value)
		    } else if (_.isArray(value)) {
		      this.handleArray(value)
		    } else {
		      this.cleanup()
		    }
		  },
	
		  handleObject: function (value) {
		    this.cleanup(value)
		    var keys = this.prevKeys = Object.keys(value)
		    for (var i = 0, l = keys.length; i < l; i++) {
		      var key = keys[i]
		      if (value[key]) {
		        addClass(this.el, key)
		      } else {
		        removeClass(this.el, key)
		      }
		    }
		  },
	
		  handleArray: function (value) {
		    this.cleanup(value)
		    for (var i = 0, l = value.length; i < l; i++) {
		      if (value[i]) {
		        addClass(this.el, value[i])
		      }
		    }
		    this.prevKeys = value.slice()
		  },
	
		  cleanup: function (value) {
		    if (this.prevKeys) {
		      var i = this.prevKeys.length
		      while (i--) {
		        var key = this.prevKeys[i]
		        if (key && (!value || !contains(value, key))) {
		          removeClass(this.el, key)
		        }
		      }
		    }
		  }
		}
	
		function stringToObject (value) {
		  var res = {}
		  var keys = value.trim().split(/\s+/)
		  var i = keys.length
		  while (i--) {
		    res[keys[i]] = true
		  }
		  return res
		}
	
		function contains (value, key) {
		  return _.isArray(value)
		    ? value.indexOf(key) > -1
		    : value.hasOwnProperty(key)
		}
	
	
	/***/ },
	/* 38 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var templateParser = __webpack_require__(19)
	
		module.exports = {
	
		  priority: 1500,
	
		  params: [
		    'keep-alive',
		    'transition-mode',
		    'inline-template'
		  ],
	
		  /**
		   * Setup. Two possible usages:
		   *
		   * - static:
		   *   <comp> or <div v-component="comp">
		   *
		   * - dynamic:
		   *   <component :is="view">
		   */
	
		  bind: function () {
		    if (!this.el.__vue__) {
		      // keep-alive cache
		      this.keepAlive = this.params.keepAlive
		      if (this.keepAlive) {
		        this.cache = {}
		      }
		      // check inline-template
		      if (this.params.inlineTemplate) {
		        // extract inline template as a DocumentFragment
		        this.inlineTemplate = _.extractContent(this.el, true)
		      }
		      // component resolution related state
		      this.pendingComponentCb =
		      this.Component = null
		      // transition related state
		      this.pendingRemovals = 0
		      this.pendingRemovalCb = null
		      // create a ref anchor
		      this.anchor = _.createAnchor('v-component')
		      _.replace(this.el, this.anchor)
		      // remove is attribute
		      this.el.removeAttribute('is')
		      // if static, build right now.
		      if (this.literal) {
		        this.setComponent(this.expression)
		      }
		    } else {
		      ("development") !== 'production' && _.warn(
		        'cannot mount component "' + this.expression + '" ' +
		        'on already mounted element: ' + this.el
		      )
		    }
		  },
	
		  /**
		   * Public update, called by the watcher in the dynamic
		   * literal scenario, e.g. <component :is="view">
		   */
	
		  update: function (value) {
		    if (!this.literal) {
		      this.setComponent(value)
		    }
		  },
	
		  /**
		   * Switch dynamic components. May resolve the component
		   * asynchronously, and perform transition based on
		   * specified transition mode. Accepts a few additional
		   * arguments specifically for vue-router.
		   *
		   * The callback is called when the full transition is
		   * finished.
		   *
		   * @param {String} value
		   * @param {Function} [cb]
		   */
	
		  setComponent: function (value, cb) {
		    this.invalidatePending()
		    if (!value) {
		      // just remove current
		      this.unbuild(true)
		      this.remove(this.childVM, cb)
		      this.childVM = null
		    } else {
		      var self = this
		      this.resolveComponent(value, function () {
		        self.mountComponent(cb)
		      })
		    }
		  },
	
		  /**
		   * Resolve the component constructor to use when creating
		   * the child vm.
		   */
	
		  resolveComponent: function (id, cb) {
		    var self = this
		    this.pendingComponentCb = _.cancellable(function (Component) {
		      self.ComponentName = Component.options.name || id
		      self.Component = Component
		      cb()
		    })
		    this.vm._resolveComponent(id, this.pendingComponentCb)
		  },
	
		  /**
		   * Create a new instance using the current constructor and
		   * replace the existing instance. This method doesn't care
		   * whether the new component and the old one are actually
		   * the same.
		   *
		   * @param {Function} [cb]
		   */
	
		  mountComponent: function (cb) {
		    // actual mount
		    this.unbuild(true)
		    var self = this
		    var activateHook = this.Component.options.activate
		    var cached = this.getCached()
		    var newComponent = this.build()
		    if (activateHook && !cached) {
		      this.waitingFor = newComponent
		      activateHook.call(newComponent, function () {
		        self.waitingFor = null
		        self.transition(newComponent, cb)
		      })
		    } else {
		      // update ref for kept-alive component
		      if (cached) {
		        newComponent._updateRef()
		      }
		      this.transition(newComponent, cb)
		    }
		  },
	
		  /**
		   * When the component changes or unbinds before an async
		   * constructor is resolved, we need to invalidate its
		   * pending callback.
		   */
	
		  invalidatePending: function () {
		    if (this.pendingComponentCb) {
		      this.pendingComponentCb.cancel()
		      this.pendingComponentCb = null
		    }
		  },
	
		  /**
		   * Instantiate/insert a new child vm.
		   * If keep alive and has cached instance, insert that
		   * instance; otherwise build a new one and cache it.
		   *
		   * @param {Object} [extraOptions]
		   * @return {Vue} - the created instance
		   */
	
		  build: function (extraOptions) {
		    var cached = this.getCached()
		    if (cached) {
		      return cached
		    }
		    if (this.Component) {
		      // default options
		      var options = {
		        name: this.ComponentName,
		        el: templateParser.clone(this.el),
		        template: this.inlineTemplate,
		        // make sure to add the child with correct parent
		        // if this is a transcluded component, its parent
		        // should be the transclusion host.
		        parent: this._host || this.vm,
		        // if no inline-template, then the compiled
		        // linker can be cached for better performance.
		        _linkerCachable: !this.inlineTemplate,
		        _ref: this.descriptor.ref,
		        _asComponent: true,
		        _isRouterView: this._isRouterView,
		        // if this is a transcluded component, context
		        // will be the common parent vm of this instance
		        // and its host.
		        _context: this.vm,
		        // if this is inside an inline v-for, the scope
		        // will be the intermediate scope created for this
		        // repeat fragment. this is used for linking props
		        // and container directives.
		        _scope: this._scope,
		        // pass in the owner fragment of this component.
		        // this is necessary so that the fragment can keep
		        // track of its contained components in order to
		        // call attach/detach hooks for them.
		        _frag: this._frag
		      }
		      // extra options
		      // in 1.0.0 this is used by vue-router only
		      /* istanbul ignore if */
		      if (extraOptions) {
		        _.extend(options, extraOptions)
		      }
		      var child = new this.Component(options)
		      if (this.keepAlive) {
		        this.cache[this.Component.cid] = child
		      }
		      /* istanbul ignore if */
		      if (("development") !== 'production' &&
		          this.el.hasAttribute('transition') &&
		          child._isFragment) {
		        _.warn(
		          'Transitions will not work on a fragment instance. ' +
		          'Template: ' + child.$options.template
		        )
		      }
		      return child
		    }
		  },
	
		  /**
		   * Try to get a cached instance of the current component.
		   *
		   * @return {Vue|undefined}
		   */
	
		  getCached: function () {
		    return this.keepAlive && this.cache[this.Component.cid]
		  },
	
		  /**
		   * Teardown the current child, but defers cleanup so
		   * that we can separate the destroy and removal steps.
		   *
		   * @param {Boolean} defer
		   */
	
		  unbuild: function (defer) {
		    if (this.waitingFor) {
		      this.waitingFor.$destroy()
		      this.waitingFor = null
		    }
		    var child = this.childVM
		    if (!child || this.keepAlive) {
		      if (child) {
		        // remove ref
		        child._updateRef(true)
		      }
		      return
		    }
		    // the sole purpose of `deferCleanup` is so that we can
		    // "deactivate" the vm right now and perform DOM removal
		    // later.
		    child.$destroy(false, defer)
		  },
	
		  /**
		   * Remove current destroyed child and manually do
		   * the cleanup after removal.
		   *
		   * @param {Function} cb
		   */
	
		  remove: function (child, cb) {
		    var keepAlive = this.keepAlive
		    if (child) {
		      // we may have a component switch when a previous
		      // component is still being transitioned out.
		      // we want to trigger only one lastest insertion cb
		      // when the existing transition finishes. (#1119)
		      this.pendingRemovals++
		      this.pendingRemovalCb = cb
		      var self = this
		      child.$remove(function () {
		        self.pendingRemovals--
		        if (!keepAlive) child._cleanup()
		        if (!self.pendingRemovals && self.pendingRemovalCb) {
		          self.pendingRemovalCb()
		          self.pendingRemovalCb = null
		        }
		      })
		    } else if (cb) {
		      cb()
		    }
		  },
	
		  /**
		   * Actually swap the components, depending on the
		   * transition mode. Defaults to simultaneous.
		   *
		   * @param {Vue} target
		   * @param {Function} [cb]
		   */
	
		  transition: function (target, cb) {
		    var self = this
		    var current = this.childVM
		    // for devtool inspection
		    if (true) {
		      if (current) current._inactive = true
		      target._inactive = false
		    }
		    this.childVM = target
		    switch (self.params.transitionMode) {
		      case 'in-out':
		        target.$before(self.anchor, function () {
		          self.remove(current, cb)
		        })
		        break
		      case 'out-in':
		        self.remove(current, function () {
		          target.$before(self.anchor, cb)
		        })
		        break
		      default:
		        self.remove(current)
		        target.$before(self.anchor, cb)
		    }
		  },
	
		  /**
		   * Unbind.
		   */
	
		  unbind: function () {
		    this.invalidatePending()
		    // Do not defer cleanup when unbinding
		    this.unbuild()
		    // destroy all keep-alive cached instances
		    if (this.cache) {
		      for (var key in this.cache) {
		        this.cache[key].$destroy()
		      }
		      this.cache = null
		    }
		  }
		}
	
	
	/***/ },
	/* 39 */
	/***/ function(module, exports, __webpack_require__) {
	
		// NOTE: the prop internal directive is compiled and linked
		// during _initScope(), before the created hook is called.
		// The purpose is to make the initial prop values available
		// inside `created` hooks and `data` functions.
	
		var _ = __webpack_require__(1)
		var Watcher = __webpack_require__(40)
		var bindingModes = __webpack_require__(5)._propBindingModes
	
		module.exports = {
	
		  bind: function () {
	
		    var child = this.vm
		    var parent = child._context
		    // passed in from compiler directly
		    var prop = this.descriptor.prop
		    var childKey = prop.path
		    var parentKey = prop.parentPath
		    var twoWay = prop.mode === bindingModes.TWO_WAY
	
		    var parentWatcher = this.parentWatcher = new Watcher(
		      parent,
		      parentKey,
		      function (val) {
		        if (_.assertProp(prop, val)) {
		          child[childKey] = val
		        }
		      }, {
		        twoWay: twoWay,
		        filters: prop.filters,
		        // important: props need to be observed on the
		        // v-for scope if present
		        scope: this._scope
		      }
		    )
	
		    // set the child initial value.
		    _.initProp(child, prop, parentWatcher.value)
	
		    // setup two-way binding
		    if (twoWay) {
		      // important: defer the child watcher creation until
		      // the created hook (after data observation)
		      var self = this
		      child.$once('hook:created', function () {
		        self.childWatcher = new Watcher(
		          child,
		          childKey,
		          function (val) {
		            parentWatcher.set(val)
		          }, {
		            // ensure sync upward before parent sync down.
		            // this is necessary in cases e.g. the child
		            // mutates a prop array, then replaces it. (#1683)
		            sync: true
		          }
		        )
		      })
		    }
		  },
	
		  unbind: function () {
		    this.parentWatcher.teardown()
		    if (this.childWatcher) {
		      this.childWatcher.teardown()
		    }
		  }
		}
	
	
	/***/ },
	/* 40 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var config = __webpack_require__(5)
		var Dep = __webpack_require__(41)
		var expParser = __webpack_require__(42)
		var batcher = __webpack_require__(44)
		var uid = 0
	
		/**
		 * A watcher parses an expression, collects dependencies,
		 * and fires callback when the expression value changes.
		 * This is used for both the $watch() api and directives.
		 *
		 * @param {Vue} vm
		 * @param {String} expression
		 * @param {Function} cb
		 * @param {Object} options
		 *                 - {Array} filters
		 *                 - {Boolean} twoWay
		 *                 - {Boolean} deep
		 *                 - {Boolean} user
		 *                 - {Boolean} sync
		 *                 - {Boolean} lazy
		 *                 - {Function} [preProcess]
		 *                 - {Function} [postProcess]
		 * @constructor
		 */
	
		function Watcher (vm, expOrFn, cb, options) {
		  // mix in options
		  if (options) {
		    _.extend(this, options)
		  }
		  var isFn = typeof expOrFn === 'function'
		  this.vm = vm
		  vm._watchers.push(this)
		  this.expression = isFn ? expOrFn.toString() : expOrFn
		  this.cb = cb
		  this.id = ++uid // uid for batching
		  this.active = true
		  this.dirty = this.lazy // for lazy watchers
		  this.deps = Object.create(null)
		  this.newDeps = null
		  this.prevError = null // for async error stacks
		  // parse expression for getter/setter
		  if (isFn) {
		    this.getter = expOrFn
		    this.setter = undefined
		  } else {
		    var res = expParser.parse(expOrFn, this.twoWay)
		    this.getter = res.get
		    this.setter = res.set
		  }
		  this.value = this.lazy
		    ? undefined
		    : this.get()
		  // state for avoiding false triggers for deep and Array
		  // watchers during vm._digest()
		  this.queued = this.shallow = false
		}
	
		/**
		 * Add a dependency to this directive.
		 *
		 * @param {Dep} dep
		 */
	
		Watcher.prototype.addDep = function (dep) {
		  var id = dep.id
		  if (!this.newDeps[id]) {
		    this.newDeps[id] = dep
		    if (!this.deps[id]) {
		      this.deps[id] = dep
		      dep.addSub(this)
		    }
		  }
		}
	
		/**
		 * Evaluate the getter, and re-collect dependencies.
		 */
	
		Watcher.prototype.get = function () {
		  this.beforeGet()
		  var scope = this.scope || this.vm
		  var value
		  try {
		    value = this.getter.call(scope, scope)
		  } catch (e) {
		    if (
		      ("development") !== 'production' &&
		      config.warnExpressionErrors
		    ) {
		      _.warn(
		        'Error when evaluating expression "' +
		        this.expression + '". ' +
		        (config.debug
		          ? ''
		          : 'Turn on debug mode to see stack trace.'
		        ), e
		      )
		    }
		  }
		  // "touch" every property so they are all tracked as
		  // dependencies for deep watching
		  if (this.deep) {
		    traverse(value)
		  }
		  if (this.preProcess) {
		    value = this.preProcess(value)
		  }
		  if (this.filters) {
		    value = scope._applyFilters(value, null, this.filters, false)
		  }
		  if (this.postProcess) {
		    value = this.postProcess(value)
		  }
		  this.afterGet()
		  return value
		}
	
		/**
		 * Set the corresponding value with the setter.
		 *
		 * @param {*} value
		 */
	
		Watcher.prototype.set = function (value) {
		  var scope = this.scope || this.vm
		  if (this.filters) {
		    value = scope._applyFilters(
		      value, this.value, this.filters, true)
		  }
		  try {
		    this.setter.call(scope, scope, value)
		  } catch (e) {
		    if (
		      ("development") !== 'production' &&
		      config.warnExpressionErrors
		    ) {
		      _.warn(
		        'Error when evaluating setter "' +
		        this.expression + '"', e
		      )
		    }
		  }
		  // two-way sync for v-for alias
		  var forContext = scope.$forContext
		  if (true) {
		    if (
		      forContext &&
		      forContext.filters &&
		      (new RegExp(forContext.alias + '\\b')).test(this.expression)
		    ) {
		      _.warn(
		        'It seems you are using two-way binding on ' +
		        'a v-for alias (' + this.expression + '), and the ' +
		        'v-for has filters. This will not work properly. ' +
		        'Either remove the filters or use an array of ' +
		        'objects and bind to object properties instead.'
		      )
		    }
		  }
		  if (
		    forContext &&
		    forContext.alias === this.expression &&
		    !forContext.filters
		  ) {
		    if (scope.$key) { // original is an object
		      forContext.rawValue[scope.$key] = value
		    } else {
		      forContext.rawValue.$set(scope.$index, value)
		    }
		  }
		}
	
		/**
		 * Prepare for dependency collection.
		 */
	
		Watcher.prototype.beforeGet = function () {
		  Dep.target = this
		  this.newDeps = Object.create(null)
		}
	
		/**
		 * Clean up for dependency collection.
		 */
	
		Watcher.prototype.afterGet = function () {
		  Dep.target = null
		  var ids = Object.keys(this.deps)
		  var i = ids.length
		  while (i--) {
		    var id = ids[i]
		    if (!this.newDeps[id]) {
		      this.deps[id].removeSub(this)
		    }
		  }
		  this.deps = this.newDeps
		}
	
		/**
		 * Subscriber interface.
		 * Will be called when a dependency changes.
		 *
		 * @param {Boolean} shallow
		 */
	
		Watcher.prototype.update = function (shallow) {
		  if (this.lazy) {
		    this.dirty = true
		  } else if (this.sync || !config.async) {
		    this.run()
		  } else {
		    // if queued, only overwrite shallow with non-shallow,
		    // but not the other way around.
		    this.shallow = this.queued
		      ? shallow
		        ? this.shallow
		        : false
		      : !!shallow
		    this.queued = true
		    // record before-push error stack in debug mode
		    /* istanbul ignore if */
		    if (("development") !== 'production' && config.debug) {
		      this.prevError = new Error('[vue] async stack trace')
		    }
		    batcher.push(this)
		  }
		}
	
		/**
		 * Batcher job interface.
		 * Will be called by the batcher.
		 */
	
		Watcher.prototype.run = function () {
		  if (this.active) {
		    var value = this.get()
		    if (
		      value !== this.value ||
		      // Deep watchers and Array watchers should fire even
		      // when the value is the same, because the value may
		      // have mutated; but only do so if this is a
		      // non-shallow update (caused by a vm digest).
		      ((_.isArray(value) || this.deep) && !this.shallow)
		    ) {
		      // set new value
		      var oldValue = this.value
		      this.value = value
		      // in debug + async mode, when a watcher callbacks
		      // throws, we also throw the saved before-push error
		      // so the full cross-tick stack trace is available.
		      var prevError = this.prevError
		      /* istanbul ignore if */
		      if (("development") !== 'production' &&
		          config.debug && prevError) {
		        this.prevError = null
		        try {
		          this.cb.call(this.vm, value, oldValue)
		        } catch (e) {
		          _.nextTick(function () {
		            throw prevError
		          }, 0)
		          throw e
		        }
		      } else {
		        this.cb.call(this.vm, value, oldValue)
		      }
		    }
		    this.queued = this.shallow = false
		  }
		}
	
		/**
		 * Evaluate the value of the watcher.
		 * This only gets called for lazy watchers.
		 */
	
		Watcher.prototype.evaluate = function () {
		  // avoid overwriting another watcher that is being
		  // collected.
		  var current = Dep.target
		  this.value = this.get()
		  this.dirty = false
		  Dep.target = current
		}
	
		/**
		 * Depend on all deps collected by this watcher.
		 */
	
		Watcher.prototype.depend = function () {
		  var depIds = Object.keys(this.deps)
		  var i = depIds.length
		  while (i--) {
		    this.deps[depIds[i]].depend()
		  }
		}
	
		/**
		 * Remove self from all dependencies' subcriber list.
		 */
	
		Watcher.prototype.teardown = function () {
		  if (this.active) {
		    // remove self from vm's watcher list
		    // we can skip this if the vm if being destroyed
		    // which can improve teardown performance.
		    if (!this.vm._isBeingDestroyed) {
		      this.vm._watchers.$remove(this)
		    }
		    var depIds = Object.keys(this.deps)
		    var i = depIds.length
		    while (i--) {
		      this.deps[depIds[i]].removeSub(this)
		    }
		    this.active = false
		    this.vm = this.cb = this.value = null
		  }
		}
	
		/**
		 * Recrusively traverse an object to evoke all converted
		 * getters, so that every nested property inside the object
		 * is collected as a "deep" dependency.
		 *
		 * @param {*} val
		 */
	
		function traverse (val) {
		  var i, keys
		  if (_.isArray(val)) {
		    i = val.length
		    while (i--) traverse(val[i])
		  } else if (_.isObject(val)) {
		    keys = Object.keys(val)
		    i = keys.length
		    while (i--) traverse(val[keys[i]])
		  }
		}
	
		module.exports = Watcher
	
	
	/***/ },
	/* 41 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var uid = 0
	
		/**
		 * A dep is an observable that can have multiple
		 * directives subscribing to it.
		 *
		 * @constructor
		 */
	
		function Dep () {
		  this.id = uid++
		  this.subs = []
		}
	
		// the current target watcher being evaluated.
		// this is globally unique because there could be only one
		// watcher being evaluated at any time.
		Dep.target = null
	
		/**
		 * Add a directive subscriber.
		 *
		 * @param {Directive} sub
		 */
	
		Dep.prototype.addSub = function (sub) {
		  this.subs.push(sub)
		}
	
		/**
		 * Remove a directive subscriber.
		 *
		 * @param {Directive} sub
		 */
	
		Dep.prototype.removeSub = function (sub) {
		  this.subs.$remove(sub)
		}
	
		/**
		 * Add self as a dependency to the target watcher.
		 */
	
		Dep.prototype.depend = function () {
		  Dep.target.addDep(this)
		}
	
		/**
		 * Notify all subscribers of a new value.
		 */
	
		Dep.prototype.notify = function () {
		  // stablize the subscriber list first
		  var subs = _.toArray(this.subs)
		  for (var i = 0, l = subs.length; i < l; i++) {
		    subs[i].update()
		  }
		}
	
		module.exports = Dep
	
	
	/***/ },
	/* 42 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var Path = __webpack_require__(43)
		var Cache = __webpack_require__(7)
		var expressionCache = new Cache(1000)
	
		var allowedKeywords =
		  'Math,Date,this,true,false,null,undefined,Infinity,NaN,' +
		  'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' +
		  'encodeURIComponent,parseInt,parseFloat'
		var allowedKeywordsRE =
		  new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)')
	
		// keywords that don't make sense inside expressions
		var improperKeywords =
		  'break,case,class,catch,const,continue,debugger,default,' +
		  'delete,do,else,export,extends,finally,for,function,if,' +
		  'import,in,instanceof,let,return,super,switch,throw,try,' +
		  'var,while,with,yield,enum,await,implements,package,' +
		  'proctected,static,interface,private,public'
		var improperKeywordsRE =
		  new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)')
	
		var wsRE = /\s/g
		var newlineRE = /\n/g
		var saveRE = /[\{,]\s*[\w\$_]+\s*:|('[^']*'|"[^"]*")|new |typeof |void /g
		var restoreRE = /"(\d+)"/g
		var pathTestRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/
		var pathReplaceRE = /[^\w$\.]([A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\])*)/g
		var booleanLiteralRE = /^(true|false)$/
	
		/**
		 * Save / Rewrite / Restore
		 *
		 * When rewriting paths found in an expression, it is
		 * possible for the same letter sequences to be found in
		 * strings and Object literal property keys. Therefore we
		 * remove and store these parts in a temporary array, and
		 * restore them after the path rewrite.
		 */
	
		var saved = []
	
		/**
		 * Save replacer
		 *
		 * The save regex can match two possible cases:
		 * 1. An opening object literal
		 * 2. A string
		 * If matched as a plain string, we need to escape its
		 * newlines, since the string needs to be preserved when
		 * generating the function body.
		 *
		 * @param {String} str
		 * @param {String} isString - str if matched as a string
		 * @return {String} - placeholder with index
		 */
	
		function save (str, isString) {
		  var i = saved.length
		  saved[i] = isString
		    ? str.replace(newlineRE, '\\n')
		    : str
		  return '"' + i + '"'
		}
	
		/**
		 * Path rewrite replacer
		 *
		 * @param {String} raw
		 * @return {String}
		 */
	
		function rewrite (raw) {
		  var c = raw.charAt(0)
		  var path = raw.slice(1)
		  if (allowedKeywordsRE.test(path)) {
		    return raw
		  } else {
		    path = path.indexOf('"') > -1
		      ? path.replace(restoreRE, restore)
		      : path
		    return c + 'scope.' + path
		  }
		}
	
		/**
		 * Restore replacer
		 *
		 * @param {String} str
		 * @param {String} i - matched save index
		 * @return {String}
		 */
	
		function restore (str, i) {
		  return saved[i]
		}
	
		/**
		 * Rewrite an expression, prefixing all path accessors with
		 * `scope.` and generate getter/setter functions.
		 *
		 * @param {String} exp
		 * @param {Boolean} needSet
		 * @return {Function}
		 */
	
		function compileExpFns (exp, needSet) {
		  if (improperKeywordsRE.test(exp)) {
		    ("development") !== 'production' && _.warn(
		      'Avoid using reserved keywords in expression: ' + exp
		    )
		  }
		  // reset state
		  saved.length = 0
		  // save strings and object literal keys
		  var body = exp
		    .replace(saveRE, save)
		    .replace(wsRE, '')
		  // rewrite all paths
		  // pad 1 space here becaue the regex matches 1 extra char
		  body = (' ' + body)
		    .replace(pathReplaceRE, rewrite)
		    .replace(restoreRE, restore)
		  var getter = makeGetter(body)
		  if (getter) {
		    return {
		      get: getter,
		      body: body,
		      set: needSet
		        ? makeSetter(body)
		        : null
		    }
		  }
		}
	
		/**
		 * Compile getter setters for a simple path.
		 *
		 * @param {String} exp
		 * @return {Function}
		 */
	
		function compilePathFns (exp) {
		  var getter, path
		  if (exp.indexOf('[') < 0) {
		    // really simple path
		    path = exp.split('.')
		    path.raw = exp
		    getter = Path.compileGetter(path)
		  } else {
		    // do the real parsing
		    path = Path.parse(exp)
		    getter = path.get
		  }
		  return {
		    get: getter,
		    // always generate setter for simple paths
		    set: function (obj, val) {
		      Path.set(obj, path, val)
		    }
		  }
		}
	
		/**
		 * Build a getter function. Requires eval.
		 *
		 * We isolate the try/catch so it doesn't affect the
		 * optimization of the parse function when it is not called.
		 *
		 * @param {String} body
		 * @return {Function|undefined}
		 */
	
		function makeGetter (body) {
		  try {
		    return new Function('scope', 'return ' + body + ';')
		  } catch (e) {
		    ("development") !== 'production' && _.warn(
		      'Invalid expression. ' +
		      'Generated function body: ' + body
		    )
		  }
		}
	
		/**
		 * Build a setter function.
		 *
		 * This is only needed in rare situations like "a[b]" where
		 * a settable path requires dynamic evaluation.
		 *
		 * This setter function may throw error when called if the
		 * expression body is not a valid left-hand expression in
		 * assignment.
		 *
		 * @param {String} body
		 * @return {Function|undefined}
		 */
	
		function makeSetter (body) {
		  try {
		    return new Function('scope', 'value', body + '=value;')
		  } catch (e) {
		    ("development") !== 'production' && _.warn(
		      'Invalid setter function body: ' + body
		    )
		  }
		}
	
		/**
		 * Check for setter existence on a cache hit.
		 *
		 * @param {Function} hit
		 */
	
		function checkSetter (hit) {
		  if (!hit.set) {
		    hit.set = makeSetter(hit.body)
		  }
		}
	
		/**
		 * Parse an expression into re-written getter/setters.
		 *
		 * @param {String} exp
		 * @param {Boolean} needSet
		 * @return {Function}
		 */
	
		exports.parse = function (exp, needSet) {
		  exp = exp.trim()
		  // try cache
		  var hit = expressionCache.get(exp)
		  if (hit) {
		    if (needSet) {
		      checkSetter(hit)
		    }
		    return hit
		  }
		  // we do a simple path check to optimize for them.
		  // the check fails valid paths with unusal whitespaces,
		  // but that's too rare and we don't care.
		  // also skip boolean literals and paths that start with
		  // global "Math"
		  var res = exports.isSimplePath(exp)
		    ? compilePathFns(exp)
		    : compileExpFns(exp, needSet)
		  expressionCache.put(exp, res)
		  return res
		}
	
		/**
		 * Check if an expression is a simple path.
		 *
		 * @param {String} exp
		 * @return {Boolean}
		 */
	
		exports.isSimplePath = function (exp) {
		  return pathTestRE.test(exp) &&
		    // don't treat true/false as paths
		    !booleanLiteralRE.test(exp) &&
		    // Math constants e.g. Math.PI, Math.E etc.
		    exp.slice(0, 5) !== 'Math.'
		}
	
	
	/***/ },
	/* 43 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var Cache = __webpack_require__(7)
		var pathCache = new Cache(1000)
		var identRE = exports.identRE = /^[$_a-zA-Z]+[\w$]*$/
	
		// actions
		var APPEND = 0
		var PUSH = 1
	
		// states
		var BEFORE_PATH = 0
		var IN_PATH = 1
		var BEFORE_IDENT = 2
		var IN_IDENT = 3
		var BEFORE_ELEMENT = 4
		var AFTER_ZERO = 5
		var IN_INDEX = 6
		var IN_SINGLE_QUOTE = 7
		var IN_DOUBLE_QUOTE = 8
		var IN_SUB_PATH = 9
		var AFTER_ELEMENT = 10
		var AFTER_PATH = 11
		var ERROR = 12
	
		var pathStateMachine = []
	
		pathStateMachine[BEFORE_PATH] = {
		  'ws': [BEFORE_PATH],
		  'ident': [IN_IDENT, APPEND],
		  '[': [BEFORE_ELEMENT],
		  'eof': [AFTER_PATH]
		}
	
		pathStateMachine[IN_PATH] = {
		  'ws': [IN_PATH],
		  '.': [BEFORE_IDENT],
		  '[': [BEFORE_ELEMENT],
		  'eof': [AFTER_PATH]
		}
	
		pathStateMachine[BEFORE_IDENT] = {
		  'ws': [BEFORE_IDENT],
		  'ident': [IN_IDENT, APPEND]
		}
	
		pathStateMachine[IN_IDENT] = {
		  'ident': [IN_IDENT, APPEND],
		  '0': [IN_IDENT, APPEND],
		  'number': [IN_IDENT, APPEND],
		  'ws': [IN_PATH, PUSH],
		  '.': [BEFORE_IDENT, PUSH],
		  '[': [BEFORE_ELEMENT, PUSH],
		  'eof': [AFTER_PATH, PUSH]
		}
	
		pathStateMachine[BEFORE_ELEMENT] = {
		  'ws': [BEFORE_ELEMENT],
		  '0': [AFTER_ZERO, APPEND],
		  'number': [IN_INDEX, APPEND],
		  "'": [IN_SINGLE_QUOTE, APPEND, ''],
		  '"': [IN_DOUBLE_QUOTE, APPEND, ''],
		  'ident': [IN_SUB_PATH, APPEND, '*']
		}
	
		pathStateMachine[AFTER_ZERO] = {
		  'ws': [AFTER_ELEMENT, PUSH],
		  ']': [IN_PATH, PUSH]
		}
	
		pathStateMachine[IN_INDEX] = {
		  '0': [IN_INDEX, APPEND],
		  'number': [IN_INDEX, APPEND],
		  'ws': [AFTER_ELEMENT],
		  ']': [IN_PATH, PUSH]
		}
	
		pathStateMachine[IN_SINGLE_QUOTE] = {
		  "'": [AFTER_ELEMENT],
		  'eof': ERROR,
		  'else': [IN_SINGLE_QUOTE, APPEND]
		}
	
		pathStateMachine[IN_DOUBLE_QUOTE] = {
		  '"': [AFTER_ELEMENT],
		  'eof': ERROR,
		  'else': [IN_DOUBLE_QUOTE, APPEND]
		}
	
		pathStateMachine[IN_SUB_PATH] = {
		  'ident': [IN_SUB_PATH, APPEND],
		  '0': [IN_SUB_PATH, APPEND],
		  'number': [IN_SUB_PATH, APPEND],
		  'ws': [AFTER_ELEMENT],
		  ']': [IN_PATH, PUSH]
		}
	
		pathStateMachine[AFTER_ELEMENT] = {
		  'ws': [AFTER_ELEMENT],
		  ']': [IN_PATH, PUSH]
		}
	
		/**
		 * Determine the type of a character in a keypath.
		 *
		 * @param {Char} ch
		 * @return {String} type
		 */
	
		function getPathCharType (ch) {
		  if (ch === undefined) {
		    return 'eof'
		  }
	
		  var code = ch.charCodeAt(0)
	
		  switch (code) {
		    case 0x5B: // [
		    case 0x5D: // ]
		    case 0x2E: // .
		    case 0x22: // "
		    case 0x27: // '
		    case 0x30: // 0
		      return ch
	
		    case 0x5F: // _
		    case 0x24: // $
		      return 'ident'
	
		    case 0x20: // Space
		    case 0x09: // Tab
		    case 0x0A: // Newline
		    case 0x0D: // Return
		    case 0xA0:  // No-break space
		    case 0xFEFF:  // Byte Order Mark
		    case 0x2028:  // Line Separator
		    case 0x2029:  // Paragraph Separator
		      return 'ws'
		  }
	
		  // a-z, A-Z
		  if (
		    (code >= 0x61 && code <= 0x7A) ||
		    (code >= 0x41 && code <= 0x5A)
		  ) {
		    return 'ident'
		  }
	
		  // 1-9
		  if (code >= 0x31 && code <= 0x39) {
		    return 'number'
		  }
	
		  return 'else'
		}
	
		/**
		 * Parse a string path into an array of segments
		 *
		 * @param {String} path
		 * @return {Array|undefined}
		 */
	
		function parsePath (path) {
		  var keys = []
		  var index = -1
		  var mode = BEFORE_PATH
		  var c, newChar, key, type, transition, action, typeMap
	
		  var actions = []
		  actions[PUSH] = function () {
		    if (key === undefined) {
		      return
		    }
		    keys.push(key)
		    key = undefined
		  }
		  actions[APPEND] = function () {
		    if (key === undefined) {
		      key = newChar
		    } else {
		      key += newChar
		    }
		  }
	
		  function maybeUnescapeQuote () {
		    var nextChar = path[index + 1]
		    if ((mode === IN_SINGLE_QUOTE && nextChar === "'") ||
		        (mode === IN_DOUBLE_QUOTE && nextChar === '"')) {
		      index++
		      newChar = nextChar
		      actions[APPEND]()
		      return true
		    }
		  }
	
		  while (mode != null) {
		    index++
		    c = path[index]
	
		    if (c === '\\' && maybeUnescapeQuote()) {
		      continue
		    }
	
		    type = getPathCharType(c)
		    typeMap = pathStateMachine[mode]
		    transition = typeMap[type] || typeMap['else'] || ERROR
	
		    if (transition === ERROR) {
		      return // parse error
		    }
	
		    mode = transition[0]
		    action = actions[transition[1]]
		    if (action) {
		      newChar = transition[2]
		      newChar = newChar === undefined
		        ? c
		        : newChar === '*'
		          ? newChar + c
		          : newChar
		      action()
		    }
	
		    if (mode === AFTER_PATH) {
		      keys.raw = path
		      return keys
		    }
		  }
		}
	
		/**
		 * Format a accessor segment based on its type.
		 *
		 * @param {String} key
		 * @return {Boolean}
		 */
	
		function formatAccessor (key) {
		  if (identRE.test(key)) { // identifier
		    return '.' + key
		  } else if (+key === key >>> 0) { // bracket index
		    return '[' + key + ']'
		  } else if (key.charAt(0) === '*') {
		    return '[o' + formatAccessor(key.slice(1)) + ']'
		  } else { // bracket string
		    return '["' + key.replace(/"/g, '\\"') + '"]'
		  }
		}
	
		/**
		 * Compiles a getter function with a fixed path.
		 * The fixed path getter supresses errors.
		 *
		 * @param {Array} path
		 * @return {Function}
		 */
	
		exports.compileGetter = function (path) {
		  var body = 'return o' + path.map(formatAccessor).join('')
		  return new Function('o', body)
		}
	
		/**
		 * External parse that check for a cache hit first
		 *
		 * @param {String} path
		 * @return {Array|undefined}
		 */
	
		exports.parse = function (path) {
		  var hit = pathCache.get(path)
		  if (!hit) {
		    hit = parsePath(path)
		    if (hit) {
		      hit.get = exports.compileGetter(hit)
		      pathCache.put(path, hit)
		    }
		  }
		  return hit
		}
	
		/**
		 * Get from an object from a path string
		 *
		 * @param {Object} obj
		 * @param {String} path
		 */
	
		exports.get = function (obj, path) {
		  path = exports.parse(path)
		  if (path) {
		    return path.get(obj)
		  }
		}
	
		/**
		 * Warn against setting non-existent root path on a vm.
		 */
	
		var warnNonExistent
		if (true) {
		  warnNonExistent = function (path) {
		    _.warn(
		      'You are setting a non-existent path "' + path.raw + '" ' +
		      'on a vm instance. Consider pre-initializing the property ' +
		      'with the "data" option for more reliable reactivity ' +
		      'and better performance.'
		    )
		  }
		}
	
		/**
		 * Set on an object from a path
		 *
		 * @param {Object} obj
		 * @param {String | Array} path
		 * @param {*} val
		 */
	
		exports.set = function (obj, path, val) {
		  var original = obj
		  if (typeof path === 'string') {
		    path = exports.parse(path)
		  }
		  if (!path || !_.isObject(obj)) {
		    return false
		  }
		  var last, key
		  for (var i = 0, l = path.length; i < l; i++) {
		    last = obj
		    key = path[i]
		    if (key.charAt(0) === '*') {
		      key = original[key.slice(1)]
		    }
		    if (i < l - 1) {
		      obj = obj[key]
		      if (!_.isObject(obj)) {
		        obj = {}
		        if (("development") !== 'production' && last._isVue) {
		          warnNonExistent(path)
		        }
		        _.set(last, key, obj)
		      }
		    } else {
		      if (_.isArray(obj)) {
		        obj.$set(key, val)
		      } else if (key in obj) {
		        obj[key] = val
		      } else {
		        if (("development") !== 'production' && obj._isVue) {
		          warnNonExistent(path)
		        }
		        _.set(obj, key, val)
		      }
		    }
		  }
		  return true
		}
	
	
	/***/ },
	/* 44 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var config = __webpack_require__(5)
	
		// we have two separate queues: one for directive updates
		// and one for user watcher registered via $watch().
		// we want to guarantee directive updates to be called
		// before user watchers so that when user watchers are
		// triggered, the DOM would have already been in updated
		// state.
		var queue = []
		var userQueue = []
		var has = {}
		var circular = {}
		var waiting = false
		var internalQueueDepleted = false
	
		/**
		 * Reset the batcher's state.
		 */
	
		function resetBatcherState () {
		  queue = []
		  userQueue = []
		  has = {}
		  circular = {}
		  waiting = internalQueueDepleted = false
		}
	
		/**
		 * Flush both queues and run the watchers.
		 */
	
		function flushBatcherQueue () {
		  runBatcherQueue(queue)
		  internalQueueDepleted = true
		  runBatcherQueue(userQueue)
		  // dev tool hook
		  /* istanbul ignore if */
		  if (true) {
		    if (_.inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
		      window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit('flush')
		    }
		  }
		  resetBatcherState()
		}
	
		/**
		 * Run the watchers in a single queue.
		 *
		 * @param {Array} queue
		 */
	
		function runBatcherQueue (queue) {
		  // do not cache length because more watchers might be pushed
		  // as we run existing watchers
		  for (var i = 0; i < queue.length; i++) {
		    var watcher = queue[i]
		    var id = watcher.id
		    has[id] = null
		    watcher.run()
		    // in dev build, check and stop circular updates.
		    if (("development") !== 'production' && has[id] != null) {
		      circular[id] = (circular[id] || 0) + 1
		      if (circular[id] > config._maxUpdateCount) {
		        queue.splice(has[id], 1)
		        _.warn(
		          'You may have an infinite update loop for watcher ' +
		          'with expression: ' + watcher.expression
		        )
		      }
		    }
		  }
		}
	
		/**
		 * Push a watcher into the watcher queue.
		 * Jobs with duplicate IDs will be skipped unless it's
		 * pushed when the queue is being flushed.
		 *
		 * @param {Watcher} watcher
		 *   properties:
		 *   - {Number} id
		 *   - {Function} run
		 */
	
		exports.push = function (watcher) {
		  var id = watcher.id
		  if (has[id] == null) {
		    // if an internal watcher is pushed, but the internal
		    // queue is already depleted, we run it immediately.
		    if (internalQueueDepleted && !watcher.user) {
		      watcher.run()
		      return
		    }
		    // push watcher into appropriate queue
		    var q = watcher.user ? userQueue : queue
		    has[id] = q.length
		    q.push(watcher)
		    // queue the flush
		    if (!waiting) {
		      waiting = true
		      _.nextTick(flushBatcherQueue)
		    }
		  }
		}
	
	
	/***/ },
	/* 45 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var Transition = __webpack_require__(46)
	
		module.exports = {
	
		  priority: 1100,
	
		  update: function (id, oldId) {
		    var el = this.el
		    // resolve on owner vm
		    var hooks = _.resolveAsset(this.vm.$options, 'transitions', id)
		    id = id || 'v'
		    // apply on closest vm
		    el.__v_trans = new Transition(el, id, hooks, this.el.__vue__ || this.vm)
		    if (oldId) {
		      _.removeClass(el, oldId + '-transition')
		    }
		    _.addClass(el, id + '-transition')
		  }
		}
	
	
	/***/ },
	/* 46 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var queue = __webpack_require__(47)
		var addClass = _.addClass
		var removeClass = _.removeClass
		var transitionEndEvent = _.transitionEndEvent
		var animationEndEvent = _.animationEndEvent
		var transDurationProp = _.transitionProp + 'Duration'
		var animDurationProp = _.animationProp + 'Duration'
	
		var TYPE_TRANSITION = 1
		var TYPE_ANIMATION = 2
	
		/**
		 * A Transition object that encapsulates the state and logic
		 * of the transition.
		 *
		 * @param {Element} el
		 * @param {String} id
		 * @param {Object} hooks
		 * @param {Vue} vm
		 */
	
		function Transition (el, id, hooks, vm) {
		  this.id = id
		  this.el = el
		  this.enterClass = id + '-enter'
		  this.leaveClass = id + '-leave'
		  this.hooks = hooks
		  this.vm = vm
		  // async state
		  this.pendingCssEvent =
		  this.pendingCssCb =
		  this.cancel =
		  this.pendingJsCb =
		  this.op =
		  this.cb = null
		  this.justEntered = false
		  this.entered = this.left = false
		  this.typeCache = {}
		  // bind
		  var self = this
		  ;['enterNextTick', 'enterDone', 'leaveNextTick', 'leaveDone']
		    .forEach(function (m) {
		      self[m] = _.bind(self[m], self)
		    })
		}
	
		var p = Transition.prototype
	
		/**
		 * Start an entering transition.
		 *
		 * 1. enter transition triggered
		 * 2. call beforeEnter hook
		 * 3. add enter class
		 * 4. insert/show element
		 * 5. call enter hook (with possible explicit js callback)
		 * 6. reflow
		 * 7. based on transition type:
		 *    - transition:
		 *        remove class now, wait for transitionend,
		 *        then done if there's no explicit js callback.
		 *    - animation:
		 *        wait for animationend, remove class,
		 *        then done if there's no explicit js callback.
		 *    - no css transition:
		 *        done now if there's no explicit js callback.
		 * 8. wait for either done or js callback, then call
		 *    afterEnter hook.
		 *
		 * @param {Function} op - insert/show the element
		 * @param {Function} [cb]
		 */
	
		p.enter = function (op, cb) {
		  this.cancelPending()
		  this.callHook('beforeEnter')
		  this.cb = cb
		  addClass(this.el, this.enterClass)
		  op()
		  this.entered = false
		  this.callHookWithCb('enter')
		  if (this.entered) {
		    return // user called done synchronously.
		  }
		  this.cancel = this.hooks && this.hooks.enterCancelled
		  queue.push(this.enterNextTick)
		}
	
		/**
		 * The "nextTick" phase of an entering transition, which is
		 * to be pushed into a queue and executed after a reflow so
		 * that removing the class can trigger a CSS transition.
		 */
	
		p.enterNextTick = function () {
	
		  // Important hack:
		  // in Chrome, if a just-entered element is applied the
		  // leave class while its interpolated property still has
		  // a very small value (within one frame), Chrome will
		  // skip the leave transition entirely and not firing the
		  // transtionend event. Therefore we need to protected
		  // against such cases using a one-frame timeout.
		  this.justEntered = true
		  var self = this
		  setTimeout(function () {
		    self.justEntered = false
		  }, 17)
	
		  var enterDone = this.enterDone
		  var type = this.getCssTransitionType(this.enterClass)
		  if (!this.pendingJsCb) {
		    if (type === TYPE_TRANSITION) {
		      // trigger transition by removing enter class now
		      removeClass(this.el, this.enterClass)
		      this.setupCssCb(transitionEndEvent, enterDone)
		    } else if (type === TYPE_ANIMATION) {
		      this.setupCssCb(animationEndEvent, enterDone)
		    } else {
		      enterDone()
		    }
		  } else if (type === TYPE_TRANSITION) {
		    removeClass(this.el, this.enterClass)
		  }
		}
	
		/**
		 * The "cleanup" phase of an entering transition.
		 */
	
		p.enterDone = function () {
		  this.entered = true
		  this.cancel = this.pendingJsCb = null
		  removeClass(this.el, this.enterClass)
		  this.callHook('afterEnter')
		  if (this.cb) this.cb()
		}
	
		/**
		 * Start a leaving transition.
		 *
		 * 1. leave transition triggered.
		 * 2. call beforeLeave hook
		 * 3. add leave class (trigger css transition)
		 * 4. call leave hook (with possible explicit js callback)
		 * 5. reflow if no explicit js callback is provided
		 * 6. based on transition type:
		 *    - transition or animation:
		 *        wait for end event, remove class, then done if
		 *        there's no explicit js callback.
		 *    - no css transition:
		 *        done if there's no explicit js callback.
		 * 7. wait for either done or js callback, then call
		 *    afterLeave hook.
		 *
		 * @param {Function} op - remove/hide the element
		 * @param {Function} [cb]
		 */
	
		p.leave = function (op, cb) {
		  this.cancelPending()
		  this.callHook('beforeLeave')
		  this.op = op
		  this.cb = cb
		  addClass(this.el, this.leaveClass)
		  this.left = false
		  this.callHookWithCb('leave')
		  if (this.left) {
		    return // user called done synchronously.
		  }
		  this.cancel = this.hooks && this.hooks.leaveCancelled
		  // only need to handle leaveDone if
		  // 1. the transition is already done (synchronously called
		  //    by the user, which causes this.op set to null)
		  // 2. there's no explicit js callback
		  if (this.op && !this.pendingJsCb) {
		    // if a CSS transition leaves immediately after enter,
		    // the transitionend event never fires. therefore we
		    // detect such cases and end the leave immediately.
		    if (this.justEntered) {
		      this.leaveDone()
		    } else {
		      queue.push(this.leaveNextTick)
		    }
		  }
		}
	
		/**
		 * The "nextTick" phase of a leaving transition.
		 */
	
		p.leaveNextTick = function () {
		  var type = this.getCssTransitionType(this.leaveClass)
		  if (type) {
		    var event = type === TYPE_TRANSITION
		      ? transitionEndEvent
		      : animationEndEvent
		    this.setupCssCb(event, this.leaveDone)
		  } else {
		    this.leaveDone()
		  }
		}
	
		/**
		 * The "cleanup" phase of a leaving transition.
		 */
	
		p.leaveDone = function () {
		  this.left = true
		  this.cancel = this.pendingJsCb = null
		  this.op()
		  removeClass(this.el, this.leaveClass)
		  this.callHook('afterLeave')
		  if (this.cb) this.cb()
		  this.op = null
		}
	
		/**
		 * Cancel any pending callbacks from a previously running
		 * but not finished transition.
		 */
	
		p.cancelPending = function () {
		  this.op = this.cb = null
		  var hasPending = false
		  if (this.pendingCssCb) {
		    hasPending = true
		    _.off(this.el, this.pendingCssEvent, this.pendingCssCb)
		    this.pendingCssEvent = this.pendingCssCb = null
		  }
		  if (this.pendingJsCb) {
		    hasPending = true
		    this.pendingJsCb.cancel()
		    this.pendingJsCb = null
		  }
		  if (hasPending) {
		    removeClass(this.el, this.enterClass)
		    removeClass(this.el, this.leaveClass)
		  }
		  if (this.cancel) {
		    this.cancel.call(this.vm, this.el)
		    this.cancel = null
		  }
		}
	
		/**
		 * Call a user-provided synchronous hook function.
		 *
		 * @param {String} type
		 */
	
		p.callHook = function (type) {
		  if (this.hooks && this.hooks[type]) {
		    this.hooks[type].call(this.vm, this.el)
		  }
		}
	
		/**
		 * Call a user-provided, potentially-async hook function.
		 * We check for the length of arguments to see if the hook
		 * expects a `done` callback. If true, the transition's end
		 * will be determined by when the user calls that callback;
		 * otherwise, the end is determined by the CSS transition or
		 * animation.
		 *
		 * @param {String} type
		 */
	
		p.callHookWithCb = function (type) {
		  var hook = this.hooks && this.hooks[type]
		  if (hook) {
		    if (hook.length > 1) {
		      this.pendingJsCb = _.cancellable(this[type + 'Done'])
		    }
		    hook.call(this.vm, this.el, this.pendingJsCb)
		  }
		}
	
		/**
		 * Get an element's transition type based on the
		 * calculated styles.
		 *
		 * @param {String} className
		 * @return {Number}
		 */
	
		p.getCssTransitionType = function (className) {
		  /* istanbul ignore if */
		  if (
		    !transitionEndEvent ||
		    // skip CSS transitions if page is not visible -
		    // this solves the issue of transitionend events not
		    // firing until the page is visible again.
		    // pageVisibility API is supported in IE10+, same as
		    // CSS transitions.
		    document.hidden ||
		    // explicit js-only transition
		    (this.hooks && this.hooks.css === false) ||
		    // element is hidden
		    isHidden(this.el)
		  ) {
		    return
		  }
		  var type = this.typeCache[className]
		  if (type) return type
		  var inlineStyles = this.el.style
		  var computedStyles = window.getComputedStyle(this.el)
		  var transDuration =
		    inlineStyles[transDurationProp] ||
		    computedStyles[transDurationProp]
		  if (transDuration && transDuration !== '0s') {
		    type = TYPE_TRANSITION
		  } else {
		    var animDuration =
		      inlineStyles[animDurationProp] ||
		      computedStyles[animDurationProp]
		    if (animDuration && animDuration !== '0s') {
		      type = TYPE_ANIMATION
		    }
		  }
		  if (type) {
		    this.typeCache[className] = type
		  }
		  return type
		}
	
		/**
		 * Setup a CSS transitionend/animationend callback.
		 *
		 * @param {String} event
		 * @param {Function} cb
		 */
	
		p.setupCssCb = function (event, cb) {
		  this.pendingCssEvent = event
		  var self = this
		  var el = this.el
		  var onEnd = this.pendingCssCb = function (e) {
		    if (e.target === el) {
		      _.off(el, event, onEnd)
		      self.pendingCssEvent = self.pendingCssCb = null
		      if (!self.pendingJsCb && cb) {
		        cb()
		      }
		    }
		  }
		  _.on(el, event, onEnd)
		}
	
		/**
		 * Check if an element is hidden - in that case we can just
		 * skip the transition alltogether.
		 *
		 * @param {Element} el
		 * @return {Boolean}
		 */
	
		function isHidden (el) {
		  return !(
		    el.offsetWidth &&
		    el.offsetHeight &&
		    el.getClientRects().length
		  )
		}
	
		module.exports = Transition
	
	
	/***/ },
	/* 47 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var queue = []
		var queued = false
	
		/**
		 * Push a job into the queue.
		 *
		 * @param {Function} job
		 */
	
		exports.push = function (job) {
		  queue.push(job)
		  if (!queued) {
		    queued = true
		    _.nextTick(flush)
		  }
		}
	
		/**
		 * Flush the queue, and do one forced reflow before
		 * triggering transitions.
		 */
	
		function flush () {
		  // Force layout
		  var f = document.documentElement.offsetHeight
		  for (var i = 0; i < queue.length; i++) {
		    queue[i]()
		  }
		  queue = []
		  queued = false
		  // dummy return, so js linters don't complain about
		  // unused variable f
		  return f
		}
	
	
	/***/ },
	/* 48 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var dirParser = __webpack_require__(8)
		var propDef = __webpack_require__(39)
		var propBindingModes = __webpack_require__(5)._propBindingModes
		var empty = {}
	
		// regexes
		var identRE = __webpack_require__(43).identRE
		var settablePathRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\[[^\[\]]+\])*$/
	
		/**
		 * Compile props on a root element and return
		 * a props link function.
		 *
		 * @param {Element|DocumentFragment} el
		 * @param {Array} propOptions
		 * @return {Function} propsLinkFn
		 */
	
		module.exports = function compileProps (el, propOptions) {
		  var props = []
		  var names = Object.keys(propOptions)
		  var i = names.length
		  var options, name, attr, value, path, parsed, prop
		  while (i--) {
		    name = names[i]
		    options = propOptions[name] || empty
	
		    if (("development") !== 'production' && name === '$data') {
		      _.warn('Do not use $data as prop.')
		      continue
		    }
	
		    // props could contain dashes, which will be
		    // interpreted as minus calculations by the parser
		    // so we need to camelize the path here
		    path = _.camelize(name)
		    if (!identRE.test(path)) {
		      ("development") !== 'production' && _.warn(
		        'Invalid prop key: "' + name + '". Prop keys ' +
		        'must be valid identifiers.'
		      )
		      continue
		    }
	
		    prop = {
		      name: name,
		      path: path,
		      options: options,
		      mode: propBindingModes.ONE_WAY,
		      raw: null
		    }
	
		    attr = _.hyphenate(name)
		    // first check dynamic version
		    if ((value = _.getBindAttr(el, attr)) === null) {
		      if ((value = _.getBindAttr(el, attr + '.sync')) !== null) {
		        prop.mode = propBindingModes.TWO_WAY
		      } else if ((value = _.getBindAttr(el, attr + '.once')) !== null) {
		        prop.mode = propBindingModes.ONE_TIME
		      }
		    }
		    if (value !== null) {
		      // has dynamic binding!
		      prop.raw = value
		      parsed = dirParser.parse(value)
		      value = parsed.expression
		      prop.filters = parsed.filters
		      // check binding type
		      if (_.isLiteral(value)) {
		        // for expressions containing literal numbers and
		        // booleans, there's no need to setup a prop binding,
		        // so we can optimize them as a one-time set.
		        prop.optimizedLiteral = true
		      } else {
		        prop.dynamic = true
		        // check non-settable path for two-way bindings
		        if (("development") !== 'production' &&
		            prop.mode === propBindingModes.TWO_WAY &&
		            !settablePathRE.test(value)) {
		          prop.mode = propBindingModes.ONE_WAY
		          _.warn(
		            'Cannot bind two-way prop with non-settable ' +
		            'parent path: ' + value
		          )
		        }
		      }
		      prop.parentPath = value
	
		      // warn required two-way
		      if (
		        ("development") !== 'production' &&
		        options.twoWay &&
		        prop.mode !== propBindingModes.TWO_WAY
		      ) {
		        _.warn(
		          'Prop "' + name + '" expects a two-way binding type.'
		        )
		      }
		    } else if ((value = _.attr(el, attr)) !== null) {
		      // has literal binding!
		      prop.raw = value
		    } else if (options.required) {
		      // warn missing required
		      ("development") !== 'production' && _.warn(
		        'Missing required prop: ' + name
		      )
		    }
		    // push prop
		    props.push(prop)
		  }
		  return makePropsLinkFn(props)
		}
	
		/**
		 * Build a function that applies props to a vm.
		 *
		 * @param {Array} props
		 * @return {Function} propsLinkFn
		 */
	
		function makePropsLinkFn (props) {
		  return function propsLinkFn (vm, scope) {
		    // store resolved props info
		    vm._props = {}
		    var i = props.length
		    var prop, path, options, value, raw
		    while (i--) {
		      prop = props[i]
		      raw = prop.raw
		      path = prop.path
		      options = prop.options
		      vm._props[path] = prop
		      if (raw === null) {
		        // initialize absent prop
		        _.initProp(vm, prop, getDefault(vm, options))
		      } else if (prop.dynamic) {
		        // dynamic prop
		        if (vm._context) {
		          if (prop.mode === propBindingModes.ONE_TIME) {
		            // one time binding
		            value = (scope || vm._context).$get(prop.parentPath)
		            _.initProp(vm, prop, value)
		          } else {
		            // dynamic binding
		            vm._bindDir({
		              name: 'prop',
		              def: propDef,
		              prop: prop
		            }, null, null, scope) // el, host, scope
		          }
		        } else {
		          ("development") !== 'production' && _.warn(
		            'Cannot bind dynamic prop on a root instance' +
		            ' with no parent: ' + prop.name + '="' +
		            raw + '"'
		          )
		        }
		      } else if (prop.optimizedLiteral) {
		        // optimized literal, cast it and just set once
		        var stripped = _.stripQuotes(raw)
		        value = stripped === raw
		          ? _.toBoolean(_.toNumber(raw))
		          : stripped
		        _.initProp(vm, prop, value)
		      } else {
		        // string literal, but we need to cater for
		        // Boolean props with no value
		        value = options.type === Boolean && raw === ''
		          ? true
		          : raw
		        _.initProp(vm, prop, value)
		      }
		    }
		  }
		}
	
		/**
		 * Get the default value of a prop.
		 *
		 * @param {Vue} vm
		 * @param {Object} options
		 * @return {*}
		 */
	
		function getDefault (vm, options) {
		  // no default, return undefined
		  if (!options.hasOwnProperty('default')) {
		    // absent boolean value defaults to false
		    return options.type === Boolean
		      ? false
		      : undefined
		  }
		  var def = options.default
		  // warn against non-factory defaults for Object & Array
		  if (_.isObject(def)) {
		    ("development") !== 'production' && _.warn(
		      'Object/Array as default prop values will be shared ' +
		      'across multiple instances. Use a factory function ' +
		      'to return the default value instead.'
		    )
		  }
		  // call factory function for non-Function types
		  return typeof def === 'function' && options.type !== Function
		    ? def.call(vm)
		    : def
		}
	
	
	/***/ },
	/* 49 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var templateParser = __webpack_require__(19)
		var specialCharRE = /[^\w\-:\.]/
	
		/**
		 * Process an element or a DocumentFragment based on a
		 * instance option object. This allows us to transclude
		 * a template node/fragment before the instance is created,
		 * so the processed fragment can then be cloned and reused
		 * in v-for.
		 *
		 * @param {Element} el
		 * @param {Object} options
		 * @return {Element|DocumentFragment}
		 */
	
		exports.transclude = function (el, options) {
		  // extract container attributes to pass them down
		  // to compiler, because they need to be compiled in
		  // parent scope. we are mutating the options object here
		  // assuming the same object will be used for compile
		  // right after this.
		  if (options) {
		    options._containerAttrs = extractAttrs(el)
		  }
		  // for template tags, what we want is its content as
		  // a documentFragment (for fragment instances)
		  if (_.isTemplate(el)) {
		    el = templateParser.parse(el)
		  }
		  if (options) {
		    if (options._asComponent && !options.template) {
		      options.template = '<slot></slot>'
		    }
		    if (options.template) {
		      options._content = _.extractContent(el)
		      el = transcludeTemplate(el, options)
		    }
		  }
		  if (el instanceof DocumentFragment) {
		    // anchors for fragment instance
		    // passing in `persist: true` to avoid them being
		    // discarded by IE during template cloning
		    _.prepend(_.createAnchor('v-start', true), el)
		    el.appendChild(_.createAnchor('v-end', true))
		  }
		  return el
		}
	
		/**
		 * Process the template option.
		 * If the replace option is true this will swap the $el.
		 *
		 * @param {Element} el
		 * @param {Object} options
		 * @return {Element|DocumentFragment}
		 */
	
		function transcludeTemplate (el, options) {
		  var template = options.template
		  var frag = templateParser.parse(template, true)
		  if (frag) {
		    var replacer = frag.firstChild
		    var tag = replacer.tagName && replacer.tagName.toLowerCase()
		    if (options.replace) {
		      /* istanbul ignore if */
		      if (el === document.body) {
		        ("development") !== 'production' && _.warn(
		          'You are mounting an instance with a template to ' +
		          '<body>. This will replace <body> entirely. You ' +
		          'should probably use `replace: false` here.'
		        )
		      }
		      // there are many cases where the instance must
		      // become a fragment instance: basically anything that
		      // can create more than 1 root nodes.
		      if (
		        // multi-children template
		        frag.childNodes.length > 1 ||
		        // non-element template
		        replacer.nodeType !== 1 ||
		        // single nested component
		        tag === 'component' ||
		        _.resolveAsset(options, 'components', tag) ||
		        replacer.hasAttribute('is') ||
		        replacer.hasAttribute(':is') ||
		        replacer.hasAttribute('v-bind:is') ||
		        // element directive
		        _.resolveAsset(options, 'elementDirectives', tag) ||
		        // for block
		        replacer.hasAttribute('v-for') ||
		        // if block
		        replacer.hasAttribute('v-if')
		      ) {
		        return frag
		      } else {
		        options._replacerAttrs = extractAttrs(replacer)
		        mergeAttrs(el, replacer)
		        return replacer
		      }
		    } else {
		      el.appendChild(frag)
		      return el
		    }
		  } else {
		    ("development") !== 'production' && _.warn(
		      'Invalid template option: ' + template
		    )
		  }
		}
	
		/**
		 * Helper to extract a component container's attributes
		 * into a plain object array.
		 *
		 * @param {Element} el
		 * @return {Array}
		 */
	
		function extractAttrs (el) {
		  if (el.nodeType === 1 && el.hasAttributes()) {
		    return _.toArray(el.attributes)
		  }
		}
	
		/**
		 * Merge the attributes of two elements, and make sure
		 * the class names are merged properly.
		 *
		 * @param {Element} from
		 * @param {Element} to
		 */
	
		function mergeAttrs (from, to) {
		  var attrs = from.attributes
		  var i = attrs.length
		  var name, value
		  while (i--) {
		    name = attrs[i].name
		    value = attrs[i].value
		    if (!to.hasAttribute(name) && !specialCharRE.test(name)) {
		      to.setAttribute(name, value)
		    } else if (name === 'class') {
		      value = to.getAttribute(name) + ' ' + value
		      to.setAttribute(name, value)
		    }
		  }
		}
	
	
	/***/ },
	/* 50 */
	/***/ function(module, exports, __webpack_require__) {
	
		exports.slot = __webpack_require__(51)
		exports.partial = __webpack_require__(52)
	
	
	/***/ },
	/* 51 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var templateParser = __webpack_require__(19)
	
		// This is the elementDirective that handles <content>
		// transclusions. It relies on the raw content of an
		// instance being stored as `$options._content` during
		// the transclude phase.
	
		module.exports = {
	
		  priority: 1750,
	
		  params: ['name'],
	
		  bind: function () {
		    var host = this.vm
		    var raw = host.$options._content
		    var content
		    if (!raw) {
		      this.fallback()
		      return
		    }
		    var context = host._context
		    var slotName = this.params.name
		    if (!slotName) {
		      // Default content
		      var self = this
		      var compileDefaultContent = function () {
		        self.compile(
		          extractFragment(raw.childNodes, raw, true),
		          context,
		          host
		        )
		      }
		      if (!host._isCompiled) {
		        // defer until the end of instance compilation,
		        // because the default outlet must wait until all
		        // other possible outlets with selectors have picked
		        // out their contents.
		        host.$once('hook:compiled', compileDefaultContent)
		      } else {
		        compileDefaultContent()
		      }
		    } else {
		      var selector = '[slot="' + slotName + '"]'
		      var nodes = raw.querySelectorAll(selector)
		      if (nodes.length) {
		        content = extractFragment(nodes, raw)
		        if (content.hasChildNodes()) {
		          this.compile(content, context, host)
		        } else {
		          this.fallback()
		        }
		      } else {
		        this.fallback()
		      }
		    }
		  },
	
		  fallback: function () {
		    this.compile(_.extractContent(this.el, true), this.vm)
		  },
	
		  compile: function (content, context, host) {
		    if (content && context) {
		      var scope = host
		        ? host._scope
		        : this._scope
		      this.unlink = context.$compile(
		        content, host, scope, this._frag
		      )
		    }
		    if (content) {
		      _.replace(this.el, content)
		    } else {
		      _.remove(this.el)
		    }
		  },
	
		  unbind: function () {
		    if (this.unlink) {
		      this.unlink()
		    }
		  }
		}
	
		/**
		 * Extract qualified content nodes from a node list.
		 *
		 * @param {NodeList} nodes
		 * @param {Element} parent
		 * @param {Boolean} main
		 * @return {DocumentFragment}
		 */
	
		function extractFragment (nodes, parent, main) {
		  var frag = document.createDocumentFragment()
		  for (var i = 0, l = nodes.length; i < l; i++) {
		    var node = nodes[i]
		    // if this is the main outlet, we want to skip all
		    // previously selected nodes;
		    // otherwise, we want to mark the node as selected.
		    // clone the node so the original raw content remains
		    // intact. this ensures proper re-compilation in cases
		    // where the outlet is inside a conditional block
		    if (main && !node.__v_selected) {
		      append(node)
		    } else if (!main && node.parentNode === parent) {
		      node.__v_selected = true
		      append(node)
		    }
		  }
		  return frag
	
		  function append (node) {
		    if (_.isTemplate(node) &&
		        !node.hasAttribute('v-if') &&
		        !node.hasAttribute('v-for')) {
		      node = templateParser.parse(node)
		    }
		    node = templateParser.clone(node)
		    frag.appendChild(node)
		  }
		}
	
	
	/***/ },
	/* 52 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var vIf = __webpack_require__(23)
		var FragmentFactory = __webpack_require__(21)
	
		module.exports = {
	
		  priority: 1750,
	
		  params: ['name'],
	
		  // watch changes to name for dynamic partials
		  paramWatchers: {
		    name: function (value) {
		      vIf.remove.call(this)
		      if (value) {
		        this.insert(value)
		      }
		    }
		  },
	
		  bind: function () {
		    this.anchor = _.createAnchor('v-partial')
		    _.replace(this.el, this.anchor)
		    this.insert(this.params.name)
		  },
	
		  insert: function (id) {
		    var partial = _.resolveAsset(this.vm.$options, 'partials', id)
		    if (true) {
		      _.assertAsset(partial, 'partial', id)
		    }
		    if (partial) {
		      this.factory = new FragmentFactory(this.vm, partial)
		      vIf.insert.call(this)
		    }
		  },
	
		  unbind: function () {
		    if (this.frag) {
		      this.frag.destroy()
		    }
		  }
		}
	
	
	/***/ },
	/* 53 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
	
		/**
		 * Stringify value.
		 *
		 * @param {Number} indent
		 */
	
		exports.json = {
		  read: function (value, indent) {
		    return typeof value === 'string'
		      ? value
		      : JSON.stringify(value, null, Number(indent) || 2)
		  },
		  write: function (value) {
		    try {
		      return JSON.parse(value)
		    } catch (e) {
		      return value
		    }
		  }
		}
	
		/**
		 * 'abc' => 'Abc'
		 */
	
		exports.capitalize = function (value) {
		  if (!value && value !== 0) return ''
		  value = value.toString()
		  return value.charAt(0).toUpperCase() + value.slice(1)
		}
	
		/**
		 * 'abc' => 'ABC'
		 */
	
		exports.uppercase = function (value) {
		  return (value || value === 0)
		    ? value.toString().toUpperCase()
		    : ''
		}
	
		/**
		 * 'AbC' => 'abc'
		 */
	
		exports.lowercase = function (value) {
		  return (value || value === 0)
		    ? value.toString().toLowerCase()
		    : ''
		}
	
		/**
		 * 12345 => $12,345.00
		 *
		 * @param {String} sign
		 */
	
		var digitsRE = /(\d{3})(?=\d)/g
		exports.currency = function (value, currency) {
		  value = parseFloat(value)
		  if (!isFinite(value) || (!value && value !== 0)) return ''
		  currency = currency != null ? currency : '$'
		  var stringified = Math.abs(value).toFixed(2)
		  var _int = stringified.slice(0, -3)
		  var i = _int.length % 3
		  var head = i > 0
		    ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
		    : ''
		  var _float = stringified.slice(-3)
		  var sign = value < 0 ? '-' : ''
		  return currency + sign + head +
		    _int.slice(i).replace(digitsRE, '$1,') +
		    _float
		}
	
		/**
		 * 'item' => 'items'
		 *
		 * @params
		 *  an array of strings corresponding to
		 *  the single, double, triple ... forms of the word to
		 *  be pluralized. When the number to be pluralized
		 *  exceeds the length of the args, it will use the last
		 *  entry in the array.
		 *
		 *  e.g. ['single', 'double', 'triple', 'multiple']
		 */
	
		exports.pluralize = function (value) {
		  var args = _.toArray(arguments, 1)
		  return args.length > 1
		    ? (args[value % 10 - 1] || args[args.length - 1])
		    : (args[0] + (value === 1 ? '' : 's'))
		}
	
		/**
		 * Debounce a handler function.
		 *
		 * @param {Function} handler
		 * @param {Number} delay = 300
		 * @return {Function}
		 */
	
		exports.debounce = function (handler, delay) {
		  if (!handler) return
		  if (!delay) {
		    delay = 300
		  }
		  return _.debounce(handler, delay)
		}
	
		/**
		 * Install special array filters
		 */
	
		_.extend(exports, __webpack_require__(54))
	
	
	/***/ },
	/* 54 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var Path = __webpack_require__(43)
		var toArray = __webpack_require__(20)._postProcess
	
		/**
		 * Limit filter for arrays
		 *
		 * @param {Number} n
		 * @param {Number} offset (Decimal expected)
		 */
	
		exports.limitBy = function (arr, n, offset) {
		  offset = offset ? parseInt(offset, 10) : 0
		  return typeof n === 'number'
		    ? arr.slice(offset, offset + n)
		    : arr
		}
	
		/**
		 * Filter filter for arrays
		 *
		 * @param {String} search
		 * @param {String} [delimiter]
		 * @param {String} ...dataKeys
		 */
	
		exports.filterBy = function (arr, search, delimiter) {
		  arr = toArray(arr)
		  if (search == null) {
		    return arr
		  }
		  if (typeof search === 'function') {
		    return arr.filter(search)
		  }
		  // cast to lowercase string
		  search = ('' + search).toLowerCase()
		  // allow optional `in` delimiter
		  // because why not
		  var n = delimiter === 'in' ? 3 : 2
		  // extract and flatten keys
		  var keys = _.toArray(arguments, n).reduce(function (prev, cur) {
		    return prev.concat(cur)
		  }, [])
		  var res = []
		  var item, key, val, j
		  for (var i = 0, l = arr.length; i < l; i++) {
		    item = arr[i]
		    val = (item && item.$value) || item
		    j = keys.length
		    if (j) {
		      while (j--) {
		        key = keys[j]
		        if ((key === '$key' && contains(item.$key, search)) ||
		            contains(Path.get(val, key), search)) {
		          res.push(item)
		          break
		        }
		      }
		    } else if (contains(item, search)) {
		      res.push(item)
		    }
		  }
		  return res
		}
	
		/**
		 * Filter filter for arrays
		 *
		 * @param {String} sortKey
		 * @param {String} reverse
		 */
	
		exports.orderBy = function (arr, sortKey, reverse) {
		  arr = toArray(arr)
		  if (!sortKey) {
		    return arr
		  }
		  var order = (reverse && reverse < 0) ? -1 : 1
		  // sort on a copy to avoid mutating original array
		  return arr.slice().sort(function (a, b) {
		    if (sortKey !== '$key') {
		      if (_.isObject(a) && '$value' in a) a = a.$value
		      if (_.isObject(b) && '$value' in b) b = b.$value
		    }
		    a = _.isObject(a) ? Path.get(a, sortKey) : a
		    b = _.isObject(b) ? Path.get(b, sortKey) : b
		    return a === b ? 0 : a > b ? order : -order
		  })
		}
	
		/**
		 * String contain helper
		 *
		 * @param {*} val
		 * @param {String} search
		 */
	
		function contains (val, search) {
		  var i
		  if (_.isPlainObject(val)) {
		    var keys = Object.keys(val)
		    i = keys.length
		    while (i--) {
		      if (contains(val[keys[i]], search)) {
		        return true
		      }
		    }
		  } else if (_.isArray(val)) {
		    i = val.length
		    while (i--) {
		      if (contains(val[i], search)) {
		        return true
		      }
		    }
		  } else if (val != null) {
		    return val.toString().toLowerCase().indexOf(search) > -1
		  }
		}
	
	
	/***/ },
	/* 55 */
	/***/ function(module, exports, __webpack_require__) {
	
		var mergeOptions = __webpack_require__(1).mergeOptions
		var uid = 0
	
		/**
		 * The main init sequence. This is called for every
		 * instance, including ones that are created from extended
		 * constructors.
		 *
		 * @param {Object} options - this options object should be
		 *                           the result of merging class
		 *                           options and the options passed
		 *                           in to the constructor.
		 */
	
		exports._init = function (options) {
	
		  options = options || {}
	
		  this.$el = null
		  this.$parent = options.parent
		  this.$root = this.$parent
		    ? this.$parent.$root
		    : this
		  this.$children = []
		  this.$refs = {}       // child vm references
		  this.$els = {}        // element references
		  this._watchers = []   // all watchers as an array
		  this._directives = [] // all directives
	
		  // a uid
		  this._uid = uid++
	
		  // a flag to avoid this being observed
		  this._isVue = true
	
		  // events bookkeeping
		  this._events = {}            // registered callbacks
		  this._eventsCount = {}       // for $broadcast optimization
		  this._shouldPropagate = false // for event propagation
	
		  // fragment instance properties
		  this._isFragment = false
		  this._fragment =         // @type {DocumentFragment}
		  this._fragmentStart =    // @type {Text|Comment}
		  this._fragmentEnd = null // @type {Text|Comment}
	
		  // lifecycle state
		  this._isCompiled =
		  this._isDestroyed =
		  this._isReady =
		  this._isAttached =
		  this._isBeingDestroyed = false
		  this._unlinkFn = null
	
		  // context:
		  // if this is a transcluded component, context
		  // will be the common parent vm of this instance
		  // and its host.
		  this._context = options._context || this.$parent
	
		  // scope:
		  // if this is inside an inline v-for, the scope
		  // will be the intermediate scope created for this
		  // repeat fragment. this is used for linking props
		  // and container directives.
		  this._scope = options._scope
	
		  // fragment:
		  // if this instance is compiled inside a Fragment, it
		  // needs to reigster itself as a child of that fragment
		  // for attach/detach to work properly.
		  this._frag = options._frag
		  if (this._frag) {
		    this._frag.children.push(this)
		  }
	
		  // push self into parent / transclusion host
		  if (this.$parent) {
		    this.$parent.$children.push(this)
		  }
	
		  // merge options.
		  options = this.$options = mergeOptions(
		    this.constructor.options,
		    options,
		    this
		  )
	
		  // set ref
		  this._updateRef()
	
		  // initialize data as empty object.
		  // it will be filled up in _initScope().
		  this._data = {}
	
		  // call init hook
		  this._callHook('init')
	
		  // initialize data observation and scope inheritance.
		  this._initState()
	
		  // setup event system and option events.
		  this._initEvents()
	
		  // call created hook
		  this._callHook('created')
	
		  // if `el` option is passed, start compilation.
		  if (options.el) {
		    this.$mount(options.el)
		  }
		}
	
	
	/***/ },
	/* 56 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var inDoc = _.inDoc
		var eventRE = /^v-on:|^@/
	
		/**
		 * Setup the instance's option events & watchers.
		 * If the value is a string, we pull it from the
		 * instance's methods by name.
		 */
	
		exports._initEvents = function () {
		  var options = this.$options
		  if (options._asComponent) {
		    registerComponentEvents(this, options.el)
		  }
		  registerCallbacks(this, '$on', options.events)
		  registerCallbacks(this, '$watch', options.watch)
		}
	
		/**
		 * Register v-on events on a child component
		 *
		 * @param {Vue} vm
		 * @param {Element} el
		 */
	
		function registerComponentEvents (vm, el) {
		  var attrs = el.attributes
		  var name, handler
		  for (var i = 0, l = attrs.length; i < l; i++) {
		    name = attrs[i].name
		    if (eventRE.test(name)) {
		      name = name.replace(eventRE, '')
		      handler = (vm._scope || vm._context).$eval(attrs[i].value, true)
		      vm.$on(name.replace(eventRE), handler)
		    }
		  }
		}
	
		/**
		 * Register callbacks for option events and watchers.
		 *
		 * @param {Vue} vm
		 * @param {String} action
		 * @param {Object} hash
		 */
	
		function registerCallbacks (vm, action, hash) {
		  if (!hash) return
		  var handlers, key, i, j
		  for (key in hash) {
		    handlers = hash[key]
		    if (_.isArray(handlers)) {
		      for (i = 0, j = handlers.length; i < j; i++) {
		        register(vm, action, key, handlers[i])
		      }
		    } else {
		      register(vm, action, key, handlers)
		    }
		  }
		}
	
		/**
		 * Helper to register an event/watch callback.
		 *
		 * @param {Vue} vm
		 * @param {String} action
		 * @param {String} key
		 * @param {Function|String|Object} handler
		 * @param {Object} [options]
		 */
	
		function register (vm, action, key, handler, options) {
		  var type = typeof handler
		  if (type === 'function') {
		    vm[action](key, handler, options)
		  } else if (type === 'string') {
		    var methods = vm.$options.methods
		    var method = methods && methods[handler]
		    if (method) {
		      vm[action](key, method, options)
		    } else {
		      ("development") !== 'production' && _.warn(
		        'Unknown method: "' + handler + '" when ' +
		        'registering callback for ' + action +
		        ': "' + key + '".'
		      )
		    }
		  } else if (handler && type === 'object') {
		    register(vm, action, key, handler.handler, handler)
		  }
		}
	
		/**
		 * Setup recursive attached/detached calls
		 */
	
		exports._initDOMHooks = function () {
		  this.$on('hook:attached', onAttached)
		  this.$on('hook:detached', onDetached)
		}
	
		/**
		 * Callback to recursively call attached hook on children
		 */
	
		function onAttached () {
		  if (!this._isAttached) {
		    this._isAttached = true
		    this.$children.forEach(callAttach)
		  }
		}
	
		/**
		 * Iterator to call attached hook
		 *
		 * @param {Vue} child
		 */
	
		function callAttach (child) {
		  if (!child._isAttached && inDoc(child.$el)) {
		    child._callHook('attached')
		  }
		}
	
		/**
		 * Callback to recursively call detached hook on children
		 */
	
		function onDetached () {
		  if (this._isAttached) {
		    this._isAttached = false
		    this.$children.forEach(callDetach)
		  }
		}
	
		/**
		 * Iterator to call detached hook
		 *
		 * @param {Vue} child
		 */
	
		function callDetach (child) {
		  if (child._isAttached && !inDoc(child.$el)) {
		    child._callHook('detached')
		  }
		}
	
		/**
		 * Trigger all handlers for a hook
		 *
		 * @param {String} hook
		 */
	
		exports._callHook = function (hook) {
		  var handlers = this.$options[hook]
		  if (handlers) {
		    for (var i = 0, j = handlers.length; i < j; i++) {
		      handlers[i].call(this)
		    }
		  }
		  this.$emit('hook:' + hook)
		}
	
	
	/***/ },
	/* 57 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var compiler = __webpack_require__(14)
		var Observer = __webpack_require__(58)
		var Dep = __webpack_require__(41)
		var Watcher = __webpack_require__(40)
	
		/**
		 * Setup the scope of an instance, which contains:
		 * - observed data
		 * - computed properties
		 * - user methods
		 * - meta properties
		 */
	
		exports._initState = function () {
		  this._initProps()
		  this._initMeta()
		  this._initMethods()
		  this._initData()
		  this._initComputed()
		}
	
		/**
		 * Initialize props.
		 */
	
		exports._initProps = function () {
		  var options = this.$options
		  var el = options.el
		  var props = options.props
		  if (props && !el) {
		    ("development") !== 'production' && _.warn(
		      'Props will not be compiled if no `el` option is ' +
		      'provided at instantiation.'
		    )
		  }
		  // make sure to convert string selectors into element now
		  el = options.el = _.query(el)
		  this._propsUnlinkFn = el && el.nodeType === 1 && props
		    // props must be linked in proper scope if inside v-for
		    ? compiler.compileAndLinkProps(this, el, props, this._scope)
		    : null
		}
	
		/**
		 * Initialize the data.
		 */
	
		exports._initData = function () {
		  var propsData = this._data
		  var optionsDataFn = this.$options.data
		  var optionsData = optionsDataFn && optionsDataFn()
		  if (optionsData) {
		    this._data = optionsData
		    for (var prop in propsData) {
		      if (("development") !== 'production' &&
		          optionsData.hasOwnProperty(prop)) {
		        _.warn(
		          'Data field "' + prop + '" is already defined ' +
		          'as a prop. Use prop default value instead.'
		        )
		      }
		      if (this._props[prop].raw !== null ||
		          !optionsData.hasOwnProperty(prop)) {
		        _.set(optionsData, prop, propsData[prop])
		      }
		    }
		  }
		  var data = this._data
		  // proxy data on instance
		  var keys = Object.keys(data)
		  var i, key
		  i = keys.length
		  while (i--) {
		    key = keys[i]
		    this._proxy(key)
		  }
		  // observe data
		  Observer.create(data, this)
		}
	
		/**
		 * Swap the isntance's $data. Called in $data's setter.
		 *
		 * @param {Object} newData
		 */
	
		exports._setData = function (newData) {
		  newData = newData || {}
		  var oldData = this._data
		  this._data = newData
		  var keys, key, i
		  // unproxy keys not present in new data
		  keys = Object.keys(oldData)
		  i = keys.length
		  while (i--) {
		    key = keys[i]
		    if (!(key in newData)) {
		      this._unproxy(key)
		    }
		  }
		  // proxy keys not already proxied,
		  // and trigger change for changed values
		  keys = Object.keys(newData)
		  i = keys.length
		  while (i--) {
		    key = keys[i]
		    if (!this.hasOwnProperty(key)) {
		      // new property
		      this._proxy(key)
		    }
		  }
		  oldData.__ob__.removeVm(this)
		  Observer.create(newData, this)
		  this._digest()
		}
	
		/**
		 * Proxy a property, so that
		 * vm.prop === vm._data.prop
		 *
		 * @param {String} key
		 */
	
		exports._proxy = function (key) {
		  if (!_.isReserved(key)) {
		    // need to store ref to self here
		    // because these getter/setters might
		    // be called by child scopes via
		    // prototype inheritance.
		    var self = this
		    Object.defineProperty(self, key, {
		      configurable: true,
		      enumerable: true,
		      get: function proxyGetter () {
		        return self._data[key]
		      },
		      set: function proxySetter (val) {
		        self._data[key] = val
		      }
		    })
		  }
		}
	
		/**
		 * Unproxy a property.
		 *
		 * @param {String} key
		 */
	
		exports._unproxy = function (key) {
		  if (!_.isReserved(key)) {
		    delete this[key]
		  }
		}
	
		/**
		 * Force update on every watcher in scope.
		 */
	
		exports._digest = function () {
		  for (var i = 0, l = this._watchers.length; i < l; i++) {
		    this._watchers[i].update(true) // shallow updates
		  }
		}
	
		/**
		 * Setup computed properties. They are essentially
		 * special getter/setters
		 */
	
		function noop () {}
		exports._initComputed = function () {
		  var computed = this.$options.computed
		  if (computed) {
		    for (var key in computed) {
		      var userDef = computed[key]
		      var def = {
		        enumerable: true,
		        configurable: true
		      }
		      if (typeof userDef === 'function') {
		        def.get = makeComputedGetter(userDef, this)
		        def.set = noop
		      } else {
		        def.get = userDef.get
		          ? userDef.cache !== false
		            ? makeComputedGetter(userDef.get, this)
		            : _.bind(userDef.get, this)
		          : noop
		        def.set = userDef.set
		          ? _.bind(userDef.set, this)
		          : noop
		      }
		      Object.defineProperty(this, key, def)
		    }
		  }
		}
	
		function makeComputedGetter (getter, owner) {
		  var watcher = new Watcher(owner, getter, null, {
		    lazy: true
		  })
		  return function computedGetter () {
		    if (watcher.dirty) {
		      watcher.evaluate()
		    }
		    if (Dep.target) {
		      watcher.depend()
		    }
		    return watcher.value
		  }
		}
	
		/**
		 * Setup instance methods. Methods must be bound to the
		 * instance since they might be passed down as a prop to
		 * child components.
		 */
	
		exports._initMethods = function () {
		  var methods = this.$options.methods
		  if (methods) {
		    for (var key in methods) {
		      this[key] = _.bind(methods[key], this)
		    }
		  }
		}
	
		/**
		 * Initialize meta information like $index, $key & $value.
		 */
	
		exports._initMeta = function () {
		  var metas = this.$options._meta
		  if (metas) {
		    for (var key in metas) {
		      _.defineReactive(this, key, metas[key])
		    }
		  }
		}
	
	
	/***/ },
	/* 58 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var Dep = __webpack_require__(41)
		var arrayMethods = __webpack_require__(59)
		var arrayKeys = Object.getOwnPropertyNames(arrayMethods)
	
		/**
		 * Observer class that are attached to each observed
		 * object. Once attached, the observer converts target
		 * object's property keys into getter/setters that
		 * collect dependencies and dispatches updates.
		 *
		 * @param {Array|Object} value
		 * @constructor
		 */
	
		function Observer (value) {
		  this.value = value
		  this.dep = new Dep()
		  _.define(value, '__ob__', this)
		  if (_.isArray(value)) {
		    var augment = _.hasProto
		      ? protoAugment
		      : copyAugment
		    augment(value, arrayMethods, arrayKeys)
		    this.observeArray(value)
		  } else {
		    this.walk(value)
		  }
		}
	
		// Static methods
	
		/**
		 * Attempt to create an observer instance for a value,
		 * returns the new observer if successfully observed,
		 * or the existing observer if the value already has one.
		 *
		 * @param {*} value
		 * @param {Vue} [vm]
		 * @return {Observer|undefined}
		 * @static
		 */
	
		Observer.create = function (value, vm) {
		  if (!value || typeof value !== 'object') {
		    return
		  }
		  var ob
		  if (
		    value.hasOwnProperty('__ob__') &&
		    value.__ob__ instanceof Observer
		  ) {
		    ob = value.__ob__
		  } else if (
		    (_.isArray(value) || _.isPlainObject(value)) &&
		    !Object.isFrozen(value) &&
		    !value._isVue
		  ) {
		    ob = new Observer(value)
		  }
		  if (ob && vm) {
		    ob.addVm(vm)
		  }
		  return ob
		}
	
		// Instance methods
	
		/**
		 * Walk through each property and convert them into
		 * getter/setters. This method should only be called when
		 * value type is Object.
		 *
		 * @param {Object} obj
		 */
	
		Observer.prototype.walk = function (obj) {
		  var keys = Object.keys(obj)
		  var i = keys.length
		  while (i--) {
		    this.convert(keys[i], obj[keys[i]])
		  }
		}
	
		/**
		 * Observe a list of Array items.
		 *
		 * @param {Array} items
		 */
	
		Observer.prototype.observeArray = function (items) {
		  var i = items.length
		  while (i--) {
		    Observer.create(items[i])
		  }
		}
	
		/**
		 * Convert a property into getter/setter so we can emit
		 * the events when the property is accessed/changed.
		 *
		 * @param {String} key
		 * @param {*} val
		 */
	
		Observer.prototype.convert = function (key, val) {
		  defineReactive(this.value, key, val)
		}
	
		/**
		 * Add an owner vm, so that when $set/$delete mutations
		 * happen we can notify owner vms to proxy the keys and
		 * digest the watchers. This is only called when the object
		 * is observed as an instance's root $data.
		 *
		 * @param {Vue} vm
		 */
	
		Observer.prototype.addVm = function (vm) {
		  (this.vms || (this.vms = [])).push(vm)
		}
	
		/**
		 * Remove an owner vm. This is called when the object is
		 * swapped out as an instance's $data object.
		 *
		 * @param {Vue} vm
		 */
	
		Observer.prototype.removeVm = function (vm) {
		  this.vms.$remove(vm)
		}
	
		// helpers
	
		/**
		 * Augment an target Object or Array by intercepting
		 * the prototype chain using __proto__
		 *
		 * @param {Object|Array} target
		 * @param {Object} proto
		 */
	
		function protoAugment (target, src) {
		  target.__proto__ = src
		}
	
		/**
		 * Augment an target Object or Array by defining
		 * hidden properties.
		 *
		 * @param {Object|Array} target
		 * @param {Object} proto
		 */
	
		function copyAugment (target, src, keys) {
		  var i = keys.length
		  var key
		  while (i--) {
		    key = keys[i]
		    _.define(target, key, src[key])
		  }
		}
	
		/**
		 * Define a reactive property on an Object.
		 *
		 * @param {Object} obj
		 * @param {String} key
		 * @param {*} val
		 */
	
		function defineReactive (obj, key, val) {
		  var dep = new Dep()
		  var childOb = Observer.create(val)
		  Object.defineProperty(obj, key, {
		    enumerable: true,
		    configurable: true,
		    get: function metaGetter () {
		      if (Dep.target) {
		        dep.depend()
		        if (childOb) {
		          childOb.dep.depend()
		        }
		        if (_.isArray(val)) {
		          for (var e, i = 0, l = val.length; i < l; i++) {
		            e = val[i]
		            e && e.__ob__ && e.__ob__.dep.depend()
		          }
		        }
		      }
		      return val
		    },
		    set: function metaSetter (newVal) {
		      if (newVal === val) return
		      val = newVal
		      childOb = Observer.create(newVal)
		      dep.notify()
		    }
		  })
		}
	
		// Attach to the util object so it can be used elsewhere.
		_.defineReactive = defineReactive
	
		module.exports = Observer
	
	
	/***/ },
	/* 59 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var arrayProto = Array.prototype
		var arrayMethods = Object.create(arrayProto)
	
		/**
		 * Intercept mutating methods and emit events
		 */
	
		;[
		  'push',
		  'pop',
		  'shift',
		  'unshift',
		  'splice',
		  'sort',
		  'reverse'
		]
		.forEach(function (method) {
		  // cache original method
		  var original = arrayProto[method]
		  _.define(arrayMethods, method, function mutator () {
		    // avoid leaking arguments:
		    // http://jsperf.com/closure-with-arguments
		    var i = arguments.length
		    var args = new Array(i)
		    while (i--) {
		      args[i] = arguments[i]
		    }
		    var result = original.apply(this, args)
		    var ob = this.__ob__
		    var inserted
		    switch (method) {
		      case 'push':
		        inserted = args
		        break
		      case 'unshift':
		        inserted = args
		        break
		      case 'splice':
		        inserted = args.slice(2)
		        break
		    }
		    if (inserted) ob.observeArray(inserted)
		    // notify change
		    ob.dep.notify()
		    return result
		  })
		})
	
		/**
		 * Swap the element at the given index with a new value
		 * and emits corresponding event.
		 *
		 * @param {Number} index
		 * @param {*} val
		 * @return {*} - replaced element
		 */
	
		_.define(
		  arrayProto,
		  '$set',
		  function $set (index, val) {
		    if (index >= this.length) {
		      this.length = index + 1
		    }
		    return this.splice(index, 1, val)[0]
		  }
		)
	
		/**
		 * Convenience method to remove the element at given index.
		 *
		 * @param {Number} index
		 * @param {*} val
		 */
	
		_.define(
		  arrayProto,
		  '$remove',
		  function $remove (item) {
		    /* istanbul ignore if */
		    if (!this.length) return
		    var index = _.indexOf(this, item)
		    if (index > -1) {
		      return this.splice(index, 1)
		    }
		  }
		)
	
		module.exports = arrayMethods
	
	
	/***/ },
	/* 60 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var Directive = __webpack_require__(61)
		var compiler = __webpack_require__(14)
	
		/**
		 * Update v-ref for component.
		 *
		 * @param {Boolean} remove
		 */
	
		exports._updateRef = function (remove) {
		  var ref = this.$options._ref
		  if (ref) {
		    var refs = (this._scope || this._context).$refs
		    if (remove) {
		      if (refs[ref] === this) {
		        refs[ref] = null
		      }
		    } else {
		      refs[ref] = this
		    }
		  }
		}
	
		/**
		 * Transclude, compile and link element.
		 *
		 * If a pre-compiled linker is available, that means the
		 * passed in element will be pre-transcluded and compiled
		 * as well - all we need to do is to call the linker.
		 *
		 * Otherwise we need to call transclude/compile/link here.
		 *
		 * @param {Element} el
		 * @return {Element}
		 */
	
		exports._compile = function (el) {
		  var options = this.$options
	
		  // transclude and init element
		  // transclude can potentially replace original
		  // so we need to keep reference; this step also injects
		  // the template and caches the original attributes
		  // on the container node and replacer node.
		  var original = el
		  el = compiler.transclude(el, options)
		  this._initElement(el)
	
		  // root is always compiled per-instance, because
		  // container attrs and props can be different every time.
		  var contextOptions = this._context && this._context.$options
		  var rootLinker = compiler.compileRoot(el, options, contextOptions)
	
		  // compile and link the rest
		  var contentLinkFn
		  var ctor = this.constructor
		  // component compilation can be cached
		  // as long as it's not using inline-template
		  if (options._linkerCachable) {
		    contentLinkFn = ctor.linker
		    if (!contentLinkFn) {
		      contentLinkFn = ctor.linker = compiler.compile(el, options)
		    }
		  }
	
		  // link phase
		  // make sure to link root with prop scope!
		  var rootUnlinkFn = rootLinker(this, el, this._scope)
		  var contentUnlinkFn = contentLinkFn
		    ? contentLinkFn(this, el)
		    : compiler.compile(el, options)(this, el)
	
		  // register composite unlink function
		  // to be called during instance destruction
		  this._unlinkFn = function () {
		    rootUnlinkFn()
		    // passing destroying: true to avoid searching and
		    // splicing the directives
		    contentUnlinkFn(true)
		  }
	
		  // finally replace original
		  if (options.replace) {
		    _.replace(original, el)
		  }
	
		  this._isCompiled = true
		  this._callHook('compiled')
		  return el
		}
	
		/**
		 * Initialize instance element. Called in the public
		 * $mount() method.
		 *
		 * @param {Element} el
		 */
	
		exports._initElement = function (el) {
		  if (el instanceof DocumentFragment) {
		    this._isFragment = true
		    this.$el = this._fragmentStart = el.firstChild
		    this._fragmentEnd = el.lastChild
		    // set persisted text anchors to empty
		    if (this._fragmentStart.nodeType === 3) {
		      this._fragmentStart.data = this._fragmentEnd.data = ''
		    }
		    this._fragment = el
		  } else {
		    this.$el = el
		  }
		  this.$el.__vue__ = this
		  this._callHook('beforeCompile')
		}
	
		/**
		 * Create and bind a directive to an element.
		 *
		 * @param {String} name - directive name
		 * @param {Node} node   - target node
		 * @param {Object} desc - parsed directive descriptor
		 * @param {Object} def  - directive definition object
		 * @param {Vue} [host] - transclusion host component
		 * @param {Object} [scope] - v-for scope
		 * @param {Fragment} [frag] - owner fragment
		 */
	
		exports._bindDir = function (descriptor, node, host, scope, frag) {
		  this._directives.push(
		    new Directive(descriptor, this, node, host, scope, frag)
		  )
		}
	
		/**
		 * Teardown an instance, unobserves the data, unbind all the
		 * directives, turn off all the event listeners, etc.
		 *
		 * @param {Boolean} remove - whether to remove the DOM node.
		 * @param {Boolean} deferCleanup - if true, defer cleanup to
		 *                                 be called later
		 */
	
		exports._destroy = function (remove, deferCleanup) {
		  if (this._isBeingDestroyed) {
		    if (!deferCleanup) {
		      this._cleanup()
		    }
		    return
		  }
		  this._callHook('beforeDestroy')
		  this._isBeingDestroyed = true
		  var i
		  // remove self from parent. only necessary
		  // if parent is not being destroyed as well.
		  var parent = this.$parent
		  if (parent && !parent._isBeingDestroyed) {
		    parent.$children.$remove(this)
		    // unregister ref (remove: true)
		    this._updateRef(true)
		  }
		  // destroy all children.
		  i = this.$children.length
		  while (i--) {
		    this.$children[i].$destroy()
		  }
		  // teardown props
		  if (this._propsUnlinkFn) {
		    this._propsUnlinkFn()
		  }
		  // teardown all directives. this also tearsdown all
		  // directive-owned watchers.
		  if (this._unlinkFn) {
		    this._unlinkFn()
		  }
		  i = this._watchers.length
		  while (i--) {
		    this._watchers[i].teardown()
		  }
		  // remove reference to self on $el
		  if (this.$el) {
		    this.$el.__vue__ = null
		  }
		  // remove DOM element
		  var self = this
		  if (remove && this.$el) {
		    this.$remove(function () {
		      self._cleanup()
		    })
		  } else if (!deferCleanup) {
		    this._cleanup()
		  }
		}
	
		/**
		 * Clean up to ensure garbage collection.
		 * This is called after the leave transition if there
		 * is any.
		 */
	
		exports._cleanup = function () {
		  if (this._isDestroyed) {
		    return
		  }
		  // remove self from owner fragment
		  // do it in cleanup so that we can call $destroy with
		  // defer right when a fragment is about to be removed.
		  if (this._frag) {
		    this._frag.children.$remove(this)
		  }
		  // remove reference from data ob
		  // frozen object may not have observer.
		  if (this._data.__ob__) {
		    this._data.__ob__.removeVm(this)
		  }
		  // Clean up references to private properties and other
		  // instances. preserve reference to _data so that proxy
		  // accessors still work. The only potential side effect
		  // here is that mutating the instance after it's destroyed
		  // may affect the state of other components that are still
		  // observing the same object, but that seems to be a
		  // reasonable responsibility for the user rather than
		  // always throwing an error on them.
		  this.$el =
		  this.$parent =
		  this.$root =
		  this.$children =
		  this._watchers =
		  this._context =
		  this._scope =
		  this._directives = null
		  // call the last hook...
		  this._isDestroyed = true
		  this._callHook('destroyed')
		  // turn off all instance listeners.
		  this.$off()
		}
	
	
	/***/ },
	/* 61 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var Watcher = __webpack_require__(40)
		var expParser = __webpack_require__(42)
		function noop () {}
	
		/**
		 * A directive links a DOM element with a piece of data,
		 * which is the result of evaluating an expression.
		 * It registers a watcher with the expression and calls
		 * the DOM update function when a change is triggered.
		 *
		 * @param {String} name
		 * @param {Node} el
		 * @param {Vue} vm
		 * @param {Object} descriptor
		 *                 - {String} name
		 *                 - {Object} def
		 *                 - {String} expression
		 *                 - {Array<Object>} [filters]
		 *                 - {Boolean} literal
		 *                 - {String} attr
		 *                 - {String} raw
		 * @param {Object} def - directive definition object
		 * @param {Vue} [host] - transclusion host component
		 * @param {Object} [scope] - v-for scope
		 * @param {Fragment} [frag] - owner fragment
		 * @constructor
		 */
	
		function Directive (descriptor, vm, el, host, scope, frag) {
		  this.vm = vm
		  this.el = el
		  // copy descriptor properties
		  this.descriptor = descriptor
		  this.name = descriptor.name
		  this.expression = descriptor.expression
		  this.arg = descriptor.arg
		  this.modifiers = descriptor.modifiers
		  this.filters = descriptor.filters
		  this.literal = this.modifiers && this.modifiers.literal
		  // private
		  this._locked = false
		  this._bound = false
		  this._listeners = null
		  // link context
		  this._host = host
		  this._scope = scope
		  this._frag = frag
		  // store directives on node in dev mode
		  if (("development") !== 'production' && this.el) {
		    this.el._vue_directives = this.el._vue_directives || []
		    this.el._vue_directives.push(this)
		  }
		}
	
		/**
		 * Initialize the directive, mixin definition properties,
		 * setup the watcher, call definition bind() and update()
		 * if present.
		 *
		 * @param {Object} def
		 */
	
		Directive.prototype._bind = function () {
		  var name = this.name
		  var descriptor = this.descriptor
	
		  // remove attribute
		  if (
		    (name !== 'cloak' || this.vm._isCompiled) &&
		    this.el && this.el.removeAttribute
		  ) {
		    var attr = descriptor.attr || ('v-' + name)
		    this.el.removeAttribute(attr)
		  }
	
		  // copy def properties
		  var def = descriptor.def
		  if (typeof def === 'function') {
		    this.update = def
		  } else {
		    _.extend(this, def)
		  }
	
		  // setup directive params
		  this._setupParams()
	
		  // initial bind
		  if (this.bind) {
		    this.bind()
		  }
	
		  if (this.literal) {
		    this.update && this.update(descriptor.raw)
		  } else if (
		    (this.expression || this.modifiers) &&
		    (this.update || this.twoWay) &&
		    !this._checkStatement()
		  ) {
		    // wrapped updater for context
		    var dir = this
		    if (this.update) {
		      this._update = function (val, oldVal) {
		        if (!dir._locked) {
		          dir.update(val, oldVal)
		        }
		      }
		    } else {
		      this._update = noop
		    }
		    var preProcess = this._preProcess
		      ? _.bind(this._preProcess, this)
		      : null
		    var postProcess = this._postProcess
		      ? _.bind(this._postProcess, this)
		      : null
		    var watcher = this._watcher = new Watcher(
		      this.vm,
		      this.expression,
		      this._update, // callback
		      {
		        filters: this.filters,
		        twoWay: this.twoWay,
		        deep: this.deep,
		        preProcess: preProcess,
		        postProcess: postProcess,
		        scope: this._scope
		      }
		    )
		    // v-model with inital inline value need to sync back to
		    // model instead of update to DOM on init. They would
		    // set the afterBind hook to indicate that.
		    if (this.afterBind) {
		      this.afterBind()
		    } else if (this.update) {
		      this.update(watcher.value)
		    }
		  }
		  this._bound = true
		}
	
		/**
		 * Setup all param attributes, e.g. track-by,
		 * transition-mode, etc...
		 */
	
		Directive.prototype._setupParams = function () {
		  if (!this.params) {
		    return
		  }
		  var params = this.params
		  // swap the params array with a fresh object.
		  this.params = Object.create(null)
		  var i = params.length
		  var key, val, mappedKey
		  while (i--) {
		    key = params[i]
		    mappedKey = _.camelize(key)
		    val = _.getBindAttr(this.el, key)
		    if (val != null) {
		      // dynamic
		      this._setupParamWatcher(mappedKey, val)
		    } else {
		      // static
		      val = _.attr(this.el, key)
		      if (val != null) {
		        this.params[mappedKey] = val === '' ? true : val
		      }
		    }
		  }
		}
	
		/**
		 * Setup a watcher for a dynamic param.
		 *
		 * @param {String} key
		 * @param {String} expression
		 */
	
		Directive.prototype._setupParamWatcher = function (key, expression) {
		  var self = this
		  var called = false
		  var unwatch = (this._scope || this.vm).$watch(expression, function (val, oldVal) {
		    self.params[key] = val
		    // since we are in immediate mode,
		    // only call the param change callbacks if this is not the first update.
		    if (called) {
		      var cb = self.paramWatchers && self.paramWatchers[key]
		      if (cb) {
		        cb.call(self, val, oldVal)
		      }
		    } else {
		      called = true
		    }
		  }, {
		    immediate: true
		  })
		  ;(this._paramUnwatchFns || (this._paramUnwatchFns = [])).push(unwatch)
		}
	
		/**
		 * Check if the directive is a function caller
		 * and if the expression is a callable one. If both true,
		 * we wrap up the expression and use it as the event
		 * handler.
		 *
		 * e.g. on-click="a++"
		 *
		 * @return {Boolean}
		 */
	
		Directive.prototype._checkStatement = function () {
		  var expression = this.expression
		  if (
		    expression && this.acceptStatement &&
		    !expParser.isSimplePath(expression)
		  ) {
		    var fn = expParser.parse(expression).get
		    var scope = this._scope || this.vm
		    var handler = function () {
		      fn.call(scope, scope)
		    }
		    if (this.filters) {
		      handler = scope._applyFilters(handler, null, this.filters)
		    }
		    this.update(handler)
		    return true
		  }
		}
	
		/**
		 * Set the corresponding value with the setter.
		 * This should only be used in two-way directives
		 * e.g. v-model.
		 *
		 * @param {*} value
		 * @public
		 */
	
		Directive.prototype.set = function (value) {
		  /* istanbul ignore else */
		  if (this.twoWay) {
		    this._withLock(function () {
		      this._watcher.set(value)
		    })
		  } else if (true) {
		    _.warn(
		      'Directive.set() can only be used inside twoWay' +
		      'directives.'
		    )
		  }
		}
	
		/**
		 * Execute a function while preventing that function from
		 * triggering updates on this directive instance.
		 *
		 * @param {Function} fn
		 */
	
		Directive.prototype._withLock = function (fn) {
		  var self = this
		  self._locked = true
		  fn.call(self)
		  _.nextTick(function () {
		    self._locked = false
		  })
		}
	
		/**
		 * Convenience method that attaches a DOM event listener
		 * to the directive element and autometically tears it down
		 * during unbind.
		 *
		 * @param {String} event
		 * @param {Function} handler
		 */
	
		Directive.prototype.on = function (event, handler) {
		  _.on(this.el, event, handler)
		  ;(this._listeners || (this._listeners = []))
		    .push([event, handler])
		}
	
		/**
		 * Teardown the watcher and call unbind.
		 */
	
		Directive.prototype._teardown = function () {
		  if (this._bound) {
		    this._bound = false
		    if (this.unbind) {
		      this.unbind()
		    }
		    if (this._watcher) {
		      this._watcher.teardown()
		    }
		    var listeners = this._listeners
		    var i
		    if (listeners) {
		      i = listeners.length
		      while (i--) {
		        _.off(this.el, listeners[i][0], listeners[i][1])
		      }
		    }
		    var unwatchFns = this._paramUnwatchFns
		    if (unwatchFns) {
		      i = unwatchFns.length
		      while (i--) {
		        unwatchFns[i]()
		      }
		    }
		    if (("development") !== 'production' && this.el) {
		      this.el._vue_directives.$remove(this)
		    }
		    this.vm = this.el = this._watcher = this._listeners = null
		  }
		}
	
		module.exports = Directive
	
	
	/***/ },
	/* 62 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
	
		/**
		 * Apply a list of filter (descriptors) to a value.
		 * Using plain for loops here because this will be called in
		 * the getter of any watcher with filters so it is very
		 * performance sensitive.
		 *
		 * @param {*} value
		 * @param {*} [oldValue]
		 * @param {Array} filters
		 * @param {Boolean} write
		 * @return {*}
		 */
	
		exports._applyFilters = function (value, oldValue, filters, write) {
		  var filter, fn, args, arg, offset, i, l, j, k
		  for (i = 0, l = filters.length; i < l; i++) {
		    filter = filters[i]
		    fn = _.resolveAsset(this.$options, 'filters', filter.name)
		    if (true) {
		      _.assertAsset(fn, 'filter', filter.name)
		    }
		    if (!fn) continue
		    fn = write ? fn.write : (fn.read || fn)
		    if (typeof fn !== 'function') continue
		    args = write ? [value, oldValue] : [value]
		    offset = write ? 2 : 1
		    if (filter.args) {
		      for (j = 0, k = filter.args.length; j < k; j++) {
		        arg = filter.args[j]
		        args[j + offset] = arg.dynamic
		          ? this.$get(arg.value)
		          : arg.value
		      }
		    }
		    value = fn.apply(this, args)
		  }
		  return value
		}
	
		/**
		 * Resolve a component, depending on whether the component
		 * is defined normally or using an async factory function.
		 * Resolves synchronously if already resolved, otherwise
		 * resolves asynchronously and caches the resolved
		 * constructor on the factory.
		 *
		 * @param {String} id
		 * @param {Function} cb
		 */
	
		exports._resolveComponent = function (id, cb) {
		  var factory = _.resolveAsset(this.$options, 'components', id)
		  if (true) {
		    _.assertAsset(factory, 'component', id)
		  }
		  if (!factory) {
		    return
		  }
		  // async component factory
		  if (!factory.options) {
		    if (factory.resolved) {
		      // cached
		      cb(factory.resolved)
		    } else if (factory.requested) {
		      // pool callbacks
		      factory.pendingCallbacks.push(cb)
		    } else {
		      factory.requested = true
		      var cbs = factory.pendingCallbacks = [cb]
		      factory(function resolve (res) {
		        if (_.isPlainObject(res)) {
		          res = _.Vue.extend(res)
		        }
		        // cache resolved
		        factory.resolved = res
		        // invoke callbacks
		        for (var i = 0, l = cbs.length; i < l; i++) {
		          cbs[i](res)
		        }
		      }, function reject (reason) {
		        ("development") !== 'production' && _.warn(
		          'Failed to resolve async component: ' + id + '. ' +
		          (reason ? '\nReason: ' + reason : '')
		        )
		      })
		    }
		  } else {
		    // normal component
		    cb(factory)
		  }
		}
	
	
	/***/ },
	/* 63 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var Watcher = __webpack_require__(40)
		var Path = __webpack_require__(43)
		var textParser = __webpack_require__(6)
		var dirParser = __webpack_require__(8)
		var expParser = __webpack_require__(42)
		var filterRE = /[^|]\|[^|]/
	
		/**
		 * Get the value from an expression on this vm.
		 *
		 * @param {String} exp
		 * @param {Boolean} [asStatement]
		 * @return {*}
		 */
	
		exports.$get = function (exp, asStatement) {
		  var res = expParser.parse(exp)
		  if (res) {
		    if (asStatement && !expParser.isSimplePath(exp)) {
		      var self = this
		      return function statementHandler () {
		        res.get.call(self, self)
		      }
		    } else {
		      try {
		        return res.get.call(this, this)
		      } catch (e) {}
		    }
		  }
		}
	
		/**
		 * Set the value from an expression on this vm.
		 * The expression must be a valid left-hand
		 * expression in an assignment.
		 *
		 * @param {String} exp
		 * @param {*} val
		 */
	
		exports.$set = function (exp, val) {
		  var res = expParser.parse(exp, true)
		  if (res && res.set) {
		    res.set.call(this, this, val)
		  }
		}
	
		/**
		 * Delete a property on the VM
		 *
		 * @param {String} key
		 */
	
		exports.$delete = function (key) {
		  _.delete(this._data, key)
		}
	
		/**
		 * Watch an expression, trigger callback when its
		 * value changes.
		 *
		 * @param {String|Function} expOrFn
		 * @param {Function} cb
		 * @param {Object} [options]
		 *                 - {Boolean} deep
		 *                 - {Boolean} immediate
		 * @return {Function} - unwatchFn
		 */
	
		exports.$watch = function (expOrFn, cb, options) {
		  var vm = this
		  var parsed
		  if (typeof expOrFn === 'string') {
		    parsed = dirParser.parse(expOrFn)
		    expOrFn = parsed.expression
		  }
		  var watcher = new Watcher(vm, expOrFn, cb, {
		    deep: options && options.deep,
		    filters: parsed && parsed.filters
		  })
		  if (options && options.immediate) {
		    cb.call(vm, watcher.value)
		  }
		  return function unwatchFn () {
		    watcher.teardown()
		  }
		}
	
		/**
		 * Evaluate a text directive, including filters.
		 *
		 * @param {String} text
		 * @param {Boolean} [asStatement]
		 * @return {String}
		 */
	
		exports.$eval = function (text, asStatement) {
		  // check for filters.
		  if (filterRE.test(text)) {
		    var dir = dirParser.parse(text)
		    // the filter regex check might give false positive
		    // for pipes inside strings, so it's possible that
		    // we don't get any filters here
		    var val = this.$get(dir.expression, asStatement)
		    return dir.filters
		      ? this._applyFilters(val, null, dir.filters)
		      : val
		  } else {
		    // no filter
		    return this.$get(text, asStatement)
		  }
		}
	
		/**
		 * Interpolate a piece of template text.
		 *
		 * @param {String} text
		 * @return {String}
		 */
	
		exports.$interpolate = function (text) {
		  var tokens = textParser.parse(text)
		  var vm = this
		  if (tokens) {
		    if (tokens.length === 1) {
		      return vm.$eval(tokens[0].value) + ''
		    } else {
		      return tokens.map(function (token) {
		        return token.tag
		          ? vm.$eval(token.value)
		          : token.value
		      }).join('')
		    }
		  } else {
		    return text
		  }
		}
	
		/**
		 * Log instance data as a plain JS object
		 * so that it is easier to inspect in console.
		 * This method assumes console is available.
		 *
		 * @param {String} [path]
		 */
	
		exports.$log = function (path) {
		  var data = path
		    ? Path.get(this._data, path)
		    : this._data
		  if (data) {
		    data = clean(data)
		  }
		  // include computed fields
		  if (!path) {
		    for (var key in this.$options.computed) {
		      data[key] = clean(this[key])
		    }
		  }
		  console.log(data)
		}
	
		/**
		 * "clean" a getter/setter converted object into a plain
		 * object copy.
		 *
		 * @param {Object} - obj
		 * @return {Object}
		 */
	
		function clean (obj) {
		  return JSON.parse(JSON.stringify(obj))
		}
	
	
	/***/ },
	/* 64 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var transition = __webpack_require__(9)
	
		/**
		 * Convenience on-instance nextTick. The callback is
		 * auto-bound to the instance, and this avoids component
		 * modules having to rely on the global Vue.
		 *
		 * @param {Function} fn
		 */
	
		exports.$nextTick = function (fn) {
		  _.nextTick(fn, this)
		}
	
		/**
		 * Append instance to target
		 *
		 * @param {Node} target
		 * @param {Function} [cb]
		 * @param {Boolean} [withTransition] - defaults to true
		 */
	
		exports.$appendTo = function (target, cb, withTransition) {
		  return insert(
		    this, target, cb, withTransition,
		    append, transition.append
		  )
		}
	
		/**
		 * Prepend instance to target
		 *
		 * @param {Node} target
		 * @param {Function} [cb]
		 * @param {Boolean} [withTransition] - defaults to true
		 */
	
		exports.$prependTo = function (target, cb, withTransition) {
		  target = query(target)
		  if (target.hasChildNodes()) {
		    this.$before(target.firstChild, cb, withTransition)
		  } else {
		    this.$appendTo(target, cb, withTransition)
		  }
		  return this
		}
	
		/**
		 * Insert instance before target
		 *
		 * @param {Node} target
		 * @param {Function} [cb]
		 * @param {Boolean} [withTransition] - defaults to true
		 */
	
		exports.$before = function (target, cb, withTransition) {
		  return insert(
		    this, target, cb, withTransition,
		    before, transition.before
		  )
		}
	
		/**
		 * Insert instance after target
		 *
		 * @param {Node} target
		 * @param {Function} [cb]
		 * @param {Boolean} [withTransition] - defaults to true
		 */
	
		exports.$after = function (target, cb, withTransition) {
		  target = query(target)
		  if (target.nextSibling) {
		    this.$before(target.nextSibling, cb, withTransition)
		  } else {
		    this.$appendTo(target.parentNode, cb, withTransition)
		  }
		  return this
		}
	
		/**
		 * Remove instance from DOM
		 *
		 * @param {Function} [cb]
		 * @param {Boolean} [withTransition] - defaults to true
		 */
	
		exports.$remove = function (cb, withTransition) {
		  if (!this.$el.parentNode) {
		    return cb && cb()
		  }
		  var inDoc = this._isAttached && _.inDoc(this.$el)
		  // if we are not in document, no need to check
		  // for transitions
		  if (!inDoc) withTransition = false
		  var self = this
		  var realCb = function () {
		    if (inDoc) self._callHook('detached')
		    if (cb) cb()
		  }
		  if (this._isFragment) {
		    _.removeNodeRange(
		      this._fragmentStart,
		      this._fragmentEnd,
		      this, this._fragment, realCb
		    )
		  } else {
		    var op = withTransition === false
		      ? remove
		      : transition.remove
		    op(this.$el, this, realCb)
		  }
		  return this
		}
	
		/**
		 * Shared DOM insertion function.
		 *
		 * @param {Vue} vm
		 * @param {Element} target
		 * @param {Function} [cb]
		 * @param {Boolean} [withTransition]
		 * @param {Function} op1 - op for non-transition insert
		 * @param {Function} op2 - op for transition insert
		 * @return vm
		 */
	
		function insert (vm, target, cb, withTransition, op1, op2) {
		  target = query(target)
		  var targetIsDetached = !_.inDoc(target)
		  var op = withTransition === false || targetIsDetached
		      ? op1
		      : op2
		  var shouldCallHook =
		    !targetIsDetached &&
		    !vm._isAttached &&
		    !_.inDoc(vm.$el)
		  if (vm._isFragment) {
		    _.mapNodeRange(vm._fragmentStart, vm._fragmentEnd, function (node) {
		      op(node, target, vm)
		    })
		    cb && cb()
		  } else {
		    op(vm.$el, target, vm, cb)
		  }
		  if (shouldCallHook) {
		    vm._callHook('attached')
		  }
		  return vm
		}
	
		/**
		 * Check for selectors
		 *
		 * @param {String|Element} el
		 */
	
		function query (el) {
		  return typeof el === 'string'
		    ? document.querySelector(el)
		    : el
		}
	
		/**
		 * Append operation that takes a callback.
		 *
		 * @param {Node} el
		 * @param {Node} target
		 * @param {Vue} vm - unused
		 * @param {Function} [cb]
		 */
	
		function append (el, target, vm, cb) {
		  target.appendChild(el)
		  if (cb) cb()
		}
	
		/**
		 * InsertBefore operation that takes a callback.
		 *
		 * @param {Node} el
		 * @param {Node} target
		 * @param {Vue} vm - unused
		 * @param {Function} [cb]
		 */
	
		function before (el, target, vm, cb) {
		  _.before(el, target)
		  if (cb) cb()
		}
	
		/**
		 * Remove operation that takes a callback.
		 *
		 * @param {Node} el
		 * @param {Vue} vm - unused
		 * @param {Function} [cb]
		 */
	
		function remove (el, vm, cb) {
		  _.remove(el)
		  if (cb) cb()
		}
	
	
	/***/ },
	/* 65 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
	
		/**
		 * Listen on the given `event` with `fn`.
		 *
		 * @param {String} event
		 * @param {Function} fn
		 */
	
		exports.$on = function (event, fn) {
		  (this._events[event] || (this._events[event] = []))
		    .push(fn)
		  modifyListenerCount(this, event, 1)
		  return this
		}
	
		/**
		 * Adds an `event` listener that will be invoked a single
		 * time then automatically removed.
		 *
		 * @param {String} event
		 * @param {Function} fn
		 */
	
		exports.$once = function (event, fn) {
		  var self = this
		  function on () {
		    self.$off(event, on)
		    fn.apply(this, arguments)
		  }
		  on.fn = fn
		  this.$on(event, on)
		  return this
		}
	
		/**
		 * Remove the given callback for `event` or all
		 * registered callbacks.
		 *
		 * @param {String} event
		 * @param {Function} fn
		 */
	
		exports.$off = function (event, fn) {
		  var cbs
		  // all
		  if (!arguments.length) {
		    if (this.$parent) {
		      for (event in this._events) {
		        cbs = this._events[event]
		        if (cbs) {
		          modifyListenerCount(this, event, -cbs.length)
		        }
		      }
		    }
		    this._events = {}
		    return this
		  }
		  // specific event
		  cbs = this._events[event]
		  if (!cbs) {
		    return this
		  }
		  if (arguments.length === 1) {
		    modifyListenerCount(this, event, -cbs.length)
		    this._events[event] = null
		    return this
		  }
		  // specific handler
		  var cb
		  var i = cbs.length
		  while (i--) {
		    cb = cbs[i]
		    if (cb === fn || cb.fn === fn) {
		      modifyListenerCount(this, event, -1)
		      cbs.splice(i, 1)
		      break
		    }
		  }
		  return this
		}
	
		/**
		 * Trigger an event on self.
		 *
		 * @param {String} event
		 */
	
		exports.$emit = function (event) {
		  var cbs = this._events[event]
		  this._shouldPropagate = !cbs
		  if (cbs) {
		    cbs = cbs.length > 1
		      ? _.toArray(cbs)
		      : cbs
		    var args = _.toArray(arguments, 1)
		    for (var i = 0, l = cbs.length; i < l; i++) {
		      var res = cbs[i].apply(this, args)
		      if (res === true) {
		        this._shouldPropagate = true
		      }
		    }
		  }
		  return this
		}
	
		/**
		 * Recursively broadcast an event to all children instances.
		 *
		 * @param {String} event
		 * @param {...*} additional arguments
		 */
	
		exports.$broadcast = function (event) {
		  // if no child has registered for this event,
		  // then there's no need to broadcast.
		  if (!this._eventsCount[event]) return
		  var children = this.$children
		  for (var i = 0, l = children.length; i < l; i++) {
		    var child = children[i]
		    child.$emit.apply(child, arguments)
		    if (child._shouldPropagate) {
		      child.$broadcast.apply(child, arguments)
		    }
		  }
		  return this
		}
	
		/**
		 * Recursively propagate an event up the parent chain.
		 *
		 * @param {String} event
		 * @param {...*} additional arguments
		 */
	
		exports.$dispatch = function () {
		  this.$emit.apply(this, arguments)
		  var parent = this.$parent
		  while (parent) {
		    parent.$emit.apply(parent, arguments)
		    parent = parent._shouldPropagate
		      ? parent.$parent
		      : null
		  }
		  return this
		}
	
		/**
		 * Modify the listener counts on all parents.
		 * This bookkeeping allows $broadcast to return early when
		 * no child has listened to a certain event.
		 *
		 * @param {Vue} vm
		 * @param {String} event
		 * @param {Number} count
		 */
	
		var hookRE = /^hook:/
		function modifyListenerCount (vm, event, count) {
		  var parent = vm.$parent
		  // hooks do not get broadcasted so no need
		  // to do bookkeeping for them
		  if (!parent || !count || hookRE.test(event)) return
		  while (parent) {
		    parent._eventsCount[event] =
		      (parent._eventsCount[event] || 0) + count
		    parent = parent.$parent
		  }
		}
	
	
	/***/ },
	/* 66 */
	/***/ function(module, exports, __webpack_require__) {
	
		var _ = __webpack_require__(1)
		var compiler = __webpack_require__(14)
	
		/**
		 * Set instance target element and kick off the compilation
		 * process. The passed in `el` can be a selector string, an
		 * existing Element, or a DocumentFragment (for block
		 * instances).
		 *
		 * @param {Element|DocumentFragment|string} el
		 * @public
		 */
	
		exports.$mount = function (el) {
		  if (this._isCompiled) {
		    ("development") !== 'production' && _.warn(
		      '$mount() should be called only once.'
		    )
		    return
		  }
		  el = _.query(el)
		  if (!el) {
		    el = document.createElement('div')
		  }
		  this._compile(el)
		  this._initDOMHooks()
		  if (_.inDoc(this.$el)) {
		    this._callHook('attached')
		    ready.call(this)
		  } else {
		    this.$once('hook:attached', ready)
		  }
		  return this
		}
	
		/**
		 * Mark an instance as ready.
		 */
	
		function ready () {
		  this._isAttached = true
		  this._isReady = true
		  this._callHook('ready')
		}
	
		/**
		 * Teardown the instance, simply delegate to the internal
		 * _destroy.
		 */
	
		exports.$destroy = function (remove, deferCleanup) {
		  this._destroy(remove, deferCleanup)
		}
	
		/**
		 * Partially compile a piece of DOM and return a
		 * decompile function.
		 *
		 * @param {Element|DocumentFragment} el
		 * @param {Vue} [host]
		 * @return {Function}
		 */
	
		exports.$compile = function (el, host, scope, frag) {
		  return compiler.compile(el, this.$options, true)(
		    this, el, host, scope, frag
		  )
		}
	
	
	/***/ }
	/******/ ])
	});
	;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _vue = __webpack_require__(32);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_vue2.default.filter('credit', function (credit, divide) {
	    var newCredit = divide ? credit / 100 : credit;
	    newCredit = newCredit.toFixed(2);
	
	    return newCredit + '€';
	});

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _vue = __webpack_require__(32);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_vue2.default.filter('passwordHide', function (password) {
	    var len = Math.max(0, password.length - 1);
	    var result = '';
	
	    while (len--) {
	        result += '*';
	    }
	
	    return result + password.slice(-1);
	});

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _articles = __webpack_require__(36);
	
	var _articles2 = _interopRequireDefault(_articles);
	
	var _filterBestPrice = __webpack_require__(37);
	
	var _filterBestPrice2 = _interopRequireDefault(_filterBestPrice);
	
	var _filterPoint = __webpack_require__(38);
	
	var _filterPoint2 = _interopRequireDefault(_filterPoint);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = { articles: _articles2.default, filterBestPrice: _filterBestPrice2.default, filterPoint: _filterPoint2.default };

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _vue = __webpack_require__(32);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Calculate the cost of the basket, including promotion.
	 * @param {Vue} vm The view model
	 */
	var calculateCost = function calculateCost(vm) {
	    var basketCost = vm.basket.map(function (articleId) {
	        return vm.articles.filterObjId(articleId).price.amount;
	    });
	
	    var promoCost = vm.basketPromotions.map(function (basketPromotion) {
	        return vm.promotions.filterObjId(basketPromotion.id).price.amount;
	    });
	
	    var totalCost = [0] // There must be at least one value to reduce
	    .concat(basketCost).concat(promoCost).reduce(function (a, b) {
	        return a + b;
	    });
	
	    vm.totalCost = totalCost;
	};
	
	exports.default = {
	    data: {
	        articles: [],
	        promotions: [],
	        sets: [],
	        paymentMethods: [],
	        basket: [],
	        basketPromotions: [],
	        totalCost: 0
	    },
	    methods: {
	        /**
	         * Triggers basket change on article click
	         * @param  {MouseEvent} e The click event
	         */
	
	        onArticleClick: function onArticleClick(e) {
	            console.log('Click on article');
	            var $target = e.target.parents('.buckutt-card-image');
	            var id = $target.getAttribute('data-id');
	
	            this.basket.push(id);
	            this.checkForPromotions();
	            calculateCost(this);
	
	            if ($target.hasAttribute('data-badge')) {
	                $target.setAttribute('data-badge', parseInt($target.getAttribute('data-badge'), 10) + 1 + '');
	            } else {
	                $target.setAttribute('data-badge', '1');
	                $target.classList.add('mdl-badge');
	                $target.classList.add('active');
	            }
	        },
	
	        /**
	         * Triggers basket change on article removal
	         * @param  {MouseEvent} e The click event
	         */
	        onMinusClick: function onMinusClick(e) {
	            var _this = this;
	
	            console.log('Click on article removal');
	            e.stopPropagation();
	
	            var $target = e.target.parents('.buckutt-card-image');
	            var badge = parseInt($target.getAttribute('data-badge'), 10);
	
	            this.revertPromotions();
	
	            _vue2.default.nextTick(function () {
	                var id = $target.getAttribute('data-id');
	                var index = _this.basket.indexOf(id);
	
	                _this.basket.splice(index, 1);
	                _vue2.default.nextTick(function () {
	                    calculateCost(_this);
	                });
	            });
	
	            if (badge > 1) {
	                $target.setAttribute('data-badge', badge - 1 + '');
	            } else {
	                $target.removeAttribute('data-badge');
	                $target.classList.remove('mdl-badge');
	                $target.classList.remove('active');
	            }
	        }
	    }
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _vue = __webpack_require__(32);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var now = new Date();
	
	var filterBestPriceArticle = function filterBestPriceArticle(article) {
	    article.prices = article.prices.filter(function (price) {
	        return new Date(price.period.start) <= now && now <= new Date(price.period.end);
	    });
	
	    var min = Infinity;
	    var chosenPrice = null;
	    article.prices.forEach(function (price) {
	        if (price.amount < min) {
	            min = price.amount;
	            chosenPrice = price;
	        }
	    });
	
	    _vue2.default.set(article, 'price', chosenPrice);
	
	    return article;
	};
	
	exports.default = {
	    methods: {
	        /**
	         * Filters the best article price
	         */
	
	        filterBestPrice: function filterBestPrice() {
	            console.info('Finding prices', this.articles.length);
	            this.articles.forEach(function (article) {
	                return filterBestPriceArticle(article);
	            });
	        }
	    }
	};

/***/ },
/* 38 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var filterPointArticle = function filterPointArticle(article, pointId) {
	    var articleHasPoint = article.points.filterObjId(pointId) !== undefined;
	
	    if (!articleHasPoint) {
	        return null;
	    }
	
	    return article;
	};
	
	exports.default = {
	    methods: {
	        /**
	         * Filters the most accurate point
	         */
	
	        filterPoint: function filterPoint() {
	            var _this = this;
	
	            console.info('Filtering articles', this.articles.length);
	
	            this.articles = this.articles.map(function (article) {
	                return filterPointArticle(article, _this.pointId);
	            });
	        }
	    }
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _authInput = __webpack_require__(40);
	
	var _authInput2 = _interopRequireDefault(_authInput);
	
	var _connection = __webpack_require__(43);
	
	var _connection2 = _interopRequireDefault(_connection);
	
	var _ejecter = __webpack_require__(47);
	
	var _ejecter2 = _interopRequireDefault(_ejecter);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = { authInput: _authInput2.default, connection: _connection2.default, ejecter: _ejecter2.default };

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _OfflineRequest = __webpack_require__(41);
	
	var _OfflineRequest2 = _interopRequireDefault(_OfflineRequest);
	
	var _config = __webpack_require__(42);
	
	var _config2 = _interopRequireDefault(_config);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var authInput = {};
	var authingUser = false;
	
	exports.default = {
	    data: {
	        sellerPasswordInput: '',
	        wrongSellerPassord: false
	    },
	    methods: {
	        /**
	         * Adds value to password input when key is pressed
	         * @param  {KeyboardEvent} e The key press event
	         */
	
	        onPasswordInput: function onPasswordInput(e) {
	            console.log('Password key input');
	            var value = e.target.parents('.mdl-cell').textContent.trim();
	            this.sellerPasswordInput = this.sellerPasswordInput + value;
	        },
	
	        /**
	         * Clears password input when clear button is pressed
	         */
	        onClearInput: function onClearInput() {
	            console.log('Password clear input');
	            this.sellerPasswordInput = '';
	        },
	
	        /**
	         * Checks the seller when validating password
	         */
	        onValidateInput: function onValidateInput() {
	            var _this = this;
	
	            if (authingUser) {
	                return;
	            }
	
	            authingUser = true;
	
	            console.log('Password validate input');
	
	            _OfflineRequest2.default.post(_config2.default.baseURL + '/services/login', {
	                meanOfLogin: 'etuId',
	                data: this.sellerCardNum.trim(),
	                pin: this.sellerPasswordInput
	            }).then(function (response) {
	                authingUser = false;
	
	                if (response.status === 404) {
	                    _this.throwError('Vendeur inconnu');
	
	                    return _this.onEject();
	                } else if (response.status === 401) {
	                    _this.sellerPasswordInput = '';
	
	                    return _this.throwError('Mot de passe invalide');
	                }
	
	                _this.currentSeller = response.user;
	                _OfflineRequest2.default.setBearer(response.token);
	
	                _this.sellerCardNum = '';
	                _this.sellerPasswordInput = '';
	                _this.sellerConnected = true;
	                _this.sellerCanReload = true;
	                _this.sellerAuth = true;
	
	                _this.loadData();
	            }).catch(function (e) {
	                if (e.type === 'error') {
	                    _this.throwError('Impossible de se connecter');
	
	                    return _this.onEject();
	                }
	            });
	        }
	    }
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/* global document, navigator, XMLHttpRequest */
	
	var strictUriEncode = function strictUriEncode(str) {
	    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
	        return '%' + c.charCodeAt(0).toString(16);
	    });
	};
	
	var bearer = undefined;
	
	var OfflineRequest = function () {
	    function OfflineRequest(method, url, params) {
	        _classCallCheck(this, OfflineRequest);
	
	        this.method = method;
	        this.url = url;
	        this.params = params;
	
	        var withDataMethods = ['post', 'put', 'patch'];
	
	        if (withDataMethods.indexOf(this.method.toLowerCase()) === -1) {
	            this.url = '' + this.url;
	            var qs = OfflineRequest.qs(this.params);
	
	            if (qs.length > 0) {
	                this.url += qs;
	            }
	
	            this.params = null;
	        } else {
	            this.params = JSON.stringify(params);
	        }
	    }
	
	    _createClass(OfflineRequest, [{
	        key: 'send',
	        value: function send() {
	            var _this = this;
	
	            if (!OfflineRequest.isWatchingForAlive) {
	                OfflineRequest.checkForAlive();
	            }
	
	            return new Promise(function (resolve, reject) {
	                var req = new XMLHttpRequest();
	
	                req.open(_this.method.toUpperCase(), _this.url, true);
	
	                req.onload = function () {
	                    if (req.getResponseHeader('Content-Type').indexOf('application/json') > -1) {
	                        try {
	                            resolve(JSON.parse(req.responseText));
	                        } catch (err) {
	                            reject(err);
	                        }
	                    } else {
	                        resolve(req.responseText);
	                    }
	
	                    OfflineRequest.pointId = req.getResponseHeader('point');
	                    OfflineRequest.deviceId = req.getResponseHeader('device');
	                };
	
	                req.onerror = function (err) {
	                    reject(err);
	                };
	
	                if (bearer) {
	                    req.setRequestHeader('Authorization', 'Bearer ' + bearer);
	                }
	
	                req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
	
	                if (navigator.onLine) {
	                    try {
	                        req.send(_this.params);
	                    } catch (err) {
	                        reject(err);
	                    }
	                } else {
	                    OfflineRequest.pendingRequests.push([req, _this.params]);
	                }
	            });
	        }
	    }], [{
	        key: 'get',
	        value: function get(url, args) {
	            var req = new OfflineRequest('get', url, args);
	
	            return req.send();
	        }
	    }, {
	        key: 'post',
	        value: function post(url, args) {
	            var req = new OfflineRequest('post', url, args);
	
	            return req.send();
	        }
	    }, {
	        key: 'head',
	        value: function head(url, args) {
	            var req = new OfflineRequest('head', url, args);
	
	            return req.send();
	        }
	    }, {
	        key: 'patch',
	        value: function patch(url, args) {
	            var req = new OfflineRequest('patch', url, args);
	
	            return req.send();
	        }
	    }, {
	        key: 'checkForAlive',
	        value: function checkForAlive() {
	            OfflineRequest.isWatchingForAlive = true;
	
	            // Debounce the ononline (as it can be fired multiple times in < 100ms)
	            var timeout = 0;
	            document.body.ononline = function () {
	                clearTimeout(timeout);
	                timeout = setTimeout(OfflineRequest.restore, 1500);
	            };
	
	            return this;
	        }
	    }, {
	        key: 'restore',
	        value: function restore() {
	            // Resend all the requests
	            OfflineRequest.pendingRequests.forEach(function (req_) {
	                var req = req_[0];
	                var data = req_[1];
	                req.send(data);
	            });
	        }
	    }, {
	        key: 'qs',
	        value: function qs(obj) {
	            if (!obj) {
	                return '';
	            }
	
	            return Object.keys(obj).sort().map(function (key) {
	                var val = obj[key];
	
	                if (val === undefined) {
	                    return '';
	                }
	
	                if (val === null) {
	                    return key;
	                }
	
	                if (Array.isArray(val)) {
	                    return val.sort().map(function (val2) {
	                        return strictUriEncode(key) + '=' + strictUriEncode(val2);
	                    }).join('&');
	                }
	
	                return strictUriEncode(key) + '=' + strictUriEncode(val);
	            }).filter(function (x) {
	                return x.length > 0;
	            }).join('&');
	        }
	    }, {
	        key: 'setBearer',
	        value: function setBearer(bearer_) {
	            bearer = bearer_;
	        }
	    }]);
	
	    return OfflineRequest;
	}();
	
	OfflineRequest.pendingRequests = [];
	OfflineRequest.isWatchingForAlive = false;
	OfflineRequest.pointId = '';
	OfflineRequest.deviceId = '';
	
	exports.default = OfflineRequest;

/***/ },
/* 42 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var config = {
	    protocol: 'https',
	    host: 'localhost',
	    port: 3000
	};
	
	config.baseURL = config.protocol + '://' + config.host + ':' + config.port;
	
	exports.default = config;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _OfflineRequest = __webpack_require__(41);
	
	var _OfflineRequest2 = _interopRequireDefault(_OfflineRequest);
	
	var _config = __webpack_require__(42);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _utils = __webpack_require__(21);
	
	var _utils2 = _interopRequireDefault(_utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Checks the serie of number and do whatever it has to do (connect user or Seller)
	 * @param {Vue}    vm             The vue instance
	 * @param {Object} config         The configuration
	 * @param {Class}  OfflineRequest The OfflineRequest module
	 * @param {String} cardNumber     The number serie
	 */
	var checkSerie = function checkSerie(vm, config, OfflineRequest, cardNumber) {
	    var q = __webpack_require__(44);
	
	    if (!cardNumber.isCardNumber()) {
	        vm.throwError('Numéro de carte étu invalide');
	
	        return;
	    }
	
	    if (vm.sellerConnected && vm.sellerAuth && vm.userConnected && vm.inputIsForDoubleValidation) {
	        console.info('Revalidating...');
	        vm.revalidate(cardNumber);
	    } else if (vm.sellerConnected && vm.sellerAuth) {
	        (function () {
	            console.info('User loading...');
	
	            var molSearchIsRemoved = q({
	                field: 'isRemoved',
	                eq: false
	            });
	
	            var molSearchType = q({
	                field: 'type',
	                eq: 'etuId'
	            });
	
	            var molSearchData = q({
	                field: 'data',
	                eq: cardNumber.trim()
	            });
	
	            var mol = undefined;
	            OfflineRequest.get(config.baseURL + '/meansoflogin/search' + ('?q[]=' + molSearchIsRemoved + '&q[]=' + molSearchType + '&q[]=' + molSearchData)).then(function (response) {
	                if (!Array.isArray(response) || response.length === 0) {
	                    throw new Error('Utilisateur invalide');
	                }
	
	                mol = response[0];
	
	                return OfflineRequest.get(config.baseURL + '/users/' + mol.userId);
	            }).then(function (response) {
	                if (!response.id) {
	                    throw new Error('Utilisateur invalide');
	                }
	
	                console.info('User loaded !');
	                var user = response;
	                user.meansoflogin = [mol];
	                vm.currentUser = user;
	                vm.userConnected = true;
	                vm.showPicture = vm.device.showPicture;
	            }).catch(function (err) {
	                vm.throwError(err.message);
	            });
	        })();
	    } else {
	        console.info('Seller loading...');
	
	        vm.sellerCardNum = cardNumber;
	        vm.sellerConnected = true;
	    }
	};
	
	var connection = {};
	
	var serie = '';
	var clearSerieTimeout = 0;
	
	exports.default = {
	    data: {
	        currentSeller: {},
	        currentUser: {},
	        sellerConnected: false,
	        sellerAuth: false,
	        sellerCardNum: '',
	        userConnected: false,
	        sellerCanReload: false,
	        showPicture: false
	    },
	    controller: function controller(vm) {
	        (0, _utils2.default)('body').addEventListener('keypress', function (e) {
	            if (vm.userConnected || vm.sellerConnected && !vm.sellerAuth || vm.error || vm.startedLoading) {
	                if (!vm.inputIsForDoubleValidation) {
	                    return;
	                }
	            }
	
	            console.log('keyPress and waiting for a user card number');
	
	            serie += String.fromCharCode(e.which);
	            console.log('Actual number : ', serie);
	            clearTimeout(clearSerieTimeout);
	
	            clearSerieTimeout = setTimeout(function () {
	                checkSerie(vm, _config2.default, _OfflineRequest2.default, serie);
	                console.info('Checking');
	                serie = '';
	            }, 1000);
	        });
	    }
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, setImmediate) {// vim:ts=4:sts=4:sw=4:
	/*!
	 *
	 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
	 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
	 *
	 * With parts by Tyler Close
	 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
	 * at http://www.opensource.org/licenses/mit-license.html
	 * Forked at ref_send.js version: 2009-05-11
	 *
	 * With parts by Mark Miller
	 * Copyright (C) 2011 Google Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 */
	
	(function (definition) {
	    "use strict";
	
	    // This file will function properly as a <script> tag, or a module
	    // using CommonJS and NodeJS or RequireJS module formats.  In
	    // Common/Node/RequireJS, the module exports the Q API and when
	    // executed as a simple <script>, it creates a Q global instead.
	
	    // Montage Require
	    if (typeof bootstrap === "function") {
	        bootstrap("promise", definition);
	
	    // CommonJS
	    } else if (true) {
	        module.exports = definition();
	
	    // RequireJS
	    } else if (typeof define === "function" && define.amd) {
	        define(definition);
	
	    // SES (Secure EcmaScript)
	    } else if (typeof ses !== "undefined") {
	        if (!ses.ok()) {
	            return;
	        } else {
	            ses.makeQ = definition;
	        }
	
	    // <script>
	    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
	        // Prefer window over self for add-on scripts. Use self for
	        // non-windowed contexts.
	        var global = typeof window !== "undefined" ? window : self;
	
	        // Get the `window` object, save the previous Q global
	        // and initialize Q as a global.
	        var previousQ = global.Q;
	        global.Q = definition();
	
	        // Add a noConflict function so Q can be removed from the
	        // global namespace.
	        global.Q.noConflict = function () {
	            global.Q = previousQ;
	            return this;
	        };
	
	    } else {
	        throw new Error("This environment was not anticipated by Q. Please file a bug.");
	    }
	
	})(function () {
	"use strict";
	
	var hasStacks = false;
	try {
	    throw new Error();
	} catch (e) {
	    hasStacks = !!e.stack;
	}
	
	// All code after this point will be filtered from stack traces reported
	// by Q.
	var qStartingLine = captureLine();
	var qFileName;
	
	// shims
	
	// used for fallback in "allResolved"
	var noop = function () {};
	
	// Use the fastest possible means to execute a task in a future turn
	// of the event loop.
	var nextTick =(function () {
	    // linked list of tasks (single, with head node)
	    var head = {task: void 0, next: null};
	    var tail = head;
	    var flushing = false;
	    var requestTick = void 0;
	    var isNodeJS = false;
	    // queue for late tasks, used by unhandled rejection tracking
	    var laterQueue = [];
	
	    function flush() {
	        /* jshint loopfunc: true */
	        var task, domain;
	
	        while (head.next) {
	            head = head.next;
	            task = head.task;
	            head.task = void 0;
	            domain = head.domain;
	
	            if (domain) {
	                head.domain = void 0;
	                domain.enter();
	            }
	            runSingle(task, domain);
	
	        }
	        while (laterQueue.length) {
	            task = laterQueue.pop();
	            runSingle(task);
	        }
	        flushing = false;
	    }
	    // runs a single function in the async queue
	    function runSingle(task, domain) {
	        try {
	            task();
	
	        } catch (e) {
	            if (isNodeJS) {
	                // In node, uncaught exceptions are considered fatal errors.
	                // Re-throw them synchronously to interrupt flushing!
	
	                // Ensure continuation if the uncaught exception is suppressed
	                // listening "uncaughtException" events (as domains does).
	                // Continue in next event to avoid tick recursion.
	                if (domain) {
	                    domain.exit();
	                }
	                setTimeout(flush, 0);
	                if (domain) {
	                    domain.enter();
	                }
	
	                throw e;
	
	            } else {
	                // In browsers, uncaught exceptions are not fatal.
	                // Re-throw them asynchronously to avoid slow-downs.
	                setTimeout(function () {
	                    throw e;
	                }, 0);
	            }
	        }
	
	        if (domain) {
	            domain.exit();
	        }
	    }
	
	    nextTick = function (task) {
	        tail = tail.next = {
	            task: task,
	            domain: isNodeJS && process.domain,
	            next: null
	        };
	
	        if (!flushing) {
	            flushing = true;
	            requestTick();
	        }
	    };
	
	    if (typeof process === "object" &&
	        process.toString() === "[object process]" && process.nextTick) {
	        // Ensure Q is in a real Node environment, with a `process.nextTick`.
	        // To see through fake Node environments:
	        // * Mocha test runner - exposes a `process` global without a `nextTick`
	        // * Browserify - exposes a `process.nexTick` function that uses
	        //   `setTimeout`. In this case `setImmediate` is preferred because
	        //    it is faster. Browserify's `process.toString()` yields
	        //   "[object Object]", while in a real Node environment
	        //   `process.nextTick()` yields "[object process]".
	        isNodeJS = true;
	
	        requestTick = function () {
	            process.nextTick(flush);
	        };
	
	    } else if (typeof setImmediate === "function") {
	        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
	        if (typeof window !== "undefined") {
	            requestTick = setImmediate.bind(window, flush);
	        } else {
	            requestTick = function () {
	                setImmediate(flush);
	            };
	        }
	
	    } else if (typeof MessageChannel !== "undefined") {
	        // modern browsers
	        // http://www.nonblocking.io/2011/06/windownexttick.html
	        var channel = new MessageChannel();
	        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
	        // working message ports the first time a page loads.
	        channel.port1.onmessage = function () {
	            requestTick = requestPortTick;
	            channel.port1.onmessage = flush;
	            flush();
	        };
	        var requestPortTick = function () {
	            // Opera requires us to provide a message payload, regardless of
	            // whether we use it.
	            channel.port2.postMessage(0);
	        };
	        requestTick = function () {
	            setTimeout(flush, 0);
	            requestPortTick();
	        };
	
	    } else {
	        // old browsers
	        requestTick = function () {
	            setTimeout(flush, 0);
	        };
	    }
	    // runs a task after all other tasks have been run
	    // this is useful for unhandled rejection tracking that needs to happen
	    // after all `then`d tasks have been run.
	    nextTick.runAfter = function (task) {
	        laterQueue.push(task);
	        if (!flushing) {
	            flushing = true;
	            requestTick();
	        }
	    };
	    return nextTick;
	})();
	
	// Attempt to make generics safe in the face of downstream
	// modifications.
	// There is no situation where this is necessary.
	// If you need a security guarantee, these primordials need to be
	// deeply frozen anyway, and if you don’t need a security guarantee,
	// this is just plain paranoid.
	// However, this **might** have the nice side-effect of reducing the size of
	// the minified code by reducing x.call() to merely x()
	// See Mark Miller’s explanation of what this does.
	// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
	var call = Function.call;
	function uncurryThis(f) {
	    return function () {
	        return call.apply(f, arguments);
	    };
	}
	// This is equivalent, but slower:
	// uncurryThis = Function_bind.bind(Function_bind.call);
	// http://jsperf.com/uncurrythis
	
	var array_slice = uncurryThis(Array.prototype.slice);
	
	var array_reduce = uncurryThis(
	    Array.prototype.reduce || function (callback, basis) {
	        var index = 0,
	            length = this.length;
	        // concerning the initial value, if one is not provided
	        if (arguments.length === 1) {
	            // seek to the first value in the array, accounting
	            // for the possibility that is is a sparse array
	            do {
	                if (index in this) {
	                    basis = this[index++];
	                    break;
	                }
	                if (++index >= length) {
	                    throw new TypeError();
	                }
	            } while (1);
	        }
	        // reduce
	        for (; index < length; index++) {
	            // account for the possibility that the array is sparse
	            if (index in this) {
	                basis = callback(basis, this[index], index);
	            }
	        }
	        return basis;
	    }
	);
	
	var array_indexOf = uncurryThis(
	    Array.prototype.indexOf || function (value) {
	        // not a very good shim, but good enough for our one use of it
	        for (var i = 0; i < this.length; i++) {
	            if (this[i] === value) {
	                return i;
	            }
	        }
	        return -1;
	    }
	);
	
	var array_map = uncurryThis(
	    Array.prototype.map || function (callback, thisp) {
	        var self = this;
	        var collect = [];
	        array_reduce(self, function (undefined, value, index) {
	            collect.push(callback.call(thisp, value, index, self));
	        }, void 0);
	        return collect;
	    }
	);
	
	var object_create = Object.create || function (prototype) {
	    function Type() { }
	    Type.prototype = prototype;
	    return new Type();
	};
	
	var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);
	
	var object_keys = Object.keys || function (object) {
	    var keys = [];
	    for (var key in object) {
	        if (object_hasOwnProperty(object, key)) {
	            keys.push(key);
	        }
	    }
	    return keys;
	};
	
	var object_toString = uncurryThis(Object.prototype.toString);
	
	function isObject(value) {
	    return value === Object(value);
	}
	
	// generator related shims
	
	// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
	function isStopIteration(exception) {
	    return (
	        object_toString(exception) === "[object StopIteration]" ||
	        exception instanceof QReturnValue
	    );
	}
	
	// FIXME: Remove this helper and Q.return once ES6 generators are in
	// SpiderMonkey.
	var QReturnValue;
	if (typeof ReturnValue !== "undefined") {
	    QReturnValue = ReturnValue;
	} else {
	    QReturnValue = function (value) {
	        this.value = value;
	    };
	}
	
	// long stack traces
	
	var STACK_JUMP_SEPARATOR = "From previous event:";
	
	function makeStackTraceLong(error, promise) {
	    // If possible, transform the error stack trace by removing Node and Q
	    // cruft, then concatenating with the stack trace of `promise`. See #57.
	    if (hasStacks &&
	        promise.stack &&
	        typeof error === "object" &&
	        error !== null &&
	        error.stack &&
	        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
	    ) {
	        var stacks = [];
	        for (var p = promise; !!p; p = p.source) {
	            if (p.stack) {
	                stacks.unshift(p.stack);
	            }
	        }
	        stacks.unshift(error.stack);
	
	        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
	        error.stack = filterStackString(concatedStacks);
	    }
	}
	
	function filterStackString(stackString) {
	    var lines = stackString.split("\n");
	    var desiredLines = [];
	    for (var i = 0; i < lines.length; ++i) {
	        var line = lines[i];
	
	        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
	            desiredLines.push(line);
	        }
	    }
	    return desiredLines.join("\n");
	}
	
	function isNodeFrame(stackLine) {
	    return stackLine.indexOf("(module.js:") !== -1 ||
	           stackLine.indexOf("(node.js:") !== -1;
	}
	
	function getFileNameAndLineNumber(stackLine) {
	    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
	    // In IE10 function name can have spaces ("Anonymous function") O_o
	    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
	    if (attempt1) {
	        return [attempt1[1], Number(attempt1[2])];
	    }
	
	    // Anonymous functions: "at filename:lineNumber:columnNumber"
	    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
	    if (attempt2) {
	        return [attempt2[1], Number(attempt2[2])];
	    }
	
	    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
	    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
	    if (attempt3) {
	        return [attempt3[1], Number(attempt3[2])];
	    }
	}
	
	function isInternalFrame(stackLine) {
	    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
	
	    if (!fileNameAndLineNumber) {
	        return false;
	    }
	
	    var fileName = fileNameAndLineNumber[0];
	    var lineNumber = fileNameAndLineNumber[1];
	
	    return fileName === qFileName &&
	        lineNumber >= qStartingLine &&
	        lineNumber <= qEndingLine;
	}
	
	// discover own file name and line number range for filtering stack
	// traces
	function captureLine() {
	    if (!hasStacks) {
	        return;
	    }
	
	    try {
	        throw new Error();
	    } catch (e) {
	        var lines = e.stack.split("\n");
	        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
	        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
	        if (!fileNameAndLineNumber) {
	            return;
	        }
	
	        qFileName = fileNameAndLineNumber[0];
	        return fileNameAndLineNumber[1];
	    }
	}
	
	function deprecate(callback, name, alternative) {
	    return function () {
	        if (typeof console !== "undefined" &&
	            typeof console.warn === "function") {
	            console.warn(name + " is deprecated, use " + alternative +
	                         " instead.", new Error("").stack);
	        }
	        return callback.apply(callback, arguments);
	    };
	}
	
	// end of shims
	// beginning of real work
	
	/**
	 * Constructs a promise for an immediate reference, passes promises through, or
	 * coerces promises from different systems.
	 * @param value immediate reference or promise
	 */
	function Q(value) {
	    // If the object is already a Promise, return it directly.  This enables
	    // the resolve function to both be used to created references from objects,
	    // but to tolerably coerce non-promises to promises.
	    if (value instanceof Promise) {
	        return value;
	    }
	
	    // assimilate thenables
	    if (isPromiseAlike(value)) {
	        return coerce(value);
	    } else {
	        return fulfill(value);
	    }
	}
	Q.resolve = Q;
	
	/**
	 * Performs a task in a future turn of the event loop.
	 * @param {Function} task
	 */
	Q.nextTick = nextTick;
	
	/**
	 * Controls whether or not long stack traces will be on
	 */
	Q.longStackSupport = false;
	
	// enable long stacks if Q_DEBUG is set
	if (typeof process === "object" && process && process.env && process.env.Q_DEBUG) {
	    Q.longStackSupport = true;
	}
	
	/**
	 * Constructs a {promise, resolve, reject} object.
	 *
	 * `resolve` is a callback to invoke with a more resolved value for the
	 * promise. To fulfill the promise, invoke `resolve` with any value that is
	 * not a thenable. To reject the promise, invoke `resolve` with a rejected
	 * thenable, or invoke `reject` with the reason directly. To resolve the
	 * promise to another thenable, thus putting it in the same state, invoke
	 * `resolve` with that other thenable.
	 */
	Q.defer = defer;
	function defer() {
	    // if "messages" is an "Array", that indicates that the promise has not yet
	    // been resolved.  If it is "undefined", it has been resolved.  Each
	    // element of the messages array is itself an array of complete arguments to
	    // forward to the resolved promise.  We coerce the resolution value to a
	    // promise using the `resolve` function because it handles both fully
	    // non-thenable values and other thenables gracefully.
	    var messages = [], progressListeners = [], resolvedPromise;
	
	    var deferred = object_create(defer.prototype);
	    var promise = object_create(Promise.prototype);
	
	    promise.promiseDispatch = function (resolve, op, operands) {
	        var args = array_slice(arguments);
	        if (messages) {
	            messages.push(args);
	            if (op === "when" && operands[1]) { // progress operand
	                progressListeners.push(operands[1]);
	            }
	        } else {
	            Q.nextTick(function () {
	                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
	            });
	        }
	    };
	
	    // XXX deprecated
	    promise.valueOf = function () {
	        if (messages) {
	            return promise;
	        }
	        var nearerValue = nearer(resolvedPromise);
	        if (isPromise(nearerValue)) {
	            resolvedPromise = nearerValue; // shorten chain
	        }
	        return nearerValue;
	    };
	
	    promise.inspect = function () {
	        if (!resolvedPromise) {
	            return { state: "pending" };
	        }
	        return resolvedPromise.inspect();
	    };
	
	    if (Q.longStackSupport && hasStacks) {
	        try {
	            throw new Error();
	        } catch (e) {
	            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
	            // accessor around; that causes memory leaks as per GH-111. Just
	            // reify the stack trace as a string ASAP.
	            //
	            // At the same time, cut off the first line; it's always just
	            // "[object Promise]\n", as per the `toString`.
	            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
	        }
	    }
	
	    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
	    // consolidating them into `become`, since otherwise we'd create new
	    // promises with the lines `become(whatever(value))`. See e.g. GH-252.
	
	    function become(newPromise) {
	        resolvedPromise = newPromise;
	        promise.source = newPromise;
	
	        array_reduce(messages, function (undefined, message) {
	            Q.nextTick(function () {
	                newPromise.promiseDispatch.apply(newPromise, message);
	            });
	        }, void 0);
	
	        messages = void 0;
	        progressListeners = void 0;
	    }
	
	    deferred.promise = promise;
	    deferred.resolve = function (value) {
	        if (resolvedPromise) {
	            return;
	        }
	
	        become(Q(value));
	    };
	
	    deferred.fulfill = function (value) {
	        if (resolvedPromise) {
	            return;
	        }
	
	        become(fulfill(value));
	    };
	    deferred.reject = function (reason) {
	        if (resolvedPromise) {
	            return;
	        }
	
	        become(reject(reason));
	    };
	    deferred.notify = function (progress) {
	        if (resolvedPromise) {
	            return;
	        }
	
	        array_reduce(progressListeners, function (undefined, progressListener) {
	            Q.nextTick(function () {
	                progressListener(progress);
	            });
	        }, void 0);
	    };
	
	    return deferred;
	}
	
	/**
	 * Creates a Node-style callback that will resolve or reject the deferred
	 * promise.
	 * @returns a nodeback
	 */
	defer.prototype.makeNodeResolver = function () {
	    var self = this;
	    return function (error, value) {
	        if (error) {
	            self.reject(error);
	        } else if (arguments.length > 2) {
	            self.resolve(array_slice(arguments, 1));
	        } else {
	            self.resolve(value);
	        }
	    };
	};
	
	/**
	 * @param resolver {Function} a function that returns nothing and accepts
	 * the resolve, reject, and notify functions for a deferred.
	 * @returns a promise that may be resolved with the given resolve and reject
	 * functions, or rejected by a thrown exception in resolver
	 */
	Q.Promise = promise; // ES6
	Q.promise = promise;
	function promise(resolver) {
	    if (typeof resolver !== "function") {
	        throw new TypeError("resolver must be a function.");
	    }
	    var deferred = defer();
	    try {
	        resolver(deferred.resolve, deferred.reject, deferred.notify);
	    } catch (reason) {
	        deferred.reject(reason);
	    }
	    return deferred.promise;
	}
	
	promise.race = race; // ES6
	promise.all = all; // ES6
	promise.reject = reject; // ES6
	promise.resolve = Q; // ES6
	
	// XXX experimental.  This method is a way to denote that a local value is
	// serializable and should be immediately dispatched to a remote upon request,
	// instead of passing a reference.
	Q.passByCopy = function (object) {
	    //freeze(object);
	    //passByCopies.set(object, true);
	    return object;
	};
	
	Promise.prototype.passByCopy = function () {
	    //freeze(object);
	    //passByCopies.set(object, true);
	    return this;
	};
	
	/**
	 * If two promises eventually fulfill to the same value, promises that value,
	 * but otherwise rejects.
	 * @param x {Any*}
	 * @param y {Any*}
	 * @returns {Any*} a promise for x and y if they are the same, but a rejection
	 * otherwise.
	 *
	 */
	Q.join = function (x, y) {
	    return Q(x).join(y);
	};
	
	Promise.prototype.join = function (that) {
	    return Q([this, that]).spread(function (x, y) {
	        if (x === y) {
	            // TODO: "===" should be Object.is or equiv
	            return x;
	        } else {
	            throw new Error("Can't join: not the same: " + x + " " + y);
	        }
	    });
	};
	
	/**
	 * Returns a promise for the first of an array of promises to become settled.
	 * @param answers {Array[Any*]} promises to race
	 * @returns {Any*} the first promise to be settled
	 */
	Q.race = race;
	function race(answerPs) {
	    return promise(function (resolve, reject) {
	        // Switch to this once we can assume at least ES5
	        // answerPs.forEach(function (answerP) {
	        //     Q(answerP).then(resolve, reject);
	        // });
	        // Use this in the meantime
	        for (var i = 0, len = answerPs.length; i < len; i++) {
	            Q(answerPs[i]).then(resolve, reject);
	        }
	    });
	}
	
	Promise.prototype.race = function () {
	    return this.then(Q.race);
	};
	
	/**
	 * Constructs a Promise with a promise descriptor object and optional fallback
	 * function.  The descriptor contains methods like when(rejected), get(name),
	 * set(name, value), post(name, args), and delete(name), which all
	 * return either a value, a promise for a value, or a rejection.  The fallback
	 * accepts the operation name, a resolver, and any further arguments that would
	 * have been forwarded to the appropriate method above had a method been
	 * provided with the proper name.  The API makes no guarantees about the nature
	 * of the returned object, apart from that it is usable whereever promises are
	 * bought and sold.
	 */
	Q.makePromise = Promise;
	function Promise(descriptor, fallback, inspect) {
	    if (fallback === void 0) {
	        fallback = function (op) {
	            return reject(new Error(
	                "Promise does not support operation: " + op
	            ));
	        };
	    }
	    if (inspect === void 0) {
	        inspect = function () {
	            return {state: "unknown"};
	        };
	    }
	
	    var promise = object_create(Promise.prototype);
	
	    promise.promiseDispatch = function (resolve, op, args) {
	        var result;
	        try {
	            if (descriptor[op]) {
	                result = descriptor[op].apply(promise, args);
	            } else {
	                result = fallback.call(promise, op, args);
	            }
	        } catch (exception) {
	            result = reject(exception);
	        }
	        if (resolve) {
	            resolve(result);
	        }
	    };
	
	    promise.inspect = inspect;
	
	    // XXX deprecated `valueOf` and `exception` support
	    if (inspect) {
	        var inspected = inspect();
	        if (inspected.state === "rejected") {
	            promise.exception = inspected.reason;
	        }
	
	        promise.valueOf = function () {
	            var inspected = inspect();
	            if (inspected.state === "pending" ||
	                inspected.state === "rejected") {
	                return promise;
	            }
	            return inspected.value;
	        };
	    }
	
	    return promise;
	}
	
	Promise.prototype.toString = function () {
	    return "[object Promise]";
	};
	
	Promise.prototype.then = function (fulfilled, rejected, progressed) {
	    var self = this;
	    var deferred = defer();
	    var done = false;   // ensure the untrusted promise makes at most a
	                        // single call to one of the callbacks
	
	    function _fulfilled(value) {
	        try {
	            return typeof fulfilled === "function" ? fulfilled(value) : value;
	        } catch (exception) {
	            return reject(exception);
	        }
	    }
	
	    function _rejected(exception) {
	        if (typeof rejected === "function") {
	            makeStackTraceLong(exception, self);
	            try {
	                return rejected(exception);
	            } catch (newException) {
	                return reject(newException);
	            }
	        }
	        return reject(exception);
	    }
	
	    function _progressed(value) {
	        return typeof progressed === "function" ? progressed(value) : value;
	    }
	
	    Q.nextTick(function () {
	        self.promiseDispatch(function (value) {
	            if (done) {
	                return;
	            }
	            done = true;
	
	            deferred.resolve(_fulfilled(value));
	        }, "when", [function (exception) {
	            if (done) {
	                return;
	            }
	            done = true;
	
	            deferred.resolve(_rejected(exception));
	        }]);
	    });
	
	    // Progress propagator need to be attached in the current tick.
	    self.promiseDispatch(void 0, "when", [void 0, function (value) {
	        var newValue;
	        var threw = false;
	        try {
	            newValue = _progressed(value);
	        } catch (e) {
	            threw = true;
	            if (Q.onerror) {
	                Q.onerror(e);
	            } else {
	                throw e;
	            }
	        }
	
	        if (!threw) {
	            deferred.notify(newValue);
	        }
	    }]);
	
	    return deferred.promise;
	};
	
	Q.tap = function (promise, callback) {
	    return Q(promise).tap(callback);
	};
	
	/**
	 * Works almost like "finally", but not called for rejections.
	 * Original resolution value is passed through callback unaffected.
	 * Callback may return a promise that will be awaited for.
	 * @param {Function} callback
	 * @returns {Q.Promise}
	 * @example
	 * doSomething()
	 *   .then(...)
	 *   .tap(console.log)
	 *   .then(...);
	 */
	Promise.prototype.tap = function (callback) {
	    callback = Q(callback);
	
	    return this.then(function (value) {
	        return callback.fcall(value).thenResolve(value);
	    });
	};
	
	/**
	 * Registers an observer on a promise.
	 *
	 * Guarantees:
	 *
	 * 1. that fulfilled and rejected will be called only once.
	 * 2. that either the fulfilled callback or the rejected callback will be
	 *    called, but not both.
	 * 3. that fulfilled and rejected will not be called in this turn.
	 *
	 * @param value      promise or immediate reference to observe
	 * @param fulfilled  function to be called with the fulfilled value
	 * @param rejected   function to be called with the rejection exception
	 * @param progressed function to be called on any progress notifications
	 * @return promise for the return value from the invoked callback
	 */
	Q.when = when;
	function when(value, fulfilled, rejected, progressed) {
	    return Q(value).then(fulfilled, rejected, progressed);
	}
	
	Promise.prototype.thenResolve = function (value) {
	    return this.then(function () { return value; });
	};
	
	Q.thenResolve = function (promise, value) {
	    return Q(promise).thenResolve(value);
	};
	
	Promise.prototype.thenReject = function (reason) {
	    return this.then(function () { throw reason; });
	};
	
	Q.thenReject = function (promise, reason) {
	    return Q(promise).thenReject(reason);
	};
	
	/**
	 * If an object is not a promise, it is as "near" as possible.
	 * If a promise is rejected, it is as "near" as possible too.
	 * If it’s a fulfilled promise, the fulfillment value is nearer.
	 * If it’s a deferred promise and the deferred has been resolved, the
	 * resolution is "nearer".
	 * @param object
	 * @returns most resolved (nearest) form of the object
	 */
	
	// XXX should we re-do this?
	Q.nearer = nearer;
	function nearer(value) {
	    if (isPromise(value)) {
	        var inspected = value.inspect();
	        if (inspected.state === "fulfilled") {
	            return inspected.value;
	        }
	    }
	    return value;
	}
	
	/**
	 * @returns whether the given object is a promise.
	 * Otherwise it is a fulfilled value.
	 */
	Q.isPromise = isPromise;
	function isPromise(object) {
	    return object instanceof Promise;
	}
	
	Q.isPromiseAlike = isPromiseAlike;
	function isPromiseAlike(object) {
	    return isObject(object) && typeof object.then === "function";
	}
	
	/**
	 * @returns whether the given object is a pending promise, meaning not
	 * fulfilled or rejected.
	 */
	Q.isPending = isPending;
	function isPending(object) {
	    return isPromise(object) && object.inspect().state === "pending";
	}
	
	Promise.prototype.isPending = function () {
	    return this.inspect().state === "pending";
	};
	
	/**
	 * @returns whether the given object is a value or fulfilled
	 * promise.
	 */
	Q.isFulfilled = isFulfilled;
	function isFulfilled(object) {
	    return !isPromise(object) || object.inspect().state === "fulfilled";
	}
	
	Promise.prototype.isFulfilled = function () {
	    return this.inspect().state === "fulfilled";
	};
	
	/**
	 * @returns whether the given object is a rejected promise.
	 */
	Q.isRejected = isRejected;
	function isRejected(object) {
	    return isPromise(object) && object.inspect().state === "rejected";
	}
	
	Promise.prototype.isRejected = function () {
	    return this.inspect().state === "rejected";
	};
	
	//// BEGIN UNHANDLED REJECTION TRACKING
	
	// This promise library consumes exceptions thrown in handlers so they can be
	// handled by a subsequent promise.  The exceptions get added to this array when
	// they are created, and removed when they are handled.  Note that in ES6 or
	// shimmed environments, this would naturally be a `Set`.
	var unhandledReasons = [];
	var unhandledRejections = [];
	var reportedUnhandledRejections = [];
	var trackUnhandledRejections = true;
	
	function resetUnhandledRejections() {
	    unhandledReasons.length = 0;
	    unhandledRejections.length = 0;
	
	    if (!trackUnhandledRejections) {
	        trackUnhandledRejections = true;
	    }
	}
	
	function trackRejection(promise, reason) {
	    if (!trackUnhandledRejections) {
	        return;
	    }
	    if (typeof process === "object" && typeof process.emit === "function") {
	        Q.nextTick.runAfter(function () {
	            if (array_indexOf(unhandledRejections, promise) !== -1) {
	                process.emit("unhandledRejection", reason, promise);
	                reportedUnhandledRejections.push(promise);
	            }
	        });
	    }
	
	    unhandledRejections.push(promise);
	    if (reason && typeof reason.stack !== "undefined") {
	        unhandledReasons.push(reason.stack);
	    } else {
	        unhandledReasons.push("(no stack) " + reason);
	    }
	}
	
	function untrackRejection(promise) {
	    if (!trackUnhandledRejections) {
	        return;
	    }
	
	    var at = array_indexOf(unhandledRejections, promise);
	    if (at !== -1) {
	        if (typeof process === "object" && typeof process.emit === "function") {
	            Q.nextTick.runAfter(function () {
	                var atReport = array_indexOf(reportedUnhandledRejections, promise);
	                if (atReport !== -1) {
	                    process.emit("rejectionHandled", unhandledReasons[at], promise);
	                    reportedUnhandledRejections.splice(atReport, 1);
	                }
	            });
	        }
	        unhandledRejections.splice(at, 1);
	        unhandledReasons.splice(at, 1);
	    }
	}
	
	Q.resetUnhandledRejections = resetUnhandledRejections;
	
	Q.getUnhandledReasons = function () {
	    // Make a copy so that consumers can't interfere with our internal state.
	    return unhandledReasons.slice();
	};
	
	Q.stopUnhandledRejectionTracking = function () {
	    resetUnhandledRejections();
	    trackUnhandledRejections = false;
	};
	
	resetUnhandledRejections();
	
	//// END UNHANDLED REJECTION TRACKING
	
	/**
	 * Constructs a rejected promise.
	 * @param reason value describing the failure
	 */
	Q.reject = reject;
	function reject(reason) {
	    var rejection = Promise({
	        "when": function (rejected) {
	            // note that the error has been handled
	            if (rejected) {
	                untrackRejection(this);
	            }
	            return rejected ? rejected(reason) : this;
	        }
	    }, function fallback() {
	        return this;
	    }, function inspect() {
	        return { state: "rejected", reason: reason };
	    });
	
	    // Note that the reason has not been handled.
	    trackRejection(rejection, reason);
	
	    return rejection;
	}
	
	/**
	 * Constructs a fulfilled promise for an immediate reference.
	 * @param value immediate reference
	 */
	Q.fulfill = fulfill;
	function fulfill(value) {
	    return Promise({
	        "when": function () {
	            return value;
	        },
	        "get": function (name) {
	            return value[name];
	        },
	        "set": function (name, rhs) {
	            value[name] = rhs;
	        },
	        "delete": function (name) {
	            delete value[name];
	        },
	        "post": function (name, args) {
	            // Mark Miller proposes that post with no name should apply a
	            // promised function.
	            if (name === null || name === void 0) {
	                return value.apply(void 0, args);
	            } else {
	                return value[name].apply(value, args);
	            }
	        },
	        "apply": function (thisp, args) {
	            return value.apply(thisp, args);
	        },
	        "keys": function () {
	            return object_keys(value);
	        }
	    }, void 0, function inspect() {
	        return { state: "fulfilled", value: value };
	    });
	}
	
	/**
	 * Converts thenables to Q promises.
	 * @param promise thenable promise
	 * @returns a Q promise
	 */
	function coerce(promise) {
	    var deferred = defer();
	    Q.nextTick(function () {
	        try {
	            promise.then(deferred.resolve, deferred.reject, deferred.notify);
	        } catch (exception) {
	            deferred.reject(exception);
	        }
	    });
	    return deferred.promise;
	}
	
	/**
	 * Annotates an object such that it will never be
	 * transferred away from this process over any promise
	 * communication channel.
	 * @param object
	 * @returns promise a wrapping of that object that
	 * additionally responds to the "isDef" message
	 * without a rejection.
	 */
	Q.master = master;
	function master(object) {
	    return Promise({
	        "isDef": function () {}
	    }, function fallback(op, args) {
	        return dispatch(object, op, args);
	    }, function () {
	        return Q(object).inspect();
	    });
	}
	
	/**
	 * Spreads the values of a promised array of arguments into the
	 * fulfillment callback.
	 * @param fulfilled callback that receives variadic arguments from the
	 * promised array
	 * @param rejected callback that receives the exception if the promise
	 * is rejected.
	 * @returns a promise for the return value or thrown exception of
	 * either callback.
	 */
	Q.spread = spread;
	function spread(value, fulfilled, rejected) {
	    return Q(value).spread(fulfilled, rejected);
	}
	
	Promise.prototype.spread = function (fulfilled, rejected) {
	    return this.all().then(function (array) {
	        return fulfilled.apply(void 0, array);
	    }, rejected);
	};
	
	/**
	 * The async function is a decorator for generator functions, turning
	 * them into asynchronous generators.  Although generators are only part
	 * of the newest ECMAScript 6 drafts, this code does not cause syntax
	 * errors in older engines.  This code should continue to work and will
	 * in fact improve over time as the language improves.
	 *
	 * ES6 generators are currently part of V8 version 3.19 with the
	 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
	 * for longer, but under an older Python-inspired form.  This function
	 * works on both kinds of generators.
	 *
	 * Decorates a generator function such that:
	 *  - it may yield promises
	 *  - execution will continue when that promise is fulfilled
	 *  - the value of the yield expression will be the fulfilled value
	 *  - it returns a promise for the return value (when the generator
	 *    stops iterating)
	 *  - the decorated function returns a promise for the return value
	 *    of the generator or the first rejected promise among those
	 *    yielded.
	 *  - if an error is thrown in the generator, it propagates through
	 *    every following yield until it is caught, or until it escapes
	 *    the generator function altogether, and is translated into a
	 *    rejection for the promise returned by the decorated generator.
	 */
	Q.async = async;
	function async(makeGenerator) {
	    return function () {
	        // when verb is "send", arg is a value
	        // when verb is "throw", arg is an exception
	        function continuer(verb, arg) {
	            var result;
	
	            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
	            // engine that has a deployed base of browsers that support generators.
	            // However, SM's generators use the Python-inspired semantics of
	            // outdated ES6 drafts.  We would like to support ES6, but we'd also
	            // like to make it possible to use generators in deployed browsers, so
	            // we also support Python-style generators.  At some point we can remove
	            // this block.
	
	            if (typeof StopIteration === "undefined") {
	                // ES6 Generators
	                try {
	                    result = generator[verb](arg);
	                } catch (exception) {
	                    return reject(exception);
	                }
	                if (result.done) {
	                    return Q(result.value);
	                } else {
	                    return when(result.value, callback, errback);
	                }
	            } else {
	                // SpiderMonkey Generators
	                // FIXME: Remove this case when SM does ES6 generators.
	                try {
	                    result = generator[verb](arg);
	                } catch (exception) {
	                    if (isStopIteration(exception)) {
	                        return Q(exception.value);
	                    } else {
	                        return reject(exception);
	                    }
	                }
	                return when(result, callback, errback);
	            }
	        }
	        var generator = makeGenerator.apply(this, arguments);
	        var callback = continuer.bind(continuer, "next");
	        var errback = continuer.bind(continuer, "throw");
	        return callback();
	    };
	}
	
	/**
	 * The spawn function is a small wrapper around async that immediately
	 * calls the generator and also ends the promise chain, so that any
	 * unhandled errors are thrown instead of forwarded to the error
	 * handler. This is useful because it's extremely common to run
	 * generators at the top-level to work with libraries.
	 */
	Q.spawn = spawn;
	function spawn(makeGenerator) {
	    Q.done(Q.async(makeGenerator)());
	}
	
	// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
	/**
	 * Throws a ReturnValue exception to stop an asynchronous generator.
	 *
	 * This interface is a stop-gap measure to support generator return
	 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
	 * generators like Chromium 29, just use "return" in your generator
	 * functions.
	 *
	 * @param value the return value for the surrounding generator
	 * @throws ReturnValue exception with the value.
	 * @example
	 * // ES6 style
	 * Q.async(function* () {
	 *      var foo = yield getFooPromise();
	 *      var bar = yield getBarPromise();
	 *      return foo + bar;
	 * })
	 * // Older SpiderMonkey style
	 * Q.async(function () {
	 *      var foo = yield getFooPromise();
	 *      var bar = yield getBarPromise();
	 *      Q.return(foo + bar);
	 * })
	 */
	Q["return"] = _return;
	function _return(value) {
	    throw new QReturnValue(value);
	}
	
	/**
	 * The promised function decorator ensures that any promise arguments
	 * are settled and passed as values (`this` is also settled and passed
	 * as a value).  It will also ensure that the result of a function is
	 * always a promise.
	 *
	 * @example
	 * var add = Q.promised(function (a, b) {
	 *     return a + b;
	 * });
	 * add(Q(a), Q(B));
	 *
	 * @param {function} callback The function to decorate
	 * @returns {function} a function that has been decorated.
	 */
	Q.promised = promised;
	function promised(callback) {
	    return function () {
	        return spread([this, all(arguments)], function (self, args) {
	            return callback.apply(self, args);
	        });
	    };
	}
	
	/**
	 * sends a message to a value in a future turn
	 * @param object* the recipient
	 * @param op the name of the message operation, e.g., "when",
	 * @param args further arguments to be forwarded to the operation
	 * @returns result {Promise} a promise for the result of the operation
	 */
	Q.dispatch = dispatch;
	function dispatch(object, op, args) {
	    return Q(object).dispatch(op, args);
	}
	
	Promise.prototype.dispatch = function (op, args) {
	    var self = this;
	    var deferred = defer();
	    Q.nextTick(function () {
	        self.promiseDispatch(deferred.resolve, op, args);
	    });
	    return deferred.promise;
	};
	
	/**
	 * Gets the value of a property in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of property to get
	 * @return promise for the property value
	 */
	Q.get = function (object, key) {
	    return Q(object).dispatch("get", [key]);
	};
	
	Promise.prototype.get = function (key) {
	    return this.dispatch("get", [key]);
	};
	
	/**
	 * Sets the value of a property in a future turn.
	 * @param object    promise or immediate reference for object object
	 * @param name      name of property to set
	 * @param value     new value of property
	 * @return promise for the return value
	 */
	Q.set = function (object, key, value) {
	    return Q(object).dispatch("set", [key, value]);
	};
	
	Promise.prototype.set = function (key, value) {
	    return this.dispatch("set", [key, value]);
	};
	
	/**
	 * Deletes a property in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of property to delete
	 * @return promise for the return value
	 */
	Q.del = // XXX legacy
	Q["delete"] = function (object, key) {
	    return Q(object).dispatch("delete", [key]);
	};
	
	Promise.prototype.del = // XXX legacy
	Promise.prototype["delete"] = function (key) {
	    return this.dispatch("delete", [key]);
	};
	
	/**
	 * Invokes a method in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of method to invoke
	 * @param value     a value to post, typically an array of
	 *                  invocation arguments for promises that
	 *                  are ultimately backed with `resolve` values,
	 *                  as opposed to those backed with URLs
	 *                  wherein the posted value can be any
	 *                  JSON serializable object.
	 * @return promise for the return value
	 */
	// bound locally because it is used by other methods
	Q.mapply = // XXX As proposed by "Redsandro"
	Q.post = function (object, name, args) {
	    return Q(object).dispatch("post", [name, args]);
	};
	
	Promise.prototype.mapply = // XXX As proposed by "Redsandro"
	Promise.prototype.post = function (name, args) {
	    return this.dispatch("post", [name, args]);
	};
	
	/**
	 * Invokes a method in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @param name      name of method to invoke
	 * @param ...args   array of invocation arguments
	 * @return promise for the return value
	 */
	Q.send = // XXX Mark Miller's proposed parlance
	Q.mcall = // XXX As proposed by "Redsandro"
	Q.invoke = function (object, name /*...args*/) {
	    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
	};
	
	Promise.prototype.send = // XXX Mark Miller's proposed parlance
	Promise.prototype.mcall = // XXX As proposed by "Redsandro"
	Promise.prototype.invoke = function (name /*...args*/) {
	    return this.dispatch("post", [name, array_slice(arguments, 1)]);
	};
	
	/**
	 * Applies the promised function in a future turn.
	 * @param object    promise or immediate reference for target function
	 * @param args      array of application arguments
	 */
	Q.fapply = function (object, args) {
	    return Q(object).dispatch("apply", [void 0, args]);
	};
	
	Promise.prototype.fapply = function (args) {
	    return this.dispatch("apply", [void 0, args]);
	};
	
	/**
	 * Calls the promised function in a future turn.
	 * @param object    promise or immediate reference for target function
	 * @param ...args   array of application arguments
	 */
	Q["try"] =
	Q.fcall = function (object /* ...args*/) {
	    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
	};
	
	Promise.prototype.fcall = function (/*...args*/) {
	    return this.dispatch("apply", [void 0, array_slice(arguments)]);
	};
	
	/**
	 * Binds the promised function, transforming return values into a fulfilled
	 * promise and thrown errors into a rejected one.
	 * @param object    promise or immediate reference for target function
	 * @param ...args   array of application arguments
	 */
	Q.fbind = function (object /*...args*/) {
	    var promise = Q(object);
	    var args = array_slice(arguments, 1);
	    return function fbound() {
	        return promise.dispatch("apply", [
	            this,
	            args.concat(array_slice(arguments))
	        ]);
	    };
	};
	Promise.prototype.fbind = function (/*...args*/) {
	    var promise = this;
	    var args = array_slice(arguments);
	    return function fbound() {
	        return promise.dispatch("apply", [
	            this,
	            args.concat(array_slice(arguments))
	        ]);
	    };
	};
	
	/**
	 * Requests the names of the owned properties of a promised
	 * object in a future turn.
	 * @param object    promise or immediate reference for target object
	 * @return promise for the keys of the eventually settled object
	 */
	Q.keys = function (object) {
	    return Q(object).dispatch("keys", []);
	};
	
	Promise.prototype.keys = function () {
	    return this.dispatch("keys", []);
	};
	
	/**
	 * Turns an array of promises into a promise for an array.  If any of
	 * the promises gets rejected, the whole array is rejected immediately.
	 * @param {Array*} an array (or promise for an array) of values (or
	 * promises for values)
	 * @returns a promise for an array of the corresponding values
	 */
	// By Mark Miller
	// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
	Q.all = all;
	function all(promises) {
	    return when(promises, function (promises) {
	        var pendingCount = 0;
	        var deferred = defer();
	        array_reduce(promises, function (undefined, promise, index) {
	            var snapshot;
	            if (
	                isPromise(promise) &&
	                (snapshot = promise.inspect()).state === "fulfilled"
	            ) {
	                promises[index] = snapshot.value;
	            } else {
	                ++pendingCount;
	                when(
	                    promise,
	                    function (value) {
	                        promises[index] = value;
	                        if (--pendingCount === 0) {
	                            deferred.resolve(promises);
	                        }
	                    },
	                    deferred.reject,
	                    function (progress) {
	                        deferred.notify({ index: index, value: progress });
	                    }
	                );
	            }
	        }, void 0);
	        if (pendingCount === 0) {
	            deferred.resolve(promises);
	        }
	        return deferred.promise;
	    });
	}
	
	Promise.prototype.all = function () {
	    return all(this);
	};
	
	/**
	 * Returns the first resolved promise of an array. Prior rejected promises are
	 * ignored.  Rejects only if all promises are rejected.
	 * @param {Array*} an array containing values or promises for values
	 * @returns a promise fulfilled with the value of the first resolved promise,
	 * or a rejected promise if all promises are rejected.
	 */
	Q.any = any;
	
	function any(promises) {
	    if (promises.length === 0) {
	        return Q.resolve();
	    }
	
	    var deferred = Q.defer();
	    var pendingCount = 0;
	    array_reduce(promises, function (prev, current, index) {
	        var promise = promises[index];
	
	        pendingCount++;
	
	        when(promise, onFulfilled, onRejected, onProgress);
	        function onFulfilled(result) {
	            deferred.resolve(result);
	        }
	        function onRejected() {
	            pendingCount--;
	            if (pendingCount === 0) {
	                deferred.reject(new Error(
	                    "Can't get fulfillment value from any promise, all " +
	                    "promises were rejected."
	                ));
	            }
	        }
	        function onProgress(progress) {
	            deferred.notify({
	                index: index,
	                value: progress
	            });
	        }
	    }, undefined);
	
	    return deferred.promise;
	}
	
	Promise.prototype.any = function () {
	    return any(this);
	};
	
	/**
	 * Waits for all promises to be settled, either fulfilled or
	 * rejected.  This is distinct from `all` since that would stop
	 * waiting at the first rejection.  The promise returned by
	 * `allResolved` will never be rejected.
	 * @param promises a promise for an array (or an array) of promises
	 * (or values)
	 * @return a promise for an array of promises
	 */
	Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
	function allResolved(promises) {
	    return when(promises, function (promises) {
	        promises = array_map(promises, Q);
	        return when(all(array_map(promises, function (promise) {
	            return when(promise, noop, noop);
	        })), function () {
	            return promises;
	        });
	    });
	}
	
	Promise.prototype.allResolved = function () {
	    return allResolved(this);
	};
	
	/**
	 * @see Promise#allSettled
	 */
	Q.allSettled = allSettled;
	function allSettled(promises) {
	    return Q(promises).allSettled();
	}
	
	/**
	 * Turns an array of promises into a promise for an array of their states (as
	 * returned by `inspect`) when they have all settled.
	 * @param {Array[Any*]} values an array (or promise for an array) of values (or
	 * promises for values)
	 * @returns {Array[State]} an array of states for the respective values.
	 */
	Promise.prototype.allSettled = function () {
	    return this.then(function (promises) {
	        return all(array_map(promises, function (promise) {
	            promise = Q(promise);
	            function regardless() {
	                return promise.inspect();
	            }
	            return promise.then(regardless, regardless);
	        }));
	    });
	};
	
	/**
	 * Captures the failure of a promise, giving an oportunity to recover
	 * with a callback.  If the given promise is fulfilled, the returned
	 * promise is fulfilled.
	 * @param {Any*} promise for something
	 * @param {Function} callback to fulfill the returned promise if the
	 * given promise is rejected
	 * @returns a promise for the return value of the callback
	 */
	Q.fail = // XXX legacy
	Q["catch"] = function (object, rejected) {
	    return Q(object).then(void 0, rejected);
	};
	
	Promise.prototype.fail = // XXX legacy
	Promise.prototype["catch"] = function (rejected) {
	    return this.then(void 0, rejected);
	};
	
	/**
	 * Attaches a listener that can respond to progress notifications from a
	 * promise's originating deferred. This listener receives the exact arguments
	 * passed to ``deferred.notify``.
	 * @param {Any*} promise for something
	 * @param {Function} callback to receive any progress notifications
	 * @returns the given promise, unchanged
	 */
	Q.progress = progress;
	function progress(object, progressed) {
	    return Q(object).then(void 0, void 0, progressed);
	}
	
	Promise.prototype.progress = function (progressed) {
	    return this.then(void 0, void 0, progressed);
	};
	
	/**
	 * Provides an opportunity to observe the settling of a promise,
	 * regardless of whether the promise is fulfilled or rejected.  Forwards
	 * the resolution to the returned promise when the callback is done.
	 * The callback can return a promise to defer completion.
	 * @param {Any*} promise
	 * @param {Function} callback to observe the resolution of the given
	 * promise, takes no arguments.
	 * @returns a promise for the resolution of the given promise when
	 * ``fin`` is done.
	 */
	Q.fin = // XXX legacy
	Q["finally"] = function (object, callback) {
	    return Q(object)["finally"](callback);
	};
	
	Promise.prototype.fin = // XXX legacy
	Promise.prototype["finally"] = function (callback) {
	    callback = Q(callback);
	    return this.then(function (value) {
	        return callback.fcall().then(function () {
	            return value;
	        });
	    }, function (reason) {
	        // TODO attempt to recycle the rejection with "this".
	        return callback.fcall().then(function () {
	            throw reason;
	        });
	    });
	};
	
	/**
	 * Terminates a chain of promises, forcing rejections to be
	 * thrown as exceptions.
	 * @param {Any*} promise at the end of a chain of promises
	 * @returns nothing
	 */
	Q.done = function (object, fulfilled, rejected, progress) {
	    return Q(object).done(fulfilled, rejected, progress);
	};
	
	Promise.prototype.done = function (fulfilled, rejected, progress) {
	    var onUnhandledError = function (error) {
	        // forward to a future turn so that ``when``
	        // does not catch it and turn it into a rejection.
	        Q.nextTick(function () {
	            makeStackTraceLong(error, promise);
	            if (Q.onerror) {
	                Q.onerror(error);
	            } else {
	                throw error;
	            }
	        });
	    };
	
	    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
	    var promise = fulfilled || rejected || progress ?
	        this.then(fulfilled, rejected, progress) :
	        this;
	
	    if (typeof process === "object" && process && process.domain) {
	        onUnhandledError = process.domain.bind(onUnhandledError);
	    }
	
	    promise.then(void 0, onUnhandledError);
	};
	
	/**
	 * Causes a promise to be rejected if it does not get fulfilled before
	 * some milliseconds time out.
	 * @param {Any*} promise
	 * @param {Number} milliseconds timeout
	 * @param {Any*} custom error message or Error object (optional)
	 * @returns a promise for the resolution of the given promise if it is
	 * fulfilled before the timeout, otherwise rejected.
	 */
	Q.timeout = function (object, ms, error) {
	    return Q(object).timeout(ms, error);
	};
	
	Promise.prototype.timeout = function (ms, error) {
	    var deferred = defer();
	    var timeoutId = setTimeout(function () {
	        if (!error || "string" === typeof error) {
	            error = new Error(error || "Timed out after " + ms + " ms");
	            error.code = "ETIMEDOUT";
	        }
	        deferred.reject(error);
	    }, ms);
	
	    this.then(function (value) {
	        clearTimeout(timeoutId);
	        deferred.resolve(value);
	    }, function (exception) {
	        clearTimeout(timeoutId);
	        deferred.reject(exception);
	    }, deferred.notify);
	
	    return deferred.promise;
	};
	
	/**
	 * Returns a promise for the given value (or promised value), some
	 * milliseconds after it resolved. Passes rejections immediately.
	 * @param {Any*} promise
	 * @param {Number} milliseconds
	 * @returns a promise for the resolution of the given promise after milliseconds
	 * time has elapsed since the resolution of the given promise.
	 * If the given promise rejects, that is passed immediately.
	 */
	Q.delay = function (object, timeout) {
	    if (timeout === void 0) {
	        timeout = object;
	        object = void 0;
	    }
	    return Q(object).delay(timeout);
	};
	
	Promise.prototype.delay = function (timeout) {
	    return this.then(function (value) {
	        var deferred = defer();
	        setTimeout(function () {
	            deferred.resolve(value);
	        }, timeout);
	        return deferred.promise;
	    });
	};
	
	/**
	 * Passes a continuation to a Node function, which is called with the given
	 * arguments provided as an array, and returns a promise.
	 *
	 *      Q.nfapply(FS.readFile, [__filename])
	 *      .then(function (content) {
	 *      })
	 *
	 */
	Q.nfapply = function (callback, args) {
	    return Q(callback).nfapply(args);
	};
	
	Promise.prototype.nfapply = function (args) {
	    var deferred = defer();
	    var nodeArgs = array_slice(args);
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.fapply(nodeArgs).fail(deferred.reject);
	    return deferred.promise;
	};
	
	/**
	 * Passes a continuation to a Node function, which is called with the given
	 * arguments provided individually, and returns a promise.
	 * @example
	 * Q.nfcall(FS.readFile, __filename)
	 * .then(function (content) {
	 * })
	 *
	 */
	Q.nfcall = function (callback /*...args*/) {
	    var args = array_slice(arguments, 1);
	    return Q(callback).nfapply(args);
	};
	
	Promise.prototype.nfcall = function (/*...args*/) {
	    var nodeArgs = array_slice(arguments);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.fapply(nodeArgs).fail(deferred.reject);
	    return deferred.promise;
	};
	
	/**
	 * Wraps a NodeJS continuation passing function and returns an equivalent
	 * version that returns a promise.
	 * @example
	 * Q.nfbind(FS.readFile, __filename)("utf-8")
	 * .then(console.log)
	 * .done()
	 */
	Q.nfbind =
	Q.denodeify = function (callback /*...args*/) {
	    var baseArgs = array_slice(arguments, 1);
	    return function () {
	        var nodeArgs = baseArgs.concat(array_slice(arguments));
	        var deferred = defer();
	        nodeArgs.push(deferred.makeNodeResolver());
	        Q(callback).fapply(nodeArgs).fail(deferred.reject);
	        return deferred.promise;
	    };
	};
	
	Promise.prototype.nfbind =
	Promise.prototype.denodeify = function (/*...args*/) {
	    var args = array_slice(arguments);
	    args.unshift(this);
	    return Q.denodeify.apply(void 0, args);
	};
	
	Q.nbind = function (callback, thisp /*...args*/) {
	    var baseArgs = array_slice(arguments, 2);
	    return function () {
	        var nodeArgs = baseArgs.concat(array_slice(arguments));
	        var deferred = defer();
	        nodeArgs.push(deferred.makeNodeResolver());
	        function bound() {
	            return callback.apply(thisp, arguments);
	        }
	        Q(bound).fapply(nodeArgs).fail(deferred.reject);
	        return deferred.promise;
	    };
	};
	
	Promise.prototype.nbind = function (/*thisp, ...args*/) {
	    var args = array_slice(arguments, 0);
	    args.unshift(this);
	    return Q.nbind.apply(void 0, args);
	};
	
	/**
	 * Calls a method of a Node-style object that accepts a Node-style
	 * callback with a given array of arguments, plus a provided callback.
	 * @param object an object that has the named method
	 * @param {String} name name of the method of object
	 * @param {Array} args arguments to pass to the method; the callback
	 * will be provided by Q and appended to these arguments.
	 * @returns a promise for the value or error
	 */
	Q.nmapply = // XXX As proposed by "Redsandro"
	Q.npost = function (object, name, args) {
	    return Q(object).npost(name, args);
	};
	
	Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
	Promise.prototype.npost = function (name, args) {
	    var nodeArgs = array_slice(args || []);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};
	
	/**
	 * Calls a method of a Node-style object that accepts a Node-style
	 * callback, forwarding the given variadic arguments, plus a provided
	 * callback argument.
	 * @param object an object that has the named method
	 * @param {String} name name of the method of object
	 * @param ...args arguments to pass to the method; the callback will
	 * be provided by Q and appended to these arguments.
	 * @returns a promise for the value or error
	 */
	Q.nsend = // XXX Based on Mark Miller's proposed "send"
	Q.nmcall = // XXX Based on "Redsandro's" proposal
	Q.ninvoke = function (object, name /*...args*/) {
	    var nodeArgs = array_slice(arguments, 2);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};
	
	Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
	Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
	Promise.prototype.ninvoke = function (name /*...args*/) {
	    var nodeArgs = array_slice(arguments, 1);
	    var deferred = defer();
	    nodeArgs.push(deferred.makeNodeResolver());
	    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
	    return deferred.promise;
	};
	
	/**
	 * If a function would like to support both Node continuation-passing-style and
	 * promise-returning-style, it can end its internal promise chain with
	 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
	 * elects to use a nodeback, the result will be sent there.  If they do not
	 * pass a nodeback, they will receive the result promise.
	 * @param object a result (or a promise for a result)
	 * @param {Function} nodeback a Node.js-style callback
	 * @returns either the promise or nothing
	 */
	Q.nodeify = nodeify;
	function nodeify(object, nodeback) {
	    return Q(object).nodeify(nodeback);
	}
	
	Promise.prototype.nodeify = function (nodeback) {
	    if (nodeback) {
	        this.then(function (value) {
	            Q.nextTick(function () {
	                nodeback(null, value);
	            });
	        }, function (error) {
	            Q.nextTick(function () {
	                nodeback(error);
	            });
	        });
	    } else {
	        return this;
	    }
	};
	
	Q.noConflict = function() {
	    throw new Error("Q.noConflict only works when Q is used as a global");
	};
	
	// All code before this point will be filtered from stack traces.
	var qEndingLine = captureLine();
	
	return Q;
	
	});
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(45), __webpack_require__(46).setImmediate))

/***/ },
/* 45 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(45).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;
	
	// DOM APIs, for completeness
	
	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };
	
	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};
	
	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};
	
	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};
	
	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);
	
	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};
	
	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);
	
	  immediateIds[id] = true;
	
	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });
	
	  return id;
	};
	
	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(46).setImmediate, __webpack_require__(46).clearImmediate))

/***/ },
/* 47 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    methods: {
	        /**
	         * Resets variables when user/seller disconnects
	         */
	
	        onEject: function onEject() {
	            if (!this.userConnected) {
	                console.info('-> Eject seller');
	                this.currentSeller = {};
	                this.sellerConnected = false;
	                this.sellerPasswordInput = '';
	                this.sellerAuth = false;
	
	                return;
	            }
	
	            console.info('-> Eject user');
	            this.currentUser = {};
	            this.userConnected = false;
	            this.basket = [];
	            this.basketPromotions = [];
	            this.totalCost = 0;
	            this.totalReload = 0;
	            this.detailedReloads = [];
	            this.reloadMethod = 'card';
	            this.tab = null;
	        }
	    }
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _promotions = __webpack_require__(49);
	
	var _promotions2 = _interopRequireDefault(_promotions);
	
	var _promotionsEvents = __webpack_require__(50);
	
	var _promotionsEvents2 = _interopRequireDefault(_promotionsEvents);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = { promotions: _promotions2.default, promotionsEvents: _promotionsEvents2.default };

/***/ },
/* 49 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Sanitizes an articles array to keep only what's need for the algorithm
	 * @param  {Array} articles Array of articles loaded by AJAX
	 * @return {Array} Array sanitized
	 */
	function sanitizeArticles(articles) {
	    return articles.slice().map(function (article) {
	        return {
	            id: article.id
	        };
	    });
	}
	
	/**
	 * Sanitizes a promotions array to keep only what's need for the algorithm
	 * @param  {Array} promotions Array of promotions loaded by AJAX
	 * @return {Array} Array sanitized
	 */
	function sanitizePromotions(promotions) {
	    return promotions.slice().map(function (promotion) {
	        promotion.articles = promotion.articles || [];
	        promotion.sets = promotion.sets || [];
	
	        return {
	            id: promotion.id,
	            articles: promotion.articles.map(function (article) {
	                return article.id;
	            }),
	            sets: promotion.sets.map(function (set) {
	                return set.id;
	            })
	        };
	    });
	}
	
	/**
	 * Checks if the basket contains article
	 * @param  {Array}  basketCopy Basket
	 * @param  {String} article    Article id
	 * @return {Number} Index of article in basketCopy
	 */
	function containsArticle(basketCopy, article) {
	    return basketCopy.indexOf(article);
	}
	
	/**
	 * Returns true if article has set; false if article has not the set
	 * @param  {Vue}    vm The view model
	 * @param  {String} articleId Article id
	 * @param  {String} setId     Set id
	 * @return {Boolean} True if article is in the given set
	 */
	function articleIsFromSet(vm, articleId, setId) {
	    var found = false;
	
	    var fullSet = vm.sets.filterObjId(setId);
	
	    fullSet.articles.forEach(function (article) {
	        if (article.id === articleId) {
	            found = true;
	        }
	    });
	
	    return found;
	}
	
	/**
	 * Check if an article is in the basket with the specified set
	 * @param  {Vue}    vm The view model
	 * @param  {Array}  basketCopy Basket
	 * @param  {String} set        Set id
	 * @return {Number} Index of article in basketCopy
	 */
	function containsArticleFromSet(vm, basketCopy, set) {
	    for (var i = 0; i < basketCopy.length; i++) {
	        var article = basketCopy[i];
	
	        if (articleIsFromSet(vm, article, set)) {
	            return i;
	        }
	    }
	
	    return -1;
	}
	
	var articles_ = undefined;
	var promotions_ = undefined;
	
	var silent = false;
	
	exports.default = {
	    data: {
	        promotionsLoaded: false,
	        setsLoaded: false
	    },
	
	    methods: {
	        /**
	         * Silents one basket modification. Avoid infinite watchers loop
	         */
	
	        silentBasketOnce: function silentBasketOnce() {
	            silent = true;
	        },
	
	        /**
	         * Checks for promotions in the basket
	         */
	        checkForPromotions: function checkForPromotions() {
	            if (!this.promotionsLoaded || !this.articlesLoaded) {
	                return;
	            }
	
	            var basket = this.basket;
	
	            articles_ = sanitizeArticles(this.articles);
	            promotions_ = sanitizePromotions(this.promotions);
	
	            var basketPromotions = this.basketPromotions;
	            var promotionsThatDidntMatch = 0;
	            var i = 0;
	
	            // Check the first promotion and continues while they all stop matching (promotionsThatDidntMatch)
	            do {
	                var promotion = promotions_[i];
	                var basketCopy = basket.slice();
	                var basketPromo = [];
	                // Count what needs to be found
	                var still = promotion.articles.length + promotion.sets.length;
	
	                console.log(promotion);
	
	                console.log('Promotion', promotion.id, 'containing', still, 'items');
	
	                // First check if basket contains articles (more precise)
	                for (var j = 0; j < promotion.articles.length; j++) {
	                    var articlePromotion = promotion.articles[j];
	                    var position = containsArticle(basketCopy, articlePromotion);
	
	                    if (position > -1) {
	                        console.log(articlePromotion + ' is present');
	                        // Remove from the temporary basket
	                        basketCopy.splice(position, 1);
	                        // And add to the temporary basket for this promotion
	                        basketPromo.push(articlePromotion);
	                        --still;
	                    }
	                }
	
	                // Then check if basket contains article that matches set
	                for (var j = 0; j < promotion.sets.length; j++) {
	                    var setPromotion = promotion.sets[j];
	                    var position = containsArticleFromSet(this, basketCopy, setPromotion);
	
	                    if (position > -1) {
	                        console.log(setPromotion + ' has the good set');
	                        // Get back the article id
	                        var articlePromotion = basketCopy[position];
	                        // Remove from the temporary basket
	                        basketCopy.splice(position, 1);
	                        // And add to the temporary basket for this promotion
	                        basketPromo.push(articlePromotion);
	                        --still;
	                    }
	                }
	
	                // still = 0 => everything has been found
	                if (still === 0) {
	                    console.log('Promotion matches');
	                    basket = basketCopy;
	                    basketPromotions.push({
	                        id: promotion.id,
	                        contents: basketPromo
	                    });
	                } else {
	                    console.log('Promotion didnt match');
	                    promotionsThatDidntMatch++;
	                }
	
	                // Increases or resets i
	                i = (i + 1) % promotions_.length;
	            } while (promotionsThatDidntMatch < promotions_.length);
	
	            this.basket = basket;
	            this.basketPromotions = basketPromotions;
	        }
	    }
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _vue = __webpack_require__(32);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _utils = __webpack_require__(21);
	
	var _utils2 = _interopRequireDefault(_utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* global document, MaterialMenu */
	
	exports.default = {
	    methods: {
	        /**
	         * Revert promotions to article. Useful when removing an item possibly in a promotion
	         */
	
	        revertPromotions: function revertPromotions() {
	            var newBasket = this.basket.slice();
	            this.basketPromotions.forEach(function (promotion) {
	                newBasket = newBasket.concat(promotion.contents);
	            });
	
	            this.basket = newBasket;
	            this.basketPromotions = [];
	        },
	
	        /**
	         * Triggered when a dropdown is called to see promotion's content
	         * @param  {MouseEvent} e The click event
	         */
	        onPromotionExpand: function onPromotionExpand(e) {
	            console.info('Promotion expanding');
	            var $elem = e.target;
	            e.preventDefault();
	            var $menu = $elem.nextElementSibling;
	            var $menuContainer = undefined;
	
	            if (!$menu.classList.contains('mdl-menu__container')) {
	                // Init the mdl menu
	                var menu = new MaterialMenu($menu);
	                $menu.MaterialMenu = menu;
	                $menuContainer = $menu.parentElement;
	                // Fix margin left not applied
	                $menuContainer.style.marginLeft = $elem.offsetLeft - $menuContainer.offsetLeft + 'px';
	            } else {
	                $menu = $menu.children[1];
	                $menuContainer = $menu.parentElement;
	            }
	
	            $menu.parentElement.style.display = 'block';
	
	            // If there is a click elsewhere, just hide this menu
	            document.once('click', function () {
	                (0, _utils2.default)('.mdl-menu__container.is-visible > ul').forEach(function (menu) {
	                    return menu.MaterialMenu.hide();
	                });
	            });
	
	            // MaterialMenu activated to $menu is now the container
	            $menu.MaterialMenu.toggle();
	
	            setTimeout(function () {
	                if (!$menu.parentElement.classList.contains('is-visible')) {
	                    $menu.parentElement.style.display = 'none';
	                }
	            }, 300);
	        }
	    }
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _askReload = __webpack_require__(52);
	
	var _askReload2 = _interopRequireDefault(_askReload);
	
	var _reloadMenu = __webpack_require__(53);
	
	var _reloadMenu2 = _interopRequireDefault(_reloadMenu);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = { askReload: _askReload2.default, reloadMenu: _reloadMenu2.default };

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _utils = __webpack_require__(21);
	
	var _utils2 = _interopRequireDefault(_utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	    data: {
	        reloadCreditOpened: false,
	        waitingForValidation: false,
	        reloadMethod: 'card',
	        creditToReload: 0,
	        totalReload: 0,
	        detailedReloads: []
	    },
	
	    methods: {
	        /**
	         * Open the reload modal
	         */
	
	        askReload: function askReload() {
	            this.reloadCreditOpened = true;
	        },
	
	        /**
	         * Closes the reload modal
	         */
	        closeReloadCredit: function closeReloadCredit() {
	            this.reloadCreditOpened = false;
	
	            if (this.waitingForValidation) {
	                // Fake the event
	                this.invalidPayment({
	                    target: (0, _utils2.default)('.buttonsGrid').children[0]
	                });
	            }
	
	            this.waitingForValidation = false;
	        },
	
	        /**
	         * Selects the payment method
	         * @param  {String} slug The method name
	         */
	        selectReloadMethod: function selectReloadMethod(slug) {
	            this.reloadMethod = slug;
	        },
	
	        /**
	         * Clears the reload amount
	         */
	        onCreditToReloadClearInput: function onCreditToReloadClearInput() {
	            this.creditToReload = 0;
	        },
	
	        /**
	         * Adds a number to the reload amount (credit card terminal like)
	         * @param  {MouseEvent} e The click event
	         */
	        onCreditToReloadInput: function onCreditToReloadInput(e) {
	            var value = parseInt(e.target.parents('.mdl-cell').textContent.trim(), 10);
	            var creditToReload = this.creditToReload;
	
	            creditToReload = creditToReload * 10 + value * 0.01;
	            creditToReload = Math.min(100, creditToReload);
	            creditToReload = Math.max(0, creditToReload);
	
	            this.creditToReload = creditToReload;
	        },
	
	        /**
	         * Validates the amount
	         * @param  {MouseEvent} e The click event
	         */
	        onCreditToReloadValidateInput: function onCreditToReloadValidateInput(e) {
	            var grid = e.target.parents('.mdl-grid');
	            this.waitingForValidation = true;
	            grid.style.height = 0;
	            grid.nextElementSibling.style.height = '122px';
	        },
	
	        /**
	         * Clears the payment
	         * @param  {MouseEvent} e The click event
	         */
	        invalidPayment: function invalidPayment(e) {
	            var grid = e.target.parents('.mdl-grid');
	            grid.style.height = 0;
	            grid.previousElementSibling.style.height = '242px';
	            this.waitingForValidation = false;
	        },
	
	        /**
	         * Validates the reload
	         * @param  {MouseEvent} e The click event
	         */
	        validateReload: function validateReload(e) {
	            var _this = this;
	
	            var grid = e.target.parents('.mdl-grid');
	            grid.style.height = 0;
	            grid.previousElementSibling.style.height = '242px';
	
	            this.waitingForValidation = false;
	            this.totalReload = this.totalReload + this.creditToReload * 100;
	
	            this.detailedReloads.push({
	                with: this.paymentMethods.filter(function (payment) {
	                    return payment.slug === _this.reloadMethod;
	                })[0].text,
	                amount: this.creditToReload * 100
	            });
	
	            setTimeout(function () {
	                (0, _utils2.default)('.userCredit').classList.add('showBadge');
	            }, 300);
	
	            this.creditToReload = 0;
	            this.reloadCreditOpened = false;
	        }
	    }
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _utils = __webpack_require__(21);
	
	var _utils2 = _interopRequireDefault(_utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	    methods: {
	        /**
	         * Shows/Hides the reload menu
	         * @param  {MouseEvent} e The click event
	         */
	
	        toggleReloadMenu: function toggleReloadMenu(e) {
	            var $elem = e.target;
	            e.preventDefault();
	            var $menu = $elem.children[0];
	            var $menuContainer = undefined;
	
	            if (!$menu.classList.contains('mdl-menu__container')) {
	                // Init the mdl menu
	                var menu = new MaterialMenu($menu);
	                $menu.MaterialMenu = menu;
	                $menuContainer = $menu.parentElement;
	                // Fix margin left not applied
	                // $menuContainer.style.marginLeft = ($elem.offsetLeft - $menuContainer.offsetLeft) + 'px';
	            } else {
	                    $menu = $menu.children[1];
	                    $menuContainer = $menu.parentElement;
	                }
	
	            // If there is a click elsewhere, just hide this menu
	            document.once('click', function () {
	                (0, _utils2.default)('.mdl-menu__container.is-visible > ul').forEach(function (menu) {
	                    return menu.MaterialMenu.hide();
	                });
	            });
	
	            $menu.MaterialMenu.toggle();
	        },
	
	        /**
	         * Cancels a reload
	         * @param  {Number} index The reloads position in the menu
	         */
	        removeReloadBasket: function removeReloadBasket(index) {
	            var totalReload = this.totalReload;
	            // Remove the detailed reload and get the amount
	            // Then update totalReload
	            this.totalReload = totalReload - this.detailedReloads.splice(index, 1)[0].amount;
	        }
	    }
	}; /* global document, MaterialMenu */

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _doubleValidation = __webpack_require__(55);
	
	var _doubleValidation2 = _interopRequireDefault(_doubleValidation);
	
	var _sendBasket = __webpack_require__(56);
	
	var _sendBasket2 = _interopRequireDefault(_sendBasket);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = { doubleValidation: _doubleValidation2.default, sendBasket: _sendBasket2.default };

/***/ },
/* 55 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    data: {
	        inputIsForDoubleValidation: false
	    },
	
	    methods: {
	        /**
	         * Revalidates the basket.
	         * @param  {String} cardNumber The buyer id
	         */
	
	        revalidate: function revalidate(cardNumber) {
	            var revalidate = true;
	
	            var mol = this.currentUser.meansOfLogin.filter(function (mol) {
	                return mol.type === 'etuId';
	            })[0];
	
	            if (cardNumber === mol || revalidate) {
	                this.inputIsForDoubleValidation = false;
	                this.sendBasket(true);
	            }
	        }
	    }
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _config = __webpack_require__(42);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _OfflineRequest = __webpack_require__(41);
	
	var _OfflineRequest2 = _interopRequireDefault(_OfflineRequest);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	    data: {
	        loadingBasket: false,
	        notEnoughCredit: false,
	        lastCredit: '',
	        lastReload: '',
	        lastUser: '',
	        lastAmount: ''
	    },
	
	    methods: {
	        /**
	         * Sends the basket to the API
	         * @param {Boolean} revalidated Sends basket after correct revalidation
	         */
	
	        sendBasket: function sendBasket(revalidated) {
	            var _this = this;
	
	            var basketToSend = [];
	
	            if (this.loadingBasket) {
	                return;
	            }
	
	            if (this.doubleValidation) {
	                // revalidated may be a MouseEvent
	                if (revalidated !== true) {
	                    console.info('Entering double validation mode');
	                    this.inputIsForDoubleValidation = true;
	
	                    return;
	                }
	            }
	
	            this.loadingBasket = true;
	
	            if (this.currentUser.credit + this.totalReload - this.totalCost < 0) {
	                setTimeout(function () {
	                    _this.loadingBasket = false;
	                    _this.notEnoughCredit = true;
	
	                    setTimeout(function () {
	                        _this.notEnoughCredit = false;
	                    }, 1000);
	                }, 1000);
	
	                return;
	            }
	
	            this.basket.forEach(function (articleId) {
	                var article = _this.articles.filterObjId(articleId);
	                basketToSend.push({
	                    buyerId: _this.currentUser.id,
	                    fundationId: article.fundationId,
	                    promotionId: null,
	                    sellerId: _this.currentSeller.id,
	                    articles: [article.id],
	                    cost: article.price.amount,
	                    type: 'purchase'
	                });
	            });
	
	            this.basketPromotions.forEach(function (basketPromo) {
	                var promoId = basketPromo.id;
	                var articlesInside = basketPromo.contents;
	                var promo = _this.promotions.filterObjId(promoId);
	
	                basketToSend.push({
	                    buyerId: _this.currentUser.id,
	                    fundationId: promo.fundationId,
	                    sellerId: _this.currentSeller.id,
	                    promotionId: promo.id,
	                    articles: articlesInside,
	                    cost: promo.price.amount,
	                    type: 'purchase'
	                });
	            });
	
	            this.detailedReloads.forEach(function (reload) {
	                basketToSend.push({
	                    credit: reload.amount,
	                    trace: reload.with,
	                    buyerId: _this.currentUser.id,
	                    sellerId: _this.currentSeller.id,
	                    type: 'reload'
	                });
	            });
	
	            console.info('Basket sending', basketToSend);
	            _OfflineRequest2.default.post(_config2.default.baseURL + '/services/basket', basketToSend).then(function (response) {
	                _this.loadingBasket = false;
	
	                if (response.hasOwnProperty('newCredit')) {
	                    _this.lastCredit = _this.totalCost;
	                    _this.lastReload = _this.totalReload;
	                    _this.lastAmount = _this.currentUser.credit - _this.totalCost + _this.totalReload;
	                    _this.lastUser = _this.currentUser.fullname;
	
	                    _this.onEject();
	                } else {
	                    var error = 'Impossible d\'enregistrer les achats ou de déduire le crédit de l\'utilisateur.<br>';
	                    error += 'Si un rechargement par carte a été effectué, le débit a eu lieu.<br>';
	                    error += 'Vous pouvez réessayer l\'achat ou concacter l\'équipe gérant Buckutt.';
	                    _this.throwError(error);
	                }
	            });
	        }
	    }
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _vue = __webpack_require__(32);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _utils = __webpack_require__(21);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* global componentHandler, location, MaterialLayoutTab */
	
	_vue2.default.directive('inittabs', {
	    /**
	     * Automatically sets the first tab and material-upgrade the elements
	     */
	
	    bind: function bind() {
	        this.vm.tab = 'tab-0';
	
	        // Re enable tabs. See https://github.com/google/material-design-lite/issues/1165
	        var $tabs = (0, _utils.$$)('.mdl-layout__tab');
	        var $panels = (0, _utils.$$)('.mdl-tabs__panel');
	        var $layout = (0, _utils.$)('.mdl-js-layout');
	
	        $tabs.forEach(function (tab, i) {
	            try {
	                new MaterialLayoutTab($tabs[i], $tabs, $panels, $layout.MaterialLayout);
	            } catch (e) {
	                location.reload();
	            }
	            componentHandler.upgradeElement($tabs[i].children[0]);
	        });
	    }
	});

/***/ },
/* 58 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = {
	    data: {
	        error: false,
	        errorMessage: ''
	    },
	
	    methods: {
	        /**
	         * Shows the error modal box
	         * @param  {String} message The error message
	         */
	
	        throwError: function throwError(message) {
	            this.error = true;
	            this.errorMessage = message;
	        },
	
	        /**
	         * Closes the error modal box
	         */
	        closeError: function closeError() {
	            this.error = false;
	        }
	    }
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _vue = __webpack_require__(32);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _utils = __webpack_require__(21);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var articlesParsed = false;
	
	exports.default = {
	    data: {
	        tab: 'none',
	        categories: []
	    },
	
	    methods: {
	        /**
	         * Change the tab
	         * @param  {MouseEvent} e The click event
	         */
	
	        onTabClick: function onTabClick(e) {
	            var target = e.target.parentElement.getAttribute('data-target');
	            console.info('New tab', target);
	            this.tab = target;
	        }
	    },
	
	    controller: function controller(vm) {
	        vm.$watch('tab', function (newTab) {
	            console.log('tab change');
	            _vue2.default.nextTick(function () {
	                (0, _utils.$$)('.mdl-tabs__panel').forEach(function ($tab) {
	                    $tab.style.display = 'none';
	                });
	
	                var $newTab = (0, _utils.$)('#' + newTab);
	
	                if ($newTab) {
	                    $newTab.style.display = 'flex';
	                }
	            });
	        });
	
	        vm.$watch('articles', function () {
	            if (articlesParsed || this.articles.length === 0) {
	                return;
	            }
	            console.info('Creating categories based on articles');
	            articlesParsed = true;
	
	            var categories = this.articles.map(function (a) {
	                return a.category.name;
	            }).uniq().sort(function (a, b) {
	                return 1 - a.localeCompare(b);
	            }); // Reverse sort
	
	            this.categories = categories;
	        });
	    }
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _config = __webpack_require__(42);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _utils = __webpack_require__(21);
	
	var _utils2 = _interopRequireDefault(_utils);
	
	var _OfflineRequest = __webpack_require__(41);
	
	var _OfflineRequest2 = _interopRequireDefault(_OfflineRequest);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	    data: {
	        articlesLoaded: false,
	        setsLoaded: false,
	        paymentMethodsLoaded: false,
	        promotionsLoaded: false,
	        deviceLoaded: false,
	        pointId: '',
	        deviceId: '',
	        doubleValidation: false,
	        offlineSupport: false
	    },
	
	    methods: {
	        /**
	         * Loads JSON data
	         */
	
	        loadData: function loadData() {
	            var _this = this;
	
	            this.startedLoading = true;
	
	            // Get the device id and point id from the headers
	
	            var notRemoved = {
	                field: 'isRemoved',
	                eq: false
	            };
	
	            var articlesJoin = {
	                category: true,
	                points: true,
	                prices: {
	                    fundation: true,
	                    group: true,
	                    period: true,
	                    promotion: true
	                }
	            };
	
	            var promotionsJoin = {
	                price: true,
	                articles: true,
	                sets: {
	                    articles: true
	                }
	            };
	
	            var setsJoin = {
	                promotion: true,
	                articles: true
	            };
	
	            _OfflineRequest2.default.get(_config2.default.baseURL + '/articles/search?q=' + (0, _utils2.default)(notRemoved) + '&embed=' + (0, _utils2.default)(articlesJoin)).then(function (response) {
	                if (response.status === 401) {
	                    throw new Error('Pas de droits vendeurs');
	                }
	
	                _this.deviceId = _OfflineRequest2.default.deviceId;
	                _this.pointId = _OfflineRequest2.default.pointId;
	
	                _this.articlesLoaded = true;
	                _this.articles = response;
	                _this.filterBestPrice();
	                _this.filterPoint();
	
	                return _OfflineRequest2.default.get(_config2.default.baseURL + '/promotions/search?q=' + (0, _utils2.default)(notRemoved) + '&embed=' + (0, _utils2.default)(promotionsJoin));
	            }).then(function (response) {
	                _this.promotionsLoaded = true;
	                _this.promotions = response;
	
	                return _OfflineRequest2.default.get(_config2.default.baseURL + '/sets/search?q=' + (0, _utils2.default)(notRemoved) + '&embed=' + (0, _utils2.default)(setsJoin));
	            }).then(function (response) {
	                _this.setsLoaded = true;
	                _this.sets = response;
	
	                return _OfflineRequest2.default.get(_config2.default.baseURL + '/meansofpayment/search?q=' + (0, _utils2.default)(notRemoved));
	            }).then(function (response) {
	                _this.paymentMethodsLoaded = true;
	                _this.paymentMethods = response;
	
	                return _OfflineRequest2.default.get(_config2.default.baseURL + '/devices/search?q=' + (0, _utils2.default)(notRemoved));
	            }).then(function (response) {
	                _this.deviceLoaded = true;
	                _this.device = response.filterObjId(_this.deviceId);
	            }).then(function () {
	                _this.startedLoading = false;
	            }).catch(function (err) {
	                _this.throwError(err.message);
	                _this.onEject();
	                setTimeout(function () {
	                    _this.startedLoading = false;
	                }, 1000);
	            });
	        }
	    }
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map