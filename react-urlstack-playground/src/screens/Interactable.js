import React from "react";
import Interactable from "react-interactable";
import {View} from 'react-native';

function App() {
  return (
    <View className="App" style={styles.container}>
      <Interactable.View>
        <View style={styles.square} />
      </Interactable.View>
    </View>
  );
}

let styles = {
  container: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden"
  },
  square: {
    width: 40,
    height: 40,
    backgroundColor: "red"
  }
};

export default App