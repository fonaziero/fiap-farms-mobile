import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View
} from 'react-native';
import {
    Button,
    PaperProvider,
    Switch,
    Text,
    TextInput
} from 'react-native-paper';
import { auth } from '../../firebase';
import { theme } from '../../theme';
const { width } = Dimensions.get('window');


export default function AuthScreen() {
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();


    // 🐦 Pássaros e ☁️ Nuvens
    const bird1X = useRef(new Animated.Value(width - 200)).current;
    const bird2X = useRef(new Animated.Value(width * 1.5)).current;
    const bird3X = useRef(new Animated.Value(-200)).current;

    const cloud1X = useRef(new Animated.Value(width)).current;
    const cloud2X = useRef(new Animated.Value(width * 1.2)).current;
    const cloud1Y = useRef(new Animated.Value(0)).current;
    const cloud2Y = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loopX = (val: Animated.Value, to: number, duration: number, start: number) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(val, {
                        toValue: to,
                        duration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(val, {
                        toValue: start,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        const floatY = (val: Animated.Value) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(val, { toValue: 10, duration: 4000, useNativeDriver: true }),
                    Animated.timing(val, { toValue: 0, duration: 4000, useNativeDriver: true }),
                ])
            ).start();
        };

        loopX(bird1X, -220, 10000, width - 200);
        loopX(bird2X, -220, 14000, width - 200);
        loopX(bird3X, width, 12000, -200);

        loopX(cloud1X, -200, 25000, width);
        loopX(cloud2X, -200, 30000, width * 1.2);
        floatY(cloud1Y);
        floatY(cloud2Y);
    }, []);


    const handleAuth = async () => {
        try {
            let userCredential;

            if (isRegister) {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                if (userCredential.user && name) {
                    await updateProfile(userCredential.user, { displayName: name });
                }
                setMessage('Cadastro realizado com sucesso!');
            } else {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
                setMessage('Login realizado com sucesso!');
            }

            if (userCredential?.user) {
                // Salva as credenciais
                await AsyncStorage.setItem('userCredentials', JSON.stringify({ email, password }));

                router.push('/web-portal');
            }
        } catch (error: any) {
            let translatedMessage = 'Ocorreu um erro. Tente novamente.';

            switch (error.code) {
                case 'auth/invalid-email':
                    translatedMessage = 'E-mail inválido.'; break;
                case 'auth/user-not-found':
                    translatedMessage = 'Usuário não encontrado.'; break;
                case 'auth/wrong-password':
                    translatedMessage = 'Senha incorreta.'; break;
                case 'auth/email-already-in-use':
                    translatedMessage = 'Este e-mail já está em uso.'; break;
                case 'auth/weak-password':
                    translatedMessage = 'A senha deve conter pelo menos 6 caracteres.'; break;
                case 'auth/missing-password':
                    translatedMessage = 'Informe uma senha.'; break;
                case 'auth/too-many-requests':
                    translatedMessage = 'Muitas tentativas. Tente novamente mais tarde.'; break;
                case 'auth/invalid-credential':
                    translatedMessage = 'Credenciais inválidas'; break;
                default:
                    console.warn('Erro não mapeado:', error.code);
                    translatedMessage = 'Erro inesperado: ' + error.message;
            }

            setMessage(translatedMessage);
        }
    };


    return (
        <PaperProvider theme={theme}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <ImageBackground
                    source={require('../../assets/images/bg-farm.png')}
                    style={styles.background}
                    resizeMode="cover"
                >
                    <Animated.Image
                        source={require('../../assets/images/cloud.png')}
                        style={[styles.cloud, { top: 100, transform: [{ translateX: cloud1X }, { translateY: cloud1Y }] }]}
                    />
                    <Animated.Image
                        source={require('../../assets/images/cloud.png')}
                        style={[styles.cloud, { top: 160, transform: [{ translateX: cloud2X }, { translateY: cloud2Y }] }]}
                    />

                    <Animated.Image
                        source={require('../../assets/images/bird.png')}
                        style={[styles.bird, {
                            top: 40,
                            transform: [{ translateX: bird1X }, { scaleX: -1 }]
                        }]}
                    />
                    <Animated.Image
                        source={require('../../assets/images/bird.png')}
                        style={[styles.bird, {
                            top: 80,
                            transform: [{ translateX: bird2X }, { scaleX: -1 }]
                        }]}
                    />
                    <Animated.Image
                        source={require('../../assets/images/bird.png')}
                        style={[styles.bird, {
                            top: 60,
                            transform: [{ translateX: bird3X }]
                        }]}
                    />

                    <View style={styles.card}>
                        <Text style={styles.title}>🌾 FIAP Farms</Text>

                        {isRegister && (
                            <TextInput
                                label="Nome"
                                value={name}
                                onChangeText={setName}
                                style={styles.input}
                                mode="outlined"
                            />
                        )}
                        <TextInput
                            label="E-mail"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            mode="outlined"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            label="Senha"
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            mode="outlined"
                            secureTextEntry
                        />

                        <Button mode="contained" onPress={handleAuth} style={styles.button}>
                            {isRegister ? 'Cadastrar' : 'Entrar'}
                        </Button>

                        {message !== '' && <Text style={styles.message}>{message}</Text>}

                        <View style={styles.switchContainer}>
                            <Text style={{ marginRight: 10 }}>
                                {isRegister ? 'Já tem conta? Entrar' : 'Novo aqui? Cadastre-se'}
                            </Text>
                            <Switch value={isRegister} onValueChange={setIsRegister} />
                        </View>
                    </View>
                </ImageBackground>
            </KeyboardAvoidingView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    animatedBackground: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -2,
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: -1,
    },
    cloud: {
        position: 'absolute',
        width: 120,
        height: 60,
        opacity: 0.5,
        zIndex: 5,
    },
    bird: {
        position: 'absolute',
        width: 50,
        height: 50,
        zIndex: 10,
    },
    card: {
        width: width * 0.9,
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
    },
    title: {
        textAlign: 'center',
        fontSize: 28,
        marginBottom: 24,
        color: '#4C9444',
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
        marginBottom: 12,
    },
    message: {
        textAlign: 'center',
        color: '#B00020',
        marginBottom: 12,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
});
