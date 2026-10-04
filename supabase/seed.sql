insert into public.products (slug, name, category, description, price_cents, colors, sizes) values
('classic-round-neck-tee','Classic Round Neck Tee','tops','Heavyweight 100% combed cotton tee with a clean round neck and a relaxed fit.',1900,
 '[{"name":"White","hex":"#f5f5f4"},{"name":"Black","hex":"#171717"},{"name":"Sage","hex":"#9caf88"}]','{XS,S,M,L,XL,XXL}'),
('essential-round-neck-top','Essential Round Neck Top','tops','Soft-touch everyday top with a slim fit and ribbed round neckline.',1600,
 '[{"name":"Navy","hex":"#1e293b"},{"name":"Sand","hex":"#d6c7a1"},{"name":"Rust","hex":"#b4532a"}]','{XS,S,M,L,XL}'),
('oversized-round-neck-tee','Oversized Round Neck Tee','tops','Drop-shoulder oversized tee in a thick, structured cotton jersey.',2200,
 '[{"name":"Charcoal","hex":"#3f3f46"},{"name":"Cream","hex":"#f1e9d2"}]','{S,M,L,XL}'),
('everyday-crew-sweatshirt','Everyday Crew Sweatshirt','sweatshirts','Midweight fleece-backed crew sweatshirt with ribbed cuffs and hem.',4500,
 '[{"name":"Heather Grey","hex":"#a1a1aa"},{"name":"Black","hex":"#171717"},{"name":"Forest","hex":"#264653"}]','{XS,S,M,L,XL,XXL}'),
('heavyweight-sweatshirt','Heavyweight Sweatshirt','sweatshirts','450gsm brushed-back cotton sweatshirt built to last for years.',5800,
 '[{"name":"Bone","hex":"#e7e5e4"},{"name":"Burgundy","hex":"#6d1a36"}]','{S,M,L,XL}'),
('classic-snapback-cap','Classic Snapback Cap','caps','Flat-brim six-panel snapback with embroidered logo and adjustable strap.',2400,
 '[{"name":"Black","hex":"#171717"},{"name":"White","hex":"#f5f5f4"},{"name":"Red","hex":"#b91c1c"}]','{One Size}'),
('two-tone-snapback-cap','Two-Tone Snapback Cap','caps','Contrast-brim snapback with structured crown and breathable eyelets.',2600,
 '[{"name":"Navy","hex":"#1e293b"},{"name":"Olive","hex":"#4d5a2f"}]','{One Size}')
on conflict (slug) do nothing;
