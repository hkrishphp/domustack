-- Add slug column to contractors for SEO-friendly URLs
ALTER TABLE contractors ADD COLUMN slug TEXT UNIQUE;

-- Populate slugs for existing contractors
UPDATE contractors SET slug = 'buildright-construction' WHERE id = '11111111-1111-1111-1111-111111111101';
UPDATE contractors SET slug = 'modern-home-solutions' WHERE id = '11111111-1111-1111-1111-111111111102';
UPDATE contractors SET slug = 'artisan-renovators' WHERE id = '11111111-1111-1111-1111-111111111103';
UPDATE contractors SET slug = 'precision-builders-co' WHERE id = '11111111-1111-1111-1111-111111111104';

-- WA contractors
UPDATE contractors SET slug = 'emerald-city-remodeling' WHERE id = '11111111-1111-1111-1111-111111111105';
UPDATE contractors SET slug = 'puget-sound-builders' WHERE id = '11111111-1111-1111-1111-111111111106';
UPDATE contractors SET slug = 'cascade-painting-drywall' WHERE id = '11111111-1111-1111-1111-111111111107';
UPDATE contractors SET slug = 'eastside-home-solutions' WHERE id = '11111111-1111-1111-1111-111111111108';
UPDATE contractors SET slug = 'inland-empire-roofing' WHERE id = '11111111-1111-1111-1111-111111111109';
UPDATE contractors SET slug = 'capitol-flooring-tile' WHERE id = '11111111-1111-1111-1111-111111111110';
UPDATE contractors SET slug = 'columbia-river-exteriors' WHERE id = '11111111-1111-1111-1111-111111111111';
UPDATE contractors SET slug = 'redmond-custom-carpentry' WHERE id = '11111111-1111-1111-1111-111111111112';

-- Make slug NOT NULL after populating
ALTER TABLE contractors ALTER COLUMN slug SET NOT NULL;
