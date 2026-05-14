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
    var prevIndex = index;
    index = i;

    var mainImg = document.getElementById("media-main-img");
    var container = mainImg.parentElement;
    var goingForward = i > prevIndex || (prevIndex === 3 && i === 0);

    // 새 이미지 생성
    var newImg = document.createElement("img");
    var thumb = document.querySelector(
      ".media-thumb[data-index='" + index + "']",
    );
    newImg.src =
      thumb.getAttribute("data-full-src") ||
      document.querySelector(".media-thumb[data-index='" + index + "'] img")
        .src;
    newImg.style.cssText =
      "width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0;";

    // 방향에 따라 애니메이션
    if (goingForward) {
      newImg.style.animation = "slideInFromRight 0.5s ease forwards";
      mainImg.style.animation = "slideOutToLeft 0.5s ease forwards";
    } else {
      newImg.style.animation = "slideInFromLeft 0.5s ease forwards";
      mainImg.style.animation = "slideOutToRight 0.5s ease forwards";
    }

    container.appendChild(newImg);

    // 애니메이션 끝난 후 정리
    setTimeout(function () {
      mainImg.remove();
      newImg.id = "media-main-img";
      newImg.style.animation = "";
    }, 500);

    // 썸네일 활성화
    var thumbs = document.querySelectorAll(".media-thumb");
    for (var t = 0; t < thumbs.length; t++) {
      thumbs[t].classList.toggle("active-thumb", t === index);
    }

    // 프로그레스 바 초기화
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
