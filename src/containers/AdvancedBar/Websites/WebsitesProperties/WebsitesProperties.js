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
        customDomain: string,
    }>,
    changeWebsiteProperty: Function,
    domainNotOk: boolean,
    customDomainNotOk: boolean,
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
        value = ''
        if (website) {
            value = website.customDomain
        }
        if (value === '__delete__') {
            value = ''
        }
        setCustomDomainValue(value)
    }, [props.currentWebsite])
    const [domainValue, setDomainValue] = useState('')
    const [customDomainValue, setCustomDomainValue] = useState('')
    return props.currentWebsite ? (
        <div className={classes.DomainSettings}>
            <div>
                <div className={classes.Input}>
                    <span className={classes.Span}>
                        Local domain: live.websiter.dev/
                    </span>
                    <TextInput
                        changed={value => setDomainValue(value)}
                        value={domainValue}
                        wrong={props.domainNotOk}
                        inline
                        right
                    />
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
            <div>
                <div className={classes.Input}>
                    <span className={classes.Span}>Custom domain: </span>
                    <TextInput
                        changed={value => setCustomDomainValue(value)}
                        value={customDomainValue}
                        wrong={props.customDomainNotOk}
                        inline
                        right
                    />
                </div>
                <div className={classes.Button}>
                    <SmallButton
                        icon='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path></svg>'
                        title="Save"
                        buttonClicked={() =>
                            props.changeWebsiteProperty(
                                'customDomain',
                                customDomainValue,
                                props.currentWebsite
                            )
                        }
                    />
                </div>
                <div className={classes.Button}>
                    <SmallButton
                        icon='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path></svg>'
                        title="Delete"
                        buttonClicked={() =>
                            props.changeWebsiteProperty(
                                'customDomain',
                                '__delete__',
                                props.currentWebsite
                            )
                        }
                    />
                </div>
            </div>
        </div>
    ) : null
}

const mapStateToProps = state => {
    return {
        currentWebsite: state.currentWebsite,
        websites: state.websites,
        domainNotOk: state.domainNotOk,
        customDomainNotOk: state.customDomainNotOk,
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
