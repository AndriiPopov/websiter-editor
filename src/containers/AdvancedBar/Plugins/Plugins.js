import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../store/actions'
import * as classes from '../AdvancedBar.module.css'
import SizeDragController from '../SizeDragController/SizeDragController'
import ResourcesTree from '../../../components/ResourcesTree/ResourcesTree'
import ElementsTree from '../../../components/ElementsTreeAndProperties/ElementsTree/ElementsTree'
import Properties from '../../../components/ElementsTreeAndProperties/Properties/Properties'

const Plugins = props => {
    const page = props.currentPlugin
        ? props.resourcesObjects[props.currentPlugin]
            ? !props.resourcesObjects[props.currentPlugin].present.structure
                ? props.resourcesObjects[props.currentPlugin].draft
                : props.resourcesObjects[props.currentPlugin].present
            : null
        : null
    return (
        <div className={classes.Content}>
            <div
                className={classes.Container}
                style={{
                    flex: '0 0 ' + props.barSizes.width + 'px',
                }}
            >
                <ResourcesTree
                    type="plugin"
                    structure={props.pluginsStructure}
                    currentResource={props.currentPlugin}
                />
                <SizeDragController
                    addClass={classes.widthControll}
                    startValue={props.barSizes.width}
                    changed={value =>
                        props.changeBarSize(props.barSizes, {
                            key: 'width',
                            value,
                        })
                    }
                />
            </div>
            {page ? (
                <>
                    <div
                        className={classes.Container}
                        style={{
                            flex: '0 0 ' + props.barSizes.width2 + 'px',
                        }}
                    >
                        <ElementsTree
                            pagesStructure={props.pagesStructure}
                            currentResource={props.currentPlugin}
                            resourcesObjects={props.resourcesObjects}
                            resourceDraft={page}
                            pluginsStructure={props.pluginsStructure}
                            mode="plugin"
                        />

                        <SizeDragController
                            addClass={classes.widthControll}
                            startValue={props.barSizes.width2}
                            changed={value =>
                                props.changeBarSize(props.barSizes, {
                                    key: 'width2',
                                    value,
                                })
                            }
                        />
                    </div>
                    <div className={classes.LastContainer}>
                        <Properties
                            mode="plugin"
                            currentResource={props.currentPlugin}
                            resourceDraft={page}
                            changeProperty={(key, value) =>
                                props.changeBoxProperty(
                                    key,
                                    value,
                                    props.currentPlugin,
                                    page
                                )
                            }
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
        pluginsStructure: state.pluginsStructure,
        currentPlugin: state.currentPlugin,
        resourcesObjects: state.resourcesObjects,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeBarSize: (barSizes, initiator) =>
            dispatch(actions.changeBarSize(barSizes, initiator)),
        changeBoxProperty: (key, value, currentResource, resourceDraft) =>
            dispatch(
                actions.changeBoxProperty(
                    key,
                    value,
                    currentResource,
                    resourceDraft
                )
            ),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Plugins)
