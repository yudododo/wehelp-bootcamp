const btn = document.querySelector('.btn');
const btn2 = document.querySelector('.btn2');
const btn3 = document.querySelector('.btn3');
const signupForm = document.querySelector('#signupForm');
const signinForm = document.querySelector('#signinForm');
const nameInput = document.querySelector('#name');
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const username2 = document.querySelector('#username2');
const password2 = document.querySelector('#password2');

btn.addEventListener('click', (e) => {
  const nameValue = nameInput.value.trim();
  const usernameValue = username.value.trim();
  const passwordValue = password.value.trim();

  if (nameValue !== "" && usernameValue !== "" && passwordValue !== "") {
    signupForm.submit();
  } else {
    e.preventDefault();
    alert("請填寫所有欄位！");
  }
});

btn2.addEventListener('click', (e) => {
  const usernameValue2 = username2.value.trim();
  const passwordValue2 = password2.value.trim();

  if (usernameValue2 !== "" && passwordValue2 !== "") {
    signinForm.submit();
  } else {
    e.preventDefault();
    alert("請填寫帳號與密碼！");
  }
});

btn3.addEventListener('click', (e)=>{
  e.preventDefault();
  console.log('click')
})