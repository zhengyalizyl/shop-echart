import {BrowserRouter,Routes,Route}  from 'react-router-dom'
import SellerPage from "./pages/SellerPage";
import TrendPage from './pages/TrendPage';

function App() {
  return (
   <BrowserRouter>
     <Routes>
       <Route path='/' element={<TrendPage/>}> </Route>
       <Route path='/seller' element={<SellerPage/>}> </Route>
       <Route path='/trend' element={<TrendPage/>}> </Route>
     </Routes>
   </BrowserRouter>
  );
}

export default App;
