-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS finplan_db;
USE finplan_db;

SET NAMES utf8mb4;

-- Tabela de Transações
CREATE TABLE IF NOT EXISTS transacoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    tipo ENUM('RECEITA', 'DESPESA') NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    data DATE NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tipo (tipo),
    INDEX idx_data (data),
    INDEX idx_categoria (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Metas Financeiras
CREATE TABLE IF NOT EXISTS metas_financeiras (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    valor_alvo DECIMAL(10,2) NOT NULL,
    valor_atual DECIMAL(10,2) DEFAULT 0.00,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_data_fim (data_fim)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inserir dados de exemplo
INSERT INTO transacoes (descricao, valor, tipo, categoria, data) VALUES
('Salário', 4250.00, 'RECEITA', 'Salário', '2026-05-01'),
('Supermercado', 320.00, 'DESPESA', 'Alimentação', '2026-05-05'),
('Transporte', 80.00, 'DESPESA', 'Transporte', '2026-05-07'),
('Academia', 120.00, 'DESPESA', 'Saúde', '2026-05-10'),
('Freelance', 650.00, 'RECEITA', 'Trabalho', '2026-05-15'),
('Aluguel', 997.50, 'DESPESA', 'Moradia', '2026-05-01'),
('Restaurante', 150.00, 'DESPESA', 'Alimentação', '2026-05-12'),
('Cinema', 85.00, 'DESPESA', 'Lazer', '2026-05-18'),
('Farmácia', 95.00, 'DESPESA', 'Saúde', '2026-05-20'),
('Combustível', 120.00, 'DESPESA', 'Transporte', '2026-05-22');

INSERT INTO metas_financeiras (nome, valor_alvo, valor_atual, data_inicio, data_fim) VALUES
('Reserva de Emergência', 10000.00, 3250.00, '2026-01-01', '2026-12-31'),
('Viagem Europa', 8000.00, 2800.00, '2026-03-01', '2027-03-01'),
('Comprar Carro', 50000.00, 15000.00, '2026-01-01', '2028-01-01');
