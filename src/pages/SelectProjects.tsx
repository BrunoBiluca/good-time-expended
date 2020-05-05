import React, { useState } from "react"
import { StyleSheet, FlatList, TouchableHighlight, View, Text } from "react-native"
import { getAllProjects } from "../database/Schemas"

export default function SelectProjects({ navigation }: any) {
  var userProjects = getAllProjects().filtered('parentProject = ""')

  let styleCircle = function (color: String, size: number = 30): any {
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={userProjects}
        extraData={userProjects}
        renderItem={({ item }) =>
          <TouchableHighlight onPress={() => {
            navigation.navigate('ProjectNew', { parentProjectSelected: item });
          }}>
            <Text style={{
              padding: 20, paddingBottom: 0, flex: 1, flexDirection: 'row', fontSize: 18, justifyContent: 'center'
            }}>
              <View style={styleCircle(item.color)} />   {item.name}
            </Text>
          </TouchableHighlight>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  }
})