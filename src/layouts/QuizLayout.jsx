
export function QuizLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden relative">
        {children}
      </div>
    </div>
  );
}
