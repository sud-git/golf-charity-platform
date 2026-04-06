-- Golf Charity Platform - Seed Data for Testing

-- Insert test charities
INSERT INTO charities (name, description, slug, category, featured, status) VALUES
('Red Cross', 'International humanitarian organization providing disaster relief and medical assistance', 'red-cross', 'Healthcare', true, 'active'),
('World Wildlife Fund', 'Conserving nature, wildlife, and natural resources globally', 'wwf', 'Environment', true, 'active'),
('Doctors Without Borders', 'International medical humanitarian organization providing emergency aid', 'doctors-without-borders', 'Healthcare', false, 'active'),
('Local Food Bank', 'Community-based food assistance and hunger relief program', 'local-food-bank', 'Social', false, 'active'),
('Children''s Cancer Research Fund', 'Funding innovative research to combat childhood cancer', 'childrens-cancer-fund', 'Healthcare', true, 'active'),
('Ocean Cleanup Initiative', 'Protecting oceans and marine life from plastic pollution', 'ocean-cleanup', 'Environment', false, 'active');
