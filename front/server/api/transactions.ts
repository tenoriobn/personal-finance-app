import data from '~/data/data.json';

export default defineEventHandler((event) => {
  const query = getQuery(event);

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const search = String(query.search || '').toLowerCase();
  const category = String(query.category || '');
  const sort = String(query.sort || 'Mais recente');

  let transactions = data.transactions;

  if (search) {
    transactions = transactions.filter(t =>
      t.name.toLowerCase().includes(search),
    );
  }

  if (category && category !== 'Todos') {
    transactions = transactions.filter(t => t.category === category);
  }

  switch (sort) {
    case 'Mais antigo':
      transactions = transactions.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
      break;
    case 'A a Z':
      transactions = transactions.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      break;
    case 'Z a A':
      transactions = transactions.sort((a, b) =>
        b.name.localeCompare(a.name),
      );
      break;
    case 'Mais alto':
      transactions = transactions.sort((a, b) => b.amount - a.amount);
      break;
    case 'Mais baixo':
      transactions = transactions.sort((a, b) => a.amount - b.amount);
      break;
    default: // "Mais recente"
      transactions = transactions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = transactions.slice(start, end);

  return {
    data: paginated,
    total: transactions.length,
    page,
    totalPages: Math.ceil(transactions.length / limit),
  };
});
