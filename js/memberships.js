const periods = [
  { id: 'visit', label: 'Разова', duration: '1 відвідування' },
  { id: 'month', label: 'Місяць', duration: '1 місяць' },
  { id: 'quarter', label: 'Три місяці', duration: '3 місяці', freeze: '7 днів' },
  { id: 'half-year', label: 'Півроку', duration: '6 місяців', freeze: '14 днів' },
  { id: 'year', label: 'Рік', duration: '12 місяців', freeze: '1 місяць' },
];

// Prices and terms from https://olimp-strong.com.ua/cards.
const formats = [
  { id: 'single', name: 'Разове заняття', hours: '07:00–22:00', group: 'Ранкові й вечірні, 1 на день', sauna: true, prices: { visit: 250 } },
  { id: 'morning', name: 'Ранкова', hours: '07:00–16:00', group: 'Ранкові, 12 на місяць', program: true, prices: { month: 950, quarter: 2500, 'half-year': 4400, year: 7400 } },
  { id: 'day', name: 'Денна', hours: '12:00–16:00', program: true, prices: { month: 900, quarter: 2350, 'half-year': 4100, year: 6900 } },
  { id: 'unlimited', name: 'Безлімітна', hours: '07:00–22:00', group: 'Ранкові й вечірні, 12 на місяць', program: true, sauna: true, prices: { month: 1100, quarter: 3000, 'half-year': 5300, year: 8900 } },
];

const money = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 0 });
const grid = document.querySelector('#membership-grid');
const filters = document.querySelector('#membership-filters');
const count = document.querySelector('#membership-count');
const template = document.querySelector('#membership-card');
const dialog = document.querySelector('#purchase-dialog');
const form = document.querySelector('#purchase-form');
const phone = document.querySelector('#purchase-phone');
const confirmation = document.querySelector('#purchase-confirmation');
const comparison = document.querySelector('#membership-comparison');

for (const format of formats) {
  if (format.id === 'single') continue;
  const row = comparison.insertRow();
  const title = document.createElement('th');
  title.scope = 'row';
  title.textContent = format.name;
  row.append(title);
  for (const value of [format.hours, format.group || '—', format.sauna ? 'Вт і пт' : '—']) {
    row.insertCell().textContent = value;
  }
}

function openPurchase(name, price) {
  form.reset();
  phone.setCustomValidity('');
  document.querySelector('#purchase-title').textContent = name;
  document.querySelector('#purchase-price').textContent = money.format(price);
  confirmation.hidden = true;
  form.hidden = false;
  dialog.showModal();
  dialog.scrollTop = 0;
}

for (const format of formats) {
  for (const period of periods) {
    const price = format.prices[period.id];
    if (price === undefined) continue;

    const card = template.content.firstElementChild.cloneNode(true);
    card.id = `${format.id}-${period.id}`;
    card.dataset.period = period.id;
    card.querySelector('.membership-duration').textContent = period.duration;
    card.querySelector('h3').textContent = format.name;
    card.querySelector('.membership-price').textContent = money.format(price);

    const features = [`Доступ до залів мережі ${format.hours}`, 'Тренажерна зала'];
    if (format.group) features.push(`Групові заняття: ${format.group}`);
    if (format.program) features.push('План тренувань на 2–3 дні');
    if (format.sauna) features.push('Фінська сауна: вт і пт, 18:00–21:30');
    if (period.freeze) features.push(`Одноразове замороження: ${period.freeze}`);
    const list = card.querySelector('ul');
    for (const feature of features) {
      const item = document.createElement('li');
      item.textContent = feature;
      list.append(item);
    }

    const name = `${format.name} · ${period.duration}`;
    const buy = card.querySelector('button');
    buy.setAttribute('aria-label', `Придбати: ${name}`);
    buy.addEventListener('click', () => openPurchase(name, price));
    grid.append(card);
  }
}

function filterCards(periodId) {
  for (const button of filters.querySelectorAll('button')) {
    button.setAttribute('aria-pressed', String(button.dataset.period === periodId));
  }
  let visible = 0;
  for (const card of grid.children) {
    card.hidden = periodId !== 'all' && card.dataset.period !== periodId;
    if (!card.hidden) visible += 1;
  }
  count.textContent = `Знайдено: ${visible}`;
}

filters.addEventListener('click', event => {
  const button = event.target.closest('button[data-period]');
  if (button) filterCards(button.dataset.period);
});
filterCards('all');

dialog.querySelector('.purchase-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => form.reset());
phone.addEventListener('input', () => phone.setCustomValidity(''));

form.addEventListener('submit', event => {
  event.preventDefault();
  const number = phone.value.replace(/[\s().-]/g, '');
  if (!/^(?:\+?38)?0\d{9}$/.test(number)) {
    phone.setCustomValidity('Введи український номер у форматі 099 123 45 67 або +380 99 123 45 67.');
    phone.reportValidity();
    return;
  }
  form.reset();
  form.hidden = true;
  confirmation.hidden = false;
  confirmation.querySelector('h3').focus();
});
