// 프로필 사진 요소를 선택
const profilePhoto = document.querySelector(".profile-photo");
// const profilePhoto = document.getElementsByClassName("profile-photo")[0];

// 프로필 사진 클릭 이벤트 리스너 추가
profilePhoto.addEventListener("click", function() {
    // 다크 모드 토글
    if (document.body.className == "dark-mode") {
        document.body.className = '';
        return;
    }
    document.body.className = "dark-mode";
    // document.body.classList.toggle("dark-mode");
});

fetch("https://m.search.naver.com/p/csearch/content/apirender.nhn?where=nexearch&pkid=387&u2=20000518&q=%EC%83%9D%EB%85%84%EC%9B%94%EC%9D%BC+%EC%9A%B4%EC%84%B8&u1=m&u3=solar&u4=12&_=1719518803829")
    .then(response => response.json()) // 응답을 JSON으로 파싱
    .then(data => {
        const htmlString = data.flick[0]; // 첫 번째 항목 선택
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const fortune = doc.querySelector('dd b').textContent;
        const fortuneText = doc.querySelector('dd p').textContent;        
        console.log(fortune); // 추출한 텍스트 출력
        console.log(fortuneText); // 추출한 텍스트 출력

        const fortuneE = document.createElement("h3");
        fortuneE.style.margin = 0;
        fortuneE.textContent = fortune;
        const fortuneTextE = document.createElement("p");
        fortuneTextE.textContent = fortuneText;
        const fortuneSection = document.createElement("section");
        const sectionTitle = document.createElement("h2");
        sectionTitle.textContent = '오늘의 운세';
        fortuneSection.append(sectionTitle);
        fortuneSection.append(fortuneE);
        fortuneSection.append(fortuneTextE);

        const contactSection = document.querySelector(".contact");
        contactSection.before(fortuneSection);
    })
    .catch(error => {
        console.error('Error fetching data:', error); // 에러 처리
    })
    .finally( () =>{
        // 초기 섹션 설정
        initializeSections()
    });

function initializeSections() {
    const sections = document.querySelectorAll('.right section');

    let currentIndex = 0;  // 현재 표시 중인 섹션 인덱스

        // 다음 섹션을 표시하는 함수
    const showAfterSection = function() {
        sections.forEach((section) => section.style.display = 'none'); // 현재 섹션 숨기기
        if (currentIndex == (sections.length - 1)) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        sections[currentIndex].style.display = 'flex'; // 다음 섹션 표시
    };

    // 이전 섹션을 표시하는 함수
    const showBeforeSection = function() {
        sections.forEach((section) => section.style.display = 'none'); // 현재 섹션 숨기기
        if (currentIndex == 0) {
            currentIndex = sections.length - 1;
        } else {
            console.log(currentIndex)
            currentIndex--;
        }
        sections[currentIndex].style.display = 'flex'; // 이전 섹션 표시
    };

    // 3초마다 showAfterSection 함수를 호출하는 인터벌 설정
    let intervalId = setInterval(showAfterSection, 3000);

    // 인터벌을 리셋하는 함수
    const resetInterval = () => {
        clearInterval(intervalId); // 기존 인터벌 클리어
        intervalId = setInterval(showAfterSection, 3000); // 새 인터벌 설정
    };

    // 각 섹션에 클릭 이벤트 리스너 추가
    sections.forEach((section) => {
        // 각 섹션에 마우스 이동 이벤트 리스너 추가
    const iconContainer = document.querySelector(".icon-container");
    section.addEventListener('mousemove', function(event) {
        const sectionWidth = section.offsetWidth;
        const clickX = event.clientX - section.getBoundingClientRect().left;

        // 아이콘 표시 위치 설정
        iconContainer.style.top = `${event.clientY - 20}px`;
        iconContainer.style.left = `${event.clientX - 20}px`;

        // 마우스 위치에 따라 클래스명 변경
        if (clickX < sectionWidth / 3) {
            iconContainer.innerHTML = '<i class="fa-solid fa-backward-fast"></i>';
        } else if (clickX > sectionWidth * 2 / 3) {
            iconContainer.innerHTML = '<i class="fa-solid fa-forward-fast"></i>';
        } else {
            if (intervalId) {
                iconContainer.innerHTML = '<i class="fa-solid fa-pause"></i>';
            }else{
                iconContainer.innerHTML = '<i class="fa-solid fa-play"></i>'
            }
            // 삼항연산자
            //iconContainer.innerHTML = intervalId ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
        }
    });

    section.addEventListener('mouseleave', function() {
        // 마우스가 섹션을 떠날 때 아이콘 숨김
        iconContainer.innerHTML = '';
    });
    section.addEventListener('click', function(event) {
        const sectionWidth = section.offsetWidth;
        const clickX = event.clientX - section.getBoundingClientRect().left;

        if (clickX < sectionWidth / 3) { // 왼쪽 1/3 클릭 시 이전 섹션
            showBeforeSection();
            resetInterval();
        } else if (clickX > (sectionWidth * 2 / 3)) { // 오른쪽 1/3 클릭 시 다음 섹션
            showAfterSection();
            resetInterval();
        } else { // 중간 1/3 클릭 시 자동 넘김 토글
            if (intervalId) {
                clearInterval(intervalId); // 자동 넘김 중지
                intervalId = null;
            } else {
                intervalId = setInterval(showAfterSection, 3000); // 자동 넘김 재개
            }
        }
    });
})};

