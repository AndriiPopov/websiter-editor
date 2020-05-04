import React from 'react'
import Tabs from 'antd/es/tabs'
import DomainsProperties from './DomainsProperties/DomainsProperties'
import SharingProperties from './SharingProperties/SharingProperties'

const WebsitesProperties = props => (
    <Tabs defaultActiveKey="domain" animated={false} size="small">
        <Tabs.TabPane tab="Domains" key="domain">
            <DomainsProperties />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Sharing" key="sharing">
            <SharingProperties />
        </Tabs.TabPane>
    </Tabs>
)

export default WebsitesProperties
