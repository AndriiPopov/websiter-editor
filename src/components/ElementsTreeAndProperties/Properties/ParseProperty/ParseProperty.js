import React, { useState } from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../../store/actions/index'
import * as classes from './ParseProperty.module.css'
import SmallButton from '../../../UI/Buttons/SmallButton/SmallButton'
import Editor from '../../../Editor/Editor'
import checkUserRights from '../../../../utils/checkUserRights'
import ControlPanel from '../../../UI/ControlPanel'

// import type {
//     resourceType,
//     elementType,
//     initialStateType,
// } from '../../../../store/reducer/reducer'

// type Props = {
//     element,
//     resourceDraft: resourceType,
//     changeProperty: (key: string | {}, value: string) => {},
//     currentResource:
//         | $PropertyType<initialStateType, 'currentPlugin'>
//         | $PropertyType<initialStateType, 'currentPage'>,
//     splitText: typeof actions.splitText,
//     textToSpan: typeof actions.textToSpan,
//     tryWebsiter: $PropertyType<initialStateType, 'tryWebsiter'>,
//     websites: $PropertyType<initialStateType, 'websites'>,
//     loadedWebsite: $PropertyType<initialStateType, 'loadedWebsite'>,
//     userId: $PropertyType<initialStateType, 'userId'>,
//     requiredRights: Array<string>,
// }

const ParseProperty = props => {
    const [value, setValue] = useState('')

    const handleTextChange = editorValue => {
        if (!props.checkUserRights(props.requiredRights)) {
            return
        }
        setValue(editorValue)
    }

    return props.element ? (
        <>
            <ControlPanel>
                <SmallButton
                    title="Parse the code"
                    buttonClicked={() => {
                        props.parseHTML(props.type, value)
                    }}
                    requiredRights={props.requiredRights}
                />
            </ControlPanel>
            <div className={classes.Editors}>
                <Editor
                    currentElement={props.currentBox}
                    editorValue=""
                    editorMode="html"
                    handleChange={handleTextChange}
                    name="editorParse"
                    requiredRights={['developer']}
                />
            </div>
        </>
    ) : null
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        parseHTML: (type, value) => dispatch(actions.parseHTML(type, value)),
        checkUserRights: rights => dispatch(checkUserRights(rights)),
    }
}

export default connect(
    null,
    mapDispatchToProps
)(ParseProperty)
