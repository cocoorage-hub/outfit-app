let tops = [];
let bottoms = [];

// 保存された画像を読み込み
window.addEventListener('load', () => {
const savedTops = localStorage.getItem('topsImages');
const savedBottoms = localStorage.getItem('bottomsImages');
if (savedTops) tops = JSON.parse(savedTops);
if (savedBottoms) bottoms = JSON.parse(savedBottoms);
renderImages();
});

// 追加ボタンの処理
document.getElementById('addButton').addEventListener('click', () => {
const fileInput = document.getElementById('imageInput');
const category = document.getElementById('categorySelect').value;
const file = fileInput.files[0];
if (!file || !file.type.startsWith('image/')) return;

const reader = new FileReader();
reader.onload = function (e) {
const imageData = e.target.result;
if (category === 'tops') {
tops.push(imageData);
localStorage.setItem('topsImages', JSON.stringify(tops));
} else {
bottoms.push(imageData);
localStorage.setItem('bottomsImages', JSON.stringify(bottoms));
}
renderImages();
fileInput.value = '';
};
reader.readAsDataURL(file);
});

// 表示更新関数
function renderImages() {
const topsList = document.getElementById('topsList');
const bottomsList = document.getElementById('bottomsList');
topsList.innerHTML = '';
bottomsList.innerHTML = '';

tops.forEach((src, index) => {
const div = createImageItem(src, index, 'tops');
topsList.appendChild(div);
});

bottoms.forEach((src, index) => {
const div = createImageItem(src, index, 'bottoms');
bottomsList.appendChild(div);
});
}

// 削除・表示用の画像アイテムを作る関数
function createImageItem(src, index, category) {
const div = document.createElement('div');
div.className = 'image-item';

const img = document.createElement('img');
img.src = src;

const del = document.createElement('button');
del.textContent = '×';
del.className = 'delete-btn';
del.onclick = () => {
if (category === 'tops') {
tops.splice(index, 1);
localStorage.setItem('topsImages', JSON.stringify(tops));
} else {
bottoms.splice(index, 1);
localStorage.setItem('bottomsImages', JSON.stringify(bottoms));
}
renderImages();
};

div.appendChild(img);
div.appendChild(del);
return div;
}

// コーデ提案ボタン
document.getElementById('suggestButton').addEventListener('click', () => {
const suggestion = document.getElementById('suggestion');
suggestion.innerHTML = '';

if (tops.length === 0 || bottoms.length === 0) {
suggestion.textContent = 'トップスとボトムスの両方を登録してください。';
return;
}

const topIndex = Math.floor(Math.random() * tops.length);
const bottomIndex = Math.floor(Math.random() * bottoms.length);

const topImg = document.createElement('img');
topImg.src = tops[topIndex];

const bottomImg = document.createElement('img');
bottomImg.src = bottoms[bottomIndex];

suggestion.appendChild(topImg);
suggestion.appendChild(bottomImg);
});
