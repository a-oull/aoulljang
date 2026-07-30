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
  // FormSubmit(가입 불필요)으로 접수 메일을 발송한다.
  // 최초 1회 수신함에서 활성화 확인이 필요하다.
  var FORM_ENDPOINT = "https://formsubmit.co/ajax/aoull.kr@gmail.com";
  // 메일에 표시될 컬럼명 매핑
  var FIELD_LABELS = {
    name: "이름",
    company: "회사(공방)",
    email: "이메일",
    contact: "연락처",
    birth: "생년월일",
    region: "지역",
    craft: "전통공예 분야",
    grade: "국가무형유산 등급",
    organization: "소속 기관"
  };

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

      var submitBtn = form.querySelector(".apply-form__submit");
      var doneMsg = form.querySelector(".apply-form__done");
      submitBtn.disabled = true;
      submitBtn.textContent = "전송 중...";

      var payload = {
        _subject: "[A.OULL] 파트너 장인 신청 접수",
        _template: "table",
        _captcha: "false"
      };
      Object.keys(FIELD_LABELS).forEach(function (key) {
        var input = form.querySelector('[name="' + key + '"]');
        payload[FIELD_LABELS[key]] = input ? input.value.trim() : "";
      });

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json(); })
        .then(function () {
          doneMsg.hidden = false;
          submitBtn.textContent = "신청 완료";
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "신청하기";
          alert("전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
        });
    });
  }
})();
