import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ConceptPage from "@/pages/concept";
import PythonLogo from "@/components/python-logo";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/concept/:id" component={ConceptPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-pink-100/70 text-foreground relative">
        <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
          <PythonLogo />
        </div>
        <div className="relative z-10">
          <Router />
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}
export default App;