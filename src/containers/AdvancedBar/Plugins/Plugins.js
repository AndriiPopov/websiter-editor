import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../store/actions'
import * as classes from '../AdvancedBar.module.css'
import SizeDragController from '../SizeDragController/SizeDragController'
import ResourcesTree from '../../../components/ResourcesTree/ResourcesTree'
import ElementsTree from '../../../components/ElementsTreeAndProperties/ElementsTree/ElementsTree'
import Properties from '../../../components/ElementsTreeAndProperties/Properties/Properties'
import checkUserRights from '../../../utils/checkUserRights'

import type { initialStateType } from '../../../store/reducer/reducer'

type Props = {
    barSizes: $PropertyType<initialStateType, 'barSizes'>,
    changeBoxProperty: typeof actions.changeBoxProperty,
}

const Plugins = (props: Props) => {
    const handleChangeBoxProperty = (key, value) => {
        if (props.checkUserRights(['content']))
            props.changeBoxPropertyInValues('plugin', key, value)
    }

    return (
        <div className={classes.Content}>
            <div
                className={classes.Container}
                style={{
                    flex: '0 0 ' + props.barSizes.width + 'px',
                }}
            >
                <ResourcesTree type="plugin" />
                <SizeDragController
                    addClass={classes.widthControll}
                    startValue={props.barSizes.width}
                    type="width"
                />
            </div>
            {props.currentPluginDraftExists ? (
                <>
                    <div
                        className={classes.Container}
                        style={{
                            flex: '0 0 ' + props.barSizes.width2 + 'px',
                        }}
                    >
                        <ElementsTree mode="plugin" />

                        <SizeDragController
                            addClass={classes.widthControll}
                            startValue={props.barSizes.width2}
                            type="width2"
                        />
                    </div>
                    <div className={classes.LastContainer}>
                        <Properties
                            mode="plugin"
                            changeProperty={handleChangeBoxProperty}
                        />
                    </div>
                </>
            ) : null}
        </div>
    )
}

const mapStateToProps = state => {
    return {
        barSizes: state.barSizes,
        currentPluginDraftExists:
            typeof state.mD.currentPluginDraft != 'undefined',
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeBoxPropertyInValues: (type, key, value) =>
            dispatch(actions.changeBoxPropertyInValues(type, key, value)),
        checkUserRights: rights => dispatch(checkUserRights(rights)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Plugins)
