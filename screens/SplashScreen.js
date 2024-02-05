import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';

const SplashScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Puedes simular el progreso aquí (por ejemplo, cargando recursos, configuraciones, etc.)
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 0.1;
        return newProgress >= 1 ? 1 : newProgress;
      });
    }, 350);

    // Limpia el intervalo al desmontar el componente
    return () => clearInterval(progressInterval);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../imagenes/logoat.png')} style={styles.image} />
      <ProgressBar progress={progress} width={200} color="#3498db" />
      <Text style={styles.title}>Trackinscription</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 20,
    fontSize: 20,
  },
});

export default SplashScreen;
