"use strict";

/*
 * CONTROLLER
 * Coordena a interação entre as páginas e o Model.
 */
const EstacionamentoController = (() => {
    const Model = EstacionamentoModel;

    function escaparHTML(valor) {
        return String(valor).replace(/[&<>"']/g, caractere => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[caractere]);
    }

    function atualizarIndicadores() {
        const total = Model.totalVagas();
        const reservas = Model.listar();
        const ocupadas = Math.min(reservas.length, total);
        const livres = total - ocupadas;

        const totalElemento = document.getElementById("totalVagas");
        const ocupadasElemento = document.getElementById("vagasOcupadas");
        const livresElemento = document.getElementById("vagasLivres");

        if (totalElemento) totalElemento.textContent = total;
        if (ocupadasElemento) ocupadasElemento.textContent = ocupadas;
        if (livresElemento) livresElemento.textContent = livres;
    }

    function listarReservas(filtro = "") {
        const corpo = document.getElementById("listaReservas");
        const mensagemVazia = document.getElementById("mensagemVazia");
        if (!corpo) return;

        const termo = filtro.trim().toLowerCase();
        const reservas = Model.listar().filter(reserva => {
            const texto = [
                reserva.placa, reserva.proprietario, reserva.apartamento,
                reserva.bloco, reserva.modelo, reserva.cor, reserva.vaga
            ].join(" ").toLowerCase();
            return texto.includes(termo);
        });

        corpo.innerHTML = reservas.map(reserva => `
            <tr>
                <td><strong>Vaga ${escaparHTML(reserva.vaga)}</strong></td>
                <td>
                    <span class="plate">${escaparHTML(reserva.placa)}</span><br>
                    ${escaparHTML(reserva.modelo)}<br>
                    <span class="muted">${escaparHTML(reserva.cor)}</span>
                </td>
                <td>${escaparHTML(reserva.proprietario)}</td>
                <td>
                    ${escaparHTML(reserva.apartamento)}<br>
                    <span class="muted">Bloco ${escaparHTML(reserva.bloco)}</span>
                </td>
                <td><span class="badge occupied">Ocupada</span></td>
                <td>
                    <button type="button" class="button danger"
                        data-remover="${escaparHTML(reserva.id)}">Remover</button>
                </td>
            </tr>
        `).join("");

        if (mensagemVazia) {
            mensagemVazia.hidden = reservas.length > 0;
            mensagemVazia.textContent = termo
                ? "Nenhuma reserva corresponde à pesquisa."
                : "Nenhuma reserva cadastrada.";
        }
    }

    function preencherVagas() {
        const seletor = document.getElementById("vaga");
        const aviso = document.getElementById("avisoVagas");
        if (!seletor) return;

        const valorAnterior = seletor.value;
        const livres = Model.vagasDisponiveis();

        seletor.replaceChildren();

        const inicial = document.createElement("option");
        inicial.value = "";
        inicial.textContent = livres.length
            ? "Selecione uma vaga disponível"
            : "Não há vagas disponíveis";
        seletor.appendChild(inicial);

        livres.forEach(vaga => {
            const opcao = document.createElement("option");
            opcao.value = String(vaga);
            opcao.textContent = `Vaga ${vaga}`;
            seletor.appendChild(opcao);
        });

        if (livres.includes(Number(valorAnterior))) {
            seletor.value = valorAnterior;
        }

        seletor.disabled = livres.length === 0;
        const botaoSalvar = document.getElementById("botaoSalvar");
        if (botaoSalvar) botaoSalvar.disabled = livres.length === 0;

        if (aviso) {
            aviso.textContent = livres.length
                ? `${livres.length} vaga(s) disponível(is).`
                : "Estacionamento lotado. Remova uma reserva para liberar uma vaga.";
        }
    }

    function mostrarVagas() {
        const mapa = document.getElementById("mapaVagas");
        if (!mapa) return;

        mapa.replaceChildren();

        for (let vaga = 1; vaga <= Model.totalVagas(); vaga++) {
            const reserva = Model.buscarPorVaga(vaga);
            const botao = document.createElement("button");

            botao.type = "button";
            botao.className = `parking-space ${reserva ? "occupied" : "available"}`;
            botao.setAttribute(
                "aria-label",
                `Vaga ${vaga}: ${reserva ? "ocupada" : "disponível"}`
            );

            const numero = document.createElement("strong");
            numero.textContent = String(vaga).padStart(2, "0");
            const status = document.createElement("span");
            status.textContent = reserva ? "OCUPADA" : "DISPONÍVEL";

            botao.append(numero, status);
            botao.addEventListener("click", () => mostrarDetalheVaga(vaga));
            mapa.appendChild(botao);
        }
    }

    function mostrarDetalheVaga(vaga) {
        const detalhe = document.getElementById("detalheVaga");
        if (!detalhe) return;

        const reserva = Model.buscarPorVaga(vaga);
        if (!reserva) {
            detalhe.textContent = `Vaga ${vaga}: disponível para uma nova reserva.`;
            return;
        }

        detalhe.textContent =
            `Vaga ${vaga}: ocupada por ${reserva.proprietario}. ` +
            `Veículo: ${reserva.modelo}, placa ${reserva.placa}. ` +
            `Apartamento ${reserva.apartamento}, bloco ${reserva.bloco}.`;
    }

    function atualizarTelas() {
        atualizarIndicadores();
        listarReservas(document.getElementById("busca")?.value || "");
        preencherVagas();
        mostrarVagas();
    }

    function cadastrar(dados) {
        const reserva = Model.salvar(dados);

        // Requisito explícito do desafio.
        console.log("Reserva cadastrada com sucesso:", reserva);
        alert("Cadastro realizado com sucesso!");
        window.location.href = "./index.html";
    }

    function remover(id) {
        const reserva = Model.buscarPorId(id);

        if (!reserva) {
            alert("Essa reserva não foi encontrada.");
            return;
        }

        const confirmou = confirm(
            `Deseja remover a reserva da vaga ${reserva.vaga}, placa ${reserva.placa}?`
        );
        if (!confirmou) return;

        if (Model.remover(id)) {
            alert("Reserva removida com sucesso!");
            atualizarTelas();
        } else {
            alert("Não foi possível remover a reserva.");
        }
    }

    return {
        atualizarTelas,
        listarReservas,
        cadastrar,
        remover
    };
})();
