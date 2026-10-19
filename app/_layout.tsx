// Bai1
// import { useEffect } from 'react';
// import { Stack, useRouter, useSegments } from 'expo-router';
// import { useAuth } from '@/store/auth';

// export default function RootLayout() {
//   const { token, hydrated, hydrate } = useAuth();
//   const segments = useSegments();
//   const router = useRouter();

//   useEffect(() => { hydrate(); }, []);

//   useEffect(() => {
//     if (!hydrated) return;
//     const onAuthScreen = segments[0] === 'auth';
//     if (!token && !onAuthScreen) router.replace('/auth');
//     if (token && onAuthScreen) router.replace('/');
//   }, [token, hydrated, segments]);

//   return <Stack screenOptions={{ headerShown: false }} />;
// }

//Bai2

import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import { useAuth } from '@/store/auth';

export default function RootLayout() {
  const hydrated = useAuth((s) => s.hydrated);
  const hydrate = useAuth((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, []);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Trang chủ' }} />
      <Stack.Screen name="auth" options={{ title: 'Tài khoản' }} />
      <Stack.Screen name="checkout" options={{ title: 'Thanh toán' }} />
      <Stack.Screen name="book/[id]" options={{ title: 'Chi tiết sách' }} />
    </Stack>
  );
}