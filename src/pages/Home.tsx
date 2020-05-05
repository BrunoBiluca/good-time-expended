import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { StyleSheet, Text, View, TouchableHighlight, Modal } from 'react-native'
import { Button } from 'react-native-elements'
import { getCurrentProject, addTimeExpended, updateCurrentProject } from '../database/Schemas'
import { ScrollView } from 'react-native-gesture-handler'
import ProjectSelectComponent from '../ProjectSelectComponent'

export default function Home({ navigation, route }: any) {
  var [currentProject, setCurrentProject] = useState(getCurrentProject())

  var [modalState, setModalState] = useState({ visible: false, body: <View></View> })

  var motivationalPhrases = [
    'Não esqueça de beber água, tá?'
  ]

  var updateRealtimeCounter = function () {
    console.log(getCurrentProject().startDate)
    let diff_in_seconds = moment().diff(moment(getCurrentProject().startDate), 'seconds')
    return moment().startOf('day')
      .seconds(diff_in_seconds)
      .format('H:mm:ss')
  }

  var [realtimeHourCounter, setRealtimeHourCounter] = useState("")
  useEffect(() => {
    setInterval(() => { setRealtimeHourCounter(updateRealtimeCounter()) }, 1000)
  }, []);

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

              let project = {
                key: currentProject.key,
                startDate: undefined,
                endDate: undefined
              }
              updateCurrentProject(project)
              setCurrentProject(project)
              
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

      <ProjectSelectComponent style={{ flex: 5 }} />
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
