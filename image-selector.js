class ImageSelector {
    constructor() {
        this.currentImage = this.loadCurrentImage();
        this.previewImage = this.currentImage;
        this.init();
    }

    init() {
        this.updateCurrentDisplay();
        this.updatePreviewDisplay();
        this.bindEvents();
        this.updateUI();
    }

    loadCurrentImage() {
        const saved = localStorage.getItem('selectedImage');
        return saved ? parseInt(saved) : 1;
    }

    saveCurrentImage(imageNumber) {
        localStorage.setItem('selectedImage', imageNumber.toString());
    }

    bindEvents() {
        // Input field
        const imageInput = document.getElementById('image-number');
        imageInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (value >= 1 && value <= 50) {
                this.previewImage = value;
                this.updatePreviewDisplay();
                this.updateActiveButton();
            }
        });

        // Preview button
        document.getElementById('preview-btn').addEventListener('click', () => {
            const value = parseInt(document.getElementById('image-number').value);
            if (value >= 1 && value <= 50) {
                this.previewImage = value;
                this.updatePreviewDisplay();
                this.updateActiveButton();
            }
        });

        // Quick select buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const imageNumber = parseInt(e.target.dataset.image);
                this.previewImage = imageNumber;
                document.getElementById('image-number').value = imageNumber;
                this.updatePreviewDisplay();
                this.updateActiveButton();
            });
        });

        // Navigation buttons
        document.getElementById('prev-btn').addEventListener('click', () => {
            if (this.previewImage > 1) {
                this.previewImage--;
                document.getElementById('image-number').value = this.previewImage;
                this.updatePreviewDisplay();
                this.updateActiveButton();
            }
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            if (this.previewImage < 50) {
                this.previewImage++;
                document.getElementById('image-number').value = this.previewImage;
                this.updatePreviewDisplay();
                this.updateActiveButton();
            }
        });

        // Action buttons
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetToDefault();
        });

        document.getElementById('apply-btn').addEventListener('click', () => {
            this.applySelection();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && this.previewImage > 1) {
                this.previewImage--;
                document.getElementById('image-number').value = this.previewImage;
                this.updatePreviewDisplay();
                this.updateActiveButton();
            } else if (e.key === 'ArrowRight' && this.previewImage < 50) {
                this.previewImage++;
                document.getElementById('image-number').value = this.previewImage;
                this.updatePreviewDisplay();
                this.updateActiveButton();
            } else if (e.key === 'Enter') {
                this.applySelection();
            }
        });
    }

    updateCurrentDisplay() {
        const currentDisplay = document.getElementById('current-display');
        const currentInfo = document.getElementById('current-info');
        
        currentDisplay.src = `images/${this.currentImage}.png`;
        currentInfo.textContent = `Image ${this.currentImage}.png`;
    }

    updatePreviewDisplay() {
        const previewDisplay = document.getElementById('preview-display');
        const previewInfo = document.getElementById('preview-info');
        const previewFile = document.getElementById('preview-file');
        const currentNumber = document.getElementById('current-number');
        
        previewDisplay.src = `images/${this.previewImage}.png`;
        previewInfo.textContent = `Image ${this.previewImage}.png`;
        previewFile.textContent = `images/${this.previewImage}.png`;
        currentNumber.textContent = this.previewImage;
    }

    updateActiveButton() {
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.image) === this.previewImage) {
                btn.classList.add('active');
            }
        });
    }

    updateUI() {
        document.getElementById('image-number').value = this.previewImage;
        this.updateActiveButton();
    }

    resetToDefault() {
        this.previewImage = 1;
        document.getElementById('image-number').value = 1;
        this.updatePreviewDisplay();
        this.updateActiveButton();
        
        this.showNotification('Reset to Image 1', 'info');
    }

    applySelection() {
        this.currentImage = this.previewImage;
        this.saveCurrentImage(this.currentImage);
        this.updateCurrentDisplay();
        
        // Trigger storage event for main page
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'selectedImage',
            newValue: this.currentImage.toString(),
            storageArea: localStorage
        }));
        
        this.showNotification(`Applied Image ${this.currentImage}!`, 'success');
        
        // Optional: redirect to main page after a delay
        setTimeout(() => {
            if (confirm('Image applied! Would you like to go back to the main page to see the result?')) {
                window.location.href = 'index.html';
            }
        }, 1500);
    }

    showNotification(message, type = 'success') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'info' ? '#3b82f6' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'info' ? 'info' : 'exclamation'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Add animation styles
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageSelector();
});
