<template>
  <div>
    <div class="user_top">
      <div class="show_hello">
        <h1 class="hello">HELLO</h1>
      </div>

      <div class="show_name">
        <h1>{{ userName }}</h1>
      </div>
    </div>

    <div class="user_bottom">
        <div class="user_detail">
            <div class="account-info">
                <div class="account-header">
                    <i class="fas fa-user-edit"></i>
                    <h2>THÔNG TIN TÀI KHOẢN</h2>
                    <a href="#">Chỉnh sửa</a>
                </div>
                <div class="account-grid">
                    <div>
                        <strong>Username</strong>
                        <h3>{{ userName }}</h3>
                    </div>

                    <div>
                        <strong>Date Created</strong>
                        <h3>{{ userCreated }}</h3>
                    </div>

                    <div>
                        <strong>Email</strong>
                        <h3>{{ userEmail }}</h3>
                    </div>


                    <div>
                        <strong>Mobile</strong>
                        <h3>{{ userMobile }}</h3>
                    </div>

                </div>
            </div>
        </div>

        <div class="user_address"></div>
            <h2>hello</h2>
        </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const message = ref("");

const userName = ref(null);
const userEmail = ref(null);
const userAddress = ref(null);
const userMobile = ref(null);
const userCreated = ref(null);

const getUserData = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/v1/user/", {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();

    if (response.ok) {
      userName.value = data.user.user_name;
      userEmail.value = data.user.user_email;
      userAddress.value = data.user.user_address;
      userMobile.value = data.user.user_mobile;
      userCreated.value = data.user.date_created;
    }
  } catch (err) {
    message.value = "Failed to receiving user data";
    console.error(err);
  }
};
onMounted(() => {
  getUserData();
});
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";

.show_hello {
  font-family: Georgia, "Times New Roman", Times, serif;
  font-size: 20px;
  color: aliceblue;
  padding-top: 50px;
  padding-left: 48px;
}
.show_name {
  font-family: Georgia, "Times New Roman", Times, serif;
  font-size: 20px;
  color: aliceblue;
  padding-left: 48px;
}
@keyframes scroll-left {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
.user_top {
    height: 260px;
    margin-top: 3px;
    font-size: 25px;
    font-weight: bold;
    background-color: rgb(151, 151, 151);
}

.account-info {
    width: 35%;
    margin: 0 auto;
    padding: 24px;
    border: 1px solid #c6c6c6;
    background-color: white;
    margin-top: 5%;
}

.account-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.account-header h2 {
    font-size: 18px;
    font-family: Georgia, "Times New Roman", Times, serif;
    font-weight: bold;
    color: rgb(0, 0, 0);
    text-transform: uppercase;
    margin-right: 40%;
}

.account-header a {
    font-size: 14px;
    color: rgba(30, 29, 29, 0.779);
    text-decoration: none;
}

.account-header a:hover {
    text-decoration: underline;
}

.account-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 24px;
  font-size: 14px;
  color: #444;
}

.account-grid strong {
    display: block;
    font-weight: 600;
    margin-bottom: 4px;
}
</style>
