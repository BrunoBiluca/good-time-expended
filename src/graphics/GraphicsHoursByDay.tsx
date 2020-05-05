import * as React from 'react';
import { View, Text, SafeAreaView, FlatList } from 'react-native';
import { getAllProjects, getAllTimeExpended } from '../database/Schemas';
import { useState } from 'react';
import { StackedBarChart } from 'react-native-chart-kit'
import { ScrollView } from 'react-native-gesture-handler';
import moment, { Moment } from 'moment';
import ProjectLabelComponent from '../ProjectLabelComponent';

export default function Graphics({ navigation }: any) {
  let projects = getAllProjects().filtered('timeExpended.@size > 0')
  if (projects.isEmpty()) return (<View><Text>Não foram encontrados dados</Text></View>)

  var getDaysArray = function (start: Moment, end: Moment, format: string = 'YYYY-MM-DD') {
    for (var arr = [], dt = start; dt <= end; dt = (dt.add(1, 'day'))) {
      arr.push(dt.format(format));
    }
    return arr;
  };

  var [chartData] = useState(() => {
    let time_expended = getAllTimeExpended()

    let legends = projects.map(p => p.key)
    let colors = projects.map(p => p.color)

    var date_labels: String[] = getDaysArray(moment().subtract(30, 'days'), moment())
      .sort()
      .reverse()

    var data = Array.from({ length: date_labels.length }, e =>
      Array.from({ length: legends.length }, e => 0)
    )

    time_expended.map((te) => {
      let date = te.startDate.split(' ')[0]
      let idx_label = date_labels.indexOf(date)
      let idx_legend = legends.indexOf(te.key)
      let hours = parseFloat(moment(te.endDate).diff(moment(te.startDate), 'hours', true).toFixed(2))
      data[idx_label][idx_legend] += hours
    })

    return {
      legend: [],
      labels: date_labels as string[],
      data: data,
      barColors: colors as string[]
    }
  })

  let chartInfo = projects.map(p => { return { name: p.name, color: p.color } })

  let maxValue = 0
  chartData.data.map((te) => {
    let sum = te.reduce((total, t) => total + t)
    if (maxValue < sum) {
      maxValue = sum
    }
  })

  var [screen, setScreen] = useState({ numColumns: 2, width: 0, height: 0, maxValue: Math.round(maxValue) })

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
          renderItem={({ item }) => <ProjectLabelComponent project={item} size={15} />} />
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
            barPercentage: 1,
            propsForLabels: {
              dx: -10
            }
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