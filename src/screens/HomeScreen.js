// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import { db, auth } from '../../firebaseConfig';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function HomeScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const [idEditando, setIdEditando] = useState(null);
  const [contatos, setContatos] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'contatos'),
      (snapshot) => {
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setContatos(lista);
      }
    );

    return () => unsubscribe();
  }, []);

  const limparFormulario = () => {
    setNome('');
    setEmail('');
    setTelefone('');
    setIdEditando(null);
  };

  const salvarContato = async () => {
    if (!nome.trim() || !email.trim() || !telefone.trim()) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const dadosContato = {
      nome,
      email,
      telefone
    };

    try {
      if (idEditando !== null && idEditando !== '') {
        const contatoRef = doc(db, 'contatos', idEditando);
        await updateDoc(contatoRef, dadosContato);
      } else {
        await addDoc(collection(db, 'contatos'), dadosContato);
      }

      limparFormulario();
    } catch (error) {
      console.error('Erro na operação:', error);
      alert('Erro ao salvar dados no Firestore.');
    }
  };

  const deletarContato = async (id) => {
    try {
      await deleteDoc(doc(db, 'contatos', id));

      if (idEditando === id) {
        limparFormulario();
      }
    } catch (error) {
      console.error('Erro ao remover:', error);
    }
  };

  const iniciarEdicao = (contato) => {
    setIdEditando(contato.id);
    setNome(contato.nome);
    setEmail(contato.email);
    setTelefone(contato.telefone);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigation.replace('Login'))
      .catch((error) => console.error(error));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.tela}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#102A43"
      />

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitulo}>Meus Contatos</Text>
          <Text style={styles.headerSubtitulo}>
            Sua agenda pessoal
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logout}
        >
          <Text style={styles.logoutTexto}>SAIR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.conteudo}>

        {/* FORMULÁRIO */}
        <View style={styles.formulario}>

          <View style={styles.tituloLinha}>
            <View style={styles.indicador} />

            <Text style={styles.formularioTitulo}>
              {idEditando
                ? 'Editar contato'
                : 'Adicionar contato'}
            </Text>
          </View>

          <TextInput
            placeholder="Nome completo"
            placeholderTextColor="#829AB1"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            placeholder="E-mail"
            placeholderTextColor="#829AB1"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Telefone"
            placeholderTextColor="#829AB1"
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />

          <View style={styles.botoesFormulario}>

            <TouchableOpacity
              style={[
                styles.botaoSalvar,
                idEditando && styles.botaoAtualizar
              ]}
              onPress={salvarContato}
            >
              <Text style={styles.textoSalvar}>
                {idEditando
                  ? 'Atualizar contato'
                  : 'Salvar contato'}
              </Text>
            </TouchableOpacity>

            {idEditando && (
              <TouchableOpacity
                style={styles.botaoCancelar}
                onPress={limparFormulario}
              >
                <Text style={styles.textoCancelar}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            )}

          </View>
        </View>

        {/* CABEÇALHO DA LISTA */}
        <View style={styles.listaHeader}>
          <Text style={styles.listaTitulo}>
            Contatos
          </Text>

          <View style={styles.contador}>
            <Text style={styles.contadorTexto}>
              {contatos.length}
            </Text>
          </View>
        </View>

        {/* LISTA */}
        <FlatList
          data={contatos}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <View style={styles.cardContato}>

              <View style={styles.avatar}>
                <Text style={styles.avatarTexto}>
                  {item.nome
                    ? item.nome.charAt(0).toUpperCase()
                    : '?'}
                </Text>
              </View>

              <View style={styles.dadosContato}>
                <Text
                  style={styles.nomeContato}
                  numberOfLines={1}
                >
                  {item.nome}
                </Text>

                <Text
                  style={styles.detalheContato}
                  numberOfLines={1}
                >
                  {item.email}
                </Text>

                <Text
                  style={styles.detalheContato}
                  numberOfLines={1}
                >
                  {item.telefone}
                </Text>
              </View>

              <View style={styles.acoes}>

                <TouchableOpacity
                  onPress={() => iniciarEdicao(item)}
                  style={styles.botaoEditar}
                >
                  <Text style={styles.iconeAcao}>✎</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => deletarContato(item.id)}
                  style={styles.botaoExcluir}
                >
                  <Text style={styles.iconeAcao}>×</Text>
                </TouchableOpacity>

              </View>

            </View>
          )}
        />

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  tela: {
    flex: 1,
    backgroundColor: '#F4F7FA',
  },

  header: {
    backgroundColor: '#102A43',
    paddingTop: 48,
    paddingBottom: 22,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitulo: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  headerSubtitulo: {
    color: '#BCCCDC',
    fontSize: 13,
    marginTop: 4,
  },

  logout: {
    borderWidth: 1,
    borderColor: '#486581',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },

  logoutTexto: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  conteudo: {
    flex: 1,
    width: '100%',
    maxWidth: 650,
    alignSelf: 'center',
    paddingHorizontal: 17,
    paddingTop: 17,
  },

  formulario: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 17,
    marginBottom: 20,

    borderWidth: 1,
    borderColor: '#E1E8ED',

    shadowColor: '#102A43',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 7,
    elevation: 2,
  },

  tituloLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  indicador: {
    width: 4,
    height: 22,
    backgroundColor: '#2CB1BC',
    borderRadius: 4,
    marginRight: 9,
  },

  formularioTitulo: {
    color: '#243B53',
    fontSize: 17,
    fontWeight: '700',
  },

  input: {
    height: 47,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#D9E2EC',
    borderRadius: 9,
    paddingHorizontal: 13,
    marginBottom: 11,
    color: '#243B53',
    fontSize: 14,
  },

  botoesFormulario: {
    flexDirection: 'row',
    marginTop: 3,
  },

  botaoSalvar: {
    flex: 1,
    backgroundColor: '#147D92',
    height: 45,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  botaoAtualizar: {
    backgroundColor: '#D97706',
  },

  textoSalvar: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  botaoCancelar: {
    marginLeft: 9,
    paddingHorizontal: 18,
    height: 45,
    borderRadius: 9,
    backgroundColor: '#E9EEF2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoCancelar: {
    color: '#52606D',
    fontSize: 14,
    fontWeight: '600',
  },

  listaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 3,
  },

  listaTitulo: {
    color: '#243B53',
    fontSize: 18,
    fontWeight: '800',
  },

  contador: {
    marginLeft: 8,
    minWidth: 25,
    height: 25,
    paddingHorizontal: 7,
    borderRadius: 13,
    backgroundColor: '#D9F0F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  contadorTexto: {
    color: '#147D92',
    fontSize: 12,
    fontWeight: '800',
  },

  lista: {
    paddingBottom: 30,
  },

  cardContato: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 13,
    marginBottom: 9,

    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#E5EAF0',

    shadowColor: '#102A43',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#D9F0F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarTexto: {
    color: '#147D92',
    fontSize: 18,
    fontWeight: '800',
  },

  dadosContato: {
    flex: 1,
    paddingRight: 7,
  },

  nomeContato: {
    color: '#243B53',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },

  detalheContato: {
    color: '#829AB1',
    fontSize: 12,
    marginTop: 2,
  },

  acoes: {
    flexDirection: 'row',
    gap: 6,
  },

  botaoEditar: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#FFF4D6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  botaoExcluir: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#FDE8E7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconeAcao: {
    fontSize: 19,
    fontWeight: '700',
    color: '#52606D',
  },

});
