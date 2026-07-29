/* A.OULL 랜딩페이지 동작 스크립트 */
(function () {
  "use strict";

  /* ── 신청 현황 진행 바 ── */
  var progress = document.querySelector(".re-bar");
  if (progress) {
    var total = Number(progress.dataset.total) || 12;
    var filled = Number(progress.dataset.filled) || 0;
    var fill = progress.querySelector(".re-bar-fill");
    // 화면에 들어올 때 채워지는 애니메이션
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          fill.style.width = Math.min(100, (filled / total) * 100) + "%";
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });
    observer.observe(progress);
  }

  /* ── 마감 카운트다운 ── */
  var countdown = document.querySelector(".countdown");
  if (countdown) {
    var deadline = new Date(countdown.dataset.deadline).getTime();
    var numEls = {
      days: countdown.querySelector('[data-unit="days"]'),
      hours: countdown.querySelector('[data-unit="hours"]'),
      minutes: countdown.querySelector('[data-unit="minutes"]')
    };
    var pad = function (n) { return String(n).padStart(2, "0"); };
    var tick = function () {
      var diff = deadline - Date.now();
      if (diff < 0) diff = 0;
      var minutes = Math.floor(diff / 60000);
      numEls.days.textContent = pad(Math.floor(minutes / 1440));
      numEls.hours.textContent = pad(Math.floor((minutes % 1440) / 60));
      numEls.minutes.textContent = pad(minutes % 60);
    };
    tick();
    setInterval(tick, 15000);
  }

  /* ── 신청 폼 ── */
  // 정적 호스팅(GitHub Pages)이므로 기본은 접수 완료 표시만 한다.
  // 실제 수집이 필요하면 Formspree/Google Forms 등의 엔드포인트를 지정할 것.
  var FORM_ENDPOINT = "";

  var form = document.getElementById("apply-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var valid = true;
      form.querySelectorAll("input[required]").forEach(function (input) {
        input.classList.toggle("is-invalid", !input.value.trim());
        if (!input.value.trim()) valid = false;
      });
      if (!valid) return;

      var finish = function () {
        form.querySelector(".apply-form__done").hidden = false;
        form.querySelector(".apply-form__submit").disabled = true;
      };

      if (FORM_ENDPOINT) {
        var data = new FormData(form);
        fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(finish)
          .catch(finish);
      } else {
        finish();
      }
    });
  }
})();
