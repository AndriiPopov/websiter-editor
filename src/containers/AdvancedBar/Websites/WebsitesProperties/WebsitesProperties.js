import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import * as actions from '../../../../store/actions/index'
import * as classes from './WebsitesProperties.module.css'
import withDragDropContext from '../../../../hoc/withDragDropContext'
import SmallButton from '../../../../components/UI/Buttons/SmallButton/SmallButton'
import TextInput from '../../../../components/UI/TextInput/TextInput'
import Svg from '../../../../components/Svg/Svg'

import type { initialStateType } from '../../../../store/reducer/reducer'

type Props = {
    currentWebsite: $PropertyType<initialStateType, 'currentWebsite'>,
    websites: $PropertyType<initialStateType, 'websites'>,
    changeWebsiteProperty: typeof actions.changeWebsiteProperty,
    domainNotOk: $PropertyType<initialStateType, 'domainNotOk'>,
    customDomainNotOk: $PropertyType<initialStateType, 'customDomainNotOk'>,
    verifyCustomDomain: typeof actions.verifyCustomDomain,
}

const WebsitesProperties = (props: Props) => {
    useEffect(() => {
        const websiteElement = props.websites.find(
            website => website._id === props.currentWebsite
        )
        let value = ''
        if (websiteElement) {
            value = websiteElement.domain
        }
        setDomainValue(value)
        value = ''
        if (websiteElement) {
            value = websiteElement.customDomain || ''
        }
        if (value === '__delete__') {
            value = ''
        }
        setCustomDomainValue(value)
    }, [props.currentWebsite])
    const [domainValue: string, setDomainValue] = useState('')
    const [customDomainValue, setCustomDomainValue] = useState('')
    let website
    if (props.websites) {
        website = props.websites.find(
            website => website._id === props.currentWebsite
        )
    }
    return props.currentWebsite ? (
        <div className={classes.DomainSettings}>
            <div className={classes.LocalDomain}>
                <div className={classes.Title}>
                    {website ? (
                        website.domainHidden ? (
                            <Svg icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"></path></svg>' />
                        ) : null
                    ) : null}
                    <span>Local domain:</span>
                </div>
                <div className={classes.Input}>
                    <span className={classes.Span}>
                        https://live.websiter.dev/
                    </span>
                    <TextInput
                        changed={value => setDomainValue(value)}
                        value={domainValue}
                        wrong={props.domainNotOk}
                        inline
                        right
                        minWidth={220}
                    />
                </div>

                <SmallButton
                    icon='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path></svg>'
                    buttonClicked={() =>
                        props.changeWebsiteProperty(
                            'domain',
                            domainValue,
                            props.currentWebsite
                        )
                    }
                    tooltip="Save local domain name"
                    inline
                />
                <SmallButton
                    icon='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>'
                    buttonClicked={() => {
                        if (website)
                            props.changeWebsiteProperty(
                                'domainHidden',
                                !website.domainHidden,
                                props.currentWebsite
                            )
                    }}
                    tooltip="Hide/show local domain"
                    inline
                />
                <SmallButton
                    icon='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></svg>'
                    buttonClicked={() => {
                        if (domainValue) {
                            window.open(
                                'https://live.websiter.dev/' + domainValue,
                                '_blank'
                            )
                        }
                    }}
                    tooltip="Open in a new tab"
                    inline
                />
            </div>
            <div className={classes.CustomDomain}>
                <div className={classes.Title}>
                    {website ? (
                        website.customDomainHidden ? (
                            <Svg icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"></path></svg>' />
                        ) : null
                    ) : null}
                    {website ? (
                        website.customDomainVerified ? (
                            <Svg icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"></path></svg>' />
                        ) : null
                    ) : null}
                    <span>Custom domain:</span>
                </div>
                <div className={classes.Input}>
                    <span className={classes.Span}>https://</span>
                    <TextInput
                        changed={value => setCustomDomainValue(value)}
                        value={customDomainValue}
                        wrong={props.customDomainNotOk}
                        inline
                        right
                        minWidth={220}
                    />
                </div>
                <SmallButton
                    icon='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path></svg>'
                    buttonClicked={() =>
                        props.changeWebsiteProperty(
                            'customDomain',
                            customDomainValue,
                            props.currentWebsite
                        )
                    }
                    tooltip="Save custom domain name"
                    inline
                />
                <SmallButton
                    icon='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>'
                    buttonClicked={() => {
                        if (website)
                            props.changeWebsiteProperty(
                                'customDomainHidden',
                                !website.customDomainHidden,
                                props.currentWebsite
                            )
                    }}
                    tooltip="Hide/show custom domain"
                    inline
                />
                <SmallButton
                    icon='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></svg>'
                    buttonClicked={() => {
                        if (domainValue) {
                            window.open(
                                'https://' + customDomainValue,
                                '_blank'
                            )
                        }
                    }}
                    tooltip="Open in a new tab"
                    inline
                />
                <SmallButton
                    icon='<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"></path></svg>'
                    buttonClicked={() =>
                        props.verifyCustomDomain(props.currentWebsite)
                    }
                    tooltip="Verify website ownership"
                    inline
                />
                <SmallButton
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>'
                    buttonClicked={() =>
                        props.changeWebsiteProperty(
                            'customDomain',
                            '__delete__',
                            props.currentWebsite
                        )
                    }
                    tooltip="Delete custom domain"
                    inline
                />
                {website ? (
                    website.customDomain &&
                    website.cname &&
                    website.verifyCode ? (
                        <div>
                            `In order to use your custom domain you need to
                            create the following CNAME DNS record <br /> $
                            {website.cname}
                            <br /> If you want to verify your domain ownership
                            and make sure that nobody else could connect this
                            domain to other website add the following TXT DNS
                            record and press verify button:
                            <br />${website.verifyCode}`
                        </div>
                    ) : null
                ) : null}
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
        verifyCustomDomain: id => dispatch(actions.verifyCustomDomain(id)),
    }
}

export default withDragDropContext(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(WebsitesProperties)
)
