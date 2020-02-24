import React, { memo } from 'react'
import { connect } from 'react-redux'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import * as classes from './AdvancedBar.module.css'
import SizeDragController from './SizeDragController/SizeDragController'
import * as actions from '../../store/actions'
import Images from './Images/Images'
import Plugins from './Plugins/Plugins'
import Pages from './Pages/Pages'
import Templates from './Templates/Templates'
import Account from './Account/Account'
import Websites from './Websites/Websites'
import { useBeforeunload } from 'react-beforeunload'
import ReactResizeDetector from 'react-resize-detector'

import type { initialStateType } from '../../store/reducer/reducer'

type Props = {
    undoResourceVersion: typeof actions.undoResourceVersion,
    redoResourceVersion: typeof actions.redoResourceVersion,
    setCurrentTopTab: typeof actions.setCurrentTopTab,
    changeBarSize: typeof actions.changeBarSize,
    toggleFindMode: typeof actions.toggleFindMode,
    barSizes: $PropertyType<initialStateType, 'barSizes'>,
}

const AdvancedBar = (props: Props) => {
    const tabClass = ['react-tabs__tab', classes.reactTabsTab].join(' ')

    const pannelClass = [
        'react-tabs__tab-panel--selected',
        classes.reactTabsTabPanelSelected,
    ].join(' ')

    const tabClassSelected = [
        'react-tabs__tab--selected',
        classes.TabSelected,
    ].join(' ')

    const undoRedoTabNames = ['page', 'template', 'plugin', '', '', '', '']

    const handleKeyDown = e => {
        if (!e.shiftKey && e.ctrlKey && (e.key === 'z' || e.key === 'Z'))
            props.undoResourceVersion()
        if (e.shiftKey && e.ctrlKey && (e.key === 'z' || e.key === 'Z'))
            props.redoResourceVersion()
    }

    const handleTabSelected = index => {
        props.setCurrentTopTab(undoRedoTabNames[index])
        props.changeBarSize()
        props.toggleFindMode()
    }

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

    return (
        <div
            style={{ flex: '0 1 ' + props.barSizes.height + 'px' }}
            className={classes.mainContainer}
            tabIndex="0"
            onKeyDown={e => handleKeyDown(e)}
        >
            <SizeDragController
                addClass={classes.heightControll}
                vertical
                startValue={props.barSizes.height}
                type="height"
            />
            <Tabs
                className={['react-tabs', classes.reactTabs].join(' ')}
                onSelect={index => handleTabSelected(index)}
                selectedTabClassName={tabClassSelected}
                selectedTabPanelClassName={pannelClass}
            >
                <TabList className={classes.TabList}>
                    <Tab className={tabClass}>Pages</Tab>
                    <Tab className={tabClass}>Templates</Tab>
                    <Tab className={tabClass}>Plugins</Tab>
                    <Tab className={tabClass}>Media files</Tab>
                    <Tab className={tabClass}>Websites</Tab>
                    <Tab className={tabClass}>Account</Tab>
                </TabList>

                <TabPanel>
                    <Pages />
                </TabPanel>
                <TabPanel>
                    <Templates />
                </TabPanel>
                <TabPanel>
                    <Plugins />
                </TabPanel>
                <TabPanel>
                    <Images />
                </TabPanel>
                <TabPanel>
                    <Websites />
                </TabPanel>
                <TabPanel>
                    <Account />
                </TabPanel>
            </Tabs>
            <ReactResizeDetector
                handleWidth
                handleHeight
                onResize={changeBarSize}
            />
        </div>
    )
}

const mapStateToProps = state => {
    return {
        barSizes: state.barSizes,
        loading: state.loading,
        notSavedResources: state.notSavedResources,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeBarSize: initiator => dispatch(actions.changeBarSize(initiator)),
        setCurrentTopTab: currentTopTab =>
            dispatch(actions.setCurrentTopTab(currentTopTab)),
        undoResourceVersion: () => dispatch(actions.undoResourceVersion()),
        redoResourceVersion: () => dispatch(actions.redoResourceVersion()),
        toggleFindMode: value => dispatch(actions.toggleFindMode(value)),
        savePropertiesOnLeave: () => dispatch(actions.savePropertiesOnLeave()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(memo(AdvancedBar))
