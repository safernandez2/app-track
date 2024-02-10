import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import 'moment/locale/es';

const ConsultasScreen = () => {
  const [participantes, setParticipantes] = useState([]);
  const [filteredParticipante, setFilteredParticipante] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarParticipantes = async () => {
      try {
        const participantesStr = await AsyncStorage.getItem('participantes');
        const participantes = participantesStr ? JSON.parse(participantesStr) : [];

        setParticipantes(participantes);
      } catch (error) {
        console.error('Error al cargar la lista de participantes', error);
      }
    };

    cargarParticipantes();
  }, []);

  const handleSearch = () => {
    setError('');

    const isNumeric = /^\d+$/.test(searchText);
    if (isNumeric && searchText.length === 10) {
      const filtered = participantes.find((participante) => participante.cedula === searchText);
      if (filtered) {
        setFilteredParticipante(filtered);
      } else {
        setError('Participante no encontrado');
        setFilteredParticipante(null);
      }
    } else {
      setError('La cédula debe contener solo números y tener una longitud de 10 dígitos');
      setFilteredParticipante(null);
    }
  };

  const formatIntervaloTiempo = (llegada, salida) => {
    if (llegada === null || salida === null || llegada === undefined || salida === undefined) {
      return '';
    }
  
    const llegadaMoment = moment(llegada, 'Hmm');
    const salidaMoment = moment(salida, 'Hmm');
    const intervaloMinutos = salidaMoment.diff(llegadaMoment, 'minutes');
  
    const horas = Math.floor(Math.abs(intervaloMinutos) / 60);
    const minutosRestantes = Math.abs(intervaloMinutos) % 60;
  
    let resultado = '';
    if (intervaloMinutos < 0) {
      resultado += ' ';
    }
  
    if (horas > 0) {
      resultado += `${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    }
  
    if (minutosRestantes > 0) {
      if (resultado !== '') {
        resultado += ' ';
      }
      resultado += `${minutosRestantes} ${minutosRestantes === 1 ? 'minuto' : 'minutos'}`;
    }
  
    return resultado;
  };
  

  const renderParticipanteDetails = () => {
    if (filteredParticipante) {
      return (
        <View style={styles.participanteDetails}>
          <Text style={styles.detailTitle}>Nombre:</Text>
          <Text>{filteredParticipante.nombre}</Text>
          <Text style={styles.detailTitle}>Cédula:</Text>
          <Text>{filteredParticipante.cedula}</Text>
          <Text style={styles.detailTitle}>Tiempo:</Text>
          <Text>{formatIntervaloTiempo(filteredParticipante.selectedArrivalTime, filteredParticipante.selectedDepartureTime)}</Text>
        </View>
      );
    } else if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consulta de Participantes</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese la cédula"
        onChangeText={(text) => {
          if (/^\d+$/.test(text) || text === '') {
            setSearchText(text);
          }
        }}
        value={searchText}
        keyboardType="numeric"
        maxLength={10}
      />
      <Button
        title="Buscar"
        onPress={handleSearch}
        disabled={searchText.length !== 10}
        color={'rgb(57 95 133) '}
      />
      {renderParticipanteDetails()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100, // Ajuste para que el contenido no esté tan abajo
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  participanteDetails: {
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  detailTitle: {
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default ConsultasScreen;
