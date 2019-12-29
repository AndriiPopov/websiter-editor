import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../store/actions'
import * as classes from '../AdvancedBar.module.css'
import SizeDragController from '../SizeDragController/SizeDragController'
import ResourcesTree from '../../../components/ResourcesTree/ResourcesTree'
import ElementsTree from '../../../components/ElementsTreeAndProperties/ElementsTree/ElementsTree'
import Properties from '../../../components/ElementsTreeAndProperties/Properties/Properties'

import type { initialStateType } from '../../../store/reducer/reducer'

type Props = {
    currentPage: $PropertyType<initialStateType, 'currentPage'>,
    resourcesObjects: $PropertyType<initialStateType, 'resourcesObjects'>,
    pagesStructure: $PropertyType<initialStateType, 'pagesStructure'>,
    barSizes: $PropertyType<initialStateType, 'barSizes'>,
    changeBarSize: typeof actions.changeBarSize,
    changeBoxProperty: typeof actions.changeBoxProperty,
}

const Pages = (props: Props) => {
    const page = props.currentPage
        ? props.resourcesObjects[props.currentPage]
            ? !props.resourcesObjects[props.currentPage].present.structure
                ? props.resourcesObjects[props.currentPage].draft
                : props.resourcesObjects[props.currentPage].present
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
                    type="page"
                    structure={props.pagesStructure}
                    currentResource={props.currentPage}
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
                            currentResource={props.currentPage}
                            resourcesObjects={props.resourcesObjects}
                            resourceDraft={page}
                            mode="page"
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
                            mode="page"
                            currentResource={props.currentPage}
                            resourceDraft={page}
                            changeProperty={(key, value) =>
                                props.changeBoxProperty(
                                    key,
                                    value,
                                    props.currentPage,
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
        pagesStructure: state.pagesStructure,
        currentPage: state.currentPage,
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
)(Pages)
