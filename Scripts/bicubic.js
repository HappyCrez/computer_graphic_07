import { GetPixelColor } from "./scaling.js";

// Ядро бикубической интерполяции
function BicubicKernel(x, a = -0.5) {
    const absX = Math.abs(x);
    
    if (absX <= 1) {
        return (a + 2) * absX * absX * absX - (a + 3) * absX * absX + 1;
    } else if (absX <= 2) {
        return a * absX * absX * absX - 5 * a * absX * absX + 8 * a * absX - 4 * a;
    }
    return 0;
}

export function ApplyBicubicInterpolation(imageData, x, y) {
    const xFloor = Math.floor(x);
    const yFloor = Math.floor(y);
    
    let result = { r: 0, g: 0, b: 0, a: 0 };
    let totalWeight = 0;
    
    // Используем окрестность 4x4 пикселя
    const size = 4;
    
    for (let j = 0; j < size; j++) {
        for (let i = 0; i < size; i++) {
            const srcX = xFloor + i;
            const srcY = yFloor + j;
            
            // Вычисляем веса
            const wx = BicubicKernel(srcX - x);
            const wy = BicubicKernel(srcY - y);
            const weight = wx * wy;
            
            const pixel = GetPixelColor(imageData, srcX, srcY);
            result.r += pixel.r * weight;
            result.g += pixel.g * weight;
            result.b += pixel.b * weight;
            result.a += pixel.a * weight;
            totalWeight += weight;
        }
    }
    
    // Нормализуем результат
    if (totalWeight > 0) {
        result.r = Math.max(0, Math.min(255, Math.round(result.r / totalWeight)));
        result.g = Math.max(0, Math.min(255, Math.round(result.g / totalWeight)));
        result.b = Math.max(0, Math.min(255, Math.round(result.b / totalWeight)));
        result.a = Math.max(0, Math.min(255, Math.round(result.a / totalWeight)));
    }
    
    return result;
}