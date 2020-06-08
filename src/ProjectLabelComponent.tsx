import * as React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import moment from 'moment'
import { TimeExpendedSchema, getAllProjects } from './database/Schemas'

export interface TimeExpendedModel {
    key: string
    startDate: string,
    endDate: string
}

export interface ProjectModel {
    key: string
    name: string
    color: string
    timeExpended: TimeExpendedModel[]
}

export interface ProjectLabelProps {
    style?: ViewStyle
    project: ProjectModel
    size?: number,
    displayTime?: boolean
}

export default function ProjectLabelComponent(props: ProjectLabelProps) {
    var project: ProjectModel = props.project

    let totalHours = project.timeExpended.reduce((total: number, te: any) => {
        total += parseFloat(moment(te.endDate).diff(moment(te.startDate), 'seconds', true).toFixed(2))
        return total
    }, 0)

    let childrenTime = getAllProjects()
        .filtered(`parentProject = "${project.key}"`)
        .reduce((total: number, p: any) => {
            return total + p.timeExpended.reduce((totalTime: number, te: any) => {
                return totalTime + parseFloat(moment(te.endDate).diff(moment(te.startDate), 'seconds', true).toFixed(2))
            }, 0)
        }, 0)
    totalHours += childrenTime

    const totalHoursFormatted = moment.utc(totalHours * 1000).format('HH:mm:ss');

    var size: number = props.size || 15

    const styles = StyleSheet.create({
        container: { marginHorizontal: 5, flexDirection: 'row', alignItems: 'center', flex: 1 },
        circle: {
            marginRight: 5,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: project.color
        },
        text: {
            fontSize: size,
            flexWrap: 'wrap',
            marginHorizontal: 10
        }
    })

    return (
        <View style={[styles.container, props.style]}>
            <View style={styles.circle} />
            <Text style={[styles.text, {flex: 1, textAlign: 'left'}]}>{project.name}</Text>
            <Text style={[styles.text, !props.displayTime ? {display: 'none'} : {}]}>{totalHoursFormatted}</Text>
        </View>
    )
}