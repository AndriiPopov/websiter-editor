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

type Props = {
    changeBarSize: typeof actions.changeBarSize
    toggleFindMode: typeof actions.toggleFindMode
    savePropertiesOnLeave: typeof actions.savePropertiesOnLeave
    barSizes: typeof initialState.barSizes
    notSavedResources: typeof initialState.notSavedResources
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
                    defaultActiveKey="pages"
                    animated={false}
                    size="small"
                    tabBarExtraContent={
                        <SizeDragController
                            addClass={classes.heightControll}
                            vertical
                            startValue={props.barSizes.height}
                            type="height"
                        />
                    }
                >
                    <TabPane tab="Pages" key="pages" forceRender={true}>
                        <Pages />
                    </TabPane>
                    <TabPane tab="Templates" key="templates" forceRender={true}>
                        <Templates />
                    </TabPane>
                    <TabPane tab="Plugins" key="plugins" forceRender={true}>
                        <Plugins />
                    </TabPane>
                    <TabPane tab="Files" key="files" forceRender={true}>
                        <Files />
                    </TabPane>
                    <TabPane tab="Websites" key="websites" forceRender={true}>
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
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeBarSize: initiator => dispatch(actions.changeBarSize(initiator)),
        toggleFindMode: value => dispatch(actions.toggleFindMode(value)),
        savePropertiesOnLeave: () => dispatch(actions.savePropertiesOnLeave()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(memo(AdvancedBar))
