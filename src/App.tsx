import HeroSection from "./components/herosection";
import NavigationBar from "./components/navigation";

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-24 dark:bg-gray-900">
      <NavigationBar />
      <p className="text-gray-600 dark:text-gray-100 font-black text-2xl" >Enter the details on the left to get started and know about your business compliance requirements.</p>
      <HeroSection />
    </main>
  );
}
