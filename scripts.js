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

// ===== 미디어 슬라이드쇼 =====
window.onload = function () {
  var INTERVAL = 3000;
  var index = 0;
  var slideTimer = null;
  var isAnimating = false; // 애니메이션 중 중복 방지

  function goTo(i, skipAnimation) {
    if (i === index && !skipAnimation) return;

    // 애니메이션 중이어도 타이머는 항상 취소
    clearTimeout(slideTimer);

    // 애니메이션 중 클릭 시: 진행 중인 애니메이션 즉시 정리
    if (isAnimating) {
      var oldNew = document.getElementById("media-main-img");
      var imgs = oldNew.parentElement.querySelectorAll("img");
      // 첫 번째 img만 남기고 나머지 제거
      for (var k = 1; k < imgs.length; k++) {
        imgs[k].remove();
      }
      imgs[0].id = "media-main-img";
      imgs[0].style.animation = "";
      isAnimating = false;
    }

    var prevIndex = index;
    index = i;

    var mainImg = document.getElementById("media-main-img");
    var container = mainImg.parentElement;

    if (skipAnimation) {
      mainImg.src = document.querySelector(
        ".media-thumb[data-index='0'] img",
      ).src;
    } else {
      isAnimating = true;

      // i < prevIndex면 뒤로, 아니면 앞으로
      // 단, 순환(마지막→첫번째)은 앞으로, 첫번째→마지막은 뒤로
      var totalThumbs = document.querySelectorAll(".media-thumb").length;
      var goingForward;
      if (prevIndex === totalThumbs - 1 && i === 0) {
        goingForward = true;
      } else if (prevIndex === 0 && i === totalThumbs - 1) {
        goingForward = false;
      } else {
        goingForward = i > prevIndex;
      }

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

      if (goingForward) {
        newImg.style.animation = "slideInFromRight 0.5s ease forwards";
        mainImg.style.animation = "slideOutToLeft 0.5s ease forwards";
      } else {
        newImg.style.animation = "slideInFromLeft 0.5s ease forwards";
        mainImg.style.animation = "slideOutToRight 0.5s ease forwards";
      }

      container.appendChild(newImg);

      setTimeout(function () {
        mainImg.remove();
        newImg.id = "media-main-img";
        newImg.style.animation = "";
        isAnimating = false;
      }, 500);
    }

    // 썸네일 활성화
    var thumbs = document.querySelectorAll(".media-thumb");
    for (var t = 0; t < thumbs.length; t++) {
      thumbs[t].classList.toggle("active-thumb", t === index);
    }

    // 프로그레스 바
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

    slideTimer = setTimeout(function () {
      goTo((index + 1) % document.querySelectorAll(".media-thumb").length);
    }, INTERVAL);
  }

  window.selectMedia = goTo;
  goTo(0, true); // 초기 로딩은 애니메이션 없이
};

// ===== 비디오 팝업 =====
function openVideoPopup() {
  var popup = document.getElementById("video-popup");
  var iframe = document.getElementById("video-iframe");
  iframe.src = iframe.getAttribute("data-src");
  popup.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeVideoPopup(e) {
  var popup = document.getElementById("video-popup");
  var iframe = document.getElementById("video-iframe");
  iframe.src = "";
  popup.style.display = "none";
  document.body.style.overflow = "";
}

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeVideoPopup();
});
