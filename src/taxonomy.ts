/**
 * Built-in industry taxonomy anchor table: a curated subset of the 国民经济行业
 * 分类 (GB/T 4754-2017) 大类 (major classes), each carrying its two-digit code,
 * standard name, and anchor keywords. Chain nodes may declare a `taxonomyCode`;
 * validation requires it to hit this table and fails loud otherwise.
 * @module dsh-industry-research/taxonomy
 */

/** One taxonomy anchor entry. */
export interface TaxonomyEntry {
  /** Two-digit 大类 code (e.g. `15`). */
  code: string
  /** Standard Chinese name of the major class. */
  name: string
  /** Anchor keywords for fuzzy mapping and validation guidance. */
  keywords: readonly string[]
}

/** The built-in anchor table (curated 大类 subset, not the full 97-class roster). */
export const INDUSTRY_TAXONOMY: readonly TaxonomyEntry[] = [
  { code: '01', name: '农业', keywords: ['种植', '农作物', '粮食', '谷物'] },
  { code: '02', name: '林业', keywords: ['林木', '造林', '森林'] },
  { code: '03', name: '畜牧业', keywords: ['养殖', '畜禽', '饲料'] },
  { code: '04', name: '渔业', keywords: ['水产', '捕捞', '养殖'] },
  { code: '06', name: '煤炭开采和洗选业', keywords: ['煤炭', '采煤', '洗选'] },
  { code: '07', name: '石油和天然气开采业', keywords: ['石油', '天然气', '开采'] },
  { code: '09', name: '有色金属矿采选业', keywords: ['有色金属', '铜矿', '铝矿'] },
  { code: '13', name: '农副食品加工业', keywords: ['粮油', '屠宰', '肉制品', '植物油', '制糖'] },
  { code: '14', name: '食品制造业', keywords: ['焙烤食品', '糖果', '乳制品', '调味品', '方便食品'] },
  { code: '15', name: '酒、饮料和精制茶制造业', keywords: ['白酒', '啤酒', '葡萄酒', '黄酒', '饮料', '茶', '酿酒'] },
  { code: '16', name: '烟草制品业', keywords: ['烟草', '卷烟'] },
  { code: '17', name: '纺织业', keywords: ['棉纺', '化纤', '面料', '纱线'] },
  { code: '20', name: '木材加工和木、竹、藤、棕、草制品业', keywords: ['木材', '人造板', '竹制品'] },
  { code: '22', name: '造纸和纸制品业', keywords: ['造纸', '纸浆', '纸制品'] },
  { code: '25', name: '石油、煤炭及其他燃料加工业', keywords: ['炼油', '焦化', '燃料加工'] },
  { code: '26', name: '化学原料和化学制品制造业', keywords: ['化工', '化学原料', '涂料', '化肥'] },
  { code: '27', name: '医药制造业', keywords: ['制药', '药品', '疫苗', '原料药', '生物药'] },
  { code: '29', name: '橡胶和塑料制品业', keywords: ['橡胶', '塑料', '轮胎'] },
  { code: '30', name: '非金属矿物制品业', keywords: ['水泥', '玻璃', '陶瓷'] },
  { code: '31', name: '黑色金属冶炼和压延加工业', keywords: ['钢铁', '炼钢', '轧钢'] },
  { code: '32', name: '有色金属冶炼和压延加工业', keywords: ['电解铝', '铜冶炼', '铝加工'] },
  { code: '33', name: '金属制品业', keywords: ['金属制品', '五金', '紧固件'] },
  { code: '34', name: '通用设备制造业', keywords: ['通用设备', '泵', '阀门', '机床'] },
  { code: '35', name: '专用设备制造业', keywords: ['专用设备', '工程机械', '医疗器械', '农机'] },
  { code: '36', name: '汽车制造业', keywords: ['汽车', '整车', '零部件', '新能源汽车'] },
  { code: '37', name: '铁路、船舶、航空航天和其他运输设备制造业', keywords: ['轨道交通', '船舶', '航空航天', '运输设备'] },
  { code: '38', name: '电气机械和器材制造业', keywords: ['电气', '电机', '家电', '电池', '线缆'] },
  { code: '39', name: '计算机、通信和其他电子设备制造业', keywords: ['半导体', '集成电路', '通信设备', '消费电子', '电子元件'] },
  { code: '40', name: '仪器仪表制造业', keywords: ['仪器', '仪表', '传感器'] },
  { code: '44', name: '电力、热力生产和供应业', keywords: ['电力', '发电', '电网', '热力'] },
  { code: '63', name: '电信、广播电视和卫星传输服务', keywords: ['电信', '通信服务', '广播电视'] },
  { code: '64', name: '互联网和相关服务', keywords: ['互联网', '平台', '在线服务'] },
  { code: '65', name: '软件和信息技术服务业', keywords: ['软件', '信息技术', '云计算', '大数据'] },
  { code: '66', name: '货币金融服务', keywords: ['银行', '货币', '金融'] },
  { code: '67', name: '资本市场服务', keywords: ['证券', '基金', '资本市场'] },
  { code: '68', name: '保险业', keywords: ['保险', '寿险', '财险'] },
  { code: '70', name: '房地产业', keywords: ['房地产', '开发', '物业'] },
  { code: '73', name: '研究和试验发展', keywords: ['研发', '试验发展', '科研'] },
  { code: '74', name: '专业技术服务业', keywords: ['检测', '认证', '咨询', '专业技术'] },
]

/**
 * Look up a taxonomy entry by its two-digit code.
 * @param code - the candidate code.
 * @returns the entry, or undefined when the code is unknown.
 */
export function taxonomyEntry(code: string): TaxonomyEntry | undefined {
  return INDUSTRY_TAXONOMY.find(entry => entry.code === code)
}
