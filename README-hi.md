<div align="center">

# 🏭 dsh-industry-research
- **1024 स्टोर चैनल**: एक बार `npm i -g dsh1024`, फिर `dsh1024 plugin --profile web add dsh-industry-research` ([deepseek1024.com](https://deepseek1024.com) इंस्टॉल रैंकिंग में गिना जाता है)।

**DeepSeek Harness के लिए उद्योग एवं कंपनी अनुसंधान डोमेन पैक।**

*औद्योगिक श्रृंखला मानचित्र, सार्वजनिक-स्रोत ट्रैकिंग, कंपनी कार्ड और ऑडिट योग्य रिपोर्ट — हर आंकड़ा किसी स्रोत से जुड़ा है, हर अंतराल घोषित है।*

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-industry-research)
[![DSH plugin](https://img.shields.io/badge/dsh--plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-plugin-doctor/main/badges/PerryLink__dsh-industry-research.svg)](https://github.com/PerryLink/dsh-plugin-doctor#verified-徽章)
[![DSH Market](https://raw.githubusercontent.com/2BingLing/dsh-market/master/assets/readme/badge-top-rated.svg)](https://dsh.market/)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-industry-research/ci.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-industry-research/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-industry-research?label=version)](https://github.com/PerryLink/dsh-industry-research/releases)
[![npm version](https://img.shields.io/npm/v/dsh-industry-research)](https://www.npmjs.com/package/dsh-industry-research)
[![npm downloads](https://img.shields.io/npm/dm/dsh-industry-research)](https://www.npmjs.com/package/dsh-industry-research)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-industry-research?metric=downloads&lang=hi)](https://dshfind.com/hi/plugins/PerryLink/dsh-industry-research?ref=badge)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

```sh
dsh plugin --profile <name> add dsh-industry-research
```


</div>

---

**केवल अनुसंधान हेतु; निवेश सलाह नहीं।** यह पैक केवल अनुसंधान सहायता करता है: कोई ट्रेडिंग नहीं, कोई मूल्य पूर्वानुमान नहीं, कोई सशुल्क/लॉगिन-सुरक्षित स्रोत नहीं।


**📖 इकोसिस्टम नॉलेज बेस** — मापे गए आँकड़े, मार्केटिंग नहीं: [डेवलपमेंट गाइड · चयन डेटा · रखरखाव मानदंड](https://perrylink.github.io/dsh-plugin-guide/)।

<!-- star-cta -->
## Install & uninstall

```sh
dsh plugin --profile demo add dsh-industry-research       # इंस्टॉल
dsh plugin --profile demo remove dsh-industry-research    # अनइंस्टॉल
```

पंक्ति माउंट हुई या नहीं, जाँचें: `dsh --profile demo --dump-config | grep dsh-industry-research`।

## ⭐ 如果它帮到了你

यह प्लगइन [DSH प्लगइन परिवार](https://github.com/PerryLink) का हिस्सा है (40+ प्लगइन, सभी Apache-2.0)। अगर यह उपयोगी लगे, तो **एक स्टार दें** — इससे कोई सुविधा अनलॉक नहीं होती, पर अगला व्यक्ति इसे खोज में आसानी से पा लेता है।

*English:* part of a 40+ plugin family for DeepSeek Harness. If it is useful, **a star helps the next person find it** — nothing is gated behind it.

## What is dsh-industry-research?

DeepSeek Harness के लिए उद्योग एवं कंपनी अनुसंधान डोमेन पैक।

औद्योगिक श्रृंखला मानचित्र, सार्वजनिक-स्रोत ट्रैकिंग, कंपनी कार्ड और ऑडिट योग्य रिपोर्ट — हर आंकड़ा किसी स्रोत से जुड़ा है, हर अंतराल घोषित है।

![dsh-industry-research का टर्मिनल डेमो: dsh-industry-research — install, then the three artifacts](https://raw.githubusercontent.com/PerryLink/dsh-industry-research/main/docs/assets/dsh-industry-research-hero.png)

![Animated terminal demo of dsh-industry-research](https://raw.githubusercontent.com/PerryLink/dsh-industry-research/main/docs/assets/dsh-industry-research-demo.gif)

*वही रन, एनिमेटेड।*

## Compatibility

- DeepSeek Harness `dsh-v0.2.1-alpha.1` (npm प्रकाशित लाइन, 2026-09-25 को सत्यापित; peers `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0` पर)।
0.1.2-rc.1 (2026-09-02 को अनुकूलित): सत्र लिफ़ाफ़ा अपना ignorable फ़ील्ड केवल संग्रहीत-लॉग पठन संगतता के लिए रखता है - Session.append अभी भी इसे स्टैम्प नहीं कर सकता, इसलिए गेट व्यवहार अपरिवर्तित है।
`0.1.7-rc.2` प्रकाशित peers के विरुद्ध 2026-09-25 को सत्यापित (पूर्ण गेट श्रृंखला; वास्तविक प्रोफ़ाइल इंस्टॉल स्मोक साप्ताहिक और प्रति-PR `compat.yml` जॉब चलाता है)।
- Node `^22.19.0 || >=24.0.0`, केवल ESM (`"type": "module"`)।
- Peer निर्भरताएँ: `@deepseek-ai/cordis ^4.0.2`, `@deepseek-ai/schemastery ^3.18.2`, और `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0` पर `@deepseek-ai/dsh-tools`, `@deepseek-ai/dsh-skill`, `@deepseek-ai/dsh-skill-filesystem` (सभी आधिकारिक `dsh-base` बंडल में समाहित)।
- वैकल्पिक क्षमताएँ, निष्पादन समय पर खोजी जाती हैं (कभी इंजेक्ट नहीं): `ctx.web` (सार्वजनिक-स्रोत पुनर्प्राप्ति, `dsh-base` में समाहित) और `ctx.researchReport` (सहयोगी `dsh-research-report` प्लगइन का सीलिंग इंजन)।

## What you get

- **`industry_map`** — औद्योगिक श्रृंखला मानचित्र बनाएँ या अपडेट करें (`chain.json`): upstream/midstream/downstream नोड, एज और मेट्रिक स्लॉट। `value` वाला मेट्रिक `sourceRef` मांगता है; बिना-मान स्लॉट स्पष्ट अंतराल है। सीड नोट्स/फ़ाइलें और वैकल्पिक `ctx.web` सारांश उद्धरण योग्य स्रोतों (`S1`, `S2`, …) के रूप में दर्ज होते हैं।
- **`industry_track`** — आधिकारिक `ctx.web` सीम के माध्यम से नीतियों/समाचारों की ट्रैकिंग: विषयवार खोज, होस्ट अनुमति/ब्लॉक सूचियाँ, `since` फ़िल्टर, SHA-256 स्रोत-हैश के साथ सीमित स्नैपशॉट फ़ेच, और `timeline.jsonl` में डीडुप मर्ज (रिटेंशन सीमा सहित)। वेब क्षमता अनुपलब्ध होने पर स्पष्ट रूप से विफल।
- **`company_scan`** — आपकी workspace डेटा फ़ाइलों से कंपनी कार्ड (`card.json` + `card.md`): SHA-256 हैश, Markdown रूपरेखा और आंकड़ा-उम्मीदवार पंक्तियाँ (हर आंकड़ा फ़ाइल व पंक्ति उद्धृत कर सके), साथ में वैकल्पिक `ctx.web` उद्धरण। v1 में केवल टेक्स्ट फ़ॉर्मैट (PDF नहीं)।
- **`industry_report`** — मानचित्र + टाइमलाइन + कार्डों से एक ऑडिट योग्य रिपोर्ट। `ctx.researchReport` इंजन माउंट होने पर evidence/sections/claims उसके `assemble` से सील होते हैं और प्रति-claim निष्कर्ष लौटते हैं; न होने पर, बिल्टिन फ़ॉलबैक संस्करणित `reports/<YYYYMMDD-HHmmss>/report.md` + `manifest.json` लिखता है (SHA-256 स्रोत-ट्रेसिबिलिटी तालिका सहित) और ईमानदारी से `engine: 'builtin-fallback'` अंकित करता है।
- **दो मेथडॉलॉजी स्किल्स** — `industry-research-method` (श्रृंखला विघटन, आपूर्ति/मांग ढांचा, स्रोत अनुशासन, अंतराल-घोषणा अनुशासन) और `company-research-method` (कंपनी ढांचा, सार्वजनिक-स्रोत सूची, अनुपालन भाषा)।
- **टाइप किए गए Cordis इवेंट** — हर कमिट हुए आर्टिफ़ैक्ट के बाद `industry-research/map`, `industry-research/track`, `industry-research/report`।

## Quick start

```sh
dsh plugin --profile web add github:PerryLink/dsh-industry-research
```

### git चैनल

```sh
# किसी अस्थायी profile से (commit पिन करें; स्व-समायोजित `prepare` बिल्ड चलता है)
dsh plugin --profile demo add "github:PerryLink/dsh-industry-research#<sha>"
# पहले add पर profile के pnpm-workspace.yaml में dsh-industry-research की allowBuilds एंट्री जुड़ जाती है।
```

### npm चैनल

```sh
dsh plugin --profile demo add dsh-industry-research
```

दोनों चैनल बंडल पंक्ति (`cordis.patch.yml` देखें) को profile की `dsh.profile.bundles` स्टैक में डालते हैं और रीस्टार्ट पर प्रभावी होते हैं।

फिर, किसी सेशन में:

```
加载 industry-research-method 技能，然后研究白酒行业：
先 industry_map 建产业链图，再 industry_track 跟踪政策，最后 industry_report 出报告。
```

## Configuration

सभी समायोज्य विकल्प Schemastery `Config` फ़ील्ड हैं; अमान्य मान profile लोड पर स्पष्ट रूप से विफल करते हैं।

| Key | Default | Description |
| --- | --- | --- |
| `enabled` | `true` | मास्टर स्विच; `false` कुछ भी माउंट नहीं करता। |
| `industryRoot` | `industry-research` | आर्टिफ़ैक्ट रूट, सेशन workspace के सापेक्ष (या निरपेक्ष)। |
| `fetchTimeoutMs` | `20000` | `ctx.web` कॉल के लिए प्रति-रिक्वेस्ट टाइमआउट (ms)। |
| `timelineMaxEntries` | `500` | प्रति `timeline.jsonl` रिटेन की जाने वाली एंट्री (सबसे पुरानी हटती हैं)। |
| `sourceAllowlist` | `[]` | ट्रैक किए गए स्रोतों की होस्ट अनुमति सूची (खाली = सभी)। |
| `sourceBlocklist` | `[]` | ट्रैक किए गए स्रोतों की होस्ट ब्लॉक सूची (अनुमति सूची पर प्राथमिक)। |
| `offline` | `false` | ऑफ़लाइन मोड: `ctx.web` को कभी न छुएँ; केवल स्थानीय workspace डेटा। |
| `skillsDir` | _(अनसेट)_ | स्पष्ट स्किल रूट ओवरराइड; डिफ़ॉल्ट पैकेज्ड `skills/`। |
| `track.maxResultsPerTopic` | `10` | प्रति विषय `web_search` maxResults। |
| `track.maxFetchesPerCall` | `10` | प्रति `industry_track` कॉल स्नैपशॉट-फ़ेच बजट। |
| `scan.maxFileBytes` | `1048576` | कंपनी डेटा फ़ाइलों की प्रति-फ़ाइल रीड सीमा। |
| `scan.maxFigureCandidates` | `100` | प्रति कंपनी स्कैन आंकड़ा-उम्मीदवार बजट। |
| `scan.strictTicker` | `true` | कार्ड टिकर को बिल्ट-इन फ़ॉर्मेट से मेल खाना चाहिए (A-share 6 अंक, US 1–5 अक्षर, HK 1–5 अंक); `false` फ़ॉर्मेट जाँच को छूट देता है। |

## Tools & surfaces

### `industry_map({ industry, seed?, seedFiles?, web?, chain?, renderSvg?, depth? })`

`chain` के साथ: वैलिडेट करता है (लटकती एज, बिना-स्रोत मान, अवैध tier, डुप्लिकेट id, status/statusAsOf, अज्ञात `taxonomyCode` — पूरी समस्या सूची के साथ स्पष्ट विफलता) और `chain.json` सहेजता है, फिर स्पष्ट अंतराल स्लॉट व बॉटलनेक नोड सूचीबद्ध करता है। `chain` के बिना: वर्तमान मानचित्र, दर्ज स्रोत और वैकल्पिक `ctx.web` श्रृंखला-संरचना सारांश लौटाता है ताकि मॉडल पुनरावृत्ति कर सके। `renderSvg: true` पर एक नियतात्मक `chain.svg` भी लिखता है। `depth` web सहायता को स्केल करता है। `industry-research/map` उत्सर्जित करता है।

### `industry_track({ industry, topics?, since?, depth?, evidenceCategory? })`

`ctx.web` से प्रत्येक विषय खोजता है, सूचियों व `since` से फ़िल्टर करता है, कॉल बजट के भीतर स्नैपशॉट (SHA-256) फ़ेच करता है, और `timeline.jsonl` में मर्ज करता है (नॉर्मलाइज़्ड URL से डीडुप, सीमा सहित)। `depth` बजट स्केल करता है; `evidenceCategory` हर एंट्री को लेबल करता है और छह-श्रेणी एनम से वैलिडेट होता है। जिन स्रोतों का स्नैपशॉट विफल हुआ वे कारण `note` में लिखकर केवल-उद्धरण एंट्री के रूप में रहते हैं। `ctx.web` अनमाउंटेड या `offline: true` होने पर गुम क्षमता का नाम बताते हुए स्पष्ट विफल। `industry-research/track` उत्सर्जित करता है।

### `company_scan({ name | companies, dataFiles?, web?, status?, statusAsOf?, ticker?, metrics?, depth?, parallel? })`

workspace डेटा फ़ाइलें (`.md/.txt/.csv/.tsv/.json`; v1 PDF पार्स नहीं करता) पढ़ता, हैश करता, Markdown रूपरेखा व आंकड़ा-उम्मीदवार पंक्तियाँ निकालता है, वैकल्पिक `ctx.web` उद्धरण जोड़ता है और कार्ड सहेजता है। `status` को एक गैर-भविष्य `statusAsOf` चाहिए; `ticker` को `scan.strictTicker: false` के अलावा बिल्ट-इन फ़ॉर्मेट से मेल खाना चाहिए; हर `metrics` मान को `source` + `asOf` चाहिए। `companies` (बैच) एक विफल कंपनी को बैच रोके बिना अलग करता है; `parallel: true` और `ctx.jobs` माउंट होने पर हर कंपनी को स्वतंत्र job में फ़ैन-आउट करता है (वरना क्रमिक पथ पर लौटता है, `mode` में दर्शित)। अस्वीकृत फ़ाइलें कारणों सहित लौटती हैं; कार्ड जो स्थापित नहीं कर सकता वह स्पष्ट अंतराल है।

### `industry_report({ industry, sections?, companies?, draft? })`

एविडेंस (`E-chain`, `E-timeline`, `E-company-<slug>`) जुटाता है, पढ़े गए आर्टिफ़ैक्ट `versions.jsonl` से वेरिफ़ाई करता है (बेमेल हैश स्पष्ट विफल) और या तो आपका `draft` वैलिडेट करता है (sections + claims; हर claim के `evidenceIds` दर्ज एविडेंस को संदर्भित करने चाहिए) या यांत्रिक ऑटो-ड्राफ़्ट बनाता है (स्रोतित मेट्रिक्स और हालिया टाइमलाइन एंट्री claims बनती हैं, `evidenceCategory` से समूहित)। उत्पादन से पहले एक नियतात्मक डिलीवरी कॉन्ट्रैक्ट चलता है और गुम ब्लॉक, प्लेसहोल्डर या बिना-स्रोत/बिना-तिथि कथन पर स्पष्ट विफल होता है। एक नियतात्मक विरोधी मशीन-जाँच हमेशा चलती है, और `ctx.jobs` माउंट होने पर एक रेड-टीम समीक्षा job (`red-review-note.md`) शुरू होता है (वरना `review: skipped(jobs unavailable)`)। इंजन पथ: सील्ड डायरेक्टरी + `sealHash` + प्रति-claim निष्कर्ष। फ़ॉलबैक पथ: संस्करणित Markdown + मैनिफ़ेस्ट, claims ईमानदारी से `unverified` अंकित। `industry-research/report` उत्सर्जित करता है।

## Skills

- **`industry-research-method`** — उद्योग अनुसंधान पद्धति: upstream/midstream/downstream विघटन, आपूर्ति/मांग ढांचा, स्रोत अनुशासन (हर आंकड़ा: मान + इकाई + स्रोत + asOf) और अंतराल-घोषणा अनुशासन (घोषित करें, कभी न बनाएँ)।
- **`company-research-method`** — कंपनी अनुसंधान पद्धति: व्यापार-संरचना / वित्त / जोखिम कार्ड ढांचा, सार्वजनिक-स्रोत प्राथमिकता सूची (कंपनी प्रकटीकरण → नियामक → प्रामाणिक मीडिया) और अनुपालन भाषा।

दोनों मानक `skill` टूल से मांग पर लोड होती हैं (`加载 industry-research-method 技能`)।

## Data layout

```
<workspace>/<industryRoot>/versions.jsonl             संस्करण लेजर (SHA-256 + टाइमस्टैम्प + बदलाव)
<workspace>/<industryRoot>/<उद्योग>/research-state.json  अनुसंधान-स्थिति स्मृति
<workspace>/<industryRoot>/<उद्योग>/red-review-note.md    industry_report (रेड-टीम समीक्षा, jobs)
<workspace>/<industryRoot>/<उद्योग>/chain.json      industry_map
<workspace>/<industryRoot>/<उद्योग>/chain.svg       industry_map (renderSvg: true)
<workspace>/<industryRoot>/<उद्योग>/timeline.jsonl  industry_track
<workspace>/<industryRoot>/<उद्योग>/sources.json    उद्धरण योग्य स्रोत रजिस्ट्री (S1, S2, …)
<workspace>/<industryRoot>/<उद्योग>/notes/          सीड नोट्स
<workspace>/<industryRoot>/<उद्योग>/reports/<ts>/   industry_report (report.md + manifest.json)
<workspace>/<industryRoot>/companies/<कंपनी>/card.*  company_scan
```

## Permissions & data

`dsh-industry-research` केवल सार्वजनिक सीम्स का उपभोग करता है: `ctx.tools`, `ctx.skills`, और — वैकल्पिक रूप से खोजे गए — `ctx.web` व `ctx.researchReport`। यह स्वयं कोई नेटवर्क एक्सेस नहीं करता (सारी पुनर्प्राप्ति `ctx.web` से होती है, deployment के प्रोवाइडर चयन और आपके कॉन्फ़िगर किए गए टाइमआउट के साथ), कोई क्रेडेंशियल स्टोर नहीं करता, और केवल सेशन workspace के `industryRoot` के भीतर लिखता है। केवल सार्वजनिक स्रोत उपयोग होते हैं; सशुल्क या लॉगिन-सुरक्षित स्रोत दायरे से बाहर हैं — अपनी एक्सपोर्ट फ़ाइलें `dataFiles` के रूप में दें।

## Security boundaries

- **workspace कंटेनमेंट** — उद्योग/कंपनी नाम वैध पाथ सेगमेंट हैं; डेटा फ़ाइलें सेशन cwd के विरुद्ध कंटेनमेंट-जाँचित हैं (दोनों ओर resolve)।
- **निर्माण से स्रोत-प्रूफ़** — स्रोतों में SHA-256 हैश होते हैं; बिना-स्रोत आंकड़े वैलिडेशन त्रुटि हैं; करप्ट टाइमलाइन पंक्तियाँ गिनती दिखाकर छोड़ी जाती हैं, कभी चुपचाप नहीं।
- **ईमानदार डिग्रेडेशन** — `ctx.web` / `ctx.researchReport` की अनुपस्थिति स्पष्ट विफलता या ईमानदारी से लेबल किए फ़ॉलबैक आर्टिफ़ैक्ट देती है, कभी मौन फ़ेब्रिकेशन नहीं।
- **प्रतिवर्ती रजिस्ट्रेशन** — सब कुछ `ctx.effect()` / `ctx.on()` / `register()` से गुजरता है।
- **केवल-अनुसंधान अनुपालन** — टूल विवरण, कार्ड और रिपोर्ट 「仅供研究，不构成投资建议」धारण करते हैं; डेटा पॉइंट asOf और स्रोत सहित।

## Known limitations

- **सेशन-लॉग इवेंट नहीं, Cordis इवेंट** — `industry-research/*` इवेंट टाइप किए Cordis ऑब्ज़र्वेबिलिटी हैं और कभी भी सेशन लॉग में नहीं जोड़े जाते; टिकाऊ रिकॉर्ड workspace आर्टिफ़ैक्ट हैं; ऑब्ज़र्वेबिलिटी टाइप किए Cordis इवेंट से चलती है; मॉडल-दृश्य टूल परिणाम टिकाऊ `tool/result` सेशन इवेंट से चलते हैं।
- **`ctx.attachment` में लेखन नहीं** — rc2 अटैचमेंट सीम केवल इमेज स्वीकार करती है (PNG/JPEG/WebP/GIF); Markdown रिपोर्ट इसलिए संस्करणित workspace फ़ाइलें रहती हैं, टूल परिणाम में निरपेक्ष पाथ से संदर्भित।
- **v1 केवल टेक्स्ट फ़ॉर्मैट पढ़ता है** — PDF पार्सिंग नहीं; उपयोगकर्ताओं से पहले PDF को टेक्स्ट/Markdown में बदलने को कहें।
- **चीनी-संस्करण स्किल्स** — पैकेज्ड मेथडॉलॉजी स्किल्स चीनी में आती हैं; अंग्रेज़ी संस्करण भविष्य का काम।
- **फ़ोरग्राउंड टूल्स** — `industry_track` `track.maxFetchesPerCall` व `fetchTimeoutMs` से सीमित होकर फ़ोरग्राउंड में चलती है; बैकग्राउंड-जॉब्स मोड भविष्य का काम।
- **ऑटो-ड्राफ़्ट यांत्रिक है** — यह आर्टिफ़ैक्ट सारांशित करता है और स्रोतित डेटा पॉइंट को claims में बदलता है; वर्णनात्मक गुणवत्ता मॉडल-लिखित `draft` से आती है।

## Development

```sh
pnpm install
pnpm run typecheck && pnpm run typecheck:ci
pnpm test
pnpm run build
pnpm run verify:self-contained && pnpm run verify:artifacts
pnpm run verify:readme-sync
pnpm run verify:skills
pnpm run pack:check
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `cordis`, `industry-research`, `company-research`, `research`, `report`

## Contributors

- प्रारंभिक डिज़ाइन और कार्यान्वयन: `dsh-industry-research` विकास सत्र (DeepSeek Harness)।

बाहरी योगदान स्वागत योग्य हैं — issue या pull request खोलें।

**लागू DSH संस्करण:** `dsh-v0.2.1-alpha.1` (यह बिल्ड जिस होस्ट रिलीज़ को लक्षित करता है) पर सत्यापित; आवश्यक `>=0.1.7-alpha.1 <0.2.0`।

## PerryLink DSH Plugin Family

यह प्रोजेक्ट [PerryLink](https://github.com/PerryLink) के **87 सक्रिय रूप से अनुरक्षित** DeepSeek Harness प्लगइन में से एक है। पूरा परिवार **95** प्लगइन है — **5 फ़्रोज़न**, **3 सेवानिवृत्त** — और नीचे संक्षिप्त रखा गया है ताकि हर README की पहली स्क्रीन छोटी रहे। हर पंक्ति देखने के लिए इसे खोलें; कारण स्थिति कॉलम में है।

<details>
<summary>सभी 95 प्लगइन खोलें</summary>

| प्लगइन | एक पंक्ति | स्थिति |
|---|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** | 水产养殖投入品记录核对（按投入品用量、休药期与起捕间隔核对记录自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** | 档案归档完整性与保管期限核对（依据《档案法》及配套规定，仅提示差异，不作出定性结论） |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** | Second-model auto-review on the approval chain, fail-closed by default |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | Automatic strong/cheap model-tier routing with deterministic risk guards and a `/tier` command |  |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | Durable background child agents with a Web UI sidebar, messaging and interrupt | 🚫 सेवानिवृत्त — रिपॉज़िटरी README देखें |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** | 投标文件符合性预检（按招标文件逐条核对响应情况，仅提示差异，不作出定性结论） |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** | 投标人资格条件核对（按资格条件与证明材料核对逐条响应，仅提示差异，不作出定性结论） |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | Cost governance for DeepSeek Harness: budgets, carbon, and latency in one panel. | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | Read-only MCP server exposing the certification registry: grades, snapshots and five-dimension evidence |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** | Claude Code /rewind-equivalent: snapshots, session forks, one-shot restore |  |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | Migrate Claude Code sessions, memory, skills and CLAUDE.md into DSH | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** | Cross-platform native desktop control for DeepSeek Harness — Windows first. |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** | Terminal-style input history for the web composer: arrows, Ctrl+R search |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** | 合同条款立场台账核对（按立场、风险等级与退让底线核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** | 报关单证一致性核对（按公开的报关单填制规范核对单证间字段一致性，仅提示差异，不作出定性结论） |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | Dataset quality checks and citation cross-checks (the optional numeric bridge consumed here) |  |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | Prompt-injection, jailbreak, and secret-leak defense for DeepSeek Harness. | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** | 滞箱费台账核对（按免箱期与费率核对超期天数与金额的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** | Engineering-discipline guard: requirements grill, test gates, adversary review |  |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | Unified static-image generation routing for DeepSeek Harness. | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-drill-script-check](https://github.com/PerryLink/dsh-drill-script-check)** | 应急演练脚本核对（按阶段、响应分级、指挥与资源要素核对脚本齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-eia-guide-check](https://github.com/PerryLink/dsh-eia-guide-check)** | 环评导则适用性核对（按要素、导则名称与执行标准核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-emergency-plan](https://github.com/PerryLink/dsh-emergency-plan)** | 应急预案要素齐备性与条款级页码定位（依据 GB/T 29639-2020 等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-essay-rubric-check](https://github.com/PerryLink/dsh-essay-rubric-check)** | 作文量表评分核对（按评分项、原文定位与分值算术核对评分自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-evidence-check](https://github.com/PerryLink/dsh-evidence-check)** | 证据清单齐备性核对（按待证事实与证据要素核对清单自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-export-ctl-check](https://github.com/PerryLink/dsh-export-ctl-check)** | 出口管制物项核对（按管制清单、最终用途与许可证核对台账齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** | Read-only performance diagnostics for DeepSeek Harness. |  |
| **[dsh-fmea-table-check](https://github.com/PerryLink/dsh-fmea-table-check)** | FMEA 分析表要素齐备性与风险顺序数一致性核对（按公开的 FMEA 方法标准核对表内自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-forecast-penalty](https://github.com/PerryLink/dsh-forecast-penalty)** | 预测准确率考核核对（按准确率、门槛与考核单价核对考核费用的算术自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** | Deterministic research reports for Chinese public mutual funds |  |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** | GitHub PR/issues integration for DSH, every write gated by approval |  |
| **[dsh-gongwen-flow-check](https://github.com/PerryLink/dsh-gongwen-flow-check)** | 公文流转与办理时限核对（按公开的公文处理规范核对环节完整性与时限，仅提示差异，不作出定性结论） |  |
| **[dsh-gongwen-word-check](https://github.com/PerryLink/dsh-gongwen-word-check)** | 公文格式要素核对（按公开的党政机关公文格式标准核对版头与主体要素，仅提示差异，不作出定性结论） |  |
| **[dsh-guard-plan-qc](https://github.com/PerryLink/dsh-guard-plan-qc)** | 劳动保护与安全防护用品配置表核对（按公开的配备标准核对品名规格与配置数量，仅提示差异，不作出定性结论） |  |
| **[dsh-hazchem-check](https://github.com/PerryLink/dsh-hazchem-check)** | 危险化学品临界量与重大危险源辨识核对（按储存量与临界量核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-hazplan-check](https://github.com/PerryLink/dsh-hazplan-check)** | HAZOP 分析表要素齐备性与偏差推导一致性核对（依据公开的危险与可操作性分析标准，仅提示差异，不作出定性结论） |  |
| **[dsh-hidden-risk-map](https://github.com/PerryLink/dsh-hidden-risk-map)** | 安全隐患台账→《工贸企业重大事故隐患判定标准》（应急管理部令第10号）条款映射提示（仅提示差异，不作出定性结论） |  |
| **[dsh-hs-classify](https://github.com/PerryLink/dsh-hs-classify)** | 商品归类层级一致性核对（按章、品目、子目与商品编号的层级关系核对自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-icd-rule-check](https://github.com/PerryLink/dsh-icd-rule-check)** | ICD 合并编码与星剑号配对提示（依据 GB/T 14396-2016 与公开的 ICD 使用说明，仅提示差异，不作出定性结论） |  |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** | Industry research orchestration that seals its deliverables through this plugin's `ctx.researchReport.assemble` |  |
| **[dsh-lawcite-adapter](https://github.com/PerryLink/dsh-lawcite-adapter)** | 法条引用与文书要素核对（按名称、条号、原文与效力状态核对引用可核验性，仅提示差异，不作出定性结论） |  |
| **[dsh-laya](https://github.com/PerryLink/dsh-laya)** | Laya typed decisions (`noul`/`choice`/`score`) as a first-class Cordis service and model-visible tools |  |
| **[dsh-lc-doc-check](https://github.com/PerryLink/dsh-lc-doc-check)** | 信用证单据条款核对（按单据种类、份数、期限与不符点核对交单自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-learning-gap-check](https://github.com/PerryLink/dsh-learning-gap-check)** | 能力差距与培养计划核对（按能力等级差、培养措施与完成期限核对台账闭环，仅提示差异，不作出定性结论） |  |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** | Local document knowledge base for DeepSeek Harness. |  |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** | Local-model (Ollama) integration for DeepSeek Harness. |  |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** | LSP diagnostics, formatting, completion, code actions and rename over language servers |  |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** | PII masking middleware: anonymize at the model boundary, restore at the display layer |  |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** | Read-only MCP runtime panel: /mcp command + Settings tab with status, tools and errors |  |
| **[dsh-medrec-qc](https://github.com/PerryLink/dsh-medrec-qc)** | 病案首页形式质控与逻辑矛盾提示（依据国卫办医发〔2016〕24号等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** | Approval-gated cross-session memory: ctx.memory seam + SQLite + memory tool |  |
| **[dsh-nsfc-form-check](https://github.com/PerryLink/dsh-nsfc-form-check)** | 国家自然科学基金申请书形式审查与匿名化提示（依据《国家自然科学基金条例》与申请人导入的当年指南，仅提示差异，不作出定性结论） |  |
| **[dsh-nurse-record-check](https://github.com/PerryLink/dsh-nurse-record-check)** | 护理记录时限、签名与评估表完整性校验（依据《病历书写基本规范》等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** | OpenTelemetry and Langfuse observability exporter for DeepSeek Harness. |  |
| **[dsh-origin-rvc-check](https://github.com/PerryLink/dsh-origin-rvc-check)** | 原产地区域价值成分核对（按 RVC 定义式与门槛核对原产地判定自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-ota-review-check](https://github.com/PerryLink/dsh-ota-review-check)** | 在线点评回复台账核对（按回复时限、问题分类与整改状态核对台账闭环，仅提示差异，不作出定性结论） |  |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** | Claude Code outputStyles-equivalent runtime style switching |  |
| **[dsh-paper-doc-adapter](https://github.com/PerryLink/dsh-paper-doc-adapter)** | 试卷解析结构核对（按题型、答案、分值与 yotta 标识核对试卷结构自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** | Claude Code-style declarative allow/deny/ask permission rules with audit |  |
| **[dsh-permit-report-check](https://github.com/PerryLink/dsh-permit-report-check)** | 行政许可办理核对（按申请材料、法定时限与决定记录核对台账闭环，仅提示差异，不作出定性结论） |  |
| **[dsh-pipeline-check](https://github.com/PerryLink/dsh-pipeline-check)** | 项目全流程文件链条核对（按环节先后与金额口径核对链条自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-pleading-draft](https://github.com/PerryLink/dsh-pleading-draft)** | 起诉状要素齐备性核对（按诉请、事实、证据、法条四要素核对文书齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor)** | Zero-dependency static + sandbox smoke detector for DSH plugins |  |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** | Plugin-development knowledge base as an on-demand agent skill |  |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** | Shared zero-runtime-dependency toolkit for the PerryLink DSH plugins |  |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** | One-package, one-corridor-index plugin upgrade skill: routes a repository to the matching closed corridor card |  |
| **[dsh-policy-brief-draft](https://github.com/PerryLink/dsh-policy-brief-draft)** | 政策专报要素核对（按观点、依据、出处与建议核对专报齐备，仅提示差异，不作出定性结论） |  |
| **[dsh-power-loss-split](https://github.com/PerryLink/dsh-power-loss-split)** | 线损电量拆分与考核表核对（依据公开的线损计算口径，仅提示差异，不作出定性结论） |  |
| **[dsh-power-ticket-check](https://github.com/PerryLink/dsh-power-ticket-check)** | 电力工作票要素齐备性与签发许可顺序核对（依据现行电力安全工作规程，仅提示差异，不作出定性结论） |  |
| **[dsh-ppap-check](https://github.com/PerryLink/dsh-ppap-check)** | PPAP 提交要素齐备性核对（按公开的 PPAP 手册与提交等级核对要素齐备与版本填写，仅提示差异，不作出定性结论） |  |
| **[dsh-protest-deadline](https://github.com/PerryLink/dsh-protest-deadline)** | 质疑与投诉期限核对（按公开的政府采购质疑投诉规定核对期限与台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-railway-window](https://github.com/PerryLink/dsh-railway-window)** | 铁路施工天窗台账核对（按时间窗、时长算术与命令号核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | Multi-channel approval/question bridge: WeChat/Telegram/Feishu, session console | 🧊 फ़्रोज़न — रिपॉज़िटरी README देखें |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** | 维修工单结算核对（按项目金额、配件工时合计与结算总额核对算术自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** | Verifiable research-report engine: content-addressed evidence ledger and sealed versions |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** | 审稿意见逐条回应覆盖核对（按意见与回应一一对应核对覆盖完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** | 规则库文件自检核对（按条款引用纪律与效力上限核对规则库自身合规，仅提示差异，不作出定性结论） |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** | 安全技术交底记录要素齐备性与签字闭环核对（依据公开的安全生产法规与检查标准，仅提示差异，不作出定性结论） |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | Multi-dimensional quality scoring for DeepSeek Harness plugins. |  |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | Pin sessions in the Web sidebar with durable ordering | 🚫 सेवानिवृत्त — रिपॉज़िटरी README देखें |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** | Cross-device session sync for DeepSeek Harness — a dedicated git mirror of your session store. |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** | 监理日志跨日连续性与旁站覆盖提示（依据 GB/T 50319-2013 等公开文件，仅提示差异，不作出定性结论） |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** | Security-audit skill pack: secret scan, dependency and supply-chain review |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** | 三重一大决策台账核对（按前置研究、会议审议与决议记录核对程序留痕，仅提示差异，不作出定性结论） |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** | 土壤与地下水监测台账核对（按点位、监测项目、限值与超标判定核对台账自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** | 作业规程与 FMEA／控制计划一致性核对（按编号与版本核对三份文件是否同步，仅提示差异，不作出定性结论） |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** | 控制图常数与过程能力指数核对（按 GB/T 4091 的常规控制图常数表核对控制限与 Cp/Cpk 的自洽性，仅提示差异，不作出定性结论） |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** | Voice-first session loop for DeepSeek Harness: talk to it, hear it answer. |  |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | Cross-session team rooms: shared message bus, task board and timeline | 🚫 सेवानिवृत्त — रिपॉज़िटरी README देखें |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** | 招标文件条款摘录核对（按出处与原文逐字核对摘录完整性，仅提示差异，不作出定性结论） |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** | 评标因素评分矩阵核对（按分值上限与合计核对矩阵自洽，仅提示差异，不作出定性结论） |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** | Isolated install-and-smoke test drives for DeepSeek Harness plugins. |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | TickTick/Dida365 task bridge: session-header panel + 11 tools |  |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** | Vendor parameter translation and deterministic JSON repair for DeepSeek Harness. |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** | 质保期与索赔金额核对（按质保期月数与里程、索赔金额算式核对自洽，仅提示差异，不作出定性结论） |  |

</details>

</details>

</details>## License

Apache-2.0 — देखें [LICENSE](LICENSE)।

### DSH Desktop मार्केट से इंस्टॉल करें

सभी PerryLink प्लगइन DSH Desktop के बिल्ट-इन मार्केट में देखे जा सकते हैं: **Market → Sources → add source → पेस्ट करें** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ चुनें**। इंस्टॉलेशन मार्केट के npm-identity सत्यापन और आपकी पुष्टि से ही होता है।
