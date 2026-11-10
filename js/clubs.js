const clubSelect = document.querySelector('#club-select');
const clubFrame = document.querySelector('#club-map-frame');
const clubMapLink = document.querySelector('#club-map-link');
const clubMapAddress = document.querySelector('#club-map-address');
const clubMapHeading = document.querySelector('#club-map-title');
const clubGrid = document.querySelector('#club-grid');
const clubTemplate = document.querySelector('#club-card');

function showClub(id) {
  const club = clubs[id];
  const location = `${club.city}, ${club.address}`;
  clubSelect.value = id;
  clubMapAddress.textContent = location;
  clubFrame.title = `Google Maps — ${club.name}`;
  clubFrame.src = `https://www.google.com/maps/embed?pb=${club.map}`;
  clubMapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${club.name}, ${location}`)}`;
}

for (const [id, club] of Object.entries(clubs)) {
  clubSelect.add(new Option(`${club.name} · ${club.city}`, id));
  const card = clubTemplate.content.cloneNode(true);
  card.querySelector('h3').textContent = club.name;
  card.querySelector('.club-city').textContent = club.city;
  card.querySelector('.club-address').textContent = club.address;
  const phones = card.querySelector('.club-phones');
  for (const number of club.phones) {
    const phone = document.createElement('a');
    phone.href = `tel:+38${number.replaceAll(' ', '')}`;
    phone.textContent = number;
    phones.append(phone);
  }
  if (club.features) {
    const details = card.querySelector('details');
    const features = details.querySelector('ul');
    for (const feature of club.features) {
      const item = document.createElement('li');
      item.textContent = feature;
      features.append(item);
    }
    details.hidden = false;
  }
  const showMap = card.querySelector('button');
  showMap.setAttribute('aria-label', `Показати на карті: ${club.name}`);
  showMap.addEventListener('click', () => {
    showClub(id);
    clubMapHeading.focus({ preventScroll: true });
    document.querySelector('#club-map').scrollIntoView();
  });
  clubGrid.append(card);
}

clubSelect.addEventListener('change', () => showClub(clubSelect.value));
document.querySelector('#club-hours').textContent = clubHours.join(' · ');
const requestedClub = new URLSearchParams(location.search).get('club');
showClub(Object.hasOwn(clubs, requestedClub) ? requestedClub : 'okean');
document.querySelector('#club-map').hidden = false;
document.querySelector('#club-catalog').hidden = false;
