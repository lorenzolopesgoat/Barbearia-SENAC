const API_URL = 'http://localhost:3000/api';

async function carregarOpcoesServicos() {
    try {
        const res = await fetch(`${API_URL}/servicos`);
        const servicos = await res.json();
        
        const selectEl = document.getElementById('servico');
        selectEl.innerHTML = '<option value="">Selecione um serviço...</option>';

        servicos.forEach(s => {
            selectEl.innerHTML += `<option value="${s.id}">${s.nome} - R$ ${s.preco.toFixed(2)}</option>`;
        });
    } catch (err) {
        document.getElementById('servico').innerHTML = '<option value="">Erro ao carregar serviços</option>';
    }
}


async function carregarAgendamentos() {
    try {
        const res = await fetch(`${API_URL}/agendamentos`);
        const agendamentos = await res.json();
        
        const listEl = document.getElementById('lista-agendamentos');
        listEl.innerHTML = agendamentos.length === 0 ? '<p>Nenhum horário agendado até o momento.</p>' : '';

        agendamentos.forEach(a => {
            const dataFmt = new Date(a.data_hora).toLocaleString('pt-BR');
            listEl.innerHTML += `
                <li>
                    <div>
                        <strong>${a.cliente_nome}</strong> — <i>${a.servico_nome}</i><br>
                        <small>📅 ${dataFmt} | 📞 ${a.cliente_telefone}</small>
                    </div>
                    <button class="btn-delete" onclick="cancelarAgendamento(${a.id})">Cancelar</button>
                </li>
            `;
        });
    } catch (err) {
        document.getElementById('lista-agendamentos').innerHTML = '<li>Erro ao carregar agendamentos.</li>';
    }
}


document.getElementById('form-agendamento').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const body = {
        cliente_nome: document.getElementById('nome').value,
        cliente_telefone: document.getElementById('telefone').value,
        servico_id: document.getElementById('servico').value,
        data_hora: document.getElementById('data_hora').value
    };

    const res = await fetch(`${API_URL}/agendamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    
    if (res.ok) {
        alert(data.message);
        document.getElementById('form-agendamento').reset();
        carregarAgendamentos(); 
    } else {
        alert(data.error);
    }
});


async function cancelarAgendamento(id) {
    if (confirm('Deseja realmente cancelar este agendamento?')) {
        await fetch(`${API_URL}/agendamentos/${id}`, { method: 'DELETE' });
        carregarAgendamentos(); 
    }
}

carregarOpcoesServicos();
carregarAgendamentos();

let idAgendamentoEditando = null;


function prepararEdicao(id, nome, servico, dataHora, telefone) {
    idAgendamentoEditando = id; /

    document.getElementById('nome').value = nome;
    document.getElementById('servico').value = servico;
    document.getElementById('data_hora').value = dataHora;
    document.getElementById('telefone').value = telefone;


    const btnSubmit = document.getElementById('btn-agendar'); 
    if (btnSubmit) btnSubmit.innerText = 'Salvar Alterações';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('meu-formulario').addEventListener('submit', async function (e) {
    e.preventDefault();

    const dados = {
        nome: document.getElementById('nome').value,
        servico: document.getElementById('servico').value,
        data_hora: document.getElementById('data_hora').value,
        telefone: document.getElementById('telefone').value
    };

    if (idAgendamentoEditando) {
        await fetch(`${API_URL}/agendamentos/${idAgendamentoEditando}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        idAgendamentoEditando = null;
        document.getElementById('btn-agendar').innerText = 'Agendar Horário 📅';
    } else {
        
        await fetch(`${API_URL}/agendamentos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
    }

    this.reset();
    carregarAgendamentos();
});