import * as React from 'react'
import { View, Dimensions, Text, FlatList } from 'react-native'
import { ProgressChart, BarChart } from 'react-native-chart-kit'
import { getAllProjects } from '../database/Schemas'
import moment from 'moment'
import { ScrollView } from 'react-native-gesture-handler'

export default function GraphicsHoursByGoal() {
  var userProjects = getAllProjects()

  var projectsByHours = userProjects.map((p) => {
    if (p.timeExpended.isEmpty()) return { ...p, total: 0 }
    let totalHours = p.timeExpended.reduce((total: number, te: any) => {
      total += parseFloat(moment(te.endDate).diff(moment(te.startDate), 'hours', true).toFixed(2))
      return total
    })
    return { ...p, total: totalHours }
  })
  var screen = Dimensions.get('window')

  return (<View style={{ padding: 20, backgroundColor: 'white', flex: 1 }}>
    <ScrollView horizontal={true}>
      <FlatList
        data={projectsByHours.filter(p => p.goal > 0)}
        renderItem={({ item }) => {
          let data = {
            labels: [""],
            data: [item.total == 0 ? 0 : item.goal / item.total]
          }

          return (
            <View>
              <Text>Projeto: {item.name}</Text>
              <Text>Meta: {item.goal} horas - Atual: {item.total} horas</Text>
              <ProgressChart
                data={data}
                width={screen.width - 100}
                height={120}
                strokeWidth={18}
                radius={32}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  barPercentage: 0.7
                }}
                hideLegend={false}
              />
            </View>
          )
        }}
      />
    </ScrollView>
  </View>)
}