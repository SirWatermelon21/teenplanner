import TimelinePlanningMode from '@/components/TimelinePlanningMode';


export const metadata = {
  title: "Trip Planner",
  description: "A collaborative trip planning application",
};

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-black">
      <div className="w-full h-full">
        <TimelinePlanningMode />
      </div>
    </main>
  );
}
