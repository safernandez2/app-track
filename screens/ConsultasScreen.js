import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
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
        <View style={{ padding: 10 }}>
          <Text>{`Nombre: ${filteredParticipante.nombre}`}</Text>
          <Text>{`Cedula: ${filteredParticipante.cedula}`}</Text>
          <Text>{`Tiempo: ${formatIntervaloTiempo(filteredParticipante.selectedArrivalTime, filteredParticipante.selectedDepartureTime)}`}</Text>
        </View>
      );
    } else if (error) {
      return <Text>{error}</Text>;
    } else {
      return null;
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Consulta de Participantes</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 5 }}
        placeholder="Buscar por cédula"
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

export default ConsultasScreen;
