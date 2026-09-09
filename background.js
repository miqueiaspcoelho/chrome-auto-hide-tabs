var timeoutAtualizacaoAbas = null;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === 'listarAbas') {

	    chrome.tabs.query(
	        {
	            currentWindow: true
	        },
	        function (tabs) {

	            if (chrome.runtime.lastError) {

	                sendResponse({
	                    sucesso: false,
	                    erro: chrome.runtime.lastError.message
	                });

	                return;
	            }

	            sendResponse({
	                sucesso: true,
	                tabs: tabs
	            });

	        }
	    );

	    return true;
	}

	if (request.action === 'ativarAba') {

	    chrome.tabs.update(
	        request.tabId,
	        {
	            active: true
	        },
	        function () {

	            if (chrome.runtime.lastError) {

	                sendResponse({
	                    sucesso: false,
	                    erro: chrome.runtime.lastError.message
	                });

	                return;
	            }

	            sendResponse({
	                sucesso: true
	            });

	        }
	    );

	    return true;
	}

	if (request.action === 'fecharAba') {

	    chrome.tabs.remove(
	        request.tabId,
	        function () {

	            if (chrome.runtime.lastError) {

	                sendResponse({
	                    sucesso: false,
	                    erro: chrome.runtime.lastError.message
	                });

	                return;
	            }

	            sendResponse({
	                sucesso: true
	            });

	        }
	    );

	    return true;
	}

	if (request.action === 'novaAba') {

	    chrome.tabs.create(
	        {},
	        function (tab) {

	            if (chrome.runtime.lastError) {

	                sendResponse({
	                    sucesso: false,
	                    erro: chrome.runtime.lastError.message
	                });

	                return;
	            }

	            sendResponse({
	                sucesso: true,
	                tab: tab
	            });

	        }
	    );

	    return true;
	}
})

function notificarAtualizacaoAbas() {

    if (timeoutAtualizacaoAbas) {
        clearTimeout(timeoutAtualizacaoAbas);
    }

    timeoutAtualizacaoAbas = setTimeout(function () {

        chrome.tabs.query(
            {
                active: true,
                currentWindow: true
            },
            function (tabs) {

                if (chrome.runtime.lastError) {
                    return;
                }

                if (!tabs || !tabs.length) {
                    return;
                }

                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        action: 'atualizarAbas'
                    },
                    function () {

                        if (chrome.runtime.lastError) {
                            return;
                        }

                    }
                );

            }
        );

    }, 100);

}


// ======================================================
// EVENTOS DO CHROME
// ======================================================

chrome.tabs.onCreated.addListener(function () {
    notificarAtualizacaoAbas();
});

chrome.tabs.onRemoved.addListener(function () {
    notificarAtualizacaoAbas();
});

chrome.tabs.onActivated.addListener(function () {
    notificarAtualizacaoAbas();
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

    if (
        typeof changeInfo.title !== 'undefined' ||
        typeof changeInfo.favIconUrl !== 'undefined' ||
        changeInfo.status === 'complete'
    ) {
        notificarAtualizacaoAbas();
    }

});