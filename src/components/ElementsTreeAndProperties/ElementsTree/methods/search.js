import type { Props, State } from '../ElementsTree'

export const searchOnHover = (
    props: Props,
    state: State,
    setState: Function
) => {
    if (props.findMode && props.fromFrame) {
        setState({
            ...state,
            searchString: props.hoveredElementId || '',
            searchStringHasBeenCleared: false,
        })
    } else {
        if (!state.searchStringHasBeenCleared) {
            setState({
                ...state,
                searchString: '',
                searchStringHasBeenCleared: true,
            })
        }
    }
}

export const searchMethod = ({ node, path, treeIndex, searchQuery }: Props) => {
    if (!searchQuery) return false

    if (node.tag.indexOf(searchQuery) > -1) return true
    if (node.properties.id)
        if (node.properties.id.indexOf(searchQuery) > -1) return true
    if (node.properties.class)
        if (node.properties.class.indexOf(searchQuery) > -1) return true
}

export const searchMethod2 = ({
    node,
    path,
    treeIndex,
    searchQuery,
}: Props) => {
    if (!searchQuery) return false

    if (node.id.indexOf(searchQuery) > -1) return true
}
