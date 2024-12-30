<template>
  <div class="center-container">
    <el-card :body-style="{ padding: '20px' }" class="sign-message-card">
      <!-- <div class="doc-info">
        <div class="doc-title">Docs:</div>
        <a :href="docUrl" target="_blank" class="doc-link">{{ docUrl }}</a>
      </div> -->

      <div class="message-input">
        <div class="message-title">CONTENT:</div>
        <el-input
          v-model="message"
          placeholder="Enter message to sign"
          :clearable="true"
          size="medium"
          class="input-field"
        />
      </div>

      <div v-if="result.success" class="result">
        <div class="result-title">Signature:</div>
        <div class="result-data">{{ result.data }}</div>
      </div>

      <div v-else-if="result.error" class="result">
        <div class="result-error">{{ result.error }}</div>
      </div>

      <div class="button-group">
        <el-button
          type="primary"
          @click="signMessage('ecdsa')"
          size="medium"
          class="sign-button"
        >
          Sign By ecdsa
        </el-button>


      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "hello world",
      result: {
        success: false,
        error: "",
        data: "",
      },
      // docUrl: "https://docs.unisat.io/dev/unisat-developer-center/unisat-wallet#signmessage",
    };
  },
  methods: {
    async signMessage(method) {
      this.result = { success: false, error: "Requesting...", data: "" };
      try {
        let signature;
        if (method === "ecdsa") {
          signature = await window.unisat.signMessage(this.message);
        } else if (method === "bip322-simple") {
          signature = await window.unisat.signMessage(this.message, "bip322-simple");
        }
        this.result = { success: true, error: "", data: signature };
      } catch (e) {
        this.result = { success: false, error: e.message, data: "" };
      }
    },
  },
};
</script>

<style scoped>
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.sign-message-card {
  margin: 20px;
  max-width: 500px;
  border-radius: 8px;
  width: 100%;
}

.doc-info {
  margin-bottom: 20px;
}

.doc-title {
  font-weight: bold;
  font-size: 14px;
}

.doc-link {
  color: #409eff;
  text-decoration: none;
}

.doc-link:hover {
  text-decoration: underline;
}

.message-input {
  margin-bottom: 20px;
}

.message-title {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
}

.input-field {
  width: 100%;
}

.result {
  margin-top: 20px;
}

.result-title {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
}

.result-data,
.result-error {
  word-wrap: break-word;
  font-size: 12px;
  color: #333;
}

.result-error {
  color: red;
}

.button-group {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.sign-button {
  width: 100%;
}
</style>
