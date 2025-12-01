/**
 * 静止画の共有
 */
function pictureShare() {
    const capturedImage = document.getElementById('captured-image');
    // const imageDataURL = capturedImage.src;
    // // プレビュー画像をblobに変換
    // const byteString = atob(imageDataURL.split(',')[1]); // Base64部分をデコード
    // const mimeType = imageDataURL.split(',')[0].split(':')[1].split(';')[0]; // MIMEタイプを取得
    // const buffer = new ArrayBuffer(byteString.length);
    // const uintArray = new Uint8Array(buffer);

    // for (let i = 0; i < byteString.length; i++) {
    //     uintArray[i] = byteString.charCodeAt(i);
    // }

    // const imageBlob = new Blob([buffer], { type: mimeType });

    // if (navigator.share) {
    //     const file = new File([imageBlob], 'canvas-image.png', { type: 'image/png' });

    //     navigator
    //         .share({
    //             title: 'Canvas Image',
    //             text: 'Check out this image from my canvas!',
    //             files: [file], // ファイルを共有
    //         })
    //         .then(() => console.log('Shared successfully!'))
    //         .catch((error) => console.error('Error sharing:', error));
    // } else {
    //     console.error('Web Share API is not supported in this browser.');
    // }

    const canvas = document.createElement('canvas');
    canvas.width = 720; // 解像度を高く設定
    canvas.height = 1280;

    const context = canvas.getContext('2d');
    context.drawImage(capturedImage, 0, 0, canvas.width, canvas.height);

    const imageDataURL = canvas.toDataURL('image/png', 1.0);
    const byteString = atob(imageDataURL.split(',')[1]);
    const mimeType = imageDataURL.split(',')[0].split(':')[1].split(';')[0];
    const buffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(buffer);

    for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
    }

    const imageBlob = new Blob([buffer], { type: mimeType });

    if (navigator.share) {
        const file = new File([imageBlob], 'high-resolution-image.png', { type: 'image/png' });
        navigator.share({
            title: 'High Resolution Image',
            text: 'Check out this high-resolution image!',
            files: [file],
        })
            .then(() => console.log('Shared successfully!'))
            .catch((error) => console.error('Error sharing:', error));
    }
}

/**
 * 動画の共有
 */
function movieShare() {

    // Web Share APIを使用して共有
    if (navigator.share) {
        const file = new File([movieBlob], "video.mp4", { type: movieBlob.type });

        navigator
            .share({
                title: 'Video Frame',
                text: 'Check out this frame from my video!',
                files: [file], // ファイルを共有
            })
            .then(() => console.log('Shared successfully!'))
            .catch((error) => console.error('Error sharing:', error));
    } else {
        console.error('Web Share API is not supported in this browser.');
    }
}
