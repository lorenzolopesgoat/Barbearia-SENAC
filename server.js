const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
app.use(cors());
app.use(express.json());

let db;

(async () => {
    db = await open({
        filename: './barbearia.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS servicos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            preco REAL NOT NULL,
            duracao_minutos INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS agendamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_nome TEXT NOT NULL,
            cliente_telefone TEXT NOT NULL,
            servico_id INTEGER NOT NULL,
            data_hora TEXT NOT NULL,
            FOREIGN KEY (servico_id) REFERENCES servicos(id)
        );
    `);

    const count = await db.get('SELECT COUNT(*) as count FROM servicos');
    if (count.count === 0) {
        await db.run(`INSERT INTO servicos (nome, preco, duracao_minutos) VALUES
            ('Corte de Cabelo', 45.00, 30),
            ('Barba Completa', 35.00, 30),
            ('Combo Corte + Barba', 70.00, 60),
            ('Acabamento / Pezinho', 20.00, 15)`);
    }
})();

// ROTAS DA API
app.get('/api/servicos', async (req, res) => {
    const servicos = await db.all('SELECT * FROM servicos');
    res.json(servicos);
});

app.get('/api/agendamentos', async (req, res) => {
    const query = `
        SELECT a.id, a.cliente_nome, a.cliente_telefone, a.data_hora, s.nome AS servico_nome, s.preco
        FROM agendamentos a
        JOIN servicos s ON a.servico_id = s.id
        ORDER BY a.data_hora ASC
    `;
    const agendamentos = await db.all(query);
    res.json(agendamentos);
});

app.post('/api/agendamentos', async (req, res) => {
    const { cliente_nome, cliente_telefone, servico_id, data_hora } = req.body;
    
    const conflito = await db.get('SELECT * FROM agendamentos WHERE data_hora = ?', [data_hora]);
    if (conflito) {
        return res.status(400).json({ error: 'Este horário já está ocupado. Escolha outro horário.' });
    }

    const result = await db.run(
        'INSERT INTO agendamentos (cliente_nome, cliente_telefone, servico_id, data_hora) VALUES (?, ?, ?, ?)',
        [cliente_nome, cliente_telefone, servico_id, data_hora]
    );

    res.status(201).json({ id: result.lastID, message: 'Agendamento realizado com sucesso!' });
});

app.delete('/api/agendamentos/:id', async (req, res) => {
    const { id } = req.params;
    await db.run('DELETE FROM agendamentos WHERE id = ?', [id]);
    res.json({ message: 'Agendamento cancelado com sucesso.' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});