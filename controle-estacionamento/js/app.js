"use strict";

/*
 * Inicialização da aplicação e registro dos eventos da interface.
 */
document.addEventListener("DOMContentLoaded", () => {
    const Controller = EstacionamentoController;

    try {
        Controller.atualizarTelas();
    } catch (erro) {
        console.error("Falha ao iniciar o ParkControl:", erro);
        alert(
            `${erro.message || "Não foi possível carregar as reservas."}\n\n` +
            "Abra o projeto pelo Live Server e confira os caminhos das pastas."
        );
        return;
    }

    const busca = document.getElementById("busca");
    if (busca) {
        busca.addEventListener("input", () => {
            Controller.listarReservas(busca.value);
        });
    }

    const formulario = document.getElementById("formCadastro");
    if (formulario) {
        const campoPlaca = document.getElementById("placa");
        if (campoPlaca) {
            campoPlaca.addEventListener("input", () => {
                campoPlaca.value = campoPlaca.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
            });
        }

        formulario.addEventListener("submit", evento => {
            evento.preventDefault();

            if (!formulario.reportValidity()) return;

            const dados = {
                placa: formulario.elements.placa.value.trim().toUpperCase(),
                proprietario: formulario.elements.proprietario.value.trim(),
                apartamento: formulario.elements.apartamento.value.trim(),
                bloco: formulario.elements.bloco.value.trim(),
                modelo: formulario.elements.modelo.value.trim(),
                cor: formulario.elements.cor.value.trim(),
                vaga: Number(formulario.elements.vaga.value)
            };

            try {
                Controller.cadastrar(dados);
            } catch (erro) {
                console.error("Erro ao cadastrar reserva:", erro);
                alert(erro.message || "Não foi possível cadastrar a reserva.");
            }
        });
    }

    const lista = document.getElementById("listaReservas");
    if (lista) {
        lista.addEventListener("click", evento => {
            const botao = evento.target.closest("[data-remover]");
            if (botao) Controller.remover(botao.dataset.remover);
        });
    }
});
