
import { Picker } from '@react-native-picker/picker';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';

export default function FormularioGasto({
  descripcion,
  setDescripcion,
  monto,
  setMonto,
  categoria,
  setCategoria,
  onAgregar,
  onEditar,
  modoEdicion,
  deshabilitado,
}) {
  return (
    <View style={styles.formulario}>
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TextInput
        style={styles.input}
        placeholder="Monto"
        value={monto}
        onChangeText={setMonto}
        keyboardType="decimal-pad"
      />

      <View style={styles.selector}>
        <Picker
          selectedValue={categoria}
          onValueChange={setCategoria}
          enabled={!deshabilitado}
        >
          <Picker.Item
            label="Selecciona una categoría"
            value=""
            enabled={false}
          />
          <Picker.Item
            label="Alimentación"
            value="Alimentación"
          />
          <Picker.Item
            label="Transporte"
            value="Transporte"
          />
          <Picker.Item
            label="Entretenimiento"
            value="Entretenimiento"
          />
          <Picker.Item
            label="Salud"
            value="Salud"
          />
          <Picker.Item
            label="Otros"
            value="Otros"
          />
        </Picker>
      </View>

      <Pressable
        style={[
          styles.boton,
          deshabilitado && styles.botonDeshabilitado,
        ]}
        onPress={modoEdicion ? onEditar : onAgregar}
        disabled={deshabilitado}
      >
        <Text style={styles.textoBoton}>
          {modoEdicion ? 'Guardar cambios' : 'Agregar gasto'}
        </Text>
      </Pressable>

      {modoEdicion && (
        <Text style={styles.textoEdicion}>
          Estás editando un gasto existente.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  formulario: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 15,
  },
  selector: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
  },
  boton: {
    backgroundColor: '#53745B',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonDeshabilitado: {
    opacity: 0.5,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textoEdicion: {
    color: '#777777',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
  },
});