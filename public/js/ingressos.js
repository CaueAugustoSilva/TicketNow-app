const formCompra = document.querySelector('#formCompra');
const resultadoCompra = document.querySelector('#resultadoCompra');

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

if (formCompra && resultadoCompra) {
  formCompra.addEventListener('submit', (event) => {
    event.preventDefault();

    const precoEvento = Number(document.querySelector('#eventoCompra').value);
    const taxaSetor = Number(document.querySelector('#setorCompra').value);
    const quantidade = Number(document.querySelector('#quantidadeCompra').value);

    if (quantidade <= 0) {
      resultadoCompra.textContent = 'Informe uma quantidade válida de ingressos.';
      return;
    }

    const subtotal = precoEvento * quantidade;
    const taxaTotal = taxaSetor * quantidade;
    const total = subtotal + taxaTotal;

    resultadoCompra.innerHTML = `Subtotal: ${formatarMoeda(subtotal)} | Taxas: ${formatarMoeda(taxaTotal)} | Total: ${formatarMoeda(total)}`;
  });
}
