import axios from 'axios'
import mockAdapter from 'axios-mock-adapter'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as actionTypes from './actionTypes'
import * as actions from './website'

const mockStore = configureStore([thunk])

describe('actions', () => {
    it('should create a new website', async () => {
        const mock = new mockAdapter(axios)
        mock.onPost('/api/websites')
            .replyOnce(200, {
                currentPage: 'page34',
                pagesObjects: { page34: { key1: 12345 } },
            })
            .onPost('/api/websites')
            .replyOnce(400, { success: false })

        const expectedActionSuccess = [
            { type: actionTypes.ACTION_START },
            {
                type: actionTypes.SAVE_WEBSITE_DATA_FROM_SERVER,
                data: {
                    currentPage: 'page34',
                    pagesObjects: { page34: { key1: 12345 } },
                },
            },
            {
                type: actionTypes.LOAD_CURRENT_PAGE_TO_BUILDER,
                _id: 'page34',
                pageObject: undefined,
                pagesObjects: { page34: { key1: 12345 } },
            },
        ]

        const store = mockStore({})
        await store.dispatch(actions.addWebsite())
        expect(store.getActions()).toEqual(expectedActionSuccess)

        const expectedActionFail = [
            { type: actionTypes.ACTION_START },
            {
                type: actionTypes.ACTION_FAIL,
                error: 'Request failed with status code 400',
            },
        ]

        const store1 = mockStore({})
        await store1.dispatch(actions.addWebsite())
        expect(store1.getActions()).toEqual(expectedActionFail)
    })

    it('should load website', async () => {
        const mock = new mockAdapter(axios)
        mock.onGet('/api/websites/web34')
            .replyOnce(200, {
                currentPage: 'page34',
                pagesObjects: { page34: { key1: 12345 } },
            })
            .onGet('/api/websites/web35')
            .replyOnce(400, { success: false })

        const expectedActionSuccess = [
            { type: actionTypes.ACTION_START },
            {
                type: actionTypes.LOAD_WEBSITE_FROM_SERVER,
                data: {
                    currentPage: 'page34',
                    pagesObjects: { page34: { key1: 12345 } },
                },
            },
            {
                type: actionTypes.LOAD_CURRENT_PAGE_TO_BUILDER,
                _id: 'page34',
                pageObject: undefined,
                pagesObjects: { page34: { key1: 12345 } },
            },
        ]

        const store = mockStore({})
        await store.dispatch(actions.loadWebsite('web34'))
        expect(store.getActions()).toEqual(expectedActionSuccess)

        const expectedActionFail = [
            { type: actionTypes.ACTION_START },
            {
                type: actionTypes.ACTION_FAIL,
                error: 'Request failed with status code 400',
            },
        ]

        const store1 = mockStore({})
        await store1.dispatch(actions.loadWebsite('web35'))
        expect(store1.getActions()).toEqual(expectedActionFail)
    })

    it('should save website properties', async () => {
        const mock = new mockAdapter(axios)
        mock.onPut('/api/websites/web34')
            .replyOnce(200, { sampleKey: 123 })
            .onPut('/api/websites/web35')
            .replyOnce(400, { success: false })

        const expectedActionSuccess = [
            { type: actionTypes.ACTION_START },
            {
                type: actionTypes.SAVE_WEBSITE_DATA_FROM_SERVER,
                data: { sampleKey: 123 },
            },
        ]

        const store = mockStore({})
        await store.dispatch(
            actions.saveWebsiteSettings('web34', 'title', 'domain')
        )
        expect(store.getActions()).toEqual(expectedActionSuccess)

        const expectedActionFail = [
            { type: actionTypes.ACTION_START },
            {
                type: actionTypes.ACTION_FAIL,
                error: 'Request failed with status code 400',
            },
        ]

        const store1 = mockStore({})
        await store1.dispatch(
            actions.saveWebsiteSettings('web35', 'title', 'domain')
        )
        expect(store1.getActions()).toEqual(expectedActionFail)
    })

    it('should delete website ', async () => {
        const mock = new mockAdapter(axios)
        mock.onDelete('/api/websites/web34')
            .replyOnce(200, {
                currentPage: 'page34',
                pagesObjects: { page34: { key1: 12345 } },
            })
            .onDelete('/api/websites/web35')
            .replyOnce(400, { success: false })

        const expectedActionSuccess = [
            { type: actionTypes.ACTION_START },
            {
                type: actionTypes.SAVE_WEBSITE_DATA_FROM_SERVER,
                data: {
                    currentPage: 'page34',
                    pagesObjects: { page34: { key1: 12345 } },
                },
            },
            {
                type: actionTypes.LOAD_CURRENT_PAGE_TO_BUILDER,
                _id: 'page34',
                pageObject: undefined,
                pagesObjects: { page34: { key1: 12345 } },
            },
        ]

        const store = mockStore({})
        await store.dispatch(actions.deleteWebsite('web34', 'title', 'domain'))
        expect(store.getActions()).toEqual(expectedActionSuccess)

        const expectedActionFail = [
            { type: actionTypes.ACTION_START },
            {
                type: actionTypes.ACTION_FAIL,
                error: 'Request failed with status code 400',
            },
        ]

        const store1 = mockStore({})
        await store1.dispatch(actions.deleteWebsite('web35', 'title', 'domain'))
        expect(store1.getActions()).toEqual(expectedActionFail)
    })

    // it('should add page', async () => {
    //     const mock = new mockAdapter(axios)
    //     mock
    //         .onPost('/api/pages').replyOnce(200, { page: { _id: '123' }, pagesStructure: {page34: { key1: 12345 } } })
    //         .onPost('/api/pages').replyOnce(400, { success: false })

    //     const expectedActionSuccess = [
    //         { type: actionTypes.ACTION_START },
    //         { type: actionTypes.ADD_PAGE_SUCCESS, page: { _id: '123' }, pagesStructure: {page34: { key1: 12345 } } },
    //         { type: actionTypes.LOAD_CURRENT_PAGE_TO_BUILDER, _id: '123', pageObject: { _id: '123' }, pagesObjects: null }
    //     ]

    //     const store = mockStore({})
    //     await store.dispatch(actions.addPage('web34', 'page23'))
    //     expect(store.getActions()).toEqual(expectedActionSuccess)

    //     const expectedActionFail = [
    //         { type: actionTypes.ACTION_START },
    //         { type: actionTypes.ACTION_FAIL, error: "Request failed with status code 400" }
    //     ]

    //     const store1 = mockStore({})
    //     await store1.dispatch(actions.addPage('web34', 'page23'))
    //     expect(store1.getActions()).toEqual(expectedActionFail)
    // })

    // it('should add page with success', () => {
    //     const expectedAction = { type: actionTypes.ADD_PAGE_SUCCESS, page: { _id: '123' }, pagesStructure: { key: 'val' } }
    //     expect(actions.addPageSuccess({ page: { _id: '123' }, pagesStructure: { key: 'val' }})).toEqual(expectedAction)
    // })

    // it('should delete page with success', () => {
    //     const expectedAction = { type: actionTypes.DELETE_PAGE_SUCCESS, currentPage: '123', pagesStructure: { key: 'val' } }
    //     expect(actions.deletePageSuccess({currentPage: '123', pagesStructure: { key: 'val' }})).toEqual(expectedAction)
    // })

    // it('should delete page', async () => {
    //     const mock = new mockAdapter(axios)
    //     mock
    //         .onDelete('/api/pages/page1').replyOnce(200, { currentPage: 'page2', pagesStructure: {page2: { key1: 12345 } } })
    //         .onDelete('/api/pages/page2').replyOnce(400, { success: false })

    //     const expectedActionSuccess = [
    //         { type: actionTypes.ACTION_START },
    //         { type: actionTypes.DELETE_PAGE_SUCCESS, currentPage: 'page2', pagesStructure: {page2: { key1: 12345 } } },
    //         { type: actionTypes.LOAD_CURRENT_PAGE_TO_BUILDER, _id: 'page2', pageObject: undefined, pagesObjects: { page2: { key23: 'something' } } }
    //     ]

    //     const store = mockStore({})
    //     await store.dispatch(actions.deletePage('page1', { page2: { key23: 'something' } } ))
    //     expect(store.getActions()).toEqual(expectedActionSuccess)

    //     const expectedActionFail = [
    //         { type: actionTypes.ACTION_START },
    //         { type: actionTypes.ACTION_FAIL, error: "Request failed with status code 400" }
    //     ]

    //     const store1 = mockStore({})
    //     await store1.dispatch(actions.deletePage('page2', 'page23'))
    //     expect(store1.getActions()).toEqual(expectedActionFail)
    // })

    // it('should duplicate page', async () => {
    //     const mock = new mockAdapter(axios)
    //     mock
    //         .onPost('/api/pages').replyOnce(200, { page: { _id: '123' }, pagesStructure: {page34: { key1: 12345 } } })
    //         .onPost('/api/pages').replyOnce(400, { success: false })

    //     const expectedActionSuccess = [
    //         { type: actionTypes.ACTION_START },
    //         { type: actionTypes.ADD_PAGE_SUCCESS, page: { _id: '123' }, pagesStructure: {page34: { key1: 12345 } } },
    //         { type: actionTypes.LOAD_CURRENT_PAGE_TO_BUILDER, _id: '123', pageObject: { _id: '123' }, pagesObjects: null }
    //     ]

    //     const store = mockStore({})
    //     await store.dispatch(actions.duplicatePage('website1', 'page4'))
    //     expect(store.getActions()).toEqual(expectedActionSuccess)

    //     const expectedActionFail = [
    //         { type: actionTypes.ACTION_START },
    //         { type: actionTypes.ACTION_FAIL, error: "Request failed with status code 400" }
    //     ]

    //     const store1 = mockStore({})
    //     await store1.dispatch(actions.duplicatePage('website1', 'page4'))
    //     expect(store1.getActions()).toEqual(expectedActionFail)
    // })

    // it('should set url not valid', () => {
    //     const expectedAction = { type: actionTypes.SET_URL_IS_NOT_VALID }
    //     expect(actions.setUrlIsNotValid()).toEqual(expectedAction)
    // })

    // it('should save pages structure to store', () => {
    //     const expectedAction = { type: actionTypes.SAVE_PAGE_STRUCTURE_TO_STORE, pagesStructure: { some: 'thing' } }
    //     expect(actions.savePagesStructureToStore({ some: 'thing' })).toEqual(expectedAction)
    // })

    // it('should save pages structure', async () => {
    //     const mock = new mockAdapter(axios)
    //     mock
    //         .onPut('/api/websites/web1').replyOnce(200, { urlNotOk: true })
    //         .onPut('/api/websites/web1').replyOnce(200, { page: { _id: '123' }, pagesStructure: {page34: { key1: 12345 } } })
    //         .onPut('/api/websites/web2').replyOnce(400, { success: false })

    //     const expectedActionUrlNotOk = [
    //         { type: actionTypes.ACTION_START },
    //         { type: actionTypes.ACTION_SUCCESS },
    //         { type: actionTypes.SET_URL_IS_NOT_VALID }
    //     ]

    //     const store0 = mockStore({})
    //     await store0.dispatch(actions.savePagesStructure('web1', [ { _id: 'page1' } ]))
    //     expect(store0.getActions()).toEqual(expectedActionUrlNotOk)

    //     const expectedActionSuccess = [
    //         { type: actionTypes.ACTION_START },
    //         { type: actionTypes.ACTION_SUCCESS },
    //         { type: actionTypes.SAVE_PAGE_STRUCTURE_TO_STORE, pagesStructure: [ { _id: 'page1' } ] }
    //     ]

    //     const store = mockStore({})
    //     await store.dispatch(actions.savePagesStructure('web1', [ { _id: 'page1' } ]))
    //     expect(store.getActions()).toEqual(expectedActionSuccess)

    //     const expectedActionFail = [
    //         { type: actionTypes.ACTION_START },
    //         { type: actionTypes.ACTION_FAIL, error: "Request failed with status code 400" }
    //     ]

    //     const store1 = mockStore({})
    //     await store1.dispatch(actions.savePagesStructure('web2', 'page4'))
    //     expect(store1.getActions()).toEqual(expectedActionFail)
    // })

    // it('should set current page', () => {
    //     const expectedAction = { type: actionTypes.SET_CURRENT_PAGE, _id: 'page1' }
    //     expect(actions.setCurrentPage('page1')).toEqual(expectedAction)
    // })

    // it('should set current page main function', async () => {
    //     const mock = new mockAdapter(axios)
    //     mock
    //         .onPut('/api/websites/currentpage/web1').replyOnce(200, { page: { _id: '123' }, pagesStructure: {page34: { key1: 12345 } } })
    //         .onPut('/api/websites/currentpage/web2').replyOnce(400, { success: false })

    //     const expectedActionSuccess = [
    //         { type: actionTypes.ACTION_START_PAGE_LOAD },
    //         { type: actionTypes.SET_CURRENT_PAGE, _id: 'page1' },
    //         { type: actionTypes.LOAD_CURRENT_PAGE_TO_BUILDER, _id: 'page1', pageObject: undefined, pagesObjects: { _id: 'page1' } },
    //         { type: actionTypes.ACTION_SUCCESS_PAGE_LOAD },
    //         { type: '@@redux-undo/CLEAR_HISTORY'}
    //     ]

    //     const store = mockStore({})
    //     await store.dispatch(actions.setCurrentPageMain('page1', { _id: 'page1' }, 'web1'))
    //     expect(store.getActions()).toEqual(expectedActionSuccess)

    //     const expectedActionFail = [
    //         { type: actionTypes.ACTION_START_PAGE_LOAD },
    //         { type: actionTypes.SET_CURRENT_PAGE, _id: 'page1' },
    //         { type: actionTypes.LOAD_CURRENT_PAGE_TO_BUILDER, _id: 'page1', pageObject: undefined, pagesObjects: { _id: 'page1' } },
    //         { type: actionTypes.ACTION_FAIL, error: "Request failed with status code 400" },
    //         { type: '@@redux-undo/CLEAR_HISTORY'}

    //     ]

    //     const store1 = mockStore({})
    //     await store1.dispatch(actions.setCurrentPageMain('page1', { _id: 'page1' }, 'web2'))
    //     expect(store1.getActions()).toEqual(expectedActionFail)
    // })

    // it('should save page in state', () => {
    //     const expectedAction = { type: actionTypes.SAVE_PAGE_IN_STATE, top: 20, title: 'fir' }
    //     expect(actions.savePageInState({ top: 20, title: 'fir' })).toEqual(expectedAction)
    // })

    // it('should save page', async () => {
    //     const mock = new mockAdapter(axios)
    //     mock
    //         .onPut('/api/pages/page1').replyOnce(200, { success: true })
    //         .onPut('/api/pages/page2').replyOnce(400, { success: false })

    //     const expectedActionSuccess = [
    //         { type: actionTypes.ACTION_START },
    //         { type: actionTypes.SAVE_PAGE_IN_STATE, bottom: 200 },
    //         { type: actionTypes.MARK_PAGE_AS_SAVED },
    //         { type: actionTypes.SAVE_PAGE_STRUCTURE_TO_STORE, pagesStructure: [ { _id: 'page1' } ] },
    //         { type: actionTypes.ACTION_SUCCESS }
    //     ]

    //     const store = mockStore({})
    //     await store.dispatch(actions.savePage({ bottom: 200 }, 'page1', [ { _id: 'page1' } ]))
    //     expect(store.getActions()).toEqual(expectedActionSuccess)

    //     const expectedActionFail = [
    //         { type: actionTypes.ACTION_START },
    //         { type: actionTypes.SAVE_PAGE_IN_STATE, bottom: 200 },
    //         { type: actionTypes.MARK_PAGE_AS_SAVED },
    //         { type: actionTypes.ACTION_FAIL, error: "Request failed with status code 400" }
    //     ]

    //     const store1 = mockStore({})
    //     await store1.dispatch(actions.savePage({ bottom: 200 }, 'page2', [ { _id: 'page1' } ] ))
    //     expect(store1.getActions()).toEqual(expectedActionFail)
    // })

    // it('should save page in pagesStructure', async () => {
    //     const mock = new mockAdapter(axios)
    //     mock
    //         .onPut('/api/websites/web1').replyOnce(200, { page: { _id: '123' }, pagesStructure: {page34: { key1: 12345 } } })

    //     const expectedActionSuccess = [
    //         { type: actionTypes.ACTION_START },
    //         { type: actionTypes.ACTION_SUCCESS },
    //         { type: actionTypes.SAVE_PAGE_STRUCTURE_TO_STORE, pagesStructure: [ { bottom: 300, id: "page1"}, { id: "page2" } ] }
    //     ]

    //     const store = mockStore({})
    //     await store.dispatch(actions.savePageInPagesStructure({ bottom: 300 }, 'page1', [ { id: 'page1' }, { id: 'page2'} ], 'web1'))
    //     expect(store.getActions()).toEqual(expectedActionSuccess)

    //     const expectedActionFail = []

    //     const store1 = mockStore({})
    //     await store1.dispatch(actions.savePageInPagesStructure({ bottom: 300 }, 'page1', [ { id: 'page3' }, { id: 'page2'} ], 'website1'))
    //     expect(store1.getActions()).toEqual(expectedActionFail)
    // })

    // it('should save page in pagesStructure Home Page', async () => {
    //     const mock = new mockAdapter(axios)
    //     mock
    //         .onPut('/api/websites/web1').replyOnce(200, { page: { _id: '123' }, pagesStructure: {page34: { key1: 12345 } } })
    //         .onPut('/api/websites/web2').replyOnce(200, { page: { _id: '123' }, pagesStructure: {page34: { key1: 12345 } } })

    //     const expectedActionSuccess = [
    //         { type: actionTypes.ACTION_START },
    //         { type: actionTypes.ACTION_SUCCESS },
    //         { type: actionTypes.SAVE_PAGE_STRUCTURE_TO_STORE, pagesStructure: [ { id: "page1", isHomePage: true }, { id: "page2", isHomePage: false } ] }
    //     ]

    //     const store = mockStore({})
    //     await store.dispatch(actions.savePageInPagesStructureHomePage({ isHomePage: true }, 'page1', [ { id: 'page1' }, { id: 'page2'} ], 'web1'))
    //     expect(store.getActions()).toEqual(expectedActionSuccess)

    //     const expectedActionFail = []

    //     const store1 = mockStore({})
    //     await store1.dispatch(actions.savePageInPagesStructure({ isHomePage: true }, 'page1', [ { id: 'page3' }, { id: 'page2'} ], 'web2'))
    //     expect(store1.getActions()).toEqual(expectedActionFail)
    // })

    // it('should publish page', async () => {
    //     const mock = new mockAdapter(axios)

    //     mock
    //         .onPost('/api/pages/publish').replyOnce( config => {
    //             const data = JSON.parse(config.data)
    //             if(data.pagesStructure[0].isNotPublished === false && data.pagesStructure[1].isNotPublished === true && data.websiteId === 'web1' ) {
    //                 return [200, {
    //                     ok: true
    //                 }]
    //             } else {
    //                 return [400, {
    //                     urlNotOk: false
    //                 }]
    //             }
    //         })
    //         .onPost('/api/pages/publish').replyOnce( config => {
    //             const data = JSON.parse(config.data)
    //             if(data.pagesStructure[0].isNotPublished === false && data.pagesStructure[1].isNotPublished === false  && data.websiteId === 'web1' ) {
    //                 return [200, {
    //                     ok: true
    //                 }]
    //             } else {
    //                 return [400, {
    //                     urlNotOk: false
    //                 }]
    //             }
    //         })
    //         .onPost('/api/pages/publish').replyOnce(400, { success: false })

    //     const expectedActionSuccess = [
    //         { type: actionTypes.ACTION_START },
    //         { type: actionTypes.ACTION_SUCCESS }
    //     ]

    //     const store0 = mockStore({})
    //     await store0.dispatch(actions.publishPage('web1', 'page1', [ { id: 'page1', isNotPublished: true }, { id: 'page2', isNotPublished: true } ], true))
    //     expect(store0.getActions()).toEqual(expectedActionSuccess)

    //     const store = mockStore({})
    //     await store.dispatch(actions.publishPage('web1', 'page1', [ { id: 'page1', isNotPublished: true }, { id: 'page2', isNotPublished: true } ], false))
    //     expect(store.getActions()).toEqual(expectedActionSuccess)

    //     const expectedActionFail = [
    //         { type: actionTypes.ACTION_START },
    //         { type: actionTypes.ACTION_FAIL, error: "Request failed with status code 400" }
    //     ]

    //     const store1 = mockStore({})
    //     await store1.dispatch(actions.publishPage({ isHomePage: true }, 'page1', [ { id: 'page3' }, { id: 'page2'} ], 'web2'))
    //     expect(store1.getActions()).toEqual(expectedActionFail)
    // })

    // it('should revert page', async () => {
    //     const mock = new mockAdapter(axios)

    //     mock
    //         .onPost('/api/pages/revert').replyOnce( config => {
    //             const data = JSON.parse(config.data)
    //             if(data.pagesStructure[0].isNotPublished === false && data.pagesStructure[1].isNotPublished === true && data.websiteId === 'web1' ) {
    //                 return [200, {
    //                     ok: true
    //                 }]
    //             } else {
    //                 return [400, {
    //                     urlNotOk: false
    //                 }]
    //             }
    //         })
    //         .onPost('/api/pages/revert').replyOnce( config => {
    //             const data = JSON.parse(config.data)
    //             if(data.pagesStructure[0].isNotPublished === false && data.pagesStructure[1].isNotPublished === false  && data.websiteId === 'web1' ) {
    //                 return [200, {
    //                     ok: true
    //                 }]
    //             } else {
    //                 return [400, {
    //                     urlNotOk: false
    //                 }]
    //             }
    //         })
    //         .onPost('/api/pages/revert').replyOnce(400, { success: false })

    //     const expectedActionSuccess = [
    //         { type: actionTypes.ACTION_START },
    //         { type: actionTypes.SAVE_WEBSITE_DATA_FROM_SERVER, data: {ok: true} },
    //         { type: actionTypes.LOAD_CURRENT_PAGE_TO_BUILDER, _id: "page1", pageObject: undefined, pagesObjects: undefined }
    //     ]

    //     const store0 = mockStore({})
    //     await store0.dispatch(actions.revertPage('web1', 'page1', [ { id: 'page1', isNotPublished: true }, { id: 'page2', isNotPublished: true } ], true))
    //     expect(store0.getActions()).toEqual(expectedActionSuccess)

    //     const store = mockStore({})
    //     await store.dispatch(actions.revertPage('web1', 'page1', [ { id: 'page1', isNotPublished: true }, { id: 'page2', isNotPublished: true } ], false))
    //     expect(store.getActions()).toEqual(expectedActionSuccess)

    //     const expectedActionFail = [
    //         { type: actionTypes.ACTION_START },
    //         { type: actionTypes.ACTION_FAIL, error: "Request failed with status code 400" }
    //     ]

    //     const store1 = mockStore({})
    //     await store1.dispatch(actions.revertPage({ isHomePage: true }, 'page1', [ { id: 'page3' }, { id: 'page2'} ], 'web2'))
    //     expect(store1.getActions()).toEqual(expectedActionFail)
    // })

    // it('should save page in state', () => {
    //     const expectedAction = { type: actionTypes.SAVE_PAGE_IN_STATE, some: 'thing' }
    //     expect(actions.savePageInState({ some: 'thing' })).toEqual(expectedAction)
    // })

    // it('should save page in state', () => {
    //     const expectedAction = {
    //         type: actionTypes.LOAD_GLOBALS_TO_STORE,
    //         pagesStructure: [ { id: 'page1'} ],
    //         pagesObjects: { page1: { some: 'thing' } },
    //         currentPage: 'page1'
    //     }
    //     expect(actions.loadGlobalsToStore([ { id: 'page1'} ], { page1: { some: 'thing' } }, 'page1')).toEqual(expectedAction)
    // })
})
