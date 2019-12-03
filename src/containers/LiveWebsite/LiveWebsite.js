import React from 'react'
import { connect } from 'react-redux'

import * as actions from '../../store/actions/index'

const LiveWebsite = props => {
    let id
    const path = window.currentPage.split('/')
    if (path.length > 0) {
        id = window.pagesStructure.find(
            item => item.url === path[path.length - 1]
        ).id
    } else {
        id = window.pagesStructure.find(item => item.isHomePage).id
    }

    if (!id) {
        return
    }
    props.loadGlobalsToStore(id)
    props.setCurrentPageMain(id)

    return props.sections.map(section => (
        <div
            key={section}
            id={section}
            handleChooseTextEditor={() => {}}
            live
        />
    ))
}

const mapStateToProps = state => {
    return {
        sections: state.builder.present.sectionsOnPage,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadGlobalsToStore: currentPage => {
            dispatch(
                actions.loadGlobalsToStore(
                    window.pagesStructure,
                    window.pagesObjects,
                    currentPage
                )
            )
        },
        setCurrentPageMain: currentPage => {
            dispatch(
                actions.setCurrentPageMain(
                    currentPage,
                    window.pagesObjects,
                    'any'
                )
            )
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LiveWebsite)
