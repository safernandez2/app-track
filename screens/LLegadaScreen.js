import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome5 } from '@expo/vector-icons';
import 'moment/locale/es';

const generateUniqueId = () => {
  return new Date().getTime().toString();
};

const LlegadaScreen = () => {
  const [participantes, setParticipantes] = useState([]);
  const [selectedParticipante, setSelectedParticipante] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArrivalHour, setSelectedArrivalHour] = useState(0); // Cambiado a número
  const [selectedArrivalMinute, setSelectedArrivalMinute] = useState(0); // Cambiado a número
  const [selectedDepartureHour, setSelectedDepartureHour] = useState(0); // Cambiado a número
  const [selectedDepartureMinute, setSelectedDepartureMinute] = useState(0); // Cambiado a número
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [participanteToDelete, setParticipanteToDelete] = useState(null);

  useEffect(() => {
    const cargarParticipantes = async () => {
      try {
        const participantesStr = await AsyncStorage.getItem('participantes');
        const participantes = participantesStr ? JSON.parse(participantesStr) : [];
        console.log('Participantes cargados:', participantes);

        const participantesConId = participantes.map((p) => ({
          ...p,
          id: p.id || generateUniqueId(),
          selectedArrivalHour: p.selectedArrivalTime ? Math.floor(p.selectedArrivalTime / 100).toString() : '0', // Cambiado a string
          selectedArrivalMinute: p.selectedArrivalTime ? (p.selectedArrivalTime % 100).toString() : '0', // Cambiado a string
          selectedDepartureHour: p.selectedDepartureTime ? Math.floor(p.selectedDepartureTime / 100).toString() : '0', // Cambiado a string
          selectedDepartureMinute: p.selectedDepartureTime ? (p.selectedDepartureTime % 100).toString() : '0', // Cambiado a string
        }));

        setParticipantes(participantesConId);
      } catch (error) {
        console.error('Error al cargar la lista de participantes', error);
      }
    };

    cargarParticipantes();
  }, []);

  const handleParticipantePress = (participante) => {
    console.log('Participante seleccionado:', participante);
    setSelectedParticipante(participante);
    setModalVisible(true);
  };

  const handleGuardarTiempo = async () => {
    if (selectedParticipante) {
      const arrivalTimeNumerical = parseInt(`${selectedArrivalHour.toString().padStart(2, '0')}${selectedArrivalMinute.toString().padStart(2, '0')}`, 10);
      const departureTimeNumerical = parseInt(`${selectedDepartureHour.toString().padStart(2, '0')}${selectedDepartureMinute.toString().padStart(2, '0')}`, 10);
      const participantesActualizados = participantes.map((p) => ({
        ...p,
        selectedArrivalTime: p.id === selectedParticipante.id ? arrivalTimeNumerical : p.selectedArrivalTime,
        selectedDepartureTime: p.id === selectedParticipante.id ? departureTimeNumerical : p.selectedDepartureTime,
      }));
  
      setParticipantes(participantesActualizados);
  
      await AsyncStorage.setItem('participantes', JSON.stringify(participantesActualizados));
  
      setModalVisible(false);
      setSelectedParticipante(null);
      setSelectedArrivalHour('0'); // Cambiado a string
      setSelectedArrivalMinute('0'); // Cambiado a string
      setSelectedDepartureHour('0'); // Cambiado a string
      setSelectedDepartureMinute('0'); // Cambiado a string
    }
  };

  const borrarParticipante = async (participanteId) => {
    const participante = participantes.find((p) => p.id === participanteId);
    setParticipanteToDelete(participante);
    setDeleteConfirmationVisible(true);
  };

  const confirmarBorrarParticipante = async () => {
    try {
      const participantesActualizados = participantes.filter((p) => p.id !== participanteToDelete.id);

      await AsyncStorage.setItem('participantes', JSON.stringify(participantesActualizados));

      setParticipantes(participantesActualizados);
      setDeleteConfirmationVisible(false);
    } catch (error) {
      console.error('Error al intentar borrar el participante', error);
    }
  };

  const keyExtractor = (item, index) => item.id || index.toString();

  const renderParticipanteItem = ({ item }) => {
    console.log('Datos del participante a renderizar:', item);
  
    return (
      <View style={styles.participanteItemContainer}>
        <TouchableOpacity onPress={() => handleParticipantePress(item)} style={styles.participanteItem}>
          <Text style={styles.participanteDetail}><Text style={styles.boldText}>Nombre:</Text> {item.nombre}</Text>
          <Text style={styles.participanteDetail}><Text style={styles.boldText}>Edad:</Text> {item.edad}</Text>
          <Text style={styles.participanteDetail}><Text style={styles.boldText}>Cedula:</Text> {item.cedula}</Text>
          <Text style={styles.participanteDetail}><Text style={styles.boldText}>Sexo:</Text> {item.sexo}</Text>
          <Text style={styles.participanteDetail}><Text style={styles.boldText}>Llegada:</Text> {formatTiempo(item.selectedArrivalTime) || 'Sin tiempo'}</Text>
          <Text style={styles.participanteDetail}><Text style={styles.boldText}>Salida:</Text> {formatTiempo(item.selectedDepartureTime) || 'Sin tiempo'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => borrarParticipante(item.id)} style={styles.deleteButton}>
          <FontAwesome5 name="trash-alt" size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  

  const formatTiempo = (tiempo) => {
    if (tiempo === null || tiempo === undefined) {
      return '';
    }
    const horas = Math.floor(tiempo / 100);
    const minutos = tiempo % 100;
    const horasStr = horas < 10 ? `0${horas}` : horas.toString();
    const minutosStr = minutos < 10 ? `0${minutos}` : minutos.toString();
    return `${horasStr}:${minutosStr}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Participantes</Text>
      <FlatList
        data={participantes}
        renderItem={renderParticipanteItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.flatList}
      />
      <Modal visible={deleteConfirmationVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar eliminación</Text>
            <Text>{`¿Seguro que quieres eliminar a ${participanteToDelete?.nombre}?`}</Text>
            <View style={styles.confirmationButtonsContainer}>
              <Button title="Cancelar" onPress={() => setDeleteConfirmationVisible(false)} color="rgb(57 95 133)"/>
              <Button title="Sí, eliminar" onPress={confirmarBorrarParticipante} color="#be3535" />
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <FontAwesome5 name="times" size={20} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{`Detalles de ${selectedParticipante?.nombre}`}</Text>
            <Text>{`Nombre: ${selectedParticipante?.nombre}`}</Text>
            <Text>{`Edad: ${selectedParticipante?.edad}`}</Text>
            <Text>{`Cedula: ${selectedParticipante?.cedula}`}</Text>
            <Text>{`Sexo: ${selectedParticipante?.sexo}`}</Text>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Hora de Salida:</Text>
              <Picker
                style={styles.picker}
                selectedValue={selectedDepartureHour}
                onValueChange={(itemValue) => setSelectedDepartureHour(itemValue)}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <Picker.Item key={i} label={i < 10 ? `0${i}` : i.toString()} value={i.toString()} /> // Convertido a string
                ))}
              </Picker>
              <Picker
                style={styles.picker}
                selectedValue={selectedDepartureMinute}
                onValueChange={(itemValue) => setSelectedDepartureMinute(itemValue)}
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <Picker.Item key={i} label={i < 10 ? `0${i}` : i.toString()} value={i.toString()} /> // Convertido a string
                ))}
              </Picker>
            </View>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Hora de Llegada:</Text>
              <Picker
                style={styles.picker}
                selectedValue={selectedArrivalHour}
                onValueChange={(itemValue) => setSelectedArrivalHour(itemValue)}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <Picker.Item key={i} label={i < 10 ? `0${i}` : i.toString()} value={i.toString()} /> // Convertido a string
                ))}
              </Picker>
              <Picker
                style={styles.picker}
                selectedValue={selectedArrivalMinute}
                onValueChange={(itemValue) => setSelectedArrivalMinute(itemValue)}
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <Picker.Item key={i} label={i < 10 ? `0${i}` : i.toString()} value={i.toString()} /> // Convertido a string
                ))}
              </Picker>
            </View>

            <Button color={'#395F85'} title="Guardar Tiempo" onPress={handleGuardarTiempo} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
    marginTop: 50, 
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#395F85',
  },
  participanteItemContainer: {
    flexDirection: 'column', // Cambiado a 'column' para mostrar los datos verticalmente
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '100%', // Ajuste del ancho para ocupar todo el espacio disponible
  },
  participanteItem: {
    flex: 1,
    marginBottom: 10, // Añadido margen inferior para separar los detalles del participante
  },
  participanteDetail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: '#D9534F',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#395F85',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  pickerLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  picker: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  confirmationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  flatList: {
    width: '100%',
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default LlegadaScreen;
