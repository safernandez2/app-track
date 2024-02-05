// ResultadosScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import 'moment/locale/es';

const ResultadosScreen = () => {
  const [resultados, setResultados] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    const cargarResultados = async () => {
      try {
        const participantesStr = await AsyncStorage.getItem('participantes');
        const participantes = participantesStr ? JSON.parse(participantesStr) : [];

        const participantesOrdenados = participantes
          .filter((participante) => participante.selectedDepartureTime !== null && participante.selectedArrivalTime !== null)
          .sort((a, b) => {
            const tiempoA = a.selectedArrivalTime;
            const tiempoB = b.selectedArrivalTime;

            return tiempoA - tiempoB;
          });

        setResultados(participantesOrdenados);
      } catch (error) {
        console.error('Error al cargar la lista de participantes para resultados', error);
      }
    };

    cargarResultados();
  }, []);

  const renderParticipanteItem = ({ item, index }) => {
    // Calcula el intervalo de tiempo entre la salida y la llegada en minutos
    const arrivalTimeMoment = moment(item.selectedArrivalTime, 'Hmm');
    const departureTimeMoment = moment(item.selectedDepartureTime, 'Hmm');
    const intervaloMinutos = arrivalTimeMoment.diff(departureTimeMoment, 'minutes');

    console.log('Arrival Time Moment:', arrivalTimeMoment.format('HH:mm'));
    console.log('Departure Time Moment:', departureTimeMoment.format('HH:mm'));
    console.log('Intervalo en minutos:', intervaloMinutos);
  
    return (
      <View style={{ padding: 10 }}>
        <Text>{`${index + 1}.${item.nombre}`}</Text>
        <Text>{`Intervalo de Tiempo: ${formatIntervaloTiempo(intervaloMinutos)}`}</Text>
      </View>
    );
  };
  


  const formatIntervaloTiempo = (minutos) => {
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
  
    let resultado = '';
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
  
 

  const formatTiempo = (tiempo) => {
    if (tiempo === null || tiempo === undefined) {
      return '';
    }

    const tiempoMoment = moment(tiempo, 'Hmm');
    return tiempoMoment.format('HH:mm');
  };

  const renderGenreButtons = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
      <TouchableOpacity
        style={{ padding: 10, backgroundColor: selectedGenre === 'Masculino' ? 'rgb(57 95 133)' : 'transparent' }}
        onPress={() => setSelectedGenre('Masculino')}
      >
        <Text style={{ color: selectedGenre === 'Masculino' ? 'white' : 'black' }}>Masculino</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ padding: 10, backgroundColor: selectedGenre === 'Femenino' ? 'rgb(57 95 133)' : 'transparent' }}
        onPress={() => setSelectedGenre('Femenino')}
      >
        <Text style={{ color: selectedGenre === 'Femenino' ? 'white' : 'black' }}>Femenino</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ padding: 10, backgroundColor: selectedGenre === 'Otro' ? 'rgb(57 95 133)' : 'transparent'}}
        onPress={() => setSelectedGenre('Otro')}
      >
        <Text style={{ color: selectedGenre === 'Otro' ? 'white' : 'black' }}>Otro</Text>
      </TouchableOpacity>
    </View>
  );
  

  const filteredResultados = selectedGenre
    ? resultados.filter((participante) => participante.sexo === selectedGenre)
    : resultados;

    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', padding: 16 }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Resultados de Participantes</Text>
        {renderGenreButtons()}
        {filteredResultados.length > 0 ? (
          <FlatList
            data={filteredResultados}
            renderItem={renderParticipanteItem}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          <Text>Ningún participante ha llegado todavía.</Text>
        )}
      </View>
    );
  };

export default ResultadosScreen;
