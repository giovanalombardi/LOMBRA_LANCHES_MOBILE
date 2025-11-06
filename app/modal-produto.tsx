import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  Alert, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chave do nosso banco de dados local
const STORAGE_KEY = '@LombaLanches:produtos';

// Cor principal (Vermelho iFood)
const COR_PRINCIPAL = '#EA1D2C';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
}

export default function ModalProduto() {
  const router = useRouter(); 
  
  // --- AQUI ESTÁ A CORREÇÃO ---
  const params = useLocalSearchParams();
  // 1. Pegamos o 'id' dos parâmetros
  const idParam = params.id; 
  // 2. Checamos se é um array. Se for, pegamos o primeiro item.
  const idString = Array.isArray(idParam) ? idParam[0] : idParam;
  // 3. Agora sim, convertemos para número.
  const idNumerico = idString ? Number(idString) : null;
  const isEditMode = !!idNumerico;
  // --- FIM DA CORREÇÃO ---
  
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);

  // --- Funções de Alerta Universais (para Web e Celular) ---
  const showAppAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert(title, message);
    }
  };

  // --- Efeito para buscar dados (se for edição) ---
  useEffect(() => {
    if (isEditMode) {
      setIsFetchingData(true);
      const loadProduto = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
          const produtos: Produto[] = jsonValue != null ? JSON.parse(jsonValue) : [];
          
          // A lógica de busca continua a mesma
          const produtoParaEditar = produtos.find(p => p.id === idNumerico);
          
          if (produtoParaEditar) {
            setNome(produtoParaEditar.nome);
            setDescricao(produtoParaEditar.descricao);
            setPreco(produtoParaEditar.preco.toString());
          } else {
            showAppAlert('Erro', 'Produto não encontrado.');
            router.back();
          }
        } catch (e) {
          showAppAlert('Erro', 'Não foi possível carregar os dados do produto.');
        } finally {
          setIsFetchingData(false);
        }
      };
      loadProduto();
    } else {
      setIsFetchingData(false);
    }
  }, [idNumerico, isEditMode, router]); // O 'idNumerico' agora é seguro


  // --- FUNÇÃO DE SALVAR (Create ou Update) ---
  const handleSalvar = async () => {
    // Validação
    if (!nome || !preco) {
      showAppAlert('Erro', 'Nome e Preço são obrigatórios.');
      return;
    }
    const precoNumerico = parseFloat(preco);
    if (isNaN(precoNumerico)) {
      showAppAlert('Erro', 'O preço deve ser um número válido.');
      return;
    }

    setIsLoading(true);

    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      const produtosAtuais: Produto[] = jsonValue != null ? JSON.parse(jsonValue) : [];
      
      if (isEditMode) {
        // --- LÓGICA DE UPDATE ---
        const novosProdutos = produtosAtuais.map(p => 
          p.id === idNumerico 
          ? { ...p, nome, descricao, preco: precoNumerico }
          : p
        );
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosProdutos));
        
      } else {
        // --- LÓGICA DE CREATE ---
        const novoProduto: Produto = {
          id: new Date().getTime(),
          nome: nome,
          descricao: descricao,
          preco: precoNumerico,
        };
        const novosProdutos = [...produtosAtuais, novoProduto];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosProdutos));
      }
      
      if (router.canGoBack()) {
        router.back();
      }

    } catch (e) {
      console.error(e);
      showAppAlert('Erro', 'Não foi possível salvar o produto.');
    } finally {
      setIsLoading(false);
    }
  };

  // Se estiver buscando dados (modo edição), mostra um loading
  if (isFetchingData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // --- TELA DO FORMULÁRIO ---
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ title: isEditMode ? 'Editar Produto' : 'Novo Produto' }} 
      />
      
      <Text style={styles.label}>Nome do Produto *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Pizza Calabresa"
        placeholderTextColor="#999999" // Cor do placeholder
        value={nome}
        onChangeText={setNome}
      />
      
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Molho, queijo e calabresa"
        placeholderTextColor="#999999"
        value={descricao}
        onChangeText={setDescricao}
      />
      
      <Text style={styles.label}>Preço *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 48.50"
        placeholderTextColor="#999999"
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
      />
      
      <Button 
        title={isLoading ? "Salvando..." : (isEditMode ? "Atualizar Produto" : "Salvar Produto")} 
        onPress={handleSalvar}
        disabled={isLoading}
        color={COR_PRINCIPAL} // Cor vermelha
      />
    </View>
  );
}

// --- ESTILOS (Com as correções de placeholder) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#333', 
  },
});