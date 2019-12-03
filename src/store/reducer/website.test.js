import * as actionTypes from '../actions/actionTypes'
import reducer, { initialState } from './website'

describe('website reducer', () => {
    it('should handle SAVE_WEBSITE_DATA_FROM_SERVER', () => {
        expect(
            reducer(
                {
                    ...initialState,
                    error: true,
                    loading: true,
                    pagesLoading: true,
                    domainNotOk: true,
                },
                {
                    type: actionTypes.SAVE_WEBSITE_DATA_FROM_SERVER,
                    data: {},
                }
            )
        ).toEqual({ ...initialState, domainNotOk: false })

        expect(
            reducer(
                {
                    ...initialState,
                    error: true,
                    loading: true,
                    pagesLoading: true,
                },
                {
                    type: actionTypes.SAVE_WEBSITE_DATA_FROM_SERVER,
                    data: {
                        pagesObjects: {
                            key: '123',
                        },
                        domainNotOk: true,
                    },
                }
            )
        ).toEqual({
            ...initialState,
            pagesObjects: {
                key: '123',
            },
            domainNotOk: true,
        })
    })

    it('should handle LOAD_WEBSITE_FROM_SERVER', () => {
        expect(
            reducer(
                {
                    ...initialState,
                    error: true,
                    loading: true,
                    pagesLoading: true,
                    currentWebsite: 'xyz',
                },
                {
                    type: actionTypes.LOAD_WEBSITE_FROM_SERVER,
                    data: {
                        pagesObjects: {
                            page1: {
                                jest: 34,
                            },
                        },
                        websites: ['web1', 'web2'],
                        currentWebsite: 'nnnnn',
                    },
                }
            )
        ).toEqual({
            ...initialState,
            webs: 'ggg',
            pagesObjects: {
                page1: {
                    jest: 34,
                },
            },
            currentWebsite: 'xyz',
        })
    })

    it('should handle ADD_PAGE_SUCCESS', () => {
        expect(
            reducer(
                {
                    ...initialState,
                    pagesObjects: {
                        page2: {
                            gest: {
                                kino: true,
                            },
                            _id: 'page2',
                        },
                    },
                    error: true,
                    loading: true,
                    pagesLoading: true,
                },
                {
                    type: actionTypes.ADD_PAGE_SUCCESS,
                    page: {
                        jest: 34,
                        _id: 'page1',
                    },
                    pagesStructure: [{ _id: 'page1' }, { _id: 'page2' }],
                }
            )
        ).toEqual({
            ...initialState,
            pagesObjects: {
                page1: {
                    jest: 34,
                    _id: 'page1',
                },
                page2: {
                    gest: {
                        kino: true,
                    },
                    _id: 'page2',
                },
            },
            pagesStructure: [{ _id: 'page1' }, { _id: 'page2' }],
            currentPage: 'page1',
        })
    })

    it('should handle DELETE_PAGE_SUCCESS', () => {
        expect(
            reducer(
                {
                    ...initialState,
                    pagesObjects: {
                        page2: {
                            gest: {
                                kino: true,
                            },
                            _id: 'page2',
                        },
                        page1: {
                            jest: 34,
                            _id: 'page1',
                        },
                    },
                    error: true,
                    loading: true,
                    pagesLoading: true,
                },
                {
                    type: actionTypes.DELETE_PAGE_SUCCESS,
                    pagesStructure: [{ id: 'page2' }],
                    currentPage: 'page2',
                }
            )
        ).toEqual({
            ...initialState,
            pagesObjects: {
                page2: {
                    gest: {
                        kino: true,
                    },
                    _id: 'page2',
                },
            },
            pagesStructure: [{ id: 'page2' }],
            currentPage: 'page2',
        })
    })

    it('should handle ACTION_START', () => {
        expect(
            reducer(
                {
                    ...initialState,
                    error: true,
                },
                {
                    type: actionTypes.ACTION_START,
                }
            )
        ).toEqual({
            ...initialState,
            error: null,
            pagesLoading: true,
        })
    })

    it('should handle ACTION_SUCCESS', () => {
        expect(
            reducer(
                {
                    ...initialState,
                    error: true,
                    pagesLoading: true,
                },
                {
                    type: actionTypes.ACTION_SUCCESS,
                }
            )
        ).toEqual(initialState)
    })

    it('should handle ACTION_FAIL', () => {
        expect(
            reducer(
                {
                    ...initialState,
                    error: null,
                    pagesLoading: true,
                },
                {
                    type: actionTypes.ACTION_FAIL,
                    error: 'Wrong',
                }
            )
        ).toEqual({
            ...initialState,
            error: 'Wrong',
        })
    })

    it('should handle SET_CURRENT_PAGE', () => {
        expect(
            reducer(
                {
                    ...initialState,
                    urlNotValid: true,
                    currentPage: 'page1',
                },
                {
                    type: actionTypes.SET_CURRENT_PAGE,
                    _id: 'page2',
                }
            )
        ).toEqual({
            ...initialState,
            currentPage: 'page2',
        })
    })

    it('should handle SAVE_PAGE_STRUCTURE_TO_STORE', () => {
        expect(
            reducer(
                {
                    ...initialState,
                    urlNotValid: true,
                },
                {
                    type: actionTypes.SAVE_PAGE_STRUCTURE_TO_STORE,
                    data: {
                        id: 'page2',
                    },
                }
            )
        ).toEqual({
            ...initialState,
            data: {
                id: 'page2',
            },
        })
    })

    it('should handle SAVE_PAGE_IN_STATE', () => {
        expect(
            reducer(
                {
                    ...initialState,
                    pagesObjects: {
                        page1: {
                            id: 'page1',
                        },
                        page2: {
                            id: 'page2',
                            left: 34,
                        },
                    },
                    currentPage: 'page2',
                },
                {
                    type: actionTypes.SAVE_PAGE_IN_STATE,
                    left: 100,
                }
            )
        ).toEqual({
            ...initialState,
            pagesObjects: {
                page1: {
                    id: 'page1',
                },
                page2: {
                    id: 'page2',
                    left: 100,
                },
            },
            currentPage: 'page2',
        })
    })

    it('should handle LOAD_GLOBALS_TO_STORE', () => {
        expect(
            reducer(undefined, {
                type: actionTypes.LOAD_GLOBALS_TO_STORE,
                pagesStructure: 123,
                pagesObjects: 345,
                currentPage: 'page',
            })
        ).toEqual({
            ...initialState,
            pagesStructure: 123,
            pagesObjects: 345,
            currentPage: 'page',
        })
    })

    it('should handle SET_URL_IS_NOT_VALID', () => {
        expect(
            reducer(undefined, {
                type: actionTypes.SET_URL_IS_NOT_VALID,
            })
        ).toEqual({
            ...initialState,
            urlNotValid: true,
        })
    })
})
