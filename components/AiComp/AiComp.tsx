import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";

export default function AiComp() {
  const [text, setText] = useState<string>("");

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>IA</Text>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Escribe algo..."
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 10,
        }}
      />

      <Pressable
        onPress={() => console.log("send:", text)}
        style={{
          padding: 12,
          borderRadius: 10,
          alignItems: "center",
          borderWidth: 1,
        }}
      >
        <Text>Enviar</Text>
      </Pressable>
    </View>
  );
}
