import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import InscripcionesScreen from './screens/InscripcionesScreen';
import LlegadaScreen from './screens/LLegadaScreen'
import ResultadosScreen from './screens/ResultadosScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import ConsultasScreen from './screens/ConsultasScreen';

const AppNavigator = () => {
  const [isMenuVisible, setMenuVisibility] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Welcome');
  const [participantes, setParticipantes] = useState([]);
  const handleInscripcion = (nuevoParticipante) => {
    // Lógica para agregar nuevo participante a la lista
    setParticipantes((prevParticipantes) => [...prevParticipantes, nuevoParticipante]);
  };

  const handleOptionPress = (option) => {
    setSelectedOption(option);
    setMenuVisibility(false);
  };

  const toggleMenu = () => {
    setMenuVisibility(!isMenuVisible);
  };

  const renderOption = (option) => {
    const isSelected = option === selectedOption;

    return (
      <TouchableOpacity
        style={[styles.option, isSelected && styles.selectedOption]}
        onPress={() => handleOptionPress(option)}
      >
        <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
          {option}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <FontAwesomeIcon icon={faBars} size={20} color="black" />
      </TouchableOpacity>

      {isMenuVisible && (
        <View style={styles.menu}>
          {renderOption('Welcome')}
          {renderOption('Inscripciones')}
          {renderOption('Llegada')}
          {renderOption('Resultados')}
          {renderOption('Consultas')}
        </View>
      )}

      <View style={styles.content}>
        {selectedOption === 'Welcome' && <WelcomeScreen />}
        {selectedOption === 'Inscripciones' && <InscripcionesScreen onInscripcion={handleInscripcion} />}
        {selectedOption === 'Llegada' && <LlegadaScreen participantes={participantes}/>}
        {selectedOption === 'Resultados' && <ResultadosScreen participantes={participantes}/>}
        {selectedOption === 'Consultas' && <ConsultasScreen />}

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  menuButton: {
    padding: 16,
    marginTop: 40, // Ajusta la posición vertical del botón
    zIndex: 15, // Ajusta el índice de apilamiento del botón
  },
  menu: {
    position: 'absolute',
    top: 100, // Ajusta la posición vertical del menú
    left: 0, // Ajusta la posición horizontal del menú
    backgroundColor: '#1a2f44',
    paddingVertical: 20,
    paddingHorizontal: 10, // Ajusta el espacio entre las opciones
    width: '70%',
    height: '100%',
    alignItems: 'flex-start', // Alinea las opciones a la izquierda
    borderRadius: 5,
    elevation: 5,
    zIndex: 10,
  },
  option: {
    paddingVertical: 10,
    marginBottom: 10,
  },
  optionText: {
    color: 'white',
    fontSize:16,
    marginTop:15,
    padding: 5,
  },
  selectedOption: {
    backgroundColor: 'rgb(57 95 133)',
    borderRadius: 5,
    width: '104%',
    padding: '5%',
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: 'white',
    width:'100%',
    fontSize:16,
    marginBottom:20,
  },
  content: {
    flex: 3,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;
