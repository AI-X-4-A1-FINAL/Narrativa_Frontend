import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { Search } from 'lucide-react';

interface PromptDTO {
  id?: number;
  title: string;
  content: string;
  genre: string;
  createdAt?: string;
  updatedAt?: string;
}

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

const PromptPage: React.FC = () => {
  const [prompts, setPrompts] = useState<PromptDTO[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptDTO | null>(null);
  const [formData, setFormData] = useState<Omit<PromptDTO, 'id'>>({
    title: '',
    content: '',
    genre: '',
  });
  const [searchGenre, setSearchGenre] = useState('');
  const [expandedPromptId, setExpandedPromptId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetForm = () => {
    setSelectedPrompt(null);
    setFormData({
      title: '',
      content: '',
      genre: '',
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleNewPromptClick = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const response = await axios.get<PromptDTO[]>('/api/prompts', {
        headers: {
          'X-API-Key': process.env.REACT_APP_API_KEY,
        },
      });
      setPrompts(response.data);
    } catch (err) {
      setError('프롬프트 목록을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchGenre.trim()) {
      try {
        setLoading(true);
        const response = await axios.get<PromptDTO[]>(`/api/prompts/search?genre=${searchGenre}`, {
          headers: {
            'X-API-Key': process.env.REACT_APP_API_KEY,
          },
        });
        setPrompts(response.data);
      } catch (err) {
        setError('프롬프트 검색에 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      fetchPrompts();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (selectedPrompt) {
        await axios.put(`/api/prompts/${selectedPrompt.id}`, formData, {
          headers: {
            'X-API-Key': process.env.REACT_APP_API_KEY,
          },
        });
      } else {
        await axios.post('/api/prompts', formData, {
          headers: {
            'X-API-Key': process.env.REACT_APP_API_KEY,
          },
        });
      }
      setFormData({ title: '', content: '', genre: '' });
      setSelectedPrompt(null);
      fetchPrompts();
      setIsModalOpen(false);
    } catch (err) {
      setError('프롬프트 등록/수정에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (prompt: PromptDTO) => {
    setSelectedPrompt(prompt);
    setFormData({
      title: prompt.title,
      genre: prompt.genre,
      content: prompt.content,
    });
    setIsModalOpen(true);
  };


  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">프롬프트 관리</h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* 검색 */}
          <form onSubmit={handleSearch} className="mb-6 flex gap-4">
            <input
              type="text"
              value={searchGenre}
              onChange={(e) => setSearchGenre(e.target.value)}
              placeholder="장르로 검색"
              className="flex-1 border px-4 py-2 rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Search size={16} className="inline" />
              검색
            </button>
          </form>

          <button
            onClick={handleNewPromptClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors mb-6"
          >
            새 프롬프트 등록
          </button>

          {/* 프롬프트 목록 */}
          <div className="space-y-4">
            {prompts.length === 0 ? (
              <div className="text-center text-gray-500">등록된 프롬프트가 없습니다.</div>
            ) : (
              prompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="p-4 border rounded-md shadow-sm bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
                  onClick={() => handleSelect(prompt)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">{prompt.title}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(prompt.createdAt || '').toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">장르: {prompt.genre}</p>
                  <p className="mt-2 text-gray-700">
                    {expandedPromptId === prompt.id
                      ? prompt.content
                      : prompt.content.slice(0, 100) + (prompt.content.length > 100 ? '...' : '')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 모달 */}
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
            <h2 className="text-xl font-bold mb-4">{selectedPrompt ? '프롬프트 수정' : '새 프롬프트 등록'}</h2>
            <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="제목"
                className="w-full border px-4 py-2 rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                placeholder="장르"
                className="w-full border px-4 py-2 rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="내용"
                className="w-full border px-4 py-2 rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={8}
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {selectedPrompt ? '수정' : '등록'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default PromptPage;
