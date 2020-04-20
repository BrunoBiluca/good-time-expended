import React from "react"
import { StyleSheet, View, Text } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import moment from "moment"


export default function TimeLog({ navegation }: any) {
  const userProjects = [
    {
      "color": "blue",
      "key": "estudo",
      "name": "Estudo",
      "timeExpended": [
        {
          "start_date": "2020-04-20T10:21:22.065Z",
          "end_date": "2020-04-20T12:21:24.067Z"
        },
        {
          "start_date": "2020-04-20T13:21:31.501Z",
          "end_date": "2020-04-20T14:21:33.973Z"
        },
        {
          "start_date": "2020-04-20T18:01:53.743Z",
          "end_date": "2020-04-20T18:31:57.249Z"
        }
      ]
    },
    {
      "color": "green",
      "key": "trabalho",
      "name": "Trabalho",
      "timeExpended": [
        {
          "start_date": "2020-04-19T12:21:26.839Z",
          "end_date": "2020-04-19T15:21:28.663Z"
        }
      ]
    },
    {
      "color": "orange",
      "key": "atividades-fisicas",
      "name": "Atividades físicas",
      "timeExpended": [
        {
          "start_date": "2020-04-20T10:22:29.247Z",
          "end_date": "2020-04-20T18:22:32.252Z"
        }
      ]
    }
  ]

  let styleCircle = function (color: String): any {
    return { ...styles.circle, backgroundColor: color }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={userProjects.flatMap(p => p.timeExpended.map((t: any) => {
          return ({ name: p.name, color: p.color, ...t })
        }))}
        renderItem={({ item }) =>
          <View style={styles.item}>
            <Text><View style={styleCircle(item.color)} />   {item.name} [{moment(item.start_date).format('YYYY-MM-DD')}] - horas: {moment(item.end_date).diff(moment(item.start_date), 'hours', true).toFixed(2)}</Text>
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