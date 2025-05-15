import TimelinePlanningMode from '@/components/TimelinePlanningMode';


export const metadata = {
  title: "Trip Planner",
  description: "A collaborative trip planning application",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-black">
      <div className="w-full flex-1 p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Trip Planner
        </h1>
        
        <div className="w-full h-[calc(100vh-100px)]">
          <TimelinePlanningMode />
        </div>
      </div>
    </main>
  );
}
