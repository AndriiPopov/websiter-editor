export default str => {
    const el = document.createElement('textarea') // Create a <textarea> element
    el.value = str // Set its value to the string that you want copied
    el.setAttribute('readonly', '') // Make it readonly to be tamper-proof
    el.style.position = 'absolute'
    el.style.left = '-9999px' // Move outside the screen to make it invisible
    // $FlowFixMe
    document.body.appendChild(el) // Append the <textarea> element to the HTML document
    const selected =
        // $FlowFixMe
        document.getSelection().rangeCount > 0 // Check if there is any content selected previously
            ? // $FlowFixMe
              document.getSelection().getRangeAt(0) // Store selection if found
            : false // Mark as false to know no selection existed before
    const selectedElement = document.activeElement
    el.select() // Select the <textarea> content
    document.execCommand('copy') // Copy - only works as a result of a user action (e.g. click events)
    // $FlowFixMe
    document.body.removeChild(el) // Remove the <textarea> element
    if (selected) {
        // If a selection existed before copying
        // $FlowFixMe
        document.getSelection().removeAllRanges() // Unselect everything on the HTML document
        // $FlowFixMe
        document.getSelection().addRange(selected) // Restore the original selection
    }
    if (selectedElement) selectedElement.focus()
}
