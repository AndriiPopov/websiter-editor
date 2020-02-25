import React from 'react'

import { connect } from 'react-redux'
import axios from 'axios'

import * as actions from '../../store/actions/index'
import { Component } from 'react'
import getListOfNeededResources from './methods/getListOfNeededResources'
import getEssentialData from '../../utils/getEssentialData'

type Props = {
    loadedWebsite: string,
}

type State = {
    requestedResources: Array<{}>,
    taskId: number,
}

export let webSocket = false

class ReserveWebsiteInn extends Component<Props, State> {
    state = {
        requestedResources: [],
        taskId: 0,
    }

    start = () => {
        let url
        if (process.env.NODE_ENV === 'development') {
            url = 'ws://api.websiter.dev:5000'
        } else {
            url = 'wss://api.websiter.dev'
        }
        let pingTimeout, authInterval
        webSocket = new WebSocket(url)

        const heartbeat = () => {
            clearTimeout(pingTimeout)
            pingTimeout = setTimeout(() => {
                webSocket.close()
            }, 30000 + 1000)
            const versions = {}
            for (let id in this.props.mD.resourcesObjects) {
                versions[id] = {
                    __v: this.props.mD.resourcesObjects[id].__v,
                    type: this.props.mD.resourcesObjects[id].draft
                        ? 'resource'
                        : this.props.mD.resourcesObjects[id].pagesStructure
                        ? 'website'
                        : 'user',
                }
            }
            webSocket.send(
                JSON.stringify({
                    messageCode: 'heartbeat',
                    versions,
                })
            )
        }

        webSocket.onopen = event => {
            webSocket.send(
                JSON.stringify({
                    messageCode: 'auth',
                    user: axios.defaults.headers.common['x-auth-token'],
                    tryWebsiter: sessionStorage.getItem('tryWebsiter'),
                })
            )
            authInterval = setInterval(
                () =>
                    webSocket.send(
                        JSON.stringify({
                            messageCode: 'auth',
                            noRequest: true,
                            user: axios.defaults.headers.common['x-auth-token'],
                            tryWebsiter: sessionStorage.getItem('tryWebsiter'),
                        })
                    ),
                600000
            )
            heartbeat()
        }
        webSocket.onmessage = event => {
            const data = JSON.parse(event.data)

            switch (data.messageCode) {
                case 'heartbeat':
                    heartbeat()
                    break
                case 'logout':
                    this.props.logout()
                    break
                case 'addResource':
                    let resource = data.resource
                    this.props.addResource(resource)
                    break
                case 'updateuser':
                    this.props.updateUser(data, webSocket)
                    break
                case 'updatewebsite':
                    this.props.updateWebsite(data, webSocket)
                    break
                case 'updateresource':
                    this.props.updateResource(data, webSocket)
                    break
                case 'revertResource':
                    this.props.revertResource(data)
                    break
                case 'deleteuser':
                case 'deletewebsite':
                case 'deleteresource':
                    this.props.deleteResource(data)
                    break
                case 'confirmSaved':
                    this.props.confirmSaved(data)
                    break
                case 'notFoundResource':
                    this.markNotFoundResource(data)
                    break
                case 'error':
                    alert(data.text)
                    break
                default:
                    break
            }
        }
        webSocket.onclose = event => {
            clearTimeout(pingTimeout)
            clearInterval(authInterval)
        }
    }

    markNotFoundResource = data => {
        const requestedResources = this.state.requestedResources.filter(
            item => item.id.toString() === data._id.toString()
        )
        this.setState({ requestedResources })
    }

    checkInterval = null

    check = () => {
        if (!webSocket || webSocket.readyState === 3) {
            this.start()
        }
    }
    componentWillMount() {
        this.checkInterval = setInterval(this.check, 5000)
    }

    reRequestResourcesInterval = null
    reRequestResources = () => {
        for (let requestedResource of this.state.requestedResources) {
            if (requestedResource)
                if (!this.props.mD.resourcesObjects[requestedResource.id]) {
                    if (webSocket && webSocket.readyState !== 3) {
                        webSocket.send(
                            JSON.stringify({
                                messageCode: 'requestResource',
                                id: requestedResource.id,
                                type: requestedResource.type,
                            })
                        )
                    }
                }
        }
    }
    componentWillUnmount() {
        clearInterval(this.reRequestResourcesInterval)
        clearInterval(this.checkInterval)
        if (webSocket) {
            webSocket.close()
        }
    }

    componentWillReceiveProps(nextProps) {
        const newRequestedResourcesList = getListOfNeededResources(nextProps)
        const requestedResources = []
        for (const requestItem of newRequestedResourcesList) {
            if (requestItem) {
                let requestedResourceItem = this.state.requestedResources.find(
                    item => item.id === requestItem.id
                )
                if (!requestedResourceItem) {
                    if (webSocket && webSocket.readyState !== 3) {
                        webSocket.send(
                            JSON.stringify({
                                messageCode: 'requestResource',
                                id: requestItem.id,
                                type: requestItem.type,
                            })
                        )
                        requestedResourceItem = {
                            id: requestItem.id,
                            type: requestItem.type,
                            state: 'sent',
                        }
                    }
                }
                if (requestedResourceItem)
                    requestedResources.push(requestedResourceItem)
            }
        }
        this.setState({ requestedResources })
        clearInterval(this.reRequestResourcesInterval)
        this.reRequestResourcesInterval = setInterval(
            this.reRequestResources,
            3000
        )
    }

    render() {
        return null
    }
}

const mapStateToPropsDo = state => {
    return {
        mD: state.mD,
    }
}

const mapDispatchToPropsDo = dispatch => {
    return {
        logout: () => dispatch(actions.logout()),
        addResource: data => dispatch(actions.addResource(data)),
        updateUser: (data, webSocket) =>
            dispatch(actions.updateUser(data, webSocket)),
        updateWebsite: (data, webSocket) =>
            dispatch(actions.updateWebsite(data, webSocket)),
        updateResource: (data, webSocket) =>
            dispatch(actions.updateResource(data, webSocket)),
        deleteResource: data => dispatch(actions.deleteResource(data)),
        revertResource: data => dispatch(actions.revertResource(data)),
        chooseWebsite: currentWebsiteId =>
            dispatch(actions.chooseWebsite(currentWebsiteId)),
        confirmSaved: data => dispatch(actions.removeResourceFromUnsaved(data)),
    }
}

const ReserveWebsiteDo = connect(
    mapStateToPropsDo,
    mapDispatchToPropsDo
)(ReserveWebsiteInn)

const ReserveWebsite = props => {
    const mainData = getEssentialData(
        props.userId,
        props.resourcesObjects,
        props.tryWebsiter
    )

    props.saveMainData(mainData)
    return <ReserveWebsiteDo />
}

const mapStateToProps = state => {
    return {
        userId: state.userId,
        resourcesObjects: state.resourcesObjects,
        tryWebsiter: state.tryWebsiter,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveMainData: mD => dispatch(actions.saveMainData(mD)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReserveWebsite)
