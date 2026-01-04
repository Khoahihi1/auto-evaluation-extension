// Content Script - Tự động chạy trên mọi trang
(function () {
    'use strict';

    // === MESSAGE HANDLER ===
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.action === 'reset') {
            clearState();
            sendResponse({ success: true });
        }
        return true;
    });

    const STATE_KEY = 'auto_eval_state';
    const ENABLED_KEY = 'auto_eval_enabled';

    // Kiểm tra xem có bật auto mode không
    chrome.storage.local.get([ENABLED_KEY], function (result) {
        if (!result[ENABLED_KEY]) {
            console.log('[Auto Eval] Extension tắt - không chạy');
            return;
        }

        // Chỉ chạy nếu đang bật
        runAutoEval();
    });

    // === LOGGING ===
    const LOG_KEY = 'auto_eval_logs';
    const MAX_LOGS = 50;

    function addLog(message, type = 'info') {
        chrome.storage.local.get([LOG_KEY], function (result) {
            let logs = result[LOG_KEY] || [];

            logs.push({
                timestamp: Date.now(),
                message: message,
                type: type // 'info', 'success', 'error'
            });

            // Giữ tối đa MAX_LOGS
            if (logs.length > MAX_LOGS) {
                logs = logs.slice(-MAX_LOGS);
            }

            chrome.storage.local.set({ [LOG_KEY]: logs });
        });

        // Vẫn log ra console
        console.log(`[Auto Eval] ${message}`);
    }

    function runAutoEval() {
        const text1 = [
            "Giảng viên có kiến thức chuyên môn vững vàng.",
            "Phương pháp giảng dạy rõ ràng và dễ hiểu.",
            "Giảng viên giảng bài rất nhiệt tình.",
            "Khả năng truyền đạt kiến thức tốt.",
            "Giảng viên luôn sẵn sàng giải đáp thắc mắc.",
            "Bài giảng có chiều sâu chuyên môn.",
            "Không khí lớp học thoải mái.",
            "Cách giảng bài sinh động.",
            "Giảng viên có kinh nghiệm thực tế.",
            "Kiến thức được liên hệ thực tiễn.",
            "Giảng bài mạch lạc và rõ ràng.",
            "Tác phong giảng dạy chuyên nghiệp.",
            "Giảng viên tận tâm với sinh viên.",
            "Bài giảng được chuẩn bị kỹ.",
            "Giảng viên truyền cảm hứng học tập.",
            "Nội dung bám sát chương trình.",
            "Giảng viên thân thiện và gần gũi.",
            "Trình bày vấn đề dễ tiếp thu.",
            "Hướng dẫn sinh viên chi tiết.",
            "Kiến thức được phân tích rõ.",
            "Giảng viên tạo điều kiện trao đổi.",
            "Phương pháp giảng phù hợp.",
            "Phong cách giảng dạy cuốn hút.",
            "Nhiều ví dụ minh họa dễ hiểu.",
            "Giảng viên luôn đúng giờ.",
            "Quản lý lớp học tốt.",
            "Kiến thức truyền đạt chính xác.",
            "Tinh thần trách nhiệm cao.",
            "Giải thích nội dung khó rõ ràng.",
            "Khuyến khích sinh viên đặt câu hỏi.",
            "Bài giảng có tính ứng dụng.",
            "Tôn trọng ý kiến sinh viên.",
            "Hỗ trợ sinh viên ngoài giờ.",
            "Giảng dạy logic và khoa học.",
            "Giúp sinh viên hiểu bản chất.",
            "Bài giảng không lan man.",
            "Tạo động lực học tập.",
            "Kiến thức cập nhật.",
            "Phong thái giảng dạy tự tin.",
            "Bài giảng có cấu trúc rõ.",
            "Luôn lắng nghe sinh viên.",
            "Phương pháp giảng hiệu quả.",
            "Giải thích chi tiết.",
            "Nội dung dễ ghi nhớ.",
            "Tạo hứng thú học tập.",
            "Tinh thần trách nhiệm tốt.",
            "Hướng dẫn tận tình.",
            "Dễ nắm bắt nội dung chính.",
            "Kiến thức môn học sâu.",
            "Giảng dạy có trọng tâm.",
            "Cách tiếp cận khoa học.",
            "Giúp hiểu rõ mục tiêu môn học.",
            "Truyền đạt tự nhiên.",
            "Thái độ giảng dạy tích cực.",
            "Nội dung dễ tiếp cận.",
            "Làm rõ vấn đề phức tạp.",
            "Lý thuyết gắn với thực tế.",
            "Phong cách giảng dạy dễ gần.",
            "Tạo cảm giác thoải mái khi học.",
            "Truyền đạt đúng trọng tâm.",
            "Quan tâm tiến độ học tập.",
            "Bài giảng không gây áp lực.",
            "Giải thích nội dung quan trọng.",
            "Chuẩn bị bài chu đáo.",
            "Giúp sinh viên dễ ghi nhớ.",
            "Nghiêm túc nhưng thân thiện.",
            "Phù hợp chương trình đào tạo.",
            "Dẫn dắt bài học tốt.",
            "Giúp nắm kiến thức cốt lõi.",
            "Trình bày mạch lạc.",
            "Khuyến khích học tập tích cực.",
            "Diễn giải rõ ràng.",
            "Tạo điều kiện tiếp cận kiến thức mới.",
            "Triển khai bài học hợp lý.",
            "Diễn giải sinh động.",
            "Giúp hiểu sâu nội dung.",
            "Phong cách dễ tiếp thu.",
            "Giữ sự tập trung tốt.",
            "Định hướng bài học rõ ràng.",
            "Linh hoạt trong giảng dạy.",
            "Giải thích khái niệm cơ bản tốt.",
            "Nội dung không quá nặng.",
            "Truyền đạt có chọn lọc.",
            "Thái độ giảng dạy tích cực.",
            "Trình bày logic.",
            "Quan tâm khả năng tiếp thu.",
            "Khả năng tổng hợp tốt.",
            "Hiểu rõ bản chất môn học.",
            "Giải thích cặn kẽ.",
            "Môi trường học tập nghiêm túc.",
            "Nội dung dễ theo dõi.",
            "Khả năng truyền đạt ổn định.",
            "Giảng bài đúng tiến độ.",
            "Nội dung bổ ích.",
            "Giúp nắm nội dung chính.",
            "Tôn trọng sinh viên.",
            "Phù hợp đặc thù môn học.",
            "Tạo sự yên tâm khi học.",
            "Bài giảng có hệ thống.",
            "Làm rõ yêu cầu môn học.",
            "Truyền đạt dễ tiếp nhận.",
            "Phong thái điềm đạm.",
            "Bài giảng rõ ràng.",
            "Đầu tư cho nội dung.",
            "Giải thích chi tiết.",
            "Làm rõ vấn đề khó.",
            "Học tập hiệu quả hơn.",
            "Tinh thần trách nhiệm cao.",
            "Tạo điều kiện hiểu bài.",
            "Phù hợp trình độ sinh viên.",
            "Cách trình bày dễ theo dõi.",
            "Thái độ nghiêm túc.",
            "Định hướng kiến thức rõ.",
            "Giúp tiếp cận môn học dễ dàng.",
            "Giải thích dễ hiểu.",
            "Bài giảng gọn gàng.",
            "Tạo cảm giác thoải mái.",
            "Truyền đạt mạch lạc.",
            "Phong cách rõ ràng.",
            "Liên kết nội dung tốt.",
            "Chú trọng chất lượng bài giảng.",
            "Giúp nắm vững kiến thức nền.",
            "Có tính ứng dụng.",
            "Truyền đạt đúng trọng tâm.",
            "Kiên nhẫn khi giảng dạy.",
            "Giúp hiểu sâu môn học.",
            "Tạo sự tập trung cho lớp.",
            "Trình bày rõ ràng.",
            "Tính logic cao.",
            "Không gây quá tải.",
            "Giúp hiểu đúng nội dung.",
            "Làm việc nghiêm túc.",
            "Trình bày cụ thể.",
            "Chuẩn bị tốt.",
            "Môi trường học tích cực.",
            "Tiếp thu kiến thức hiệu quả.",
            "Phong cách dễ chịu.",
            "Truyền đạt rõ ràng.",
            "Hướng dẫn sinh viên tốt.",
            "Giá trị học tập cao.",
            "Hiểu rõ nội dung trọng tâm.",
            "Tinh thần hỗ trợ tốt.",
            "Trình bày hợp lý.",
            "Dễ tiếp cận.",
            "Chú trọng chất lượng.",
            "Hiểu bài nhanh hơn.",
            "Phong cách chuyên nghiệp.",
            "Tạo được sự tin tưởng.",
            "Giảng dạy có hệ thống.",
            "Truyền đạt ổn định.",
            "Giúp học tập hiệu quả.",
            "Tác phong chuẩn mực.",
            "Thái độ tích cực.",
            "Dễ tiếp thu kiến thức.",
            "Bài giảng rõ ý.",
            "Nội dung phù hợp.",
            "Giảng viên tận tâm.",
            "Khả năng hướng dẫn tốt."
        ];


        const text2 = [
            "Nên tăng thêm ví dụ thực tế.",
            "Dành thêm thời gian giải đáp.",
            "Bổ sung bài tập minh họa.",
            "Tăng cường tương tác lớp học.",
            "Thảo luận nhóm nhiều hơn.",
            "Cung cấp thêm tài liệu tham khảo.",
            "Giảng chậm hơn ở phần khó.",
            "Liên hệ thực tế nhiều hơn.",
            "Thêm hình ảnh minh họa.",
            "Ôn tập cuối buổi học.",
            "Tăng trao đổi hai chiều.",
            "Bổ sung bài tập thực hành.",
            "Giải thích kỹ khái niệm khó.",
            "Tăng thời gian thảo luận.",
            "Đa dạng phương pháp giảng.",
            "Ví dụ gần gũi sinh viên hơn.",
            "Kiểm tra mức độ hiểu bài.",
            "Cung cấp slide sớm hơn.",
            "Hướng dẫn bài tập rõ hơn.",
            "Liên hệ kiến thức thực tế.",
            "Tổ chức thêm buổi ôn tập.",
            "Tạo cơ hội phát biểu.",
            "Nêu rõ mục tiêu bài học.",
            "Thêm ví dụ trực quan.",
            "Tăng trao đổi giảng viên – sinh viên.",
            "Phân bổ thời gian hợp lý.",
            "Tập trung phần trọng tâm.",
            "Dùng thêm công cụ hỗ trợ.",
            "Tổng kết nội dung cuối bài.",
            "Điều chỉnh tốc độ giảng.",
            "Bổ sung bài tập vận dụng.",
            "Tạo tình huống thảo luận.",
            "Khuyến khích đặt câu hỏi.",
            "Ví dụ cụ thể hơn.",
            "Đa dạng hình thức giảng.",
            "Giải thích kỹ phần khó.",
            "Tổ chức hoạt động tương tác.",
            "Chia nhỏ nội dung bài học.",
            "Hướng dẫn tự học nhiều hơn.",
            "Chia sẻ kinh nghiệm thực tế.",
            "Tăng trao đổi trong giờ.",
            "Giải thích ví dụ chi tiết.",
            "Thêm bài tập áp dụng.",
            "Trao đổi ngoài giờ học.",
            "Quan tâm phản hồi sinh viên.",
            "Liên hệ thực tiễn nhiều hơn.",
            "Đa dạng cách truyền đạt.",
            "Ví dụ theo từng nội dung.",
            "Tăng cơ hội thảo luận.",
            "Tăng phần ví dụ.",
            "Giải thích nội dung trọng tâm.",
            "Kiểm tra nhanh hiểu bài.",
            "Hỏi đáp nhiều hơn.",
            "Tóm tắt kiến thức cuối buổi.",
            "Thêm bài tập ngắn.",
            "Điều chỉnh tiến độ giảng.",
            "Tăng phần thực hành.",
            "Hướng dẫn bài tập chi tiết.",
            "Cung cấp tài liệu bổ trợ.",
            "Nhấn mạnh nội dung quan trọng.",
            "Giải thích thuật ngữ rõ hơn.",
            "Hướng dẫn chuẩn bị bài trước.",
            "Thêm hoạt động nhóm.",
            "Tăng thời gian hỏi đáp.",
            "Ôn tập trước kiểm tra.",
            "Hỗ trợ sinh viên ngoài giờ.",
            "Tăng tương tác trực tiếp.",
            "Làm rõ yêu cầu môn học.",
            "Tăng phần áp dụng thực tế.",
            "Giải thích lại phần khó hiểu.",
            "Chia nội dung rõ ràng hơn.",
            "Thêm ví dụ minh họa.",
            "Tăng hoạt động lớp học.",
            "Tạo động lực học tập.",
            "Giải thích kỹ lý thuyết.",
            "Tăng phần tổng hợp kiến thức.",
            "Tăng hướng dẫn thực hành.",
            "Khuyến khích sinh viên chủ động.",
            "Điều chỉnh cách giảng linh hoạt.",
            "Thêm bài tập về nhà.",
            "Tăng phần trao đổi nhóm.",
            "Tăng liên hệ nghề nghiệp.",
            "Làm rõ mối liên hệ bài học.",
            "Thêm buổi hướng dẫn.",
            "Giải thích rõ trọng tâm.",
            "Tăng ví dụ đời sống.",
            "Tăng phản hồi cho sinh viên.",
            "Hỗ trợ sinh viên kịp thời.",
            "Đa dạng hoạt động học tập.",
            "Tăng phần minh họa trực quan.",
            "Giảng kỹ hơn nội dung khó.",
            "Tạo không gian trao đổi.",
            "Hướng dẫn cách học hiệu quả.",
            "Tăng thời gian thực hành.",
            "Tăng ví dụ ứng dụng.",
            "Làm rõ tiêu chí đánh giá.",
            "Hướng dẫn chi tiết bài tập.",
            "Tăng trao đổi trên lớp.",
            "Giải thích rõ khái niệm.",
            "Thêm hoạt động trải nghiệm.",
            "Cải thiện tương tác lớp.",
            "Tăng phần luyện tập.",
            "Hỗ trợ sinh viên nhiều hơn.",
            "Tăng phần áp dụng kiến thức.",
            "Tổ chức ôn tập định kỳ.",
            "Tăng giải đáp thắc mắc.",
            "Nhìn chung nên phát huy ưu điểm."
        ];


        const rand = arr => arr[Math.floor(Math.random() * arr.length)];

        // --- CẢI TIẾN: SMART WAIT ---
        function waitFor(selector, timeout = 10000) {
            return new Promise((resolve, reject) => {
                // Kiểm tra ngay lập tức
                const el = document.querySelector(selector);
                if (el) return resolve(el);

                // Nếu chưa có, dùng MutationObserver để chờ
                const observer = new MutationObserver(() => {
                    const el = document.querySelector(selector);
                    if (el) {
                        observer.disconnect();
                        resolve(el);
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                // Timeout để tránh treo mãi mãi
                setTimeout(() => {
                    observer.disconnect();
                    // Nếu timeout, thử check lại lần cuối
                    const el = document.querySelector(selector);
                    if (el) resolve(el);
                    else reject(new Error(`Timeout waiting for ${selector}`));
                }, timeout);
            });
        }

        // Delay ngẫu nhiên nhỏ để giống người dùng (200ms - 500ms)
        const randomDelay = () => new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));


        function getState() {
            const state = localStorage.getItem(STATE_KEY);
            return state ? JSON.parse(state) : {
                currentIndex: 0,
                processedCount: 0,
                skippedCount: 0,
                errorCount: 0,
                mode: 'dashboard'
            };
        }

        function saveState(state) {
            localStorage.setItem(STATE_KEY, JSON.stringify(state));
        }

        function clearState() {
            localStorage.removeItem(STATE_KEY);
        }

        function detectPage() {
            // Trang xác nhận (có btnTiepTucDanhGia)
            if (document.getElementById('btnTiepTucDanhGia')) {
                return 'confirm';
            }
            // Trang form đánh giá (có radio buttons)
            if (document.querySelector('td input[id*="gv"][id*="_rd"]')) {
                return 'form';
            }
            // Trang dashboard (có danh sách môn học)
            if (document.getElementById('gvMonHoc_lbTinhTrang_0') || document.getElementById('gvMonHoc')) {
                return 'dashboard';
            }
            return 'unknown';
        }

        async function handleFormPage() {
            addLog("=== XỬ LÝ TRANG FORM ===", "info");

            try {
                // Chờ radio button xuất hiện (max 10s)
                addLog("Đang chờ form tải...", "info");
                await waitFor('td input[type="radio"]');
                await randomDelay(); // Delay nhẹ

                let count = 0;
                const allInputs = document.querySelectorAll('td input');

                let hasRd6 = false;
                allInputs.forEach(el => {
                    if (/^gv\d+_rd6_/.test(el.id)) hasRd6 = true;
                });

                const patternHighest = hasRd6 ? /^gv\d+_rd6_/ : /^gv\d+_rd5_/;
                const levelName = hasRd6 ? "6" : "5";

                allInputs.forEach(element => {
                    const id = element.id;
                    if (patternHighest.test(id)) {
                        element.checked = true;
                        // element.click(); // Click đôi khi gây postback sớm nếu không cẩn thận, check=true an toàn hơn với ASP.NET
                        count++;
                    }
                });

                addLog(`Đã chọn ${count} câu mức ${levelName}`, "success");

                const textareas = document.querySelectorAll('textarea');
                if (textareas.length >= 2) {
                    textareas[0].value = rand(text1);
                    textareas[0].dispatchEvent(new Event('input', { bubbles: true })); // Trigger event để JS trang web nhận biết
                    textareas[1].value = rand(text2);
                    textareas[1].dispatchEvent(new Event('input', { bubbles: true }));
                    addLog("Đã điền text", "success");
                }

                await randomDelay();

                // Tìm nút Tiếp Tục
                const btnTiepTuc = document.getElementById('btnTiepTuc');
                if (btnTiepTuc) {
                    addLog("Click btnTiepTuc...", "info");

                    // Lưu state
                    const state = getState();
                    state.mode = 'confirm';
                    saveState(state);

                    btnTiepTuc.click();
                    // KHÔNG wait nữa, để trang tự load
                } else {
                    addLog("Lỗi: Không tìm thấy nút Tiếp Tục", "error");
                }

            } catch (e) {
                addLog(`Lỗi Form: ${e.message}`, "error");
            }
        }

        // XỬ LÝ TRANG XÁC NHẬN
        async function handleConfirmPage() {
            addLog("=== XỬ LÝ TRANG XÁC NHẬN ===", "info");

            try {
                // Chờ nút xác nhận
                await waitFor('#btnTiepTucDanhGia');
                await randomDelay();

                const btn = document.getElementById('btnTiepTucDanhGia');
                addLog("Click Xác Nhận...", "info");

                const state = getState();
                state.currentIndex++;
                state.processedCount++;
                state.mode = 'dashboard';
                saveState(state);

                addLog(`Hoàn thành! Chuyển môn tiếp theo...`, "success");
                btn.click();
            } catch (e) {
                addLog(`Lỗi Xác Nhận: ${e.message}`, "error");
            }
        }

        async function handleDashboard() {
            const state = getState();
            addLog(`=== DASHBOARD - MÔN ${state.currentIndex} ===`, "info");

            try {
                // Chờ bảng môn học load
                await waitFor('#gvMonHoc'); // Chờ table chính
                await randomDelay();

                const statusLabel = document.getElementById(`gvMonHoc_lbTinhTrang_${state.currentIndex}`);

                if (!statusLabel) {
                    addLog("Đã hết môn học!", "success");
                    addLog(`Tổng kết: ${state.processedCount} Xong, ${state.skippedCount} Bỏ qua`, "info");
                    clearState();
                    return;
                }

                const statusText = statusLabel.textContent.trim();
                addLog(`Trạng thái Mon ${state.currentIndex}: ${statusText}`, "info");

                // Logic bỏ qua
                if (statusText.includes("Đã đánh giá") || statusText.includes("Finished")) {
                    addLog("-> Đã xong, bỏ qua.", "info");
                    state.currentIndex++;
                    state.skippedCount++;
                    saveState(state);
                    // Reload nhẹ hoặc gọi lại hàm (nhưng tốt nhất là reload để clear DOM cũ)
                    window.location.reload();
                    return;
                }

                if (statusText.includes("Chưa đánh giá") || statusText.includes("Not yet")) {
                    addLog("-> Chưa đánh giá. Vào form...", "info");

                    const selectPattern = `Select$${state.currentIndex}`;

                    // Set state trước khi chuyển
                    state.mode = 'form';
                    saveState(state);

                    if (typeof window.__doPostBack === 'function') {
                        window.__doPostBack('gvMonHoc', selectPattern);
                    } else {
                        // Fallback submit form
                        const form = document.querySelector('form');
                        if (form) {
                            let target = document.getElementById('__EVENTTARGET');
                            if (!target) {
                                target = document.createElement('input');
                                target.type = 'hidden';
                                target.name = '__EVENTTARGET';
                                form.appendChild(target);
                            }
                            target.value = 'gvMonHoc';

                            let arg = document.getElementById('__EVENTARGUMENT');
                            if (!arg) {
                                arg = document.createElement('input');
                                arg.type = 'hidden';
                                arg.name = '__EVENTARGUMENT';
                                form.appendChild(arg);
                            }
                            arg.value = selectPattern;

                            form.submit();
                        }
                    }
                }

            } catch (e) {
                addLog(`Lỗi Dashboard: ${e.message}`, "error");
                // Nếu lỗi quá lâu, có thể thử reload trang để reset
                // setTimeout(() => window.location.reload(), 5000);
            }
        }

        const currentPage = detectPage();

        if (currentPage === 'form') {
            addLog("Phát hiện: Form Đánh Giá", "info");
            handleFormPage();
        } else if (currentPage === 'confirm') {
            addLog("Phát hiện: Trang Xác Nhận", "info");
            handleConfirmPage();
        } else if (currentPage === 'dashboard') {
            addLog("Phát hiện: Dashboard", "info");
            handleDashboard();
        }
    }
})();
