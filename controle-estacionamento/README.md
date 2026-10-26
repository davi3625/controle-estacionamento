# ParkControl — Controle de Estacionamento

Projeto front-end desenvolvido para o desafio de Desenvolvimento Web.

## Objetivo

Criar um sistema demonstrativo para cadastro e controle de reservas de vagas de estacionamento de um condomínio.

## Funcionalidades

- Listagem de reservas com pesquisa por placa, proprietário, apartamento, bloco, modelo, cor ou vaga.
- Cadastro com os sete campos exigidos: placa, proprietário, apartamento, bloco, modelo, cor e vaga.
- Validação de campos obrigatórios e placa no padrão antigo ou Mercosul.
- Prevenção de placa duplicada e de reserva duplicada para a mesma vaga.
- Remoção de reserva com confirmação.
- Mapa visual de 20 vagas, com atualização de ocupação.
- Indicadores de vagas totais, ocupadas e disponíveis.
- Persistência no `localStorage` do navegador.
- Dados fictícios iniciais para demonstrar a listagem.

## Tecnologias

- HTML5
- CSS3
- JavaScript puro (Vanilla JavaScript)
- `localStorage`

Não utiliza frameworks nem bibliotecas externas.

## Estrutura do projeto

```text
controle-estacionamento/
├── index.html
├── cadastro.html
├── disponiveis.html
├── README.md
├── css/
│   └── style.css
└── js/
    ├── model.js
    ├── controller.js
    └── app.js
```

## Como executar

1. Abra a pasta do projeto no Visual Studio Code.
2. Instale a extensão Live Server, se ainda não estiver instalada.
3. Abra `index.html`.
4. Clique em **Go Live**.
5. Use o menu para abrir Reservas, Vagas e Nova reserva.

É recomendado usar o Live Server em vez de abrir os arquivos diretamente com `file://`.

## Como testar

1. Na página inicial, confirme que aparecem 20 vagas no total, 3 ocupadas e 17 disponíveis.
2. Abra Nova reserva e preencha os sete campos.
3. Use uma placa ainda não cadastrada, por exemplo `JKL4M56`, e escolha uma vaga livre.
4. Salve. Deve aparecer uma confirmação e a reserva deve ser exibida na listagem.
5. Abra o Console do navegador (`F12` → Console) para conferir os dados enviados ao `console.log`. Ative **Preserve log** para manter a mensagem após a navegação.
6. Verifique se a vaga aparece como ocupada na tela Vagas.
7. Tente cadastrar a mesma placa ou selecionar uma vaga ocupada: o sistema deve impedir.
8. Remova uma reserva e confirme que a vaga voltou a ficar disponível.
9. Atualize a página e confirme que os dados continuam no mesmo navegador.

## Arquitetura

- **Model (`js/model.js`)**: leitura, validação, persistência, listagem e remoção.
- **Controller (`js/controller.js`)**: coordena operações e atualização das telas.
- **View**: páginas HTML e estilos CSS.
- **App (`js/app.js`)**: inicializa a aplicação e conecta os eventos da interface.

## Limitações

Esta é uma aplicação exclusivamente front-end. O `localStorage` armazena os dados apenas no navegador atual; não existe banco de dados nem sincronização entre dispositivos. As três reservas iniciais são fictícias para demonstração.
