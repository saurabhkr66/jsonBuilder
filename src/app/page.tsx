import JsonSchemaBuilder from "./components/jsonbuilder";
export default function HomePage() {
  return (
    <div className="p-6 bg-emerald-700">
      <h1 className="text-2xl font-bold mb-4 text-center">JSON Schema Builder</h1>
      <JsonSchemaBuilder />
    </div>
  );
}
