import * as React from 'react'
import { useEffect, useState } from "react"
import moment from "moment"
import { Text } from 'react-native'

export default function CurrentProjectHourCounterComponent(props: any) {

    var updateRealtimeCounter = function () {
        console.log(props.currentProject)
        let diff_in_seconds = moment().diff(moment(props.currentProject.startDate), 'seconds')
        return moment().startOf('day')
            .seconds(diff_in_seconds)
            .format('H:mm:ss')
    }

    var [realtimeHourCounter, setRealtimeHourCounter] = useState("")
    useEffect(() => {
        var id = setInterval(() => { setRealtimeHourCounter(updateRealtimeCounter()) }, 1000)

        return () => {
            clearInterval(id)
          }
    }, []);

    return (<Text>Projeto Atual: {props.currentProject.key} - {realtimeHourCounter}h</Text>)
}