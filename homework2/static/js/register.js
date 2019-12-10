const registerButton = document.getElementById('register-action');

const onRegister = () => {
    const username = document.getElementById('input-username').value;
    const password = document.getElementById('input-password').value;
    const passwordConfirm = document.getElementById('input-password-confirm').value;
    if (password !== passwordConfirm) alert('两次密码输入不一致!');
    fetch('/user/register', {
        body: JSON.stringify({username: username, password: password}),
        method: 'POST',
    }).then(resp => {
        if (resp.ok) {
            alert('注册成功！');
            window.location.href = '/login';
        } else {
            alert('注册失败！');
        }
    });
};

registerButton.onclick = onRegister;

