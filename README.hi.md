<div align="center">

# 🏭 dsh-industry-research

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

## Tools & surfaces

### `industry_map({ industry, seed?, seedFiles?, web?, chain? })`

`chain` के साथ: वैलिडेट करता है (लटकती एज, बिना-स्रोत मान, अवैध tier, डुप्लिकेट id — पूरी समस्या सूची के साथ स्पष्ट विफलता) और `chain.json` सहेजता है, फिर स्पष्ट अंतराल स्लॉट सूचीबद्ध करता है। `chain` के बिना: वर्तमान मानचित्र, दर्ज स्रोत और वैकल्पिक `ctx.web` श्रृंखला-संरचना सारांश लौटाता है ताकि मॉडल पुनरावृत्ति कर सके। `industry-research/map` उत्सर्जित करता है।

### `industry_track({ industry, topics?, since? })`

`ctx.web` से प्रत्येक विषय खोजता है, सूचियों व `since` से फ़िल्टर करता है, कॉल बजट के भीतर स्नैपशॉट (SHA-256) फ़ेच करता है, और `timeline.jsonl` में मर्ज करता है (नॉर्मलाइज़्ड URL से डीडुप, सीमा सहित)। जिन स्रोतों का स्नैपशॉट विफल हुआ वे कारण `note` में लिखकर केवल-उद्धरण एंट्री के रूप में रहते हैं। `ctx.web` अनमाउंटेड या `offline: true` होने पर गुम क्षमता का नाम बताते हुए स्पष्ट विफल। `industry-research/track` उत्सर्जित करता है।

### `company_scan({ name, dataFiles?, web? })`

workspace डेटा फ़ाइलें (`.md/.txt/.csv/.tsv/.json`; v1 PDF पार्स नहीं करता) पढ़ता, हैश करता, Markdown रूपरेखा व आंकड़ा-उम्मीदवार पंक्तियाँ निकालता है, वैकल्पिक `ctx.web` उद्धरण जोड़ता है और कार्ड सहेजता है। अस्वीकृत फ़ाइलें कारणों सहित लौटती हैं; कार्ड जो स्थापित नहीं कर सकता वह स्पष्ट अंतराल है।

### `industry_report({ industry, sections?, companies?, draft? })`

एविडेंस (`E-chain`, `E-timeline`, `E-company-<slug>`) जुटाता है और या तो आपका `draft` वैलिडेट करता है (sections + claims; हर claim के `evidenceIds` दर्ज एविडेंस को संदर्भित करने चाहिए) या यांत्रिक ऑटो-ड्राफ़्ट बनाता है (स्रोतित मेट्रिक्स और हालिया टाइमलाइन एंट्री claims बनती हैं)। इंजन पथ: सील्ड डायरेक्टरी + `sealHash` + प्रति-claim निष्कर्ष। फ़ॉलबैक पथ: संस्करणित Markdown + मैनिफ़ेस्ट, claims ईमानदारी से `unverified` अंकित। `industry-research/report` उत्सर्जित करता है।

## Skills

- **`industry-research-method`** — उद्योग अनुसंधान पद्धति: upstream/midstream/downstream विघटन, आपूर्ति/मांग ढांचा, स्रोत अनुशासन (हर आंकड़ा: मान + इकाई + स्रोत + asOf) और अंतराल-घोषणा अनुशासन (घोषित करें, कभी न बनाएँ)।
- **`company-research-method`** — कंपनी अनुसंधान पद्धति: व्यापार-संरचना / वित्त / जोखिम कार्ड ढांचा, सार्वजनिक-स्रोत प्राथमिकता सूची (कंपनी प्रकटीकरण → नियामक → प्रामाणिक मीडिया) और अनुपालन भाषा।

दोनों मानक `skill` टूल से मांग पर लोड होती हैं (`加载 industry-research-method 技能`)।

## Data layout

```
<workspace>/<industryRoot>/<उद्योग>/chain.json      industry_map
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
pnpm run pack:check
```

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `cordis`, `industry-research`, `company-research`, `research`, `report`

## Contributors

- प्रारंभिक डिज़ाइन और कार्यान्वयन: `dsh-industry-research` विकास सत्र (DeepSeek Harness)।

बाहरी योगदान स्वागत योग्य हैं — issue या pull request खोलें।

## License

Apache-2.0 — देखें [LICENSE](LICENSE)।
