/* Everlasting Beauty Aesthetics — booking page */
(function () {
  "use strict";

  var PHONE = "+639178312324";
  var PHONE_DISPLAY = "0917 831 2324";

  var GROUPS = [
    {
      title: "Treatments & Facials",
      items: [
        { n: "Extra Glow Facial", p: "₱13,999" },
        { n: "Lip Rejuvenation", p: "₱8,999" },
        { n: "Underarm Treatment", p: "₱8,999" },
        { n: "Scar-Free Leg Treatment", p: "₱13,999" },
        { n: "Skin Rejuvenation", p: "Inquire" },
        { n: "Intensive Whitening", p: "Inquire" },
        { n: "Carbon Laser", p: "Inquire" }
      ]
    },
    {
      title: "Permanent Hair Removal · Unlimited 1 Year",
      items: [
        { n: "Half Legs", p: "₱17,999" },
        { n: "Full Legs", p: "₱20,999" },
        { n: "Brazilian", p: "₱22,999" },
        { n: "Arms", p: "₱14,999" },
        { n: "Beard", p: "₱10,999" },
        { n: "Mustache", p: "₱12,999" }
      ]
    }
  ];

  var TIMES = [
    "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM",
    "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
  ];

  var MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  var DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  var selected = new Set();
  var selDate = null;   // Date at midnight
  var selTime = null;

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };

  /* ---------- Treatments ---------- */
  function renderTreatments() {
    var wrap = $("treatGroups");
    var html = "";
    GROUPS.forEach(function (g) {
      html += '<div class="treat-group"><h4>' + esc(g.title) + '</h4><div class="chip-grid">';
      g.items.forEach(function (it) {
        var id = "t_" + it.n.replace(/[^a-z0-9]/gi, "");
        html +=
          '<label class="chip" data-name="' + esc(it.n) + '">' +
          '<input type="checkbox" value="' + esc(it.n) + '" id="' + id + '">' +
          '<span class="cname">' + esc(it.n) + '</span>' +
          '<span class="cprice">' + esc(it.p) + '</span>' +
          '<span class="ctick">✓</span>' +
          '</label>';
      });
      html += "</div></div>";
    });
    wrap.innerHTML = html;

    // The chip is a <label> wrapping the checkbox, so a click toggles the input
    // natively — listen to the resulting change event (don't toggle again).
    wrap.querySelectorAll(".chip input").forEach(function (input) {
      input.addEventListener("change", function () {
        var chip = input.closest(".chip");
        chip.classList.toggle("selected", input.checked);
        if (input.checked) selected.add(input.value); else selected.delete(input.value);
        updateSummary();
      });
    });
  }

  /* ---------- Calendar ---------- */
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var viewY = today.getFullYear();
  var viewM = today.getMonth();
  var MAX = new Date(today.getFullYear(), today.getMonth() + 4, 0); // ~4 months ahead

  function sameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function renderDow() {
    $("calDow").innerHTML = DOW.map(function (d) {
      return '<div class="cal-dow">' + d + "</div>";
    }).join("");
  }

  function renderCalendar() {
    $("calTitle").textContent = MONTHS[viewM] + " " + viewY;
    var firstDow = new Date(viewY, viewM, 1).getDay();
    var days = new Date(viewY, viewM + 1, 0).getDate();
    var html = "";
    var i;
    for (i = 0; i < firstDow; i++) html += '<div class="cal-day empty"></div>';
    for (i = 1; i <= days; i++) {
      var d = new Date(viewY, viewM, i);
      var cls = "cal-day";
      if (d < today || d > MAX) cls += " disabled";
      if (sameDay(d, today)) cls += " today";
      if (sameDay(d, selDate)) cls += " selected";
      html += '<div class="' + cls + '" data-day="' + i + '">' + i + "</div>";
    }
    $("calDays").innerHTML = html;

    $("calDays").querySelectorAll(".cal-day[data-day]").forEach(function (cell) {
      if (cell.classList.contains("disabled")) return;
      cell.addEventListener("click", function () {
        selDate = new Date(viewY, viewM, parseInt(cell.getAttribute("data-day"), 10));
        renderCalendar();
        updateSummary();
      });
    });

    // prev disabled if viewing current month; next disabled beyond MAX month
    var atStart = (viewY === today.getFullYear() && viewM === today.getMonth());
    var atEnd = (viewY === MAX.getFullYear() && viewM === MAX.getMonth());
    $("calPrev").disabled = atStart;
    $("calNext").disabled = atEnd;
  }

  function shiftMonth(delta) {
    viewM += delta;
    if (viewM < 0) { viewM = 11; viewY--; }
    if (viewM > 11) { viewM = 0; viewY++; }
    renderCalendar();
  }

  /* ---------- Times ---------- */
  function renderTimes() {
    $("timeGrid").innerHTML = TIMES.map(function (t) {
      return '<div class="time-slot" data-time="' + t + '">' + t + "</div>";
    }).join("");
    $("timeGrid").querySelectorAll(".time-slot").forEach(function (slot) {
      slot.addEventListener("click", function () {
        selTime = slot.getAttribute("data-time");
        $("timeGrid").querySelectorAll(".time-slot").forEach(function (s) {
          s.classList.toggle("selected", s === slot);
        });
        updateSummary();
      });
    });
  }

  /* ---------- Summary ---------- */
  function fmtDate(d) {
    if (!d) return "—";
    return DOW[d.getDay()] + ", " + MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  function updateSummary() {
    var list = $("sumTreatments");
    if (selected.size === 0) {
      list.innerHTML = '<p class="sum-empty">No treatments selected yet.</p>';
    } else {
      var rows = "";
      selected.forEach(function (n) {
        rows += '<div class="sum-row"><span class="k">' + esc(n) + '</span>' +
          '<span class="v" data-rm="' + esc(n) + '" role="button" title="Remove">✕</span></div>';
      });
      list.innerHTML = rows;
      list.querySelectorAll("[data-rm]").forEach(function (x) {
        x.addEventListener("click", function () {
          var n = x.getAttribute("data-rm");
          selected.delete(n);
          var box = document.querySelector('.chip[data-name="' + n.replace(/"/g, '\\"') + '"]');
          if (box) { box.classList.remove("selected"); var i = box.querySelector("input"); if (i) i.checked = false; }
          updateSummary();
        });
      });
    }
    $("sumDate").textContent = fmtDate(selDate);
    $("sumTime").textContent = selTime || "—";
  }

  /* ---------- Submit ---------- */
  function composeMessage() {
    var lines = [];
    lines.push("Hi Everlasting Beauty! I'd like to book an appointment.");
    lines.push("");
    lines.push("Treatments: " + Array.from(selected).join(", "));
    lines.push("Preferred date: " + fmtDate(selDate));
    lines.push("Preferred time: " + selTime);
    lines.push("Name: " + ($("fName").value.trim()));
    lines.push("Mobile: " + ($("fPhone").value.trim()));
    var email = $("fEmail").value.trim();
    if (email) lines.push("Email: " + email);
    var notes = $("fNotes").value.trim();
    if (notes) lines.push("Notes: " + notes);
    return lines.join("\n");
  }

  function showError(msg) {
    var e = $("formError");
    e.textContent = msg;
    e.classList.add("show");
    e.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function clearError() { $("formError").classList.remove("show"); }

  function onSubmit() {
    clearError();
    if (selected.size === 0) return showError("Please select at least one treatment.");
    if (!selDate) return showError("Please choose a preferred date.");
    if (!selTime) return showError("Please choose a preferred time.");
    var name = $("fName").value.trim();
    var phone = $("fPhone").value.trim();
    if (!name) return showError("Please enter your full name.");
    if (phone.replace(/\D/g, "").length < 7) return showError("Please enter a valid mobile number.");

    var msg = composeMessage();
    $("msgBox").textContent = msg;

    var enc = encodeURIComponent(msg);
    $("smsBtn").setAttribute("href", "sms:" + PHONE + "?&body=" + enc);
    $("copyBtn").onclick = function () {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(msg).then(function () {
          $("copyBtn").textContent = "Copied ✓";
          setTimeout(function () { $("copyBtn").textContent = "Copy details"; }, 1800);
        });
      }
    };

    $("summaryCard").style.display = "none";
    $("confirmCard").classList.add("show");
    $("confirmCard").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function backToEdit() {
    $("confirmCard").classList.remove("show");
    $("summaryCard").style.display = "";
  }

  /* ---------- Preselect from ?t= ---------- */
  function preselect() {
    try {
      var q = new URLSearchParams(window.location.search).get("t");
      if (!q) return;
      q.split(",").forEach(function (raw) {
        var name = raw.trim();
        var box = document.querySelector('.chip[data-name="' + name.replace(/"/g, '\\"') + '"]');
        if (box) {
          box.classList.add("selected");
          var i = box.querySelector("input"); if (i) i.checked = true;
          selected.add(name);
        }
      });
      updateSummary();
    } catch (e) { /* no-op */ }
  }

  /* ---------- Init ---------- */
  renderTreatments();
  renderDow();
  renderCalendar();
  renderTimes();
  updateSummary();
  preselect();

  $("calPrev").addEventListener("click", function () { if (!this.disabled) shiftMonth(-1); });
  $("calNext").addEventListener("click", function () { if (!this.disabled) shiftMonth(1); });
  $("submitBtn").addEventListener("click", onSubmit);
  $("editBtn").addEventListener("click", backToEdit);
})();
