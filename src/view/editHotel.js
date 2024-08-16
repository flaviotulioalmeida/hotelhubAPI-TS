let map = L.map('map', {
    center: [-6.887698002563706, -38.56015173326553],
    zoom: 15,
    minZoom: 14,
    maxZoom: 16
});

let houseIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2286/2286054.png',
    iconSize: [50, 50],
    iconAnchor: [25, 50], 
});

let marker = L.marker([-6.887698002563706, -38.56015173326553], {
    draggable: true,
    icon: houseIcon
}).addTo(map);

map.locate();

map.on('locationfound', e => {
    marker.setLatLng(e.latlng);
    map.setView(e.latlng);
});

map.on('click', l => {
    marker.setLatLng(l.latlng);
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const buttonEditSave = document.getElementById('buttonEditSave');
buttonEditSave.addEventListener('click', () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        console.error('ID do hotel não encontrado na URL.');
        return;
    }

    const nome = document.getElementById('nomeHotel').value;
    const cnpj = document.getElementById('cnpj').value;
    const lat = marker.getLatLng().lat;
    const lng = marker.getLatLng().lng;
    const coordinates = [lat, lng];

    const hotel = {
        nome,
        cnpj,
        "localizacao": {
            "type": "Point",
            coordinates
        }
    };

    fetch(`http://localhost:3000/hotel/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(hotel)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao atualizar o hotel.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Hotel atualizado com sucesso:', data);
        alert('Hotel atualizado com sucesso!');
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao atualizar hotel. Consulte o console para mais detalhes.');
    });
});
