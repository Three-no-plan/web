<template>
  <div class="wallet-container">
    <el-row justify="center">
      <el-col :span="22" :lg="16">
        <el-card class="wallet-card" shadow="hover">
          <!-- Common Address Input -->
          <div class="address-section">
            <h2 class="section-title">Target Address</h2>
            <el-input
              v-model="formData.toAddress"
              placeholder="Enter Bitcoin address"
              size="large"
              clearable
            />
          </div>

          <!-- Action Tabs -->
          <div class="actions-section">
            <el-tabs v-model="activeTab" class="action-tabs">
              <!-- Send Bitcoin -->
              <el-tab-pane label="Send Bitcoin" name="bitcoin">
                <el-form label-position="top">
                  <el-form-item label="Amount (Satoshis)">
                    <el-input-number
                      v-model="formData.satoshis"
                      :min="0"
                      :precision="0"
                      :step="1000"
                      class="w-full"
                      controls-position="right"
                    />
                  </el-form-item>
                  <el-button
                    type="primary"
                    @click="submitBitcoin"
                    :loading="loading.bitcoin"
                    class="submit-button"
                  >
                    Send Bitcoin
                  </el-button>
                </el-form>
              </el-tab-pane>

              <!-- Send Runes -->
              <el-tab-pane label="Send Runes" name="runes">
                <el-form label-position="top">
                  <el-form-item label="Rune ID">
                    <el-input
                      v-model="formData.runeid"
                      placeholder="Enter Rune ID"
                    />
                  </el-form-item>
                  <el-form-item label="Amount">
                    <el-input-number
                      v-model="formData.runeAmount"
                      :min="0"
                      :precision="0"
                      class="w-full"
                      controls-position="right"
                    />
                  </el-form-item>
                  <el-button
                    type="primary"
                    @click="submitRunesTransaction"
                    :loading="loading.runes"
                    class="submit-button"
                  >
                    Send Runes
                  </el-button>
                </el-form>
              </el-tab-pane>

              <!-- Send Inscription -->
              <el-tab-pane label="Send Inscription" name="inscription">
                <el-form label-position="top">
                  <el-form-item label="Inscription ID">
                    <el-input
                      v-model="formData.inscriptionId"
                      placeholder="Enter Inscription ID"

                      />
                  </el-form-item>
                  <el-button
                    type="primary"
                    @click="submitInscription"
                    :loading="loading.inscription"
                    class="submit-button"
                  >
                    Send Inscription
                  </el-button>
                </el-form>
              </el-tab-pane>

              <el-tab-pane label="Sign PSBT" name="psbt">
                <el-form label-position="top">
                  <el-form-item label="PSBT Hex">
                    <el-input
                      v-model="formData.psbtHex"
                      type="textarea"
                      :rows="4"
                      placeholder="Enter PSBT hex"
                    />
                  </el-form-item>
                  <el-button
                    type="primary"
                    @click="submitPSBTTransaction"
                    :loading="loading.psbt"
                    class="submit-button"
                  >
                    Sign PSBT
                  </el-button>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </div>

          <!-- Transaction Result -->
          <TransactionResult 
            v-if="currentResult.success || currentResult.error"
            :result="currentResult" 
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

// Transaction Result Component
const TransactionResult = {
  props: {
    result: Object
  },
  template: `
    <div class="transaction-result">
      <el-alert
        v-if="result.success"
        type="success"
        :title="'Transaction ID'"
        :description="result.data"
        show-icon
      />
      <el-alert
        v-if="result.error"
        type="error"
        :title="result.error"
        show-icon
      />
    </div>
  `
}

const activeTab = ref('bitcoin')

// Form Data
const formData = reactive({
  toAddress: '',
  inscriptionId: '',
  satoshis: 1000,
  runeid: '',
  runeAmount: 0,
  psbtHex: ''
})

// Loading States
const loading = reactive({
  inscription: false,
  bitcoin: false,
  runes: false,
  psbt: false
})

// Results
const results = reactive({
  inscription: { success: false, error: '', data: '' },
  bitcoin: { success: false, error: '', data: '' },
  runes: { success: false, error: '', data: '' },
  psbt: { success: false, error: '', data: '' }
})

// Current Result based on active tab
const currentResult = computed(() => results[activeTab.value])

// Transaction Handler
const handleTransaction = async (operation, resultKey, loadingKey, ...args) => {
  if (!formData.toAddress && resultKey !== 'psbt') {
    ElMessage.error('Please enter a Bitcoin address')
    return
  }
  
  loading[loadingKey] = true
  results[resultKey] = { success: false, error: '', data: '' }
  
  try {
    const response = await operation(...args)
    results[resultKey] = { success: true, error: '', data: response }
    ElMessage({
      message: 'Transaction submitted successfully',
      type: 'success'
    })
  } catch (e) {
    results[resultKey] = { success: false, error: e.message, data: '' }
    ElMessage({
      message: e.message,
      type: 'error'
    })
  } finally {
    loading[loadingKey] = false
  }
}

// Transaction Methods
const submitInscription = () => 
  handleTransaction(
    window.unisat.sendInscription,
    'inscription',
    'inscription',
    formData.toAddress,
    formData.inscriptionId
  )

const submitBitcoin = () =>
  handleTransaction(
    window.unisat.sendBitcoin,
    'bitcoin',
    'bitcoin',
    formData.toAddress,
    formData.satoshis
  )

const submitRunesTransaction = () =>
  handleTransaction(
    window.unisat.sendRunes,
    'runes',
    'runes',
    formData.toAddress,
    formData.runeid,
    formData.runeAmount
  )

const submitPSBTTransaction = () =>
  handleTransaction(
    window.unisat.signPsbt,
    'psbt',
    'psbt',
    formData.psbtHex
  )
</script>

<style scoped>
.wallet-container {
  min-height: 100vh;
  padding: 2rem;
}

.wallet-card {
  backdrop-filter: blur(20px);
  background-color: rgba(18, 18, 18, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.wallet-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.address-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 1.25rem;
  letter-spacing: 0.5px;
}

.actions-section {
  margin-top: 1.5rem;
}

.submit-button {
  width: 100%;
  margin-top: 1.5rem;
  height: 44px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.9);
}

.submit-button:hover {
  background: linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.2);
}

.submit-button:active {
  transform: translateY(0);
}

.transaction-result {
  margin-top: 2rem;
}

:deep(.el-input-number) {
  width: 100%;
  --el-input-bg-color: rgba(26, 26, 26, 0.95);
  --el-input-border-color: rgba(255, 255, 255, 0.08);
  --el-input-text-color: rgba(255, 255, 255, 0.9);
  --el-input-hover-border-color: rgba(255, 255, 255, 0.2);
}

:deep(.el-tabs__nav) {
  width: 100%;
  display: flex;
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(26, 26, 26, 0.95);
  border-radius: 8px;
  padding: 4px;
}

:deep(.el-tabs__item) {
  flex: 1;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  border-radius: 6px;
  margin: 0 2px;
}

:deep(.el-tabs__item.is-active) {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}

:deep(.el-tabs__nav-wrap::after) {
  background-color: transparent;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.5px;
}


:deep(.el-input__inner:hover),
:deep(.el-textarea__inner:hover) {
  border-color: rgba(255, 255, 255, 0.2);
}

:deep(.el-input__inner:focus),
:deep(.el-textarea__inner:focus) {
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

:deep(.el-alert) {
  background-color: rgba(28, 32, 38, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
}

:deep(.el-alert--success) {
  background-color: rgba(6, 58, 25, 0.95);
  border-color: rgba(6, 120, 50, 0.5);
}

:deep(.el-alert--error) {
  background-color: rgba(58, 6, 6, 0.95);
  border-color: rgba(120, 6, 6, 0.5);
}

:deep(.el-alert__title),
:deep(.el-alert__description) {
  color: rgba(255, 255, 255, 0.9);
}

:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  background: rgba(28, 32, 38, 0.95);
  border-color: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.9);
}

:deep(.el-input-number__decrease:hover),
:deep(.el-input-number__increase:hover) {
  background: rgba(247, 147, 26, 0.1);
  color: #f7931a;
}

:deep(.el-tabs__active-bar) {
  background-color: transparent;
}

:deep(.el-input__prefix-icon) {
  color: rgba(255, 255, 255, 0.7);
}

:deep(.el-input.is-active .el-input__inner) {
  border-color: #f7931a;
  box-shadow: 0 0 0 2px rgba(247, 147, 26, 0.2);
}

@media (max-width: 768px) {
  .wallet-container {
    padding: 1rem;
  }
  
  :deep(.el-tabs__item) {
    padding: 8px;
    font-size: 0.875rem;
  }
  
  .section-title {
    font-size: 1.125rem;
  }
}
</style>