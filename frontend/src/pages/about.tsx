import React from 'react'

const AboutPage: React.FC = () => {
    return (
        <div className='bg-gray-100 p-5 min-h-screen'>
            <div className='bg-white p-10 rounded-lg shadow-lg w-full'>
                <h1 className='text-4xl font-bold mb-3'>프로젝트 소개</h1>
                <div className='text-lg text-gray-700'>
                    <br />
                    세명컴퓨터고등학교 수업 유연화 주간 프로젝트의 일환으로, 조선인사이드라는 이름의 익명 게시판을
                    개발하였습니다.
                    <br />
                    프로젝트는 크게 프론트엔드와 백엔드, 그리고 DevOps(AWS) 파트로 나뉘어 진행되었습니다.
                    <br />
                    <br />
                    <h2 className='text-2xl font-semibold mt-5 mb-3'>프론트엔드</h2>
                    <p>
                        프론트엔드는 React와 Next.js, 그리고 타입스크립트를 사용하여 개발하였으며, Tailwind CSS로
                        스타일링을 적용하였습니다. 프론트엔드 또한 후술할 AWS에 배포되어있습니다.
                    </p>
                    <br />
                    <h2 className='text-2xl font-semibold mt-5 mb-3'>백엔드</h2>
                    <p>
                        백엔드는 NestJS를 사용하여 간단하게 개발하였고, 마찬가지로 TypeScript를 사용하였습니다.
                        데이터베이스의 경우 AWS에서 제공하는 NoSQL 서버리스 데이터베이스인 DynamoDB를 사용하였고, 이는
                        AWS SDK를 사용하여 연동하였습니다.
                    </p>
                    <br />
                    <h2 className='text-2xl font-semibold mt-5 mb-3'>DevOps</h2>
                    <p>
                        <a
                            href='https://smc-secu.net/wp-content/uploads/kboard_attached/2/202507/686dc903d01689672402.png'
                            target='_blank'
                        >
                            <img
                                src='https://smc-secu.net/wp-content/uploads/kboard_attached/2/202507/686dc903d01689672402.png'
                                alt='AWS Architecture'
                                className='mx-auto mb-6 mt-6'
                            />
                        </a>
                        배포에선 AWS를 이용하였는데, 아키텍처는 위와 같습니다. (클릭 시 확대됩니다.)
                        <br />
                        <br />
                        모두 도커를 사용하여 컨테이너화하였고, AWS ECR에 이미지를 push한 후 AWS ECS에서 Fargate를 사용하여 서버리스로 컨테이너를 실행하도록 하였습니다.
                        <br />
                        <br />
                        그 외에 고가용성을 위해 ALB와 ECS Fargate 오토스케일링을 설정하였고, 프라이빗 서브넷으로 실행하고 퍼블릭 서브넷에 NAT 게이트웨이를 두어 인터넷과 연결되도록 하였습니다.
                        <br />
                        <br />
                        또한, AWS Route 53을 사용하여 도메인을 연결하였고, AWS Certificate Manager를 통해 SSL 인증서를 발급받아 HTTPS로 통신하도록 설정하였습니다.
                    </p>
                    <br />
                </div>
            </div>
        </div>
    )
}

export default AboutPage
