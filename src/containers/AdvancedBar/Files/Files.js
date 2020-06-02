import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'

// import * as classes from './Images.module.css'
import * as classes from '../AdvancedBar.module.css'
import * as actions from '../../../store/actions'
import FilesTree from '../../../components/FilesTreeAndProperties/FilesTree/FilesTree'
import FileProperties from '../../../components/FilesTreeAndProperties/Properties/FileProperties'
import SizeDragController from '../SizeDragController/SizeDragController'
import { urltoFile } from '../../../store/actions/files'

const Files = props => {
    const [value, setValue] = useState('')
    const [editorMode, setEditorMode] = useState('css')
    const [loaded, setLoaded] = useState(false)

    const handleSaveFile = async (fileId, replace, fileType) => {
        if (fileId === props.currentFileItem.id) {
            let file
            if (loaded === 'resize') {
                file = await urltoFile(
                    value,
                    props.currentFileItem.name + ' (copy)'
                )
            } else if (
                toastEditorRef.current &&
                props.currentFileItem.type.indexOf('image') >= 0
            ) {
                const content = toastEditorRef.current.getInstance().toDataURL()
                file = await urltoFile(
                    content,
                    props.currentFileItem.name + ' (copy)'
                )
            } else {
                file = new File(
                    [value],
                    props.currentFileItem.name + ' (copy)',
                    {
                        type: props.currentFileItem.type,
                    }
                )
            }
            if (replace) replace = props.currentFileItem
            props.uploadFile([file], replace, editorMode, fileType)
        }
    }

    const toastEditorRef = useRef(null)
    return props.currentWebsiteObject ? (
        <div className={classes.Content}>
            <div
                className={classes.Container}
                style={{
                    flex: '0 0 ' + props.barSizes.width + 'px',
                }}
            >
                <FilesTree />
                <SizeDragController
                    addClass={classes.widthControll}
                    startValue={props.barSizes.width}
                    type="width"
                />
            </div>
            {props.currentFileItem ? (
                <div
                    className={classes.LastContainer}
                    style={{ overflow: 'auto' }}
                >
                    <FileProperties
                        ref={toastEditorRef}
                        value={value}
                        setValue={setValue}
                        editorMode={editorMode}
                        setEditorMode={setEditorMode}
                        loaded={loaded}
                        setLoaded={setLoaded}
                        saveFile={handleSaveFile}
                    />
                </div>
            ) : null}
        </div>
    ) : null
}
const mapStateToProps = state => {
    return {
        currentWebsiteObject: state.mD.currentWebsiteObject,
        barSizes: state.barSizes,
        currentFileItem: state.mD.currentFileItem,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        uploadFile: (files, replace, editorMode, fileType) =>
            dispatch(
                actions.uploadFile(files, replace, editorMode, false, fileType)
            ),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Files)
