const formContato = document.querySelector('#formContato');
const respostaContato = document.querySelector('#respostaContato');

if (formContato && respostaContato) {
  formContato.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.querySelector('#nomeContato').value.trim();
    const assunto = document.querySelector('#assuntoContato').value;

    if (nome.length < 3) {
      respostaContato.textContent = 'Digite um nome com pelo menos 3 caracteres.';
      return;
    }

    if (!assunto) {
      respostaContato.textContent = 'Selecione um assunto antes de enviar.';
      return;
    }

    respostaContato.textContent = `${nome}, sua mensagem sobre "${assunto}" foi registrada com sucesso. Esta é uma resposta simulada.`;
    formContato.reset();
  });
}
