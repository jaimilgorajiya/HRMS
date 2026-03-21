import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SIZES, RADIUS, SHADOW, GRADIENTS } from '../../constants/theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, bounciness: 4, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({ type: 'error', text1: 'Missing Fields' });
      return;
    }
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/(tabs)/dashboard');
      } else {
        Toast.show({ type: 'error', text1: 'Login Failed', text2: result.message });
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Server unreachable.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            
            <Animated.View style={[styles.headerSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.logoBox}>
                <LinearGradient colors={GRADIENTS.primary} style={styles.logoGrad}>
                  <Ionicons name="people" size={32} color={COLORS.white} />
                </LinearGradient>
              </View>
              <Text style={styles.appName}>HRMS Portal</Text>
              <Text style={styles.appSub}>Employee Management System</Text>
            </Animated.View>

            <Animated.View style={[styles.card, SHADOW.medium, { opacity: fadeAnim }]}>
              <Text style={styles.cardTitle}>Sign In</Text>
              <Text style={styles.cardSub}>Enter your workplace credentials</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email address</Text>
                <View style={styles.inputWrap}>
                  <Ionicons name="mail-outline" size={18} color={COLORS.textLight} />
                  <TextInput
                    style={styles.input}
                    placeholder="name@company.com"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrap}>
                  <Ionicons name="lock-closed-outline" size={18} color={COLORS.textLight} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    secureTextEntry={!showPwd}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPwd(!showPwd)}>
                    <Ionicons name={showPwd ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textLight} />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
                <LinearGradient colors={GRADIENTS.primary} style={styles.btnGrad} start={{x:0,y:0}} end={{x:1,y:0}}>
                  {loading ? <ActivityIndicator color={COLORS.white} /> : (
                    <>
                      <Text style={styles.btnText}>Login Now</Text>
                      <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.otpLink}>
                <Text style={styles.otpText}>Login with OTP instead</Text>
              </TouchableOpacity>
            </Animated.View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <View style={styles.bottomGraphic} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgMain },
  scroll: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  headerSection: { alignItems: 'center', marginBottom: 40 },
  logoBox: { width: 72, height: 72, borderRadius: 24, overflow: 'hidden', ...SHADOW.soft, marginBottom: 16 },
  logoGrad: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  appName: { fontSize: SIZES.xxl, fontWeight: '800', color: COLORS.textDark },
  appSub: { fontSize: SIZES.sm, color: COLORS.textLight, marginTop: 4 },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: 28 },
  cardTitle: { fontSize: SIZES.xl, fontWeight: '800', color: COLORS.textDark, marginBottom: 6 },
  cardSub: { fontSize: SIZES.sm, color: COLORS.textLight, marginBottom: 30 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: SIZES.sm, fontWeight: '700', color: COLORS.textMain, marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bgMain, borderRadius: 14,
    paddingHorizontal: 16, height: 56, gap: 12,
  },
  input: { flex: 1, fontSize: 15, color: COLORS.textDark },
  loginBtn: { marginTop: 10, borderRadius: 16, overflow: 'hidden', ...SHADOW.medium },
  btnGrad: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  btnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  otpLink: { marginTop: 20, alignItems: 'center' },
  otpText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
  bottomGraphic: {
    position: 'absolute', bottom: -50, right: -50,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: COLORS.primaryLight, opacity: 0.5, zIndex: -1,
  },
});
