export interface ContactData {
  name?: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  [key: string]: string | undefined;
}

export interface SavedContact {
  id: string;
  user_id: string;
  contact_data: ContactData;
  card_design: string;
  card_color: string;
  category: string;
  career_tag: string | null;
  career_sub_tag: string | null;
  status: string;
  custom_tag: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CardTemplate {
  id: string;
  user_id: string;
  template_name: string;
  selected_fields: string[];
  design_style: string;
  color_scheme: string;
  is_default: boolean;
}

export interface CareerCategory {
  id: string;
  name: string;
  name_vi: string;
  subcategories?: CareerSubcategory[];
}

export interface CareerSubcategory {
  id: string;
  category_id: string;
  name: string;
  name_vi: string;
}

export const CONTACT_CATEGORIES = [
  "Company", "Acquaintances", "Customers", "Suppliers", "Services", "Neighbors", "Others"
] as const;

export const STATUS_OPTIONS = [
  { value: "Normal", color: "bg-muted text-muted-foreground" },
  { value: "Important", color: "bg-amber-500/20 text-amber-700 dark:text-amber-400" },
  { value: "C-level", color: "bg-violet-500/20 text-violet-700 dark:text-violet-400" },
  { value: "Officials", color: "bg-blue-500/20 text-blue-700 dark:text-blue-400" },
  { value: "Expired", color: "bg-red-500/20 text-red-600 dark:text-red-400" },
] as const;

export const CARD_DESIGNS = [
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "minimal", label: "Minimal" },
  { id: "bold", label: "Bold" },
  { id: "gradient", label: "Gradient" },
  { id: "elegant", label: "Elegant" },
] as const;

export const CARD_COLORS: string[] = [
  "#1a1a2e", "#16213e", "#0f3460", "#533483",
  "#e94560", "#2d6a4f", "#bc6c25", "#023047",
  "#264653", "#2a9d8f", "#e76f51", "#6d6875",
  "#1d3557", "#457b9d", "#e63946", "#fca311",
];

export const CARD_FIELDS = [
  { key: "name", label: "Full Name", icon: "👤" },
  { key: "title", label: "Job Title", icon: "💼" },
  { key: "company", label: "Company", icon: "🏢" },
  { key: "email", label: "Email", icon: "✉️" },
  { key: "phone", label: "Phone", icon: "📞" },
  { key: "address", label: "Address", icon: "📍" },
  { key: "website", label: "Website", icon: "🌐" },
  { key: "facebook", label: "Facebook", icon: "📘" },
  { key: "instagram", label: "Instagram", icon: "📸" },
  { key: "tiktok", label: "TikTok", icon: "🎵" },
] as const;

export const MOCK_CAREER_CATEGORIES: { name: string; name_vi: string; subs: { name: string; name_vi: string }[] }[] = [
  { name: "Marketing", name_vi: "Tiếp thị", subs: [
    { name: "Advertising", name_vi: "Quảng cáo" }, { name: "Promotion", name_vi: "Khuyến mãi" },
    { name: "Branding", name_vi: "Xây dựng thương hiệu" }, { name: "Digital Marketing", name_vi: "Marketing số" },
    { name: "Content Marketing", name_vi: "Marketing nội dung" }, { name: "SEO/SEM", name_vi: "SEO/SEM" },
    { name: "Social Media", name_vi: "Mạng xã hội" },
  ]},
  { name: "Finance", name_vi: "Tài chính", subs: [
    { name: "Banking", name_vi: "Ngân hàng" }, { name: "Investment", name_vi: "Đầu tư" },
    { name: "Insurance", name_vi: "Bảo hiểm" }, { name: "Accounting", name_vi: "Kế toán" },
    { name: "Auditing", name_vi: "Kiểm toán" }, { name: "Tax Consulting", name_vi: "Tư vấn thuế" },
  ]},
  { name: "Medical", name_vi: "Y tế", subs: [
    { name: "General Practice", name_vi: "Đa khoa" }, { name: "Surgery", name_vi: "Phẫu thuật" },
    { name: "Dentistry", name_vi: "Nha khoa" }, { name: "Pharmacy", name_vi: "Dược" },
    { name: "Nursing", name_vi: "Điều dưỡng" }, { name: "Mental Health", name_vi: "Sức khỏe tâm thần" },
    { name: "Traditional Medicine", name_vi: "Đông y" },
  ]},
  { name: "Technology", name_vi: "Công nghệ", subs: [
    { name: "Software Development", name_vi: "Phát triển phần mềm" }, { name: "Data Science", name_vi: "Khoa học dữ liệu" },
    { name: "Cybersecurity", name_vi: "An ninh mạng" }, { name: "Cloud Computing", name_vi: "Điện toán đám mây" },
    { name: "AI/ML", name_vi: "AI/ML" }, { name: "DevOps", name_vi: "DevOps" },
    { name: "Mobile Development", name_vi: "Phát triển di động" },
  ]},
  { name: "Education", name_vi: "Giáo dục", subs: [
    { name: "Teaching", name_vi: "Giảng dạy" }, { name: "Research", name_vi: "Nghiên cứu" },
    { name: "Training", name_vi: "Đào tạo" }, { name: "Tutoring", name_vi: "Gia sư" },
    { name: "E-learning", name_vi: "Học trực tuyến" }, { name: "Curriculum Design", name_vi: "Thiết kế chương trình" },
  ]},
  { name: "Legal", name_vi: "Pháp luật", subs: [
    { name: "Corporate Law", name_vi: "Luật doanh nghiệp" }, { name: "Criminal Law", name_vi: "Luật hình sự" },
    { name: "Civil Law", name_vi: "Luật dân sự" }, { name: "Labor Law", name_vi: "Luật lao động" },
    { name: "Intellectual Property", name_vi: "Sở hữu trí tuệ" }, { name: "Notary", name_vi: "Công chứng" },
  ]},
  { name: "Real Estate", name_vi: "Bất động sản", subs: [
    { name: "Residential", name_vi: "Nhà ở" }, { name: "Commercial", name_vi: "Thương mại" },
    { name: "Property Management", name_vi: "Quản lý tài sản" }, { name: "Valuation", name_vi: "Định giá" },
    { name: "Construction", name_vi: "Xây dựng" }, { name: "Interior Design", name_vi: "Thiết kế nội thất" },
  ]},
  { name: "Hospitality", name_vi: "Nhà hàng - Khách sạn", subs: [
    { name: "Hotel Management", name_vi: "Quản lý khách sạn" }, { name: "Restaurant", name_vi: "Nhà hàng" },
    { name: "Tourism", name_vi: "Du lịch" }, { name: "Event Planning", name_vi: "Tổ chức sự kiện" },
    { name: "Catering", name_vi: "Dịch vụ tiệc" }, { name: "Travel Agency", name_vi: "Đại lý du lịch" },
  ]},
  { name: "Manufacturing", name_vi: "Sản xuất", subs: [
    { name: "Production", name_vi: "Sản xuất" }, { name: "Quality Control", name_vi: "Kiểm soát chất lượng" },
    { name: "Supply Chain", name_vi: "Chuỗi cung ứng" }, { name: "Logistics", name_vi: "Logistics" },
    { name: "Warehouse", name_vi: "Kho vận" }, { name: "Import/Export", name_vi: "Xuất nhập khẩu" },
  ]},
  { name: "Media", name_vi: "Truyền thông", subs: [
    { name: "Journalism", name_vi: "Báo chí" }, { name: "Broadcasting", name_vi: "Phát thanh truyền hình" },
    { name: "Publishing", name_vi: "Xuất bản" }, { name: "Photography", name_vi: "Nhiếp ảnh" },
    { name: "Videography", name_vi: "Quay phim" }, { name: "Public Relations", name_vi: "Quan hệ công chúng" },
  ]},
  { name: "Design", name_vi: "Thiết kế", subs: [
    { name: "Graphic Design", name_vi: "Thiết kế đồ họa" }, { name: "UI/UX", name_vi: "UI/UX" },
    { name: "Fashion Design", name_vi: "Thiết kế thời trang" }, { name: "Product Design", name_vi: "Thiết kế sản phẩm" },
    { name: "Architecture", name_vi: "Kiến trúc" }, { name: "Animation", name_vi: "Hoạt hình" },
  ]},
  { name: "Agriculture", name_vi: "Nông nghiệp", subs: [
    { name: "Farming", name_vi: "Trồng trọt" }, { name: "Livestock", name_vi: "Chăn nuôi" },
    { name: "Aquaculture", name_vi: "Nuôi trồng thủy sản" }, { name: "Agritech", name_vi: "Nông nghiệp CN" },
    { name: "Food Processing", name_vi: "Chế biến thực phẩm" }, { name: "Organic Farming", name_vi: "Hữu cơ" },
  ]},
  { name: "Transportation", name_vi: "Vận tải", subs: [
    { name: "Shipping", name_vi: "Vận chuyển" }, { name: "Aviation", name_vi: "Hàng không" },
    { name: "Public Transit", name_vi: "Giao thông công cộng" }, { name: "Freight", name_vi: "Vận tải hàng hóa" },
    { name: "Ride-sharing", name_vi: "Xe công nghệ" }, { name: "Maritime", name_vi: "Hàng hải" },
  ]},
  { name: "Energy", name_vi: "Năng lượng", subs: [
    { name: "Oil & Gas", name_vi: "Dầu khí" }, { name: "Solar", name_vi: "Năng lượng mặt trời" },
    { name: "Wind", name_vi: "Năng lượng gió" }, { name: "Electricity", name_vi: "Điện lực" },
    { name: "Nuclear", name_vi: "Hạt nhân" }, { name: "Green Energy", name_vi: "Năng lượng xanh" },
  ]},
  { name: "Government", name_vi: "Chính phủ", subs: [
    { name: "Public Administration", name_vi: "Hành chính công" }, { name: "Diplomacy", name_vi: "Ngoại giao" },
    { name: "Military", name_vi: "Quân đội" }, { name: "Police", name_vi: "Công an" },
    { name: "Tax Authority", name_vi: "Thuế" }, { name: "Social Services", name_vi: "Dịch vụ xã hội" },
  ]},
  { name: "Retail", name_vi: "Bán lẻ", subs: [
    { name: "E-commerce", name_vi: "Thương mại điện tử" }, { name: "Supermarket", name_vi: "Siêu thị" },
    { name: "Fashion Retail", name_vi: "Bán lẻ thời trang" }, { name: "Electronics", name_vi: "Điện tử" },
    { name: "FMCG", name_vi: "Hàng tiêu dùng" }, { name: "Luxury Goods", name_vi: "Hàng xa xỉ" },
  ]},
  { name: "HR & Recruitment", name_vi: "Nhân sự", subs: [
    { name: "Talent Acquisition", name_vi: "Tuyển dụng" }, { name: "Compensation", name_vi: "Lương thưởng" },
    { name: "Employee Relations", name_vi: "Quan hệ nhân viên" }, { name: "Training & Dev", name_vi: "Đào tạo phát triển" },
    { name: "Headhunting", name_vi: "Headhunting" }, { name: "HR Consulting", name_vi: "Tư vấn nhân sự" },
  ]},
];

export const MOCK_CONTACTS: Omit<SavedContact, "user_id">[] = [
  {
    id: "mc1", contact_data: { name: "Trần Văn Minh", title: "Marketing Director", company: "VinGroup", email: "minh@vingroup.vn", phone: "0901234567" },
    card_design: "modern", card_color: "#1d3557", category: "Company", career_tag: "Marketing", career_sub_tag: "Branding",
    status: "Important", custom_tag: "Ho Chi Minh", notes: null, created_at: "2026-03-01T10:00:00Z", updated_at: "2026-03-01T10:00:00Z",
  },
  {
    id: "mc2", contact_data: { name: "Nguyễn Thị Lan", title: "CFO", company: "FPT Corporation", email: "lan.nt@fpt.com.vn", phone: "0912345678" },
    card_design: "elegant", card_color: "#533483", category: "Customers", career_tag: "Finance", career_sub_tag: "Investment",
    status: "C-level", custom_tag: "Hanoi", notes: null, created_at: "2026-02-15T08:00:00Z", updated_at: "2026-02-15T08:00:00Z",
  },
  {
    id: "mc3", contact_data: { name: "Lê Hoàng Nam", title: "Senior Developer", company: "Grab Vietnam", email: "nam.lh@grab.com", phone: "0923456789" },
    card_design: "classic", card_color: "#2d6a4f", category: "Acquaintances", career_tag: "Technology", career_sub_tag: "Software Development",
    status: "Normal", custom_tag: "Old friend", notes: null, created_at: "2025-11-01T09:00:00Z", updated_at: "2025-11-01T09:00:00Z",
  },
  {
    id: "mc4", contact_data: { name: "Phạm Minh Châu", title: "Head of Surgery", company: "Chợ Rẫy Hospital", email: "chau.pm@choray.vn", phone: "0934567890" },
    card_design: "bold", card_color: "#e94560", category: "Services", career_tag: "Medical", career_sub_tag: "Surgery",
    status: "Officials", custom_tag: null, notes: null, created_at: "2026-01-20T14:00:00Z", updated_at: "2026-01-20T14:00:00Z",
  },
  {
    id: "mc5", contact_data: { name: "Võ Thanh Tùng", title: "Property Consultant", company: "CBRE Vietnam", email: "tung.vt@cbre.com.vn", phone: "0945678901" },
    card_design: "gradient", card_color: "#0f3460", category: "Suppliers", career_tag: "Real Estate", career_sub_tag: "Commercial",
    status: "Normal", custom_tag: "District 2", notes: null, created_at: "2025-12-01T11:00:00Z", updated_at: "2025-12-01T11:00:00Z",
  },
  {
    id: "mc6", contact_data: { name: "Đặng Thùy Dung", title: "Brand Manager", company: "Unilever Vietnam", email: "dung.dt@unilever.com", phone: "0956789012", website: "unilever.com.vn" },
    card_design: "minimal", card_color: "#264653", category: "Company", career_tag: "Marketing", career_sub_tag: "Advertising",
    status: "Normal", custom_tag: null, notes: null, created_at: "2026-03-10T16:00:00Z", updated_at: "2026-03-10T16:00:00Z",
  },
  {
    id: "mc7", contact_data: { name: "Bùi Quốc Khánh", title: "Lawyer", company: "Baker McKenzie", email: "khanh.bq@bakermckenzie.com", phone: "0967890123" },
    card_design: "elegant", card_color: "#023047", category: "Services", career_tag: "Legal", career_sub_tag: "Corporate Law",
    status: "Important", custom_tag: "Ho Chi Minh", notes: null, created_at: "2026-02-28T12:00:00Z", updated_at: "2026-02-28T12:00:00Z",
  },
  {
    id: "mc8", contact_data: { name: "Hoàng Anh Tuấn", title: "Chef", company: "Park Hyatt Saigon", email: "tuan.ha@hyatt.com", phone: "0978901234" },
    card_design: "bold", card_color: "#bc6c25", category: "Neighbors", career_tag: "Hospitality", career_sub_tag: "Restaurant",
    status: "Normal", custom_tag: "Cooking class", notes: null, created_at: "2025-10-15T07:00:00Z", updated_at: "2025-10-15T07:00:00Z",
  },
];