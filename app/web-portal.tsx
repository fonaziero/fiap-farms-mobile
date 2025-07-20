import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebPortalScreen() {
    const [uri, setUri] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadCredentials = async () => {
            const data = await AsyncStorage.getItem('userCredentials');
            if (!data) return;

            const { email, password } = JSON.parse(data);
            const encodedEmail = encodeURIComponent(email);
            const encodedPassword = encodeURIComponent(password);

            setUri(`http://192.168.15.141:5173/login?email=${encodedEmail}&password=${encodedPassword}&fromMobile=true`);
        };

        loadCredentials();
    }, []);

    if (Platform.OS === 'web') {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'red' }}>
                    WebView não é suportado no navegador. Teste no celular ou emulador.
                </Text>
            </View>
        );
    }



    return uri ? <WebView
        source={{ uri }}
        style={{ flex: 1 }}
        onMessage={(event) => {
            if (event.nativeEvent.data === 'erro-login') {
                router.replace('/');
            }
        }}
    />
        : null;
}
