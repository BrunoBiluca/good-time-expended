import React, { useState } from "react"
import { StyleSheet, View, Text } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import moment from "moment"
import { getAllProjects, getAllTimeExpended } from "./Schemas"


export default function TimeLog({ navegation }: any) {

  var [userProjects] = useState(getAllProjects())
  var [timeExpended] = useState(() => {
    return getAllTimeExpended()
            .sorted('startDate', true)
            .map(te => {
              te['color'] = userProjects.find(p => p.key == te.key).color
              return te
            }) 
  })

  let styleCircle = function (color: String): any {
    return { ...styles.circle, backgroundColor: color }
  }

  return (
    <View style={styles.container}>
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