// import type Props from '../SiteBuilder'

export default props => {
    const iframe = document.getElementById('builderFrame')
    if (iframe) {
        const innerDoc = iframe.contentDocument || iframe.contentWindow.document
        if (innerDoc.body) {
            const rect = innerDoc.body.getBoundingClientRect()
            props.saveHoveredElementRect([{ id: 'element_1' }], {
                left: rect.left,
                top: rect.top,
                width: rect.right - rect.left,
                height: rect.bottom - rect.top,
            })
        }
    }
}
