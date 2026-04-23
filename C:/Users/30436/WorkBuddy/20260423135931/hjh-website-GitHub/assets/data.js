/**
 * 网站数据中心 - 上海泓锦浩机械科技有限公司
 * 修改此文件中的数据即可更新网站内容
 */
const SiteData = {

  company: {
    name: '上海泓锦浩机械科技有限公司',
    shortName: '泓锦浩机械科技',
    slogan: '专业 · 精密 · 可靠',
    description: '专注精密机械领域，为您提供高品质的机械设备与技术服务解决方案。',
    founded: '2015',
    address: '上海市',
    phone: '请通过联系页面获取',
    email: 'contact@hongjinhao.com',
    wechat: '请扫码获取',
  },

  stats: [
    { num: 10, unit: '+', label: '年行业经验' },
    { num: 200, unit: '+', label: '合作客户' },
    { num: 50, unit: '+', label: '产品种类' },
    { num: 98, unit: '%', label: '客户满意度' },
  ],

  products: [
    {
      id: 1, category: '相机标定', cat_key: 'calibration',
      name: '高精度棋盘格标定板', emoji: '📷',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
      bg: 'linear-gradient(135deg,#fff3e0,#ffe0b2)',
      desc: '专业级棋盘格相机标定靶，高对比度印刷，角点提取精准，适用于各类视觉系统。',
      tags: ['机器视觉', '自动驾驶', '3D检测'],
    },
    {
      id: 2, category: '精密大理石', cat_key: 'marble',
      name: '精密大理石平台', emoji: '🪨',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
      bg: 'linear-gradient(135deg,#e8f4fd,#dbeafe)',
      desc: '优质天然大理石制作，平面精度高，热膨胀系数小，广泛用于精密测量与检测。',
      tags: ['测量平台', '精密检测', '工业制造'],
    },
    {
      id: 3, category: '贸易产品', cat_key: 'trade',
      name: '工业传感器及控制系统', emoji: '🔧',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=400&fit=crop',
      bg: 'linear-gradient(135deg,#e8f8e8,#dcfce7)',
      desc: '各类工业传感器、控制模块及配套系统，为自动化生产线提供可靠的检测控制方案。',
      tags: ['传感器', '控制系统', '自动化'],
    },
    {
      id: 4, category: '相机标定', cat_key: 'calibration',
      name: 'ArUco 码标定靶', emoji: '🎯',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
      bg: 'linear-gradient(135deg,#f3e5f5,#ede9fe)',
      desc: 'ArUco / ChArUco 标定靶，支持多标定板组合，适用于大视场及机器人手眼标定。',
      tags: ['机器人', '手眼标定', '大视场'],
    },
    {
      id: 5, category: '精密大理石', cat_key: 'marble',
      name: '大理石检测靠铁套件', emoji: '📐',
      image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&h=400&fit=crop',
      bg: 'linear-gradient(135deg,#e0f7fa,#cffafe)',
      desc: '配套大理石检测靠铁、直角尺、V型铁等精密工具，满足工件三维测量需求。',
      tags: ['三维测量', '检测工具', '精密仪器'],
    },
    {
      id: 6, category: '贸易产品', cat_key: 'trade',
      name: '智能仪器仪表系列', emoji: '⚗️',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop',
      bg: 'linear-gradient(135deg,#fce4ec,#ffe4e6)',
      desc: '涵盖温度、压力、流量等多类智能仪表，支持数据采集与工业通信协议对接。',
      tags: ['智能仪表', '数据采集', 'Modbus'],
    },
    {
      id: 7, category: '技术服务', cat_key: 'service',
      name: '机器视觉系统集成', emoji: '👁',
      image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&h=400&fit=crop',
      bg: 'linear-gradient(135deg,#fff9c4,#fef9c3)',
      desc: '提供从相机选型、镜头匹配到标定软件的全链路机器视觉系统集成服务。',
      tags: ['视觉集成', '算法开发', '标定服务'],
    },
    {
      id: 8, category: '贸易产品', cat_key: 'trade',
      name: '工业模具及零部件', emoji: '⚙️',
      image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600&h=400&fit=crop',
      bg: 'linear-gradient(135deg,#e8f4fd,#bfdbfe)',
      desc: '各类工业模具、机械零部件的销售与定制服务，满足制造业多样化采购需求。',
      tags: ['模具', '零部件', '定制加工'],
    },
    {
      id: 9, category: '技术服务', cat_key: 'service',
      name: '企业数字化技术咨询', emoji: '💡',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      bg: 'linear-gradient(135deg,#e8f8e8,#bbf7d0)',
      desc: '为企业提供数字化转型规划、技术选型、系统架构设计等全方位技术咨询服务。',
      tags: ['数字化', '咨询服务', '技术规划'],
    },
  ],

  // 关于我们页内容（可在后台编辑）
  about: {
    intro: '上海泓锦浩机械科技有限公司成立于上海，是一家专注于精密机械科技领域的综合性科技企业。公司深耕贸易产品、相机标定、精密大理石三大核心业务板块，同时提供技术服务、仪器仪表销售及企业管理咨询等全方位服务。',
    para2: '凭借专业技术团队和严格的质量管控体系，我们致力于为客户提供高精度、高可靠性的产品与解决方案。多年来，我们服务于汽车、航空、电子、医疗、半导体等多个高端制造业领域，赢得了众多客户的高度信任与长期合作。',
    para3: '展望未来，泓锦浩将继续深化技术研发投入，拓展业务边界，以更优质的产品和服务回报每一位合作伙伴，共同推动中国精密制造业的高质量发展。',
  },

  // 联系页表单选项
  inquiryTypes: ['产品询价', '技术咨询', '合作洽谈', '售后服务', '其他'],

  // 首页 Hero（可后台编辑）
  hero: {
    title: '上海泓锦浩机械科技有限公司',
    subtitle: '专注贸易产品、相机标定、精密大理石等精密机械领域\n为您提供全方位的机械设备与技术服务解决方案',
  },

  // 后台数据（演示）
  admin: {
    messages: [
      { id: 1, name: '张先生', company: '某汽车零部件', subject: '精密大理石平台询价', date: '2026-04-22', status: '待处理' },
      { id: 2, name: '李工',   company: '某自动化企业', subject: '相机标定板技术咨询', date: '2026-04-21', status: '已回复' },
      { id: 3, name: '王总',   company: '某仪器企业',   subject: '仪器仪表批量采购',   date: '2026-04-20', status: '已回复' },
      { id: 4, name: '赵经理', company: '某制造厂',     subject: '模具定制合作',       date: '2026-04-19', status: '跟进中' },
      { id: 5, name: '陈博士', company: '某研究院',     subject: '机器视觉系统集成',   date: '2026-04-18', status: '已关闭' },
    ],
    products_count: 9,
    messages_count: 5,
    visitors_today: 128,
    inquiries_month: 34,
  },
};
