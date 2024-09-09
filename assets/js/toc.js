document.addEventListener("DOMContentLoaded", function () {
  const toc = document.querySelector(".post__toc ol");
  if (!toc) return;

  // h2부터 h6까지 태그를 찾음
  const headers = document.querySelectorAll(".article-post h2, .article-post h3, .article-post h4, .article-post h5, .article-post h6");
  let currentLevel = 2; // 기본 헤딩 레벨 (h2)
  let currentList = toc; // 현재 리스트 (최상위)

  headers.forEach((header, index) => {
    const id = `heading-${index + 1}`;
    header.id = id;

    const level = parseInt(header.tagName.charAt(1)); // 헤딩 레벨 (2, 3, 4, 5, 6)

    // 현재 헤딩 레벨이 더 크면, 하위 리스트를 만들어야 함
    if (level > currentLevel) {
      const newList = document.createElement("ol");
      currentList.lastElementChild.appendChild(newList); // 마지막 항목에 새로운 리스트 추가
      currentList = newList;
    }
    // 현재 헤딩 레벨이 작아지면, 상위 리스트로 돌아감
    else if (level < currentLevel) {
      for (let i = currentLevel; i > level; i--) {
        currentList = currentList.parentElement.closest("ol");
      }
    }

    currentLevel = level; // 현재 레벨을 업데이트

    // TOC 항목 생성
    const tocItem = document.createElement("li");
    const tocLink = document.createElement("a");
    tocLink.href = `#${id}`;
    tocLink.textContent = header.textContent;

    tocLink.addEventListener("click", function (event) {
      event.preventDefault();
      
      const headerOffset = 100; // 고정된 헤더의 높이(px), 필요에 따라 조정
      const elementPosition = header.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    });

    tocItem.appendChild(tocLink);
    currentList.appendChild(tocItem);
  });
});
