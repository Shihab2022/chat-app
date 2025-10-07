// emailTemplates.js

export const TestAccountTemplate = (username, confirmLink) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Confirm Your Account</title>
  <style>
    a {
      background-color: #007bff;
      color: white;
      padding: 10px 16px;
      text-decoration: none;
      border-radius: 6px;
      display: inline-block;
    }
  </style>
</head>
<body>
  <h2>Hello ${username},</h2>
  <p>Thanks for signing up! Please confirm your account by clicking below:</p>
  <a href="${confirmLink}" target="_blank">Confirm Account</a>
  <p>If you didn’t request this, you can safely ignore this email.</p>
</body>
</html>
`;
