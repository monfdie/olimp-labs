(() => {
  const grid = document.querySelector('[data-trainer-list]');
  const profile = document.querySelector('#trainer-profile');

  const format = trainer => trainer.group ? 'Групові заняття' : 'Персональні тренування';

  function createCard(trainer) {
    const card = document.createElement('article');
    card.className = 'trainer-catalog-card';
    card.innerHTML = `
      <a class="trainer-card-link">
        <div class="trainer-placeholder" aria-hidden="true"></div>
        <div class="trainer-catalog-body">
          <p class="eyebrow trainer-card-format"></p>
          <h3></h3>
          <p class="trainer-card-location"></p>
          <p class="trainer-card-specialty"></p>
          <span class="trainer-card-more">Про тренера <span aria-hidden="true">↗</span></span>
        </div>
      </a>`;
    const link = card.querySelector('a');
    link.href = `trainer.html?id=${encodeURIComponent(trainer.id)}`;
    card.querySelector('.trainer-card-format').textContent = format(trainer);
    card.querySelector('h3').textContent = trainer.name;
    card.querySelector('.trainer-card-location').textContent = `${trainer.club.city} · ${trainer.club.name}`;
    card.querySelector('.trainer-card-specialty').textContent = trainer.specialties.slice(0, 2).join(' · ');
    return card;
  }

  if (grid) {
    const entries = grid.dataset.trainerList === 'preview' ? trainers.slice(0, 3) : trainers;
    grid.replaceChildren(...entries.map(createCard));
  }

  if (profile) {
    const id = new URLSearchParams(location.search).get('id');
    const trainer = trainers.find(entry => entry.id === id);
    if (!trainer) {
      document.querySelector('#trainer-unavailable').hidden = false;
      return;
    }

    const setText = (field, value) => {
      profile.querySelector(`[data-trainer-field="${field}"]`).textContent = value;
    };
    document.title = `${trainer.name} | Olimp`;
    setText('name', trainer.name);
    setText('type', format(trainer));
    setText('location', `${trainer.club.city} · ${trainer.club.name}`);
    setText('about', trainer.about);
    setText('club', trainer.club.name);
    setText('address', `${trainer.club.city}, ${trainer.club.address}`);

    const sections = [
      ['Спеціалізація', trainer.specialties],
      ['Види тренувань', trainer.training],
      ['Освіта й сертифікації', trainer.education],
      ['Спортивні досягнення', trainer.achievements],
    ];
    for (const [heading, items] of sections) {
      if (!items?.length) continue;
      const section = document.querySelector('#trainer-detail-section').content.cloneNode(true);
      section.querySelector('h2').textContent = heading;
      const list = section.querySelector('ul');
      for (const text of items) {
        const item = document.createElement('li');
        item.textContent = text;
        list.append(item);
      }
      profile.querySelector('.trainer-detail-grid').append(section);
    }
    profile.hidden = false;
  }
})();
