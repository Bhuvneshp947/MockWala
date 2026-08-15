ALTER TABLE public.profiles
  ADD COLUMN avatar_url text;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, class_level, city, school, target_exam, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'class_level',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'school',
    NEW.raw_user_meta_data->>'target_exam',
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
