const featuredClub = clubs.premium;
const featuredMap = document.querySelector('#home-map');
document.querySelector('#home-map-address').textContent = `${featuredClub.city}, ${featuredClub.address}`;
featuredMap.src = `https://www.google.com/maps/embed?pb=${featuredClub.map}`;
