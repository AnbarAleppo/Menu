-- ==============================================================================
-- ANBAR RESTAURANT - COMPLETE INITIAL SEED DATA
-- ==============================================================================
-- Generated from Restaurant Menu.md for Supabase SQL Editor

-- 1. SEED CATEGORIES
INSERT INTO public.categories (slug, name_ar, name_en, sort_order, is_active) VALUES
('all', 'جميع الأصناف', 'All Items', 0, true),
('hot-drinks', 'المشروبات الساخنة', 'Hot Drinks', 1, true),
('latte', 'لاتيه', 'Latte', 2, true),
('fresh-juices', 'عصاير فريش', 'Fresh Juices', 3, true),
('cold-mixes', 'خلطات باردة', 'Cold Mixes', 4, true),
('smoothies', 'سموزيات', 'Smoothies', 5, true),
('soft-drinks', 'المشروبات الغازية', 'Soft Drinks & Extras', 6, true),
('milkshake', 'ميلك شيك', 'Milkshake', 7, true),
('cocktails', 'كوكتيلات', 'Cocktails', 8, true),
('ice-cream', 'بوظة', 'Ice Cream', 9, true),
('crepe', 'كريب', 'Crepe', 10, true),
('special-sweets', 'سبيشال سويت', 'Special Sweets', 11, true),
('dessert-salads', 'السلطات - حلويات', 'Dessert Salads', 12, true),
('salads', 'السلطات', 'Salads', 13, true),
('sandwiches', 'صندويش', 'Sandwiches', 14, true),
('beef', 'عجل', 'Veal & Beef', 15, true),
('appetizers', 'المقبلات', 'Appetizers', 16, true),
('pasta', 'باستا', 'Pasta', 17, true),
('plomi', 'بلوميات', 'Plomi Dishes', 18, true),
('burgers', 'برغر', 'Burgers', 19, true),
('pizza', 'بيتزا', 'Pizza', 20, true),
('family-meals', 'وجبات عائلي', 'Family Meals', 21, true),
('main-meals', 'الوجبات الرئيسية', 'Main Meals', 22, true)
ON CONFLICT (slug) DO UPDATE SET
    name_ar = EXCLUDED.name_ar,
    name_en = EXCLUDED.name_en,
    sort_order = EXCLUDED.sort_order,
    is_active = EXCLUDED.is_active;

-- 2. SEED MENU ITEMS
INSERT INTO public.menu_items (id, title, category_slug, price, description, ingredients, pairing, image_url, badge, tags, is_available, is_featured, sort_order) VALUES

-- -----------------------------------------------------------------------------
-- ☕ 1. المشروبات الساخنة (Hot Drinks)
-- -----------------------------------------------------------------------------
('hd-1', 'هوت شوكليت', 'hot-drinks', 300, 'مشروب شوكولاتة ساخن غني ولذيذ محضر من الحليب مع بودرة الشوكولاتة والشوكولاتة السائلة الفاخرة.', 'شوكولاتة داكنة فاخرة، حليب طازج، فانيليا، كريمة مخفوقة.', 'كوكيز أو براونيز', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/hd-1.webp', NULL, ARRAY['v'], true, false, 1),
('hd-2', 'زهورات', 'hot-drinks', 150, 'مزيج عطري مهدئ من الزهورات والأعشاب الطبيعية الشامية.', 'بابونج، ورد جوري، زعتر بري، يانسون، مليسة.', 'عسل طبيعي', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/hd-2.webp', NULL, ARRAY['vg', 'gf'], true, false, 2),
('hd-3', 'شاي بأنواعه', 'hot-drinks', 150, 'شاي أسود وأخضر وأعشاب فاخر مخمر على الأصول.', 'أوراق شاي مختارة، نعناع طازج، هيل (حسب الرغبة).', 'بسكويت خفيف', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/hd-3.webp', NULL, ARRAY['vg', 'gf'], true, false, 3),
('hd-4', 'مكياتو', 'hot-drinks', 300, 'جرعة إسبريسو قوية مع لمسة ناعمة من رغوة الحليب المخملية.', 'بن أرابيكا محمص، رغوة حليب مبخر.', 'تيراميسو', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/hd-4.webp', NULL, ARRAY['v'], true, false, 4),
('hd-5', 'قهوة شرقية', 'hot-drinks', 150, 'قهوة عربية أصيلة معتقة ومحضرة مع الهيل الفاخر.', 'بن تركي/عربي محمص، هيل أخضر مطحون، ماء نقي.', 'تمر محشو', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/hd-5.webp', NULL, ARRAY['vg', 'gf'], true, false, 5),
('hd-6', 'إسبريسو', 'hot-drinks', 150, 'خلاصة قهوة مركزة بنكهة غنية وكريما ذهبية داكنة.', 'بن إسبريسو إيطالي 100% أرابيكا.', 'كوب ماء فوار', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/hd-6.webp', NULL, ARRAY['vg', 'gf'], true, false, 6),
('hd-7', 'إسبريسو سنيكرز', 'hot-drinks', 200, 'جرعة إسبريسو غنية ومميزة ممتزجة بقطع شوكولاتة سنيكرز وصوص الكراميل.', 'إسبريسو، صوص سنيكرز، فول سوداني، كراميل.', 'وافل', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/hd-7.webp', NULL, ARRAY['v'], true, false, 7),
('hd-8', 'إسبريسو كوفيانا', 'hot-drinks', 200, 'إسبريسو مركز بنكهة غنية تعلوه طبقة ناعمة ومخملية من الكريمة الطازجة.', 'إسبريسو محمص، خلطة كوفيانا الخاصة.', 'كيكة رول', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/hd-8.webp', NULL, ARRAY['v'], true, false, 8),
('hd-9', 'إسبريسو كوكيز', 'hot-drinks', 200, 'إسبريسو دافئ ممتزج بفتات ونكهة الكوكيز المقرمشة.', 'إسبريسو، نكهة كوكيز بالشوكولاتة، حليب خفيف.', 'كوكيز كلاسيك', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/hd-9.webp', NULL, ARRAY['v'], true, false, 9),
('hd-10', 'إسبريسو مكياتو', 'hot-drinks', 200, 'جرعة إسبريسو مركزة تعلوها لمسة ناعمة وخفيفة من فوم الحليب المخملي.', 'إسبريسو غامق، حليب مكثف ومبخر.', 'قطعة شوكولاتة', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/hd-10.webp', NULL, ARRAY['v'], true, false, 10),
('hd-11', 'نسكافيه بلاك', 'hot-drinks', 150, 'قهوة سريعة التحضير نقية ومركزة.', 'حبوب نسكافيه كلاسيك نقية.', 'شوكولاتة داكنة', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/hd-11.webp', NULL, ARRAY['vg', 'gf'], true, false, 11),
('hd-12', 'نسكافيه بلاك مع حليب', 'hot-drinks', 250, 'نسكافيه متوازن ممزوج بالحليب الطازج الساخن.', 'نسكافيه، حليب ساخن كامل الدسم.', 'كرواسون', 'https://tse4.mm.bing.net/th/id/OIP.gG7mb9eRmH3L0Ocis_xpDAHaGC?r=0&pid=Api', NULL, ARRAY['v'], true, false, 12),
('hd-13', '٣ ب ١', 'hot-drinks', 250, 'مزيج قهوة بالحليب مع السكر المتوازن.', 'قهوة سريعة، مبيض حليب، سكر نقي.', 'بسكويت', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/hd-13.webp', NULL, ARRAY['v'], true, false, 13),
('hd-14', '٢ ب ١', 'hot-drinks', 250, 'مزيج قهوة مع الحليب بدون سكر مضاف.', 'قهوة سريعة، مبيض حليب.', 'تمر', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/hd-14.webp', NULL, ARRAY['v'], true, false, 14),
('hd-15', 'ميلو', 'hot-drinks', 200, 'مشروب الشوكولاتة والشعير المغذي الساخن.', 'بودرة ميلو بالشوكولاتة والشعير، ماء ساخن.', 'توست محمص', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/hd-15.webp', NULL, ARRAY['v'], true, false, 15),
('hd-16', 'ميلو مع حليب', 'hot-drinks', 250, 'ميلو كريمي غني بالحليب الطازج الساخن.', 'ميلو، حليب طازج مغلي، رغوة شوكولاتة.', 'براونيز', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/hd-16.webp', NULL, ARRAY['v'], true, false, 16),

-- -----------------------------------------------------------------------------
-- ☕ 2. لاتيه (Latte)
-- -----------------------------------------------------------------------------
('lat-1', 'كابتشينو', 'latte', 250, 'مزيج إيطالي متوازن من الإسبريسو المركز والحليب المبخر مع طبقة غنية من فوم الحليب.', 'إسبريسو، حليب مبخر، رغوة حليب كثيفة، بودرة كاكاو.', 'كرواسون زبدة', 'https://img.freepik.com/premium-photo/magical-latte-art-cappuccino-coffee-foam-milk-cream-beverage-drink-design-beautiful-latte-art_162695-13882.jpg?w=2000', NULL, ARRAY['v'], true, false, 17),
('lat-2', 'موكاشينو', 'latte', 300, 'توليفة ساحرة من صوص الشوكولاتة الغنية والإسبريسو مع الحليب المبخر وفوم الحليب الناعم.', 'إسبريسو، صوص شوكولاتة بلجيكية، حليب مبخر، كريمة.', 'كيك الشوكولاتة', 'https://c8.alamy.com/comp/2G5TPWF/delicious-mochaccino-with-whipped-cream-and-chocolate-topping-2G5TPWF.jpg', NULL, ARRAY['v'], true, false, 18),
('lat-3', 'وايت لاتيه', 'latte', 300, 'لاتيه فاخر بنكهة الشوكولاتة البيضاء اللذيذة مع الإسبريسو والحليب وفوم الحليب.', 'إسبريسو، شوكولاتة بيضاء، حليب مبخر ناعم.', 'تارت فواكه', 'https://thumbs.dreamstime.com/b/warm-hug-cup-decadent-white-chocolate-latte-293216033.jpg', NULL, ARRAY['v'], true, false, 19),
('lat-4', 'بيستاشيو لاتيه', 'latte', 300, 'إسبريسو مميز ممتزج بصوص الفستق الحلبي الطبيعي والحليب الطازج مع فوم الحليب.', 'إسبريسو، معجون فستق حلبي، حليب مبخر، فستق مجروش.', 'كريب فستق', 'https://i.pinimg.com/originals/95/23/13/9523131df3fc2523ef4f7ec937d55727.jpg', NULL, ARRAY['v'], true, true, 20),
('lat-5', 'كراميل مكياتو', 'latte', 300, 'إسبريسو متوازن مع الحليب وفوم الحليب، مزين بخطوط غنية من صوص الكراميل اللذيذ.', 'إسبريسو، حليب مبخر، سيروب فانيليا، صوص كراميل.', 'وافل كراميل', 'https://static.vecteezy.com/system/resources/previews/078/101/089/non_2x/iced-caramel-macchiato-with-distinct-layers-of-espresso-milk-and-dark-caramel-sauce-drizzle-free-photo.jpeg', NULL, ARRAY['v'], true, false, 21),
('lat-6', 'سبانيش لاتيه', 'latte', 300, 'لاتيه إسباني مميز بحلاوة الحليب المكثف مع الإسبريسو والحليب وفوم الحليب المخملي.', 'إسبريسو مضاعف، حليب مكثف محلى، حليب طازج مبخر.', 'تشيز كيك', 'https://coffee-slang.com/wp-content/uploads/2026/01/spanish-latte-wit-condensed-milk-recipe.jpg', NULL, ARRAY['v'], true, true, 22),

-- -----------------------------------------------------------------------------
-- 🍊 3. عصاير فريش (Fresh Juices)
-- -----------------------------------------------------------------------------
('fj-1', 'عصير برتقال فريش', 'fresh-juices', 300, 'عصير برتقال طبيعي 100% معصور طازجاً عند الطلب.', 'برتقال بلدي طازج معصور.', 'سلطة فواكه', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/fj-1.webp', NULL, ARRAY['vg', 'gf'], true, false, 23),
('fj-2', 'عصير كيوي فريش', 'fresh-juices', 300, 'عصير كيوي منعش غني بفيتامين C والنكهة الاستوائية.', 'كيوي طازج، ثلج مجروش، عسل خفيف.', 'مقبلات باردة', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/fj-2.webp', NULL, ARRAY['vg', 'gf'], true, false, 24),
('fj-3', 'عصير فريز فريش', 'fresh-juices', 300, 'عصير فراولة طبيعية طازجة وباردة.', 'فراولة طازجة، ثلج، لمسة ليمون.', 'كريب شوكولاتة', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/fj-3.webp', NULL, ARRAY['vg', 'gf'], true, false, 25),
('fj-4', 'عصير رمان فريش', 'fresh-juices', 300, 'عصير رمان طبيعي بلدي غني ومضاد للأكسدة.', 'حبات رمان طبيعية 100%.', 'مشاوي وسندويش', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/fj-4.webp', NULL, ARRAY['vg', 'gf'], true, false, 26),
('fj-5', 'عصير أناناس فريش', 'fresh-juices', 300, 'عصير أناناس استوائي بارد ومنعش.', 'أناناس طازج، ثلج.', 'برغر أو زنجر', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/fj-5.webp', NULL, ARRAY['vg', 'gf'], true, false, 27),
('fj-6', 'عصير تفاح فريش', 'fresh-juices', 300, 'عصير تفاح طبيعي معصور طازجاً وبارداً.', 'تفاح أحمر وأخضر طازج.', 'سلطة سيزر', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/fj-6.webp', NULL, ARRAY['vg', 'gf'], true, false, 28),
('fj-7', 'عصير مانغو فريش', 'fresh-juices', 300, 'عصير مانجو استوائي كثيف وطبيعي بمذاق حلو فاخر.', 'مانجو طبيعي طازج، ثلج مجروش.', 'كريب نوتيلا', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/fj-7.webp', NULL, ARRAY['vg', 'gf'], true, true, 29),

-- -----------------------------------------------------------------------------
-- ❄️ 4. خلطات باردة (Cold Mixes)
-- -----------------------------------------------------------------------------
('cm-1', 'فرابيه ليمون', 'cold-mixes', 400, 'فرابيه الليمون المنعش المخفوق بالثلج والنعناع الأخضر.', 'ليمون طازج، نعناع، ثلج مجروش، سيروب محلى.', 'وجبات الدجاج والباستا', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/cm-1.webp', NULL, ARRAY['vg', 'gf'], true, false, 30),
('cm-2', 'غولدن كافيه', 'cold-mixes', 300, 'خلطة القهوة الذهبية الباردة مع رغوة غنية ولمسات خاصة.', 'إسبريسو بارد، حليب، خلطة غولدن الخاصة.', 'كيكة التيراميسو', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/cm-2.webp', NULL, ARRAY['v'], true, false, 31),
('cm-3', 'آيس تي فريش', 'cold-mixes', 350, 'شاي مثلج ومنعش محضر مع سيروب الدراق اللذيذ وشرائح الليمون ومكعبات الثلج.', 'شاي مخمر مبرد، خوخ، ليمون، نعناع، ثلج.', 'صندويشات ومقبلات', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/cm-3.webp', NULL, ARRAY['vg', 'gf'], true, false, 32),
('cm-4', 'آيس كافيه', 'cold-mixes', 350, 'قهوة مثلجة منعشة محضرة من خلطة 3 بـ 1 مع الحليب البارد والشوكولاتة ومكعبات الثلج.', 'إسبريسو مزدوج، حليب مثلج، مكعبات ثلج.', 'كوكيز أو دونات', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/cm-4.webp', NULL, ARRAY['v'], true, false, 33),
('cm-5', 'موهيتو', 'cold-mixes', 350, 'موهيتو منعش بسيروب الموهيتو وسيروب منكه مع شرائح الليمون وأوراق النعناع الطازجة والمياه الغازية والثلج.', 'مياه فوارة، ليمون أخضر، أوراق نعناع، سكر قصب، ثلج.', 'بيتزا وبرغر', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/cm-5.webp', NULL, ARRAY['vg', 'gf'], true, true, 34),
('cm-6', 'غرين بلو', 'cold-mixes', 350, 'مشروب المحيط الأزرق مع لمسات الحمضيات والنعناع الأخضر.', 'بلو كوراساو، صودا ليمون، نعناع، ثلج مجروش.', 'مقبلات وسناكات', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/cm-6.webp', NULL, ARRAY['vg', 'gf'], true, false, 35),

-- -----------------------------------------------------------------------------
-- 🍓 5. سموزيات (Smoothies)
-- -----------------------------------------------------------------------------
('sm-1', 'سموذي تفاح', 'smoothies', 300, 'سموذي تفاح منعش مخفوق بالثلج والعسل الطبيعي.', 'تفاح طازج، ثلج مجروش، عسل.', 'سناك صحي', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/sm-1.webp', NULL, ARRAY['vg', 'gf'], true, false, 36),
('sm-2', 'سموذي كرز', 'smoothies', 300, 'سموذي كرز طبيعي بنكهة غنية منعشة وحموضة لطيفة.', 'كرز طازج، ثلج، ماء زهر خفيف.', 'تشيز كيك', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/sm-2.webp', NULL, ARRAY['vg', 'gf'], true, false, 37),
('sm-3', 'سموذي برتقال', 'smoothies', 300, 'سموذي برتقال بارد ومخفوق بالثلج.', 'برتقال، ثلج مجروش، لمسة فانيليا.', 'كرواسون', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/sm-3.webp', NULL, ARRAY['vg', 'gf'], true, false, 38),
('sm-4', 'سموذي أناناس', 'smoothies', 300, 'سموذي أناناس استوائي بارد ومخملي.', 'أناناس، ثلج، حليب جوز هند خفيف.', 'سلطات', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/sm-4.webp', NULL, ARRAY['vg', 'gf'], true, false, 39),
('sm-5', 'سموذي مانغو', 'smoothies', 300, 'سموذي مانجو غني وكثيف مع الثلج المجروش.', 'مانجو استوائي، ثلج، عسل.', 'كريب وسويت', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/sm-5.webp', NULL, ARRAY['vg', 'gf'], true, false, 40),
('sm-6', 'سموذي فريز', 'smoothies', 300, 'سموذي فراولة طازجة مخفوقة بطعم غني ومحبوب.', 'فراولة طازجة، ثلج، لمسة عسل.', 'وافل', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/sm-6.webp', NULL, ARRAY['vg', 'gf'], true, false, 41),

-- -----------------------------------------------------------------------------
-- 🥤 6. المشروبات الغازية والإضافات (Soft Drinks & Extras)
-- -----------------------------------------------------------------------------
('sd-1', 'بيبسي تنك', 'soft-drinks', 150, 'مشروب بيبسي غازي منعش في عبوة معدنية باردة.', 'بيبسي كولا، غازات منعشة.', 'البرغر والبيتزا', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/sd-1.webp', NULL, ARRAY['vg', 'gf'], true, false, 42),
('sd-2', 'بيبسي رياضي', 'soft-drinks', 100, 'مشروب غازي منعش بحجم رياضي عملي.', 'بيبسي رياضي.', 'وجبات خفيفة', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/sd-2.webp', NULL, ARRAY['vg', 'gf'], true, false, 43),
('sd-3', 'بيبسي لتر', 'soft-drinks', 200, 'عبوة بيبسي بحجم 1 لتر تكفي للمشاركة.', 'بيبسي كولا 1 لتر.', 'الوجبات العائلية والبيتزا', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/sd-3.webp', NULL, ARRAY['vg', 'gf'], true, false, 44),
('sd-4', 'بيبسي عائلي', 'soft-drinks', 350, 'عبوة بيبسي عائلية كبيرة للمناسبات والجمعات.', 'بيبسي كولا حجم عائلي كبير.', 'الأطباق العائلية والوجبات', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/sd-4.webp', NULL, ARRAY['vg', 'gf'], true, false, 45),
('sd-5', 'عيران', 'soft-drinks', 70, 'لبن عيران بلدي طازج مملح ومخفوق بالنعناع.', 'لبن زبادي بلدي، ماء نقي، ملح، نعناع.', 'المشاوي والسندويش', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/sd-5.webp', NULL, ARRAY['v', 'gf'], true, false, 46),
('sd-6', 'مياه كبيرة', 'soft-drinks', 125, 'عبوة مياه معدنية طبيعية نقية بحجم كبير (1.5 لتر).', 'مياه معدنية طبيعية.', 'جميع الوجبات', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/sd-6.webp', NULL, ARRAY['vg', 'gf'], true, false, 47),
('sd-7', 'مياه صغيرة', 'soft-drinks', 50, 'عبوة مياه معدنية نقية صغيرة شخصية.', 'مياه معدنية طبيعية.', 'جميع الوجبات', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/sd-7.webp', NULL, ARRAY['vg', 'gf'], true, false, 48),
('sd-8', 'أركيلة عنبر', 'soft-drinks', 240, 'أركيلة فاخرة بنكهات معسل مميزة وفحم طبيعي مشتعل.', 'معسل فاخر (تفاحتين، عنب ونعناع، خلطة عنبر)، فحم طبيعي.', 'شاي ساخن أو موهيتو', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/sd-8.webp', NULL, ARRAY['v'], true, false, 49),

-- -----------------------------------------------------------------------------
-- 🍧 7. ميلك شيك (Milkshake)
-- -----------------------------------------------------------------------------
('ms-1', 'ميلك شيك بيستاشيو', 'milkshake', 350, 'ميلك شيك كريمي غني بالفستق الحلبي الطبيعي والآيس كريم.', 'آيس كريم فستق، حليب مثلج، معجون فستق، كريمة مخفوقة.', 'كريب فستق', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/ms-1.webp', NULL, ARRAY['v'], true, false, 50),
('ms-2', 'ميلك شيك أوريو', 'milkshake', 350, 'ميلك شيك شوكولاتة وفانيليا مع بسكويت أوريو المطحون.', 'بسكويت أوريو، آيس كريم فانيليا، حليب، صوص شوكولاتة.', 'براونيز', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/ms-2.webp', NULL, ARRAY['v'], true, true, 51),
('ms-3', 'ميلك شيك شوكولا', 'milkshake', 350, 'ميلك شيك شوكولاتة بلجيكية غنية مع الكريمة المخفوقة.', 'آيس كريم شوكولاتة، حليب، صوص كاكاو.', 'فوندون', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/ms-3.webp', NULL, ARRAY['v'], true, false, 52),
('ms-4', 'ميلك شيك فريز', 'milkshake', 350, 'ميلك شيك فراولة طبيعية ناعمة مع صوص الفريز.', 'آيس كريم فراولة، حليب، فراولة طازجة، كريمة.', 'وافل فواكه', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/ms-4.webp', NULL, ARRAY['v'], true, false, 53),
('ms-5', 'ميلك شيك فانيلا', 'milkshake', 350, 'ميلك شيك فانيليا مدغشقر الكلاسيكي الناعم.', 'آيس كريم فانيليا، حليب كامل الدسم، كريمة مخفوقة.', 'كوكيز', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/ms-5.webp', NULL, ARRAY['v'], true, false, 54),
('ms-6', 'ميلك شيك تشيز كيك', 'milkshake', 350, 'مزيج فاخر من نكهة التشيز كيك الغنية مع الحليب والبسكويت.', 'جبن كريمي، بسكويت دايجستف، آيس كريم، صوص توت.', 'تيراميسو', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/ms-6.webp', NULL, ARRAY['v'], true, false, 55),
('ms-7', 'ميلك شيك كوكيز', 'milkshake', 350, 'ميلك شيك شهي بقطع وحبيبات الكوكيز اللذيذة.', 'كوكيز شوكولاتة، آيس كريم، حليب، صوص كراميل.', 'وافل شوكولا', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/ms-7.webp', NULL, ARRAY['v'], true, false, 56),
('ms-8', 'ميلك شيك لوتس', 'milkshake', 350, 'ميلك شيك غني بزبدة وبسكويت اللوتس المقرمش.', 'بسكويت لوتس، زبدة لوتس، آيس كريم فانيليا، حليب.', 'كريب لوتس', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/ms-8.webp', NULL, ARRAY['v'], true, false, 57),

-- -----------------------------------------------------------------------------
-- 🍸 8. كوكتيلات (Cocktails)
-- -----------------------------------------------------------------------------
('ck-1', 'كوكتيل عنبر الخاص', 'cocktails', 400, 'كوكتيل الدار الفاخر من الحليب والموز والتفاح مع صوص الفستق الحلبي، تعلوه الكريمة وحبات الفستق الحلبي.', 'قطع فواكه موسمية، عصير مانجو وفريز، قشطة، عسل، مكسرات.', 'كريب عنبر', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/ck-1.webp', NULL, ARRAY['v'], true, true, 58),
('ck-2', 'كوكتيل نوتيلا', 'cocktails', 400, 'كوكتيل غني من الحليب والموز والتفاح مع شوكولاتة نوتيلا اللذيذة والكريمة والزينة الخاصة.', 'نوتيلا أصلية، حليب مثلج، آيس كريم شوكولاتة، بندق.', 'وافل', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/ck-2.webp', NULL, ARRAY['v'], true, false, 59),
('ck-3', 'كوكتيل حليب', 'cocktails', 400, 'كوكتيل حليب كلاسيكي مخفوق مع الموز والتفاح والسكر، تعلوه الكريمة المخفوقة والزينة.', 'حليب طازج، موز، عسل جبلي، مكسرات مشكلة.', 'سلطة فواكه', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/ck-3.webp', NULL, ARRAY['v', 'gf'], true, false, 60),
('ck-4', 'كوكتيل فواكه', 'cocktails', 400, 'مزيج فاخر من قطع الموز والتفاح والدراق والفريز والأناناس والمانجو مع السكر والكريمة والزينة.', 'طبقات مانجو، فريز، أفوكادو أو كيوي، قطع فواكه طازجة.', 'كيك كلاس', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/ck-4.webp', NULL, ARRAY['v', 'gf'], true, false, 61),
('ck-5', 'كوكتيل فرولاتنو', 'cocktails', 400, 'كوكتيل فراولة مميز من الحليب، الموز، التفاح، والفريز الطازج مع السكر والكريمة والزينة.', 'فراولة، توت بري، رغوة حليب مثلجة، سيروب مميز.', 'تارت فواكه', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/ck-5.webp', NULL, ARRAY['v'], true, false, 62),

-- -----------------------------------------------------------------------------
-- 🍨 9. بوظة (Ice Cream)
-- -----------------------------------------------------------------------------
('ic-1', 'شوكولا مع عنبر', 'ice-cream', 400, 'آيس كريم شوكولاتة داكنة مع صوص ومكسرات عنبر الخاصة.', 'آيس كريم شوكولاتة، صوص عنبر، فستق، مكسرات محمصة.', 'براونيز', 'https://thumbs.dreamstime.com/b/decadent-chocolate-ice-cream-sundae-topped-nuts-rich-syrup-clear-glass-bowl-delightful-features-scoops-creamy-357955947.jpg', NULL, ARRAY['v'], true, false, 63),
('ic-2', 'بوظة كيندر', 'ice-cream', 350, 'آيس كريم ناعم بنكهة شوكولاتة وحليب كيندر الغنية.', 'آيس كريم كيندر، صوص شوكولاتة بيضاء وبنية، أصابع كيندر.', 'كريب كيندر', 'https://i5.walmartimages.com/seo/Kinder-Bueno-Frozen-Dessert-14-fl-oz_2dd03ea9-797e-459c-ae10-c14d8d90c2ec.5c1da3fba017da5504dfcdc0f9568a09.jpeg', NULL, ARRAY['v'], true, false, 64),
('ic-3', 'بوظة سنيكرز', 'ice-cream', 350, 'آيس كريم كراميل وفول سوداني وشوكولاتة سنيكرز.', 'آيس كريم سنيكرز، كراميل، فول سوداني، شوكولاتة.', 'وافل', 'https://www.snickers.com/sites/g/files/fnmzdf616/files/migrate-product-files/8895adb8065d63673241d1a9f9a558b8595826de.png', NULL, ARRAY['v'], true, false, 65),
('ic-4', 'بوظة عنبر', 'ice-cream', 350, 'بوظة عربية بالقشطة والمستكة والفستق الحلبي على الأصول.', 'حليب طازج، مستكة أصلية، سحلب، قشطة، فستق حلبي مدقوق.', 'قهوة شرقية', 'https://f.nooncdn.com/p/pzsku/Z04FF4DD9605D90A227BFZ/45/_/1771520268/2e801281-7884-4907-a069-235d31a59550.jpg?width=720', NULL, ARRAY['v'], true, true, 66),
('ic-5', 'بوظة مشكلة', 'ice-cream', 350, 'تشكيلة كرات آيس كريم متنوعة من الفواكه والشوكولاتة والفانيليا.', 'كرات بوظة: فريز، مانجو، شوكولاتة، فانيليا، مكسرات.', 'سلطة فواكه', 'https://static.vecteezy.com/system/resources/previews/053/867/178/non_2x/colorful-bowl-of-assorted-ice-cream-scoops-photo.jpg', NULL, ARRAY['v'], true, false, 67),
('ic-6', 'بوظة حسب الطلب', 'ice-cream', 350, 'اختر نكهاتك المفضلة والإضافات من تشكيلة بوظة عنبر.', 'نكهات حسب اختيار الزبون مع الصوصات والمكسرات.', 'أي مشروب ساخن', 'https://img.freepik.com/premium-photo/waffle-bowl-with-artfully-scooped-ice-cream_1176913-37674.jpg', NULL, ARRAY['v'], true, false, 68),

-- -----------------------------------------------------------------------------
-- 🥞 10. كريب (Crepe)
-- -----------------------------------------------------------------------------
('cr-1', 'كريب فواكه', 'crepe', 350, 'عجينة كريب رقيقة محشوة بالفواكه الطازجة ومغطاة بالشوكولاتة وصوص الفريز، تُقدم مع البوظة والكريمة.', 'كريب طازج، موز، فراولة، كيوي، صوص شوكولاتة بيضاء.', 'عصير برتقال فريش', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/cr-1.webp', NULL, ARRAY['v'], true, false, 69),
('cr-2', 'كريب كيت كات', 'crepe', 350, 'عجينة كريب محشوة بأصابع كيت كات ومزينة بالشوكولاتة وصوص الكراميل، تُقدم مع بوظة الفانيليا والكريمة.', 'كريب، أصابع كيت كات، شوكولاتة بالحليب، مكسرات.', 'كابتشينو', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/cr-2.webp', NULL, ARRAY['v'], true, false, 70),
('cr-3', 'كريب فستق', 'crepe', 350, 'كريب غني بصوص الفستق والشوكولاتة مع رشة فستق حلبي، يُقدم مع بوظة فستق وكريمة مخفوقة.', 'كريب، زبدة فستق حلبي، فستق محمص، شوكولاتة بيضاء.', 'سبانيش لاتيه', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/cr-3.webp', NULL, ARRAY['v'], true, true, 71),
('cr-4', 'كريب عنبر', 'crepe', 350, 'كريب مميز بصوص الفستق وزبدة اللوتس والفستق الحلبي، يُقدم مع بوظة اللوتس والكريمة الشهية.', 'كريب، شوكولاتة نوتيلا، شوكولاتة بيضاء، كيندر، مكسرات، قشطة.', 'قهوة تركية', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/cr-4.webp', NULL, ARRAY['v'], true, true, 72),
('cr-5', 'كريب كيندر', 'crepe', 350, 'كريب محشو بقطع شوكولاتة كيندر ومغطى بالشوكولاتة والشوكولاتة البيضاء، يُقدم مع بوظة كيندر والكريمة.', 'كريب، شوكولاتة كيندر، صوص بوينو بالحليب.', 'آيس كافيه', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/cr-5.webp', NULL, ARRAY['v'], true, false, 73),
('cr-6', 'كريب نوتيلا', 'crepe', 350, 'كريب رقيق غارق بشوكولاتة نوتيلا الأصلية، يُقدم مع بوظة الشوكولاتة والكريمة المخفوقة.', 'كريب رقيق، نوتيلا أصلية، مكسرات بندق.', 'إسبريسو', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/cr-6.webp', NULL, ARRAY['v'], true, false, 74),
('cr-7', 'كريب سنيكرز', 'crepe', 350, 'كريب محشو بقطع سنيكرز ومغطى بالشوكولاتة والكراميل، يُقدم مع بوظة الفانيليا والكريمة.', 'كريب، سنيكرز، كراميل، فول سوداني مقرمش.', 'مكياتو', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/cr-7.webp', NULL, ARRAY['v'], true, false, 75),

-- -----------------------------------------------------------------------------
-- 🍰 11. سبيشال سويت (Special Sweets)
-- -----------------------------------------------------------------------------
('ss-1', 'تيراميسو', 'special-sweets', 400, 'طبقات من البسكويت المشرب بالنسكافيه الغني مع الكريمة والفستق الحلبي والزينة الخاصة.', 'بسكويت ليدي فينجر، إسبريسو، جبن ماسكاربوني، بودرة كاكاو.', 'إسبريسو سنغل', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/ss-1.webp', NULL, ARRAY['v'], true, true, 76),
('ss-2', 'براونيز', 'special-sweets', 400, 'قطعة براونيز شوكولاتة غنية تُقدم مع صوص الشوكولاتة، بوظة فانيليا، كريمة وزينة شهية.', 'شوكولاتة داكنة، زبدة، مكسرات جوز، آيس كريم فانيليا.', 'كابتشينو', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/ss-2.webp', NULL, ARRAY['v'], true, false, 77),
('ss-3', 'بنانا سويت', 'special-sweets', 400, 'حبات الموز الطازجة مع تشكيلة بوظة مشكلة، مزينة بالكريمة المخفوقة والزينة.', 'موز طازج، صوص كراميل دافئ، شوكولاتة، بوظة.', 'وايت لاتيه', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/ss-3.webp', NULL, ARRAY['v'], true, false, 78),
('ss-4', 'فوندون الشوكولاتة', 'special-sweets', 400, 'قطعة فوندون شوكولاتة ساخنة تذوب في الفم، تُقدم مع الشوكولاتة، بوظة فانيليا، كريمة وزينة.', 'كيك شوكولاتة، لافا سائلة، سكر بودرة، آيس كريم.', 'قهوة سادة', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/ss-4.webp', NULL, ARRAY['v'], true, true, 79),
('ss-5', 'كأتو كلاس', 'special-sweets', 400, 'كيك فاخر محشو بالبوظة المشكلة، مغطى بصوص الشوكولاتة والكريمة والزينة المميزة.', 'كيك إسفنجي، كريمة شانتيه، جناش شوكولاتة.', 'شاي إنجليزي', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/ss-5.webp', NULL, ARRAY['v'], true, false, 80),
('ss-6', 'وافل بلجيكي', 'special-sweets', 400, 'قطعة وافل مقرمشة ولذيذة مغطاة بالشوكولاتة، تُقدم مع البوظة والكريمة والزينة.', 'عجين وافل ذهبي، نوتيلا، شوكولاتة بيضاء، فراولة، موز.', 'ميلك شيك', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/ss-6.webp', NULL, ARRAY['v'], true, false, 81),
('ss-7', 'رول كيك', 'special-sweets', 400, 'كيك سويس رول طري محشو بالكريمة المخملية وصوص التوت.', 'كيك رول إسفنجي، كريمة خفيفة، صوص توت وشوكولاتة.', 'لاتيه كراميل', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/ss-7.webp', NULL, ARRAY['v'], true, false, 82),
('ss-8', 'بيرمادا كيك', 'special-sweets', 600, 'كيكة بيرمودا الهرمية الخاصة بحجم كبير وغنية بالطبقات والمكسرات.', 'طبقات كيك هرمي، موس شوكولاتة، كراميل، مكسرات فاخرة.', 'موكاشينو', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/ss-8.webp', NULL, ARRAY['v'], true, true, 83),

-- -----------------------------------------------------------------------------
-- 🥗 12. السلطات - حلويات (Dessert Salads)
-- -----------------------------------------------------------------------------
('ds-1', 'سلطة فستق', 'dessert-salads', 450, 'تشكيلة فواكه مع صوص الفستق الحلبي، شوكولاتة، كورن فليكس، بوظة فستق، كريمة، فستق حلبي وزينة.', 'قطع فواكه، قشطة بلدية، صوص فستق، فستق حلبي مجروش.', 'موهيتو', 'https://i.pinimg.com/originals/f7/c4/a3/f7c4a38239480bce4055b5fe439c4c09.jpg', NULL, ARRAY['v'], true, false, 84),
('ds-2', 'سلطة كيت كات', 'dessert-salads', 450, 'فواكه طازجة مع الشوكولاتة والكورن فليكس وقطع كيت كات، مع بوظة فانيليا وشوكولاتة وكريمة وزينة.', 'فواكه مشكلة، كيت كات، صوص شوكولاتة، كريمة.', 'فرابيه ليمون', 'https://i.pinimg.com/736x/5b/bb/d0/5bbbd0c3508092945eeb0aa38a2e1c9c.jpg', NULL, ARRAY['v'], true, false, 85),
('ds-3', 'سلطة سنيكرز', 'dessert-salads', 450, 'فواكه مشكلة مع كورن فليكس، شوكولاتة، صوص كراميل، قطع سنيكرز، بوظة فانيليا، كريمة وزينة.', 'فواكه، سنيكرز، كراميل، صوص شوكولاتة، مكسرات.', 'آيس كافيه', 'https://crayonsandcravings.com/wp-content/uploads/2019/09/Snickers-Apple-Salad.jpg', NULL, ARRAY['v'], true, false, 86),
('ds-4', 'سلطة تويكس', 'dessert-salads', 450, 'فواكه طازجة مع كورن فليكس، شوكولاتة، صوص كراميل، قطع تويكس، بوظة فانيليا وشوكولاتة وكريمة وزينة.', 'فواكه مشكلة، أصابع تويكس، صوص كراميل، شوكولاتة.', 'مكياتو', 'https://www.taketwotapas.com/wp-content/uploads/2017/08/Chocolate-Fudge-Caramel-Twix-Dip-2-9.jpg', NULL, ARRAY['v'], true, false, 87),
('ds-5', 'سلطة عنبر سويت', 'dessert-salads', 450, 'سلطة عنبر الفاخرة من الفواكه مع صوص الفستق وكريمة اللوتس وكورن فليكس، مع بوظة لوتس وفستق وكريمة وفستق حلبي.', 'فواكه طازجة، قشطة عربية، عسل جبلي، مكسرات فاخرة، شوكولاتة.', 'كوكتيل عنبر', 'https://img.ananinja.com/media/ninja-catalog-42/restaurants/4e6rj2i9zisix5aybnx5cqpxrtob/-.png?w=1080&q=75', NULL, ARRAY['v'], true, true, 88),
('ds-6', 'سلطة فواكه', 'dessert-salads', 450, 'سلطة فواكه طازجة مع الشوكولاتة وصوص الفريز، تُقدم مع بوظة فريز وكيوي، كريمة وزينة.', 'تفاح، موز، فراولة، كيوي، أناناس، عصير مانجو.', 'عصير برتقال', 'https://www.cookingclassy.com/wp-content/uploads/2019/05/fruit-salad-4.jpg', NULL, ARRAY['vg', 'gf'], true, false, 89),
('ds-7', 'سلطة كيندر', 'dessert-salads', 450, 'فواكه مشكلة مع شوكولاتة داكنة وبيضاء وكورن فليكس وقطع كيندر، مع بوظة كيندر وكريمة وزينة.', 'فواكه، شوكولاتة كيندر، بوينو، صوص شوكولاتة بيضاء.', 'كابتشينو', 'https://i.pinimg.com/originals/ae/93/bb/ae93bba0caf86bac9457f0b0c3688e4b.jpg', NULL, ARRAY['v'], true, false, 90),

-- -----------------------------------------------------------------------------
-- 🥗 13. السلطات (Salads)
-- -----------------------------------------------------------------------------
('sal-1', 'جينرال سلاد', 'salads', 800, 'قطع ناغيت دجاج مقرمشة مع الخس الطازج والذرة، متبلة بالمايونيز ولمسة العسل اللذيذة.', 'خس روماني، دجاج متبل، طماطم كرزية، ذرة، جبن شيدر، دريسينغ جنرال.', 'موهيتو بارد', 'https://healthyfitnessmeals.com/wp-content/uploads/2018/09/Grilled-chicken-Cobb-salad.jpg', NULL, ARRAY['gf'], true, true, 91),
('sal-2', 'سيزر دجاج', 'salads', 750, 'شرائح صدر دجاج مشوي مع خس طازج وتوست مقرمش وجبنة قشقوان، مع صوص المايونيز الشهي.', 'خس مقرمش، صدر دجاج مشوي، خبز كروتون، جبن بارميزان، صوص سيزر أصلي.', 'آيس تي خوخ', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=700&q=80', 'الأكثر مبيعاً', NULL, true, true, 92),
('sal-3', 'بوب كورن سلاد', 'salads', 750, 'كرات بوب كورن الدجاج المقرمشة تُقدم مع أوراق الخس الطازجة وصوص المايونيز.', 'خضار مشكلة، قطع بوب كورن دجاج مقرمشة، ذرة حلوة، صوص رانش.', 'بيبسي تنك', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 93),
('sal-4', 'سيزر لحومات', 'salads', 800, 'مزيج شهي من الدجاج المشوي والبيبيروني واللحم المدخن، مع خس طازج وتوست مقرمش وجبنة قشقوان ومايونيز.', 'خس، شرائح لحم بيف مدخن، بيبروني، جبن بارميزان، صوص سيزر.', 'مياه فوارة', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 94),
('sal-5', 'فتوش', 'salads', 600, 'سلطة فتوش طازجة تضم الخس والخيار والبندورة والزيتون المقطع مع الخبز المقرمش والجبنة.', 'خيار، طماطم، خس، فجل، بقلة، نعناع، خبز مقرمش، دبس رمان، سماق.', 'عيران بلدي', 'https://www.cindyrecipes.com/wp-content/uploads/2025/11/LEBANESE-FATTOUSH-SALAD1-819x1024.png', NULL, ARRAY['vg'], true, false, 95),
('sal-6', 'يونانية', 'salads', 600, 'تشكيلة منعشة من الخس والخيار والبندورة والبندورة الكرزية والزيتون المقطع، تعلوها مكعبات جبنة الفيتا.', 'خيار، طماطم، فلفل رومي، بصل أحمر، جبن فيتا، زيتون كالاماتا، زيت زيتون.', 'عصير ليمون ونعناع', 'https://as1.ftcdn.net/jpg/14/38/47/18/1000_F_1438471845_ESOgodGNBKTgCS26hlsvssiIlKNVppaZ.jpg', NULL, ARRAY['v', 'gf'], true, false, 96),
('sal-7', 'سلطة مواسم', 'salads', 500, 'سلطة خضار موسمية طازجة من الخس المقرمش والخيار والبندورة وشرائح الفليفلة.', 'خضار موسمية مشكلة، طماطم، خيار، خس، جزر، زيت وليمون.', 'مياه معدنية', 'https://cakesandcoriander.com/wp-content/uploads/2022/06/Herb-Garden-Vietnameses-Salad-9.jpg', NULL, ARRAY['vg', 'gf'], true, false, 97),
('sal-8', 'سلطة معكرونة', 'salads', 750, 'معكرونة بيني مع شرائح صدر الدجاج والذرة وصوص المايونيز الكريمي.', 'مكرونة فوسيلي، خضار مشكلة، ذرة، زيتون أسود، مايونيز وأعشاب.', 'آيس تي', 'https://tse2.mm.bing.net/th/id/OIP.KCqu6hVs1SoPxdHM2nou5QHaLG?r=0&pid=Api', NULL, ARRAY['v'], true, false, 98),

-- -----------------------------------------------------------------------------
-- 🥪 14. صندويش (Sandwiches)
-- -----------------------------------------------------------------------------
('sw-1', 'صندويش سبايسي', 'sandwiches', 650, '3 قطع صدر دجاج متبلة مع سلطة روسية شهية، يرافقها بطاطا مقلية وكريم ثوم ومخلل.', 'دجاج حار متبل، مايونيز حار، جبن شيدر، خس، خبز صامولي طازج.', 'بيبسي مثلج', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80', 'حار', NULL, true, false, 99),
('sw-2', 'صندويش ناغيت', 'sandwiches', 650, 'ساندويش بـ 4 قطع ناغيت دجاج مقرمشة مع سلطة روسية، يرافقه بطاطا وكريم ثوم ومخلل.', 'ناغيت دجاج مقلي، بطاطا مقلية، مايونيز، مخلل، خبز صامولي.', 'عصير برتقال', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 100),
('sw-3', 'صندويش زنجر', 'sandwiches', 700, '3 قطع دجاج زنجر مقرمشة مع سلطة روسية، جبنة قشقوان، راحة بطاطا، كريم ثوم ومخلل.', 'دجاج زنجر كريسبي حار، جبن، خس مقرمش، صوص رانش حار.', 'موهيتو', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80', 'الأكثر طلباً', NULL, true, true, 101),
('sw-4', 'صندويش كريسبي', 'sandwiches', 650, '3 قطع دجاج كريسبي مقلية ذهبية مع سلطة روسية، يرافقها بطاطا مقلية وكريم ثوم ومخلل.', 'ستربس دجاج كريسبي، مايونيز ثوم، خس، مخلل خيار.', 'بيبسي', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 102),
('sw-5', 'صندويش غواصة', 'sandwiches', 700, 'ساندويش بقطع شيش مشوي مع الفطر وجبنة القشقوان، يُقدم مع بطاطا وكريم ثوم ومخلل.', 'دجاج متبل، سلامي، فطر، ذرة، جبن موزاريلا، مايونيز.', 'مشروب غازي', 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=700&q=80', 'كبير ومميز', NULL, true, false, 103),
('sw-6', 'صندويش فاهيتا', 'sandwiches', 700, 'شرائح صدر دجاج مع فليفلة حمراء وخضراء وذرة وبصل، مصحوبة بالبطاطا وكريم الثوم والمخلل.', 'صدور دجاج فاهيتا، فلفل ملون، بصل مشوي، فطر، جبن موزاريلا، بهارات مكسيكية.', 'موهيتو ليمون', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 104),
('sw-7', 'صندويش مكسيكانو', 'sandwiches', 700, 'صدر دجاج حار مع فليفلة حمراء وخضراء وفطر وصوص حار، يُقدم مع بطاطا مقلية وكريم ثوم ومخلل.', 'دجاج مكسيكانو، صوص حار، ذرة حلوة، فطر، جبن شيدر.', 'بيبسي', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80', 'حار ولذيذ', NULL, true, false, 105),
('sw-8', 'صندويش هوت دوغ', 'sandwiches', 650, 'إصبعان من الهوت دوغ مع فليفلة مقطعة وفطر وصوص الخردل والباربيكيو، مصحوبة بالبطاطا وكريم الثوم والمخلل.', 'هوت دوغ فاخر، خردل ديجون، كاتشب، مخلل، جبن شيدر ذائب.', 'مشروب غازي', 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 106),

-- -----------------------------------------------------------------------------
-- 🥩 15. عجل (Veal & Beef)
-- -----------------------------------------------------------------------------
('bf-1', 'بيف ماشروم', 'beef', 1250, 'شرائح لحم عجل طرية مع صوص ديمي غلاس اللذيذ، تُقدم مع بطاطا ويدجز وخضار سوتيه.', 'لحم عجل طازج، فطر طازج، صوص كريمة غنية، بهارات عطرية، بطاطا أو رز.', 'عصير رمان فريش', 'https://thumbs.dreamstime.com/b/delicious-beef-steak-mushroom-sauce-served-alongside-creamy-mashed-potatoes-garnished-rosemary-generative-ai-delicious-365241235.jpg', NULL, ARRAY['gf'], true, true, 107),
('bf-2', 'استروغونوف بيف', 'beef', 1250, 'جوليان لحم عجل مع فليفلة حمراء وخضراء وبصل بصوص ديمي غلاس الغني، يُقدم مع الأرز والبطاطا.', 'شرائح لحم عجل، بصل، فطر، ساور كريم، خردل، باستا أو رز.', 'آيس تي فريش', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80', 'كلاسيك عالمي', NULL, true, true, 108),
('bf-3', 'شرحات حمص وثوم', 'beef', 1250, 'شرائح لحم عجل شهية مطفاة بعصير الليمون الحامض والثوم والزيت، تُقدم مع البطاطا وخضار سوتيه.', 'لحم عجل شرحات، صوص ثوم وحامض، حمص، زيت زيتون بكر.', 'عيران بلدي', 'https://i.pinimg.com/736x/41/65/3c/41653c59201eba16cd032820738db1ea--lemon-garlic-sauce-veal-cutlet.jpg', NULL, ARRAY['gf'], true, false, 109),
('bf-4', 'فيلادلفيا بيف', 'beef', 1250, 'جوليان لحم عجل مع فليفلة حمراء وخضراء وفطر بصوص ديمي غلاس وكريم فريش، مصحوبة بالبطاطا المقرمشة.', 'ستيك عجل شرائح، فلفل رومي، بصل مشوي، فطر، جبن مذاب.', 'بيبسي بارد', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80', 'أمريكي شهير', NULL, true, false, 110),

-- -----------------------------------------------------------------------------
-- 🍟 16. المقبلات (Appetizers)
-- -----------------------------------------------------------------------------
('app-1', 'موزاريلا سموكي', 'appetizers', 600, 'جبنة موزاريلا مع لحم مدخن مغطسة بطبقة كورن فليكس ومقلية حتى القرمشة الذهبية.', 'جبن موزاريلا مدخن، بقسماط مقرمش، صوص مارينارا.', 'موهيتو', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/app-1.webp', NULL, ARRAY['v'], true, false, 111),
('app-2', 'رول تشيكن', 'appetizers', 600, 'رولات دجاج مقرمشة محشوة بالجبن والأعشاب.', 'دجاج مفروم، جبن، أعشاب عطرية، صوص غمس.', 'آيس كافيه', 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 112),
('app-3', 'فريت بطاطا', 'appetizers', 300, 'أصابع بطاطا ذهبية مقرمشة ومتبلة بالبهارات الخاصة.', 'بطاطا مقلية طازجة، بهارات عنبر، كاتشب ومايونيز.', 'أي مشروب غازي', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/app-3.webp', NULL, ARRAY['vg', 'gf'], true, false, 113),
('app-4', 'بطاطا شيدر', 'appetizers', 600, 'بطاطا مقلية مقرمشة تعلوها طبقة غنية من صوص الشيدر وجبنة القشقوان وجبنة الشيدر الذائبة.', 'بطاطا مقلية، صوص جبن شيدر ساخن، هالبينو (اختياري).', 'بيبسي', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/app-4.webp', NULL, ARRAY['v'], true, true, 114),
('app-5', 'بطاطا بوتين', 'appetizers', 600, 'بطاطا مقلية لذيذة مع الفطر وجبنة القشقوان والصوص المفضل حسب اختيارك (ديمي غلاس أو بشاميل).', 'بطاطا مقلية، صوص جريفي ساخن، قطع جبن ذائبة.', 'مشروب غازي', 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 115),
('app-6', 'بوب كورن دجاج', 'appetizers', 800, 'قطع صدر دجاج ناعمة متبلة ومقلية مع عجينة الجبنة الشهية، تُقدم مع بطاطا مقلية وكريم ثوم.', 'صدور دجاج مقرمشة، صوص تراجع حار، صوص باربيكيو.', 'عصير ليموناضة', 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 116),
('app-7', 'برك جبنة', 'appetizers', 350, 'أصابع برك مقرمشة محشوة بالجبن البلدي والأعشاب.', 'عجينة رقائق مقرمشة، جبن عكاوي وموزاريلا، حبة البركة.', 'شاي أحمر', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/app-6.webp', NULL, ARRAY['v'], true, false, 117),
('app-8', 'صحن رز', 'appetizers', 250, 'صحن أرز بسمتي فاخر مطهو بالبهارات الخفيفة.', 'أرز بسمتي فاخر، زبدة، بهارات خفيفة.', 'أطباق اللحوم والدجاج', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/app-8.webp', NULL, ARRAY['vg', 'gf'], true, false, 118),
('app-9', 'تشيكن ستيكس', 'appetizers', 800, 'أصابع دجاج مقرمشة مغطسة بالكورن فليكس ومقلية، تُقدم مع بطاطا مقلية وصوص باربيكيو.', 'دجاج كريسبي مقرمش، صوص هوني موستارد.', 'عصير مانجو', 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 119),
('app-10', 'أصابع موزاريلا', 'appetizers', 450, 'أصابع جبنة موزاريلا مغطسة بالكورن فليكس ومقلية ذهبية، تُقدم مع صوص البندورة الشهي.', 'جبن موزاريلا، بقسماط أعشاب، صوص كوكتيل.', 'موهيتو', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/app-9.webp', NULL, ARRAY['v'], true, false, 120),
('app-11', 'بطاطا ويدجز', 'appetizers', 400, 'أصابع بطاطا ويدجز مشوية ومتبلة بخلطة البهارات الخاصة اللذيذة.', 'بطاطا ويدجز بقشرتها، بهارات أعشاب، صوص ثوم.', 'بيبسي', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/app-11.webp', NULL, ARRAY['vg', 'gf'], true, false, 121),
('app-12', 'حلقات بصل', 'appetizers', 300, 'حلقات بصل مقرمشة وذهبية مع صوص الباربيكيو.', 'بصل طازج، خليط مقرمش، صوص باربيكيو.', 'مشروب غازي', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/app-12.webp', NULL, ARRAY['vg'], true, false, 122),

-- -----------------------------------------------------------------------------
-- 🍝 17. باستا (Pasta)
-- -----------------------------------------------------------------------------
('pas-1', 'كربونارا', 'pasta', 950, 'معكرونة فوتوتشيني مع شرائح صدر دجاج مشوي وفطر ولحومات باردة، بصوص البشاميل وجبنة القشقوان.', 'باستا فيتوتشيني، بيف بيكن مقدد، بيض، كريمة طبخ، جبن بارميزان.', 'عصير ليمون فريش', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=700&q=80', 'إيطالي أصلي', NULL, true, true, 123),
('pas-2', 'الفريدو', 'pasta', 900, 'معكرونة فوتوتشيني مع صدر دجاج مشوي وفطر طازج بصوص البشاميل وجبنة القشقوان الذائبة.', 'فيتوتشيني، صدور دجاج، فطر طازج، زبدة، كريمة طبخ، بارميزان.', 'آيس تي خوخ', 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=700&q=80', 'الأكثر طلباً', NULL, true, true, 124),
('pas-3', 'الفونجي', 'pasta', 750, 'معكرونة فوتوتشيني غنية بالفطر الطازج مع صوص البشاميل الكريمي وجبنة القشقوان.', 'باستا، فطر طازج، ثوم، زيت زيتون، ريحان، صوص أبيض خفيف.', 'مياه فوارة', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/pas-1.webp', NULL, ARRAY['v'], true, false, 125),
('pas-4', 'أرابيانا سبايسي', 'pasta', 800, 'معكرونة بيني بصوص البندورة مع فليفلة ملونة، 3 قطع دجاج سبايسي، فطر، ثوم، زيتون مقطع وجبنة قشقوان.', 'بيني باستا، صلصة طماطم إيطالية، فلفل حار، ثوم، ريحان، زيت زيتون.', 'عصير برتقال', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/pas-4.webp', NULL, ARRAY['vg'], true, false, 126),
('pas-5', 'بينا ناغيت', 'pasta', 800, 'معكرونة بيني بصوص ديمي غلاس مع فليفلة ملونة وفطر، تعلوها 4 قطع ناغيت دجاج مقرمشة وجبنة قشقوان.', 'بيني باستا، قطع ناغيت كريسبي، صوص جبن كريمي، موزاريلا.', 'بيبسي', 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 127),
('pas-6', 'تشيكن تشيدر باستا', 'pasta', 900, 'معكرونة بيني بصوص الشيدر مع صدر دجاج مشوي ومزيج جبنة القشقوان وجبنة الشيدر.', 'باستا، دجاج مشوي، صوص جبن شيدر أصلي، بهارات أعشاب.', 'موهيتو', 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=700&q=80', 'غني بالجبن', NULL, true, false, 128),

-- -----------------------------------------------------------------------------
-- 🧀 18. بلوميات (Plomi / Halloumi Dishes)
-- -----------------------------------------------------------------------------
('pl-1', 'بلومي شيش', 'plomi', 1000, 'قطع شيش مشوية مع فليفلة حمراء وخضراء وصوص بندورة وبطاطا وجبنة قشقوان ذائبة.', 'دجاج شيش طاووق، جبن بلومي مشوي، صوص بلومي الخاص، خضار مشوية.', 'عيران بلدي', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80', 'مميز', NULL, true, true, 129),
('pl-2', 'بلومي كباب', 'plomi', 1000, 'كباب مشوي مع فليفلة حمراء وخضراء وبصل وصوص بندورة وبطاطا مقلية.', 'كباب لحم غنم وعجل، جبن بلومي ذائب، صوص أحمر، خبز ساخن.', 'عصير رمان', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80', 'فاخر', NULL, true, false, 130),
('pl-3', 'بلومي هوت دوغ', 'plomi', 900, 'هوت دوغ مقطع مع فليفلة حمراء وخضراء وصوص بندورة وبطاطا وجبنة قشقوان.', 'هوت دوغ، جبن بلومي مشوي، خردل، مايونيز، بطاطا.', 'بيبسي', 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 131),
('pl-4', 'بلومي سجق', 'plomi', 1000, 'سجق متبل مع فليفلة حمراء وخضراء وصوص بندورة وبطاطا وجبنة قشقوان غنية.', 'سجق بلدي متبل، جبن بلومي، دبس رمان، صنوبر.', 'عصير ليمون ونعناع', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80', 'حار وشهي', NULL, true, false, 132),
('pl-5', 'بلومي عجل', 'plomi', 1250, 'جوليان لحم عجل مع فليفلة حمراء وخضراء وبصل وصوص بندورة وبطاطا مقلية.', 'لحم عجل فاخر، جبن بلومي، فطر، صوص بني غني، بطاطا.', 'فرابيه ليمون', 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=700&q=80', 'سبيشال', NULL, true, true, 133),

-- -----------------------------------------------------------------------------
-- 🍔 19. برغر (Burgers)
-- -----------------------------------------------------------------------------
('bg-1', 'كلاسيك برغر', 'burgers', 650, 'كباب مشوي مع سلطة روسية، خس، بندورة وجبنة قشقوان، يرافقه بطاطا مقلية وكريم ثوم ومخلل.', 'برغر لحم بقري مشوي، جبن شيدر، خس، طماطم، مخلل، صوص كلاسيك.', 'بيبسي وفريت', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80', 'كلاسيك', NULL, true, false, 134),
('bg-2', 'باربيكيو برغر', 'burgers', 650, 'كباب مشوي مع سلطة روسية، خس، بندورة وجبنة قشقوان، يرافقه بطاطا مقلية وكريم ثوم ومخلل.', 'برغر لحم، صوص باربيكيو مدخن، حلقات بصل مقرمشة، جبن شيدر.', 'مشروب غازي', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 135),
('bg-3', 'تشيكن برغر', 'burgers', 550, 'صدر دجاج بانيه مقرمش مع سلطة روسية، خس، بندورة وجبنة قشقوان، يرافقه بطاطا وكريم ثوم ومخلل.', 'فيليه دجاج كريسبي، مايونيز، خس مقرمش، خبز بريوش.', 'عصير فريش', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 136),
('bg-4', 'ميكس برغر', 'burgers', 800, 'مزيج فاخر من الكباب المشوي وصدر دجاج بانيه مع سلطة روسية، خس، بندورة وجبنة قشقوان، يرافقه بطاطا وكريم ثوم ومخلل.', 'شريحة لحم بقري، فيليه دجاج كريسبي، جبن شيدر مزدوج، صوص سري.', 'موهيتو فريش', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80', 'حجم كبير', NULL, true, true, 137),
('bg-5', 'بيغ ماك برغر', 'burgers', 650, 'كباب مشوي مع خضار مشوية، خس، بندورة وجبنة قشقوان، يرافقه بطاطا وكريم ثوم ومخلل.', 'طبقتين لحم بقري، خبز بالسمسم، خس، بصل، مخلل، صوص بيغ ماك.', 'بيبسي', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80', 'شهير', NULL, true, false, 138),
('bg-6', 'عنبر برغر', 'burgers', 800, 'كباب مشوي مع لحومات باردة، سلطة روسية، جبنة شيدر وصوص باربيكيو، يرافقه بطاطا وكريم ثوم ومخلل.', 'لحم بقري أنغوس فاخر، صوص فطر طازج، بيف بيكون، جبن إيمينتال، بصل مكرمل.', 'عصير عنبر كوكتيل', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80', 'توقيع عنبر', NULL, true, true, 139),
('bg-7', 'شيش برغر', 'burgers', 550, 'قطع شيش مشوي مع بندورة وبصل، سلطة روسية، خس وبندورة، يرافقه بطاطا مقلية وكريم ثوم ومخلل.', 'شيش طاووق مشوي، ثومية، مخلل، خس، خبز برغر طازج.', 'عيران', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 140),

-- -----------------------------------------------------------------------------
-- 🍕 20. بيتزا (Pizza)
-- -----------------------------------------------------------------------------
('pz-1', 'بيتزا بيبروني', 'pizza', 850, 'بيتزا إيطالية بصلصة الطماطم وجبن الموزاريلا وشرائح البيبروني البقري المقرمشة.', 'عجينة بيتزا هشة، صلصة طماطم إيطالية، موزاريلا، شرائح بيبروني بقري.', 'بيبسي', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', 'كلاسيك', NULL, true, false, 141),
('pz-2', 'بيتزا سجق', 'pizza', 950, 'بيتزا بالسجق البلدي المتبل والجبن والفلفل الأخضر والزيتون.', 'عجينة بيتزا، سجق بلدي حار، موزاريلا، فلفل، زيتون.', 'عيران أو بيبسي', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80', 'شرقي', NULL, true, false, 142),
('pz-3', 'بيتزا فطر', 'pizza', 850, 'بيتزا بصلصة الطماطم والموزاريلا وشرائح الفطر الطازج والأوريغانو.', 'عجينة بيتزا، صلصة، موزاريلا، فطر طازج، أوريغانو، زيت زيتون.', 'مياه فوارة', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/bg-4.webp', NULL, ARRAY['v'], true, false, 143),
('pz-4', 'بيتزا مارغاريتا', 'pizza', 750, 'بيتزا مارغاريتا نابولية بصلصة الطماطم وجبن الموزاريلا والريحان الطازج.', 'عجينة مخمرة، صلصة طماطم سان مارزانو، موزاريلا، ريحان طازج.', 'موهيتو', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/pz-4.webp', NULL, ARRAY['v'], true, false, 144),
('pz-5', 'بيتزا كابري', 'pizza', 950, 'بيتزا كابري الإيطالية بالدجاج والمشروم والأعشاب وزيت الزيتون.', 'عجينة بيتزا، دجاج، فطر، صلصة كابري، جبن موزاريلا.', 'آيس تي', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 145),
('pz-6', 'بيتزا فصول أربعة', 'pizza', 850, 'بيتزا كواترو ستاجيوني مقسمة إلى 4 أقسام (فطر، بيبروني، خضار، جبن).', 'عجينة، موزاريلا، بيبروني، فطر، زيتون، فلفل رومي، خرشوف.', 'مشروب غازي', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', 'تنوع رائع', NULL, true, false, 146),
('pz-7', 'تشيكن باشاميل بيتزا', 'pizza', 900, 'بيتزا مبتكرة بصلصة البشاميل الكريمية وقطع الدجاج والفطر والجبن.', 'عجينة بيتزا، صوص بشاميل غني، صدور دجاج، فطر، موزاريلا.', 'عصير ليمون ونعناع', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', 'كريمي', NULL, true, false, 147),
('pz-8', 'بيتزا سبايسي', 'pizza', 950, 'بيتزا حارة بصلصة الشطة والفلفل الحار واللحم المفروم والموزاريلا.', 'صلصة طماطم حارة، هالبينو، لحم مفروم، فلفل حار، موزاريلا.', 'مشروب بارد', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', 'حار جداً', NULL, true, false, 148),
('pz-9', 'بيتزا خضار', 'pizza', 800, 'بيتزا خضار طازجة مع الفلفل الملون والفطر والزيتون والذرة والبصل.', 'صلصة طماطم، موزاريلا، فلفل ملون، فطر، زيتون أسود، ذرة، طماطم.', 'عصير فريش', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/pz-7.webp', NULL, ARRAY['v'], true, false, 149),
('pz-10', 'بيتزا عنبر الخاصة', 'pizza', 1050, 'بيتزا عنبر الفاخرة المشكلة بأجود اللحوم والدجاج والأجبان الأربعة.', 'صلصة عنبر السرية، دجاج، ستيك لحم، سجق، أربعة أجبان، فطر طازج.', 'غروب عنبر', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', 'توقيع عنبر', NULL, true, true, 150),
('pz-11', 'بيتزا لحومات', 'pizza', 1000, 'بيتزا مخصصة لعشاق اللحوم تجمع البيبروني والسجق واللحم البقري والبيكون.', 'صلصة، موزاريلا، بيبروني، سجق، لحم بقري مفروم، بيف بيكون.', 'بيبسي عائلي', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=700&q=80', 'غنية باللحوم', NULL, true, false, 151),
('pz-12', 'بيتزا هوت دوغ', 'pizza', 900, 'بيتزا محبوبة بشرائح الهوت دوغ وجبن الموزاريلا والذرة.', 'صلصة طماطم، هوت دوغ شرائح، موزاريلا، ذرة، خردل خفيف.', 'مشروب غازي', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 152),
('pz-13', 'بيتزا مكسيكانو', 'pizza', 950, 'بيتزا دجاج مكسيكانو مع الفلفل الحار والذرة والصلصة المكسيكية.', 'عجينة بيتزا، دجاج مكسيكانو، صوص سالسا، هالبينو، ذرة، موزاريلا.', 'موهيتو', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', 'مكسيكي حار', NULL, true, false, 153),
('pz-14', 'بيتزا مدخن', 'pizza', 850, 'بيتزا باللحوم والدجاج المدخن وجبن الشيدر والموزاريلا وصوص الباربيكيو.', 'عجينة بيتزا، دجاج مدخن، تركي مدخن، صوص باربيكيو، موزاريلا.', 'آيس تي', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80', 'نكهة تدخين', NULL, true, false, 154),

-- -----------------------------------------------------------------------------
-- 👨‍👩‍👧‍👦 21. وجبات عائلي (Family Meals)
-- -----------------------------------------------------------------------------
('fam-1', 'طبق عنبر الغني العائلي', 'family-meals', 2250, 'وجبة عائلية مشكلة غنية: 3 قطع ناغيت، 3 قطع كريسبي، 5 أصابع ستيكس، قطعتان برك جبنة، قطعتان أصابع موزاريلا، بوب كورن دجاج وبطاطا مقلية.', 'تشكيلة ستيك دجاج ولحم، كريسبي، أصابع جبن، أرز، بطاطا ويدجز، سلطة، صلصات متنوعة.', 'بيبسي عائلي', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80', 'وليمة الدار', NULL, true, true, 155),
('fam-2', 'وجبة كاسبر العائلية', 'family-meals', 2500, 'قطع أفخاذ دجاج مخلية من العظم مقلية على طريقة البروستد المقرمشة، تُقدم مع بطاطا وحلقات بصل مقلية.', 'دجاج كاسبر المميز، كوردون بلو، ناغيتس، بطاطا شيدر، سلطة سيزر، صلصات.', 'بيبسي عائلي', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80', 'العرض الأكبر', NULL, true, true, 156),

-- -----------------------------------------------------------------------------
-- 🍗 22. الوجبات الرئيسية (Main Meals)
-- -----------------------------------------------------------------------------
('mm-1', 'أماندا تشيكن', 'main-meals', 1050, 'صدر دجاج محشو بالأجبان والمشروم بصلصة أماندا الكريمية مع الأرز والبطاطا.', 'صدر دجاج محشو، صوص أماندا الكريمي، فطر، جبن، رز أو بطاطا، سوتيه.', 'موهيتو ليمون', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80', 'سبيشال', NULL, true, true, 157),
('mm-2', 'تشيكن ألاكياف', 'main-meals', 1050, 'صدر دجاج ملفوف ومحشو بالزبدة والأعشاب ومقلي ومقرمش بأسلوب كيف الكلاسيكي.', 'صدر دجاج رول، زبدة أعشاب وثوم، بقسماط ذهبي، بطاطا بوريه، خضار.', 'عصير برتقال فريش', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80', 'كلاسيك عالمي', NULL, true, false, 158),
('mm-3', 'تشيكن سيراتشا', 'main-meals', 1000, 'دجاج مشوي بصلصة السيراتشا الحارة والتوابل الآسيوية مع الأرز المبخر.', 'دجاج متبل، صلصة سيراتشا حارة، سمسم، بصل أخضر، أرز بسمتي.', 'بيبسي مثلج', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80', 'حار لاذع', NULL, true, false, 159),
('mm-4', 'ميكس بيف بلاتر', 'main-meals', 1050, 'تشكيلة لحوم بيف مشوية بصلصات متنوعة مع الخضار والبطاطا.', 'شرائح لحم عجل بيف، صوص فطر، صوص فلفل أسود، بطاطا مقلية، خضار سوتيه.', 'عصير رمان', 'https://mhjiqnoojtxatjguqafb.supabase.co/storage/v1/object/public/anbar-assets/dishes/fam-1.webp', NULL, ARRAY['gf'], true, true, 160),
('mm-5', 'تشيكن تشيبس', 'main-meals', 900, 'شرائح دجاج كرسبي رقيقة ومقرمشة كالشيبس مع صوص التغميس والبطاطا.', 'دجاج كريسبي شيبس، بطاطا مقلية، صوص رانش، صوص هوني موستارد.', 'مشروب غازي', 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=700&q=80', 'مقرمش وخفيف', NULL, true, false, 161),
('mm-6', 'استروغونوف تشيكن', 'main-meals', 1050, 'شرائح صدور دجاج طرية بصلصة الستروغانوف الغنية بالفطر والساور كريم مع الأرز.', 'صدور دجاج، فطر طازج، كريمة طبخ، خردل، بصل، أرز بسمتي فاخر.', 'آيس تي خوخ', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 162),
('mm-7', 'لاميرا تشيكن', 'main-meals', 1000, 'دجاج لاميرا بصلصة الليمون والكريمة والأعشاب العطرية الخفيفة.', 'دجاج مشوي، صوص ليمون وكريمة، كبر، أعشاب، خضار وبطاطا.', 'عصير كيوي', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 163),
('mm-8', 'كوردون بلو', 'main-meals', 1000, 'صدور دجاج محشوة بالتركي المدخن وجبن الموزاريلا المقلي المقرمش.', 'صدر دجاج محشو، تركي مدخن، موزاريلا، صوص جبن، بطاطا مقلية.', 'بيبسي', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80', 'الأكثر مبيعاً', NULL, true, true, 164),
('mm-9', 'فلامينكو تشيكن', 'main-meals', 1150, 'وجبة دجاج فلامينكو الإسبانية المتبلة مع صلصة الفلفل الحلو والجبن الذائب.', 'دجاج متبل، صلصة فلامينكو إسبانية، فلفل، جبن ذائب، رز أو بطاطا.', 'فرابيه ليمون', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80', 'مميز', NULL, true, false, 165),
('mm-10', 'كروز تشيكن', 'main-meals', 1150, 'دجاج كروز المميز بتتبيلة الباربكيو المدخن والأجبان المشكلة.', 'دجاج كروز، صوص تدخين، جبن شيدر وموزاريلا، بطاطا ويدجز.', 'موهيتو', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 166),
('mm-11', 'عنبر تشيكن بلاتر', 'main-meals', 1100, 'طبق دجاج عنبر الملكي المحضر بصلصة الدار الخاصة والمكسرات والأرز.', 'صدور دجاج متبلة بخلطة عنبر، صوص كريمي فاخر، فستق، صنوبر، أرز مبخر.', 'كوكتيل عنبر', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80', 'توقيع عنبر', NULL, true, true, 167),
('mm-12', 'بامبينو تشيكن', 'main-meals', 1100, 'دجاج بامبينو الشهي بصلصة الطماطم الإيطالية والموزاريلا والريحان.', 'دجاج فيليه، صلصة طماطم ريحان، جبن موزاريلا، باستا أو بطاطا.', 'عصير تفاح', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 168),
('mm-13', 'تشيكن تشيدر وجبة', 'main-meals', 1050, 'صدور دجاج مشوية مغطاة بصوص جبن الشيدر الساخن والبطاطا المقلية.', 'دجاج مشوي، صوص شيدر وفير، بطاطا فريت، خضار سوتيه.', 'بيبسي', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80', 'غني بالجبن', NULL, true, false, 169),
('mm-14', 'كاسبرسكي تشيكن', 'main-meals', 950, 'وجبة دجاج كاسبرسكي المقرمشة بتتبيلة خاصة وصوص التغميس.', 'دجاج كريسبي مقرمش، صوص كاسبرسكي الخاص، بطاطا مقلية، سلطة كولسلو.', 'مشروب غازي', 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 170),
('mm-15', 'شرحات دجاج حمص وثوم / بروفنسيال', 'main-meals', 900, 'شرحات صدور دجاج طرية مطهوة بالثوم والحامض والكزبرة (بروفنسيال) مع الحمص.', 'صدور دجاج شرحات، ثوم، حامض، كزبرة، حمص، بطاطا.', 'عيران بلدي', 'https://www.themediterraneandish.com/wp-content/uploads/2023/07/TMD-Lemon-Garlic-Chicken-WEB-26.jpg', NULL, ARRAY['gf'], true, false, 171),
('mm-16', 'وجبة مكسيكانو', 'main-meals', 950, 'طبق دجاج مكسيكانو الحار مع الفلفل الملون والفطر والذرة والأرز.', 'دجاج مكسيكانو حار، فلفل، ذرة، فطر، صوص حار، أرز بسمتي.', 'بيبسي بارد', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80', 'حار ولذيذ', NULL, true, false, 172),
('mm-17', 'اسكالوب دجاج', 'main-meals', 950, 'شريحة إسكالوب دجاج كبيرة ومقرمشة تقدم مع البطاطا المقلية وصلصة التارتار.', 'فيليه دجاج مخفوق ومقرمش، بطاطا مقلية، صوص تارتار، خضار.', 'عصير ليموناضة', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80', 'مفضل', NULL, true, false, 173),
('mm-18', 'وجبة فاهيتا دجاج', 'main-meals', 950, 'طبق فاهيتا دجاج مكسيكي ساخن مع البصل والفلفل والموزاريلا وخبز التورتيلا.', 'دجاج فاهيتا، فلفل ملون، بصل مشوي، فطر، جبن، خبز تورتيلا، ساور كريم.', 'موهيتو', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 174),
('mm-19', 'وجبة غواصة', 'main-meals', 950, 'طبق الغواصة المشكل من الدجاج واللحوم والفطر والذرة والموزاريلا مع البطاطا.', 'دجاج متبل، سلامي، فطر، ذرة، موزاريلا، بطاطا مقلية، صوص.', 'مشروب غازي', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 175),
('mm-20', 'وجبة زنجر', 'main-meals', 950, 'وجبة دجاج زنجر المقرمش والحار مع البطاطا وسلطة الكولسلو والصوص.', 'قطع زنجر حارة ومقرمشة، بطاطا فريت، صوص زنجر، كولسلو.', 'بيبسي', 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=700&q=80', 'حار مقرمش', NULL, true, true, 176),
('mm-21', 'وجبة ناغيت', 'main-meals', 900, 'وجبة قطع ناغيت دجاج مقرمشة مع البطاطا المقلية والصوصات.', 'قطع ناغيت دجاج مقلية، بطاطا مقلية، كاتشب، مايونيز، عصير.', 'عصير برتقال', 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=700&q=80', 'محبوب الأطفال', NULL, true, false, 177),
('mm-22', 'وجبة سبايسي تشيكن', 'main-meals', 900, 'دجاج سبايسي مقلي ومتبل بالشطة مع البطاطا وصلصة الثوم الحارة.', 'دجاج حار متبل، بطاطا مقلية، ثومية حارة، مخلل.', 'بيبسي', 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=700&q=80', 'حار', NULL, true, false, 178),
('mm-23', 'وجبة كريسبي', 'main-meals', 900, 'أصابع ستربس دجاج كريسبي مقرمشة مع البطاطا المقلية وصلصة الثومية والكولسلو.', 'ستربس دجاج كريسبي، بطاطا مقلية، ثومية، كولسلو، خبز.', 'مشروب غازي', 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=700&q=80', 'الأكثر مبيعاً', NULL, true, true, 179),
('mm-24', 'كاساديا دجاج', 'main-meals', 950, 'كاساديا مكسيكية بخبز التورتيلا المحمص والمحشو بالدجاج المتبل والجبن الذائب والذرة.', 'تورتيلا محمص، دجاج فاهيتا، جبن موزاريلا وشيدر، ذرة، صوص مكسيكي.', 'موهيتو فريش', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80', 'مكسيكي لذيذ', NULL, true, false, 180),
('mm-25', 'ريفيرا تشيكن', 'main-meals', 1000, 'دجاج ريفييرا المتوسطي مع صلصة الطماطم المجففة والزيتون والأعشاب والأرز.', 'دجاج مشوي، طماطم مجففة، زيتون كالاماتا، صلصة متوسطية، أرز.', 'عصير ليموناضة', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80', NULL, NULL, true, false, 181),
('mm-26', 'فجيتاريا تشيكن', 'main-meals', 1000, 'صدور دجاج مشوية صحية مع تشكيلة واسعة من الخضار السوتيه والأرز البسمتي.', 'صدور دجاج مشوية، بروكلي، كوسا، جزر، فطر، ذرة، أرز بسمتي خفيف.', 'مياه معدنية', 'https://static.vecteezy.com/system/resources/previews/038/810/982/large_2x/ai-generated-a-well-portioned-plate-featuring-grilled-chicken-quinoa-and-steamed-vegetables-free-photo.jpeg', NULL, ARRAY['gf'], true, false, 182)

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
