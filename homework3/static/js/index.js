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
        images[i].onload = () => {
            images[i].style.padding = '0';
        };
    }
};
