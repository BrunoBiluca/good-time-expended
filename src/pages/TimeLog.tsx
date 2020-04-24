import React, { useState } from "react"
import { StyleSheet, View, Text, Button, Alert } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import moment from "moment"
import { getAllProjects, getAllTimeExpended, clearAllData } from "../database/Schemas"


export default function TimeLog({ navegation }: any) {

  var [userProjects] = useState(getAllProjects())
  var [timeExpended] = useState(() => {
    var timeExpended = getAllTimeExpended()

    if(timeExpended.isEmpty() || userProjects.isEmpty()) return []

    return timeExpended
      .sorted('startDate', true)
      .map(te => {
        te['color'] = userProjects.find(p => p.key == te.key).color
        return te
      })
  })

  let styleCircle = function (color: String): any {
    return { ...styles.circle, backgroundColor: color }
  }

  const createTwoButtonAlert = () =>
    Alert.alert(
      "Confirmação",
      "Tem certeza em deletar todos os dados do aplicativo? (Ainda não temos a funcionalidade de backup)",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => clearAllData() }
      ],
      { cancelable: false }
    );

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 20, paddingVertical: 20, paddingRight: 10 }}>
        <Button color='red' title="Deletar todos os dados do app" onPress={createTwoButtonAlert} />
      </View>
      <FlatList
        data={timeExpended}
        renderItem={({ item }) =>
          <View style={styles.item}>
            <Text><View style={styleCircle(item.color)}></View>   {item.key} [{item.startDate}] - horas: {moment(item.endDate).diff(moment(item.startDate), 'hours', true).toFixed(2)}</Text>
          </View>
        }
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-around'
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    backgroundColor: 'red'
  },
  item: {
    padding: 10,
    fontSize: 18
  }
})