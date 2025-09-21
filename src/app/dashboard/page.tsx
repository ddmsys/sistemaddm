import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <h1>Seja bem-vindo ao Dashboard</h1>
      <p>Só visitantes autenticados podem ver essa página.</p>
    </ProtectedRoute>
  );
}
