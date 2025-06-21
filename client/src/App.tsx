import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import NumberSystems from "@/pages/number-systems";
import IPAddressing from "@/pages/ip-addressing";
import Subnetting from "@/pages/subnetting";
import LogicGates from "@/pages/logic-gates";
import BasicProgramming from "@/pages/basic-programming";
import BinaryRaceGame from "@/pages/binary-race-game";
import NetworkBuilderGame from "@/pages/network-builder-game";
import LogicPuzzleGame from "@/pages/logic-puzzle-game";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/number-systems" component={NumberSystems} />
      <Route path="/ip-addressing" component={IPAddressing} />
      <Route path="/subnetting" component={Subnetting} />
      <Route path="/logic-gates" component={LogicGates} />
      <Route path="/basic-programming" component={BasicProgramming} />
      <Route path="/games/binary-race" component={BinaryRaceGame} />
      <Route path="/games/network-builder" component={NetworkBuilderGame} />
      <Route path="/games/logic-puzzle" component={LogicPuzzleGame} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
