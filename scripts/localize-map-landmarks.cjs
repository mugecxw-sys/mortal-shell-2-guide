const fs = require('node:fs');
const path = require('node:path');

const mapFile = path.join(__dirname, '..', 'assets', 'map-landmarks.json');

// Names below are only used where a Chinese point name can be matched to a
// shipped English StringTable entry or an in-game UI label.
const categories = {
  '余露石': 'Tarstone', '心石': 'Heartstone', '信标': 'Beacon', '地牢': 'Dungeon',
  '瞬悟': 'Glimpse', '换钱道具': 'Valuable', 'NPC': 'NPC', '红石': 'Red Stone',
  'BOSS': 'Boss', '钥匙': 'Key', '突触血管': 'Synaptic Vessel', '烧焦的人偶': 'Burnt Effigy',
  '天尊腺体': 'Gland', '文档': 'Document', '圣卵': 'Sacred Egg', '地图碎片': 'Map Fragment',
  '雷霆碎片': 'Galvanic Shard', '檐盖菇': 'Weltcap', '重要道具': 'Key Item',
  '背甲石': 'Carapace Stone', '腐化屏障': 'Corruption Wall', '躯壳': 'Shell',
  '堕落雕像': 'Corrupted Statue', '副武器': 'Sidearm', '上锁的门': 'Locked Door',
  '商人': 'Merchant', '大门': 'Gate', '传送门': 'Teleport Gate', '印记': 'Insignia',
  '隐藏门': 'Hidden Door', '供奉箱': 'Offering Chest', '铁匠升级': 'Tarforge Upgrade',
  '格力煞残渣': 'Grisha Remnant', '传送目的地': 'Teleport Destination', '精英': 'Elite',
  '留言提醒': 'Map Note', '官方留言': 'Map Note', '血之种': 'Bloodseed',
  '护种人的经文': 'Seedbearer’s Scripture', '悖论经文': 'Paradoxical Scripture',
  '羊头图腾': 'Sheephead Totem', '山怪草': 'Trollweed'
};

const officialNames = {
  // Locations and dungeons
  '哀霜之墓': 'Mornefrost Grave', '被劫地宫': 'Pilfered Crypt', '被围攻的废墟': 'Besieged Ruins',
  '被淹没的村落': 'Flooded Village', '崩塌矿井': 'Collapsed Mine', '崩塌隧道': 'Crumbling Tunnel',
  '沉默阶梯': 'The Silent Steps', '虫灾巢穴': 'Infested Den', '盗贼之憩': 'Thieves Retreat',
  '独腿狼': 'One-Legged Wolf Tavern', '堕落之门': 'Corrupted Gate', '恶语之域': 'Viletongue’s Domain',
  '腐化之门': 'Corrupted Gate', '格力煞猎场': 'Grisha Hunting Grounds', '黑井洞窟': 'Blackwell Cavern',
  '黑曜石矿井': 'Obsidianite Mines', '幻术师秘密藏匿点': 'Illusionist’s Cache', '荒废矿井': 'Deserted Mine',
  '荒废太平间': 'Spoiled Mortuary', '回音大厅': 'Hall of Echoes', '寄生藏匿点': 'Parasitic Stash',
  '加里克的巢穴': 'Garrick’s Den', '拘禁牢笼': 'Holding Cells', '炼金术士的工坊': 'Alchemist’s Workshop',
  '玛蒙皇室地宫': 'Royal Crypt of Mammon', '芒果圣所': 'Mango Sanctuary', '觅食场': 'Feeding Grounds',
  '蘑菇村': 'Mushroom Village', '呢喃厅堂': 'Hall of Murmurs', '懦夫退路': 'Coward’s Retreat',
  '破败藏匿点': 'Ravaged Hideout', '破败墓地': 'Ravaged Tomb', '破碎的信标': 'Shattered Beacon',
  '瀑布营地': 'Waterfall Camp', '谴责者要塞': 'Castigator’s Keep', '哨兵之墓': 'Sentry’s Grave',
  '试炼神殿': 'Shrine of Trials', '赎罪堡垒': 'Citadel of Penance', '髓骨堡': 'The Marrow Keep',
  '天尊信标': 'Revered Beacon', '蜕变之室': 'Chamber of Becoming', '王之陵墓': 'The King’s Crypt',
  '巫婆之坑': 'Hag’s Pit', '陷落村庄': 'Sunken Village', '修女的香炉': 'Sester’s Censer',
  '修女要塞': 'Sester’s Bastion', '殉道者之墓': 'Martyr’s Tomb', '殉教者之狱': 'Martyr’s Prison',
  '仪式场地': 'Ritual Grounds', '走私者藏匿处': 'Smuggler’s Hideout', '信徒藏匿点': 'Disciple’s Stash',
  '[夜间模式限定]悲伤神殿': 'Shrine of Sorrows',
  // Bosses and elites
  '鲍尔，妄想君王': 'Bor, the Deluded Monarch', '被感染的矿工': 'Infested Miner',
  '臣服护卫': 'Subjugated Guardian', '德罗格，征服者': 'Droeg, the Conquerer',
  '蒂希娜的忏悔者': 'Tishina’s Confessor', '典狱官': 'The Warden', '繁育壳群': 'Malborn Offspring',
  '弗拉戈，索利卡勇士': 'Vrago, Solikar Champion', '饥饿悍妪': 'Starved Harridan',
  '笼中格力煞': 'Caged Grisha', '迷失之子': 'The Lost Child', '撒瑞尔': 'Sariel, the Endless',
  '乌里格，行刑者': 'Urrig, the Executioner', '污秽遗骸': 'Tainted Vestige',
  '无名囚徒': 'The Nameless Captive', '亵渎无限先知': 'Prophet of Profane Infinities',
  '血肉仲裁官': 'Great Arbiter of Flesh', '血咒石胞': 'Bloodcursed Lithopod',
  '幽缚仪典师': 'Gloombound Ritualist', '幽缚仪式者': 'Gloombound Ritualist',
  '余露魔像': 'Orrem, the Discarded Golem', '焦油侵蚀者': 'Tarblighted Stoner',
  // NPCs and merchants
  '[夜晚模式限定]收集者': 'The Collector', '[隐藏结局]袋头人': 'Baghead', '埃贡': 'Egon',
  '弗拉斯': 'Vlas', '弗兰兹': 'Franz', '格拉古': 'Gragu', '格罗姆': 'Grom', '海尔嘉': 'Hilga',
  '好斗的醉汉': 'Belligerent Drunk', '酒保': 'Barkeep', '猎人': 'Grisha Hunter', '鲁克': 'Ruk',
  '路易斯': 'Louis', '梅瑞克': 'Merrick', '米洛斯': 'Milos', '强盗': 'Brigand',
  '热涅萨修女': 'Sester Genessa', '塞斯图斯': 'Thestus', '芝蕾尔': 'Zhirelle',
  // Shells and sidearms
  '埃尔德里姆': 'Eredrim', '哈洛斯': 'Harros', '拉兹罗': 'Lazlo', '普罗希玛': 'Proxima',
  '热涅萨': 'Genessa', '斯莫特': 'Smert', '提尔': 'Tiel', '被遗忘的十字弩': 'Forgotten Crossbow',
  '回收抛斧机': 'Salvaged Trebuchaxe', '笼中豪猪': 'Caged Hystrix', '弩炮祖卡': 'Ballistazooka',
  '三管转轮枪': 'Triarch Repeater', '吟游诗人鲁特琴': 'Troubadour’s Lute', '诅咒之子': 'Cursed Child',
  // Named collectibles and keys
  '[解锁传送]地母之息': 'Mether’s Breath', '[开启黑夜模式]幽质之火': 'Gloombound Flame',
  '悖论经文': 'Paradoxical Scripture', '不起眼的钥匙': 'Unremarkable Key',
  '藏身处笼子钥匙': 'Hideout Cage Key', '淬毒匕首': 'Poisoned Dagger', '淬火铁钥匙': 'Tempered Iron Key',
  '地母血肉': 'Mether’s Flesh', '地下室钥匙': 'Basement Key', '电流精华': 'Voltaic Essence',
  '冬晶宝石': 'Winterglass Gem', '格力煞残渣': 'Grisha Remnant', '黑髓钥匙': 'Blackmarrow Key',
  '护种人的经文': 'Seedbearer’s Scripture', '晦暗魔典': 'Grimorium Obscurum',
  '简易投射物': 'Makeshift Projectile', '教堂钥匙': 'Chapel Key', '牢笼钥匙': 'Cage Key',
  '雷霆碎片': 'Galvanic Shard', '莫拉德之书': 'Muradean Tome', '穆拉德之书': 'Muradean Tome',
  '日光奏鸣曲': 'Sunlight Sonata', '山怪草': 'Trollweed', '烧焦的人偶': 'Burnt Effigy',
  '圣卵': 'Sacred Egg', '湿漉漉的钥匙': 'Damp Key', '瓦特拉之心': 'Heart of Vatra',
  '喂食室钥匙': 'Feeding Room Key', '无玷之冠': 'Immaculate Crown', '星光奏鸣曲': 'Starlight Sonata',
  '修女的香炉': 'Sester’s Censer', '血之种': 'Bloodseed', '檐盖菇': 'Weltcap',
  '羊头图腾': 'Sheephead Totem', '月光奏鸣曲': 'Moonlight Sonata', '中央拉杆': 'Central Shaft Lever',
  '要塞大门拉杆': 'Citadel Gate Lever'
};

const data = JSON.parse(fs.readFileSync(mapFile, 'utf8'));
for (const landmark of data.landmarks) {
  const name = officialNames[landmark.nameZh];
  landmark.name = name || categories[landmark.categoryZh] || 'Map Marker';
  landmark.category = categories[landmark.categoryZh] || 'Map Marker';
  landmark.isOfficialName = Boolean(name);
}
fs.writeFileSync(mapFile, `${JSON.stringify(data)}\n`);
console.log(`Localized ${data.landmarks.filter((landmark) => landmark.isOfficialName).length}/${data.landmarks.length} exact names.`);
