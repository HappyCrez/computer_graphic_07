import { GetPixelColor } from "./scaling.js";

export function ApplyBilinearInterpolation(imageData, x, y) {
    const x1 = Math.floor(x);
    const y1 = Math.floor(y);
    const x2 = x1 + 1;
    const y2 = y1 + 1;
    
    // Весовые коэффициенты
    const wx = x - x1;
    const wy = y - y1;
    const w1 = (1 - wx) * (1 - wy);
    const w2 = wx * (1 - wy);
    const w3 = (1 - wx) * wy;
    const w4 = wx * wy;
    
    // Получаем цвета четырех соседних пикселей с обработкой границ
    const c1 = GetPixelColor(imageData, x1, y1);
    const c2 = GetPixelColor(imageData, x2, y1);
    const c3 = GetPixelColor(imageData, x1, y2);
    const c4 = GetPixelColor(imageData, x2, y2);
    
    // Линейная интерполяция
    return {
        r: Math.max(0, Math.min(255, Math.round(c1.r * w1 + c2.r * w2 + c3.r * w3 + c4.r * w4))),
        g: Math.max(0, Math.min(255, Math.round(c1.g * w1 + c2.g * w2 + c3.g * w3 + c4.g * w4))),
        b: Math.max(0, Math.min(255, Math.round(c1.b * w1 + c2.b * w2 + c3.b * w3 + c4.b * w4))),
        a: Math.max(0, Math.min(255, Math.round(c1.a * w1 + c2.a * w2 + c3.a * w3 + c4.a * w4)))
    };
}