export const handleSearchOnChange = (state, setState, e) => {
    setState({ ...state, searchString: e.target.value })
}

export const selectPrevMatch = (state, setState) => {
    const { searchFocusIndex, searchFoundCount } = state

    setState({
        ...state,
        searchFocusIndex:
            searchFocusIndex !== null
                ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
                : searchFoundCount - 1,
    })
}

export const selectNextMatch = (state, setState) => {
    const { searchFocusIndex, searchFoundCount } = state

    setState({
        ...state,
        searchFocusIndex:
            searchFocusIndex !== null
                ? (searchFocusIndex + 1) % searchFoundCount
                : 0,
    })
}
