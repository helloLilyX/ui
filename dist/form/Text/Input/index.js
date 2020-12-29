"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _ = require("..");

var _Diff = _interopRequireDefault(require("../Diff"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Equivalent of `<input type='text'>`
 * 
 * Accepts all
 * [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text)
 * props.
 */
var Input = /*#__PURE__*/_react.default.forwardRef(function (props, ref) {
  var _useContext = (0, _react.useContext)(_.Context),
      bind = _useContext.bind;

  var value = bind.value || props.defaultValue || props.value;
  var readOnly = bind.readOnly || props.readOnly;
  var required = bind.required || props.required;

  if (bind.diff) {
    return /*#__PURE__*/_react.default.createElement(_Diff.default, {
      value: typeof value === 'string' ? value : undefined,
      prevValue: typeof bind.initialValue === 'string' ? bind.initialValue : undefined
    });
  } // if (readOnly) {
  //     return <Print value={typeof (value) === 'string' ? value : ''} />
  // }


  var classNames = "form-control ".concat(props.className ? props.className : '', " ").concat(bind.error && 'is-invalid', " ").concat(bind.success && 'is-valid');

  var inputProps = _objectSpread(_objectSpread({
    ref: ref
  }, props), {}, {
    type: "text",
    id: bind.id,
    name: bind.name || props.name,
    defaultValue: value,
    className: classNames,
    'aria-describedby': "".concat(bind.id, "-help"),
    onChange: function onChange(e) {
      bind.value = e.currentTarget.value;
      if (props.onChange) props.onChange(e);
    },
    readOnly: readOnly,
    "aria-disabled": readOnly,
    "aria-required": required,
    "aria-invalid": bind.error ? true : false
  }); // Assign a value to the input if it is controlled


  if (bind.controlled) {
    inputProps.value = value;
  }

  return /*#__PURE__*/_react.default.createElement("input", inputProps);
});

var _default = Input;
exports.default = _default;