const btn = document.querySelector('.btn');
const checkbox = document.querySelector('#agreement');
const btn2 = document.querySelector(".btn2");

btn.addEventListener('click', () => {
  if(!checkbox.checked){
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