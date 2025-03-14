import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";

export default function App() {
  const [score, setScore] = useState(0);
  const [size, setSize] = useState(80);
  const [time, setTime] = useState(2000);
  const [position, setPosition] = useState({ top: "50%", left: "50%" });
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  // Función para generar una nueva posición aleatoria para el objetivo
  const randomPosition = () => {
    return {
      top: Math.random() * (screenHeight - size),
      left: Math.random() * (screenWidth - size),
    };
  };

  // Función para manejar el golpe (cuando el usuario toca el objetivo)
  const handleHit = () => {
    setScore((prevScore) => prevScore + 1);
    setSize((prevSize) => Math.max(prevSize * 0.9, 20)); // Reducir tamaño, sin pasar de 20
    setTime((prevTime) => Math.max(prevTime * 0.9, 500)); // Reducir tiempo, sin pasar de 500ms
    setPosition(randomPosition()); // Generar nueva posición
  };

  // Función para manejar el fallo (cuando el usuario no toca el objetivo)
  const handleMiss = () => {
    setScore((prevScore) => {
      if (prevScore > 0) return prevScore - 1; // Reducir puntaje si no se tocó el objetivo
      Alert.alert("Game Over", "Has perdido", [
        { text: "Reiniciar", onPress: resetGame },
      ]);
      return 0; // Puntaje es 0 si el juego termina
    });
  };

  // Función para reiniciar el juego
  const resetGame = () => {
    setScore(0);
    setSize(80);
    setTime(2000);
    setPosition(randomPosition());
  };

  // useEffect para crear un temporizador que verifica si el usuario no toca el objetivo a tiempo
  useEffect(() => {
    const timer = setTimeout(() => {
      handleMiss(); // Llamar a handleMiss si no se toca el objetivo a tiempo
      setPosition(randomPosition()); // Establecer una nueva posición aleatoria
    }, time);

    return () => clearTimeout(timer); // Limpiar el temporizador cuando el componente se desmonte o cambie
  }, [position, time]); // Se ejecuta cada vez que cambian la posición o el tiempo

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={handleMiss}
    >
      <Text style={styles.score}>Score: {score}</Text>
      <TouchableOpacity
        style={[
          styles.target,
          { width: size, height: size, top: position.top, left: position.left },
        ]}
        onPress={(e) => {
          e.stopPropagation(); // Prevenir que el evento toque el contenedor principal
          handleHit(); // Ejecutar la función handleHit cuando se toca el objetivo
        }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  score: {
    position: "absolute",
    top: 20,
    fontSize: 24,
    color: "white",
  },
  target: {
    position: "absolute",
    backgroundColor: "red",
    borderRadius: 50,
  },
});
