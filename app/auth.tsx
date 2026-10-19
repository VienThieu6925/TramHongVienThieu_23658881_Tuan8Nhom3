// //Bai1
// import { useState } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity, StyleSheet,
//   ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { authService } from '@/services/authService';
// import { useAuth } from '@/store/auth';
// import { validate, Errors } from '@/utils/validate';

// type Mode = 'login' | 'register';
// export default function AuthScreen() {
//   const router = useRouter();
//   const setAuth = useAuth((s) => s.setAuth);

//   const [mode, setMode] = useState<Mode>('login');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirm, setConfirm] = useState('');
//   const [errors, setErrors] = useState<Errors>({});
//   const [touched, setTouched] = useState<Record<string, boolean>>({});
//   const [loading, setLoading] = useState(false);
//   const [serverError, setServerError] = useState('');

//   const values = { email, password, confirm };

//   const runValidate = (next = values) => setErrors(validate(next, mode));

//   const onChange = (field: 'email' | 'password' | 'confirm', text: string) => {
//     const next = { ...values, [field]: text };
//     if (field === 'email') setEmail(text);
//     if (field === 'password') setPassword(text);
//     if (field === 'confirm') setConfirm(text);
//     setServerError('');
//     runValidate(next);
//   };

//   const onBlur = (field: string) => {
//     setTouched((t) => ({ ...t, [field]: true }));
//     runValidate();
//   };

//   const switchMode = (m: Mode) => {
//     setMode(m);
//     setErrors({});
//     setTouched({});
//     setServerError('');
//     setConfirm('');
//   };

//   const submit = async () => {
//     const errs = validate(values, mode);
//     setErrors(errs);
//     setTouched({ email: true, password: true, confirm: true });
//     if (Object.keys(errs).length > 0) return;

//     try {
//       setLoading(true);
//       setServerError('');
//       const payload = { email: email.trim(), password };
//       const res =
//         mode === 'login'
//           ? await authService.login(payload)
//           : await authService.register(payload);

//       await setAuth(res.token, res.user);
//       router.replace('/');
//     } catch (e: any) {
//       setServerError(e?.response?.data?.message ?? e?.message ?? 'Có lỗi xảy ra, thử lại sau');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const err = (f: keyof Errors) => (touched[f] ? errors[f] : undefined);

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     >
//       <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
//         <Text style={styles.title}>{mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}</Text>

//         <View style={styles.tabs}>
//           {(['login', 'register'] as Mode[]).map((m) => (
//             <TouchableOpacity
//               key={m}
//               style={[styles.tab, mode === m && styles.tabActive]}
//               onPress={() => switchMode(m)}
//             >
//               <Text style={[styles.tabText, mode === m && styles.tabTextActive]}>
//                 {m === 'login' ? 'Đăng nhập' : 'Đăng ký'}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <TextInput
//           style={[styles.input, err('email') && styles.inputError]}
//           placeholder="Email"
//           autoCapitalize="none"
//           keyboardType="email-address"
//           value={email}
//           onChangeText={(t) => onChange('email', t)}
//           onBlur={() => onBlur('email')}
//         />
//         {!!err('email') && <Text style={styles.error}>{err('email')}</Text>}

//         <TextInput
//           style={[styles.input, err('password') && styles.inputError]}
//           placeholder="Mật khẩu"
//           secureTextEntry
//           value={password}
//           onChangeText={(t) => onChange('password', t)}
//           onBlur={() => onBlur('password')}
//         />
//         {!!err('password') && <Text style={styles.error}>{err('password')}</Text>}

//         {mode === 'register' && (
//           <>
//             <TextInput
//               style={[styles.input, err('confirm') && styles.inputError]}
//               placeholder="Nhập lại mật khẩu"
//               secureTextEntry
//               value={confirm}
//               onChangeText={(t) => onChange('confirm', t)}
//               onBlur={() => onBlur('confirm')}
//             />
//             {!!err('confirm') && <Text style={styles.error}>{err('confirm')}</Text>}
//           </>
//         )}

//         {!!serverError && <Text style={[styles.error, { marginTop: 12 }]}>{serverError}</Text>}

//         <TouchableOpacity
//           style={[styles.button, loading && { opacity: 0.6 }]}
//           onPress={submit}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</Text>
//           )}
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
//   title: { fontSize: 28, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
//   tabs: { flexDirection: 'row', marginBottom: 20, borderRadius: 10, backgroundColor: '#eee' },
//   tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
//   tabActive: { backgroundColor: '#2563eb' },
//   tabText: { color: '#555', fontWeight: '600' },
//   tabTextActive: { color: '#fff' },
//   input: {
//     borderWidth: 1, borderColor: '#ccc', borderRadius: 10,
//     paddingHorizontal: 14, paddingVertical: 12, marginTop: 12, fontSize: 16,
//   },
//   inputError: { borderColor: '#dc2626' },
//   error: { color: '#dc2626', marginTop: 4, fontSize: 13 },
//   button: {
//     backgroundColor: '#2563eb', borderRadius: 10,
//     paddingVertical: 14, alignItems: 'center', marginTop: 24,
//   },
//   buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
// });

// Bai2 

import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import type { Href } from 'expo-router';
import { authService } from '@/services/authService';
import { useAuth } from '@/store/auth';
import { validate, Errors } from '@/utils/validate';

type Mode = 'login' | 'register';

export default function AuthScreen() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const setAuth = useAuth((s) => s.setAuth);

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const values = { email, password, confirm };

  const runValidate = (next = values) => setErrors(validate(next, mode));

  const onChange = (field: 'email' | 'password' | 'confirm', text: string) => {
    const next = { ...values, [field]: text };
    if (field === 'email') setEmail(text);
    if (field === 'password') setPassword(text);
    if (field === 'confirm') setConfirm(text);
    setServerError('');
    runValidate(next);
  };

  const onBlur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    runValidate();
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setErrors({});
    setTouched({});
    setServerError('');
    setConfirm('');
  };

  const submit = async () => {
    const errs = validate(values, mode);
    setErrors(errs);
    setTouched({ email: true, password: true, confirm: true });
    if (Object.keys(errs).length > 0) return;

    try {
      setLoading(true);
      setServerError('');
      const payload = { email: email.trim(), password };
      const res =
        mode === 'login'
          ? await authService.login(payload)
          : await authService.register(payload);

      await setAuth(res.token, res.user);
      router.replace((redirect ?? '/') as Href);
    } catch (e: any) {
      setServerError(e?.response?.data?.message ?? e?.message ?? 'Có lỗi xảy ra, thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  const err = (f: keyof Errors) => (touched[f] ? errors[f] : undefined);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}</Text>

        <View style={styles.tabs}>
          {(['login', 'register'] as Mode[]).map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.tab, mode === m && styles.tabActive]}
              onPress={() => switchMode(m)}
            >
              <Text style={[styles.tabText, mode === m && styles.tabTextActive]}>
                {m === 'login' ? 'Đăng nhập' : 'Đăng ký'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={[styles.input, err('email') && styles.inputError]}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={(t) => onChange('email', t)}
          onBlur={() => onBlur('email')}
        />
        {!!err('email') && <Text style={styles.error}>{err('email')}</Text>}

        <TextInput
          style={[styles.input, err('password') && styles.inputError]}
          placeholder="Mật khẩu"
          secureTextEntry
          value={password}
          onChangeText={(t) => onChange('password', t)}
          onBlur={() => onBlur('password')}
        />
        {!!err('password') && <Text style={styles.error}>{err('password')}</Text>}

        {mode === 'register' && (
          <>
            <TextInput
              style={[styles.input, err('confirm') && styles.inputError]}
              placeholder="Nhập lại mật khẩu"
              secureTextEntry
              value={confirm}
              onChangeText={(t) => onChange('confirm', t)}
              onBlur={() => onBlur('confirm')}
            />
            {!!err('confirm') && <Text style={styles.error}>{err('confirm')}</Text>}
          </>
        )}

        {!!serverError && <Text style={[styles.error, { marginTop: 12 }]}>{serverError}</Text>}

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={submit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
  tabs: { flexDirection: 'row', marginBottom: 20, borderRadius: 10, backgroundColor: '#eee' },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#2563eb' },
  tabText: { color: '#555', fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, marginTop: 12, fontSize: 16,
  },
  inputError: { borderColor: '#dc2626' },
  error: { color: '#dc2626', marginTop: 4, fontSize: 13 },
  button: {
    backgroundColor: '#2563eb', borderRadius: 10,
    paddingVertical: 14, alignItems: 'center', marginTop: 24,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});