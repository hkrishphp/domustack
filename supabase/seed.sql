-- HomeRevive Seed Data
-- All hardcoded data from React components

-- ============================================================
-- USERS
-- ============================================================

INSERT INTO users (id, full_name, email, avatar_url) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Demo User', 'demo@homerevive.com', NULL),
  ('00000000-0000-0000-0000-000000000002', 'HomeRevive Support', 'support@homerevive.com', NULL),
  -- Contractor representative users (for message sending)
  ('00000000-0000-0000-0000-000000000011', 'BuildRight Rep', 'contact@buildright.com', NULL),
  ('00000000-0000-0000-0000-000000000012', 'Modern Home Rep', 'contact@modernhome.com', NULL),
  ('00000000-0000-0000-0000-000000000013', 'Artisan Rep', 'contact@artisanrenovators.com', NULL),
  ('00000000-0000-0000-0000-000000000014', 'Precision Rep', 'contact@precisionbuilders.com', NULL);

-- ============================================================
-- CONTRACTORS
-- ============================================================

INSERT INTO contractors (id, slug, name, specialty, rating, reviews_count, location, price_range, projects_count, description, image_url) VALUES
  (
    '11111111-1111-1111-1111-111111111101',
    'buildright-construction',
    'BuildRight Construction',
    'Kitchen & Bathroom Remodeling',
    4.9, 127,
    'Los Angeles, CA',
    '$$$',
    230,
    'With over 15 years of experience, BuildRight Construction specializes in transforming kitchens and bathrooms into stunning, functional spaces. Our team of skilled professionals is dedicated to delivering quality craftsmanship on every project.',
    'https://images.unsplash.com/photo-1678803262992-d79d06dd5d96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjb250cmFjdG9yJTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc3MDg3MDc3OXww&ixlib=rb-4.1.0&q=80&w=1080'
  ),
  (
    '11111111-1111-1111-1111-111111111102',
    'modern-home-solutions',
    'Modern Home Solutions',
    'Full Home Renovations',
    4.8, 89,
    'New York, NY',
    '$$$$',
    156,
    'Modern Home Solutions brings contemporary design and expert craftsmanship to complete home transformations. From concept to completion, we handle every detail of your renovation with precision and care.',
    'https://images.unsplash.com/photo-1678803262992-d79d06dd5d96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjb250cmFjdG9yJTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc3MDg3MDc3OXww&ixlib=rb-4.1.0&q=80&w=1080'
  ),
  (
    '11111111-1111-1111-1111-111111111103',
    'artisan-renovators',
    'Artisan Renovators',
    'Custom Carpentry & Flooring',
    4.9, 203,
    'Chicago, IL',
    '$$$',
    189,
    'Artisan Renovators is a team of master craftsmen passionate about woodworking and flooring. We create custom built-ins, stunning hardwood floors, and bespoke carpentry that adds character and value to your home.',
    'https://images.unsplash.com/photo-1678803262992-d79d06dd5d96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjb250cmFjdG9yJTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc3MDg3MDc3OXww&ixlib=rb-4.1.0&q=80&w=1080'
  ),
  (
    '11111111-1111-1111-1111-111111111104',
    'precision-builders-co',
    'Precision Builders Co.',
    'Exterior & Roofing',
    4.7, 94,
    'Austin, TX',
    '$$',
    145,
    'Precision Builders Co. protects and beautifies your home from the outside in. Specializing in roofing, siding, and exterior renovations, we use premium materials to ensure lasting durability and curb appeal.',
    'https://images.unsplash.com/photo-1678803262992-d79d06dd5d96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjb250cmFjdG9yJTIwY29uc3RydWN0aW9ufGVufDF8fHx8MTc3MDg3MDc3OXww&ixlib=rb-4.1.0&q=80&w=1080'
  );

-- ============================================================
-- CONTRACTOR SERVICES
-- ============================================================

-- BuildRight Construction
INSERT INTO contractor_services (contractor_id, service_name) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Kitchen Remodeling'),
  ('11111111-1111-1111-1111-111111111101', 'Bathroom Renovation'),
  ('11111111-1111-1111-1111-111111111101', 'Cabinet Installation'),
  ('11111111-1111-1111-1111-111111111101', 'Countertop Replacement'),
  ('11111111-1111-1111-1111-111111111101', 'Tile Work'),
  ('11111111-1111-1111-1111-111111111101', 'Plumbing Upgrades');

-- Modern Home Solutions
INSERT INTO contractor_services (contractor_id, service_name) VALUES
  ('11111111-1111-1111-1111-111111111102', 'Full Home Renovation'),
  ('11111111-1111-1111-1111-111111111102', 'Open Floor Plan Conversion'),
  ('11111111-1111-1111-1111-111111111102', 'Structural Modifications'),
  ('11111111-1111-1111-1111-111111111102', 'Interior Design'),
  ('11111111-1111-1111-1111-111111111102', 'Smart Home Integration'),
  ('11111111-1111-1111-1111-111111111102', 'Energy Efficiency Upgrades');

-- Artisan Renovators
INSERT INTO contractor_services (contractor_id, service_name) VALUES
  ('11111111-1111-1111-1111-111111111103', 'Hardwood Flooring'),
  ('11111111-1111-1111-1111-111111111103', 'Custom Cabinetry'),
  ('11111111-1111-1111-1111-111111111103', 'Built-in Shelving'),
  ('11111111-1111-1111-1111-111111111103', 'Trim & Molding'),
  ('11111111-1111-1111-1111-111111111103', 'Deck Building'),
  ('11111111-1111-1111-1111-111111111103', 'Furniture Restoration');

-- Precision Builders Co.
INSERT INTO contractor_services (contractor_id, service_name) VALUES
  ('11111111-1111-1111-1111-111111111104', 'Roof Replacement'),
  ('11111111-1111-1111-1111-111111111104', 'Siding Installation'),
  ('11111111-1111-1111-1111-111111111104', 'Gutter Systems'),
  ('11111111-1111-1111-1111-111111111104', 'Exterior Painting'),
  ('11111111-1111-1111-1111-111111111104', 'Window Installation'),
  ('11111111-1111-1111-1111-111111111104', 'Porch & Deck Construction');

-- ============================================================
-- REVIEWS (3 per contractor, same set for each)
-- ============================================================

INSERT INTO reviews (contractor_id, user_id, reviewer_name, content, rating, created_at) VALUES
  -- BuildRight
  ('11111111-1111-1111-1111-111111111101', '00000000-0000-0000-0000-000000000001', 'Jennifer M.', 'Absolutely fantastic work! They transformed our kitchen beyond what we imagined.', 5, now() - interval '10 days'),
  ('11111111-1111-1111-1111-111111111101', '00000000-0000-0000-0000-000000000001', 'Robert S.', 'Professional, punctual, and great attention to detail. Highly recommend.', 5, now() - interval '20 days'),
  ('11111111-1111-1111-1111-111111111101', '00000000-0000-0000-0000-000000000001', 'Lisa T.', 'Great communication throughout the project. Very happy with the results.', 4, now() - interval '30 days'),
  -- Modern Home Solutions
  ('11111111-1111-1111-1111-111111111102', '00000000-0000-0000-0000-000000000001', 'Jennifer M.', 'Absolutely fantastic work! They transformed our kitchen beyond what we imagined.', 5, now() - interval '10 days'),
  ('11111111-1111-1111-1111-111111111102', '00000000-0000-0000-0000-000000000001', 'Robert S.', 'Professional, punctual, and great attention to detail. Highly recommend.', 5, now() - interval '20 days'),
  ('11111111-1111-1111-1111-111111111102', '00000000-0000-0000-0000-000000000001', 'Lisa T.', 'Great communication throughout the project. Very happy with the results.', 4, now() - interval '30 days'),
  -- Artisan Renovators
  ('11111111-1111-1111-1111-111111111103', '00000000-0000-0000-0000-000000000001', 'Jennifer M.', 'Absolutely fantastic work! They transformed our kitchen beyond what we imagined.', 5, now() - interval '10 days'),
  ('11111111-1111-1111-1111-111111111103', '00000000-0000-0000-0000-000000000001', 'Robert S.', 'Professional, punctual, and great attention to detail. Highly recommend.', 5, now() - interval '20 days'),
  ('11111111-1111-1111-1111-111111111103', '00000000-0000-0000-0000-000000000001', 'Lisa T.', 'Great communication throughout the project. Very happy with the results.', 4, now() - interval '30 days'),
  -- Precision Builders
  ('11111111-1111-1111-1111-111111111104', '00000000-0000-0000-0000-000000000001', 'Jennifer M.', 'Absolutely fantastic work! They transformed our kitchen beyond what we imagined.', 5, now() - interval '10 days'),
  ('11111111-1111-1111-1111-111111111104', '00000000-0000-0000-0000-000000000001', 'Robert S.', 'Professional, punctual, and great attention to detail. Highly recommend.', 5, now() - interval '20 days'),
  ('11111111-1111-1111-1111-111111111104', '00000000-0000-0000-0000-000000000001', 'Lisa T.', 'Great communication throughout the project. Very happy with the results.', 4, now() - interval '30 days');

-- ============================================================
-- INSPIRATION CATEGORIES
-- ============================================================

INSERT INTO inspiration_categories (id, name, slug) VALUES
  ('22222222-2222-2222-2222-222222222201', 'Kitchen', 'kitchen'),
  ('22222222-2222-2222-2222-222222222202', 'Bathroom', 'bathroom'),
  ('22222222-2222-2222-2222-222222222203', 'Living Room', 'living-room'),
  ('22222222-2222-2222-2222-222222222204', 'Bedroom', 'bedroom'),
  ('22222222-2222-2222-2222-222222222205', 'Exterior', 'exterior');

-- ============================================================
-- INSPIRATIONS
-- ============================================================

INSERT INTO inspirations (category_id, title, image_url, author, likes) VALUES
  ('22222222-2222-2222-2222-222222222201', 'Modern Minimalist Kitchen', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', 'Sarah Mitchell', 234),
  ('22222222-2222-2222-2222-222222222202', 'Rustic Farmhouse Bathroom', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80', 'James Cooper', 189),
  ('22222222-2222-2222-2222-222222222203', 'Contemporary Living Space', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80', 'Emily Chen', 312),
  ('22222222-2222-2222-2222-222222222204', 'Scandinavian Bedroom Retreat', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80', 'Michael Torres', 156),
  ('22222222-2222-2222-2222-222222222202', 'Luxury Master Bath', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80', 'Olivia Park', 278),
  ('22222222-2222-2222-2222-222222222201', 'Open Concept Kitchen & Dining', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', 'David Kim', 421);

-- ============================================================
-- SHOP CATEGORIES
-- ============================================================

INSERT INTO shop_categories (id, name, image_url, product_count) VALUES
  ('33333333-3333-3333-3333-333333333301', 'Flooring', 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=400&q=80', 245),
  ('33333333-3333-3333-3333-333333333302', 'Lighting', 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400&q=80', 189),
  ('33333333-3333-3333-3333-333333333303', 'Kitchen Fixtures', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', 312),
  ('33333333-3333-3333-3333-333333333304', 'Bathroom', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80', 178);

-- ============================================================
-- PRODUCTS
-- ============================================================

INSERT INTO products (category_id, name, price_display, rating, reviews_count) VALUES
  ('33333333-3333-3333-3333-333333333301', 'Premium Hardwood Flooring', '$8.99/sq ft', 4.8, 156),
  ('33333333-3333-3333-3333-333333333302', 'Modern Pendant Light Set', '$129.00', 4.9, 89),
  ('33333333-3333-3333-3333-333333333303', 'Brushed Nickel Faucet', '$249.00', 4.7, 203),
  ('33333333-3333-3333-3333-333333333301', 'Ceramic Subway Tiles (box)', '$45.00', 4.8, 341),
  ('33333333-3333-3333-3333-333333333303', 'Smart Thermostat', '$179.00', 4.9, 512),
  ('33333333-3333-3333-3333-333333333304', 'Frameless Shower Door', '$389.00', 4.6, 94),
  ('33333333-3333-3333-3333-333333333303', 'Quartz Countertop Sample', '$12.99', 4.8, 267),
  ('33333333-3333-3333-3333-333333333302', 'LED Recessed Light Kit', '$89.00', 4.7, 178);

-- ============================================================
-- PROJECTS
-- ============================================================

INSERT INTO projects (user_id, contractor_id, name, status, progress, budget, start_date, end_date) VALUES
  ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111101', 'Kitchen Remodel', 'in_progress', 65, '$45,000', '2026-01-15', '2026-03-30'),
  ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111102', 'Master Bathroom Renovation', 'planning', 15, '$22,000', '2026-03-01', '2026-04-15'),
  ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111104', 'Deck & Patio Build', 'completed', 100, '$18,500', '2025-10-01', '2025-11-20');

-- ============================================================
-- CONVERSATIONS
-- ============================================================

INSERT INTO conversations (id, updated_at) VALUES
  ('44444444-4444-4444-4444-444444444401', now() - interval '2 minutes'),
  ('44444444-4444-4444-4444-444444444402', now() - interval '1 hour'),
  ('44444444-4444-4444-4444-444444444403', now() - interval '3 hours'),
  ('44444444-4444-4444-4444-444444444404', now() - interval '1 day'),
  ('44444444-4444-4444-4444-444444444405', now() - interval '2 days');

-- ============================================================
-- CONVERSATION PARTICIPANTS
-- ============================================================

-- Each conversation has the demo user + one contractor
INSERT INTO conversation_participants (conversation_id, user_id, contractor_id) VALUES
  -- Conv 1: Demo User + BuildRight
  ('44444444-4444-4444-4444-444444444401', '00000000-0000-0000-0000-000000000001', NULL),
  ('44444444-4444-4444-4444-444444444401', NULL, '11111111-1111-1111-1111-111111111101'),
  -- Conv 2: Demo User + Modern Home
  ('44444444-4444-4444-4444-444444444402', '00000000-0000-0000-0000-000000000001', NULL),
  ('44444444-4444-4444-4444-444444444402', NULL, '11111111-1111-1111-1111-111111111102'),
  -- Conv 3: Demo User + Artisan
  ('44444444-4444-4444-4444-444444444403', '00000000-0000-0000-0000-000000000001', NULL),
  ('44444444-4444-4444-4444-444444444403', NULL, '11111111-1111-1111-1111-111111111103'),
  -- Conv 4: Demo User + Precision
  ('44444444-4444-4444-4444-444444444404', '00000000-0000-0000-0000-000000000001', NULL),
  ('44444444-4444-4444-4444-444444444404', NULL, '11111111-1111-1111-1111-111111111104'),
  -- Conv 5: Demo User + Support (user_id for support user)
  ('44444444-4444-4444-4444-444444444405', '00000000-0000-0000-0000-000000000001', NULL),
  ('44444444-4444-4444-4444-444444444405', '00000000-0000-0000-0000-000000000002', NULL);

-- ============================================================
-- MESSAGES (last messages for each conversation + some extras for unread counts)
-- ============================================================

-- Conversation 1: BuildRight (3 unread)
INSERT INTO messages (conversation_id, sender_id, content, is_read, created_at) VALUES
  ('44444444-4444-4444-4444-444444444401', '00000000-0000-0000-0000-000000000001', 'Hi, any update on the kitchen remodel?', true, now() - interval '30 minutes'),
  ('44444444-4444-4444-4444-444444444401', '00000000-0000-0000-0000-000000000011', 'Yes! Materials are on the way.', false, now() - interval '15 minutes'),
  ('44444444-4444-4444-4444-444444444401', '00000000-0000-0000-0000-000000000011', 'We should be ready to start tiling by Thursday.', false, now() - interval '10 minutes'),
  ('44444444-4444-4444-4444-444444444401', '00000000-0000-0000-0000-000000000011', 'The countertop materials arrived today. We''ll start installation tomorrow morning.', false, now() - interval '2 minutes');

-- Conversation 2: Modern Home (1 unread)
INSERT INTO messages (conversation_id, sender_id, content, is_read, created_at) VALUES
  ('44444444-4444-4444-4444-444444444402', '00000000-0000-0000-0000-000000000001', 'Can you send me the updated floor plans?', true, now() - interval '2 hours'),
  ('44444444-4444-4444-4444-444444444402', '00000000-0000-0000-0000-000000000012', 'I''ve uploaded the revised floor plan to the project files. Please review when you get a chance.', false, now() - interval '1 hour');

-- Conversation 3: Artisan (0 unread)
INSERT INTO messages (conversation_id, sender_id, content, is_read, created_at) VALUES
  ('44444444-4444-4444-4444-444444444403', '00000000-0000-0000-0000-000000000001', 'I''m leaning towards the oak option for the flooring.', true, now() - interval '4 hours'),
  ('44444444-4444-4444-4444-444444444403', '00000000-0000-0000-0000-000000000013', 'Great choice on the oak flooring! It''s going to look amazing.', true, now() - interval '3 hours');

-- Conversation 4: Precision (0 unread)
INSERT INTO messages (conversation_id, sender_id, content, is_read, created_at) VALUES
  ('44444444-4444-4444-4444-444444444404', '00000000-0000-0000-0000-000000000014', 'Project completed! Please leave a review when you have a moment.', true, now() - interval '1 day');

-- Conversation 5: Support (0 unread)
INSERT INTO messages (conversation_id, sender_id, content, is_read, created_at) VALUES
  ('44444444-4444-4444-4444-444444444405', '00000000-0000-0000-0000-000000000002', 'Welcome to HomeRevive! Let us know if you need help getting started.', true, now() - interval '2 days');
