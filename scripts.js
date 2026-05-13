function openLightbox(src, el) {
  const lb = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");

  const rect = el.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  img.src = src;
  img.style.transformOrigin = `${originX}px ${originY}px`;

  lb.classList.remove("closing");
  img.classList.remove("closing");
  lb.style.display = "flex";
  lb.classList.add("opening");
  img.classList.add("opening");
}

function closeLightbox() {
  const lb = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");

  lb.classList.remove("opening");
  img.classList.remove("opening");
  lb.classList.add("closing");
  img.classList.add("closing");

  setTimeout(() => {
    lb.style.display = "none";
    lb.classList.remove("closing");
    img.classList.remove("closing");
  }, 350);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

window.onload = function () {
  var INTERVAL = 3000;
  var index = 0;
  var slideTimer = null;

  function goTo(i) {
    index = i;

    // 해당 썸네일의 img src를 메인에 표시
    var thumbImg = document.querySelector(
      ".media-thumb[data-index='" + index + "'] img",
    );
    var mainImg = document.getElementById("media-main-img");
    mainImg.src = thumbImg.src;

    // 썸네일 테두리
    var thumbs = document.querySelectorAll(".media-thumb");
    for (var t = 0; t < thumbs.length; t++) {
      thumbs[t].classList.toggle("active-thumb", t === index);
    }

    // 모든 바 초기화
    var bars = document.querySelectorAll(".media-progress");
    for (var b = 0; b < bars.length; b++) {
      bars[b].style.transition = "none";
      bars[b].style.width = b < index ? "100%" : "0%";
    }

    // 현재 바 부드럽게 채우기
    var activeBar = document.querySelector(
      ".media-progress[data-index='" + index + "']",
    );
    setTimeout(function () {
      activeBar.style.transition = "width " + INTERVAL + "ms linear";
      activeBar.style.width = "100%";
    }, 30);

    // 다음 슬라이드
    clearTimeout(slideTimer);
    slideTimer = setTimeout(function () {
      goTo((index + 1) % document.querySelectorAll(".media-thumb").length);
    }, INTERVAL);
  }

  window.selectMedia = goTo;
  goTo(0);
};

// ===== 미디어 슬라이드쇼 =====
window.onload = function () {
  var INTERVAL = 3000;
  var index = 0;
  var slideTimer = null;

  function goTo(i) {
    index = i;

    var thumbImg = document.querySelector(
      ".media-thumb[data-index='" + index + "'] img",
    );
    var mainImg = document.getElementById("media-main-img");
    mainImg.src = thumbImg.src;

    var thumbs = document.querySelectorAll(".media-thumb");
    for (var t = 0; t < thumbs.length; t++) {
      thumbs[t].classList.toggle("active-thumb", t === index);
    }

    var bars = document.querySelectorAll(".media-progress");
    for (var b = 0; b < bars.length; b++) {
      bars[b].style.transition = "none";
      bars[b].style.width = b < index ? "100%" : "0%";
    }

    var activeBar = document.querySelector(
      ".media-progress[data-index='" + index + "']",
    );
    setTimeout(function () {
      activeBar.style.transition = "width " + INTERVAL + "ms linear";
      activeBar.style.width = "100%";
    }, 30);

    clearTimeout(slideTimer);
    slideTimer = setTimeout(function () {
      goTo((index + 1) % document.querySelectorAll(".media-thumb").length);
    }, INTERVAL);
  }

  window.selectMedia = goTo;
  goTo(0);
};

// ===== 섹션 스냅 스크롤 =====
var sectionBounds = [0, 1260, 2680, 4120, 5200];
var snapBusy = false;
var prevScrollY = 0;
var trackedIdx = 0;
var touchStartY = 0;

function getSectionIdx(y) {
  for (var i = sectionBounds.length - 1; i >= 0; i--) {
    if (y >= sectionBounds[i]) return i;
  }
  return 0;
}

function getSectionHeight(idx) {
  if (idx < sectionBounds.length - 1) {
    return sectionBounds[idx + 1] - sectionBounds[idx];
  }
  return document.body.scrollHeight - sectionBounds[idx];
}

function snapUpTarget(idx) {
  var vh = window.innerHeight;
  var sectionStart = sectionBounds[idx];
  var sectionH = getSectionHeight(idx);
  var target = sectionStart + sectionH - vh;
  return Math.max(sectionStart, target);
}

function doSnap(targetY) {
  snapBusy = true;
  window.scrollTo({ top: targetY, behavior: "smooth" });
  setTimeout(function () {
    snapBusy = false;
    prevScrollY = window.scrollY;
    trackedIdx = getSectionIdx(window.scrollY);
  }, 1000);
}

window.addEventListener(
  "scroll",
  function () {
    if (snapBusy) return;

    var y = window.scrollY;
    var vh = window.innerHeight;
    var goingDown = y > prevScrollY;
    prevScrollY = y;

    var naturalIdx = getSectionIdx(y);

    if (goingDown) {
      if (
        naturalIdx < sectionBounds.length - 1 &&
        y + vh >= sectionBounds[naturalIdx + 1] - 30
      ) {
        trackedIdx = naturalIdx + 1;
        doSnap(sectionBounds[trackedIdx]);
      } else {
        trackedIdx = naturalIdx;
      }
    } else {
      if (naturalIdx < trackedIdx && trackedIdx > 0) {
        trackedIdx = trackedIdx - 1;
        doSnap(snapUpTarget(trackedIdx));
      } else {
        trackedIdx = naturalIdx;
      }
    }
  },
  { passive: true },
);

window.addEventListener(
  "wheel",
  function (e) {
    if (snapBusy || e.deltaY >= 0) return;
    var y = window.scrollY;
    var idx = getSectionIdx(y);
    if (idx > 0 && y <= sectionBounds[idx] + 80) {
      e.preventDefault();
      trackedIdx = idx - 1;
      doSnap(snapUpTarget(trackedIdx));
    }
  },
  { passive: false },
);

window.addEventListener(
  "touchstart",
  function (e) {
    touchStartY = e.touches[0].clientY;
  },
  { passive: true },
);

window.addEventListener(
  "touchend",
  function (e) {
    if (snapBusy) return;
    var diff = touchStartY - e.changedTouches[0].clientY;
    var y = window.scrollY;
    var idx = getSectionIdx(y);

    if (diff < -50 && idx > 0 && y <= sectionBounds[idx] + 80) {
      trackedIdx = idx - 1;
      doSnap(snapUpTarget(trackedIdx));
    }
  },
  { passive: true },
);

function toggleHeroVideo() {
  var video = document.getElementById("hero-video");
  var btn = document.getElementById("play-btn");
  var icon = document.getElementById("play-icon");

  if (video.paused) {
    video.play();
    btn.style.opacity = "0";
    icon.style.opacity = "0";
  } else {
    video.pause();
    btn.style.opacity = "0.7";
    icon.style.opacity = "1";
  }
}

// 비디오 끝나면 처음으로 되감고 버튼 다시 표시
document.addEventListener("DOMContentLoaded", function () {
  var video = document.getElementById("hero-video");

  video.volume = 0.4; // 볼륨 40% (0.0 ~ 1.0)

  video.addEventListener("ended", function () {
    video.currentTime = 0; // 첫 프레임으로 되감기
    document.getElementById("play-btn").style.opacity = "0.7";
    document.getElementById("play-icon").style.opacity = "1";
  });
});

// ===== 비디오 팝업 =====
function openVideoPopup() {
  var popup = document.getElementById("video-popup");
  var iframe = document.getElementById("video-iframe");

  // src 설정 (autoplay 포함)
  iframe.src = iframe.getAttribute("data-src");

  popup.style.display = "flex";
  document.body.style.overflow = "hidden"; // 배경 스크롤 방지
}

function closeVideoPopup(e) {
  var popup = document.getElementById("video-popup");
  var iframe = document.getElementById("video-iframe");

  // iframe src 초기화 (영상 정지)
  iframe.src = "";

  popup.style.display = "none";
  document.body.style.overflow = "";
}

// ESC 키로 닫기
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeVideoPopup();
});
