import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import * as classes from './DomainsProperties.module.css'
import SmallButton from '../../../../../components/UI/Buttons/SmallButton/SmallButton'
import TextInput from '../../../../../components/UI/TextInput/TextInput'
import * as wsActions from '../../../../../websocketActions'
import SaveOutlined from '@ant-design/icons/SaveOutlined'
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined'
import DesktopOutlined from '@ant-design/icons/DesktopOutlined'
import DeleteOutlined from '@ant-design/icons/DeleteOutlined'
import SafetyCertificateOutlined from '@ant-design/icons/SafetyCertificateOutlined'
import Divider from 'antd/es/divider'

const DomainsProperties = props => {
    useEffect(() => {
        const websiteElement = props.currentWebsiteObject
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
    }, [
        props.currentWebsiteId,
        props.currentWebsiteObject.domain,
        props.currentWebsiteObject.customDomain,
    ])
    const [domainValue, setDomainValue] = useState('')
    const [customDomainValue, setCustomDomainValue] = useState('')
    const website = props.currentWebsiteObject
    return website ? (
        <div className={classes.DomainSettings}>
            <div className={classes.LocalDomain}>
                <div className={classes.Title}>
                    {website ? (
                        <>{website.domainHidden && <EyeInvisibleOutlined />}</>
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
                        inline
                        right
                        minWidth={220}
                    />
                </div>
                <Divider type="vertical" />

                <SmallButton
                    icon={<SaveOutlined />}
                    buttonClicked={() => {
                        props.saveDomainName(domainValue, 'domain')
                        setDomainValue(website.domain)
                    }}
                    tooltip="Save local domain name"
                    requiredRights={['admin', 'developer']}
                />
                <Divider type="vertical" />
                <SmallButton
                    icon={<EyeInvisibleOutlined />}
                    buttonClicked={() => {
                        if (website)
                            props.changeWebsiteProperty(
                                'domainHidden',
                                !website.domainHidden
                            )
                    }}
                    tooltip="Hide/show local domain"
                    requiredRights={['admin', 'developer']}
                />
                <Divider type="vertical" />
                <SmallButton
                    icon={<DesktopOutlined />}
                    buttonClicked={() => {
                        if (domainValue) {
                            window.open(
                                // 'https://live.websiter.dev/' +
                                website.domain,
                                '_blank'
                            )
                        }
                    }}
                    tooltip="Open in a new tab"
                />
            </div>
            <div className={classes.CustomDomain}>
                <div className={classes.Title}>
                    {website && website.customDomainHidden && (
                        <EyeInvisibleOutlined />
                    )}
                    {website && website.customDomainVerified && (
                        <SafetyCertificateOutlined />
                    )}
                    <span>Custom domain:</span>
                </div>
                <div className={classes.Input}>
                    <span className={classes.Span}>https://</span>
                    <TextInput
                        changed={value => setCustomDomainValue(value)}
                        value={customDomainValue}
                        inline
                        right
                        minWidth={220}
                    />
                </div>
                <Divider type="vertical" />
                <SmallButton
                    icon={<SaveOutlined />}
                    buttonClicked={() => {
                        if (website)
                            props.saveDomainName(
                                customDomainValue,
                                'customDomain'
                            )
                        setCustomDomainValue(website.customDomain)
                    }}
                    tooltip="Save custom domain name"
                    requiredRights={['admin', 'developer']}
                />
                <Divider type="vertical" />
                <SmallButton
                    icon={<EyeInvisibleOutlined />}
                    buttonClicked={() => {
                        if (website)
                            props.changeWebsiteProperty(
                                'customDomainHidden',
                                !website.customDomainHidden
                            )
                    }}
                    tooltip="Toggle visibility"
                    requiredRights={['admin', 'developer']}
                />
                <Divider type="vertical" />
                <SmallButton
                    icon={<DesktopOutlined />}
                    buttonClicked={() => {
                        if (domainValue) {
                            window.open(
                                'https://' + website.customDomain,
                                '_blank'
                            )
                        }
                    }}
                    tooltip="Open in a new tab"
                />
                <Divider type="vertical" />
                <SmallButton
                    icon={<SafetyCertificateOutlined />}
                    buttonClicked={() => props.verifyCustomDomain()}
                    tooltip="Verify website ownership"
                    requiredRights={['admin', 'developer']}
                />
                <Divider type="vertical" />
                <SmallButton
                    icon={<DeleteOutlined />}
                    buttonClicked={() =>
                        props.saveDomainName('__delete__', 'customDomain')
                    }
                    tooltip="Delete custom domain"
                    requiredRights={['admin', 'developer']}
                />
                <Divider type="horizontal" />
                {website ? (
                    website.customDomain && website.cname ? (
                        <div>
                            <p>
                                In order to use your custom domain you need to
                                create the following CNAME DNS record:
                            </p>
                            <p>
                                <span style={{ userSelect: 'all' }}>
                                    {website.cname}
                                </span>
                            </p>

                            <p>
                                Usually it takes 1-3 hours to connect a new
                                domain. Please, allow this time and check the
                                status.
                            </p>
                            <p>
                                If you want to verify your domain ownership and
                                make sure that nobody else could connect this
                                domain to other website add the following TXT
                                DNS record and press verify button:
                            </p>
                            <p>
                                <span style={{ userSelect: 'all' }}>
                                    {website._id}
                                </span>
                            </p>
                        </div>
                    ) : null
                ) : null}
            </div>
        </div>
    ) : null
}

const mapStateToProps = state => {
    return {
        currentWebsiteObject: state.mD.currentWebsiteObject,
        currentWebsiteId: state.mD.currentWebsiteId,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveDomainName: (value, key) =>
            dispatch(wsActions.saveDomainName(value, key)),
        changeWebsiteProperty: (key, value) =>
            dispatch(wsActions.changeWebsiteProperty(key, value)),
        verifyCustomDomain: () => dispatch(wsActions.verifyCustomDomain()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DomainsProperties)
