import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../../store/actions/index'
import * as classes from './WebsitesProperties.module.css'
import withDragDropContext from '../../../../hoc/withDragDropContext'
import SmallButton from '../../../../components/UI/Buttons/SmallButton/SmallButton'
import TextInput from '../../../../components/UI/TextInput/TextInput'

type Props = {
    currentWebsite: string,
    websites: Array<{
        _id: string,
        title: string,
        domain: string,
    }>,
    changeWebsiteProperty: Function,
    domainNotOk: boolean,
}

const WebsitesProperties = (props: Props) => {
    useEffect(() => {
        const website = props.websites.find(
            website => website._id === props.currentWebsite
        )
        let value = ''
        if (website) {
            value = website.domain
        }
        setDomainValue(value)
    }, [props.currentWebsite])
    const [domainValue, setDomainValue] = useState('')
    return props.currentWebsite ? (
        <div className={classes.DomainSettings}>
            <div className={classes.Input}>
                <TextInput
                    changed={value => setDomainValue(value)}
                    value={domainValue}
                    wrong={props.domainNotOk}
                    inline
                    right
                />
                <span className={classes.Span}>.logision.com</span>
            </div>
            <div className={classes.Button}>
                <SmallButton
                    icon='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path></svg>'
                    title="Save"
                    buttonClicked={() =>
                        props.changeWebsiteProperty(
                            'domain',
                            domainValue,
                            props.currentWebsite
                        )
                    }
                />
            </div>
        </div>
    ) : null
}

const mapStateToProps = state => {
    return {
        currentWebsite: state.currentWebsite,
        websites: state.websites,
        domainNotOk: state.domainNotOk,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeWebsiteProperty: (key, value, id) =>
            dispatch(actions.changeWebsiteProperty(key, value, id)),
    }
}

export default withDragDropContext(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(WebsitesProperties)
)
