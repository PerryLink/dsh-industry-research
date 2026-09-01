<div align="center">

# 🏭 dsh-industry-research
- **1024 स्टोर चैनल**: एक बार `npm i -g dsh1024`, फिर `dsh1024 plugin --profile web add dsh-industry-research` ([deepseek1024.com](https://deepseek1024.com) इंस्टॉल रैंकिंग में गिना जाता है)।

**DeepSeek Harness के लिए उद्योग एवं कंपनी अनुसंधान डोमेन पैक।**

*औद्योगिक श्रृंखला मानचित्र, सार्वजनिक-स्रोत ट्रैकिंग, कंपनी कार्ड और ऑडिट योग्य रिपोर्ट — हर आंकड़ा किसी स्रोत से जुड़ा है, हर अंतराल घोषित है।*

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![DSH plugin](https://img.shields.io/badge/dsh-plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-industry-research/ci.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-industry-research/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-industry-research?label=version)](https://github.com/PerryLink/dsh-industry-research/releases)
[![npm version](https://img.shields.io/npm/v/dsh-industry-research)](https://www.npmjs.com/package/dsh-industry-research)
[![npm downloads](https://img.shields.io/npm/dm/dsh-industry-research)](https://www.npmjs.com/package/dsh-industry-research)

[English](README.md) · [简体中文](README.zh.md) · [Español](README.es.md) · [Português](README.pt.md) · [हिन्दी](README.hi.md)

</div>

---

**仅供研究，不构成投资建议 — केवल अनुसंधान हेतु; निवेश सलाह नहीं।** यह पैक केवल अनुसंधान सहायता करता है: कोई ट्रेडिंग नहीं, कोई मूल्य पूर्वानुमान नहीं, कोई सशुल्क/लॉगिन-सुरक्षित स्रोत नहीं।

## Compatibility

- DeepSeek Harness `0.1.1-rc.2` (peers `0.1.1-rc.2` पर पिन)।
0.1.2-alpha.2 (2026-08-31 को अनुकूलित): सत्र लिफ़ाफ़ा अपना ignorable फ़ील्ड केवल संग्रहीत-लॉग पठन संगतता के लिए रखता है - Session.append अभी भी इसे स्टैम्प नहीं कर सकता, इसलिए गेट व्यवहार अपरिवर्तित है।
- Node `^22.19.0 || >=24.0.0`, केवल ESM (`"type": "module"`)।
- Peer निर्भरताएँ: `@deepseek-ai/cordis ^4.0.1`, `@deepseek-ai/schemastery ^3.18.0`, और `>=0.1.0-rc.8 <0.2.0` पर `@deepseek-ai/dsh-tools`, `@deepseek-ai/dsh-skill`, `@deepseek-ai/dsh-skill-filesystem` (सभी आधिकारिक `dsh-base` बंडल में समाहित)।
- वैकल्पिक क्षमताएँ, निष्पादन समय पर खोजी जाती हैं (कभी इंजेक्ट नहीं): `ctx.web` (सार्वजनिक-स्रोत पुनर्प्राप्ति, `dsh-base` में समाहित) और `ctx.researchReport` (सहयोगी `dsh-research-report` प्लगइन का सीलिंग इंजन)।

## What you get

- **`industry_map`** — औद्योगिक श्रृंखला मानचित्र बनाएँ या अपडेट करें (`chain.json`): upstream/midstream/downstream नोड, एज और मेट्रिक स्लॉट। `value` वाला मेट्रिक `sourceRef` मांगता है; बिना-मान स्लॉट स्पष्ट अंतराल है। सीड नोट्स/फ़ाइलें और वैकल्पिक `ctx.web` सारांश उद्धरण योग्य स्रोतों (`S1`, `S2`, …) के रूप में दर्ज होते हैं।
- **`industry_track`** — आधिकारिक `ctx.web` सीम के माध्यम से नीतियों/समाचारों की ट्रैकिंग: विषयवार खोज, होस्ट अनुमति/ब्लॉक सूचियाँ, `since` फ़िल्टर, SHA-256 स्रोत-हैश के साथ सीमित स्नैपशॉट फ़ेच, और `timeline.jsonl` में डीडुप मर्ज (रिटेंशन सीमा सहित)। वेब क्षमता अनुपलब्ध होने पर स्पष्ट रूप से विफल।
- **`company_scan`** — आपकी workspace डेटा फ़ाइलों से कंपनी कार्ड (`card.json` + `card.md`): SHA-256 हैश, Markdown रूपरेखा और आंकड़ा-उम्मीदवार पंक्तियाँ (हर आंकड़ा फ़ाइल व पंक्ति उद्धृत कर सके), साथ में वैकल्पिक `ctx.web` उद्धरण। v1 में केवल टेक्स्ट फ़ॉर्मैट (PDF नहीं)।
- **`industry_report`** — मानचित्र + टाइमलाइन + कार्डों से एक ऑडिट योग्य रिपोर्ट। `ctx.researchReport` इंजन माउंट होने पर evidence/sections/claims उसके `assemble` से सील होते हैं और प्रति-claim निष्कर्ष लौटते हैं; न होने पर, बिल्टिन फ़ॉलबैक संस्करणित `reports/<YYYYMMDD-HHmmss>/report.md` + `manifest.json` लिखता है (SHA-256 स्रोत-ट्रेसिबिलिटी तालिका सहित) और ईमानदारी से `engine: 'builtin-fallback'` अंकित करता है।
- **दो मेथडॉलॉजी स्किल्स** — `industry-research-method` (श्रृंखला विघटन, आपूर्ति/मांग ढांचा, स्रोत अनुशासन, अंतराल-घोषणा अनुशासन) और `company-research-method` (कंपनी ढांचा, सार्वजनिक-स्रोत सूची, अनुपालन भाषा)।
- **टाइप किए गए Cordis इवेंट** — हर कमिट हुए आर्टिफ़ैक्ट के बाद `industry-research/map`, `industry-research/track`, `industry-research/report`।

## Quick start

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

## Install & uninstall

```sh
dsh plugin --profile demo add dsh-industry-research       # इंस्टॉल
dsh plugin --profile demo remove dsh-industry-research    # अनइंस्टॉल
```

पंक्ति माउंट हुई या नहीं, जाँचें: `dsh --profile demo --dump-config | grep dsh-industry-research`।

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

## PerryLink DSH Plugin Family

यह प्रोजेक्ट [PerryLink](https://github.com/PerryLink) द्वारा अनुरक्षित [33 DeepSeek Harness प्लगइनों](https://github.com/PerryLink) में से एक है। अगर यह आपकी मदद करता है, तो बाकी भी करेंगे:

| Plugin | One-liner |
|---|---|
| **[dsh-dsh-auto-review](https://github.com/PerryLink/dsh-dsh-auto-review)** | अनुमोदन श्रृंखला पर द्वितीय-मॉडल स्वतः-समीक्षा, डिफ़ॉल्ट रूप से विफल-बंद | |
| **[dsh-dsh-background-agents](https://github.com/PerryLink/dsh-dsh-background-agents)** | वेब UI साइडबार, संदेश और अवरोधन के साथ टिकाऊ पृष्ठभूमि चाइल्ड एजेंट | |
| **[dsh-dsh-budget](https://github.com/PerryLink/dsh-dsh-budget)** | DeepSeek Harness के लिए लागत प्रशासन: बजट, कार्बन और विलंबता एक पैनल में। | |
| **[dsh-dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-dsh-checkpoint-rewind)** | Claude Code /rewind-समतुल्य: स्नैपशॉट, सत्र फ़ॉर्क, एक-बार पुनर्स्थापना | |
| **[dsh-dsh-claude-move](https://github.com/PerryLink/dsh-dsh-claude-move)** | Claude Code सत्र, मेमोरी, कौशल और CLAUDE.md को DSH में स्थानांतरित करें | |
| **[dsh-dsh-click](https://github.com/PerryLink/dsh-dsh-click)** | DeepSeek Harness के लिए क्रॉस-प्लेटफ़ॉर्म नेटिव डेस्कटॉप नियंत्रण — Windows पहले। | |
| **[dsh-dsh-composer-history](https://github.com/PerryLink/dsh-dsh-composer-history)** | वेब कंपोज़र के लिए टर्मिनल-शैली इनपुट इतिहास: तीर, Ctrl+R खोज | |
| **[dsh-dsh-data-quality](https://github.com/PerryLink/dsh-dsh-data-quality)** | डेटासेट गुणवत्ता जाँच व उद्धरण सत्यापन (यहाँ उपभोग किया गया वैकल्पिक संख्या-सेतु) | |
| **[dsh-dsh-defend](https://github.com/PerryLink/dsh-dsh-defend)** | DeepSeek Harness के लिए प्रॉम्प्ट-इंजेक्शन, जेलब्रेक और सीक्रेट-लीक रक्षा। | |
| **[dsh-dsh-doublecheck](https://github.com/PerryLink/dsh-dsh-doublecheck)** | इंजीनियरिंग-अनुशासन रक्षक: आवश्यकताओं की पूछताछ, परीक्षण द्वार, प्रतिद्वंद्वी समीक्षा | |
| **[dsh-dsh-draw](https://github.com/PerryLink/dsh-dsh-draw)** | DeepSeek Harness के लिए एकीकृत स्थैतिक-छवि निर्माण रूटिंग। | |
| **[dsh-dsh-fast](https://github.com/PerryLink/dsh-dsh-fast)** | DeepSeek Harness के लिए रीड-ओनली प्रदर्शन डायग्नोस्टिक्स। | |
| **[dsh-dsh-fund-research](https://github.com/PerryLink/dsh-dsh-fund-research)** | चीनी सार्वजनिक म्यूचुअल फंड के लिए नियतात्मक अनुसंधान रिपोर्ट | |
| **[dsh-dsh-github](https://github.com/PerryLink/dsh-dsh-github)** | DSH के लिए GitHub PR/issues एकीकरण, हर लेखन अनुमोदन-द्वारित | |
| **[dsh-dsh-library](https://github.com/PerryLink/dsh-dsh-library)** | DeepSeek Harness के लिए स्थानीय दस्तावेज़ ज्ञानकोश। | |
| **[dsh-dsh-local-ai](https://github.com/PerryLink/dsh-dsh-local-ai)** | DeepSeek Harness के लिए स्थानीय-मॉडल (Ollama) एकीकरण। | |
| **[dsh-dsh-lsp-actions](https://github.com/PerryLink/dsh-dsh-lsp-actions)** | भाषा सर्वरों पर LSP निदान, फ़ॉर्मेटिंग, पूर्णता, कोड क्रियाएँ और नाम बदलना | |
| **[dsh-dsh-mask](https://github.com/PerryLink/dsh-dsh-mask)** | PII मास्किंग मिडलवेयर: मॉडल सीमा पर अनाम करें, डिस्प्ले लेयर पर पुनर्स्थापित करें | |
| **[dsh-dsh-mcp-panel](https://github.com/PerryLink/dsh-dsh-mcp-panel)** | केवल-पढ़ने वाला MCP रनटाइम पैनल: /mcp कमांड + स्थिति, टूल और त्रुटियों वाला Settings टैब | |
| **[dsh-dsh-memento](https://github.com/PerryLink/dsh-dsh-memento)** | अनुमोदन-द्वारित क्रॉस-सत्र मेमोरी: ctx.memory सीम + SQLite + मेमोरी टूल | |
| **[dsh-dsh-observe](https://github.com/PerryLink/dsh-dsh-observe)** | DeepSeek Harness के लिए OpenTelemetry और Langfuse अवलोकनीयता निर्यातक। | |
| **[dsh-dsh-output-styles](https://github.com/PerryLink/dsh-dsh-output-styles)** | Claude Code outputStyles-समतुल्य रनटाइम शैली बदलाव | |
| **[dsh-dsh-permission-rules](https://github.com/PerryLink/dsh-dsh-permission-rules)** | ऑडिट के साथ Claude Code-शैली घोषणात्मक allow/deny/ask अनुमति नियम | |
| **[dsh-dsh-plugin-guide](https://github.com/PerryLink/dsh-dsh-plugin-guide)** | माँग पर एजेंट कौशल के रूप में प्लगइन-विकास ज्ञान आधार | |
| **[dsh-dsh-research-report](https://github.com/PerryLink/dsh-dsh-research-report)** | सामग्री-पता साक्ष्य और सीलबंद संस्करणों वाला सत्यापन-योग्य अनुसंधान-रिपोर्ट इंजन | |
| **[dsh-dsh-score](https://github.com/PerryLink/dsh-dsh-score)** | DeepSeek Harness प्लगिनों की बहु-आयामी गुणवत्ता स्कोरिंग। | |
| **[dsh-dsh-session-pin](https://github.com/PerryLink/dsh-dsh-session-pin)** | टिकाऊ क्रम के साथ वेब साइडबार में सत्र पिन करें | |
| **[dsh-dsh-session-sync](https://github.com/PerryLink/dsh-dsh-session-sync)** | DeepSeek Harness के लिए क्रॉस-डिवाइस सत्र सिंक — आपके सत्र स्टोर का एक समर्पित git मिरर। | |
| **[dsh-dsh-skill-pack-security](https://github.com/PerryLink/dsh-dsh-skill-pack-security)** | सुरक्षा-ऑडिट कौशल पैक: गुप्त स्कैन, निर्भरता और आपूर्ति-श्रृंखला समीक्षा | |
| **[dsh-dsh-talk](https://github.com/PerryLink/dsh-dsh-talk)** | DeepSeek Harness के लिए आवाज़-प्रथम सत्र लूप: बोलें और उत्तर सुनें। | |
| **[dsh-dsh-test-drive](https://github.com/PerryLink/dsh-dsh-test-drive)** | DeepSeek Harness प्लगिनों के लिए पृथक इंस्टॉल-एंड-स्मोक टेस्ट ड्राइव। | |
| **[dsh-dsh-translate](https://github.com/PerryLink/dsh-dsh-translate)** | DeepSeek Harness के लिए वेंडर पैरामीटर अनुवाद और नियतात्मक JSON मरम्मत। | |

## License

Apache-2.0 — देखें [LICENSE](LICENSE)।
