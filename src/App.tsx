import { useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Practice from "./pages/Practice";
import Bank from "./pages/Bank";
import Stats from "./pages/Stats";
import { useRoute } from "./lib/router";

export default function App() {
  const route = useRoute();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [route.view, route.params.toString()]);

  return (
    <Layout view={route.view}>
      {route.view === "home" && <Home />}
      {route.view === "practice" && <Practice params={route.params} />}
      {route.view === "bank" && <Bank params={route.params} />}
      {route.view === "stats" && <Stats />}
    </Layout>
  );
}
