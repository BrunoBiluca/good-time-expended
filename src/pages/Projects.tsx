import * as React from "react"
import { View, StyleSheet, FlatList, Text } from "react-native"
import ProjectLabelComponent from "../ProjectLabelComponent"
import { getAllProjects, updateProject, getProject } from "../database/Schemas"
import { Switch } from "react-native-gesture-handler"
import { useState, useEffect } from "react"

export default function Projects({navigation}: any) {

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
        const unsubscribe = navigation.addListener('focus', () => {
            setUserProjects(getProjects())
        });
    
        return unsubscribe;
      }, [navigation])

    return (
        <View>
            <View style={style.header}>
                <Text style={{ fontSize: 24 }}>Projetos</Text>
            </View>
            <FlatList
                data={userProjects}
                extraData={userProjects}
                renderItem={({ item }) => {
                    return (
                        <View style={[style.listItem, {flex: 1, flexDirection: 'row'}]}>
                            <ProjectLabelComponent style={{flex: 1}}  project={item} />
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={item.active ? "#f5dd4b" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => {
                                    let active_value = !item.active
                                    updateProject({key: item.key, active: active_value})

                                    if(active_value && item.parentProject != ''){
                                        let parentProject = getProject(item.parentProject)
                                        updateProject({key: parentProject.key, active: active_value})
                                    }

                                    if(!active_value){
                                        getProjects()
                                            .filter(proj => proj.parentProject == item.key)
                                            .forEach(proj => updateProject({key: proj.key, active: active_value}))
                                    }
                                    
                                    setUserProjects(getProjects())
                                }}
                                value={item.active}
                            />
                        </View>
                    )
                }
                }
            />
        </View>
    )
}

const style = StyleSheet.create({
    header: { flexDirection: 'row', justifyContent: 'space-between', margin: 10, fontSize: 24, paddingHorizontal: 20 },
    listItem: { padding: 20, borderColor: '#878787', borderTopWidth: 1 }
})