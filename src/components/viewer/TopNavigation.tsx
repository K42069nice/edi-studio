const tabs = [
  "Viewer",
  "Compare",
  "Validate",
  "Convert",
  "AI Chat",
];

export default function TopNavigation() {
  return (
    <nav className="border-b border-slate-800 bg-slate-950 px-8 py-4">
      <div className="flex items-center gap-8">

        <h1 className="text-xl font-bold text-white">
          EDI Studio
        </h1>

        <div className="flex gap-6">

          {tabs.map((tab) => (

            <button
              key={tab}
              className="
                text-slate-400
                hover:text-white
                transition
              "
            >
              {tab}
            </button>

          ))}

        </div>

      </div>
    </nav>
  );
}