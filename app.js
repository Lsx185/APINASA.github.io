const apiKey = 'EOnTvNRrSetcxVd20ofaPl9kSYyabg3TrdECO6Da'; // Tu clave API

let asteroidChart = null; // Variable global para almacenar el gráfico de asteroides

function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById(sectionId).style.display = 'block';
}

// Generación de colores para las barras
function generateRandomColors(count) {
  return Array.from({ length: count }, () => `hsl(${Math.random() * 360}, 70%, 50%)`);
}

function fetchAsteroids() {
  const date = document.getElementById('asteroids-date').value;
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const asteroids = data.near_earth_objects[date];
      if (asteroids.length > 0) {
        const labels = asteroids.map(a => a.name);
        const diameters = asteroids.map(a => a.estimated_diameter.kilometers.estimated_diameter_max);
        const colors = generateRandomColors(asteroids.length);

        if (asteroidChart) {
          asteroidChart.data.labels = labels;
          asteroidChart.data.datasets[0].data = diameters;
          asteroidChart.data.datasets[0].backgroundColor = colors;
          asteroidChart.update(); // Actualiza el gráfico
        } else {
          asteroidChart = new Chart(document.getElementById('asteroids-chart'), {
            type: 'bar',
            data: {
              labels,
              datasets: [{
                label: 'Diámetro (km)',
                data: diameters,
                backgroundColor: colors,
              }]
            },
            options: {
              plugins: {
                datalabels: {
                  color: '#fff',
                  font: { weight: 'bold' },
                  formatter: value => `${value.toFixed(2)} km`,
                }
              },
              responsive: true,
              scales: {
                x: { ticks: { color: '#000' }, grid: { color: '#ccc' } },
                y: { beginAtZero: true, ticks: { color: '#000' }, grid: { color: '#ccc' } }
              }
            }
          });
        }
      }
    });
}

function fetchApod() {
  const date = document.getElementById('apod-date').value;
  fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('apod-results').innerHTML = `<img src="${data.url}" alt="${data.title}" style="max-width:100%"><p>${data.explanation}</p>`;
    });
}

function fetchMarsPhotos() {
  const date = document.getElementById('mars-rover-date').value;
  fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const photos = data.photos;
      const container = document.getElementById('mars-photos');
      container.innerHTML = photos.length ? photos.map(photo => {
        return `<img src="${photo.img_src}" alt="Mars photo" style="width:100px;" onclick="openModal('${photo.img_src}')">`;
      }).join('') : '<p>No hay fotos para esta fecha.</p>';
    });
}

// Función para abrir el modal con la imagen ampliada
function openModal(imageSrc) {
  const modal = document.getElementById('image-modal');
  const expandedImage = document.getElementById('expanded-image');
  expandedImage.src = imageSrc;
  modal.style.display = 'flex';
}

// Función para cerrar el modal
function closeModal() {
  const modal = document.getElementById('image-modal');
  modal.style.display = 'none';
}
