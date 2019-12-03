import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../../store/actions/index'
import * as classes from './WebsitesTree.module.css'
import InspectorValue from '../../../../components/UI/InspectorValue/InspectorValue'
import {
    _extends,
    _objectSpread,
    // $FlowFixMe
} from '../../../../utils/sortTreeMethods'
import Svg from '../../../../components/Svg/Svg'

// type Props = {
//     chooseWebsite: Function,
//     loadedWebsite: string,
//     changeWebsiteProperty: Function,
// }
const ItemRenderer = props => {
    var _this$props = props,
        connectDragPreview = _this$props.connectDragPreview,
        className = _this$props.className,
        style = _this$props.style

    const { name, id } = props.node
    const rowClasses = [classes.rst__row, className]

    return (
        <div
            {..._extends({ style: { height: '100%' } })}
            onMouseDown={() => {
                props.chooseWebsite(id)
            }}
            data-testid={name}
        >
            <div className={classes.rst__rowWrapper}>
                {connectDragPreview(
                    <div
                        className={rowClasses.join(' ')}
                        style={_objectSpread(
                            {
                                opacity: 1,
                            },
                            style
                        )}
                    >
                        <div
                            className={[
                                classes.rst__rowContents,
                                classes.rst__rowContentsDragDisabled,
                            ].join(' ')}
                        >
                            <div className={classes.rst__rowLabel}>
                                <InspectorValue
                                    value={name}
                                    items={[]}
                                    blur={value => {
                                        if (value !== name)
                                            props.changeWebsiteProperty(
                                                'name',
                                                value,
                                                id
                                            )
                                    }}
                                    withState
                                />
                                {props.loadedWebsite === id ? (
                                    <div className={classes.Loaded}>
                                        <Svg icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"></path></svg>' />
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        loadedWebsite: state.loadedWebsite,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        chooseWebsite: id => dispatch(actions.chooseWebsite(id)),
        changeWebsiteProperty: (key, value, id) =>
            dispatch(actions.changeWebsiteProperty(key, value, id)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemRenderer)
