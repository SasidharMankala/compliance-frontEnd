import HeroSection from "./components/herosection";
import NavigationBar from "./components/navigation";

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-24 dark:bg-gray-900">
      <NavigationBar />
      <HeroSection />
    </main>
  );
}
