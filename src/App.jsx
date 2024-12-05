import {Route, Routes } from "react-router-dom"
import LifePage from "./pages/LifePage"
import OverviewPage from "./pages/OverviewPage"
import Sidebar from "./components/Sidebar"
import ImageUploadPage from "./pages/ImageUploadPage"


function App() {

  return (

 <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">

{/*bg*/}
<div className="fixed inset-0 z-0">

<div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900 opacity-80"/>
<div className="absolute inset-0 backdrop-blur-sm"/>

</div>
<Sidebar/>
<Routes>
  <Route path="/" element={<OverviewPage/>}/>
  <Route path="/products" element={<LifePage/>}/>
  <Route path="/image" element={<ImageUploadPage/>}/>
 
</Routes>

 </div>
  
   
)

}

export default App
