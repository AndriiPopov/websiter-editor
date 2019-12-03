import axios from 'axios';
import mockAdapter from 'axios-mock-adapter';
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as actionTypes from './actionTypes';
import * as actions from './builder';

const mockStore = configureStore([thunk])
const store = mockStore({})

describe('actions', ()=> {
    it('should choose box', () => {
        const expectedAction = { type: actionTypes.CHOOSE_BOX, item: 'element', ctrl: true }
        expect(actions.chooseBoxDo('element', true)).toEqual(expectedAction)
    })

    it('should choose box and set active menu item', async () => {
        const expectedActions = [
            { type: actionTypes.CHOOSE_BOX, ctrl: true, item: "element" }, 
            { type: actionTypes.CLICK_TOP_MENU_ITEM, item: "boxes" }
        ]
        const store = mockStore({})
        await store.dispatch(actions.chooseBox('element', true))
        expect(store.getActions()).toEqual(expectedActions)
    })

    it('should choose section', () => {
        const expectedAction = { type: actionTypes.CHOOSE_SECTION, item: 'element' }
        expect(actions.chooseSectionDo('element')).toEqual(expectedAction)
    })

    it('should choose section and set active menu item', async () => {
        const expectedActions = [
            { type: actionTypes.CHOOSE_SECTION, item: "element" }, 
            { type: actionTypes.CLICK_TOP_MENU_ITEM, item: "sections" }
        ]
        const store = mockStore({})
        await store.dispatch(actions.chooseSection('element', new Event('click')))
        expect(store.getActions()).toEqual(expectedActions)
    })

    it('should deselect elements', () => {
        const expectedAction = { type: actionTypes.DESELECT_ELEMENTS }
        expect(actions.deselectElements()).toEqual(expectedAction)
    })

    it('should deselect inner elements', () => {
        const expectedAction = { type: actionTypes.DESELECT_INNER, item: 'el' }
        expect(actions.deselectInner(new Event('click'), 'el')).toEqual(expectedAction)
    })

    it('should change element property value', async () => {
        const expectedAction = { 
            type: actionTypes.CHANGE_ELEMENT_PROPERTY_VALUE, 
            value: "someValue",
            key: "someKey",
            isSection: true,
            isNotForHistory: true 
        } 
        expect(actions.changeElementPropertyValue('someValue', 'someKey', true, true)).toEqual(expectedAction)
    })

    it('should change element property values', async () => {
        const expectedAction = { 
            type: actionTypes.CHANGE_ELEMENT_PROPERTY_VALUES, 
            items: ['items'],
            isNotForHistory: true
        } 
        expect(actions.changeElementPropertyValues( true, ['items'])).toEqual(expectedAction)
    })

    it('should delete Section', () => {
        const expectedAction = { type: actionTypes.DELETE_SECTION }
        expect(actions.deleteSection()).toEqual(expectedAction)
    })

    it('should add Section', () => {
        const expectedAction = { type: actionTypes.ADD_SECTION }
        expect(actions.addSection()).toEqual(expectedAction)
    })

    it('should duplicate Section', () => {
        const expectedAction = { type: actionTypes.DUPLICATE_SECTION }
        expect(actions.duplicateSection()).toEqual(expectedAction)
    })

    it('should move up Section', () => {
        const expectedAction = { type: actionTypes.MOVE_UP_SECTION }
        expect(actions.moveUpSection()).toEqual(expectedAction)
    })

    it('should move down Section', () => {
        const expectedAction = { type: actionTypes.MOVE_DOWN_SECTION }
        expect(actions.moveDownSection()).toEqual(expectedAction)
    })

    it('should delete box', () => {
        const expectedAction = { type: actionTypes.DELETE_BOX }
        expect(actions.deleteBox()).toEqual(expectedAction)
    })

    it('should add box', () => {
        const expectedAction = { type: actionTypes.ADD_BOX, rootElements: [ 'root' ], items: { element1: 'val' } }
        expect(actions.addBox([ 'root' ], { element1: 'val' })).toEqual(expectedAction)
    })

    it('should duplicate box', () => {
        const expectedAction = { type: actionTypes.DUPLICATE_BOX }
        expect(actions.duplicateBox()).toEqual(expectedAction)
    })

    it('should move up', () => {
        const expectedAction = { type: actionTypes.MOVE_UP_BOX }
        expect(actions.moveUpBox()).toEqual(expectedAction)
    })

    it('should move down', () => {
        const expectedAction = { type: actionTypes.MOVE_DOWN_BOX }
        expect(actions.moveDownBox()).toEqual(expectedAction)
    })

    it('should index up box', () => {
        const expectedAction = { type: actionTypes.ZINDEX_UP_BOX }
        expect(actions.zIndexUpBox()).toEqual(expectedAction)
    })

    it('should index down box', () => {
        const expectedAction = { type: actionTypes.ZINDEX_DOWN_BOX }
        expect(actions.zIndexDownBox()).toEqual(expectedAction)
    })

    it('should copy box', async () => {
        const expectedActions = [{
            type: actionTypes.ADD_ELEMENTS_TO_BUFFER,
            items: { element_undefined: { children: [], styles: []}}, 
            rootElements: ["element_undefined"]
        }]
        const store = mockStore({});
        await store.dispatch(actions.copyBox({ chosenBoxes: ['element1'], element1: {children: [], styles: []} }, { buffer: 'someBuffer' }))
        expect(store.getActions()).toEqual(expectedActions)
    })

    it('should cut box', async () => {
        const expectedActions = [
            {
                type: actionTypes.ADD_ELEMENTS_TO_BUFFER,
                items: { element_undefined: { children: [], styles: []}}, 
                rootElements: ["element_undefined"]
            },
            { type: actionTypes.DELETE_BOX }
        ]
        const store = mockStore({});
        await store.dispatch(actions.cutBox({ chosenBoxes: ['element1'], element1: {children: [], styles: []} }, { buffer: 'someBuffer' }))
        expect(store.getActions()).toEqual(expectedActions)
    })

    it('should paste box', async () => {
        const expectedActions = [
            { type: actionTypes.ADD_BOX, rootElements: [], items: {} }
        ]
        const store = mockStore({});
        await store.dispatch(actions.pasteBox({ chosenBoxes: ['element1'], element1: {children: [], styles: []} }, { chosenBoxes: ['element1'], element1: {children: [], styles: []}, rootElements: [] }))
        expect(store.getActions()).toEqual(expectedActions)
    })

    it('should enter box', () => {
        const expectedAction = { type: actionTypes.ENTER_BOX }
        expect(actions.enterBox()).toEqual(expectedAction)
    })

    it('should exit box', () => {
        const expectedAction = { type: actionTypes.EXIT_BOX }
        expect(actions.exitBox()).toEqual(expectedAction)
    })

    it('should clear style', () => {
        const expectedAction = { type: actionTypes.CLEAR_STYLE, isSection: true, value: '1234' }
        expect(actions.clearStyle('1234', true)).toEqual(expectedAction)
    })

    it('should change align mode', () => {
        const expectedAction = { type: actionTypes.CHANGE_ALIGN_MODE, value: 'parent' }
        expect(actions.changeAlignMode('parent')).toEqual(expectedAction)
    })

    it('should align boxes', () => {
        const expectedAction = { type: actionTypes.ALIGN_BOXES, alignType: 'type' }
        expect(actions.alignBoxes('type')).toEqual(expectedAction)
    })

    it('should set state hover', () => {
        const expectedAction = { type: actionTypes.SET_STATE_HOVER, isSection: true }
        expect(actions.setStateHover(true)).toEqual(expectedAction)
    })

    it('should set state active', () => {
        const expectedAction = { type: actionTypes.SET_STATE_ACTIVE, isSection: true }
        expect(actions.setStateActive(true)).toEqual(expectedAction)
    })

    it('should unset hover and active states', () => {
        const expectedAction = { type: actionTypes.UNSET_STATE_HOVER_ACTIVE }
        expect(actions.unsetStateHoverActive()).toEqual(expectedAction)
    })

    it('should builder zoom out', () => {
        const expectedAction = { type: actionTypes.BUILDER_ZOOM_OUT }
        expect(actions.builderZoomOut()).toEqual(expectedAction)
    })

    it('should builder zoom in', () => {
        const expectedAction = { type: actionTypes.BUILDER_ZOOM_IN }
        expect(actions.builderZoomIn()).toEqual(expectedAction)
    })

    it('should builder zoom reset', () => {
        const expectedAction = { type: actionTypes.BUILDER_ZOOM_RESET }
        expect(actions.builderZoomReset()).toEqual(expectedAction)
    })

    it('should save to history', () => {
        const expectedAction = { type: actionTypes.SAVE_TO_HISTORY }
        expect(actions.saveToHistory()).toEqual(expectedAction)
    })

    it('should preview page', () => {
        const expectedAction = { type: actionTypes.PREVIEW_PAGE }
        expect(actions.previewPage()).toEqual(expectedAction)
    })

    it('should u[pdate text values', () => {
        const expectedAction = { type: actionTypes.UPDATE_TEXT_VALUES, values: { keys: 'type' } }
        expect(actions.updateTextValues({ keys: 'type' })).toEqual(expectedAction)
    })

    it('should load current page to builder', () => {
        const expectedAction = { 
            type: actionTypes.LOAD_CURRENT_PAGE_TO_BUILDER,  
            _id: 'page1',
            resourcesObjects: { page1: 'something' },
            pageObject: { key: 'value' }
        }
        expect(actions.loadCurrentPageToBuilder('page1', { page1: 'something' }, { key: 'value' })).toEqual(expectedAction)
    })

    it('should mark page as saved', () => {
        const expectedAction = { type: actionTypes.MARK_PAGE_AS_SAVED }
        expect(actions.markPageAsSaved('type')).toEqual(expectedAction)
    })

    it('should mark page as leaving', () => {
        const expectedAction = { type: actionTypes.MARK_PAGE_AS_LEAVING }
        expect(actions.markPageAsLeaving('type')).toEqual(expectedAction)
    })

})