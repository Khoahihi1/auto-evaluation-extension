const ENABLED_KEY = 'auto_eval_enabled';
const LOG_KEY = 'auto_eval_logs';
const MAX_LOGS = 50;

// Update UI
function updateUI(enabled) {
    const indicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const statusDesc = document.getElementById('statusDesc');
    const toggleBtn = document.getElementById('toggleBtn');

    if (enabled) {
        indicator.className = 'status-indicator on';
        indicator.textContent = '▶';
        statusText.textContent = 'Đang chạy';
        statusDesc.textContent = 'Extension đang tự động hoạt động';
        toggleBtn.textContent = 'Tắt';
        toggleBtn.classList.remove('btn-primary');
        toggleBtn.classList.add('btn-danger');
    } else {
        indicator.className = 'status-indicator off';
        indicator.textContent = '⏸';
        statusText.textContent = 'Đang tắt';
        statusDesc.textContent = 'Bấm "Bật" để bắt đầu';
        toggleBtn.textContent = 'Bật';
        toggleBtn.classList.remove('btn-danger');
        toggleBtn.classList.add('btn-primary');
    }
}

// Load state
chrome.storage.local.get([ENABLED_KEY], function (result) {
    updateUI(result[ENABLED_KEY] || false);
});

// Toggle on/off
document.getElementById('toggleBtn').addEventListener('click', function () {
    chrome.storage.local.get([ENABLED_KEY], function (result) {
        const newState = !result[ENABLED_KEY];
        chrome.storage.local.set({ [ENABLED_KEY]: newState }, function () {
            updateUI(newState);

            if (newState) {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.reload(tabs[0].id);
                });
            }
        });
    });
});

// Reset
document.getElementById('resetBtn').addEventListener('click', function () {
    if (confirm('Reset tiến trình? Extension sẽ bắt đầu lại từ môn đầu tiên.')) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'reset' }, function (response) {
                chrome.storage.local.set({ [LOG_KEY]: [] }, function () {
                    alert('Đã reset! Reload trang để bắt đầu lại.');
                    chrome.tabs.reload(tabs[0].id);
                });
            });
        });
    }
});

// === LOG VIEWER ===
function loadLogs() {
    chrome.storage.local.get([LOG_KEY], function (result) {
        const logs = result[LOG_KEY] || [];
        displayLogs(logs);
    });
}

function displayLogs(logs) {
    const container = document.getElementById('logContainer');

    if (logs.length === 0) {
        container.innerHTML = '<div class="log-empty">Chưa có log nào</div>';
        return;
    }

    container.innerHTML = logs.map(log => {
        const time = new Date(log.timestamp).toLocaleTimeString('vi-VN');
        return `<div class="log-entry ${log.type}">
            <span class="time">[${time}]</span>
            <span>${log.message}</span>
        </div>`;
    }).join('');

    container.scrollTop = container.scrollHeight;
}

// Clear logs
document.getElementById('clearLogBtn').addEventListener('click', function () {
    chrome.storage.local.set({ [LOG_KEY]: [] }, function () {
        displayLogs([]);
    });
});

// Toggle log visibility
document.getElementById('toggleLogBtn').addEventListener('click', function () {
    const logCard = document.getElementById('logCard');
    logCard.classList.toggle('show');
    this.textContent = logCard.classList.contains('show') ? 'Ẩn log' : 'Xem log chi tiết';
});

// Load logs
loadLogs();
setInterval(loadLogs, 1000);

// Listen for changes
chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === 'local' && changes[LOG_KEY]) {
        displayLogs(changes[LOG_KEY].newValue || []);
    }
});
