import React, { memo } from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../store/actions'
import * as classes from '../AdvancedBar.module.css'
import SizeDragController from '../SizeDragController/SizeDragController'
import ResourcesTree from '../../../components/ResourcesTree/ResourcesTree'
import ElementsTree from '../../../components/ElementsTreeAndProperties/ElementsTree/ElementsTree'
import PageProperties from '../../../components/ElementsTreeAndProperties/PageProperties/PageProperties'
import PinnedElementsBar from '../../../components/PinnedElementsBar/PinnedElementsBar'

// import type { initialStateType } from '../../../store/reducer/reducer'

// type Props = {
//     barSizes: $PropertyType<initialStateType, 'barSizes'>,
//     changeBoxProperty: typeof actions.changeBoxProperty,
// }

const Pages = props => {
    const handleChangeBoxProperty = (key, value, id) => {
        props.changeBoxPropertyInValues('page', key, value, id)
    }

    return (
        <div className={classes.Content}>
            <div
                className={classes.Container}
                style={{
                    flex: '0 0 ' + props.barSizes.width + 'px',
                }}
            >
                <ResourcesTree type="page" />
                <SizeDragController
                    addClass={classes.widthControll}
                    startValue={props.barSizes.width}
                    type={'width'}
                />
            </div>
            <div
                className={classes.Container}
                style={{
                    flex: '0 0 ' + props.barSizes.width2 + 'px',
                }}
            >
                {props.currentPageDraftExists && <ElementsTree mode="page" />}

                <SizeDragController
                    addClass={classes.widthControll}
                    startValue={props.barSizes.width2}
                    type={'width2'}
                />
            </div>
            <div className={classes.LastContainer}>
                <PinnedElementsBar />
                {props.currentPageDraftExists && (
                    <PageProperties
                        mode="page"
                        changeProperty={handleChangeBoxProperty}
                    />
                )}
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        barSizes: state.barSizes,
        currentPageDraftExists: typeof state.mD.currentPageDraft != 'undefined',
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeBoxPropertyInValues: (type, key, value, id) =>
            dispatch(
                actions.changeBoxPropertyInValues(type, key, value, false, id)
            ),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(memo(Pages))
