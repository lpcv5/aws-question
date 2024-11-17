// pages/QuizList.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

// 模拟题库数据
const quizBanks = [
  {
    id: 1,
    title: "JavaScript基础",
    description: "JavaScript语言基础知识练习题",
    totalQuestions: 50,
    difficulty: "初级",
    category: "前端开发",
  },
  {
    id: 2,
    title: "React进阶",
    description: "React框架进阶知识测试",
    totalQuestions: 40,
    difficulty: "中级",
    category: "前端开发",
  },
  {
    id: 3,
    title: "算法基础",
    description: "基础算法与数据结构练习",
    totalQuestions: 30,
    difficulty: "中级",
    category: "计算机基础",
  },
];

function QuizList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 过滤题库
  const filteredQuizBanks = quizBanks.filter((quiz) => {
    const matchesSearch = quiz.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || quiz.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 获取所有unique的分类
  const categories = [
    "all",
    ...new Set(quizBanks.map((quiz) => quiz.category)),
  ];

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="搜索题库..."
          className="p-2 border rounded mr-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "所有分类" : category}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizBanks.map((quiz) => (
          <Link
            key={quiz.id}
            to={`/quiz/${quiz.id}`}
            className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{quiz.title}</h2>
              <p className="text-gray-600 mb-4">{quiz.description}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>题目数量: {quiz.totalQuestions}</span>
                <span>难度: {quiz.difficulty}</span>
              </div>
              <div className="mt-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm">
                  {quiz.category}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default QuizList;
