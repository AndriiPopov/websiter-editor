import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../store/actions'
import * as classes from '../AdvancedBar.module.css'
import SizeDragController from '../SizeDragController/SizeDragController'
import Editor from '../../../components/Editor/Editor'
import ResourcesTree from '../../../components/ResourcesTree/ResourcesTree'

const Files = props => {
    const resource = props.currentFile
        ? props.resourcesObjects[props.currentFile].present.value
            ? props.resourcesObjects[props.currentFile].present
            : props.resourcesObjects[props.currentFile].draft
        : null
    return (
        <div className={classes.Content}>
            <div
                className={classes.Container}
                style={{ flex: '0 0 ' + props.barSizes.width + 'px' }}
            >
                <ResourcesTree
                    type="file"
                    structure={props.filesStructure}
                    currentResource={props.currentFile}
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
            <div className={classes.LastContainer}>
                {props.currentFile ? (
                    props.resourcesObjects[props.currentFile] ? (
                        <Editor
                            currentElement={props.currentFile}
                            elementValue={resource.value}
                            elementCurrentCursor={resource.cursorPosition}
                            editorMode="css"
                            handleChange={(value, cursorPosition) =>
                                props.addResourceVersion(props.currentFile, {
                                    value,
                                    cursorPosition,
                                })
                            }
                        />
                    ) : null
                ) : null}
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        currentFile: state.currentFile,
        resourcesObjects: state.resourcesObjects,
        filesStructure: state.filesStructure,
        barSizes: state.barSizes,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeBarSize: (barSizes, initiator) =>
            dispatch(actions.changeBarSize(barSizes, initiator)),
        addResourceVersion: (currentFile, draft) =>
            dispatch(actions.addResourceVersion(currentFile, draft)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Files)
