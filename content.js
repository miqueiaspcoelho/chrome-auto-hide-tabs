var timeoutEsconderBarra = null;

var zona = document.createElement('div');
zona.id = 'chrome-auto-hide-tabs-trigger';

var barra = document.createElement('div');
barra.id = 'chrome-auto-hide-tabs';

var containerAbas = document.createElement("div");
containerAbas.id = "chrome-auto-hide-tabs-list";

barra.appendChild(containerAbas);

var novaAba = document.createElement('div');

novaAba.className = 'chrome-auto-hide-new-tab';

novaAba.textContent = '+';

novaAba.title = 'Nova guia';

novaAba.addEventListener('click', function (event) {

    event.stopPropagation();

    criarNovaAba();

});

barra.appendChild(novaAba);

document.documentElement.appendChild(zona);
document.documentElement.appendChild(barra);

var fullscreenAtivo = false;


// ======================================================
// FULLSCREEN
// ======================================================

function detectarTelaCheia() {

    var larguraTela = screen.width;
    var alturaTela = screen.height;

    var larguraJanela = window.innerWidth;
    var alturaJanela = window.innerHeight;

    var tolerancia = 10;

    var ocupaLargura =
        Math.abs(larguraJanela - larguraTela) <= tolerancia;

    var ocupaAltura =
        Math.abs(alturaJanela - alturaTela) <= tolerancia;

    fullscreenAtivo = ocupaLargura && ocupaAltura;

    if (fullscreenAtivo) {

        zona.style.display = 'block';

    } else {

        zona.style.display = 'none';

        barra.classList.remove('visivel');

    }
}


// ======================================================
// BUSCAR ABAS
// ======================================================

function carregarAbas() {

    chrome.runtime.sendMessage(
        {
            action: 'listarAbas'
        },
        function (response) {

            if (chrome.runtime.lastError) {

                console.warn(
                    '[Chrome Auto Hide Tabs] Falha ao listar abas:',
                    chrome.runtime.lastError.message
                );

                return;
            }

            if (!response || !response.sucesso) {

                console.warn(
                    '[Chrome Auto Hide Tabs] Resposta inválida ao listar abas.'
                );

                return;
            }

            renderizarAbas(response.tabs);

        }
    );

}


// ======================================================
// RENDERIZAR ABAS
// ======================================================

function renderizarAbas(tabs) {

   containerAbas.innerHTML = "";

    tabs.forEach(function (tab) {

        var elementoTab = document.createElement('div');

        elementoTab.className = 'chrome-auto-hide-tab';

        elementoTab.setAttribute('data-tab-id', tab.id);

        if (tab.active) {
            elementoTab.classList.add('ativa');
        }


        // ==================================================
        // FAVICON
        // ==================================================

        if (tab.favIconUrl) {

            var favicon = document.createElement('img');

            favicon.className = 'chrome-auto-hide-tab-favicon';
            favicon.src = tab.favIconUrl;

            favicon.addEventListener('error', function () {
                this.style.display = 'none';
            });

            elementoTab.appendChild(favicon);
        }


        // ==================================================
        // TÍTULO
        // ==================================================

        var titulo = document.createElement('span');

        titulo.className = 'chrome-auto-hide-tab-title';

        titulo.textContent =
            tab.title || 'Nova guia';

        elementoTab.appendChild(titulo);


        // ==================================================
        // FECHAR
        // ==================================================

        var fechar = document.createElement('span');

        fechar.className = 'chrome-auto-hide-tab-close';

        fechar.textContent = '×';

        fechar.addEventListener('click', function (event) {

            event.stopPropagation();

            fecharAba(tab.id);

        });

        elementoTab.appendChild(fechar);


        // ==================================================
        // ATIVAR ABA
        // ==================================================

        elementoTab.addEventListener('click', function () {

            ativarAba(tab.id);

        });


        containerAbas.appendChild(elementoTab);

    });

    var abaAtiva = containerAbas.querySelector('.chrome-auto-hide-tab.ativa');

    if (abaAtiva) {
        abaAtiva.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }

}

// =====================================================
// ATIVA ABA
// =====================================================
function ativarAba(tabId) {

    chrome.runtime.sendMessage(
        {
            action: 'ativarAba',
            tabId: tabId
        },
        function (response) {

            if (chrome.runtime.lastError) {

                console.warn(
                    '[Chrome Auto Hide Tabs] Falha ao ativar aba:',
                    chrome.runtime.lastError.message
                );

                return;
            }

            if (!response || !response.sucesso) {

                console.warn(
                    '[Chrome Auto Hide Tabs] Não foi possível ativar a aba.'
                );

                return;
            }

        }
    );

}

// ======================================================
// FECHA ABA
// ======================================================
function fecharAba(tabId) {

    chrome.runtime.sendMessage(
        {
            action: 'fecharAba',
            tabId: tabId
        },
        function (response) {

            if (chrome.runtime.lastError) {

                console.warn(
                    '[Chrome Auto Hide Tabs] Falha ao fechar aba:',
                    chrome.runtime.lastError.message
                );

                return;
            }

            if (!response || !response.sucesso) {

                console.warn(
                    '[Chrome Auto Hide Tabs] Não foi possível fechar a aba.'
                );

                return;
            }

            carregarAbas();

        }
    );

}
// ======================================================
// CRIAR NOVA ABA
// ======================================================
function criarNovaAba() {

    chrome.runtime.sendMessage(
        {
            action: 'novaAba'
        },
        function (response) {

            if (chrome.runtime.lastError) {

                console.warn(
                    '[Chrome Auto Hide Tabs] Falha ao criar nova aba:',
                    chrome.runtime.lastError.message
                );

                return;
            }

            if (!response || !response.sucesso) {

                console.warn(
                    '[Chrome Auto Hide Tabs] Não foi possível criar uma nova aba.'
                );

                return;
            }

        }
    );

}

// ======================================================
// EVENTOS
// ======================================================

zona.addEventListener('mouseenter', function () {

    if (!fullscreenAtivo) {
        return;
    }

    if (timeoutEsconderBarra) {
        clearTimeout(timeoutEsconderBarra);
        timeoutEsconderBarra = null;
    }

    carregarAbas();

    barra.classList.add('visivel');

});


barra.addEventListener('mouseleave', function () {

    timeoutEsconderBarra = setTimeout(function(){
        barra.classList.remove("visivel");
    }, 300 );

    barra.classList.remove('visivel');

});


barra.addEventListener("mouseenter", function(){
    if(timeoutEsconderBarra){
        clearTimeout(timeoutEsconderBarra);
        timeoutEsconderBarra = null;
    }
});

containerAbas.addEventListener('wheel', function (event) {

    event.preventDefault();

    containerAbas.scrollLeft += event.deltaY;

}, {
    passive: false
});


// ======================================================
// NOTIFICAR ATUALIZAÇÕES DE ABAS
// ======================================================
chrome.runtime.onMessage.addListener(function (request) {

    if (request.action === 'atualizarAbas') {

        carregarAbas();

    }

});

window.addEventListener('resize', function () {

    setTimeout(function () {

        detectarTelaCheia();

    }, 200);

});


detectarTelaCheia();