import * as React from 'react';
import { View, Text, SafeAreaView, FlatList } from 'react-native';
import { getAllProjects, getAllTimeExpended } from '../database/Schemas';
import { useState } from 'react';
import { StackedBarChart } from 'react-native-chart-kit'
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';

export default function Graphics({ navigation }: any) {
  var [chartData] = useState(() => {
    let projects = getAllProjects()
    let time_expended = getAllTimeExpended()

    if(projects.isEmpty() || time_expended.isEmpty()) return {
      legend: [],
      labels: [],
      data: [],
      barColors: []
    }

    let legends = projects.map(p => p.key)
    let colors = projects.map(p => p.color)
    
    var labels: String[] = []

    time_expended.map((te) => {
      let date = te.startDate.split(' ')[0]
      if(!labels.includes(date)){
        labels.push(date)
      }
    })

    var data: number[][] = [...Array(labels.length).fill(Array(legends.length).fill(0))]
    time_expended.map((te) => {
      let date = te.startDate.split(' ')[0]
      let idx_label = labels.indexOf(date)
      let idx_legend = legends.indexOf(te.key)
      let hours = parseFloat(moment(te.endDate).diff(moment(te.startDate), 'hours', true).toFixed(2))
      data[idx_label][idx_legend] = data[idx_label][idx_legend] + (hours + 1)
    })

    return {
      legend: legends as string[],
      labels: labels as string[],
      data: data,
      barColors: colors as string[]
    }
  })

  let maxValue = 0
  chartData.data.map((te) => {
    let sum = te.reduce((total, t) => total + t)
    if (maxValue < sum) {
      maxValue = sum
    }
  })

  let chartInfo = []
  for (let index = 0; index < chartData.labels.length; index++) {
    chartInfo.push({
      color: chartData.barColors[index],
      name: chartData.legend[index]
    })
  }

  var [screen, setScreen] = useState({ numColumns: 2, width: 0, height: 0, maxValue: Math.round(maxValue) })
  console.log(screen.maxValue % 5)

  let styleCircle = function (color: String, size: number = 30): any {
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color
    }
  }

  return (
    <SafeAreaView style={{ padding: 10, flex: 1, backgroundColor: 'white' }}>
      <View style={{ margin: 5, marginBottom: 20, padding: 5, borderWidth: 1, borderRadius: 10 }}>
        <FlatList
          data={chartInfo}
          key={screen.numColumns}
          numColumns={screen.numColumns}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={{ flex: 1, marginHorizontal: 5, flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styleCircle(item.color, 15), { marginRight: 5 }]} />
                <Text>{item.name}</Text>
              </View>
            )
          }} />
      </View>
      <ScrollView horizontal={true} onLayout={(event) => {
        setScreen({
          numColumns: event.nativeEvent.layout.width > event.nativeEvent.layout.height ? 3 : 2,
          width: event.nativeEvent.layout.width,
          height: event.nativeEvent.layout.height,
          maxValue: screen.maxValue
        })
      }}>
        <StackedBarChart
          hideLegend={true}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            barPercentage: 0.7
          }}
          data={chartData}
          width={screen.width > chartData.labels.length * 70 ? screen.width : chartData.labels.length * 70}
          height={220}
          segments={screen.maxValue % 7 > 2 ? screen.maxValue % 7 : 2}
        />
      </ScrollView>
    </SafeAreaView>
  )
}