import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { PostPage } from './pages/PostPage';
import { CommunityPage } from './pages/CommunityPage';
import { ProfilePage } from './pages/ProfilePage';
import { CreatePostPage } from './pages/CreatePostPage';
import { CreateCommunityPage } from './pages/CreateCommunityPage';
import { ModDashboardPage } from './pages/ModDashboardPage';
import { ModRoute } from './components/ModRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { GuidelinesPage } from './pages/GuidelinesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:postId" element={<PostPage />} />
        <Route path="/community/:communityId" element={<CommunityPage />} />
        <Route path="/u/:username" element={<ProfilePage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/create-community" element={<CreateCommunityPage />} />
        <Route path="/mod/dashboard" element={<ModRoute><ModDashboardPage /></ModRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/guidelines" element={<GuidelinesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
