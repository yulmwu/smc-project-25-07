interface WikiEntry {
    ko: { title: string; content: string }
    en: { title: string; content: string }
}

export const wikiContent: { [key: string]: WikiEntry } = {
    animal: {
        ko: {
            title: '동물',
            content: `
# 조선시대 동물

## 반려 및 왕실 동물

- **개**: 연산군은 사냥개를 궁궐에서 많이 길렀으며, 조회 시간에도 개가 드나들어 신하들의 항의를 받았습니다.
- **매**: 주로 사냥용으로 길렀으며, 매를 기르기 위해 논밭이 훼손되었다는 민원도 있었습니다.

## 야생 및 위험 동물

- **호랑이**: 자주 출몰하여 피해를 주었으며, 이를 사냥하기 위해 착호갑사가 조직되었습니다.
- **표범**: 사람을 공격하는 일이 잦았으며, 삼형에 표범이 들어와 군사를 동원해 잡은 기록이 있습니다.
- **늑대**: 몽골 방면에서 주로 나타났으며, 무장을 하고 다닐 정도로 위협적이었습니다.

※ 맹수 출몰은 총 402건 이상 조선왕조실록에 기록되어 있습니다.
            `,
        },
        en: {
            title: 'Animals',
            content: `
# Animals in the Joseon Dynasty

## Companion and Royal Animals

- **Dogs**: King Yeonsangun kept many hunting dogs in the palace, and they even roamed during official meetings, causing complaints from officials.
- **Falcons**: Falcons were raised for hunting, and complaints arose due to farmlands being damaged to raise them.

## Wild and Dangerous Animals

- **Tigers**: Frequently appeared and caused harm; a special force called "Chakho Gapsa" was formed to hunt them.
- **Leopards**: Often attacked people; one record states that soldiers were mobilized to catch a leopard in Samhyeong.
- **Wolves**: Mainly came from the Mongolian region and were considered threatening enough to require armed protection during travel.

※ More than 402 cases of large predator sightings were recorded in the Annals of the Joseon Dynasty.
            `,
        },
    },
    weather: {
        ko: {
            title: '날씨',
            content: `
# 조선시대 날씨 및 기후

## 이상기후 및 기온 변화

- "누런 안개가 끼고 봄처럼 따뜻했다." — *태종실록*
- "기온이 봄날씨와 같았다." — *태종실록*
- "태조가 왕위에 오르자 가뭄이 끝나고 억수같은 비가 내렸다." — *태조실록*

## 우박, 한파, 재해

- "연사흘 우박이 내렸다." — *태조실록*
- "10월 보름이면 얼음이 얼 정도로 추워 수송이 어렵다." — *세종실록*
- "제주도에 폭설이 내려 말들이 얼어 죽었다." — *세종실록*

※ 12월~4월 사이의 혹한은 반복적으로 기록되었습니다.
            `,
        },
        en: {
            title: 'Weather',
            content: `
# Weather and Climate in the Joseon Dynasty

## Abnormal Climate and Temperature Changes

- "Yellow fog appeared, and it felt as warm as spring." — *Annals of King Taejong*
- "The temperature was like a spring day." — *Annals of King Taejong*
- "As King Taejo ascended the throne, a heavy rain ended the drought." — *Annals of King Taejo*

## Hail, Cold Waves, and Disasters

- "Hail fell for three consecutive days." — *Annals of King Taejo*
- "By mid-October, it was so cold that transportation was difficult due to ice." — *Annals of King Sejong*
- "Heavy snow in Jeju Island killed many of the 10,000 horses." — *Annals of King Sejong*

※ Harsh winters from December to April were frequently documented.
            `,
        },
    },
    naturalDisaster: {
        ko: {
            title: '자연재해',
            content: `
# 조선시대 자연재해

## 가뭄과 홍수

가뭄이나 홍수가 발생하면 사직, 종묘, 태백산·백두산의 신에게 기우제 및 영제를 지냈습니다.

- **사직**: 토지와 곡식의 신에게 지내는 제사
- **영제**: 가뭄, 홍수, 역병 등의 재앙을 막기 위한 제사

## 지진

지진은 괴이한 현상으로 간주되어 해괴제라는 제사를 통해 재앙을 달래려 했습니다.

## 기타 재해

- 해충, 전염병: 기양제, 포제, 여제
- 천변(川變), 성변(城變): 기양제

※ 이러한 제사는 국가 차원의 재난 대응 체계로 조선 전기간에 시행되었습니다.
            `,
        },
        en: {
            title: 'Natural Disasters',
            content: `
# Natural Disasters in the Joseon Dynasty

## Droughts and Floods

During droughts or floods, the Joseon government held rituals such as rain prayers and appeasement ceremonies to gods of land and harvest, including those at Sajik, Jongmyo, and sacred mountains like Taebaeksan and Baekdusan.

- **Sajik**: Rituals for gods of land and grain
- **Yeongje**: Ceremonies to prevent or end disasters like droughts, floods, and epidemics

## Earthquakes

Earthquakes were seen as mysterious phenomena and addressed with the ritual called "Haegoeje" to appease supernatural causes.

## Other Disasters

- Pests, epidemics: Gi-yangje, Poje, Yeoje
- River or castle anomalies: Gi-yangje

※ These rituals became a systematic state-level response throughout the Joseon period.
            `,
        },
    },
    accident: {
        ko: {
            title: '사건사고',
            content: `
# 조선시대 사건사고

## 이상 현상과 괴이한 사건

- **영두성의 출현**: 질장구 같은 붉은 천체가 나타나며 우레 소리를 내었고, 꼬리 모양의 흰 기운이 하늘을 가로질렀습니다. 현대에는 UFO로 추정되기도 합니다.
- **괴이한 짐승**: 궁궐 침전에 개 같은 괴물이 출몰하였으며, 묘원의 소나무가 타는 등 불길한 징조로 여겨졌습니다.
- **중종 승하 이후의 대소동**: 괴물과 검은 기운, 수레 소문 등으로 인해 서울 민심이 불안해졌고, 며칠간 징을 치며 소동이 벌어졌습니다.

※ 이 사건들은 *조선왕조실록*에 자세히 기록되어 있으며, 당시 사회적 불안과 초자연적 인식이 반영되어 있습니다.
            `,
        },
        en: {
            title: 'Incidents and Accidents',
            content: `
# Incidents and Phenomena in the Joseon Dynasty

## Unusual Phenomena and Strange Events

- **Appearance of Yeongdu Star**: A reddish object shaped like a war drum appeared in the sky, accompanied by thunder-like sounds. It left a long white trail and is speculated today as a possible UFO.
- **Strange Beast in the Palace**: A dog-like creature entered the royal chamber and fled. It was regarded as a bad omen, especially since a sacred pine tree had burned the night before.
- **Unrest after King Jungjong’s Death**: Rumors of monsters and dark auras in Seoul led to several days of panic and public unrest, reflecting deep social anxiety.

※ These events are extensively recorded in the Annals of the Joseon Dynasty, reflecting the period’s social anxiety and supernatural interpretations.
            `,
        },
    },
}
