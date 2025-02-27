const signup_btn = document.querySelector(".signup_btn");
const signin_btn = document.querySelector(".signin_btn");
const search_btn = document.querySelector(".search_btn");
const update_btn = document.querySelector(".update_btn");

const signupForm = document.querySelector("#signupForm");
const signinForm = document.querySelector("#signinForm");

const nameInput = document.querySelector("#name");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const signin_username = document.querySelector("#signin_username");
const signin_password = document.querySelector("#signin_password");

if (signup_btn) {
  signup_btn.addEventListener("click", (e) => {
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
}

if (signin_btn) {
  signin_btn.addEventListener("click", (e) => {
    const usernameValue2 = signin_username.value.trim();
    const passwordValue2 = signin_password.value.trim();

    if (usernameValue2 !== "" && passwordValue2 !== "") {
      signinForm.submit();
    } else {
      e.preventDefault();
      alert("請填寫帳號與密碼！");
    }
  });
}

if (search_btn) {
  search_btn.addEventListener("click", () => {
    const searchUsername = document.querySelector(".search_username").value.trim();
    if (!searchUsername) {
      alert("請輸入要查詢的帳號");
      return;
    }
    fetch(`/api/member?username=${searchUsername}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.data) {
          document.querySelector(
            ".result"
          ).innerText = `${result.data.name}(${result.data.username})`;
        } else {
          document.querySelector(".result").innerText = "No Data";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}

if (update_btn) {
  update_btn.addEventListener("click", () => {
    const newName = document.querySelector(".update_name").value.trim();
    if (!newName) {
      alert("請輸入新名字");
      return;
    }
    fetch("/api/member", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newName }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.ok) {
          document.querySelector(".update_result").innerText = "更新成功！";
          document.querySelector(
            ".m_name"
          ).innerHTML = `${newName}  恭喜您，成功登入系統 ✅`;
        } else {
          document.querySelector(".update_result").innerText = "更新失敗 ❌";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}
