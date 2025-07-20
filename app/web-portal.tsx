import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

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

            const getWebDashboardUrl = () => {
                const debuggerHost = Constants.manifest?.debuggerHost;
                if (debuggerHost) {
                    const ip = debuggerHost.split(':')[0];
                    return `http://${ip}:5173`;
                }

                return process.env.EXPO_PUBLIC_WEB_DASHBOARD_URL || 'http://localhost:5173';
            };

            const uri = `${getWebDashboardUrl()}/login?email=${encodedEmail}&password=${encodedPassword}&fromMobile=true`;
            setUri(uri);
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
