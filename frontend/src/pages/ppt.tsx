import Markdown from '@/components/Markdown'
import React from 'react'

const aboutContent = `발표 자료는 아래의 링크에서 확인하실 수 있습니다.

[https://drive.google.com/drive/folders/1ExoPWQCmyLDuifEjmnVPMQIFt4LNISVb](https://drive.google.com/drive/folders/1ExoPWQCmyLDuifEjmnVPMQIFt4LNISVb)
`

const AboutPage: React.FC = () => {
    return (
        <>
            <title>조선인사이드 - 발표 자료</title>
            <div className='bg-gray-100 p-1 min-h-screen'>
                <div className='bg-white p-10 rounded-lg shadow-lg w-full'>
                    <Markdown content={aboutContent} />
                </div>
            </div>
        </>
    )
}

export default AboutPage
