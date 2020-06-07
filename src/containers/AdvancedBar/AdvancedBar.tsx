import React, { memo } from 'react'
import { connect } from 'react-redux'
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import Tabs from 'antd/es/tabs'

import * as classes from './AdvancedBar.module.css'
import SizeDragController from './SizeDragController/SizeDragController'
import * as actions from '../../store/actions'
import Files from './Files/Files'
import Plugins from './Plugins/Plugins'
import Pages from './Pages/Pages'
import Templates from './Templates/Templates'
import Account from './Account/Account'
import Websites from './Websites/Websites'
import { useBeforeunload } from 'react-beforeunload'
import ReactResizeDetector from 'react-resize-detector'
import { initialStateType, initialState } from '../../store/reducer/reducer'
import { storeType } from '../../Types/store'

type Props = {
    changeBarSize: typeof actions.changeBarSize
    toggleFindMode: typeof actions.toggleFindMode
    savePropertiesOnLeave: typeof actions.savePropertiesOnLeave
    barSizes: typeof initialState.barSizes
    notSavedResources: typeof initialState.notSavedResources
    activeTab: storeType['activeTab']
}

const AdvancedBar = (props: Props) => {
    useBeforeunload(() => {
        if (props.notSavedResources.length > 0) {
            setTimeout(() => props.savePropertiesOnLeave(), 1)
            return 'Some data is not saved.'
        } else {
            props.savePropertiesOnLeave()
            return undefined
        }
    })

    const changeBarSize = () => props.changeBarSize()
    const { TabPane } = Tabs
    return (
        <div
            style={{ flex: '0 0 ' + props.barSizes.height + 'px' }}
            className={classes.mainContainer}
            tabIndex="0"
        >
            <div>
                <Tabs
                    defaultActiveKey="page"
                    animated={false}
                    size="small"
                    activeKey={props.activeTab}
                    tabBarExtraContent={
                        <SizeDragController
                            addClass={classes.heightControll}
                            vertical
                            startValue={props.barSizes.height}
                            type="height"
                        />
                    }
                    onChange={activeKey => props.setActiveTab(activeKey)}
                >
                    <TabPane tab="Pages" key="page" forceRender={true}>
                        <Pages />
                    </TabPane>
                    <TabPane tab="Templates" key="template" forceRender={true}>
                        <Templates />
                    </TabPane>
                    <TabPane tab="Plugins" key="plugin" forceRender={true}>
                        <Plugins />
                    </TabPane>
                    <TabPane tab="Files" key="file" forceRender={true}>
                        <Files />
                    </TabPane>
                    <TabPane tab="Websites" key="website" forceRender={true}>
                        <Websites />
                    </TabPane>
                    <TabPane tab="Account" key="account" forceRender={true}>
                        <Account />
                    </TabPane>
                </Tabs>

                <ReactResizeDetector
                    handleWidth
                    handleHeight
                    onResize={changeBarSize}
                />
            </div>
        </div>
    )
}

const mapStateToProps = (state: initialStateType) => {
    return {
        barSizes: state.barSizes,
        loading: state.loading,
        notSavedResources: state.notSavedResources,
        activeTab: state.activeTab,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeBarSize: initiator => dispatch(actions.changeBarSize(initiator)),
        toggleFindMode: value => dispatch(actions.toggleFindMode(value)),
        savePropertiesOnLeave: () => dispatch(actions.savePropertiesOnLeave()),
        setActiveTab: activeKey => dispatch(actions.setActiveTab(activeKey)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(memo(AdvancedBar))
