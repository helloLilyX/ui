"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Modal = _interopRequireDefault(require("./Modal"));

var _Lookup = _interopRequireDefault(require("./Lookup"));

/**
 * Modal to change emulation of users within the application.
 *
 * Renders itself as a link to open the modal.
 *
 * Usage:
 * ```jsx
 *  <Emulate className="btn btn-danger"
 *      endpoint="/my-app/api/emulate"
 *      isEmulating={bool}
 *      username={string} />
 * ```
 */
var Emulate =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(Emulate, _React$Component);

  function Emulate(props) {
    var _this;

    (0, _classCallCheck2.default)(this, Emulate);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Emulate).call(this, props));
    _this.modal = _react.default.createRef();
    _this.onClick = _this.onClick.bind((0, _assertThisInitialized2.default)(_this));
    _this.onEmulate = _this.onEmulate.bind((0, _assertThisInitialized2.default)(_this));
    _this.onReset = _this.onReset.bind((0, _assertThisInitialized2.default)(_this));
    _this.state = {
      localStorage: JSON.parse(window.localStorage.getItem(props.localStorageKey)) || []
    };
    return _this;
  }
  /**
   * Display the modal on button click
   */


  (0, _createClass2.default)(Emulate, [{
    key: "onClick",
    value: function onClick() {
      this.modal.current.show();
    }
    /**
     * Reset emulation action.
     *
     * Submits an emulation DELETE request and refreshes the current page.
     */

  }, {
    key: "onReset",
    value: function onReset(e) {
      fetch(this.props.endpoint, {
        method: 'DELETE'
      }).then(function () {
        return location.reload();
      });
      e.preventDefault();
      return false;
    }
    /**
     * Submit emulation for an individual, by ID
     *
     * After success, this will reload the current page.
     *
     * @param {string} id OSU ID
     * @param {string} name Display name
     */

  }, {
    key: "emulate",
    value: function emulate(id, name) {
      this.addToHistory(id, name);
      fetch(this.props.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: id
        }),
        cache: 'no-cache',
        redirect: 'follow',
        credentials: 'same-origin'
      }).then(function () {
        return location.reload();
      });
    }
    /**
     * Add a user to our emulation history in local storage
     *
     * @param {string} id OSU ID
     * @param {string} name Display name
     */

  }, {
    key: "addToHistory",
    value: function addToHistory(id, name) {
      var localStorage = this.state.localStorage;
      var matches = localStorage.filter(function (item) {
        return item.id === id;
      }); // If they're already in recent history, do nothing

      if (matches.length) {
        return;
      } // Insert the new person into local storage


      localStorage.push({
        id: id,
        name: name
      }); // Only show the last N individuals emulated

      if (localStorage.length > 4) {
        localStorage.shift();
      }

      window.localStorage.setItem(this.props.localStorageKey, JSON.stringify(localStorage));
      this.setState({
        localStorage: localStorage
      });
    }
    /**
     * Change event callback for the Lookup component
     *
     * @param {SyntheticEvent} e
     * @param {object} person
     */

  }, {
    key: "onEmulate",
    value: function onEmulate(e, person) {
      this.emulate(person.id, person.attributes.name);
      e.preventDefault();
      return false;
    }
    /**
     * Render the list of previously emulated individuals from local storage
     */

  }, {
    key: "renderHistory",
    value: function renderHistory() {
      var _this2 = this;

      return _react.default.createElement("div", {
        className: "emulate-history"
      }, this.state.localStorage.map(function (item) {
        return _react.default.createElement("span", {
          key: item.id
        }, " ", _react.default.createElement("a", {
          href: "#",
          className: "badge badge-primary",
          onClick: function onClick() {
            return _this2.emulate(item.id, item.name);
          }
        }, item.name));
      }));
    }
    /**
     * Returns a callable that generates raw HTML for each Lookup option.
     *
     * @return {callable}
     */

  }, {
    key: "renderModal",
    value: function renderModal() {
      return _react.default.createElement(_Modal.default, {
        ref: this.modal
      }, _react.default.createElement("div", {
        className: "modal-dialog"
      }, _react.default.createElement("form", {
        className: "modal-content",
        method: "post",
        action: "imtrash"
      }, _react.default.createElement("div", {
        className: "modal-header"
      }, _react.default.createElement("h5", {
        className: "modal-title",
        id: "emulate-label"
      }, "Emulate User"), _react.default.createElement("button", {
        type: "button",
        className: "close",
        "data-dismiss": "modal",
        "aria-label": "Close"
      }, _react.default.createElement("span", {
        "aria-hidden": "true"
      }, "\xD7"))), _react.default.createElement("div", {
        className: "modal-body"
      }, _react.default.createElement("fieldset", {
        className: "form-group"
      }, _react.default.createElement(_Lookup.default, {
        name: "emulate-user-lookup",
        endpoint: this.props.lookupEndpoint,
        hasClearButton: false,
        onChange: this.onEmulate,
        optionDisplay: Emulate.getOptionDisplay()
      }, _react.default.createElement("button", {
        className: "btn btn-danger emulate-clear",
        "aria-label": "remove emulation",
        onClick: this.onReset
      }, "Reset")), this.props.isEmulating && _react.default.createElement("small", {
        className: "form-text"
      }, "Currently emulating ", _react.default.createElement("strong", null, this.props.username, ". "), "Click ", _react.default.createElement("strong", null, "Reset"), " to clear all emulation."), this.renderHistory())))));
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", null, _react.default.createElement("button", {
        type: "button",
        className: this.props.className,
        onClick: this.onClick
      }, "Emulate"), this.renderModal());
    }
  }], [{
    key: "getOptionDisplay",
    value: function getOptionDisplay() {
      return function (data) {
        return "".concat(data.attributes.name, "\n            <span class=\"text-muted pull-right\">\n                &nbsp;&nbsp;(").concat(data.attributes.username, ")\n            </span>");
      };
    }
  }]);
  return Emulate;
}(_react.default.Component);

Emulate.propTypes = {
  /**
   * Custom className to apply to the rendered <button> element.
   *
   * Useful for buttons that should be displayed in dropdowns
   * versus displayed on a page with a particular color
   */
  className: _propTypes.default.string,

  /**
   * Endpoint for emulation POST/DELETE requests (absolute path)
   */
  endpoint: _propTypes.default.string.isRequired,

  /**
   * API endpoint for user lookups (absolute path)
   *
   * Must conform to OR Lookup endpoint format
   */
  lookupEndpoint: _propTypes.default.string.isRequired,

  /**
   * True if we're emulating a user on the current session
   */
  isEmulating: _propTypes.default.bool.isRequired,

  /**
   * Individual we're currently emulating
   */
  username: _propTypes.default.string,

  /**
   * Key used for emulation history in Local Storage
   */
  localStorageKey: _propTypes.default.string.isRequired
};
Emulate.defaultProps = {
  lookupEndpoint: 'https://orapps.osu.edu/api/v1/person',
  isEmulating: false,
  username: null,
  className: 'btn btn-danger',
  localStorageKey: 'emulate-history'
};
var _default = Emulate;
exports.default = _default;