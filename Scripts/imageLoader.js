export function LoadImage(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error("Файл не выбран"));
            return;
        }

        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                resolve(img);
            };
            img.onerror = function() {
                reject(new Error("Ошибка загрузки изображения"));
            };
            img.src = e.target.result;
        };
        
        reader.onerror = function() {
            reject(new Error("Ошибка чтения файла"));
        };
        
        reader.readAsDataURL(file);
    });
}

export function GetImageData(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    return ctx.getImageData(0, 0, img.width, img.height);
}