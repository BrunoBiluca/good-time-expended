import * as React from 'react'
import { useEffect, useState } from "react"
import moment from "moment"
import { Text } from 'react-native'
import PushNotification from 'react-native-push-notification'
import { getProject } from './database/Schemas'

export default function CurrentProjectHourCounterComponent(props: any) {

    var updateRealtimeCounter = function () {
        let diff_in_seconds = moment().diff(moment(props.currentProject.startDate), 'seconds')
        return moment().startOf('day')
            .seconds(diff_in_seconds)
            .format('H:mm:ss')
    }

    var [realtimeHourCounter, setRealtimeHourCounter] = useState("")
    useEffect(() => {
        let project = getProject(props.currentProject.key)
        var id = setInterval(() => {
            let project = getProject(props.currentProject.key)

            PushNotification.localNotification({
                id: '123',
                title: project.name,
                color: project.color,
                autoCancel: true,
                ongoing: true,
                importance: "low",
                message: updateRealtimeCounter()
            })

            setRealtimeHourCounter(updateRealtimeCounter())
        }, 1000)

        return () => {
            PushNotification.localNotification({
                id: '123',
                title: project.name,
                color: project.color,
                autoCancel: true,
                ongoing: false,
                importance: "low",
                message: updateRealtimeCounter()
            })
            clearInterval(id)
        }
    }, [])

    return (<Text>Projeto Atual: {props.currentProject.key} - {realtimeHourCounter}h</Text>)
}