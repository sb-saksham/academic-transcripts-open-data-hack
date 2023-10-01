import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./components/UI/Dasboard";
import CompanyPage from "./components/CompanyPage";
import IndividualRequestsPage from "./components/IndividualPage";
import UploadTranscriptsPage from "./components/UploadTranscripts";
import InstitutionPage from "./components/InstitutionPage";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard/>}>
            {/* <Route path="" element={<HomePage />} /> */}
            <Route path="company/" element={<CompanyPage />} />
            <Route path="institution/" element={<InstitutionPage />} />
            <Route path="test/" element={<UploadTranscriptsPage />} />
            <Route path="individual/" element={<IndividualRequestsPage/>}/>
          </Route>
          </Routes>
    </BrowserRouter>
  );
}

export default App;
