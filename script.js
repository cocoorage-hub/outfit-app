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

