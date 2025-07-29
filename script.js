let tops = [];
let bottoms = [];
let weatherData = { temp: null, weather: "" };

window.addEventListener('load', () => {
tops = JSON.parse(localStorage.getItem('topsData')) || [];
bottoms = JSON.parse(localStorage.getItem('bottomsData')) || [];
renderImages();
fetchWeather();
});

document.getElementById('addButton').addEventListener('click', () => {
const file = document.getElementById('imageInput').files[0];
const category = document.getElementById('categorySelect').value;
const color = document.getElementById('colorSelect').value;
const purposeCheckboxes = document.querySelectorAll('#purposeCheckboxes input[type="checkbox"]:checked');
const purposes = Array.from(purposeCheckboxes).map(cb => cb.value);

if (!file || !file.type.startsWith('image/')) return;

const reader = new FileReader();
reader.onload = function (e) {
const imageData = {
src: e.target.result,
color,
purposes
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
info.innerText = `色：${item.color}\n用事：${item.purposes?.join(', ') || 'なし'}`;

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

// 🌤 天気取得
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

weatherData.temp = weather.temperature;
weatherData.weather = weather.weathercode === 0 ? '晴れ' : 'くもり/雨';

const weatherText = `現在：${weather.temperature}℃、${weatherData.weather}
最高気温：${todayMax}℃／最低気温：${todayMin}℃`;
document.getElementById('weatherInfo').textContent = weatherText;
});
},
() => {
document.getElementById('weatherInfo').textContent = '位置情報の取得に失敗しました。';
}
);
}

// 🎯 コーデ提案ロジック
document.getElementById('suggestButton').addEventListener('click', () => {
const allPurposes = ['通勤', 'フォーマル', 'お出かけ', '部屋着', 'スタジオ', '中継'];
const suggestions = [];

for (let top of tops) {
for (let bottom of bottoms) {
for (let purpose of allPurposes) {
const topMatch = top.purposes.includes(purpose);
const bottomMatch = bottom.purposes.includes(purpose);
const bothMatch = topMatch && bottomMatch;

const colorClash = top.color === bottom.color;
const colorOK = (purpose === '中継') || !colorClash;

const temp = weatherData.temp || 25;
const tempOK = (temp >= 28 || temp <= 10) ? true : true; // 今はすべてOK（今後細分化可能）

if (bothMatch && colorOK && tempOK) {
suggestions.push({ top, bottom, purpose });
}
}
}
}

const area = document.getElementById('suggestion');
area.innerHTML = '';

if (suggestions.length === 0) {
area.textContent = '条件に合うコーデが見つかりませんでした。';
return;
}

const choice = suggestions[Math.floor(Math.random() * suggestions.length)];
const topImg = document.createElement('img');
const bottomImg = document.createElement('img');
topImg.src = choice.top.src;
bottomImg.src = choice.bottom.src;

const label = document.createElement('div');
label.innerText = `用事：${choice.purpose}\n色：${choice.top.color} + ${choice.bottom.color}`;

area.appendChild(topImg);
area.appendChild(bottomImg);
area.appendChild(label);
});
