import { store } from '../index'
import * as actions from '../store/actions'

export const dragStart = (
    e: SyntheticMouseEvent<>,
    callbackMove: Object,
    callbackStop: Object
) => {
    // $FlowFixMe
    // const window = document.getElementById('builderFrame').contentWindow;
    store.dispatch(actions.setSizeIsChanging(true))
    const startMouseX = e.pageX
    const startMouseY = e.pageY
    let prevMouseX = e.pageX
    let prevMouseY = e.pageY

    const dragMouseMove = e => {
        const totalDifX = e.pageX - startMouseX
        const totalDifY = e.pageY - startMouseY
        const relDifX = e.pageX - prevMouseX
        const relDifY = e.pageY - prevMouseY
        prevMouseX = e.pageX
        prevMouseY = e.pageY
        callbackMove(totalDifX, totalDifY, relDifX, relDifY)
    }

    const dragMouseUp = () => {
        store.dispatch(actions.setSizeIsChanging(false))
        window.removeEventListener('mousemove', dragMouseMove)
        window.removeEventListener('mouseup', dragMouseUp)
        callbackStop()
    }

    window.addEventListener('mousemove', dragMouseMove)
    window.addEventListener('mouseup', dragMouseUp)
}
