<template>
  <div class="auth-page">
    <div class="background-animation">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
    
    <div class="auth-container">
      <div class="auth-card">
        <!-- Header -->
        <div class="auth-header">
          <div class="logo">
            <i class="fas fa-gem logo-icon"></i>
            <h1 class="brand-name">Xies Xies</h1>
          </div>
          <h2 class="welcome-title">{{ isLogin ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới' }}</h2>
          <p class="welcome-subtitle">
            {{ isLogin ? 'Đăng nhập để nhận các ưu đãi độc quyền' : 'Tham gia cộng đồng trang sức cao cấp' }}
          </p>
        </div>

        <!-- Tabs -->
        <div class="auth-tabs">
          <button
            :class="{ active: isLogin }"
            @click="switchToLogin"
            class="tab-button"
          >
            <span class="tab-text">Đăng nhập</span>
          </button>
          <button
            :class="{ active: !isLogin }"
            @click="switchToRegister"
            class="tab-button"
          >
            <span class="tab-text">Đăng ký</span>
          </button>
        </div>

        <!-- Forms Container -->
        <div class="forms-container">
          <!-- Login Form -->
          <div v-if="isLogin" class="form-wrapper">
            <form @submit.prevent="handleLogin" class="auth-form">
              <!-- Social Login (chỉ hiện ở login) -->
              <div class="social-login">
                <button type="button" @click="handleGoogleLogin" class="google-login-btn">
                  <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Đăng nhập với Google</span>
                </button>
              </div>

              <div class="divider">
                <span class="divider-text">hoặc</span>
              </div>

              <div class="input-group">
                <div class="input-wrapper">
                  <i class="fas fa-user input-icon"></i>
                  <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    v-model="loginForm.username"
                    class="form-input"
                    required
                  />
                </div>
              </div>

              <div class="input-group">
                <div class="input-wrapper">
                  <i class="fas fa-lock input-icon"></i>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Mật khẩu"
                    v-model="loginForm.password"
                    class="form-input"
                    required
                  />
                  <button
                    type="button"
                    @click="togglePassword"
                    class="password-toggle"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="forgot-password">
                <a href="#" class="forgot-link">Quên mật khẩu?</a>
              </div>

              <button type="submit" class="submit-button" :disabled="isLoading">
                <span v-if="!isLoading" class="button-content">
                  <span>Đăng nhập</span>
                  <i class="fas fa-arrow-right button-icon"></i>
                </span>
                <span v-else class="loading-spinner">
                  <i class="fas fa-spinner fa-spin"></i>
                </span>
              </button>
            </form>
          </div>

          <!-- Register Form -->
          <div v-else class="form-wrapper">
            <form @submit.prevent="handleRegister" class="auth-form">
              <div class="input-group">
                <div class="input-wrapper">
                  <i class="fas fa-user input-icon"></i>
                  <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    v-model="registerForm.username"
                    class="form-input"
                    required
                  />
                </div>
              </div>

              <div class="input-group">
                <div class="input-wrapper">
                  <i class="fas fa-envelope input-icon"></i>
                  <input
                    type="email"
                    placeholder="Email"
                    v-model="registerForm.email"
                    class="form-input"
                    required
                  />
                </div>
              </div>

              <div class="input-group">
                <div class="input-wrapper">
                  <i class="fas fa-home input-icon"></i>
                  <input
                    type="text"
                    placeholder="Địa chỉ"
                    v-model="registerForm.address"
                    class="form-input"
                    required
                  />
                </div>
              </div>

              <div class="input-group">
                <div class="input-wrapper">
                  <i class="fas fa-lock input-icon"></i>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Mật khẩu"
                    v-model="registerForm.password"
                    class="form-input"
                    required
                  />
                  <button
                    type="button"
                    @click="togglePassword"
                    class="password-toggle"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="input-group">
                <div class="input-wrapper">
                  <i class="fas fa-shield-alt input-icon"></i>
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="Xác nhận mật khẩu"
                    v-model="registerForm.confirmPass"
                    class="form-input"
                    required
                  />
                  <button
                    type="button"
                    @click="toggleConfirmPassword"
                    class="password-toggle"
                  >
                    <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="terms-section">
                <label class="checkbox-wrapper">
                  <input type="checkbox" v-model="agreeTerms" class="checkbox" required />
                  <span class="checkmark">
                    <i class="fas fa-check check-icon"></i>
                  </span>
                  <span class="checkbox-label">
                    Tôi đồng ý với 
                    <a href="#" class="terms-link">Điều khoản sử dụng</a> 
                    và 
                    <a href="#" class="terms-link">Chính sách bảo mật</a>
                  </span>
                </label>
              </div>

              <button type="submit" class="submit-button" :disabled="isLoading || !agreeTerms">
                <span v-if="!isLoading" class="button-content">
                  <span>Tạo tài khoản</span>
                  <i class="fas fa-arrow-right button-icon"></i>
                </span>
                <span v-else class="loading-spinner">
                  <i class="fas fa-spinner fa-spin"></i>
                </span>
              </button>
            </form>
          </div>
        </div>

        <!-- Error/Success Message -->
        <div v-if="message" class="message" :class="messageType">
          <i class="message-icon" :class="messageType === 'error' ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'"></i>
          <span>{{ message }}</span>
        </div>

        <!-- Footer -->
        <div class="auth-footer">
          <p class="footer-text">
            {{ isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?' }}
            <button @click="toggleAuthMode" class="switch-mode-btn">
              {{ isLogin ? 'Đăng ký ngay' : 'Đăng nhập ngay' }}
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const message = ref('')
const messageType = ref('error') // 'error' or 'success'
const isLoading = ref(false)

const router = useRouter()
const isLogin = ref(true)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreeTerms = ref(false)

// State form
const loginForm = ref({
  username: '',
  password: '',
})

const registerForm = ref({
  username: '',
  email: '',
  address: '',
  password: '',
  confirmPass: '',
  date: ''
})

// Load FontAwesome
onMounted(() => {
  // Kiểm tra nếu FontAwesome chưa được load
  if (!document.querySelector('link[href*="fontawesome"]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    document.head.appendChild(link)
  }
})

const switchToLogin = () => {
  isLogin.value = true
  clearMessage()
}

const switchToRegister = () => {
  isLogin.value = false
  clearMessage()
}

const toggleAuthMode = () => {
  isLogin.value = !isLogin.value
  clearMessage()
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const clearMessage = () => {
  message.value = ''
}

const showMessage = (msg, type = 'error') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

const getDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const currentDateTime = `${year}-${month}-${day}`
  registerForm.value.date = currentDateTime
}


const handleGoogleLogin = () => {
  window.location.href = 'http://localhost:3000/auth/google';
}


const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    showMessage('Vui lòng nhập đầy đủ thông tin', 'error')
    return
  }

  isLoading.value = true
  clearMessage()

  const { username, password } = loginForm.value
  try {
    const response = await fetch('http://localhost:3000/api/v1/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    })
    
    const resData = await response.json()
    
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(resData.message))
      showMessage('Đăng nhập thành công!', 'success')
      setTimeout(() => {
        router.push('/userpage')
      }, 1500)
    } else {
      showMessage(resData.message || 'Đăng nhập thất bại', 'error')
    }
  } catch (err) {
    showMessage('Lỗi kết nối đến máy chủ', 'error')
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  const { username, email, address, password, confirmPass } = registerForm.value
  
  if (!username || !email || !address || !password || !confirmPass) {
    showMessage('Vui lòng điền đầy đủ thông tin', 'error')
    return
  }

  if (password !== confirmPass) {
    showMessage('Mật khẩu xác nhận không khớp', 'error')
    return
  }

  if (password.length < 6) {
    showMessage('Mật khẩu phải có ít nhất 6 ký tự', 'error')
    return
  }

  if (!agreeTerms.value) {
    showMessage('Vui lòng đồng ý với điều khoản sử dụng', 'error')
    return
  }

  isLoading.value = true
  clearMessage()
  getDate()

  try {
    const response = await fetch('http://localhost:3000/api/v1/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, email, address, password, confirmPass, date: registerForm.value.date })
    })

    const resData = await response.json()

    if (response.ok) {
      showMessage('Đăng ký thành công!', 'success')
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } else {
      showMessage(resData.message || 'Đăng ký thất bại', 'error')
    }
  } catch (err) {
    showMessage('Lỗi kết nối đến máy chủ', 'error')
    console.error(err)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
  overflow: hidden;
}

.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 60%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.auth-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 450px;
  margin: 20px;
}

.auth-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.logo-icon {
  font-size: 2.5rem;
  color: #667eea;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}

.brand-name {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.welcome-subtitle {
  color: #718096;
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
}

.auth-tabs {
  display: flex;
  background: #f7fafc;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 32px;
}

.tab-button {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  color: #718096;
}

.tab-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.forms-container {
  position: relative;
}

.form-wrapper {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.3s ease;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.social-login {
  margin-bottom: 8px;
}

.google-login-btn {
  width: 100%;
  padding: 14px 20px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.95rem;
  color: #4a5568;
}

.google-login-btn:hover {
  border-color: #cbd5e0;
  background: #f7fafc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.google-icon {
  flex-shrink: 0;
}

.divider {
  display: flex;
  align-items: center;
  margin: 16px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.divider-text {
  padding: 0 16px;
  color: #a0aec0;
  font-size: 0.9rem;
  font-weight: 500;
}

.input-group {
  position: relative;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  font-size: 1.1rem;
  z-index: 2;
  pointer-events: none;
  color: #a0aec0;
}

.form-input {
  width: 100%;
  padding: 16px 16px 16px 50px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  color: #2d3748;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:focus + .input-icon {
  color: #667eea;
}

.form-input::placeholder {
  color: #a0aec0;
}

.password-toggle {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: #a0aec0;
  z-index: 2;
  padding: 8px;
  border-radius: 4px;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #718096;
}

.password-toggle i {
  font-size: 1.1rem;
}

.forgot-password {
  text-align: right;
  margin-top: -8px;
}

.forgot-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.terms-section {
  margin: 8px 0;
}

.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  font-size: 0.9rem;
  line-height: 1.5;
}

.checkbox {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e0;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox:checked + .checkmark {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.check-icon {
  color: white;
  font-size: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.checkbox:checked + .checkmark .check-icon {
  opacity: 1;
}

.checkbox-label {
  color: #4a5568;
}

.terms-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.terms-link:hover {
  text-decoration: underline;
}

.submit-button {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.button-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.button-icon {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.submit-button:hover:not(:disabled) .button-icon {
  transform: translateX(4px);
}

.loading-spinner i {
  font-size: 1.2rem;
}

.message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.message.error {
  background: #fed7d7;
  color: #c53030;
  border: 1px solid #feb2b2;
}

.message.success {
  background: #c6f6d5;
  color: #2f855a;
  border: 1px solid #9ae6b4;
}

.message-icon {
  font-size: 1.1rem;
}

.auth-footer {
  text-align: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.footer-text {
  color: #718096;
  font-size: 0.95rem;
  margin: 0;
}

.switch-mode-btn {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  font-size: inherit;
  transition: color 0.3s ease;
}

.switch-mode-btn:hover {
  color: #764ba2;
}

/* Responsive */
@media (max-width: 480px) {
  .auth-card {
    padding: 28px 24px;
    margin: 16px;
    border-radius: 20px;
  }
  
  .welcome-title {
    font-size: 1.5rem;
  }
  
  .brand-name {
    font-size: 1.7rem;
  }
  
  .logo-icon {
    font-size: 2rem;
  }
}
</style>