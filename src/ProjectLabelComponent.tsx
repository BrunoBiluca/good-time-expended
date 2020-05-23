import * as React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'

export interface ProjectModel{
    name: string
    color: string
}

export interface ProjectLabelProps {
    style?: ViewStyle
    project: any
    size?: number
}

export default function ProjectLabelComponent(props: ProjectLabelProps) {
    var project: ProjectModel = props.project

    var size: number = props.size || 15

    const styles = StyleSheet.create({
        container: {marginHorizontal: 5, flexDirection: 'row', alignItems: 'center' },
        circle: {
            marginRight: 5,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: project.color
        },
        text: {
            fontSize: size
        }
    })

    return (
        <View style={[styles.container, props.style]}>
            <View style={styles.circle} />
            <Text style={styles.text}>{project.name}</Text>
        </View>
    )
}