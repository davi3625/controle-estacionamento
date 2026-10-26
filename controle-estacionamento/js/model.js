"use strict";

/*
 * MODEL
 * Responsável por ler, validar, salvar e remover reservas.
 * Os dados ficam no localStorage deste navegador.
 */
const EstacionamentoModel = (() => {
    const CHAVE = "parkcontrol_reservas_v2";
    const TOTAL_VAGAS = 20;

    // Registros fictícios para demonstrar a listagem na primeira execução.
    const dadosIniciais = [
        {
            id: "demo-1", placa: "ABC1D23", proprietario: "Marcos Oliveira",
            apartamento: "101", bloco: "A", modelo: "Honda Civic", cor: "Prata", vaga: 1
        },
        {
            id: "demo-2", placa: "DEF2G34", proprietario: "Ana Souza",
            apartamento: "204", bloco: "B", modelo: "Toyota Corolla", cor: "Preto", vaga: 3
        },
        {
            id: "demo-3", placa: "GHI3J45", proprietario: "Pedro Santos",
            apartamento: "305", bloco: "A", modelo: "Chevrolet Onix", cor: "Branco", vaga: 5
        }
    ];

    function ler() {
        try {
            const conteudo = localStorage.getItem(CHAVE);

            if (conteudo === null) {
                gravar(dadosIniciais);
                return dadosIniciais.map(reserva => ({ ...reserva }));
            }

            const dados = JSON.parse(conteudo);

            if (!Array.isArray(dados)) {
                throw new Error("O armazenamento de reservas está em formato inválido.");
            }

            return dados;
        } catch (erro) {
            console.error("Erro ao ler reservas do navegador:", erro);
            throw new Error("Não foi possível ler as reservas. Verifique o armazenamento do navegador.");
        }
    }

    function gravar(reservas) {
        try {
            localStorage.setItem(CHAVE, JSON.stringify(reservas));
        } catch (erro) {
            console.error("Erro ao salvar reservas no navegador:", erro);
            throw new Error("Não foi possível salvar. Verifique se o armazenamento do navegador está disponível.");
        }
    }

    function validarDados(dados) {
        const campos = ["placa", "proprietario", "apartamento", "bloco", "modelo", "cor"];

        if (!dados || typeof dados !== "object") {
            throw new Error("Dados da reserva inválidos.");
        }

        for (const campo of campos) {
            if (typeof dados[campo] !== "string" || !dados[campo].trim()) {
                throw new Error("Preencha todos os campos obrigatórios.");
            }
        }

        const placa = dados.placa.trim().toUpperCase();
        const placaValida = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(placa);

        if (!placaValida) {
            throw new Error("Placa inválida. Use ABC1234 ou ABC1D23.");
        }

        const vaga = Number(dados.vaga);

        if (!Number.isInteger(vaga) || vaga < 1 || vaga > TOTAL_VAGAS) {
            throw new Error(`A vaga deve ser um número inteiro entre 1 e ${TOTAL_VAGAS}.`);
        }

        return {
            placa,
            proprietario: dados.proprietario.trim(),
            apartamento: dados.apartamento.trim(),
            bloco: dados.bloco.trim(),
            modelo: dados.modelo.trim(),
            cor: dados.cor.trim(),
            vaga
        };
    }

    function listar() {
        return ler();
    }

    function buscarPorId(id) {
        return listar().find(reserva => reserva.id === id) || null;
    }

    function buscarPorVaga(vaga) {
        return listar().find(reserva => Number(reserva.vaga) === Number(vaga)) || null;
    }

    function salvar(dados) {
        const novo = validarDados(dados);
        const reservas = listar();

        if (reservas.length >= TOTAL_VAGAS) {
            throw new Error("O estacionamento está lotado.");
        }

        if (reservas.some(reserva => String(reserva.placa).toUpperCase() === novo.placa)) {
            throw new Error("Já existe um cadastro com essa placa.");
        }

        if (reservas.some(reserva => Number(reserva.vaga) === novo.vaga)) {
            throw new Error("Essa vaga já está ocupada. Selecione outra.");
        }

        const novaReserva = {
            id: criarId(),
            ...novo
        };

        gravar([...reservas, novaReserva]);
        return novaReserva;
    }

    function criarId() {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
            return crypto.randomUUID();
        }
        return `reserva-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    function remover(id) {
        const reservas = listar();
        const atualizadas = reservas.filter(reserva => reserva.id !== id);

        if (atualizadas.length === reservas.length) {
            return false;
        }

        gravar(atualizadas);
        return true;
    }

    function vagasDisponiveis() {
        const ocupadas = new Set(listar().map(reserva => Number(reserva.vaga)));
        return Array.from({ length: TOTAL_VAGAS }, (_, indice) => indice + 1)
            .filter(vaga => !ocupadas.has(vaga));
    }

    function totalVagas() {
        return TOTAL_VAGAS;
    }

    return {
        listar,
        buscarPorId,
        buscarPorVaga,
        salvar,
        remover,
        vagasDisponiveis,
        totalVagas
    };
})();
