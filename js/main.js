/* ==========================================================================
   PK IT Sol landing page: interactions (no dependencies)
   1. Brand injection      5. Carousels          9. Forms (email delivery)
   2. Header & mobile nav  6. FAQ accordion
   3. Scroll helpers       7. Scroll reveal     10. Portfolio (SEO, marketing, web)
   4. Tabs                 8. Feature cards & proposal buttons   11. Proposal form pop-up   12. Analytics
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");   // also set inline in <head> to avoid a flash

  var CFG = window.SITE_CONFIG || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(selector, root) { return (root || document).querySelector(selector); }
  function $$(selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); }

  /* 1. BRAND INJECTION ----------------------------------------------------- */
  function applyBrand() {
    var social = CFG.social || {};
    var phone = CFG.phone || "";
    var waDigits = (CFG.whatsapp || phone).replace(/\D/g, "");
    var waText = CFG.whatsappMessage ? "?text=" + encodeURIComponent(CFG.whatsappMessage) : "";

    var text = {
      name: CFG.name,
      nameUpper: CFG.name ? CFG.name.toUpperCase() : "",
      tagline: CFG.tagline,
      taglineUpper: CFG.tagline ? CFG.tagline.toUpperCase() : "",
      phone: CFG.phoneDisplay || phone,
      email: CFG.email,
      address: CFG.address
    };
    var links = {
      phone: phone ? "tel:" + phone.replace(/[^\d+]/g, "") : "",
      email: CFG.email ? "mailto:" + CFG.email : "",
      whatsapp: waDigits ? "https://wa.me/" + waDigits + waText : "",
      directions: (CFG.mapQuery || CFG.address) ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CFG.mapQuery || CFG.address) : "",
      facebook: social.facebook,
      instagram: social.instagram,
      linkedin: social.linkedin
    };

    $$("[data-brand]").forEach(function (el) {
      var value = text[el.getAttribute("data-brand")];
      if (value) el.textContent = value;
    });
    $$("[data-brand-link]").forEach(function (el) {
      var value = links[el.getAttribute("data-brand-link")];
      if (value) el.setAttribute("href", value);
      else el.hidden = true;                       // e.g. a social profile that is not set yet
    });
    if (CFG.name) {
      $$("[data-brand-alt]").forEach(function (el) { el.alt = CFG.name; });
      $$("[data-brand-label]").forEach(function (el) { el.setAttribute("aria-label", CFG.name + ", back to top"); });
    }

    var map = $("[data-brand-map]");
    var query = CFG.mapQuery || CFG.address;
    if (map && query) {
      var src = "https://www.google.com/maps?q=" + encodeURIComponent(query) + "&output=embed";
      if (map.getAttribute("src") !== src) map.setAttribute("src", src);
    }

    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  // Internal links are written from the root of the domain: "/", "/#contact", "/seo-services#quote".
  // A page opened from disk (file://) has no domain, so those links are pointed at the files instead.
  function localHref(href) {
    if (location.protocol !== "file:" || href.charAt(0) !== "/" || href.charAt(1) === "/") return href;
    var rest = href.slice(1);
    var path = rest.match(/^[^?#]*/)[0];
    var tail = rest.slice(path.length);
    if (path === "") path = "index.html";
    else if (path.indexOf(".") === -1) path += ".html";
    return path + tail;
  }
  // Marks the menu link of the page you are on
  function markCurrentPage() {
    var slug = function (path) { return path.split("#")[0].split("?")[0].replace(/\/$/, "").split("/").pop().replace(/\.html$/, ""); };
    var here = slug(location.pathname);
    if (!here || here === "index") return;
    $$(".navbar__links a, .mobile-menu nav > a").forEach(function (a) {
      if (slug(a.getAttribute("href") || "") === here) a.setAttribute("aria-current", "page");
    });
  }

  function initHomeLinks() {
    if (location.protocol === "file:") {
      $$('a[href^="/"]').forEach(function (a) { a.setAttribute("href", localHref(a.getAttribute("href"))); });
    } else if (/\/index\.html$/.test(location.pathname) && window.history.replaceState) {
      // /index.html and / are the same page: show the root address
      window.history.replaceState(null, "", location.pathname.replace(/index\.html$/, "") + location.search + location.hash);
    }
  }

  /* 2. HEADER & MOBILE NAV ------------------------------------------------- */
  function initHeader() {
    var header = $("[data-header]");
    var toggle = $("[data-nav-toggle]");
    var menu = $("#mobile-menu");
    if (!header || !toggle || !menu) return;

    function setOpen(open) {
      menu.hidden = !open;
      header.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    toggle.addEventListener("click", function () { setOpen(menu.hidden); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", function (e) { if (e.matches) setOpen(false); });
  }

  // "All Services" mega menu (desktop) and the same list in the mobile menu, built from SITE_CONFIG.services
  function initServicesMenu() {
    var services = CFG.services || [];
    var panel = $("[data-mega-panel]");
    var wrap = $("[data-mega]");
    var mobile = $("[data-mobile-services]");
    if (!services.length) {
      if (wrap) wrap.hidden = true;
      if (mobile) mobile.hidden = true;
      return;
    }

    function picture(src, size) {
      var img = el("img");
      img.loading = "lazy";                       // menu pictures load when the menu is first opened
      img.src = src; img.alt = ""; img.width = size; img.height = size;
      return img;
    }
    function linkOrText(item) {
      var node = el(item.url ? "a" : "span");
      if (item.url) node.setAttribute("href", localHref(item.url));
      if (item.image) node.appendChild(picture(item.image, 36));
      node.appendChild(el("span", "", item.title));
      return node;
    }

    // Desktop panel: main services on the left; pointing at one shows its picture,
    // description and sub-services on the right. Each main service is a real link to its page.
    var tabs = [], panes = [], activeIndex = -1, switchedAt = 0;
    function activate(index) {
      if (index === activeIndex) return;
      activeIndex = index; switchedAt = Date.now();
      tabs.forEach(function (tab, i) { tab.classList.toggle("is-active", i === index); });
      panes.forEach(function (pane, i) { pane.hidden = i !== index; });
    }
    if (panel) {
      var inner = el("div", "mega__inner");
      var side = el("ul", "mega__tabs");
      var stage = el("div", "mega__stage");
      services.forEach(function (service, index) {
        // left column
        var li = el("li");
        var tab = el("a", "mega__tab");
        tab.setAttribute("href", localHref(service.url));
        if (service.image) tab.appendChild(picture(service.image, 48));
        var label = el("span");
        label.appendChild(el("strong", "", service.title));
        if (service.tagline) label.appendChild(el("small", "", service.tagline));
        tab.appendChild(label);
        tab.insertAdjacentHTML("beforeend", '<svg class="icon" aria-hidden="true"><use href="#i-chevron-down"/></svg>');
        tab.addEventListener("mouseenter", function () { activate(index); });
        tab.addEventListener("focus", function () { activate(index); });
        tab.addEventListener("click", function (e) {
          // Touch screens have no hover: the first tap shows the service, the second opens its page
          // (a tap also fires "mouseenter", so a switch made a moment ago belongs to this same tap)
          if (window.matchMedia("(hover: none)").matches && (index !== activeIndex || Date.now() - switchedAt < 600)) { e.preventDefault(); activate(index); }
        });
        li.appendChild(tab); side.appendChild(li); tabs.push(tab);

        // right side
        var pane = el("section", "mega__pane");
        var copy = el("div", "mega__copy");
        copy.appendChild(el("h3", "", service.title));
        if (service.description) copy.appendChild(el("p", "", service.description));
        var list = el("ul", "mega__list");
        (service.items || []).forEach(function (item) {
          var row = el("li");
          row.appendChild(linkOrText(item));
          list.appendChild(row);
        });
        copy.appendChild(list);
        var more = el("a", "btn btn--dark btn--sm", "Explore " + service.title + " \u2192");
        more.setAttribute("href", localHref(service.url));
        copy.appendChild(more);
        pane.appendChild(copy);
        if (service.feature || service.image) {
          var feature = el("a", "mega__feature");
          feature.setAttribute("href", localHref(service.url));
          feature.setAttribute("aria-label", service.title);
          feature.setAttribute("tabindex", "-1");
          var big = el("img");
          big.src = service.feature || service.image; big.alt = ""; big.loading = "lazy";
          feature.appendChild(big);
          if (service.tagline) feature.appendChild(el("span", "", service.tagline));
          pane.appendChild(feature);
        }
        stage.appendChild(pane); panes.push(pane);
      });
      inner.appendChild(side);
      inner.appendChild(stage);
      panel.appendChild(inner);
      var foot = el("p", "mega__foot", "Not sure which service you need? ");
      var call = el("a", "", "Call " + (CFG.phoneDisplay || CFG.phone || "us"));
      call.setAttribute("href", "tel:" + String(CFG.phone || "").replace(/[^\d+]/g, ""));
      foot.appendChild(call);
      panel.appendChild(foot);

      // Start on the service whose page is open, otherwise the first one
      var here = location.pathname.replace(/\/$/, "").split("/").pop().replace(/\.html$/, "");
      var current = 0;
      services.forEach(function (service, i) { if (String(service.url).replace(/^\//, "") === here) current = i; });
      activate(current);
    }

    // Phone menu: the same services as cards. Tapping a card opens its sub-services and an
    // "Explore" button, one card at a time, so the phone menu reads like the desktop one.
    if (mobile) {
      mobile.textContent = "";
      var cards = [];
      var herePage = location.pathname.replace(/\/$/, "").split("/").pop().replace(/\.html$/, "");
      services.forEach(function (service) {
        var card = el("div", "m-service");
        var head = el("button", "m-service__head");
        head.type = "button";
        head.setAttribute("aria-expanded", "false");
        if (service.image) head.appendChild(picture(service.image, 44));
        var name = el("span");
        name.appendChild(el("strong", "", service.title));
        if (service.tagline) name.appendChild(el("small", "", service.tagline));
        head.appendChild(name);
        head.insertAdjacentHTML("beforeend", '<svg class="icon" aria-hidden="true"><use href="#i-chevron-down"/></svg>');

        var body = el("div", "m-service__body");
        body.hidden = true;
        var list = el("ul");
        (service.items || []).forEach(function (item) {
          var li = el("li");
          li.appendChild(linkOrText(item));
          list.appendChild(li);
        });
        body.appendChild(list);
        var go = el("a", "btn btn--dark btn--block", "Explore " + service.title + " \u2192");
        go.setAttribute("href", localHref(service.url));
        body.appendChild(go);

        function setCard(open) {
          body.hidden = !open;
          head.setAttribute("aria-expanded", String(open));
          card.classList.toggle("is-open", open);
        }
        head.addEventListener("click", function () {
          var open = body.hidden;
          cards.forEach(function (close) { close(false); });
          setCard(open);
        });
        cards.push(setCard);
        card.appendChild(head);
        card.appendChild(body);
        mobile.appendChild(card);
        if (String(service.url).replace(/^\//, "") === herePage) setCard(true);   // on a service page, its card starts open
      });
    }

    if (!wrap || !panel) return;
    var toggle = $(".nav-mega__toggle", wrap);
    var closeTimer = null, openedAt = 0, preloaded = false;
    function setOpen(open) {
      window.clearTimeout(closeTimer);
      if (open && panel.hidden) openedAt = Date.now();
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      if (open && !preloaded) {                   // fetch the large pictures once, so switching services is instant
        preloaded = true;
        services.forEach(function (service) { if (service.feature) { new Image().src = service.feature; } });
      }
    }
    function closeSoon() { window.clearTimeout(closeTimer); closeTimer = window.setTimeout(function () { setOpen(false); }, 220); }
    toggle.addEventListener("click", function () {
      // A tap on a touch laptop fires "mouseenter" and then "click": keep the menu it just opened
      if (!panel.hidden && Date.now() - openedAt < 500) return;
      setOpen(panel.hidden);
    });
    // Hover opens it for mouse users; the short delay lets the cursor cross the gap to the panel
    [wrap, panel].forEach(function (node) {
      node.addEventListener("mouseenter", function () { if (window.matchMedia("(hover: hover)").matches) setOpen(true); });
      node.addEventListener("mouseleave", function () { if (window.matchMedia("(hover: hover)").matches) closeSoon(); });   // touch screens close it by tapping outside
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) { setOpen(false); toggle.focus(); } });
    document.addEventListener("click", function (e) { if (!panel.hidden && !wrap.contains(e.target) && !panel.contains(e.target)) setOpen(false); });
    panel.addEventListener("click", function (e) { if (e.target.closest("a") && !e.defaultPrevented) setOpen(false); });
  }

  /* 3. SCROLL HELPERS (sticky shadow, back-to-top button) ------------------- */
  function initScroll() {
    var header = $("[data-header]");
    var toTop = $(".fab--top");
    var ticking = false;

    function update() {
      ticking = false;
      if (header) header.classList.toggle("is-stuck", window.scrollY > 4 && header.getBoundingClientRect().top <= 0);
      if (toTop) toTop.classList.toggle("is-visible", window.scrollY > 500);
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* 4. TABS (industries, portfolio, why choose us) -------------------------- */
  function initTabs() {
    $$("[data-tabs]").forEach(function (root) {
      var tabs = $$('[role="tab"]', root);

      function select(tab, moveFocus) {
        tabs.forEach(function (t) {
          var active = t === tab;
          var panel = document.getElementById(t.getAttribute("aria-controls"));
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", String(active));
          t.tabIndex = active ? 0 : -1;
          if (panel) panel.hidden = !active;
        });
        if (moveFocus) tab.focus();
        // In a swipeable tab row, bring the chosen tab fully into view
        var shown = document.getElementById(tab.getAttribute("aria-controls"));
        if (moveFocus === false && shown && shown.classList.contains("industry") && shown.getBoundingClientRect().top < 90) {
          shown.parentNode.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        }
      }

      tabs.forEach(function (tab, i) {
        tab.addEventListener("click", function () { select(tab, false); });
        tab.addEventListener("keydown", function (e) {
          var next = null;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") next = tabs[(i + 1) % tabs.length];
          else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = tabs[(i - 1 + tabs.length) % tabs.length];
          else if (e.key === "Home") next = tabs[0];
          else if (e.key === "End") next = tabs[tabs.length - 1];
          if (next) { e.preventDefault(); select(next, true); }
        });
      });
    });
  }

  /* 5. CAROUSELS ------------------------------------------------------------ */
  // Slides per view and gap come from the CSS variables --per-view and --gap,
  // so breakpoints stay in the stylesheet.
  function Carousel(root) {
    var viewport = $(".carousel__viewport", root);
    var track = $(".carousel__track", root);
    var slides = $$(".carousel__slide", root);
    var dotsWrap = $("[data-carousel-dots]", root);
    var prevBtn = $("[data-carousel-prev]", root);
    var nextBtn = $("[data-carousel-next]", root);
    var delay = reduceMotion ? 0 : parseInt(root.getAttribute("data-autoplay"), 10) || 0;
    var index = 0, pages = 1, timer = null, dots = [];
    if (!viewport || !track || !slides.length) return;

    function perView() {
      return Math.max(1, parseInt(getComputedStyle(root).getPropertyValue("--per-view"), 10) || 1);
    }
    function step() {
      return slides[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
    }
    function render() {
      track.style.transform = "translate3d(" + (-index * step()) + "px,0,0)";
      dots.forEach(function (dot, i) { dot.setAttribute("aria-current", String(i === index)); });
      var visible = perView();
      slides.forEach(function (slide, i) {
        var shown = i >= index && i < index + visible;
        slide.setAttribute("aria-hidden", String(!shown));
        if ("inert" in slide) slide.inert = !shown;
      });
    }
    function go(i) {
      index = (i + pages) % pages;
      render();
    }
    function build() {
      var count = Math.max(1, slides.length - perView() + 1);
      if (count !== pages || !dots.length) {
        pages = count;
        if (dotsWrap) {
          dotsWrap.innerHTML = "";
          dots = [];
          for (var i = 0; i < pages; i++) {
            var dot = document.createElement("button");
            dot.type = "button";
            dot.setAttribute("aria-label", "Show slide " + (i + 1) + " of " + pages);
            dot.addEventListener("click", go.bind(null, i));
            dotsWrap.appendChild(dot);
            dots.push(dot);
          }
          dotsWrap.hidden = pages < 2;
        }
      }
      index = Math.min(index, pages - 1);
      track.classList.add("is-dragging");            // skip the transition while re-measuring
      render();
      void track.offsetWidth;
      track.classList.remove("is-dragging");
    }

    function play() {
      stop();
      if (delay && pages > 1) timer = window.setInterval(function () { go(index + 1); }, delay);
    }
    function stop() { if (timer) { window.clearInterval(timer); timer = null; } }

    if (prevBtn) prevBtn.addEventListener("click", function () { go(index - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { go(index + 1); });

    // Swipe / drag
    var startX = 0, startY = 0, dx = 0, dragging = false, pointerId = null;
    viewport.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.target.closest("button, a")) return;
      pointerId = e.pointerId; startX = e.clientX; startY = e.clientY; dx = 0; dragging = false;
    });
    viewport.addEventListener("pointermove", function (e) {
      if (e.pointerId !== pointerId) return;
      dx = e.clientX - startX;
      if (!dragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - startY)) {
        dragging = true;
        track.classList.add("is-dragging");
        try { viewport.setPointerCapture(pointerId); } catch (err) { /* older browsers */ }
      }
      if (dragging) track.style.transform = "translate3d(" + (-index * step() + dx) + "px,0,0)";
    });
    function endDrag(e) {
      if (e.pointerId !== pointerId) return;
      pointerId = null;
      if (!dragging) return;
      dragging = false;
      track.classList.remove("is-dragging");
      if (dx < -50 && index < pages - 1) go(index + 1);
      else if (dx > 50 && index > 0) go(index - 1);
      else render();
    }
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);

    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") go(index - 1);
      else if (e.key === "ArrowRight") go(index + 1);
    });

    // Autoplay pauses while the visitor is interacting or the tab is hidden
    root.addEventListener("pointerenter", stop);
    root.addEventListener("pointerleave", play);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", play);
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : play(); });

    // Re-measure on resize and when a hidden tab panel becomes visible
    if ("ResizeObserver" in window) new ResizeObserver(build).observe(viewport);
    else window.addEventListener("resize", build);

    build();
    play();
  }

  /* 6. FAQ ACCORDION -------------------------------------------------------- */
  function initAccordion() {
    $$("[data-accordion]").forEach(function (root) {
      var buttons = $$(".faq__q", root);
      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          var open = button.getAttribute("aria-expanded") !== "true";
          buttons.forEach(function (b) {
            var on = b === button && open;
            b.setAttribute("aria-expanded", String(on));
            b.closest(".faq__item").classList.toggle("is-open", on);
          });
        });
      });
    });
  }

  // Pages marked <div data-faq-schema> get FAQPage structured data built from the visible questions
  function initFaqSchema() {
    $$("[data-faq-schema]").forEach(function (root) {
      var items = $$(".faq__item", root).map(function (item) {
        return {
          "@type": "Question",
          name: $(".faq__q span", item).textContent.trim(),
          acceptedAnswer: { "@type": "Answer", text: $(".faq__a", item).textContent.replace(/\s+/g, " ").trim() }
        };
      });
      if (!items.length) return;
      var tag = document.createElement("script");
      tag.type = "application/ld+json";
      tag.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items });
      document.head.appendChild(tag);
    });
  }

  /* 7. SCROLL REVEAL -------------------------------------------------------- */
  function initReveal() {
    var items = $$("[data-reveal]");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-revealed"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* 8. FEATURE CARDS & PROPOSAL BUTTONS ------------------------------------- */
  function initFeatureCards() {
    var touch = window.matchMedia("(hover: none)");

    var cardsInView = $$("[data-feature-card]");
    if ("IntersectionObserver" in window && !reduceMotion) {
      var seen = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add("is-inview"); seen.unobserve(entry.target); }
        });
      }, { threshold: 0.25 });
      cardsInView.forEach(function (card) { seen.observe(card); });
    } else cardsInView.forEach(function (card) { card.classList.add("is-inview"); });

    $$("[data-feature-card]").forEach(function (card) {
      // Hover reveals the overlay on desktop; on touch screens a tap toggles it
      card.addEventListener("click", function (e) {
        if (e.target.closest(".proposal")) return;
        if (touch.matches) {
          card.classList.toggle("is-open");
          if (!card.classList.contains("is-open")) card.blur();
        }
      });
      card.addEventListener("keydown", function (e) {
        if (e.target === card && e.key === "Escape") { card.classList.remove("is-open"); card.blur(); }
      });
    });

    // "Send Me a Proposal": carry the typed website to that service's own form
    $$("[data-proposal]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var website = form.elements.website.value.trim();
        window.location.href = localHref(form.getAttribute("data-proposal") +
          (website ? "?website=" + encodeURIComponent(website) : "") + "#quote");
      });
    });

    // "Get a Quote Now" and the footer button share the contact form
    $$("[data-quote]").forEach(function (link) {
      link.addEventListener("click", function () {
        var form = $('form[data-form="Contact"]');
        if (form && !form.elements.subject.value) form.elements.subject.value = "Quote request";
      });
    });
  }

  /* 9. FORMS (contact form + service quote forms) --------------------------- */
  var FIELD_LABELS = { name: "Name", email: "Email", subject: "Subject", message: "Message",
                       website: "Website", company: "Company", phone: "Phone", budget: "Budget", service: "Service" };

  function formEndpoint() {
    var forms = CFG.forms || {};
    var to = forms.to || CFG.email || "";
    return forms.endpoint ? String(forms.endpoint).replace("{email}", encodeURIComponent(to).replace(/%40/g, "@")) : "";
  }

  function sendForm(formName, data) {
    var endpoint = formEndpoint();
    var payload = {};
    var subject = (CFG.name || "Website") + ": " + formName + (data.Name ? " from " + data.Name : "");
    Object.keys(data).forEach(function (key) { if (data[key]) payload[key] = data[key]; });
    payload.Form = formName;
    payload.Page = location.href.split("#")[0];
    if (/formsubmit\.co/.test(endpoint)) {
      payload._subject = subject;
      payload._template = "table";
      payload._captcha = "false";
      if (data.Email) payload._replyto = data.Email;
    } else {
      payload.subject = subject;
    }
    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    }).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (body) {
        if (!response.ok || body.success === false || body.success === "false") {
          var error = new Error(body.message || "Request failed: " + response.status);
          error.needsActivation = /activat/i.test(body.message || "");
          throw error;
        }
        return body;
      });
    });
  }

  function initForms() {
    var params = new URLSearchParams(location.search);

    $$("form[data-form]").forEach(function (form) {
      var formName = form.getAttribute("data-form");
      var status = $("[data-form-status]", form);
      var button = $('button[type="submit"]', form);
      var label = button.textContent;
      var f = form.elements;

      // Values passed in from another page or set in the markup
      if (f.website && params.get("website")) f.website.value = params.get("website");
      if (f.subject && form.getAttribute("data-subject") && !f.subject.value) f.subject.value = form.getAttribute("data-subject");

      function say(message, kind) {
        status.className = "form-status" + (kind ? " is-" + kind : "");
        status.textContent = message;
      }
      function emailLink() {
        var link = document.createElement("a");
        link.href = "mailto:" + (CFG.email || "");
        link.textContent = CFG.email || "email";
        return link;
      }
      function invalid(field, message) {
        field.setAttribute("aria-invalid", "true");
        field.focus();
        say(message, "error");
      }
      function fieldName(field) {
        var lbl = field.id ? $('label[for="' + field.id + '"]', form) : null;
        return (lbl ? lbl.textContent : field.name).replace(/\s*\*\s*$/, "").trim();
      }

      form.addEventListener("input", function (e) { e.target.removeAttribute("aria-invalid"); });
      form.addEventListener("change", function (e) { e.target.removeAttribute("aria-invalid"); });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (f._honey && f._honey.value) return;                              // spam trap

        var data = {};
        var fields = $$("input, select, textarea", form).filter(function (el) { return el.name && el.name.charAt(0) !== "_"; });
        for (var i = 0; i < fields.length; i++) {
          var field = fields[i];
          var value = field.value.trim();
          if (field.required && !value) {
            return invalid(field, field.tagName === "SELECT" ? "Choose an option for " + fieldName(field) + "." : "Fill in " + fieldName(field) + ".");
          }
          if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return invalid(field, "Enter a valid email address, like name@example.com.");
          }
          data[FIELD_LABELS[field.name] || field.name] = value;
        }

        if (location.protocol === "file:") {
          say("Forms send email only from the live website. Upload the site and test it there.", "error");
          return;
        }
        if (!formEndpoint()) {
          say("No form endpoint is set in js/config.js.", "error");
          return;
        }

        button.disabled = true;
        button.textContent = "Sending...";
        say("");
        sendForm(formName, data).then(function () {
          track("generate_lead", { form_name: formName });
          form.reset();
          if (f.subject && form.getAttribute("data-subject")) f.subject.value = form.getAttribute("data-subject");
          say("Message sent successfully. We will reply to " + data.Email + " soon.", "success");
        }).catch(function (error) {
          if (error.needsActivation) {
            say("One step left: this form needs a one-time activation. Open the inbox of " + (CFG.email || "the site email") + " and click the Activate link, then send again.", "error");
          } else {
            say("The message could not be sent. Check your connection and try again, or email us at ", "error");
            status.appendChild(emailLink());
          }
        }).then(function () {
          button.disabled = false;
          button.textContent = label;
        });
      });
    });
  }

  /* 10. PORTFOLIO (built from SITE_CONFIG.portfolio) ------------------------ */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function prettyUrl(url) {
    return String(url).trim().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
  }
  function withFallback(img, remote, placeholder) {
    if (remote) img.setAttribute("data-remote", remote);
    if (placeholder) img.setAttribute("data-placeholder", placeholder);
    img.onerror = function () { if (window.imgFallback) window.imgFallback(img); };
    return img;
  }

  // SEO tab: one slide per project, "Real Result" opens the ranking table
  function renderSeoProjects() {
    var track = $('[data-portfolio="seo"]');
    var projects = (CFG.portfolio && CFG.portfolio.seo) || [];
    if (!track) return;

    projects.forEach(function (project) {
      var slide = el("li", "carousel__slide");
      var card = el("article", "project");
      var media = el("div", "project__media");
      var img = withFallback(el("img"), project.remote, "assets/img/result-seo.svg");
      img.alt = project.title + " search performance graph";
      img.loading = "lazy";
      img.src = project.image || project.remote || "assets/img/result-seo.svg";
      media.appendChild(img);

      var button = el("button", "project__link", "Real Result");
      button.type = "button";
      button.addEventListener("click", function () {
        openResult({
          title: project.title,
          link: project.link,
          images: [{ src: project.image, remote: project.remote, alt: project.title + " search performance graph" }],
          placeholder: "assets/img/result-seo.svg",
          rows: project.rows,
          proposal: "/seo-services"
        });
      });

      card.appendChild(media);
      card.appendChild(el("h4", "", project.title));
      card.appendChild(button);
      slide.appendChild(card);
      track.appendChild(slide);
    });
  }

  // Digital marketing tab: fanned cards, each with its campaign screenshots
  function renderMarketingCards() {
    var wrap = $('[data-portfolio="marketing"]');
    var cards = (CFG.portfolio && CFG.portfolio.marketing) || [];
    if (!wrap) return;

    cards.forEach(function (item) {
      var card = el("article", "fan__card");
      card.style.setProperty("--card", item.color || "var(--brand-600)");
      card.style.setProperty("--tilt", (Number(item.tilt) || 0) + "deg");

      var copy = el("div");
      copy.appendChild(el("h3", "", item.title));
      copy.appendChild(el("p", "", item.text));
      card.appendChild(copy);

      var shots = item.results || [];
      if (shots.length) {
        var button = el("button", "fan__btn", "Real Result");
        button.type = "button";
        button.setAttribute("aria-label", "Real result for " + item.title);
        button.addEventListener("click", function () {
          openResult({
            title: item.title,
            note: item.note,
            images: shots.map(function (src, n) {
              return { src: src, alt: item.title + " campaign performance screenshot " + (n + 1) };
            }),
            placeholder: "assets/img/result-marketing.svg",
            proposal: "/digital-marketing"
          });
        });
        card.appendChild(button);
      }
      wrap.appendChild(card);
    });
  }

  // One dialog shows either kind of result: screenshots, plus a ranking table when rows are given
  function openResult(result) {
    var dialog = $("[data-result-dialog]");
    if (!dialog || !result) return;

    $("[data-result-title]", dialog).textContent = result.title;
    $("[data-result-project]", dialog).hidden = !result.link;
    if (result.link) $("[data-result-link]", dialog).href = result.link;
    $("[data-result-proposal]", dialog).setAttribute("href", localHref((result.proposal || "/seo-services") + "#quote"));

    var figures = $("[data-result-images]", dialog);
    figures.textContent = "";
    if (result.note) figures.appendChild(el("p", "result__note", result.note));
    (result.images || []).forEach(function (image) {
      var figure = el("figure", "result__figure");
      var img = withFallback(el("img"), image.remote, result.placeholder);
      img.alt = image.alt || result.title;
      img.src = image.src || image.remote || result.placeholder;
      figure.appendChild(img);
      figures.appendChild(figure);
    });

    var rows = result.rows || [];
    var body = $("[data-result-rows]", dialog);
    body.textContent = "";
    rows.forEach(function (row, n) {
      var tr = el("tr");
      tr.appendChild(el("td", "", n + 1));
      tr.appendChild(el("td", "", row.keyword));

      var rankCell = el("td");
      if (row.proof) {
        var proof = el("a", "result__rank", row.rank);
        proof.href = row.proof; proof.target = "_blank"; proof.rel = "noopener";
        proof.setAttribute("aria-label", "Rank " + row.rank + " for " + row.keyword + ", open proof");
        rankCell.appendChild(proof);
      } else rankCell.textContent = row.rank;
      tr.appendChild(rankCell);

      var urlCell = el("td");
      if (row.url) {
        var link = el("a", "", prettyUrl(row.url));
        link.href = row.url.trim(); link.target = "_blank"; link.rel = "noopener";
        urlCell.appendChild(link);
      }
      tr.appendChild(urlCell);
      body.appendChild(tr);
    });
    $("[data-result-table-wrap]", dialog).hidden = !rows.length;

    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    dialog.scrollTop = 0;
  }

  function initResultDialog() {
    var dialog = $("[data-result-dialog]");
    if (!dialog) return;
    function close() { if (dialog.open) dialog.close(); }
    $("[data-result-close]", dialog).addEventListener("click", close);
    dialog.addEventListener("click", function (e) { if (e.target === dialog) close(); });   // click on the backdrop
    // "Send Me a Proposal" goes to that service's form; if we are already on that page, just scroll to it
    $("[data-result-proposal]", dialog).addEventListener("click", function (e) {
      var slug = function (path) { return path.split("#")[0].split("?")[0].split("/").pop().replace(/\.html$/, ""); };
      close();
      // Already on that service page: open its proposal form instead of reloading
      if (slug(this.getAttribute("href")) === slug(location.pathname) && openQuote({})) e.preventDefault();
    });
  }

  // Web tab: a laptop + phone mockup per URL, screenshots fetched from the
  // service set in SITE_CONFIG.screenshot
  function screenshotUrl(template, url) {
    return String(template || "").replace("{url}", encodeURIComponent(url)).replace("{rawurl}", url);
  }

  function loadShot(img, src, screen) {
    var tries = 0, maxTries = 8;
    img.onload = function () {
      // mShots answers with a 400x300 "generating" image while it works: ask again shortly
      if (img.naturalWidth === 400 && img.naturalHeight === 300 && /mshots/.test(src) && tries < maxTries) {
        tries++;
        window.setTimeout(function () { img.src = src + (src.indexOf("?") > -1 ? "&" : "?") + "retry=" + tries; }, 3500);
        return;
      }
      screen.classList.add("is-loaded");
      markTall(img, screen);
    };
    img.onerror = function () { img.onerror = null; screen.classList.add("is-failed"); };
    img.src = src;
  }

  // A screenshot much taller than its frame is a full-page capture: let it scroll on hover.
  // The speed is set from how far the page has to travel.
  function markTall(img, screen) {
    var frameW = screen.clientWidth, frameH = screen.clientHeight;
    if (!frameW || !frameH || !img.naturalWidth) return;
    var renderedH = frameW * img.naturalHeight / img.naturalWidth;
    var extra = renderedH / frameH - 1;
    if (extra < 0.25) return;
    screen.classList.add("is-tall");
    screen.style.setProperty("--pan", Math.min(14, Math.max(3, extra * 2.2)).toFixed(1) + "s");
    if (screen.getAttribute("data-hint") && !$(".mockup__hint", screen)) screen.appendChild(el("span", "mockup__hint", screen.getAttribute("data-hint")));
  }

  function buildScreen(src, label, alt) {
    var screen = el("span", "mockup__screen");
    screen.appendChild(el("span", "mockup__label", label));
    var img = el("img");
    img.alt = alt;
    img.loading = "lazy";
    screen.appendChild(img);
    loadShot(img, src, screen);
    return screen;
  }

  function renderWebProjects() {
    var grid = $('[data-portfolio="web"]');
    var projects = (CFG.portfolio && CFG.portfolio.web) || [];
    var shots = CFG.screenshot || {};
    if (!grid) return;

    projects.forEach(function (project) {
      if (!project || !project.url) return;
      var domain = prettyUrl(project.url).split("/")[0];
      var title = project.title || domain;

      var card = el("a", "mockup");
      card.href = project.url; card.target = "_blank"; card.rel = "noopener";
      card.setAttribute("aria-label", title + ", open " + domain + " in a new tab");

      var stage = el("span", "mockup__stage");
      var desktop = el("span", "mockup__desktop");
      var bar = el("span", "mockup__bar");
      bar.appendChild(el("i")); bar.appendChild(el("i")); bar.appendChild(el("i"));
      bar.appendChild(el("span", "mockup__url", domain));
      desktop.appendChild(bar);
      var desktopScreen = buildScreen(project.image || screenshotUrl(shots.desktop, project.url), domain, title + " website on desktop");
      desktopScreen.setAttribute("data-hint", "Hover to scroll");
      desktop.appendChild(desktopScreen);
      stage.appendChild(desktop);

      var mobileSrc = project.mobileImage || (shots.mobile ? screenshotUrl(shots.mobile, project.url) : "");
      if (project.phone !== false && mobileSrc) {
        var phone = el("span", "mockup__phone");
        phone.appendChild(buildScreen(mobileSrc, "", ""));
        stage.appendChild(phone);
      }

      card.appendChild(stage);
      card.appendChild(el("span", "mockup__title", title));
      card.appendChild(el("span", "mockup__domain", domain));
      grid.appendChild(card);
    });
  }

  /* 11. PROPOSAL FORM POP-UP (service pages) -------------------------------- */
  // Opens from: the "enter your website" bars, every "Get a Proposal" button,
  // any link to #quote, and automatically when the page is opened with #quote or ?website=
  function openQuote(options) {
    var dialog = $("[data-quote-dialog]");
    if (!dialog) return false;
    var f = $("form", dialog).elements;
    options = options || {};
    if (options.website) f.website.value = options.website;
    if (options.service && f.service) {
      $$("option", f.service).forEach(function (option) {
        if (option.textContent.trim() === options.service) f.service.value = option.value || option.textContent;
      });
    }
    if (!dialog.open) {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    }
    dialog.scrollTop = 0;
    f.name.focus();
    return true;
  }

  function initQuoteDialog() {
    var dialog = $("[data-quote-dialog]");
    if (!dialog) return;
    function close() { if (dialog.open) dialog.close(); }
    $("[data-quote-close]", dialog).addEventListener("click", close);
    dialog.addEventListener("click", function (e) { if (e.target === dialog) close(); });

    $$("[data-quote-bar]").forEach(function (bar) {
      bar.addEventListener("submit", function (e) {
        e.preventDefault();
        openQuote({ website: bar.elements.website.value.trim() });
      });
    });
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest('a[href="#quote"], [data-quote-open]');
      if (trigger && openQuote({ service: trigger.getAttribute("data-service") })) e.preventDefault();
    });

    var params = new URLSearchParams(location.search);
    if (location.hash === "#quote" || params.get("website")) openQuote({ website: params.get("website") });
  }

  /* 11b. INTRO VIDEO + "FREE WEBSITE REVIEW" BOX (home page) ---------------- */
  function initIntroVideo() {
    var box = $("[data-video]");
    var video = CFG.video || {};
    if (box) {
      var poster = $(".intro-video__poster", box);
      var play = $(".intro-video__play", box);
      var caption = $(".intro-video__caption", box);
      var match = String(video.youtube || "").match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})|^([\w-]{11})$/);
      var id = match ? (match[1] || match[2]) : "";
      var builtIn = !video.poster || /video-poster\.svg$/.test(video.poster);

      if (video.poster && !builtIn) poster.src = video.poster;
      else if (id) {                                   // no custom picture: use the video's own thumbnail
        var fallback = poster.src;
        poster.onerror = function () { poster.onerror = null; poster.src = fallback; };
        poster.src = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
      }
      if (video.caption) { caption.textContent = video.caption; caption.hidden = false; }

      if (id || video.file) {
        play.hidden = false;
        play.addEventListener("click", function () {
          var player;
          if (id) {
            player = document.createElement("iframe");
            player.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
            player.allow = "accelerometer; autoplay; encrypted-media; picture-in-picture";
            player.allowFullscreen = true;
            player.title = "PK IT Sol video";
          } else {
            player = document.createElement("video");
            player.src = video.file;
            player.controls = true; player.autoplay = true; player.playsInline = true;
            if (!builtIn) player.poster = video.poster;
          }
          box.textContent = "";
          box.appendChild(player);
          track("video_play", {});
        });
      }
    }

    // "Get a Free Website Review": carries the address to the contact form
    $$("[data-review-bar]").forEach(function (bar) {
      bar.addEventListener("submit", function (e) {
        e.preventDefault();
        var form = $('form[data-form="Contact"]');
        if (!form) return;
        var website = bar.elements.website.value.trim();
        form.elements.subject.value = "Free website review";
        form.elements.message.value = (website ? "Website: " + website + "\n" : "") + "Please review my website and tell me where the biggest opportunities are.\n";
        var target = $("#contact");
        if (target) target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        window.setTimeout(function () { form.elements.name.focus({ preventScroll: true }); }, reduceMotion ? 0 : 700);
        track("review_request_start", {});
      });
    });
  }

  /* 12. ANALYTICS (optional: set the IDs in js/config.js -> analytics) -------- */
  // Records the actions that matter for leads: a form sent, a call, a WhatsApp chat, an email.
  function track(name, params) {
    params = params || {};
    window.dataLayer = window.dataLayer || [];
    var entry = { event: name };
    Object.keys(params).forEach(function (key) { entry[key] = params[key]; });
    window.dataLayer.push(entry);
    if (typeof window.gtag === "function") window.gtag("event", name, params);
    if (typeof window.fbq === "function") {
      if (name === "generate_lead") window.fbq("track", "Lead", params);
      else if (/^click_/.test(name)) window.fbq("track", "Contact", params);
      else window.fbq("trackCustom", name, params);
    }
  }

  function initAnalytics() {
    var ids = CFG.analytics || {};
    window.dataLayer = window.dataLayer || [];
    function load(src) { var s = document.createElement("script"); s.async = true; s.src = src; document.head.appendChild(s); }

    if (ids.gtm) {
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      load("https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(ids.gtm));
    }
    if (ids.ga4) {
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", ids.ga4);
      load("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ids.ga4));
    }
    if (ids.metaPixel) {
      var fbq = window.fbq = function () { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments); };
      fbq.push = fbq; fbq.loaded = true; fbq.version = "2.0"; fbq.queue = [];
      load("https://connect.facebook.net/en_US/fbevents.js");
      fbq("init", String(ids.metaPixel));
      fbq("track", "PageView");
    }

    document.addEventListener("click", function (e) {
      var link = e.target.closest("a[href]");
      if (!link) return;
      var href = link.getAttribute("href");
      if (/^tel:/.test(href)) track("click_call", { link_text: link.textContent.trim() });
      else if (/wa\.me|api\.whatsapp/.test(href)) track("click_whatsapp", { link_text: link.textContent.trim() });
      else if (/^mailto:/.test(href)) track("click_email", {});
    });
  }

  // Numbers under the hero count up once when they come into view
  function initCounters() {
    var numbers = $$("[data-count]");
    if (!numbers.length || reduceMotion || !("IntersectionObserver" in window)) return;
    function run(node) {
      var target = parseFloat(node.getAttribute("data-count")) || 0;
      var suffix = node.getAttribute("data-suffix") || "";
      var start = null, duration = 1200;
      function frame(now) {
        if (start === null) start = now;
        var t = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - t, 3);                     // fast at first, settling at the end
        node.textContent = Math.round(target * eased) + (t === 1 ? suffix : "");
        if (t < 1) window.requestAnimationFrame(frame);
      }
      node.textContent = "0";
      window.requestAnimationFrame(frame);
    }
    var watcher = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run(entry.target); watcher.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    numbers.forEach(function (node) { watcher.observe(node); });
  }

  /* BOOT -------------------------------------------------------------------- */
  function init() {
    initAnalytics();
    applyBrand();
    markCurrentPage();
    initHomeLinks();
    initHeader();
    initServicesMenu();
    initScroll();
    initTabs();
    renderSeoProjects();                              // must run before the carousels are measured
    renderMarketingCards();
    renderWebProjects();
    $$("[data-carousel]").forEach(Carousel);
    initAccordion();
    initFaqSchema();
    initReveal();
    initFeatureCards();
    initForms();
    initResultDialog();
    initQuoteDialog();
    initIntroVideo();
    initCounters();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
