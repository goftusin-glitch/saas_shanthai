import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import settings


async def send_otp_email(to_email: str, otp_code: str) -> bool:
    """Send OTP verification email to user"""
    
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print(f"[Email] SMTP not configured. OTP for {to_email}: {otp_code}")
        return True  # Return True for development without email config
    
    # Create message
    message = MIMEMultipart("alternative")
    message["Subject"] = "Your Login Verification Code - SaaS சந்தை"
    message["From"] = settings.FROM_EMAIL or settings.SMTP_USER
    message["To"] = to_email
    
    # Plain text version
    text_content = f"""
Your verification code is: {otp_code}

This code will expire in {settings.OTP_EXPIRE_MINUTES} minutes.

If you didn't request this code, please ignore this email.

- SaaS சந்தை Team
"""

    # HTML version
    html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="background-color: #0a0a0a;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="max-width: 480px; margin: 0 auto;">
                    <!-- Header -->
                    <tr>
                        <td style="text-align: center; padding-bottom: 32px;">
                            <h1 style="color: #FF4C29; font-size: 24px; font-weight: 700; margin: 0;">
                                SaaS சந்தை
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content Card -->
                    <tr>
                        <td>
                            <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="background-color: #111111; border-radius: 12px; border: 1px solid #222222;">
                                <tr>
                                    <td style="padding: 40px 32px;">
                                        <h2 style="color: #ffffff; font-size: 20px; font-weight: 600; margin: 0 0 16px 0;">
                                            Verify Your Login
                                        </h2>
                                        <p style="color: #888888; font-size: 15px; line-height: 1.6; margin: 0 0 32px 0;">
                                            Enter this verification code to complete your login:
                                        </p>
                                        
                                        <!-- OTP Code Box -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                                            <tr>
                                                <td style="text-align: center; padding: 24px; background-color: #1a1a1a; border-radius: 8px; border: 1px solid #FF4C29;">
                                                    <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #FF4C29;">
                                                        {otp_code}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <p style="color: #666666; font-size: 13px; text-align: center; margin: 24px 0 0 0;">
                                            This code expires in <strong style="color: #888888;">{settings.OTP_EXPIRE_MINUTES} minutes</strong>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="text-align: center; padding-top: 32px;">
                            <p style="color: #555555; font-size: 12px; margin: 0;">
                                If you didn't request this code, you can safely ignore this email.
                            </p>
                            <p style="color: #444444; font-size: 11px; margin: 16px 0 0 0;">
                                © 2026 SaaS சந்தை by Social Eagle AI
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""
    
    # Attach parts
    message.attach(MIMEText(text_content, "plain"))
    message.attach(MIMEText(html_content, "html"))
    
    try:
        await aiosmtplib.send(
            message,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            start_tls=True,
        )
        print(f"[Email] OTP sent successfully to {to_email}")
        return True
    except Exception as e:
        print(f"[Email] Failed to send OTP to {to_email}: {e}")
        return False
