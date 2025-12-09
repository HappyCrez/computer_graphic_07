export function ScaleImage(imageData, scaleFactor, interpolationFunction) {
    const srcWidth = imageData.width;
    const srcHeight = imageData.height;
    
    const destWidth = Math.round(srcWidth * scaleFactor);
    const destHeight = Math.round(srcHeight * scaleFactor);
    
    // Создаем новый ImageData для результата
    const destCanvas = document.createElement('canvas');
    const destCtx = destCanvas.getContext('2d');
    const destImageData = destCtx.createImageData(destWidth, destHeight);
    const destData = destImageData.data;
    
    // Соотношение координат
    const xRatio = srcWidth / destWidth;
    const yRatio = srcHeight / destHeight;
    
    // Проходим по всем пикселям нового изображения
    for (let y = 0; y < destHeight; y++) {
        for (let x = 0; x < destWidth; x++) {
            // Вычисляем соответствующую позицию в исходном изображении
            const srcX = x * xRatio;
            const srcY = y * yRatio;
            
            // Получаем интерполированный цвет
            const color = interpolationFunction(imageData, srcX, srcY);
            
            // Записываем результат
            const destIndex = (y * destWidth + x) * 4;
            destData[destIndex] = color.r;     // R
            destData[destIndex + 1] = color.g; // G
            destData[destIndex + 2] = color.b; // B
            destData[destIndex + 3] = color.a; // A
        }
    }
    
    return destImageData;
}

export function GetPixelColor(imageData, x, y) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    
    // Проверяем границы
    x = Math.max(0, Math.min(width - 1, Math.floor(x)));
    y = Math.max(0, Math.min(height - 1, Math.floor(y)));
    
    const index = (y * width + x) * 4;
    
    return {
        r: data[index],
        g: data[index + 1],
        b: data[index + 2],
        a: data[index + 3]
    };
}