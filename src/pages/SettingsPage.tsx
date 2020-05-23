import * as React from 'react'
import { View, Text, Button, Alert } from "react-native";
import { clearAllData } from '../database/Schemas';

export default function SettingsPage() {

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
        <View>
            <Text>Settings</Text>
            <View style={{ paddingHorizontal: 20, paddingVertical: 20, paddingRight: 10 }}>
                <Button color='red' title="Deletar todos os dados do app" onPress={createTwoButtonAlert} />
            </View>
        </View>
    )
}