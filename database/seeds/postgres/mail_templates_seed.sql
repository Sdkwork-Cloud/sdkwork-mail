-- Default transactional mail templates (tenant 0 / org 0 for bootstrap).

INSERT INTO mail_template (
    id, uuid, tenant_id, organization_id, template_key, name, category, purpose, locale,
    subject_template, body_html_template, body_text_template, status,
    created_at, updated_at, version
) VALUES
(
    910001, 'tpl-login-verification-zh-cn', 0, 0,
    'login_verification', 'Login Verification', 'transactional', 'login_verification', 'zh-CN',
    'Your login code: {{code}}',
    '<p>Hello,</p><p>Your login verification code is <strong>{{code}}</strong>.</p><p>It expires in {{expiresMinutes}} minutes.</p>',
    'Your login verification code is {{code}}. It expires in {{expiresMinutes}} minutes.',
    1, NOW(), NOW(), 0
),
(
    910002, 'tpl-password-reset-zh-cn', 0, 0,
    'password_reset', 'Password Reset', 'transactional', 'password_reset', 'zh-CN',
    'Reset your password',
    '<p>Hello,</p><p>Use code <strong>{{code}}</strong> to reset your password.</p>',
    'Use code {{code}} to reset your password.',
    1, NOW(), NOW(), 0
),
(
    910003, 'tpl-marketing-welcome-zh-cn', 0, 0,
    'marketing_welcome', 'Marketing Welcome', 'marketing', 'marketing', 'zh-CN',
    'Welcome to SDKWork Mail',
    '<p>Hello {{name}},</p><p>Welcome to our platform.</p>',
    'Hello {{name}}, welcome to our platform.',
    1, NOW(), NOW(), 0
)
ON CONFLICT DO NOTHING;
