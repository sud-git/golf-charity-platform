export default function DashboardHome() {
  return (
    <main className="container-main py-8">
      <h1 className="text-3xl font-bold text-dark mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card-lg">
          <p className="text-gray-600 text-sm">Subscription Status</p>
          <p className="text-2xl font-bold text-primary mt-2">Active ✓</p>
        </div>
        
        <div className="card-lg">
          <p className="text-gray-600 text-sm">Last Score</p>
          <p className="text-2xl font-bold text-dark mt-2">38</p>
        </div>
        
        <div className="card-lg">
          <p className="text-gray-600 text-sm">Total Won</p>
          <p className="text-2xl font-bold text-success mt-2">$0.00</p>
        </div>
        
        <div className="card-lg">
          <p className="text-gray-600 text-sm">Scores Entered</p>
          <p className="text-2xl font-bold text-dark mt-2">0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-lg">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="btn-primary w-full">📊 Add Score</button>
            <button className="btn-secondary w-full">🎯 View Draws</button>
            <button className="btn-secondary w-full">❤️ Change Charity</button>
          </div>
        </div>

        <div className="card-lg">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <p className="text-gray-500 text-sm">No activity yet. Start by adding your first score!</p>
        </div>
      </div>
    </main>
  );
}
