import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  value: number;
  size?: number;
  onChange?: (value: number) => void;
};

const COLOR_ON = '#f59e0b';
const COLOR_OFF = '#d1d5db';

export default function RatingStars({ value, size = 20, onChange }: Props) {
  if (onChange) {
    return (
      <View style={styles.row}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity key={n} onPress={() => onChange(n)} hitSlop={6}>
            <Text style={{ fontSize: size, color: n <= value ? COLOR_ON : COLOR_OFF }}>★</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  const percent = Math.max(0, Math.min(5, value)) / 5;
  const text = '★★★★★';

  return (
    <View style={{ width: size * 5 * 0.95, height: size * 1.2 }}>
      <Text style={{ fontSize: size, color: COLOR_OFF, letterSpacing: 0 }}>{text}</Text>
      <View style={[styles.overlay, { width: `${percent * 100}%` }]}>
        <Text style={{ fontSize: size, color: COLOR_ON }} numberOfLines={1}>
          {text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4 },
  overlay: { position: 'absolute', left: 0, top: 0, overflow: 'hidden' },
});