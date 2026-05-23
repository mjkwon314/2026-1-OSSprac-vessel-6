/**
 * 공통 기능
 * - 다크모드 상태 localStorage 저장
 * - 팀원 검색/기술스택 필터
 * - 입력 폼 동적 추가/삭제
 * - 이메일 도메인 자동 입력
 */

document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initMemberSearchAndFilter();
    initFormValidationMessage();
});

function initDarkMode() {
    const toggleBtn = document.getElementById('dark-mode-toggle');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    updateDarkButton(toggleBtn);

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateDarkButton(toggleBtn);
        });
    }
}

function updateDarkButton(toggleBtn) {
    if (!toggleBtn) return;

    const isDark = document.body.classList.contains('dark-mode');
    const icon = toggleBtn.querySelector('i');
    const label = toggleBtn.querySelector('span');

    if (label) label.textContent = isDark ? 'Light' : 'Dark';
    if (icon) icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

function initMemberSearchAndFilter() {
    const searchInput = document.getElementById('memberSearchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (searchInput) {
        searchInput.addEventListener('input', applyMemberFilters);
    }

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            filterButtons.forEach((btn) => btn.classList.remove('active'));
            button.classList.add('active');
            applyMemberFilters();
        });
    });

    applyMemberFilters();
}

function applyMemberFilters() {
    const cards = document.querySelectorAll('[data-member-card]');
    const searchInput = document.getElementById('memberSearchInput');
    const activeButton = document.querySelector('.filter-btn.active');
    const emptyMessage = document.getElementById('emptyMessage');

    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const selectedTech = activeButton ? activeButton.dataset.filter.toLowerCase() : 'all';
    let visibleCount = 0;

    cards.forEach((card) => {
        const cardText = card.innerText.toLowerCase();
        const techs = (card.dataset.tech || '').toLowerCase();

        const matchesKeyword = keyword === '' || cardText.includes(keyword);
        const matchesTech = selectedTech === 'all' || techs.includes(selectedTech);
        const shouldShow = matchesKeyword && matchesTech;

        card.classList.toggle('hidden-card', !shouldShow);
        if (shouldShow) visibleCount += 1;
    });

    if (emptyMessage) {
        emptyMessage.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

function initFormValidationMessage() {
    const form = document.getElementById('studentForm');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        if (!form.checkValidity()) {
            event.preventDefault();
            alert('입력 형식을 확인해 주세요. 예: 전화번호 010-1234-5678, 학번은 숫자만 입력');
            form.reportValidity();
        }
    });
}

/**
 * 이메일 도메인 자동 입력 함수
 */
function updateEmailDomain(selectElement) {
    const block = selectElement.closest('.person-block');
    const domainInput = block.querySelector('.domain-input');

    if (selectElement.value === 'custom') {
        domainInput.value = '';
        domainInput.readOnly = false;
        domainInput.placeholder = '직접 입력 예: example.com';
        domainInput.focus();
    } else {
        domainInput.value = selectElement.value;
        domainInput.readOnly = true;
    }
}

/**
 * 팀원 입력 블록 추가 함수
 */
function addPerson() {
    const container = document.getElementById('personContainer');
    if (!container) return;

    const personCount = container.getElementsByClassName('person-block').length;
    const personBlock = document.createElement('div');
    personBlock.className = 'person-block';

    const techStacks = [
        { name: 'C++', color: '#00599C' },
        { name: 'Python', color: '#3776AB' },
        { name: 'Linux', color: '#FCC624' },
        { name: 'Git', color: '#F05032' },
        { name: 'Security', color: '#FF0000' },
        { name: 'JAVA', color: '#f89820' },
        { name: 'Flask', color: '#111111' }
    ];

    let techHtml = techStacks.map((tech) => `
        <label class="tech-chip">
            <input type="checkbox" name="tech_stack[${personCount}][]" value="${tech.name}" style="display:none;">
            <span class="tech-label" style="--tech-color: ${tech.color}">${tech.name}</span>
        </label>
    `).join('');

    techHtml += `
        <label class="tech-chip">
            <input type="checkbox" name="tech_stack[${personCount}][]" value="etc" style="display:none;" onchange="toggleEtcInput(this)">
            <span class="tech-label" style="--tech-color: #607d8b">기타</span>
        </label>
    `;

    personBlock.innerHTML = `
        <button type="button" class="btn-remove" onclick="removePerson(this)">삭제 ×</button>

        <p>이름: <input type="text" name="name[]" placeholder="홍길동" required minlength="2"></p>
        <p class="help-text">이름은 2글자 이상 입력합니다.</p>

        <p>학과: <input type="text" name="Department[]" placeholder="예: 통계학과" required></p>

        <p>학번: <input type="text" name="StudentNumber[]" placeholder="숫자만 입력" pattern="[0-9]+" required></p>
        <p class="help-text">학번은 숫자만 입력합니다.</p>

        <p>전화번호: <input type="text" name="phone[]" placeholder="010-1234-5678" pattern="010-[0-9]{4}-[0-9]{4}" required></p>
        <p class="help-text">전화번호 형식: 010-1234-5678</p>

        <p>이메일:</p>
        <div class="email-container">
            <input type="text" name="mail_id[]" placeholder="아이디" class="email-id" required>
            <span class="at-sign">@</span>
            <input type="text" name="mail_domain[]" placeholder="도메인" class="domain-input" readonly required>
            <select class="domain-select" onchange="updateEmailDomain(this)" required>
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

            <div class="etc-input-container" style="display:none; margin-top:10px;">
                <input type="text" name="etc_stack[${personCount}]" placeholder="기타 기술 스택 입력, 쉼표로 구분">
            </div>
        </div>
    `;

    container.appendChild(personBlock);
}

function removePerson(button) {
    if (confirm('이 팀원 입력 창을 삭제하시겠습니까?')) {
        const personBlock = button.closest('.person-block');
        personBlock.remove();
        reindexTechStacks();
    }
}

function goBack() {
    if (confirm('입력 중인 정보가 사라질 수 있습니다. 메인 화면으로 돌아가시겠습니까?')) {
        location.href = '/';
    }
}

function toggleEtcInput(checkbox) {
    const techSection = checkbox.closest('.tech-section');
    const container = techSection.querySelector('.etc-input-container');
    const input = container.querySelector('input');

    if (checkbox.checked) {
        container.style.display = 'block';
        input.focus();
    } else {
        container.style.display = 'none';
        input.value = '';
    }
}

function reindexTechStacks() {
    const container = document.getElementById('personContainer');
    const blocks = container.getElementsByClassName('person-block');

    for (let i = 0; i < blocks.length; i++) {
        const checkboxes = blocks[i].querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((cb) => {
            cb.name = `tech_stack[${i}][]`;
        });

        const etcInput = blocks[i].querySelector('.etc-input-container input');
        if (etcInput) {
            etcInput.name = `etc_stack[${i}]`;
        }
    }
}

// ===============================
// 공통 다크모드 + 현재 페이지 표시
// ===============================

document.addEventListener("DOMContentLoaded", function () {
    const darkToggle = document.getElementById("globalDarkToggle");
    const darkIcon = darkToggle ? darkToggle.querySelector("i") : null;
    const darkText = darkToggle ? darkToggle.querySelector("span") : null;

    // 저장된 다크모드 상태 적용
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        if (darkIcon) darkIcon.className = "fa-solid fa-sun";
        if (darkText) darkText.textContent = "Light";
    }

    // 다크모드 버튼 이벤트
    if (darkToggle) {
        darkToggle.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");

            const isDark = document.body.classList.contains("dark-mode");

            localStorage.setItem("theme", isDark ? "dark" : "light");

            if (darkIcon) {
                darkIcon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
            }

            if (darkText) {
                darkText.textContent = isDark ? "Light" : "Dark";
            }
        });
    }

    // 현재 페이지 nav active 처리
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".site-nav-menu .nav-link");

    navLinks.forEach(link => {
        const href = link.getAttribute("href");

        if (href === currentPath) {
            link.classList.add("active");
        }

        if (currentPath === "/" && href === "/") {
            link.classList.add("active");
        }
    });
});