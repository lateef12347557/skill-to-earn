-- Seed skills
INSERT INTO public.skills (name, category, icon) VALUES
('React', 'Frontend', 'code'),
('TypeScript', 'Frontend', 'code'),
('Node.js', 'Backend', 'server'),
('Python', 'Backend', 'code'),
('UI/UX Design', 'Design', 'palette'),
('Figma', 'Design', 'palette'),
('PostgreSQL', 'Database', 'database'),
('MongoDB', 'Database', 'database'),
('AWS', 'Cloud', 'cloud'),
('Docker', 'DevOps', 'container'),
('GraphQL', 'API', 'api'),
('REST APIs', 'API', 'api'),
('Machine Learning', 'AI/ML', 'brain'),
('Data Analysis', 'Data', 'chart'),
('Mobile Development', 'Mobile', 'smartphone');

-- Seed learning paths (set is_published = true so they're visible)
INSERT INTO public.learning_paths (id, title, description, category, difficulty, duration_hours, is_published, image_url) VALUES
('a1b2c3d4-1111-1111-1111-111111111111', 'Frontend Development Fundamentals', 'Master React, TypeScript, and modern frontend development. Build real projects and earn while learning.', 'Frontend', 'beginner', 40, true, null),
('a1b2c3d4-2222-2222-2222-222222222222', 'Backend API Development', 'Learn to build scalable APIs with Node.js, Express, and PostgreSQL. Deploy production-ready services.', 'Backend', 'intermediate', 50, true, null),
('a1b2c3d4-3333-3333-3333-333333333333', 'UI/UX Design Essentials', 'Create stunning user interfaces and experiences. Master Figma and design thinking principles.', 'Design', 'beginner', 30, true, null),
('a1b2c3d4-4444-4444-4444-444444444444', 'Full Stack Development', 'Become a complete developer. Frontend, backend, database, and deployment all in one path.', 'Full Stack', 'advanced', 80, true, null),
('a1b2c3d4-5555-5555-5555-555555555555', 'Data Science Foundations', 'Learn Python, data analysis, and machine learning fundamentals to start your data career.', 'Data', 'intermediate', 60, true, null);

-- Seed lessons for Frontend path
INSERT INTO public.lessons (learning_path_id, title, description, order_index, duration_minutes) VALUES
('a1b2c3d4-1111-1111-1111-111111111111', 'Introduction to React', 'Learn the basics of React components, JSX, and the virtual DOM.', 1, 45),
('a1b2c3d4-1111-1111-1111-111111111111', 'Components and Props', 'Understand how to create reusable components and pass data with props.', 2, 60),
('a1b2c3d4-1111-1111-1111-111111111111', 'State Management', 'Master useState, useEffect, and component lifecycle.', 3, 75),
('a1b2c3d4-1111-1111-1111-111111111111', 'TypeScript Basics', 'Add type safety to your React applications.', 4, 60),
('a1b2c3d4-1111-1111-1111-111111111111', 'Building a Real Project', 'Apply your skills to build a complete application.', 5, 120);

-- Seed lessons for Backend path
INSERT INTO public.lessons (learning_path_id, title, description, order_index, duration_minutes) VALUES
('a1b2c3d4-2222-2222-2222-222222222222', 'Node.js Fundamentals', 'Understand Node.js runtime, modules, and async programming.', 1, 50),
('a1b2c3d4-2222-2222-2222-222222222222', 'Express.js Framework', 'Build REST APIs with Express routing and middleware.', 2, 65),
('a1b2c3d4-2222-2222-2222-222222222222', 'Database Integration', 'Connect to PostgreSQL and perform CRUD operations.', 3, 70),
('a1b2c3d4-2222-2222-2222-222222222222', 'Authentication & Security', 'Implement JWT auth and security best practices.', 4, 80),
('a1b2c3d4-2222-2222-2222-222222222222', 'Deployment & Scaling', 'Deploy your API and handle production traffic.', 5, 60);

-- Seed lessons for Design path
INSERT INTO public.lessons (learning_path_id, title, description, order_index, duration_minutes) VALUES
('a1b2c3d4-3333-3333-3333-333333333333', 'Design Thinking', 'Learn the principles of user-centered design.', 1, 40),
('a1b2c3d4-3333-3333-3333-333333333333', 'Figma Basics', 'Master the Figma interface and essential tools.', 2, 55),
('a1b2c3d4-3333-3333-3333-333333333333', 'Color & Typography', 'Create harmonious color palettes and type systems.', 3, 45),
('a1b2c3d4-3333-3333-3333-333333333333', 'Component Libraries', 'Build reusable design systems in Figma.', 4, 60),
('a1b2c3d4-3333-3333-3333-333333333333', 'Prototyping', 'Create interactive prototypes for user testing.', 5, 50);