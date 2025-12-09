import { LoadImage, GetImageData } from "./imageLoader.js";
import { ScaleImage } from "./scaling.js";
import { ApplyBilinearInterpolation } from "./bilinear.js";
import { ApplyBicubicInterpolation } from "./bicubic.js";

let originalImageData = null;
let currentScale = 1.0;
let currentMethod = null;
let processingTime = 0;

// Основная функция инициализации
function InitializeApp() {
    console.log("Инициализация приложения...");
    
    // Получаем элементы DOM
    const imageUpload = document.getElementById('imageUpload');
    const resetImage = document.getElementById('resetImage');
    const resetAll = document.getElementById('resetAll');
    const scaleFactor = document.getElementById('scaleFactor');
    const scaleValue = document.getElementById('scaleValue');
    const applyBilinear = document.getElementById('applyBilinear');
    const applyBicubic = document.getElementById('applyBicubic');
    const neighborhoodSize = document.getElementById('bicubicNeighborhood');
    
    // Устанавливаем начальное значение ползунка
    scaleFactor.value = currentScale;
    scaleValue.textContent = `${currentScale.toFixed(1)}x`;
    
    // Обработчик загрузки изображения
    imageUpload.addEventListener('change', async (e) => {
        if (e.target.files && e.target.files[0]) {
            await HandleImageLoad(e.target.files[0]);
        }
    });
    
    // Обработчик сброса изображения
    resetImage.addEventListener('click', () => {
        ResetImage();
    });
    
    // Обработчик сброса всего
    resetAll.addEventListener('click', () => {
        ResetAll();
    });
    
    // Обработчик изменения коэффициента масштабирования
    scaleFactor.addEventListener('input', (e) => {
        currentScale = parseFloat(e.target.value);
        scaleValue.textContent = `${currentScale.toFixed(1)}x`;
    });
    
    // Обработчик билинейной интерполяции
    applyBilinear.addEventListener('click', () => {
        if (!originalImageData) {
            alert("Пожалуйста, сначала загрузите изображение");
            return;
        }
        ApplyBilinear();
    });
    
    // Обработчик бикубической интерполяции
    applyBicubic.addEventListener('click', () => {
        if (!originalImageData) {
            alert("Пожалуйста, сначала загрузите изображение");
            return;
        }
        ApplyBicubic();
    });
}

// Загрузка изображения
async function HandleImageLoad(file) {
    try {
        const imageName = document.getElementById('imageName');
        imageName.textContent = file.name;
        
        const img = await LoadImage(file);
        originalImageData = GetImageData(img);
        
        // Отображаем оригинал
        const originalCanvas = document.getElementById('originalCanvas');
        const originalCtx = originalCanvas.getContext('2d');
        
        originalCanvas.width = img.width;
        originalCanvas.height = img.height;
        originalCtx.drawImage(img, 0, 0);
        
        // Сбрасываем метод
        currentMethod = null;
        processingTime = 0;
        
    } catch (error) {
        console.error("Ошибка загрузки изображения:", error);
        alert("Ошибка загрузки изображения. Пожалуйста, выберите другой файл.");
    }
}

// Применение билинейной интерполяции
function ApplyBilinear() {
    const startTime = performance.now();
    
    const scaledData = ScaleImage(
        originalImageData,
        currentScale,
        ApplyBilinearInterpolation
    );
    
    const endTime = performance.now();
    processingTime = endTime - startTime;
    currentMethod = 'bilinear';
    
    // Открываем обработанное изображение в новой вкладке
    OpenImageInNewTab(scaledData);
}

// Применение бикубической интерполяции
function ApplyBicubic() {
    const startTime = performance.now();
    
    const scaledData = ScaleImage(
        originalImageData,
        currentScale,
        ApplyBicubicInterpolation
    );
    
    const endTime = performance.now();
    processingTime = endTime - startTime;
    currentMethod = 'bicubic';
    
    // Открываем обработанное изображение в новой вкладке
    OpenImageInNewTab(scaledData);
}

// Открытие изображения в новой вкладке
function OpenImageInNewTab(imageData) {
    // Создаем временный canvas для изображения
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCanvas.width = imageData.width;
    tempCanvas.height = imageData.height;
    tempCtx.putImageData(imageData, 0, 0);
    
    // Создаем Data URL для изображения
    const imageUrl = tempCanvas.toDataURL('image/png');
    
    // Создаем новое окно
    const newWindow = window.open('', '_blank');
    
    if (!newWindow) {
        alert('Пожалуйста, разрешите всплывающие окна для просмотра результата');
        return;
    }
    
    // Формируем HTML для новой вкладки
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Результат обработки изображения</title>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    background: #1a1a2e;
                    color: white;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                }
                .container {
                    max-width: 1200px;
                    text-align: center;
                }
                h1 {
                    color: #6ab7ff;
                    margin-bottom: 20px;
                }
                img {
                    max-width: 100%;
                    height: auto;
                    border: 2px solid #555;
                    border-radius: 8px;
                    background: #111;
                    margin-bottom: 20px;
                }
                .info {
                    background: rgba(30, 30, 45, 0.9);
                    padding: 15px;
                    border-radius: 8px;
                    border: 1px solid #444;
                    margin-bottom: 20px;
                    text-align: left;
                }
                .info p {
                    margin: 5px 0;
                }
                .buttons {
                    margin-top: 20px;
                }
                button {
                    background: linear-gradient(to right, #4a6fa5, #166088);
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    margin: 0 10px;
                    transition: all 0.3s;
                }
                button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }
                button:nth-child(1) {
                    background: linear-gradient(to right, #00b09b, #96c93d);
                }
                button:nth-child(2) {
                    background: linear-gradient(to right, #ff416c, #ff4b2b);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Результат обработки изображения</h1>
                <div class="info">
                    <p><strong>Метод:</strong> ${currentMethod === 'bilinear' ? 'Билинейная интерполяция' : 'Бикубическая интерполяция'}</p>
                    <p><strong>Исходный размер:</strong> ${originalImageData.width} × ${originalImageData.height} пикселей</p>
                    <p><strong>Новый размер:</strong> ${imageData.width} × ${imageData.height} пикселей</p>
                    <p><strong>Коэффициент масштабирования:</strong> ${currentScale.toFixed(1)}x</p>
                    <p><strong>Время обработки:</strong> ${processingTime.toFixed(0)} мс</p>
                </div>
                <img id="resultImage" src="${imageUrl}" alt="Обработанное изображение">
                <div class="buttons">
                    <button onclick="window.close()">✕ Закрыть окно</button>
                </div>
            </div>
        </body>
        </html>
    `;
    
    newWindow.document.write(htmlContent);
    newWindow.document.close();
}

// Сброс изображения
function ResetImage() {
    const originalCanvas = document.getElementById('originalCanvas');
    const originalCtx = originalCanvas.getContext('2d');
    
    originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
    
    originalImageData = null;
    currentMethod = null;
    processingTime = 0;
    currentScale = 1.0;
    
    document.getElementById('imageName').textContent = "Изображение не выбрано";
    document.getElementById('scaleFactor').value = 1.0;
    document.getElementById('scaleValue').textContent = "1.0x";
}

// Сброс всех настроек
function ResetAll() {
    if (!originalImageData) return;
    
    currentMethod = null;
    processingTime = 0;
    currentScale = 1.0;
    
    document.getElementById('scaleFactor').value = 1.0;
    document.getElementById('scaleValue').textContent = "1.0x";
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', InitializeApp);