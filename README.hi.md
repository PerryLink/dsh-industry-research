<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-industry-research-hero-en-dark.webp">
  <img src="docs/assets/dsh-industry-research-hero-en-light.webp" width="100%" alt="dsh-industry-research हीरो: बाईं ओर प्लगइन नाम, शीर्षक «Industry research», दो मूल्य पंक्तियाँ (हर संख्या स्रोत और तिथि के साथ; हर अंतराल स्पष्ट घोषित), पाइपलाइन उपशीर्षक और meta पंक्तियाँ; दाईं ओर एक शिक्षण-नमूना शोध डोज़ियर — तीन स्तरीय बैजियू श्रृंखला (अपस्ट्रीम सोरघम 10 CNY, स्रोत S1, तिथि 2026-01-01; मिडस्ट्रीम और डाउनस्ट्रीम में स्पष्ट «लंबित» अंतराल), E-chain / E-timeline / E-company-&lt;slug&gt; साक्ष्य रजिस्टर sha256 के साथ, 4/4 डिलीवरी अनुबंध (ब्लॉक पूर्ण / स्रोत और asOf जाँच / placeholders 0 / claims→साक्ष्य), और reports/&lt;YYYYMMDD-HHmmss&gt;/report.md + manifest.json के दो मार्ग — ctx.researchReport सीलिंग इंजन या builtin-fallback; नीचे versions.jsonl लेजर">
</picture>

# dsh-industry-research

**उद्योग शोध को एक जाँचने योग्य साक्ष्य-श्रृंखला बनाएँ — हर संख्या के साथ स्रोत और तिथि, हर अंतराल की स्पष्ट घोषणा।**

DeepSeek Harness के लिए उद्योग एवं कंपनी शोध डोमेन पैक: चार वर्कस्पेस-बद्ध टूल और दो कार्यप्रणाली स्किल, केवल सार्वजनिक स्रोत, केवल शोध-सहायता।

[इंस्टॉल](#तीन-चरणों-में-शुरुआत) · [कॉन्फ़िगरेशन](#कॉन्फ़िगरेशन) · [FAQ](#faq) · [简体中文](README.md) · [English](README.en.md) · [Español](README.es.md) · [Português](README.pt.md) · [हिन्दी](README.hi.md)

[![License](https://img.shields.io/badge/license-Apache--2.0-3366CC?style=flat-square&labelColor=2B3245)](LICENSE)
[![DSH](https://img.shields.io/badge/DSH-%E2%89%A50.2.1%20%3C0.3.0-4B67B4?style=flat-square&labelColor=2B3245)](#संगतता)
[![npm](https://img.shields.io/npm/v/dsh-industry-research?style=flat-square&labelColor=2B3245&color=CB3837)](https://www.npmjs.com/package/dsh-industry-research)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-industry-research/ci.yml?branch=main&label=CI&style=flat-square&labelColor=2B3245)](https://github.com/PerryLink/dsh-industry-research/actions/workflows/ci.yml)
[![Node](https://img.shields.io/badge/node-%5E22.19.0%20%7C%7C%20%3E%3D24.9.0-339933?style=flat-square&labelColor=2B3245)](#संगतता)

[![Stars](https://img.shields.io/github/stars/PerryLink/dsh-industry-research?style=flat-square&labelColor=2B3245)](https://github.com/PerryLink/dsh-industry-research/stargazers)
[![npm downloads](https://img.shields.io/npm/dm/dsh-industry-research?style=flat-square&labelColor=2B3245&color=CB3837)](https://www.npmjs.com/package/dsh-industry-research)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-industry-research?metric=downloads)](https://dshfind.com/plugins/PerryLink/dsh-industry-research?ref=badge)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/PerryLink/dsh-industry-research/badge)](https://securityscorecards.dev/viewer/?uri=github.com/PerryLink/dsh-industry-research)
[![DSH Market](https://img.shields.io/badge/DSH_Market-listed-4B67B4?style=flat-square&labelColor=2B3245)](https://dsh.market/)
[![Gitee](https://img.shields.io/badge/Gitee-mirror-C71D23?style=flat-square&labelColor=2B3245&logo=gitee)](https://gitee.com/perrylink/dsh-industry-research)

```sh
dsh plugin --profile <name> add dsh-industry-research
```

</div>

<sub>सामुदायिक प्लगइन, DeepSeek से असंबद्ध। एकमात्र रिपॉज़िटरी: <https://github.com/PerryLink/dsh-industry-research> (Gitee एक मिरर है)।</sub>

## यह क्या है

`dsh-industry-research` उद्योग शोध को एक दोहराने योग्य पाइपलाइन में बाँटता है: पहले उद्योग-श्रृंखला का नक्शा बनाएँ, फिर सार्वजनिक स्रोतों से नीति और समाचार ट्रैक करें, फिर कंपनियों को कार्ड में स्कैन करें, और अंत में एक जाँचने योग्य रिपोर्ट तैयार करें। मूल्य वाली हर मीट्रिक के साथ `sourceRef` अनिवार्य है; हर अंतराल एक स्पष्ट स्लॉट है, गढ़ी हुई संख्या नहीं; रिपोर्ट या तो सीलिंग इंजन को जाती है या अंतर्निहित फ़ॉलबैक मार्ग लेती है और यह ईमानदारी से घोषित करती है। केवल शोध-सहायता: कोई ट्रेडिंग नहीं, कोई मूल्य-पूर्वानुमान नहीं, कोई सशुल्क या लॉगिन-वाला स्रोत नहीं।

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-industry-research-flow-v5-dark.svg">
  <img src="docs/assets/dsh-industry-research-flow-v5-light.svg" width="100%" alt="dsh-industry-research संरचना: तीन उत्पादक एक साथ आते हैं — industry_map (chain.json + sources.json, वैकल्पिक chain.svg), industry_track (timeline.jsonl) और company_scan (card.json + card.md) — एक साक्ष्य रजिस्टर में (E-chain / E-timeline / E-company-&lt;slug&gt;, हर एक sha256 के साथ); industry_report का अनुबंध-द्वार ब्लॉक और पैराग्राफ, स्रोत और asOf आवश्यकताएँ, placeholder अवशेष और claims→evidenceIds जाँचता है, साथ में निर्धारक adversarial जाँच और वैकल्पिक ctx.jobs लाल-टीम समीक्षा व bull/bear नोट्स; दो निकास: ctx.researchReport सीलबंद (sealHash + प्रति-claim निर्णय) या builtin-fallback (reports/&lt;ts&gt;/report.md + manifest.json, claims unverified); versions.jsonl लेजर हर map/scan/report लेखन दर्ज करता है और पढ़ते समय hash जाँचता है, मेल न खाने पर ज़ोर से विफल होता है; बिंदुदार रेखाएँ ctx.web और ctx.jobs जैसी वैकल्पिक रनटाइम क्षमताएँ दर्शाती हैं">
</picture>

## तीन चरणों में शुरुआत

1. **इंस्टॉल** (कोई एक चैनल चुनें; दोनों प्रोफ़ाइल के `dsh.profile.bundles` स्टैक में bundle पंक्ति डालते हैं और पुनःआरंभ पर लागू होते हैं):

   ```sh
   # git चैनल (commit पिन करता है; पहला add प्रोफ़ाइल के pnpm-workspace.yaml में allowBuilds प्रविष्टि लिखता है)
   dsh plugin --profile demo add "github:PerryLink/dsh-industry-research#<sha>"
   # npm चैनल (0.3.25 प्रकाशित)
   dsh plugin --profile demo add dsh-industry-research
   ```

2. **न्यूनतम कॉन्फ़िग** (डिफ़ॉल्ट चलने योग्य हैं; केवल आर्टिफ़ैक्ट रूट या ऑफ़लाइन मोड बदलना हो तो ओवरराइड करें):

   ```yaml
   - insert:
       - id: dsh-industry-research
         name: dsh-industry-research
         config:
           industryRoot: industry-research
           offline: false
   ```

3. **माउंट की पुष्टि**:

   ```sh
   dsh --profile demo --dump-config | grep dsh-industry-research
   ```

   फिर सत्र में टूल क्रम से चलाएँ:

   ```
   industry-research-method स्किल लोड करें, फिर baijiu उद्योग पर शोध करें:
   पहले industry_map से श्रृंखला बनाएँ, फिर industry_track से नीति ट्रैक करें, अंत में industry_report से रिपोर्ट निकालें।
   ```

**अनइंस्टॉल**: `dsh plugin --profile demo remove dsh-industry-research` (या प्रोफ़ाइल patch से वह पंक्ति हटा दें)।

<details>
<summary>DSH Desktop मार्केट से इंस्टॉल</summary>

सभी PerryLink प्लगइन DSH Desktop के अंतर्निहित मार्केट में देखे जा सकते हैं: **Market → Sources → Add source → चिपकाएँ** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ चुनें**। इंस्टॉल अब भी मार्केट के npm पहचान-सत्यापन और आपकी पुष्टि से होता है।

</details>

## मुख्य क्षमताएँ

- **`industry_map`** — उद्योग-श्रृंखला का नक्शा (`chain.json`) बनाता या अद्यतन करता है: upstream/midstream/downstream नोड, किनारे और मीट्रिक स्लॉट। `value` वाली मीट्रिक के साथ `sourceRef` अनिवार्य है; मान-रहित स्लॉट स्पष्ट अंतराल है। नोड का `status` दावा `statusAsOf` के साथ आता है, और वैकल्पिक `taxonomyCode` को अंतर्निहित राष्ट्रीय उद्योग वर्गीकरण तालिका से मेल खाना चाहिए। `renderSvg: true` पर स्तर-वार `chain.svg` नेटवर्क चित्र भी लिखता है, जिसमें फ़नल/हब अवरोध उभारे जाते हैं। `depth` web सहायता का पैमाना तय करता है। बीज नोट्स/फ़ाइलें और वैकल्पिक `ctx.web` सारांश उद्धरण-योग्य स्रोत (`S1`, `S2`, …) के रूप में दर्ज होते हैं।
- **`industry_track`** — आधिकारिक `ctx.web` सीम से सार्वजनिक-स्रोत नीति/समाचार ट्रैकिंग: विषय-वार खोज, होस्ट श्वेत/काली सूची, `since` फ़िल्टर, बजट-बद्ध स्नैपशॉट फ़ेच (SHA-256 provenance हैश), और `timeline.jsonl` में अपेंड + डीडुप्लिकेशन (सीमा सहित)। प्रविष्टियाँ मान्य `evidenceCategory` ले सकती हैं; `depth` स्रोत-संख्या का पैमाना तय करता है। web क्षमता उपलब्ध न हो तो ज़ोर से विफल होता है।
- **`company_scan`** — वर्कस्पेस डेटा फ़ाइलों से कंपनी कार्ड (`card.json` + `card.md`): SHA-256 हैश, Markdown रूपरेखा और संख्या-उम्मीदवार पंक्तियाँ (हर संख्या फ़ाइल और पंक्ति उद्धृत करे), साथ में वैकल्पिक `ctx.web` उद्धरण पूरक। कार्ड में लिस्टिंग `status` (साथ `statusAsOf`), प्रारूप-जाँचा `ticker` और स्रोत-सहित मूल्य/मूल्यांकन `metrics` (प्रत्येक `source` + `asOf` के साथ) होते हैं। बैच मोड (`companies`) एक खराब कंपनी को अलग रखता है, पूरा बैच नहीं रुकता; `depth` web पूरक का पैमाना तय करता है। v1 में केवल टेक्स्ट प्रारूप (PDF नहीं)।
- **`industry_report`** — नक्शा + टाइमलाइन + कार्ड से एक जाँचने योग्य रिपोर्ट। उत्पादन से पहले एक नियतात्मक डिलीवरी-अनुबंध ब्लॉक, status/मूल्य दावे और प्लेसहोल्डर अवशेष जाँचता है (विफल हो तो ज़ोर से, आधी बनी रिपोर्ट कभी नहीं)। टाइमलाइन प्रविष्टियाँ `evidenceCategory` से समूहित होती हैं। एक नियतात्मक bull/bear संश्लेषण स्रोत-सहित तिथि-युक्त मानों को घोषित अंतरालों और डेटा-गुणवत्ता निष्कर्षों के सामने रखता है, रिपोर्ट के बहु-दृष्टिकोण अनुभाग में अंतर्निहित होता है, और subagent job के रूप में `perspectives-note.md` संस्करण-लेजर में लिखवाता है। `ctx.researchReport` इंजन माउंट हो तो साक्ष्य/अनुभाग/claims उसके `assemble` से सील होते हैं और प्रति-claim निर्णय लौटते हैं; न हो तो अंतर्निहित फ़ॉलबैक संस्करणित `reports/<YYYYMMDD-HHmmss>/report.md` + `manifest.json` लिखता है, जिसमें SHA-256 स्रोत-अनुरेखण तालिका होती है और `engine: 'builtin-fallback'` ईमानदारी से अंकित होता है।
- **आर्टिफ़ैक्ट संस्करण लेजर** — `industry_map` / `company_scan` / `industry_report` हर लेखन पर `versions.jsonl` में प्रविष्टि जोड़ते हैं (रूट-सापेक्ष पथ + SHA-256 + समय-चिह्न + परिवर्तन प्रकार); पढ़ते समय हैश सत्यापित होता है और बेमेल पर ज़ोर से विफलता होती है।
- **दो कार्यप्रणाली स्किल** — `industry-research-method` (श्रृंखला विभाजन, आपूर्ति/माँग ढाँचा, स्रोत अनुशासन, अंतराल-घोषणा अनुशासन) और `company-research-method` (कंपनी ढाँचा, सार्वजनिक-स्रोत सूची, अनुपालन भाषा)।
- **टाइप्ड Cordis इवेंट** — हर पुष्ट आर्टिफ़ैक्ट के बाद `industry-research/map`, `industry-research/track`, `industry-research/report` उत्सर्जित होते हैं।

दोनों कार्यप्रणाली स्किल मानक `skill` टूल से माँग पर लोड होते हैं (`industry-research-method स्किल लोड करें`)।

### टूल सतहें

#### `industry_map({ industry, seed?, seedFiles?, web?, chain?, renderSvg?, depth? })`

`chain` के साथ: सत्यापन (लटकते किनारे, स्रोत-रहित मान, अवैध tier, डुप्लिकेट id, status/statusAsOf, अज्ञात `taxonomyCode` — पूरी समस्या-सूची के साथ ज़ोर से विफलता) और `chain.json` लिखना, फिर स्पष्ट अंतराल स्लॉट और अवरोध नोड सूचीबद्ध करना। `chain` के बिना: वर्तमान नक्शा, पंजीकृत स्रोत और वैकल्पिक `ctx.web` श्रृंखला-संरचना सारांश लौटाता है ताकि मॉडल पुनरावृत्ति कर सके। `renderSvg: true` पर नियतात्मक `chain.svg` भी लिखता है। `depth` (quick/standard/comprehensive) web सहायता का पैमाना तय करता है। पिछले `research-state.json` की तुलना में `delta` सारांश लौटाता है। `industry-research/map` उत्सर्जित करता है।

#### `industry_track({ industry, topics?, since?, depth?, evidenceCategory? })`

`ctx.web` से हर विषय खोजता है, श्वेत/काली सूची और `since` से फ़िल्टर करता है, कॉल बजट के भीतर पेज स्नैपशॉट (SHA-256) लेता है और `timeline.jsonl` में मिलाता है (सामान्यीकृत URL से डीडुप, सीमा सहित)। `depth` स्रोत/फ़ेच बजट का पैमाना तय करता है; `evidenceCategory` हर जोड़ी गई प्रविष्टि को लेबल करता है और छह-श्रेणी enum के विरुद्ध सत्यापित होता है। जिन स्रोतों का स्नैपशॉट विफल रहा वे केवल-उद्धरण प्रविष्टि के रूप में `note` में कारण के साथ रहते हैं। पिछले `research-state.json` की तुलना में `delta` सारांश लौटाता है। `ctx.web` अनमाउंटेड या `offline: true` हो तो अनुपलब्ध क्षमता का नाम लेकर ज़ोर से विफल होता है। `industry-research/track` उत्सर्जित करता है।

#### `company_scan({ name | companies, dataFiles?, web?, status?, statusAsOf?, ticker?, metrics?, depth?, parallel? })`

वर्कस्पेस डेटा फ़ाइलें पढ़ता है (`.md/.txt/.csv/.tsv/.json`; v1 PDF नहीं पढ़ता), हैश करता है, Markdown रूपरेखा और संख्या-उम्मीदवार पंक्तियाँ निकालता है, वैकल्पिक रूप से `ctx.web` उद्धरण जोड़ता है और कार्ड लिखता है। `status` के लिए भविष्य-रहित `statusAsOf` आवश्यक है; `ticker` को अंतर्निहित प्रारूप से मेल खाना चाहिए जब तक `scan.strictTicker: false` न हो; हर `metrics` मान के साथ `source` + `asOf` अनिवार्य है। `companies` (बैच) एक खराब कंपनी को अलग रखता है, बैच नहीं रुकता; `parallel: true` और `ctx.jobs` माउंट हो तो हर कंपनी अलग job में जाती है (नहीं तो क्रमिक मार्ग पर लौटता है और परिणाम के `mode` में बताता है)। अस्वीकृत फ़ाइलें कारण सहित लौटती हैं; कार्ड जो स्थापित नहीं कर सकता वह स्पष्ट अंतराल है।

#### `industry_report({ industry, sections?, companies?, draft? })`

साक्ष्य जमा करता है (`E-chain`, `E-timeline`, `E-company-<slug>`), पढ़े गए आर्टिफ़ैक्ट को `versions.jsonl` के विरुद्ध जाँचता है (हैश बेमेल पर ज़ोर से विफलता), और या तो आपका `draft` सत्यापित करता है (अनुभाग + claims; हर claim के `evidenceIds` को पंजीकृत साक्ष्य उद्धृत करना होगा) या यांत्रिक स्वतः-ड्राफ़्ट बनाता है (स्रोत-सहित मीट्रिक और हाल की टाइमलाइन प्रविष्टियाँ claims बनती हैं, `evidenceCategory` से समूहित)। उत्पादन से पहले नियतात्मक डिलीवरी-अनुबंध चलता है और कोई अनुपस्थित ब्लॉक, प्लेसहोल्डर या स्रोत/तिथि-रहित दावा मिलने पर ज़ोर से विफल होता है। नियतात्मक विरोधी जाँच हमेशा चलती है, और `ctx.jobs` माउंट हो तो red-team समीक्षा job (`red-review-note.md`) बनता है (नहीं तो `review: skipped(jobs unavailable)`). नियतात्मक bull/bear संश्लेषण रिपोर्ट में बहु-दृष्टिकोण अनुभाग जोड़ता है और `ctx.jobs` माउंट हो तो बहस job (`perspectives-note.md`) शुरू करता है। इंजन मार्ग: सील्ड डायरेक्टरी + `sealHash` + प्रति-claim निर्णय। फ़ॉलबैक मार्ग: संस्करणित Markdown + manifest, claims ईमानदारी से `unverified` चिह्नित। `industry-research/report` उत्सर्जित करता है।

### उदाहरण

ये प्लगइन के वास्तविक प्रवेश-बिंदु हैं; एक बार इंस्टॉल करें, फिर कोई एक चलाएँ।

**विस्तृत उदाहरण** — कमांड `industry_map`, इनपुट:

~~~sh
industry_map({
  industry: "示例",
  web: false,
  chain: {
    nodes: [
      { id: "up", name: "上游原料", tier: "upstream", metrics: [{ key: "价格", value: 10, unit: "元", asOf: "2026-01-01", sourceRef: "S1" }] },
      { id: "down", name: "下游渠道", tier: "downstream", metrics: [{ key: "占比" }] }
    ],
    edges: [{ from: "up", to: "down" }]
  }
})
~~~

आउटपुट:

~~~text
行业「示例」产业链图：已校验并写入 /tmp/dsh-industry-research-test-Pxf1l8/industry-research/示例/chain.json
节点 2 / 边 1；缺口 2 项。
与上次相比：新增源 0，移除源 0，未变化证据 0。
缺口清单：节点「下游渠道」(down) 的指标「占比」待补（无来源数值）；产业链缺少 midstream 层节点
web 辅助未执行：调用方指定 web: false
~~~

*Observed from `README.md:151-153; test/map.spec.ts:44-51; src/tools/map.ts:157-163; src/chain.ts:177-194`*

**विफलता शाखा** — इनपुट:

~~~text
{"industry":"白酒","web":false,"chain":{"industry":"白酒","nodes":[{"id":"upstream-1","name":"高粱种植","tier":"upstream","metrics":[{"key":"市场规模","value":120,"unit":"亿元"}]}],"edges":[]}}
~~~

आउटपुट:

~~~text
isError=true; error.message=chain 校验失败（1 项）：node "upstream-1" metric "市场规模" carries a value without a sourceRef — register the source or mark the slot 待补 (omit value)
~~~

*Observed from `plugins/dsh-industry-research/src/chain.ts:158-159 (rule); plugins/dsh-industry-research/src/tools/map.ts:232-234 (throw); plugins/dsh-industry-research/README.md:179 (unsourced values fail loud); exercised through plugins/dsh-industry-research/test/harness.ts`*

**संक्षिप्त उदाहरण**: `industry_track` · `company_scan` · `industry_report`

### डेटा लेआउट

```
<workspace>/<industryRoot>/versions.jsonl              आर्टिफ़ैक्ट संस्करण लेजर (SHA-256 + समय-चिह्न + परिवर्तन)
<workspace>/<industryRoot>/<उद्योग>/research-state.json  शोध-स्थिति स्मृति
<workspace>/<industryRoot>/<उद्योग>/chain.json         industry_map
<workspace>/<industryRoot>/<उद्योग>/chain.svg          industry_map (renderSvg: true)
<workspace>/<industryRoot>/<उद्योग>/timeline.jsonl     industry_track
<workspace>/<industryRoot>/<उद्योग>/sources.json       उद्धरण-योग्य स्रोत रजिस्ट्री (S1, S2, …)
<workspace>/<industryRoot>/<उद्योग>/notes/             बीज नोट्स
<workspace>/<industryRoot>/<उद्योग>/red-review-note.md  industry_report (red-team समीक्षा, jobs)
<workspace>/<industryRoot>/<उद्योग>/perspectives-note.md  industry_report (bull/bear बहस, jobs)
<workspace>/<industryRoot>/<उद्योग>/reports/<ts>/      industry_report (report.md + manifest.json)
<workspace>/<industryRoot>/companies/<कंपनी>/card.*     company_scan
```

## कॉन्फ़िगरेशन

सभी समायोज्य Schemastery `Config` फ़ील्ड हैं (cordis.yml से ओवरराइड योग्य); अवैध मान प्रोफ़ाइल लोड को ज़ोर से विफल करते हैं। id से ओवरराइड पूरी पंक्ति बदल देता है — आवश्यक सभी कुंजियाँ दोबारा लिखें। `cordis.patch.yml` हर कुंजी पर इनलाइन टिप्पणी देता है।

सबसे अधिक उपयोग होने वाली कुंजियाँ:

| कुंजी | डिफ़ॉल्ट | अर्थ |
|---|---|---|
| `enabled` | `true` | मुख्य स्विच; `false` कुछ भी माउंट नहीं करता। |
| `industryRoot` | `industry-research` | आर्टिफ़ैक्ट रूट, सत्र वर्कस्पेस के सापेक्ष (या निरपेक्ष)। |
| `fetchTimeoutMs` | `20000` | `ctx.web` खोज/फ़ेच के लिए प्रति-अनुरोध टाइमआउट (मिलीसेकंड)। |
| `timelineMaxEntries` | `500` | प्रति उद्योग `timeline.jsonl` में रखी जाने वाली प्रविष्टियाँ (सबसे पुरानी हटती हैं)। |
| `sourceAllowlist` | `[]` | ट्रैक किए गए स्रोतों की होस्ट श्वेतसूची (खाली = सभी)। |
| `sourceBlocklist` | `[]` | ट्रैक किए गए स्रोतों की होस्ट कालीसूची (श्वेतसूची पर भारी)। |
| `offline` | `false` | ऑफ़लाइन मोड: `ctx.web` को कभी नहीं छूता; केवल स्थानीय वर्कस्पेस डेटा। |
| `skillsDir` | _(सेट नहीं)_ | स्पष्ट skills रूट ओवरराइड; डिफ़ॉल्ट पैकेज्ड `skills/`। |

<details>
<summary>पूर्ण कॉन्फ़िगरेशन तालिका (13 कुंजियाँ)</summary>

| कुंजी | डिफ़ॉल्ट | अर्थ |
|---|---|---|
| `enabled` | `true` | मुख्य स्विच; `false` कुछ भी माउंट नहीं करता। |
| `industryRoot` | `industry-research` | आर्टिफ़ैक्ट रूट, सत्र वर्कस्पेस के सापेक्ष (या निरपेक्ष)। |
| `fetchTimeoutMs` | `20000` | `ctx.web` खोज/फ़ेच के लिए प्रति-अनुरोध टाइमआउट (मिलीसेकंड)। |
| `timelineMaxEntries` | `500` | प्रति उद्योग `timeline.jsonl` में रखी जाने वाली प्रविष्टियाँ (सबसे पुरानी हटती हैं)। |
| `sourceAllowlist` | `[]` | ट्रैक किए गए स्रोतों की होस्ट श्वेतसूची (खाली = सभी)। |
| `sourceBlocklist` | `[]` | ट्रैक किए गए स्रोतों की होस्ट कालीसूची (श्वेतसूची पर भारी)। |
| `offline` | `false` | ऑफ़लाइन मोड: `ctx.web` को कभी नहीं छूता; केवल स्थानीय वर्कस्पेस डेटा। |
| `skillsDir` | _(सेट नहीं)_ | स्पष्ट skills रूट ओवरराइड; डिफ़ॉल्ट पैकेज्ड `skills/`। |
| `track.maxResultsPerTopic` | `10` | प्रति विषय `web_search` maxResults। |
| `track.maxFetchesPerCall` | `10` | प्रति `industry_track` कॉल स्नैपशॉट-फ़ेच बजट। |
| `scan.maxFileBytes` | `1048576` | कंपनी डेटा फ़ाइल के लिए प्रति-फ़ाइल पठन सीमा (बाइट)। |
| `scan.maxFigureCandidates` | `100` | प्रति कंपनी स्कैन संख्या-उम्मीदवार पंक्ति बजट। |
| `scan.strictTicker` | `true` | कंपनी कार्ड ticker को अंतर्निहित प्रारूप से मेल खाना चाहिए (A-share 6 अंक, US 1–5 अक्षर, HK 1–5 अंक); `false` प्रारूप जाँच से छूट। |

</details>

प्रोफ़ाइल patch ओवरराइड उदाहरण:

```yaml
- insert:
    - id: dsh-industry-research
      name: dsh-industry-research
      config:
        industryRoot: industry-research
        offline: false
        track:
          maxFetchesPerCall: 5
        scan:
          strictTicker: false
```

## FAQ

<details>
<summary>डेटा कहाँ रहता है? बाहर जा सकता है?</summary>

सभी आर्टिफ़ैक्ट सत्र वर्कस्पेस के `<industryRoot>/` के नीचे रहते हैं (डिफ़ॉल्ट `industry-research/`): `chain.json`, `timeline.jsonl`, `sources.json`, `reports/<ts>/`, कंपनी कार्ड और `versions.jsonl` लेजर। प्लगइन स्वयं कोई नेटवर्क अनुरोध नहीं करता और कोई क्रेडेंशियल नहीं रखता; सारी पुनर्प्राप्ति `ctx.web` से होती है, provider चयन और टाइमआउट deployment और आपके कॉन्फ़िग के अधीन हैं। सशुल्क या लॉगिन-वाले स्रोत दायरे से बाहर हैं — स्वयं निर्यात कर `dataFiles` के रूप में दें।

</details>

<details>
<summary>`ctx.web` या `ctx.researchReport` न हो तो क्या होगा? चुपचाप विफल?</summary>

कभी चुपचाप नहीं। `ctx.web` के बिना `industry_track` अनुपलब्ध क्षमता का नाम लेकर ज़ोर से विफल होता है; `ctx.researchReport` के बिना `industry_report` अंतर्निहित फ़ॉलबैक लेता है और संस्करणित `report.md` + `manifest.json` लिखता है, ईमानदारी से `engine: 'builtin-fallback'` अंकित और claims `unverified` चिह्नित। `ctx.jobs` के बिना `parallel: true` क्रमिक हो जाता है और red-team समीक्षा तथा bull/bear बहस `skipped(jobs unavailable)` के रूप में सूचित होती हैं।

</details>

<details>
<summary>क्या यह अन्य प्लगइनों से टकराता है?</summary>

नहीं। यह केवल `skills` और `tools` इंजेक्ट करता है; कोई waterfall listener, कमांड, क्लाइंट slot या `webServer` रूट पंजीकृत नहीं करता, और `ctx.web` / `ctx.researchReport` / `ctx.jobs` को इंजेक्ट करने के बजाय निष्पादन समय पर `ctx.get(...)` से खोजता है, इसलिए किसी सहोदर के न होने पर प्लगइन ट्री PENDING में नहीं अटकता। प्रमाण «अन्य DSH प्लगइनों के साथ इंटरऑपरेबिलिटी» में बिंदुवार है।

</details>

<details>
<summary>प्रदर्शन लागत कितनी है?</summary>

सब कुछ स्थानीय नियतात्मक कार्य है: Markdown/JSON पढ़ना-लिखना, SHA-256 गणना और संरचना सत्यापन — कोई मॉडल कॉल नहीं। नेटवर्क केवल `industry_track` (और `industry_map` / `company_scan` की web सहायता) में होता है और `track.maxFetchesPerCall`, `track.maxResultsPerTopic` तथा `fetchTimeoutMs` से फ़ोरग्राउंड बजट तक सीमित है; `offline: true` नेटवर्क पूरी तरह बंद कर देता है।

</details>

<details>
<summary>क्या PDF सीधे पढ़ सकता है?</summary>

नहीं। v1 केवल टेक्स्ट प्रारूप पढ़ता है (`.md/.txt/.csv/.tsv/.json`) और PDF नहीं पार्स करता। पहले PDF को टेक्स्ट या Markdown में बदलें, फिर `dataFiles` के रूप में दें।

</details>

## सुरक्षा सीमाएँ

- **वर्कस्पेस संयमन** — उद्योग/कंपनी नाम मान्य पथ-खंड हैं; डेटा फ़ाइलें सत्र cwd के विरुद्ध संयमन-जाँची जाती हैं (दोनों पक्ष resolve)।
- **निर्माण से ही provenance** — स्रोतों के साथ SHA-256 हैश; स्रोत-रहित संख्या सत्यापन त्रुटि; भ्रष्ट टाइमलाइन पंक्तियाँ छोड़ी जाती हैं और गिनती स्पष्ट रूप से बताई जाती है, कभी चुपचाप नहीं।
- **ईमानदार अवनति** — `ctx.web` / `ctx.researchReport` के अभाव में ज़ोर से विफलता या ईमानदारी से चिह्नित फ़ॉलबैक आर्टिफ़ैक्ट, कभी चुपचाप गढ़ना नहीं।
- **उत्क्रमणीय पंजीकरण** — सब कुछ `ctx.effect()` / `ctx.on()` / `register()` से होता है।
- **केवल-शोध अनुपालन** — टूल विवरण, कार्ड और रिपोर्ट पर «केवल शोध, निवेश सलाह नहीं»; डेटा बिंदुओं पर asOf और स्रोत।

## ज्ञात सीमाएँ

- **Cordis इवेंट, सत्र-लॉग इवेंट नहीं** — `industry-research/*` इवेंट टाइप्ड Cordis observability इवेंट हैं और सत्र लॉग में कभी नहीं जोड़े जाते; टिकाऊ रिकॉर्ड वर्कस्पेस आर्टिफ़ैक्ट ही हैं, और मॉडल-दृश्य टूल परिणाम टिकाऊ `tool/result` सत्र इवेंट से जाते हैं।
- **`ctx.attachment` में लेखन नहीं** — rc2 attachment सीम केवल चित्र (PNG/JPEG/WebP/GIF) स्वीकारती है; इसलिए Markdown रिपोर्ट संस्करणित वर्कस्पेस फ़ाइलें रहती हैं, टूल परिणाम में निरपेक्ष पथ से उद्धृत।
- **v1 केवल टेक्स्ट प्रारूप पढ़ता है** — PDF पार्सिंग नहीं; उपयोगकर्ता से पहले PDF को टेक्स्ट/Markdown में बदलने को कहें।
- **चीनी-संस्करण स्किल** — पैकेज्ड कार्यप्रणाली स्किल चीनी में हैं; अंग्रेज़ी संस्करण भविष्य का कार्य है।
- **फ़ोरग्राउंड टूल** — `industry_track` `track.maxFetchesPerCall` और `fetchTimeoutMs` से सीमित होकर फ़ोरग्राउंड में चलता है; बैकग्राउंड-जॉब मोड भविष्य का कार्य है।
- **स्वतः-ड्राफ़्ट यांत्रिक है** — यह आर्टिफ़ैक्ट सारांशित करता है और स्रोत-सहित डेटा बिंदुओं को claims बनाता है; कथा-गुणवत्ता मॉडल द्वारा लिखे `draft` से आती है।

## अन्य DSH प्लगइनों के साथ इंटरऑपरेबिलिटी

यह प्लगइन केवल सार्वजनिक सीमों का उपभोग करता है और किसी साझा संसाधन पर कब्ज़ा नहीं करता:

- **केवल दो सेवाएँ इंजेक्ट** — `inject = ['skills', 'tools']`; `ctx.web`, `ctx.researchReport` और `ctx.jobs` सभी निष्पादन-समय `ctx.get(...)` संरचनात्मक खोजें हैं (आकार-गार्ड सहित), इसलिए किसी के न होने पर प्लगइन PENDING में नहीं रहता।
- **कोई listener नहीं** — कोई waterfall listener नहीं और `agent/pre-step` या `tools/post-execute` जैसे साझा इवेंट की कोई सदस्यता नहीं, इसलिए किसी अन्य प्लगइन को शॉर्ट-सर्किट या भूखा करने का अवसर ही नहीं।
- **साझा नामों पर कब्ज़ा नहीं** — कोई कमांड, क्लाइंट slot या `webServer` उपसर्ग पंजीकृत नहीं; चारों टूल नाम (`industry_map`, `industry_track`, `company_scan`, `industry_report`) नेमस्पेस-युक्त हैं और कोई नंगा नाम नहीं लेते।
- **स्किल समर्पित provider से** — `industry-research` नाम और `includeDefaultRoots: false` के साथ माउंट होता है, इसलिए वैश्विक skills रूट न लेता है न बदलता है; अवैध `skillsDir` लोड पर ज़ोर से विफल होता है।
- **patch केवल स्वयं को insert करता है** — bundle patch अपनी ही पंक्ति डालता है और किसी अंतर्निहित पंक्ति का `config` कभी नहीं लिखता।
- **`dsh-research-report` के साथ अनुबंध टाइप-पक्ष पर** — `AssembleReportRequest` आदि type-only devDependency के रूप में आते हैं और build में मिट जाते हैं; रनटाइम पर केवल `ctx.get('researchReport')` खोजा जाता है, और उसके बिना अंतर्निहित फ़ॉलबैक चलता है — सील्ड परिणाम कभी गढ़े नहीं जाते।
- **`dsh-base` के साथ** — `ctx.web` base bundle द्वारा संयोजित होता है; अनुपस्थित हो तो `industry_track` माउंट-मार्गदर्शन के साथ ज़ोर से विफल होता है।
- **निरंतर जाँच** — `.github/workflows/plugin-doctor.yml` प्लगइन डॉक्टर चलाता है; निर्णय वही है जो वह workflow बताए।

## अनुमतियाँ और डेटा

`dsh-industry-research` केवल सार्वजनिक सीमों का उपभोग करता है: `ctx.tools`, `ctx.skills`, और वैकल्पिक खोज के रूप में `ctx.web` तथा `ctx.researchReport`। यह स्वयं कोई नेटवर्क पहुँच नहीं करता (सारी पुनर्प्राप्ति `ctx.web` से, deployment के provider चयन और आपके कॉन्फ़िगर किए टाइमआउट के साथ), कोई क्रेडेंशियल नहीं रखता, और केवल सत्र वर्कस्पेस के भीतर `industryRoot` में लिखता है। केवल सार्वजनिक स्रोत प्रयुक्त होते हैं; सशुल्क या लॉगिन-वाले स्रोत दायरे से बाहर हैं — अपने निर्यात `dataFiles` के रूप में दें।

## संगतता

| आयाम | स्थिति |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.2.1-alpha.1` (npm प्रकाशित लाइन, 2026-09-25 को सत्यापित); `package.json` में `engine.dsh` घोषित `>=0.2.1-0 <0.3.0 \|\| >=0.2.2-0 <0.3.0`. 0.1.2-rc.1 (2026-09-02 को अनुकूलित): सत्र envelope अपना ignorable फ़ील्ड केवल मौजूदा लॉग पठन-संगतता के लिए रखता है — Session.append अब भी उसे स्टाम्प नहीं कर सकता, इसलिए audit-gate व्यवहार अपरिवर्तित है। 2026-09-24 को `0.1.7-rc.2` प्रकाशित peers के विरुद्ध सत्यापित (पूर्ण gate श्रृंखला; वास्तविक प्रोफ़ाइल इंस्टॉल स्मोक साप्ताहिक और प्रति-PR `compat.yml` job में चलता है)। |
| Node | `^22.19.0 \|\| >=24.9.0`, केवल ESM (`"type": "module"`). |
| Peer निर्भरताएँ | `@deepseek-ai/cordis ^4.0.5-alpha.1`, `@deepseek-ai/schemastery ^3.18.5-alpha.1`, और `@deepseek-ai/dsh-tools`, `@deepseek-ai/dsh-skill`, `@deepseek-ai/dsh-skill-filesystem` (peer रेंज `>=0.1.2-rc.1 <0.2.0 \|\| >=0.1.5-alpha.1 <0.2.0 \|\| >=0.1.6-0 <0.2.0 \|\| >=0.1.7-0 <0.2.0 \|\| >=0.2.0-0 <0.3.0 \|\| >=0.2.1-0 <0.3.0 \|\| >=0.2.2-0 <0.3.0`; सभी आधिकारिक `dsh-base` bundle द्वारा संयोजित)। |
| प्लेटफ़ॉर्म | जहाँ DSH चले; टूल शुद्ध host-side TypeScript हैं, कोई ब्राउज़र-आधा नहीं। |
| वैकल्पिक क्षमताएँ | निष्पादन समय पर खोजी जाती हैं (कभी इंजेक्ट नहीं): `ctx.web` (सार्वजनिक-स्रोत पुनर्प्राप्ति — `dsh-base` द्वारा संयोजित) और `ctx.researchReport` (सहोदर `dsh-research-report` का सीलिंग इंजन)। |

## इकोसिस्टम और गुणवत्ता

- [Gitee मिरर](https://gitee.com/perrylink/dsh-industry-research) (समन्वित मिरर; GitHub ही मानक है)
- [dshfind प्लगइन पेज](https://dshfind.com/plugins/PerryLink/dsh-industry-research) (इंस्टॉल और रैंकिंग)
- [OpenSSF Scorecard रिपोर्ट](https://securityscorecards.dev/viewer/?uri=github.com/PerryLink/dsh-industry-research) ([.github/workflows/scorecard.yml](.github/workflows/scorecard.yml) द्वारा संचालित)
- [dsh-plugin-doctor सत्यापन रिपोर्ट](https://github.com/PerryLink/dsh-plugin-doctor#verified-徽章)
- [DSH Market](https://dsh.market/) (सूचीबद्ध)
- **1024 स्टोर चैनल**: एक बार `npm i -g dsh1024`, फिर `dsh1024 plugin --profile web add dsh-industry-research` ([deepseek1024.com](https://deepseek1024.com) की इंस्टॉल रैंकिंग में गिना जाता है)
- [इकोसिस्टम ज्ञान-आधार](https://perrylink.github.io/dsh-plugin-guide/) (मापा गया डेटा, मार्केटिंग नहीं): प्लगइन विकास गाइड · चयन डेटा · रखरखाव मानदंड

## डेवलपमेंट

```sh
pnpm install
pnpm run typecheck && pnpm run typecheck:ci     # प्रकाशित-peer सतह + skipLibCheck हटाकर प्रकाशित लाइन
pnpm test                                       # vitest
pnpm run build                                  # scripts/prepare.mjs → lib/
pnpm run verify:self-contained && pnpm run verify:artifacts
pnpm run verify:readme-sync                     # पाँच भाषाओं के README की संरचना और कॉन्फ़िग-कुंजी समानता
pnpm run verify:skills                          # skills frontmatter gate
pnpm run pack:check
```

चित्र [`scripts/gen-readme-assets.py`](scripts/gen-readme-assets.py) (Python + Pillow) से बनते हैं और दोबारा चलाए जा सकते हैं: `python scripts/gen-readme-assets.py`. दोनों (light/dark) SVG `docs/assets/` में हैं; दृश्य पाठ केवल कमांड/आर्टिफ़ैक्ट token हैं, इसलिए पाँचों भाषाएँ उन्हें साझा करती हैं।

| पथ | सामग्री |
|---|---|
| `src/` | फ़ंक्शन-प्लगइन प्रवेश (`index.ts`), `config.ts`, चारों टूल और शुद्ध डेटा मॉडल |
| `skills/` | दो चीनी-संस्करण कार्यप्रणाली स्किल (`SKILL.md` बंडल) |
| `cordis.patch.yml` | bundle पंक्ति घोषणा, हर कुंजी पर इनलाइन टिप्पणी |
| `test/` | vitest सूट (वास्तविक Context / ToolRuntime / SkillRegistry / WebRuntime) |
| `fixtures/` | baijiu शिक्षण fixtures (काल्पनिक, स्पष्ट रूप से चिह्नित) |
| `scripts/` | build और gates: `prepare.mjs`, `verify-*`, `check-readme-sync.mjs`, `check-skills.mjs` |
| `docs/assets/` | README चित्र (इस स्क्रिप्ट से निर्मित) |
| `.github/workflows/` | CI, compat, plugin-doctor, release, scorecard |

विषय: `dsh`, `dsh-plugin`, `deepseek-harness`, `cordis`, `industry-research`, `company-research`, `research`, `report`

## परिवार और आभार

यह परियोजना [PerryLink](https://github.com/PerryLink) द्वारा अनुरक्षित DeepSeek Harness प्लगइन परिवार का हिस्सा है (सभी Apache-2.0)। अगर यह उपयोगी है, तो **एक स्टार अगले व्यक्ति को इसे खोजने में मदद करता है** — इसके पीछे कुछ भी बंद नहीं है।

- प्रारंभिक डिज़ाइन और कार्यान्वयन: `dsh-industry-research` विकास सत्र (DeepSeek Harness)।
- बाहरी योगदान का स्वागत है — issue या pull request खोलें।

<details>
<summary>सभी प्लगइन विस्तृत करें</summary>

| प्लगइन | स्थिति |
|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | 🧊 फ़्रोज़न — रेपो README देखें |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** |  |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | 🧊 फ़्रोज़न — रेपो README देखें |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** |  |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | 🧊 फ़्रोज़न — रेपो README देखें |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** |  |
| **[dsh-drill-script-check](https://github.com/PerryLink/dsh-drill-script-check)** |  |
| **[dsh-eia-guide-check](https://github.com/PerryLink/dsh-eia-guide-check)** |  |
| **[dsh-emergency-plan](https://github.com/PerryLink/dsh-emergency-plan)** |  |
| **[dsh-essay-rubric-check](https://github.com/PerryLink/dsh-essay-rubric-check)** |  |
| **[dsh-evidence-check](https://github.com/PerryLink/dsh-evidence-check)** |  |
| **[dsh-export-ctl-check](https://github.com/PerryLink/dsh-export-ctl-check)** |  |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** |  |
| **[dsh-fmea-table-check](https://github.com/PerryLink/dsh-fmea-table-check)** |  |
| **[dsh-forecast-penalty](https://github.com/PerryLink/dsh-forecast-penalty)** |  |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** |  |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** |  |
| **[dsh-gongwen-flow-check](https://github.com/PerryLink/dsh-gongwen-flow-check)** |  |
| **[dsh-gongwen-word-check](https://github.com/PerryLink/dsh-gongwen-word-check)** |  |
| **[dsh-guard-plan-qc](https://github.com/PerryLink/dsh-guard-plan-qc)** |  |
| **[dsh-hazchem-check](https://github.com/PerryLink/dsh-hazchem-check)** |  |
| **[dsh-hazplan-check](https://github.com/PerryLink/dsh-hazplan-check)** |  |
| **[dsh-hidden-risk-map](https://github.com/PerryLink/dsh-hidden-risk-map)** |  |
| **[dsh-hs-classify](https://github.com/PerryLink/dsh-hs-classify)** |  |
| **[dsh-icd-rule-check](https://github.com/PerryLink/dsh-icd-rule-check)** |  |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** |  |
| **[dsh-lawcite-adapter](https://github.com/PerryLink/dsh-lawcite-adapter)** |  |
| **[dsh-laya](https://github.com/PerryLink/dsh-laya)** |  |
| **[dsh-lc-doc-check](https://github.com/PerryLink/dsh-lc-doc-check)** |  |
| **[dsh-learning-gap-check](https://github.com/PerryLink/dsh-learning-gap-check)** |  |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** |  |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** |  |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** |  |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** |  |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** |  |
| **[dsh-medrec-qc](https://github.com/PerryLink/dsh-medrec-qc)** |  |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** | 🧊 फ़्रोज़न — रेपो README देखें |
| **[dsh-nsfc-form-check](https://github.com/PerryLink/dsh-nsfc-form-check)** |  |
| **[dsh-nurse-record-check](https://github.com/PerryLink/dsh-nurse-record-check)** |  |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** |  |
| **[dsh-origin-rvc-check](https://github.com/PerryLink/dsh-origin-rvc-check)** |  |
| **[dsh-ota-review-check](https://github.com/PerryLink/dsh-ota-review-check)** |  |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** |  |
| **[dsh-paper-doc-adapter](https://github.com/PerryLink/dsh-paper-doc-adapter)** |  |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** |  |
| **[dsh-permit-report-check](https://github.com/PerryLink/dsh-permit-report-check)** |  |
| **[dsh-pipeline-check](https://github.com/PerryLink/dsh-pipeline-check)** |  |
| **[dsh-pleading-draft](https://github.com/PerryLink/dsh-pleading-draft)** |  |
| **[dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor)** | 🚫 रिटायर्ड (रेपो संग्रहीत) |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** |  |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** | 🚫 रिटायर्ड (रेपो संग्रहीत) |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** | 🚫 रिटायर्ड (रेपो संग्रहीत) |
| **[dsh-policy-brief-draft](https://github.com/PerryLink/dsh-policy-brief-draft)** |  |
| **[dsh-power-loss-split](https://github.com/PerryLink/dsh-power-loss-split)** |  |
| **[dsh-power-ticket-check](https://github.com/PerryLink/dsh-power-ticket-check)** |  |
| **[dsh-ppap-check](https://github.com/PerryLink/dsh-ppap-check)** |  |
| **[dsh-protest-deadline](https://github.com/PerryLink/dsh-protest-deadline)** |  |
| **[dsh-railway-window](https://github.com/PerryLink/dsh-railway-window)** |  |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | 🧊 फ़्रोज़न — रेपो README देखें |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** |  |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | 🚫 रिटायर्ड (रेपो संग्रहीत) |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | 🧊 फ़्रोज़न — रेपो README देखें |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | 🧊 फ़्रोज़न — रेपो README देखें |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | 🧊 फ़्रोज़न — रेपो README देखें |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | 🧊 फ़्रोज़न — रेपो README देखें |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | 🧊 फ़्रोज़न — रेपो README देखें |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | 🚫 रिटायर्ड (रेपो संग्रहीत) |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | 🚫 रिटायर्ड (रेपो संग्रहीत) |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | 🚫 रिटायर्ड (रेपो संग्रहीत) |

</details>

## लाइसेंस

Apache-2.0 — देखें [LICENSE](LICENSE)।

<p align="center"><sub>Apache-2.0 · सामुदायिक प्लगइन, DeepSeek से असंबद्ध।</sub></p>
