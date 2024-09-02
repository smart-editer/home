document.getElementById('pasteIcon').addEventListener('click', async function () {
    try {
        const clipboardText = await navigator.clipboard.readText();
        document.getElementById('urlInput').value = clipboardText;
    } catch (error) {
        alert('Failed to paste from clipboard. Please try again.');
    }
});

function generateAlias() {
    const length = Math.floor(Math.random() * 5) + 9; 
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let alias = '';
    for (let i = 0; i < length; i++) {
        alias += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return alias;
}
document.getElementById('submitBtn').addEventListener('click', function () {
    const url = document.getElementById('urlInput').value.trim(); 
    let alias = document.getElementById('aliasInput').value.trim();
    
    if (!url) {
        alert('Please enter a valid URL.');
        document.getElementById('urlInput').focus();
        return;
    }
    
    if (!alias) {
        alias = generateAlias();
        document.getElementById('aliasInput').value = alias;
    }
    const apiToken = '562e2ed01f11e56b2aa8c32c3f0adc9beab5e982';
    const encodedUrl = encodeURIComponent(url);
    const apiUrl = `https://shrinkforearn.in/api?api=${apiToken}&url=${encodedUrl}&alias=${alias}`;

   
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const resultElement = document.getElementById('result');
            const copyBtn = document.getElementById('copyBtn');
            const openBtn = document.getElementById('openBtn');

            if (data.status === 'error') {
                resultElement.value = `Error: ${data.message}`;
                resultElement.style.color = 'red';
                copyBtn.style.display = 'none';
                openBtn.style.display = 'none';
            } else if (data.status === 'success') {
                const shortenedUrl = data.shortenedUrl.replace(/\\/g, '');
                resultElement.value = shortenedUrl;
                resultElement.style.color = 'green';
                copyBtn.style.display = 'block';
                openBtn.style.display = 'block';
                openBtn.onclick = () => window.open(shortenedUrl, '_blank');

                
                const historyContent = document.getElementById('historyContent');
                const historyItem = document.createElement('div');
                historyItem.textContent = shortenedUrl;
                historyContent.appendChild(historyItem);
            }
        })
        .catch(error => {
            const resultElement = document.getElementById('result');
            resultElement.value = 'Failed to shorten URL. Please try again.';
            resultElement.style.color = 'red';
            document.getElementById('copyBtn').style.display = 'none';
            document.getElementById('openBtn').style.display = 'none';
        });
});

document.getElementById('copyBtn').addEventListener('click', function () {
    const resultElement = document.getElementById('result');
    navigator.clipboard.writeText(resultElement.value).then(function() {
        alert('URL copied to clipboard!');
    }).catch(function(error) {
        console.error('Failed to copy: ', error);
    });
});

document.getElementById('historyIcon').addEventListener('click', togglePopup);
document.getElementById('popupClose').addEventListener('click', function () {
    document.getElementById('popupWindow').classList.remove('show');
});

function togglePopup() {
    const popupWindow = document.getElementById('popupWindow');
    popupWindow.classList.toggle('show');
}



document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submitBtn');
    const urlInput = document.getElementById('urlInput');
    const aliasInput = document.getElementById('aliasInput');
    const result = document.getElementById('result');
    const popupWindow = document.getElementById('popupWindow');
    const popupClose = document.getElementById('popupClose');
    const historyContent = document.getElementById('historyContent');
    const historyIcon = document.getElementById('historyIcon');

    const saveToHistory = (url) => {
        let history = JSON.parse(localStorage.getItem('shortenedURLs')) || [];
        history.push(url);
        localStorage.setItem('shortenedURLs', JSON.stringify(history));
        displayHistory();
    };

  
    const removeFromHistory = (index) => {
        let history = JSON.parse(localStorage.getItem('shortenedURLs')) || [];
        history.splice(index, 1);
        localStorage.setItem('shortenedURLs', JSON.stringify(history));
        displayHistory();
    };

   
    const displayHistory = () => {
        let history = JSON.parse(localStorage.getItem('shortenedURLs')) || [];
        historyContent.innerHTML = '';
        history.forEach((url, index) => {
            historyContent.innerHTML += `<p>${index + 1}. <span class="historyspan" onclick="copyToClipboard('${url}')">${url}</span> <button onclick="removeFromHistory(${index})">×</button></p><hr>`;
        });
    };

 
    submitBtn.addEventListener('click', () => {
            const url = urlInput.value.trim();
            const alias = aliasInput.value.trim();
            if (url && alias) {
                    const shortenedUrl = `https://shrinkforearn.xyz/${alias}`;
                    result.textContent = shortenedUrl;
                    saveToHistory(shortenedUrl);
                    urlInput.value = '';
                    aliasInput.value = '';
            }
    });
    historyIcon.addEventListener('click', () => {
            popupWindow.style.display = 'block';
            displayHistory();
    });

    popupClose.addEventListener('click', () => {
            popupWindow.style.display = 'none';
    });


    window.addEventListener('click', (event) => {
            if (event.target == popupWindow) {
                    popupWindow.style.display = 'none';
            }
    });
    displayHistory();
    });


function removeFromHistory(index) {
    let history = JSON.parse(localStorage.getItem('shortenedURLs')) || [];
    history.splice(index, 1);
    localStorage.setItem('shortenedURLs', JSON.stringify(history));
    document.getElementById('historyContent').innerHTML = '';
    history.forEach((url, index) => {
        document.getElementById('historyContent').innerHTML += `<p>${index + 1}. <span class="historyspan" onclick="copyToClipboard('${url}')">${url}</span> <button onclick="removeFromHistory(${index})">×</button></p><hr>`;
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard: ' + text);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}