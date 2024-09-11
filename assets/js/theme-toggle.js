document.addEventListener("DOMContentLoaded", function() {
  const toggleSwitch = document.getElementById('theme-toggle');
  
  // 사용자의 이전 모드 선택 기억
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme) {
    document.body.classList.add(currentTheme);
    // 이전 모드가 다크 모드일 경우 체크박스를 체크 상태로 만듦
    if (currentTheme === 'dark-mode') {
      toggleSwitch.checked = true;
    }
  }

  // 토글 스위치 변경 시 다크/라이트 모드 전환
  toggleSwitch.addEventListener('change', function() {
    if (toggleSwitch.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light-mode');
    }
  });
});
