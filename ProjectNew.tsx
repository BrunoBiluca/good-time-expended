import { View, Button, Text, Modal, TouchableHighlight, FlatList } from "react-native"
import { StyleSheet } from "react-native"
import { Input } from "react-native-elements"
import React, { useState, useEffect } from "react"
import { insertProject } from "./Schemas"

export default function ProjectNew({ navigation, route }: any) {

  var availableColors = [
    { color: 'aqua' },
    { color: 'black' },
    { color: 'blue' },
    { color: 'fuchsia' },
    { color: 'gray' },
    { color: 'green' },
    { color: 'maroon' },
    { color: 'orange' }
  ]

  var [project, setProjectState] = useState({
    key: '',
    name: '',                        // Nome do projeto
    parentProject: {} as any,     // Slug do projeto pai
    color: '' as String,             // Cor do projeto
    goal: '',                          // Meta em horas do projeto
    timeExpended: [] as any
  })

  var [modalState, setModalState] = useState({ visible: false })

  useEffect(() => {
    if (route.params?.parentProjectSelected) {
      project.parentProject = route.params?.parentProjectSelected
      setProjectState({ ...project })
    }
  }, [route.params?.parentProjectSelected]);

  let styleCircle = function (color: String, size: number = 30): any {
    return {
      ...styles.circle,
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color
    }
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalState.visible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FlatList
              data={availableColors}
              numColumns={3}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                return (
                  <TouchableHighlight
                    activeOpacity={0}
                    onPress={() => {
                      project.color = item.color
                      setProjectState(project)
                      setModalState({ ...modalState, visible: false })
                    }}>
                    <View pointerEvents='none' style={[styleCircle(item.color, 30), {margin: 15}]} />
                  </TouchableHighlight>
                )
              }} />
          </View>
        </View>
      </Modal>

      <View>
        <View style={{ margin: 10, marginHorizontal: 0 }}>
          <Input label='Nome do projeto' value={project.name} onChangeText={text => {
            project.name = text
            setProjectState({ ...project })
          }} />
        </View>
        <View style={{ paddingVertical: 10, margin: 10, marginTop: 0 }}>
          <Text style={{ fontSize: 16, color: '#878787', fontWeight: 'bold' }}>Projeto Pai</Text>
          <TouchableHighlight
            style={{ padding: 10, borderWidth: 1, borderStyle: 'solid', borderRadius: 10, borderColor: '#878787' }}
            onPress={() => { navigation.navigate('SelectProjects') }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styleCircle(project.parentProject?.color, 20)} />
              <Text style={{ fontSize: 18 }}> {project.parentProject?.name}</Text>
            </View>
          </TouchableHighlight>
        </View>

        <View style={{ marginBottom: 10 }}>
          <Input label='Meta(h)' value={project.goal} onChangeText={text => {
            project.goal = text
            setProjectState({ ...project })
          }} />
        </View>

        <View style={{ paddingVertical: 10, margin: 10, marginTop: 0 }}>
          <Text style={{ fontSize: 16, color: '#878787', fontWeight: 'bold' }}>Cor</Text>
          <TouchableHighlight
            style={{ padding: 10, borderWidth: 1, borderStyle: 'solid', borderRadius: 10, borderColor: '#878787' }}
            onPress={() => { setModalState({ ...modalState, visible: true }) }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styleCircle(project.color, 20)} />
              <Text style={{ fontSize: 18 }}>{project.color}</Text>
            </View>
          </TouchableHighlight>
        </View>

        <View style={{ paddingVertical: 10, margin: 10, marginTop: 0 }}>
          <Button title="Salvar" onPress={() => {
            project.key = project.name.toLowerCase().replace(/\s/g, "-")

            project.parentProject = project.parentProject.key
            insertProject(project)

            navigation.navigate('Home', { newProject: project })
          }} />
        </View>
      </View>
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  circle: {
    marginHorizontal: 10,
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: 'red'
  }
})