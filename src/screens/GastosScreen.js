
import { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';

import {
  cargarGastos,
  agregarGasto,
  eliminarGasto,
  editarGasto,
} from '../controllers/GastosController';

import FormularioGasto from '../components/FormularioGasto';
import ListaGastos from '../components/ListaGastos';

export default function GastosScreen() {
  const [gastos, setGastos] = useState([]);

  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');

  const [gastoEnEdicion, setGastoEnEdicion] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const modoEdicion = gastoEnEdicion !== null;

  useEffect(() => {
    async function iniciar() {
      try {
        const datos = await cargarGastos();
        setGastos(datos);
      } catch (error) {
        Alert.alert(
          'Error',
          'No se pudieron cargar los gastos.'
        );
      } finally {
        setCargando(false);
      }
    }

    iniciar();
  }, []);

  // --- NUEVAS FUNCIONALIDADES SOLICITADAS ---

  // 1. Filtrar los gastos por categoría (Vector específico para Alimentación)
  const gastosAlimentacion = gastos.filter(
    (gasto) => gasto.categoria === 'Alimentación'
  );

  // 2. Mostrar cuánto se gastó en la categoría Alimentación
  const totalAlimentacion = gastosAlimentacion.reduce(
    (total, gasto) => total + Number(gasto.monto),
    0
  );

  // Total general gastado
  const totalGastos = gastos.reduce(
    (total, gasto) => total + Number(gasto.monto),
    0
  );

  // 3. Mostrar cuál fue el gasto más alto
  const gastoMasAlto = gastos.length > 0
    ? Math.max(...gastos.map((gasto) => Number(gasto.monto)))
    : 0;

  // 4. Mostrar la cantidad total de gastos (número de registros)
  const cantidadGastos = gastos.length;

  // ------------------------------------------

  const limpiarFormulario = () => {
    setDescripcion('');
    setMonto('');
    setCategoria('');
    setGastoEnEdicion(null);
  };

  const manejarAgregar = async () => {
    if (guardando || cargando) {
      return;
    }

    try {
      setGuardando(true);

      const nuevosGastos = await agregarGasto(
        gastos,
        descripcion,
        monto,
        categoria
      );

      setGastos(nuevosGastos);
      limpiarFormulario();
    } catch (error) {
      Alert.alert(
        'No se pudo agregar el gasto',
        error.message || 'Ocurrió un error inesperado.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const manejarEditar = (gasto) => {
    setGastoEnEdicion(gasto.id);
    setDescripcion(gasto.descripcion);
    setMonto(String(gasto.monto));
    setCategoria(gasto.categoria);
  };

  const manejarGuardarEdicion = async () => {
    if (guardando || cargando || gastoEnEdicion === null) {
      return;
    }

    try {
      setGuardando(true);

      const nuevosGastos = await editarGasto(
        gastos,
        gastoEnEdicion,
        descripcion,
        monto,
        categoria
      );

      setGastos(nuevosGastos);
      limpiarFormulario();
    } catch (error) {
      Alert.alert(
        'No se pudieron guardar los cambios',
        error.message || 'Ocurrió un error inesperado.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const manejarEliminar = (id) => {
    if (guardando || cargando) {
      return;
    }

    Alert.alert(
      'Eliminar gasto',
      '¿Estás seguro de que querés eliminar este gasto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            if (guardando) {
              return;
            }

            try {
              setGuardando(true);

              const nuevosGastos = await eliminarGasto(
                gastos,
                id
              );

              setGastos(nuevosGastos);

              if (gastoEnEdicion === id) {
                limpiarFormulario();
              }
            } catch (error) {
              Alert.alert(
                'Error',
                'No se pudo eliminar el gasto.'
              );
            } finally {
              setGuardando(false);
            }
          },
        },
      ]
    );
  };

  if (cargando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color="#53745B" />
        <Text style={styles.textoCargando}>
          Cargando gastos...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis gastos</Text>
      
      {/* Tarjeta de Resumen con los nuevos datos calculados */}
      <View style={styles.resumen}>
        <Text style={styles.textoResumen}>Total general gastado</Text>
        <Text style={styles.totalGastos}>
          ${totalGastos.toLocaleString('es-AR')}
        </Text>

        <View style={styles.estadisticasContainer}>
          <Text style={styles.textoEstadistica}>
            🍔 Alimentación: ${totalAlimentacion.toLocaleString('es-AR')} ({gastosAlimentacion.length} items)
          </Text>
          <Text style={styles.textoEstadistica}>
            📈 Gasto más alto: ${gastoMasAlto.toLocaleString('es-AR')}
          </Text>
          <Text style={styles.textoEstadistica}>
            📋 Cantidad total de registros: {cantidadGastos}
          </Text>
        </View>
      </View>

      <Text style={styles.subtitulo}>
        Registro de gastos personales
      </Text>

      <FormularioGasto
        descripcion={descripcion}
        setDescripcion={setDescripcion}
        monto={monto}
        setMonto={setMonto}
        categoria={categoria}
        setCategoria={setCategoria}
        onAgregar={manejarAgregar}
        onEditar={manejarGuardarEdicion}
        modoEdicion={modoEdicion}
        deshabilitado={guardando}
      />

      {modoEdicion && (
        <Pressable
          style={styles.botonCancelar}
          onPress={limpiarFormulario}
          disabled={guardando}
        >
          <Text style={styles.textoCancelar}>
            Cancelar edición
          </Text>
        </Pressable>
      )}

      <ListaGastos
        gastos={gastos}
        onEliminarGasto={manejarEliminar}
        onEditarGasto={manejarEditar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4EF',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitulo: {
    fontSize: 15,
    color: '#777777',
    marginTop: 5,
    marginBottom: 20,
  },
  resumen: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textoResumen: {
    fontSize: 14,
    color: '#777777',
  },
  totalGastos: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 2,
    marginBottom: 8,
  },
  estadisticasContainer: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 8,
    marginTop: 4,
  },
  textoEstadistica: {
    fontSize: 13,
    color: '#555555',
    marginVertical: 2,
  },
  cargando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F4EF',
  },
  textoCargando: {
    marginTop: 12,
    color: '#777777',
  },
  botonCancelar: {
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  textoCancelar: {
    color: '#777777',
    fontWeight: '600',
  },
});