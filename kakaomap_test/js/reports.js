document.addEventListener('DOMContentLoaded', function() {
    const placeId = new URLSearchParams(window.location.search).get('id');

    function setupModalEventListeners(modal) {
    
        modal.querySelector('.close').addEventListener('click', function() {
            modal.style.display = 'none';
        });

        var closeFooterButton = modal.querySelector('.report_container_footer_left');
        if (closeFooterButton) {
            closeFooterButton.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }


        // '제출하기' 버튼에 대한 이벤트 리스너 설정
        var submitButton = modal.querySelector('.report_container_footer_right');
        if (submitButton) {
            submitButton.addEventListener('click', function() {
                var formData = new FormData();
                
                // 라디오 버튼 입력 처리
                var radioInputs = modal.querySelectorAll('input[type="radio"]:checked');
                radioInputs.forEach(function(input) {
                    formData.append(input.name, input.value);
                });
                
                // 텍스트 입력 처리
                var textInputs = modal.querySelectorAll('input[type="text"]');
                textInputs.forEach(function(input) {
                    formData.append(input.name, input.value);
                });

                // 서버로 폼 데이터 전송
                console.log('Submitting form data:', Object.fromEntries(formData.entries()));
                fetch('/submit-report', { // '/submit-report'는 예시 URL입니다. 실제 서버의 엔드포인트를 사용하세요.
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok (${response.statusText})`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Server response:', data);
                })
                .catch(error => {
                    console.error('Submission error:', error);
                });

                modal.style.display = 'none'; // 폼 전송 후 모달 닫기
            });
        }
    }

    // 모달 외부 클릭 시 모달 닫기 이벤트 리스너
    window.onclick = function(event) {
        var modal = document.getElementById('reportModal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // 각 보고서 항목 클릭 시 모달 로드 및 이벤트 리스너 설정
    document.querySelectorAll('.body_content_submit').forEach(item => {
        item.addEventListener('click', function() {
            const reportPage = this.getAttribute('data-target');
            fetch(reportPage)
                .then(response => response.text())
                .then(html => {
                    var modal = document.getElementById('reportModal');
                    var modalContent = document.getElementById('reportModalContent');
                    modalContent.innerHTML = html;
                    setupModalEventListeners(modal);
                    modal.style.display = 'block';
                })
                .catch(error => {
                    console.error('Error loading modal content:', error);
                });
        });
    });
});