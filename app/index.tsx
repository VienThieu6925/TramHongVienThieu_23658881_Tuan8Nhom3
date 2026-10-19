// Bai1
// import { View, Text, Button } from 'react-native';
// import { useAuth } from '@/store/auth';

// export default function Home() {
//   const { user, logout } = useAuth();
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
//       <Text style={{ fontSize: 20 }}>Xin chào {user?.email}</Text>
//       <Button title="Đăng xuất" onPress={logout} />
//     </View>
//   );
// }

// Bai2
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/store/auth';

export default function Home() {
  const router = useRouter();
  const { token, user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trang chủ</Text>
      <Text style={styles.sub}>
        {token ? `Xin chào ${user?.email}` : 'Bạn chưa đăng nhập'}
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/book/1')}>
      <Text style={styles.buttonText}>Xem sách mẫu</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/checkout')}>
        <Text style={styles.buttonText}>Thanh toán</Text>
      </TouchableOpacity>

      {token ? (
        <TouchableOpacity style={[styles.button, styles.outline]} onPress={logout}>
          <Text style={[styles.buttonText, { color: '#dc2626' }]}>Đăng xuất</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.outline]}
          onPress={() => router.push('/auth')}
        >
          <Text style={[styles.buttonText, { color: '#2563eb' }]}>Đăng nhập</Text>
        </TouchableOpacity>
      )}
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