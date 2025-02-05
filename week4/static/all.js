const btn = document.querySelector('.btn');
const checkbox = document.querySelector('#agreement');
const btn2 = document.querySelector(".btn2");
const form = document.querySelector('#form');

btn.addEventListener('click', (e) => {
  if (checkbox.checked) {
    form.submit();
  }else{
    e.preventDefault();
    alert('Please check the agreement');
  }
});

btn2.addEventListener('click', (e) => {
  e.preventDefault();
  const num = document.querySelector(".num").value;
  if (num && num > 0) { 
    window.location.assign(`http://127.0.0.1:8000/square/${num}`);
  } else {
    alert("Please enter a positive number");
  }
});