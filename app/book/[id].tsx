import { useEffect, useMemo, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import RatingStars from '@/components/RatingStars';
import { reviewService, Review } from '@/services/reviewService';
import { useAuth } from '@/store/auth';

export default function BookDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token, user } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await reviewService.getReviews(String(id));
        if (alive) setReviews(data);
      } catch (e: any) {
        if (alive) setLoadError(e?.message ?? 'Không tải được đánh giá');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const average = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const submit = async () => {
    const errs: typeof errors = {};
    if (rating === 0) errs.rating = 'Vui lòng chọn số sao';
    if (!comment.trim()) errs.comment = 'Vui lòng nhập bình luận';
    setErrors(errs);
    if (Object.keys(errs).length > 0 || !token) return;

    try {
      setSubmitting(true);
      setServerError('');
      const created = await reviewService.addReview(
        String(id),
        { rating, comment: comment.trim(), userName: user?.name ?? user?.email ?? 'Ẩn danh' },
        token
      );
      setReviews((prev) => [created, ...prev]);
      setRating(0);
      setComment('');
      setErrors({});
    } catch (e: any) {
      setServerError(e?.message ?? 'Gửi đánh giá thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.bookTitle}>Sách #{id}</Text>

        <View style={styles.summary}>
          <Text style={styles.avgNumber}>{average.toFixed(1)}</Text>
          <View style={{ gap: 4 }}>
            <RatingStars value={average} size={22} />
            <Text style={styles.muted}>{reviews.length} đánh giá</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Viết đánh giá</Text>
        {token ? (
          <View style={styles.form}>
            <RatingStars value={rating} size={32} onChange={(v) => { setRating(v); setErrors((e) => ({ ...e, rating: undefined })); }} />
            {!!errors.rating && <Text style={styles.error}>{errors.rating}</Text>}

            <TextInput
              style={[styles.input, !!errors.comment && styles.inputError]}
              placeholder="Chia sẻ cảm nhận của bạn về cuốn sách"
              multiline
              value={comment}
              onChangeText={(t) => { setComment(t); setErrors((e) => ({ ...e, comment: undefined })); }}
            />
            {!!errors.comment && <Text style={styles.error}>{errors.comment}</Text>}
            {!!serverError && <Text style={styles.error}>{serverError}</Text>}

            <TouchableOpacity
              style={[styles.button, submitting && { opacity: 0.6 }]}
              onPress={submit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Gửi đánh giá</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.outline]}
            onPress={() =>
              router.push({
                pathname: '/auth',
                params: { redirect: `/book/${id}` },
              } as Href)
            }
          >
            <Text style={[styles.buttonText, { color: '#2563eb' }]}>Đăng nhập để đánh giá</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>Đánh giá của độc giả</Text>
        {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
        {!!loadError && <Text style={styles.error}>{loadError}</Text>}
        {!loading && !loadError && reviews.length === 0 && (
          <Text style={styles.muted}>Chưa có đánh giá nào.</Text>
        )}

        {reviews.map((r) => (
          <View key={r.id} style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Text style={styles.userName}>{r.userName}</Text>
              <Text style={styles.muted}>{r.createdAt}</Text>
            </View>
            <RatingStars value={r.rating} size={16} />
            <Text style={styles.comment}>{r.comment}</Text>
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 48 },
  bookTitle: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  summary: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    padding: 16, borderRadius: 12, backgroundColor: '#f3f4f6',
  },
  avgNumber: { fontSize: 44, fontWeight: '700' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 10 },
  form: { gap: 8 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 10,
    padding: 12, minHeight: 90, fontSize: 16, textAlignVertical: 'top',
  },
  inputError: { borderColor: '#dc2626' },
  error: { color: '#dc2626', fontSize: 13 },
  muted: { color: '#6b7280', fontSize: 13 },
  button: {
    backgroundColor: '#2563eb', borderRadius: 10,
    paddingVertical: 14, alignItems: 'center', marginTop: 4,
  },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#2563eb' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  reviewItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', gap: 4 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  userName: { fontWeight: '600' },
  comment: { marginTop: 2, fontSize: 15 },
});