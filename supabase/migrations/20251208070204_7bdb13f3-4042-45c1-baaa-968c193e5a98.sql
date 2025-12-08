-- Make employer_id nullable for seed jobs
ALTER TABLE public.jobs ALTER COLUMN employer_id DROP NOT NULL;

-- Seed sample jobs
INSERT INTO public.jobs (title, description, company_name, budget_min, budget_max, duration_days, category, status, is_verified) VALUES
('Build a React Dashboard Component', 'Create a reusable dashboard component with charts, stats cards, and responsive layout. Must use TypeScript and follow accessibility guidelines.', 'TechStart Inc.', 150, 300, 7, 'Frontend', 'open', true),
('Design Mobile App UI Kit', 'Design a complete UI kit for a fitness tracking app. Include onboarding, dashboard, workout tracking, and profile screens in Figma.', 'FitnessPro', 200, 400, 10, 'Design', 'open', true),
('REST API for E-commerce', 'Build a Node.js REST API with user auth, product management, cart, and order processing. PostgreSQL database required.', 'ShopLocal', 400, 600, 14, 'Backend', 'open', true),
('Landing Page Development', 'Convert Figma design to responsive React landing page. Must be pixel-perfect and optimized for performance.', 'StartupXYZ', 100, 200, 5, 'Frontend', 'open', true),
('Data Visualization Dashboard', 'Create an interactive data dashboard using React and D3.js or Recharts. Must handle large datasets efficiently.', 'DataDriven Co.', 300, 500, 10, 'Data', 'open', true),
('WordPress Theme Customization', 'Customize an existing WordPress theme to match brand guidelines. Add custom post types and widgets.', 'LocalBiz', 100, 150, 3, 'Full Stack', 'open', false),
('Python Web Scraper', 'Build a Python script to scrape product data from e-commerce sites. Must handle pagination and rate limiting.', 'PriceWatch', 150, 250, 5, 'Backend', 'open', true),
('Logo & Brand Identity Design', 'Create a complete brand identity including logo, color palette, typography, and basic brand guidelines.', 'NewVenture', 200, 350, 7, 'Design', 'open', true);

-- Link jobs to required skills
INSERT INTO public.job_skills (job_id, skill_id)
SELECT j.id, s.id FROM public.jobs j, public.skills s 
WHERE j.title = 'Build a React Dashboard Component' AND s.name IN ('React', 'TypeScript');

INSERT INTO public.job_skills (job_id, skill_id)
SELECT j.id, s.id FROM public.jobs j, public.skills s 
WHERE j.title = 'Design Mobile App UI Kit' AND s.name IN ('UI/UX Design', 'Figma');

INSERT INTO public.job_skills (job_id, skill_id)
SELECT j.id, s.id FROM public.jobs j, public.skills s 
WHERE j.title = 'REST API for E-commerce' AND s.name IN ('Node.js', 'PostgreSQL', 'REST APIs');

INSERT INTO public.job_skills (job_id, skill_id)
SELECT j.id, s.id FROM public.jobs j, public.skills s 
WHERE j.title = 'Landing Page Development' AND s.name IN ('React', 'TypeScript');

INSERT INTO public.job_skills (job_id, skill_id)
SELECT j.id, s.id FROM public.jobs j, public.skills s 
WHERE j.title = 'Data Visualization Dashboard' AND s.name IN ('React', 'Data Analysis');

INSERT INTO public.job_skills (job_id, skill_id)
SELECT j.id, s.id FROM public.jobs j, public.skills s 
WHERE j.title = 'Python Web Scraper' AND s.name = 'Python';

INSERT INTO public.job_skills (job_id, skill_id)
SELECT j.id, s.id FROM public.jobs j, public.skills s 
WHERE j.title = 'Logo & Brand Identity Design' AND s.name IN ('UI/UX Design', 'Figma');