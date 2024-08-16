// Inicializa o mapa
const map = L.map('map', {
    center: [-6.887698002563706, -38.56015173326553],
    zoom: 15,
    minZoom: 14,
    maxZoom: 16
});

// Configura o ícone do marcador
const houseIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2286/2286054.png',
    iconSize: [50, 50],
    iconAnchor: [25, 50]
});

// Adiciona o marcador ao mapa
const marker = L.marker([-6.887698002563706, -38.56015173326553], {
    draggable: true,
    icon: houseIcon
}).addTo(map);

// Configura o tile layer do mapa
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Callback de sucesso para a geolocalização
const successCallback = (position) => {
    marker.setLatLng([position.coords.latitude, position.coords.longitude]);
    map.setView([position.coords.latitude, position.coords.longitude]);
};

// Callback de erro para a geolocalização
const errorCallback = (error) => {
    if (error.code === error.PERMISSION_DENIED) {
        alert('Permissão de geolocalização negada. Por favor, permita o acesso nas configurações do navegador.');
    } else {
        alert('Não foi possível obter a localização. Verifique as permissões do navegador.');
    }
    console.error('Erro ao obter localização:', error.message);
}

// Solicita a localização do usuário
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, { enableHighAccuracy: true });
} else {
    alert('Geolocalização não suportada pelo seu navegador.');
}

// Atualiza a localização do marcador ao clicar no mapa
map.on('click', (e) => {
    marker.setLatLng(e.latlng);
});

// Função para listar hotéis e exibi-los na tabela e no mapa
function listarHoteis() {
    fetch('http://localhost:3000/hotel')
        .then(response => response.json())
        .then(data => {
            console.log('Dados recebidos:', data); // Verifica se os dados estão corretos
            displayHoteis(data);
            displayHotelMarkers(data);
        })
        .catch(e => {
            console.error('Erro ao buscar hotéis:', e);
        });
}

// Função para exibir hotéis na tabela
function displayHoteis(hoteis) {
    const dados = document.getElementById('dados');
    dados.innerHTML = '';
    if (!hoteis || hoteis.length === 0) {
        console.error('Nenhum hotel encontrado.');
        alert('Nenhum hotel encontrado com o CNPJ fornecido.');
        return;
    } 
    hoteis.forEach(hotel => {
        if (!hotel || !hotel.id) {
            console.error('Hotel inválido ou sem ID.');
            return;
        }

        const tr = document.createElement('tr');

        const id = document.createElement('td');
        const nome = document.createElement('td');
        const cnpj = document.createElement('td');
        const latitude = document.createElement('td');
        const longitude = document.createElement('td');

        const tdButtonEdit = document.createElement('td');
        const buttonEdit = document.createElement('button');
        const linkButtonEdit = document.createElement('a');
        const imgButtonEdit = document.createElement('img');

        const tdButtonDelete = document.createElement('td');
        const buttonDelete = document.createElement('button');
        const imgButtonDelete = document.createElement('img');

        linkButtonEdit.href = `./editHotel.html?id=${hotel.id}`;
        imgButtonEdit.src = './icons/pen.png';
        imgButtonEdit.classList.add('IconEditDele');
        imgButtonEdit.id = 'icon-edit-hotel';

        imgButtonDelete.src = './icons/delete.png';
        imgButtonDelete.classList.add('IconEditDelete');
        buttonDelete.id = 'icon-delete-hotel';

        id.textContent = hotel.id;
        nome.textContent = hotel.nome;
        cnpj.textContent = hotel.cnpj;
        latitude.textContent = hotel.localizacao.coordinates[1];
        longitude.textContent = hotel.localizacao.coordinates[0];

        linkButtonEdit.appendChild(imgButtonEdit);
        buttonEdit.appendChild(linkButtonEdit);

        buttonDelete.appendChild(imgButtonDelete);

        buttonDelete.dataset.id = hotel.id;

        tdButtonDelete.appendChild(buttonDelete);
        tdButtonEdit.appendChild(buttonEdit);

        tr.appendChild(id);
        tr.appendChild(nome);
        tr.appendChild(cnpj);
        tr.appendChild(latitude);
        tr.appendChild(longitude);
        tr.appendChild(tdButtonEdit);
        tr.appendChild(tdButtonDelete);

        dados.appendChild(tr);
    });
}

function listarHoteisNoMapa(hoteis) {
    hoteis.forEach(hotel => {
        if (hotel.localizacao && hotel.localizacao.coordinates) {
            const [lng, lat] = hotel.localizacao.coordinates;
            L.marker([lat, lng], {
                icon: houseIcon
            }).addTo(map);
        }
    });
}

function listarHoteis() {
    fetch('http://localhost:3000/hotel')
        .then(response => response.json())
        .then(data => {
            console.log('Dados recebidos:', data);
            displayHoteis(data);
            listarHoteisNoMapa(data); // Atualiza os pontos no mapa
        })
        .catch(e => {
            console.error('Erro ao buscar hotéis:', e);
        });
}


// Função para exibir marcadores de hotéis no mapa
function displayHotelMarkers(hoteis) {
    hoteis.forEach(hotel => {
        const marker = L.marker([hotel.localizacao.coordinates[1], hotel.localizacao.coordinates[0]], {
            icon: houseIcon
        }).addTo(map);
        marker.bindPopup(`<b>${hotel.nome}</b><br>CNPJ: ${hotel.cnpj}`);
    });
}

// Adiciona o listener para o botão de adicionar hotel
const button = document.getElementById('button');
if (button) {
    button.addEventListener('click', () => {
        const lat = marker.getLatLng().lat;
        const lng = marker.getLatLng().lng;

        const nome = document.getElementById('nomeHotel').value;
        const cnpj = document.getElementById('cnpj').value;

        if (!nome || !cnpj) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const coordinates = [lat, lng];
        const hotel = {
            nome,
            cnpj,
            localizacao: {
                type: 'Point',
                coordinates
            }
        };

        fetch('http://localhost:3000/hotel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(hotel)
        }).then(() => {
            console.log('Hotel registrado com sucesso!');
            alert('Hotel registrado com sucesso!');
            listarHoteis();
        }).catch(error => {
            console.log('Erro ao registrar hotel:', error);
            alert('Erro ao registrar hotel. Consulte o console para mais detalhes.');
        });
    });
} else {
    console.log('Elemento button não encontrado.');
}

// Adiciona o listener para o botão de pesquisar hotel
const buttonSearch = document.getElementById('buttonPesquisar');
if (buttonSearch) {
    buttonSearch.addEventListener('click', () => {
        const cnpj = document.getElementById('pesquisar').value.replace(/[.\-\/]/g, ''); // Remove pontuações do CNPJ
        fetch(`http://localhost:3000/hotel/${cnpj}`)
            .then(response => response.json())
            .then(response => {
                displayHoteis([response]);
                displayHotelMarkers([response]);
            })
            .catch(error => {
                console.error('Erro ao pesquisar hotel:', error);
            });
    });
} else {
    console.log('Elemento buttonPesquisar não encontrado.');
}


// Adiciona o listener para o botão de deletar hotel
document.getElementById('dados').addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (button) {
        const id = button.dataset.id;
        fetch(`http://localhost:3000/hotel/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            listarHoteis();
        })
        .catch(error => {
            console.error('Erro ao deletar hotel:', error);
        });
    }
});

// Lista hotéis ao carregar a página e exibe os marcadores no mapa
listarHoteis();
