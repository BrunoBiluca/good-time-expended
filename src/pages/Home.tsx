import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { StyleSheet, Text, View, FlatList, TouchableHighlight, Modal, Alert } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import { getAllProjects, getCurrentProject, addTimeExpended, updateCurrentProject, deleteProject } from '../database/Schemas'
import { ScrollView } from 'react-native-gesture-handler'
import ProjectLabelComponent from '../ProjectLabelComponent'
import { ProjectSelectItemComponent } from '../ProjectSelectItemComponent'

export default function Home({ navigation, route }: any) {

  var [userProjects, setUserProjects] = useState(getAllProjects())

  useEffect(() => {
    if (route.params?.newProject) {
      setUserProjects(getAllProjects())
    }
  }, [route.params?.newProject]);

  var [currentProject, setCurrentProject] = useState(getCurrentProject())

  let selectProject = function (projectKey: String) {
    let project = {
      key: projectKey,
      startDate: undefined,
      endDate: undefined
    }
    setCurrentProject(project)
    updateCurrentProject(project)
  }

  let styleCircle = function (color: String): any {
    return { ...styles.circle, backgroundColor: color }
  }

  var [modalState, setModalState] = useState({ visible: false, body: <View></View> })

  var motivationalPhrases = [
    'Não esqueça de beber água, tá?'
  ]

  var updateRealtimeCounter = function () {
    let diff_in_seconds = moment().diff(moment(currentProject.startDate), 'seconds')
    return moment().startOf('day')
      .seconds(diff_in_seconds)
      .format('H:mm:ss')
  }

  var [realtimeHourCounter, setRealtimeHourCounter] = useState(updateRealtimeCounter())

  let initial_id = setInterval(() => { setRealtimeHourCounter(updateRealtimeCounter()) }, 1000)
  var [realtimeIntervalId, setRealtimeIntervalId] = useState(initial_id)

  let activeButton = function () {
    if (!currentProject.startDate) {
      return (
        <View>
          <Button title="Começar" buttonStyle={{ backgroundColor: 'green' }}
            onPress={() => {
              if (!currentProject.key) return

              currentProject.startDate = moment().format("YYYY-MM-DD HH:mm:ss")
              setCurrentProject({ ...currentProject })
              updateCurrentProject(currentProject)

              clearInterval(realtimeIntervalId)
              let id = setInterval(() => { setRealtimeHourCounter(updateRealtimeCounter()) }, 1000)
              setRealtimeIntervalId(id)

              let modalBody = (
                <Text>
                  <Text>Você começou </Text>
                  <Text style={{ fontWeight: "bold" }}>{currentProject.key}</Text>
                  <Text>, tenha uma ótima atividade!{"\n\n"}{motivationalPhrases}</Text>
                </Text>
              )
              setModalState({ visible: true, body: modalBody })
            }}
          />
        </View>
      )
    } else {
      return (
        <View>
          <Button title="Terminar" buttonStyle={{ backgroundColor: 'red' }}
            onPress={() => {
              currentProject.endDate = moment().format("YYYY-MM-DD HH:mm:ss")
              addTimeExpended(currentProject)

              selectProject(currentProject.key)

              let modalBody = (
                <Text>
                  <Text>Você terminou </Text>
                  <Text style={{ fontWeight: "bold" }}>{currentProject.key}</Text>
                  <Text>, parabéns pelo incrível tempo investido!</Text>
                </Text>
              )
              setModalState({ visible: true, body: modalBody })
            }}
          />
          <Text>Projeto Atual: {currentProject.key} - {realtimeHourCounter}h</Text>
        </View>
      )
    }
  }

  const deleteProjectAlert = (projetoKey: string) =>
    Alert.alert(
      "Confirmação",
      "Tem certeza em deletar todos os dados do aplicativo? (Ainda não temos a funcionalidade de backup)",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => deleteProject(projetoKey) }
      ],
      { cancelable: false }
    );

  console.log(userProjects.slice().map(p => p.name))
  console.log(userProjects.slice().sort((a, b) => a.name < b.name ? -1 : 1).map(p => p.name))

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalState.visible}
        onShow={() => {
          setTimeout(() => setModalState({ ...modalState, visible: false }), 3000)
        }}
      >
        <View style={styles.centeredView}>
          <TouchableHighlight onPress={() => setModalState({ ...modalState, visible: false })}>
            <View style={styles.modalView}>
              {modalState.body}
            </View>
          </TouchableHighlight>
        </View>
      </Modal>

      <ScrollView style={{ flex: 1 }} horizontal={true} >
        <View style={{ paddingHorizontal: 10, paddingVertical: 20, paddingLeft: 20 }}>
          <Button title="Log de Tempo" onPress={() => navigation.navigate('TimeLog')} />
        </View>
        <View style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
          <Button title="Horas por dia" onPress={() => navigation.navigate('GraphicsHoursByDay')} />
        </View>
        <View style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
          <Button title="Horas por projeto" onPress={() => navigation.navigate('GraphicsHoursByProject')} />
        </View>
        <View style={{ paddingHorizontal: 10, paddingVertical: 20, paddingRight: 20 }}>
          <Button title="Horas por Meta" onPress={() => navigation.navigate('GraphicsHoursByGoal')} />
        </View>
      </ScrollView>


      <View style={{ flex: 1, padding: 20, paddingVertical: 0 }}>
        {activeButton()}
      </View>

      <View style={{ flex: 5 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={{ paddingHorizontal: 20, fontSize: 24 }}>Projetos</Text>
          <View style={{ paddingHorizontal: 20 }}>
            <Icon
              size={36}
              name='add-circle-outline'
              onPress={() => {
                navigation.navigate('ProjectNew')
              }}
            />
          </View>
        </View>
        <FlatList
          data={userProjects.slice().sort((a, b) => a.name < b.name ? -1 : 1)}
          extraData={userProjects.slice().sort((a, b) => a.name < b.name ? -1 : 1)}
          renderItem={({ item }) =>
            <ProjectSelectItemComponent
              style={{ paddingHorizontal: 20, borderColor: '#878787', borderTopWidth: 1 }} 
              project={item}
              isSelected={item.key == currentProject.key}
              onPress={() => selectProject(item.key)}
              onLongPress={() => deleteProjectAlert(item.key)}
            />
          }
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    backgroundColor: 'red'
  },
  itemActive: {
    backgroundColor: 'cyan'
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    fontSize: 18,

    alignItems: "center",

    height: 44,
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
  }
})
