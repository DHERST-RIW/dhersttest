<?php
function saveSelectedImage($imageNumber) {
    $configFile = 'config/selected_image.json';

    if (!file_exists('config')) {
        mkdir('config', 0755, true);
    }

    $imageNumber = max(1, min(50, (int)$imageNumber));

    $data = [
        'image_number' => $imageNumber,
        'updated_at' => date('Y-m-d H:i:s'),
        'timestamp' => time()
    ];

    return file_put_contents($configFile, json_encode($data, JSON_PRETTY_PRINT));
}

function getCurrentSelectedImage() {
    $configFile = 'config/selected_image.json';

    if (file_exists($configFile)) {
        $data = json_decode(file_get_contents($configFile), true);
        if ($data && isset($data['image_number'])) {
            return (int)$data['image_number'];
        }
    }

    return 1;
}

$message = '';
$messageType = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'save_image' && isset($_POST['image_number'])) {
        $imageNumber = (int)$_POST['image_number'];
        
        if ($imageNumber >= 1 && $imageNumber <= 50) {
            if (saveSelectedImage($imageNumber)) {
                $message = "Image $imageNumber selected successfully! The main page will now display this image.";
                $messageType = 'success';
            } else {
                $message = "Error saving image selection. Please try again.";
                $messageType = 'error';
            }
        } else {
            $message = "Invalid image number. Please select between 1 and 50.";
            $messageType = 'error';
        }
    }
}

$currentImage = getCurrentSelectedImage();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DHERST - Image Selector</title>
    <link rel="icon" type="image/png" href="dherst_logo.png">
    <link rel="stylesheet" href="image-selector.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <img src="dherst_logo.png" alt="DHERST Logo" class="nav-logo-img">
                <span class="nav-title">Image Selector</span>
            </div>
            <div class="nav-actions">
                <a href="index.php" class="btn btn-secondary">
                    <i class="fas fa-home"></i> Back to Home
                </a>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="header">
            <h1>Select Display Image</h1>
            <p>Choose which image to display on the main page (1-50)</p>
        </div>

        <?php if ($message): ?>
            <div class="alert alert-<?php echo $messageType; ?>">
                <i class="fas fa-<?php echo $messageType === 'success' ? 'check-circle' : 'exclamation-circle'; ?>"></i>
                <?php echo htmlspecialchars($message); ?>
                <?php if ($messageType === 'success'): ?>
                    <a href="index.php" class="btn btn-primary" style="margin-left: 1rem;">View Main Page</a>
                <?php endif; ?>
            </div>
        <?php endif; ?>

        <div class="current-selection">
            <div class="current-image">
                <img src="images/<?php echo $currentImage; ?>.png" alt="Current Selection" onerror="this.src='images/1.png'">
                <div class="image-info">
                    <h3>Currently Selected</h3>
                    <p>Image <?php echo $currentImage; ?>.png</p>
                    <small>Last updated: <?php 
                        $configFile = 'config/selected_image.json';
                        if (file_exists($configFile)) {
                            $data = json_decode(file_get_contents($configFile), true);
                            echo isset($data['updated_at']) ? $data['updated_at'] : 'Unknown';
                        } else {
                            echo 'Default';
                        }
                    ?></small>
                </div>
            </div>
        </div>

        <form method="POST" class="selector-form">
            <input type="hidden" name="action" value="save_image">
            
            <div class="selector-section">
                <h2>Choose New Image (1-50)</h2>
                
                <div class="quick-input">
                    <label for="image_number">Image Number:</label>
                    <input type="number" name="image_number" id="image_number" min="1" max="50" value="<?php echo $currentImage; ?>" step="1" required>
                    <button type="button" id="preview-btn" class="btn btn-secondary">Preview</button>
                </div>

                <div class="quick-select">
                    <h3>Quick Select:</h3>
                    <div class="quick-buttons">
                        <?php for ($i = 1; $i <= 50; $i += 5): ?>
                            <button type="button" class="quick-btn <?php echo ($i == $currentImage) ? 'active' : ''; ?>" data-image="<?php echo $i; ?>"><?php echo $i; ?></button>
                        <?php endfor; ?>
                        <button type="button" class="quick-btn <?php echo ($currentImage == 50) ? 'active' : ''; ?>" data-image="50">50</button>
                    </div>
                </div>
            </div>

            <div class="preview-section">
                <h2>Preview</h2>
                <div class="preview-container">
                    <div class="preview-image">
                        <img id="preview-display" src="images/<?php echo $currentImage; ?>.png" alt="Preview" onerror="this.src='images/1.png'">
                    </div>
                    <div class="preview-info">
                        <p><strong>Preview:</strong> <span id="preview-info">Image <?php echo $currentImage; ?>.png</span></p>
                        <p><strong>File Path:</strong> <span id="preview-file">images/<?php echo $currentImage; ?>.png</span></p>
                    </div>
                </div>
            </div>

            <div class="action-buttons">
                <button type="button" onclick="resetToDefault()" class="btn btn-secondary">
                    <i class="fas fa-undo"></i> Reset to Image 1
                </button>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-check"></i> Apply Selection
                </button>
            </div>
        </form>



    </div>

    <script>
        function updatePreview(imageNumber) {
            if (imageNumber >= 1 && imageNumber <= 50) {
                document.getElementById('preview-display').src = `images/${imageNumber}.png`;
                document.getElementById('preview-info').textContent = `Image ${imageNumber}.png`;
                document.getElementById('preview-file').textContent = `images/${imageNumber}.png`;

                document.querySelectorAll('.quick-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (parseInt(btn.dataset.image) === imageNumber) {
                        btn.classList.add('active');
                    }
                });
            }
        }
        function resetToDefault() {
            document.getElementById('image_number').value = 1;
            updatePreview(1);
        }
        document.addEventListener('DOMContentLoaded', () => {
            const imageInput = document.getElementById('image_number');
            const previewBtn = document.getElementById('preview-btn');
            imageInput.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                updatePreview(value);
            });
            previewBtn.addEventListener('click', () => {
                const value = parseInt(imageInput.value);
                updatePreview(value);
            });
            document.querySelectorAll('.quick-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const imageNumber = parseInt(e.target.dataset.image);
                    imageInput.value = imageNumber;
                    updatePreview(imageNumber);
                });
            });
        });
    </script>
</body>
</html>
