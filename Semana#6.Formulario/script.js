const form = document.getElementById("form");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const birthdateInput = document.getElementById("birthdate");

const submitBtn = document.getElementById("submitBtn");
const successBox = document.getElementById("successBox");
const ageHint = document.getElementById("ageHint");

/* Error elements */
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const birthdateError = document.getElementById("birthdateError");

/* Status icons (Bootstrap Icons) */
const nameIcon = document.getElementById("nameIcon");
const emailIcon = document.getElementById("emailIcon");
const passwordIcon = document.getElementById("passwordIcon");
const confirmPasswordIcon = document.getElementById("confirmPasswordIcon");
const birthdateIcon = document.getElementById("birthdateIcon");

/* Password visibility toggles */
const togglePasswordBtn = document.getElementById("togglePassword");
const toggleConfirmPasswordBtn = document.getElementById("toggleConfirmPassword");

/* Regex rules */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/;

/* UI helpers */
function setError(errorEl, message) {
  errorEl.textContent = message;
}

function setFieldState(input, iconEl, isValid) {
  input.classList.remove("valid", "invalid");
  iconEl.classList.remove("valid", "invalid", "bi-check-circle", "bi-x-circle");

  if (isValid) {
    input.classList.add("valid");
    iconEl.classList.add("valid", "bi-check-circle");
  } else {
    input.classList.add("invalid");
    iconEl.classList.add("invalid", "bi-x-circle");
  }
}

function clearFieldState(input, iconEl) {
  input.classList.remove("valid", "invalid");
  iconEl.classList.remove("valid", "invalid", "bi-check-circle", "bi-x-circle");
}

/* Date helper: calculate age based on birth date */
function calculateAge(birthDateStr) {
  const today = new Date();
  const birth = new Date(birthDateStr);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/* Validators */
function validateName() {
  const value = nameInput.value.trim();

  if (value.length === 0) {
    setFieldState(nameInput, nameIcon, false);
    setError(nameError, "El nombre es obligatorio.");
    return false;
  }

  if (value.length < 3) {
    setFieldState(nameInput, nameIcon, false);
    setError(nameError, "Debe tener al menos 3 caracteres.");
    return false;
  }

  setFieldState(nameInput, nameIcon, true);
  setError(nameError, "");
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();

  if (value.length === 0) {
    setFieldState(emailInput, emailIcon, false);
    setError(emailError, "El correo es obligatorio.");
    return false;
  }

  if (!emailRegex.test(value)) {
    setFieldState(emailInput, emailIcon, false);
    setError(emailError, "Formato inválido. Ejemplo: correo@ejemplo.com");
    return false;
  }

  setFieldState(emailInput, emailIcon, true);
  setError(emailError, "");
  return true;
}

function validatePassword() {
  const value = passwordInput.value;

  if (value.length === 0) {
    setFieldState(passwordInput, passwordIcon, false);
    setError(passwordError, "La contraseña es obligatoria.");
    return false;
  }

  if (!passwordRegex.test(value)) {
    setFieldState(passwordInput, passwordIcon, false);
    setError(passwordError, "Mínimo 8 caracteres, con 1 número y 1 carácter especial.");
    return false;
  }

  setFieldState(passwordInput, passwordIcon, true);
  setError(passwordError, "");
  return true;
}

function validateConfirmPassword() {
  const value = confirmPasswordInput.value;
  const pass = passwordInput.value;

  if (value.length === 0) {
    setFieldState(confirmPasswordInput, confirmPasswordIcon, false);
    setError(confirmPasswordError, "Confirma tu contraseña.");
    return false;
  }

  if (value !== pass) {
    setFieldState(confirmPasswordInput, confirmPasswordIcon, false);
    setError(confirmPasswordError, "Las contraseñas no coinciden.");
    return false;
  }

  setFieldState(confirmPasswordInput, confirmPasswordIcon, true);
  setError(confirmPasswordError, "");
  return true;
}

function validateBirthdate() {
  const value = birthdateInput.value;

  if (!value) {
    ageHint.textContent = "Edad calculada: —";
    setFieldState(birthdateInput, birthdateIcon, false);
    setError(birthdateError, "La fecha de nacimiento es obligatoria.");
    return false;
  }

  const age = calculateAge(value);

  if (!Number.isFinite(age) || age < 0) {
    ageHint.textContent = "Edad calculada: —";
    setFieldState(birthdateInput, birthdateIcon, false);
    setError(birthdateError, "Fecha inválida.");
    return false;
  }

  ageHint.textContent = `Edad calculada: ${age} años`;

  if (age < 18) {
    setFieldState(birthdateInput, birthdateIcon, false);
    setError(birthdateError, "Debes ser mayor o igual a 18 años.");
    return false;
  }

  setFieldState(birthdateInput, birthdateIcon, true);
  setError(birthdateError, "");
  return true;
}

/* Aggregated validation */
function validateAll() {
  const okName = validateName();
  const okEmail = validateEmail();
  const okPass = validatePassword();
  const okConfirm = validateConfirmPassword();
  const okBirthdate = validateBirthdate();

  const isFormValid = okName && okEmail && okPass && okConfirm && okBirthdate;
  submitBtn.disabled = !isFormValid;

  if (!isFormValid) {
    successBox.classList.add("hidden");
  }

  return isFormValid;
}

/* Password visibility logic */
function togglePasswordVisibility(input, button) {
  const icon = button.querySelector("i");
  const isHidden = input.type === "password";

  input.type = isHidden ? "text" : "password";

  icon.classList.remove("bi-eye", "bi-eye-slash");
  icon.classList.add(isHidden ? "bi-eye-slash" : "bi-eye");

  button.setAttribute("aria-label", isHidden ? "Ocultar contraseña" : "Mostrar contraseña");
}

/* Event listeners for real-time validation */
nameInput.addEventListener("input", validateAll);
emailInput.addEventListener("input", validateAll);

passwordInput.addEventListener("input", () => {
  validatePassword();
  if (confirmPasswordInput.value.length > 0) {
    validateConfirmPassword();
  }
  validateAll();
});

confirmPasswordInput.addEventListener("input", validateAll);
birthdateInput.addEventListener("change", validateAll);

/* Toggle buttons */
togglePasswordBtn.addEventListener("click", () => togglePasswordVisibility(passwordInput, togglePasswordBtn));
toggleConfirmPasswordBtn.addEventListener("click", () => togglePasswordVisibility(confirmPasswordInput, toggleConfirmPasswordBtn));

/* Submit behavior */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validateAll()) return;

  successBox.classList.remove("hidden");
  alert("Formulario validado correctamente.");
});

/* Reset behavior */
form.addEventListener("reset", () => {
  /* Clear validation states */
  clearFieldState(nameInput, nameIcon);
  clearFieldState(emailInput, emailIcon);
  clearFieldState(passwordInput, passwordIcon);
  clearFieldState(confirmPasswordInput, confirmPasswordIcon);
  clearFieldState(birthdateInput, birthdateIcon);

  /* Clear messages */
  setError(nameError, "");
  setError(emailError, "");
  setError(passwordError, "");
  setError(confirmPasswordError, "");
  setError(birthdateError, "");

  /* Reset dynamic hint */
  ageHint.textContent = "Edad calculada: —";

  /* Ensure submit is disabled again */
  submitBtn.disabled = true;
  successBox.classList.add("hidden");

  /* Restore password fields to hidden state */
  passwordInput.type = "password";
  confirmPasswordInput.type = "password";

  const passIcon = togglePasswordBtn.querySelector("i");
  passIcon.classList.remove("bi-eye-slash");
  passIcon.classList.add("bi-eye");
  togglePasswordBtn.setAttribute("aria-label", "Mostrar contraseña");

  const confirmIcon = toggleConfirmPasswordBtn.querySelector("i");
  confirmIcon.classList.remove("bi-eye-slash");
  confirmIcon.classList.add("bi-eye");
  toggleConfirmPasswordBtn.setAttribute("aria-label", "Mostrar confirmación de contraseña");
});

/* Initial validation (useful if browser autocompletes fields) */
validateAll();
