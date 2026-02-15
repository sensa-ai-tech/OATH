/**
 * 五行深化 + 四季主題正向引導模板庫（40 條）
 *
 * 模板設計原則（Placebo Framing）：
 * 1. 永遠正向重框架 — 沒有「壞日子」
 * 2. 具體可執行的行動建議（至少 10 字）
 * 3. 科學/心理學語言而非玄學語言
 * 4. 禁止使用：糟、不幸、倒霉、災禍、凶、厄運
 * 5. 支援 {{sunSign}} {{moonSign}} {{dayElement}} 變數
 */

import type { FortuneTemplate } from './daily-templates.js';

export const ELEMENT_SEASON_TEMPLATES: readonly FortuneTemplate[] = [
  // ============================================
  // 五行深化：木 (Wood) × 4 主題
  // ============================================
  {
    id: 'element-wood-01',
    tags: ['wood', 'career', 'initiative'],
    theme: '事業萌發',
    message:
      '木的生長力正在為你的事業注入動能。就像竹子在地下紮根三年後一飛沖天，你累積的經驗正準備轉化為可見的成果。{{dayElement}}今日特別支持開創性行動。',
    actionSuggestion:
      '列出一個你想推動但尚未啟動的工作計畫，今天花 15 分鐘寫下具體的第一步驟與時間表。',
  },
  {
    id: 'element-wood-02',
    tags: ['wood', 'relationship', 'empathy'],
    theme: '情感共生',
    message:
      '木性能量強調「共生」——森林中的樹木透過根系互相傳遞養分。今天你的同理心特別敏銳，是修復或深化一段重要關係的好時機。',
    actionSuggestion:
      '主動對一位重要的人說出具體的感謝：「謝謝你上次幫我______，那對我很重要。」',
  },
  {
    id: 'element-wood-03',
    tags: ['wood', 'health', 'vitality'],
    theme: '舒展筋骨',
    message:
      '在中醫理論中，木對應肝膽與筋脈。今天身體渴望伸展與流動，即使只是幾分鐘的活動也能顯著提升你的精力與專注力。',
    actionSuggestion:
      '起身做三組簡單的伸展：轉動脖子、展開雙臂、彎腰碰腳趾，每組停留 30 秒，感受身體甦醒。',
  },
  {
    id: 'element-wood-04',
    tags: ['wood', 'learning', 'curiosity'],
    theme: '向上探索',
    message:
      '樹木向光生長，你的求知慾也在引導你朝正確的方向前進。今天大腦對新資訊的吸收效率比平時高，好奇心就是最好的學習動力。',
    actionSuggestion:
      '找一篇與你工作相關但從未深入了解的主題文章，花 20 分鐘閱讀並記下三個新發現。',
  },

  // ============================================
  // 五行深化：火 (Fire) × 4 主題
  // ============================================
  {
    id: 'element-fire-01',
    tags: ['fire', 'career', 'leadership'],
    theme: '事業熱忱',
    message:
      '火的能量點燃你的領導力與表達慾。{{sunSign}}帶來的自信讓你在團隊中自然成為焦點。今天適合提出你醞釀已久的提案或主動承擔關鍵任務。',
    actionSuggestion:
      '在今天的會議或對話中，主動分享一個你思考過的改進方案，用「我建議我們可以……」開頭。',
  },
  {
    id: 'element-fire-02',
    tags: ['fire', 'relationship', 'warmth'],
    theme: '溫暖傳遞',
    message:
      '火象能量讓你的情感表達特別真誠而有感染力。今天你的微笑、擁抱或一句鼓勵的話，會比平常更深入對方的心。',
    actionSuggestion:
      '今天對三個不同的人表達真誠的讚美，專注於他們具體的行為而非泛泛的好話。',
  },
  {
    id: 'element-fire-03',
    tags: ['fire', 'health', 'circulation'],
    theme: '活力循環',
    message:
      '火對應心臟與血液循環系統。今天你的身體渴望有節奏的運動——讓心跳加速一點，促進全身的能量流動與代謝。',
    actionSuggestion:
      '安排 15 至 20 分鐘的有氧運動：快走、跳繩或爬樓梯，讓心率微微上升，感受血液的暢通。',
  },
  {
    id: 'element-fire-04',
    tags: ['fire', 'learning', 'passion'],
    theme: '熱情鑽研',
    message:
      '心理學研究顯示，帶著熱情學習的效率是被動學習的三倍。今天火元素放大了你的興趣驅動力，跟著好奇心走就對了。',
    actionSuggestion:
      '挑一個你真心感興趣的技能，花 25 分鐘專注練習。設定番茄鐘，沉浸在心流狀態中。',
  },

  // ============================================
  // 五行深化：土 (Earth) × 4 主題
  // ============================================
  {
    id: 'element-earth-01',
    tags: ['earth', 'career', 'reliability'],
    theme: '穩健推進',
    message:
      '土的能量帶來紮實的執行力。今天不適合追求華麗的突破，而是把手上的事做到位。你的專注與可靠正是團隊最需要的力量。',
    actionSuggestion:
      '選出今天最重要的三件待辦事項，按優先順序逐一完成，每完成一項就給自己一個小獎勵。',
  },
  {
    id: 'element-earth-02',
    tags: ['earth', 'relationship', 'trust'],
    theme: '信任築基',
    message:
      '穩定的關係建立在一次又一次小小的信守承諾之上。今天的土元素提醒你：比起說動聽的話，做到你答應的事更能深化信任。',
    actionSuggestion:
      '檢查是否有尚未兌現的承諾——即使只是「下次請你喝咖啡」這樣的小事，今天就去完成它。',
  },
  {
    id: 'element-earth-03',
    tags: ['earth', 'health', 'digestion'],
    theme: '滋養脾胃',
    message:
      '土對應脾胃消化系統。今天特別適合留意飲食品質，選擇溫和易消化的食物，讓身體用最少的能量獲得最好的營養。',
    actionSuggestion:
      '午餐選擇一頓溫熱、少油的簡單餐食，吃飯時放下手機，專注咀嚼每一口，至少嚼 15 下。',
  },
  {
    id: 'element-earth-04',
    tags: ['earth', 'learning', 'consolidation'],
    theme: '知識沉澱',
    message:
      '學習不只是輸入新資訊，更重要的是消化與整合。今天土元素增強了你的歸納能力，適合把零散的知識整理成系統。',
    actionSuggestion:
      '回顧本週學到的內容，用自己的話寫一段 100 字以內的摘要，教會自己等於真正理解。',
  },

  // ============================================
  // 五行深化：金 (Metal) × 4 主題
  // ============================================
  {
    id: 'element-metal-01',
    tags: ['metal', 'career', 'precision'],
    theme: '精準決策',
    message:
      '金的能量帶來清晰的判斷力與果斷。今天你的分析思維特別銳利，是處理複雜問題、做出關鍵決策的理想時機。',
    actionSuggestion:
      '面對待決事項，用紙筆列出「做」與「不做」各三個理由，然後在 10 分鐘內做出選擇。',
  },
  {
    id: 'element-metal-02',
    tags: ['metal', 'relationship', 'boundary'],
    theme: '清澈界限',
    message:
      '健康的關係需要清楚的界限。金元素賦予你溫和而堅定的表達力，讓你能在不傷害對方的前提下說出自己的需求。',
    actionSuggestion:
      '如果有一件讓你感到為難的人際請求，練習用「我理解你的需要，同時我需要……」的句式回應。',
  },
  {
    id: 'element-metal-03',
    tags: ['metal', 'health', 'respiration'],
    theme: '深呼吸淨化',
    message:
      '金對應肺與呼吸系統。深而慢的呼吸能活化副交感神經，降低壓力荷爾蒙皮質醇，讓身心同時獲得修復。',
    actionSuggestion:
      '練習方盒呼吸法：吸氣 4 秒、屏息 4 秒、呼氣 4 秒、屏息 4 秒，連續做 4 輪感受平靜。',
  },
  {
    id: 'element-metal-04',
    tags: ['metal', 'learning', 'refinement'],
    theme: '去蕪存菁',
    message:
      '金的本質是提煉——從礦石中萃取精華。今天適合回顧已有的知識，刪除過時的觀念，保留真正有價值的核心。',
    actionSuggestion:
      '打開你的筆記或書籤，刪除五個不再有用的項目，為真正重要的知識騰出空間。',
  },

  // ============================================
  // 五行深化：水 (Water) × 4 主題
  // ============================================
  {
    id: 'element-water-01',
    tags: ['water', 'career', 'strategy'],
    theme: '以柔克剛',
    message:
      '水善於找到阻力最小的路徑。今天在工作上不需要硬碰硬，退一步觀察全局，你會發現更聰明的策略路線。',
    actionSuggestion:
      '面對棘手的工作難題，先暫停 10 分鐘，在紙上畫出問題的全貌，往往會看見被忽略的捷徑。',
  },
  {
    id: 'element-water-02',
    tags: ['water', 'relationship', 'listening'],
    theme: '傾聽深流',
    message:
      '水的智慧在於接納。{{moonSign}}今天增強了你的共情能力，讓你能真正聽見對方話語背後的需求與感受。',
    actionSuggestion:
      '下次與人對話時，練習「先聽完再回應」——對方說完後停頓三秒，再開口。你會聽到更多。',
  },
  {
    id: 'element-water-03',
    tags: ['water', 'health', 'hydration'],
    theme: '潤澤身心',
    message:
      '水對應腎與泌尿系統。研究顯示，即使輕微脫水也會降低認知功能與情緒穩定度。今天特別留意補充水分。',
    actionSuggestion:
      '在桌上放一瓶水，設定每小時喝一杯的提醒。今天的目標是喝滿八杯，觀察精神狀態的變化。',
  },
  {
    id: 'element-water-04',
    tags: ['water', 'learning', 'reflection'],
    theme: '反思之泉',
    message:
      '水面平靜時才能映照萬物。今天適合沉澱式學習——不是大量輸入新知，而是回顧與反思過去的經驗，從中提取智慧。',
    actionSuggestion:
      '睡前花 10 分鐘寫反思日記：今天做得好的一件事、可以改進的一件事、學到的一個道理。',
  },

  // ============================================
  // 四季主題：春 (Spring) × 5
  // ============================================
  {
    id: 'season-spring-01',
    tags: ['spring', 'transition', 'renewal'],
    theme: '春回能量',
    message:
      '春天是自然界的重啟鍵。萬物從休眠中甦醒，你體內的能量也在復甦。這股向上的力量正是開啟新篇章的最佳推手。',
    actionSuggestion:
      '為自己設定一個春季小目標，寫在便利貼上貼在每天看得到的地方，讓它成為日常的提醒。',
  },
  {
    id: 'season-spring-02',
    tags: ['spring', 'health', 'liver'],
    theme: '春養肝氣',
    message:
      '春季對應肝氣生發。保持情緒舒暢、避免壓抑，讓身體的氣血跟著春天一起流動，是這個季節最好的養生方式。',
    actionSuggestion:
      '今天嘗試在戶外散步 15 分鐘，讓陽光和微風接觸皮膚，深呼吸幾次感受春天的氣息。',
  },
  {
    id: 'season-spring-03',
    tags: ['spring', 'mindfulness', 'hope'],
    theme: '春的心靈',
    message:
      '春天教會我們一個心理學事實：低谷是暫時的，生長是必然的。就像種子在黑暗的土壤中發芽，你正在經歷的沉潛正是成長的前奏。',
    actionSuggestion:
      '找一株正在發芽的植物觀察三分鐘，提醒自己：成長往往在你看不見的地方正在發生。',
  },
  {
    id: 'season-spring-04',
    tags: ['spring', 'planning', 'seed'],
    theme: '春播計畫',
    message:
      '農人在春天播種，不是因為確定會豐收，而是因為知道不播種就一定沒有收穫。今天是規劃與啟動長期計畫的好時機。',
    actionSuggestion:
      '寫下三件你希望在今年內實現的事，為每一件列出這週能做的最小行動，然後選一件開始。',
  },
  {
    id: 'season-spring-05',
    tags: ['spring', 'gratitude', 'awakening'],
    theme: '春日感恩',
    message:
      '感恩不只是一種美德，神經科學研究證實它能活化前額葉皮質並增加多巴胺分泌。春天的新綠正提醒你身邊有多少值得珍惜的存在。',
    actionSuggestion:
      '今天傳一則訊息給你感恩的人，具體告訴對方：「你做的______讓我感到______。」',
  },

  // ============================================
  // 四季主題：夏 (Summer) × 5
  // ============================================
  {
    id: 'season-summer-01',
    tags: ['summer', 'transition', 'peak'],
    theme: '盛夏能量',
    message:
      '夏天是能量的高峰期。陽光最長、活力最旺，你的行動力和社交慾望也跟著達到頂點。善用這份飽滿去推動重要的事。',
    actionSuggestion:
      '把你最需要動力的任務安排在今天精力最旺盛的時段，一鼓作氣完成它。',
  },
  {
    id: 'season-summer-02',
    tags: ['summer', 'health', 'heart'],
    theme: '夏養心神',
    message:
      '夏季對應心火。高溫容易讓人浮躁，適當的靜心練習能幫助你在炎熱中保持內在的清涼與專注。',
    actionSuggestion:
      '午後找一個安靜的地方，閉眼做 5 分鐘的正念呼吸。想像每次呼氣都帶走一點燥熱。',
  },
  {
    id: 'season-summer-03',
    tags: ['summer', 'mindfulness', 'joy'],
    theme: '夏的喜悅',
    message:
      '夏天是感官最豐富的季節。心理學中的「品味」(savoring) 技巧——刻意放慢速度享受美好瞬間——能顯著提升你的幸福感。',
    actionSuggestion:
      '今天選一個感官體驗全然投入：品嚐水果的甜、感受微風的涼、聆聽蟬鳴，用五感記住這一刻。',
  },
  {
    id: 'season-summer-04',
    tags: ['summer', 'planning', 'momentum'],
    theme: '夏行計畫',
    message:
      '夏天的長日照給你更多可用的時間和精力。這是把上半年計畫中未完成的項目加速推進的絕佳窗口期。',
    actionSuggestion:
      '回顧年初設定的目標，找出進度落後的一項，今天重新擬定一個切實可行的修正計畫。',
  },
  {
    id: 'season-summer-05',
    tags: ['summer', 'gratitude', 'abundance'],
    theme: '豐盛感恩',
    message:
      '夏天萬物繁茂，提醒我們生命中的豐盛往往超過我們的意識。正向心理學研究顯示，關注「已經擁有的」比聚焦「還缺少的」更能帶來滿足感。',
    actionSuggestion:
      '寫下五件你現在已經擁有、一年前還沒有的好事。讓自己真正感受到進步的喜悅。',
  },

  // ============================================
  // 四季主題：秋 (Autumn) × 5
  // ============================================
  {
    id: 'season-autumn-01',
    tags: ['autumn', 'transition', 'harvest'],
    theme: '秋收能量',
    message:
      '秋天是收穫與回顧的季節。你過去幾個月的努力正在結出果實——即使形式和你預期的不同，成果確實在那裡。',
    actionSuggestion:
      '列出這季度你完成的三件事，不論大小。對著清單對自己說：「這些都是我做到的。」',
  },
  {
    id: 'season-autumn-02',
    tags: ['autumn', 'health', 'lung'],
    theme: '秋潤肺氣',
    message:
      '秋季乾燥對應肺系統。保持呼吸道的滋潤、多攝取溫潤食物，能幫助身體順利適應季節的轉換。',
    actionSuggestion:
      '今天多喝溫水或沖一杯蜂蜜檸檬水，讓身體從內而外保持潤澤。避免過度辛辣的食物。',
  },
  {
    id: 'season-autumn-03',
    tags: ['autumn', 'mindfulness', 'release'],
    theme: '秋的放下',
    message:
      '樹木在秋天落葉不是失去，而是為來年的新生騰出空間。心理學中的「認知解負」(cognitive offloading) 也是同樣的道理——放下才能騰出心理頻寬。',
    actionSuggestion:
      '找出一個佔據你心理空間卻無法改變的擔憂，把它寫在紙上然後折起來放進抽屜。象徵性地暫時放下它。',
  },
  {
    id: 'season-autumn-04',
    tags: ['autumn', 'planning', 'review'],
    theme: '秋季盤點',
    message:
      '秋天是年度最佳的覆盤時機。距離年底還有足夠的時間調整方向，但已經累積了足夠的經驗來做出明智的判斷。',
    actionSuggestion:
      '花 20 分鐘做一次「繼續、停止、開始」練習：什麼要繼續做？什麼該停止？什麼該新開始？',
  },
  {
    id: 'season-autumn-05',
    tags: ['autumn', 'gratitude', 'connection'],
    theme: '秋日感恩',
    message:
      '秋天的涼意讓人自然想靠近溫暖的人。研究顯示，對他人表達感謝不只讓對方開心，更能提升自己的正向情緒和人際連結感。',
    actionSuggestion:
      '今天當面或用手寫卡片向一位幫助過你的人表達感謝，具體描述對方的行為如何影響了你。',
  },

  // ============================================
  // 四季主題：冬 (Winter) × 5
  // ============================================
  {
    id: 'season-winter-01',
    tags: ['winter', 'transition', 'rest'],
    theme: '冬藏能量',
    message:
      '冬天是自然界的休養期。種子在地底蓄積力量，動物進入冬眠。允許自己放慢節奏不是懈怠，而是為下一次綻放儲備能量。',
    actionSuggestion:
      '今天提早 30 分鐘上床，關掉螢幕，讓身體和大腦在黑暗中完成深層修復。',
  },
  {
    id: 'season-winter-02',
    tags: ['winter', 'health', 'kidney'],
    theme: '冬養腎氣',
    message:
      '冬季對應腎與骨骼系統。保暖、早睡、適度的溫和運動能幫助你維持免疫力，讓身體在寒冷中依然充滿韌性。',
    actionSuggestion:
      '睡前用溫水泡腳 10 分鐘，搭配輕柔的足底按摩，促進血液循環並幫助入眠。',
  },
  {
    id: 'season-winter-03',
    tags: ['winter', 'mindfulness', 'stillness'],
    theme: '冬的寧靜',
    message:
      '冬天的安靜是一種禮物。在喧鬧的世界裡，刻意創造靜默的空間能讓大腦的預設模式網絡活化，帶來深層的自我洞察。',
    actionSuggestion:
      '找一個安靜的時段，關掉所有通知，獨處 15 分鐘。不做任何事，只是和自己在一起。',
  },
  {
    id: 'season-winter-04',
    tags: ['winter', 'planning', 'vision'],
    theme: '冬籌來年',
    message:
      '冬天是最適合長遠思考的季節。外在的沉寂讓內在的聲音更清晰，你對未來的願景會在這份安靜中變得更加具體。',
    actionSuggestion:
      '用 20 分鐘做一次「未來的我」書寫練習：一年後的今天，你希望自己的生活是什麼樣子？',
  },
  {
    id: 'season-winter-05',
    tags: ['winter', 'gratitude', 'warmth'],
    theme: '冬日溫暖',
    message:
      '寒冷讓我們更珍惜溫暖。冬天是回顧這一年所有美好的最佳時刻——每一次微笑、每一個擁抱、每一段陪伴都值得被記住。',
    actionSuggestion:
      '今晚寫下今年最感恩的十個瞬間，不需要是大事，一杯熱茶、一次深談、一場及時雨都算在內。',
  },
];
