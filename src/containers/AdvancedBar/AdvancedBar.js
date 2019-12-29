import React from 'react'
import { connect } from 'react-redux'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import * as classes from './AdvancedBar.module.css'
import SizeDragController from './SizeDragController/SizeDragController'
import * as actions from '../../store/actions'
import Images from './Images/Images'
import Plugins from './Plugins/Plugins'
import Pages from './Pages/Pages'
import Account from './Account/Account'
import Websites from './Websites/Websites'

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

    const undoRedoTabNames = ['page', 'plugin', '', '', '', '']

    const handleKeyDown = e => {
        if (!e.shiftKey && e.ctrlKey && (e.key === 'z' || e.key === 'Z'))
            props.undoResourceVersion()
        if (e.shiftKey && e.ctrlKey && (e.key === 'z' || e.key === 'Z'))
            props.redoResourceVersion()
    }

    const handleTabSelected = index => {
        props.setCurrentTopTab(undoRedoTabNames[index])
        props.changeBarSize(props.barSizes)
        props.toggleFindMode()
    }

    return (
        <div
            style={{ height: props.barSizes.height + 'px' }}
            className={classes.mainContainer}
            tabIndex="0"
            onKeyDown={e => handleKeyDown(e)}
        >
            <SizeDragController
                addClass={classes.heightControll}
                vertical
                startValue={props.barSizes.height}
                changed={value => {
                    props.changeBarSize(props.barSizes, {
                        key: 'height',
                        value,
                    })
                }}
            />
            <Tabs
                className={['react-tabs', classes.reactTabs].join(' ')}
                onSelect={index => handleTabSelected(index)}
                selectedTabClassName={tabClassSelected}
                selectedTabPanelClassName={pannelClass}
            >
                <TabList className={classes.TabList}>
                    <Tab className={tabClass}>Pages</Tab>
                    <Tab className={tabClass}>Plugins</Tab>
                    <Tab className={tabClass}>Media files</Tab>
                    <Tab className={tabClass}>Websites</Tab>
                    <Tab className={tabClass}>Account</Tab>
                </TabList>

                <TabPanel>
                    <Pages />
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
        </div>
    )
}

const mapStateToProps = state => {
    return {
        barSizes: state.barSizes,
        loading: state.loading,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeBarSize: (barSizes, initiator) =>
            dispatch(actions.changeBarSize(barSizes, initiator)),
        setCurrentTopTab: currentTopTab =>
            dispatch(actions.setCurrentTopTab(currentTopTab)),
        undoResourceVersion: () => dispatch(actions.undoResourceVersion()),
        redoResourceVersion: () => dispatch(actions.redoResourceVersion()),
        toggleFindMode: value => dispatch(actions.toggleFindMode(value)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdvancedBar)
