export default function Sell() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Sell Item</h2>

      <input
        className="border p-2 mb-2 block"
        placeholder="Item title"
      />

      <input
        className="border p-2 mb-2 block"
        placeholder="Price"
      />

      <button className="bg-black text-white px-4 py-2 rounded">
        Post Listing
      </button>
    </div>
  );
}
