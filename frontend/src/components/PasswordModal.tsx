import { useState } from 'react';

interface PasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (password: string) => void;
    title: string;
    description: string;
    errorMessage?: string;
}

const PasswordModal = ({ isOpen, onClose, onConfirm, title, description, errorMessage }: PasswordModalProps) => {
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(password);
        setPassword('');
    };

    const handleClose = () => {
        onClose();
        setPassword('');
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
                <h3 className="text-xl font-bold mb-4 text-gray-800">{title}</h3>
                <p className="text-gray-600 mb-6">{description}</p>
                <input
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleClose}
                        className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition cursor-pointer"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PasswordModal;
