"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Мне лень создавать несколько js файлов и париться со сброщиком
;

(function () {
  var toggleContainer = document.querySelector(".main-navigation");
  var toggler = document.querySelector(".toggler");

  function toggleMenu() {
    toggleContainer.classList.toggle("close");
  }

  ;
  toggleMenu(); // закрывает выпадающее меню при загрузки JS файла (доступность контента при отключенном js);

  toggler.addEventListener("click", toggleMenu);
})();

;

(function () {
  var CreateHorizontalSlider =
  /*#__PURE__*/
  function () {
    function CreateHorizontalSlider(body, lever) {
      _classCallCheck(this, CreateHorizontalSlider);

      this._body = body;
      this._lever = lever;
      this._onMouseDown = this._onMouseDown.bind(this);
      this._onTouchStart = this._onTouchStart.bind(this);
      this._drag = this._drag.bind(this);
      this._drop = this._drop.bind(this);

      this._preperSlider();

      this._lever.addEventListener("mousedown", this._onMouseDown);

      this._lever.addEventListener("touchstart", this._onTouchStart);

      this._lever.addEventListener("dragstart", function (event) {
        event.preventDefault();
      });

      this.listeners = new Set();
    }

    _createClass(CreateHorizontalSlider, [{
      key: "_preperSlider",
      value: function _preperSlider() {
        this._lever.style.zIndex = "1000";
        this._lever.style.transform = "none";
        var leverCenterYPosition = this._body.offsetHeight / 2 - this._lever.offsetHeight / 2; // ставит рычажок на цент слайдера

        var leverCenterXPosition = this._body.offsetWidth / 2 - this._lever.offsetWidth / 2;
        this._lever.style.top = leverCenterYPosition + "px";
        this._lever.style.left = leverCenterXPosition + "px";
      }
    }, {
      key: "_onMouseDown",
      value: function _onMouseDown(event) {
        this._preperDrag(event);

        document.addEventListener("mousemove", this._drag);
        document.addEventListener("mouseup", this._drop);
      }
    }, {
      key: "_onTouchStart",
      value: function _onTouchStart(event) {
        this._preperDrag(event);

        document.addEventListener("touchmove", this._drag);
        document.addEventListener("touchend", this._drop);
      }
    }, {
      key: "_preperDrag",
      value: function _preperDrag(event) {
        var cursorCoord = event.clientX || event.targetTouches[0].clientX;
        this._shiftX = cursorCoord - this._lever.getBoundingClientRect().left; // кооринаты курсора относительно рычажка

        var leverBodyCoord = cursorCoord - this._shiftX - this._body.getBoundingClientRect().left;

        this._moveAt(leverBodyCoord);
      }
    }, {
      key: "_drag",
      value: function _drag(event) {
        var cursorCoord = event.clientX || event.targetTouches[0].clientX;

        var leverBodyCoord = cursorCoord - this._shiftX - this._body.getBoundingClientRect().left;

        this._moveAt(leverBodyCoord);
      }
    }, {
      key: "_drop",
      value: function _drop() {
        document.removeEventListener("mousemove", this._drag);
        document.removeEventListener("mouseup", this._drop);
        document.removeEventListener("touchmove", this._drag);
        document.removeEventListener("touchend", this._drop);
      }
    }, {
      key: "_moveAt",
      value: function _moveAt(coord) {
        if (coord < 0) {
          coord = 0;
        }

        ;
        var workAreaWidth = this._body.offsetWidth - this._lever.offsetWidth;

        if (coord > workAreaWidth) {
          coord = workAreaWidth;
        }

        ;
        this._lever.style.left = coord + "px";
        var shiftProcent = +(coord / workAreaWidth * 100).toFixed(3); // добавь возможность не слушать нули и сотню
        // реализуй "тротлинг"

        this._listenersIteraction(shiftProcent);
      }
    }, {
      key: "_listenersIteraction",
      value: function _listenersIteraction(procent) {
        this.listeners.forEach(function (listener) {
          return listener(procent);
        });
      }
    }, {
      key: "addShiftProcentListener",
      value: function addShiftProcentListener(listener) {
        this.listeners.add(listener);
      }
    }, {
      key: "removeShiftProcentListener",
      value: function removeShiftProcentListener(listener) {
        this.listeners.delete(listener);
      }
    }]);

    return CreateHorizontalSlider;
  }();

  window.CreateHorizontalSlider = CreateHorizontalSlider;
})();

;

(function () {
  var _window = window,
      CreateHorizontalSlider = _window.CreateHorizontalSlider;

  var ButtonsHorizontalSlider =
  /*#__PURE__*/
  function (_CreateHorizontalSlid) {
    _inherits(ButtonsHorizontalSlider, _CreateHorizontalSlid);

    function ButtonsHorizontalSlider(body, lever) {
      var _this;

      _classCallCheck(this, ButtonsHorizontalSlider);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ButtonsHorizontalSlider).call(this, body, lever));
      _this._step = 2;
      _this._timeout = 10;
      _this._onButtonRightMouseDown = _this._onButtonRightMouseDown.bind(_assertThisInitialized(_this));
      _this._onButtonLeftMouseDown = _this._onButtonLeftMouseDown.bind(_assertThisInitialized(_this));
      _this._onButtonMouseUp = _this._onButtonMouseUp.bind(_assertThisInitialized(_this));
      return _this;
    }

    _createClass(ButtonsHorizontalSlider, [{
      key: "_onButtonRightMouseDown",
      value: function _onButtonRightMouseDown() {
        document.addEventListener("mouseup", this._onButtonMouseUp);
        document.addEventListener("touchend", this._onButtonMouseUp);

        this._leverShiftRight();
      }
    }, {
      key: "_onButtonLeftMouseDown",
      value: function _onButtonLeftMouseDown() {
        document.addEventListener("mouseup", this._onButtonMouseUp);
        document.addEventListener("touchend", this._onButtonMouseUp);

        this._leverShiftLeft();
      }
    }, {
      key: "_onButtonMouseUp",
      value: function _onButtonMouseUp() {
        clearTimeout(this._timerId);
        document.removeEventListener("mouseup", this._onButtonMouseUp);
        document.removeEventListener("touchend", this._onButtonMouseUp);
      }
    }, {
      key: "_getLeverBodyCoord",
      value: function _getLeverBodyCoord() {
        var leverLeft = this._lever.offsetLeft; // при вычисленни по относительным координатам выдает погрешность в 1 пиксель хз почему

        return leverLeft;
      }
    }, {
      key: "_leverShiftRight",
      value: function _leverShiftRight() {
        var _this2 = this;

        var leverLeft = this._getLeverBodyCoord() + this._step;

        this._moveAt(leverLeft);

        this._timerId = setTimeout(function () {
          _this2._leverShiftRight();
        }, this._timeout);
      }
    }, {
      key: "_leverShiftLeft",
      value: function _leverShiftLeft() {
        var _this3 = this;

        var leverLeft = this._getLeverBodyCoord() - this._step;

        this._moveAt(leverLeft);

        this._timerId = setTimeout(function () {
          _this3._leverShiftLeft();
        }, this._timeout);
      }
    }, {
      key: "setButtonLeft",
      value: function setButtonLeft(buttonLeft) {
        this._buttonLeft = buttonLeft;

        this._buttonLeft.addEventListener("mousedown", this._onButtonLeftMouseDown);

        this._buttonLeft.addEventListener("touchstart", this._onButtonLeftMouseDown);
      }
    }, {
      key: "setButtonRight",
      value: function setButtonRight(buttonRight) {
        this._buttonRight = buttonRight;

        this._buttonRight.addEventListener("mousedown", this._onButtonRightMouseDown);

        this._buttonRight.addEventListener("touchstart", this._onButtonRightMouseDown);
      }
    }, {
      key: "timeout",
      get: function get() {
        return this._timeout;
      },
      set: function set(timeout) {
        if (isNaN(parseFloat(timeout)) && !isFinite(timeout)) {
          throw new Error("timeout Требуется числовое значение");
        }

        ;
        this._timeout = +timeout;
      }
    }, {
      key: "step",
      get: function get() {
        return this._step;
      },
      set: function set(step) {
        if (isNaN(parseFloat(step)) && !isFinite(step)) {
          throw new Error("step Требуется числовое значение");
        }

        ;
        this._step = +step;
      }
    }]);

    return ButtonsHorizontalSlider;
  }(CreateHorizontalSlider);

  ;
  window.ButtonsHorizontalSlider = ButtonsHorizontalSlider;
})();

;

(function () {
  var CutImage =
  /*#__PURE__*/
  function () {
    function CutImage() {
      _classCallCheck(this, CutImage);
    }

    _createClass(CutImage, [{
      key: "setImgLeft",
      value: function setImgLeft(cutWrapper, img) {
        this._cutWrapperLeft = cutWrapper;
        this._imgLeft = img;
      }
    }, {
      key: "setImgRight",
      value: function setImgRight(cutWrapper, img) {
        this._cutWrapperRight = cutWrapper;
        this._imgRight = img;
      }
    }, {
      key: "cutImgLeft",
      value: function cutImgLeft(procent) {
        this._imgLeft.style.left = procent + 50 + "%";
        this._cutWrapperLeft.style.left = -procent + "%";
      }
    }, {
      key: "cutImgRight",
      value: function cutImgRight(procent) {
        this._imgRight.style.left = procent - 50 + "%";
        this._cutWrapperRight.style.left = 100 - procent + "%";
      }
    }]);

    return CutImage;
  }();

  ;
  window.CutImage = CutImage;
})();

;

(function () {
  var viewportWidth = document.documentElement.clientWidth;
  var buttonBefore = document.querySelector(".slider__button--before");

  if (viewportWidth <= 768 && buttonBefore) {
    var _buttonBefore = document.querySelector(".slider__button--before");

    var buttonAfter = document.querySelector(".slider__button--after");
    var representation = document.querySelector(".representation");

    _buttonBefore.addEventListener("click", function () {
      representation.classList.remove("representation__show--after");
    });

    buttonAfter.addEventListener("click", function () {
      representation.classList.add("representation__show--after");
    });
  }
})();

;

(function () {
  var viewportWidth = document.documentElement.clientWidth;
  var body = document.querySelector(".silder__body");

  if (viewportWidth >= 768 && body) {
    var _window2 = window,
        ButtonsHorizontalSlider = _window2.ButtonsHorizontalSlider;
    var lever = document.querySelector(".slider__lever");
    var buttonBefore = document.querySelector(".slider__button--before");
    var buttonAfter = document.querySelector(".slider__button--after");
    var slider = new ButtonsHorizontalSlider(body, lever);
    slider.setButtonLeft(buttonBefore);
    slider.setButtonRight(buttonAfter);
    window.slider = slider;
  }
})();

;

(function () {
  var viewportWidth = document.documentElement.clientWidth;
  var cutImgBeforeWrapper = document.querySelector(".representation__cut--before");

  if (viewportWidth >= 768 && cutImgBeforeWrapper) {
    var _window3 = window,
        slider = _window3.slider,
        CutImage = _window3.CutImage;

    var _cutImgBeforeWrapper = document.querySelector(".representation__cut--before");

    var imgBefore = document.querySelector(".representation__image--before");
    var cutImgAfterWrapper = document.querySelector(".representation__cut--after");
    var imgAfter = document.querySelector(".representation__image--after");
    var cutImg = new CutImage();
    cutImg.setImgLeft(_cutImgBeforeWrapper, imgBefore);
    cutImg.setImgRight(cutImgAfterWrapper, imgAfter);
    slider.addShiftProcentListener(function (proc) {
      return cutImg.cutImgLeft(proc);
    });
    slider.addShiftProcentListener(function (proc) {
      return cutImg.cutImgRight(proc);
    });
  }
})();