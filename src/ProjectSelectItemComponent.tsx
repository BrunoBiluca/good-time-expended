import * as React from 'react'
import { View, TouchableHighlight, StyleSheet, TouchableWithoutFeedbackProps, ViewStyle } from "react-native";
import { Icon } from "react-native-elements";
import ProjectLabelComponent from "./ProjectLabelComponent";

export interface ProjectSelectItemProps extends TouchableWithoutFeedbackProps {

    project: any
    isSelected: boolean

}

export function ProjectSelectItemComponent(props: ProjectSelectItemProps) {
    var project = props.project

    let showParentRelation = function(): ViewStyle{
        return !project.parentProject ? { display: 'none' } : { display: 'flex' }
    }

    let isProjectSelected = function(): ViewStyle{
        return {display: props.isSelected ? 'flex' : 'none'}
    }

    return (
        <TouchableHighlight onPress={props.onPress} onLongPress={props.onLongPress}>
            <View style={[styles.item, props.style]}>

                <View style={[showParentRelation(), styles.left]}>
                    <Icon size={18} color='#878787' name='subdirectory-arrow-right' />
                </View>

                <ProjectLabelComponent style={{ flex: 1 }} project={project} size={15} displayTime />

                <View style={isProjectSelected()}>
                    <Icon size={28} color='green' name='check-circle' />
                </View>
            </View>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    left: { paddingHorizontal: 10 },
    right: {},
    item: {
        flexDirection: 'row',
        padding: 10,
        fontSize: 18,

        alignItems: "center",

        height: 44,
    },
})
