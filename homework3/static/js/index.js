window.onload = () => {
    const images = document.getElementsByClassName("screenshot-item-img");
    for (let i = 0; i < images.length; i++) {
        // 获取图片资源
        new Promise(((resolve, reject) => {
            fetch(`assets/screenshots/progressive/${i + 1}.jpg`, {
                method:'GET',
                responseType: 'blob',
                acceptEncoding: 'gzip, deflate, br'
            }).then(resp => resp.blob()).then(resolve);
        })).then(img => {
            images[i].setAttribute('src', window.URL.createObjectURL(img));
            console.log(`${window.URL.createObjectURL(img)}`);
        });
    }
};
