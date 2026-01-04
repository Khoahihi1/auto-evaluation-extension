const ENABLED_KEY = 'auto_eval_enabled';
const LOG_KEY = 'auto_eval_logs';
const STATE_KEY = 'auto_eval_state';
const MAX_LOGS = 50;

// Update UI with state
function updateUI(enabled, state = null) {
    const indicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const statusDesc = document.getElementById('statusDesc');
    const toggleBtn = document.getElementById('toggleBtn');
    const progressSection = document.getElementById('progressSection');

    if (enabled) {
        indicator.className = 'status-indicator on';
        indicator.textContent = '▶';
        statusText.textContent = 'Đang chạy';
        statusDesc.textContent = 'Extension đang tự động hoạt động';
        toggleBtn.textContent = 'Tắt';
        toggleBtn.classList.remove('btn-primary');
        toggleBtn.classList.add('btn-danger');

        // Show progress if has state
        if (state) {
            progressSection.style.display = 'block';
            updateProgress(state);
        }
    } else {
        indicator.className = 'status-indicator off';
        indicator.textContent = '⏸';
        statusText.textContent = 'Đang tắt';
        statusDesc.textContent = 'Bấm "Bật" để bắt đầu';
        toggleBtn.textContent = 'Bật';
        toggleBtn.classList.remove('btn-danger');
        toggleBtn.classList.add('btn-primary');
        progressSection.style.display = 'none';
    }
}

function updateProgress(state) {
    const total = state.currentIndex;
    const processed = state.processedCount || 0;
    const skipped = state.skippedCount || 0;
    const errors = state.errorCount || 0;
    const completedTotal = processed + skipped;

    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const percentage = total > 0 ? (completedTotal / total) * 100 : 0;

    progressFill.style.width = percentage + '%';
    progressText.textContent = `${completedTotal}/${total}`;

    // Update stats
    document.getElementById('statProcessed').textContent = processed;
    document.getElementById('statSkipped').textContent = skipped;
    document.getElementById('statError').textContent = errors;
}

// Load state and update UI
function loadState() {
    chrome.storage.local.get([ENABLED_KEY, STATE_KEY], function (result) {
        const enabled = result[ENABLED_KEY] || false;
        const state = result[STATE_KEY] ? JSON.parse(result[STATE_KEY]) : null;
        updateUI(enabled, state);
    });
}

// Initial load
loadState();

// Refresh every second to update progress
setInterval(loadState, 1000);

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
                chrome.storage.local.set({ [LOG_KEY]: [], [STATE_KEY]: null }, function () {
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
    this.textContent = logCard.classList.contains('show') ? '📋 Ẩn log' : '📋 Xem log chi tiết';
});

// Load logs initially and refresh
loadLogs();
setInterval(loadLogs, 1000);

// Listen for changes
chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === 'local') {
        if (changes[LOG_KEY]) {
            displayLogs(changes[LOG_KEY].newValue || []);
        }
        if (changes[STATE_KEY] || changes[ENABLED_KEY]) {
            loadState();
        }
    }
});
