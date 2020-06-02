import { canDragHandle } from './methods'

describe('actions', () => {
    it('denies to drag empty nodes', () => {
        expect(canDragHandle({ node: { itemPath: [] } })).toBeFalsy()
    })
    it('denies to drag not propagating nodes in page', () => {
        expect(
            canDragHandle({ node: { mode: 'page', itemPath: [] } })
        ).toBeFalsy()
    })
    it('allows to drag propagating nodes in page', () => {
        expect(
            canDragHandle({
                node: { mode: 'page', itemPath: [], isPropagatingItem: true },
            })
        ).toBeTruthy()
    })
    it('denies to drag trash', () => {
        expect(
            canDragHandle({
                node: {
                    mode: 'template',
                    itemPath: [],
                    id: 'trash',
                },
            })
        ).toBeFalsy()
        expect(
            canDragHandle({
                node: {
                    mode: 'template',
                    itemPath: [],
                    id: 'trash',
                },
            })
        ).toBeFalsy()
    })
    it('allows to drag children in trash', () => {
        expect(
            canDragHandle({
                node: {
                    mode: 'template',
                    itemPath: ['trash'],
                    id: 'element_22',
                },
            })
        ).toBeTruthy()
    })
    it('denies to drag children in trash children', () => {
        expect(
            canDragHandle({
                node: {
                    mode: 'template',
                    itemPath: ['trash', 'element_12'],
                    id: 'element_22',
                },
            })
        ).toBeFalsy()
    })
    it('denies to drag cms variables folder', () => {
        expect(
            canDragHandle({
                node: {
                    mode: 'template',
                    itemPath: [],
                    id: 'element_02',
                },
            })
        ).toBeFalsy()
    })

    it('allows to drag cms variables', () => {
        expect(
            canDragHandle({
                node: {
                    mode: 'template',
                    itemPath: ['element_02'],
                    id: 'element_3',
                },
            })
        ).toBeTruthy()
    })

    it('denies to drag head and body', () => {
        expect(
            canDragHandle({
                node: {
                    mode: 'template',
                    itemPath: ['element_01'],
                    id: 'element_0',
                },
            })
        ).toBeFalsy()
        expect(
            canDragHandle({
                node: {
                    mode: 'template',
                    itemPath: ['element_01'],
                    id: 'element_1',
                },
            })
        ).toBeFalsy()
    })

    it('allows to drag elements in template', () => {
        expect(
            canDragHandle({
                node: {
                    mode: 'template',
                    itemPath: ['element_01', 'element_0'],
                    id: 'element_3',
                },
            })
        ).toBeTruthy()
        expect(
            expect(
                canDragHandle({
                    node: {
                        mode: 'template',
                        itemPath: ['element_01', 'element_1'],
                        id: 'element_3',
                    },
                })
            )
        ).toBeTruthy()
    })

    it('allows to drag elements in plugin', () => {
        expect(
            canDragHandle({
                node: {
                    mode: 'plugin',
                    itemPath: ['element_0'],
                    id: 'element_3',
                },
            })
        ).toBeTruthy()
    })

    it('denies to drag elements in builtin modules', () => {
        expect(
            canDragHandle({
                node: {
                    mode: 'plugin',
                    itemPath: ['element_01', 'element_1'],
                    id: 'element_3',
                    childrenFor: true,
                },
            })
        ).toBeFalsy()
    })
})
