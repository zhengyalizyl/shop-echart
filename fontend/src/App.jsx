import {BrowserRouter,Routes,Route}  from 'react-router-dom'
import SellerPage from "./pages/SellerPage";
import TrendPage from './pages/TrendPage';
import MapPage from './pages/MapPage';

function App() {
  return (
   <BrowserRouter>
     <Routes>
       <Route path='/' element={<MapPage/>}> </Route>
       <Route path='/seller' element={<SellerPage/>}> </Route>
       <Route path='/trend' element={<TrendPage/>}> </Route>
       <Route path='/map' element={<MapPage/>}> </Route>
     </Routes>
   </BrowserRouter>
  );
}

export default App;
