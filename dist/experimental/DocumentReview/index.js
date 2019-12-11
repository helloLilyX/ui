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

var _CommentSection = _interopRequireDefault(require("./CommentSection"));

var _iframeCss = _interopRequireDefault(require("./iframe-css"));

require("./index.scss");

var DocumentReview =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(DocumentReview, _React$Component);

  function DocumentReview(props) {
    var _this;

    (0, _classCallCheck2.default)(this, DocumentReview);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(DocumentReview).call(this, props));
    _this.iframe = _react.default.createRef();
    _this.onFrameDocumentLoad = _this.onFrameDocumentLoad.bind((0, _assertThisInitialized2.default)(_this));
    _this.onLoadComments = _this.onLoadComments.bind((0, _assertThisInitialized2.default)(_this));
    _this.onSubmitReply = _this.onSubmitReply.bind((0, _assertThisInitialized2.default)(_this));
    _this.error = _this.error.bind((0, _assertThisInitialized2.default)(_this));
    _this.state = {
      comments: null,
      isDocumentReady: false
    }; // Mapping between section IDs and CommentSection classes

    _this.sections = {};
    return _this;
  }

  (0, _createClass2.default)(DocumentReview, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.iframe.current.addEventListener('load', this.onFrameDocumentLoad);
      this.fetchComments();
    }
    /**
     * Ask the API for an updated list of comments to render
     */

  }, {
    key: "fetchComments",
    value: function fetchComments() {
      if (typeof this.props.comments !== 'function') {
        throw new Error('Expected `comments` prop to be a function');
      }

      var promise = this.props.comments();

      if (!(promise instanceof Promise)) {
        throw new Error('Expected `comments` prop function to return a Promise');
      }

      promise.then(this.onLoadComments).catch(this.error);
    }
    /**
     * Apply comments in state to the loaded document
     */

  }, {
    key: "applyCommentsToDocument",
    value: function applyCommentsToDocument() {
      var _this2 = this;

      var _this$state = this.state,
          comments = _this$state.comments,
          isDocumentReady = _this$state.isDocumentReady;

      if (comments === null || !isDocumentReady) {
        throw new Error('applyCommentsToDocument() called too early');
      }

      comments.forEach(function (resource) {
        var attr = resource.attributes;
        var section = _this2.sections[attr.section];

        if (!section) {
          console.warn("Cannot load comment ".concat(resource.id, ": Section \"").concat(attr.section, "\" ") + 'does not exist in the current document');
          return;
        }

        section.addComment(resource.id, attr.author, attr.date, attr.message);
      });
    }
    /**
     * Add comments to state
     */

  }, {
    key: "onLoadComments",
    value: function onLoadComments(json) {
      var _this3 = this;

      this.setState({
        comments: json.data
      }, function () {
        if (_this3.state.isDocumentReady) {
          _this3.applyCommentsToDocument();
        }
      });
    }
  }, {
    key: "error",
    value: function error(e) {
      console.error(e); // do stuff.
    }
    /**
     * Event callback for when the embedded IFrame finishes loading a document.
     * Will inject comment blocks / controls into every commentable section.
     */

  }, {
    key: "onFrameDocumentLoad",
    value: function onFrameDocumentLoad() {
      var _this4 = this;

      var frameDoc = this.iframe.current.contentDocument; // Inject required CSS for comments

      var style = frameDoc.createElement('style');
      style.innerText = _iframeCss.default;
      frameDoc.body.appendChild(style); // Scrape the document and inject comment blocks. Since we're working within
      // an iframe here and there's minimal JS to deal with, we'll just be
      // dropping down to the pure Javascript API and ignore React.

      frameDoc.querySelectorAll('[data-comment-section]').forEach(function (node) {
        var section = node.dataset['commentSection'];
        _this4.sections[section] = new _CommentSection.default(section, frameDoc, node, _this4.onSubmitReply);
      }); // Try to load in the comments, assuming we're both
      // document ready + comment data ready.

      this.setState({
        isDocumentReady: true
      }, function () {
        if (_this4.state.comments !== null) {
          _this4.applyCommentsToDocument();
        }
      });
    }
    /**
     * Handler for when the user submits a new comment/reply
     *
     * @param {CommentSection} section
     * @param {string} message
     */

  }, {
    key: "onSubmitReply",
    value: function onSubmitReply(section, message) {// TODO: POST to the server
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("div", {
        className: "document-review"
      }, _react.default.createElement("iframe", {
        ref: this.iframe,
        src: this.props.document
      }));
    }
  }]);
  return DocumentReview;
}(_react.default.Component);

DocumentReview.propTypes = {
  /**
   * Function that returns a `Promise` that resolves
   * to comment API data already JSON decoded.
   */
  comments: _propTypes.default.func.isRequired,

  /**
   * Endpoint to reviewable document HTML
   */
  document: _propTypes.default.string.isRequired
};
DocumentReview.defaultProps = {
  comments: null,
  document: null
};
var _default = DocumentReview;
exports.default = _default;