import { canDropHandle } from './methods'

describe('actions', () => {
    it('denies to drop if no next parent', () => {
        expect(
            canDropHandle({
                node: { itemPath: [] },
                nextParent: {},
                prevParent: {},
            })
        ).toBeFalsy()
    })

    it('denies to drop if  next parent mode is page', () => {
        expect(
            canDropHandle({
                node: { itemPath: [] },
                nextParent: { itemPath: [], mode: 'page' },
                prevParent: { itemPath: [] },
            })
        ).toBeFalsy()
    })

    it('allows to drop if next parent mode is page and is array or propagating', () => {
        expect(
            canDropHandle({
                node: { itemPath: [] },
                nextParent: {
                    itemPath: [],
                    mode: 'page',
                    CMSVariableType: 'array',
                },
                prevParent: { itemPath: [] },
            })
        ).toBeTruthy()

        expect(
            canDropHandle({
                node: { itemPath: [] },
                nextParent: {
                    itemPath: [],
                    mode: 'page',
                    CMSVariableType: 'propagating_yyy',
                },
                prevParent: { itemPath: [] },
            })
        ).toBeTruthy()
    })

    it('denies to drop to text', () => {
        expect(
            canDropHandle({
                node: { itemPath: [] },
                nextParent: {
                    itemPath: [],
                    text: true,
                },
                prevParent: { itemPath: [] },
            })
        ).toBeFalsy()
    })

    it('denies to drop to elements form cms var', () => {
        expect(
            canDropHandle({
                node: { itemPath: [] },
                nextParent: {
                    itemPath: [],
                    isElementFromCMSVariable: true,
                },
                prevParent: { itemPath: [] },
            })
        ).toBeFalsy()
    })

    it('allows to drop to cms vars to cms folder', () => {
        expect(
            canDropHandle({
                node: { itemPath: [], isCMSVariable: true },
                nextParent: {
                    itemPath: [],
                    id: 'element_02',
                },
                prevParent: { itemPath: [] },
            })
        ).toBeTruthy()
        expect(
            canDropHandle({
                node: { itemPath: [], isCMSVariable: true },
                nextParent: {
                    itemPath: [],
                    isCMSVariable: true,
                },
                prevParent: { itemPath: [] },
            })
        ).toBeTruthy()
    })

    it('denies to drop cms vars anywhere else except for trash', () => {
        expect(
            canDropHandle({
                node: { itemPath: [], isCMSVariable: true },
                nextParent: {
                    itemPath: [],
                    id: 'element_1',
                    tag: 'div',
                },
                prevParent: { itemPath: [] },
            })
        ).toBeFalsy()
        expect(
            canDropHandle({
                node: { itemPath: [], isCMSVariable: true },
                nextParent: {
                    itemPath: [],
                    id: 'trash',
                    tag: 'div',
                },
                prevParent: { itemPath: [] },
            })
        ).toBeFalsy()
    })

    it('denies to drop to children in plugin', () => {
        expect(
            canDropHandle({
                node: { itemPath: [] },
                nextParent: {
                    itemPath: [],
                    id: 'element_2',
                    tag: 'div',
                    isChildren: true,
                },
                prevParent: { itemPath: [] },
            })
        ).toBeFalsy()
    })

    it('denies to drop to builtin module', () => {
        expect(
            canDropHandle({
                node: { itemPath: [] },
                nextParent: {
                    itemPath: [],
                    id: 'element_2',
                    tag: 'websiterMenu',
                },
                prevParent: { itemPath: [] },
            })
        ).toBeFalsy()
    })

    it('denies to drop to plugins', () => {
        expect(
            canDropHandle({
                node: { itemPath: [] },
                nextParent: {
                    itemPath: ['element_01'],
                    id: 'element_2',
                    tag: 'Plug',
                },
                prevParent: { itemPath: [] },
            })
        ).toBeFalsy()
    })

    it('allows to drop to for children', () => {
        expect(
            canDropHandle({
                node: { itemPath: [] },
                nextParent: {
                    itemPath: ['element_01'],
                    id: 'element_2',
                    tag: 'Plug',
                    forChildren: true,
                },
                prevParent: { itemPath: [] },
            })
        ).toBeTruthy()
    })

    it('denies to drop to html in templates', () => {
        expect(
            canDropHandle({
                node: { itemPath: [] },
                nextParent: {
                    itemPath: [],
                    id: 'element_01',
                    tag: 'html',
                    mode: 'template',
                },
                prevParent: { itemPath: [] },
            })
        ).toBeFalsy()
    })
})
