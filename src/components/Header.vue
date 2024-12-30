<template>
  <el-header class="header">
    <div class="nav-container">
      <div class="logo-section">
        <div class="logo-link">
          <img src="@/assets/logo.png" alt="Logo" class="logo-image"/>
          <h1 class="site-title">Nomad VM Beta</h1>
        </div>
      </div>   
      <div class="center-section">
        <nav class="nav-links">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/ordinals" class="nav-link">ordinals</router-link>
          <router-link to="/wallet" class="nav-link">wallet</router-link>
        </nav>
      </div>

      <div class="right-section">
        <el-input
          v-model="searchQuery"
          placeholder="Search..."
          class="search-input"
          :prefix-icon="Search"
        />

      <el-dropdown v-if="isConnected" trigger="hover" @command="handleCommand">
        <el-button 
          type="danger" 
          class="wallet-btn address-btn"
        >
          {{ truncatedAddress }}
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <div class="balance-item">
                <span>Balance:</span>
                <span>{{ balance }} BTC</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div class="network-item">
                <span>Network:</span>
                <span>{{ network }}</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              Log out
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-button 
        v-else 
        type="danger" 
        class="wallet-btn" 
        :loading="connecting"
        @click="connectWallet"
      >
        {{ connecting ? 'Connecting...' : 'Connect Wallet' }}
      </el-button>
      </div>
    </div>
  </el-header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchQuery = ref('')
const isConnected = ref(false)
const connecting = ref(false)
const address = ref('')
const balance = ref('0.0000')
const network = ref('Mainnet')
  
const truncatedAddress = computed(() => {
  if (!address.value) return ''
  return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`
})

const connectWallet = async () => {
  if (typeof window.unisat === 'undefined') {
    ElMessage.error('Please install Unisat Wallet first')
    return
  }

  try {
    connecting.value = true
    const accounts = await window.unisat.requestAccounts()
    
    if (accounts && accounts.length > 0) {
      address.value = accounts[0]
      await updateWalletInfo()
      isConnected.value = true
    }
  } catch (e) {
    ElMessage.error('Failed to connect wallet')
    console.error(e)
  } finally {
    connecting.value = false
  }
}

const updateWalletInfo = async () => {
  try {
    const balanceResult = await window.unisat.getBalance()
    balance.value = (balanceResult.total / 100000000).toFixed(8)
    
    const networkResult = await window.unisat.getNetwork()
    network.value = networkResult === 'livenet' ? 'Mainnet' : 'Testnet'
  } catch (e) {
    console.error('Failed to get wallet info:', e)
  }
}

const handleCommand = (command) => {
  if (command === 'logout') {
    logout()
  }
}

const logout = () => {
  isConnected.value = false
  address.value = ''
  balance.value = '0.0000'
  ElMessage.success('Successfully logged out')
}

if (typeof window !== 'undefined' && window.unisat) {
  window.unisat.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
      logout()
    } else {
      address.value = accounts[0]
      updateWalletInfo()
    }
  })

  window.unisat.on('networkChanged', (network) => {
    updateWalletInfo()
  })
}
</script>

<style scoped>
.header {
  background: linear-gradient(to right, rgba(24, 24, 27, 0.95), rgba(32, 32, 36, 0.95));
  padding: 0;
  height: auto !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 70px;
}

.logo-section {
  flex: 0 0 auto;
  margin-right: 48px;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
}

.logo-image {
  height: 42px;
  width: auto;
  transition: transform 0.3s ease;
}

.logo-link:hover .logo-image {
  transform: scale(1.05);
}

.site-title {
  color: #ffffff;
  font-size: 1.6em;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.5px;
}

.center-section {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 1.1em;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}

.router-link-active {
  color: #a6a6a6;
  background: rgba(0, 0, 0, 0.1);
}

.right-section {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-input {
  width: 260px;
  --el-input-bg-color: rgba(255, 255, 255, 0.08);
  --el-input-border-color: transparent;
  --el-input-text-color: #ffffff;
  --el-input-hover-border-color: #ff4d4f;
  --el-input-focus-border-color: #ff4d4f;
  transition: all 0.3s ease;
}

.search-input:hover {
  --el-input-bg-color: rgba(255, 255, 255, 0.12);
}

.search-input :deep(.el-input__inner) {
  color: #ffffff;
  height: 40px;
  border-radius: 20px;
}

.search-input :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.6);
}

.search-input :deep(.el-input__prefix) {
  color: rgba(255, 255, 255, 0.6);
}

.wallet-btn {
  height: 40px;
  padding: 0 24px;
  font-weight: 500;
  border-radius: 20px;
  border: none;
  transition: all 0.3s ease;
}

.wallet-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
}

@media (max-width: 1024px) {
  .nav-container {
    padding: 0 16px;
  }
  
  .logo-section {
    margin-right: 24px;
  }

  .nav-links {
    gap: 20px;
  }

  .search-input {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .site-title {
    display: none;
  }
  
  .nav-links {
    gap: 16px;
  }

  .nav-link {
    font-size: 1em;
  }

  .search-input {
    width: 160px;
  }

  .wallet-btn {
    padding: 0 16px;
  }
}

.address-btn {
  display: flex;
  align-items: center;
  gap: 4px;
}

.balance-item,
.network-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  gap: 12px;
}

:deep(.el-dropdown-menu__item) {
  line-height: 1.5;
  padding: 8px 12px;
}

:deep(.el-dropdown-menu__item--divided) {
  margin-top: 6px;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>