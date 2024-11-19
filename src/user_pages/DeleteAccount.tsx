import React from "react";

const DeleteAccount: React.FC = () => {
  const handleDelete = async () => {
    try {
      const response = await fetch("/api/delete-account", {
        method: "DELETE",
      });

      if (response.ok) {
        alert("탈퇴가 완료되었습니다. 😢");
      } else {
        alert("탈퇴 처리에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("탈퇴 요청 중 오류 발생:", error);
      alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <div className="mb-4 text-lg">탈퇴 하실거에요?🥹</div>
      <button
        onClick={handleDelete}
        className="mt-4 px-6 py-2 text-white bg-custom-purple rounded hover:bg-blue-100"
      >
        YES!!
      </button>
    </div>
  );
};

export default DeleteAccount;
