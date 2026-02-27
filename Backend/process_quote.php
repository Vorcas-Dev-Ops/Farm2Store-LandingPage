<?php
// Allow CORS for local React dev server
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// --- Helper to load .env file ---
function loadEnv($path)
{
    if (!file_exists($path))
        return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0)
            continue;
        list($name, $value) = explode('=', $line, 2);
        putenv(trim($name) . "=" . trim($value));
        $_ENV[trim($name)] = trim($value);
    }
}
loadEnv(__DIR__ . '/.env');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Invalid request method."]);
    exit();
}

// --- Load PHPMailer (no Composer) ---
require __DIR__ . '/PHPMailer/Exception.php';
require __DIR__ . '/PHPMailer/PHPMailer.php';
require __DIR__ . '/PHPMailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// --- Read & sanitize input ---
// Support both JSON (from React) and Form Data
$input = json_decode(file_get_contents('php://input'), true);

$name = trim($input['name'] ?? $_POST['name'] ?? '');
$phone = trim($input['phone'] ?? $_POST['phone'] ?? '');
$email = trim($input['email'] ?? $_POST['email'] ?? '');
$business = trim($input['business'] ?? $_POST['service'] ?? ''); // Map 'service' to 'business' for backward compatibility
$description = trim($input['message'] ?? $_POST['description'] ?? ''); // Map 'description' to 'message' for alignment

// --- Server-side Validation ---
$errors = [];

if (empty($name)) {
    $errors[] = "Full name is required.";
}

if (empty($phone)) {
    $errors[] = "Phone number is required.";
}

if (empty($email)) {
    $errors[] = "Email address is required.";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Enter a valid email address.";
}

if (empty($business)) {
    $errors[] = "Business type or service is required.";
}

if (!empty($errors)) {
    echo json_encode(["success" => false, "error" => implode(" ", $errors)]);
    exit();
}

// --- Build message body (shared by WhatsApp & Email) ---
$messageBody = "*New Quote Request from Farm2Store*\n\n";
$messageBody .= "*Name:* {$name}\n";
$messageBody .= "*Phone:* {$phone}\n";
$messageBody .= "*Email:* {$email}\n";
$messageBody .= "*Business Type:* {$business}\n";
if (!empty($description)) {
    $messageBody .= "*Message:* {$description}\n";
}

$emailSuccess = false;
$errorMessages = [];

// =============================================
// 1) SEND EMAIL via Gmail SMTP (PHPMailer)
// =============================================
try {
    $mail = new PHPMailer(true);

    // SMTP settings
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = getenv('SMTP_USER');
    $mail->Password = getenv('SMTP_PASS');
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Sender & recipient
    $mail->setFrom(getenv('SMTP_USER'), 'Farm2Store');
    $mail->addAddress(getenv('SMTP_USER'), 'Farm2Store');

    // Email content — HTML formatted
    $mail->isHTML(true);
    $mail->Subject = 'New Quote Request from Farm2Store';

    // --- Prepare values for template ---
    $safeName = htmlspecialchars($name);
    $safePhone = htmlspecialchars($phone);
    $safeEmail = htmlspecialchars($email);
    $safeBusiness = htmlspecialchars($business);
    $safeMessageRow = "";
    if (!empty($description)) {
        $safeMessage = nl2br(htmlspecialchars($description));
        $safeMessageRow = "
        <tr>
            <td style=\"padding:10px 0;color:#166534;font-weight:600;vertical-align:top;\">Message:</td>
            <td style=\"padding:10px 0;color:#374151;line-height:1.6;\">{$safeMessage}</td>
        </tr>";
    }
    $year = date('Y');

    // --- Build HTML Email ---
    $emailBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body style="margin:0;padding:0;background-color:#f0fdf4;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background-color:#f0fdf4;">
<tr>
<td align="center">
    <!-- MAIN CARD -->
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 25px rgba(0,0,0,0.08);">
        <!-- HEADER -->
        <tr>
            <td style="background:#14532d;padding:35px 30px;text-align:center;">
                <h1 style="color:#eab308;margin:0;font-size:28px;letter-spacing:1px;font-weight:bold;">Farm2Store</h1>
                <p style="color:#eab308;margin:10px 0 0;font-size:14px;letter-spacing:0.5px;">Freshness from Farm to Your Store</p>
            </td>
        </tr>
        <!-- BODY -->
        <tr>
            <td style="padding:40px 35px;">
                <h2 style="color:#eab308;margin-top:0;margin-bottom:25px;font-size:20px;font-weight:600;border-bottom:2px solid #fef08a;padding-bottom:8px;">New Quote Request</h2>
                <!-- DETAILS TABLE -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fefb;border:1px solid #d1fae5;border-radius:8px;padding:25px;">
                    <tr>
                        <td style="padding:10px 0;width:150px;color:#166534;font-weight:600;">Name:</td>
                        <td style="padding:10px 0;color:#374151;">{$safeName}</td>
                    </tr>
                    <tr>
                        <td style="padding:10px 0;color:#166534;font-weight:600;">Phone:</td>
                        <td style="padding:10px 0;color:#374151;">{$safePhone}</td>
                    </tr>
                    <tr>
                        <td style="padding:10px 0;color:#166534;font-weight:600;">Email:</td>
                        <td style="padding:10px 0;color:#374151;">{$safeEmail}</td>
                    </tr>
                    <tr>
                        <td style="padding:10px 0;color:#166534;font-weight:600;">Business:</td>
                        <td style="padding:10px 0;color:#374151;">{$safeBusiness}</td>
                    </tr>
                    {$safeMessageRow}
                </table>
            </td>
        </tr>
        <!-- FOOTER -->
        <tr>
            <td style="background:#14532d;padding:25px;text-align:center;color:#d1fae5;font-size:12px;">
                © {$year} <strong>Farm2Store</strong>. All rights reserved.<br><br>
                <span style="color:#bbf7d0;">This email was generated from the website contact form.</span>
            </td>
        </tr>
    </table>
</td>
</tr>
</table>
</body>
</html>
HTML;

    $mail->Body = $emailBody;
    // Plain-text fallback
    $mail->AltBody = str_replace('*', '', $messageBody);

    $mail->send();
    $emailSuccess = true;
} catch (Exception $e) {
    $errorMessages[] = "Email error: " . $mail->ErrorInfo;
}

// =============================================
// 2) RETURN RESPONSE
// =============================================
if ($emailSuccess) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Failed to send quote. " . implode(" ", $errorMessages)]);
}
