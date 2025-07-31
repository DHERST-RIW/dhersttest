class ImageSettings {
    constructor() {
        this.settings = this.loadSettings();
        this.previewTimer = null;
        this.previewActive = false;
        this.currentPreviewIndex = 0;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUI();
        this.updatePreview();
        this.updateSummary();
    }

    loadSettings() {
        const defaultSettings = {
            intervalType: 'minutes',
            intervalValue: 10,
            startImage: 'first',
            specificImage: 1,
            startRange: 1,
            endRange: 50,
            autoStart: true,
            loopImages: true,
            fadeTransition: true,
            pauseOnHover: false
        };

        const saved = localStorage.getItem('dherstImageSettings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('dherstImageSettings', JSON.stringify(this.settings));
    }

    bindEvents() {
        document.querySelectorAll('input[name="interval-type"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.settings.intervalType = e.target.value;
                this.updateIntervalUnit();
                this.updateSummary();
            });
        });

        document.getElementById('interval-value').addEventListener('input', (e) => {
            this.settings.intervalValue = parseInt(e.target.value);
            this.updateSummary();
        });

        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const value = parseInt(e.target.dataset.value);
                const type = e.target.dataset.type;
                
                document.querySelector(`input[value="${type}"]`).checked = true;
                document.getElementById('interval-value').value = value;
                
                this.settings.intervalType = type;
                this.settings.intervalValue = value;
                
                this.updatePresetButtons();
                this.updateIntervalUnit();
                this.updateSummary();
            });
        });

        document.querySelectorAll('input[name="start-image"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.settings.startImage = e.target.value;
                this.toggleSpecificImageInput();
                this.updateSummary();
            });
        });

        document.getElementById('specific-image').addEventListener('input', (e) => {
            this.settings.specificImage = parseInt(e.target.value);
            this.updateSummary();
        });

        document.getElementById('start-range').addEventListener('input', (e) => {
            this.settings.startRange = parseInt(e.target.value);
            this.updateRangeInfo();
            this.updateSummary();
        });

        document.getElementById('end-range').addEventListener('input', (e) => {
            this.settings.endRange = parseInt(e.target.value);
            this.updateRangeInfo();
            this.updateSummary();
        });

        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const setting = e.target.id.replace('-', '');
                const camelCase = setting.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                this.settings[camelCase] = e.target.checked;
                this.updateSummary();
            });
        });

        document.getElementById('preview-prev').addEventListener('click', () => {
            this.previousPreviewImage();
        });

        document.getElementById('preview-next').addEventListener('click', () => {
            this.nextPreviewImage();
        });

        document.getElementById('preview-play').addEventListener('click', () => {
            this.togglePreview();
        });

        document.getElementById('reset-settings').addEventListener('click', () => {
            this.resetSettings();
        });

        document.getElementById('save-settings').addEventListener('click', () => {
            this.saveAndApply();
        });
    }

    updateUI() {
        document.querySelector(`input[value="${this.settings.intervalType}"]`).checked = true;
        document.getElementById('interval-value').value = this.settings.intervalValue;
        document.querySelector(`input[value="${this.settings.startImage}"]`).checked = true;
        document.getElementById('specific-image').value = this.settings.specificImage;
        document.getElementById('start-range').value = this.settings.startRange;
        document.getElementById('end-range').value = this.settings.endRange;
        document.getElementById('auto-start').checked = this.settings.autoStart;
        document.getElementById('loop-images').checked = this.settings.loopImages;
        document.getElementById('fade-transition').checked = this.settings.fadeTransition;
        document.getElementById('pause-on-hover').checked = this.settings.pauseOnHover;

        this.updateIntervalUnit();
        this.toggleSpecificImageInput();
        this.updateRangeInfo();
        this.updatePresetButtons();
    }

    updateIntervalUnit() {
        const unit = this.settings.intervalType === 'custom' ? 'milliseconds' : this.settings.intervalType;
        document.querySelector('.interval-unit').textContent = unit;
        
        const input = document.getElementById('interval-value');
        switch(this.settings.intervalType) {
            case 'seconds':
                input.max = 3600;
                break;
            case 'minutes':
                input.max = 1440;
                break;
            case 'hours':
                input.max = 24;
                break;
            case 'days':
                input.max = 365;
                break;
            case 'custom':
                input.max = 86400000;
                break;
        }
    }

    updatePresetButtons() {
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.value == this.settings.intervalValue && 
                btn.dataset.type === this.settings.intervalType) {
                btn.classList.add('active');
            }
        });
    }

    toggleSpecificImageInput() {
        const specificInput = document.querySelector('.specific-image-input');
        specificInput.style.display = this.settings.startImage === 'specific' ? 'block' : 'none';
    }

    updateRangeInfo() {
        const total = this.settings.endRange - this.settings.startRange + 1;
        document.getElementById('range-display').textContent = 
            `Using images ${this.settings.startRange}-${this.settings.endRange} (${total} total images)`;
        document.getElementById('total-images-info').textContent = total;
    }

    updatePreview() {
        let startIndex;
        switch(this.settings.startImage) {
            case 'random':
                startIndex = Math.floor(Math.random() * (this.settings.endRange - this.settings.startRange + 1)) + this.settings.startRange;
                break;
            case 'specific':
                startIndex = this.settings.specificImage;
                break;
            default:
                startIndex = this.settings.startRange;
        }
        
        this.currentPreviewIndex = startIndex;
        this.updatePreviewImage();
    }

    updatePreviewImage() {
        const img = document.getElementById('preview-image');
        img.src = `images/${this.currentPreviewIndex}.png`;
        document.getElementById('current-image-info').textContent = `${this.currentPreviewIndex}.png`;
        
        const intervalMs = this.getIntervalInMs();
        const nextChange = this.formatInterval(intervalMs);
        document.getElementById('next-change-info').textContent = nextChange;
    }

    previousPreviewImage() {
        this.currentPreviewIndex--;
        if (this.currentPreviewIndex < this.settings.startRange) {
            this.currentPreviewIndex = this.settings.loopImages ? this.settings.endRange : this.settings.startRange;
        }
        this.updatePreviewImage();
    }

    nextPreviewImage() {
        this.currentPreviewIndex++;
        if (this.currentPreviewIndex > this.settings.endRange) {
            this.currentPreviewIndex = this.settings.loopImages ? this.settings.startRange : this.settings.endRange;
        }
        this.updatePreviewImage();
    }

    togglePreview() {
        const btn = document.getElementById('preview-play');
        if (this.previewActive) {
            clearInterval(this.previewTimer);
            this.previewActive = false;
            btn.innerHTML = '<i class="fas fa-play"></i> Start Preview';
            btn.classList.add('primary');
        } else {
            const intervalMs = this.getIntervalInMs();
            this.previewTimer = setInterval(() => {
                this.nextPreviewImage();
            }, Math.min(intervalMs, 5000));
            
            this.previewActive = true;
            btn.innerHTML = '<i class="fas fa-pause"></i> Stop Preview';
            btn.classList.remove('primary');
        }
    }

    getIntervalInMs() {
        const value = this.settings.intervalValue;
        switch(this.settings.intervalType) {
            case 'seconds': return value * 1000;
            case 'minutes': return value * 60 * 1000;
            case 'hours': return value * 60 * 60 * 1000;
            case 'days': return value * 24 * 60 * 60 * 1000;
            case 'custom': return value;
            default: return 10 * 60 * 1000;
        }
    }

    formatInterval(ms) {
        if (ms < 1000) return `${ms}ms`;
        if (ms < 60000) return `${ms/1000}s`;
        if (ms < 3600000) return `${ms/60000}m`;
        if (ms < 86400000) return `${ms/3600000}h`;
        return `${ms/86400000}d`;
    }

    updateSummary() {
        const interval = `${this.settings.intervalValue} ${this.settings.intervalType}`;
        const startImg = this.settings.startImage === 'specific' ? 
            `image ${this.settings.specificImage}.png` : 
            this.settings.startImage === 'random' ? 'a random image' : 'image 1.png';
        const total = this.settings.endRange - this.settings.startRange + 1;
        const autoStart = this.settings.autoStart ? 'auto-start enabled' : 'manual start';
        
        document.getElementById('settings-summary').textContent = 
            `Images will change every ${interval}, starting from ${startImg}, using ${total} images with ${autoStart}.`;
    }

    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            localStorage.removeItem('dherstImageSettings');
            this.settings = this.loadSettings();
            this.updateUI();
            this.updatePreview();
            this.updateSummary();
            
            if (this.previewActive) {
                this.togglePreview();
            }
        }
    }

    saveAndApply() {
        this.saveSettings();
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-weight: 500;
        `;
        notification.innerHTML = '<i class="fas fa-check"></i> Settings saved successfully!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
        
        setTimeout(() => {
            if (confirm('Settings saved! Would you like to go back to the main page to see the changes?')) {
                window.location.href = 'index.html';
            }
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ImageSettings();
});
