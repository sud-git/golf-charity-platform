-- Seed test users into the database
-- Passwords are hashed using bcryptjs with 10 salt rounds
-- testuser@gmail.com: Test123!@ 
-- admin@golfcharity.app: Admin123!@

-- Get charity IDs first (adjust these based on your actual charity IDs)
WITH charity_refs AS (
  SELECT id as red_cross_id FROM charities WHERE name = 'Red Cross' LIMIT 1
),
wwf_ref AS (
  SELECT id as wwf_id FROM charities WHERE name = 'World Wildlife Fund' LIMIT 1
)
INSERT INTO users (
  email,
  password_hash,
  first_name,
  last_name,
  selected_charity_id,
  email_verified,
  email_verified_at,
  account_status
) VALUES
-- Test User (hashed with bcryptjs: Test123!@)
(
  'testuser@gmail.com',
  '$2a$10$8qvVT0.m4D3MJ7t.VJ7Vae5vhPLEPmFTTJ7w0JQxQqQ0qN0b3nqZO',
  'Test',
  'User',
  (SELECT red_cross_id FROM charity_refs),
  true,
  NOW(),
  'active'
),
-- Admin User (hashed with bcryptjs: Admin123!@)
(
  'admin@golfcharity.app',
  '$2a$10$GYI0gGQP/BdxUXt9gpmvVOSKspMvmb7QQkf.6T5CuVmL7vlPivGVW',
  'Admin',
  'User',
  (SELECT wwf_id FROM wwf_ref),
  true,
  NOW(),
  'active'
);
