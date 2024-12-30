<template>
      <el-footer class="footer">
        <div class="footer-container">
          <div class="footer-content">
            <div class="footer-logo">
              <h2 class="footer-brand">YUS</h2>
            </div>
            <div class="footer-links">
              <a href="#" class="footer-link">Terms of Service</a>
              <span class="divider">|</span>
              <a href="#" class="footer-link">Privacy Policy</a>
              <span class="divider">|</span>
              <a href="#" class="footer-link">Contact Us</a>
            </div>
          </div>
          <div class="footer-bottom">
            <div class="social-links">
              <a href="#" class="social-link" title="Twitter">
                <i class="el-icon-message"></i>
              </a>
              <a href="#" class="social-link" title="GitHub">
                <i class="el-icon-shopping-cart"></i>
              </a>
              <a href="#" class="social-link" title="LinkedIn">
                <i class="el-icon-user"></i>
              </a>
            </div>
          </div>
        </div>
      </el-footer>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
 
  .footer {
    margin-top: auto;
    background: linear-gradient(to bottom, rgba(24, 24, 27, 0.98), rgba(32, 32, 36, 0.98));
    color: #ffffff;
    padding: 0;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .footer-container {
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    padding: 40px 24px 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;
  }
  
  .footer-logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .footer-logo-image {
    height: 36px;
    width: auto;
    opacity: 0.8;
    transition: opacity 0.3s ease;
  }
  
  .footer-logo-image:hover {
    opacity: 1;
  }
  
  .footer-brand {
    font-size: 1.4em;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
  }
  
  .footer-links {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  
  .footer-link {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-size: 0.95em;
    transition: all 0.3s ease;
  }
  
  .footer-link:hover {
    color: #504f4f;
  }
  
  .divider {
    color: rgba(255, 255, 255, 0.3);
    font-size: 0.9em;
  }
  
  .social-links {
    display: flex;
    gap: 20px;
  }
  
  .social-link {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.2em;
    transition: all 0.3s ease;
  }
  
  .social-link:hover {
    color: #434343;
    transform: translateY(-2px);
  }
  
  :deep(.el-footer) {
    --el-footer-padding: 0;
    background: linear-gradient(to bottom, rgba(24, 24, 27, 0.98), rgba(32, 32, 36, 0.98));
  }
  
  @media (max-width: 768px) {
    .footer-container {
      padding: 32px 16px 20px;
    }
  
    .footer-content {
      flex-direction: column;
      text-align: center;
    }
  
    .footer-links {
      justify-content: center;
    }
  
    .footer-logo {
      justify-content: center;
    }
  
    .social-links {
      margin-top: 8px;
    }
  }
  </style>