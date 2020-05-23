import React, { useState, useEffect } from "react"
import { StyleSheet, View, Text, Button, Alert, Switch } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import moment, { Moment } from "moment"
import { getAllProjects, getAllTimeExpended, clearAllData } from "../database/Schemas"


export default function TimeLog({ navigation }: any) {

  let [filterProjects, setFilterProjects] = useState(true)

  function getTimeExpended(filter: boolean = true) {
    let userProjects = getAllProjects()
    if(filter){
      userProjects = userProjects.filtered('active = true')
    }

    let teObj = getAllTimeExpended()

    if (teObj.isEmpty() || userProjects.isEmpty()) return []

    return teObj
      .sorted('startDate', true)
      .filter(te => userProjects.find(p => p.key == te.key) != undefined)
      .map(te => {
        te['color'] = userProjects.find(p => p.key == te.key).color
        return te
      })
  }

  var [timeExpended, setTimeExpended] = useState(getTimeExpended())

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setTimeExpended(getTimeExpended())
    });

    return unsubscribe;
  }, [navigation])

  let styleCircle = function (color: String): any {
    return { ...styles.circle, backgroundColor: color }
  }

  var duration = function (start: Moment, end: Moment) {
    let diffTime = moment(end).diff(moment(start))
    let duration = moment.duration(diffTime)

    let hrs = duration.hours()
    let mins = duration.minutes()
    let secs = duration.seconds()

    return `${hrs}:${mins}:${secs}`
  }

  return (
    <View style={styles.container}>
      <View style={{padding: 20, borderBottomWidth: 1}}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
          <View style={{ flex: 1}}>
            <Text>Active status:</Text>
            {filterProjects ? <Text>Somente ativos</Text> : <Text>Todos</Text>}
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={filterProjects ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => { 
              setFilterProjects(!filterProjects)
              setTimeExpended(getTimeExpended(!filterProjects))
            }}
            value={filterProjects}
          />
        </View>
      </View>
      <FlatList
        data={timeExpended}
        extraData={timeExpended}
        renderItem={({ item }) =>
          <View style={styles.item}>
            <Text><View style={styleCircle(item.color)}></View>  [{item.startDate}] {item.key} - {duration(item.startDate, item.endDate)}</Text>
          </View>
        }
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
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