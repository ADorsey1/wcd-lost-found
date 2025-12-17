-- Create enum for item status
CREATE TYPE public.item_status AS ENUM ('available', 'pending', 'claimed');

-- Create found_items table
CREATE TABLE public.found_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  date_found DATE NOT NULL DEFAULT CURRENT_DATE,
  image_url TEXT,
  status item_status NOT NULL DEFAULT 'available',
  reporter_name TEXT NOT NULL,
  reporter_email TEXT NOT NULL,
  reporter_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create claims table
CREATE TABLE public.claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES public.found_items(id) ON DELETE CASCADE NOT NULL,
  claimant_name TEXT NOT NULL,
  claimant_email TEXT NOT NULL,
  claimant_phone TEXT,
  student_id TEXT,
  description_proof TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin role enum
CREATE TYPE public.app_role AS ENUM ('admin');

-- Create user_roles table for admin access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for found_items
-- Anyone can view available items
CREATE POLICY "Anyone can view found items"
ON public.found_items
FOR SELECT
USING (true);

-- Anyone can submit found items
CREATE POLICY "Anyone can submit found items"
ON public.found_items
FOR INSERT
WITH CHECK (true);

-- Only admins can update items
CREATE POLICY "Admins can update found items"
ON public.found_items
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete items
CREATE POLICY "Admins can delete found items"
ON public.found_items
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for claims
-- Anyone can submit claims
CREATE POLICY "Anyone can submit claims"
ON public.claims
FOR INSERT
WITH CHECK (true);

-- Admins can view all claims
CREATE POLICY "Admins can view claims"
ON public.claims
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update claims
CREATE POLICY "Admins can update claims"
ON public.claims
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete claims
CREATE POLICY "Admins can delete claims"
ON public.claims
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS for user_roles (only admins can view)
CREATE POLICY "Admins can view roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_found_items_updated_at
BEFORE UPDATE ON public.found_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for item images
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true);

-- Storage policies for item images
CREATE POLICY "Anyone can view item images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'item-images');

CREATE POLICY "Anyone can upload item images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'item-images');

CREATE POLICY "Admins can delete item images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'item-images' AND public.has_role(auth.uid(), 'admin'));