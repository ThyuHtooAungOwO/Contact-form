const form = document.querySelector(".form-container");
const successContainer = document.querySelector(".success-container");

function isEmpty(inputEl) {
  return !inputEl.value.trim();
}

function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email.trim());
}

function showError(inputEl, errorEl) {
  if (errorEl) {
    errorEl.classList.remove("hidden");
  }
  if (inputEl.hasAttribute("aria-invalid")) {
    inputEl.setAttribute("aria-invalid", "true");
  }
}

function hideError(inputEl, errorEl) {
  if (errorEl) {
    errorEl.classList.add("hidden");
  }
  if (inputEl.hasAttribute("aria-invalid")) {
    inputEl.setAttribute("aria-invalid", "false");
  }
}

function resetErrors() {
  form.querySelectorAll(".error-message").forEach((el) => {
    if (!el.classList.contains("hidden")) {
      el.classList.add("hidden");
    }
  });

  form.querySelectorAll("[aria-invalid='true']").forEach((el) => {
    el.setAttribute("aria-invalid", "false");
  });
}

const validationRules = [
  {
    input: document.getElementById("first-name"),
    errorElement: document.getElementById("first-name-error"),
    validate: (input) => !isEmpty(input),
  },
  {
    input: document.getElementById("last-name"),
    errorElement: document.getElementById("last-name-error"),
    validate: (input) => !isEmpty(input),
  },
  {
    input: document.getElementById("email"),
    errorElement: document.getElementById("email-error"),
    validate: (input) => !isEmpty(input) && isValidEmail(input.value),
  },
  {
    input: form.querySelector("input[name='query-type']"),
    errorElement: document.getElementById("query-type-error"),
    validate: () => form.querySelector("input[name='query-type']:checked"),
  },
  {
    input: document.getElementById("message"),
    errorElement: document.getElementById("message-error"),
    validate: (input) => !isEmpty(input),
  },
  {
    input: document.getElementById("agree"),
    errorElement: document.getElementById("consent-error"),
    validate: (input) => input.checked,
  },
];

validationRules.forEach((rule) => {
  if (rule.input) {
    if (rule.input.type !== "radio" && rule.input.type !== "checkbox") {
      rule.input.addEventListener("input", () => {
        if (rule.validate(rule.input)) {
          hideError(rule.input, rule.errorElement);
        } else {
          showError(rule.input, rule.errorElement);
        }
      });
      rule.input.addEventListener("blur", () => {
        if (rule.validate(rule.input)) {
          hideError(rule.input, rule.errorElement);
        } else {
          showError(rule.input, rule.errorElement);
        }
      });
    }

    if (rule.input.type === "radio") {
      const radioGroup = form.querySelectorAll("input[name='query-type']");
      radioGroup.forEach((radio) => {
        radio.addEventListener("change", () => {
          if (rule.validate()) {
            hideError(rule.input, rule.errorElement);
          } else {
            showError(rule.input, rule.errorElement);
          }
        });
      });
    }

    if (rule.input.type === "checkbox") {
      rule.input.addEventListener("change", () => {
        if (rule.validate(rule.input)) {
          hideError(rule.input, rule.errorElement);
        } else {
          showError(rule.input, rule.errorElement);
        }
      });
    }
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  resetErrors();

  let hasError = false;
  let firstInvalidInput = null;

  validationRules.forEach((rule) => {
    if (!rule.validate(rule.input)) {
      hasError = true;
      showError(rule.input, rule.errorElement);

      if (!firstInvalidInput && rule.input.focus) {
        firstInvalidInput = rule.input;
      }
    }
  });

  if (hasError && firstInvalidInput) {
    firstInvalidInput.focus();
  }

  if (!hasError) {
    console.log("Form submitted successfully!");
    successContainer.classList.remove("hidden");
    form.reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      successContainer.classList.add("hidden");
    }, 6000);
  }
});
