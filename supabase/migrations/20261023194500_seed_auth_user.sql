-- Seed user for Central Diretoria Promoções
-- Daniel (daniel@diretoriapromocoes.com.br)
DO $$
DECLARE
  seed_user_id uuid := '5b496e04-0cbd-4ff8-984e-bcf3d60f469c'::uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'daniel@diretoriapromocoes.com.br') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      role,
      aud,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change,
      email_change_token_current,
      phone,
      phone_change,
      phone_change_token,
      reauthentication_token
    ) VALUES (
      seed_user_id,
      '00000000-0000-0000-0000-000000000000',
      'daniel@diretoriapromocoes.com.br',
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      '{"name": "Daniel", "role": "Diretoria"}'::jsonb,
      false,
      'authenticated',
      'authenticated',
      '',
      '',
      '',
      '',
      '',
      NULL,
      '',
      '',
      ''
    )
    ON CONFLICT (email) DO NOTHING;
  END IF;
END $$;
