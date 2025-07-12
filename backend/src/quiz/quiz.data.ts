import * as crypto from 'crypto'

export interface QuizQuestion {
    id: number
    question: string
    options: string[]
    score: number
}

export interface Quiz {
    questions: QuizQuestion[]
    answers: string[]
}

// YOU, DON'T CHEAT..
export const quizDataRaw: Quiz = {
    questions: [
        {
            id: 1,
            question: '조선시대 호랑이가 창궐하였는데, 이러한 호랑이들에게 피해를 당하는 것을 무엇이라 할까요?',
            options: ['호환(虎患)', '노환(老患)', '동환(洞還)', '농환(弄丸)', '페환(弊患)'],
            score: 2,
        },
        {
            id: 2,
            question: '맹수, 특히 호랑이를 잡기 위한 전문 부대나 직업의 이름을 무엇이라 할까요?',
            options: [
                '척호갑사(捉虎甲士)',
                '호환갑사(虎患甲士)',
                '양계갑사(兩界甲士)',
                '보갑사(步甲士)',
                '별갑사(別甲士)',
            ],
            score: 2,
        },
        {
            id: 3,
            question:
                '일제의 영향 아래에 "해로운 짐승"을 제거한다는 명목으로 호랑이나 곰과 같은 맹수를 잡기 위한 사업을 시행했습니다. 그 사업의 정확한 명칭은 무엇인가요?',
            options: ['해수구제사업', '맹수박멸사업', '화폐정리사업', '해수박멸사업', '맹수구제사업'],
            score: 2,
        },
        {
            id: 4,
            question:
                '20XX년 정부는 165억원의 예산을 투입하여 반달가슴곰 복원 사업을 시작했고, 그 결과 어느정도 복원에 성공했는데, 이 사업이 시작된 연도는 언제인가요?',
            options: ['2004년', `2003년`, `2007년`, '2013년', '2016년'],
            score: 3,
        },
        {
            id: 5,
            question: '산업혁명 이후 기후 위기의 주범이자 지구의 평균 온도를 올린 물질 중 적절한 것은 무엇인가요?',
            options: ['이산화탄소', '아산화탄소', '프레온가스', '산화질소', '우라늄'],
            score: 1,
        },
        {
            id: 6,
            question:
                '조선시대 뿐만 아니라 17세기의 대표적인 기상 재해로 꼽히는 사례가 있었는데, 이를 조선에선 무엇이라 불렀나요?',
            options: ['경신대기근', '경선대기근', '경청대기근', '병자대기근', '병술대기근'],
            score: 2,
        },
        {
            id: 7,
            question: '인류 역사에서 가장 큰 사건이자 지구 온난화의 원인이 된 사건은 무엇인가요?',
            options: ['산업혁명', '1차 세계대전', '2차 세계대전', '냉전', '농업혁명'],
            score: 1,
        },
        {
            id: 8,
            question: '조선시대에 흔하게 발생했던 자연재해로 적절하게 묶인 것은 무엇인가요?',
            options: ['가뭄과 홍수', '가뭄과 화산', '홍수와 지진', '산사태와 홍수', '해일과 가뭄'],
            score: 1,
        },
        {
            id: 9,
            question: '조선시대에 가뭄이 심하게 발생하면 제사를 지내는데, 이를 무엇이라 하나요?',
            options: ['기우제', '가우제', '가우스', '기우사', '기무사'],
            score: 1,
        },
        {
            id: 10,
            question:
                '조선시대에 홍수가 심하게 발생하면 OOO의 문을 열어 양의 기운으로 홍수를 막는 전통이 있었는데, OOO에 들어갈 말은 무엇인가요?',
            options: ['숭례문', '경복궁', '창덕궁', '덕수궁', '창경궁'],
            score: 2,
        },
        {
            id: 11,
            question: '조선왕조실록에 처음으로 기록된 호랑이의 등장은 어느 왕의 기록인가요?',
            options: ['태조', '태종', '세종', '성종', '영조'],
            score: 1,
        },
        {
            id: 12,
            question:
                '조선시대에 추운 겨울을 이겨내기 위해 겨울이 오기 전 음식을 저장하곤 했는데, 이의 대표적인 음식은 무엇인가요?',
            options: ['김치', '스시', '피자', '타코', '카레'],
            score: 0.5,
        },
        {
            id: 13,
            question: '추석(한가위)는 어느 계절에 해당하는 명절인가요?',
            options: ['가을', '봄', '여름', '겨울'],
            score: 0.5,
        },
        {
            id: 14,
            question: '신윤복이 그린 그림 중 봄과 여름 사이를 주제로 한 대표적인 그림은 무엇인가요?',
            options: ['단오풍정', '여속도첩', '혜원전신첩', '풍속화첩', '춘하추동'],
            score: 3,
        },
        {
            id: 15,
            question: '(마지막 보너스) 조장의 이름은 무엇인가요?',
            options: ['김준영', '김준형', '김문영', '김문수', '김준수'],
            score: 5,
        },
    ],
    answers: [
        '호환(虎患)',
        '척호갑사(捉虎甲士)',
        '해수구제사업',
        '2004년',
        '이산화탄소',
        '경신대기근',
        '산업혁명',
        '가뭄과 홍수',
        '기우제',
        '숭례문',
        '태조',
        '김치',
        '가을',
        '단오풍정',
        '김준영',
    ],
}

const KEY = 'DONT_CHEAT_BRO_______UMJUNSIK___'
const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(KEY), Buffer.from(KEY.slice(0, 16)))

const encryptedData = cipher.update(JSON.stringify(quizDataRaw), 'utf8', 'hex') + cipher.final('hex')

export const quizData = encryptedData
