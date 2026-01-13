import { computed } from 'vue';

export function useAvatar(name?: string) {
  const letter = computed(() => (name?.[0]?.toUpperCase() ?? '?'));

  const bgColor = computed(() => stringToColor(name));
  const textColor = computed(() => getContrastColor(bgColor.value));

  return { letter, bgColor, textColor };
}

function stringToColor(str?: string): string {
  if (!str) {
    return '#F59E0B';
  }

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    '#F59E0B',
    '#10B981',
    '#3B82F6',
    '#EF4444',
    '#8B5CF6',
    '#F97316',
    '#6366F1',
  ];

  return colors[Math.abs(hash) % colors.length]!;
}

function getContrastColor(hex: string): string {
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? '#1F2937' : '#F9FAFB';
}
