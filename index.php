<?php
function getSelectedImage() {
    $configFile = 'config/selected_image.json';

    if (!file_exists('config')) {
        mkdir('config', 0755, true);
    }

    if (file_exists($configFile)) {
        $data = json_decode(file_get_contents($configFile), true);
        if ($data && isset($data['image_number'])) {
            $imageNumber = (int)$data['image_number'];
            return max(1, min(50, $imageNumber));
        }
    }

    return 1;
}

$selectedImage = getSelectedImage();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DHERST - Department of Higher Education, Research, Science and Technology</title>
    <link rel="icon" type="image/png" href="dherst_logo.png">
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="floating-logo">
        <img id="floating-image" src="images/<?php echo $selectedImage; ?>.png" alt="Papua New Guinea Coat of Arms" />
    </div>

    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <img src="dherst_logo.png" alt="DHERST Logo" class="nav-logo-img">
            </div>
            <ul class="nav-menu">
                <li class="nav-item">
                    <a href="#" class="nav-link">Home</a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">About</a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">Education</a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">Research</a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">Contact</a>
                </li>
            </ul>
            <div class="nav-toggle" id="mobile-menu">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>

    <section class="hero">
        <div class="hero-container">
            <div class="hero-content">
                <h1 class="hero-title">
                    Department of Higher Education, Research,
                    <span class="highlight">Science and Technology</span>
                </h1>
                <p class="hero-description">
                    Advancing Papua New Guinea's educational excellence, fostering innovation through research, and driving technological progress for national development.
                </p>
                <div class="hero-buttons">
                    <button class="btn btn-primary">Our Programs</button>
                    <button class="btn btn-secondary">Research Portal</button>
                </div>
            </div>
            <div class="hero-image"></div>
        </div>
    </section>

    <section class="features">
        <div class="container">
            <div class="section-header">
                <h2>Our Core Functions</h2>
                <p>Advancing Papua New Guinea through education, research, science and technology</p>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-university"></i>
                    </div>
                    <h3>Higher Education</h3>
                    <p>Overseeing universities and higher education institutions to ensure quality education standards.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-flask"></i>
                    </div>
                    <h3>Research Excellence</h3>
                    <p>Promoting and supporting research initiatives that contribute to national development.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-atom"></i>
                    </div>
                    <h3>Science Innovation</h3>
                    <p>Advancing scientific knowledge and innovation to address national challenges.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-laptop-code"></i>
                    </div>
                    <h3>Technology Development</h3>
                    <p>Fostering technological advancement and digital transformation across sectors.</p>
                </div>
            </div>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">
                    <img src="dherst_logo.png" alt="DHERST Logo" class="footer-logo-img">
                    <div class="footer-logo-text">
                        <h3>DHERST</h3>
                        <p>Department of Higher Education, Research, Science and Technology</p>
                        <p>Papua New Guinea</p>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 Department of Higher Education, Research, Science and Technology - Papua New Guinea. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        const mobileMenu = document.getElementById('mobile-menu');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileMenu && navMenu) {
            mobileMenu.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                    navbar.style.boxShadow = 'none';
                }
            }
        });
        document.addEventListener('DOMContentLoaded', () => {
            const floatingLogo = document.querySelector('.floating-logo');
            const floatingImg = document.querySelector('#floating-image');
            
            if (floatingLogo && floatingImg) {
                floatingLogo.style.position = 'fixed';
                floatingLogo.style.top = '60px';
                floatingLogo.style.right = '10px';
                floatingLogo.style.zIndex = '99999';
                floatingLogo.style.display = 'block';
                floatingLogo.style.visibility = 'visible';
                floatingLogo.style.opacity = '1';
                
                floatingImg.style.display = 'block';
                floatingImg.style.visibility = 'visible';
                floatingImg.style.opacity = '1';
                
                if (window.innerWidth <= 768) {
                    floatingImg.style.width = '130px';
                    floatingImg.style.height = 'auto';
                } else {
                    floatingImg.style.width = '400px';
                    floatingImg.style.height = '360px';
                }
                floatingImg.style.objectFit = 'contain';
            }
        });
    </script>
</body>
</html>
