import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import LandingPage from "./pages/LandingPage";
import OnboardingPage from "./pages/OnboardingPage";
import Create from "./pages/Create";
import CreateForm from "./pages/CreateForm";
import TextEditor from "./components/TextEditor";
import News from "./pages/News";
import Dashboard from "./pages/Dashboard";
import DocView from "./pages/DocView";
// import { R } from "@clerk/clerk-react/dist/useAuth-DT1ot2zi";
import Compare from "./pages/CompareDocs";
import Contracts from "./pages/Contracts";
import LegalAnalysis from "./pages/LegalAnalysis";
import TermsCondi from "./pages/TermsCondi";
import CustomDocument from "./pages/CustomDocument";
import Landing from "./pages/Landing";

const App = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Private Nested Routes */}
            <Route path="/" element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/docview" element={<DocView />} />
                <Route path="/create" element={<Create />} />
                <Route path="/create/:category" element={<CreateForm />} />
                <Route path="/create/:category/text-editor" element={<TextEditor />} />
                <Route path="/news" element={<News />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/contracts" element={<Contracts />} />
                <Route path="/testimony" element={<LegalAnalysis />} />
                <Route path="/terms" element={<TermsCondi />} />
                <Route path="/custom-documents" element={<CustomDocument />} />
                <Route path="*" element={<h1>Not Found</h1>} />
            </Route>
        </Routes>
    );
};

export default App;
