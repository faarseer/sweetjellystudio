---
layout: post
title:  "🎮하루만에 완성하는 미로 게임 개발 원데이 클래스"
author: SWeetJelly
categories: [ class ]
image: assets/images/Class/thumbnail-maze.png
featured: true
disqus: false
---

<div class="section">
  <img src="/assets/images/Class/maze-portrait-1.png" alt="maze portrait 1">
</div>
<div class="section">
  <img src="/assets/images/Class/maze-portrait-2.png" alt="maze portrait 2">
</div>
<div class="section">
  <img src="/assets/images/Class/maze-portrait-3.png" alt="maze portrait 3">
</div>
<div class="section">
  <img src="/assets/images/Class/maze-portrait-4.png" alt="maze portrait 4">
</div>

---

<div class="video-container">
  <iframe 
    width="560" 
    height="315" 
    src="https://www.youtube.com/embed/m_tTgsX_LNA" 
    title="YouTube" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
  </iframe>
</div>

<div class="game-container">
  <iframe 
    id="game-frame" 
    src="" 
    class="game-iframe">
  </iframe>
</div>

<script>
  // 모바일과 PC를 구분하는 함수
  function isMobileDevice() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  // PC와 모바일에 따라 적절한 빌드를 설정
  if (isMobileDevice()) {
    // 모바일 빌드
    document.getElementById("game-frame").src = "/assets/webgl/maze mobile/index.html";
  } else {
    // PC 빌드
    document.getElementById("game-frame").src = "/assets/webgl/maze pc/index.html";
  }
</script>
