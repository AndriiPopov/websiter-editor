/* eslint-disable */
'use strict'

Object.defineProperty(exports, '__esModule', {
    value: true,
})

var _extends =
    Object.assign ||
    function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i]
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key]
                }
            }
        }
        return target
    }

var _createClass = (function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]
            descriptor.enumerable = descriptor.enumerable || false
            descriptor.configurable = true
            if ('value' in descriptor) descriptor.writable = true
            Object.defineProperty(target, descriptor.key, descriptor)
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps)
        if (staticProps) defineProperties(Constructor, staticProps)
        return Constructor
    }
})()

var _react = require('react')

var _react2 = _interopRequireDefault(_react)

var _reactDom = require('react-dom')

var _reactDom2 = _interopRequireDefault(_reactDom)

var _propTypes = require('prop-types')

var _propTypes2 = _interopRequireDefault(_propTypes)

var _Context = require('./Context')

var _Content = require('./Content')

var _Content2 = _interopRequireDefault(_Content)

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj }
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function')
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
        )
    }
    return call && (typeof call === 'object' || typeof call === 'function')
        ? call
        : self
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError(
            'Super expression must either be null or a function, not ' +
                typeof superClass
        )
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true,
        },
    })
    if (superClass)
        Object.setPrototypeOf
            ? Object.setPrototypeOf(subClass, superClass)
            : (subClass.__proto__ = superClass)
}

var Frame = (function(_Component) {
    _inherits(Frame, _Component)

    // React warns when you render directly into the body since browser extensions
    // also inject into the body and can mess up React. For this reason
    // initialContent is expected to have a div inside of the body
    // element that we render react into.
    function Frame(props, context) {
        _classCallCheck(this, Frame)

        var _this = _possibleConstructorReturn(
            this,
            (Frame.__proto__ || Object.getPrototypeOf(Frame)).call(
                this,
                props,
                context
            )
        )

        _this.handleLoad = function() {
            _this.forceUpdate()
        }

        _this._isMounted = false
        return _this
    }

    _createClass(Frame, [
        {
            key: 'componentDidMount',
            value: function componentDidMount() {
                this._isMounted = true

                var doc = this.getDoc()
                if (doc && doc.readyState === 'complete') {
                    this.forceUpdate()
                } else {
                    this.node.addEventListener('load', this.handleLoad)
                }
            },
        },
        {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                this._isMounted = false

                this.node.removeEventListener('load', this.handleLoad)
            },
        },
        {
            key: 'getDoc',
            value: function getDoc() {
                return this.node.contentDocument // eslint-disable-line
            },
        },
        {
            key: 'getMountTarget',
            value: function getMountTarget() {
                var doc = this.getDoc()
                if (this.props.mountTarget) {
                    return doc.querySelector(this.props.mountTarget)
                }
                return doc.body
            },
        },
        {
            key: 'getMountTargetHtml',
            value: function getMountTargetHtml() {
                var doc = this.getDoc()
                if (this.props.mountTarget) {
                    return doc.querySelector(this.props.mountTarget)
                }
                return doc.documentElement
            },
        },
        {
            key: 'renderFrameContents',
            value: function renderFrameContents() {
                if (!this._isMounted) {
                    return null
                }

                var doc = this.getDoc()

                var contentDidMount = this.props.contentDidMount
                var contentDidUpdate = this.props.contentDidUpdate

                var win = doc.defaultView || doc.parentView
                if (this.props.updateHead) this._setInitialContent = false
                var initialRender = !this._setInitialContent
                var contents = _react2.default.createElement(
                    _Content2.default,
                    {
                        contentDidMount: contentDidMount,
                        contentDidUpdate: contentDidUpdate,
                    },
                    _react2.default.createElement(
                        _Context.FrameContextProvider,
                        { value: { document: doc, window: win } },

                        this.props.children
                    )
                )

                if (initialRender) {
                    doc.open('text/html', 'replace')
                    doc.write(
                        '<!DOCTYPE html><html><head>' +
                            this.props.base +
                            '</head><body></body></html>'
                    )
                    doc.close()
                    this._setInitialContent = true
                }
                function decodeEntities(encodedString) {
                    var textArea = document.createElement('textarea')
                    textArea.innerHTML = encodedString
                    return textArea.value
                }
                doc.head.innerHTML =
                    this.props.base + decodeEntities(this.props.initialContent)

                // .replace(
                //     /&(l|g|quo)t;/g,
                //     function(a, b) {
                //         return {
                //             l: '<',
                //             g: '>',
                //             quo: '"',
                //         }[b]
                //     }
                // )

                var mountTarget = this.getMountTarget()
                for (let attr in this.props.bodyProps) {
                    mountTarget.setAttribute(attr, this.props.bodyProps[attr])
                }

                var mountTargetHtml = this.getMountTargetHtml()
                for (let attr in this.props.htmlProps) {
                    mountTargetHtml.setAttribute(
                        attr,
                        this.props.htmlProps[attr]
                    )
                }
                return [
                    //_reactDom2.default.createPortal(this.props.head, this.getDoc().head),
                    _reactDom2.default.createPortal(contents, mountTarget),
                ]
            },
        },
        {
            key: 'render',
            value: function render() {
                var _this2 = this

                var props = _extends({}, this.props, {
                    children: undefined, // The iframe isn't ready so we drop children from props here. #12, #17
                })
                delete props.head
                delete props.initialContent
                delete props.mountTarget
                delete props.contentDidMount
                delete props.contentDidUpdate
                delete props.bodyProps
                delete props.htmlProps
                delete props.base
                return _react2.default.createElement(
                    'iframe',
                    _extends({}, props, {
                        ref: function ref(node) {
                            _this2.node = node
                        },
                    }),
                    this.renderFrameContents()
                )
            },
        },
    ])

    return Frame
})(_react.Component)

Frame.propTypes = {
    style: _propTypes2.default.object, // eslint-disable-line
    head: _propTypes2.default.node,
    base: _propTypes2.default.string,
    bodyProps: _propTypes2.default.object,
    htmlProps: _propTypes2.default.object,
    initialContent: _propTypes2.default.string,
    mountTarget: _propTypes2.default.string,
    contentDidMount: _propTypes2.default.func,
    contentDidUpdate: _propTypes2.default.func,
    children: _propTypes2.default.oneOfType([
        _propTypes2.default.element,
        _propTypes2.default.arrayOf(_propTypes2.default.element),
    ]),
}
Frame.defaultProps = {
    style: {},
    base: '',
    head: null,
    bodyProps: {},
    htmlProps: {},
    children: undefined,
    mountTarget: undefined,
    contentDidMount: function contentDidMount() {},
    contentDidUpdate: function contentDidUpdate() {},
    initialContent: '<!DOCTYPE html><html><head></head><body></body></html>',
}
exports.default = Frame
