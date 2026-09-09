# Chrome Auto Hide Tabs

Extensão para Google Chrome criada com o objetivo de aproveitar melhor o espaço vertical da tela, principalmente em notebooks.

Quando o Chrome está em modo de tela cheia (`F11`), a barra nativa de abas fica oculta. Esta extensão cria uma barra personalizada que aparece ao mover o mouse para a borda superior da tela, permitindo acessar e gerenciar as abas abertas sem sair do modo de tela cheia.

A ideia é reproduzir um comportamento semelhante ao de uma barra auto-ocultável: ela permanece escondida durante a navegação e aparece somente quando necessária.

## Objetivos do projeto

Este projeto possui dois objetivos principais:

* Aprender na prática como funciona o desenvolvimento de extensões para Google Chrome utilizando Manifest V3.
* Criar uma ferramenta funcional para uso pessoal no dia a dia, aproveitando melhor a área útil da tela do notebook.

## Funcionalidades atuais

A versão inicial já possui:

* Detecção do modo de tela cheia (`F11`).
* Zona invisível de ativação na borda superior da tela.
* Barra de abas exibida somente quando o mouse chega ao topo.
* Ocultação automática da barra após o mouse sair.
* Pequeno atraso antes de esconder a barra para melhorar a usabilidade.
* Listagem das abas abertas na janela atual.
* Exibição do favicon de cada aba.
* Exibição do título da página.
* Identificação visual da aba ativa.
* Clique na aba personalizada para ativar a aba real do Chrome.
* Botão `×` para fechar abas.
* Botão `+` para criar uma nova guia.
* Botão de nova guia sempre visível, separado da área rolável.
* Largura padronizada das abas.
* Scroll horizontal quando existem muitas abas.
* Uso da roda do mouse para navegar horizontalmente pelas abas.
* Rolagem automática até a aba ativa.
* Atualização automática quando abas são:

  * abertas;
  * fechadas;
  * ativadas;
  * renomeadas;
  * atualizadas.
* Tratamento de favicons que não podem ser carregados.
* Tratamento de erros de comunicação entre `content.js` e `background.js`.
* Compatibilidade com páginas que possuem CSS complexo por meio do isolamento dos estilos da barra.

## Estrutura do projeto

```text
chrome-auto-hide-tabs/
├── manifest.json
├── background.js
├── content.js
├── tabs-bar.css
└── README.md
```

### `manifest.json`

Arquivo principal de configuração da extensão.

Define:

* versão do Manifest;
* nome e versão da extensão;
* permissões;
* service worker;
* content scripts;
* arquivos CSS injetados nas páginas.

### `background.js`

Service Worker da extensão.

É responsável pela comunicação com as APIs do Chrome, principalmente `chrome.tabs`.

Entre suas responsabilidades estão:

* listar abas;
* ativar uma aba;
* fechar uma aba;
* criar uma nova aba;
* detectar alterações nas abas;
* avisar o `content.js` quando a interface precisa ser atualizada.

### `content.js`

Responsável pela interface inserida nas páginas.

Entre suas responsabilidades estão:

* criar a barra personalizada;
* criar a zona de ativação no topo;
* detectar o modo tela cheia;
* renderizar as abas;
* tratar cliques;
* controlar exibição e ocultação da barra;
* realizar a comunicação com o `background.js`.

### `tabs-bar.css`

Contém todo o estilo visual da interface.

Os estilos utilizam regras como `all: initial` e `!important` para reduzir interferências do CSS das páginas visitadas.

## Arquitetura

A extensão possui dois contextos principais de execução:

```text
Página Web
    ↕
content.js
    ↕
chrome.runtime.sendMessage
    ↕
background.js
    ↕
Chrome APIs
    ↕
chrome.tabs
```

O `content.js` fica responsável principalmente pela interface.

O `background.js` fica responsável pelas operações privilegiadas fornecidas pelas APIs de extensões do Chrome.

Por exemplo, ao clicar em uma aba personalizada:

```text
Usuário clica na aba
        ↓
content.js
        ↓
envia "ativarAba"
        ↓
background.js
        ↓
chrome.tabs.update()
        ↓
Chrome ativa a aba real
```

A comunicação também acontece no sentido contrário.

Quando uma aba é criada ou fechada:

```text
Chrome detecta alteração
        ↓
background.js
        ↓
envia "atualizarAbas"
        ↓
content.js
        ↓
renderiza novamente a barra
```

## Instalação para desenvolvimento e uso pessoal

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Abra no Chrome:

```text
chrome://extensions
```

Em seguida:

1. Ative **Modo do desenvolvedor**.
2. Clique em **Carregar sem compactação**.
3. Selecione a pasta do projeto.
4. Abra ou atualize uma página comum.
5. Pressione `F11`.
6. Mova o mouse até a borda superior da tela.

A barra personalizada deverá aparecer.

## Desenvolvimento

Depois de modificar os arquivos da extensão:

1. Acesse `chrome://extensions`.
2. Clique em **Recarregar** na extensão.
3. Atualize as abas em que deseja testar o novo `content.js`.

Durante o desenvolvimento, abas que já estavam abertas antes do recarregamento da extensão podem continuar utilizando o content script anterior até serem atualizadas.

## Limitação importante

A extensão não consegue controlar diretamente a barra de abas nativa do Google Chrome.

As APIs de extensões permitem consultar e controlar abas, mas não fornecem acesso para fazer a interface nativa de abas aparecer durante o modo `F11`.

Por esse motivo, o projeto implementa uma barra própria que representa e controla as abas reais do navegador.

## Estado atual

O projeto encontra-se em fase de teste da primeira versão funcional.

O objetivo atual é utilizar a extensão diariamente durante um período de testes para identificar problemas reais de usabilidade, compatibilidade e estabilidade.

Alguns pontos que serão observados:

* comportamento com muitas abas;
* estabilidade após várias horas de uso;
* funcionamento em diferentes sites;
* entrada e saída repetida do modo `F11`;
* atualização de títulos e favicons;
* comportamento após suspensão do notebook;
* conforto do tempo de exibição da barra;
* funcionamento do scroll horizontal;
* páginas internas ou protegidas do Chrome.

## Próximas possibilidades

Possíveis funcionalidades para versões futuras:

* configuração da largura das abas;
* configuração do tempo para ocultar a barra;
* temas claro e escuro;
* suporte visual para abas fixadas;
* grupos de abas;
* reorganização das abas por drag-and-drop;
* configurações da extensão;
* atalhos personalizados;
* customização da altura da barra;
* melhoria da aparência para aproximá-la ainda mais da interface nativa do Chrome.

## Motivação

O projeto surgiu da necessidade de utilizar melhor a pequena área vertical disponível em notebooks.

O modo `F11` do Chrome oferece mais espaço para o conteúdo, porém remove também o acesso rápido às abas. A proposta desta extensão é manter o benefício da tela cheia sem perder a praticidade de navegar entre várias páginas abertas.

Além da utilidade prática, o projeto também é utilizado como estudo de desenvolvimento de extensões Chrome, JavaScript, manipulação do DOM, eventos, comunicação entre contextos e APIs do navegador.
