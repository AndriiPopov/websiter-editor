import refreshPageStructure from '../refreshPageStructure'
import exp_propagatingInArray from './testConsts/exp_propagatingInArray'
import inc_propagatingInArray from './testConsts/inc_propagatingInArray'
import inc_complex from './testConsts/inc_complex'
import exp_complex from './testConsts/exp_complex'
import inc_variableInVariableInArray from './testConsts/inc_variableInVariableInArray'
import exp_propagatingWithTwoVariables from './testConsts/exp_propagatingWithTwoVariables'
import inc_propagatingWithVariables from './testConsts/inc_propagatingWithVariables'

describe('actions', () => {
    it('returns false if no arguments', () => {
        const expectedResult = false
        expect(refreshPageStructure()).toEqual(expectedResult)
    })

    it('works with propagating in array', () => {
        const expectedResult = exp_propagatingInArray
        const mD = inc_propagatingInArray
        const draft = refreshPageStructure(
            mD,
            mD.currentPageFSBDraft,
            mD.pageTemplateFSBDraft,
            false,
            mD.pageTemplateFSBId
        )
        expect(
            refreshPageStructure(
                mD,
                mD.currentPageFSBDraft,
                mD.pageTemplateFSBDraft,
                false,
                mD.pageTemplateFSBId
            )
        ).toEqual(expectedResult)
        mD.currentPageFSBDraft.structure = draft[1].structure
        mD.currentPageFSBDraft.values = draft[1].values
        expect(
            refreshPageStructure(
                mD,
                mD.currentPageFSBDraft,
                mD.pageTemplateFSBDraft,
                false,
                mD.pageTemplateFSBId
            )
        ).toEqual(false)
    })

    it('works with complex structure', () => {
        const expectedResult = exp_complex
        const mD = inc_complex
        const draft = refreshPageStructure(
            mD,
            mD.currentPageFSBDraft,
            mD.pageTemplateFSBDraft,
            false,
            mD.pageTemplateFSBId
        )
        expect(
            refreshPageStructure(
                mD,
                mD.currentPageFSBDraft,
                mD.pageTemplateFSBDraft,
                false,
                mD.pageTemplateFSBId
            )
        ).toEqual(expectedResult)
        mD.currentPageFSBDraft.structure = draft[1].structure
        mD.currentPageFSBDraft.values = draft[1].values
        expect(
            refreshPageStructure(
                mD,
                mD.currentPageFSBDraft,
                mD.pageTemplateFSBDraft,
                false,
                mD.pageTemplateFSBId
            )
        ).toEqual(false)
    })

    it('works with variable in variable in array', () => {
        const expectedResult = exp_complex
        const mD = inc_variableInVariableInArray
        const draft = refreshPageStructure(
            mD,
            mD.currentPageFSBDraft,
            mD.pageTemplateFSBDraft,
            false,
            mD.pageTemplateFSBId
        )
        expect(
            refreshPageStructure(
                mD,
                mD.currentPageFSBDraft,
                mD.pageTemplateFSBDraft,
                false,
                mD.pageTemplateFSBId
            )
        ).toEqual(false)
        // mD.currentPageFSBDraft.structure = draft[1].structure
        // mD.currentPageFSBDraft.values = draft[1].values
        expect(
            refreshPageStructure(
                mD,
                mD.currentPageFSBDraft,
                mD.pageTemplateFSBDraft,
                false,
                mD.pageTemplateFSBId
            )
        ).toEqual(false)
    })

    it('works with variable in propagating', () => {
        const expectedResult = exp_propagatingWithTwoVariables
        const mD = exp_propagatingWithTwoVariables
        const draft = refreshPageStructure(
            mD,
            mD.currentPageFSBDraft,
            mD.pageTemplateFSBDraft,
            false,
            mD.pageTemplateFSBId
        )
        expect(draft).not.toBeFalsy()
        mD.currentPageFSBDraft.structure = draft[1].structure
        mD.currentPageFSBDraft.values = draft[1].values
        expect(
            refreshPageStructure(
                mD,
                mD.currentPageFSBDraft,
                mD.pageTemplateFSBDraft,
                false,
                mD.pageTemplateFSBId
            )
        ).toBeFalsy()
    })
})
