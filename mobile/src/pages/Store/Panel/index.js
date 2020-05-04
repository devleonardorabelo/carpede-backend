import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, Text, TouchableOpacity, AsyncStorage } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons'; 
import styles from '../../global';
import apiReq from '../../../services/reqToken';
import { API_DOMAIN } from '../../../constants/api';
import Loading from '../../../components/Loading';
import { NavItem, Avatar } from '../../../components/Item';

export default function Panel() {

	const [ store, setStore ] = useState('');
	const [ avatar, setAvatar ] = useState();
	const [ whatsapp, setWhatsapp ] = useState('');
	const [ loadedPage, setLoadedPage ] = useState(false);

	async function loadPanel() {
		const { data } = await apiReq.get('panel');
		setStore(data.name);
		setWhatsapp(data.whatsapp);
		if(data.avatar) setAvatar({uri: `${API_DOMAIN}/uploads/${data.avatar}`})
		if(loadedPage === false) setLoadedPage(true);
	};
	
	useFocusEffect(
        useCallback(() => {
			loadPanel();
		}, [])
	)

	const navigation = useNavigation();

	const navigateToProfile = () => navigation.navigate('StoreProfile');
	const navigateToProducts = () => navigation.navigate('StoreProducts');

	async function signout() {
		await AsyncStorage.clear();
		return navigation.navigate('Home');
	}
	
    return(<>
		{loadedPage ? (
			<SafeAreaView style={styles.container}>

				<TouchableOpacity style={styles.navigationButton} onPress={signout}>
					<Feather name="log-out" size={32} color="#333" />
				</TouchableOpacity>
				<Avatar
					image={avatar}
					title={store}
					subtitle={whatsapp}
				/>
				<Text style={styles.subtitle}>Seja bem-vindo</Text>
				<NavItem
					action={navigateToProfile}
					icon='user'
					title='Perfil'
					subtitle='Informações da Loja'
				/>
				<NavItem
					action={navigateToProducts}
					icon='truck'
					title='Pedidos'
					subtitle='Lista de pedidos ativos'
				/>
				<NavItem
					action={navigateToProducts}
					icon='box'
					title='Produtos'
					subtitle='Lista de produtos'
				/>


			</SafeAreaView>
		):(
			<Loading />
		)}
		</>)
	
}