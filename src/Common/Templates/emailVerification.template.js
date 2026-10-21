
export const emailVerificationTemplate = ({ firstName, otp }) => {
    const safeName = String(firstName || "there")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>

<body style="margin:0;padding:0;background:#f3f6fb;
             font-family:Arial,Helvetica,sans-serif;">

    <div class="email_verification"
         style="padding:48px 16px;">

        <div style="max-width:520px;margin:auto;
                    background:#ffffff;
                    border:1px solid #e9edf5;
                    border-radius:20px;
                    padding:40px 24px;
                    text-align:center;">

            <div style="width:72px;height:72px;
                        line-height:72px;
                        background:#eef2ff;
                        border-radius:50%;
                        margin:0 auto 24px;
                        font-size:34px;">
                🔐
            </div>

            <h1 style="font-size:26px;
                       color:#111827;
                       margin:0 0 16px;">
                Verify your email - OTP
            </h1>

            <p style="color:#667085;
                      font-size:15px;
                      line-height:1.8;
                      margin:0 0 24px;">
                Hello <strong>${safeName}</strong>,
                <br>
                Use the verification code below to
                confirm your email address and
                complete your registration.
            </p>

            <div style="background:#eef2ff;
                        border-radius:12px;
                        padding:24px 12px;
                        margin-bottom:20px;">

                <p style="font-size:11px;
                          font-weight:bold;
                          letter-spacing:2px;
                          color:#6366f1;
                          margin:0 0 14px;">
                    YOUR VERIFICATION CODE
                </p>

                <div style="font-size:36px;
                            font-weight:800;
                            letter-spacing:8px;
                            color:#312e81;
                            font-family:Arial,sans-serif;">
                    ${otp}
                </div>

            </div>

            <p style="font-size:13px;
                      color:#98a2b3;
                      margin:0;">
                This code expires in 10 minutes.
            </p>

            <div style="height:1px;
                        background:#eaecf0;
                        margin:30px 0;">
            </div>

            <p style="font-size:13px;
                      line-height:1.8;
                      color:#667085;
                      margin:0;">
                Never share this code with anyone.
                <br>
                If you didn't request it,
                you can safely ignore this email.
            </p>

        </div>

        <p style="text-align:center;
                  color:#98a2b3;
                  font-size:12px;
                  margin-top:28px;">
            &copy; ${new Date().getFullYear()}
            Sarahah App. All rights reserved.
        </p>

    </div>

</body>
</html>
    `;
};
