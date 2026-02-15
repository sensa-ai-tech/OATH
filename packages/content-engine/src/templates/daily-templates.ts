/**
 * 每日運勢正向引導模板庫
 *
 * 模板設計原則（Placebo Framing）：
 * 1. 永遠正向重框架 — 沒有「壞日子」
 * 2. 具體可執行的行動建議
 * 3. 科學/心理學語言而非玄學語言
 * 4. 星象/八字作為「框架」而非「命運」
 */

import { ZODIAC_TEMPLATES } from './zodiac-templates.js';
import { PLANETARY_TEMPLATES } from './planetary-templates.js';
import { ELEMENT_SEASON_TEMPLATES } from './element-season-templates.js';
import { LIFE_SCENE_TEMPLATES } from './life-scene-templates.js';

export interface FortuneTemplate {
  readonly id: string;
  /** 觸發條件標籤 */
  readonly tags: readonly string[];
  /** 主題（中文） */
  readonly theme: string;
  /** 正向訊息模板（支援 {{variable}} 語法） */
  readonly message: string;
  /** 行動建議模板 */
  readonly actionSuggestion: string;
}

/**
 * 基礎模板庫（核心 + 五行 + 十神 + 季節 + 特殊日 + 日主）
 */
const BASE_TEMPLATES: readonly FortuneTemplate[] = [
  // ============================================
  // 五行主題：木 (Wood)
  // ============================================
  {
    id: 'wood-growth-01',
    tags: ['wood', 'favorable', 'spring'],
    theme: '成長萌芽',
    message: '今天的能量場特別適合開始新計畫。就像春天的種子破土而出，你內在的創造力正在甦醒。{{dayElement}}的力量為你帶來自然的生長動能。',
    actionSuggestion: '找一件你一直想開始但遲遲沒動手的事，今天就踏出第一步——哪怕只是寫下第一行字或傳出第一封信。',
  },
  {
    id: 'wood-flexibility-01',
    tags: ['wood', 'challenge', 'adaptation'],
    theme: '柔韌應變',
    message: '今天可能會遇到一些需要調整方向的狀況。記住：最強壯的樹木不是最硬的，而是在風中能彎曲卻不折斷的那種。你的適應力就是你最大的優勢。',
    actionSuggestion: '如果今天計畫有變，試著把它看成一個意外的轉彎而非阻礙。問自己：這個變化帶來了什麼新的可能性？',
  },
  {
    id: 'wood-connection-01',
    tags: ['wood', 'social', 'network'],
    theme: '人際連結',
    message: '木性能量強調連結與成長。今天是強化人際網絡的好時機。一通久違的問候電話，可能帶來意想不到的正向連鎖效應。',
    actionSuggestion: '主動聯繫一位你最近想到但沒聯絡的朋友或同事，一句簡單的「最近好嗎？」就足夠了。',
  },

  // ============================================
  // 五行主題：火 (Fire)
  // ============================================
  {
    id: 'fire-passion-01',
    tags: ['fire', 'favorable', 'energy'],
    theme: '熱情驅動',
    message: '今天你的內在火焰特別明亮。{{sunSign}}帶來的能量讓你的表達力和領導力處於高峰。這是展現真實自我的絕佳時機。',
    actionSuggestion: '大膽表達你的想法。今天適合在會議中發言、分享你的創意，或是告訴某人你的真實感受。',
  },
  {
    id: 'fire-patience-01',
    tags: ['fire', 'challenge', 'temperance'],
    theme: '溫和之火',
    message: '火的能量有時需要被引導，而非壓抑。今天你可能會感到特別急躁或衝動，這其實是創造力想要找到出口的訊號。',
    actionSuggestion: '感到急躁時，試試「5-4-3-2-1」呼吸法：吸氣 5 秒、屏息 4 秒、吐氣 3 秒。把急躁的能量轉化為專注力。',
  },
  {
    id: 'fire-inspiration-01',
    tags: ['fire', 'creative', 'art'],
    theme: '靈感之火',
    message: '創意能量今天特別活躍。你的直覺比平常更敏銳，那些突然冒出的想法很值得被記錄下來。',
    actionSuggestion: '隨身帶一本小筆記本或用手機備忘錄。今天每個突然冒出的靈感都記下來，不要評判——晚上再回顧。',
  },

  // ============================================
  // 五行主題：土 (Earth)
  // ============================================
  {
    id: 'earth-stability-01',
    tags: ['earth', 'favorable', 'grounding'],
    theme: '穩固基礎',
    message: '今天的土元素能量帶來踏實感和安定感。這是整理思緒、建立系統的好日子。你的可靠和耐心正是現在最需要的品質。',
    actionSuggestion: '整理一個你一直拖延的空間——無論是書桌、資料夾還是行事曆。外在的整齊會帶來內在的清明。',
  },
  {
    id: 'earth-nourish-01',
    tags: ['earth', 'selfcare', 'body'],
    theme: '滋養自我',
    message: '土的能量提醒我們照顧好根基。今天特別適合關注身體的需求——你的身體一直在為你工作，它值得被善待。',
    actionSuggestion: '今天選一餐好好吃，不急不趕。或是睡前做 10 分鐘的伸展，感謝身體的辛勞。',
  },
  {
    id: 'earth-trust-01',
    tags: ['earth', 'challenge', 'patience'],
    theme: '信任過程',
    message: '有些事需要時間才能看到結果，就像播種到收成之間需要耐心等待。今天的考驗在於信任自己已經付出的努力。',
    actionSuggestion: '寫下三件你正在努力但還沒看到成果的事，然後在旁邊寫下「持續中」。提醒自己：看不見不代表沒發生。',
  },

  // ============================================
  // 五行主題：金 (Metal)
  // ============================================
  {
    id: 'metal-clarity-01',
    tags: ['metal', 'favorable', 'focus'],
    theme: '清晰專注',
    message: '金元素帶來刀鋒般的清晰度。今天你的分析能力和判斷力特別敏銳，適合處理需要精確思考的事務。',
    actionSuggestion: '把你最需要專注思考的任務安排在今天。關掉通知，給自己 25 分鐘不被打擾的深度工作時間。',
  },
  {
    id: 'metal-release-01',
    tags: ['metal', 'challenge', 'letting-go'],
    theme: '適度放手',
    message: '金的能量也包含「收」與「放」的智慧。有時候最有力量的決定不是抓得更緊，而是知道什麼時候該優雅地放手。',
    actionSuggestion: '想一件佔據你心理空間但你無法控制的事。在心中對它說「我已經盡力了」，然後深呼吸一口氣，把注意力轉回你能影響的事物。',
  },
  {
    id: 'metal-value-01',
    tags: ['metal', 'wealth', 'worth'],
    theme: '價值肯定',
    message: '今天適合重新審視自己的價值。不是市場上的價格，而是你作為一個人帶給世界的獨特貢獻。',
    actionSuggestion: '列出三件你做得好的事——不用很大，「按時交付」「讓朋友笑了」都算。你的價值遠比你以為的多。',
  },

  // ============================================
  // 五行主題：水 (Water)
  // ============================================
  {
    id: 'water-intuition-01',
    tags: ['water', 'favorable', 'insight'],
    theme: '直覺深流',
    message: '水元素增強了你的直覺力。今天那些「說不出為什麼但就是覺得」的感受值得被重視——直覺是大腦在背景中運算的結果。',
    actionSuggestion: '面對今天的選擇時，先感受直覺告訴你什麼，再用邏輯驗證。兩者一致時，大膽行動。',
  },
  {
    id: 'water-flow-01',
    tags: ['water', 'challenge', 'flow'],
    theme: '順勢而行',
    message: '水不對抗岩石，它繞過去。今天如果遇到阻礙，不需要硬碰硬——找到另一條路往往更聰明。',
    actionSuggestion: '如果某件事進展不順，暫時放下它去做別的。很多時候，「不執著」反而是解決問題最快的路。',
  },
  {
    id: 'water-wisdom-01',
    tags: ['water', 'reflection', 'learning'],
    theme: '沉澱智慧',
    message: '今天適合向內看。{{moonSign}}的能量加深了你的洞察力。安靜的反思比忙碌的行動更有價值。',
    actionSuggestion: '睡前花 5 分鐘回顧今天：什麼讓你開心？什麼讓你成長？寫下一句話的今日心得。',
  },

  // ============================================
  // 星座主題
  // ============================================
  {
    id: 'zodiac-cardinal-01',
    tags: ['aries', 'cancer', 'libra', 'capricorn', 'initiative'],
    theme: '開創之力',
    message: '身為開創星座的你，今天的宇宙節奏特別配合你的行動力。不需要等到萬事俱備才開始。',
    actionSuggestion: '選一個你一直在「規劃」的事情，今天就執行它的第一步。完成比完美更重要。',
  },
  {
    id: 'zodiac-fixed-01',
    tags: ['taurus', 'leo', 'scorpio', 'aquarius', 'persistence'],
    theme: '堅定力量',
    message: '固定星座的你天生就有堅持到底的能力。今天這份毅力會成為你最大的資產。',
    actionSuggestion: '回想一個你已經堅持一段時間的目標，為自己的堅持鼓個掌。然後再往前推進一小步。',
  },
  {
    id: 'zodiac-mutable-01',
    tags: ['gemini', 'virgo', 'sagittarius', 'pisces', 'adaptability'],
    theme: '靈活應變',
    message: '變動星座的你擅長在變化中找到機會。今天的環境變化正好是你發揮長處的舞台。',
    actionSuggestion: '擁抱今天的每一個「意外」。用好奇心取代焦慮，問自己：這個變化教了我什麼？',
  },

  // ============================================
  // 行運主題
  // ============================================
  {
    id: 'transit-trine-01',
    tags: ['trine', 'harmony', 'flow'],
    theme: '和諧共振',
    message: '今天天象中有美好的三分相能量。事情會比平常更順利，人際互動也更和諧。享受這份流暢感。',
    actionSuggestion: '利用今天的順風，推進一個需要與人合作的計畫。今天的溝通特別容易達成共識。',
  },
  {
    id: 'transit-square-01',
    tags: ['square', 'tension', 'growth'],
    theme: '成長張力',
    message: '今天的四分相帶來建設性的張力。就像肌肉在阻力訓練中成長，這份挑戰正在幫助你變得更強。',
    actionSuggestion: '遇到摩擦時，把它當成升級的機會。問自己：這個挑戰在邀請我發展什麼新能力？',
  },
  {
    id: 'transit-conjunction-01',
    tags: ['conjunction', 'new-beginning', 'seed'],
    theme: '能量匯聚',
    message: '合相能量代表新的開始。今天適合播下新種子——一個想法、一段關係、一個計畫的起點。',
    actionSuggestion: '在今天做一件小小的「第一次」。嘗試新的咖啡店、學一個新單字、跟陌生人打個招呼。',
  },
  {
    id: 'transit-opposition-01',
    tags: ['opposition', 'balance', 'perspective'],
    theme: '平衡之鏡',
    message: '對分相提供了一面鏡子，讓你看見事情的另一面。今天特別適合換位思考，你會發現新的理解。',
    actionSuggestion: '選一個你很堅持的觀點，花 3 分鐘真心嘗試從對方角度思考。你不需要改變立場，但理解本身就有價值。',
  },

  // ============================================
  // 綜合主題
  // ============================================
  {
    id: 'general-gratitude-01',
    tags: ['general', 'positive', 'daily'],
    theme: '感恩時刻',
    message: '不管外在世界如何變化，你內在都有一個安靜的中心。今天花一點時間回到那裡，感受一下已經擁有的美好。',
    actionSuggestion: '起床後或睡前，想三件你感恩的事。它們不需要很大——一杯溫暖的咖啡、一個微笑、能自由呼吸。',
  },
  {
    id: 'general-courage-01',
    tags: ['general', 'courage', 'daily'],
    theme: '勇氣之日',
    message: '勇氣不是沒有恐懼，而是帶著恐懼依然前進。今天的天象支持你踏出舒適圈。',
    actionSuggestion: '做一件讓你有點緊張的事。公開演講、提出要求、承認錯誤——小小的勇敢累積起來就是巨大的改變。',
  },
  {
    id: 'general-rest-01',
    tags: ['general', 'rest', 'recovery'],
    theme: '充電日',
    message: '今天的能量場比較低沉，這不是壞事——就像手機需要充電，人也需要。允許自己慢下來。',
    actionSuggestion: '如果可以的話，今天減少一項待辦事項。用省下來的時間做一件「無用但開心」的事。',
  },
  {
    id: 'general-learning-01',
    tags: ['general', 'mercury', 'study'],
    theme: '學習之窗',
    message: '今天的水星能量特別活躍，你的學習效率比平常高。新資訊會比較容易被吸收和整合。',
    actionSuggestion: '花 20 分鐘學習一個你一直好奇的主題。看一篇文章、聽一集 Podcast、或觀看一段教學影片。',
  },
  {
    id: 'general-boundary-01',
    tags: ['general', 'saturn', 'boundary'],
    theme: '健康界限',
    message: '今天的能量提醒你：說「不」也是一種照顧自己的方式。設定界限不是自私，是負責。',
    actionSuggestion: '如果今天有人提出讓你為難的請求，給自己 24 小時再回覆。「讓我想想」是完全合理的回答。',
  },

  // ============================================
  // 十神主題
  // ============================================
  {
    id: 'ten-god-wealth-01',
    tags: ['zheng_cai', 'pian_cai', 'finance'],
    theme: '財富覺察',
    message: '今天的財星能量提醒你關注「價值交換」。財富不只是金錢，也包括你的時間、技能和注意力。',
    actionSuggestion: '花 10 分鐘檢視你最近的消費。有哪些帶來了真正的快樂？有哪些只是習慣性支出？',
  },
  {
    id: 'ten-god-authority-01',
    tags: ['zheng_guan', 'qi_sha', 'career'],
    theme: '領導時刻',
    message: '官星/殺星的能量帶來責任感和使命感。今天你可能需要為某件事做出決定或承擔責任——相信自己的判斷。',
    actionSuggestion: '如果有一個延宕的決定，今天就做。不完美的決定也比不做決定好。',
  },
  {
    id: 'ten-god-seal-01',
    tags: ['zheng_yin', 'pian_yin', 'wisdom'],
    theme: '智慧之印',
    message: '印星能量強化了你的學習力和洞察力。今天特別適合閱讀、思考和吸收新知識。',
    actionSuggestion: '找一本你一直想讀的書，今天至少讀完一章。或者和一位你尊敬的人聊聊天，向他們學習。',
  },
  {
    id: 'ten-god-expression-01',
    tags: ['shi_shen', 'shang_guan', 'creative'],
    theme: '表達創造',
    message: '食傷能量讓你的表達力和創造力達到高峰。今天說出的話、寫下的文字、做出的東西都會特別有感染力。',
    actionSuggestion: '創造一些東西。寫一篇日記、畫一幅畫、煮一道新菜——任何形式的創造都能釋放今天的能量。',
  },
  {
    id: 'ten-god-companion-01',
    tags: ['bi_jian', 'jie_cai', 'teamwork'],
    theme: '同行力量',
    message: '比劫能量帶來同儕的力量。今天你會發現身邊有人和你面臨類似的挑戰——你們可以互相支持。',
    actionSuggestion: '和同事或朋友分享你正在努力的事。你可能會驚訝地發現，他們正好有你需要的建議或資源。',
  },

  // ============================================
  // 月亮星座主題
  // ============================================
  {
    id: 'moon-fire-01',
    tags: ['moon-aries', 'moon-leo', 'moon-sagittarius', 'emotion'],
    theme: '情緒之火',
    message: '月亮在火象星座，今天的情緒能量熱烈而直接。讓自己感受這份強烈——它是你生命力的證明。',
    actionSuggestion: '用運動或任何身體活動來表達今天的情緒能量。跑步、跳舞、甚至大掃除都能幫助你釋放。',
  },
  {
    id: 'moon-earth-01',
    tags: ['moon-taurus', 'moon-virgo', 'moon-capricorn', 'emotion'],
    theme: '情緒紮根',
    message: '月亮在土象星座，今天你的情緒特別穩定踏實。利用這份安定感來處理一些需要耐心的事務。',
    actionSuggestion: '做一件讓你感覺「腳踏實地」的事：園藝、料理、整理空間，或是散步感受大地。',
  },
  {
    id: 'moon-air-01',
    tags: ['moon-gemini', 'moon-libra', 'moon-aquarius', 'emotion'],
    theme: '情緒輕盈',
    message: '月亮在風象星座，今天你的心智特別活躍。好奇心旺盛，適合社交和交流。',
    actionSuggestion: '找人聊天。不是為了解決問題，而是純粹享受思想的交流。一場好的對話能帶來意想不到的啟發。',
  },
  {
    id: 'moon-water-01',
    tags: ['moon-cancer', 'moon-scorpio', 'moon-pisces', 'emotion'],
    theme: '情緒深潛',
    message: '月亮在水象星座，今天你的情感特別細膩敏銳。這份敏感是禮物，不是弱點——它讓你能感受到別人感受不到的東西。',
    actionSuggestion: '如果今天感覺特別「有感覺」，給自己一些獨處的時間。聽一首你喜歡的歌、寫幾行字、或只是靜靜坐著。',
  },

  // ============================================
  // 通用正向
  // ============================================
  {
    id: 'fallback-positive-01',
    tags: ['fallback', 'general'],
    theme: '嶄新的一天',
    message: '每一天都是一個全新的開始。昨天的故事已經寫完了，今天的頁面是空白的。你是今天這一頁的作者。',
    actionSuggestion: '在今天開始之前，花 1 分鐘設定一個小小的意圖：「今天我想要______。」',
  },
  {
    id: 'fallback-positive-02',
    tags: ['fallback', 'general'],
    theme: '微小進步',
    message: '成長不需要戲劇性的突破。每天前進 1% 的人，一年後會進步 37 倍。你今天的小小努力，正在累積巨大的改變。',
    actionSuggestion: '今天做一件比昨天稍微好一點的事。多讀一頁書、多走 100 步、多喝一杯水——微小但持續。',
  },
  {
    id: 'fallback-positive-03',
    tags: ['fallback', 'general'],
    theme: '此刻安好',
    message: '深呼吸。在這一刻，你是安全的。不管腦中有多少待辦事項，此刻你只需要做一件事。',
    actionSuggestion: '每次感覺被壓力淹沒時，問自己：「我現在能做的一件最重要的事是什麼？」然後只做那件事。',
  },

  // ============================================
  // D. 五行深化（5 × 3 = 15 條）
  // ============================================

  // --- 木 Wood: 學習成長、創業開拓、健康養生 ---
  {
    id: 'wuxing-wood-learning-01',
    tags: ['wood', 'learning'],
    theme: '學習成長',
    message: '木的能量象徵不斷向上延伸的生命力。今天你的學習吸收力特別強，就像春天的樹木瘋狂抽新芽。{{dayElement}}為你打開了一扇知識之窗，讓好奇心帶領你前進。',
    actionSuggestion: '選一個你感興趣的新領域，花三十分鐘做一次「探索式學習」——不求精通，只求打開視野。可以看一篇文章、一段影片或翻一本新書的目錄。',
  },
  {
    id: 'wuxing-wood-startup-01',
    tags: ['wood', 'startup'],
    theme: '創業開拓',
    message: '木性能量蘊含破土而出的勇氣。今天特別適合為新計畫跨出關鍵一步。不需要完美的商業計畫書，最強的行動力來自「先做再調整」的心態。',
    actionSuggestion: '寫下你腦中那個點子的三個核心價值主張，然後找一個你信任的朋友，用五分鐘向他說明。來自他人的回饋會幫你看見盲點。',
  },
  {
    id: 'wuxing-wood-health-01',
    tags: ['wood', 'health'],
    theme: '健康養生',
    message: '木對應肝膽，掌管全身氣血的疏通。今天身體在提醒你：適度舒展筋骨，讓氣血流動起來。你的身體就像一棵樹，需要陽光、空氣和伸展的空間。',
    actionSuggestion: '早晨或午休時做五分鐘的拉伸運動，特別是側身伸展和扭轉動作。搭配幾次深呼吸，感受身體從僵硬中慢慢鬆開的舒暢。',
  },

  // --- 火 Fire: 領導魅力、藝術表現、社交魅力 ---
  {
    id: 'wuxing-fire-leadership-01',
    tags: ['fire', 'leadership'],
    theme: '領導魅力',
    message: '火的能量帶來天生的感召力。{{sunSign}}今天散發著讓人願意追隨的光芒。領導不是控制他人，而是用你的熱情點燃團隊每個人心中的火苗。',
    actionSuggestion: '在今天的會議或對話中，試著先傾聽他人的想法，然後用「我很欣賞你的觀點，我想補充的是……」來引導方向。好的領導始於尊重。',
  },
  {
    id: 'wuxing-fire-art-01',
    tags: ['fire', 'art'],
    theme: '藝術表現',
    message: '火是所有藝術的源泉——從陶藝的窯火到舞台上的聚光燈。今天你的美感和表現力處於高峰，那些難以言喻的感受正在尋找被表達的出口。',
    actionSuggestion: '給自己十五分鐘的「自由創作時間」。畫畫、寫字、哼歌、攝影——形式不限，重點是讓內在的情感自然流淌出來，不需要評價成果。',
  },
  {
    id: 'wuxing-fire-social-01',
    tags: ['fire', 'social'],
    theme: '社交魅力',
    message: '今天你的人際吸引力特別耀眼。火的能量讓你的笑容更有感染力，你的話語更能溫暖人心。這是拓展人際圈、建立深度連結的好時機。',
    actionSuggestion: '主動邀請一位同事或朋友共進午餐或下午茶。在對話中多問問對方最近的生活，真誠的關心是最強大的社交能量。',
  },

  // --- 土 Earth: 財務管理、家庭關係、健康飲食 ---
  {
    id: 'wuxing-earth-finance-01',
    tags: ['earth', 'finance'],
    theme: '財務管理',
    message: '土的能量帶來務實的理財智慧。今天適合盤點你的財務狀況，不是為了焦慮，而是為了更清楚自己擁有什麼。清晰的認知是一切好決策的起點。',
    actionSuggestion: '花十分鐘打開你的銀行 App 或記帳工具，回顧這個月的收支概況。找出一項可以優化的支出，設定一個小小的儲蓄目標。',
  },
  {
    id: 'wuxing-earth-family-01',
    tags: ['earth', 'family'],
    theme: '家庭關係',
    message: '土是家的元素，代表根基與歸屬感。今天的能量特別適合經營家庭關係。一通電話、一句關心，都能讓家人感受到你的溫暖與在乎。',
    actionSuggestion: '今天撥一通電話或傳一則訊息給家人，不聊公事，只是單純問候。也可以回憶一段美好的家庭記憶，把它記錄下來。',
  },
  {
    id: 'wuxing-earth-diet-01',
    tags: ['earth', 'diet'],
    theme: '健康飲食',
    message: '土對應脾胃，是身體消化吸收的核心。今天你的身體特別需要被好好滋養。選擇溫和、天然的食物，讓每一口都成為對自己的善意投資。',
    actionSuggestion: '今天至少有一餐選擇原型食物——新鮮蔬果、全穀類或優質蛋白質。細嚼慢嚥，感受食物的味道和溫度，這也是一種日常的正念練習。',
  },

  // --- 金 Metal: 決策判斷、個人品牌、斷捨離 ---
  {
    id: 'wuxing-metal-decision-01',
    tags: ['metal', 'decision'],
    theme: '決策判斷',
    message: '金元素帶來果斷與精準。今天你的邏輯思維特別清晰，適合處理那些需要做出取捨的事情。經過深思熟慮的決定，即使不完美，也值得被執行。',
    actionSuggestion: '列出一個你猶豫已久的決定的正反面各三點，然後問自己：「一年後的我，會希望今天做了什麼選擇？」用長期視角引導短期決策。',
  },
  {
    id: 'wuxing-metal-branding-01',
    tags: ['metal', 'branding'],
    theme: '個人品牌',
    message: '金的能量象徵提煉與精粹——去蕪存菁後留下的才是最珍貴的。今天適合思考你想被世界記住的樣子。你的獨特價值不需要模仿任何人。',
    actionSuggestion: '用一句話描述你希望別人怎麼形容你。把這句話寫下來，作為你個人品牌的核心宣言。定期回顧，看看日常行動是否與它一致。',
  },
  {
    id: 'wuxing-metal-declutter-01',
    tags: ['metal', 'declutter'],
    theme: '斷捨離',
    message: '金的「收」的力量今天特別強。放下不再需要的東西，才能為真正重要的事物騰出空間。你的生活品質和內心清明都值得被用心整理。',
    actionSuggestion: '選一個小空間開始：抽屜、衣櫃的一層、或手機裡的舊照片。捐出或清理三樣不再需要的東西，感受空間被釋放後的輕鬆感。',
  },

  // --- 水 Water: 冥想反思、情感深度、夢境洞察 ---
  {
    id: 'wuxing-water-meditation-01',
    tags: ['water', 'meditation'],
    theme: '冥想反思',
    message: '水的能量引導你向內探索。{{moonSign}}的影響加深了你的內在覺察力。今天特別適合靜下來與自己對話，在安靜中你會聽到心靈深處的聲音。',
    actionSuggestion: '找一個安靜的角落，閉上眼睛做三分鐘的呼吸冥想。只需要觀察呼吸的進出，不需要控制。如果思緒飄走了，溫柔地把注意力帶回來。',
  },
  {
    id: 'wuxing-water-emotion-01',
    tags: ['water', 'emotion'],
    theme: '情感深度',
    message: '水象徵情感的深度與流動。今天你的情緒感受力特別豐富，這是一份珍貴的天賦。允許自己完整地感受，不需要壓抑也不需要過度分析。',
    actionSuggestion: '找一個安全的方式表達今天的情緒。可以寫一封不寄出的信、對著鏡子說出你的感受，或用音樂來承載你的心情。情緒流動了就不會淤積。',
  },
  {
    id: 'wuxing-water-dream-01',
    tags: ['water', 'dream'],
    theme: '夢境洞察',
    message: '水掌管潛意識與夢境。今天的能量讓你與潛意識的連結特別強。夢境不是預言，而是你內心深處正在處理的課題的隱喻，值得被溫柔對待。',
    actionSuggestion: '在床頭放一本筆記本，醒來後立刻記下夢的片段。不需要解析每個細節，只記錄印象最深的畫面和感受。一週後回顧，你可能會發現有趣的模式。',
  },

  // ============================================
  // E. 十神擴充（10 × 2 = 20 條）
  // ============================================

  // --- 比肩 bi_jian: 團隊合作、獨立自主 ---
  {
    id: 'tengod-bi_jian-teamwork-01',
    tags: ['bi_jian', 'teamwork'],
    theme: '團隊合作',
    message: '比肩代表與你並肩同行的夥伴。今天的能量特別適合團隊協作——當每個人都發揮所長，一加一會遠大於二。你不需要獨自承擔一切，這正是團隊的意義。',
    actionSuggestion: '在今天的工作中，主動把一項任務分配或委託給你信任的夥伴。清楚說明你的期待，然後放手讓他們發揮。信任是最高效的合作方式。',
  },
  {
    id: 'tengod-bi_jian-independence-01',
    tags: ['bi_jian', 'independence'],
    theme: '獨立自主',
    message: '比肩也象徵你與自我的關係。今天是確認自我價值的好日子。你的能力和判斷值得被信賴——不需要等別人的認可才行動，你本身就是自己最可靠的後盾。',
    actionSuggestion: '選一件你一直在等別人點頭才敢做的事，今天自己做決定。記錄你的判斷理由，事後回顧時你會發現自己比想像中更可靠。',
  },

  // --- 劫財 jie_cai: 競爭正面化、分享精神 ---
  {
    id: 'tengod-jie_cai-competition-01',
    tags: ['jie_cai', 'competition'],
    theme: '競爭正面化',
    message: '劫財的能量帶來健康的競爭意識。真正的對手不是別人，而是昨天的自己。今天用「超越自我」的心態面對挑戰，你會發現進步比勝負更令人滿足。',
    actionSuggestion: '在今天的工作或學習中設定一個「個人最佳紀錄」挑戰。比昨天多完成一項任務、多學一個知識點，用數據記錄自己的進步軌跡。',
  },
  {
    id: 'tengod-jie_cai-sharing-01',
    tags: ['jie_cai', 'sharing'],
    theme: '分享精神',
    message: '劫財轉化為正面能量時，是慷慨的分享。今天你擁有的知識、經驗和資源，分享出去不但不會減少，反而會因為交流而增值。給予本身就是富足的證明。',
    actionSuggestion: '今天主動分享一個你最近學到的實用技巧或好用工具給同事或朋友。教別人的過程也是鞏固自己學習的最佳方式。',
  },

  // --- 食神 shi_shen: 享受生活、藝術創作 ---
  {
    id: 'tengod-shi_shen-enjoyment-01',
    tags: ['shi_shen', 'enjoyment'],
    theme: '享受生活',
    message: '食神是最懂生活情趣的能量。今天提醒你：你值得享受。不是因為完成了什麼才配得快樂，而是快樂本身就是你應得的生活品質。',
    actionSuggestion: '今天安排一件純粹讓你開心的事——吃一頓喜歡的餐點、泡一杯好茶、看一集喜歡的節目。全心投入享受的過程，不帶任何愧疚感。',
  },
  {
    id: 'tengod-shi_shen-creation-01',
    tags: ['shi_shen', 'creation'],
    theme: '藝術創作',
    message: '食神是天生的藝術家，今天你的創造力像泉水般自然湧出。不需要完美主義的枷鎖，讓雙手帶著你去探索各種可能。過程比成品更重要。',
    actionSuggestion: '花二十分鐘做一件「沒有目的的創作」。隨手塗鴉、自由書寫、或用手機拍下你覺得美的畫面。創作的快樂在於過程，不在於評價。',
  },

  // --- 傷官 shang_guan: 突破創新、自我表達 ---
  {
    id: 'tengod-shang_guan-innovation-01',
    tags: ['shang_guan', 'innovation'],
    theme: '突破創新',
    message: '傷官是打破框架的先鋒。今天你的思維特別活躍，能看到別人看不到的解法。那些「不按常理」的想法，往往正是改變現狀的突破口。',
    actionSuggestion: '挑一個你習以為常的做事流程，問自己：「如果完全重新設計，我會怎麼做？」寫下三個替代方案，哪怕看起來很大膽也值得記錄。',
  },
  {
    id: 'tengod-shang_guan-expression-01',
    tags: ['shang_guan', 'expression'],
    theme: '自我表達',
    message: '傷官能量讓你的表達方式獨具一格。今天說出的話會特別有穿透力，你的觀點值得被聽見。表達真實的自己需要勇氣，而今天你恰好擁有這份力量。',
    actionSuggestion: '今天在社群平台寫一篇短文、錄一段語音、或在會議中主動分享你的獨到見解。真實的聲音比完美的措辭更有感染力。',
  },

  // --- 正財 zheng_cai: 穩健理財、勤勞收穫 ---
  {
    id: 'tengod-zheng_cai-saving-01',
    tags: ['zheng_cai', 'saving'],
    theme: '穩健理財',
    message: '正財代表腳踏實地的財富累積。今天的能量提醒你：財務自由不是一夜之間發生的事，而是每天多存一點、少浪費一點的持續紀律。你的穩定就是最大的優勢。',
    actionSuggestion: '今天設定一個自動轉帳規則，每月固定存入一小筆金額到儲蓄帳戶。金額不需要大，重點是養成「先存再花」的習慣。',
  },
  {
    id: 'tengod-zheng_cai-diligence-01',
    tags: ['zheng_cai', 'diligence'],
    theme: '勤勞收穫',
    message: '正財的核心精神是「一分耕耘一分收穫」。今天你付出的每一份努力都在為未來鋪路。不要小看重複的日常——偉大的成就都是由無數個平凡的日子堆疊而成。',
    actionSuggestion: '今天專注完成手上最重要的一項工作任務，全心投入不分心。完成後給自己一個小獎勵，建立「努力、成就、獎勵」的正向循環。',
  },

  // --- 偏財 pian_cai: 人脈變現、投資眼光 ---
  {
    id: 'tengod-pian_cai-networking-01',
    tags: ['pian_cai', 'networking'],
    theme: '人脈變現',
    message: '偏財的能量來自人際網絡的流動。今天適合經營關係——不是功利的社交，而是真誠地關心別人的需要。當你先幫助他人，好的機會自然會回到你身邊。',
    actionSuggestion: '今天主動幫一位朋友或同事做一件小事：推薦一本書、分享一個機會、或介紹兩位可能合作的人彼此認識。利他是最好的投資策略。',
  },
  {
    id: 'tengod-pian_cai-investment-01',
    tags: ['pian_cai', 'investment'],
    theme: '投資眼光',
    message: '偏財讓你的財務直覺比平常敏銳。今天適合研究和學習投資知識，培養長期的財務判斷力。記住：最好的投資永遠是投資自己的認知和視野。',
    actionSuggestion: '花二十分鐘閱讀一篇理財文章或聽一集理財 Podcast。不急著行動，先建立知識框架。聰明的投資者從不憑衝動做決定。',
  },

  // --- 正官 zheng_guan: 責任擔當、制度建立 ---
  {
    id: 'tengod-zheng_guan-responsibility-01',
    tags: ['zheng_guan', 'responsibility'],
    theme: '責任擔當',
    message: '正官的能量帶來堅定的責任感。今天你內在的「領導者」正在甦醒——不是因為頭銜，而是因為你願意為結果負責。承擔責任的人，也是最值得被信賴的人。',
    actionSuggestion: '今天主動承擔一件團隊中沒有人負責的事情。不需要等指派，主動說「這件事我來處理」。行動本身就是領導力的展現。',
  },
  {
    id: 'tengod-zheng_guan-system-01',
    tags: ['zheng_guan', 'system'],
    theme: '制度建立',
    message: '正官也象徵秩序與制度。今天適合建立讓未來更順暢的系統和流程。把重複的工作標準化，你就能把精力留給真正需要創意的事情。',
    actionSuggestion: '把一個你經常重複做的工作整理成檢查清單或標準流程。寫下來分享給團隊，讓好的做法可以被複製，而不是每次都從零開始。',
  },

  // --- 七殺 qi_sha: 危機處理、魄力決策 ---
  {
    id: 'tengod-qi_sha-crisis-01',
    tags: ['qi_sha', 'crisis'],
    theme: '危機處理',
    message: '七殺的能量在壓力下反而更強。今天如果遇到突發狀況，你會發現自己比想像中更冷靜、更能隨機應變。壓力是你的催化劑，不是你的阻礙。',
    actionSuggestion: '提前為可能的突發狀況準備一個「Plan B」。花五分鐘想想：如果最重要的事出了變數，你的替代方案是什麼？有備無患讓你更從容。',
  },
  {
    id: 'tengod-qi_sha-boldness-01',
    tags: ['qi_sha', 'boldness'],
    theme: '魄力決策',
    message: '七殺帶來果斷的行動力。今天你有能力做出那些「需要膽量」的決定。{{dayMaster}}的力量支持你在關鍵時刻展現魄力——猶豫不決的成本往往高於做出選擇。',
    actionSuggestion: '找出一個你拖延超過一週的決定，今天就做出選擇。設一個十分鐘的倒數計時器，時間到就執行你的決定。行動是焦慮最好的解藥。',
  },

  // --- 正印 zheng_yin: 導師學習、母性關懷 ---
  {
    id: 'tengod-zheng_yin-mentor-01',
    tags: ['zheng_yin', 'mentor'],
    theme: '導師學習',
    message: '正印是最溫暖的學習能量。今天特別適合向你尊敬的人請教。每個優秀的人背後，都有一位或多位引路的導師。主動尋求指導不是示弱，是智慧的表現。',
    actionSuggestion: '今天向一位你尊敬的前輩或同事請教一個具體問題。準備好你的問題再去問，展現你的誠意和思考。好的提問本身就是學習的起點。',
  },
  {
    id: 'tengod-zheng_yin-nurture-01',
    tags: ['zheng_yin', 'nurture'],
    theme: '母性關懷',
    message: '正印帶來無條件的關愛能量。今天你內在的照顧者被喚醒了——不只是照顧別人，更要照顧自己。你是自己最重要的責任對象，值得被溫柔以待。',
    actionSuggestion: '今天對自己說三句鼓勵的話，就像你會對一個你很疼愛的人說的那樣。也可以為自己做一件平常捨不得做的貼心小事：買一束花、泡個澡、早點休息。',
  },

  // --- 偏印 pian_yin: 獨立思考、冷門知識 ---
  {
    id: 'tengod-pian_yin-thinking-01',
    tags: ['pian_yin', 'thinking'],
    theme: '獨立思考',
    message: '偏印賦予你不從眾的洞察力。今天你看待事物的角度比別人更深一層。不要急著附和主流觀點——你的獨立思考能力正是你最珍貴的智識資產。',
    actionSuggestion: '今天讀到任何新聞或觀點時，先暫停三秒，問自己：「這真的是這樣嗎？有沒有其他可能的解讀？」培養「先思考再接受」的習慣。',
  },
  {
    id: 'tengod-pian_yin-niche-01',
    tags: ['pian_yin', 'niche'],
    theme: '冷門知識',
    message: '偏印的能量讓你對冷門、小眾的領域特別敏感。今天適合探索那些「不熱門但很迷人」的知識角落。你的獨特知識儲備，終有一天會在意想不到的場景派上用場。',
    actionSuggestion: '今天花十五分鐘鑽研一個你好奇但從未深入了解的冷門主題——古代曆法、冷門語言、罕見植物、小眾音樂流派。讓好奇心帶著你去冒險。',
  },

  // ============================================
  // A. 四季主題（12 條）
  // ============================================

  // --- 春 Spring ---
  {
    id: 'season-spring-seed-01',
    tags: ['spring', 'seed'],
    theme: '春日播種',
    message: '春天的氣息正在甦醒，萬物都在準備破土而出。{{dayMaster}}的你也正處在一個適合播種新意圖的時刻。把心中那顆蘊藏已久的想法輕輕種下，春天會給它陽光和雨水。',
    actionSuggestion: '今天在筆記本寫下三個你想在這一季實現的小目標，不用完美，先讓種子落地。',
  },
  {
    id: 'season-spring-sprout-01',
    tags: ['spring', 'sprout'],
    theme: '新芽萌發',
    message: '春天的能量是「開始」的能量。你最近感受到的那股躍躍欲試的衝動，正是內在創造力在向你招手。{{dayElement}}的力量為這份衝動注入了方向感。',
    actionSuggestion: '選一件你「想了很久但還沒開始」的事，今天花十五分鐘做它的第一步，讓萌芽看見光。',
  },
  {
    id: 'season-spring-fresh-01',
    tags: ['spring', 'fresh-start'],
    theme: '清新開始',
    message: '春天帶來清新的空氣，也帶來清新的視角。過去的經歷已經成為養分，現在的你可以用全新的眼光看待每一天。{{sunSign}}的能量支持你大膽嘗試新方向。',
    actionSuggestion: '今天嘗試一個小小的改變：換一條上班路線、吃一家沒去過的餐廳，或讀一本不同領域的書。',
  },

  // --- 夏 Summer ---
  {
    id: 'season-summer-bloom-01',
    tags: ['summer', 'bloom'],
    theme: '夏日綻放',
    message: '夏天是萬物展現最燦爛模樣的季節。你內在的才華和熱情也已經準備好綻放了。不需要等到完美，此刻就是展現自己的最佳時機。{{dayMaster}}的光芒正是夏日的主角。',
    actionSuggestion: '大膽展示你最近完成的一項成果——分享給同事、朋友或社群，讓你的努力被看見。',
  },
  {
    id: 'season-summer-passion-01',
    tags: ['summer', 'passion'],
    theme: '熱情高峰',
    message: '夏天的陽光不會問「我該不該照耀」，它就是照耀。今天的你也可以如此——讓內在的熱情自然流露，不需要理由。{{dayElement}}的火力與夏日同頻共振。',
    actionSuggestion: '今天投入你最有熱情的事至少三十分鐘，全神貫注地享受心流帶來的充實感。',
  },
  {
    id: 'season-summer-express-01',
    tags: ['summer', 'expression'],
    theme: '充分表現',
    message: '夏天的能量鼓勵你「說出來」和「做出來」。你的想法值得被聽見，你的創意值得被實現。{{sunSign}}為你的表達力加上了獨特的色彩。',
    actionSuggestion: '在今天的對話或會議中，主動分享你的一個觀點或提議，讓你的聲音成為夏日的一部分。',
  },

  // --- 秋 Autumn ---
  {
    id: 'season-autumn-harvest-01',
    tags: ['autumn', 'harvest'],
    theme: '豐收時節',
    message: '秋天是收穫的季節。回顧這段時間的耕耘，你已經累積了比想像中更多的成果。{{dayMaster}}的你值得停下來，好好欣賞自己走過的路。',
    actionSuggestion: '列出這個月你完成的五件事，無論大小。為每一件事給自己一個肯定的微笑。',
  },
  {
    id: 'season-autumn-gratitude-01',
    tags: ['autumn', 'gratitude'],
    theme: '感恩收藏',
    message: '秋天的金黃色是大自然的「謝謝」。今天也適合讓感恩的心情流動——感謝幫助過你的人、支持你的環境，也感謝一直努力的自己。',
    actionSuggestion: '選一位最近幫助過你的人，傳一則真誠的感謝訊息給他。具體地說出他做了什麼讓你感激。',
  },
  {
    id: 'season-autumn-release-01',
    tags: ['autumn', 'release'],
    theme: '優雅放手',
    message: '秋天的落葉不是失去，而是樹木為了迎接新生所做的準備。{{moonSign}}的能量提醒你：有些東西放下了，手裡才有空間接住更好的。',
    actionSuggestion: '找出一件已經不再適合你的習慣、物品或念頭，溫柔地與它道別，騰出空間給新的可能。',
  },

  // --- 冬 Winter ---
  {
    id: 'season-winter-rest-01',
    tags: ['winter', 'rest'],
    theme: '冬日靜養',
    message: '冬天是大自然的休息期，萬物在靜謐中蓄積力量。你也可以給自己這份允許——放慢腳步不是停滯，而是在為下一段旅程養精蓄銳。',
    actionSuggestion: '今晚比平常早三十分鐘上床。用省下的時間喝杯熱飲、聽一段輕音樂，讓身心回歸柔軟。',
  },
  {
    id: 'season-winter-reflect-01',
    tags: ['winter', 'reflection'],
    theme: '沉澱回顧',
    message: '冬天的寂靜適合往內看。當外界的節奏放緩，正是整理內心的好時機。{{dayMaster}}在這段安靜的時間裡，可以看見平時被忙碌遮蔽的洞見。',
    actionSuggestion: '花十分鐘寫下「今年我學到最重要的三件事」，用文字為自己的成長留下紀錄。',
  },
  {
    id: 'season-winter-prepare-01',
    tags: ['winter', 'preparation'],
    theme: '蓄勢待發',
    message: '冬天的地底下，種子正在悄悄準備。你現在的每一分沉澱和學習，都是為了春天綻放時更加有力。{{dayElement}}的深層能量正在靜靜地為你積蓄。',
    actionSuggestion: '為下一個目標做一件「準備工作」：閱讀相關資料、列一份計畫大綱、或和有經驗的人聊聊。',
  },

  // ============================================
  // B. 特殊日子（8 條）
  // ============================================
  {
    id: 'special-monday-motivation-01',
    tags: ['monday-motivation', 'special'],
    theme: '週一正向啟動',
    message: '新的一週是一張全新的畫布。上週的故事已經寫完，這週的精彩由你來定義。{{dayMaster}}帶著嶄新的意圖出發，每個週一都是一次微型的重新開始。',
    actionSuggestion: '在今天的第一個小時內，寫下本週最想完成的一件事，把它貼在看得見的地方作為這週的燈塔。',
  },
  {
    id: 'special-friday-celebration-01',
    tags: ['friday-celebration', 'special'],
    theme: '週五慶祝成果',
    message: '一整週的努力值得被看見。不管這週有多少挑戰，你都走過來了。{{sunSign}}的力量伴隨你度過每一天，現在是慶祝的時刻。',
    actionSuggestion: '回顧本週，挑出一件你做得最滿意的事，用你喜歡的方式獎勵自己——一頓美食、一段散步、或一句對自己說的「辛苦了」。',
  },
  {
    id: 'special-weekend-rest-01',
    tags: ['weekend-rest', 'special'],
    theme: '週末充電',
    message: '週末是為你的內在電池充電的時間。真正的高效不是不停地做，而是在做與休之間找到節奏。允許自己今天完全放鬆，這是你給下一週最好的禮物。',
    actionSuggestion: '今天安排至少兩小時的「無目的時光」——不為產出、不為效率，純粹做一件讓你開心的事。',
  },
  {
    id: 'special-new-moon-01',
    tags: ['new-moon', 'special'],
    theme: '新月許願',
    message: '新月是宇宙按下的「重新開始」鍵。在這個能量清新的時刻，你的意圖特別容易被播種和孕育。{{moonSign}}的新月為你開啟了一扇內在的門。',
    actionSuggestion: '找一個安靜的角落，寫下一到三個你希望在這個月相週期內實現的意圖。用正面語句描述，像是「我正在……」。',
  },
  {
    id: 'special-full-moon-01',
    tags: ['full-moon', 'special'],
    theme: '滿月完成',
    message: '滿月照亮了一切。在這份圓滿的光芒中，你可以看見自己的進步，也可以溫柔地釋放不再需要的東西。{{moonSign}}的滿月能量支持你完成和放下。',
    actionSuggestion: '今晚花五分鐘進行「滿月清理」：寫下一件你已經完成的事（慶祝它），再寫下一件你準備放下的事（祝福它）。',
  },
  {
    id: 'special-solstice-01',
    tags: ['solstice', 'special'],
    theme: '至日轉折',
    message: '至日是光與暗的轉折點，也是反思與更新的天然時機。站在這個宇宙的分水嶺上，你有機會重新校準自己的方向。{{dayElement}}的能量在此刻特別深沉有力。',
    actionSuggestion: '寫下「我想帶進下半年的三樣東西」和「我想留在上半年的三樣東西」，用這份覺察迎接新的循環。',
  },
  {
    id: 'special-birthday-01',
    tags: ['birthday', 'special'],
    theme: '生日新年',
    message: '生日快樂！今天是屬於你的個人新年。{{sunSign}}的太陽在這一天為你注入了整年份的光能。你的存在本身就是這個世界收到的禮物。',
    actionSuggestion: '為自己寫一封生日信：感謝過去一年的自己，然後描述未來一年你想成為的模樣。封起來，明年生日再打開。',
  },
  {
    id: 'special-new-year-01',
    tags: ['new-year', 'special'],
    theme: '新年意圖',
    message: '新的一年像一本空白的書等著你來寫。不需要完美的計畫，只需要一個清晰的意圖。{{dayMaster}}帶著全新的能量踏入這一年，每一步都是嶄新的。',
    actionSuggestion: '選一個「年度關鍵字」——不是目標清單，而是一個詞（如「勇敢」「從容」「創造」），讓它成為今年決策的指南針。',
  },

  // ============================================
  // C. 日主強弱主題（15 條）
  // ============================================

  // --- 日主旺 Strong ---
  {
    id: 'daymaster-strong-leadership-01',
    tags: ['daymaster-strong', 'leadership'],
    theme: '領導力展現',
    message: '{{dayMaster}}日主能量充沛，你今天自帶領導者的光環。你的自信和決斷力是團隊前進的動力，適合站出來引導方向、做出關鍵決定。',
    actionSuggestion: '今天主動承擔一個需要帶領他人的任務——主持會議、提出方案、或幫助後輩解決問題。',
  },
  {
    id: 'daymaster-strong-independence-01',
    tags: ['daymaster-strong', 'independence'],
    theme: '獨立決策',
    message: '日主旺盛的今天，你的判斷力特別敏銳。{{dayMaster}}的強健能量讓你有足夠的底氣相信自己的分析和直覺，適合獨立做出重要的選擇。',
    actionSuggestion: '那個你一直在猶豫的決定，今天給自己一個明確的答案。相信你的判斷，行動比等待更有力量。',
  },
  {
    id: 'daymaster-strong-confidence-01',
    tags: ['daymaster-strong', 'confidence'],
    theme: '自信表達',
    message: '今天{{dayMaster}}的能量飽滿而穩定，這份內在的厚實感讓你的每一句話都更有份量。不需要刻意展現，你自然散發的篤定感就是最有說服力的語言。',
    actionSuggestion: '在今天的一場對話中，清楚表達你的立場和需求。用「我認為」「我需要」開頭，練習直接而溫和的溝通。',
  },
  {
    id: 'daymaster-strong-protect-01',
    tags: ['daymaster-strong', 'protect'],
    theme: '守護他人',
    message: '日主旺盛時，你不只有照顧自己的餘裕，還有保護他人的能力。今天你的存在對身邊的人來說是一種安定的力量——你比自己以為的更有影響力。',
    actionSuggestion: '留意身邊是否有人正在承受壓力，主動問一句「你還好嗎？需要幫忙嗎？」你的關心可能是他今天最大的支持。',
  },
  {
    id: 'daymaster-strong-share-01',
    tags: ['daymaster-strong', 'share'],
    theme: '能量分享',
    message: '{{dayMaster}}日主能量旺盛的你，今天像一顆滿電的太陽。最好的能量管理不是囤積，而是流動——當你把光分享出去，自己也會更明亮。',
    actionSuggestion: '今天把你的經驗或知識分享給一個需要的人——教同事一個技巧、推薦一本好書、或陪朋友聊聊他的煩惱。',
  },

  // --- 日主中和 Moderate ---
  {
    id: 'daymaster-moderate-balance-01',
    tags: ['daymaster-moderate', 'balance'],
    theme: '平衡智慧',
    message: '{{dayMaster}}日主今天處於中和的好狀態，不偏不倚。這份平衡讓你能同時看見事情的多個面向，做出考慮周全的判斷。平衡本身就是一種高級的智慧。',
    actionSuggestion: '面對今天的選擇時，練習「雙欄思考」：在紙上畫兩欄，分別寫下每個選項的好處，讓理性和感性共同參與決策。',
  },
  {
    id: 'daymaster-moderate-flexibility-01',
    tags: ['daymaster-moderate', 'flexibility'],
    theme: '彈性適應',
    message: '日主中和的你擁有難得的彈性——既不會太固執，也不會太搖擺。今天的環境變化對你來說不是挑戰，而是展現適應力的舞台。{{dayElement}}的流動支持你順勢調整。',
    actionSuggestion: '如果今天計畫有變，不急著抗拒。先觀察三分鐘，問自己「這個變化帶來了什麼新的可能？」再決定下一步。',
  },
  {
    id: 'daymaster-moderate-harmony-01',
    tags: ['daymaster-moderate', 'harmony'],
    theme: '和諧關係',
    message: '中和的{{dayMaster}}能量讓你在人際互動中特別自在。你既能表達自己的需求，也能聆聽他人的聲音。這份和諧感讓今天的每一段對話都有可能成為美好的連結。',
    actionSuggestion: '今天在一場對話中，試試「先聽後說」：讓對方完整表達完畢後，再回應。你會發現傾聽本身就是最好的溝通。',
  },
  {
    id: 'daymaster-moderate-steady-01',
    tags: ['daymaster-moderate', 'steady'],
    theme: '穩步前進',
    message: '日主不過強也不過弱，今天適合「穩穩地推進」。不需要衝刺也不需要等待，保持你自然的節奏就好。{{dayMaster}}在中和的狀態下效率最高。',
    actionSuggestion: '把今天最重要的任務分成三個小步驟，每完成一步就打個勾。穩定的節奏比爆發的衝勁走得更遠。',
  },
  {
    id: 'daymaster-moderate-holistic-01',
    tags: ['daymaster-moderate', 'holistic'],
    theme: '全局思維',
    message: '中和的日主能量賦予你一雙「廣角鏡頭」的眼睛。你今天特別能看到大局、理解系統中各部分的關聯。{{sunSign}}的直覺與{{dayMaster}}的分析力完美互補。',
    actionSuggestion: '找出一個你正在處理的問題，退後一步從「整體」的角度重新審視它。畫一張心智圖，把所有相關因素連結起來看。',
  },

  // --- 日主弱 Weak ---
  {
    id: 'daymaster-weak-leverage-01',
    tags: ['daymaster-weak', 'leverage'],
    theme: '借力使力',
    message: '{{dayMaster}}的能量今天比較內斂，而這正是「借力使力」的最佳時機。聰明的人不是什麼都自己來，而是善用身邊的資源和工具讓事情事半功倍。',
    actionSuggestion: '今天找一個工具或方法來幫你省力：用自動化處理重複工作、用模板加速文件、或把一個任務委託給適合的人。',
  },
  {
    id: 'daymaster-weak-teamwork-01',
    tags: ['daymaster-weak', 'teamwork'],
    theme: '團隊合作',
    message: '今天的能量適合讓團隊的力量帶你前進。一個人走得快，一群人走得遠。{{dayMaster}}在團隊中扮演的角色不需要是最前面的那個，而是最懂得連結每個人的那個。',
    actionSuggestion: '今天主動參與一個協作任務。在合作中專注於「我能貢獻什麼」和「誰能幫助我」，感受眾人同行的力量。',
  },
  {
    id: 'daymaster-weak-accept-01',
    tags: ['daymaster-weak', 'accept-help'],
    theme: '接受幫助',
    message: '接受幫助不是示弱，而是一種信任的表達。今天{{dayMaster}}的能量邀請你練習一個勇敢的動作——開口說「我需要幫忙」。你會發現身邊的人其實一直在等你開口。',
    actionSuggestion: '今天對一個人說「你可以幫我一下嗎？」不管是工作上的協助還是情感上的傾聽，讓別人有機會為你付出。',
  },
  {
    id: 'daymaster-weak-recharge-01',
    tags: ['daymaster-weak', 'recharge'],
    theme: '養精蓄銳',
    message: '能量內斂的日子，是身體在告訴你「該充電了」。這不是懈怠，而是智慧。{{dayMaster}}在休息中蓄積的力量，會在需要的時刻加倍展現出來。',
    actionSuggestion: '今天刻意減少一項待辦事項，把省下來的精力花在休息上：小睡十五分鐘、到戶外走走、或做一組深呼吸練習。',
  },
  {
    id: 'daymaster-weak-smart-01',
    tags: ['daymaster-weak', 'smart-choice'],
    theme: '智慧選擇',
    message: '今天的{{dayMaster}}能量提醒你：力量有限時，選擇比努力更重要。把精力集中在真正重要的一到兩件事上，放下其他的。少即是多，這是屬於你的策略性智慧。',
    actionSuggestion: '審視今天的待辦清單，圈出最重要的兩件事，其餘的延後或刪除。專注完成這兩件事，就是今天最大的成功。',
  },
];

/**
 * 統一模板庫 — 合併所有分類模板
 *
 * 結構：
 * - BASE_TEMPLATES: 核心模板（五行 + 十神 + 相位 + fallback + 季節 + 日主）
 * - ZODIAC_TEMPLATES: 12 星座個別模板
 * - PLANETARY_TEMPLATES: 行星主題 + 逆行 + 相位組合
 * - ELEMENT_SEASON_TEMPLATES: 五行深化 + 四季主題
 * - LIFE_SCENE_TEMPLATES: 生活場景（職涯/人際/健康/財務/學習）
 */
export const DAILY_TEMPLATES: readonly FortuneTemplate[] = [
  ...BASE_TEMPLATES,
  ...ZODIAC_TEMPLATES,
  ...PLANETARY_TEMPLATES,
  ...ELEMENT_SEASON_TEMPLATES,
  ...LIFE_SCENE_TEMPLATES,
];

/**
 * 根據標籤匹配模板
 */
export function matchTemplates(
  tags: readonly string[],
  limit: number = 3,
): FortuneTemplate[] {
  const scored = DAILY_TEMPLATES.map((template) => {
    const matchCount = template.tags.filter((tag) => tags.includes(tag)).length;
    return { template, score: matchCount };
  });

  scored.sort((a, b) => b.score - a.score);

  // 至少返回 fallback 模板
  const results = scored
    .filter((s) => s.score > 0)
    .slice(0, limit)
    .map((s) => s.template);

  if (results.length === 0) {
    const fallbacks = DAILY_TEMPLATES.filter((t) => t.tags.includes('fallback'));
    return fallbacks.slice(0, limit);
  }

  return results;
}
