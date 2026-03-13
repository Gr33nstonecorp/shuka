export default function AI() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">AI Assistant</h2>

      <input
        className="border p-2 mb-2 w-full"
        placeholder="Ask AI to buy or sell something..."
      />

      <button className="bg-black text-white px-4 py-2 rounded">
        Run AI
      </button>
    </div>
  );
}
