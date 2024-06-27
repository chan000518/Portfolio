const profilePhoto = document.getElementsByClassName("profile-photo")[0];

profilePhoto.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
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

        const fortuneE =  document.createElement("h3")
        fortuneE.style.margin = 0
        fortuneE.textContent = fortune
        const fortuneTextE =  document.createElement("p")
        fortuneTextE.textContent = fortuneText
        const fortuneSection =  document.createElement("section")
        const sectionTitle = document.createElement("h2");
        sectionTitle.textContent = '오늘의 운세';
        // append : 자식중 가장 마지막에 삽입
        fortuneSection.append(sectionTitle);
        fortuneSection.append(fortuneE)
        fortuneSection.append(fortuneTextE)
        
        // after, before는 앞뒤 즉 형제가 되는겁니다.
        const contactSection = document.querySelector(".contact");
        contactSection.before(fortuneSection);

        // 이 친구도 이벤트 등록 시켜줘야지
                
        let currentIndex = 0;
        const sections = document.querySelectorAll('.right section');

        const showNextSection = function(){
            sections[currentIndex].style.display = 'none';
            if(currentIndex == (sections.length - 1)){
                currentIndex = 0
            }
            else{
                currentIndex ++ 
            }
            // currentIndex = (currentIndex + 1) % sections.length;
            sections[currentIndex].style.display = 'flex';
        }

        let intervalId = setInterval(() => { showNextSection() }, 3000);

        sections.forEach((section, index) => {
            section.addEventListener('click', function(event) {
                const sectionWidth = section.offsetWidth;
                const clickX = event.clientX - section.getBoundingClientRect().left;

                if (clickX < sectionWidth / 2) {
                    if(index != 0){
                        section.style.display = 'none';
                        sections[index - 1].style.display = 'flex';
                        currentIndex = index - 1;
                    }
                } else {
                    if(index != (sections.length - 1)){
                        section.style.display = 'none';
                        sections[index + 1].style.display = 'flex';
                        currentIndex = index + 1;
                    }
                }
                clearInterval(intervalId);
                intervalId = setInterval(() => { showNextSection() }, 3000);
            });
        });
    })
