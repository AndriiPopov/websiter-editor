export const checkIfCapital = (char: string) => {
    if (char === char.toUpperCase() && char !== char.toLowerCase()) {
        return true
    }
}
function _objectSpread(target) {
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

function _defineProperty(obj, key, value) {
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

function _objectWithoutProperties(source, excluded) {
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

function _objectWithoutPropertiesLoose(source, excluded) {
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

export function buildTree(items) {
    var buildItem = function buildItem(item) {
        var path = item.path,
            data = _objectWithoutProperties(item, ['path'])

        return _objectSpread({}, data, {
            children: items
                .filter(function(child) {
                    return child.path[child.path.length - 1] === item.id
                })
                .map(function(child) {
                    return buildItem(child)
                }),
        })
    }

    var tree = items
        .filter(function(item) {
            return item.path.length === 0
        })
        .map(function(item) {
            return buildItem(item)
        })
    return tree
}
