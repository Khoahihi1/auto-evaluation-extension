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
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
            if (document.getElementById('gvMonHoc_lbTinhTrang_0')) {
                return 'dashboard';
            }
            return 'unknown';
        }

        async function handleFormPage() {
            addLog("=== XỬ LÝ TRANG FORM ===", "info");

            await delay(1500);

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
                    element.click();
                    count++;
                }
            });

            addLog(`Đã chọn ${count} câu mức ${levelName}`, "success");

            const textareas = document.querySelectorAll('textarea');
            if (textareas.length >= 2) {
                textareas[0].value = rand(text1);
                textareas[0].dispatchEvent(new Event('input', { bubbles: true }));
                textareas[1].value = rand(text2);
                textareas[1].dispatchEvent(new Event('input', { bubbles: true }));
                addLog("Đã điền text", "success");
            }

            await delay(1500);

            const btnTiepTuc = document.getElementById('btnTiepTuc');
            if (btnTiepTuc) {
                addLog("Click btnTiepTuc (chuyển sang trang xác nhận)", "info");

                // Lưu state trước khi chuyển trang
                const state = getState();
                state.mode = 'confirm';
                saveState(state);

                btnTiepTuc.click();
                // Sau khi click, sẽ chuyển sang trang xác nhận
            } else {
                addLog("KHÔNG tìm thấy btnTiepTuc!", "error");
            }
        }

        // XỬ LÝ TRANG XÁC NHẬN (có btnTiepTucDanhGia)
        async function handleConfirmPage() {
            addLog("=== XỬ LÝ TRANG XÁC NHẬN ===", "info");

            await delay(1500);

            const btnTiepTucDanhGia = document.getElementById('btnTiepTucDanhGia');
            if (btnTiepTucDanhGia) {
                addLog("Click btnTiepTucDanhGia (quay về Dashboard)", "info");

                // Cập nhật state trước khi quay về dashboard
                const state = getState();
                state.currentIndex++;
                state.processedCount++;
                state.mode = 'dashboard';
                saveState(state);

                addLog(`Hoàn thành môn! Tiếp tục môn ${state.currentIndex}`, "success");
                btnTiepTucDanhGia.click();
                // Sau khi click, sẽ quay về Dashboard
            } else {
                addLog("KHÔNG tìm thấy btnTiepTucDanhGia!", "error");
            }
        }

        async function handleDashboard() {
            const state = getState();
            addLog(`=== DASHBOARD - MÔN ${state.currentIndex} ===`, "info");

            await delay(1500);

            const statusLabel = document.getElementById(`gvMonHoc_lbTinhTrang_${state.currentIndex}`);

            if (!statusLabel) {
                addLog("KẾT THÚC - Không còn môn học!", "success");
                addLog(`Đã đánh giá: ${state.processedCount}, Bỏ qua: ${state.skippedCount}`, "info");
                clearState();
                return;
            }

            const statusText = statusLabel.textContent.trim();
            addLog(`Trạng thái: ${statusText}`, "info");

            if (statusText.includes("Đã đánh giá") || statusText.includes("Finished")) {
                addLog("Bỏ qua môn này", "info");
                state.currentIndex++;
                state.skippedCount++;
                saveState(state);
                await delay(500);
                handleDashboard();
                return;
            }

            if (statusText.includes("Chưa đánh giá") || statusText.includes("Not yet")) {
                addLog("Cần đánh giá", "info");

                const selectPattern = `Select$${state.currentIndex}`;

                addLog("Trigger __doPostBack...", "info");

                // Cách 1: Gọi __doPostBack trực tiếp (nếu có)
                if (typeof window.__doPostBack === 'function') {
                    state.mode = 'form';
                    saveState(state);

                    addLog("Gọi __doPostBack('gvMonHoc', 'Select$" + state.currentIndex + "')", "info");
                    window.__doPostBack('gvMonHoc', selectPattern);
                } else {
                    // Cách 2: Submit form với __EVENTTARGET và __EVENTARGUMENT
                    const form = document.querySelector('form');
                    if (form) {
                        let eventTarget = document.getElementById('__EVENTTARGET');
                        let eventArgument = document.getElementById('__EVENTARGUMENT');

                        if (!eventTarget) {
                            eventTarget = document.createElement('input');
                            eventTarget.type = 'hidden';
                            eventTarget.id = '__EVENTTARGET';
                            eventTarget.name = '__EVENTTARGET';
                            form.appendChild(eventTarget);
                        }

                        if (!eventArgument) {
                            eventArgument = document.createElement('input');
                            eventArgument.type = 'hidden';
                            eventArgument.id = '__EVENTARGUMENT';
                            eventArgument.name = '__EVENTARGUMENT';
                            form.appendChild(eventArgument);
                        }

                        state.mode = 'form';
                        saveState(state);

                        eventTarget.value = 'gvMonHoc';
                        eventArgument.value = selectPattern;

                        addLog("Submit form với __EVENTTARGET='gvMonHoc', __EVENTARGUMENT='" + selectPattern + "'", "info");
                        form.submit();
                    } else {
                        addLog("Không tìm thấy form để submit!", "error");
                        state.currentIndex++;
                        state.errorCount++;
                        saveState(state);
                    }
                }
            }
        }

        const currentPage = detectPage();

        if (currentPage === 'form') {
            addLog("Phát hiện trang FORM - Bắt đầu...", "info");
            handleFormPage();
        } else if (currentPage === 'confirm') {
            addLog("Phát hiện trang XÁC NHẬN - Bắt đầu...", "info");
            handleConfirmPage();
        } else if (currentPage === 'dashboard') {
            addLog("Phát hiện trang DASHBOARD - Bắt đầu...", "info");
            handleDashboard();
        }
    }
})();
