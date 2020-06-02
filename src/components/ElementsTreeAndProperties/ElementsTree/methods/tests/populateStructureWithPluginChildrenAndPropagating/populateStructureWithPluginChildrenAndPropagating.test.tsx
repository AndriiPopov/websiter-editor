import populateStructureWithPluginChildrenAndPropagating from '../../populateStructureWithPluginChildrenAndPropagating'

import inc_template_new_builtin from './testConsts/inc_template_new_builtin'
import exp_template_new_builtin from './testConsts/exp_template_new_builtin'

import inc_template_old_builtin from './testConsts/inc_template_old_builtin'
import exp_template_old_builtin from './testConsts/exp_template_old_builtin'

import inc_plugin_new_builtin from './testConsts/inc_plugin_new_builtin'
import exp_plugin_new_builtin from './testConsts/exp_plugin_new_builtin'

import inc_plugin_old_builtin from './testConsts/inc_plugin_old_builtin'
import exp_plugin_old_builtin from './testConsts/exp_plugin_old_builtin'

import { isEqualStructuresWithOmit } from '../../../../../../utils/basic'
import inc_template_new_children from './testConsts/inc_template_new_children'
import exp_template_new_children from './testConsts/exp_template_new_children'
import inc_template_old_children from './testConsts/inc_template_old_children'
import exp_template_old_children from './testConsts/exp_template_old_children'
import inc_plugin_new_children from './testConsts/inc_plugin_new_children'
import inc_plugin_old_children from './testConsts/inc_plugin_old_children'
import exp_plugin_new_children from './testConsts/exp_plugin_new_children'
import exp_plugin_old_children from './testConsts/exp_plugin_old_children'

describe('actions', () => {
    it('returns null if no arguments', () => {
        const expectedResult = null
        expect(populateStructureWithPluginChildrenAndPropagating()).toEqual(
            expectedResult
        )
    })

    it('works with new built-in modules in template', () => {
        const expectedResult = exp_template_new_builtin
        const mD = inc_template_new_builtin
        const result0 = populateStructureWithPluginChildrenAndPropagating(
            mD,
            'template'
        )
        expect(
            isEqualStructuresWithOmit(
                result0.structureWithPluginChildren,
                expectedResult
            )
        ).toBeTruthy()
    })

    it('works with existing built-in modules in template', () => {
        const expectedResult = exp_template_old_builtin
        const mD = inc_template_old_builtin
        const result0 = populateStructureWithPluginChildrenAndPropagating(
            mD,
            'template'
        )
        expect(
            isEqualStructuresWithOmit(
                result0.structureWithPluginChildren,
                expectedResult
            )
        ).toBeTruthy()
    })

    it('works with new built-in modules in plugin', () => {
        const expectedResult = exp_plugin_new_builtin
        const mD = inc_plugin_new_builtin
        const result0 = populateStructureWithPluginChildrenAndPropagating(
            mD,
            'plugin'
        )
        expect(
            isEqualStructuresWithOmit(
                result0.structureWithPluginChildren,
                expectedResult
            )
        ).toBeTruthy()
    })

    it('works with old built-in modules in plugin', () => {
        const expectedResult = exp_plugin_old_builtin
        const mD = inc_plugin_old_builtin
        const result0 = populateStructureWithPluginChildrenAndPropagating(
            mD,
            'plugin'
        )
        expect(
            isEqualStructuresWithOmit(
                result0.structureWithPluginChildren,
                expectedResult
            )
        ).toBeTruthy()
    })

    it('works with new plugin children in template', () => {
        const expectedResult = exp_template_new_children
        const mD = inc_template_new_children
        const result0 = populateStructureWithPluginChildrenAndPropagating(
            mD,
            'template'
        )
        expect(
            isEqualStructuresWithOmit(
                result0.structureWithPluginChildren,
                expectedResult
            )
        ).toBeTruthy()
    })

    it('works with existing plugin children in template', () => {
        const expectedResult = exp_template_old_children
        const mD = inc_template_old_children
        const result0 = populateStructureWithPluginChildrenAndPropagating(
            mD,
            'template'
        )

        expect(
            isEqualStructuresWithOmit(
                result0.structureWithPluginChildren,
                expectedResult
            )
        ).toBeTruthy()
    })

    it('works with 2 new plugin children and builtin plugin inside in plugin', () => {
        const expectedResult = exp_plugin_new_children
        const mD = inc_plugin_new_children
        const result0 = populateStructureWithPluginChildrenAndPropagating(
            mD,
            'plugin'
        )
        expect(
            isEqualStructuresWithOmit(
                result0.structureWithPluginChildren,
                expectedResult
            )
        ).toBeTruthy()
    })

    it('works with 2 old plugin children and builtin plugin inside in plugin', () => {
        const expectedResult = exp_plugin_old_children
        const mD = inc_plugin_old_children
        const result0 = populateStructureWithPluginChildrenAndPropagating(
            mD,
            'plugin'
        )
        expect(
            isEqualStructuresWithOmit(
                result0.structureWithPluginChildren,
                expectedResult
            )
        ).toBeTruthy()
    })
})
