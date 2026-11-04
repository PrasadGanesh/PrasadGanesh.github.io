/* Soiling-loss widget: zero deps. Usage: <div class="sw" data-soiling data-src="data.json"></div> (or set window.SOILING_DATA) */
(function () {
  var NS = "http://www.w3.org/2000/svg",
    W = 800,
    H = 300;

  function el(t, a, p) {
    var e = document.createElementNS(NS, t);
    for (var k in a) e.setAttribute(k, a[k]);
    p && p.appendChild(e);
    return e;
  }
  function pct(v) {
    return (v * 100).toFixed(1) + "%";
  }
  function narrow() {
    return window.matchMedia("(max-width: 480px)").matches;
  }
  function pad() {
    return narrow() ? { l: 112, r: 16, t: 16, b: 52 } : { l: 40, r: 12, t: 12, b: 26 };
  }

  /* Below 480px the viewBox scales 10px type down to a few CSS pixels.
     Grow it until it measures at least 12px. Hide it only if the larger labels collide. */
  function fitAxis(svg) {
    var texts = svg.querySelectorAll("text");
    if (!texts.length || !narrow()) return;
    for (var i = 0; i < texts.length; i++) {
      texts[i].style.fontSize = "";
      texts[i].style.display = "";
    }
    var size = 10;
    var h = texts[0].getBoundingClientRect().height;
    var guard = 0;
    while (h > 0 && h < 12 && guard < 5) {
      size = size * (12 / h) * 1.04;
      for (var j = 0; j < texts.length; j++) texts[j].style.fontSize = size.toFixed(2) + "px";
      h = texts[0].getBoundingClientRect().height;
      guard++;
    }
    if (!(h >= 12)) {
      for (var c = 0; c < texts.length; c++) texts[c].style.display = "none";
      return;
    }
    var rects = [];
    for (var k = 0; k < texts.length; k++) rects.push(texts[k].getBoundingClientRect());
    var collide = false;
    for (var a = 0; a < rects.length && !collide; a++) {
      for (var b = a + 1; b < rects.length && !collide; b++) {
        var A = rects[a],
          B = rects[b];
        if (A.left < B.right - 1 && A.right > B.left + 1 && A.top < B.bottom - 1 && A.bottom > B.top + 1) {
          collide = true;
        }
      }
    }
    if (collide) {
      for (var d = 0; d < texts.length; d++) texts[d].style.display = "none";
    }
  }

  function render(root, d) {
    root._soiling = d;
    var P = pad(),
      R = d.rows,
      n = R.length,
      lo = 1,
      hi = 0;
    R.forEach(function (r) {
      lo = Math.min(lo, r.pr);
      hi = Math.max(hi, r.baseline);
    });
    lo = Math.floor(lo * 20) / 20;
    hi = Math.ceil(hi * 20) / 20;
    var x = function (i) {
        return P.l + (i * (W - P.l - P.r)) / (n - 1);
      },
      y = function (v) {
        return P.t + ((hi - v) * (H - P.t - P.b)) / (hi - lo);
      };
    var ev = R.filter(function (r) {
        return r.clean;
      }),
      avg =
        R.reduce(function (s, r) {
          return s + r.loss;
        }, 0) / n,
      mx = R.reduce(function (m, r) {
        return r.loss > m.loss ? r : m;
      }, R[0]);
    var sum =
      "Sample data: " +
      n +
      " days of synthetic solar plant performance ratio. Average soiling loss " +
      pct(avg) +
      ", peak " +
      pct(mx.loss) +
      " on " +
      mx.date +
      ". " +
      ev.length +
      " cleaning events detected (" +
      ev
        .map(function (r) {
          return r.date;
        })
        .join(", ") +
      ").";
    root.innerHTML =
      '<h3>Soiling loss tracker<span class="tag">Sample data</span></h3><div class="kpi"><span><b>' +
      pct(avg) +
      "</b>avg soiling loss</span><span><b>" +
      pct(mx.loss) +
      "</b>peak loss</span><span><b>" +
      ev.length +
      "</b>cleanings detected</span></div>";
    var s = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": sum }, root);
    for (var v = lo; v <= hi + 1e-9; v += 0.05) {
      el("line", { class: "ax", x1: P.l, x2: W - P.r, y1: y(v), y2: y(v) }, s);
      el("text", { x: 6, y: y(v), "dominant-baseline": "middle" }, s).textContent = Math.round(v * 100) + "%";
    }
    for (var i = 0; i < n; i += 30) {
      if (narrow() && i === 0) continue;
      el("text", { x: x(i), y: H - 18, "text-anchor": "middle" }, s).textContent = R[i].date.slice(5);
    }
    var pp = R.map(function (r, i) {
        return x(i).toFixed(1) + "," + y(r.pr).toFixed(1);
      }),
      bp = R.map(function (r, i) {
        return x(i).toFixed(1) + "," + y(r.baseline).toFixed(1);
      });
    el("path", { class: "ar fade", d: "M" + bp.join("L") + "L" + pp.slice().reverse().join("L") + "Z" }, s);
    ev.forEach(function (r) {
      var idx = R.indexOf(r);
      el("line", { class: "ev fade", x1: x(idx), x2: x(idx), y1: P.t, y2: H - P.b }, s);
      el("circle", { class: "dot fade", cx: x(idx), cy: y(r.pr), r: 3.5 }, s);
    });
    [
      ["lbl", bp],
      ["lpr", pp],
    ].forEach(function (a) {
      var p = el("path", { class: a[0] + " draw", d: "M" + a[1].join("L") }, s);
      try {
        p.style.setProperty("--len", Math.ceil(p.getTotalLength()));
      } catch (e) {
        p.classList.remove("draw");
      }
    });
    var cur = el("line", { class: "cur", y1: P.t, y2: H - P.b, opacity: 0 }, s),
      tip = document.createElement("div");
    tip.className = "tip";
    tip.setAttribute("aria-hidden", "true");
    root.appendChild(tip);
    var usingTouch = false;
    var hideTimer = 0;
    function mv(e) {
      var b = s.getBoundingClientRect(),
        t = e.touches ? e.touches[0] : e,
        px = ((t.clientX - b.left) * W) / b.width,
        idx = Math.max(0, Math.min(n - 1, Math.round(((px - P.l) * (n - 1)) / (W - P.l - P.r)))),
        r = R[idx];
      cur.setAttribute("x1", x(idx));
      cur.setAttribute("x2", x(idx));
      cur.setAttribute("opacity", 1);
      tip.innerHTML =
        "<b>" +
        r.date +
        "</b>" +
        (r.clean ? " · cleaning" : "") +
        "<br>PR " +
        pct(r.pr) +
        " · baseline " +
        pct(r.baseline) +
        "<br>Soiling loss <b>" +
        pct(r.loss) +
        "</b>";
      var lx = t.clientX - root.getBoundingClientRect().left + 12;
      if (lx + tip.offsetWidth > root.clientWidth) lx -= tip.offsetWidth + 24;
      tip.style.left = Math.max(0, lx) + "px";
      tip.style.top = b.top - root.getBoundingClientRect().top + 10 + "px";
      tip.style.opacity = "1";
    }
    function out() {
      tip.style.opacity = "0";
      cur.setAttribute("opacity", 0);
    }
    s.addEventListener("pointerdown", function (e) {
      usingTouch = e.pointerType === "touch";
      mv(e);
    });
    s.addEventListener("pointermove", function (e) {
      if (e.pointerType === "mouse" && usingTouch) return;
      mv(e);
    });
    s.addEventListener("pointerleave", function () {
      if (usingTouch) return;
      clearTimeout(hideTimer);
      out();
    });
    s.addEventListener("pointerup", function (e) {
      if (e.pointerType !== "touch") return;
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () {
        usingTouch = false;
        out();
      }, 1500);
    });
    var lg = document.createElement("div");
    lg.className = "leg";
    lg.innerHTML =
      '<span><i style="background:var(--pr)"></i>Daily PR</span><span><i style="background:var(--bl)"></i>Clean baseline</span><span><i style="background:var(--loss);height:8px"></i>Soiling loss</span><span><i style="background:var(--cl)"></i>Cleaning event</span>';
    root.appendChild(lg);
    var c = document.createElement("p");
    c.className = "cap";
    c.textContent =
      'How it works: each day we compute the performance ratio (PR) — actual energy vs. what the panels should make for that sunlight. The "clean" baseline is the average of the 3 best PR days in the last ' +
      d.window +
      " days. The gap between baseline and today's PR is the soiling loss; when PR jumps back up to the baseline, the panels were cleaned (or rain did it).";
    root.appendChild(c);
    var sr = document.createElement("p");
    sr.className = "sr";
    sr.textContent = sum;
    root.appendChild(sr);
    requestAnimationFrame(function () {
      fitAxis(s);
    });
  }

  function boot(root) {
    if (root._soiling) return render(root, root._soiling);
    if (window.SOILING_DATA) return render(root, window.SOILING_DATA);
    fetch(root.getAttribute("data-src") || "data.json")
      .then(function (x) {
        return x.json();
      })
      .then(function (d) {
        render(root, d);
      })
      .catch(function () {
        root.textContent = "Could not load sample data.";
      });
  }

  function init() {
    document.querySelectorAll("[data-soiling]").forEach(boot);
  }

  var fitTimer;
  window.addEventListener("resize", function () {
    clearTimeout(fitTimer);
    fitTimer = setTimeout(function () {
      document.querySelectorAll("[data-soiling]").forEach(function (r) {
        if (r._soiling) render(r, r._soiling);
      });
    }, 120);
  });

  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init();
})();
