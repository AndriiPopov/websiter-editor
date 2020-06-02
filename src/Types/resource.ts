import { elementType } from './element'
import { elementValuesType } from './elementValues'

export type resourceType = {
    currentId: number
    structure: Array<elementType>
    currentBox?: string
    cursorPosition?: {
        row: number
        column: number
    }
    values: {
        [key: string]: elementValuesType
    }
}
