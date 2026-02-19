/* =====================================================
 * Nhà Hàng Phố Cổ - Multi-language / i18n
 * Supports: vi, en, zh, ko
 * ===================================================== */

'use strict';

const TRANSLATIONS = {
    // ====== VIETNAMESE (default) ======
    vi: {
        // Nav
        nav_home: 'Trang chủ',
        nav_about: 'Giới thiệu',
        nav_menu: 'Thực đơn',
        nav_gallery: 'Gallery',
        nav_reservation: 'Đặt bàn',
        nav_contact: 'Liên hệ',

        // Hero
        hero_subtitle: 'Chào mừng đến với',
        hero_title: 'Nhà Hàng Phố Cổ',
        hero_tagline: 'Hương vị truyền thống giữa lòng phố cổ Ninh Bình',
        hero_desc: 'Trải nghiệm ẩm thực đặc sản Ninh Bình trong không gian mang đậm hồn phố cổ',
        hero_btn_menu: 'Xem Thực Đơn',
        hero_btn_reserve: 'Đặt Bàn Ngay',

        // About
        about_subtitle: 'Câu chuyện của chúng tôi',
        about_title: 'Giới Thiệu',
        about_heading: 'Nhà Hàng Phố Cổ – Tinh Hoa Ẩm Thực Ninh Bình',
        about_badge: 'Năm kinh nghiệm',
        about_p1: 'Tọa lạc tại <strong>72A Đinh Tất Miễn – đường Lê Thái Tổ, Ninh Bình</strong>, Nhà Hàng Phố Cổ mang đến không gian ẩm thực đậm chất phố cổ Ninh Bình, nơi mỗi món ăn là một câu chuyện văn hóa vùng đất Cố Đô.',
        about_p2: 'Với hơn 10 năm kinh nghiệm, chúng tôi tự hào mang đến những món đặc sản nổi tiếng nhất của Ninh Bình: Cơm cháy, Thịt dê núi, Miến lươn, Ốc núi... được chế biến từ nguyên liệu tươi ngon, theo công thức gia truyền.',
        feat1_title: 'Đặc sản địa phương',
        feat1_desc: 'Nguyên liệu tươi sạch mỗi ngày',
        feat2_title: 'Không gian phố cổ',
        feat2_desc: 'Kiến trúc truyền thống Ninh Bình',
        feat3_title: 'Phục vụ tận tâm',
        feat3_desc: 'Dịch vụ chu đáo, chuyên nghiệp',
        feat4_title: 'Công thức gia truyền',
        feat4_desc: 'Hương vị đậm đà, khó quên',

        // Menu
        menu_subtitle: 'Khám phá hương vị',
        menu_title: 'Thực Đơn',
        menu_all: 'Tất cả',
        menu_loading: 'Đang tải thực đơn...',
        // Menu categories
        cat_dac_san: 'Đặc sản Ninh Bình',
        cat_khai_vi: 'Khai vị',
        cat_mon_chinh: 'Món chính',
        cat_lau: 'Lẩu',
        cat_do_uong: 'Đồ uống',
        // Menu items
        food_com_chay_name: 'Cơm cháy Ninh Bình',
        food_com_chay_desc: 'Cơm cháy giòn tan ăn kèm thịt dê và nước sốt đặc biệt, đặc sản nổi tiếng Ninh Bình',
        food_de_tai_chanh_name: 'Thịt dê tái chanh',
        food_de_tai_chanh_desc: 'Thịt dê tươi thái mỏng tái chanh, ăn kèm rau thơm và bánh đa',
        food_de_nuong_name: 'Thịt dê nướng tảng',
        food_de_nuong_desc: 'Thịt dê ướp gia vị truyền thống, nướng trên than hoa',
        food_mien_luon_name: 'Miến lươn Ninh Bình',
        food_mien_luon_desc: 'Miến lươn nấu từ lươn đồng tươi, nước dùng ngọt thanh',
        food_oc_nui_name: 'Ốc núi Ninh Bình',
        food_oc_nui_desc: 'Ốc núi hấp lá chanh, chấm mắm gừng, vị ngọt tự nhiên',
        food_nem_ran_name: 'Nem rán truyền thống',
        food_nem_ran_desc: 'Nem rán giòn rụm với nhân thịt và mộc nhĩ',
        food_goi_cuon_name: 'Gỏi cuốn tôm thịt',
        food_goi_cuon_desc: 'Gỏi cuốn tươi mát với tôm, thịt và rau sống',
        food_ca_kho_name: 'Cá kho tộ',
        food_ca_kho_desc: 'Cá kho tộ đậm đà vị quê hương, ăn kèm cơm nóng',
        food_ga_nuong_name: 'Gà đồi nướng mật ong',
        food_ga_nuong_desc: 'Gà đồi ta nướng mật ong thơm lừng, da giòn thịt mềm',
        food_lau_de_name: 'Lẩu dê Ninh Bình',
        food_lau_de_desc: 'Lẩu dê truyền thống Ninh Bình, nước dùng đậm đà',
        food_lau_hai_san_name: 'Lẩu hải sản chua cay',
        food_lau_hai_san_desc: 'Lẩu hải sản tươi sống với nước dùng chua cay đặc biệt',
        food_tra_sen_name: 'Trà sen Ninh Bình',
        food_tra_sen_desc: 'Trà ướp hương sen tự nhiên, thanh mát',

        // Gallery
        gallery_subtitle: 'Khoảnh khắc đẹp',
        gallery_title: 'Hình Ảnh',

        // Reservation
        res_subtitle: 'Trải nghiệm tuyệt vời',
        res_title: 'Đặt Bàn',
        res_desc: 'Hãy đặt bàn trước để có trải nghiệm tốt nhất tại Nhà Hàng Phố Cổ',
        res_name: 'Họ và tên',
        res_phone: 'Số điện thoại',
        res_email: 'Email',
        res_guests: 'Số khách',
        res_guests_ph: 'Chọn số khách',
        res_date: 'Ngày đặt',
        res_time: 'Giờ đặt',
        res_time_ph: 'Chọn giờ',
        res_time_lunch: 'Buổi trưa',
        res_time_dinner: 'Buổi tối',
        res_note: 'Ghi chú thêm',
        res_note_ph: 'Yêu cầu đặc biệt, dị ứng thực phẩm...',
        res_submit: 'Đặt Bàn Ngay',
        res_sending: 'Đang gửi...',
        res_success_title: 'Đặt Bàn Thành Công!',
        res_success_msg: 'Cảm ơn bạn đã đặt bàn tại Nhà Hàng Phố Cổ. Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.',
        res_close: 'Đóng',
        res_person: 'người',
        res_order_title: 'Đặt món trước',
        res_order_optional: '(Không bắt buộc)',
        res_order_add: 'Thêm món',
        res_order_hide: 'Ẩn',
        res_order_selected: 'Món đã chọn',
        res_order_clear: 'Xóa tất cả',
        res_order_total: 'Tổng tạm tính:',
        res_order_empty: 'Chưa có món ăn nào',

        // Contact
        ct_subtitle: 'Kết nối với chúng tôi',
        ct_title: 'Liên Hệ',
        ct_address_label: 'Địa chỉ',
        ct_phone_label: 'Điện thoại',
        ct_email_label: 'Email',
        ct_hours_label: 'Giờ mở cửa',
        ct_form_title: 'Gửi Tin Nhắn',
        ct_name: 'Họ và tên',
        ct_email: 'Email',
        ct_subject: 'Tiêu đề',
        ct_subject_ph: 'Tiêu đề tin nhắn',
        ct_message: 'Nội dung',
        ct_message_ph: 'Nội dung tin nhắn của bạn...',
        ct_submit: 'Gửi Tin Nhắn',
        ct_sending: 'Đang gửi...',
        map_btn: '<i class="fas fa-map-marked-alt"></i> Xem Google Maps',

        // Footer
        ft_desc: 'Nhà Hàng Phố Cổ mang đến trải nghiệm ẩm thực đặc sản Ninh Bình trong không gian phố cổ truyền thống.',
        ft_links: 'Liên kết nhanh',
        ft_hours: 'Giờ mở cửa',
        ft_contact: 'Liên hệ',
        ft_weekday: 'Thứ 2 - Thứ 6',
        ft_sat: 'Thứ 7',
        ft_sun: 'Chủ nhật',
        ft_copyright: '© 2026 Nhà Hàng Phố Cổ - Ninh Bình. All rights reserved.',

        // Video
        video_skip: 'Bỏ qua',

        // Validation
        val_name_required: 'Vui lòng nhập họ tên (tối thiểu 2 ký tự)',
        val_phone_invalid: 'Số điện thoại không hợp lệ (VD: 0912345678)',
        val_email_invalid: 'Email không hợp lệ',
        val_date_required: 'Vui lòng chọn ngày',
        val_time_required: 'Vui lòng chọn giờ',
        val_guests_required: 'Vui lòng chọn số khách',
        val_name_short: 'Vui lòng nhập họ tên',
        val_msg_short: 'Nội dung tối thiểu 10 ký tự',
        toast_contact_success: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.',
        toast_contact_fallback: 'Cảm ơn bạn! Tin nhắn đã được ghi nhận.',

        // Stats
        stat_customers: 'Khách hàng phục vụ',
        stat_dishes: 'Món ăn đặc sắc',
        stat_years: 'Năm kinh nghiệm',
        stat_reviews: 'Đánh giá 5 sao',

        // Testimonials
        testi_subtitle: 'Khách hàng nói gì',
        testi_title: 'Đánh Giá',
        testi_1_text: '"Món thịt dê nướng tại đây tuyệt vời! Không gian rất đẹp và sang trọng. Nhân viên phục vụ rất chu đáo, chắc chắn sẽ quay lại."',
        testi_1_name: 'Nguyễn Minh Anh',
        testi_1_role: 'Khách du lịch từ Hà Nội',
        testi_2_text: '"Cơm cháy ở đây giòn tan, nước sốt đậm đà đúng vị truyền thống. Lần nào đến Ninh Bình cũng ghé đây. Rất recommend!"',
        testi_2_name: 'Trần Đức Huy',
        testi_2_role: 'Food Blogger',
        testi_3_text: '"Đặt tiệc 30 người cho công ty, mọi thứ rất hoàn hảo từ thức ăn đến phục vụ. Giá cả hợp lý, chất lượng vượt mong đợi!"',
        testi_3_name: 'Lê Thu Hương',
        testi_3_role: 'Quản lý doanh nghiệp',
        testi_4_text: '"Lẩu dê cực ngon, nước dùng đậm vị. View nhà hàng rất đẹp, phù hợp đi cùng gia đình. Sẽ giới thiệu bạn bè ghé thử!"',
        testi_4_name: 'Phạm Văn Đạt',
        testi_4_role: 'Khách hàng thân thiết',

        // Offer
        offer_badge: 'Ưu đãi đặc biệt',
        offer_title: 'Giảm 15% cho đặt bàn Online',
        offer_desc: 'Đặt bàn trực tuyến ngay hôm nay để nhận ưu đãi giảm giá 15% cho tất cả các món ăn. Áp dụng cho nhóm từ 4 người trở lên.',
        offer_btn: 'Đặt Bàn & Nhận Ưu Đãi',
    },

    // ====== ENGLISH ======
    en: {
        nav_home: 'Home',
        nav_about: 'About',
        nav_menu: 'Menu',
        nav_gallery: 'Gallery',
        nav_reservation: 'Reservation',
        nav_contact: 'Contact',

        hero_subtitle: 'Welcome to',
        hero_title: 'Phố Cổ Restaurant',
        hero_tagline: 'Traditional flavors in the heart of ancient Ninh Bình',
        hero_desc: 'Experience Ninh Bình\'s finest cuisine in an authentic old-town atmosphere',
        hero_btn_menu: 'View Menu',
        hero_btn_reserve: 'Book a Table',

        about_subtitle: 'Our Story',
        about_title: 'About Us',
        about_heading: 'Phố Cổ Restaurant – The Essence of Ninh Bình Cuisine',
        about_badge: 'Years of experience',
        about_p1: 'Located at <strong>72A Đinh Tất Miễn – Lê Thái Tổ Street, Ninh Bình</strong>, Phố Cổ Restaurant brings you a dining space rich in old-town Ninh Bình character, where every dish tells a cultural story of the ancient capital.',
        about_p2: 'With over 10 years of experience, we proudly serve Ninh Bình\'s most famous specialties: Scorched Rice, Mountain Goat Meat, Eel Vermicelli, Mountain Snails... prepared with the freshest ingredients and traditional family recipes.',
        feat1_title: 'Local Specialties',
        feat1_desc: 'Fresh ingredients every day',
        feat2_title: 'Old-Town Ambiance',
        feat2_desc: 'Traditional Ninh Bình architecture',
        feat3_title: 'Dedicated Service',
        feat3_desc: 'Attentive & professional',
        feat4_title: 'Family Recipes',
        feat4_desc: 'Rich & unforgettable flavors',

        menu_subtitle: 'Discover the flavors',
        menu_title: 'Our Menu',
        menu_all: 'All',
        menu_loading: 'Loading menu...',
        cat_dac_san: 'Ninh Bình Specialties',
        cat_khai_vi: 'Appetizers',
        cat_mon_chinh: 'Main Course',
        cat_lau: 'Hot Pot',
        cat_do_uong: 'Beverages',
        food_com_chay_name: 'Ninh Bình Scorched Rice',
        food_com_chay_desc: 'Crispy scorched rice served with goat meat and special sauce, a famous Ninh Bình delicacy',
        food_de_tai_chanh_name: 'Lime-Cured Goat Meat',
        food_de_tai_chanh_desc: 'Fresh goat meat thinly sliced, cured with lime, served with herbs and rice crackers',
        food_de_nuong_name: 'Grilled Goat Meat',
        food_de_nuong_desc: 'Goat meat marinated with traditional spices, charcoal grilled',
        food_mien_luon_name: 'Ninh Bình Eel Vermicelli',
        food_mien_luon_desc: 'Vermicelli noodles with fresh field eel, sweet and savory broth',
        food_oc_nui_name: 'Ninh Bình Mountain Snails',
        food_oc_nui_desc: 'Mountain snails steamed with lemongrass, served with ginger fish sauce',
        food_nem_ran_name: 'Traditional Spring Rolls',
        food_nem_ran_desc: 'Crispy spring rolls with meat and wood ear mushroom filling',
        food_goi_cuon_name: 'Fresh Summer Rolls',
        food_goi_cuon_desc: 'Fresh rice paper rolls with shrimp, pork, and vegetables',
        food_ca_kho_name: 'Caramelized Fish in Clay Pot',
        food_ca_kho_desc: 'Fish braised in rich caramel sauce, served with steamed rice',
        food_ga_nuong_name: 'Honey Grilled Free-Range Chicken',
        food_ga_nuong_desc: 'Free-range chicken roasted with honey, crispy skin and tender meat',
        food_lau_de_name: 'Ninh Bình Goat Hot Pot',
        food_lau_de_desc: 'Traditional Ninh Bình goat hot pot with rich savory broth',
        food_lau_hai_san_name: 'Spicy Seafood Hot Pot',
        food_lau_hai_san_desc: 'Fresh seafood hot pot with special spicy and sour broth',
        food_tra_sen_name: 'Ninh Bình Lotus Tea',
        food_tra_sen_desc: 'Naturally lotus-scented tea, refreshing and fragrant',

        gallery_subtitle: 'Beautiful moments',
        gallery_title: 'Gallery',

        res_subtitle: 'A wonderful experience',
        res_title: 'Reservation',
        res_desc: 'Book in advance for the best experience at Phố Cổ Restaurant',
        res_name: 'Full name',
        res_phone: 'Phone number',
        res_email: 'Email',
        res_guests: 'Guests',
        res_guests_ph: 'Select guests',
        res_date: 'Date',
        res_time: 'Time',
        res_time_ph: 'Select time',
        res_time_lunch: 'Lunch',
        res_time_dinner: 'Dinner',
        res_note: 'Additional notes',
        res_note_ph: 'Special requests, food allergies...',
        res_submit: 'Book Now',
        res_sending: 'Sending...',
        res_success_title: 'Reservation Successful!',
        res_success_msg: 'Thank you for your reservation at Phố Cổ Restaurant. We will contact you to confirm shortly.',
        res_close: 'Close',
        res_person: 'guests',
        res_order_title: 'Pre-order food',
        res_order_optional: '(Optional)',
        res_order_add: 'Add dishes',
        res_order_hide: 'Hide',
        res_order_selected: 'Selected dishes',
        res_order_clear: 'Clear all',
        res_order_total: 'Estimated total:',
        res_order_empty: 'No dishes available',

        ct_subtitle: 'Get in touch',
        ct_title: 'Contact',
        ct_address_label: 'Address',
        ct_phone_label: 'Phone',
        ct_email_label: 'Email',
        ct_hours_label: 'Opening hours',
        ct_form_title: 'Send a Message',
        ct_name: 'Full name',
        ct_email: 'Email',
        ct_subject: 'Subject',
        ct_subject_ph: 'Message subject',
        ct_message: 'Message',
        ct_message_ph: 'Your message...',
        ct_submit: 'Send Message',
        ct_sending: 'Sending...',
        map_btn: '<i class="fas fa-map-marked-alt"></i> View on Google Maps',

        ft_desc: 'Phố Cổ Restaurant brings you an authentic Ninh Bình culinary experience in a traditional old-town setting.',
        ft_links: 'Quick Links',
        ft_hours: 'Opening Hours',
        ft_contact: 'Contact',
        ft_weekday: 'Mon - Fri',
        ft_sat: 'Saturday',
        ft_sun: 'Sunday',
        ft_copyright: '© 2026 Phố Cổ Restaurant - Ninh Bình. All rights reserved.',

        video_skip: 'Skip',

        val_name_required: 'Please enter your name (min 2 characters)',
        val_phone_invalid: 'Invalid phone number (e.g. 0912345678)',
        val_email_invalid: 'Invalid email',
        val_date_required: 'Please select a date',
        val_time_required: 'Please select a time',
        val_guests_required: 'Please select number of guests',
        val_name_short: 'Please enter your name',
        val_msg_short: 'Message must be at least 10 characters',
        toast_contact_success: 'Thank you for contacting us! We will get back to you soon.',
        toast_contact_fallback: 'Thank you! Your message has been received.',

        // Stats
        stat_customers: 'Customers served',
        stat_dishes: 'Unique dishes',
        stat_years: 'Years of experience',
        stat_reviews: '5-star reviews',

        // Testimonials
        testi_subtitle: 'What our guests say',
        testi_title: 'Reviews',
        testi_1_text: '"The grilled goat meat here is outstanding! Beautiful and luxurious space. The staff is very attentive, will definitely come back."',
        testi_1_name: 'Nguyen Minh Anh',
        testi_1_role: 'Tourist from Hanoi',
        testi_2_text: '"The scorched rice is perfectly crispy, the sauce has an authentic traditional flavor. Every trip to Ninh Binh, I come here. Highly recommend!"',
        testi_2_name: 'Tran Duc Huy',
        testi_2_role: 'Food Blogger',
        testi_3_text: '"Booked a party for 30 people, everything was perfect from food to service. Reasonable prices, quality beyond expectations!"',
        testi_3_name: 'Le Thu Huong',
        testi_3_role: 'Business Manager',
        testi_4_text: '"Amazing goat hot pot with rich savory broth. Beautiful restaurant view, perfect for family dining. Will introduce friends!"',
        testi_4_name: 'Pham Van Dat',
        testi_4_role: 'Regular Customer',

        // Offer
        offer_badge: 'Special Offer',
        offer_title: '15% Off for Online Booking',
        offer_desc: 'Book your table online today and enjoy 15% off all dishes. Available for groups of 4 or more.',
        offer_btn: 'Book & Get Discount',
    },

    // ====== CHINESE ======
    zh: {
        nav_home: '首页',
        nav_about: '关于我们',
        nav_menu: '菜单',
        nav_gallery: '相册',
        nav_reservation: '预订',
        nav_contact: '联系我们',

        hero_subtitle: '欢迎来到',
        hero_title: '古街餐厅',
        hero_tagline: '宁平古街心脏的传统风味',
        hero_desc: '在充满古街韵味的空间中体验宁平特色美食',
        hero_btn_menu: '查看菜单',
        hero_btn_reserve: '立即预订',

        about_subtitle: '我们的故事',
        about_title: '关于我们',
        about_heading: '古街餐厅 – 宁平美食精华',
        about_badge: '年经验',
        about_p1: '位于<strong>宁平省黎太祖路丁撻免72A号</strong>，古街餐厅为您带来浓郁宁平古街特色的美食空间，每一道菜都讲述着古都的文化故事。',
        about_p2: '凭借十多年的经验，我们自豪地为您呈现宁平最著名的特色菜：锅巴饭、山羊肉、鳝鱼米粉、山螺...选用最新鲜的食材，遵循传统家传秘方精心烹制。',
        feat1_title: '地方特色',
        feat1_desc: '每日新鲜食材',
        feat2_title: '古街氛围',
        feat2_desc: '传统宁平建筑',
        feat3_title: '用心服务',
        feat3_desc: '周到、专业的服务',
        feat4_title: '家传秘方',
        feat4_desc: '浓郁难忘的风味',

        menu_subtitle: '探索风味',
        menu_title: '菜单',
        menu_all: '全部',
        menu_loading: '正在加载菜单...',
        cat_dac_san: '宁平特色菜',
        cat_khai_vi: '开胃菜',
        cat_mon_chinh: '主菜',
        cat_lau: '火锅',
        cat_do_uong: '饮品',
        food_com_chay_name: '宁平锅巴饭',
        food_com_chay_desc: '香脆锅巴配山羊肉与特制酱汁，宁平著名特产',
        food_de_tai_chanh_name: '柠檬山羊肉',
        food_de_tai_chanh_desc: '新鲜山羊肉薄切，柠檬腌制，配香草和米饼',
        food_de_nuong_name: '炭烤山羊肉',
        food_de_nuong_desc: '传统香料腌制山羊肉，炭火烤制',
        food_mien_luon_name: '宁平鳝鱼米粉',
        food_mien_luon_desc: '新鲜田鳝米粉，清甜鲜美汤底',
        food_oc_nui_name: '宁平山螺',
        food_oc_nui_desc: '香茅蒸山螺，蘸姜鱼露，天然甘甜',
        food_nem_ran_name: '传统春卷',
        food_nem_ran_desc: '香脆春卷，猪肉木耳馅',
        food_goi_cuon_name: '鲜虾肉卷',
        food_goi_cuon_desc: '新鲜米皮卷配虾、猪肉和生菜',
        food_ca_kho_name: '砂锅焖鱼',
        food_ca_kho_desc: '浓郁酱汁砂锅焖鱼，配热米饭',
        food_ga_nuong_name: '蜂蜜烤土鸡',
        food_ga_nuong_desc: '蜂蜜烤制散养鸡，皮脆肉嫩',
        food_lau_de_name: '宁平山羊火锅',
        food_lau_de_desc: '宁平传统山羊火锅，浓郁鲜美汤底',
        food_lau_hai_san_name: '酸辣海鲜火锅',
        food_lau_hai_san_desc: '新鲜海鲜火锅，特制酸辣汤底',
        food_tra_sen_name: '宁平莲花茶',
        food_tra_sen_desc: '天然莲花窨制茶，清新芬芳',

        gallery_subtitle: '美丽瞬间',
        gallery_title: '相册',

        res_subtitle: '美妙体验',
        res_title: '预订餐桌',
        res_desc: '提前预订，享受古街餐厅最佳体验',
        res_name: '姓名',
        res_phone: '电话',
        res_email: '邮箱',
        res_guests: '人数',
        res_guests_ph: '选择人数',
        res_date: '日期',
        res_time: '时间',
        res_time_ph: '选择时间',
        res_time_lunch: '午餐',
        res_time_dinner: '晚餐',
        res_note: '备注',
        res_note_ph: '特殊要求、食物过敏...',
        res_submit: '立即预订',
        res_sending: '发送中...',
        res_success_title: '预订成功！',
        res_success_msg: '感谢您在古街餐厅预订。我们将尽快联系您确认。',
        res_close: '关闭',
        res_person: '位',
        res_order_title: '提前点菜',
        res_order_optional: '(可选)',
        res_order_add: '添加菜品',
        res_order_hide: '隐藏',
        res_order_selected: '已选菜品',
        res_order_clear: '清除所有',
        res_order_total: '预估总额：',
        res_order_empty: '暂无菜品',

        ct_subtitle: '与我们联系',
        ct_title: '联系方式',
        ct_address_label: '地址',
        ct_phone_label: '电话',
        ct_email_label: '邮箱',
        ct_hours_label: '营业时间',
        ct_form_title: '发送消息',
        ct_name: '姓名',
        ct_email: '邮箱',
        ct_subject: '标题',
        ct_subject_ph: '消息标题',
        ct_message: '内容',
        ct_message_ph: '您的消息...',
        ct_submit: '发送消息',
        ct_sending: '发送中...',
        map_btn: '<i class="fas fa-map-marked-alt"></i> 在谷歌地图上查看',

        ft_desc: '古街餐厅为您带来传统古街风格中正宗的宁平美食体验。',
        ft_links: '快速链接',
        ft_hours: '营业时间',
        ft_contact: '联系方式',
        ft_weekday: '周一至周五',
        ft_sat: '周六',
        ft_sun: '周日',
        ft_copyright: '© 2026 古街餐厅 - 宁平。版权所有。',

        video_skip: '跳过',

        val_name_required: '请输入姓名（至少2个字符）',
        val_phone_invalid: '电话号码无效',
        val_email_invalid: '邮箱无效',
        val_date_required: '请选择日期',
        val_time_required: '请选择时间',
        val_guests_required: '请选择人数',
        val_name_short: '请输入姓名',
        val_msg_short: '内容至少10个字符',
        toast_contact_success: '感谢您的来信！我们将尽快回复。',
        toast_contact_fallback: '谢谢！您的消息已收到。',

        // Stats
        stat_customers: '服务顾客',
        stat_dishes: '特色菜品',
        stat_years: '年经验',
        stat_reviews: '五星好评',

        // Testimonials
        testi_subtitle: '顾客评价',
        testi_title: '评价',
        testi_1_text: '"这里的烤山羊肉太棒了！空间很美丽高档。服务人员非常周到，一定会再来。"',
        testi_1_name: '阮明英',
        testi_1_role: '河内游客',
        testi_2_text: '"这里的锅巴饭酥脆可口，酱汁浓郁正宗。每次来宁平都会来这里。强烈推荐！"',
        testi_2_name: '陈德辉',
        testi_2_role: '美食博主',
        testi_3_text: '"为公司预订了30人的宴会，从食物到服务一切都很完美。价格合理，质量超出预期！"',
        testi_3_name: '黎秋香',
        testi_3_role: '企业经理',
        testi_4_text: '"山羊火锅超好吃，汤底浓郁。餐厅环境很美，适合全家用餐。会推荐给朋友！"',
        testi_4_name: '范文达',
        testi_4_role: '忠实顾客',

        // Offer
        offer_badge: '特别优惠',
        offer_title: '在线预订享85折',
        offer_desc: '今天在线预订餐桌，即享所有菜品85折优惠。适用于4人及以上团体。',
        offer_btn: '预订享优惠',
    },

    // ====== KOREAN ======
    ko: {
        nav_home: '홈',
        nav_about: '소개',
        nav_menu: '메뉴',
        nav_gallery: '갤러리',
        nav_reservation: '예약',
        nav_contact: '연락처',

        hero_subtitle: '환영합니다',
        hero_title: '포코 레스토랑',
        hero_tagline: '닌빈 고대 거리의 전통 맛',
        hero_desc: '고풍스러운 분위기에서 닌빈 최고의 요리를 경험하세요',
        hero_btn_menu: '메뉴 보기',
        hero_btn_reserve: '예약하기',

        about_subtitle: '우리의 이야기',
        about_title: '소개',
        about_heading: '포코 레스토랑 – 닌빈 미식의 정수',
        about_badge: '년 경력',
        about_p1: '<strong>닌빈성 레타이또 거리 딘딱미엔 72A</strong>에 위치한 포코 레스토랑은 닌빈 고풍스러운 미식 공간을 제공하며, 모든 요리에 고도의 문화 이야기를 담고 있습니다.',
        about_p2: '10년 이상의 경험을 바탕으로 닌빈의 가장 유명한 특산품을 자랑스럽게 제공합니다: 누룽지밥, 산양고기, 장어 쌀국수, 산달팽이... 가장 신선한 재료와 전통 가문의 레시피로 조리됩니다.',
        feat1_title: '지역 특산물',
        feat1_desc: '매일 신선한 식재료',
        feat2_title: '고풍스러운 분위기',
        feat2_desc: '전통 닌빈 건축',
        feat3_title: '정성스러운 서비스',
        feat3_desc: '세심하고 전문적인 서비스',
        feat4_title: '가문의 레시피',
        feat4_desc: '깊고 잊을 수 없는 맛',

        menu_subtitle: '맛의 발견',
        menu_title: '메뉴',
        menu_all: '전체',
        menu_loading: '메뉴 로딩 중...',
        cat_dac_san: '닌빈 특산물',
        cat_khai_vi: '전채요리',
        cat_mon_chinh: '메인요리',
        cat_lau: '전골',
        cat_do_uong: '음료',
        food_com_chay_name: '닌빈 누룽지밥',
        food_com_chay_desc: '바삭한 누룽지에 산양고기와 특제 소스, 닌빈 유명 특산물',
        food_de_tai_chanh_name: '라임 산양고기',
        food_de_tai_chanh_desc: '신선한 산양고기 얇게 썰어 라임에 절인, 허브와 쌀과자 곁들임',
        food_de_nuong_name: '숯불 산양고기',
        food_de_nuong_desc: '전통 양념에 재운 산양고기, 숯불 구이',
        food_mien_luon_name: '닌빈 장어 당면',
        food_mien_luon_desc: '신선한 논장어 당면, 달콤하고 감칠맛 나는 육수',
        food_oc_nui_name: '닌빈 산달팽이',
        food_oc_nui_desc: '레몬그라스로 찐 산달팽이, 생강 피시소스 곁들임',
        food_nem_ran_name: '전통 춘권',
        food_nem_ran_desc: '바삭한 춘권, 돼지고기와 목이버섯 속',
        food_goi_cuon_name: '새우고기 월남쌈',
        food_goi_cuon_desc: '신선한 라이스페이퍼에 새우, 돼지고기, 채소',
        food_ca_kho_name: '뚝배기 조림 생선',
        food_ca_kho_desc: '진한 카라멜 소스 뚝배기 생선, 뜨거운 밥 곁들임',
        food_ga_nuong_name: '꿀 구이 토종닭',
        food_ga_nuong_desc: '꿀로 구운 방목 토종닭, 바삭한 껍질과 부드러운 고기',
        food_lau_de_name: '닌빈 산양 전골',
        food_lau_de_desc: '닌빈 전통 산양 전골, 진한 감칠맛 육수',
        food_lau_hai_san_name: '매운 해산물 전골',
        food_lau_hai_san_desc: '신선한 해산물 전골, 특제 매콤새콤 육수',
        food_tra_sen_name: '닌빈 연꽃차',
        food_tra_sen_desc: '천연 연꽃 향 차, 상쾌하고 향기로운',

        gallery_subtitle: '아름다운 순간',
        gallery_title: '갤러리',

        res_subtitle: '멋진 경험',
        res_title: '예약',
        res_desc: '포코 레스토랑에서 최고의 경험을 위해 미리 예약하세요',
        res_name: '이름',
        res_phone: '전화번호',
        res_email: '이메일',
        res_guests: '인원',
        res_guests_ph: '인원 선택',
        res_date: '날짜',
        res_time: '시간',
        res_time_ph: '시간 선택',
        res_time_lunch: '점심',
        res_time_dinner: '저녁',
        res_note: '추가 메모',
        res_note_ph: '특별 요청, 식품 알레르기...',
        res_submit: '지금 예약',
        res_sending: '전송 중...',
        res_success_title: '예약 성공!',
        res_success_msg: '포코 레스토랑에 예약해 주셔서 감사합니다. 곧 확인 연락을 드리겠습니다.',
        res_close: '닫기',
        res_person: '명',
        res_order_title: '사전 주문',
        res_order_optional: '(선택사항)',
        res_order_add: '메뉴 추가',
        res_order_hide: '숨기기',
        res_order_selected: '선택된 메뉴',
        res_order_clear: '모두 삭제',
        res_order_total: '예상 총액:',
        res_order_empty: '메뉴가 없습니다',

        ct_subtitle: '연락하기',
        ct_title: '연락처',
        ct_address_label: '주소',
        ct_phone_label: '전화',
        ct_email_label: '이메일',
        ct_hours_label: '영업시간',
        ct_form_title: '메시지 보내기',
        ct_name: '이름',
        ct_email: '이메일',
        ct_subject: '제목',
        ct_subject_ph: '메시지 제목',
        ct_message: '내용',
        ct_message_ph: '메시지를 입력하세요...',
        ct_submit: '메시지 보내기',
        ct_sending: '전송 중...',
        map_btn: '<i class="fas fa-map-marked-alt"></i> Google Maps에서 보기',

        ft_desc: '포코 레스토랑은 전통적인 고풍스러운 공간에서 정통 닌빈 요리 경험을 제공합니다.',
        ft_links: '빠른 링크',
        ft_hours: '영업시간',
        ft_contact: '연락처',
        ft_weekday: '월 - 금',
        ft_sat: '토요일',
        ft_sun: '일요일',
        ft_copyright: '© 2026 포코 레스토랑 - 닌빈. All rights reserved.',

        video_skip: '건너뛰기',

        val_name_required: '이름을 입력하세요 (최소 2자)',
        val_phone_invalid: '유효하지 않은 전화번호',
        val_email_invalid: '유효하지 않은 이메일',
        val_date_required: '날짜를 선택하세요',
        val_time_required: '시간을 선택하세요',
        val_guests_required: '인원을 선택하세요',
        val_name_short: '이름을 입력하세요',
        val_msg_short: '내용은 최소 10자 이상이어야 합니다',
        toast_contact_success: '연락해 주셔서 감사합니다! 곧 답변 드리겠습니다.',
        toast_contact_fallback: '감사합니다! 메시지가 접수되었습니다.',

        // Stats
        stat_customers: '고객 서비스',
        stat_dishes: '특별 요리',
        stat_years: '년 경력',
        stat_reviews: '5성 리뷰',

        // Testimonials
        testi_subtitle: '고객 후기',
        testi_title: '리뷰',
        testi_1_text: '"이곳의 숯불 산양고기는 정말 훌륭합니다! 아름답고 고급스러운 공간. 직원들이 매우 친절하고, 반드시 다시 올 것입니다."',
        testi_1_name: '응우옌 민 아인',
        testi_1_role: '하노이 관광객',
        testi_2_text: '"이곳 누룽지밥이 정말 바삭바삭하고 소스가 전통 맛 그대로입니다. 닌빈에 올 때마다 여기에 옵니다. 강력 추천!"',
        testi_2_name: '쩐 득 후이',
        testi_2_role: '푸드 블로거',
        testi_3_text: '"회사 30인 연회를 예약했는데, 음식부터 서비스까지 모두 완벽했습니다. 합리적인 가격에 기대 이상의 품질!"',
        testi_3_name: '레 투 흐엉',
        testi_3_role: '기업 매니저',
        testi_4_text: '"산양 전골이 정말 맛있고 육수가 진합니다. 레스토랑 뷰도 아름답고 가족 식사에 딱입니다. 친구들에게 추천할 것입니다!"',
        testi_4_name: '팜 반 닷',
        testi_4_role: '단골 고객',

        // Offer
        offer_badge: '특별 혜택',
        offer_title: '온라인 예약 시 15% 할인',
        offer_desc: '오늘 온라인으로 테이블을 예약하고 모든 요리에서 15% 할인을 받으세요. 4인 이상 그룹에 적용됩니다.',
        offer_btn: '예약 & 할인 받기',
    }
};

// Language metadata for the switcher
const LANG_META = {
    vi: { flag: '🇻🇳', label: 'Tiếng Việt', short: 'VI' },
    en: { flag: '🇬🇧', label: 'English', short: 'EN' },
    zh: { flag: '🇨🇳', label: '中文', short: '中文' },
    ko: { flag: '🇰🇷', label: '한국어', short: '한국' }
};

// =====================================================
// i18n ENGINE
// =====================================================
let currentLang = localStorage.getItem('lang') || 'vi';

function t(key) {
    return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key])
        || (TRANSLATIONS.vi && TRANSLATIONS.vi[key])
        || key;
}

function applyLanguage(lang) {
    if (!TRANSLATIONS[lang]) lang = 'vi';
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;

    // Update all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = t(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            // For placeholder
        } else {
            el.innerHTML = val;
        }
    });

    // Update all data-i18n-placeholder elements
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        el.placeholder = t(key);
    });

    // Update data-i18n-placeholder on custom select value spans
    document.querySelectorAll('[data-i18n-value]').forEach(el => {
        const key = el.getAttribute('data-i18n-value');
        if (!el.classList.contains('has-value')) {
            el.textContent = t(key);
        }
        el.setAttribute('data-placeholder', t(key));
    });

    // Update guest options text (e.g. "1 người" → "1 guests")
    const personUnit = t('res_person');
    document.querySelectorAll('#guestsSelect .custom-select__option').forEach(opt => {
        const val = opt.getAttribute('data-value');
        const icon = opt.querySelector('i');
        const iconHTML = icon ? icon.outerHTML + ' ' : '';
        if (parseInt(val) <= 5) {
            opt.innerHTML = iconHTML + val + ' ' + personUnit;
        } else if (val === '6') {
            opt.innerHTML = iconHTML + '6-8 ' + personUnit;
        } else if (val === '10') {
            opt.innerHTML = iconHTML + '8-10 ' + personUnit;
        } else if (val === '15') {
            opt.innerHTML = iconHTML + '10-15 ' + personUnit;
        } else if (val === '20') {
            opt.innerHTML = iconHTML + '15-20 ' + personUnit;
        } else if (val === '30') {
            opt.innerHTML = iconHTML + '20-30 ' + personUnit;
        } else if (val === '50') {
            opt.innerHTML = iconHTML + '30+ ' + personUnit;
        }
    });

    // Update time group labels
    document.querySelectorAll('#timeSelect .custom-select__group-label').forEach((label, i) => {
        label.textContent = i === 0 ? t('res_time_lunch') : t('res_time_dinner');
    });

    // Update lang switcher display
    updateLangSwitcherDisplay(lang);

    // Re-render menu items with new language
    if (typeof refreshMenuLanguage === 'function') {
        refreshMenuLanguage();
    }
}

function updateLangSwitcherDisplay(lang) {
    const current = document.getElementById('currentLang');
    const currentFlag = document.getElementById('currentFlag');
    if (current) current.textContent = LANG_META[lang].short;
    if (currentFlag) currentFlag.textContent = LANG_META[lang].flag;

    // Highlight active option
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });
}

function initLanguageSwitcher() {
    const switcher = document.getElementById('langSwitcher');
    if (!switcher) return;

    const trigger = switcher.querySelector('.lang-trigger');
    const dropdown = switcher.querySelector('.lang-dropdown');

    // Toggle dropdown
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        switcher.classList.toggle('open');
    });

    // Select language
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.addEventListener('click', () => {
            const lang = opt.getAttribute('data-lang');
            applyLanguage(lang);
            switcher.classList.remove('open');
        });
    });

    // Close on outside click
    document.addEventListener('click', () => {
        switcher.classList.remove('open');
    });

    dropdown.addEventListener('click', (e) => e.stopPropagation());

    // Apply saved language on load
    applyLanguage(currentLang);
}
