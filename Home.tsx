import React, { useState } from 'react'
import moment, { Moment } from 'moment'
import { StyleSheet, Text, View, Button, FlatList, TouchableHighlight, Modal } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

export default function Home({ navigation }: any) {
  // TODO: substituir pelas informações do banco
  const data = [
    { key: 'estudo', name: 'Estudo', active: true, color: 'blue', timeExpended: [] as any },
    { key: 'trabalho', name: 'Trabalho', active: false, color: 'green', timeExpended: [] as any },
    { key: 'atividades-fisicas', name: 'Atividades físicas', active: false, color: 'orange', timeExpended: [] as any }
  ]

  var [userProjects, setUserProject] = useState(data)
  var [modalState, setModalState] = useState({ visible: false, message: '' })
  // TODO: fazer isso ser a última registrada
  var [isActivityStarted, setIsActivityStarted] = useState(false)
  var [currentStartDate, setCurrentStartDate] = useState(undefined as unknown as Moment)

  var motivationalPhrases = [
    'Não esqueça de beber água, tá?'
  ]

  let styleCircle = function (color: String): any {
    return { ...styles.circle, backgroundColor: color }
  }

  let selectProject = function (projectKey: String) {
    userProjects.map(p => {
      if (p.key == projectKey) p.active = true
      else p.active = false
    })
    setUserProject([...userProjects])
  }

  let activeButton = function () {
    if (!isActivityStarted) {
      return (
        <Button title="Começar" color="green"
          onPress={() => {
            let activity = userProjects.find((p) => p.active)
            if (activity === undefined) return

            setCurrentStartDate(moment())
            setIsActivityStarted(true)

            let msg = `Você começou <${activity.name}>, tenha uma ótima atividade!\n\n${motivationalPhrases}`
            setModalState({ visible: true, message: msg })
          }}
        />
      )
    } else {
      return (
        <Button title="Terminar" color="red"
          onPress={() => {
            let activity = userProjects.find((p) => p.active)
            if (activity === undefined) return

            let end_date = moment()
            activity.timeExpended.push({ start_date: currentStartDate, end_date: end_date })
            setUserProject([...userProjects])
            setIsActivityStarted(false)

            let msg = `Você terminou <${activity.name}>, parabéns pelo incrível tempo investido!`
            setModalState({ visible: true, message: msg })
          }}
        />
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
              <Text style={styles.modalText}>{modalState.message}</Text>
            </View>
          </TouchableHighlight>
        </View>
      </Modal>

      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 20, paddingRight: 10 }}>
          <Button title="Log de Tempo" onPress={() => navigation.navigate('TimeLog')} />
        </View>
        <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 20, paddingLeft: 10 }}>
          <Button title="Gráficos" onPress={() => navigation.navigate('Graphics')} />
        </View>
      </View>

      <View style={{ flex: 1, padding: 20, paddingVertical: 0 }}>
        {activeButton()}
      </View>

      <View style={{ flex: 5 }}>
        <Text style={{ paddingHorizontal: 20, fontSize: 18 }}>Projetos</Text>
        <FlatList
          data={userProjects}
          extraData={userProjects}
          renderItem={({ item }) =>
            <TouchableHighlight onPress={() => selectProject(item.key)}>
              <Text style={[styles.item, item.active ? styles.itemActive : styles.item]}><View style={styleCircle(item.color)} />   {item.name}</Text>
            </TouchableHighlight>
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
