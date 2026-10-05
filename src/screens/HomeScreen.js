// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity
} from 'react-native';

import { auth } from '../../firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isCadastro, setIsCadastro] = useState(false);

  const handleAutenticacao = () => {
    if (!email || !senha) {
      Alert.alert(
        'Campos obrigatórios',
        'Por favor, preencha todos os campos.'
      );
      return;
    }

    if (isCadastro) {
      createUserWithEmailAndPassword(auth, email, senha)
        .then(() => {
          Alert.alert(
            'Cadastro realizado',
            'Sua conta foi criada com sucesso!'
          );

          setIsCadastro(false);
        })
        .catch((error) =>
          Alert.alert(
            'Erro ao cadastrar',
            error.message
          )
        );
    } else {
      signInWithEmailAndPassword(auth, email, senha)
        .then(() => navigation.replace('Home'))
        .catch((error) =>
          Alert.alert(
            'Erro ao entrar',
            error.message
          )
        );
    }
  };

  return (
    <View style={styles.tela}>

      {/* ÁREA PRINCIPAL */}
      <View style={styles.container}>

        {/* MARCA / ÍCONE */}
        <View style={styles.logo}>
          <Text style={styles.logoTexto}>A</Text>
        </View>

        <Text style={styles.titulo}>
          {isCadastro ? 'Criar conta' : 'Boas-vindas'}
        </Text>

        <Text style={styles.subtitulo}>
          {isCadastro
            ? 'Cadastre-se para começar a usar sua agenda'
            : 'Entre para acessar seus contatos'}
        </Text>

        {/* FORMULÁRIO */}
        <View style={styles.formulario}>

          <Text style={styles.label}>
            E-mail
          </Text>

          <TextInput
            placeholder="Digite seu e-mail"
            placeholderTextColor="#829AB1"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>
            Senha
          </Text>

          <TextInput
            placeholder="Digite sua senha"
            placeholderTextColor="#829AB1"
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.botao}
            onPress={handleAutenticacao}
            activeOpacity={0.8}
          >
            <Text style={styles.botaoTexto}>
              {isCadastro ? 'Criar minha conta' : 'Entrar'}
            </Text>
          </TouchableOpacity>

        </View>

        {/* ALTERNAR LOGIN / CADASTRO */}
        <TouchableOpacity
          onPress={() => setIsCadastro(!isCadastro)}
          style={styles.alternarContainer}
        >
          <Text style={styles.alternarTexto}>
            {isCadastro
              ? 'Já possui uma conta? '
              : 'Ainda não possui uma conta? '}

            <Text style={styles.destaque}>
              {isCadastro ? 'Entrar' : 'Cadastrar'}
            </Text>
          </Text>
        </TouchableOpacity>

      </View>

      {/* RODAPÉ */}
      <Text style={styles.rodape}>
        Minha Agenda
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  tela: {
    flex: 1,
    backgroundColor: '#F4F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },

  container: {
    width: '100%',
    maxWidth: 410,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 25,

    borderWidth: 1,
    borderColor: '#E1E8ED',

    shadowColor: '#102A43',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  logo: {
    width: 58,
    height: 58,
    borderRadius: 15,
    backgroundColor: '#D9F0F2',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  logoTexto: {
    color: '#147D92',
    fontSize: 25,
    fontWeight: '800',
  },

  titulo: {
    color: '#243B53',
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
  },

  subtitulo: {
    color: '#829AB1',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 24,
    lineHeight: 19,
  },

  formulario: {
    width: '100%',
  },

  label: {
    color: '#52606D',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },

  input: {
    height: 48,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#D9E2EC',
    borderRadius: 9,
    paddingHorizontal: 13,
    marginBottom: 15,
    color: '#243B53',
    fontSize: 14,
  },

  botao: {
    height: 47,
    backgroundColor: '#147D92',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
  },

  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  alternarContainer: {
    marginTop: 21,
    alignItems: 'center',
  },

  alternarTexto: {
    color: '#829AB1',
    fontSize: 13,
    textAlign: 'center',
  },

  destaque: {
    color: '#147D92',
    fontWeight: '800',
  },

  rodape: {
    position: 'absolute',
    bottom: 20,
    color: '#9FB3C8',
    fontSize: 12,
  },

});
