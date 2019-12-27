window.onload = () => {
    const images = document.getElementsByClassName("screenshot-item-img");
    const video = document.getElementById('video-op');

    for (let i = 0; i < images.length; i++) {
        // 获取图片资源
        new Promise(((resolve, reject) => {
            fetch(`assets/screenshots/progressive/${i + 1}.jpg`, {
                method: 'GET',
                responseType: 'blob',
                acceptEncoding: 'gzip, deflate, br'
            }).then(resp => resp.blob()).then(resolve);
        })).then(img => {
            images[i].setAttribute('src', window.URL.createObjectURL(img));
            console.log(`${window.URL.createObjectURL(img)}`);
        });
    }

    // const mediaSource = new MediaSource();
    // video.src = URL.createObjectURL(mediaSource);
    // mediaSource.addEventListener('sourceopen', e => {
    //     // URL.revokeObjectURL(video.src);
    //     // 设置 媒体的编码类型
    //     const mime = 'video/webm; codecs="vorbis,vp8"';
    //     const mediaSource = e.target;
    //     const sourceBuffer = mediaSource.addSourceBuffer(mime);
    //     const videoUrl = 'assets/P5_OP.webm';
    //     fetch(videoUrl, {
    //         method: 'GET',
    //         responseType: 'arraybuffer'
    //     }).then(response => response.arrayBuffer())
    //         .then(arrayBuffer => {
    //             sourceBuffer.addEventListener('updateend', e => {
    //                 if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
    //                     mediaSource.endOfStream();
    //                     // 在数据请求完成后，我们需要调用 endOfStream()。它会改变 MediaSource.readyState 为 ended 并且触发 sourceended 事件。
    //                     video.play().then(() => {
    //                     }).catch(console.log);
    //                 }
    //             });
    //             sourceBuffer.appendBuffer(arrayBuffer);
    //         });
    // });

    const videoUrl = 'assets/P5_OP.webm';
    fetch(videoUrl, {
        method: 'GET',
        responseType: 'blob'
    })
        .then(response => response.blob())
        .then(blob => {
            video.src = URL.createObjectURL(blob);
        });

};
