import React from "react";
import { useNavigate } from "react-router-dom";

const NotificationList: React.FC = () => {
  const notices = [
    { id: 1, title: "공지사항 1" },
    { id: 2, title: "공지사항 2" },
    { id: 3, title: "공지사항 3" },
    { id: 4, title: "공지사항 4" },
    { id: 5, title: "공지사항 5" },
  ];

  const navigate = useNavigate();

  // 공지사항 클릭 핸들러
  const handleNoticeClick = (id: number) => {
    navigate(`/notification/${id}`); // 공지사항 ID를 경로로 전달
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">공지사항</h1>
      <ul className="space-y-4">
        {notices.map((notice) => (
          <li
            key={notice.id}
            onClick={() => handleNoticeClick(notice.id)}
            className="p-4 bg-white rounded-lg shadow hover:bg-gray-200 transition cursor-pointer"
          >
            <h2 className="text-lg font-medium text-gray-800">
              {notice.title}
            </h2>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
