import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '@/store/auth';

export default function CheckoutScreen() {
  const router = useRouter();
  const { token, user, logout } = useAuth();

  if (!token) {
    return <Redirect href={{ pathname: '/auth', params: { redirect: '/checkout' } }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thanh toán</Text>
      <Text style={styles.sub}>Tài khoản: {user?.email}</Text>

      <TouchableOpacity
        style={[styles.button, styles.outline]}
        onPress={async () => {
          await logout();
          router.replace('/');
        }}
      >
        <Text style={[styles.buttonText, { color: '#dc2626' }]}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center' },
  sub: { textAlign: 'center', color: '#555', marginBottom: 12 },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});