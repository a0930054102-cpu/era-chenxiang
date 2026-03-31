/*
 * ============================================================
 *  時代沉香 Era Chenxiang — 互動邏輯 (v2)
 *  五味沉香 · 易經查詢 · 黃帝內經
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     1. 導航列 — 滾動效果 + 漢堡選單
     ========================================================== */
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ==========================================================
     2. 平滑滾動
     ========================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navH = navbar.offsetHeight;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 20, behavior: 'smooth' });
      }
    });
  });

  /* ==========================================================
     3. Intersection Observer — 滾動進入動畫
     ========================================================== */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => obs.observe(el));
  }

  /* ==========================================================
     4. FAQ 手風琴
     ========================================================== */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    if (q) q.addEventListener('click', () => {
      const active = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!active) item.classList.add('active');
    });
  });

  /* ==========================================================
     5. 查詢系統 Tabs 切換
     ========================================================== */
  document.querySelectorAll('.query-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.query-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.query-panel').forEach(p => { if(p) p.classList.remove('active'); });
      tab.classList.add('active');
      const panel = document.getElementById(tab.dataset.target);
      if (panel) panel.classList.add('active');
    });
  });

  /* ==========================================================
     6. 五味測算邏輯
     ========================================================== */
  const calcBtn = document.getElementById('wuxing-calc-btn');
  if (calcBtn) calcBtn.addEventListener('click', calculateWuwei);

  const calToggle = document.querySelector('.calendar-toggle');
  if (calToggle) calToggle.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      calToggle.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  function calculateWuwei() {
    const resultDiv = document.getElementById('calc-result');
    const year = parseInt(document.getElementById('calc-year').value);
    const month = parseInt(document.getElementById('calc-month').value);
    const day = parseInt(document.getElementById('calc-day').value);

    if (!year || !month || !day) { showInlineError(resultDiv, '請填寫完整的出生日期'); return; }
    if (year < 1900 || year > 2100) { showInlineError(resultDiv, '請輸入有效的年份（1900-2100）'); return; }
    if (month < 1 || month > 12) { showInlineError(resultDiv, '請輸入有效的月份'); return; }

    const stems = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
    const branches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    const stem = stems[(year - 4) % 10];
    const branch = branches[(year - 4) % 12];

    const eMap = { '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水' };
    const mainEl = eMap[stem];

    const fMap = {
      '木': { icon:'🍋', flavor:'酸', product:'酸味沉香', organ:'肝膽', temp:'120°C',
        desc:'酸味入肝，《黃帝內經》曰「酸入肝」。您的五行屬木，五味屬「酸」。建議使用酸味沉香，幫助疏肝理氣、柔肝養血。' },
      '火': { icon:'☕', flavor:'苦', product:'苦味沉香', organ:'心腦', temp:'130°C',
        desc:'苦味入心，《黃帝內經》曰「苦入心」。您的五行屬火，五味屬「苦」。建議使用苦味沉香，有助於清心降火、安神定志。' },
      '土': { icon:'🍯', flavor:'甘', product:'甘味沉香', organ:'脾胃', temp:'150°C',
        desc:'甘味入脾，《黃帝內經》曰「甘入脾」。您的五行屬土，五味屬「甘」。建議使用甘味沉香，幫助健脾益氣、調和脾胃。' },
      '金': { icon:'🌶️', flavor:'辛', product:'辛味沉香', organ:'肺系', temp:'145°C',
        desc:'辛味入肺，《黃帝內經》曰「辛入肺」。您的五行屬金，五味屬「辛」。建議使用辛味沉香，有助於宣肺理氣、清淨呼吸。' },
      '水': { icon:'🧂', flavor:'鹹', product:'鹹味沉香', organ:'腎元', temp:'160°C',
        desc:'鹹味入腎，《黃帝內經》曰「鹹入腎」。您的五行屬水，五味屬「鹹」。建議使用鹹味沉香，幫助滋陰補腎、固本培元。' }
    };
    const d = fMap[mainEl];

    resultDiv.classList.remove('show','calc-error');
    resultDiv.style.cssText = '';
    resultDiv.innerHTML = `
      <div class="result-element">${d.icon}</div>
      <div class="result-text">${stem}${branch}年生 · 五行屬${mainEl} · 五味屬「${d.flavor}」</div>
      <div class="result-desc" style="margin-top:8px;">
        對應臟腑：<strong>${d.organ}</strong><br>
        推薦沉香：<strong>${d.product}</strong>（${d.temp}）<br><br>${d.desc}
      </div>`;
    resultDiv.classList.add('show');
  }

  /* ==========================================================
     7. 易經查詢邏輯
     ========================================================== */
  const ichingBtn = document.getElementById('iching-calc-btn');
  if (ichingBtn) ichingBtn.addEventListener('click', calculateIChing);

  const bgNames = { '乾':'乾☰','兌':'兌☱','離':'離☲','震':'震☳','巽':'巽☴','坎':'坎☵','艮':'艮☶','坤':'坤☷' };
  const bgWuxing = { '乾':'金','兌':'金','離':'火','震':'木','巽':'木','坎':'水','艮':'土','坤':'土' };

  function getLower(month) {
    return ['震','兌','乾','離','巽','坎','艮','坤','震','兌','乾','離'][(month-1)%12];
  }
  function getUpper(day) {
    const d = Math.max(1,Math.min(day,31));
    if (d<=5) return '乾'; if (d<=10) return '兌'; if (d<=15) return '離';
    if (d<=20) return '震'; if (d<=25) return '巽'; if (d<=30) return '坎'; return '艮';
  }

  const hexDB = {
    '乾坤':{name:'天地否',sym:'䷋',desc:'否之匪人，不利君子貞。天地不交，萬物不通。',wx:'金土',adv:'否極泰來，困頓後是轉機。以辛味沉香清肺開鬱，靜待時機。'},
    '坤乾':{name:'地天泰',sym:'䷊',desc:'小往大來，吉亨。天地交而萬物通。大吉之卦。',wx:'土金',adv:'天地和合，以甘味沉香固本培元，乘勢而為。'},
    '乾乾':{name:'乾為天',sym:'䷀',desc:'元亨利貞。剛健中正，純陽之卦。',wx:'金',adv:'天生萬物，剛健不息。以辛味沉香護肺養氣，勇往直前。'},
    '坤坤':{name:'坤為地',sym:'䷁',desc:'元亨，利牝馬之貞。柔順承天，厚德載物。',wx:'土',adv:'厚德載物，以甘味沉香健脾和胃，穩步前行。'},
    '坎坎':{name:'坎為水',sym:'䷜',desc:'習坎，有孚，維心亨。重險之卦。',wx:'水',adv:'水善利萬物而不爭。以鹹味沉香涵養腎元，堅韌不拔。'},
    '離離':{name:'離為火',sym:'䷝',desc:'利貞，亨。明兩作離，繼明照於四方。',wx:'火',adv:'明德照四方。以苦味沉香清心降火，守護內心平靜。'},
    '震震':{name:'震為雷',sym:'䷲',desc:'亨。震來虩虩，笑言啞啞。',wx:'木',adv:'雷動萬物，新生開始。以酸味沉香疏肝理氣，勇敢轉變。'},
    '巽巽':{name:'巽為風',sym:'䷸',desc:'小亨，利有攸往。順從之風，潤物無聲。',wx:'木',adv:'柔而能剛。以酸味沉香疏導氣機，順應自然。'},
    '兌兌':{name:'兌為澤',sym:'䷹',desc:'亨，利貞。兩澤相連，以朋友講習。',wx:'金',adv:'悅而能和。以辛味沉香清肺養氣，保持身心和悅。'},
    '艮艮':{name:'艮為山',sym:'䷮',desc:'知止而止，安定身心。',wx:'土',adv:'靜止中蘊含力量。以甘味沉香安定脾胃，在靜默中找到力量。'},
    '坎離':{name:'水火既濟',sym:'䷾',desc:'亨小，利貞。水火相交，已成之功。',wx:'水火',adv:'水火交融。以苦味沉香清心、鹹味沉香涵腎，身心和諧。'},
    '離坎':{name:'火水未濟',sym:'䷿',desc:'亨。將成未成，仍需努力。',wx:'火水',adv:'保持耐心，以甘味沉香安定脾胃，穩紮穩打。'},
    '震巽':{name:'雷風恆',sym:'䷟',desc:'亨，無咎。雷風相薄，恒久之道。',wx:'木',adv:'持之以恆。以酸味沉香疏肝理氣，久久為功。'},
    '巽震':{name:'風雷益',sym:'䷩',desc:'利有攸往。損上益下，民悅無疆。',wx:'木',adv:'益者善也。以酸味沉香疏導氣機，利於進取。'},
    '乾兌':{name:'天澤履',sym:'䷉',desc:'履虎尾，不咥人，亨。謹慎行事。',wx:'金',adv:'如履虎尾而安。以辛味沉香清肺養氣，保持清明判斷。'},
    '兌乾':{name:'澤天夬',sym:'䷪',desc:'揚于王庭。決而能和，剛決柔也。',wx:'金',adv:'果斷決策。以辛味沉香清肺開鬱，做出正確抉擇。'},
    '乾離':{name:'天火同人',sym:'䷌',desc:'同人于野，亨。和同之象。',wx:'金火',adv:'與人同心。以苦味沉香清心明志，建立良好關係。'},
    '離乾':{name:'火天大有',sym:'䷍',desc:'元亨。大有收穫。',wx:'火金',adv:'大有可為。以苦味沉香清心降火，善用豐收時機。'},
    '乾坎':{name:'天水訟',sym:'䷅',desc:'有孚窒惕。爭訟之卦，宜和不宜鬥。',wx:'金水',adv:'和為貴。以鹹味沉香涵養腎元，冷靜面對爭端。'},
    '坎乾':{name:'水天需',sym:'䷄',desc:'有孚，光亨。需則亨也。',wx:'水金',adv:'耐心等待。以辛味沉香養精蓄銳，時機自會到來。'}
  };

  function calculateIChing() {
    const r = document.getElementById('iching-result');
    const year = parseInt(document.getElementById('iching-year').value);
    const month = parseInt(document.getElementById('iching-month').value);
    const day = parseInt(document.getElementById('iching-day').value);
    if (!year||!month||!day) { showInlineError(r,'請填寫完整的出生日期'); return; }

    const lo = getLower(month), hi = getUpper(day), key = hi+lo;
    let h = hexDB[key];
    if (!h) {
      const w = bgWuxing[hi]||'土';
      h = { name:`${bgNames[hi]}在${bgNames[lo]}上`, sym:'䷀', desc:`上卦${bgNames[hi]}，下卦${bgNames[lo]}。此卦示人生變化之機。`, wx:w, adv:'順應自然，以對應五味沉香調養身心。' };
    }
    const fm = {'金':'辛','木':'酸','水':'鹹','火':'苦','土':'甘'};
    const mf = fm[h.wx.charAt(0)]||'甘';

    r.classList.remove('show','calc-error'); r.style.cssText='';
    r.innerHTML = `
      <div class="result-element">${h.sym}</div>
      <div class="result-text">${h.name}</div>
      <div class="result-desc" style="margin-top:8px;">
        <strong>卦辭：</strong>${h.desc}<br><br>
        <strong>五行屬性：</strong>${h.wx}<br>
        <strong>對應五味：</strong>${mf}<br><br>
        <strong>養生建議：</strong>${h.adv}
      </div>`;
    r.classList.add('show');
  }

  /* ==========================================================
     8. 黃帝內經查詢邏輯
     ========================================================== */
  const sBtn = document.getElementById('huangdi-season-btn');
  if (sBtn) sBtn.addEventListener('click', () => {
    const v = document.getElementById('huangdi-season').value;
    if (v) showSeason(v);
  });
  const ymBtn = document.getElementById('huangdi-symptom-btn');
  if (ymBtn) ymBtn.addEventListener('click', () => {
    const v = document.getElementById('huangdi-symptom').value;
    if (v) showSymptom(v);
  });

  const seasons = {
    spring:{nm:'春',el:'木',og:'肝膽',fl:'酸',ic:'🌱',
      q:'春三月，此謂發陳，天地俱生，萬物以榮。夜臥早起，廣步於庭，被髮緩形，以使志生。',
      mn:'春天是萬物生發的季節。應早睡早起，在庭院中散步，放鬆身心，讓志氣自然生發。',
      ad:'春季養肝為先。建議早睡早起，多食酸味食物（如烏梅、山楂），配合酸味沉香疏導肝氣。避免怒氣傷肝。',
      ag:'🍋 酸味沉香 · 木元素 · 肝膽疏導（120°C）'},
    summer:{nm:'夏',el:'火',og:'心',fl:'苦',ic:'☀️',
      q:'夏三月，此謂蕃秀，天地氣交，萬物華實。夜臥早起，無厭於日，使志無怒。',
      mn:'夏天是萬物繁茂的季節。應晚睡早起，保持心境平和，讓志氣得以舒展。',
      ad:'夏季養心為先。建議適度午休，多食苦味食物（如苦瓜、蓮子心），配合苦味沉香清心降火。避免大汗淋漓傷心氣。',
      ag:'☕ 苦味沉香 · 火元素 · 心腦平衡（130°C）'},
    lateSummer:{nm:'長夏',el:'土',og:'脾胃',fl:'甘',ic:'🌾',
      q:'脾主長夏，此時土氣最旺。飲食調和，勿過飽，勿食生冷，以養脾胃。',
      mn:'長夏（夏末秋初）土氣最旺盛，脾胃最為活躍，應特別注意飲食調和。',
      ad:'長夏養脾為先。建議規律飲食，忌生冷油膩，多食甘味食物（如山藥、紅棗），配合甘味沉香健脾和胃。',
      ag:'🍯 甘味沉香 · 土元素 · 脾胃調和（150°C）'},
    autumn:{nm:'秋',el:'金',og:'肺',fl:'辛',ic:'🍂',
      q:'秋三月，此謂容平，天氣以急，地氣以明。早臥早起，與雞俱興，使志安寧。',
      mn:'秋天是收斂的季節。應早睡早起，保持心境安寧，順應天地的收斂之氣。',
      ad:'秋季養肺為先。建議早睡早起，多食辛味食物（如白蘿蔔、生薑），配合辛味沉香宣肺理氣。注意防燥傷肺。',
      ag:'🌶️ 辛味沉香 · 金元素 · 肺系養護（145°C）'},
    winter:{nm:'冬',el:'水',og:'腎',fl:'鹹',ic:'❄️',
      q:'冬三月，此謂閉藏，水冰地坼，無擾乎陽。早臥晚起，必待日光。',
      mn:'冬天是閉藏的季節。應早睡晚起，等太陽出來再起床，不要擾動體內的陽氣。',
      ad:'冬季養腎為先。建議早睡晚起，注意保暖，多食鹹味食物（如海帶、紫菜），配合鹹味沉香溫養腎氣。',
      ag:'🧂 鹹味沉香 · 水元素 · 腎元涵養（160°C）'}
  };

  const symptoms = {
    insomnia:{nm:'睡不好/失眠',el:'火',og:'心',fl:'苦',ic:'🌙',
      q:'心者，君主之官也，神明出焉。',
      mn:'心主宰精神和意識。心氣不足或心火上炎，都會導致失眠。',
      ad:'睡前1小時使用苦味沉香薰香，避免電子產品，配合冥想或深呼吸。',
      ag:'☕ 苦味沉香 · 火元素'},
    anxiety:{nm:'容易焦慮/緊張',el:'木',og:'肝',fl:'酸',ic:'😰',
      q:'肝者，將軍之官，謀慮出焉。',
      mn:'肝主謀慮。肝氣鬱結，人就會焦慮不安。',
      ad:'使用酸味沉香疏導肝氣。配合輕度運動（散步、瑜伽），找到紓壓方式。',
      ag:'🍋 酸味沉香 · 木元素'},
    digestion:{nm:'消化不良/脹氣',el:'土',og:'脾',fl:'甘',ic:'🤢',
      q:'脾胃者，倉廩之官，五味出焉。',
      mn:'脾胃是後天之本，負責消化吸收。脾胃虛弱會消化不良。',
      ad:'餐後使用甘味沉香。飲食規律，細嚼慢嚥，忌暴飲暴食。',
      ag:'🍯 甘味沉香 · 土元素'},
    breathing:{nm:'呼吸不順/咳嗽',el:'金',og:'肺',fl:'辛',ic:'🤧',
      q:'肺者，相傅之官，治節出焉。',
      mn:'肺主呼吸和一身之氣。肺氣不暢就會呼吸不順。',
      ad:'每日使用辛味沉香薰香淨化呼吸環境。配合深呼吸練習。',
      ag:'🌶️ 辛味沉香 · 金元素'},
    fatigue:{nm:'容易疲倦/腰酸',el:'水',og:'腎',fl:'鹹',ic:'😩',
      q:'腎者，作強之官，技巧出焉。',
      mn:'腎是力量的源泉，主骨生髓。腎氣不足就會容易疲倦。',
      ad:'使用鹹味沉香溫養腎氣。規律作息，避免熬夜，配合溫水泡腳。',
      ag:'🧂 鹹味沉香 · 水元素'},
    neckPain:{nm:'肩頸僵硬',el:'木',og:'肝',fl:'酸',ic:'😣',
      q:'肝主筋，其華在爪。',
      mn:'肝主管全身筋脈。肝氣不暢，筋脈緊繃，肩頸僵硬。',
      ad:'使用酸味沉香疏肝理氣。配合肩頸伸展，每小時起身活動5分鐘。',
      ag:'🍋 酸味沉香 · 木元素'},
    palpitation:{nm:'心悸/心跳快',el:'火',og:'心',fl:'苦',ic:'💓',
      q:'心主血脉。心氣虛則悸，實則痛。',
      mn:'心主管血液循環。心氣虛弱會心悸，心火旺盛會心跳加快。',
      ad:'使用苦味沉香清心降火。避免過多咖啡因，保持情緒穩定。',
      ag:'☕ 苦味沉香 · 火元素'},
    noAppetite:{nm:'食慾不振',el:'土',og:'脾',fl:'甘',ic:'😔',
      q:'脾主運化。脾虛則不思飲食。',
      mn:'脾主管食物消化運輸。脾氣虛弱就會食慾不振。',
      ad:'餐前使用甘味沉香激發脾胃活力。少量多餐，清淡為主。',
      ag:'🍯 甘味沉香 · 土元素'},
    drySkin:{nm:'皮膚乾燥',el:'金',og:'肺',fl:'辛',ic:'🏜️',
      q:'肺主皮毛。肺陰不足則皮毛枯槁。',
      mn:'肺主管皮膚和毛髮。肺氣不足，皮膚會乾燥失去光澤。',
      ad:'使用辛味沉香宣肺潤燥。多喝水，保持室內濕度。',
      ag:'🌶️ 辛味沉香 · 金元素'},
    coldHands:{nm:'手腳冰冷',el:'水',og:'腎',fl:'鹹',ic:'🥶',
      q:'腎陽不足，四肢厥逆。',
      mn:'腎陽是身體的火爐。不足則無法溫煦四肢，手腳冰冷。',
      ad:'使用鹹味沉香溫補腎陽。注意保暖，避免生冷，配合泡腳促進循環。',
      ag:'🧂 鹹味沉香 · 水元素'}
  };

  function showSeason(k) {
    const r = document.getElementById('huangdi-result'), s = seasons[k]; if(!s) return;
    r.classList.remove('show','calc-error'); r.style.cssText='';
    r.innerHTML = `
      <div class="result-element">${s.ic}</div>
      <div class="result-text">「${s.nm}」季養生 — 養${s.og} · 五味屬「${s.fl}」</div>
      <div class="result-desc" style="margin-top:8px;">
        <strong>《黃帝內經》原文：</strong><br>
        <span style="font-family:var(--font-serif);color:var(--gold);font-style:italic;">「${s.q}」</span><br><br>
        <strong>白話解釋：</strong>${s.mn}<br><br>
        <strong>養生建議：</strong>${s.ad}<br><br>
        <strong>推薦沉香：</strong>${s.ag}
      </div>`;
    r.classList.add('show');
  }

  function showSymptom(k) {
    const r = document.getElementById('huangdi-result'), s = symptoms[k]; if(!s) return;
    r.classList.remove('show','calc-error'); r.style.cssText='';
    r.innerHTML = `
      <div class="result-element">${s.ic}</div>
      <div class="result-text">${s.nm} — 五臟屬「${s.og}」· 五味屬「${s.fl}」</div>
      <div class="result-desc" style="margin-top:8px;">
        <strong>《黃帝內經》原文：</strong><br>
        <span style="font-family:var(--font-serif);color:var(--gold);font-style:italic;">「${s.q}」</span><br><br>
        <strong>白話解釋：</strong>${s.mn}<br><br>
        <strong>養生建議：</strong>${s.ad}<br><br>
        <strong>推薦沉香：</strong>${s.ag}
      </div>`;
    r.classList.add('show');
  }

  /* ==========================================================
     9. 聯絡表單驗證
     ========================================================== */
  const cf = document.getElementById('contact-form');
  if (cf) cf.addEventListener('submit', (e) => {
    e.preventDefault();
    cf.querySelectorAll('.form-error').forEach(el => el.classList.remove('show'));
    cf.querySelector('.form-success')?.classList.remove('show');
    let ok = true;
    cf.querySelectorAll('[required]').forEach(f => {
      const err = f.parentElement.querySelector('.form-error');
      if (!f.value.trim()) { ok=false; if(err){err.textContent='此欄位為必填';err.classList.add('show');} }
    });
    if (ok) {
      cf.style.display='none';
      const s=document.getElementById('form-success'); if(s) s.classList.add('show');
      setTimeout(()=>{cf.reset();cf.style.display='';if(s)s.classList.remove('show');},5000);
    }
  });

  /* ==========================================================
     10. 回到頂部
     ========================================================== */
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    btt.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
    window.addEventListener('scroll', () => btt.classList.toggle('show', window.scrollY>600), {passive:true});
  }

  /* ==========================================================
     11. 顯示錯誤訊息
     ========================================================== */
  function showInlineError(el, msg) {
    el.classList.remove('show');
    el.style.cssText = 'display:block;background:rgba(229,115,115,0.1);color:#c0392b;';
    el.innerHTML = `<p style="font-size:0.9rem;">${msg}</p>`;
    setTimeout(()=>{ el.style.cssText=''; el.classList.remove('calc-error'); }, 3000);
  }

});