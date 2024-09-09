function filterCategories() {
  const input = document.getElementById('search-input').value.toLowerCase();
  console.log('검색어:',input);
  const categoryGroups = document.querySelectorAll('.category-group');

  categoryGroups.forEach(group => {
    let hasVisiblePosts = false;
    const posts = group.querySelectorAll('.post-item');

    posts.forEach(post => {
      const titleElement = post.querySelector('.post-title');
      const tagsElement = post.querySelector('.tags');  // tags 클래스에서 카테고리와 태그 가져오기

      if (titleElement && tagsElement) {
        const title = titleElement.textContent.toLowerCase();
        const tags = tagsElement.textContent.toLowerCase();

        // 검색어가 제목이나 tags에 포함되면 포스트를 표시
        if (title.includes(input) || tags.includes(input)) {
          post.style.display = ''; // 보이기
          hasVisiblePosts = true;
        } else {
          post.style.display = 'none'; // 숨기기
        }
      }
    });

    // 카테고리에 표시할 포스트가 없으면 해당 카테고리 제목도 숨김
    if (hasVisiblePosts) {
      group.previousElementSibling.style.display = ''; // 카테고리 제목 보이기
    } else {
      group.previousElementSibling.style.display = 'none'; // 카테고리 제목 숨기기
    }
  });
}
