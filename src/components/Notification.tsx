import React from "react";
import { useParams } from "react-router-dom";

const notices = [
  { id: 1, title: "공지사항 1", detail: "공지사항 1의 상세 내용입니다." },
  { id: 2, title: "공지사항 2", detail: "공지사항 2의 상세 내용입니다." },
  { id: 3, title: "공지사항 3", detail: "공지사항 3의 상세 내용입니다." },
  { id: 4, title: "공지사항 4", detail: "공지사항 4의 상세 내용입니다." },
  { id: 5, title: "공지사항 5", detail: "공지사항 5의 상세 내용입니다." },
];

const Notification: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const notice = notices.find((n) => n.id === Number(id));

  if (!notice) {
    return (
      <div className="max-w-lg mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">
          공지사항을 찾을 수 없습니다.
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto  p-6  ">
      <h1 className="text-2xl font-bold mb-4">{notice.title}</h1>
      <p className="text-gray-700">{notice.detail}</p>
    </div>
  );
};

export default Notification;
