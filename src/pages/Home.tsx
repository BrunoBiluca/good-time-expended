import React, { useState } from 'react'
import moment from 'moment'
import { StyleSheet, Text, View, TouchableHighlight, Modal } from 'react-native'
import { Button } from 'react-native-elements'
import { getCurrentProject, addTimeExpended, updateCurrentProject } from '../database/Schemas'
import { ScrollView } from 'react-native-gesture-handler'
import ProjectSelectComponent from '../ProjectSelectComponent'
import CurrentProjectHourCounterComponent from '../CurrentProjectHourCounterComponent'

export default function Home({ navigation }: any) {
  var [currentProject, setCurrentProject] = useState(getCurrentProject())

  var [modalState, setModalState] = useState({ visible: false, body: <View></View> })

  var motivationalPhrases = [
    'Não esqueça de beber água, tá?'
  ]

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
          <CurrentProjectHourCounterComponent currentProject={currentProject} />
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

      <View style={{ flex: 1, padding: 20, paddingVertical: 0, marginTop: 20 }}>
        {activeButton()}
      </View>

      <ProjectSelectComponent style={{ flex: 5 }} updateCurrentProject={(project: any) => setCurrentProject(project)} />
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
