// src/components/common/Loading.tsx
export const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-korea-blue border-t-korea-red"></div>
        <p className="mt-4 text-lg font-semibold text-gray-700">로딩 중...</p>
      </div>
    </div>
  );
};
