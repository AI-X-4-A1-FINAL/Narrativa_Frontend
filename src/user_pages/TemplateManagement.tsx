import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { Search } from 'lucide-react';

interface TemplateDTO {
  id?: number;
  genre: string;
  type: string;
  content: string;
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

const TemplatePage: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateDTO[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDTO | null>(null);
  const [formData, setFormData] = useState<Omit<TemplateDTO, 'id'>>({
    genre: '',
    type: '',
    content: '',
  });
  const [searchGenre, setSearchGenre] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetForm = () => {
    setSelectedTemplate(null);
    setFormData({
      genre: '',
      type: '',
      content: '',
    });
  };
  console.log("api : ",  process.env.REACT_APP_API_KEY);

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleNewTemplateClick = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await axios.get<TemplateDTO[]>('/api/templates', {
        headers: {
          'X-API-Key': process.env.REACT_APP_API_KEY,
        },
      });
     
      setTemplates(response.data);
    } catch (err) {
      setError('템플릿 목록을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchGenre.trim()) {
      try {
        setLoading(true);
        const response = await axios.get<TemplateDTO[]>(`/api/templates?genre=${searchGenre}`, {
          headers: {
            'X-API-Key': process.env.REACT_APP_API_KEY,
          },
        });
        setTemplates(response.data);
      } catch (err) {
        setError('템플릿 검색에 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      fetchTemplates();
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
      if (selectedTemplate) {
        await axios.put(`/api/templates/${selectedTemplate.id}`, formData, {
          headers: {
            'X-API-Key': process.env.REACT_APP_API_KEY,
          },
        });
      } else {
        await axios.post('/api/templates', formData, {
          headers: {
            'X-API-Key': process.env.REACT_APP_API_KEY,
          },
        });
      }
      setFormData({ genre: '', type: '', content: '' });
      setSelectedTemplate(null);
      fetchTemplates();
      setIsModalOpen(false);
    } catch (err) {
      setError('템플릿 등록/수정에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (template: TemplateDTO) => {
    setSelectedTemplate(template);
    setFormData({
      genre: template.genre,
      type: template.type,
      content: template.content,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">템플릿 관리</h1>
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
            onClick={handleNewTemplateClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors mb-6"
          >
            새 템플릿 등록
          </button>

          {/* 템플릿 목록 */}
          <div className="space-y-4">
            {templates.length === 0 ? (
              <div className="text-center text-gray-500">등록된 템플릿이 없습니다.</div>
            ) : (
              templates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 border rounded-md shadow-sm bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
                  onClick={() => handleSelect(template)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">{template.type}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(template.createdAt || '').toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">장르: {template.genre}</p>
                  <p className="mt-2 text-gray-700">
                    {template.content.length > 100
                      ? `${template.content.slice(0, 100)}...`
                      : template.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 모달 */}
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          <h2 className="text-xl font-bold mb-4">
            {selectedTemplate ? '템플릿 수정' : '새 템플릿 등록'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                placeholder="장르"
                className="w-full border px-4 py-2 rounded-md text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="타입"
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
                {selectedTemplate ? '수정' : '등록'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default TemplatePage;
