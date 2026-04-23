<?php
$upload_dir = __DIR__ . '/uploads/resumes/';
echo "Upload dir: " . $upload_dir . "\n";
echo "Writable: " . (is_writable($upload_dir) ? 'Yes' : 'No') . "\n";

if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
    echo "Created directory\n";
}

// Test write
$test_file = $upload_dir . 'test.txt';
if (file_put_contents($test_file, 'test')) {
    echo "Write successful\n";
    unlink($test_file);
} else {
    echo "Write failed\n";
}
?>
