import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import * as classes from '../../../../components/ElementsTreeAndProperties/Properties/Properties.module.css'
import DomainsProperties from './DomainsProperties/DomainsProperties'
import SharingProperties from './SharingProperties/SharingProperties'

const WebsitesProperties = props => {
    const tabClass = ['react-tabs__tab', classes.reactTabsTab].join(' ')
    const pannelClass = [
        'react-tabs__tab-panel--selected',
        classes.reactTabsTabPanelSelected,
    ].join(' ')
    return (
        <Tabs
            className={['react-tabs', classes.reactTabs].join(' ')}
            selectedTabPanelClassName={pannelClass}
        >
            <TabList>
                <Tab className={tabClass}>Domains</Tab>
                <Tab className={tabClass}>Sharing</Tab>
            </TabList>
            <TabPanel>
                <DomainsProperties />
            </TabPanel>
            <TabPanel>
                <SharingProperties />
            </TabPanel>
        </Tabs>
    )
}

export default WebsitesProperties
