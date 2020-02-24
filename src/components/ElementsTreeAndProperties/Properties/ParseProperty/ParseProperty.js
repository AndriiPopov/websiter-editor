import React, { useState } from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../../store/actions/index'
import * as classes from './ParseProperty.module.css'
import SmallButton from '../../../UI/Buttons/SmallButton/SmallButton'
import Editor from '../../../Editor/Editor'
import checkUserRights from '../../../../utils/checkUserRights'

import type {
    resourceType,
    elementType,
    initialStateType,
} from '../../../../store/reducer/reducer'

type Props = {
    element: elementType,
    resourceDraft: resourceType,
    changeProperty: (key: string | {}, value: string) => {},
    currentResource:
        | $PropertyType<initialStateType, 'currentPlugin'>
        | $PropertyType<initialStateType, 'currentPage'>,
    splitText: typeof actions.splitText,
    textToSpan: typeof actions.textToSpan,
    tryWebsiter: $PropertyType<initialStateType, 'tryWebsiter'>,
    websites: $PropertyType<initialStateType, 'websites'>,
    loadedWebsite: $PropertyType<initialStateType, 'loadedWebsite'>,
    userId: $PropertyType<initialStateType, 'userId'>,
    requiredRights: Array<string>,
}

const ParseProperty = (props: Props) => {
    const [value, setValue] = useState('')

    const handleTextChange = editorValue => {
        if (!props.checkUserRights(props.requiredRights)) {
            return
        }
        setValue(editorValue)
    }

    return props.element ? (
        <>
            <div>
                <SmallButton
                    title="Parse the code"
                    buttonClicked={() => {
                        props.parseHTML(props.type, value)
                    }}
                    icon='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M14 4l2.29 2.29-2.88 2.88 1.42 1.42 2.88-2.88L20 10V4zm-4 0H4v6l2.29-2.29 4.71 4.7V20h2v-8.41l-5.29-5.3z"></path></svg>'
                    inline
                    requiredRights={props.requiredRights}
                />
            </div>
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
