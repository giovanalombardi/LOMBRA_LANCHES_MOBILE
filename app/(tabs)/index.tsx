import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity,
  RefreshControl,
  Platform, 
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';

// --- CONFIGURAÇÃO DA API ---
const BASE_URL = 'https://patrica-uninoculated-janis.ngrok-free.dev'; 
const RESTAURANTE_ID = 1; 

const COR_PRINCIPAL = '#EA1D2C';

interface Produto {
  id: number;
  name: string; // Python manda 'name'
  description: string; // Python manda 'description'
  price: number; // Python manda 'price'
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // --- BUSCAR PRODUTOS DA API ---
  const fetchProdutos = async () => {
    setIsLoading(true);
    try {
      // A rota no mobile_api.py é: /restaurants/<id>/products
      const response = await fetch(`${BASE_URL}/restaurants/${RESTAURANTE_ID}/products`);
      
      if (!response.ok) throw new Error('Erro na API');
      
      const data = await response.json();
      setProdutos(data);
    } catch (e) {
      console.error(e);
      if (Platform.OS === 'web') window.alert("Erro ao conectar na API (Porta 5001)");
      else Alert.alert("Erro", "Verifique se o 'mobile_api.py' está rodando e o IP está certo.");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchProdutos(); }, []));

  // --- DELETAR PRODUTO NA API ---
  const handleDelete = (id: number) => {
    const deletar = async () => {
      try {
        // A rota de deletar é: /products/<id>
        const response = await fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' });
        
        if (response.ok) {
          if (Platform.OS === 'web') window.alert("Produto deletado!");
          else Alert.alert("Sucesso", "Produto deletado!");
          fetchProdutos(); // Recarrega a lista do servidor
        } else {
          throw new Error('Erro ao deletar');
        }
      } catch (e) {
        console.error(e);
        Alert.alert("Erro", "Não foi possível deletar.");
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Tem certeza que deseja apagar?")) deletar();
    } else {
      Alert.alert("Confirmar", "Apagar este produto?", [
        { text: "Cancelar" },
        { text: "Apagar", onPress: deletar, style: 'destructive' }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Logo da Capivara */}
      <Image 
        source={require('../../assets/images/capivara-logo.png')} 
        style={styles.logo}
      />
      
      <Text style={styles.title}>Cardápio</Text>
      
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContentContainer}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchProdutos} />
        }
      >
        {produtos.length === 0 && !isLoading && (
          <Text style={styles.emptyText}>Nenhum produto cadastrado.</Text>
        )}

        {produtos.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemPrice}>R$ {Number(item.price).toFixed(2)}</Text>
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

      <Link href="/modal-produto" asChild>
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    flex: 1, 
  },
  listContentContainer: {
    paddingBottom: 100, 
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
    fontSize: 16,
    paddingHorizontal: 20,
  },
  logo: {
    width: 120, 
    height: 120, 
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10, 
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 15, 
    paddingHorizontal: 20,
    marginVertical: 6, 
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18, 
    shadowRadius: 1.00, 
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16, 
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 13, 
    color: '#555',
    marginTop: 4, 
  },
  itemPrice: {
    fontSize: 15, 
    fontWeight: 'bold',
    color: COR_PRINCIPAL, 
    marginTop: 8, 
  },
  itemActions: {
    flexDirection: 'row',
    marginLeft: 15,
  },
  iconButton: {
    padding: 6, 
    marginLeft: 6, 
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20, 
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