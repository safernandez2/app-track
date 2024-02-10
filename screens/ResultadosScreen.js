import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
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
          .sort((a, b) => a.selectedArrivalTime - b.selectedArrivalTime);

        setResultados(participantesOrdenados);
      } catch (error) {
        console.error('Error al cargar la lista de participantes para resultados', error);
      }
    };

    cargarResultados();
  }, []);

  const renderParticipanteItem = ({ item, index }) => {
    const arrivalTimeMoment = moment(item.selectedArrivalTime, 'Hmm');
    const departureTimeMoment = moment(item.selectedDepartureTime, 'Hmm');
    const intervaloMinutos = arrivalTimeMoment.diff(departureTimeMoment, 'minutes');

    return (
      <View style={styles.participanteContainer}>
        <Text style={styles.participanteIndex}>{`${index + 1}.`}</Text>
        <View style={styles.participanteDetails}>
          <Text style={styles.participanteName}>{item.nombre}</Text>
          <Text>{`Intervalo de Tiempo: ${formatIntervaloTiempo(intervaloMinutos)}`}</Text>
        </View>
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

  const renderGenreButtons = () => (
    <View style={styles.genreContainer}>
      <TouchableOpacity
        style={[styles.genreButton, selectedGenre === 'Masculino' && styles.genreButtonSelected]}
        onPress={() => setSelectedGenre('Masculino')}
      >
        <Text style={[styles.genreButtonText, selectedGenre === 'Masculino' && { color: '#fff' }]}>Masculino</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.genreButton, selectedGenre === 'Femenino' && styles.genreButtonSelected]}
        onPress={() => setSelectedGenre('Femenino')}
      >
        <Text style={[styles.genreButtonText, selectedGenre === 'Femenino' && { color: '#fff' }]}>Femenino</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.genreButton, selectedGenre === 'Otro' && styles.genreButtonSelected]}
        onPress={() => setSelectedGenre('Otro')}
      >
        <Text style={[styles.genreButtonText, selectedGenre === 'Otro' && { color: '#fff' }]}>Otro</Text>
      </TouchableOpacity>
    </View>
  );
  

  const filteredResultados = selectedGenre
    ? resultados.filter((participante) => participante.sexo === selectedGenre)
    : resultados;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultados de Participantes</Text>
      {renderGenreButtons()}
      {filteredResultados.length > 0 ? (
        <FlatList
          data={filteredResultados}
          renderItem={renderParticipanteItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text style={styles.noResultText}>Ningún participante ha llegado todavía.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 16,
    marginTop: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  genreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    marginHorizontal: -10,
  },
  genreButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#395F85',
    borderRadius: 5,
    marginHorizontal: 10,
    color: '#395F85', // Color de texto por defecto
  },
  genreButtonSelected: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#395F85',
    borderRadius: 5,
    marginHorizontal: 10,
    color: '#fff', // Color de texto cuando está seleccionado
  },
  genreButtonText: {
    fontWeight: 'bold',
  },
  participanteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  participanteIndex: {
    marginRight: 10,
    fontSize: 16,
  },
  participanteDetails: {
    flex: 1,
  },
  participanteName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  noResultText: {
    marginTop: 20,
    textAlign: 'center',
  },
});

export default ResultadosScreen;
