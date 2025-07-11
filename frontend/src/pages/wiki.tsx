import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

interface WikiEntry {
    ko: { title: string; content: string }
    en: { title: string; content: string }
}

// const wikiContent: { [key: string]: WikiEntry } = {
//     animal: {
//         ko: {
//             title: '동물',
//             content: `
//         <h2 class="text-2xl font-bold mb-4">동물</h2>
//         <p class="mb-2">동물은 생물 분류 체계에서 동물계(Animalia)에 속하는 다세포 진핵생물입니다. 일반적으로 이동 능력이 있고, 다른 생물을 섭취하여 에너지를 얻는 종속영양 생물입니다.</p>
//         <p class="mb-2">다양한 종류의 동물이 지구상에 존재하며, 서식지, 식성, 생활 방식 등에 따라 매우 다양한 형태로 진화했습니다. 포유류, 조류, 파충류, 양서류, 어류, 곤충류 등이 대표적인 동물 분류군입니다.</p>
//         <h3 class="text-xl font-semibold mt-6 mb-3">주요 특징</h3>
//         <ul class="list-disc list-inside">
//           <li>대부분 이동 능력을 가집니다.</li>
//           <li>종속영양 생물로, 스스로 양분을 만들지 못하고 외부에서 섭취합니다.</li>
//           <li>다세포 생물이며, 복잡한 조직과 기관을 가집니다.</li>
//           <li>대부분 유성 생식을 합니다.</li>
//         </ul>
//         <h3 class="text-xl font-semibold mt-6 mb-3">동물의 예시</h3>
//         <p>사자, 호랑이, 코끼리, 고래, 독수리, 뱀, 개구리, 참치, 나비 등</p>
//       `,
//         },
//         en: {
//             title: 'Animals',
//             content: `
//         <h2 class="text-2xl font-bold mb-4">Animals</h2>
//         <p class="mb-2">Animals are multicellular, eukaryotic organisms that form the biological kingdom Animalia. Generally, they are motile and heterotrophic, meaning they obtain energy by ingesting other organisms.</p>
//         <p class="mb-2">A wide variety of animals exist on Earth, having evolved into diverse forms based on habitat, diet, and lifestyle. Mammals, birds, reptiles, amphibians, fish, and insects are representative animal groups.</p>
//         <h3 class="text-xl font-semibold mt-6 mb-3">Key Characteristics</h3>
//         <ul class="list-disc list-inside">
//           <li>Most have the ability to move.</li>
//           <li>They are heterotrophic, unable to produce their own food and must consume external sources.</li>
//           <li>They are multicellular organisms with complex tissues and organs.</li>
//           <li>Most reproduce sexually.</li>
//         </ul>
//         <h3 class="text-xl font-semibold mt-6 mb-3">Examples of Animals</h3>
//         <p>Lion, Tiger, Elephant, Whale, Eagle, Snake, Frog, Tuna, Butterfly, etc.</p>
//       `,
//         },
//     },
//     weather: {
//         ko: {
//             title: '날씨',
//             content: `
//         <h2 class="text-2xl font-bold mb-4">날씨</h2>
//         <p class="mb-2">날씨는 특정 시간과 장소에서의 대기 상태를 의미합니다. 기온, 습도, 강수량, 바람, 기압, 구름의 양 등 다양한 요소에 의해 결정됩니다.</p>
//         <p class="mb-2">날씨는 지구의 기후 시스템의 일부이며, 단기적인 대기 현상을 나타냅니다. 반면 기후는 특정 지역에서 장기간에 걸쳐 나타나는 평균적인 날씨 패턴을 의미합니다.</p>
//         <h3 class="text-xl font-semibold mt-6 mb-3">날씨의 요소</h3>
//         <ul class="list-disc list-inside">
//           <li>기온: 대기의 따뜻하거나 차가운 정도</li>
//           <li>습도: 대기 중 수증기의 양</li>
//           <li>강수량: 비, 눈, 우박 등 하늘에서 떨어지는 물의 양</li>
//           <li>바람: 공기의 움직임</li>
//           <li>기압: 대기가 지표면에 가하는 압력</li>
//         </ul>
//         <h3 class="text-xl font-semibold mt-6 mb-3">날씨 현상</h3>
//         <p>맑음, 흐림, 비, 눈, 안개, 천둥번개, 태풍, 폭설 등</p>
//       `,
//         },
//         en: {
//             title: 'Weather',
//             content: `
//         <h2 class="text-2xl font-bold mb-4">Weather</h2>
//         <p class="mb-2">Weather refers to the state of the atmosphere at a specific time and place. It is determined by various factors such as temperature, humidity, precipitation, wind, atmospheric pressure, and cloud cover.</p>
//         <p class="mb-2">Weather is part of Earth's climate system and represents short-term atmospheric phenomena. In contrast, climate refers to the average weather patterns observed over a long period in a particular region.</p>
//         <h3 class="text-xl font-semibold mt-6 mb-3">Elements of Weather</h3>
//         <ul class="list-disc list-inside">
//           <li>Temperature: The degree of hotness or coldness of the atmosphere.</li>
//           <li>Humidity: The amount of water vapor in the atmosphere.</li>
//           <li>Precipitation: The amount of water falling from the sky, such as rain, snow, or hail.</li>
//           <li>Wind: The movement of air.</li>
//           <li>Atmospheric Pressure: The pressure exerted by the atmosphere on the Earth's surface.</li>
//         </ul>
//         <h3 class="text-xl font-semibold mt-6 mb-3">Weather Phenomena</h3>
//         <p>Clear, Cloudy, Rain, Snow, Fog, Thunderstorms, Typhoons, Heavy Snowfall, etc.</p>
//       `,
//         },
//     },
//     naturalDisaster: {
//         ko: {
//             title: '자연재해',
//             content: `
//         <h2 class="text-2xl font-bold mb-4">자연재해</h2>
//         <p class="mb-2">자연재해는 자연 현상으로 인해 발생하는 인명 및 재산 피해를 초래하는 재난을 의미합니다. 이는 인간의 활동과는 무관하게 자연적으로 발생합니다.</p>
//         <p class="mb-2">지진, 쓰나미, 화산 폭발과 같은 지질학적 재해, 태풍, 홍수, 가뭄, 폭염, 한파와 같은 기상학적 재해 등 다양한 형태가 있습니다.</p>
//         <h3 class="text-xl font-semibold mt-6 mb-3">주요 자연재해</h3>
//         <ul class="list-disc list-inside">
//           <li>지진: 지구 내부의 에너지 방출로 인한 지반의 흔들림</li>
//           <li>쓰나미: 해저 지진이나 화산 활동으로 발생하는 거대한 파도</li>
//           <li>화산 폭발: 마그마가 지표면으로 분출하는 현상</li>
//           <li>태풍/허리케인/사이클론: 열대 해상에서 발생하는 강력한 저기압성 폭풍</li>
//           <li>홍수: 강이나 하천의 물이 범람하여 육지를 덮는 현상</li>
//           <li>가뭄: 오랜 기간 동안 강수량이 부족하여 물 부족 현상이 발생하는 것</li>
//           <li>산불: 산림에서 발생하는 대규모 화재</li>
//         </ul>
//         <h3 class="text-xl font-semibold mt-6 mb-3">자연재해 대비</h3>
//         <p>자연재해는 예측이 어렵고 큰 피해를 줄 수 있으므로, 사전 대비와 신속한 대응이 중요합니다. 비상 물품 준비, 대피 계획 수립, 재난 방송 청취 등이 필요합니다.</p>
//       `,
//         },
//         en: {
//             title: 'Natural Disasters',
//             content: `
//         <h2 class="text-2xl font-bold mb-4">Natural Disasters</h2>
//         <p class="mb-2">Natural disasters refer to calamities that cause human and property damage due to natural phenomena. These occur naturally, independent of human activities.</p>
//         <p class="mb-2">There are various forms, including geological disasters like earthquakes, tsunamis, and volcanic eruptions, and meteorological disasters such as typhoons, floods, droughts, heatwaves, and cold waves.</p>
//         <h3 class="text-xl font-semibold mt-6 mb-3">Major Natural Disasters</h3>
//         <ul class="list-disc list-inside">
//           <li>Earthquake: Shaking of the ground due to the release of energy within the Earth.</li>
//           <li>Tsunami: Giant waves caused by underwater earthquakes or volcanic activity.</li>
//           <li>Volcanic Eruption: The phenomenon of magma erupting to the Earth's surface.</li>
//           <li>Typhoon/Hurricane/Cyclone: Powerful low-pressure storms occurring in tropical seas.</li>
//           <li>Flood: The phenomenon of rivers or streams overflowing and covering land.</li>
//           <li>Drought: A prolonged period of insufficient rainfall leading to water shortages.</li>
//           <li>Wildfire: Large-scale fires occurring in forests.</li>
//         </ul>
//         <h3 class="text-xl font-semibold mt-6 mb-3">Preparedness for Natural Disasters</h3>
//         <p>Natural disasters are difficult to predict and can cause significant damage, so prior preparation and quick response are crucial. This includes preparing emergency supplies, establishing evacuation plans, and listening to disaster broadcasts.</p>
//       `,
//         },
//     },
//     accident: {
//         ko: {
//             title: '사건사고',
//             content: `
//         <h2 class="text-2xl font-bold mb-4">사건사고</h2>
//         <p class="mb-2">사건사고는 예상치 못하게 발생하여 인명이나 재산에 피해를 주거나 사회적 혼란을 야기하는 일련의 상황을 총칭합니다. 이는 자연재해와 달리 주로 인간의 활동이나 시스템의 오류로 인해 발생합니다.</p>
//         <p class="mb-2">교통사고, 산업재해, 화재, 범죄, 붕괴 사고 등 다양한 유형이 있으며, 발생 원인과 규모에 따라 사회에 미치는 영향이 크게 달라집니다.</p>
//         <h3 class="text-xl font-semibold mt-6 mb-3">주요 사건사고 유형</h3>
//         <ul class="list-disc list-inside">
//           <li>교통사고: 차량, 선박, 항공기 등 교통수단 운행 중 발생하는 사고</li>
//           <li>산업재해: 작업장에서 발생하는 사고로, 근로자의 부상이나 사망을 초래</li>
//           <li>화재: 불이 발생하여 건물이나 재산을 태우는 사고</li>
//           <li>범죄: 법률을 위반하는 행위로, 절도, 폭력, 사기 등</li>
//           <li>붕괴 사고: 건물, 교량 등 구조물이 무너지는 사고</li>
//           <li>환경 오염 사고: 유해 물질 유출 등으로 환경에 피해를 주는 사고</li>
//         </ul>
//         <h3 class="text-xl font-semibold mt-6 mb-3">사건사고 예방 및 대응</h3>
//         <p>사건사고는 예방이 가장 중요하며, 안전 수칙 준수, 정기적인 점검, 비상 훈련 등이 필요합니다. 사고 발생 시에는 신속한 신고와 초기 대응이 피해를 최소화하는 데 결정적인 역할을 합니다.</p>
//       `,
//         },
//         en: {
//             title: 'Incidents and Accidents',
//             content: `
//         <h2 class="text-2xl font-bold mb-4">Incidents and Accidents</h2>
//         <p class="mb-2">Incidents and accidents collectively refer to unexpected occurrences that cause harm to people or property, or lead to social disruption. Unlike natural disasters, these primarily arise from human activities or system failures.</p>
//         <p class="mb-2">There are various types, including traffic accidents, industrial accidents, fires, crimes, and structural collapses, and their impact on society varies greatly depending on the cause and scale.</p>
//         <h3 class="text-xl font-semibold mt-6 mb-3">Major Types of Incidents and Accidents</h3>
//         <ul class="list-disc list-inside">
//           <li>Traffic Accidents: Accidents involving vehicles, ships, aircraft, etc., during operation.</li>
//           <li>Industrial Accidents: Accidents occurring in the workplace, resulting in injury or death to workers.</li>
//           <li>Fire: An accident where fire breaks out, burning buildings or property.</li>
//           <li>Crime: Acts that violate the law, such as theft, violence, fraud, etc.</li>
//           <li>Structural Collapse: Accidents where structures like buildings or bridges collapse.</li>
//           <li>Environmental Pollution Incident: Incidents causing environmental damage due to the leakage of harmful substances.</li>
//         </ul>
//         <h3 class="text-xl font-semibold mt-6 mb-3">Prevention and Response to Incidents and Accidents</h3>
//         <p>Prevention is paramount for incidents and accidents, requiring adherence to safety rules, regular inspections, and emergency drills. In the event of an accident, prompt reporting and initial response play a decisive role in minimizing damage.</p>
//       `,
//         },
//     },
// }

const wikiContent: { [key: string]: WikiEntry } = {
    animal: {
        ko: {
            title: '동물',
            content: `
        <h2 class="text-2xl font-bold mb-4">조선시대 동물</h2>

        <h3 class="text-xl font-semibold mt-6 mb-3">반려 및 왕실 동물</h3>
        <ul class="list-disc list-inside">
          <li><strong>개</strong>: 연산군은 사냥개를 궁궐에서 많이 길렀으며, 조회 시간에도 개가 드나들어 신하들의 항의를 받았습니다.</li>
          <li><strong>매</strong>: 주로 사냥용으로 길렀으며, 매를 기르기 위해 논밭이 훼손되었다는 민원도 있었습니다.</li>
        </ul>

        <h3 class="text-xl font-semibold mt-6 mb-3">야생 및 위험 동물</h3>
        <ul class="list-disc list-inside">
          <li><strong>호랑이</strong>: 자주 출몰하여 피해를 주었으며, 이를 사냥하기 위해 착호갑사가 조직되었습니다.</li>
          <li><strong>표범</strong>: 사람을 공격하는 일이 잦았으며, 삼형에 표범이 들어와 군사를 동원해 잡은 기록이 있습니다.</li>
          <li><strong>늑대</strong>: 몽골 방면에서 주로 나타났으며, 무장을 하고 다닐 정도로 위협적이었습니다.</li>
        </ul>
        <p class="mt-2 text-sm text-gray-600">※ 맹수 출몰은 총 402건 이상 조선왕조실록에 기록되어 있습니다.</p>
      `,
        },
        en: {
            title: 'Animals',
            content: `
        <h2 class="text-2xl font-bold mb-4">Animals in the Joseon Dynasty</h2>

        <h3 class="text-xl font-semibold mt-6 mb-3">Companion and Royal Animals</h3>
        <ul class="list-disc list-inside">
          <li><strong>Dogs</strong>: King Yeonsangun kept many hunting dogs in the palace, and they even roamed during official meetings, causing complaints from officials.</li>
          <li><strong>Falcons</strong>: Falcons were raised for hunting, and complaints arose due to farmlands being damaged to raise them.</li>
        </ul>

        <h3 class="text-xl font-semibold mt-6 mb-3">Wild and Dangerous Animals</h3>
        <ul class="list-disc list-inside">
          <li><strong>Tigers</strong>: Frequently appeared and caused harm; a special force called "Chakho Gapsa" was formed to hunt them.</li>
          <li><strong>Leopards</strong>: Often attacked people; one record states that soldiers were mobilized to catch a leopard in Samhyeong.</li>
          <li><strong>Wolves</strong>: Mainly came from the Mongolian region and were considered threatening enough to require armed protection during travel.</li>
        </ul>
        <p class="mt-2 text-sm text-gray-600">※ More than 402 cases of large predator sightings were recorded in the Annals of the Joseon Dynasty.</p>
      `,
        },
    },
    weather: {
        ko: {
            title: '날씨',
            content: `
        <h2 class="text-2xl font-bold mb-4">조선시대 날씨 및 기후</h2>

        <h3 class="text-xl font-semibold mt-6 mb-3">이상기후 및 기온 변화</h3>
        <ul class="list-disc list-inside">
          <li>"누런 안개가 끼고 봄처럼 따뜻했다." — <em>태종실록</em></li>
          <li>"기온이 봄날씨와 같았다." — <em>태종실록</em></li>
          <li>"태조가 왕위에 오르자 가뭄이 끝나고 억수같은 비가 내렸다." — <em>태조실록</em></li>
        </ul>

        <h3 class="text-xl font-semibold mt-6 mb-3">우박, 한파, 재해</h3>
        <ul class="list-disc list-inside">
          <li>"연사흘 우박이 내렸다." — <em>태조실록</em></li>
          <li>"10월 보름이면 얼음이 얼 정도로 추워 수송이 어렵다." — <em>세종실록</em></li>
          <li>"제주도에 폭설이 내려 말들이 얼어 죽었다." — <em>세종실록</em></li>
        </ul>
        <p class="mt-2 text-sm text-gray-600">※ 12월~4월 사이의 혹한은 반복적으로 기록되었습니다.</p>
      `,
        },
        en: {
            title: 'Weather',
            content: `
        <h2 class="text-2xl font-bold mb-4">Weather and Climate in the Joseon Dynasty</h2>

        <h3 class="text-xl font-semibold mt-6 mb-3">Abnormal Climate and Temperature Changes</h3>
        <ul class="list-disc list-inside">
          <li>"Yellow fog appeared, and it felt as warm as spring." — <em>Annals of King Taejong</em></li>
          <li>"The temperature was like a spring day." — <em>Annals of King Taejong</em></li>
          <li>"As King Taejo ascended the throne, a heavy rain ended the drought." — <em>Annals of King Taejo</em></li>
        </ul>

        <h3 class="text-xl font-semibold mt-6 mb-3">Hail, Cold Waves, and Disasters</h3>
        <ul class="list-disc list-inside">
          <li>"Hail fell for three consecutive days." — <em>Annals of King Taejo</em></li>
          <li>"By mid-October, it was so cold that transportation was difficult due to ice." — <em>Annals of King Sejong</em></li>
          <li>"Heavy snow in Jeju Island killed many of the 10,000 horses." — <em>Annals of King Sejong</em></li>
        </ul>
        <p class="mt-2 text-sm text-gray-600">※ Harsh winters from December to April were frequently documented.</p>
      `,
        },
    },
    naturalDisaster: {
        ko: {
            title: '자연재해',
            content: `
        <h2 class="text-2xl font-bold mb-4">조선시대 자연재해</h2>

        <h3 class="text-xl font-semibold mt-6 mb-3">가뭄과 홍수</h3>
        <p class="mb-2">가뭄이나 홍수가 발생하면 사직, 종묘, 태백산·백두산의 신에게 기우제 및 영제를 지냈습니다.</p>
        <ul class="list-disc list-inside">
          <li><strong>사직</strong>: 토지와 곡식의 신에게 지내는 제사</li>
          <li><strong>영제</strong>: 가뭄, 홍수, 역병 등의 재앙을 막기 위한 제사</li>
        </ul>

        <h3 class="text-xl font-semibold mt-6 mb-3">지진</h3>
        <p>지진은 괴이한 현상으로 간주되어 해괴제라는 제사를 통해 재앙을 달래려 했습니다.</p>

        <h3 class="text-xl font-semibold mt-6 mb-3">기타 재해</h3>
        <ul class="list-disc list-inside">
          <li>해충, 전염병: 기양제, 포제, 여제</li>
          <li>천변(川變), 성변(城變): 기양제</li>
        </ul>
        <p class="mt-2 text-sm text-gray-600">※ 이러한 제사는 국가 차원의 재난 대응 체계로 조선 전기간에 시행되었습니다.</p>
      `,
        },
        en: {
            title: 'Natural Disasters',
            content: `
        <h2 class="text-2xl font-bold mb-4">Natural Disasters in the Joseon Dynasty</h2>

        <h3 class="text-xl font-semibold mt-6 mb-3">Droughts and Floods</h3>
        <p class="mb-2">During droughts or floods, the Joseon government held rituals such as rain prayers and appeasement ceremonies to gods of land and harvest, including those at Sajik, Jongmyo, and sacred mountains like Taebaeksan and Baekdusan.</p>
        <ul class="list-disc list-inside">
          <li><strong>Sajik</strong>: Rituals for gods of land and grain</li>
          <li><strong>Yeongje</strong>: Ceremonies to prevent or end disasters like droughts, floods, and epidemics</li>
        </ul>

        <h3 class="text-xl font-semibold mt-6 mb-3">Earthquakes</h3>
        <p>Earthquakes were seen as mysterious phenomena and addressed with the ritual called "Haegoeje" to appease supernatural causes.</p>

        <h3 class="text-xl font-semibold mt-6 mb-3">Other Disasters</h3>
        <ul class="list-disc list-inside">
          <li>Pests, epidemics: Gi-yangje, Poje, Yeoje</li>
          <li>River or castle anomalies: Gi-yangje</li>
        </ul>
        <p class="mt-2 text-sm text-gray-600">※ These rituals became a systematic state-level response throughout the Joseon period.</p>
      `,
        },
    },
    accident: {
        ko: {
            title: '사건사고',
            content: `
        <h2 class="text-2xl font-bold mb-4">조선시대 사건사고</h2>

        <h3 class="text-xl font-semibold mt-6 mb-3">이상 현상과 괴이한 사건</h3>
        <ul class="list-disc list-inside">
          <li><strong>영두성의 출현</strong>: 질장구 같은 붉은 천체가 나타나며 우레 소리를 내었고, 꼬리 모양의 흰 기운이 하늘을 가로질렀습니다. 현대에는 UFO로 추정되기도 합니다.</li>
          <li><strong>괴이한 짐승</strong>: 궁궐 침전에 개 같은 괴물이 출몰하였으며, 묘원의 소나무가 타는 등 불길한 징조로 여겨졌습니다.</li>
          <li><strong>중종 승하 이후의 대소동</strong>: 괴물과 검은 기운, 수레 소문 등으로 인해 서울 민심이 불안해졌고, 며칠간 징을 치며 소동이 벌어졌습니다.</li>
        </ul>
        <p class="mt-2 text-sm text-gray-600">※ 이 사건들은 <em>조선왕조실록</em>에 자세히 기록되어 있으며, 당시 사회적 불안과 초자연적 인식이 반영되어 있습니다.</p>
      `,
        },
        en: {
            title: 'Incidents and Accidents',
            content: `
        <h2 class="text-2xl font-bold mb-4">Incidents and Phenomena in the Joseon Dynasty</h2>

        <h3 class="text-xl font-semibold mt-6 mb-3">Unusual Phenomena and Strange Events</h3>
        <ul class="list-disc list-inside">
          <li><strong>Appearance of Yeongdu Star</strong>: A reddish object shaped like a war drum appeared in the sky, accompanied by thunder-like sounds. It left a long white trail and is speculated today as a possible UFO.</li>
          <li><strong>Strange Beast in the Palace</strong>: A dog-like creature entered the royal chamber and fled. It was regarded as a bad omen, especially since a sacred pine tree had burned the night before.</li>
          <li><strong>Unrest after King Jungjong’s Death</strong>: Rumors of monsters and dark auras in Seoul led to several days of panic and public unrest, reflecting deep social anxiety.</li>
        </ul>
        <p class="mt-2 text-sm text-gray-600">※ These events are extensively recorded in the Annals of the Joseon Dynasty, reflecting the period’s social anxiety and supernatural interpretations.</p>
      `,
        },
    },
}

const WikiPage: React.FC = () => {
    const router = useRouter()
    const { tab, lang } = router.query
    const [activeTab, setActiveTab] = useState<string>((tab as string) || 'animal')
    const [currentLang, setCurrentLang] = useState<'ko' | 'en'>((lang as 'ko' | 'en') || 'ko')

    useEffect(() => {
        if (router.isReady) {
            const { tab, lang } = router.query
            if (tab && typeof tab === 'string' && wikiContent[tab]) {
                setActiveTab(tab)
            } else {
                setActiveTab('animal') // Default to 'animal' if tab is not valid or not present
            }
            if (lang === 'en') {
                setCurrentLang('en')
            } else {
                setCurrentLang('ko')
            }
        }
    }, [router.isReady, router.query.tab, router.query.lang])

    const handleTabClick = (key: string) => {
        setActiveTab(key)
        router.push(`/wiki?tab=${key}&lang=${currentLang}`, undefined, { shallow: true })
    }

    const handleLangToggle = () => {
        const newLang = currentLang === 'ko' ? 'en' : 'ko'
        setCurrentLang(newLang)
        router.push(`/wiki?tab=${activeTab}&lang=${newLang}`, undefined, { shallow: true })
    }

    const currentContent = wikiContent[activeTab]?.[currentLang] || wikiContent.animal[currentLang]

    return (
        <>
            <div className='flex justify-between items-center mb-5'>
                <h1 className='text-4xl font-extrabold text-gray-900'>{currentLang === 'ko' ? '위키' : 'Wiki'}</h1>
                <button
                    onClick={handleLangToggle}
                    className='px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300'
                >
                    {currentLang === 'ko' ? 'English' : '한국어'}
                </button>
            </div>

            <div className='flex space-x-2 mb-2 overflow-x-auto pb-2 whitespace-nowrap'>
                {Object.keys(wikiContent).map((key) => (
                    <button
                        key={key}
                        onClick={() => handleTabClick(key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out cursor-pointer
              ${
                  activeTab === key
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
                    >
                        {wikiContent[key][currentLang].title}
                    </button>
                ))}
            </div>

            <div className='bg-white shadow-xl rounded-lg p-6 sm:p-8 lg:p-10'>
                <h2 className='text-2xl sm:text-3xl font-bold mb-6 text-gray-800 border-b pb-4'>
                    {currentContent.title}
                </h2>
                <div
                    className='prose prose-lg max-w-none text-gray-700 leading-relaxed'
                    dangerouslySetInnerHTML={{ __html: currentContent.content }}
                />
            </div>
        </>
    )
}

export default WikiPage
