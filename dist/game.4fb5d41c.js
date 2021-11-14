// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"bird.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBirdRect = exports.updateBird = exports.setupBird = void 0;
var BIRD_SPEED_UP = 0.25;
var BIRD_SPEED_DOWN = 0.5;
var JUMP_DURATION = 150;
var bird = document.querySelector("[data-bird]");
var timeSinceLastJump = Number.POSITIVE_INFINITY;

function setupBird() {
  setTop(window.innerHeight / 2);
  document.removeEventListener("keydown", handleJump);
  document.addEventListener("keydown", handleJump);
}

exports.setupBird = setupBird;

function updateBird(delta) {
  var top = getTop();

  if (timeSinceLastJump < JUMP_DURATION) {
    setTop(top - BIRD_SPEED_UP * delta);
  } else {
    setTop(top + BIRD_SPEED_DOWN * delta);
  }

  timeSinceLastJump += delta;
}

exports.updateBird = updateBird;

function getBirdRect() {
  return bird.getBoundingClientRect();
}

exports.getBirdRect = getBirdRect;

function setTop(top) {
  bird.style.setProperty("--bird-top", String(top));
}

function getTop() {
  return parseFloat(getComputedStyle(bird).getPropertyValue("--bird-top"));
}

function handleJump(e) {
  if (e.code !== "Space") return;
  timeSinceLastJump = 0;
}
},{}],"pipe.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPipeRects = exports.updatePipes = exports.getPassedPipesCount = exports.setupPipes = void 0;
var HOLE_HEIGHT = 170;
var PIPE_INTERVAL = 1750;
var PIPE_SPEED = 0.25;
var PIPE_WIDTH = 60;
var pipes = [];
var timeSinceLastPipe = 0;
var passesPipesCount = 0;

function setupPipes() {
  document.documentElement.style.setProperty("--pipe-width", String(PIPE_WIDTH));
  document.documentElement.style.setProperty("--hole-height", String(HOLE_HEIGHT));
  pipes.forEach(function (pipe) {
    return pipe.remove();
  });
  timeSinceLastPipe = PIPE_INTERVAL;
  passesPipesCount = 0;
}

exports.setupPipes = setupPipes;

function getPassedPipesCount() {
  return passesPipesCount;
}

exports.getPassedPipesCount = getPassedPipesCount;

function updatePipes(delta) {
  timeSinceLastPipe += delta;

  if (timeSinceLastPipe > PIPE_INTERVAL) {
    timeSinceLastPipe -= PIPE_INTERVAL;
    createPipe();
  }

  pipes.forEach(function (pipe) {
    if (pipe.left + PIPE_WIDTH < 0) {
      passesPipesCount++;
      pipe.remove();
      return;
    }

    pipe.left = pipe.left - delta * PIPE_SPEED;
  });
}

exports.updatePipes = updatePipes;

function getPipeRects() {
  return pipes.flatMap(function (pipe) {
    return pipe.rects();
  });
}

exports.getPipeRects = getPipeRects;

function createPipe() {
  var pipeElement = document.createElement("div");
  var topSegment = createPipeSegment("top");
  var bottomSegment = createPipeSegment("bottom");
  pipeElement.append(topSegment);
  pipeElement.append(bottomSegment);
  pipeElement.classList.add("pipe");
  pipeElement.style.setProperty("--hole-top", randomNumberBetween(HOLE_HEIGHT * 1.5, window.innerHeight - HOLE_HEIGHT * 0.5));
  var pipe = {
    get left() {
      return parseFloat(getComputedStyle(pipeElement).getPropertyValue("--pipe-left"));
    },

    set left(value) {
      pipeElement.style.setProperty("--pipe-left", String(value));
    },

    remove: function remove() {
      pipes = pipes.filter(function (p) {
        return p !== pipe;
      });
      pipeElement.remove();
    },
    rects: function rects() {
      return [topSegment.getBoundingClientRect(), bottomSegment.getBoundingClientRect()];
    }
  };
  pipe.left = window.innerWidth;
  document.body.append(pipeElement);
  pipes.push(pipe);
}

function createPipeSegment(position) {
  var segment = document.createElement("div");
  segment.classList.add("segment", position);
  return segment;
}

function randomNumberBetween(min, max) {
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}
},{}],"game.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var bird_1 = require("./bird");

var pipe_1 = require("./pipe");

document.addEventListener("keypress", handleStart, {
  once: true
});
var title = document.querySelector("[data-title]");
var subTitle = document.querySelector("[data-subtitle]");
var lastTime = null;

function handleStart() {
  lastTime = null;
  title.classList.add("hidden");
  (0, bird_1.setupBird)();
  (0, pipe_1.setupPipes)();
  window.requestAnimationFrame(updateLoop);
}

function updateLoop(time) {
  if (lastTime === null) {
    lastTime = time;
    window.requestAnimationFrame(updateLoop);
    return;
  }

  var delta = time - lastTime;

  if (checkLose()) {
    handleLose();
    return;
  }

  (0, bird_1.updateBird)(delta);
  (0, pipe_1.updatePipes)(delta);
  lastTime = time;
  window.requestAnimationFrame(updateLoop);
}

function checkLose() {
  var birdRect = (0, bird_1.getBirdRect)();
  var isInsidePipe = (0, pipe_1.getPipeRects)().some(function (rect) {
    return isColliding(birdRect, rect);
  });
  var isOutsideWorld = birdRect.top < 0 || birdRect.bottom > window.innerHeight;
  return isInsidePipe || isOutsideWorld;
}

function handleLose() {
  setTimeout(function () {
    var rects = (0, pipe_1.getPipeRects)();
    console.log({
      rects: rects
    });
    title.classList.remove("hidden");
    subTitle.classList.remove("hidden");
    subTitle.textContent = (0, pipe_1.getPassedPipesCount)() + " PIPES PASSED !!";
    document.addEventListener("keypress", handleStart, {
      once: true
    });
  }, 200);
}

function isColliding(rectOne, rectTwo) {
  return rectOne.left < rectTwo.right && rectOne.top < rectTwo.bottom && rectOne.right > rectTwo.left && rectOne.bottom > rectTwo.top;
}
},{"./bird":"bird.ts","./pipe":"pipe.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "46051" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","game.ts"], null)
//# sourceMappingURL=/game.4fb5d41c.js.map