-- ============================================================
-- Washington State Area Contractors
-- 8 contractors across Seattle, Tacoma, Bellevue, Spokane,
-- Olympia, Vancouver, and Redmond, WA
-- ============================================================

-- ============================================================
-- CONTRACTORS
-- ============================================================

INSERT INTO contractors (id, slug, name, specialty, rating, reviews_count, location, price_range, projects_count, description, image_url) VALUES
  (
    '11111111-1111-1111-1111-111111111105',
    'emerald-city-remodeling',
    'Emerald City Remodeling',
    'Kitchen & Bathroom Remodeling',
    4.9, 156,
    'Seattle, WA',
    '$$$',
    210,
    'Seattle''s premier kitchen and bathroom remodeling team with over 12 years serving the Puget Sound region. We combine Pacific Northwest aesthetics with modern functionality to create spaces that inspire daily living.',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  ),
  (
    '11111111-1111-1111-1111-111111111106',
    'puget-sound-builders',
    'Puget Sound Builders',
    'Home Additions & ADUs',
    4.8, 78,
    'Seattle, WA',
    '$$$$',
    95,
    'Specializing in home additions and accessory dwelling units across Greater Seattle. From backyard cottages to second-story additions, we handle design, permitting, and construction to maximize your property''s potential.',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  ),
  (
    '11111111-1111-1111-1111-111111111107',
    'cascade-painting-drywall',
    'Cascade Painting & Drywall',
    'Interior & Exterior Painting',
    4.7, 112,
    'Tacoma, WA',
    '$$',
    340,
    'Tacoma''s trusted painting professionals delivering flawless finishes since 2010. Our crew handles everything from accent walls to full exterior repaints, using premium low-VOC paints built to withstand the Pacific Northwest climate.',
    'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  ),
  (
    '11111111-1111-1111-1111-111111111108',
    'eastside-home-solutions',
    'Eastside Home Solutions',
    'Full Home Renovations',
    4.9, 134,
    'Bellevue, WA',
    '$$$$',
    178,
    'Bellevue''s luxury whole-home renovation experts. We transform outdated properties into modern masterpieces with meticulous attention to detail, smart home technology, and high-end finishes that reflect the Eastside lifestyle.',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  ),
  (
    '11111111-1111-1111-1111-111111111109',
    'inland-empire-roofing',
    'Inland Empire Roofing',
    'Roofing & Siding',
    4.6, 67,
    'Spokane, WA',
    '$$',
    120,
    'Eastern Washington''s dependable roofing and siding contractor. We install and repair residential roofs built to handle Spokane''s heavy snow loads and hot summers, using top-tier materials backed by manufacturer warranties.',
    'https://images.unsplash.com/photo-1632759145351-1d592919f522?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  ),
  (
    '11111111-1111-1111-1111-111111111110',
    'capitol-flooring-tile',
    'Capitol Flooring & Tile',
    'Hardwood Flooring & Tile',
    4.8, 89,
    'Olympia, WA',
    '$$',
    165,
    'Serving the South Sound from our Olympia showroom, we specialize in hardwood, tile, and luxury vinyl flooring installation. Our certified installers deliver precision craftsmanship with a lifetime workmanship guarantee.',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'columbia-river-exteriors',
    'Columbia River Exteriors',
    'Decks & Outdoor Living',
    4.7, 95,
    'Vancouver, WA',
    '$$$',
    142,
    'Creating stunning outdoor living spaces throughout Southwest Washington. From composite decks and cedar pergolas to full outdoor kitchens, we design and build backyard retreats that extend your living area year-round.',
    'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  ),
  (
    '11111111-1111-1111-1111-111111111112',
    'redmond-custom-carpentry',
    'Redmond Custom Carpentry',
    'Custom Carpentry & Built-ins',
    4.9, 108,
    'Redmond, WA',
    '$$$',
    130,
    'Master carpenters crafting bespoke built-ins, custom cabinetry, and fine woodwork for Eastside homes. Every piece is designed to fit your space perfectly—from home offices and library walls to walk-in closet systems.',
    'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
  );

-- ============================================================
-- CONTRACTOR SERVICES
-- ============================================================

-- Emerald City Remodeling (Seattle)
INSERT INTO contractor_services (contractor_id, service_name) VALUES
  ('11111111-1111-1111-1111-111111111105', 'Kitchen Remodeling'),
  ('11111111-1111-1111-1111-111111111105', 'Bathroom Renovation'),
  ('11111111-1111-1111-1111-111111111105', 'Tile Work'),
  ('11111111-1111-1111-1111-111111111105', 'Countertop Replacement'),
  ('11111111-1111-1111-1111-111111111105', 'Cabinet Installation'),
  ('11111111-1111-1111-1111-111111111105', 'Plumbing Upgrades');

-- Puget Sound Builders (Seattle)
INSERT INTO contractor_services (contractor_id, service_name) VALUES
  ('11111111-1111-1111-1111-111111111106', 'Home Additions'),
  ('11111111-1111-1111-1111-111111111106', 'ADU Construction'),
  ('11111111-1111-1111-1111-111111111106', 'Garage Conversions'),
  ('11111111-1111-1111-1111-111111111106', 'Foundation Work'),
  ('11111111-1111-1111-1111-111111111106', 'Framing'),
  ('11111111-1111-1111-1111-111111111106', 'Permit Management');

-- Cascade Painting & Drywall (Tacoma)
INSERT INTO contractor_services (contractor_id, service_name) VALUES
  ('11111111-1111-1111-1111-111111111107', 'Interior Painting'),
  ('11111111-1111-1111-1111-111111111107', 'Exterior Painting'),
  ('11111111-1111-1111-1111-111111111107', 'Drywall Repair'),
  ('11111111-1111-1111-1111-111111111107', 'Wallpaper Installation'),
  ('11111111-1111-1111-1111-111111111107', 'Pressure Washing'),
  ('11111111-1111-1111-1111-111111111107', 'Color Consultation');

-- Eastside Home Solutions (Bellevue)
INSERT INTO contractor_services (contractor_id, service_name) VALUES
  ('11111111-1111-1111-1111-111111111108', 'Full Home Renovation'),
  ('11111111-1111-1111-1111-111111111108', 'Open Floor Plan Conversion'),
  ('11111111-1111-1111-1111-111111111108', 'Interior Design'),
  ('11111111-1111-1111-1111-111111111108', 'Smart Home Integration'),
  ('11111111-1111-1111-1111-111111111108', 'Lighting Design'),
  ('11111111-1111-1111-1111-111111111108', 'Energy Efficiency Upgrades');

-- Inland Empire Roofing (Spokane)
INSERT INTO contractor_services (contractor_id, service_name) VALUES
  ('11111111-1111-1111-1111-111111111109', 'Roof Replacement'),
  ('11111111-1111-1111-1111-111111111109', 'Roof Repair'),
  ('11111111-1111-1111-1111-111111111109', 'Siding Installation'),
  ('11111111-1111-1111-1111-111111111109', 'Gutter Systems'),
  ('11111111-1111-1111-1111-111111111109', 'Skylight Installation'),
  ('11111111-1111-1111-1111-111111111109', 'Insulation');

-- Capitol Flooring & Tile (Olympia)
INSERT INTO contractor_services (contractor_id, service_name) VALUES
  ('11111111-1111-1111-1111-111111111110', 'Hardwood Flooring'),
  ('11111111-1111-1111-1111-111111111110', 'Tile Installation'),
  ('11111111-1111-1111-1111-111111111110', 'Luxury Vinyl Plank'),
  ('11111111-1111-1111-1111-111111111110', 'Floor Refinishing'),
  ('11111111-1111-1111-1111-111111111110', 'Heated Floors'),
  ('11111111-1111-1111-1111-111111111110', 'Grout Repair');

-- Columbia River Exteriors (Vancouver)
INSERT INTO contractor_services (contractor_id, service_name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Deck Building'),
  ('11111111-1111-1111-1111-111111111111', 'Patio Construction'),
  ('11111111-1111-1111-1111-111111111111', 'Outdoor Kitchen'),
  ('11111111-1111-1111-1111-111111111111', 'Fencing'),
  ('11111111-1111-1111-1111-111111111111', 'Pergola Installation'),
  ('11111111-1111-1111-1111-111111111111', 'Landscaping Hardscape');

-- Redmond Custom Carpentry (Redmond)
INSERT INTO contractor_services (contractor_id, service_name) VALUES
  ('11111111-1111-1111-1111-111111111112', 'Custom Cabinetry'),
  ('11111111-1111-1111-1111-111111111112', 'Built-in Shelving'),
  ('11111111-1111-1111-1111-111111111112', 'Closet Systems'),
  ('11111111-1111-1111-1111-111111111112', 'Trim & Molding'),
  ('11111111-1111-1111-1111-111111111112', 'Staircase Renovation'),
  ('11111111-1111-1111-1111-111111111112', 'Custom Furniture');

-- ============================================================
-- REVIEWS (3 per contractor, unique content per specialty)
-- ============================================================

INSERT INTO reviews (contractor_id, user_id, reviewer_name, content, rating, created_at) VALUES
  -- Emerald City Remodeling (Seattle - Kitchen & Bath)
  ('11111111-1111-1111-1111-111111111105', '00000000-0000-0000-0000-000000000001', 'Amanda W.', 'Our kitchen looks incredible! They worked around our schedule and the tile backsplash is exactly what we envisioned. Worth every penny.', 5, now() - interval '5 days'),
  ('11111111-1111-1111-1111-111111111105', '00000000-0000-0000-0000-000000000001', 'Kevin P.', 'Emerald City completely transformed our outdated master bath. The frameless shower and heated floors are a dream. Highly professional team.', 5, now() - interval '18 days'),
  ('11111111-1111-1111-1111-111111111105', '00000000-0000-0000-0000-000000000001', 'Diana L.', 'Good work on the countertops and cabinets. Minor scheduling delays but the final result was beautiful. Would hire again.', 4, now() - interval '32 days'),

  -- Puget Sound Builders (Seattle - Additions & ADUs)
  ('11111111-1111-1111-1111-111111111106', '00000000-0000-0000-0000-000000000001', 'Marcus T.', 'They built a 600 sq ft ADU in our backyard and handled all the Seattle permitting. Tenants moved in two weeks after completion. Excellent ROI.', 5, now() - interval '7 days'),
  ('11111111-1111-1111-1111-111111111106', '00000000-0000-0000-0000-000000000001', 'Rachel K.', 'Our second-story addition doubled our living space. Structural engineering was solid and they kept the project on budget. Very impressed.', 5, now() - interval '22 days'),
  ('11111111-1111-1111-1111-111111111106', '00000000-0000-0000-0000-000000000001', 'Tom H.', 'Garage conversion turned out great. Communication could have been better during the permitting phase, but the build quality is top notch.', 4, now() - interval '40 days'),

  -- Cascade Painting & Drywall (Tacoma)
  ('11111111-1111-1111-1111-111111111107', '00000000-0000-0000-0000-000000000001', 'Nicole B.', 'Painted the entire exterior of our Tacoma craftsman. They prepped everything thoroughly and the paint job has held up perfectly through two rainy seasons.', 5, now() - interval '6 days'),
  ('11111111-1111-1111-1111-111111111107', '00000000-0000-0000-0000-000000000001', 'Greg F.', 'Hired them for interior painting of 5 rooms. Clean work, great color consultation, and they finished a day early. Very reasonable pricing too.', 5, now() - interval '19 days'),
  ('11111111-1111-1111-1111-111111111107', '00000000-0000-0000-0000-000000000001', 'Sarah J.', 'Drywall repair and repaint after water damage. Fixed everything seamlessly—you can''t even tell where the damage was. Fair price for quality work.', 4, now() - interval '35 days'),

  -- Eastside Home Solutions (Bellevue)
  ('11111111-1111-1111-1111-111111111108', '00000000-0000-0000-0000-000000000001', 'Christine M.', 'Complete remodel of our 1990s Bellevue home. Open floor plan, new kitchen, smart lighting throughout. It feels like a brand new house. Absolutely stunning work.', 5, now() - interval '4 days'),
  ('11111111-1111-1111-1111-111111111108', '00000000-0000-0000-0000-000000000001', 'David R.', 'They modernized every room while preserving the character of our home. The interior design team had fantastic ideas we never would have thought of.', 5, now() - interval '16 days'),
  ('11111111-1111-1111-1111-111111111108', '00000000-0000-0000-0000-000000000001', 'Priya S.', 'High-end renovation with smart home integration. Everything controlled from our phones now. Pricey but the quality justifies the investment.', 4, now() - interval '28 days'),

  -- Inland Empire Roofing (Spokane)
  ('11111111-1111-1111-1111-111111111109', '00000000-0000-0000-0000-000000000001', 'Brian C.', 'Replaced our 25-year-old roof before winter hit. Crew was fast, cleaned up perfectly, and the architectural shingles look great. No leaks through the heavy snow season.', 5, now() - interval '8 days'),
  ('11111111-1111-1111-1111-111111111109', '00000000-0000-0000-0000-000000000001', 'Laura M.', 'New siding and gutters installed in just four days. Price was very competitive compared to other Spokane quotes. Solid workmanship.', 4, now() - interval '24 days'),
  ('11111111-1111-1111-1111-111111111109', '00000000-0000-0000-0000-000000000001', 'Jake D.', 'Fixed a persistent leak around our skylight that two other companies couldn''t figure out. Honest assessment and fair pricing. Reliable crew.', 4, now() - interval '38 days'),

  -- Capitol Flooring & Tile (Olympia)
  ('11111111-1111-1111-1111-111111111110', '00000000-0000-0000-0000-000000000001', 'Megan O.', 'Installed white oak hardwood throughout our main floor. The craftsmanship is flawless—every plank aligned perfectly. Our home feels completely transformed.', 5, now() - interval '3 days'),
  ('11111111-1111-1111-1111-111111111110', '00000000-0000-0000-0000-000000000001', 'Carlos V.', 'Large-format tile in kitchen and both bathrooms. Heated floor option was a great suggestion. Professional install with zero callbacks needed.', 5, now() - interval '14 days'),
  ('11111111-1111-1111-1111-111111111110', '00000000-0000-0000-0000-000000000001', 'Hannah G.', 'Refinished our 1940s fir floors beautifully. They look brand new. Only minor note—took a couple extra days beyond the estimate. Still very happy.', 4, now() - interval '30 days'),

  -- Columbia River Exteriors (Vancouver)
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Steve A.', 'Built a gorgeous 400 sq ft composite deck with built-in bench seating. Survived the summer heat and winter rain without a single issue. Love it.', 5, now() - interval '9 days'),
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Patricia N.', 'Outdoor kitchen with covered pergola turned our backyard into an entertainment hub. Neighbors are jealous! Great design sense and solid construction.', 5, now() - interval '21 days'),
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Eric W.', 'Cedar fence and patio pavers look fantastic. Project ran slightly over budget due to material costs, but the quality of work was excellent.', 4, now() - interval '36 days'),

  -- Redmond Custom Carpentry (Redmond)
  ('11111111-1111-1111-1111-111111111112', '00000000-0000-0000-0000-000000000001', 'Jennifer Y.', 'Custom floor-to-ceiling bookshelves in our home office. The walnut finish is gorgeous and every shelf is perfectly level. True craftsmen.', 5, now() - interval '6 days'),
  ('11111111-1111-1111-1111-111111111112', '00000000-0000-0000-0000-000000000001', 'Andrew K.', 'They designed and built a complete walk-in closet system with custom drawers and shoe storage. Maximized every inch of space. Incredible attention to detail.', 5, now() - interval '17 days'),
  ('11111111-1111-1111-1111-111111111112', '00000000-0000-0000-0000-000000000001', 'Michelle T.', 'Beautiful crown molding and wainscoting throughout our dining room. Minor touch-up needed on one joint but they came back immediately to fix it. Great people.', 4, now() - interval '29 days');
