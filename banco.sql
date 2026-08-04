CREATE DATABASE IF NOT EXISTS barbearia_db;
USE barbearia_db;

CREATE TABLE IF NOT EXISTS servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    duracao_minutos INT NOT NULL
);

CREATE TABLE IF NOT EXISTS agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_nome VARCHAR(100) NOT NULL,
    cliente_telefone VARCHAR(20) NOT NULL,
    servico_id INT NOT NULL,
    data_hora DATETIME NOT NULL,
    FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE
);

INSERT INTO servicos (nome, preco, duracao_minutos) VALUES
('Corte de Cabelo', 05.00, 30),
('Barba Completa', 35.00, 30),
('Combo Corte + Barba', 70.00, 60),
('Acabamento / Pezinho', 20.00, 15);