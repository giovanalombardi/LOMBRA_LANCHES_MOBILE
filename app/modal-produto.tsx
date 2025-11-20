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

// --- CONFIGURAÇÃO DA API ---
// O IP que pegamos no seu ipconfig
const BASE_URL = 'https://patrica-uninoculated-janis.ngrok-free.dev'; 
const RESTAURANTE_ID = 1;

// Cor principal (Vermelho iFood)
const COR_PRINCIPAL = '#EA1D2C';

export default function ModalProduto() {
  const router = useRouter(); 
  const params = useLocalSearchParams();
  
  // Lógica para pegar o ID corretamente
  const idParam = params.id; 
  const idString = Array.isArray(idParam) ? idParam[0] : idParam;
  const idNumerico = idString ? Number(idString) : null;
  const isEditMode = !!idNumerico;
  
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);

  // Helper para alertas
  const showAppAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert(title, message);
    }
  };

  // --- 1. BUSCAR DADOS DO SERVIDOR (SE FOR EDIÇÃO) ---
  useEffect(() => {
    if (isEditMode) {
      setIsFetchingData(true);
      // Busca todos os produtos do restaurante e filtra o correto
      fetch(`${BASE_URL}/restaurants/${RESTAURANTE_ID}/products`)
        .then(res => {
          if (!res.ok) throw new Error('Erro ao conectar na API');
          return res.json();
        })
        .then(data => {
          // A API retorna um array, vamos achar o nosso produto
          const produtoParaEditar = data.find((p: any) => p.id === idNumerico);
          
          if (produtoParaEditar) {
            setNome(produtoParaEditar.name); // Python manda 'name'
            setDescricao(produtoParaEditar.description); // Python manda 'description'
            setPreco(produtoParaEditar.price.toString()); // Python manda 'price'
          } else {
            showAppAlert('Erro', 'Produto não encontrado no servidor.');
            router.back();
          }
        })
        .catch(e => {
          console.error(e);
          showAppAlert('Erro', 'Não foi possível carregar os dados. O backend está rodando?');
        })
        .finally(() => setIsFetchingData(false));
    } else {
      setIsFetchingData(false);
    }
  }, [idNumerico, isEditMode]);


  // --- 2. SALVAR NO SERVIDOR (POST ou PUT) ---
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
      // Define URL e Método
      let url, method;
      
      if (isEditMode) {
        // ATUALIZAR: PUT /products/<id>
        url = `${BASE_URL}/products/${idNumerico}`;
        method = 'PUT';
      } else {
        // CRIAR: POST /restaurants/<id>/products
        url = `${BASE_URL}/restaurants/${RESTAURANTE_ID}/products`;
        method = 'POST';
      }

      // Monta o JSON para o Python (names em inglês)
      const body = JSON.stringify({
        name: nome,
        description: descricao,
        price: precoNumerico,
        image_url: "" // Enviamos vazio por enquanto
      });

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: body
      });

      if (response.ok) {
        if (router.canGoBack()) {
          router.back(); // Volta para a lista
        }
      } else {
        throw new Error('Erro na resposta da API');
      }

    } catch (e) {
      console.error(e);
      showAppAlert('Erro', 'Não foi possível salvar. Verifique a conexão com o PC.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COR_PRINCIPAL} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ title: isEditMode ? 'Editar Produto' : 'Novo Produto' }} 
      />
      
      <Text style={styles.label}>Nome do Produto *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Pizza Calabresa"
        placeholderTextColor="#999999"
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
        color={COR_PRINCIPAL}
      />
    </View>
  );
}

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