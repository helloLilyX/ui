"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Input;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireWildcard(require("react"));

var _ = require("..");

var _dropdown = require("primereact/dropdown");

function Input(props) {
  var _useContext = (0, _react.useContext)(_.Context),
      bind = _useContext.bind;

  var value = bind.value || props.value;
  var readOnly = bind.readOnly || props.readOnly;
  var classNames = "form-control ".concat(props.className ? props.className : '', " ").concat(bind.error && 'is-invalid', " ").concat(bind.success && 'is-valid');
  return /*#__PURE__*/_react.default.createElement(_dropdown.Dropdown, (0, _extends2.default)({}, props, {
    inputId: bind.id || props.id,
    name: bind.name || props.name,
    className: classNames,
    value: value
  }));
}