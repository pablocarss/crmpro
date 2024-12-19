export function formatPhone(value: string): string {
  // Remove tudo que não for número
  const numbers = value.replace(/\D/g, '');
  
  // Se não tiver números, retorna vazio
  if (!numbers) return '';
  
  // Formata o número de acordo com a quantidade de dígitos
  if (numbers.length <= 2) {
    return `(${numbers}`;
  }
  
  if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }
  
  if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }
  
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}
