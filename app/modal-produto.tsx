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
  const { id } = useLocalSearchParams(); 
  
  const idNumerico = id ? Number(id) : null;
  const isEditMode = !!idNumerico;
  
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);

  // --- Efeito para buscar dados (se for edição) ---
  useEffect(() => {
    if (isEditMode) {
      // Modo Edição: buscar dados do produto do storage
      setIsFetchingData(true);
      const loadProduto = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
          const produtos: Produto[] = jsonValue != null ? JSON.parse(jsonValue) : [];
          
          const produtoParaEditar = produtos.find(p => p.id === idNumerico);
          
          if (produtoParaEditar) {
            setNome(produtoParaEditar.nome);
            setDescricao(produtoParaEditar.descricao);
            setPreco(produtoParaEditar.preco.toString());
          } else {
            if (Platform.OS === 'web') {
              window.alert('Erro! Produto não encontrado.');
            } else {
              Alert.alert('Erro', 'Produto não encontrado.');
            }
            router.back();
          }
        } catch (e) {
          if (Platform.OS === 'web') {
            window.alert('Erro! Não foi possível carregar os dados do produto.');
          } else {
            Alert.alert('Erro', 'Não foi possível carregar os dados do produto.');
          }
        } finally {
          setIsFetchingData(false);
        }
      };
      loadProduto();
    } else {
      // Modo Criação
      setIsFetchingData(false);
    }
  }, [idNumerico, isEditMode, router]);


  // --- FUNÇÃO DE SALVAR (Create ou Update) ---
  const handleSalvar = async () => {
    // Validação
    if (!nome || !preco) {
      if (Platform.OS === 'web') {
        window.alert('Erro! Nome e Preço são obrigatórios.');
      } else {
        Alert.alert('Erro', 'Nome e Preço são obrigatórios.');
      }
      return;
    }
    const precoNumerico = parseFloat(preco);
    if (isNaN(precoNumerico)) {
      if (Platform.OS === 'web') {
        window.alert('Erro! O preço deve ser um número válido.');
      } else {
        Alert.alert('Erro', 'O preço deve ser um número válido.');
      }
      return;
    }

    setIsLoading(true);

    try {
      // Ler a lista atual
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      const produtosAtuais: Produto[] = jsonValue != null ? JSON.parse(jsonValue) : [];
      
      if (isEditMode) {
        // --- LÓGICA DE UPDATE ---
        const novosProdutos = produtosAtuais.map(p => 
          p.id === idNumerico 
          ? { ...p, nome, descricao, preco: precoNumerico } // Atualiza o produto
          : p
        );
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosProdutos));
        
      } else {
        // --- LÓGICA DE CREATE ---
        const novoProduto: Produto = {
          id: new Date().getTime(), // Gera um ID único baseado no tempo
          nome: nome,
          descricao: descricao,
          preco: precoNumerico,
        };
        
        const novosProdutos = [...produtosAtuais, novoProduto]; // Adiciona o novo
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosProdutos));
      }
      
      // Sucesso! Voltar para a tela de lista
      if (router.canGoBack()) {
        router.back();
      }

    } catch (e) {
      console.error(e);
      if (Platform.OS === 'web') {
        window.alert('Erro! Não foi possível salvar o produto.');
      } else {
        Alert.alert('Erro', 'Não foi possível salvar o produto.');
      }
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
        placeholderTextColor="#999999" // <<< --- CORRIGIDO AQUI
        value={nome}
        onChangeText={setNome}
      />
      
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Molho, queijo e calabresa"
        placeholderTextColor="#999999" // <<< --- CORRIGIDO AQUI
        value={descricao}
        onChangeText={setDescricao}
      />
      
      <Text style={styles.label}>Preço *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 48.50"
        placeholderTextColor="#999999" // <<< --- CORRIGIDO AQUI
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
      />
      
      <Button 
        title={isLoading ? "Salvando..." : (isEditMode ? "Atualizar Produto" : "Salvar Produto")} 
        onPress={handleSalvar}
        disabled={isLoading}
        color={COR_PRINCIPAL} // Cor vermelha que definimos
      />
    </View>
  );
}

// --- ESTILOS (EXATAMENTE OS MESMOS) ---
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
    fontSize: 16, // Adicionei um fontSize para ficar mais legível
    color: '#333', // Cor do texto digitado
  },
});