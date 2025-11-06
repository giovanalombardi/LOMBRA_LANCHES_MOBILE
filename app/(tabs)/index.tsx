import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, // Usando ScrollView
  ActivityIndicator, 
  // (SafeAreaView foi removido de 'react-native')
  StatusBar,
  Alert, 
  TouchableOpacity,
  RefreshControl,
  Platform, 
  Image 
} from 'react-native';

// 1. IMPORTANDO O NOVO SafeAReaView (corrige o aviso)
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect, useRouter } from 'expo-router';
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

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const router = useRouter(); 

  // --- Funções (fetchProdutos, showAlert, handleDelete) ---
  // (Nenhuma mudança aqui, elas estão perfeitas)
  const fetchProdutos = async () => {
    setIsLoading(true);
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      const data = jsonValue != null ? JSON.parse(jsonValue) : [];
      setProdutos(data);
    } catch (e) {
      console.error("Erro ao buscar dados:", e);
      showAlert("Erro", "Não foi possível carregar os produtos.");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchProdutos(); }, []));

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleDelete = (idParaDeletar: number) => {
    const deletarProduto = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        const produtosAtuais: Produto[] = jsonValue != null ? JSON.parse(jsonValue) : [];
        const novosProdutos = produtosAtuais.filter(
          (produto) => produto.id !== idParaDeletar
        );
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosProdutos));
        showAlert("Sucesso", "Produto deletado.");
        fetchProdutos();
      } catch (e) {
        console.error(e);
        showAlert('Erro', 'Não foi possível deletar o produto.');
      }
    };

    if (Platform.OS === 'web') {
      const usuarioConfirmou = window.confirm(
        "Tem certeza que deseja deletar este produto?"
      );
      if (usuarioConfirmou) {
        deletarProduto();
      }
    } else {
      Alert.alert(
        "Confirmar Exclusão",
        "Tem certeza que deseja deletar este produto?",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Deletar", 
            onPress: deletarProduto, 
            style: 'destructive'
          }
        ]
      );
    }
  };
  // --- Fim das Funções ---


  // --- TELA PRINCIPAL ---
  return (
    // 2. Usando o NOVO SafeAreaView
    // (Ele não precisa mais do 'marginTop: StatusBar.currentHeight')
    <SafeAreaView style={styles.container}>
      
      {/* Logo da Capivara */}
      <Image 
        source={require('../../assets/images/capivara-logo.png')} // Caminho com ../../
        style={styles.logo}
      />
      
      <Text style={styles.title}>Cardápio</Text>
      
      {/* Usando a ScrollView */}
      <ScrollView
        style={styles.listContainer}
        // 3. ADICIONANDO O PADDING NO FUNDO
        // Isso cria o espaço para o botão '+' não cobrir o último item
        contentContainerStyle={styles.listContentContainer}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchProdutos} />
        }
      >
        {produtos.length === 0 && !isLoading && (
          <Text style={styles.emptyText}>Nenhum produto cadastrado!</Text>
        )}

        {produtos.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemName}>{item.nome}</Text>
              <Text style={styles.itemDescription}>{item.descricao}</Text>
              <Text style={styles.itemPrice}>R$ {item.preco.toFixed(2)}</Text>
            </View>
            
            <View style={styles.itemActions}>
              <TouchableOpacity 
                onPress={() => handleDelete(item.id)}
                style={styles.iconButton}
              >
                <Ionicons name="trash-outline" size={22} color={COR_PRINCIPAL} />
              </TouchableOpacity>
              
              <Link 
                href={{ pathname: '/modal-produto', params: { id: item.id.toString() } }} 
                asChild
              >
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="pencil-outline" size={22} color="#007bff" />
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        ))}
      </ScrollView>
      {/* FIM DA SCROLLVIEW */}


      {/* Botão Flutuante (continua igual) */}
      <Link href="/modal-produto" asChild>
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

// --- ESTILOS (Com as mudanças de tamanho) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // O 'marginTop' foi removido
  },
  listContainer: {
    flex: 1, 
  },
  // 4. NOVO ESTILO PARA O PADDING DO SCROLL
  listContentContainer: {
    paddingBottom: 100, // <<< Garante espaço para o FAB e a Tab Bar
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
    fontSize: 16,
    paddingHorizontal: 20,
  },
  logo: {
    width: 120, // <<< Um pouco menor
    height: 120, // <<< Um pouco menor
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10, // <<< Um pouco menor
  },
  // 5. ITENS MENORES
  itemContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 15, // <<< Menor (antes era padding: 20)
    paddingHorizontal: 20,
    marginVertical: 6, // <<< Menor (antes era 8)
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2, // <<< Menor
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18, // <<< Menor
    shadowRadius: 1.00, // <<< Menor
  },
  itemTextContainer: {
    flex: 1,
  },
  // 6. FONTES MENORES
  itemName: {
    fontSize: 16, // <<< Menor (antes era 18)
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 13, // <<< Menor (antes era 14)
    color: '#555',
    marginTop: 4, // <<< Menor
  },
  itemPrice: {
    fontSize: 15, // <<< Menor (antes era 16)
    fontWeight: 'bold',
    color: COR_PRINCIPAL, 
    marginTop: 8, // <<< Menor
  },
  itemActions: {
    flexDirection: 'row',
    marginLeft: 15,
  },
  iconButton: {
    padding: 6, // <<< Menor
    marginLeft: 6, // <<< Menor
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20, // <<< Ajustei para ficar bom com a Tab Bar
    backgroundColor: COR_PRINCIPAL,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
});