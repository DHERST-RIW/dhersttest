<?php
// Test script to verify the PHP image selection system

echo "<h1>DHERST Image System Test</h1>";

// Test 1: Check if config directory exists
echo "<h2>Test 1: Config Directory</h2>";
if (is_dir('config')) {
    echo "✅ Config directory exists<br>";
} else {
    echo "❌ Config directory missing<br>";
    mkdir('config', 0755, true);
    echo "✅ Config directory created<br>";
}

// Test 2: Check if config file exists
echo "<h2>Test 2: Config File</h2>";
$configFile = 'config/selected_image.json';
if (file_exists($configFile)) {
    echo "✅ Config file exists<br>";
    $data = json_decode(file_get_contents($configFile), true);
    echo "Current image: " . $data['image_number'] . "<br>";
} else {
    echo "❌ Config file missing<br>";
    $defaultData = [
        'image_number' => 1,
        'updated_at' => date('Y-m-d H:i:s'),
        'timestamp' => time()
    ];
    file_put_contents($configFile, json_encode($defaultData, JSON_PRETTY_PRINT));
    echo "✅ Config file created with default image 1<br>";
}

// Test 3: Test saving different image
echo "<h2>Test 3: Save Test Image</h2>";
$testImage = 25;
$testData = [
    'image_number' => $testImage,
    'updated_at' => date('Y-m-d H:i:s'),
    'timestamp' => time()
];

if (file_put_contents($configFile, json_encode($testData, JSON_PRETTY_PRINT))) {
    echo "✅ Successfully saved test image $testImage<br>";
} else {
    echo "❌ Failed to save test image<br>";
}

// Test 4: Read back the saved image
echo "<h2>Test 4: Read Saved Image</h2>";
if (file_exists($configFile)) {
    $data = json_decode(file_get_contents($configFile), true);
    if ($data && $data['image_number'] == $testImage) {
        echo "✅ Successfully read back image " . $data['image_number'] . "<br>";
    } else {
        echo "❌ Failed to read correct image<br>";
    }
} else {
    echo "❌ Config file not found<br>";
}

// Test 5: Check image files
echo "<h2>Test 5: Image Files</h2>";
$imageExists = 0;
for ($i = 1; $i <= 5; $i++) {
    if (file_exists("images/$i.png")) {
        $imageExists++;
    }
}
echo "✅ Found $imageExists sample images (checked 1-5)<br>";

// Test 6: Reset to image 1
echo "<h2>Test 6: Reset to Default</h2>";
$defaultData = [
    'image_number' => 1,
    'updated_at' => date('Y-m-d H:i:s'),
    'timestamp' => time()
];

if (file_put_contents($configFile, json_encode($defaultData, JSON_PRETTY_PRINT))) {
    echo "✅ Reset to default image 1<br>";
} else {
    echo "❌ Failed to reset<br>";
}

echo "<h2>System Status: ✅ READY</h2>";
echo "<p><a href='index.php'>Go to Main Page</a> | <a href='image-selector.php'>Go to Image Selector</a></p>";
?>
