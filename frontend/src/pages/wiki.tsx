import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const wikiContent: { [key: string]: { title: string; content: string } } = {
  animal: {
    title: '동물',
    content: `
      <h2 class="text-2xl font-bold mb-4">동물</h2>
      <p class="mb-2">동물은 생물 분류 체계에서 동물계(Animalia)에 속하는 다세포 진핵생물입니다. 일반적으로 이동 능력이 있고, 다른 생물을 섭취하여 에너지를 얻는 종속영양 생물입니다.</p>
      <p class="mb-2">다양한 종류의 동물이 지구상에 존재하며, 서식지, 식성, 생활 방식 등에 따라 매우 다양한 형태로 진화했습니다. 포유류, 조류, 파충류, 양서류, 어류, 곤충류 등이 대표적인 동물 분류군입니다.</p>
      <h3 class="text-xl font-semibold mt-6 mb-3">주요 특징</h3>
      <ul class="list-disc list-inside">
        <li>대부분 이동 능력을 가집니다.</li>
        <li>종속영양 생물로, 스스로 양분을 만들지 못하고 외부에서 섭취합니다.</li>
        <li>다세포 생물이며, 복잡한 조직과 기관을 가집니다.</li>
        <li>대부분 유성 생식을 합니다.</li>
      </ul>
      <h3 class="text-xl font-semibold mt-6 mb-3">동물의 예시</h3>
      <p>사자, 호랑이, 코끼리, 고래, 독수리, 뱀, 개구리, 참치, 나비 등</p>
    `,
  },
  weather: {
    title: '날씨',
    content: `
      <h2 class="text-2xl font-bold mb-4">날씨</h2>
      <p class="mb-2">날씨는 특정 시간과 장소에서의 대기 상태를 의미합니다. 기온, 습도, 강수량, 바람, 기압, 구름의 양 등 다양한 요소에 의해 결정됩니다.</p>
      <p class="mb-2">날씨는 지구의 기후 시스템의 일부이며, 단기적인 대기 현상을 나타냅니다. 반면 기후는 특정 지역에서 장기간에 걸쳐 나타나는 평균적인 날씨 패턴을 의미합니다.</p>
      <h3 class="text-xl font-semibold mt-6 mb-3">날씨의 요소</h3>
      <ul class="list-disc list-inside">
        <li>기온: 대기의 따뜻하거나 차가운 정도</li>
        <li>습도: 대기 중 수증기의 양</li>
        <li>강수량: 비, 눈, 우박 등 하늘에서 떨어지는 물의 양</li>
        <li>바람: 공기의 움직임</li>
        <li>기압: 대기가 지표면에 가하는 압력</li>
      </ul>
      <h3 class="text-xl font-semibold mt-6 mb-3">날씨 현상</h3>
      <p>맑음, 흐림, 비, 눈, 안개, 천둥번개, 태풍, 폭설 등</p>
    `,
  },
  naturalDisaster: {
    title: '자연재해',
    content: `
      <h2 class="text-2xl font-bold mb-4">자연재해</h2>
      <p class="mb-2">자연재해는 자연 현상으로 인해 발생하는 인명 및 재산 피해를 초래하는 재난을 의미합니다. 이는 인간의 활동과는 무관하게 자연적으로 발생합니다.</p>
      <p class="mb-2">지진, 쓰나미, 화산 폭발과 같은 지질학적 재해, 태풍, 홍수, 가뭄, 폭염, 한파와 같은 기상학적 재해 등 다양한 형태가 있습니다.</p>
      <h3 class="text-xl font-semibold mt-6 mb-3">주요 자연재해</h3>
      <ul class="list-disc list-inside">
        <li>지진: 지구 내부의 에너지 방출로 인한 지반의 흔들림</li>
        <li>쓰나미: 해저 지진이나 화산 활동으로 발생하는 거대한 파도</li>
        <li>화산 폭발: 마그마가 지표면으로 분출하는 현상</li>
        <li>태풍/허리케인/사이클론: 열대 해상에서 발생하는 강력한 저기압성 폭풍</li>
        <li>홍수: 강이나 하천의 물이 범람하여 육지를 덮는 현상</li>
        <li>가뭄: 오랜 기간 동안 강수량이 부족하여 물 부족 현상이 발생하는 것</li>
        <li>산불: 산림에서 발생하는 대규모 화재</li>
      </ul>
      <h3 class="text-xl font-semibold mt-6 mb-3">자연재해 대비</h3>
      <p>자연재해는 예측이 어렵고 큰 피해를 줄 수 있으므로, 사전 대비와 신속한 대응이 중요합니다. 비상 물품 준비, 대피 계획 수립, 재난 방송 청취 등이 필요합니다.</p>
    `,
  },
  accident: {
    title: '사건사고',
    content: `
      <h2 class="text-2xl font-bold mb-4">사건사고</h2>
      <p class="mb-2">사건사고는 예상치 못하게 발생하여 인명이나 재산에 피해를 주거나 사회적 혼란을 야기하는 일련의 상황을 총칭합니다. 이는 자연재해와 달리 주로 인간의 활동이나 시스템의 오류로 인해 발생합니다.</p>
      <p class="mb-2">교통사고, 산업재해, 화재, 범죄, 붕괴 사고 등 다양한 유형이 있으며, 발생 원인과 규모에 따라 사회에 미치는 영향이 크게 달라집니다.</p>
      <h3 class="text-xl font-semibold mt-6 mb-3">주요 사건사고 유형</h3>
      <ul class="list-disc list-inside">
        <li>교통사고: 차량, 선박, 항공기 등 교통수단 운행 중 발생하는 사고</li>
        <li>산업재해: 작업장에서 발생하는 사고로, 근로자의 부상이나 사망을 초래</li>
        <li>화재: 불이 발생하여 건물이나 재산을 태우는 사고</li>
        <li>범죄: 법률을 위반하는 행위로, 절도, 폭력, 사기 등</li>
        <li>붕괴 사고: 건물, 교량 등 구조물이 무너지는 사고</li>
        <li>환경 오염 사고: 유해 물질 유출 등으로 환경에 피해를 주는 사고</li>
      </ul>
      <h3 class="text-xl font-semibold mt-6 mb-3">사건사고 예방 및 대응</h3>
      <p>사건사고는 예방이 가장 중요하며, 안전 수칙 준수, 정기적인 점검, 비상 훈련 등이 필요합니다. 사고 발생 시에는 신속한 신고와 초기 대응이 피해를 최소화하는 데 결정적인 역할을 합니다.</p>
    `,
  },
};

const WikiPage: React.FC = () => {
  const router = useRouter();
  const { tab } = router.query;
  const [activeTab, setActiveTab] = useState<string>(
    (tab as string) || 'animal'
  );

  useEffect(() => {
    if (router.isReady) {
      const { tab } = router.query;
      if (tab && typeof tab === 'string' && wikiContent[tab]) {
        setActiveTab(tab);
      } else {
        setActiveTab('animal'); // Default to 'animal' if tab is not valid or not present
      }
    }
  }, [router.isReady, router.query.tab]);

  const handleTabClick = (key: string) => {
    setActiveTab(key);
    router.push(`/wiki?tab=${key}`, undefined, { shallow: true });
  };

  const currentContent = wikiContent[activeTab] || wikiContent.animal;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 text-gray-800">
        위키
      </h1>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
        {Object.keys(wikiContent).map((key) => (
          <button
            key={key}
            onClick={() => handleTabClick(key)}
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-300
              ${
                activeTab === key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            {wikiContent[key].title}
          </button>
        ))}
      </div>

      <div className="bg-white shadow-xl rounded-lg p-6 sm:p-8 lg:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 border-b pb-4">
          {currentContent.title}
        </h2>
        <div
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: currentContent.content }}
        />
      </div>
    </div>
  );
};

export default WikiPage;
