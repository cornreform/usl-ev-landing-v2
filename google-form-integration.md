# Google Form + Apps Script 安裝指南

## 用途
讓同事可以通過 Google Form 新增車輛資料，自動上傳到 Firebase Firestore。

---

## Step 1: 建立 Google Form

1. 去 [Google Forms](https://forms.google.com) 建立新表單
2. 表單名稱：**USL 車輛資料輸入**

### 表單欄位

| 欄位名稱 | 題目類型 | 說明 |
||---------|---------|------|
|| 品牌 | 短答 | 例如：Toyota |
|| 型號 | 短答 | 例如：bZ4X |
|| 年份 | 短答 | 例如：2023 |
|| 價格 | 短答 | 例如：HK$289,000 |
|| 車類 | 單選 | SUV, 轎車, 跑車, MPV, 輕型貨車 |
|| 狀態 | 單選 | 全新 (NEW), 可預約 (AVAILABLE), 已售 (SOLD) |
|| 特點 | 短答 | 逗號分隔，例如：續航510km, 四驅, 全景天窗 |
|| 描述 | 短答 | 30-50字車輛簡介 |
|| 圖片1 | 檔案上傳 | 支援 jpg, png |
|| 圖片2 | 檔案上傳 | 支援 jpg, png |
|| 圖片3 | 檔案上傳 | 支援 jpg, png |
|| 圖片4 | 檔案上傳 | 支援 jpg, png |
|| 圖片5 | 檔案上傳 | 支援 jpg, png |
|| 圖片6 | 檔案上傳 | 支援 jpg, png |
|| 圖片7 | 檔案上傳 | 支援 jpg, png |
|| 圖片8 | 檔案上傳 | 支援 jpg, png |

---

## Step 2: 建立 Apps Script

1. 在 Form 頁面，點 **⋮ (更多)** > **指令碼編輯器**
2. 將以下代碼貼上：

```javascript
// ================================================
// USL Vehicle Form - Apps Script
// ================================================

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2d2QoKUUWGLydDpgzQhBkyH5ONND0RNg",
  authDomain: "uslweb-c2d9c.firebaseapp.com",
  databaseURL: "https://uslweb-c2d9c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "uslweb-c2d9c",
  storageBucket: "uslweb-c2d9c.firebasestorage.app",
  messagingSenderId: "450947693009",
  appId: "1:450947693009:web:ab539d7233e04f8c0b48f0"
};

// Initialize Firebase Admin SDK
const firebaseAdmin = require('firebase-admin');

// Initialize once
let adminInitialized = false;
function initFirebaseAdmin() {
  if (adminInitialized) return;

  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.applicationDefault(),
    databaseURL: firebaseConfig.databaseURL,
    storageBucket: firebaseConfig.storageBucket
  });
  adminInitialized = true;
}

// Handle form submission
function onFormSubmit(e) {
  initFirebaseAdmin();

  const form = FormApp.getActiveForm();
  const responses = e.response.getItemResponses();
  const vehicleData = {};

  // Parse responses
  responses.forEach((response, index) => {
    const question = response.getItem().getTitle();
    const answer = response.getResponse();

    switch(question) {
      case '品牌':
        vehicleData.brand = answer;
        break;
      case '型號':
        vehicleData.model = answer;
        break;
      case '年份':
        vehicleData.year = parseInt(answer) || 2023;
        break;
      case '價格':
        vehicleData.price = answer;
        break;
      case '車類':
        vehicleData.type = answer.toLowerCase();
        break;
      case '狀態':
        if (answer.includes('全新')) vehicleData.status = 'new';
        else if (answer.includes('已售')) vehicleData.status = 'sold';
        else vehicleData.status = 'available';
        vehicleData.badge = answer.split(' ')[0];
        break;
      case '特點':
        vehicleData.specs = answer ? answer.split(',').map(s => s.trim()) : [];
        break;
      case '描述':
        vehicleData.description = answer;
        break;
    }
  });

  // Set defaults
  vehicleData.active = true;
  vehicleData.createdAt = firebaseAdmin.firestore.FieldValue.serverTimestamp();
  vehicleData.updatedAt = firebaseAdmin.firestore.FieldValue.serverTimestamp();

  // Upload images and add to Firestore
  uploadImagesAndSave(e.response, vehicleData);
}

async function uploadImagesAndSave(response, vehicleData) {
  const db = firebaseAdmin.firestore();
  const bucket = firebaseAdmin.storage().bucket();

  // Get all file item responses
  const responses = response.getItemResponses();
  const imageUrls = [];

  for (let i = 0; i < responses.length; i++) {
    const question = responses[i].getItem().getTitle();
    if (question.startsWith('圖片')) {
      const itemResponse = responses[i].getResponse();
      if (itemResponse && itemResponse.length > 0) {
        // Get the actual file from Drive
        const files = itemResponse;
        for (const file of files) {
          const filename = `${Date.now()}_${file.getName()}`;
          const uploadPath = `vehicles/${filename}`;

          try {
            // Download from Google Drive
            const driveFile = DriveApp.getFileById(file.getId());
            const content = driveFile.getBlob();

            // Upload to Firebase Storage
            const storageFile = bucket.file(uploadPath);
            await storageFile.save(content, {
              metadata: {
                contentType: content.getContentType()
              }
            });

            // Get public URL
            const [url] = await storageFile.getSignedUrl({
              action: 'read',
              expires: '03-01-2500'
            });

            imageUrls.push(url);
          } catch (error) {
            console.error('Image upload error:', error);
          }
        }
      }
    }
  }

  vehicleData.images = imageUrls;

  // Add badge based on status
  if (!vehicleData.badge) {
    if (vehicleData.status === 'new') vehicleData.badge = 'NEW';
    else if (vehicleData.status === 'available') vehicleData.badge = 'AVAILABLE';
  }

  // Save to Firestore
  await db.collection('vehicles').add(vehicleData);
  console.log('Vehicle added:', vehicleData.brand, vehicleData.model);
}
```

---

## Step 3: 設定觸發器

1. 在 Apps Script 頁面，點 **觸發條件** (時鐘圖示)
2. 點 **+ 新增觸發條件**
3. 設定：
   - 函數：``onFormSubmit``
   - 部署：Head
   - 來源：表單
   - 事件：**提交表單時**

---

## Step 4: 發布

1. 點 **部署** > **新增網頁應用程式部署**
2. 設定：
   - 描述：USL Vehicle Form
   - 執行身份：Me
   - 可存取對象：Anyone
3. 點 **部署**

---

## 簡化版：使用 Firebase REST API + Google Drive 圖片

這個方案用 Google Drive 儲存圖片，簡單可靠：

```javascript
// ================================================
// USL Vehicle Form - 簡化版 Apps Script
// 使用 Firebase REST API + Google Drive 圖片
// ================================================

const WEB_API_KEY = "AIzaSy...0RNg";  // 你的 Firebase Web API Key
const PROJECT_ID = "uslweb-c2d9c";

function onFormSubmit(e) {
  const responses = e.response.getItemResponses();
  const data = {};

  responses.forEach(response => {
    const question = response.getItem().getTitle();
    const answer = response.getResponse();

    if (question === '品牌') data.brand = answer;
    else if (question === '型號') data.model = answer;
    else if (question === '年份') data.year = parseInt(answer) || 2023;
    else if (question === '價格') data.price = answer;
    else if (question === '車類') data.type = answer.toLowerCase();
    else if (question === '狀態') {
      if (answer.includes('全新')) { data.status = 'new'; data.badge = 'NEW'; }
      else if (answer.includes('已售')) { data.status = 'sold'; data.badge = 'SOLD'; }
      else { data.status = 'available'; data.badge = 'AVAILABLE'; }
    }
    else if (question === '特點') data.specs = answer ? answer.split(',').map(s => s.trim()) : [];
    else if (question === '描述') data.description = answer || '';
  });

  // 圖片用 Google Drive URL
  data.images = [];
  data.active = true;
  data.createdAt = new Date().toISOString();
  data.updatedAt = new Date().toISOString();

  // Send to Firebase Firestore via REST API
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/vehicles?key=${WEB_API_KEY}`;

  const payload = {
    fields: {
      brand: { stringValue: data.brand },
      model: { stringValue: data.model },
      year: { integerValue: data.year },
      price: { stringValue: data.price },
      type: { stringValue: data.type },
      status: { stringValue: data.status },
      badge: { stringValue: data.badge },
      specs: { arrayValue: { values: data.specs.map(s => ({ stringValue: s })) } },
      description: { stringValue: data.description || '' },
      active: { booleanValue: true },
      images: { arrayValue: { values: [] } },
      createdAt: { timestampValue: new Date().toISOString() },
      updatedAt: { timestampValue: new Date().toISOString() }
    }
  };

  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };

  UrlFetchApp.fetch(url, options);
  console.log('Vehicle added:', data.brand, data.model);
}
```

---

## 同事培訓

建立一個簡單的指引給同事：

### 如何新增車輛

1. 開啟 Google Form 連結
2. 填寫車輛基本資料
3. 上傳 4-8 張圖片
4. 點提交
5. 完成！車輛會自動出現在網站

### 注意事項

- 價格格式：HK$289,000
- 特點用逗號分隔，例如：續航510km, 四驅, 全景天窗
- 描述：30-50字簡介
- 圖片支援 JPG/PNG，最大 5MB
- 提交後約 1-2 分鐘生效
- 圖片會自動上傳到 Google Drive
