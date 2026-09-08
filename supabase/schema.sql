create extension if not exists pgcrypto;
create table if not exists campaigns(id uuid primary key default gen_random_uuid(),slug text unique not null,category text not null,title text not null,entrepreneur_name text not null,location text,description text not null,use_of_funds text not null,raised numeric(12,2) not null default 0,goal numeric(12,2) not null,supporters integer not null default 0,image_url text,verified boolean not null default false,featured boolean not null default false,status text not null default 'review' check(status in('review','published','paused','funded','rejected')),latest_update text,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table if not exists pitch_submissions(id uuid primary key default gen_random_uuid(),title text not null,entrepreneur_name text not null,category text not null,location text,goal numeric(12,2) not null,story text not null,use_of_funds text not null,image_url text,application_data jsonb not null default '{}'::jsonb,status text not null default 'review' check(status in('review','approved','rejected')),admin_notes text,created_at timestamptz not null default now());
alter table pitch_submissions add column if not exists application_data jsonb not null default '{}'::jsonb;
create table if not exists supporters(id uuid primary key default gen_random_uuid(),display_name text,phone_last4 text,total_supported numeric(12,2) not null default 0,campaigns_supported integer not null default 0,created_at timestamptz not null default now());
create table if not exists transactions(id uuid primary key default gen_random_uuid(),campaign_id uuid references campaigns(id) on delete set null,supporter_id uuid references supporters(id) on delete set null,amount numeric(12,2) not null,network text,phone text,provider_reference text unique,status text not null default 'pending' check(status in('pending','successful','failed','reversed')),created_at timestamptz not null default now());
create table if not exists campaign_updates(id uuid primary key default gen_random_uuid(),campaign_id uuid references campaigns(id) on delete cascade not null,title text not null,body text not null,created_at timestamptz not null default now());
create table if not exists reports(id uuid primary key default gen_random_uuid(),campaign_id uuid references campaigns(id) on delete cascade,reason text not null,details text,status text not null default 'open' check(status in('open','reviewing','resolved','dismissed')),created_at timestamptz not null default now());
create table if not exists site_settings(key text primary key,value jsonb not null,updated_at timestamptz not null default now());
alter table campaigns enable row level security; alter table pitch_submissions enable row level security; alter table supporters enable row level security; alter table transactions enable row level security; alter table campaign_updates enable row level security; alter table reports enable row level security; alter table site_settings enable row level security;
drop policy if exists "public can view published campaigns" on campaigns;
drop policy if exists "public can view campaign updates" on campaign_updates;
create policy "public can view published campaigns" on campaigns for select using(status in('published','funded'));
create policy "public can view campaign updates" on campaign_updates for select using(true);
insert into site_settings(key,value) values('impact','{"entrepreneurs_funded":342,"support_mobilized":342000,"supporters":1200,"average_progress":78}'),('platform','{"name":"Peer Pockets","country":"Ghana","support_email":"hello@peerpocketss.com"}') on conflict(key) do nothing;
insert into campaigns(slug,category,title,entrepreneur_name,location,description,use_of_funds,raised,goal,supporters,image_url,verified,featured,status,latest_update) values
('kente','Fashion & Trading','Kente accessories for students','Akosua Boateng','Cape Coast, Ghana','A UCC student selling handmade kente accessories on campus.','GHS 800 fabric & materials · GHS 400 first market stall fee',780,1200,34,'/images/kente.svg',true,true,'published','We have reached 65% of our goal.'),
('repair','Services','Mobile phone repair kiosk','Kwabena Owusu','Kumasi, Ghana','A self-taught phone repair technician setting up a fixed kiosk.','GHS 2,000 tools & parts · GHS 1,500 kiosk rental deposit',1900,3500,51,'/images/repair.svg',true,false,'published','The first equipment purchase is ready.'),
('waakye','Food & Delivery','Waakye delivery service','Efua Mensah','Accra, Ghana','A small home-based waakye business adding delivery.','GHS 600 cooking equipment · GHS 300 delivery fuel fund',900,900,28,'/images/waakye.svg',true,true,'funded','Fully funded!'),
('solar','Agriculture','Solar irrigation for a vegetable farm','Kofi Asare','Eastern Region, Ghana','A young farmer wants to reduce fuel costs with solar irrigation.','GHS 1,450 solar pump · GHS 550 pipes & storage',1120,2000,22,'/images/farm.svg',false,false,'published','The farmer has secured the water tank.'),
('design','Technology','Campus design & print studio','Nana Yeboah','Cape Coast, Ghana','A student designer building a compact print and design service.','GHS 1,200 printer · GHS 700 materials & workspace',1340,1900,37,'/images/design.svg',true,false,'published','The campaign is 71% funded.'),
('snacks','Food & Trading','Healthy snack packs for students','Abena Ofori','Takoradi, Ghana','Affordable snack packs made from locally sourced ingredients.','GHS 600 ingredients · GHS 450 packaging · GHS 250 delivery',520,1300,16,'/images/snacks.svg',false,false,'published','New sample packs are being tested.') on conflict(slug) do nothing;

create table if not exists faqs(id uuid primary key default gen_random_uuid(),question text not null,answer text not null,sort_order integer not null default 0,active boolean not null default true,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
delete from faqs a using faqs b where a.id>b.id and lower(trim(a.question))=lower(trim(b.question));
create unique index if not exists faqs_question_unique on faqs(lower(trim(question)));
alter table faqs enable row level security;
drop policy if exists "public can view active faqs" on faqs;
create policy "public can view active faqs" on faqs for select using(active=true);
insert into faqs(question,answer,sort_order) values
('What is Peer Pockets?','Peer Pockets connects young and micro entrepreneurs with supporters who want to fund practical business needs in Ghana.',1),
('How are campaigns reviewed?','Every submitted pitch can be reviewed by the platform administrator before it is published.',2),
('How do I support a business?','Choose a campaign, enter your support amount and follow the Mobile Money instructions shown at checkout.',3),
('Can I report a campaign?','Yes. Suspicious or misleading campaigns can be reported for administrator review.',4)
on conflict do nothing;

