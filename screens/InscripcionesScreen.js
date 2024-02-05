import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RadioButton } from 'react-native-paper';

const generateUniqueId = () => {
  return new Date().getTime().toString();
};

const InscripcionesScreen = () => {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [cedula, setCedula] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cedulaError, setCedulaError] = useState(false);
  const [edadError, setEdadError] = useState(false);
  const [nombreError, setNombreError] = useState(false);
  const [sexoError, setSexoError] = useState(false);
  const [selectedSexo, setSelectedSexo] = useState('');
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const handleInscribir = async () => {
    if (!nombre || !edad || !cedula || !selectedSexo) {
      setErrorMessage('Completa todos los campos.');
      setErrorModalVisible(true);
      setNombreError(!nombre);
      setEdadError(!edad);
      setCedulaError(cedula.length !== 10);
      setSexoError(!selectedSexo);
      return;
    }

    if (cedula.length !== 10) {
      setErrorMessage('Cédula incompleta. Por favor, ingresa 10 dígitos.');
      setErrorModalVisible(true);
      setCedulaError(true);
      return;
    }

    try {
      const participantesStr = await AsyncStorage.getItem('participantes');
      const participantes = participantesStr ? JSON.parse(participantesStr) : [];

      const nuevoParticipante = { id: generateUniqueId(), nombre, edad: parseInt(edad), cedula, sexo: selectedSexo, tiempo: '' };
      participantes.push(nuevoParticipante);

      await AsyncStorage.setItem('participantes', JSON.stringify(participantes));

      setNombre('');
      setEdad('');
      setCedula('');
      setSelectedSexo('');
      setCedulaError(false);
      setEdadError(false);
      setNombreError(false);
      setSexoError(false);

      //setModalVisible(true);
    } catch (error) {
      console.error('Error al inscribir al participante', error);
      Alert.alert('Error al inscribir al participante');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setErrorModalVisible(false);
  };

  const togglePicker = () => {
    setIsPickerVisible(!isPickerVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Inscribe un Participante</Text>
      {nombreError && <Text style={styles.errorText}>Nombre es obligatorio*</Text>}
      <TextInput
        style={[styles.input, nombreError && styles.inputError]}
        placeholder="Nombre*"
        value={nombre}
        onChangeText={(text) => {
          setNombre(text);
          setNombreError(false);
        }}
      />
      {edadError && <Text style={styles.errorText}>Edad es obligatoria*</Text>}
      <TextInput
        style={[styles.input, edadError && styles.inputError]}
        placeholder="Edad*"
        value={edad}
        onChangeText={(text) => {
          setEdad(text.replace(/[^0-9]/g, ''));
          setEdadError(false);
        }}
        keyboardType="numeric"
        maxLength={3}
      />
      {cedulaError && <Text style={styles.errorText}>Cédula debe tener 10 dígitos*</Text>}
      <TextInput
        style={[styles.input, cedulaError && styles.inputError]}
        placeholder="Cédula*"
        value={cedula}
        onChangeText={(text) => {
          setCedula(text.replace(/[^0-9]/g, '').substring(0, 10));
          setCedulaError(false);
        }}
        keyboardType="numeric"
        maxLength={10}
      />
      {sexoError && <Text style={styles.errorText}>Género es obligatorio*</Text>}
      <View style={styles.pickerContainer}>
        <View style={styles.genderPickerContainer}>
          <Text style={[styles.pickerLabel, sexoError && styles.inputError]}>Género*</Text>
          <GenderPicker
            selectedSexo={selectedSexo}
            onValueChange={(value) => {
              setSelectedSexo(value);
              setSexoError(false);
            }}
          />
        </View>
      </View>

      {isPickerVisible && (
        <View style={styles.pickerContainer}>
          <GenderPicker
            selectedSexo={selectedSexo}
            onValueChange={(value) => {
              setSelectedSexo(value);
              setIsPickerVisible(false);
              setSexoError(false);
            }}
          />
        </View>
      )}

      <Button color={"rgb(57 95 133)"} title="Inscribir" onPress={handleInscribir} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¡Inscripción Exitosa!</Text>
            <Text>Tu participante ha sido registrado con éxito.</Text>
            <Button title="OK" onPress={closeModal} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Error</Text>
            <Text>{errorMessage}</Text>
            <Button title="OK" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const GenderPicker = ({ selectedSexo, onValueChange }) => {
  return (
    <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <RadioButton
          value="Masculino"
          status={selectedSexo === 'Masculino' ? 'checked' : 'unchecked'}
          onPress={() => onValueChange('Masculino')}
        />
        <Text style={{ marginLeft: 8 }}>Masculino</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <RadioButton
          value="Femenino"
          status={selectedSexo === 'Femenino' ? 'checked' : 'unchecked'}
          onPress={() => onValueChange('Femenino')}
          style={{ marginLeft: 8 }}
        />
        <Text style={{ marginLeft: 8 }}>Femenino</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <RadioButton
          value="Otro"
          status={selectedSexo === 'Otro' ? 'checked' : 'unchecked'}
          onPress={() => onValueChange('Otro')}
          style={{ marginLeft: 8, marginTop: 8 }}  
        />
        <Text style={{ marginLeft: 8, marginTop: 8 }}>Otro</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 100,
    marginRight: 60,
  },
  input: {
    width: 200,
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 45,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 45,
  },
  pickerLabel: {
    flex: 1,
    fontSize: 16,
  },
  genderPickerContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 8,
    paddingRight: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: -80,
    position : 'absolute',
  },
});

export default InscripcionesScreen;
