export function useCurrencyMask(initialValue = 0) {
  const formattedAmount = ref('');
  const amount = ref(initialValue);

  const MAX_DIGITS = 14;

  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });

  watch(amount, (val) => {
    formattedAmount.value = val ? formatter.format(val) : '';
  }, { immediate: true });

  function onInput(value: string) {
    const onlyNumbers = value.replace(/\D/g, '');

    if (onlyNumbers.length > MAX_DIGITS) {
      formattedAmount.value = formatter.format(amount.value || 0);
      return;
    }

    const numeric = Number(onlyNumbers) / 100;
    amount.value = numeric;
    formattedAmount.value = numeric ? formatter.format(numeric) : '';
  }

  function onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',
    ];

    const isNumberKey = /^[0-9]$/.test(event.key);
    const isCtrlCommand
      = (event.ctrlKey || event.metaKey)
        && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase());

    if (isNumberKey && getDigitsCount(formattedAmount.value) >= MAX_DIGITS) {
      event.preventDefault();
      return;
    }

    if (!isNumberKey && !allowedKeys.includes(event.key) && !isCtrlCommand) {
      event.preventDefault();
    }
  }

  function onPaste(event: ClipboardEvent) {
    event.preventDefault();

    const pasted = event.clipboardData?.getData('text') ?? '';
    const onlyNumbers = pasted.replace(/\D/g, '').slice(0, MAX_DIGITS);

    const numeric = Number(onlyNumbers) / 100;
    amount.value = numeric;
    formattedAmount.value = numeric ? formatter.format(numeric) : '';
  }

  function getDigitsCount(str: string) {
    return str.replace(/\D/g, '').length;
  }

  return {
    formattedAmount,
    amount,
    onInput,
    onKeyDown,
    onPaste,
  };
}
