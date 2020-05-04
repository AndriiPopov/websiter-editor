/* eslint-disable */
export function _extends() {
    _extends =
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

    return _extends.apply(this, arguments)
}

export function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {}
    var target = {}
    var sourceKeys = Object.keys(source)
    var key, i

    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i]
        if (excluded.indexOf(key) >= 0) continue
        target[key] = source[key]
    }

    return target
}

export function _objectWithoutProperties(source, excluded) {
    if (source == null) return {}

    var target = _objectWithoutPropertiesLoose(source, excluded)

    var key, i

    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source)

        for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i]
            if (excluded.indexOf(key) >= 0) continue
            if (!Object.prototype.propertyIsEnumerable.call(source, key))
                continue
            target[key] = source[key]
        }
    }

    return target
}
export function classnames() {
    for (
        var _len = arguments.length, classes = new Array(_len), _key = 0;
        _key < _len;
        _key++
    ) {
        classes[_key] = arguments[_key]
    }

    // Use Boolean constructor as a filter callback
    // Allows for loose type truthy/falsey checks
    // Boolean("") === false;
    // Boolean(false) === false;
    // Boolean(undefined) === false;
    // Boolean(null) === false;
    // Boolean(0) === false;
    // Boolean("classname") === true;
    return classes.filter(Boolean).join(' ')
}
export function isDescendant(older, younger) {
    return (
        !!older.children &&
        typeof older.children !== 'function' &&
        older.children.some(function(child) {
            return child === younger || isDescendant(child, younger)
        })
    )
}
export function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
        })
    } else {
        obj[key] = value
    }

    return obj
}
export function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {}
        var ownKeys = Object.keys(source)

        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(
                Object.getOwnPropertySymbols(source).filter(function(sym) {
                    return Object.getOwnPropertyDescriptor(
                        source,
                        sym
                    ).enumerable
                })
            )
        }

        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key])
        })
    }

    return target
}
export function _toConsumableArray(arr) {
    return (
        _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
    )
}

export function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++)
            arr2[i] = arr[i]

        return arr2
    }
}

export function _iterableToArray(iter) {
    if (
        Symbol.iterator in Object(iter) ||
        Object.prototype.toString.call(iter) === '[object Arguments]'
    )
        return Array.from(iter)
}

export function _nonIterableSpread() {
    throw new TypeError('Invalid attempt to spread non-iterable instance')
}
