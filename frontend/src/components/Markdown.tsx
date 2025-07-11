import ReactMarkdown from 'react-markdown'

export default function Markdown({ content }: { content: string }) {
    return (
        <ReactMarkdown
            components={{
                h1: ({ children }) => <h1 className='text-3xl font-bold mb-5'>{children}</h1>,
                h2: ({ children }) => <h2 className='text-2xl font-bold mb-4'>{children}</h2>,
                h3: ({ children }) => <h3 className='text-xl font-semibold mt-6 mb-4'>{children}</h3>,
                h4: ({ children }) => <h4 className='text-lg font-semibold mt-5 mb-3'>{children}</h4>,
                h5: ({ children }) => <h5 className='text-md font-semibold mt-4 mb-2'>{children}</h5>,
                h6: ({ children }) => <h6 className='text-sm font-semibold mt-3 mb-1'>{children}</h6>,
                p: ({ children }) => <p className='mb-4'>{children}</p>,
                ul: ({ children }) => <ul className='list-disc list-inside mb-3'>{children}</ul>,
                ol: ({ children }) => <ol className='list-decimal list-inside mb-3'>{children}</ol>,
                li: ({ children }) => <li className='mb-3'>{children}</li>,
                strong: ({ children }) => <strong className='font-bold'>{children}</strong>,
                em: ({ children }) => <em className='italic'>{children}</em>,
                code: ({ children }) => <code className='bg-gray-100 p-1 rounded'>{children}</code>,
                pre: ({ children }) => <pre className='bg-gray-100 p-4 rounded mb-4'>{children}</pre>,
                hr: () => <hr className='border-gray-200 my-4' />,
                img: ({ src, alt }) => (
                    <img
                        src={src}
                        alt={alt}
                        className='max-w-full h-auto mb-5'
                        loading='lazy'
                    />
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    )
}
