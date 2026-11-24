const EMAIL_PATTERN = /^[a-z0-9_%+-]+(?:\.[a-z0-9_%+-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;
const PHONE_PATTERN = /^\+380\d{9}$/;

const form = document.querySelector('#feedback-form');
const fields = form.querySelector('fieldset');
const submitButton = form.querySelector('button[type="submit"]');
const dialog = document.querySelector('#feedback-dialog');
const reviewed = new Set();

const rules = {
  name: field => [...field.value.trim()].length >= 2,
  email: field => EMAIL_PATTERN.test(field.value.trim()),
  phone: field => PHONE_PATTERN.test(field.value.trim()),
  consent: field => field.checked,
};

const requiredFields = Array.from(fields.querySelectorAll('[required]'));
const hints = new Map(requiredFields.map(field => [field, field.getAttribute('aria-describedby')]));

function showFieldError(field, invalid) {
  const errorId = `${field.id}-error`;
  const description = [hints.get(field), invalid && errorId].filter(Boolean).join(' ');
  if (description) {
    field.setAttribute('aria-describedby', description);
  } else {
    field.removeAttribute('aria-describedby');
  }
  document.getElementById(errorId).setAttribute('aria-hidden', String(!invalid));
}

function validateField(field) {
  const valid = rules[field.name](field);

  reviewed.add(field);
  field.dataset.state = valid ? 'valid' : 'invalid';
  field.setAttribute('aria-invalid', String(!valid));
  showFieldError(field, !valid);
  return valid;
}

for (const field of requiredFields) {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (reviewed.has(field) || field.type === 'checkbox') validateField(field);
  });
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (dialog.open) return;

  const invalidFields = requiredFields.filter(field => !validateField(field));
  if (invalidFields.length > 0) {
    invalidFields[0].focus();
    return;
  }

  dialog.showModal();
  form.reset();
  reviewed.clear();
  for (const field of requiredFields) {
    delete field.dataset.state;
    field.removeAttribute('aria-invalid');
    showFieldError(field, false);
  }
});

dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => submitButton.focus());

// Enable the form after the handler that prevents network submission is ready.
fields.disabled = false;
document.querySelector('#feedback-unavailable').hidden = true;
