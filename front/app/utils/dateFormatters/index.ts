export function formatDate(dateStr: string): string {
  const hasTime = dateStr.includes('T');
  const date = hasTime ? new Date(dateStr) : new Date(`${dateStr}T00:00:00`);

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  return date.toLocaleDateString('pt-br', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatMonthDay(dateStr: string): string {
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  const day = date.toLocaleDateString('pt-BR', { day: '2-digit' });

  return `${month.charAt(0).toUpperCase() + month.slice(1)} - ${day}`;
}
