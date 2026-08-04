const API_URL = 'http://localhost:3000/api';

// Carrega os serviços e preços na página de introdução
async function carregarServicos() {
    try {
        const res = await fetch(`${API_URL}/servicos`);
        const servicos = await res.json();
        
        const listEl = document.getElementById('lista-servicos');
        listEl.innerHTML = '';

        servicos.forEach(s => {
            listEl.innerHTML += `
                <li>
                    <span><strong>${s.nome}</strong> (${s.duracao_minutos} min)</span> 
                    <span class="price-tag">R$ ${s.preco.toFixed(2)}</span>
                </li>`;
        });
    } catch (err) {
        document.getElementById('lista-servicos').innerHTML = 
            '<li>Erro ao carregar serviços. Verifique se o servidor backend está rodando.</li>';
    }
}

// Inicializa a busca assim que a página abre
carregarServicos();