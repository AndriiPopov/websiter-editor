import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../../store/actions/index'
import * as classes from './WebsitesTree.module.css'
import InspectorValue from '../../../../components/UI/InspectorValue/InspectorValue'
import { _extends, _objectSpread } from '../../../../utils/sortTreeMethods'
import checkUserRights from '../../../../utils/checkUserRights'
import * as wsActions from '../../../../websocketActions'

// import type { initialStateType } from '../../../../store/reducer/reducer'

// type Props = {
//     chooseWebsite: typeof actions.chooseWebsite,
//     connectDragPreview: Function,
//     className: string,
//     style: string,
//     node: { name: string, id: string },
//     userId: $PropertyType<initialStateType, 'userId'>,
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
                                        if (!props.checkUserRights(['owner']))
                                            return
                                        else if (value !== name)
                                            wsActions.changeWebsiteProperty(
                                                'name',
                                                value,
                                                id
                                            )
                                    }}
                                    withState
                                    maxLength="30"
                                    maxWidth="220px"
                                />
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
        resourcesObjects: state.resourcesObjects,
        userId: state.userId,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        chooseWebsite: id => dispatch(actions.chooseWebsite(id)),
        checkUserRights: rights => dispatch(checkUserRights(rights)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemRenderer)
