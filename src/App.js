import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./components/UI/Dasboard";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard/>} errorElement={<Error404Page/>}>
            <Route path="" element={<HomePage />} />
            <Route path="verify/">
              <Route path="register/" element={<RequireAuth authLink={"/auth"}><RegisterDomain /></RequireAuth>} />
              <Route path="get/" element={<RequireAuth authLink={"/auth"}><GetDomain/></RequireAuth>}/>
              <Route path="id/" element={<RequireAuth authLink={"/auth"}><SendIdImage /></RequireAuth>} />
              <Route path="wallet/" element={<RequireAuth authLink={"/auth"}><SendWAddrImage /></RequireAuth>} />
            </Route>
            <Route path="save/id/" element={<RequireAuth authLink={'/auth'}><SaveToDb /></RequireAuth>}/>
            <Route path='auth/' element={<LogInSignUp />} />
            <Route path="start/registration/" element={<RequireAuth authLink="/auth"><StartRegistration/></RequireAuth>}/>
            <Route path='activate/email/:verifyKey' element={<VerifyUserEmail />}/>
          </Route>
          </Routes>
    </BrowserRouter>
  );
}

export default App;
