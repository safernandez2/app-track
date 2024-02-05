
import React, { useEffect, useState } from 'react';
import SplashScreen from './screens/SplashScreen';
import AppNavigator from './AppNavigator';
import initializeDatabase from './database';

const App = () => {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      await initializeDatabase(); // Inicializa la base de datos u otras tareas de inicialización

      // Simula un tiempo de carga (puedes ajustar esto según tus necesidades)
      setTimeout(() => {
        setAppReady(true);
      }, 4000);
    };

    initializeApp();
  }, []);

  return appReady ? <AppNavigator /> : <SplashScreen />;
};

export default App;
