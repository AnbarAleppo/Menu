-- ==============================================================================
-- ANBAR RESTAURANT - INITIAL SEED DATA
-- ==============================================================================
-- Run this script in the Supabase SQL Editor after running schema.sql

-- 1. SEED CATEGORIES
INSERT INTO public.categories (slug, name_ar, name_en, sort_order, is_active) VALUES
('small-plates', 'أطباق صغيرة ومقبلات', 'Small Plates & Mezze', 1, true),
('mains', 'الأطباق الرئيسية', 'Hearth & Mains', 2, true),
('flatbreads', 'مناقيش ومعجنات', 'Artisan Flatbreads', 3, true),
('sweets', 'حلويات', 'Artisan Sweets', 4, true),
('drinks', 'مشروبات وعصائر', 'Drinks & Elixirs', 5, true)
ON CONFLICT (slug) DO UPDATE SET
    name_ar = EXCLUDED.name_ar,
    name_en = EXCLUDED.name_en,
    sort_order = EXCLUDED.sort_order;

-- 2. SEED MENU ITEMS (18 Authentic Items)
INSERT INTO public.menu_items (id, title, category_slug, price, description, ingredients, pairing, image_url, badge, tags, is_available, is_featured, sort_order) VALUES
-- Small Plates
('sp-1', 'باذنجان مدخن بطحينة الرمان', 'small-plates', 35000, 'باذنجان مشوي على الحطب مهروس مع طحينة السمسم الخالصة، زيت الزعتر البري وحبات الرمان الطازجة.', 'باذنجان مشوي، طحينة سمسم فاخرة، ثوم، زيت زيتون معتق، رمان، زعتر بري.', 'شراب الكركديه والنعناع الفوار', 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=700&q=80', 'طبق توقيع', ARRAY['vg', 'gf', 'chef'], true, true, 1),
('sp-2', 'شمندر مشوي بحطب اللوز مع الدقة', 'small-plates', 38000, 'شرائح الشمندر الأحمر والذهبي المخبوزة بطبطبة هادئة، مع لبنة الغنم المخفوقة ودقة البندق المصرية.', 'شمندر طازج، لبنة بلدية مخفوقة، دقة بندق محمصة، برك بشر البرتقال.', 'موكتيل الورد والليمون', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80', NULL, ARRAY['v', 'gf'], true, true, 2),
('sp-3', 'حلوم مقرمش بعسل العنبر', 'small-plates', 42000, 'جبن حلوم مشوي ومقرمش بلمسة عسل الجبال الجبلي، أوراق أوريغانو طازجة وفلفل أحمر مجفف.', 'جبن حلوم قبرصي، عسل جبال الجولان، أوريغانو طازج، رقائق فلفل أحمر.', 'مشروب الزعفران البارد', 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=700&q=80', 'الأكثر طلباً', ARRAY['v', 'chef'], true, false, 3),
('sp-4', 'أخطبوط مشوي بكريم البطاطا بالزعفران', 'small-plates', 65000, 'مجسات أخطبوط طرية ومشوية على الحطب تُقدم فوق بيوريه البطاطا المخملية المعطرة بالزعفران.', 'أخطبوط بحري، زعفران حر، بطاطا يوكون، زيت زيتون بكر، كبر، ليمون.', 'مشروب غروب العنبر', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=700&q=80', NULL, ARRAY['gf'], true, false, 4),
('sp-5', 'حمص ملكي بزيت الكمأة البرية', 'small-plates', 32000, 'حمص عضوي ناعم ومخفوق بعناية، مع قطرات زيت الكمأة البيضاء وشرائح الخبز الحجري الساخن.', 'حمص عضوي، زيت الكمأة البيضاء، طحينة، بابريكا مدخنة، خبز صاج ساخن.', 'مياه معدنية فوارة', 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=700&q=80', NULL, ARRAY['vg'], true, false, 5),

-- Mains
('m-1', 'موزة غنم مطهوة بالفرن الحجري', 'mains', 95000, 'موزة غنم بلدية مطهوة بطريقة الطهي البطئ لمدة 8 ساعات مع صوص دبس الرمان وأرز الزعفران.', 'لحم غنم بلدي، دبس رمان طبيعي، هيل، قرفة، أرز بسمتي بالزعفران.', 'مشروب غروب العنبر الخاص', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80', 'توصية الشيف', ARRAY['gf', 'chef'], true, true, 6),
('m-2', 'سمك سي باس بزبادي السماق المحمص', 'mains', 88000, 'فيليه سمك سي باس طازج مقرمش الجلد، يُقدم فوق ريزوتو الفريكة الخضراء وزبدة السماق البري.', 'سمك سي باس بحري، زبدة محروقة، سماق بري، فريكة خضراء، ليمون مشوي.', 'شاي الأعشاب والحمضيات', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=80', NULL, ARRAY['gf'], true, false, 7),
('m-3', 'ستيك زهرة (قرنابيط) مشوي بالحطب', 'mains', 55000, 'شريحة زهرة كاملة محمصة بالفرن الحجري تُقدم على كريم الفستق الحلبي والطحينة مع بصل مخلل.', 'قرنابيط كامل، كريم الفستق الحلبي والطحينة، بصل سماق مخلل، زيت بقدونس.', 'موكتيل الورد والليمون الفوار', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80', NULL, ARRAY['vg', 'gf'], true, false, 8),
('m-4', 'ريب آي ببهارات عنبر الخاصة (10 أونصة)', 'mains', 120000, 'شريحة ريب آي معتقة ومتبلة بخلطة الكزبرة والكمون والفلفل الأسود، تُقدم مع كراث مشوي.', 'لحم ريب آي أنغوس، بهارات عنبر الخاصة، كراث مشوي، زبدة الثوم والبهارات.', 'غروب العنبر', 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=700&q=80', NULL, ARRAY['gf'], true, false, 9),

-- Flatbreads
('fb-1', 'مناقيش الفطر البري وجبن الماعز', 'flatbreads', 45000, 'عجينة تخمير طبيعي مخبوزة على الحجر مع فطر الشانتريل المكون وموس جبن الماعز وزيت الترفل.', 'عجين مخمر، فطر بري، جبن ماعز معتق، زعتر طازج، عسل الترفل.', 'مشروب القهوة الباردة', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', NULL, ARRAY['v'], true, false, 10),
('fb-2', 'صفيحة لحم بالصنوبر ودبس الرمان', 'flatbreads', 48000, 'مناقيش لحم بلدي مفروم ومتبل بالبهارات الشرقية والصنوبر المحمص مع قطرات اللبنة والنعناع.', 'لحم غنم مفروم، صنوبر، بهارات مشكلة، لبنة بالنعناع، دبس رمان.', 'شراب الكركديه الفوار', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80', 'المفضلة في الدار', ARRAY['chef'], true, false, 11),
('fb-3', 'مناقيش زعتر بري وزيت زيتون معتق', 'flatbreads', 25000, 'مناقيش هشة ومقرمشة مع الزعتر البري الجبلي والسمسم الأبيض المحمص وزيت الزيتون البكر.', 'زعتر بري، سمسم محمص، زيت زيتون بكر ممتاز، ملح بحري.', 'شاي بالنعناع', 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=700&q=80', NULL, ARRAY['vg'], true, false, 12),

-- Sweets
('sw-1', 'كيكة الحليب بالهيل وماء الزهر', 'sweets', 30000, 'كيكة إسفنجية خفيفة مشربة بصلصة الحليب الثلاثية المعطرة بالهيل وماء الزهر مع فستق حلبي.', 'حليب عضوي، هيل أخضر، ماء زهر طبيعي، فستق حلبي، كيك إسفنجي.', 'إسبريسو بالهيل', 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=700&q=80', 'تجربة ممتازة', ARRAY['v', 'chef'], true, false, 13),
('sw-2', 'تارت التين المشوي وعسل العنبر', 'sweets', 32000, 'عجينة لوز هشة محشوة بكراميل الماسكاربوني مع تين طازج مشوي وعسل اللافندر.', 'تين طازج، جبن ماسكاربوني، عسل اللافندر، عجينة زبدة باللوز.', 'موكتيل الورد', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80', NULL, ARRAY['v'], true, false, 14),
('sw-3', 'غاناش الشوكولاتة الداكنة بزيت الزيتون', 'sweets', 35000, 'غاناش شوكولاتة داكنة 70% مخفوقة مع زيت زيتون ناعم ورقائق الملح البحري.', 'شوكولاتة داكنة 70%، زيت زيتون بكر، رقائق ملح البحر، حبيبات الكاكاو.', 'شاي أسود معطر بالبهارات', 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=700&q=80', NULL, ARRAY['v', 'gf'], true, false, 15),

-- Drinks
('dr-1', 'شراب غروب العنبر الخاص', 'drinks', 38000, 'مشروب مبتكر مستخلص من التمر المدخن، مرارات البرتقال، وإكليل الجبل المشتعل يُقدم فوق كرة ثلجية.', 'خلاصة تمر مدخن، مرارات البرتقال، روزماري مشوي، مياه فوارة.', 'مثالي مع الأطباق الرئيسية', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=700&q=80', 'مشروب عنبر', ARRAY['chef'], true, false, 16),
('dr-2', 'موكتيل الورد والليمون الفوار', 'drinks', 28000, 'ماء ورد جوري طبيعي، عصير الليتشي الطازج، شاي أبيض فوار مع بشر الليمون.', 'ماء ورد جوري، ليتشي طازج، شاي أبيض، مياه فوارة، نعناع.', 'يناسب المقبلات والشمندر', 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=700&q=80', NULL, ARRAY['vg', 'gf'], true, false, 17),
('dr-3', 'قهوة باردة بالزعفران للهيل', 'drinks', 22000, 'قهوة أرابيكا مقطرة ببطء ومنقوعة بخيوط الزعفران والهيل الأخضر مع رغوة حليب الشوفان.', 'قهوة أرابيكا، زعفران، هيل، حليب شوفان.', 'يناسب كيكة الحليب', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80', NULL, ARRAY['v', 'gf'], true, false, 18)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    category_slug = EXCLUDED.category_slug,
    price = EXCLUDED.price,
    description = EXCLUDED.description,
    ingredients = EXCLUDED.ingredients,
    pairing = EXCLUDED.pairing,
    image_url = EXCLUDED.image_url,
    badge = EXCLUDED.badge,
    tags = EXCLUDED.tags,
    is_available = EXCLUDED.is_available,
    is_featured = EXCLUDED.is_featured,
    sort_order = EXCLUDED.sort_order;
