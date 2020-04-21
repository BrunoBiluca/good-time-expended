import React, { useState, useEffect } from 'react'
import moment, { Moment } from 'moment'
import { StyleSheet, Text, View, Button, FlatList, TouchableHighlight, Modal } from 'react-native'
import { Icon } from 'react-native-elements'

export default function Home({ navigation, route }: any) {
  // TODO: Exibir o último tempo contabilizado

  // TODO: substituir pelas informações do banco
  const data = [
    { key: 'estudo', name: 'Estudo', parentProject: undefined, active: true, color: 'blue', timeExpended: [] as any },
    { key: 'trabalho', name: 'Trabalho', parentProject: undefined, active: false, color: 'green', timeExpended: [] as any },
    { key: 'atividades-fisicas', name: 'Atividades físicas', parentProject: undefined, active: false, color: 'orange', timeExpended: [] as any },
    { key: 'taekwondo', name: 'Taekwondo', parentProject: 'atividades-fisicas', active: false, color: 'orange', timeExpended: [] as any }
  ]

  var [userProjects, setUserProject] = useState(data)

  useEffect(() => {
    if (route.params?.newProject) {
      userProjects.push(route.params?.newProject)
      setUserProject([...userProjects])
    }
  }, [route.params?.newProject]);

  var [modalState, setModalState] = useState({ visible: false, body: <View></View> })
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
    setIsActivityStarted(false)
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

            let modalBody = (
              <Text>
                <Text>Você começou </Text>
                <Text style={{ fontWeight: "bold" }}>{activity.name}</Text>
                <Text>, tenha uma ótima atividade!{"\n"}{"\n"}{motivationalPhrases}</Text>
              </Text>
            )
            setModalState({ visible: true, body: modalBody })
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

            let modalBody = (
              <Text>
                <Text>Você terminou </Text>
                <Text style={{ fontWeight: "bold" }}>{activity.name}</Text>
                <Text>, parabéns pelo incrível tempo investido!</Text>
              </Text>
            )
            setModalState({ visible: true, body: modalBody })
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
              {modalState.body}
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
          data={userProjects}
          extraData={userProjects}
          renderItem={({ item, index }) =>
            <TouchableHighlight onPress={() => selectProject(item.key)}>
              <View style={[styles.item, { paddingHorizontal: 20, borderColor: '#878787', borderTopWidth: 1 }]}>
                <View style={[{ paddingHorizontal: 10 }, !item.parentProject ? { display: 'none' } : { display: 'flex' }]}>
                  <Icon size={18} color='#878787' name='subdirectory-arrow-right' />
                </View>
                <Text style={{ flex: 1 }}>
                  <View style={styleCircle(item.color)} />   {item.name}
                </Text>
                <View style={[!item.active ? { display: 'none' } : { display: 'flex' }]}>
                  <Icon size={28} color='green' name='check-circle' />
                </View>
              </View>
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
