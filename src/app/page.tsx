import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <NavBar />
      <h1 className="text-3xl font-bold text-black">
        Welcome to E-Commerce Apps
      </h1>
    </div>
  );
}
