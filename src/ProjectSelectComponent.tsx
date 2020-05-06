import * as React from 'react'
import { View, Text, FlatList, StyleSheet, Alert } from "react-native"
import { Icon } from "react-native-elements"
import { ProjectSelectItemComponent } from "./ProjectSelectItemComponent"
import { useState, useEffect } from "react"
import { getAllProjects, deleteProject, getCurrentProject, updateCurrentProject } from "./database/Schemas"
import { useNavigation, useRoute } from '@react-navigation/native'

export default function ProjectSelectComponent(props: any) {

    const navigation = useNavigation()
    const route: any = useRoute()

    const getProjects = function () {
        var projects = getAllProjects().slice().sort((a, b) => a.name < b.name ? -1 : 1)

        var ordenedProjects: any[] = []

        projects
            .filter(p => p.parentProject == '')
            .forEach(p => {
                ordenedProjects.push(p)
                projects.filter(proj => proj.parentProject == p.key).forEach(proj => ordenedProjects.push(proj))
            });

        return ordenedProjects
    }

    var [userProjects, setUserProjects] = useState(getProjects())

    useEffect(() => {
        if (route.params?.newProject) {
            setUserProjects(getProjects())
        }
    }, [route.params?.newProject]);


    var [currentProject, setCurrentProject] = useState(getCurrentProject())

    const deleteProjectAlert = (projetoKey: string) =>
        Alert.alert(
            "Confirmação",
            "Tem certeza em deletar todos os dados do aplicativo? (Ainda não temos a funcionalidade de backup)",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        deleteProject(projetoKey)
                        setUserProjects(getProjects())
                    }
                }
            ],
            { cancelable: false }
        );

    let selectProject = function (projectKey: String) {
        let project = {
            key: projectKey,
            startDate: undefined,
            endDate: undefined
        }
        props.updateCurrentProject(project)
        setCurrentProject(project)
        updateCurrentProject(project)
    }

    return (
        <View style={props.style}>
            <View style={style.header}>
                <Text>Projetos</Text>
                <View>
                    <Icon
                        size={36}
                        name='add-circle-outline'
                        onPress={() => { navigation.navigate('ProjectNew') }}
                    />
                </View>
            </View>
            <FlatList
                data={userProjects}
                extraData={userProjects}
                renderItem={({ item }) =>
                    <ProjectSelectItemComponent
                        style={style.listItem}
                        project={item}
                        isSelected={item.key == currentProject.key}
                        onPress={() => selectProject(item.key)}
                        onLongPress={() => deleteProjectAlert(item.key)}
                    />
                }
            />
        </View>
    )
}

const style = StyleSheet.create({
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, fontSize: 24, paddingHorizontal: 20 },
    listItem: { paddingHorizontal: 20, borderColor: '#878787', borderTopWidth: 1 }
})