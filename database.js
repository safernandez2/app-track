// database.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const initializeDatabase = async () => {
  console.log('Iniciando la inicialización de la base de datos...');

  try {
    // Verificar si ya existe la clave 'participantes' en el almacenamiento
    const participantesStr = await AsyncStorage.getItem('participantes');
    if (!participantesStr) {
      // Si no existe, inicializarla con un array vacío
      await AsyncStorage.setItem('participantes', JSON.stringify([]));
      console.log('Almacenamiento de participantes inicializado con éxito');
    } else {
      console.log('Almacenamiento de participantes ya existe');
    }
  } catch (error) {
    console.error('Error al inicializar el almacenamiento', error);
    throw error;
  }
};

export default initializeDatabase;
