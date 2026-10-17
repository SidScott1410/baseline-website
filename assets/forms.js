/* Baseline forms. Recipients are configured at the form provider, never trusted from the browser. */
(function () {
  "use strict";

  var join = document.getElementById("join");
  var newsletter = document.getElementById("newsletter");
  var lanes = ["labs", "research"];
  var currentLane = "labs";

  function setLane(lane) {
    if (lanes.indexOf(lane) === -1 || join.getAttribute("aria-busy") === "true") return false;
    currentLane = lane;
    var endpoint = join.dataset[lane + "Endpoint"];
    if (endpoint) join.action = endpoint;
    lanes.forEach(function (value) {
      var tab = document.getElementById("tab-" + value);
      var panel = document.getElementById(value === "labs" ? "partner" : "research");
      var active = value === lane;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      tab.style.background = active ? "#0B1F3A" : "#FFFFFF";
      tab.style.color = active ? "#FFFFFF" : "#0B1F3A";
      panel.hidden = !active;
      panel.style.display = active ? "flex" : "none";
      panel.querySelectorAll("input,select,textarea,button").forEach(function (field) {
        field.disabled = !active || (field.matches('button[type="submit"]') && !endpointConfigured(join));
      });
    });
    document.getElementById("lane-field").value = lane;
    clearStatus(join);
    return true;
  }

  document.querySelectorAll("[data-tab]").forEach(function (tab) {
    tab.addEventListener("click", function () { setLane(tab.dataset.tab); });
    tab.addEventListener("keydown", function (event) {
      var lane;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        lane = currentLane === "labs" ? "research" : "labs";
      } else if (event.key === "Home") {
        lane = "labs";
      } else if (event.key === "End") {
        lane = "research";
      } else {
        return;
      }
      event.preventDefault();
      if (setLane(lane)) document.getElementById("tab-" + lane).focus();
    });
  });
  document.querySelectorAll("[data-lane]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      if (!setLane(link.dataset.lane)) event.preventDefault();
    });
  });

  function clearStatus(form) {
    var status = form.querySelector("[data-form-status]");
    status.hidden = true;
    status.textContent = "";
    status.removeAttribute("data-state");
  }

  function showStatus(form, message, state) {
    var status = form.querySelector("[data-form-status]");
    status.textContent = message;
    status.dataset.state = state;
    status.hidden = false;
  }

  function endpointConfigured(form) {
    var url = new URL(form.action, window.location.href);
    return url.protocol === "https:" && !/REPLACE_WITH_|YOUR_FORM_ID/.test(url.href);
  }

  function wireForm(form, successMessage, unavailableMessage) {
    form.querySelectorAll('button[type="submit"]').forEach(function (button) {
      var panel = button.closest('[role="tabpanel"]');
      button.disabled = !endpointConfigured(form) || !!(panel && panel.hidden);
    });
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (form.getAttribute("aria-busy") === "true" || !form.reportValidity()) return;
      clearStatus(form);
      if (!endpointConfigured(form)) {
        showStatus(form, unavailableMessage, "error");
        return;
      }

      // Capture successful controls before disabling anything. Inactive lane controls are disabled.
      var data = new FormData(form);
      var buttons = Array.from(form.querySelectorAll("button:not(:disabled)"));
      form.setAttribute("aria-busy", "true");
      buttons.forEach(function (button) { button.disabled = true; });
      var controller = new AbortController();
      var timeout = setTimeout(function () { controller.abort(); }, 20000);
      try {
        var response = await fetch(form.action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
          signal: controller.signal
        });
        var result = await response.json().catch(function () { return {}; });
        if (!response.ok) {
          var errors = Array.isArray(result.errors) ? result.errors.map(function (error) {
            return error.message;
          }).filter(Boolean).join(" ") : "";
          throw new Error(errors || "We could not submit this form. Please try again.");
        }
        if (form === join) {
          var submittedLane = data.get("lane");
          var panel = document.getElementById(submittedLane === "labs" ? "partner" : "research");
          panel.querySelectorAll("input,textarea").forEach(function (field) { field.value = ""; });
          panel.querySelectorAll("select").forEach(function (field) { field.selectedIndex = 0; });
        } else {
          form.reset();
        }
        showStatus(form, successMessage, "success");
      } catch (error) {
        var message = error.name === "AbortError"
          ? "The request timed out and delivery could not be confirmed. Please try again or contact us by email."
          : error.message === "Failed to fetch"
            ? "We could not connect. Please check your connection and try again."
            : error.message;
        showStatus(form, message, "error");
      } finally {
        clearTimeout(timeout);
        form.removeAttribute("aria-busy");
        buttons.forEach(function (button) { button.disabled = false; });
      }
    });
  }

  setLane("labs");
  wireForm(join,
    "Thank you. We review every submission personally and will be in touch.",
    "Online submissions are not open yet. Please contact us by email."
  );
  wireForm(newsletter,
    "Subscribed. Thank you.",
    "Newsletter signup is not open yet. Please check back soon."
  );
})();
