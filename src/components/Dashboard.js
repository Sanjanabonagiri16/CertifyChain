import React from 'react';

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-gray text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-gray">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Certificates"
          value="1,234"
          icon="📜"
          color="bg-blue-primary/10 text-blue-primary"
        />
        <StatCard
          title="Certificates Issued"
          value="256"
          icon="✨"
          color="bg-teal-primary/10 text-teal-primary"
        />
        <StatCard
          title="Verifications"
          value="789"
          icon="✓"
          color="bg-amber-accent/10 text-amber-accent"
        />
        <StatCard
          title="Active Users"
          value="567"
          icon="👥"
          color="bg-cyan-accent/10 text-cyan-accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-gray mb-4">Recent Certificates</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Certificate #{item}</p>
                  <p className="text-sm text-slate-gray">Issued to: John Doe</p>
                </div>
                <span className="text-teal-primary">2 days ago</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-gray mb-4">Recent Verifications</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">Verification #{item}</p>
                  <p className="text-sm text-slate-gray">Certificate ID: #123{item}</p>
                </div>
                <span className="text-amber-accent">1 hour ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 