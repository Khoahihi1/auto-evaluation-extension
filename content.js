// Content Script - Tự động chạy trên mọi trang
(function () {
    'use strict';

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
            "Kiến thức chuyên môn sâu rộng, truyền đạt rất chi tiết và dễ hiểu. Giảng viên luôn nhiệt tình giải đáp thắc mắc của sinh viên.",
            "Phương pháp giảng dạy rất hiệu quả, kết hợp lý thuyết với thực hành giúp sinh viên nắm bắt kiến thức tốt hơn.",
            "Có khả năng truyền cảm hứng học tập rất tốt, luôn khuyến khích sinh viên tư duy sáng tạo và tự tin phát biểu ý kiến.",
            "Rất nhiệt tình trong giảng dạy, luôn tạo không khí học tập thoải mái và thu hút sự chú ý của sinh viên.",
            "Kiến thức được chia sẻ rất ứng dụng thực tế, giúp sinh viên có thể áp dụng vào công việc sau này.",
            "Phong cách giảng dạy lôi cuốn, dễ hiểu, luôn cập nhật kiến thức mới trong lĩnh vực chuyên môn.",
            "Luôn tận tâm hướng dẫn sinh viên, sẵn sàng giải đáp mọi thắc mắc và hỗ trợ sinh viên trong quá trình học tập.",
            "Cách truyền đạt sinh động, kết hợp nhiều ví dụ thực tế giúp sinh viên dễ dàng tiếp thu kiến thức.",
            "Khả năng quản lý lớp học tốt, tạo môi trường học tập tích cực và khuyến khích sự tương tác giữa sinh viên.",
            "Nội dung giảng dạy được chuẩn bị kỹ lưỡng, có hệ thống và logic, giúp sinh viên nắm bắt kiến thức một cách toàn diện.",
            "Luôn cập nhật các xu hướng mới trong ngành, giúp sinh viên có cái nhìn thực tế về môn học.",
            "Chiều sâu chuyên môn ấn tượng, giải thích các vấn đề phức tạp một cách dễ hiểu và logic.",
            "Phương pháp dạy học tương tác giúp sinh viên chủ động hơn trong việc học tập và nghiên cứu.",
            "Rất tâm huyết với công việc, luôn quan tâm đến sự tiến bộ của từng sinh viên trong lớp.",
            "Cách tiếp cận thực tế giúp sinh viên hiểu rõ ứng dụng của kiến thức trong công việc thực tế.",
            "Giảng viên có khả năng tạo động lực học tập mạnh mẽ, khuyến khích sinh viên vượt qua thử thách.",
            "Tài liệu giảng dạy phong phú và chi tiết, hỗ trợ tốt cho việc tự học của sinh viên.",
            "Luôn sẵn sàng lắng nghe ý kiến và phản hồi của sinh viên để cải thiện chất lượng giảng dạy.",
            "Có khả năng kết nối kiến thức lý thuyết với các tình huống thực tế trong công việc một cách hiệu quả.",
            "Giảng dạy có trọng tâm rõ ràng, giúp sinh viên dễ dàng nắm bắt những kiến thức quan trọng nhất.",
            "Phương pháp đánh giá công bằng và minh bạch, giúp sinh viên hiểu rõ năng lực của mình.",
            "Khả năng làm rõ các khái niệm khó, giúp sinh viên không còn cảm thấy khó khăn khi tiếp cận môn học.",
            "Tích cực khuyến khích thảo luận và tranh luận trong lớp, tạo không khí học tập sôi nổi.",
            "Có tầm nhìn rộng về ngành nghề, giúp sinh viên định hướng được con đường phát triển nghề nghiệp.",
            "Rất quan tâm đến việc áp dụng công nghệ mới vào giảng dạy, làm cho bài học trở nên hiện đại hơn.",
            "Sử dụng nhiều phương pháp giảng dạy khác nhau, phù hợp với đặc điểm của từng nhóm sinh viên.",
            "Luôn tạo cơ hội cho sinh viên được thực hành và trải nghiệm thực tế trong môn học.",
            "Có khả năng kết nối các phần kiến thức với nhau một cách mạch lạc, giúp sinh viên hình dung bức tranh tổng thể.",
            "Rất kiên nhẫn trong việc giải đáp thắc mắc, không bao giờ tỏ ra mệt mỏi hoặc khó chịu.",
            "Giảng dạy đầy đam mê, truyền được năng lượng tích cực đến toàn thể lớp học.",
            "Feedback chi tiết và xây dựng giúp sinh viên nhận ra điểm mạnh và điểm cần cải thiện.",
            "Luôn khuyến khích sinh viên tìm tòi, nghiên cứu và phát triển tư duy phản biện.",
            "Có kỹ năng giao tiếp tuyệt vời, dễ tiếp cận và thân thiện với sinh viên.",
            "Tạo nhiều cơ hội cho sinh viên làm việc nhóm, phát triển kỹ năng làm việc team.",
            "Nội dung bài giảng được thiết kế logic và khoa học, dễ theo dõi và ghi nhớ.",
            "Luôn cập nhật kiến thức mới nhất từ các nghiên cứu và xu hướng phát triển của ngành.",
            "Có nhiều kinh nghiệm thực tế và chia sẻ những bài học quý báu từ thực tiễn công việc.",
            "Giảng viên tôn trọng ý kiến của sinh viên và tạo môi trường học tập dân chủ.",
            "Sử dụng công nghệ và các công cụ hỗ trợ giảng dạy một cách hiệu quả và sáng tạo.",
            "Có khả năng điều chỉnh tốc độ và phương pháp giảng dạy phù hợp với mức độ tiếp thu của lớp.",
            "Rất chuyên nghiệp trong công việc, luôn đúng giờ và chuẩn bị kỹ lưỡng cho mỗi buổi học.",
            "Khuyến khích sinh viên đặt câu hỏi và tham gia tích cực vào quá trình học tập.",
            "Có khả năng kết nối môn học với các môn khác, giúp sinh viên thấy được mối liên hệ giữa các kiến thức.",
            "Tạo ra nhiều hoạt động thú vị và sáng tạo trong lớp học, giúp sinh viên học mà không cảm thấy nhàm chán.",
            "Đánh giá khách quan và công bằng, giúp sinh viên tin tưởng vào kết quả học tập của mình."
        ];

        const text2 = [
            "Mong có thể bổ sung thêm các bài tập thực hành để sinh viên có cơ hội áp dụng kiến thức nhiều hơn.",
            "Nếu có thể chia sẻ thêm tài liệu tham khảo và các case study thực tế sẽ giúp sinh viên hiểu sâu hơn về môn học.",
            "Nghĩ việc tổ chức thêm các buổi thảo luận nhóm sẽ giúp sinh viên trao đổi và học hỏi lẫn nhau tốt hơn.",
            "Có thể cân nhắc việc giảm tốc độ giảng một chút để sinh viên có thời gian ghi chép và tiếp thu kiến thức đầy đủ hơn.",
            "Mong có thể cung cấp thêm ví dụ minh họa cho các khái niệm lý thuyết phức tạp.",
            "Nếu có thể, nên tăng cường thời gian thực hành và làm bài tập trên lớp để sinh viên nắm vững kiến thức hơn.",
            "Đề xuất có thể mời các chuyên gia trong ngành đến chia sẻ kinh nghiệm thực tế cho sinh viên.",
            "Mong có thể cập nhật thêm các công nghệ và xu hướng mới nhất trong lĩnh vực này.",
            "Nghĩ nếu có thể tạo thêm các hoạt động tương tác trong lớp sẽ giúp bài học thú vị và sinh động hơn.",
            "Đề xuất có thể tổ chức thêm các buổi tư vấn cá nhân để hỗ trợ sinh viên gặp khó khăn trong học tập.",
            "Mong giảng viên có thể cung cấp thêm feedback chi tiết cho các bài tập và bài kiểm tra của sinh viên.",
            "Nếu được, nên bổ sung thêm các video hướng dẫn hoặc tài liệu đa phương tiện để hỗ trợ việc học.",
            "Đề nghị có thể dành nhiều thời gian hơn cho phần thực hành và giải bài tập mẫu trên lớp.",
            "Mong có thể tạo thêm cơ hội cho sinh viên tham gia các dự án thực tế liên quan đến môn học.",
            "Không có ý kiến gì thêm, hoàn toàn hài lòng với phương pháp giảng dạy hiện tại.",
            "Có thể tổ chức thêm các cuộc thi hoặc hackathon để sinh viên rèn luyện kỹ năng thực hành.",
            "Đề xuất cung cấp thêm các bài đọc bổ sung và nghiên cứu điển hình trong lĩnh vực.",
            "Mong có thêm các buổi lab thực hành để sinh viên được tiếp cận với công cụ và thiết bị thực tế.",
            "Nên có thêm các bài quiz ngắn sau mỗi chương để sinh viên tự đánh giá mức độ hiểu bài.",
            "Đề xuất tạo group học tập online để sinh viên có thể trao đổi và hỗ trợ nhau ngoài giờ lên lớp.",
            "Mong có thể chia sẻ thêm các link tài liệu, video tutorial hữu ích liên quan đến bài học.",
            "Có thể tổ chức thêm các buổi seminar với các diễn giả là những người đang làm việc trong ngành.",
            "Đề nghị giảng viên có thể cung cấp outline chi tiết cho mỗi buổi học để sinh viên chuẩn bị tốt hơn.",
            "Mong có thêm thời gian để sinh viên thuyết trình và chia sẻ những gì đã học được.",
            "Nên có hệ thống đánh giá thường xuyên hơn để sinh viên nắm rõ tiến độ học tập của mình.",
            "Đề xuất tạo repository chung để chia sẻ code, tài liệu và bài tập giữa các sinh viên.",
            "Mong có thể giới thiệu thêm các công cụ và phần mềm mới đang được sử dụng phổ biến trong thực tế.",
            "Có thể tạo thêm các mini project để sinh viên áp dụng toàn bộ kiến thức đã học.",
            "Đề nghị cung cấp thêm các ví dụ về các dự án thành công từ sinh viên các khóa trước.",
            "Mong có thêm các buổi ôn tập trước khi thi hoặc làm bài kiểm tra lớn.",
            "Nên bổ sung thêm các bài tập có độ khó tăng dần để sinh viên thử thách bản thân.",
            "Đề xuất tổ chức các workshop về các kỹ năng mềm cần thiết trong ngành nghề.",
            "Mong giảng viên có thể chia sẻ kinh nghiệm về cách tìm kiếm việc làm và phát triển sự nghiệp.",
            "Có thể tạo thêm cơ hội cho sinh viên networking với các chuyên gia và doanh nghiệp.",
            "Đề nghị cung cấp thêm tài nguyên học tập offline để sinh viên có thể học mọi lúc mọi nơi.",
            "Mong có hệ thống Q&A trực tuyến để sinh viên có thể đặt câu hỏi bất cứ lúc nào.",
            "Nên có thêm các buổi coding session cùng nhau để học hỏi cách giải quyết vấn đề.",
            "Đề xuất tổ chức peer review để sinh viên học cách đánh giá và nhận xét công việc của nhau.",
            "Mong có thể cập nhật thêm các best practices và coding standards trong ngành.",
            "Có thể chia nhỏ các project lớn thành nhiều milestone để dễ quản lý và theo dõi tiến độ.",
            "Đề nghị cung cấp thêm các template và boilerplate code để sinh viên có điểm khởi đầu tốt hơn.",
            "Mong có thêm các session về debugging và troubleshooting skills.",
            "Nên tổ chức code review sessions để sinh viên học cách viết code sạch và hiệu quả hơn.",
            "Đề xuất có thêm các bài tập mở để khuyến khích tư duy sáng tạo và giải pháp đa dạng.",
            "Mong có thể chia sẻ thêm về các xu hướng nghề nghiệp và cơ hội việc làm trong tương lai."
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
