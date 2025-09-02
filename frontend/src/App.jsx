// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// // import Catalog from "./pages/Catalog";
// import Popular from "./pages/Popular";
// import FormRecommendation from "./pages/FormRecommendation";
// import MovieDetails from "./pages/MovieDetails";
// import KeywordSearch from "./components/KeywordSearch";
// import Watchlist from "./pages/Watchlist";
// import LikedMovies from "./pages/LikedMovies";
// import DislikedMovies from "./pages/DislikedMovies";
// import Recommendations from "./pages/Recommendations";
// import Login from "./pages/Login";

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <div className="p-4 bg-gray-100 min-h-screen">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           {/* <Route path="/catalog" element={<Catalog />} /> */}
//           <Route path="/popular" element={<Popular />} />
//           <Route path="/form" element={<FormRecommendation />} />
//            <Route path="/movie/:id" element={<MovieDetails />} />
//            <Route path="/keyword-search" element={<KeywordSearch />} />
//            <Route path="/watchlist" element={<Watchlist />} />
//            <Route path="/liked" element={<LikedMovies />} />
//           <Route path="/disliked" element={<DislikedMovies />} />
//           <Route path="/recommendations" element={<Recommendations />} />
//           <Route path="/login" element={<Login />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Popular from "./pages/Popular";
import FormRecommendation from "./pages/FormRecommendation";
import MovieDetails from "./pages/MovieDetails";
import KeywordSearch from "./components/KeywordSearch";
import Watchlist from "./pages/Watchlist";
import LikedMovies from "./pages/LikedMovies";
import DislikedMovies from "./pages/DislikedMovies";
import Recommendations from "./pages/Recommendations";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="p-4 bg-gray-100 min-h-screen">
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />

            {/* Private routes */}
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/popular" element={<PrivateRoute><Popular /></PrivateRoute>} />
            <Route path="/form" element={<PrivateRoute><FormRecommendation /></PrivateRoute>} />
            <Route path="/movie/:id" element={<PrivateRoute><MovieDetails /></PrivateRoute>} />
            <Route path="/keyword-search" element={<PrivateRoute><KeywordSearch /></PrivateRoute>} />
            <Route path="/watchlist" element={<PrivateRoute><Watchlist /></PrivateRoute>} />
            <Route path="/liked" element={<PrivateRoute><LikedMovies /></PrivateRoute>} />
            <Route path="/disliked" element={<PrivateRoute><DislikedMovies /></PrivateRoute>} />
            <Route path="/recommendations" element={<PrivateRoute><Recommendations /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
