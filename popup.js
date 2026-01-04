const ENABLED_KEY = 'auto_eval_enabled';
const LOG_KEY = 'auto_eval_logs';
const STATE_KEY = 'auto_eval_state';

// Cập nhật UI
function updateUI(enabled, state = null) {
    const badge = document.getElementById('statusBadge');
    const statusText = document.getElementById('statusText');
    const toggleBtn = document.getElementById('toggleBtn');
    const progress = document.getElementById('progress');

    if (enabled) {
        // Active state
        badge.classList.add('active');
        statusText.textContent = 'Đang hoạt động';

        toggleBtn.textContent = 'Tắt Extension';
        toggleBtn.classList.remove('btn-primary');
        toggleBtn.classList.add('active-state'); // Màu đỏ khi đang chạy

        if (state) {
            progress.style.display = 'block';
            updateProgress(state);
        }
    } else {
        // Inactive state
        badge.classList.remove('active');
        statusText.textContent = 'Đã tắt';

        toggleBtn.textContent = 'Bật Extension';
        toggleBtn.classList.remove('active-state');
        toggleBtn.classList.add('btn-primary');

        progress.style.display = 'none';
    }
}

function updateProgress(state) {
    const total = state.currentIndex;
    const complete = state.processedCount || 0;
    const skip = state.skippedCount || 0;
    const error = state.errorCount || 0;
    const done = complete + skip;

    const percentage = total > 0 ? (done / total) * 100 : 0;

    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressValue').textContent = `${done}/${total}`;

    document.getElementById('statComplete').textContent = complete;
    document.getElementById('statSkip').textContent = skip;
    document.getElementById('statError').textContent = error;
}

function loadState() {
    chrome.storage.local.get([ENABLED_KEY, STATE_KEY], function (result) {
        const enabled = result[ENABLED_KEY] || false;
        const state = result[STATE_KEY] ? JSON.parse(result[STATE_KEY]) : null;
        updateUI(enabled, state);
    });
}

// Khởi tạo chạy ngay
loadState();
setInterval(loadState, 1000);

// Nút Bật/Tắt
document.getElementById('toggleBtn').addEventListener('click', function () {
    chrome.storage.local.get([ENABLED_KEY], function (result) {
        const newState = !result[ENABLED_KEY];
        chrome.storage.local.set({ [ENABLED_KEY]: newState }, function () {
            updateUI(newState);

            if (newState) {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    if (tabs[0]) chrome.tabs.reload(tabs[0].id);
                });
            }
        });
    });
});

// Nút Reset
document.getElementById('resetBtn').addEventListener('click', function () {
    if (confirm('Reset tiến trình? Extension sẽ bắt đầu lại từ đầu.')) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'reset' }, function () { });
                // Xóa log và state
                chrome.storage.local.set({ [LOG_KEY]: [], [STATE_KEY]: null }, function () {
                    alert('Đã reset! Reload trang để bắt đầu lại.');
                    chrome.tabs.reload(tabs[0].id);
                });
            }
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
        container.innerHTML = '<div class="log-empty">Chưa có log</div>';
        return;
    }

    container.innerHTML = logs.map(log => {
        const time = new Date(log.timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        return `<div class="log-entry ${log.type}">
            <span class="time">${time}</span>
            <span>${log.message}</span>
        </div>`;
    }).join('');

    container.scrollTop = container.scrollHeight;
}

document.getElementById('clearLog').addEventListener('click', function () {
    chrome.storage.local.set({ [LOG_KEY]: [] }, function () {
        displayLogs([]);
    });
});

document.getElementById('logToggle').addEventListener('click', function () {
    const section = document.getElementById('logSection');
    section.classList.toggle('open');
    this.textContent = section.classList.contains('open') ? 'Ẩn log' : 'Xem log chi tiết';
});

loadLogs();
setInterval(loadLogs, 1000);

// Lắng nghe thay đổi từ storage để cập nhật UI realtime
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
