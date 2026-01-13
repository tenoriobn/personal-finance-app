import { computed } from 'vue';

export function useAvatar(name?: string) {
  const letter = computed(() => (name?.[0]?.toUpperCase() ?? '?'));

  const bgColor = computed(() => stringToColor(name));
  const textColor = computed(() => getContrastColor(bgColor.value));

  return { letter, bgColor, textColor };
}

// Função determinística para gerar cores
function stringToColor(str?: string): string {
  if (!str) {
    return '#F59E0B';
  } // fallback amber-500

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    '#F59E0B', // amber-500
    '#10B981', // green-500
    '#3B82F6', // blue-500
    '#EF4444', // red-500
    '#8B5CF6', // violet-500
    '#F97316', // orange-500
    '#6366F1', // indigo-500
  ];

  return colors[Math.abs(hash) % colors.length]!;
}

// Função para contraste do texto
function getContrastColor(hex: string): string {
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? '#1F2937' : '#F9FAFB'; // texto escuro se bg claro, claro se bg escuro
}
