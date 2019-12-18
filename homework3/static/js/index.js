window.onload = () => {
    const images = document.getElementsByClassName("screenshot-item-img");
    for (let i = 0; i < images.length; i++) {
        // fetch(`/assets/screenshots/progressive/${i + 1}.jpg`, {
        //     method: 'GET',
        //     responseType: 'blob'
        // })
        //     .then(resp => resp.blob())
        //     .then(data => {
        //
        //     });

        images[i].setAttribute('src', `/assets/screenshots/progressive/${i + 1}.jpg`);
        images[i].addEventListener('loadstart', () => {
            // 只有火狐支持，chrome不支持，不知道为啥
            images[i].style.padding = '0';
        });
        images[i].addEventListener('load', function(e) {
            // 避免有些浏览器不支持loadstart事件
            images[i].style.padding = '0';
        });
    }
};
