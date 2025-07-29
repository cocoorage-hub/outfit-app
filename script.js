let tops = [];
let bottoms = [];

window.addEventListener('load', () => {
tops = JSON.parse(localStorage.getItem('topsData')) || [];
bottoms = JSON.parse(localStorage.getItem('bottomsData')) || [];
renderImages();
});

document.getElementById('addButton').addEventListener('click', () => {
const file = document.getElementById('imageInput').files[0];
const category = document.getElementById('categorySelect').value;
const color = document.getElementById('colorSelect').value;
const purpose = document.getElementById('purposeSelect').value;

if (!file || !file.type.startsWith('image/')) return;

const reader = new FileReader();
reader.onload = function (e) {
const imageData = {
src: e.target.result,
color,
purpose
};

if (category === 'tops') {
tops.push(imageData);
localStorage.setItem('topsData', JSON.stringify(tops));
} else {
bottoms.push(imageData);
localStorage.setItem('bottomsData', JSON.stringify(bottoms));
}

renderImages();
document.getElementById('imageInput').value = '';
};

reader.readAsDataURL(file);
});

function renderImages() {
const topsList = document.getElementById('topsList');
const bottomsList = document.getElementById('bottomsList');
topsList.innerHTML = '';
bottomsList.innerHTML = '';

tops.forEach((item, index) => {
topsList.appendChild(createImageItem(item, index, 'tops'));
});

bottoms.forEach((item, index) => {
bottomsList.appendChild(createImageItem(item, index, 'bottoms'));
});
}

function createImageItem(item, index, category) {
const div = document.createElement('div');
div.className = 'image-item';

const img = document.createElement('img');
img.src = item.src;

const info = document.createElement('div');
info.className = 'info';
info.innerText = `色：${item.color}\n用事：${item.purpose}`;

const del = document.createElement('button');
del.textContent = '×';
del.className = 'delete-btn';
del.onclick = () => {
if (category === 'tops') {
tops.splice(index, 1);
localStorage.setItem('topsData', JSON.stringify(tops));
} else {
bottoms.splice(index, 1);
localStorage.setItem('bottomsData', JSON.stringify(bottoms));
}
renderImages();
};

div.appendChild(img);
div.appendChild(info);
div.appendChild(del);
return div;
}

// 🌤 天気取得・表示
function fetchWeather() {
if (!navigator.geolocation) {
document.getElementById('weatherInfo').textContent = '位置情報が取得できません。';
return;
}

navigator.geolocation.getCurrentPosition(
(position) => {
const lat = position.coords.latitude;
const lon = position.coords.longitude;
const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

fetch(apiUrl)
.then(response => response.json())
.then(data => {
const weather = data.current_weather;
const daily = data.daily;
const todayMax = daily.temperature_2m_max[0];
const todayMin = daily.temperature_2m_min[0];

const weatherText = `現在：${weather.temperature}℃、${weather.weathercode === 0 ? "晴れ" : "くもりか雨"}
最高気温：${todayMax}℃／最低気温：${todayMin}℃`;

document.getElementById('weatherInfo').textContent = weatherText;
})
.catch(() => {
document.getElementById('weatherInfo').textContent = '天気の取得に失敗しました。';
});
},
() => {
document.getElementById('weatherInfo').textContent = '位置情報の取得に失敗しました。';
}
);
}

// ページ読み込み時に実行
fetchWeather();

