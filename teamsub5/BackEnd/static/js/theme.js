/**
 * 1. 이메일 도메인 자동 입력 함수
 */
function updateEmailDomain(selectElement) {
    const block = selectElement.closest('.person-block'); /* 가장 가까운 부모 블록 안에서만 그러니깐 해당 학생 입력 칸 안에서만 적용 */
    const domainInput = block.querySelector('.domain-input'); /* 도메인 입력칸 선정 */
    
    if (selectElement.value === "custom") {
        domainInput.value = "";
        domainInput.readOnly = false;
        domainInput.focus();    /* custom을 선택하면 readonly를 풀어주고 값을 없애주며 거기로 커서 설정해줌 */
    } else {
        domainInput.value = selectElement.value;
        domainInput.readOnly = true;    /* 아니면 선택한 주소를 입력칸에 넣어주고 다시 readonly로 잠금 */
    }
}

/**
 * 2. 팀원 추가 함수 (기술 스택 로고 포함)
 */
function addPerson() {
    const container = document.getElementById("personContainer");
    if (!container) return;

    const personBlock = document.createElement("div");
    personBlock.className = "person-block";
    
    // 기술 스택 데이터 (무료 아이콘 사이트인 Simple Icons 등을 활용 가능)
    const techStacks = [
        { name: "C++", color: "#00599C" },
        { name: "Python", color: "#3776AB" },
        { name: "Linux", color: "#FCC624" },
        { name: "Git", color: "#F05032" },
        { name: "Security", color: "#FF0000" }
    ];

    let techHtml = techStacks.map(tech => `
        <label class="tech-chip">
            <input type="checkbox" name="tech_stack[]" value="${tech.name}" style="display:none;">
            <span class="tech-label" style="--tech-color: ${tech.color}">${tech.name}</span>
        </label>
    `).join("");

    personBlock.innerHTML = `
        <p>이름: <input type="text" name="name[]" required></p>
        <p>학과: <input type="text" name="Department[]" required></p>
        <p>학번: <input type="text" name="StudentNumber[]" required></p>
        <p>전화번호: <input type="text" name="phone[]" placeholder="010-1234-5678"></p>
        
        <p>이메일:</p>
        <div class="email-container">
            <input type="text" name="mail_id[]" placeholder="아이디" class="email-id" required>
            <span class="at-sign">@</span>
            <input type="text" name="mail_domain[]" placeholder="도메인" class="domain-input" readonly required>
            <select class="domain-select" onchange="updateEmailDomain(this)">
                <option value="" disabled selected>선택하세요</option>
                <option value="gmail.com">gmail.com</option>
                <option value="naver.com">naver.com</option>
                <option value="outlook.com">outlook.com</option>
                <option value="custom">직접 입력</option>
            </select>
        </div>

        <div class="tech-section">
            <p style="font-weight:bold; margin-bottom: 10px;">🛠 기술 스택</p>
            <div class="tech-grid">${techHtml}</div>
        </div>
    `;
    
    container.appendChild(personBlock);
}
function goBack() {
    if (confirm("입력 중인 정보가 사라질 수 있습니다. 메인 화면으로 돌아가시겠습니까?")) {
        location.href = '/';
    }
}

function toggleEtcInput(checkbox) {
    // 체크박스가 포함된 tech-section 내에서 etc-input-container를 찾음
    const container = checkbox.closest('.tech-section').querySelector('.etc-input-container');
    if (checkbox.checked) {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
        container.querySelector('input').value = ''; // 체크 해제 시 내용 초기화
    }
}