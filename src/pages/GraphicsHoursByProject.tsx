import * as React from 'react'
import { View, Dimensions } from 'react-native'
import { BarChart } from 'react-native-chart-kit'
import { getAllProjects } from '../database/Schemas'
import moment from 'moment'
import { ScrollView } from 'react-native-gesture-handler'

export default function GraphicsHoursByProject() {
  var userProjects = getAllProjects()

  var projectsByHours = userProjects.map((p) => {
    if (p.timeExpended.isEmpty()) return { ...p, total: 0 }
    let totalHours = p.timeExpended.reduce((total: number, te: any) => {
      total += parseFloat(moment(te.endDate).diff(moment(te.startDate), 'hours', true).toFixed(2))
      return total
    })
    return { ...p, total: totalHours }
  })

  const dataAllProjects = {
    labels: projectsByHours.map(p => p.name),
    datasets: [
      {
        data: projectsByHours.map(p => p.total)
      }
    ]
  }

  var screen = Dimensions.get('window')

  return (
    <View style={{ padding: 20, backgroundColor: 'white', flex: 1 }}>
      <ScrollView horizontal={true}>
        <BarChart
          data={dataAllProjects}
          width={screen.width > dataAllProjects.labels.length * 70 ? screen.width : dataAllProjects.labels.length * 70}
          height={screen.height - 100}
          yAxisLabel=""
          yAxisSuffix="h"
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            barPercentage: 0.7
          }}
          fromZero={true}
          verticalLabelRotation={30}
        />
      </ScrollView>
    </View>
  )
}