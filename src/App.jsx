import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/Layout';
import QuizList from './pages/QuizList';
import QuizDetail from './pages/QuizDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<QuizList />} />
          <Route path="quiz/:id" element={<QuizDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
