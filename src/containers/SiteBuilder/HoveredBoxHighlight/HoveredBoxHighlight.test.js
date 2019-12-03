import React from 'react'
import { cleanup } from 'react-testing-library'
import 'jest-dom/extend-expect'

import renderWithRedux from '../../utils/renderWithRedux'
import SiteBuilder from './SiteBuilder'
import { initialState as builderInitialState } from '../../store/reducers/BuilderReducer/builder'

const builderAdditionalState = {
    sectionsOnPage: ['element_0'],
    currentId: 2,
    element_0: {
        type: 'section',
        height: 200,
        space: 50,
        background: 'rgba(200, 100, 30)',
        header: false,
        footer: false,
        allPages: false,
        children: ['element_1', 'element_2'],
        styles: [],
    },
    element_1: {
        type: 'box',
        height: 100,
        width: 100,
        left: 200,
        top: 100,
        background: 'rgba(100, 0, 80)',
        zIndex: 0,
        children: [],
        parent: 'element_0',
        styles: [],
        borderOn: true,
        borderSize: 5,
        borderHOffset: 6,
        borderVOffset: 7,
        borderBlur: 8,
        borderInset: false,
        mapOn: true,
        mapAddress: 'Test address',
        mapZoom: 4,
        mapSatellite: true,
        mapOuter: true,
    },
    element_2: {
        type: 'box',
        height: 100,
        width: 100,
        left: 200,
        top: 100,
        background: 'rgba(100, 0, 80)',
        zIndex: 0,
        children: [],
        parent: 'element_0',
        styles: [],
        borderOn: true,
        borderSize: 5,
        borderHOffset: 6,
        borderVOffset: 7,
        borderBlur: 8,
        borderInset: false,
        mapOn: true,
        mapAddress: 'Test address',
        mapZoom: 4,
        mapSatellite: true,
        mapOuter: true,
    },
}

afterEach(cleanup)

test('can render', async () => {
    renderWithRedux(<SiteBuilder />, {
        initialState: {
            builder: {
                ...builderInitialState,
                ...builderAdditionalState,
            },
        },
    })
    // await wait(() => {
    //     container.getByTestId('siteBuilder')
    // })
    // expect(container.getByTestId('siteBuilder')).toBeDefined()
    // expect(container.getByTestId('sectionMain')).toBeDefined()
    // expect(container.getByTestId('box_element_1_out')).toBeDefined()
    // expect(container.getByTestId('box_element_1_in')).toBeDefined()
    // expect(container.getByTestId('boxCoverDiv')).toBeDefined()

    // const style = container.getByTestId('box_element_1_out')
})
