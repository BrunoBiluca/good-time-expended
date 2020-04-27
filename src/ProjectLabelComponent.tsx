import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export interface ProjectModel{
    name: string
    color: string
}

export default function ProjectLabelComponent(props: any) {
    var project: ProjectModel = props.project
    var size: number = props.size

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
        <View style={styles.container}>
            <View style={styles.circle} />
            <Text style={styles.text}>{project.name}</Text>
        </View>
    )
}