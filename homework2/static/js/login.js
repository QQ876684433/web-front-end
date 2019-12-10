const loginButton = document.getElementById('login-action');

const onLogin = () => {
    const username = document.getElementById('input-username').value;
    const password = document.getElementById('input-password').value;
    fetch('/user/login', {
        body: JSON.stringify({username: username, password: password}),
        method: 'POST',
    }).then(resp => {
        if (resp.ok){
            alert('登录成功！');
            window.location.href = '/';
        }else {
            alert('登录失败！');
        }
    });
};

loginButton.onclick = onLogin;

