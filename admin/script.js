/**
 * USL Admin Panel - JavaScript
 * Ultimate Speed Limited
 */

// State
let vehicles = [];
let selectedImages = [];
let currentFilter = 'all';

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initImageUpload();
    initAddVehicleForm();
    initEditModal();
    initFilters();
});

// ================================================
// Activity Log
// ================================================

async function logActivity(action, details) {
    try {
        await db.collection('logs').add({
            action: action,
            details: details,
            user: auth.currentUser ? auth.currentUser.email : 'system',
            uid: auth.currentUser ? auth.currentUser.uid : null,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Error logging activity:', error);
    }
}

// ================================================
// Authentication
// ================================================

function initAuth() {
    const loginPage = document.getElementById('loginPage');
    const dashboard = document.getElementById('adminDashboard');
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');

    // Check auth state
    auth.onAuthStateChanged((user) => {
        if (user) {
            loginPage.classList.add('hidden');
            dashboard.classList.remove('hidden');
            loadVehicles();
            logActivity('login', { email: user.email });
        } else {
            loginPage.classList.remove('hidden');
            dashboard.classList.add('hidden');
            vehicles = [];
            renderVehicles();
        }
    });

    // Logout
    logoutBtn.addEventListener('click', async () => {
        const user = auth.currentUser;
        await auth.signOut();
        if (user) {
            logActivity('logout', { email: user.email });
        }
    });

    // Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        loginError.textContent = '';

        try {
            await auth.signInWithEmailAndPassword(email, password);
            loginForm.reset();
        } catch (error) {
            console.error('Login error:', error);
            loginError.textContent = '登入失敗：' + getAuthErrorMessage(error.code);
        } finally {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    });
}

function getAuthErrorMessage(code) {
    const messages = {
        'auth/user-not-found': '用戶不存在',
        'auth/wrong-password': '密碼錯誤',
        'auth/invalid-email': '無效的電郵地址',
        'auth/weak-password': '密碼強度不足',
        'auth/email-already-in-use': '電郵已被使用',
        'auth/invalid-credential': '憑證無效',
        'auth/too-many-requests': '嘗試次數過多，請稍後再試'
    };
    return messages[code] || '請檢查電郵及密碼';
}

// ================================================
// Load Vehicles
// ================================================

async function loadVehicles() {
    const list = document.getElementById('vehicleList');
    list.innerHTML = '<div class="loading-spinner">載入中...</div>';

    try {
        const snapshot = await db.collection('vehicles')
            .orderBy('createdAt', 'desc')
            .get();

        vehicles = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        updateStats();
        renderVehicleList();
    } catch (error) {
        console.error('Error loading vehicles:', error);
        list.innerHTML = '<div class="loading-spinner">載入失敗：' + error.message + '</div>';
    }
}

function updateStats() {
    const total = vehicles.length;
    const available = vehicles.filter(v => v.status === 'available').length;
    const newVeh = vehicles.filter(v => v.status === 'new').length;

    document.getElementById('totalVehicles').textContent = total;
    document.getElementById('availableVehicles').textContent = available;
    document.getElementById('newVehicles').textContent = newVeh;
}

function renderVehicleList() {
    const list = document.getElementById('vehicleList');

    const filtered = currentFilter === 'all'
        ? vehicles
        : vehicles.filter(v => v.status === currentFilter);

    if (filtered.length === 0) {
        list.innerHTML = '<div class="loading-spinner">暫無車輛</div>';
        return;
    }

    list.innerHTML = filtered.map(v => `
        <div class="vehicle-item" data-id="${v.id}">
            <div class="vehicle-thumb">
                <img src="${v.images?.[0] || ''}" alt="${v.make} ${v.model}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 60%22><rect fill=%22%231A1A1A%22 width=%22100%22 height=%2260%22/><text x=%2250%22 y=%2235%22 text-anchor=%22middle%22 fill=%22%238A8A8A%22 font-size=%2212%22>No Image</text></svg>'">
            </div>
            <div class="vehicle-info">
                <div class="vehicle-name">${v.year} ${v.make} ${v.model}</div>
                <div class="vehicle-meta">
                    <span>${v.price}</span>
                    <span>${v.type?.toUpperCase() || ''}</span>
                    <span class="vehicle-status ${v.status}">${getStatusLabel(v.status)}</span>
                </div>
            </div>
            <div class="vehicle-actions">
                <button class="btn-share share-btn" data-id="${v.id}">分享</button>
                <button class="btn-secondary edit-btn" data-id="${v.id}">編輯</button>
                <button class="btn-danger delete-btn" data-id="${v.id}">刪除</button>
            </div>
        </div>
    `).join('');

    // Attach handlers
    list.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => shareVehicle(btn.dataset.id));
    });
    list.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => openEditModal(btn.dataset.id));
    });

    list.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteVehicle(btn.dataset.id));
    });
}

function getStatusLabel(status) {
    const labels = { new: '全新', available: '可預約', reserved: 'Reserved / On Hold', sold: '已售' };
    return labels[status] || status;
}

// ================================================
// Image Upload
// ================================================

function initImageUpload() {
    const uploadArea = document.getElementById('imageUploadArea');
    const fileInput = document.getElementById('imageFiles');
    const previewGrid = document.getElementById('imagePreviewGrid');

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
}

function handleFiles(files) {
    const maxFiles = 10;
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
        if (selectedImages.length >= maxFiles) {
            alert('最多只能上傳 10 張圖片');
            break;
        }

        if (!file.type.startsWith('image/')) {
            alert('請上傳圖片文件');
            continue;
        }

        if (file.size > maxSize) {
            alert('圖片大小不能超過 5MB');
            continue;
        }

        selectedImages.push(file);
    }

    renderImagePreviews();
}

function renderImagePreviews() {
    const previewGrid = document.getElementById('imagePreviewGrid');

    previewGrid.innerHTML = selectedImages.map((file, i) => `
        <div class="image-preview" data-index="${i}">
            <img src="${URL.createObjectURL(file)}" alt="Preview ${i + 1}">
            <button class="remove-btn" data-index="${i}">x</button>
        </div>
    `).join('');

    previewGrid.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            selectedImages.splice(index, 1);
            renderImagePreviews();
        });
    });
}

// ================================================
// Add Vehicle Form
// ================================================

function initAddVehicleForm() {
    const form = document.getElementById('addVehicleForm');
    const toggleBtn = document.getElementById('toggleAddForm');

    toggleBtn.addEventListener('click', () => {
        form.classList.toggle('hidden');
        toggleBtn.innerHTML = form.classList.contains('hidden')
            ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> 展開`
            : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg> 收合`;
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitVehicle();
    });
}

async function submitVehicle() {
    const submitBtn = document.getElementById('submitVehicle');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
        // Upload images first
        const imageUrls = await uploadImages();

        // Prepare vehicle data
        const specsStr = document.getElementById('specs').value;
        const specs = specsStr ? specsStr.split(',').map(s => s.trim()).filter(Boolean) : [];

        const vehicleData = {
            make: document.getElementById('make').value,
            model: document.getElementById('model').value,
            year: parseInt(document.getElementById('year').value),
            price: document.getElementById('price').value,
            color: document.getElementById('color').value,
            type: document.getElementById('type').value,
            powertrain: document.getElementById('powertrain').value,
            status: document.getElementById('status').value,
            specs: specs,
            description: document.getElementById('description').value,
            images: imageUrls,
            active: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: auth.currentUser ? auth.currentUser.email : 'system',
            updatedBy: auth.currentUser ? auth.currentUser.email : 'system'
        };

        // Add to Firestore
        const docRef = await db.collection('vehicles').add(vehicleData);

        // Log activity
        logActivity('add_vehicle', {
            vehicleId: docRef.id,
            make: vehicleData.make,
            model: vehicleData.model,
            year: vehicleData.year
        });

        // Reset form
        document.getElementById('addVehicleForm').reset();
        selectedImages = [];
        renderImagePreviews();

        alert('車輛新增成功！');
        loadVehicles();

    } catch (error) {
        console.error('Error adding vehicle:', error);
        alert('新增失敗：' + error.message);
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

async function uploadImages() {
    if (selectedImages.length === 0) return [];

    const IMGBB_API_KEY = '193460a1e84d6f73512c2c83c6aeb160';
    const urls = [];

    for (const file of selectedImages) {
        // Convert file to base64
        const base64 = await fileToBase64(file);

        // Upload to imgBB
        const formData = new FormData();
        formData.append('key', IMGBB_API_KEY);
        formData.append('image', base64);
        formData.append('name', `${Date.now()}_${file.name}`);

        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data.data && data.data.url) {
            urls.push(data.data.url);
        } else {
            console.error('imgBB upload failed:', data);
        }
    }

    return urls;
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ================================================
// Edit Modal
// ================================================

function initEditModal() {
    const modal = document.getElementById('editModal');
    const closeBtn = document.getElementById('editModalClose');
    const cancelBtn = document.getElementById('cancelEdit');
    const form = document.getElementById('editVehicleForm');

    closeBtn.addEventListener('click', closeEditModal);
    cancelBtn.addEventListener('click', closeEditModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeEditModal();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveVehicle();
    });
}

function shareVehicle(vehicleId) {
    const url = `https://www.ultimate-speed.hk/vehicle.html?id=${vehicleId}`;
    navigator.clipboard.writeText(url).then(() => {
        // Show toast notification
        const toast = document.createElement('div');
        toast.className = 'share-toast';
        toast.textContent = '分享連結已複製！';
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        prompt('複製以下分享連結：', url);
    });
}

function openEditModal(vehicleId) {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;

    document.getElementById('editVehicleId').value = vehicle.id;
    document.getElementById('editMake').value = vehicle.make || '';
    document.getElementById('editModel').value = vehicle.model || '';
    document.getElementById('editYear').value = vehicle.year || '';
        document.getElementById('editPrice').value = vehicle.price || '';
        document.getElementById('editColor').value = vehicle.color || '';
        document.getElementById('editType').value = vehicle.type || '';
        document.getElementById('editPowertrain').value = vehicle.powertrain || '';
        document.getElementById('editStatus').value = vehicle.status || '';
    document.getElementById('editSpecs').value = (vehicle.specs || []).join(', ');
    document.getElementById('editDescription').value = vehicle.description || '';

    document.getElementById('editModal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
}

async function saveVehicle() {
    const vehicleId = document.getElementById('editVehicleId').value;

    const specsStr = document.getElementById('editSpecs').value;
    const specs = specsStr ? specsStr.split(',').map(s => s.trim()).filter(Boolean) : [];

    const vehicleData = {
        make: document.getElementById('editMake').value,
        model: document.getElementById('editModel').value,
        year: parseInt(document.getElementById('editYear').value),
        price: document.getElementById('editPrice').value,
        color: document.getElementById('editColor').value,
        type: document.getElementById('editType').value,
        powertrain: document.getElementById('editPowertrain').value,
        status: document.getElementById('editStatus').value,
        specs: specs,
        description: document.getElementById('editDescription').value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedBy: auth.currentUser ? auth.currentUser.email : 'system'
    };

    try {
        await db.collection('vehicles').doc(vehicleId).update(vehicleData);

        // Log activity
        logActivity('edit_vehicle', {
            vehicleId: vehicleId,
            make: vehicleData.make,
            model: vehicleData.model,
            year: vehicleData.year
        });

        closeEditModal();
        loadVehicles();
    } catch (error) {
        console.error('Error updating vehicle:', error);
        alert('更新失敗：' + error.message);
    }
}

// ================================================
// Delete Vehicle
// ================================================

async function deleteVehicle(vehicleId) {
    if (!confirm('確定要刪除這輛車嗎？')) return;

    try {
        // Get vehicle info before deleting for the log
        const vehicleDoc = await db.collection('vehicles').doc(vehicleId).get();
        const vehicleData = vehicleDoc.data();

        await db.collection('vehicles').doc(vehicleId).delete();

        // Log activity
        logActivity('delete_vehicle', {
            vehicleId: vehicleId,
            make: vehicleData ? vehicleData.make : 'unknown',
            model: vehicleData ? vehicleData.model : 'unknown',
            year: vehicleData ? vehicleData.year : 'unknown'
        });

        loadVehicles();
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert('刪除失敗：' + error.message);
    }
}

// ================================================
// Filters
// ================================================

function initFilters() {
    const filterTabs = document.querySelector('.filter-tabs');

    filterTabs.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-tab')) {
            filterTabs.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderVehicleList();
        }
    });
}
